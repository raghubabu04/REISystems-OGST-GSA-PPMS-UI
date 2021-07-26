import React from "react";
import classnames from "classnames";

interface CardProps {
  layout?: "standardDefault" | "flagDefault" | "flagMediaRight";
  headerFirst?: boolean;
  noHeaderSalesLayout?: boolean;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const PPMSCard = (
  props: CardProps & JSX.IntrinsicElements["li"]
): React.ReactElement => {
  const {
    layout = "standardDefault",
    headerFirst,
    children,
    className,
    containerProps,
    noHeaderSalesLayout,
    ...liProps
  } = props;

  const { className: containerClass, ...restContainerProps } =
    containerProps || {};

  const classes = classnames(
    "usa-card",
    {
      "usa-card--header-first": headerFirst,
      "usa-card--flag": layout === "flagDefault" || layout === "flagMediaRight",
      "usa-card--media-right": layout === "flagMediaRight",
    },
    className
  );

  const containerClasses = classnames(
    `${noHeaderSalesLayout ? "" : ""} usa-card__container`,
    containerClass
  );

  return (
    //Todo: add id to the list (each child in a list should have unique 'key' props)
    <li className={classes} data-testid="PPMSCard" {...liProps}>
      <div className={containerClasses} {...restContainerProps}>
        {children}
      </div>
    </li>
  );
};

export default PPMSCard;
