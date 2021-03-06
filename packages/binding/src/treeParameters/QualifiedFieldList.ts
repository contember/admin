import type { AnyField, SugarableAnyField } from './AnyField'
import type {
	EntityListParameters,
	SugarableEntityListParameters,
	UnsugarableEntityListParameters,
} from './EntityListParameters'
import type { HasOneRelation, SugarableHasOneRelation } from './HasOneRelation'
import type { LeafField, UnsugarableLeafField } from './LeafField'
import type {
	QualifiedEntityParameters,
	SugarableQualifiedEntityParameters,
	UnsugarableQualifiedEntityParameters,
} from './QualifiedEntityParameters'

export interface QualifiedFieldList extends EntityListParameters, QualifiedEntityParameters, AnyField, LeafField {
	hasOneRelationPath: HasOneRelation[]
}

export interface SugarableQualifiedFieldList
	extends SugarableEntityListParameters,
		SugarableQualifiedEntityParameters,
		SugarableAnyField {
	hasOneRelationPath?: SugarableHasOneRelation[] | SugarableHasOneRelation
}

export interface UnsugarableQualifiedFieldList
	extends UnsugarableEntityListParameters,
		UnsugarableQualifiedEntityParameters,
		UnsugarableLeafField {
	// Deliberately leaving out UnsugarableHasOneRelation
}

// E.g. Author[age < 123].son.sister.name
export interface SugaredQualifiedFieldList extends UnsugarableQualifiedFieldList {
	fields: string | SugarableQualifiedFieldList
}
