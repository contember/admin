import { EntityAccessor, SugaredRelativeEntityList, useEntityList } from '@contember/binding'
import { useCallback } from 'react'
import { BaseDynamicChoiceField } from '../BaseDynamicChoiceField'
import type { ChoiceFieldData } from '../ChoiceFieldData'
import { useSelectOptions } from './useSelectOptions'
import { useAccessorErrors } from '../../../errors'
import { useOnAddNew } from './useOnAddNew'
import {
	DynamicMultipleChoiceWithConnectingEntityFieldProps,
} from './useDynamicMultipleChoiceWithConnectingEntityField'
import { useCurrentValues } from './useCurrentValues'

export type DynamicMultipleChoiceFieldProps =
	& SugaredRelativeEntityList
	& BaseDynamicChoiceField
	& (
		| { }
		| DynamicMultipleChoiceWithConnectingEntityFieldProps
	)

export const useDynamicMultipleChoiceField = (
	props: DynamicMultipleChoiceFieldProps,
): ChoiceFieldData.MultipleChoiceFieldMetadata<EntityAccessor> => {
	const currentValueListAccessor = useEntityList(props)
	const currentlyChosenEntities = Array.from(currentValueListAccessor)

	const { options, onSearch, isLoading } = useSelectOptions(props, currentlyChosenEntities)

	const currentValues = useCurrentValues(props, currentlyChosenEntities)

	const getCurrentValues = currentValueListAccessor.getAccessor

	const clear = useCallback(() => {
		getCurrentValues().batchUpdates(getListAccessor => {
			for (const child of getListAccessor()) {
				getListAccessor().disconnectEntity(child)
			}
		})
	}, [getCurrentValues])

	const errors = useAccessorErrors(currentValueListAccessor)

	return {
		currentValues,
		data: options,
		errors,
		onClear: clear,
		onAdd: useCallback(value => {
			getCurrentValues().connectEntity(value.value)
		}, [getCurrentValues]),
		onRemove: useCallback(value => {
			getCurrentValues().disconnectEntity(value.value)
		}, [getCurrentValues]),
		onAddNew: useOnAddNew({
			...props,
			connect: useCallback(entity => {
				getCurrentValues().connectEntity(entity)
			}, [getCurrentValues]),
		}),
		onSearch,
		isLoading,
	}
}
