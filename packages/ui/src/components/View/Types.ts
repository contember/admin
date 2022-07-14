import { CSSProperties } from 'react'
import { Intent, NativeProps, Scheme } from '../../types'
export interface ThemeScheme {
	scheme?: Scheme
	theme?: Intent
	themeContent?: Intent
	themeControls?: Intent
}

export const supportedClassNameEnums = Object.freeze({
  align: <const> [
    'baseline',
    'center',
    'end',
    'flex-end',
    'flex-start',
    'inherit',
    'initial',
    'normal',
    'revert',
    'self-end',
    'self-start',
    'start',
    'stretch',
    'unset',
  ],
  backgroundColor: <const> ['none', 'transparent', 'inherit'],
  basis: <const> [
    'auto',
    'content',
    'fit-content',
    'max-content',
    'min-content',
  ],
  border: <const> [],
  borderColor: <const> ['none', 'transparent', 'inherit'],
  // TODO: To be defined based on the new design tokens like `strong`, `light`, etc.
  borderWidth: <const> [],
  color: <const> ['none', 'transparent', 'inherit', 'strong', 'high', 'medium', 'low', 'lower'],
  direction: <const> ['horizontal', 'vertical', 'horizontal-reverse', 'vertical-reverse'],
  display: <const> [
    'block',
    'contents',
    'flex',
    'grid',
    'inline',
    'inline-block',
    'inline-flex',
    'inline-grid',
    'none',
  ],
  // TODO: To be defined based on the new design tokens like `primary`, `glow`, etc.
  elevation: <const> [],
  gap: <const> ['none', 'border', 'small', 'large', 'xlarge'],
  justify: <const> [
    'center',
    'end',
    'flex-end',
    'flex-start',
    'inherit',
    'initial',
    'left',
    'normal',
    'revert',
    'right',
    'space-around',
    'space-between',
    'space-evenly',
    'start',
    'stretch',
    'unset',
  ],
  maxHeight: <const> ['control', 'small-control', 'large-control', 'fit-content', 'max-content', 'min-content', 'none'],
  minHeight: <const> ['control', 'small-control', 'large-control', 'fit-content', 'max-content', 'min-content', 'none'],
  maxWidth: <const> ['control', 'small-control', 'large-control', 'fit-content', 'max-content', 'min-content', 'none'],
  minWidth: <const> ['control', 'small-control', 'large-control', 'fit-content', 'max-content', 'min-content', 'none'],
  padding: <const> ['none', 'border', 'small', 'large', 'xlarge'],
  borderRadius: <const> ['none', 'border', 'small', 'large', 'xlarge', 'full'],
  purpose: <const> [
    'above',
    'below',
    'toned',
    'filled',
    'filled-primary',
    'control',
    'toned-control',
    'filled-control',
    'filled-primary-control',
  ],
  shrink: <const> ['inherit', 'initial', 'revert', 'unset'],
  span: <const> [
    'auto',
    'inherit',
    'initial',
    'revert',
    'revert-layer',
    'unset',
    'all',
    'none',
  ],
  spanRows: <const> [
    'auto',
    'inherit',
    'initial',
    'revert',
    'revert-layer',
    'unset',
    'all',
    'none',
  ],
  userSelect: <const> ['all', 'auto', 'contain', 'element', 'none', 'text'],
  wrap: <const> [
    'wrap',
    'inherit',
    'initial',
    'revert',
    'unset',
    'nowrap',
    'wrap-reverse',
  ],
})

export type AlignEnum = typeof supportedClassNameEnums['align'][number]
export type BasisEnum = typeof supportedClassNameEnums['basis'][number]
export type BackgroundColorEnum = typeof supportedClassNameEnums['backgroundColor'][number]
export type BorderEnum = typeof supportedClassNameEnums['border'][number]
export type BorderColorEnum = typeof supportedClassNameEnums['borderColor'][number]
export type BorderWidthEnum = typeof supportedClassNameEnums['borderWidth'][number]
export type BorderRadiusEnum = typeof supportedClassNameEnums['borderRadius'][number]
export type ColorEnum = typeof supportedClassNameEnums['color'][number]
export type GapEnum = typeof supportedClassNameEnums['gap'][number]
export type DirectionEnum = typeof supportedClassNameEnums['direction'][number]
export type DisplayEnum = typeof supportedClassNameEnums['display'][number]
export type ElevationEnum = typeof supportedClassNameEnums['elevation'][number]
export type JustifyEnum = typeof supportedClassNameEnums['justify'][number]
export type MaxHeight = typeof supportedClassNameEnums['maxHeight'][number]
export type MinHeight = typeof supportedClassNameEnums['minHeight'][number]
export type MaxWidth = typeof supportedClassNameEnums['maxWidth'][number]
export type MinWidth = typeof supportedClassNameEnums['minWidth'][number]
export type PaddingEnum = typeof supportedClassNameEnums['padding'][number]
export type PurposeEnum = typeof supportedClassNameEnums['purpose'][number]
export type ShrinkEnum = typeof supportedClassNameEnums['shrink'][number]
export type SpanEnum = typeof supportedClassNameEnums['span'][number]
export type SpanRowsEnum = typeof supportedClassNameEnums['spanRows'][number]
export type UserSelectEnum = typeof supportedClassNameEnums['userSelect'][number]
export type WrapEnum = typeof supportedClassNameEnums['wrap'][number]

