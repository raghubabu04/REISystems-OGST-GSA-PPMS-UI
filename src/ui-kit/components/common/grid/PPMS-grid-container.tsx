import React from 'react'
import classnames from 'classnames'
import { ContainerSizes } from './constants/types';


type GridContainerProps = {
  containerSize?: ContainerSizes
}

export const PPMSGridContainer = ({
  children,
  containerSize,
  className,
  ...props
}: GridContainerProps &
  React.HTMLAttributes<HTMLDivElement>): React.ReactElement => {
  const classes = classnames(
    {
      'grid-container': !containerSize,
      [`grid-container-${containerSize}`]: !!containerSize,
    },
    className
  )

  return (
    <div className={classes} data-testid="gridContainer" {...props}>
      {children}
    </div>
  )
}
