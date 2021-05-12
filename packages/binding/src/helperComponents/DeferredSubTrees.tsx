import { ReactNode, useCallback, useEffect, useState } from 'react'
import { TreeRootIdProvider, useBindingOperations } from '../accessorPropagation'
import { useMutationState } from '../accessorTree'
import { Component } from '../coreComponents'
import { useEntityBeforePersist } from '../entityEvents'
import { EntityFieldMarkersContainer, EntityFieldsWithHoistablesMarker } from '../markers'
import { MarkerFactory } from '../queryLanguage'
import { TreeRootId } from '../treeParameters'

export interface DeferredSubTreesProps {
	fallback: ReactNode
	children: ReactNode
}

const enum LoadStateName {
	Initial = 1,
	Loading,
	Success,
}
type LoadState =
	| {
			name: LoadStateName.Initial
	  }
	| {
			name: LoadStateName.Loading
	  }
	| {
			name: LoadStateName.Success
			treeRootId: TreeRootId | undefined
	  }

export const DeferredSubTrees = Component<DeferredSubTreesProps>(
	props => {
		const { extendTree } = useBindingOperations()
		const isMutating = useMutationState()

		const [loadState, setLoadState] = useState<LoadState>({ name: LoadStateName.Initial })

		const [abortController] = useState(() => new AbortController())
		const signal = abortController.signal

		useEntityBeforePersist(
			useCallback(getAccessor => {
				// This is a hack. We're really just circumventing the change of ids after a creation so that nested
				// components don't error.
				if (getAccessor().existsOnServer) {
					return
				}
				setLoadState({ name: LoadStateName.Initial })
			}, []),
		)

		useEffect(() => {
			return () => {
				abortController.abort()
			}
		}, [abortController])

		useEffect(() => {
			if (isMutating || loadState.name !== LoadStateName.Initial || signal.aborted) {
				return
			}
			setLoadState({ name: LoadStateName.Loading })

			const newFragment = <OnlyKeepSubTrees>{props.children}</OnlyKeepSubTrees>

			extendTree(newFragment, { signal })
				.then(treeRootId => !signal.aborted && setLoadState({ name: LoadStateName.Success, treeRootId }))
				.catch(error => {
					if (signal.aborted) {
						return
					}
					throw error
				})
		}, [extendTree, isMutating, loadState.name, props.children, signal])

		switch (loadState.name) {
			case LoadStateName.Initial:
			case LoadStateName.Loading:
				return <>{props.fallback}</>
			case LoadStateName.Success:
				// This is tricky. The relations & fields within children will just render normally as if this
				// component didn't exist. The sub trees, however, will read the new treeRootId and draw their data
				// from the newly loaded batch provided by this component. That way the sub trees (and only the sub trees!)
				// effectively get lazy loaded.
				return <TreeRootIdProvider treeRootId={loadState.treeRootId}>{props.children}</TreeRootIdProvider>
		}
	},
	{
		staticRender: props => (
			<>
				{props.children}
				{props.fallback}
			</>
		),
		generateBranchMarker: (props, fields, environment) => {
			const fieldsWithHoistablesMarker = MarkerFactory.createEntityFieldsWithHoistablesMarker(fields, environment)

			// We want to get rid of the subTrees but leave whatever relations and fields are present.
			//
			// Mutating from here is fine since we've literally just created it and no other code could possibly possess
			// a reference to this.
			fieldsWithHoistablesMarker.subTrees?.clear()

			return fieldsWithHoistablesMarker
		},
	},
	'DeferredSubTree',
)

const OnlyKeepSubTrees = Component<{ children: ReactNode }>(
	() => null,
	{
		generateBranchMarker: (props, fields) => {
			// This is the complement of the equivalent method above: this time we're only keeping the sub trees.
			const emptyFields = MarkerFactory.createEntityFieldMarkersContainer(undefined)

			if (fields instanceof EntityFieldMarkersContainer) {
				return emptyFields
			}
			return new EntityFieldsWithHoistablesMarker(emptyFields, fields.subTrees, undefined)
		},
	},
	'OnlyKeepSubTrees',
)