import classnames from 'classnames'
import { CSSProperties, forwardRef, memo, ReactNode, useMemo } from 'react'
import { useClassNamePrefix } from '../../auxiliary'
import type { NativeProps, Size } from '../../types'
import { toEnumClass, toEnumViewClass, toViewClass } from '../../utils'

export interface StackOwnProps {
	align?: 'center' | 'stretch' | 'start' | 'end',
	basis?: CSSProperties['flexBasis'],
	children?: ReactNode,
	direction: 'vertical' | 'horizontal' | 'vertical-reverse' | 'horizontal-reverse',
	gap?: Size | 'xlarge' | 'none',
	grow?: boolean | CSSProperties['flexGrow'],
	justify?:
		| 'center'
		| 'start'
		| 'end'
		| 'space-between'
		| 'space-around'
		| 'space-evenly'
		| 'stretch'
		| 'inherit'
		| 'initial'
		| 'revert'
	shrink?: boolean | CSSProperties['flexShrink'],
	style?: NativeProps<HTMLDivElement>['style'],
	wrap?: boolean | 'reverse',
}

export interface StackProps extends StackOwnProps, Omit<NativeProps<HTMLDivElement>, 'children'> {}

export const Stack = memo(
	forwardRef<HTMLDivElement, StackProps>(
		({
			align,
			basis,
			children,
			className,
			direction,
			gap,
			grow,
			justify,
			shrink,
			style: styleProp,
			wrap,
			...rest
		}: StackProps, ref) => {
			const prefix = useClassNamePrefix()

			const style: CSSProperties = useMemo(() => ({
				...(typeof basis !== 'boolean' ? { flexBasis: basis } : {}),
				...(typeof grow !== 'boolean' ? { flexGrow: grow } : {}),
				...(typeof shrink !== 'boolean' ? { flexShrink: shrink } : {}),
				...styleProp,
			}), [basis, grow, shrink, styleProp])

			return <>
				{children && (
					<div
						{...rest}
						className={classnames(
							`${prefix}stack`,
							toViewClass(`${direction}`, true),
							toEnumClass('gap-', gap),
							align && toEnumViewClass(`align-${align}`),
							grow === true && toEnumViewClass('grow'),
							justify && toEnumViewClass(`justify-${justify}`),
							shrink === true && toEnumViewClass('shrink'),
							wrap && toEnumViewClass(wrap === true ? `wrap` : `wrap-${wrap}`),
							className,
						)}
						style={style}
						ref={ref}
					>
						{children}
					</div>
				)}
			</>
		},
	),
)
Stack.displayName = 'Stack'
