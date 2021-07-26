import React from "react";
import { PPMSInput } from "../common/input/PPMS-input";
import {
  validateSpecialDescriptionCode,
  validateSpecialDescriptionText,
} from "../../../app/property/create-update-property/validations/propertyFieldValidations";

export interface Props {
  id: string;
  disabled?: boolean;
  specialDescriptionCode: string;
  specialDescriptionCodeLabel?: string;
  specialDescriptionText: string;
  specialDescriptionCodeTextLabel?: string;
  validationMessage?: string;
  isInvalid?: boolean;
  isValid?: boolean;
  required: boolean;
  updateSpecialDescriptionCode: any;
  updateSpecialDescriptionText: any;
}

export interface State {
  isInvalid: boolean;
}

export class PPMSFscSpecial extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isInvalid: this.props.isInvalid,
    };
    this.handleSpecialDescriptionCode = this.handleSpecialDescriptionCode.bind(
      this
    );
    this.handleSpecialDescriptionText = this.handleSpecialDescriptionText.bind(
      this
    );
  }

  handleSpecialDescriptionCode = (event) => {
    let validation = validateSpecialDescriptionCode(event.target.value);

    this.props.updateSpecialDescriptionCode(event.target.value, validation);
  };

  handleSpecialDescriptionText = (event) => {
    let validation = validateSpecialDescriptionText(event.target.value);

    this.props.updateSpecialDescriptionText(event.target.value, validation);
  };

  render() {
    return (
      <>
        <div className={"grid-col-6"}>
          <PPMSInput
            id={this.props.id+"code"}
            isRequired={this.props.required}
            isDisabled={this.props.disabled ? this.props.disabled : false}
            inputType={"text"}
            label={
              this.props.specialDescriptionCodeLabel
                ? this.props.specialDescriptionCodeLabel
                : "Special Description Code"
            }
            value={this.props.specialDescriptionCode}
            onChange={this.handleSpecialDescriptionCode}
            validationMessage={this.props.validationMessage}
            maxLength={12}
            minLength={0}
            isInvalid={this.props.isInvalid}
            isValid={false}
          />
        </div>
        <div className={"grid-col-6"}>
          <PPMSInput
            id={this.props.id+"text"}
            isRequired={this.props.required}
            isDisabled={this.props.disabled ? this.props.disabled : false}
            inputType={"text"}
            label={
              this.props.specialDescriptionCodeTextLabel
                ? this.props.specialDescriptionCodeTextLabel
                : "Special Description Text"
            }
            value={this.props.specialDescriptionText}
            onChange={this.handleSpecialDescriptionText}
            validationMessage={this.props.validationMessage}
            maxLength={69}
            minLength={0}
            isInvalid={this.props.isInvalid}
            isValid={false}
          />
        </div>
      </>
    );
  }
}
