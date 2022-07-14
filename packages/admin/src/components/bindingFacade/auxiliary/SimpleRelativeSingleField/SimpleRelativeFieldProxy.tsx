import { SugaredRelativeSingleField, useEnvironment, useField, useMutationState } from '@contember/binding'
import { FieldContainer, FieldContainerOwnProps } from '@contember/ui'
import { memo, ReactNode, useMemo } from 'react'
import { useLabelMiddleware } from '../../environment/LabelMiddleware'
import { useAccessorErrors } from '../../errors'
import type { SimpleRelativeSingleFieldMetadata } from './SimpleRelativeSingleField'

export type SimpleRelativeSingleFieldProxyProps =
	& FieldContainerOwnProps
	& SugaredRelativeSingleField & {
		render: (fieldMetadata: SimpleRelativeSingleFieldMetadata<any>, props: any) => ReactNode
	}

export const SimpleRelativeSingleFieldProxy = memo(
	({ render, label, ...props }: SimpleRelativeSingleFieldProxyProps) => {
		const environment = useEnvironment()
		const field = useField(props)
		const labelMiddleware = useLabelMiddleware()
		const normalizedLabel = useMemo(() => labelMiddleware(label), [labelMiddleware, label])
		const isMutating = useMutationState()

		const fieldMetadata: SimpleRelativeSingleFieldMetadata = useMemo(
			() => ({
				field,
				environment,
				isMutating,
			}),
			[environment, field, isMutating],
		)

		const fieldErrors = useAccessorErrors(field)
		const rendered = render(fieldMetadata, props)

		return rendered
			? (
				<FieldContainer
					{...props}
					errors={fieldErrors}
					label={normalizedLabel}
				>
					{rendered}
				</FieldContainer>
			)
			: null
	},
)
SimpleRelativeSingleFieldProxy.displayName = 'SimpleRelativeSingleFieldProxy'
