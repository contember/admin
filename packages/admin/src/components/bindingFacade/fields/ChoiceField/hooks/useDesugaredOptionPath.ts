import { useMemo } from 'react'
import {
	BaseDynamicChoiceField,
	LazyChoiceFieldSettings,
	OptionsAsEntityList,
	OptionsAsFieldList,
} from '../BaseDynamicChoiceField'
import {
	Environment,
	Filter,
	QualifiedEntityList,
	QualifiedFieldList,
	QueryLanguage,
	useEnvironment,
} from '@contember/binding'

export type DesugaredOptionPath = QualifiedFieldList | QualifiedEntityList;


export const useDesugaredOptionPath = (props: BaseDynamicChoiceField, filter: Filter | undefined): DesugaredOptionPath => {
	const environment = useEnvironment()
	const isEntityList = 'optionsStaticRender' in props || 'optionLabel' in props
	const lazy = props.lazy
	return useMemo(() => {
		if (isEntityList) {
			return getDesugaredEntityList(props.options as OptionsAsEntityList, environment, lazy, filter)
		}
		return getDesugaredFieldList(props.options as OptionsAsFieldList, environment, lazy, filter)
	}, [environment, filter, isEntityList, lazy, props.options])
}

export const getDesugaredEntityList = (options: OptionsAsEntityList, environment: Environment, lazyOptions: LazyChoiceFieldSettings, filter: Filter | undefined): QualifiedEntityList => {
	const sugaredList = typeof options === 'string' || !('entities' in options)
		? { entities: options }
		: options

	const qualifiedEntityList = QueryLanguage.desugarQualifiedEntityList(sugaredList, environment)
	return {
		...qualifiedEntityList,
		filter: filter && qualifiedEntityList.filter ? { and: [filter, qualifiedEntityList.filter] } : (qualifiedEntityList.filter ?? filter),
		limit: getLazyLimit(lazyOptions, filter === undefined) ?? qualifiedEntityList.limit,
	}
}

export const getDesugaredFieldList = (options: OptionsAsFieldList, environment: Environment, lazyOptions: LazyChoiceFieldSettings, filter: Filter | undefined): QualifiedFieldList => {
	const sugaredList = typeof options === 'string' || !('fields' in options)
		? { fields: options }
		: options

	const desugarQualifiedFieldList = QueryLanguage.desugarQualifiedFieldList(sugaredList, environment)
	return {
		...desugarQualifiedFieldList,
		filter: filter && desugarQualifiedFieldList.filter ? { and: [filter, desugarQualifiedFieldList.filter] } : (desugarQualifiedFieldList.filter ?? filter),
		limit: getLazyLimit(lazyOptions, filter === undefined) ?? desugarQualifiedFieldList.limit,
	}
}

const DEFAULT_LAZY_LIMIT = 100
const DEFAULT_LAZY_INIT_LIMIT = 20
export const getLazyLimit = (lazyOptions: LazyChoiceFieldSettings, isInitial: boolean): number | undefined => {
	if (!lazyOptions) {
		return undefined
	}
	const normalized = typeof lazyOptions === 'object' ? lazyOptions : {}
	if (isInitial) {
		return normalized.initialLimit ?? DEFAULT_LAZY_INIT_LIMIT
	}
	return normalized.limit ?? DEFAULT_LAZY_LIMIT
}
