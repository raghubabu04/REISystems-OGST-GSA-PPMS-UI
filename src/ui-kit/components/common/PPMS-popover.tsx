import React from "react";
import OverlayTrigger, {
  OverlayTriggerType,
} from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { Placement } from "react-bootstrap/Overlay";

export interface PPMSPopoverProps {
  trigger: "hover" | "click" | "focus" | OverlayTriggerType[];
  id: string;
  placement: Placement;
  popoverTitle: string;
  popoverContent: any;
  triggerSource: any;
  className?: string;
}
export interface PPMSPopoverState {}
export class PPMSPopover extends React.Component<
  PPMSPopoverProps,
  PPMSPopoverState
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <OverlayTrigger
        trigger={this.props.trigger}
        key={`key-${this.props.id}`}
        placement={this.props.placement}
        rootClose={true}
        overlay={
          <Popover
            className={this.props.className}
            id={`ppms-popover-${this.props.id}`}
          >
            <Popover.Title as="h3">{this.props.popoverTitle}</Popover.Title>
            <Popover.Content>{this.props.popoverContent}</Popover.Content>
          </Popover>
        }
      >
        {this.props.triggerSource}
      </OverlayTrigger>
    );
  }
}
