import React from "react";
import { PPMSNavList, NavListProps } from "./PPMS-nav-list";

type MenuProps = {
  items: React.ReactNode[];
  isOpen: boolean;
};

export const PPMSMenu = (
  props: MenuProps & NavListProps
): React.ReactElement => {
  const { items, isOpen, ...navListProps } = props;
  return (
    <PPMSNavList
      items={items}
      identifier={"subnav"}
      type="subnav"
      hidden={!isOpen}
      {...navListProps}
    />
  );
};

export default PPMSMenu;
