import classNames from 'classnames'
import { ComponentType, memo, ReactNode } from 'react'
import { useClassNamePrefix } from '../../auxiliary'
import { toStateClass, toViewClass } from '../../utils'
import { Box, BoxOwnProps } from '../Box'
import { Icon } from '../Icon'
import { Stack, StackOwnProps } from '../Stack'
import { Label } from '../Typography/Label'

export interface RepeaterItemContainerOwnProps {
	actions?: ReactNode
	children: ReactNode
	compact?: boolean
	direction?: StackOwnProps['direction']
	dragHandleComponent?: ComponentType<{ children: ReactNode }>
	label?: ReactNode
	scrollable?: boolean
}

export type RepeaterItemContainerProps =
	& RepeaterItemContainerOwnProps
	& BoxOwnProps


export const RepeaterItemContainer = memo(({
	actions,
	children,
	className,
	compact,
	gap = true,
	direction,
	dragHandleComponent: Handle,
	label,
	...props
}: RepeaterItemContainerProps) => {
	const componentClassName = `${useClassNamePrefix()}repeater-item-container`

	return (
		<Box
			{...props}
			gap={gap}
			className={classNames(
				componentClassName,
				toViewClass('sortable', !!Handle),
				toStateClass('compact', compact),
				className,
			)}
		>
			{Handle && (
				<div className={`${componentClassName}-handle`}>
					<Handle>
						<Icon blueprintIcon="drag-handle-vertical" />
					</Handle>
				</div>
			)}
			{(label || actions) && <div className={`${componentClassName}-header`}>
				{label && (
					<div className={`${componentClassName}-label`}>
						<Label>
							{label}
						</Label>
					</div>
				)}
				{actions && <div className={`${componentClassName}-actions`}>{actions}</div>}
			</div>}
			<Stack
				span
				className={`${componentClassName}-content`}
				direction={direction}
				gap={gap}
			>
				{children}
			</Stack>
		</Box>
	)
})
RepeaterItemContainer.displayName = 'RepeaterItemContainer'
