import { EntityAccessor, ErrorAccessor } from '../../accessors'
import { SingleEntityPersistedData } from '../../accessorTree'
import { Environment } from '../../dao'
import { EntityFieldMarkers } from '../../markers'
import { EntityCreationParameters, FieldName } from '../../treeParameters'
import { InternalStateNode } from './InternalStateNode'
import { InternalStateType } from './InternalStateType'

export type OnEntityUpdate = (state: InternalStateNode) => void
export type OnEntityFieldUpdate = (state: InternalStateNode) => void
export interface InternalEntityState {
	type: InternalStateType.SingleEntity
	eventListeners: {
		[Type in EntityAccessor.EntityEventType]: Set<EntityAccessor.EntityEventListenerMap[Type]> | undefined
	}
	environment: Environment
	batchUpdateDepth: number
	childrenWithPendingUpdates: Set<InternalStateNode> | undefined
	creationParameters: EntityCreationParameters
	errors: ErrorAccessor[]
	fields: Map<FieldName, InternalStateNode>
	fieldMarkers: EntityFieldMarkers
	getAccessor: () => EntityAccessor
	hasAtLeastOneBearingField: boolean
	hasPendingUpdate: boolean
	hasPendingParentNotification: boolean
	hasStaleAccessor: boolean
	id: string | EntityAccessor.UnpersistedEntityId
	isScheduledForDeletion: boolean
	onChildFieldUpdate: OnEntityFieldUpdate // To be called by the child to inform this entity
	persistedData: SingleEntityPersistedData | undefined
	plannedHasOneDeletions: Map<FieldName, InternalEntityState> | undefined

	// Entity realms address the fact that a single particular entity may appear several times throughout the tree in
	// completely different contexts. Even with different fields.
	realms: Set<OnEntityUpdate>
	typeName: string | undefined

	addEventListener: EntityAccessor.AddEntityEventListener
	batchUpdates: EntityAccessor.BatchUpdates
	connectEntityAtField: EntityAccessor.ConnectEntityAtField
	deleteEntity: EntityAccessor.DeleteEntity
	disconnectEntityAtField: EntityAccessor.DisconnectEntityAtField
}