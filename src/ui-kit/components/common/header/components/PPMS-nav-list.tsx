import React from "react";
import classnames from "classnames";

interface CustomNavListProps {
  items: React.ReactNode[];
  type?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "subnav"
    | "megamenu"
    | "footerSecondary";
  footerSecondary?: boolean;
  identifier?: string;
  index?: number;
}

export type NavListProps = CustomNavListProps & JSX.IntrinsicElements["ul"];

export const PPMSNavList = (props: NavListProps): React.ReactElement => {
  const {
    items,
    type,
    footerSecondary,
    className,
    identifier,
    index,
    ...ulProps
  } = props;

  const isPrimary = type ? type === "primary" : false;
  const isSecondary = type ? type === "secondary" : false;
  const isTertiary = type ? type === "tertiary" : false;
  const isSubnav = type ? type === "subnav" : false;
  const isMegamenu = type ? type === "megamenu" : false;
  const isFooterSecondary = type ? type === "footerSecondary" : footerSecondary;

  const ulClasses = classnames(
    {
      "usa-nav__primary usa-accordion": isPrimary,
      "usa-nav__primary usa-accordion usa-nav__tertiary": isTertiary,
      "usa-nav__secondary-links": isSecondary,
      "usa-nav__submenu": isSubnav,
      "usa-nav__submenu-list": isMegamenu,
      "usa-list usa-list--unstyled": isFooterSecondary,
    },
    className
  );

  const liClasses = classnames({
    "usa-nav__primary-item": isPrimary,
    "usa-nav__primary-item usa-nav__tertiary-item": isTertiary,
    "usa-nav__secondary-item": isSecondary,
    "usa-nav__submenu-item": isSubnav || isMegamenu,
    "usa-footer__secondary-link": isFooterSecondary,
  });

  return (
    <ul
      key={identifier}
      className={ulClasses}
      {...ulProps}
      id={`${ulProps.id}-${index ? index : ""}`}
    >
      {items.map((item, i) => (
        <li
          key={`${identifier}_item_${i}`}
          id={`${identifier}_item_${i}`}
          className={liClasses}
          data-index={i}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};
