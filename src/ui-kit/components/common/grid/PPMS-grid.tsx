import React from 'react'
import classnames from 'classnames'
import { BreakpointKeys, breakpoints, GridItemProps } from './constants/types';



export type GridProps = GridItemProps &
  {
    [P in BreakpointKeys]?: GridItemProps
  }

export type GridLayoutProp = {
  gridLayout?: GridProps
}

export const getGridClasses = (
  itemProps: GridItemProps = {},
  breakpoint?: BreakpointKeys
): string => {
  // eslint-disable-next-line security/detect-object-injection
  const prefix = breakpoint ? `${breakpoints[breakpoint]}:` : ''
  const { row, col, gap, offset } = itemProps
  return classnames({
    [`${prefix}grid-row`]: row,
    [`${prefix}grid-gap`]: gap === true,
    [`${prefix}grid-gap-${gap}`]: gap !== true && !!gap,
    [`${prefix}grid-col`]: col === true,
    [`${prefix}grid-col-${col}`]: col !== true && !!col,
    [`${prefix}grid-offset-${offset}`]: !!offset,
  })
}

export const applyGridClasses = (gridLayout: GridProps): string => {
  let classes = getGridClasses(gridLayout)

  Object.keys(breakpoints).forEach((b) => {
    const bp = b as BreakpointKeys
    if (Object.prototype.hasOwnProperty.call(gridLayout, bp)) {
      // eslint-disable-next-line security/detect-object-injection
      let bpProps: GridItemProps;
      bpProps = gridLayout[bp] as GridItemProps;
      classes = classnames(classes, getGridClasses(bpProps, bp))
    }
  })

  return classes
}

export const PPMSGrid = ({
  children,
  className,
  ...props
}: GridProps & React.HTMLAttributes<HTMLDivElement>): React.ReactElement => {
  const {
    row,
    col,
    gap,
    offset,
    mobile,
    mobileLg,
    tablet,
    tabletLg,
    desktop,
    desktopLg,
    widescreen,
    ...otherProps
  } = props

  const itemProps = {
    row,
    col,
    gap,
    offset,
  }

  const breakpointProps = {
    mobile,
    mobileLg,
    tablet,
    tabletLg,
    desktop,
    desktopLg,
    widescreen,
  }
  let classes = getGridClasses(itemProps)

  Object.keys(breakpoints).forEach((b) => {
    const bp = b as BreakpointKeys
    if (Object.prototype.hasOwnProperty.call(breakpointProps, bp)) {
      // eslint-disable-next-line security/detect-object-injection
      let bpProps: GridItemProps;
      bpProps = props[bp] as GridItemProps;
      classes = classnames(classes, getGridClasses(bpProps, bp))
    }
  })

  // Pass in any custom classes
  classes = classnames(classes, className)

  return (
    <div className={classes} data-testid="grid" {...otherProps}>
      {children}
    </div>
  )
}
