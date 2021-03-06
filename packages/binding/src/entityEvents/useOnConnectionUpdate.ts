import type { EntityAccessor } from '../accessors'
import type { FieldName } from '../treeParameters'
import { useEntityEvent } from './useEntityEvent'

export const useOnConnectionUpdate = (
	fieldName: FieldName,
	listener: EntityAccessor.EntityEventListenerMap['connectionUpdate'],
) => {
	useEntityEvent('connectionUpdate', fieldName, listener)
}
