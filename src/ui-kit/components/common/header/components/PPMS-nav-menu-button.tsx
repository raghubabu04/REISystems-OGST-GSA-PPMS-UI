import React from "react";

interface NavMenuButtonProps {
  label: React.ReactNode;
}

export const PPMSNavMenuButton = (
  props: NavMenuButtonProps & JSX.IntrinsicElements["button"]
): React.ReactElement => {
  const { label, onClick, ...buttonProps } = props;

  return (
    <button
      id={label + "-button"}
      className="usa-menu-btn"
      onClick={onClick}
      data-testid="navMenuButton"
      {...buttonProps}
      type="button"
    >
      {label}
    </button>
  );
};
