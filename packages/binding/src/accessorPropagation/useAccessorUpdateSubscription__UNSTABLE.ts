import * as React from 'react'
import { EntityAccessor, EntityListAccessor, FieldAccessor } from '../accessors'
import { FieldValue } from '../treeParameters/primitives'

/**
 * It is VERY IMPORTANT for the parameter to be referentially stable!
 */
function useAccessorUpdateSubscription__UNSTABLE<
	Persisted extends FieldValue = FieldValue,
	Produced extends Persisted = Persisted
>(getFieldAccessor: () => FieldAccessor<Persisted, Produced>): FieldAccessor<Persisted, Produced>
function useAccessorUpdateSubscription__UNSTABLE(getEntityAccessor: () => EntityAccessor): EntityAccessor
function useAccessorUpdateSubscription__UNSTABLE(getAccessor: () => EntityListAccessor): EntityListAccessor
function useAccessorUpdateSubscription__UNSTABLE(
	getEntityListAccessor: () => EntityListAccessor | EntityAccessor,
): EntityListAccessor | EntityAccessor
function useAccessorUpdateSubscription__UNSTABLE<
	A extends FieldAccessor<Persisted, Produced> | EntityListAccessor | EntityAccessor,
	Persisted extends FieldValue = FieldValue,
	Produced extends Persisted = Persisted
>(getAccessor: () => A): A {
	// This is *HEAVILY* adopted from https://github.com/facebook/react/blob/master/packages/use-subscription/src/useSubscription.js
	const [state, setState] = React.useState<{
		accessor: A
		getAccessor: () => A
	}>(() => ({
		accessor: getAccessor(),
		getAccessor,
	}))

	let accessor = state.accessor

	if (state.getAccessor !== getAccessor) {
		setState({
			accessor: getAccessor(),
			getAccessor,
		})
	}

	const addEventListener: (
		eventType: 'update',
		handler: (newAccessor: FieldAccessor<Persisted, Produced> | EntityListAccessor | EntityAccessor) => void,
	) => () => void = accessor.addEventListener
	React.useEffect(() => {
		let isStillSubscribed = true

		const unsubscribe = addEventListener('update', newAccessor => {
			if (!isStillSubscribed) {
				return
			}

			setState(prevState => {
				if (prevState.getAccessor !== getAccessor || prevState.accessor === newAccessor) {
					return prevState
				}

				return {
					accessor: newAccessor as A,
					getAccessor,
				}
			})
		})

		return () => {
			isStillSubscribed = false
			unsubscribe()
		}
	}, [addEventListener, getAccessor])

	return accessor
}
export { useAccessorUpdateSubscription__UNSTABLE }