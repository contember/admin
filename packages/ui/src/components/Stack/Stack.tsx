import classnames from 'classnames'
import { forwardRef, memo } from 'react'
import { useComponentClassName } from '../../auxiliary'
import { NativeProps } from '../../types'
import { toStateClass } from '../../utils'
import { View, ViewProps } from '../View'

export type StackOwnProps = Omit<ViewProps, 'display' | 'spanRows' | 'direction'> & {
	direction: ViewProps['direction']
	evenly?: boolean
}

export type StackProps = StackOwnProps & NativeProps<HTMLDivElement>

export const Stack = memo(
	forwardRef<HTMLDivElement, StackProps>(
		({
			children,
			className,
			evenly,
			gap = true,
			...props
		}: StackProps, ref) => {
			const componentClassName = useComponentClassName('stack')

			return <>
				{children && (
					<View
						{...props}
						gap={gap}
						display="flex"
						className={classnames(
							`${componentClassName}`,
							toStateClass('evenly-distributed', evenly),
							className,
						)}
						ref={ref}
					>
						{children}
					</View>
				)}
			</>
		},
	),
)
Stack.displayName = 'Stack'
