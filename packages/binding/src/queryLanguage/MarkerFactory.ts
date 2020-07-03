import { Environment } from '../dao'
import {
	EntityFieldMarkers,
	FieldMarker,
	HasManyRelationMarker,
	HasOneRelationMarker,
	Marker,
	PlaceholderGenerator,
	SubTreeMarker,
} from '../markers'
import { MarkerMerger, TreeParameterMerger } from '../model'
import {
	BoxedQualifiedEntityList,
	BoxedQualifiedSingleEntity,
	BoxedUnconstrainedQualifiedEntityList,
	BoxedUnconstrainedQualifiedSingleEntity,
	HasManyRelation,
	HasOneRelation,
	RelativeSingleField,
	SugaredQualifiedEntityList,
	SugaredQualifiedSingleEntity,
	SugaredRelativeEntityList,
	SugaredRelativeSingleEntity,
	SugaredRelativeSingleField,
	SugaredUnconstrainedQualifiedEntityList,
	SugaredUnconstrainedQualifiedSingleEntity,
} from '../treeParameters'
import { QueryLanguage } from './QueryLanguage'

export namespace MarkerFactory {
	export const createSingleEntitySubTreeMarker = (
		environment: Environment,
		singleEntity: SugaredQualifiedSingleEntity,
		fields: EntityFieldMarkers,
	) => {
		const qualifiedSingleEntity = QueryLanguage.desugarQualifiedSingleEntity(singleEntity, environment)

		return new SubTreeMarker(
			new BoxedQualifiedSingleEntity({
				...qualifiedSingleEntity,
				setOnCreate: TreeParameterMerger.mergeSetOnCreate(
					qualifiedSingleEntity.setOnCreate || {},
					qualifiedSingleEntity.where,
				),
			}),
			wrapRelativeEntityFields(
				qualifiedSingleEntity.hasOneRelationPath,
				environment,
				MarkerMerger.mergeInSystemFields(fields),
			),
			environment,
		)
	}

	export const createEntityListSubTreeMarker = (
		environment: Environment,
		entityList: SugaredQualifiedEntityList,
		fields: EntityFieldMarkers,
	) => {
		const qualifiedEntityList = QueryLanguage.desugarQualifiedEntityList(entityList, environment)

		return new SubTreeMarker(
			new BoxedQualifiedEntityList(qualifiedEntityList),
			wrapRelativeEntityFields(
				qualifiedEntityList.hasOneRelationPath,
				environment,
				MarkerMerger.mergeInSystemFields(fields),
			),
			environment,
		)
	}

	export const createUnconstrainedEntityListSubTreeMarker = (
		environment: Environment,
		entityList: SugaredUnconstrainedQualifiedEntityList,
		fields: EntityFieldMarkers,
	) => {
		const qualifiedEntityList = QueryLanguage.desugarUnconstrainedQualifiedEntityList(entityList, environment)

		return new SubTreeMarker(
			new BoxedUnconstrainedQualifiedEntityList(qualifiedEntityList),
			wrapRelativeEntityFields(
				qualifiedEntityList.hasOneRelationPath,
				environment,
				MarkerMerger.mergeInSystemFields(fields),
			),
			environment,
		)
	}

	export const createUnconstrainedSingleEntitySubTreeMarker = (
		environment: Environment,
		entityList: SugaredUnconstrainedQualifiedSingleEntity,
		fields: EntityFieldMarkers,
	) => {
		const qualifiedSingleEntity = QueryLanguage.desugarUnconstrainedQualifiedSingleEntity(entityList, environment)

		return new SubTreeMarker(
			new BoxedUnconstrainedQualifiedSingleEntity(qualifiedSingleEntity),
			wrapRelativeEntityFields(
				qualifiedSingleEntity.hasOneRelationPath,
				environment,
				MarkerMerger.mergeInSystemFields(fields),
			),
			environment,
		)
	}

	export const createRelativeSingleEntityFields = (
		field: SugaredRelativeSingleEntity,
		environment: Environment,
		entityFieldMarkers: EntityFieldMarkers,
	) => {
		const relativeSingleEntity = QueryLanguage.desugarRelativeSingleEntity(field, environment)
		return wrapRelativeEntityFields(relativeSingleEntity.hasOneRelationPath, environment, entityFieldMarkers)
	}

	export const createRelativeEntityListFields = (
		field: SugaredRelativeEntityList,
		environment: Environment,
		entityFieldMarkers: EntityFieldMarkers,
	) => {
		const relativeEntityList = QueryLanguage.desugarRelativeEntityList(field, environment)
		const hasManyRelationMarker = createHasManyRelationMarker(
			relativeEntityList.hasManyRelation,
			environment,
			entityFieldMarkers,
		)
		return wrapRelativeEntityFields(
			relativeEntityList.hasOneRelationPath,
			environment,
			new Map([[hasManyRelationMarker.placeholderName, hasManyRelationMarker]]),
		)
	}

	export const createFieldMarker = (field: SugaredRelativeSingleField, environment: Environment) =>
		wrapRelativeSingleField(
			field,
			environment,
			relativeSingleField =>
				new FieldMarker(relativeSingleField.field, relativeSingleField.defaultValue, relativeSingleField.isNonbearing),
		)

	export const wrapRelativeSingleField = (
		field: SugaredRelativeSingleField,
		environment: Environment,
		getMarker: (relativeSingleField: RelativeSingleField) => Marker,
	): EntityFieldMarkers => {
		const relativeSingleField = QueryLanguage.desugarRelativeSingleField(field, environment)
		const placeholderName = PlaceholderGenerator.getFieldPlaceholder(relativeSingleField.field)

		return wrapRelativeEntityFields(
			relativeSingleField.hasOneRelationPath,
			environment,
			new Map([[placeholderName, getMarker(relativeSingleField)]]),
		)
	}

	export const wrapRelativeEntityFields = (
		hasOneRelationPath: HasOneRelation[],
		environment: Environment,
		entityFieldMarkers: EntityFieldMarkers,
	): EntityFieldMarkers => {
		for (let i = hasOneRelationPath.length - 1; i >= 0; i--) {
			const marker = createHasOneRelationMarker(hasOneRelationPath[i], environment, entityFieldMarkers)
			entityFieldMarkers = new Map([[marker.placeholderName, marker]])
		}
		return entityFieldMarkers
	}

	export const createHasOneRelationMarker = (
		hasOneRelation: HasOneRelation,
		environment: Environment,
		entityFieldMarkers: EntityFieldMarkers,
	) =>
		new HasOneRelationMarker(
			{
				...hasOneRelation,
				setOnCreate: hasOneRelation.reducedBy
					? TreeParameterMerger.mergeSetOnCreate(hasOneRelation.setOnCreate || {}, hasOneRelation.reducedBy)
					: hasOneRelation.setOnCreate,
			},
			MarkerMerger.mergeInSystemFields(entityFieldMarkers),
			environment,
		)

	export const createHasManyRelationMarker = (
		hasManyRelation: HasManyRelation,
		environment: Environment,
		entityFieldMarkers: EntityFieldMarkers,
	) => new HasManyRelationMarker(hasManyRelation, MarkerMerger.mergeInSystemFields(entityFieldMarkers), environment)
}
