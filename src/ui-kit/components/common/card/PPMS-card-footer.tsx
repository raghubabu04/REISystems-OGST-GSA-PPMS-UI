import React from "react";
import classnames from "classnames";

export const PPMSCardFooter = (
  props: { exdent?: boolean } & JSX.IntrinsicElements["div"]
): React.ReactElement => {
  const { exdent, children, className, ...footerProps } = props;

  const classes = classnames(
    "usa-card__footer",
    {
      "usa-card__footer--exdent": exdent,
    },
    className
  );

  return (
    <div className={classes} {...footerProps} data-testid="PPMSCardFooter">
      {children}
    </div>
  );
};

export default PPMSCardFooter;
