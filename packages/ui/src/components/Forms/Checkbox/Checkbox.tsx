import classNames from 'classnames'
import { AllHTMLAttributes, DetailedHTMLProps, forwardRef, InputHTMLAttributes, memo, useCallback } from 'react'
import { mergeProps, useFocusRing, useHover } from 'react-aria'
import { fromBooleanValue, toBooleanValue } from '..'
import { useComponentClassName } from '../../../auxiliary'
import { toStateClass } from '../../../utils'
import { ControlProps, ControlPropsKeys } from '../Types'
import { useNativeInput } from '../useNativeInput'
import { CheckboxButton as DefaultCheckboxButton } from './CheckboxButton'

export interface RestHTMLCheckboxProps extends Omit<AllHTMLAttributes<HTMLInputElement>, ControlPropsKeys<boolean> | 'checked'> {}

export type CheckoboxOwnProps = ControlProps<boolean> & {
	CheckboxButtonComponent?: typeof DefaultCheckboxButton
}

export type CheckboxProps = CheckoboxOwnProps & RestHTMLCheckboxProps

export const Checkbox = memo(
	forwardRef<HTMLInputElement, CheckboxProps>(({
		CheckboxButtonComponent,
		max,
		min,
		onChange,
		value,
		...outerProps
	}, forwardedRef) => {
		const componentClassName = useComponentClassName('checkbox')

		const notNull = outerProps.notNull

		const onChangeRotateState = useCallback((nextValue?: string | null) => {
			let next = toBooleanValue(nextValue ?? '')

			if (!notNull) {
				if (value === false && next === true) {
					next = null
				} else if (value === null) {
					next = true
				}
			}

			onChange?.(next)
		}, [value, notNull, onChange])

		const { ref, props, state } = useNativeInput({
				...outerProps,
				onChange: onChangeRotateState,
				defaultValue: fromBooleanValue(outerProps.defaultValue),
				max: fromBooleanValue(max),
				min: fromBooleanValue(min),
				value: fromBooleanValue(value),
			}, forwardedRef)

		const { className, ...nativeInputProps } = props
		const booleanValue = toBooleanValue(state)

		const { isFocusVisible: focused, focusProps } = useFocusRing()
		const { isHovered: hovered, hoverProps } = useHover({ isDisabled: props.disabled })

		const ariaProps: {
			'aria-checked': DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>['aria-checked']
		} = {
			'aria-checked': booleanValue === null ? 'mixed' : booleanValue === true ? 'true' : booleanValue === false ? 'false' : undefined,
		}

		const CheckboxButton = CheckboxButtonComponent ?? DefaultCheckboxButton

		return (
			<div {...hoverProps} className={classNames(
				componentClassName,
				toStateClass('indeterminate', booleanValue === null),
				toStateClass('checked', booleanValue === true),
				className,
			)}>
				<input
					ref={ref}
					type="checkbox"
					{...mergeProps(
						nativeInputProps,
						ariaProps,
						focusProps,
					)}
					className={`${componentClassName}-visually-hidden`}
				/>

				<CheckboxButton
					active={outerProps.active}
					checked={booleanValue}
					className={className}
					disabled={outerProps.disabled}
					distinction={outerProps.distinction}
					focused={focused}
					hovered={hovered}
					indeterminate={booleanValue === null}
					intent={outerProps.intent}
					loading={outerProps.loading}
					readOnly={outerProps.readOnly}
					required={outerProps.required}
					scheme={outerProps.scheme}
					size={outerProps.size}
					validationState={outerProps.validationState}
				/>
			</div>
		)
	},
))
Checkbox.displayName = 'Checkbox'
