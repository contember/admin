import classNames from 'classnames'
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, memo, Ref } from 'react'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { fromStringValue, toStringValue, useNativeInput } from '../useNativeInput'
import { FallbackDateTimeInput } from './FallbackDateTimeInput'
import { assertDateString, assertDatetimeString, assertTimeString } from './Serializer'
import { DateTimeInputProps } from './Types'

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

const InnerDateInput = memo(
	forwardRef((props: InnerInputProps, ref: Ref<HTMLInputElement>) => {
		if (props.value) {
			assertDateString(props.value)
		}

		if (props.max) {
			assertDateString(props.max)
		}

		if (props.min) {
			assertDateString(props.min)
		}

		return <input ref={ref} {...props} type="date" />
	}),
)
InnerDateInput.displayName = 'InnerDateInput'

const InnerTimeInput = memo(
	forwardRef((props: InnerInputProps, ref: Ref<HTMLInputElement>) => {
		if (props.value) {
			assertTimeString(props.value)
		}

		if (props.max) {
			assertTimeString(props.max)
		}

		if (props.min) {
			assertTimeString(props.min)
		}

		return <input ref={ref} {...props} type="time" />
	}),
)
InnerTimeInput.displayName = 'InnerTimeInput'

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
		const { ref, props } = useNativeInput<HTMLInputElement>(
			{
				...outerProps,
				className: classNames(
					useComponentClassName('input'),
					toViewClass('withTopToolbar', withTopToolbar),
					className,
				),
			},
			forwardedRef,
			toStringValue,
			fromStringValue,
		)

		switch (outerProps.type) {
			case 'date':
				return <InnerDateInput ref={ref} {...props} />
			case 'time':
				return <InnerTimeInput ref={ref} {...props} />
			default:
				return isInputDateTimeLocalSupported()
					? <InnerDatetimeInput ref={ref} {...props} />
					: <FallbackDateTimeInput ref={ref} {...outerProps} />
		}
	}),
)
DateTimeInput.displayName = 'DateTimeInput'
