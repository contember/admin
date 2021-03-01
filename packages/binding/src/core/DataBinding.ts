import { GraphQlClient, TreeFilter } from '@contember/client'
import * as React from 'react'
import {
	BatchUpdatesOptions,
	BindingOperations,
	ExtendTreeOptions,
	PersistErrorOptions,
	TreeRootAccessor,
} from '../accessors'
import {
	metadataToRequestError,
	MutationErrorType,
	MutationRequestResponse,
	PersistResultSuccessType,
	QueryRequestResponse,
	RequestError,
	SuccessfulPersistResult,
} from '../accessorTree'
import { Environment } from '../dao'
import { MarkerTreeRoot } from '../markers'
import { TreeRootId } from '../treeParameters'
import { assertNever, generateEnumerabilityPreventingEntropy } from '../utils'
import { AccessorErrorManager } from './AccessorErrorManager'
import { Config } from './Config'
import { DirtinessTracker } from './DirtinessTracker'
import { EventManager } from './EventManager'
import { createBatchUpdatesOptions } from './factories'
import { MarkerTreeGenerator } from './MarkerTreeGenerator'
import { MutationGenerator } from './MutationGenerator'
import { QueryGenerator } from './QueryGenerator'
import { Schema, SchemaLoader, SchemaValidator } from './schema'
import { StateIterator, StateType } from './state'
import { StateInitializer } from './StateInitializer'
import { TreeAugmenter } from './TreeAugmenter'
import { TreeFilterGenerator } from './TreeFilterGenerator'
import { TreeStore } from './TreeStore'

export class DataBinding {
	private static readonly schemaLoadCache: Map<string, Schema | Promise<Schema>> = new Map()

	private readonly accessorErrorManager: AccessorErrorManager
	private readonly batchUpdatesOptions: BatchUpdatesOptions
	private readonly bindingOperations: BindingOperations
	private readonly config: Config
	private readonly dirtinessTracker: DirtinessTracker
	private readonly eventManager: EventManager
	private readonly stateInitializer: StateInitializer
	private readonly treeAugmenter: TreeAugmenter
	private readonly treeStore: TreeStore

	// private treeRootListeners: {
	// 	eventListeners: {}
	// } = {
	// 	eventListeners: {},
	// }

