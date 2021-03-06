import classNames from 'classnames'
import { AllHTMLAttributes, DetailedHTMLProps, forwardRef, InputHTMLAttributes, memo, useCallback } from 'react'
import { mergeProps, useFocusRing, useHover } from 'react-aria'
import { useComponentClassName } from '../../../auxiliary'
import { toStateClass } from '../../../utils'
import { ControlProps, ControlPropsKeys } from '../Types'
import { CheckboxButton as DefaultCheckboxButton } from './CheckboxButton'
import { useCheckboxInput } from '../hooks/useCheckboxInput'

export interface RestHTMLCheckboxProps extends Omit<AllHTMLAttributes<HTMLInputElement>, ControlPropsKeys<boolean> | 'checked' | 'children'> {}

export type CheckoboxOwnProps = ControlProps<boolean> & {
	CheckboxButtonComponent?: typeof DefaultCheckboxButton
	/**
	 * @deprecated Add `<Label>` next to it or wrap with `<FieldContainer label={label} labelPosition="labelInlineRight"><Checkbox {...} /></FieldContainer>`
	 *
	 */
	children?: never
}

export type CheckboxProps = CheckoboxOwnProps & RestHTMLCheckboxProps

export const Checkbox = memo(
	forwardRef<HTMLInputElement, CheckboxProps>(({
		CheckboxButtonComponent,
		// TODO: Remove after depreciation time
		children: INTENTIONALLY_UNUSED_CHILDREN,
		max,
		min,
		onChange,
		value,
		...outerProps
	}, forwardedRef) => {
		const componentClassName = useComponentClassName('checkbox')
		const notNull = outerProps.notNull

		const onChangeRotateState = useCallback((next?: boolean | null) => {
			if (!notNull) {
				if (value === false && next === true) {
					next = null
				} else if (value === null) {
					next = true
				}
			}

			onChange?.(next)
		}, [value, notNull, onChange])

		const props = useCheckboxInput({
			...outerProps,
			onChange: onChangeRotateState,
			defaultValue: outerProps.defaultValue,
			value,
		}, forwardedRef)

		const { className, ...nativeInputProps } = props

		const { isFocusVisible: focused, focusProps } = useFocusRing()
		const { isHovered: hovered, hoverProps } = useHover({ isDisabled: props.disabled })

		const ariaProps: {
			'aria-checked': DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>['aria-checked']
		} = {
			'aria-checked': props.indeterminate ? 'mixed' : props.checked ? 'true' : 'false',
		}

		const CheckboxButton = CheckboxButtonComponent ?? DefaultCheckboxButton


		if (import.meta.env.DEV && INTENTIONALLY_UNUSED_CHILDREN) {
			console.warn('UNUSED CHILDREN. Add `<Label>` next to it or '
				+ 'wrap with `<FieldContainer label={label} labelPosition="labelInlineRight"><Checkbox {...} /></FieldContainer>` '
				+ 'or other way to display label next to Checkbox.')
		}

		return (
			<div {...hoverProps} className={classNames(
				componentClassName,
				toStateClass('indeterminate', props.indeterminate),
				toStateClass('checked', props.checked),
				className,
			)}>
				<input
					type="checkbox"
					{...mergeProps(
						nativeInputProps,
						ariaProps,
						focusProps,
					)}
					className={`${componentClassName}-visually-hidden`}
				/>

				<CheckboxButton
					id={outerProps.id}
					placeholder={undefined}
					name={outerProps.name}
					active={outerProps.active}
					checked={props.checked}
					className={className}
					disabled={outerProps.disabled}
					distinction={outerProps.distinction}
					focused={focused}
					hovered={hovered}
					indeterminate={props.indeterminate}
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
