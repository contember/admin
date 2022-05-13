import type { ComponentType, ReactElement, ReactNode } from 'react'
import { useEntityList } from '../accessorPropagation'
import { PRIMARY_KEY_NAME } from '../bindingTypes'
import { Environment } from '../dao'
import { MarkerFactory } from '../queryLanguage'
import type { SugaredRelativeEntityList } from '../treeParameters'
import { Component } from './Component'
import type { EntityBaseProps } from './Entity'
import { EntityList, EntityListBaseProps } from './EntityList'
import { Field } from './Field'

export type HasManyProps<ListProps = never, EntityProps = never> = SugaredRelativeEntityList & {
	children?: ReactNode
	variables?: Environment.ValuesMapWithFactory
} & (
		| {}
		| {
				listComponent: ComponentType<ListProps & EntityListBaseProps>
				listProps?: ListProps
		  }
	)

export const HasMany = Component(
	<ListProps, EntityProps>(props: HasManyProps<ListProps, EntityProps>) => {
		const entityList = useEntityList(props)

		return <EntityList {...props} accessor={entityList} />
	},
	{
		generateEnvironment: (props, oldEnvironment) => {
			return oldEnvironment.withVariables(props.variables)
		},
		staticRender: props => (
			<EntityList {...props} accessor={undefined as any}>
				<Field field={PRIMARY_KEY_NAME} />
				{props.children}
			</EntityList>
		),
		generateBranchMarker: (props, fields, environment) =>
			MarkerFactory.createRelativeEntityListFields(props, environment, fields),
	},
	'HasMany',
) as <ListProps, EntityProps>(props: HasManyProps<ListProps, EntityProps>) => ReactElement
