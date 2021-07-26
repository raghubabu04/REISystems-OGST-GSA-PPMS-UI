import React from "react";
import parse from "html-react-parser";
export interface PPMSSummaryBoxProps {
  id: string;
  className?: string;
  heading: string;
  content: any[];
}
export interface PPMSSummaryBoxState {}
export const PPMSSummaryBox = (
  props: PPMSSummaryBoxProps
): React.ReactElement => {
  const { id, heading, content } = props;
  let list = content.map((step: any, index) => {
    return <li key={`summary-list-${index}`}>{parse(step)}</li>;
  });

  return (
    <>
      <div id={id} className="usa-summary-box" role="complementary">
        <div className="usa-summary-box__body">
          <h3 className="usa-summary-box__heading">{heading}</h3>
          <div className="usa-summary-box__text">
            <ul className="usa-list">{list}</ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default PPMSSummaryBox;
