import React from "react";
import {PPMSButton} from "./common/PPMS-button";

export interface PPMSSubmitProps {
  disabled: boolean;
  isLoading: boolean;
  variant:
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
    | "outline-light";
  onPress?: any;
  id?: string;
}
export interface PPMSSubmitState {}

export class PPMSSubmit extends React.Component<
  PPMSSubmitProps,
  PPMSSubmitState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let disabled = (this.props.isLoading) ? false: this.props.disabled;
    let onPress = (this.props.disabled) ? null : this.props.onPress;
    return (
      <PPMSButton
        variant={this.props.variant}
        type={this.props.disabled? "button":"submit"}
        value={"submit"}
        label={"Submit"}
        onPress={onPress}
        isDisabled={disabled}
        isLoading={this.props.isLoading}
        id={this.props.id}
      />
    );
  }
}
