import React, { ElementType } from "react";
import Spinner from "react-bootstrap/Spinner";

export interface PPMSSpinnerProps {
  animation: "border" | "grow";
  as?: ElementType;
  variant:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  size?: "sm";
  loadingText: string;
  ariaHidden?: boolean;
}
export interface PPMSSpinnerState {}
export class PPMSSpinner extends React.Component<
  PPMSSpinnerProps,
  PPMSSpinnerState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Spinner
        animation={this.props.animation}
        role="status"
        as={this.props.as}
        size={this.props.size}
        aria-hidden={this.props.ariaHidden}
        variant={this.props.variant}
      >
        <span className="sr-only">{this.props.loadingText}</span>
      </Spinner>
    );
  }
}
