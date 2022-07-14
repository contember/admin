import { Box, BoxOwnProps, Stack } from '@contember/ui'
import classNames from 'classnames'
import { ComponentType, memo, ReactNode } from 'react'

export interface EmptyMessageOuterProps {
	emptyMessage?: ReactNode
	emptyMessageComponent?: ComponentType<EmptyMessageComponentProps>
}

export interface EmptyMessageProps extends Omit<BoxOwnProps, 'children' | 'component'> {
	children: ReactNode
	component?: ComponentType<EmptyMessageComponentProps>
}

export interface EmptyMessageComponentProps extends Omit<BoxOwnProps, 'children'> {
	children: ReactNode
}

export const EmptyMessage = memo(({ children, component, className, ...boxProps }: EmptyMessageProps) => {
	const MessageComponent = component ?? EmptyMessageDefault
	return <MessageComponent className={classNames('cui-view-span-all', className)} {...boxProps}>{children}</MessageComponent>
})
EmptyMessage.displayName = 'EmptyMessage'

const EmptyMessageDefault = memo(({ children, intent = 'default', padding = 'with-padding', ...boxProps }: EmptyMessageComponentProps) => (
	<Box userSelect={false} {...boxProps} intent={intent} padding={padding}>
		<Stack
			direction="horizontal"
			justify="space-around"
		>{children}</Stack>
	</Box>
))
