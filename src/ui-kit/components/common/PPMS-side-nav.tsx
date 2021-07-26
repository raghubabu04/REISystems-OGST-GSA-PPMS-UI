import React from "react";
type SideNavProps = {
  items: React.ReactNode[];
};

export const PPMSSideNav = ({ items }: SideNavProps): React.ReactElement => {
  const getNavList = (items, i, sideNavClass) => {
    if (Array.isArray(items)) {
      let itemMap = items.map((item, index) => {
        return getNavList(item, index, sideNavClass);
      });
      return (
        <ul className={"usa-sidenav__sublist"} data-testid="sidenav">
          {itemMap}
        </ul>
      );
    } else {
      return (
        <li key={`sidenav_item_${i}`} className={`${sideNavClass}`}>
          {items}
        </li>
      );
    }
  };
  return (
    <ul className={"usa-sidenav"} data-testid="sidenav">
      {items.map((item: any, i) => {
        const sideNavClass: string = item?.props?.invalid
          ? "item__error"
          : item?.props?.valid
          ? "item__success"
          : "item";
        return getNavList(item, i, sideNavClass);
      })}
    </ul>
  );
};
