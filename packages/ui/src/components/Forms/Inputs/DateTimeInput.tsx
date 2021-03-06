import classNames from 'classnames'
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, memo, Ref } from 'react'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { assertDatetimeString } from '../Types'
import { DateTimeInputFallback } from './DateTimeInputFallback'
import { DateTimeInputProps } from './Types'
import { useTextBasedInput } from '../hooks/useTextBasedInput'

let _isInputDateTimeLocalSupported: boolean | null = null

function isInputDateTimeLocalSupported() {
	if (_isInputDateTimeLocalSupported === null) {
		const input = document.createElement('input')
		const value = 'a'
		input.setAttribute('type', 'datetime-local')
		input.setAttribute('value', value)

		_isInputDateTimeLocalSupported = input.value !== value
	}

	return _isInputDateTimeLocalSupported
}

type InnerInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const InnerDatetimeInput = memo(
	forwardRef((props: InnerInputProps, ref: Ref<HTMLInputElement>) => {
		if (props.value) {
			assertDatetimeString(props.value)
		}

		if (props.max) {
			assertDatetimeString(props.max)
		}

		if (props.min) {
			assertDatetimeString(props.min)
		}

		return <input ref={ref} {...props} type="datetime-local" />
	}),
)
InnerDatetimeInput.displayName = 'InnerDatetimeInput'

export const DateTimeInput = memo(
	forwardRef(({
		className,
		withTopToolbar,
		...outerProps
	}: DateTimeInputProps, forwardedRef: Ref<HTMLInputElement>) => {
		const props = useTextBasedInput<HTMLInputElement>({
			...outerProps,
			className: classNames(
				useComponentClassName('text-input'),
				useComponentClassName('datetime-input'),
				toViewClass('withTopToolbar', withTopToolbar),
				className,
			),
		}, forwardedRef)

		return isInputDateTimeLocalSupported()
			? <InnerDatetimeInput {...props} />
			: <DateTimeInputFallback {...outerProps} />
	}),
)
DateTimeInput.displayName = 'DateTimeInput'
