import classNames from 'classnames'
import { forwardRef, memo, useRef } from 'react'
import { AllViewProps, ViewDisplayProps } from './Types'
import { useViewProps } from './useViewProps'

const uppercasePattern = /([A-Z])/g

export default function hyphenateStyleName(name: string): string {
  return name
    .replace(uppercasePattern, '-$1')
    .toLowerCase()
}

function inlineStyle(styles: {[key: string]: unknown } | undefined) {
    let serialized = ''

		for (const styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue
      }

      const styleValue = styles[styleName]

      if (styleValue != null) {
        const isCustomProperty = styleName.indexOf('--') === 0
        serialized +=
          (isCustomProperty ? styleName : hyphenateStyleName(styleName)) +
          ':'
        serialized += `${styleValue};`
      }
    }

    return serialized || null
}

const randomClassName = () => 'cui-' + (Math.random() + 1).toString(36).substring(7)

type ScopedStyleProps = {
	className?: string
	style?: string | null
	hoverStyle?: string | null
	activeStyle?: string | null
	focusStyle?: string | null
}

const ScopedStyle = memo<ScopedStyleProps>(({
	className,
	style,
	hoverStyle,
	activeStyle,
	focusStyle,
}) => {
	return style || hoverStyle || activeStyle || focusStyle
		? <style>
		{style && `.${className} { ${style} }`}
		{hoverStyle && `.${className}:hover { ${hoverStyle} }`}
		{activeStyle && `.${className}:active { ${activeStyle} }`}
		{focusStyle && `.${className}:focus { ${focusStyle} }`}
	</style>
	: null
})
ScopedStyle.displayName = 'ScopedStyle'

function maybeMergeWithPurposeBasedProps(stateProps?: ViewDisplayProps, props?: ViewDisplayProps) {
	return stateProps?.backgroundColor || stateProps?.color || stateProps?.purpose
		? {
			backgroundColor: props?.backgroundColor,
			color: props?.color,
			purpose: props?.purpose,
			...stateProps,
		}
		: stateProps
}

function checkProps(previous: Object | undefined, next: Object | undefined) {
	if (previous && next && previous !== next) {
		if (JSON.stringify(previous) === JSON.stringify(next)) {
			console.warn('Avoidable re-render: Props object reference has changed with the same result', { previous, next })
		}
	}
}

export const View = memo(
	forwardRef<HTMLDivElement, AllViewProps>(({
		active,
		activeProps,
		children,
		component,
		focus,
		focusProps,
		hover,
		hoverProps,
		id,
		className: classNameProp,
		...props
	}, ref) => {
		const Component = (component ?? 'div') as 'div'

		// Hooks order will never vary between re-renders under same environment
		// so we can check the props for the developers:
		if (import.meta.env.DEV) {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const previousActiveProps = useRef<ViewDisplayProps | undefined>()
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const previousFocusProps = useRef<ViewDisplayProps | undefined>()
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const previousHoverProps = useRef<ViewDisplayProps | undefined>()

			checkProps(activeProps, previousActiveProps.current)
			checkProps(focusProps, previousFocusProps.current)
			checkProps(hoverProps, previousHoverProps.current)

			previousActiveProps.current = activeProps
			previousFocusProps.current = focusProps
			previousHoverProps.current = hoverProps
		}

		const [className, style] = useViewProps({
			color: true,
			...props,
			...(active ? activeProps : undefined),
			...(focus ? focusProps : undefined),
			...(hover ? hoverProps : undefined),
		})

		const [hoverClassName, hoverStyle] = useViewProps(maybeMergeWithPurposeBasedProps(hoverProps, props) ?? {}, 'hover')
		const [activeClassName, activeStyle] = useViewProps(maybeMergeWithPurposeBasedProps(activeProps, props) ?? {}, 'active')
		const [focusClassName, focusStyle] = useViewProps(maybeMergeWithPurposeBasedProps(focusProps, props) ?? {}, 'focus')

		const { current: uniqueClassName } = useRef(randomClassName())

		return (
			<Component
				id={id}
				ref={ref}
				className={classNames(uniqueClassName, className, hoverClassName, activeClassName, focusClassName, classNameProp)}
			>
				{children}
				<ScopedStyle
					key={uniqueClassName}
					className={uniqueClassName}
					style={inlineStyle(style as {})}
					hoverStyle={inlineStyle(hoverStyle as {})}
					activeStyle={inlineStyle(activeStyle as {})}
					focusStyle={inlineStyle(focusStyle as {})}
				/>
			</Component>
		)
	}),
)
View.displayName = 'View'
