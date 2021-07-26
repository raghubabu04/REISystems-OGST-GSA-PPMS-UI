import React from "react";
import { FormControl, FormFile, FormGroup } from "react-bootstrap";

export interface PPMSFileUploadProps {
  id: string;
  isDisabled: boolean;
  isRequired: boolean;
  isValid: boolean;
  isInvalid: boolean;
  label: string;
  custom: boolean;
  placeholder: string;
  validationMessage: string;
}
export interface PPMSFileUploadState {}
export class PPMSFileUpload extends React.Component<
  PPMSFileUploadProps,
  PPMSFileUploadState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <FormGroup
          className={`${
            this.props.isInvalid
              ? "usa-form-group--error ppms-usa-form-group--error"
              : ""
          } usa-form-group`}
        >
          <FormFile
            id={`ppms-single-upload-${this.props.id}`}
            custom={this.props.custom}
            disabled={this.props.isDisabled}
          >
            <FormFile.Input
              isInvalid={this.props.isInvalid}
              isValid={this.props.isValid}
              required={this.props.isRequired}
              autoComplete={"off"}
            />
            <FormFile.Label
              data-browse={this.props.label}
              className={`${
                this.props.isInvalid
                  ? "ppms-custom-file-label ppms-accordion-error"
                  : ""
              } ${
                this.props.isValid
                  ? "ppms-custom-file-label ppms-usa-input--success"
                  : ""
              }`}
            >
              {this.props.placeholder}
            </FormFile.Label>
            <FormControl.Feedback type="invalid">
              {this.props.validationMessage}
            </FormControl.Feedback>
          </FormFile>
        </FormGroup>
      </>
    );
  }
}
