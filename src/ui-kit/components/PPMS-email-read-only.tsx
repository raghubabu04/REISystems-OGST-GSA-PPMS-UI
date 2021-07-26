import React from "react";
import { PPMSInput } from "./common/input/PPMS-input";

export interface PPMSEmailReadOnlyProps {
  emailAddress: string;
  required: boolean;
}
export interface PPMSEmailReadOnlyState {}

export class PPMSEmailReadOnly extends React.Component<
  PPMSEmailReadOnlyProps,
  PPMSEmailReadOnlyState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <PPMSInput
          className={"email-registration"}
          isDisabled={true}
          id={"registrationEmail"}
          isInvalid={!this.props.emailAddress}
          isValid={!!this.props.emailAddress}
          label={"Email Address"}
          hint={
            "Only users with .gov or .mil email addresses can currently register with the PPMS system."
          }
          isRequired={this.props.required}
          inputType={"email"}
          validationMessage={"Email Address is Required."}
          value={this.props.emailAddress}
          minLength={5}
          maxLength={50}
        />
      </>
    );
  }
}
