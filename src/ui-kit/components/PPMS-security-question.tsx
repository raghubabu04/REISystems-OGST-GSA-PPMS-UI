import React from "react";
import { PPMSInput } from "./common/input/PPMS-input";
import {
  securityAnswerValidation,
  securityQuestionValidation,
} from "./validations/FieldValidations";
import { isFormSubmitted } from "../../service/validation.service";

export interface PPMSSecurityQuestionProps {
  answer: string;
  isAnswerInvalid?: boolean;
  isAnswerValid?: boolean;
  isQuestionInvalid?: boolean;
  isQuestionValid?: boolean;
  isRequired: boolean;
  question: string;
  validationAnswerMessage?: string;
  validationQuestionMessage?: string;
  updateQuestion: any;
  updateAnswer: any;
}
export interface PPMSSecurityQuestionState {
  answer: string;
  isAnswerInvalid: boolean;
  isAnswerValid: boolean;
  isQuestionInvalid: boolean;
  isQuestionValid: boolean;
  question: string;
  validationAnswerMessage: string;
  validationQuestionMessage: string;
}

export class PPMSSecurityQuestion extends React.Component<
  PPMSSecurityQuestionProps,
  PPMSSecurityQuestionState
> {
  constructor(props) {
    super(props);
    this.state = {
      answer: this.props.answer,
      isAnswerInvalid: false,
      isAnswerValid: false,
      isQuestionInvalid: false,
      isQuestionValid: false,
      question: this.props.question,
      validationQuestionMessage: "Security Question is Required.",
      validationAnswerMessage: "Answer is Required.",

    };
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
  }
  private isCurrent = true;
  componentDidMount() {
    isFormSubmitted.subscribe((submit) => {
      if (submit && this.isCurrent) {
        this.validateForm();
        isFormSubmitted.next(false);
      }
    });
  }
  validateForm() {
    this.handleQuestionChange({ value: this.state.question });
    this.handleAnswerChange({ value: this.state.answer });
  }
  componentWillUnmount() {
    this.isCurrent = false;
  }
  handleQuestionChange = ({ value }) => {
    let validation = securityQuestionValidation(value);
    this.setState({
      question: value,
      isQuestionInvalid: validation.isInvalid,
      isQuestionValid: !validation.isInvalid,
      validationQuestionMessage: validation.validationError,
    }, () => {
      this.props.updateQuestion(value?.trim());
      if (this.state.answer.length !== 0) {
        this.handleAnswerChange({ value: this.state.answer });
      }
    });
  };
  handleAnswerChange = ({ value }) => {
    let validation = securityAnswerValidation(
      value,
      this.state.question ? this.state.question : ""
    );
    this.setState({
      answer: value,
      isAnswerInvalid: validation.isInvalid,
      isAnswerValid: !validation.isInvalid,
      validationAnswerMessage: validation.validationError,
    });
    this.props.updateAnswer(value);
  };

  render() {
    return (
      <>
        <PPMSInput
          isDisabled={false}
          id={"security-question"}
          inputType={"text"}
          isInvalid={this.state.isQuestionInvalid}
          isValid={this.state.isQuestionValid}
          label={"Security Question"}
          hint={"Security Questions must be at least 7 characters long."}
          onChange={(event) => this.handleQuestionChange(event.target)}
          isRequired={this.props.isRequired}
          validationMessage={this.state.validationQuestionMessage}
          value={this.state.question}
          minLength={1}
          maxLength={100}
        />
        <PPMSInput
          isDisabled={false}
          id={"security-answer"}
          inputType={"text"}
          isInvalid={this.state.isAnswerInvalid}
          isValid={this.state.isAnswerValid}
          label={"Answer"}
          hint={
            "Answers must be at least 5 characters and cannot be same as security question."
          }
          onChange={(event) => this.handleAnswerChange(event.target)}
          isRequired={this.props.isRequired}
          validationMessage={this.state.validationAnswerMessage}
          value={this.state.answer}
          minLength={1}
          maxLength={100}
        />
      </>
    );
  }
}
