import classNames from 'classnames'
import { CSSProperties, memo, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useClassNamePrefix } from '../../auxiliary'
import { toEnumClass, toSchemeClass, toThemeClass } from '../../utils'
import { SectionTabs } from '../SectionTabs'
import { TitleBar, TitleBarProps } from '../TitleBar'
import { LayoutPageAside } from './LayoutPageAside'
import { LayoutPageContent, LayoutPageContentProps } from './LayoutPageContent'
import { useThemeScheme } from './ThemeSchemeContext'
import { ThemeScheme } from './Types'
export interface LayoutPageProps extends Omit<TitleBarProps, 'after' | 'children'>, ThemeScheme {
	afterTitle?: TitleBarProps['after']
	children?: ReactNode
	fit?: 'content' | 'none'
	/** @deprecated Use `pageContentLayout` prop */
	layout?: LayoutPageContentProps['pageContentLayout']
	pageContentLayout?: LayoutPageContentProps['pageContentLayout']
	side?: ReactNode
	title?: ReactNode
}

export const LayoutPage = memo(({
	actions,
	afterTitle,
	children,
	fit = 'content',
	headingProps,
	layout,
	navigation,
	pageContentLayout,
	side,
	title,
	...props
}: LayoutPageProps) => {
	const prefix = useClassNamePrefix()
	const {
		scheme,
		theme,
		themeContent,
		themeControls,
	} = useThemeScheme(props)

	const [contentOffsetTop, setContentOffsetTop] = useState<number | undefined>(undefined)
	const contentRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		if (!contentRef.current) {
			return
		}

		const ref = contentRef.current

		function updateTopOffsetCallback() {
			setContentOffsetTop(ref.offsetTop)
		}

		function updateTopOffsetHandler() {
			requestAnimationFrame(updateTopOffsetCallback)
		}

		updateTopOffsetHandler()

		window.addEventListener('resize', updateTopOffsetHandler, { passive: true })

		return () => {
			window.removeEventListener('resize', updateTopOffsetHandler)
		}
	}, [])

	const [showDivider, setShowDivider] = useState<boolean>(false)

	useEffect(() => {
		if (!document?.body?.parentElement) {
			return
		}

		const container = document.body.parentElement

		const scrollHandler = () => {
			const visibleWidth = container.offsetWidth
			const contentWidth = container.scrollWidth
			const scrollLeft = container.scrollLeft

			setShowDivider(contentWidth > visibleWidth && scrollLeft + visibleWidth < contentWidth)
		}

		scrollHandler()

		window.addEventListener('scroll', scrollHandler, { passive: true })

		return () => {
			window.removeEventListener('scroll', scrollHandler)
		}
	}, [])

	return <div className={classNames(
		`${prefix}layout-page`,
		toThemeClass(themeContent ?? theme, themeControls ?? theme),
		toSchemeClass(scheme),
	)}>
		{(title || actions) && <TitleBar after={afterTitle === undefined ? <SectionTabs /> : afterTitle} navigation={navigation} actions={actions} headingProps={headingProps}>
			{title}
		</TitleBar>}
		<div
			ref={contentRef}
			className={classNames(
				`${prefix}layout-page-content-wrap`,
				toEnumClass('fit-', fit),
				showDivider ? 'view-aside-divider' : undefined,
			)}
			style={{ '--cui-content-offset-top': `${contentOffsetTop}px` } as CSSProperties}
		>
			<LayoutPageContent pageContentLayout={pageContentLayout ?? layout}>
				{children}
			</LayoutPageContent>
			{side && <LayoutPageAside>{side}</LayoutPageAside>}
		</div>
	</div>
})

LayoutPage.displayName = 'LayoutPage'
