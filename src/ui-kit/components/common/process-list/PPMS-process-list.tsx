import React from "react";
import parse from "html-react-parser";

export interface PPMSProcessListProps {
  id: string;
  list: any[];
  size?: "x1";
  noText?: boolean;
  lightText?: boolean;
}
export interface PPMSProcessListState {}
export const PPMSProcessList = (
  props: PPMSProcessListProps
): React.ReactElement => {
  const { id, size, noText, lightText, list } = props;
  const content = list.map((item: any, index) => (
    <li
      key={`step-${index}`}
      className={`usa-process-list__item ${noText && "padding-bottom-4"}`}
    >
      {(noText && (
        <p className="usa-process-list__heading font-sans-xl line-height-sans-1">
          {item.header}
        </p>
      )) || (
        <>
          <h4
            className={`usa-process-list__heading ${
              size === "x1" && "font-sans-xl line-height-sans-1"
            }`}
          >
            {item.header}
          </h4>
          <p
            className={`margin-top-05 ${size === "x1" && "font-sans-lg"} ${
              lightText && "text-light"
            }`}
          >
            {parse(item.content)}
          </p>
        </>
      )}
    </li>
  ));

  return (
    <>
      <ol id={id} className="usa-process-list">
        {content}
      </ol>
    </>
  );
};

export default PPMSProcessList;
