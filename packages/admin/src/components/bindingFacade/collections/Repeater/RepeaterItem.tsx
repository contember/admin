import { BindingError, RemovalType } from '@contember/binding'
import { RepeaterItemContainer, RepeaterItemContainerOwnProps, ViewContainerProps } from '@contember/ui'
import { memo, ReactNode } from 'react'
import { DeleteEntityButton } from '../helpers'

export interface RepeaterItemProps
	extends Omit<RepeaterItemContainerOwnProps, 'actions' | 'children'>,
	ViewContainerProps {
		actions?: ReactNode
		canBeRemoved: boolean
		removalType?: RemovalType
	}

export const RepeaterItem = memo(
	({
		actions,
		canBeRemoved,
		children,
		removalType,
		...rest
}: RepeaterItemProps) => {
		if (removalType !== 'delete') {
			throw new BindingError(
				`As a temporary limitation, <Repeater /> can currently only delete its items, not disconnect them. ` +
					`This restriction is planned to be lifted sometime in future.`,
			)
		}

		return (
			<RepeaterItemContainer
				{...rest}
				actions={<>
					{actions}
					{canBeRemoved ? <DeleteEntityButton /> : undefined}
				</>}
			>
				{children}
			</RepeaterItemContainer>
		)
	},
)
RepeaterItem.displayName = 'RepeaterItem'
