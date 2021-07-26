import React, { useState } from "react";
import classnames from "classnames";

interface AccordionItem {
  title: React.ReactNode | string;
  content: React.ReactNode;
  expanded: boolean;
  id: string;
  className?: string;

  handleToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface AccordionProps {
  bordered?: boolean;
  items: AccordionItem[];
  className?: string;
  trigger?: string;
}

export const AccordionItem = (props: AccordionItem): React.ReactElement => {
  const { title, id, content, expanded, className, handleToggle } = props;

  const headingClasses = classnames("usa-accordion__heading", className);
  const contentClasses = classnames(
    "usa-accordion__content",
    "usa-prose",
    className
  );

  return (
    <>
      {content === null && title === null ? (
        <> </>
      ) : (
        <>
          <h2 className={headingClasses} id={`header_${id}`}>
            <button
              type="button"
              className="usa-accordion__button"
              aria-expanded={expanded}
              aria-controls={id}
              data-testid={`accordionButton_${id}`}
              onClick={handleToggle}
            >
              {title}
            </button>
          </h2>
          <div
            id={id}
            data-testid={`accordionItem_${id}`}
            className={contentClasses}
            hidden={!expanded}
          >
            {content}
          </div>
        </>
      )}
    </>
  );
};

export const PPMSAccordion = (props: AccordionProps): React.ReactElement => {
  const { bordered, items, className } = props;

  const [openItems, setOpenState] = useState(
    items.filter((i) => !!i.expanded).map((i) => i.id)
  );
  React.useEffect(() => {
    let newItems = items.filter((i) => !!i.expanded).map((i) => i.id);
    let newOpenItems = newItems.concat(openItems);
    setOpenState(newOpenItems);
  }, [items]);

  const classes = classnames(
    "usa-accordion",
    {
      "usa-accordion--bordered": bordered,
    },
    className
  );

  const toggleItem = (itemId: AccordionItem["id"]): void => {
    const newOpenItems = [...openItems];
    const itemIndex = openItems.indexOf(itemId);

    if (itemIndex > -1) {
      newOpenItems.splice(itemIndex, 1);
    } else {
      newOpenItems.push(itemId);
    }

    setOpenState(newOpenItems);
  };

  return (
    <div className={classes} data-testid="accordion">
      {items.map((item, i) => (
        <AccordionItem
          key={`accordionItem_${i}`}
          {...item}
          expanded={
            item.handleToggle ? item.expanded : openItems.indexOf(item.id) > -1
          }
          handleToggle={
            item.handleToggle
              ? item.handleToggle
              : (): void => {
                  toggleItem(item.id);
                }
          }
        />
      ))}
    </div>
  );
};

export default PPMSAccordion;
