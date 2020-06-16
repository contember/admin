import { ErrorAccessor, FieldAccessor } from '../../accessors'
import { FieldMarker } from '../../markers'
import { FieldName, FieldValue, Scalar } from '../../treeParameters/primitives'
import { InternalStateType } from './InternalStateType'

export type OnFieldUpdate = (state: InternalFieldState) => void
export interface InternalFieldState {
	type: InternalStateType.Field
	accessor: FieldAccessor
	addEventListener: FieldAccessor.AddFieldEventListener
	errors: ErrorAccessor[]
	eventListeners: {
		[Type in FieldAccessor.FieldEventType]: Set<FieldAccessor.FieldEventListenerMap[Type]> | undefined
	}
	fieldMarker: FieldMarker
	//hasUnpersistedChanges: boolean
	hasPendingUpdate: boolean
	initialData: Scalar | undefined | FieldAccessor
	onFieldUpdate: OnFieldUpdate // To be called by this field to inform the parent entity
	persistedValue: FieldValue
	placeholderName: FieldName
	touchLog: Map<string, boolean> | undefined
	isTouchedBy: FieldAccessor.IsTouchedBy
	updateValue: FieldAccessor.UpdateValue
}
