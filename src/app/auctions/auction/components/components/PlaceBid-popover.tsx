import React from "react";
import OverlayTrigger, {
  OverlayTriggerType,
} from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { Placement } from "react-bootstrap/Overlay";

export interface PlaceBidPopoverProps {
  trigger: "hover" | "click" | "focus" | OverlayTriggerType[];
  id: string;
  placement: Placement;
  popoverTitle?: string;
  popoverContent: any;
  triggerSource: any;
  className?: string;
  show?: boolean;
}
export interface PPMSPopoverState {}
export class PlaceBidPopover extends React.Component<
  PlaceBidPopoverProps,
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
            id={`place-bid-popover-${this.props.id}`}
          >
            <Popover.Content>{this.props.popoverContent}</Popover.Content>
          </Popover>
        }
        show={this.props.show}
      >
        {this.props.triggerSource}
      </OverlayTrigger>
    );
  }
}
