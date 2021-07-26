import React from "react";

import { NavListProps, PPMSNavList } from "./PPMS-nav-list";

type MegaMenuProps = {
  items: React.ReactNode[][];
  isOpen: boolean;
};

export const PPMSMegaMenu = (
  props: MegaMenuProps & NavListProps
): React.ReactElement => {
  const { items, isOpen, type, ...navListProps } = props;
  return (
    <div
      className={`usa-nav__submenu${
        type === "tertiary" ? " usa-nav__submenu__tertiary" : " usa-megamenu"
      }`}
      hidden={!isOpen}
      data-testid="megamenu"
    >
      <div className="grid-row grid-gap-4">
        {items.map((listItems, i) => (
          <div className="usa-col-auto" key={`subnav_col_${i}`}>
            <PPMSNavList
              key={"mega-menu-" + i}
              identifier={"mega" + i + " " + props.id}
              items={listItems}
              type="megamenu"
              index={i}
              {...navListProps}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PPMSMegaMenu;
