import type { EntityAccessor, EntityListAccessor } from '@contember/binding'
import { FieldContainer, FieldContainerOwnProps } from '@contember/ui'
import { ComponentType, memo, ReactNode } from 'react'
import type { MessageFormatter } from '../../../../i18n'
import { AccessorErrors } from '../../errors'
import { AddEntityButtonProps, CreateNewEntityButton, CreateNewEntityButtonProps, EmptyMessage, EmptyMessageOuterProps } from '../helpers'
import type { RepeaterDictionary } from './repeaterDictionary'

export type RepeaterFieldContainerPublicProps =
	& EmptyMessageOuterProps
	& AddEntityButtonProps
	& {
		compact?: boolean
		enableAddingNew?: boolean
		scrollable?: boolean
	}

export interface RepeaterFieldContainerPrivateProps extends FieldContainerOwnProps {
	accessor: EntityListAccessor
	entities: EntityAccessor[]
	formatMessage: MessageFormatter<RepeaterDictionary>
	isEmpty: boolean
	/**
	 * @deprecated Use label instead
	 */
	boxLabel?: ReactNode
	createNewEntity: (initialize?: EntityAccessor.BatchUpdatesHandler) => void
}

export type RepeaterFieldContainerProps =
	& RepeaterFieldContainerPublicProps
	& RepeaterFieldContainerPrivateProps

const compactFieldContainerProps = {
	align: 'stretch',
	backgroundColor: 'var(--cui-color--lower)',
	border: true,
	borderColor: 'transparent',
	borderRadius: true,
	gap: 'border',
}

export const RepeaterFieldContainer = memo(
	({
		accessor,
		addButtonComponent: AddButton = CreateNewEntityButton,
		addButtonComponentExtraProps,
		addButtonProps,
		addButtonText,
		boxLabel,
		children,
		compact,
		createNewEntity,
		direction = 'vertical',
		emptyMessage,
		emptyMessageComponent,
		enableAddingNew = true,
		entities,
		formatMessage,
		isEmpty,
		label,
		...rest
	}: RepeaterFieldContainerProps) => (
		<FieldContainer
			{...(compact ? compactFieldContainerProps : undefined)}
			{...rest}
			direction={direction}
			footer={enableAddingNew && (
				<AddButton
					{...addButtonComponentExtraProps}
					{...addButtonProps}
					createNewEntity={createNewEntity}
				>
					{addButtonText ?? label ?? formatMessage('repeater.addButton.text')}
				</AddButton>
			)}
			label={ label ?? boxLabel}
			useLabelElement={ false}
		>
			<AccessorErrors accessor={accessor} />
			{isEmpty && (
				<EmptyMessage border={compact ? false : undefined} component={emptyMessageComponent}>{formatMessage(emptyMessage, 'repeater.emptyMessage.text')}</EmptyMessage>
			)}

			{isEmpty || children}

		</FieldContainer>
	),
)
RepeaterFieldContainer.displayName = 'RepeaterFieldContainer'
