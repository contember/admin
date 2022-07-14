import classNames from 'classnames'
import { useMemo } from 'react'
import { useClassNamePrefix } from '../../auxiliary'
import { toSchemeClass, toThemeClass } from '../../utils'
import { PurposeEnum, supportedClassNameEnums, ViewContainerProps, ViewDisplayProps, ViewProps } from './Types'

type Return = [className: boolean | string | null, style: any]

const cssCustomPropertyRegExp = /^--\w+/

function normalizeCSSPropertyVar(value: unknown) {
  return typeof value === 'string' && cssCustomPropertyRegExp.test(value)
    ? `var(${value})`
    : value
}

function toClassNameStyle(value: unknown, enums: readonly string[]): Return {
  const className =
    (typeof value === 'string' && enums.indexOf(value) >= 0)
    ||
    typeof value === 'boolean'
      ? value
      : null
  const style = value !== null && value !== className
    ? normalizeCSSPropertyVar(value)
    : null

  return [className, style]
}

function align(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.align)
}

function backgroundColor(value: unknown, purpose: PurposeEnum | null | undefined): Return {
  return value === true && purpose
    ? toClassNameStyle(purpose, supportedClassNameEnums.purpose)
    : toClassNameStyle(value, supportedClassNameEnums.backgroundColor)
}

function basis(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.basis)
}

function borderColor(value: unknown, purpose: PurposeEnum | null | undefined): Return {
  return purpose
    ? toClassNameStyle(purpose, supportedClassNameEnums.purpose)
    : toClassNameStyle(value, supportedClassNameEnums.borderColor)
}

function borderWidth(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.borderWidth)
}

function border(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.border)
}

function borderRadius(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.borderRadius)
}

function color(value: unknown, purpose: PurposeEnum | null | undefined): Return {
  const [colorClassName, colorStyle] = toClassNameStyle(value, supportedClassNameEnums.color)
  const [purposeClassName] = toClassNameStyle(purpose, supportedClassNameEnums.purpose)

  return [(colorClassName === true && purposeClassName)
    ? purposeClassName
    : colorClassName, colorStyle]
}

function direction(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.direction)
}

function display(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.display)
}

function elevation(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.elevation)
}

function justify(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.justify)
}

function gap(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.gap)
}

function maxHeight(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.maxHeight)
}
function maxWidth(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.maxWidth)
}
function minHeight(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.minHeight)
}
function minWidth(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.minWidth)
}

function padding(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.padding)
}

function purpose(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.purpose)
}

function shrink(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.purpose)
}

function span(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.span)
}

function spanRows(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.spanRows)
}

function userSelect(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.userSelect)
}

function wrap(value: unknown): Return {
  return toClassNameStyle(value, supportedClassNameEnums.wrap)
}

const toViewClassNameStyle = {
  align,
  backgroundColor,
  basis,
  border,
  borderColor,
  borderWidth,
  borderRadius,
  color,
  direction,
  display,
  elevation,
  gap,
  justify,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  padding,
  purpose,
  shrink,
  span,
  spanRows,
  userSelect,
  wrap,
}

const pseudoStateRegExp = /^:+|:$/g

function normalizePseudoState(pseudoState?: string | null): string | null {
  return pseudoState ? `:${pseudoState.replace(pseudoStateRegExp, '')}` : ''
}

function withState(className: string | null | undefined, state: string | null | undefined): string | null {
  return className ? className + normalizePseudoState(state) : null
}

type UseViewPropsResult = [
  className: ViewProps['className'],
  style: ViewProps['style']
]

