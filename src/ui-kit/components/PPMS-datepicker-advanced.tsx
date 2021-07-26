import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form } from "react-bootstrap";
import { PPMSInput } from "./common/input/PPMS-input";
import { FaRegCalendarAlt } from "react-icons/fa";
import { validateDatePicker } from "./validations/FieldValidations";

export interface State {
  startDate: Date;
  dayValue: number;
  monthValue: number;
  yearValue: number;
  monthIsValid: boolean;
  monthIsInvalid: boolean;
  monthValidationMessage: string;
  dayIsValid: boolean;
  dayIsInvalid: boolean;
  dayValidationMessage: string;
  yearIsValid: boolean;
  yearIsInvalid: boolean;
  yearValidationMessage: string;
}

export interface Props {}

export class PPMSDatepickerAdvanced extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      startDate: today,
      dayValue: today.getDate(),
      monthValue: today.getMonth() + 1,
      yearValue: today.getFullYear(),
      monthIsValid: false,
      monthIsInvalid: false,
      dayIsValid: false,
      dayIsInvalid: false,
      yearIsValid: false,
      yearIsInvalid: false,
      monthValidationMessage: " ",
      dayValidationMessage: " ",
      yearValidationMessage: " ",
    };
  }
  handleChange = (date) => {
    let dateObj = new Date(date);
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();
    this.setState({
      startDate: date,
      dayValue: day,
      monthValue: month,
      yearValue: year,
    });
  };
  handleClick = (event) => {
    this.setState({
      startDate: new Date(
        this.state.yearValue,
        this.state.monthValue - 1,
        this.state.dayValue
      ),
    });
  };
  handleMonthChange = (event) => {
    let validation = validateDatePicker(event.target.value, "Month");
    this.setState({
      monthValue: event.target.value,
      monthIsInvalid: validation.isInvalid,
      monthIsValid: !validation.isInvalid,
      monthValidationMessage: validation.validationError,
    });
  };
  handleDayChange = (event) => {
    let validation = validateDatePicker(event.target.value, "Day");
    this.setState({
      dayValue: event.target.value,
      dayIsInvalid: validation.isInvalid,
      dayIsValid: !validation.isInvalid,
      dayValidationMessage: validation.validationError,
    });
  };
  handleYearChange = (event) => {
    let validation = validateDatePicker(event.target.value, "Year");
    this.setState({
      yearValue: event.target.value,
      yearIsInvalid: validation.isInvalid,
      yearIsValid: !validation.isInvalid,
      yearValidationMessage: validation.validationError,
    });
  };

  render() {
    return (
      <>
        <Form.Row className={"usa-memorable-date"}>
          <div className={"grid-col"}>
            <PPMSInput
              isDisabled={false}
              id={"month"}
              inputType={"text"}
              isInvalid={this.state.monthIsInvalid}
              isValid={this.state.monthIsValid}
              label={"Month"}
              placeHolder={"MM"}
              isRequired={true}
              maxLength={2}
              minLength={2}
              onChange={this.handleMonthChange}
              value={this.state.monthValue.toString()}
              validationMessage={this.state.monthValidationMessage}
            />
          </div>
          <div className={"grid-col"}>
            <PPMSInput
              isDisabled={false}
              id={"day"}
              inputType={"text"}
              isInvalid={this.state.dayIsInvalid}
              isValid={this.state.dayIsValid}
              placeHolder={"DD"}
              label={"Day"}
              maxLength={2}
              minLength={2}
              isRequired={true}
              onChange={this.handleDayChange}
              value={this.state.dayValue.toString()}
              validationMessage={this.state.dayValidationMessage}
            />
          </div>
          <div className={"grid-col"}>
            <PPMSInput
              isDisabled={false}
              id={"year"}
              inputType={"text"}
              isInvalid={this.state.yearIsInvalid}
              isValid={this.state.yearIsValid}
              placeHolder={"YYYY"}
              label={"Year"}
              maxLength={4}
              minLength={4}
              isRequired={true}
              onChange={this.handleYearChange}
              value={this.state.yearValue.toString()}
              validationMessage={this.state.yearValidationMessage}
            />
          </div>
          <div className={"align-self-center ppms-align-self-center grid-col"}>
            <DatePicker
              selected={this.state.startDate}
              onChange={this.handleChange}
              onInputClick={this.handleClick}
              popperPlacement="bottom-end"
              className={"usa-input"}
              customInput={
                <span>
                  <FaRegCalendarAlt />
                </span>
              }
            />
          </div>
        </Form.Row>
      </>
    );
  }
}
