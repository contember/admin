import { Component, EntityAccessor } from '@contember/binding'
import { Table, TableCell, TableProps, TableRow, TableRowProps } from '@contember/ui'
import { memo, ReactElement, ReactNode } from 'react'
import { DeleteEntityButton, EmptyMessage, RepeaterFieldContainerProps, RepeaterItemProps } from '../../collections'
import { LayoutRenderer, LayoutRendererProps } from '../LayoutRenderer'
import { ImmutableEntityListRenderer, ImmutableEntityListRendererProps } from '../listRenderers'

export type ImmutableEntityListTablePageRendererProps<ContainerExtraProps, ItemExtraProps> =
	& LayoutRendererProps
	& Omit<
			ImmutableEntityListRendererProps<ContainerExtraProps, ItemExtraProps>,
			| 'afterContent'
			| 'beforeContent'
			| 'wrapperComponent'
			| 'itemComponent'
			| 'itemComponentExtraProps'
			| 'containerComponent'
			| 'containerComponentExtraProps'
			| 'removalType'
		>
	& {
		tableProps?: Omit<TableProps, 'children'>
		tableRowProps?: Omit<TableRowProps, 'children'>
		enableRemoving?: boolean
	}

export const ImmutableEntityListTablePageRenderer = Component(
	<ContainerExtraProps, ItemExtraProps>({
		enableRemoving = true,
		children,
		side,
		title,
		navigation,
		headingProps,
		actions,
		tableProps,
		tableRowProps,
		...entityListProps
	}: ImmutableEntityListTablePageRendererProps<ContainerExtraProps, ItemExtraProps>) => {
		return (
			<LayoutRenderer
				side={side}
				title={title}
				navigation={navigation}
				actions={actions}
				headingProps={headingProps}
			>
				<ImmutableEntityListRenderer
					{...entityListProps}
					containerComponent={Container}
					containerComponentExtraProps={tableProps}
					itemComponent={Row}
					itemComponentExtraProps={{
						...tableRowProps,
						enableRemoving,
					}}
				>
					{children}
				</ImmutableEntityListRenderer>
			</LayoutRenderer>
		)
	},
	'ImmutableEntityListTablePageRenderer',
) as <ContainerExtraProps, ItemExtraProps>(
	props: ImmutableEntityListTablePageRendererProps<ContainerExtraProps, ItemExtraProps>,
) => ReactElement

const EmptyTable = memo((props: { children: ReactNode }) => (
	<EmptyMessage>{props.children}</EmptyMessage>
))
EmptyTable.displayName = 'EmptyTable'

const Container = memo((props: RepeaterFieldContainerProps & Omit<TableProps, 'children'>) => {
	// TODO solve this via preferences
	const isEmpty = !Array.from(props.accessor).some(entity => entity instanceof EntityAccessor && entity.existsOnServer)

	if (isEmpty) {
		const EmptyMessageComponent = props.emptyMessageComponent || EmptyTable
		return (
			<EmptyMessageComponent {...props.emptyMessageComponentExtraProps}>
				{props.emptyMessage || 'There are no items to display.'}
			</EmptyMessageComponent>
		)
	}

	return <Table {...props} />
})
Container.displayName = 'Container'

const Row = memo((props: RepeaterItemProps & Omit<TableRowProps, 'children'> & { enableRemoving: boolean }) => (
	<TableRow {...props}>
		{props.children}
		{props.enableRemoving && (
			<TableCell shrunk>
				<DeleteEntityButton immediatePersist={true} />
			</TableCell>
		)}
	</TableRow>
))
Row.displayName = 'Row'