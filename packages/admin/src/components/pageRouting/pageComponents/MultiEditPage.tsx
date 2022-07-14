import {
	DataBindingProvider,
	EntityListSubTree,
	EntityListSubTreeAdditionalProps,
	SugaredQualifiedEntityList,
} from '@contember/binding'
import { memo, ReactElement, ReactNode, useMemo } from 'react'
import { FeedbackRenderer, MutableEntityListPageRenderer, MutableEntityListPageRendererProps } from '../../bindingFacade'
import type { PageProvider } from '../Pages'
import { getPageName } from './getPageName'

export type MultiEditPageProps<ContainerExtraProps, ItemExtraProps> =
	& SugaredQualifiedEntityList
	& EntityListSubTreeAdditionalProps
	& {
		children?: ReactNode
		compact?: boolean
		pageName?: string
		rendererProps?: Omit<MutableEntityListPageRendererProps<ContainerExtraProps, ItemExtraProps>, 'accessor' | 'children'>
		scrollable?: boolean
	}

const MultiEditPage = memo(
	<ContainerExtraProps, ItemExtraProps>({
		compact,
		children,
		rendererProps,
		pageName,
		scrollable,
		...entityListProps
	}: MultiEditPageProps<ContainerExtraProps, ItemExtraProps>) => (
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<EntityListSubTree {...entityListProps} listComponent={MutableEntityListPageRenderer} listProps={useMemo(() => ({ compact, scrollable, ...rendererProps }), [compact, scrollable, rendererProps])}>
				{children}
			</EntityListSubTree>
		</DataBindingProvider>
	),
) as (<ContainerExtraProps, ItemExtraProps>(
	props: MultiEditPageProps<ContainerExtraProps, ItemExtraProps>,
) => ReactElement) &
	Partial<PageProvider<MultiEditPageProps<never, never>>>

MultiEditPage.getPageName = getPageName

export { MultiEditPage }
