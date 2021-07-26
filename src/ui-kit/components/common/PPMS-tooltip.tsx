import React from "react";
import OverlayTrigger, {
  OverlayTriggerType,
} from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Placement } from "react-bootstrap/Overlay";

export interface PPMSTooltipProps {
  trigger: "hover" | "click" | "focus" | OverlayTriggerType[];
  id: string;
  placement: Placement;
  tooltipContent: any;
  triggerSource: any;
}
export interface PPMSTooltipState {}
export class PPMSTooltip extends React.Component<
  PPMSTooltipProps,
  PPMSTooltipState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <OverlayTrigger
        key={this.props.id}
        placement={this.props.placement}
        overlay={
          <Tooltip id={`ppms-tooltip-${this.props.id}`}>
            {this.props.tooltipContent}
          </Tooltip>
        }
      >
        {this.props.triggerSource}
      </OverlayTrigger>
    );
  }
}