	public constructor(
		private readonly client: GraphQlClient,
		private readonly environment: Environment,
		private readonly onUpdate: (newData: TreeRootAccessor) => void,
		private readonly onError: (error: RequestError) => void,
	) {
		this.config = new Config()
		this.treeStore = new TreeStore()
		this.batchUpdatesOptions = createBatchUpdatesOptions(environment, this.treeStore)
		this.dirtinessTracker = new DirtinessTracker()
		this.eventManager = new EventManager(
			this.batchUpdatesOptions,
			this.config,
			this.dirtinessTracker,
			this.resolvedOnUpdate,
			this.treeStore,
		)
		this.accessorErrorManager = new AccessorErrorManager(this.eventManager, this.treeStore)
		this.stateInitializer = new StateInitializer(
			this.accessorErrorManager,
			this.batchUpdatesOptions,
			this.config,
			this.eventManager,
			this.treeStore,
		)
		this.treeAugmenter = new TreeAugmenter(this.eventManager, this.stateInitializer, this.treeStore)

		// TODO move this elsewhere
		this.bindingOperations = Object.freeze<BindingOperations>({
			...this.batchUpdatesOptions,
			getTreeFilters: (): TreeFilter[] => {
				const generator = new TreeFilterGenerator(this.treeStore)
				return generator.generateTreeFilter()
			},
			batchDeferredUpdates: performUpdates => {
				this.eventManager.syncTransaction(() => performUpdates(this.bindingOperations))
			},
			extendTree: async (...args) => await this.extendTree(...args),
			persist: async ({ signal } = {}) => {
				if (!this.dirtinessTracker.hasChanges()) {
					return {
						type: PersistResultSuccessType.NothingToPersist,
					}
				}
				return await this.eventManager.persistOperation(async () => {
					for (let attemptNumber = 1; attemptNumber <= this.config.getValue('maxPersistAttempts'); attemptNumber++) {
						// TODO if the tree is in an inconsistent state, wait for lock releases

						this.eventManager.syncTransaction(() => {
							this.accessorErrorManager.clearErrors()
						})
						await this.eventManager.triggerOnBeforePersist()

						let shouldTryAgain = false
						const proposedBackOffs: number[] = []
						const persistErrorOptions: PersistErrorOptions = {
							...this.bindingOperations,
							tryAgain: options => {
								shouldTryAgain = true
								if (options?.proposedBackoff !== undefined && options.proposedBackoff > 0) {
									proposedBackOffs.push(options.proposedBackoff)
								}
							},
							attemptNumber,
						}

						if (this.accessorErrorManager.hasErrors()) {
							await this.eventManager.triggerOnPersistError(persistErrorOptions)
							if (shouldTryAgain) {
								continue // Trying again immediately
							}

							throw {
								type: MutationErrorType.InvalidInput,
							}
						}

						const generator = new MutationGenerator(this.treeStore)
						const mutation = generator.getPersistMutation()

						if (mutation === undefined) {
							this.dirtinessTracker.reset() // TODO This ideally shouldn't be necessary but given the current limitations, this makes for better UX.
							return {
								type: PersistResultSuccessType.NothingToPersist,
							}
						}

						const mutationResponse: MutationRequestResponse = await this.client.sendRequest(mutation, { signal })
						const mutationData = mutationResponse.data?.transaction ?? {}
						const aliases = Object.keys(mutationData)
						const allSubMutationsOk = aliases.every(item => mutationData[item].ok)

						if (allSubMutationsOk) {
							const persistedEntityIds = aliases.map(alias => mutationData[alias].node.id)
							const result: SuccessfulPersistResult = {
								type: PersistResultSuccessType.JustSuccess,
								persistedEntityIds,
							}

							this.eventManager.syncTransaction(() => {
								this.resetTreeAfterSuccessfulPersist()
								this.treeAugmenter.updatePersistedData(
									Object.fromEntries(
										Object.entries(mutationData).map(([placeholderName, subTreeResponse]) => [
											placeholderName,
											subTreeResponse.node,
										]),
									),
								)
								this.eventManager.triggerOnPersistSuccess({
									...this.bindingOperations,
									successType: result.type,
									unstable_persistedEntityIds: persistedEntityIds,
								})
							})
							return result
						} else {
							this.eventManager.syncTransaction(() => this.accessorErrorManager.replaceErrors(mutationData))
							await this.eventManager.triggerOnPersistError(persistErrorOptions)
							if (shouldTryAgain) {
								if (proposedBackOffs.length) {
									const geometricMean = Math.round(
										Math.pow(
											proposedBackOffs.reduce((a, b) => a * b, 1),
											1 / proposedBackOffs.length,
										),
									)
									await new Promise(resolve => setTimeout(resolve, geometricMean))
								}
								continue
							}
							throw {
								type: MutationErrorType.InvalidInput,
							}
						}
					}
					// Max attempts exceeded
					throw {
						type: MutationErrorType.GivenUp,
					}
				})
			},
		})
	}

	private resolvedOnUpdate = (isMutating: boolean) => {
		this.onUpdate(new TreeRootAccessor(this.dirtinessTracker.hasChanges(), isMutating, this.bindingOperations))
	}

	// This is currently useless but potentially future-compatible
	// private readonly addTreeRootEventListener: TreeRootAccessor.AddTreeRootEventListener = this.getAddEventListener(
	// 	this.treeRootListeners,
	// )

