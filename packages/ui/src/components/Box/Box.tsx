import classnames from 'classnames'
import { forwardRef, memo, ReactNode } from 'react'
import { useClassNamePrefix } from '../../auxiliary'
import type { BoxDistinction, Default, Intent, NativeProps } from '../../types'
import { toEnumViewClass, toStateClass } from '../../utils'
import { Stack } from '../Stack'
import { Label } from '../Typography/Label'
import { View, ViewContainerProps, ViewProps } from '../View'

export interface BoxOwnProps extends Omit<ViewProps, 'theme' | 'themeContent' | 'themeControls' | 'padding'> {
	actions?: ReactNode
	children?: ViewContainerProps['children']
	distinction?: BoxDistinction
	heading?: ReactNode
	isActive?: boolean
	intent?: Intent
	padding?: Default | 'no-padding' | 'with-padding'
}

export interface BoxProps extends BoxOwnProps, Omit<ViewContainerProps, 'children'> {}

export const Box = memo(
	forwardRef<HTMLDivElement, BoxProps>(
		({
			actions,
			children,
			className,
			direction = 'vertical',
			distinction,
			gap = true,
			heading,
			intent,
			isActive,
			backgroundColor = true,
			purpose = 'above',
			padding,
			...rest
		}: BoxProps, ref) => {
			const componentClassName = `${useClassNamePrefix()}box`

			return (
				<View
					{...rest}
					theme={intent}
					themeContent={intent}
					themeControls={intent}
					backgroundColor={backgroundColor}
					purpose={purpose}
					className={classnames(
						componentClassName,
						toStateClass('active', isActive),
						toEnumViewClass(distinction),
						toEnumViewClass(padding),
						className,
					)}
					ref={ref}
				>
					<Stack
						gap={gap}
						direction={direction}
						className={`${componentClassName}-container`}
					>
						{(heading || actions) && (
							<View className={`${componentClassName}-header`}>
								{heading && <Label>{heading}</Label>}
								{actions && (
									<View className={`${componentClassName}-actions`} contentEditable={false}>
										{actions}
									</View>
								)}
							</View>
						)}
						{children}
					</Stack>
				</View>
			)
		},
	),
)
Box.displayName = 'Box'
