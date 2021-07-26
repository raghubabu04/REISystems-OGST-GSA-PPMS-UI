import React, { createRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { isFormSubmitted } from "../../../../service/validation.service";
import {
  validateEndDatePicker,
  validateStartDatePicker,
} from "../../validations/FieldValidations";
import _ from "lodash";
import { months, years } from "./common/Constants";
import CustomHeader from "./common/CustomHeader";

export interface State {
  startDate: Date;
  endDate: Date;
  startValidationMessage: string;
  endValidationMessage: string;
  showFormGroup: string;
  isStartDateInvalid: boolean;
  isEndDateInvalid: boolean;
  useDefaultValidation: boolean;
  datePlaceholder: string;
  endDatePlaceHolder: string;
}
export interface Props {
  startDayPickerdisplay: string;
  endDayPickerdisplay: string;
  updateDate?: any;
  updateEndDate?: any;
  updateIsInvalidDates?: any;
  label?: string;
  isRequired?: boolean;
  id: string;
  maxDate?: Date;
  startDate?: Date;
  minDate?: Date;
  endDate?: Date;
  placeholder?: string;
  startDateValidationMessage: string;
  endDateValidationMessage: string;
  isStartDateInvalid: boolean;
  isEndDateInvalid: boolean;
  useDefaultValidation?: boolean;
  isDisabled?: boolean;
  infoTipContent?: any;
  message?: string;
  isValid: boolean;
  minStartDate?: any;
  minEndDate?: any;
  name?: string;
  inputRef?: any;
}
export class PPMSDatepickerAdvanced extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      endDate: this.props.endDate ? this.props.endDate : null,
      startDate: this.props.startDate ? this.props.startDate : null,
      isStartDateInvalid: this.props.isStartDateInvalid
        ? this.props.isStartDateInvalid
        : false,
      isEndDateInvalid: this.props.isEndDateInvalid
        ? this.props.isEndDateInvalid
        : false,
      startValidationMessage: this.props.startDateValidationMessage
        ? this.props.startDateValidationMessage
        : "",
      endValidationMessage: this.props.endDateValidationMessage
        ? this.props.endDateValidationMessage
        : "",
      showFormGroup: "",
      useDefaultValidation: true,
      datePlaceholder: this.props.startDate
        ? moment(this.props.startDate).format("MM/DD/YYYY")
        : "",
      endDatePlaceHolder: this.props.endDate
        ? moment(this.props.endDate).format("MM/DD/YYYY")
        : "",
    };
  }
  datepickerRef = createRef<HTMLInputElement>();
  componentDidMount() {
    isFormSubmitted.subscribe((submit) => {
      this.setState({
        showFormGroup:
          this.props.isRequired && submit && !this.props.isValid
            ? "usa-form-group--error ppms-form-group--error"
            : "",
      });
    });
    console.log(this.props.startDateValidationMessage, " validation");
  }
  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.startDate !== state.startDate) {
      return {
        startDate: props.startDate,
        endDate: props.endDate,
        datePlaceholder: props.startDate
          ? moment(props.startDate).format("MM/DD/YYYY")
          : "",
        endDatePlaceHolder: props.endDate
          ? moment(props.endDate).format("MM/DD/YYYY")
          : "",
      };
    }
    return null;
  }
  handleStartChange = (date) => {
    let formattedDate = moment(date).format("MM/DD/YYYY");
    this.setState({
      startDate: date,
      datePlaceholder: formattedDate,
    });
    let isInvalid = (!date && this.props.isRequired) || this.props.isValid;
    if (isInvalid) {
      this.setState({
        isStartDateInvalid: true,
        isEndDateInvalid: true,
        showFormGroup: "usa-form-group--error ppms-form-group--error",
        startValidationMessage: this.props.startDateValidationMessage,
        endValidationMessage: this.props.endDateValidationMessage,
      });
    } else {
      this.setState({
        isStartDateInvalid: false,
        isEndDateInvalid: false,
        showFormGroup: "",
        startValidationMessage: this.props.startDateValidationMessage,
        endValidationMessage: this.props.endDateValidationMessage,
      });
    }
    this.props.updateDate(date);
    this.props.updateIsInvalidDates({
      typeDate: "startDate",
      isInvalid: isInvalid,
    });
  };
  handleStartDateChange = (event) => {
    let validation = validateStartDatePicker(
      event.target.value,
      this.state.endDate,
      this.props.label
    );
    this.setState({
      datePlaceholder: event.target.value,
      isStartDateInvalid: validation.isInvalid,
      startValidationMessage: validation.validationError,
      isEndDateInvalid: false,
      endValidationMessage: "",
      startDate:
        validation.isInvalid === false
          ? new Date(event.target.value)
          : this.state.startDate,
    });
    if (validation.isInvalid === false) {
      this.props.updateDate(new Date(event.target.value));
    }
    this.props.updateIsInvalidDates({
      typeDate: "startDate",
      isInvalid: validation.isInvalid,
    });
  };
  // End datepicker
  handleEndDateChange = (event) => {
    let validation = validateEndDatePicker(
      this.state.startDate,
      event.target.value,
      this.props.label
    );
    this.setState({
      endDatePlaceHolder: event.target.value,
      isEndDateInvalid: validation.isInvalid,
      endValidationMessage: validation.validationError,
      isStartDateInvalid: false,
      startValidationMessage: "",
      endDate:
        validation.isInvalid === false
          ? new Date(event.target.value)
          : this.state.endDate,
    });
    if (validation.isInvalid === false) {
      this.props.updateEndDate(new Date(event.target.value));
    }
    this.props.updateIsInvalidDates({
      typeDate: "endDate",
      isInvalid: validation.isInvalid,
    });
  };

  handleEndChange = (date) => {
    let formattedDate = moment(date).format("MM/DD/YYYY");
    this.setState({
      endDate: date,
      endDatePlaceHolder: formattedDate,
    });
    let isInvalid = (!date && this.props.isRequired) || this.props.isValid;
    if (isInvalid) {
      this.setState({
        isStartDateInvalid: true,
        isEndDateInvalid: true,
        showFormGroup: "usa-form-group--error ppms-form-group--error",
        startValidationMessage: this.props.startDateValidationMessage,
        endValidationMessage: this.props.endDateValidationMessage,
      });
    } else {
      this.setState({
        isEndDateInvalid: false,
        isStartDateInvalid: false,
        showFormGroup: "",
        startValidationMessage: this.props.endDateValidationMessage,
        endValidationMessage: this.props.endDateValidationMessage,
      });
    }
    this.props.updateEndDate(date);
    this.props.updateIsInvalidDates({
      typeDate: "endDate",
      isInvalid: isInvalid,
    });
  };

  render() {
    return (
      <>
        <div className="containers">
          <div className="usa-form marginRight">
            <div
              className={`usa-form-group ${
                this.state.isStartDateInvalid ? "usa-form-group--error" : ""
              }`}
            >
              <div className="grid-row">
                <div className="grid-col right-margin">
                  <div className="usa-hint" id="date-range-startdate-hint">
                    Start date
                  </div>
                  <div className="usa-date-picker usa-date-picker--initialized">
                    <div className="usa-date-picker__wrapper" tabIndex={-1}>
                      <input
                        className={`usa-input ${
                          this.state.isStartDateInvalid
                            ? "usa-input--error"
                            : ""
                        } ${this.props.isValid ? "usa-input--success" : ""}`}
                        id="start-date"
                        name={`${
                          this.props.name ? this.props.name : "date"
                        }.startDate`}
                        type="text"
                        required={true}
                        aria-label={"start-date"}
                        value={this.state.datePlaceholder}
                        onChange={this.handleStartDateChange}
                        disabled={
                          this.props.isDisabled ? this.props.isDisabled : false
                        }
                        ref={this.props.inputRef}
                      />
                      <DatePicker
                        renderCustomHeader={(config) => {
                          return <CustomHeader {...config} />;
                        }}
                        dateFormat="MM/dd/yyyy"
                        selected={this.state.startDate}
                        onChange={this.handleStartChange}
                        popperPlacement={this.props.startDayPickerdisplay}
                        showPopperArrow={false}
                        placeholderText={this.props.placeholder}
                        disabled={
                          this.props.isDisabled ? this.props.isDisabled : false
                        }
                        id={this.props.id + "-start-date"}
                        minDate={this.props.minStartDate}
                        maxDate={this.props.maxDate}
                        required={this.props.isRequired}
                        customInput={
                          <button
                            type="button"
                            className="usa-date-picker__button"
                            aria-haspopup="true"
                            aria-label="Toggle calendar"
                            style={{ height: 40 }}
                          >
                            &nbsp;
                          </button>
                        }
                      />
                    </div>
                    {this.state.isStartDateInvalid && (
                      <span
                        className="usa-error-message invalid-feedback"
                        id="input-error-message"
                        role="alert"
                        style={{ display: "block" }}
                      >
                        {this.state.startValidationMessage}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid-col">
                  <div className="usa-hint" id="date-range-enddate-hint">
                    End date
                  </div>
                  <div className="usa-date-picker usa-date-picker--initialized">
                    <div className="usa-date-picker__wrapper" tabIndex={-1}>
                      <input
                        className={`usa-input ${
                          this.state.isEndDateInvalid ? "usa-input--error" : ""
                        } ${this.props.isValid ? "usa-input--success" : ""}`}
                        id="end-date"
                        name={`${
                          this.props.name ? this.props.name : "date"
                        }.endDate`}
                        type="text"
                        required={true}
                        aria-label={"end-date"}
                        value={this.state.endDatePlaceHolder}
                        onChange={this.handleEndDateChange}
                        disabled={
                          this.props.isDisabled ? this.props.isDisabled : false
                        }
                        ref={this.props.inputRef}
                      />
                      <DatePicker
                        renderCustomHeader={(config) => {
                          return <CustomHeader {...config} />;
                        }}
                        dateFormat="MM/dd/yyyy"
                        selected={this.state.endDate}
                        onChange={this.handleEndChange}
                        popperPlacement={this.props.endDayPickerdisplay}
                        showPopperArrow={false}
                        placeholderText={this.props.placeholder}
                        disabled={
                          this.props.isDisabled ? this.props.isDisabled : false
                        }
                        id={this.props.id + "-end-Date"}
                        minDate={this.props.minEndDate}
                        required={this.props.isRequired}
                        customInput={
                          <button
                            type="button"
                            className="usa-date-picker__button"
                            aria-haspopup="true"
                            aria-label="Toggle calendar"
                            style={{ height: 40 }}
                          >
                            &nbsp;
                          </button>
                        }
                      />
                    </div>
                    {this.state.isEndDateInvalid && (
                      <span
                        className="usa-error-message invalid-feedback"
                        id="input-error-message"
                        role="alert"
                        style={{ display: "block" }}
                      >
                        {this.state.endValidationMessage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
