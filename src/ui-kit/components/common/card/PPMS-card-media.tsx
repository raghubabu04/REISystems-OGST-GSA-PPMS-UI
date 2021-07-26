import React from "react";
import classnames from "classnames";

interface CardMediaProps {
  exdent?: boolean;
  inset?: boolean;
  imageClass?: string;
  children: React.ReactNode;
}

export const PPMSCardMedia = (
  props: CardMediaProps & JSX.IntrinsicElements["div"]
): React.ReactElement => {
  const {
    exdent,
    inset,
    imageClass,
    children,
    className,
    ...mediaProps
  } = props;

  const classes = classnames(
    "usa-card__media flex-align-center",
    {
      "usa-card__media--exdent": exdent,
      "usa-card__media--inset": inset,
    },
    className
  );

  const imageClasses = classnames("usa-card__img", imageClass);

  return (
    <div className={classes} {...mediaProps} data-testid="PPMSCardMedia">
      <div className={imageClasses}>{children}</div>
    </div>
  );
};

export default PPMSCardMedia;