export function useViewProps(
  {
    align,
    backgroundColor,
    basis,
    border,
    borderColor,
    borderRadius,
    borderWidth,
    color,
    direction,
    display,
    elevation,
    gap,
    gapHorizontal,
    gapVertical,
    justify,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    padding,
    purpose,
    scheme,
    shrink,
    span,
    spanRows,
    style: styleProp,
    theme,
    themeContent,
    themeControls,
    userSelect,
    wrap,
    ...rest
  }: ViewDisplayProps & Pick<ViewContainerProps, 'style'>,
  pseudoState: string = '',
  falsyClassNameSuffix: string = 'none',
): UseViewPropsResult {
  // Intentionally unused:
  const emptyRestTypeGuard: { [Property in keyof Partial<ViewProps>]: never } = rest

  gapHorizontal = gapHorizontal ?? gap
  gapVertical = gapVertical ?? gap

  const scopeClassName = useClassNamePrefix().replace(/-+$/, '')
  const componentClassName = withState(scopeClassName, pseudoState) ?? scopeClassName

  return useMemo(() => {
    const style: {[key: string]: any } = {}
    const classNameList: {[key: string]: string | boolean | null} = {};

    [classNameList['background-color'], style.backgroundColor] = toViewClassNameStyle.backgroundColor(backgroundColor, purpose);
    [classNameList.border, style.border] = toViewClassNameStyle.border(border);
    [classNameList['border-color'], style.borderColor] = toViewClassNameStyle.borderColor(borderColor, purpose);
    [classNameList['border-radius'], style.borderRadius] = toViewClassNameStyle.borderRadius(borderRadius);
    [classNameList['border-width'], style.borderWidth] = toViewClassNameStyle.borderWidth(borderWidth);
    [classNameList.color, style.color] = toViewClassNameStyle.color(color, purpose);
    [classNameList.align, style.alignItems] = toViewClassNameStyle.align(align);
    [classNameList.basis, style.flexBasis] = toViewClassNameStyle.basis(basis);
    [classNameList.direction, style.flexDirection] = toViewClassNameStyle.direction(direction);
    [classNameList.display, style.display] = toViewClassNameStyle.display(display);
    [classNameList.elevation, style.boxShadow] = toViewClassNameStyle.elevation(elevation)

    if (gapHorizontal === gapVertical) {
      [classNameList.gap, style.gap] = toViewClassNameStyle.gap(gapHorizontal)
    } else {
      [classNameList['gap-horizontal'], style.rowGap] = toViewClassNameStyle.gap(gapHorizontal);
      [classNameList['gap-vertical'], style.columnGap] = toViewClassNameStyle.gap(gapVertical)
    }

    [classNameList.justify, style.justifyContent] = toViewClassNameStyle.justify(justify);
    [classNameList['max-height'], style.maxHeight] = toViewClassNameStyle.maxHeight(maxHeight);
    [classNameList['max-width'], style.maxWidth] = toViewClassNameStyle.maxWidth(maxWidth);
    [classNameList['min-height'], style.minHeight] = toViewClassNameStyle.minHeight(minHeight);
    [classNameList['min-width'], style.minWidth] = toViewClassNameStyle.minWidth(minWidth);
    [classNameList.padding, style.padding] = toViewClassNameStyle.padding(padding);
    [classNameList.shrink, style.flexShrink] = toViewClassNameStyle.shrink(shrink);

    [classNameList.span, style.gridColumn] = toViewClassNameStyle.span(span)

    if (typeof style.gridColumn === 'number') {
      style.flexGrow = style.gridColumn
      style.gridColumn = `span ${style.gridColumn}`
    }

    [classNameList['span-rows'], style.gridRow] = toViewClassNameStyle.spanRows(spanRows)

    if (typeof style.gridRow === 'number') {
      style.gridRow = `span ${style.gridRow}`
    }

    [classNameList['user-select'], style.userSelect] = toViewClassNameStyle.userSelect(userSelect);
    [classNameList.wrap, style.flexWrap] = toViewClassNameStyle.wrap(wrap)

    const allClassNames = classNames(
      !pseudoState ? null : toSchemeClass(scheme),
      withState(toThemeClass(themeContent ?? theme, themeControls ?? theme), pseudoState),
      Object.entries(classNameList).map(([base, variant]) => {
        if (variant === null) {
          return
        }

        return (
          variant === true
            ? `${componentClassName}-${base}`
            : variant === false
              ? `${componentClassName}-${base}:${falsyClassNameSuffix}`
              : `${componentClassName}-${base}:${variant}`
          )
      }),
    )

    return [
      allClassNames ? `${componentClassName} ${allClassNames}` : componentClassName,
      { ...style, ...styleProp },
    ]
  }, [
    align,
    backgroundColor,
    basis,
    border,
    borderColor,
    borderRadius,
    borderWidth,
    color,
    componentClassName,
    direction,
    display,
    elevation,
    falsyClassNameSuffix,
    gapHorizontal,
    gapVertical,
    justify,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    padding,
    pseudoState,
    purpose,
    scheme,
    shrink,
    span,
    spanRows,
    styleProp,
    theme,
    themeContent,
    themeControls,
    userSelect,
    wrap,
  ])
}
