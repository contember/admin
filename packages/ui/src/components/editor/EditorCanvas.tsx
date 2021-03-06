import classNames from 'classnames'
import { memo, ReactElement, ReactNode, TextareaHTMLAttributes, useEffect, useRef, useState } from 'react'
import { useClassNamePrefix } from '../../auxiliary'
import type { EditorCanvasDistinction, EditorCanvasSize } from '../../types'
import { toEnumStateClass, toEnumViewClass } from '../../utils'

export interface EditorCanvasProps<P extends TextareaHTMLAttributes<HTMLDivElement>> {
	underlyingComponent: (props: P) => ReactElement
	componentProps: P
	children?: ReactNode
	size?: EditorCanvasSize
	distinction?: EditorCanvasDistinction
	inset?: 'hovering-toolbar'
}

// Approximation: Toolbar height + vertical margin
const toolbarVisibilityTreshold = 56 + 2 * 16

export const EditorCanvas = memo(<P extends TextareaHTMLAttributes<HTMLDivElement>>({
	children,
	inset,
	size,
	distinction,
	underlyingComponent: Component,
	componentProps: props,
}: EditorCanvasProps<P>) => {
	const className = props.className
	const prefix = useClassNamePrefix()

	const [isInView, setIsInView] = useState(false)

	const intersectionRef = useRef<HTMLDivElement>(null)
	const observer = useRef(new IntersectionObserver(entries => {
		entries.forEach(({ isIntersecting }) => {
			setIsInView(isIntersecting)
		})
	}, {
		rootMargin: `-${toolbarVisibilityTreshold}px 0px -${toolbarVisibilityTreshold}px 0px`,
	}))

	useEffect(() => {
		const intersectionObserver = observer.current

		if (intersectionRef.current) {
			intersectionObserver.observe(intersectionRef.current)
		}

		return () => {
			intersectionObserver.disconnect()
		}
	}, [])

	return (
		<div ref={intersectionRef} className={classNames(
			`${prefix}editorCanvas`,
			toEnumViewClass(size),
			toEnumViewClass(inset),
			toEnumViewClass(distinction),
			toEnumStateClass(isInView ? 'in-view' : 'not-in-view'),
		)}>
			<Component {...props} className={classNames(`${prefix}editorCanvas-canvas`, className)} />
			{children}
		</div>
	)
}) as {
	<P extends TextareaHTMLAttributes<HTMLDivElement>>(props: EditorCanvasProps<P>): ReactElement
	displayName?: string
}
EditorCanvas.displayName = 'EditorCanvas'
