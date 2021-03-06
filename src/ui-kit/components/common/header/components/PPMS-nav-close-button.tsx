import React from "react";

// assets
import closeImg from "uswds/src/img/close.svg";

export const PPMSNavCloseButton = (
  props: JSX.IntrinsicElements["button"]
): React.ReactElement => {
  const { onClick, ...buttonProps } = props;

  return (
    <button
      className="usa-nav__close"
      onClick={onClick}
      data-testid="navCloseButton"
      {...buttonProps}
      type="button"
      aria-labelledby={"navClose-button"}
    >
      <img src={closeImg} alt="close" />
    </button>
  );
};
