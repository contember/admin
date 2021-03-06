import { Component, EntityAccessor } from '@contember/binding'
import { FieldContainer, FieldContainerProps, FieldErrors, SelectCreateNewWrapper } from '@contember/ui'
import { FunctionComponent, memo, MouseEventHandler, useCallback } from 'react'
import type { MultiValueGenericProps, MultiValueProps, Props as SelectProps } from 'react-select'
import Select, { ActionMeta, components } from 'react-select'
import { useLabelMiddleware } from '../../environment/LabelMiddleware'
import { ChoiceFieldData, DynamicMultiChoiceField, DynamicMultipleChoiceFieldProps } from '../ChoiceField'
import { useCommonReactSelectProps } from './useCommonReactSelectProps'
import {
	HelperContainerGetter,
	SortableContainer,
	SortableContainerProps,
	SortableElement,
	SortableHandle,
	SortEndHandler,
	SortEvent,
	SortEventWithTag,
} from 'react-sortable-hoc'
import { shouldCancelStart } from '../../helpers/shouldCancelStart'

export type MultiSelectFieldProps =
	& MultiSelectFieldInnerPublicProps
	& DynamicMultipleChoiceFieldProps

export const MultiSelectField: FunctionComponent<MultiSelectFieldProps> = Component(
	props => (
		<DynamicMultiChoiceField {...props} >
			{(choiceProps: ChoiceFieldData.MultipleChoiceFieldMetadata<EntityAccessor>) => (
				<MultiSelectFieldInner {...props} {...choiceProps} />
			)}
		</DynamicMultiChoiceField>
	),
	'MultiSelectField',
)

export interface MultiSelectFieldInnerPublicProps extends Omit<FieldContainerProps, 'children'> {
	placeholder?: string
	reactSelectProps?: Partial<SelectProps<any>>
}

export interface MultiSelectFieldInnerProps<ActualValue>
	extends ChoiceFieldData.MultipleChoiceFieldMetadata<ActualValue>,
		MultiSelectFieldInnerPublicProps {
	errors: FieldErrors | undefined
}

const typedMemo: <T>(c: T) => T = memo
export const MultiSelectFieldInner = typedMemo(
	<T extends any>({
		currentValues,
		data,
		errors,
		onAdd,
		onClear,
		onRemove,
		reactSelectProps,
		placeholder,
		onAddNew,
		onMove,
		onSearch,
		isLoading,
		...fieldContainerProps
	}: MultiSelectFieldInnerProps<T>) => {
		const labelMiddleware = useLabelMiddleware()
		const selectProps = useCommonReactSelectProps<T>({
			reactSelectProps,
			placeholder,
			data,
			isInvalid: (errors?.length ?? 0) > 0,
			onSearch,
		})

		const selectOnChange = useCallback((newValue: unknown, actionMeta: ActionMeta<ChoiceFieldData.SingleOption<T>>) => {
			if (actionMeta.action === 'select-option') {
				onAdd(actionMeta.option!)
			} else if (actionMeta.action === 'remove-value') {
				onRemove(actionMeta.removedValue!)
			} else if (actionMeta.action === 'pop-value' && currentValues.length > 0) {
				onRemove(currentValues[currentValues.length - 1])
			} else if (actionMeta.action === 'clear') {
				onClear()
			}
		}, [currentValues, onAdd, onClear, onRemove])

		const allSelectProps: SelectProps<ChoiceFieldData.SingleOption<T>, boolean, never> = {
			...selectProps,
			isMulti: true,
			isClearable: true,
			closeMenuOnSelect: false,
			value: currentValues,
			onChange: selectOnChange,
			isLoading,
		}
		const onSortEnd = useCallback<SortEndHandler>(({ oldIndex, newIndex }) => {
			onMove?.(oldIndex, newIndex)
		}, [onMove])

		return (
			<FieldContainer
				{...fieldContainerProps}
				errors={errors}
				label={labelMiddleware(fieldContainerProps.label)}
			>
				<SelectCreateNewWrapper onClick={onAddNew}>
					{onMove
						? <SortableSelect
							{...allSelectProps}
							useDragHandle
							axis="xy"
							onSortEnd={onSortEnd}
							distance={4}
							helperContainer={getHelperContainer}
							helperClass={'sortable-dragged'}
							shouldCancelStart={shouldCancelStart}
							components={{
								...selectProps.components,
								MultiValue: SortableMultiValue,
								MultiValueLabel: SortableMultiValueLabel,
							}}
						/>
						: <Select {...allSelectProps} />
					}
				</SelectCreateNewWrapper>
			</FieldContainer>
		)
	},
)

const getHelperContainer: HelperContainerGetter = () => {
	return document.getElementById('portal-root') ?? document.body
}


const SortableSelect = SortableContainer(Select) as React.ComponentClass<SelectProps<ChoiceFieldData.SingleOption<any>, boolean, never> & SortableContainerProps>
const SortableMultiValue = SortableElement(
	(props: MultiValueProps<any, boolean, never>) => {
		// this prevents the menu from being opened/closed when the user clicks
		// on a value to begin dragging it. ideally, detecting a click (instead of
		// a drag) would still focus the control and toggle the menu, but that
		// requires some magic with refs that are out of scope for this example
		const onMouseDown: MouseEventHandler<HTMLDivElement> = e => {
			e.preventDefault()
			e.stopPropagation()
		}
		const innerProps = { ...props.innerProps, onMouseDown }
		return <components.MultiValue {...props} innerProps={innerProps} />
	},
)

const SortableMultiValueLabel = SortableHandle(
	(props: MultiValueGenericProps<any, boolean, never>) => <components.MultiValueLabel {...props} />,
)
