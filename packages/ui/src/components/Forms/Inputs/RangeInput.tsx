import classNames from 'classnames'
import { forwardRef, memo } from 'react'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { useNativeInput } from '../useNativeInput'
import type { RangeInputProps } from './Types'

export const RangeInput = memo(
	forwardRef<HTMLInputElement, RangeInputProps>(({
		className,
		withTopToolbar,
		...outerProps
	}, forwardedRed) => {
		const { ref, props } = useNativeInput<HTMLInputElement>({
			...outerProps,
			className: classNames(
				useComponentClassName('text-input'),
				useComponentClassName('range-input'),
				toViewClass('withTopToolbar', withTopToolbar),
				className,
			),
		}, forwardedRed)

		return <input ref={ref} {...props} type="range" />
	}),
)
RangeInput.displayName = 'RangeInput'