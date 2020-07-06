import { assertNever } from '../utils'
import { FieldMarker } from './FieldMarker'
import { HasManyRelationMarker } from './HasManyRelationMarker'
import { HasOneRelationMarker } from './HasOneRelationMarker'
import { Marker } from './Marker'
import { SubTreeMarker } from './SubTreeMarker'

export type EntityFieldMarkers = Map<string, Marker>

export const hasAtLeastOneBearingField = (fields: EntityFieldMarkers): boolean => {
	for (const [, marker] of fields) {
		if (marker instanceof FieldMarker) {
			if (!marker.isNonbearing) {
				return true
			}
		} else if (marker instanceof HasOneRelationMarker || marker instanceof HasManyRelationMarker) {
			if (marker.hasAtLeastOneBearingField) {
				return true
			}
		} else if (marker instanceof SubTreeMarker) {
			// Exclude it from the decision as it will be hoisted.
		} else {
			assertNever(marker)
		}
	}
	return false
}