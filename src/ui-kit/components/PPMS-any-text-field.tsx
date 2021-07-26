import React from "react";
import { PPMSInput } from "./common/input/PPMS-input";

export interface Props {
  disabled?: boolean;
  anyText: string;
  id: string;
  AnyTextIsInvalid?: boolean;
  AnyTextIsValid?: boolean;
  maxLength: number;
  maxMiddleLength?: number;
  required: boolean;
  size?: "sm" | "lg";
  validationTextMessage?: string;
  updateAnyText: any;
  onChangeAnyText: any;
  label: string;
}
export interface State {}

export class PPMSAnyTextField extends React.Component<Props, State> {
  handleAnyTextChange = ({ value }) => {
    this.props.updateAnyText(value);
  };
  render() {
    return (
      <>
        <div className={"tablet:grid-col"}>
          <PPMSInput
            isDisabled={this.props.disabled}
            id={this.props.id + "text"}
            name={this.props.id + "text"}
            inputType={"text"}
            isInvalid={this.props.AnyTextIsInvalid}
            isValid={this.props.AnyTextIsValid}
            label={this.props.label}
            maxLength={this.props.maxLength}
            minLength={1}
            onChange={(event) => this.props.onChangeAnyText(event.target.value)}
            onBlur={(event) => this.handleAnyTextChange(event.target)}
            placeHolder={" "}
            isRequired={this.props.required}
            validationMessage={this.props.validationTextMessage}
            value={this.props.anyText}
          />
        </div>
      </>
    );
  }
}
