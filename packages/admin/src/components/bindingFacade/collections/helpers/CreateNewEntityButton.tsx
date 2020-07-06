import { Button, ButtonBasedButtonProps, FormGroup, Icon, IconProps } from '@contember/ui'
import * as React from 'react'
import { EntityListAccessor, useMutationState } from '@contember/binding'

export type CreateNewEntityButtonProps = ButtonBasedButtonProps & {
	createNewEntity: EntityListAccessor.CreateNewEntity | undefined
	iconProps?: IconProps
}

const defaultIconProps: IconProps = {
	blueprintIcon: 'add',
	style: {
		marginRight: '0.2em',
		position: 'relative',
		top: '0.05em',
	},
}

export const CreateNewEntityButton = React.memo(
	({ createNewEntity, iconProps, children = 'Add', ...buttonProps }: CreateNewEntityButtonProps) => {
		const isMutating = useMutationState()

		if (!createNewEntity) {
			return null
		}
		return (
			<FormGroup label={undefined}>
				<Button
					// This looks silly but the event handler gets a different parameter than createNewEntity expects.
					onClick={() => createNewEntity?.()}
					disabled={isMutating}
					isLoading={isMutating}
					distinction="seamless"
					flow="block"
					justification="justifyStart"
					{...buttonProps}
				>
					<Icon {...defaultIconProps} {...iconProps} />
					{children}
				</Button>
			</FormGroup>
		)
	},
)