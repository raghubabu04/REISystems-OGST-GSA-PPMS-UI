import React from "react";
import classnames from "classnames";
import { PPMSNavCloseButton } from "./PPMS-nav-close-button";
import { PPMSNavList } from "./PPMS-nav-list";

type PrimaryNavProps = {
  items: React.ReactNode[];
  onToggleMobileNav?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  mobileExpanded?: boolean;
};

export const PPMSPrimaryNav = (
  props: PrimaryNavProps & JSX.IntrinsicElements["nav"]
): React.ReactElement => {
  const {
    items,
    onToggleMobileNav,
    mobileExpanded,
    children,
    className,
    ...navProps
  } = props;

  const classes = classnames(
    "usa-nav",
    {
      "is-visible": mobileExpanded,
    },
    className
  );

  return (
    <nav className={classes} {...navProps}>
      <PPMSNavCloseButton onClick={onToggleMobileNav} />
      <PPMSNavList items={items} type="primary" identifier={"onmobilenav"} />
      {children}
    </nav>
  );
};

export default PPMSPrimaryNav;
