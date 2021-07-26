import React from "react";
import classnames from "classnames";

type NavDropDownButtonProps = {
  label: string;
  icon: Element;
  index: any;
  /*
    Element (i.e. menu) id already present in DOM that will be controlled by this button
  */
  menuId: string;
  isOpen: boolean;
  onToggle: () => void;
  isCurrent?: boolean;
};

export const PPMSNavDropDownButton = (
  props: NavDropDownButtonProps & JSX.IntrinsicElements["button"]
): React.ReactElement => {
  const {
    label,
    icon,
    menuId,
    isOpen,
    onToggle,
    isCurrent,
    className,
    index,
    ...buttonProps
  } = props;

  const classes = classnames(
    "usa-accordion__button",
    "usa-nav__link",
    {
      "usa-current": isCurrent,
    },
    className
  );
  return (
    <button
      data-testid="navDropDownButton"
      className={classes}
      aria-expanded={isOpen}
      aria-controls={menuId}
      onClick={(): void => onToggle()}
      {...buttonProps}
      type="button"
      key={menuId}
      id={menuId}
      data-index={index}
    >
      <span data-index={index}>
        {icon} {label}
      </span>
    </button>
  );
};

export default PPMSNavDropDownButton;
