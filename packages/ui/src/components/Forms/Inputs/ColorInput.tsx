import classNames from 'classnames'
import { forwardRef, memo } from 'react'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { assertColorString } from '../Types'
import { useNativeInput } from '../useNativeInput'
import type { ColorInputProps } from './Types'

export const ColorInput = memo(
	forwardRef<HTMLInputElement, ColorInputProps>(({
		className,
		withTopToolbar,
		...outerProps
	}, forwardedRed) => {
		outerProps.value && assertColorString(outerProps.value)

		const { ref, props } = useNativeInput<HTMLInputElement>({
			...outerProps,
			className: classNames(
				useComponentClassName('text-input'),
				useComponentClassName('color-input'),
				toViewClass('withTopToolbar', withTopToolbar),
				className,
			),
		}, forwardedRed)

		return <input ref={ref} {...props} type="color" />
	}),
)
ColorInput.displayName = 'ColorInput'
