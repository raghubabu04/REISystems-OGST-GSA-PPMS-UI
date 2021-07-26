import React from "react";
import classnames from "classnames";
import { PPMSNavCloseButton } from "./PPMS-nav-close-button";
import { PPMSNavList } from "./PPMS-nav-list";

type ExtendedNavProps = {
  primaryItems: React.ReactNode[];
  secondaryItems: React.ReactNode[];
  tertiaryItems: React.ReactNode[];
  user?: string;
  onToggleMobileNav?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  mobileExpanded?: boolean;
};

export const PPMSExtendedNav = (
  props: ExtendedNavProps & JSX.IntrinsicElements["nav"]
): React.ReactElement => {
  const {
    primaryItems,
    secondaryItems,
    tertiaryItems,
    user,
    mobileExpanded = false,
    children,
    className,
    onToggleMobileNav,
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
    <>
      <nav title="header" className={classes} {...navProps}>
        <div className="usa-nav__inner">
          <PPMSNavCloseButton onClick={onToggleMobileNav} />
          <PPMSNavList
            key={"primary"}
            id={"primary"}
            identifier={"primary"}
            items={primaryItems}
            type="primary"
          />
          <div className="usa-nav__secondary">
            <PPMSNavList
              key={"secondary"}
              id={"secondary"}
              identifier={"secondary"}
              items={secondaryItems}
              type="secondary"
            />
            {children}
          </div>
          <div className="usa-nav__secondary usa-nav__tertiary">
            <PPMSNavList
              key={"tertiary"}
              id={"tertiary"}
              identifier={"tertiary"}
              items={tertiaryItems}
              type="tertiary"
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default PPMSExtendedNav;