	public async extendTree(
		newFragment: React.ReactNode,
		{ signal, environment }: ExtendTreeOptions = {},
	): Promise<TreeRootId | undefined> {
		return await this.eventManager.asyncOperation(async () => {
			if (signal?.aborted) {
				return Promise.reject()
			}
			const newMarkerTree = new MarkerTreeGenerator(newFragment, environment ?? this.environment).generate()

			const schemaOrPromise = this.getOrLoadSchema()

			let newPersistedData: QueryRequestResponse | undefined

			if (schemaOrPromise instanceof Promise) {
				// We don't have a schema yet. We'll still optimistically fire the request so as to prevent a waterfall
				// in the most likely case that things will go fine and the query matches the schema.
				const newPersistedDataPromise = this.fetchPersistedData(newMarkerTree, signal)

				const schema = await schemaOrPromise

				this.treeStore.setSchema(schema)
				if (__DEV_MODE__) {
					SchemaValidator.assertTreeValid(schema, newMarkerTree)
				}
				newPersistedData = await newPersistedDataPromise
			} else {
				this.treeStore.setSchema(schemaOrPromise)
				if (__DEV_MODE__) {
					SchemaValidator.assertTreeValid(schemaOrPromise, newMarkerTree)
				}
				newPersistedData = await this.fetchPersistedData(newMarkerTree, signal)
			}

			if (signal?.aborted) {
				return Promise.reject()
			}

			// TODO this is an awful, awful hack.
			const newTreeRootId =
				this.treeStore.markerTrees.size === 0
					? undefined
					: `treeRoot-${generateEnumerabilityPreventingEntropy()}-${DataBinding.getNextTreeRootIdSeed()}`
			this.treeAugmenter.extendTree(newTreeRootId, newMarkerTree, newPersistedData?.data ?? {})

			return newTreeRootId
		})
	}

	private async fetchPersistedData(
		tree: MarkerTreeRoot,
		signal?: AbortSignal,
	): Promise<QueryRequestResponse | undefined> {
		const queryGenerator = new QueryGenerator(tree)
		const query = queryGenerator.getReadQuery()

		let queryResponse: QueryRequestResponse | undefined = undefined

		try {
			queryResponse =
				query === undefined
					? undefined
					: await this.client.sendRequest(query, {
							signal,
					  })
		} catch (metadata) {
			if (metadata.name === 'AbortError') {
				return
			}
			this.onError(metadataToRequestError(metadata as GraphQlClient.FailedRequestMetadata))
		}
		return queryResponse
	}

	private resetTreeAfterSuccessfulPersist() {
		this.eventManager.syncTransaction(() => {
			this.accessorErrorManager.clearErrors()
			this.dirtinessTracker.reset()

			for (const [, rootState] of StateIterator.eachRootState(this.treeStore)) {
				for (const state of StateIterator.depthFirstAllNodes(rootState)) {
					switch (state.type) {
						case StateType.Field: {
							if (state.hasUnpersistedChanges || state.touchLog?.size) {
								state.touchLog?.clear()
								state.hasUnpersistedChanges = false
								this.eventManager.registerJustUpdated(state, EventManager.NO_CHANGES_DIFFERENCE)
							}
							break
						}
						case StateType.EntityList:
							if (state.unpersistedChangesCount > 0 || state.plannedRemovals?.size) {
								state.unpersistedChangesCount = 0
								state.plannedRemovals?.clear()
								this.eventManager.registerJustUpdated(state, EventManager.NO_CHANGES_DIFFERENCE)
							}
							break
						case StateType.EntityRealm: {
							if (state.unpersistedChangesCount > 0 || state.plannedHasOneDeletions?.size) {
								state.unpersistedChangesCount = 0
								state.plannedHasOneDeletions?.clear()
								this.eventManager.registerJustUpdated(state, EventManager.NO_CHANGES_DIFFERENCE)
							}
							break
						}
						default:
							assertNever(state)
					}
				}
			}
		})
	}

	private getOrLoadSchema(): Schema | Promise<Schema> {
		const existing = DataBinding.schemaLoadCache.get(this.client.apiUrl)
		if (existing !== undefined) {
			return existing
		}

		const schemaPromise = SchemaLoader.loadSchema(this.client, this.config.getValue('maxSchemaLoadAttempts'))
		schemaPromise.then(schema => {
			DataBinding.schemaLoadCache.set(this.client.apiUrl, schema)
		})
		DataBinding.schemaLoadCache.set(this.client.apiUrl, schemaPromise)
		return schemaPromise
	}

	private static getNextTreeRootIdSeed = (() => {
		let seed = 0
		return () => seed++
	})()
}