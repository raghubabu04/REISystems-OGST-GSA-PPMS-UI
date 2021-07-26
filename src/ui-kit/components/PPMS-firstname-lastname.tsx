import React from "react";
import { PPMSInput } from "./common/input/PPMS-input";

export interface Props {
  disabled?: boolean;
  firstName: string;
  id: string;
  isFirstNameInvalid?: boolean;
  isFirstNameValid?: boolean;
  isLastNameInvalid?: boolean;
  isLastNameValid?: boolean;
  isMiddleNameInvalid?: boolean;
  isMiddleNameValid?: boolean;
  lastName: string;
  labelBold?: boolean;
  maxLength: number;
  maxMiddleLength?: number;
  middleName?: string;
  required: boolean;
  size?: "sm" | "lg";
  validationFirstMessage?: string;
  validationLastMessage?: string;
  updateFirstName: any;
  updateMiddleName?: any;
  updateLastName: any;
  showMiddleName?: boolean;
  onChangeFirstName: any;
  onChangeMiddleName?: any;
  onChangeLastName: any;
}
export interface State {}

export class PPMSFirstNameLastName extends React.Component<Props, State> {
  handleFirstNameChange = ({ value }) => {
    this.props.updateFirstName(value);
  };
  handleMiddleNameChange = ({ value }) => {
    this.props.updateMiddleName(value);
  };
  handleLastNameChange = ({ value }) => {
    this.props.updateLastName(value);
  };
  render() {
    return (
      <>
        <div className={"tablet:grid-col"}>
          <PPMSInput
            isDisabled={this.props.disabled}
            id={this.props.id + "FirstName"}
            name={this.props.id + "FirstName"}
            inputType={"text"}
            isInvalid={this.props.isFirstNameInvalid}
            isValid={this.props.isFirstNameValid}
            label={"First Name"}
            labelBold={this.props.labelBold}
            maxLength={this.props.maxLength}
            minLength={1}
            onChange={(event) =>
              this.props.onChangeFirstName(event.target.value)
            }
            onBlur={(event) => this.handleFirstNameChange(event.target)}
            placeHolder={" "}
            isRequired={this.props.required}
            validationMessage={this.props.validationFirstMessage}
            value={this.props.firstName}
          />
        </div>
        {this.props.showMiddleName && (
          <div className={"tablet:grid-col"}>
            <PPMSInput
              isDisabled={this.props.disabled}
              id={this.props.id + "MiddleName"}
              name={this.props.id + "MiddleName"}
              inputType={"text"}
              isInvalid={this.props.isMiddleNameInvalid}
              isValid={this.props.isMiddleNameValid}
              label={"Middle Initial"}
              labelBold={this.props.labelBold}
              maxLength={this.props.maxMiddleLength}
              minLength={0}
              onChange={(event) =>
                this.props.onChangeMiddleName(event.target.value)
              }
              onBlur={(event) => this.handleMiddleNameChange(event.target)}
              placeHolder={" "}
              isRequired={false}
              value={this.props.middleName}
            />
          </div>
        )}
        <div className={"tablet:grid-col"}>
          <PPMSInput
            isDisabled={this.props.disabled}
            id={this.props.id + "LastName"}
            name={this.props.id + "LastName"}
            inputType={"text"}
            isInvalid={this.props.isLastNameInvalid}
            isValid={this.props.isLastNameValid}
            label={"Last Name"}
            labelBold={this.props.labelBold}
            maxLength={this.props.maxLength}
            minLength={1}
            onChange={(event) => {
              this.props.onChangeLastName(event.target.value);
            }}
            onBlur={(event) => this.handleLastNameChange(event.target)}
            placeHolder={" "}
            isRequired={this.props.required}
            validationMessage={this.props.validationLastMessage}
            value={this.props.lastName}
          />
        </div>
      </>
    );
  }
}
