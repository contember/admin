import { BatchUpdatesOptions, EntityAccessor, EntityListAccessor } from '../accessors'
import { NormalizedQueryResponseData, ReceivedDataTree } from '../accessorTree'
import { BindingError } from '../BindingError'
import { Environment } from '../dao'
import { MarkerTreeRoot, PlaceholderGenerator } from '../markers'
import { QueryLanguage } from '../queryLanguage'
import {
	Alias,
	EntityRealmKey,
	PlaceholderName,
	SugaredQualifiedEntityList,
	SugaredQualifiedSingleEntity,
	SugaredUnconstrainedQualifiedEntityList,
	SugaredUnconstrainedQualifiedSingleEntity,
	TreeRootId,
} from '../treeParameters'
import { QueryResponseNormalizer } from './QueryResponseNormalizer'
import { Schema } from './schema'
import { EntityListState, EntityRealmState, EntityRealmStateStub, EntityState, RootStateNode, StateType } from './state'

export class TreeStore {
	// Indexed by IDs (including unpersisted dummy IDs)
	public readonly entityStore: Map<string, EntityState> = new Map()
	public readonly entityRealmStore: Map<EntityRealmKey, EntityRealmState | EntityRealmStateStub> = new Map()

	// This is tricky. We allow placeholder name duplicates, only the (TreeRootId, PlaceholderName) tuple is unique.
	// This is useful when the tree is extended to contain a tree with the same placeholder.
	public readonly markerTrees: Map<TreeRootId | undefined, MarkerTreeRoot> = new Map()
	public readonly subTreeStatesByRoot: Map<TreeRootId | undefined, Map<PlaceholderName, RootStateNode>> = new Map()

	private _schema: Schema | undefined
	public readonly persistedData: NormalizedQueryResponseData = new NormalizedQueryResponseData(new Map(), new Map())

	public constructor() {}

	public updatePersistedData(response: ReceivedDataTree) {
		QueryResponseNormalizer.mergeInResponse(this.persistedData, response)
	}

	public setSchema(newSchema: Schema) {
		// TODO
		if (this._schema === undefined) {
			this._schema = newSchema
		}
	}

	public get persistedEntityData() {
		return this.persistedData.persistedEntityDataStore
	}

	public get subTreePersistedData() {
		return this.persistedData.subTreeDataStore
	}

	public get schema(): Schema {
		if (this._schema === undefined) {
			throw new BindingError(`Fatal error: failed to load api schema.`)
		}
		return this._schema
	}

	public getSubTreeState(
		mode: 'entity',
		treeRootId: TreeRootId | undefined,
		aliasOrParameters: Alias | SugaredQualifiedSingleEntity | SugaredUnconstrainedQualifiedSingleEntity,
		environment: Environment,
	): EntityRealmState
	public getSubTreeState(
		mode: 'entityList',
		treeRootId: TreeRootId | undefined,
		aliasOrParameters: Alias | SugaredQualifiedEntityList | SugaredUnconstrainedQualifiedEntityList,
		environment: Environment,
	): EntityListState
	public getSubTreeState(
		mode: 'entity' | 'entityList',
		treeRootId: TreeRootId | undefined,
		aliasOrParameters:
			| Alias
			| SugaredQualifiedSingleEntity
			| SugaredUnconstrainedQualifiedSingleEntity
			| SugaredQualifiedEntityList
			| SugaredUnconstrainedQualifiedEntityList,
		environment: Environment,
	): RootStateNode {
		const markerRoot = this.markerTrees.get(treeRootId)
		const subTreeStates = this.subTreeStatesByRoot.get(treeRootId)

		if (subTreeStates === undefined || markerRoot === undefined) {
			if (treeRootId) {
				throw new BindingError(
					`Invalid tree id '${treeRootId}'. Make sure you use the one supplied by the correct extendTree call.`,
				)
			}
			throw new BindingError(`Failed to retrieve a sub tree.`)
		}

		let placeholderName: string

		if (typeof aliasOrParameters === 'string') {
			const placeholderByAlias = markerRoot.placeholdersByAliases.get(aliasOrParameters)

			if (placeholderByAlias === undefined) {
				throw new BindingError(`Undefined sub-tree alias '${aliasOrParameters}'.`)
			}
			placeholderName = placeholderByAlias
		} else if (mode === 'entityList') {
			placeholderName = PlaceholderGenerator.getEntityListSubTreePlaceholder(
				aliasOrParameters.isCreating
					? QueryLanguage.desugarUnconstrainedQualifiedEntityList(
							aliasOrParameters as SugaredUnconstrainedQualifiedEntityList,
							environment,
					  )
					: QueryLanguage.desugarQualifiedEntityList(aliasOrParameters as SugaredQualifiedEntityList, environment),
			)
		} else if (mode === 'entity') {
			placeholderName = PlaceholderGenerator.getEntitySubTreePlaceholder(
				aliasOrParameters.isCreating
					? QueryLanguage.desugarUnconstrainedQualifiedSingleEntity(
							aliasOrParameters as SugaredUnconstrainedQualifiedSingleEntity,
							environment,
					  )
					: QueryLanguage.desugarQualifiedSingleEntity(aliasOrParameters as SugaredQualifiedSingleEntity, environment),
			)
		} else {
			throw new BindingError()
		}
		const subTreeState = subTreeStates.get(placeholderName)

		if (subTreeState === undefined) {
			throw new BindingError(`Trying to retrieve a non-existent sub-tree '${placeholderName}'.`)
		}
		return subTreeState
	}

	public disposeOfRealm(realmToDisposeOf: EntityRealmState | EntityRealmStateStub) {
		this.entityRealmStore.delete(realmToDisposeOf.realmKey)
		realmToDisposeOf.entity.realms.delete(realmToDisposeOf.realmKey)

		if (realmToDisposeOf.type === StateType.EntityRealm) {
			realmToDisposeOf.blueprint.parent?.childrenWithPendingUpdates?.delete(realmToDisposeOf)

			for (const child of realmToDisposeOf.children.values()) {
				switch (child.type) {
					case StateType.Field:
						continue
					case StateType.EntityRealm:
					case StateType.EntityRealmStub: {
						this.disposeOfRealm(child)
						break
					}
					case StateType.EntityList: {
						for (const listChild of child.children.values()) {
							this.disposeOfRealm(listChild)
						}
					}
				}
			}
		}

		const entity = realmToDisposeOf.entity
		if (entity.realms.size === 0) {
			this.disposeOfEntity(entity)
		}
	}

	public disposeOfEntity(entity: EntityState) {
		for (const realm of entity.realms.values()) {
			this.disposeOfRealm(realm)
		}
		this.entityStore.delete(entity.id.value)
	}
}