export type ViewAlign = CSSProperties['alignItems'] | AlignEnum
export type ViewBackgroundColor = string | boolean | BackgroundColorEnum
export type ViewBorder = CSSProperties['border'] | boolean | BorderEnum
export type ViewBorderColor = string | boolean | BorderColorEnum
export type ViewBorderWidth = string | BorderWidthEnum
export type ViewBorderRadius = CSSProperties['borderRadius'] | boolean | BorderRadiusEnum
export type ViewBasis = CSSProperties['flexBasis'] | BasisEnum
export type ViewColor = string | boolean | ColorEnum
export type ViewDirection = DirectionEnum
export type ViewDisplay = string | DisplayEnum
export type ViewElevation = boolean | ElevationEnum
export type ViewGap = CSSProperties['gap'] | boolean | GapEnum
export type ViewGapHorizontal = CSSProperties['rowGap'] | boolean | GapEnum
export type ViewGapVertical = CSSProperties['columnGap'] | boolean | GapEnum
export type ViewJustify = JustifyEnum
export type ViewMaxHeight = CSSProperties['maxHeight'] | MaxHeight
export type ViewMaxWidth = CSSProperties['maxWidth'] | MinHeight
export type ViewMinHeight = CSSProperties['minHeight'] | MaxWidth
export type ViewMinWidth = CSSProperties['minWidth'] | MinWidth
export type ViewPadding = CSSProperties['padding'] | PaddingEnum
export type ViewPurpose = PurposeEnum
export type ViewShrink = CSSProperties['flexShrink'] | boolean | ShrinkEnum
export type ViewSpan = boolean | string | number | SpanEnum
export type ViewSpanRows = string | number | SpanRowsEnum
export type ViewUserSelect = UserSelectEnum
export type ViewWrap = boolean | WrapEnum

type DivProps = NativeProps<HTMLDivElement>

export type PublicContainerPropNames =
	| 'style'
  | 'children'
  | 'className'
  | 'id'

export interface ViewDisplayProps extends ThemeScheme {
	align?: ViewAlign | null
	backgroundColor?: ViewBackgroundColor | null
	border?: ViewBorder | null
	borderColor?: ViewBorderColor | null
	borderRadius?: ViewBorderRadius | boolean | null
	borderWidth?: ViewBorderWidth | null
	basis?: ViewBasis | null
	color?: ViewColor | null
	direction?: ViewDirection | null
	display?: ViewDisplay | null
  elevation?: ViewElevation | null
	gap?: ViewGap | null
	gapHorizontal?: ViewGapHorizontal | null
	gapVertical?: ViewGapVertical | null
	justify?: ViewJustify | null
	maxHeight?: ViewMaxHeight | null
	maxWidth?: ViewMaxWidth | null
	minHeight?: ViewMinHeight | null
	minWidth?: ViewMinWidth | null
	padding?: ViewPadding | boolean | null
	purpose?: ViewPurpose | null
	shrink?: ViewShrink | null
	span?: ViewSpan | null
	spanRows?: ViewSpanRows | null
  userSelect?: ViewUserSelect | boolean | null
	wrap?: ViewWrap | null
}

export interface ViewOwnProps extends ViewDisplayProps {
  active?: boolean
  activeProps?: ViewDisplayProps
  component?: keyof JSX.IntrinsicElements
  focus?: boolean
  focusProps?: ViewDisplayProps
  hover?: boolean
  hoverProps?: ViewDisplayProps
}

export interface ViewContainerProps extends Pick<DivProps, PublicContainerPropNames> {}

export interface ViewProps extends ViewOwnProps, ViewContainerProps {}

export type AllViewProps = Pick<DivProps, PublicContainerPropNames | 'contentEditable'> & ViewProps
