import { EntityListAccessor, ErrorAccessor } from '../../accessors'
import { EntityFieldMarkers } from '../../markers'
import { EntityCreationParameters, EntityListPreferences, RemovalType } from '../../treeParameters'
import { InternalEntityState, OnEntityUpdate } from './InternalEntityState'
import { InternalStateType } from './InternalStateType'

export type OnEntityListUpdate = (state: InternalEntityListState) => void
export interface InternalEntityListState {
	type: InternalStateType.EntityList
	batchUpdateDepth: number
	childrenKeys: Set<string>
	childrenWithPendingUpdates: Set<InternalEntityState> | undefined
	creationParameters: EntityCreationParameters & EntityListPreferences
	errors: ErrorAccessor[]
	eventListeners: {
		[Type in EntityListAccessor.EntityListEventType]:
			| Set<EntityListAccessor.EntityListEventListenerMap[Type]>
			| undefined
	}
	fieldMarkers: EntityFieldMarkers
	getAccessor: () => EntityListAccessor
	hasPendingParentNotification: boolean
	hasPendingUpdate: boolean
	hasStaleAccessor: boolean
	persistedEntityIds: Set<string>
	plannedRemovals: Map<InternalEntityState, RemovalType> | undefined

	onChildEntityUpdate: OnEntityUpdate // To be called by the child entity to inform this entity list
	onEntityListUpdate: OnEntityListUpdate // To be called by this entity list to inform the parent entity

	addEventListener: EntityListAccessor.AddEntityListEventListener
	batchUpdates: EntityListAccessor.BatchUpdates
	connectEntity: EntityListAccessor.ConnectEntity
	createNewEntity: EntityListAccessor.CreateNewEntity
	disconnectEntity: EntityListAccessor.DisconnectEntity
	getChildEntityByKey: EntityListAccessor.GetChildEntityByKey
}
