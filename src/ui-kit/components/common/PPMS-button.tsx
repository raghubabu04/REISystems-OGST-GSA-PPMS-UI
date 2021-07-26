import React from "react";
import { Spinner } from "react-bootstrap";

export interface PPMSButtonProps {
  className?: string;
  isDisabled?: boolean;
  icon?: {};
  id: string;
  isLoading?: boolean;
  label: string | Element;
  size?: "sm" | "lg";
  type?: "button" | "submit" | "reset";
  value?: string;
  variant?:
    | "link"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "dark"
    | "light"
    | "outline-primary"
    | "outline-secondary"
    | "outline-success"
    | "outline-danger"
    | "outline-warning"
    | "outline-info"
    | "outline-dark"
    | "outline-light"
    | "hide";
  onPress?: any;
  toolTipPlacement?: string;
  tooltipContent?: any;
  hasToolTip?: boolean;
  ariaLabel?: string;
}

export interface PPMSButtonState {}

export class PPMSButton extends React.Component<
  PPMSButtonProps,
  PPMSButtonState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getUSWDSButtonClass() {
    switch (this.props.variant) {
      case "secondary":
        return "usa-button--base";
      case "danger":
        return "usa-button--secondary";
      case "info":
        return "usa-button--accent-cool";
      case "outline-primary":
        return "usa-button--outline";
      case "link":
        return "usa-button--outline usa-button--unstyled";
      case "hide":
        return "usa-button--hide";
      default:
        return "";
    }
  }
  getUSWDSButtonSizeClass() {
    switch (this.props.size) {
      case "sm":
        return "usa-button--sm";
      case "lg":
        return "usa-button--lg";
      default:
        return "";
    }
  }
  render() {
    const { onPress } = this.props;
    return (
      <button
        className={`${
          this.props.className ? this.props.className : ""
        } usa-button ${
          this.props.hasToolTip ? "usa-tooltip" : ""
        } ${this.getUSWDSButtonSizeClass()} ${this.getUSWDSButtonClass()}`}
        disabled={this.props.isDisabled}
        id={this.props.id}
        onClick={onPress}
        type={this.props.type ? this.props.type : "button"}
        value={this.props.value}
        data-position={this.props.toolTipPlacement}
        title={this.props.tooltipContent}
        data-testid={`button-${this.props.id}`}
        aria-label={this.props.ariaLabel}
      >
        {!this.props.isLoading ? <>{this.props.icon}</> : <></>}
        {this.props.isLoading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            &nbsp;&nbsp;
            <span>Loading...</span>
          </>
        ) : (
          this.props.label
        )}
      </button>
    );
  }
}
