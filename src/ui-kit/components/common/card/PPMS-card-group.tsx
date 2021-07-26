import React from "react";
import classnames from "classnames";

export const PPMSCardGroup = (
  props: JSX.IntrinsicElements["ul"]
): React.ReactElement => {
  const { children, className, ...ulProps } = props;

  const classes = classnames("usa-card-group", className);

  return (
    <ul className={classes} data-testid="PPMSCardGroup" {...ulProps}>
      {children}
    </ul>
  );
};

export default PPMSCardGroup;
