import { LazyChoiceFieldSettings, SearchByFields } from '../BaseDynamicChoiceField'
import { useCallback } from 'react'
import { useSearchFields } from './useSearchFields'
import { BindingError, Filter, wrapFilterInHasOnes } from '@contember/binding'
import { DesugaredOptionPath } from './useDesugaredOptionPath'

export const useCreateOptionsFilter = (
	desugaredOptionPath: DesugaredOptionPath,
	searchByFields: SearchByFields | undefined,
	lazy: LazyChoiceFieldSettings,
) => {
	const desugaredSearchFields = useSearchFields(searchByFields)
	const lazyFilter = lazy && typeof lazy === 'object' && lazy.createFilter
	if (import.meta.env.DEV && lazy && desugaredSearchFields.length === 0 && !lazyFilter && !('field' in desugaredOptionPath)) {
		throw new BindingError(`Lazy select has no fields specified for a search. Please set either lazy.createFilter or searchByFields option.`)
	}
	return useCallback((input: string): Filter | undefined => {
		if (lazyFilter) {
			return lazyFilter(input)
		}
		if (!input) {
			return undefined
		}
		if (desugaredSearchFields.length) {
			const and = []
			for (const field of desugaredSearchFields) {
				and.push(wrapFilterInHasOnes(field.hasOneRelationPath, {
					[field.field]: { containsCI: input },
				}))
			}
			return { and }
		}
		if ('field' in desugaredOptionPath) {
			return wrapFilterInHasOnes(desugaredOptionPath.hasOneRelationPath, {
				[desugaredOptionPath.field]: { containsCI: input },
			})
		}
		if (import.meta.env.DEV) {
			throw new BindingError(`Lazy select has no fields specified for a search. Please set either lazy.createFilter or searchByFields option.`)
		}
		return undefined

	}, [desugaredOptionPath, desugaredSearchFields, lazyFilter])
}
