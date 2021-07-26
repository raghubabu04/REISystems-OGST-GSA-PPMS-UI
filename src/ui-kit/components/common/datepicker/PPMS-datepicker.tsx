import React, { createRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { isFormSubmitted } from "../../../../service/validation.service";
import { validateDatePickerInput } from "../../validations/FieldValidations";
import { PPMSFieldset } from "../form/PPMS-fieldset";
import { PPMSFormGroup } from "../form/PPMS-form-group";
import PPMSLabel from "../form/PPMS-label";
import CustomHeader from "./common/CustomHeader";
import PPMSErrorMessage from "../form/PPMS-error-message";
import { PPMSPopover } from "../PPMS-popover";
import { FaInfoCircle } from "react-icons/fa";

export interface Props {
  display: string;
  updateDate: any;
  label?: string;
  labelBold?: boolean;
  isRequired?: boolean;
  id: string;
  maxDate?: Date;
  startDate?: Date;
  minDate?: Date;
  placeholder?: string;
  validationMessage?: string;
  isInvalid?: boolean;
  useDefaultValidation?: boolean;
  isDisabled?: boolean;
  infoTipContent?: any;
  message?: string;
  name?: string;
  icon?: {};
  outsideLink?: boolean;
  outsideLinkContext?: any;
  hint?: string;
  className?: string;
  notShowFormat?: boolean;
  excludeHolidays?: boolean;
  setHolidayYear?: any;
  holidayList?: any[];
  excludeWeekends?: boolean;
  format: string;
  formField?: boolean;
  showMonthYearPicker?: boolean;
}

export interface State {
  startDate: Date;
  validationMessage: string;
  show: string;
  showFormGroup: string;
  isInvalid: boolean;
  isValid: boolean;
  useDefaultValidation: boolean;
  datePlaceholder: string;
  isInputDateInvalid: boolean;
  inputValidationMessage: string;
}

export class PPMSDatepicker extends React.Component<Props, State> {
  state = {
    startDate: this.props.startDate ? this.props.startDate : null,
    show: "",
    showFormGroup: "",
    validationMessage:
      this.props.validationMessage !== null
        ? this.props.validationMessage
        : " is required",
    isInvalid: false,
    isValid: false,
    useDefaultValidation: true,
    datePlaceholder: this.props.startDate
      ? moment(this.props.startDate).format(this.props.format)
      : "",
    isInputDateInvalid: false,
    inputValidationMessage: null,
  };

  datepickerRef = createRef<HTMLInputElement>();
  inputRef = createRef<HTMLInputElement>();

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.startDate !== state.startDate) {
      return {
        startDate: props.startDate,
        datePlaceholder: props.startDate
          ? moment(props.startDate).format(props.format)
          : "",
      };
    }
    return null;
  }

  componentDidMount() {
    isFormSubmitted.subscribe((submit) => {
      this.setState({
        show:
          this.props.isRequired && submit && !this.state.isValid
            ? "ppms-error-show"
            : "",
        showFormGroup:
          this.props.isRequired && submit && !this.state.isValid
            ? "usa-form-group--error ppms-form-group--error"
            : "",
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.validationMessage !== prevProps.validationMessage) {
      this.inputRef.current.setCustomValidity(this.props.validationMessage);
    }
  }

  handleDateInputChange = (value, format) => {
    let inputValidation = validateDatePickerInput(
      value,
      this.props.isRequired,
      this.props.label,
      format
    );
    this.setState({
      datePlaceholder: value,
      isInputDateInvalid: inputValidation.isInvalid,
      isInvalid: inputValidation.isInvalid,
      isValid: !inputValidation.isInvalid,
      startDate: inputValidation.isInvalid
        ? this.state.startDate
        : moment(value, this.props.format).toDate(),
      show: inputValidation.isInvalid ? "ppms-error-show" : "",
      showFormGroup: inputValidation.isInvalid
        ? "usa-form-group--error ppms-form-group--error"
        : "",
      inputValidationMessage: inputValidation.validationError,
    });
    if (inputValidation.isInvalid) {
      this.inputRef.current.setCustomValidity(inputValidation.validationError);
      if (inputValidation.isEmpty) {
        this.props.updateDate("");
      } else {
        if (this.props.formField) {
          this.props.updateDate(value);
        }
      }
    } else {
      inputValidation.isEmpty
        ? this.props.updateDate(null)
        : this.props.updateDate(moment(value, this.props.format).toDate());
      this.inputRef.current.setCustomValidity("");
    }
  };

  isWeekDay = (date) => {
    let day = moment(date).day();
    return day !== 0 && day !== 6;
  };

  handleDatePickerChange = (date) => {
    let formattedDate = moment(date).format(this.props.format);
    this.handleDateInputChange(formattedDate, this.props.format);
  };

  render() {
    return (
      <>
        <PPMSFieldset className={"ppms-fieldset"}>
          <PPMSFormGroup className="usa-form" error={this.props.isInvalid}>
            <div className="usa-form-group">
              <PPMSLabel
                htmlFor={this.props.id}
                className={`usa-label ${this.props.className} ${
                  this.props.labelBold ? "text-bold" : ""
                }`}
                hint={
                  !this.props.isRequired && this.props.label ? `(Optional)` : ""
                }
                srOnly={false}
                // infoTipContent={this.props.infoTipContent}
              >
                {this.props.icon}
                {this.props.label}
                {this.props.outsideLink && this.props.outsideLinkContext}
                {`  `}
                {this.props.infoTipContent ? (
                  <InfoTip
                    id={this.props.id}
                    label={this.props.label}
                    infoTipContent={this.props.infoTipContent}
                    infoTipClass={`usa-label form-label ${
                      this.props.infoTipContent ? "usa-label-float" : ""
                    }`}
                  />
                ) : (
                  ""
                )}
              </PPMSLabel>
              {this.props.notShowFormat ? null : (
                <div
                  className="usa-hint"
                  id={this.props.id + "DateFormat Hint"}
                >
                  {this.props.format}
                </div>
              )}
              <div className="usa-date-picker usa-date-picker--initialized">
                <div className="usa-date-picker__wrapper">
                  <input
                    className={`${
                      this.props.className ? this.props.className : ""
                    } usa-input ${
                      this.state.isInputDateInvalid ||
                      this.props.useDefaultValidation
                        ? "is-invalid usa-input--error"
                        : ""
                    } ${
                      this.props.isInvalid && !this.props.useDefaultValidation
                        ? "is-invalid usa-input--error"
                        : ""
                    }`}
                    id={this.props.id}
                    name={this.props.id}
                    type="text"
                    disabled={this.props.isDisabled}
                    required={this.props.isRequired}
                    onBlur={(event) => {
                      this.handleDateInputChange(
                        event.target.value,
                        this.props.format
                      );
                    }}
                    onChange={(event) => {
                      this.setState({
                        datePlaceholder: event.target.value,
                      });
                    }}
                    value={
                      this.state.datePlaceholder
                        ? this.state.datePlaceholder
                        : ""
                    }
                    maxLength={10}
                    ref={this.inputRef}
                  />
                  <DatePicker
                    renderCustomHeader={(config) => {
                      return <CustomHeader {...config} />;
                    }}
                    dateFormat={`${
                      this.props.showMonthYearPicker ? "MM/yyyy" : "MM/dd/yyyy"
                    }`}
                    autoComplete="off"
                    selected={this.state.startDate}
                    onChange={this.handleDatePickerChange}
                    popperPlacement={this.props.display}
                    showPopperArrow={false}
                    showMonthYearPicker={this.props.showMonthYearPicker}
                    disabled={this.props.isDisabled}
                    id={this.props.id}
                    maxDate={this.props.maxDate}
                    minDate={this.props.minDate}
                    required={this.props.isRequired}
                    filterDate={
                      !this.props.showMonthYearPicker &&
                      this.props.excludeWeekends
                        ? this.isWeekDay
                        : null
                    }
                    excludeDates={
                      !this.props.showMonthYearPicker &&
                      this.props.excludeHolidays
                        ? this.props.holidayList
                        : []
                    }
                    onMonthChange={(date) => {
                      if (this.props.excludeHolidays) {
                        this.props.setHolidayYear(moment(date).year());
                      }
                    }}
                    ref={this.datepickerRef}
                    customInput={
                      <DatePickerButton
                        onClick={onclick}
                        isDisabled={this.props.isDisabled}
                      />
                    }
                    fixedHeight
                    popperModifiers={{
                      preventOverflow: {
                        enabled: true,
                        escapeWithReference: false,
                        boundariesElement: "scrollParent",
                      },
                    }}
                    closeOnScroll={true}
                  />
                </div>
                {this.props.isInvalid && (
                  <PPMSErrorMessage>
                    {this.props.validationMessage}
                  </PPMSErrorMessage>
                )}
                {this.state.isInputDateInvalid && !this.props.isInvalid && (
                  <PPMSErrorMessage>
                    {this.state.inputValidationMessage}
                  </PPMSErrorMessage>
                )}
              </div>
            </div>{" "}
          </PPMSFormGroup>
        </PPMSFieldset>
      </>
    );
  }
}

const InfoTip = (props) => (
  <PPMSPopover
    trigger={["click"]}
    id={props.id + "InfoTip"}
    placement={"right"}
    popoverTitle={props.label}
    popoverContent={props.infoTipContent}
    className={props.infoTipClass}
    triggerSource={
      <button
        id={`${props.id}-tooltip-button`}
        type={"button"}
        className={"usa-button  usa-button--unstyled"}
        title={props.id}
      >
        <FaInfoCircle />
      </button>
    }
  />
);

const DatePickerButton = ({ onClick, isDisabled }) => (
  <button
    onClick={onClick}
    disabled={isDisabled}
    type="button"
    className={"usa-date-picker__button"}
    aria-haspopup="true"
    aria-label="Toggle calendar"
    style={
      isDisabled
        ? { backgroundImage: "none" }
        : { height: 40, border: "none", backgroundColor: "white" }
    }
  />
);
