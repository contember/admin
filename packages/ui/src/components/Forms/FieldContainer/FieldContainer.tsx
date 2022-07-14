import classNames from 'classnames'
import { memo, ReactNode } from 'react'
import { useClassNamePrefix } from '../../../auxiliary'
import type { ControlDistinction, Default, Size } from '../../../types'
import { toEnumClass, toEnumViewClass, toFeatureClass, toStateClass, toThemeClass } from '../../../utils'
import { Stack, StackOwnProps } from '../../Stack'
import { Description } from '../../Typography/Description'
import { Label } from '../../Typography/Label'
import { View, ViewContainerProps, ViewProps } from '../../View'
import { ErrorList, ErrorListProps } from '../ErrorList'
import type { FieldContainerLabelPosition } from './Types'

export type FieldContainerViewProps = Omit<ViewProps, 'gap' | 'direction' | keyof ViewContainerProps>

export type FieldContainerOwnProps =
	& ViewContainerProps
	& ErrorListProps
	& Partial<Pick<StackOwnProps,
		| 'direction'
		| 'evenly'
		| 'gap'
		| 'wrap'
	>>
	& {
		states?: ('hover' | 'focus')[]
		distinction?: ControlDistinction
		description?: ReactNode // Can explain e.g. the kinds of values to be filled
		footer?: ReactNode
		label: ReactNode
		labelDescription?: ReactNode // Expands on the label e.g. to provide the additional explanation
		labelPosition?: FieldContainerLabelPosition
		required?: boolean
		scrollable?: boolean
		size?: Size
		useLabelElement?: boolean
		width?: 'column' | 'fluid' | 'none'
	}

export type FieldContainerProps = FieldContainerOwnProps & FieldContainerViewProps

type Layout = 'vertical' | 'horizontal' | 'horizontal-middle' | 'horizontal-inline'

export const FieldContainer = memo(
	({
		basis,
		children,
		className,
		color,
		description,
		direction = 'vertical',
		distinction,
		errors,
		evenly,
		footer,
		gap = 'small',
		id,
		label,
		labelDescription,
		labelPosition,
		maxHeight,
		maxWidth,
		required,
		scrollable,
		span,
		shrink,
		spanRows,
		states = [],
		style,
		theme,
		themeContent,
		themeControls,
		useLabelElement = true,
		width = 'column',
		wrap,
		...rest
	}: FieldContainerProps) => {
		const LabelElement = useLabelElement ? 'label' : 'div'
		const componentClassName = `${useClassNamePrefix()}field-container`

		const layout: Layout = labelPosition === 'labelLeft' || labelPosition === 'labelRight'
			? !labelDescription
				? 'horizontal-middle'
				: 'horizontal'
			: labelPosition === 'labelInlineLeft' || labelPosition === 'labelInlineRight'
				? 'horizontal-inline'
				: 'vertical'

		const errorsClassName = errors?.length ? toThemeClass(null, 'danger') : null

		return (
			<View
				id={id}
				basis={basis}
				color={color}
				display={layout === 'horizontal-inline' ? 'inline' : 'block'}
				direction="vertical"
				className={classNames(
					`${componentClassName}`,
					toEnumClass('width-', width === 'none' ? undefined : layout === 'horizontal-inline' ? undefined : width),
					toFeatureClass('hover', states.includes('hover')),
					toFeatureClass('focus', states.includes('focus')),
					className,
				)}
				maxHeight={maxHeight}
				maxWidth={maxWidth}
				theme={theme}
				themeContent={themeContent}
				themeControls={themeControls}
				shrink={shrink}
				span={span}
				spanRows={spanRows}
				style={style}
			>
				<LabelElement className={classNames(
					`${componentClassName}-inner`,
					toEnumClass('layout-', layout),
					toEnumViewClass(labelPosition),
				)}>
					{label || labelDescription
						? <View
							color="inherit"
							className={`${componentClassName}-header`}
							gap="none"
							justify={layout === 'horizontal-inline' || layout === 'horizontal-middle'
								? 'center'
								: null
							}
						>
							{label && <Label className={classNames(`${componentClassName}-label`, errorsClassName)}>
							{label}
							{required && <View display="inline" className={`${componentClassName}-required-asterix ${toThemeClass('danger', 'danger')}`}>{required && '*'}</View>}
						</Label>}
						{labelDescription && <Description className={`${componentClassName}-label-description`}>{labelDescription}</Description>}
					</View>
					: null}

					{(children || description || errors)
						? <View
							className={classNames(
								`${componentClassName}-body`,
								toEnumViewClass(distinction),
							)}
							gap="small"
						>
							{children && <Stack
								{...rest}
								className={classNames(
									`${componentClassName}-body-contents`,
									toStateClass('scrollable', scrollable),
									errorsClassName,
								)}
								evenly={evenly}
								direction={direction}
								wrap={wrap}
								gap={gap}
							>
								{children}
							</Stack>}
							{!!errors && errors.length > 0 && (
								<View className={`${componentClassName}-errors`}>
									<ErrorList errors={errors} />
								</View>
							)}
							{description && <View className={`${componentClassName}-description`}>{description}</View>}
						</View>
						: null
					}
					{footer && (
						<View className={`${componentClassName}-footer`}>
							{footer}
						</View>
					)}
				</LabelElement>
			</View>
		)
	},
)
FieldContainer.displayName = 'FieldContainer'
