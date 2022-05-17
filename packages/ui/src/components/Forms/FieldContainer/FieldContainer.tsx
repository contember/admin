import classNames from 'classnames'
import { memo, ReactNode } from 'react'
import { useClassNamePrefix } from '../../../auxiliary'
import type { NativeProps, Size } from '../../../types'
import { toEnumClass, toEnumViewClass, toThemeClass } from '../../../utils'
import { Stack, StackProps } from '../../Stack'
import { Description } from '../../Typography/Description'
import { Label } from '../../Typography/Label'
import { ErrorList, ErrorListProps } from '../ErrorList'
import type { FieldContainerLabelPosition } from './Types'

export interface FieldContainerProps extends ErrorListProps, Pick<NativeProps<HTMLDivElement>, 'className' | 'style'> {
	children: ReactNode // The actual field
	description?: ReactNode // Can explain e.g. the kinds of values to be filled
	direction?: StackProps['direction']
	gap?: Size | 'none'
	label: ReactNode
	labelDescription?: ReactNode // Expands on the label e.g. to provide the additional explanation
	labelPosition?: FieldContainerLabelPosition
	layout?: 'column' | 'fluid'
	required?: boolean
	size?: Size
	useLabelElement?: boolean
}

export const FieldContainer = memo(
	({
		children,
		className,
		description,
		direction = 'vertical',
		errors,
		gap = 'small',
		label,
		labelDescription,
		labelPosition,
		layout = 'column',
		required,
		size,
		useLabelElement = true,
		...rest
	}: FieldContainerProps) => {
		const LabelElement = useLabelElement ? 'label' : 'div'
		const componentClassName = `${useClassNamePrefix()}field-container`

		return (
			<div
				{...rest}
				className={classNames(
					`${componentClassName}`,
					toEnumViewClass(size),
					toEnumViewClass(labelPosition),
					toEnumClass('layout-', layout),
					errors?.length ? toThemeClass(null, 'danger') : null,
					className,
				)}
			>
				<LabelElement className={`${componentClassName}-label`}>
					{(label || labelDescription) && <span className={`${componentClassName}-header`}>
							{label && <Label>
								{label}
								<span className={`${componentClassName}-required-asterix ${toThemeClass('danger', 'danger')}`}>{required && '*'}</span>
							</Label>}
							{labelDescription && <Description>{labelDescription}</Description>}
						</span>
					}
					{(children || description) && <div className={`${componentClassName}-body`}>
						{children && <Stack
							className={`${componentClassName}-body-content`}
							direction={direction}
							gap={gap}
						>
							{children}
						</Stack>}
						{description && <span className={`${componentClassName}-body-content-description`}>{description}</span>}
					</div>}
				</LabelElement>
				{!!errors && errors.length > 0 && (
					<div className={`${componentClassName}-errors`}>
						<ErrorList errors={errors} />
					</div>
				)}
			</div>
		)
	},
)
FieldContainer.displayName = 'FieldContainer'
