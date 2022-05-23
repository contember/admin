import { GraphQlBuilder } from '@contember/client'
import type { ReactElement, ReactNode } from 'react'
import { useField } from '../accessorPropagation'
import { MarkerFactory } from '../queryLanguage'
import type { FieldValue, SugaredRelativeSingleField } from '../treeParameters'
import { Component } from './Component'
import { TreeNodeEnvironmentHelper } from '../dao/TreeNodeEnvironmentHelper'

export interface FieldBasicProps extends SugaredRelativeSingleField {}

export interface FieldRuntimeProps<Persisted extends FieldValue = FieldValue> {
	format?: (value: Persisted | null) => ReactNode
}

export interface FieldProps<Persisted extends FieldValue = FieldValue>
	extends FieldBasicProps,
		FieldRuntimeProps<Persisted> {}

export const Field = Component(
	<Persisted extends FieldValue = FieldValue>(props: FieldProps<Persisted>) => {
		const field = useField<Persisted>(props)

		if (props.format !== undefined) {
			return <>{props.format(field.value)}</>
		}

		if (
			field.value instanceof GraphQlBuilder.GraphQlLiteral ||
			field.value === null ||
			typeof field.value === 'boolean'
		) {
			return null
		}
		return <>{field.value}</>
	},
	{
		generateLeafMarker: (props, environment) => MarkerFactory.createFieldMarker(props, environment),
		generateEnvironment: (props, environment) => {
			return TreeNodeEnvironmentHelper.createEnvironmentForField(props, environment)
		},
	},
	'Field',
) as <Persisted extends FieldValue = FieldValue>(props: FieldProps<Persisted>) => ReactElement
