import React from "react";
import { CgNotes } from "react-icons/cg";
import { PPMSTooltip } from "./PPMS-tooltip";
export interface UnderlineTextProps {
  infoTipContent?: any;
  infoTipClass?: string;
  id: string;
  value: string;
  label?: string;
  icon?: any;
}
export interface UnderlineTextState {}
export class PPMSUnderlineText extends React.Component<
  UnderlineTextProps,
  UnderlineTextState
> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <text className={"underline-text"}>{this.props.value}</text>
        <PPMSTooltip
          trigger={"focus"}
          id={"other-info"}
          placement={"right"}
          tooltipContent={this.props.infoTipContent}
          triggerSource={
            <button
              id={`other-info-button`}
              type={"button"}
              className={"usa-button--unstyled"}
              title="Additional Information"
            >
              <CgNotes />
            </button>
          }
        />
      </>
    );
  }
}
