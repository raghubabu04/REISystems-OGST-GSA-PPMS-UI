import React from "react";
import { PPMSInput } from "./common/input/PPMS-input";

export interface PPMSAgencyBureauProps {
  isAACCodeInvalid: boolean;
  isAACCodeValid: boolean;
  value: string;
  onChange?: any;
  isRequired?: boolean;
}
export interface PPMSAgencyBureauState {}
export class PPMSAgencyBureau extends React.Component<
  PPMSAgencyBureauProps,
  PPMSAgencyBureauState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onChange } = this.props;
    return (
      <PPMSInput
        isDisabled={true}
        id={"agency-bureau"}
        name={"agency-bureau"}
        inputType={"text"}
        isInvalid={this.props.isAACCodeInvalid}
        isValid={this.props.isAACCodeValid}
        label={"Agency/Bureau"}
        message={"Agency/Bureau auto-populated by AAC entered."}
        onChange={onChange}
        isRequired={this.props.isRequired}
        validationMessage={"Agency/Bureau is Required."}
        value={this.props.value}
        minLength={1}
        maxLength={50}
      />
    );
  }
}
