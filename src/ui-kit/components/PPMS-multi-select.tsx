import React from "react";
import {PPMSSearchSelect} from "./common/PPMS-search-select";
import PPMSLabel from "./common/form/PPMS-label";
import PPMSErrorMessage from "./common/form/PPMS-error-message";
import {PPMSFormGroup} from "./common/form/PPMS-form-group";
import {isFormSubmitted} from "../../service/validation.service";
import {PPMSPopover} from "./common/PPMS-popover";
import {FaInfoCircle} from "react-icons/fa";

export interface Props {
  avoidHighlightFirstOption?: boolean;
  caseSensitiveSearch?: boolean;
  alphaNumericOrDigitSearch?: boolean;
  isPivotSorted?: boolean;
  chipVariant:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  closeIcon?: string;
  closeOnSelect?: boolean;
  disablePreSelectedValues?: boolean;
  displayValue: string;
  emptyRecordMsg?: string;
  groupBy?: string;
  id: string;
  isObject?: boolean;
  label?: string;
  message?: string;
  onRemove?: any;
  onSelect?: any;
  infoTipContent?: any;
  infoTipClass?: string;
  icon?: {};
  name?: string;
  options: {};
  placeholder?: string;
  isRequired: boolean;
  selectedValues: [];
  selectionLimit?: number;
  showCheckbox?: boolean;
  singleSelect?: boolean;
  style?: any;
  triggerValidation?: boolean;
  isInvalid?: boolean;
  isValid?: boolean;
  validationMessage?: string;
  validate?: any;
  singleSelectAndTypeSearch?: boolean;
  outsideLink?: boolean;
  outsideLinkContext?: any;
  hint?: string;
  labelClassName?: string;
  disable?: boolean;
}
export interface State {
  selectedValues: [];
  show: string;
  showFormGroup: string;
  validationMessage: string;
}

export default class PPMSMultiSelect extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      selectedValues: this.props.selectedValues,
      show: "",
      showFormGroup: "",
      validationMessage:
        this.props.validationMessage !== ""
          ? this.props.validationMessage
          : this.props.label + " is required.",
    };
    this.onRemove = this.onRemove.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onRemove(event) {
    if (event.length === 0 && this.props.isRequired) {
      this.setState({
        show: "ppms-error-show",
        showFormGroup: "usa-form-group--error ppms-form-group--error",
        selectedValues: event,
      });
    } else {
      this.setState({
        show: "",
        showFormGroup: "",
        selectedValues: event,
        validationMessage: "",
      });
    }
    this.props.onRemove(event);
  }

  onSelect(event) {
    if (event.length === 0 && this.props.isRequired) {
      this.setState({
        show: "ppms-error-show",
        showFormGroup: "usa-form-group--error ppms-form-group--error",
        selectedValues: event,
      });
    } else {
      this.setState({
        show: "",
        showFormGroup: "",
        selectedValues: event,
      });
    }
    this.props.onSelect(event);
  }
  onChange(event) {
    /*this.setState({
      show: "ppms-error-show",
      showFormGroup: "usa-form-group--error ppms-form-group--error",
    });*/
    if (event.length === 0 && this.props.isRequired) {
      this.setState({
        show: "ppms-error-show",
        showFormGroup: "usa-form-group--error ppms-form-group--error",
        selectedValues: event,
      });
    } else {
      this.setState({
        show: "",
        showFormGroup: "",
        selectedValues: event,
      });
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isInvalid) {
      let validationMessage;
      if (this.state.selectedValues.length === 0) {
        if (nextProps.selectedValues && nextProps.selectedValues.length !== 0) {
          this.setState({
            selectedValues: nextProps.selectedValues,
            show: "",
            showFormGroup: "",
            validationMessage: "",
          });
        }
        validationMessage = this.props.label + " is required.";
      } else {
        validationMessage = nextProps.validationMessage;
      }
      this.setState({
        show: "ppms-error-show",
        showFormGroup: "usa-form-group--error ppms-form-group--error",
        validationMessage: validationMessage,
      });
    } else {
      this.setState({
        show: "",
        showFormGroup: "",
        validationMessage: "",
        selectedValues: nextProps.selectedValues,
      });
    }
  }
  componentDidMount() {
    isFormSubmitted.subscribe((submit) => {
      if (
        submit &&
        this.props.isRequired &&
        this.props?.selectedValues?.length === 0 &&
        this.state?.selectedValues?.length === 0
      ) {
        this.props.validate();
      }
    });
  }
  render() {
    return (
      <>
        <PPMSFormGroup error={this.props.isInvalid}>
          <PPMSLabel
            htmlFor={this.props.id}
            className={this.props.labelClassName ? this.props.labelClassName:""}
            hint={this.props.message && `(${this.props.message})`}
          >
            {this.props.icon} {this.props.label}{" "}
            {this.props.infoTipContent && infoTip}
            {this.props.outsideLink && this.props.outsideLinkContext}
          </PPMSLabel>
          {this.props.hint && (
            <span className="usa-hint">{this.props.hint}</span>
          )}
          <PPMSSearchSelect
            avoidHighlightFirstOption={this.props.avoidHighlightFirstOption}
            caseSensitiveSearch={this.props.caseSensitiveSearch}
            alphaNumericOrDigitSearch={this.props.alphaNumericOrDigitSearch}
            isPivotSorted={this.props.isPivotSorted}
            chipVariant={this.props.chipVariant}
            closeOnSelect={this.props.closeOnSelect}
            disablePreSelectedValues={this.props.disablePreSelectedValues}
            displayValue={this.props.displayValue}
            emptyRecordMsg={this.props.emptyRecordMsg}
            groupBy={this.props.groupBy}
            id={this.props.id}
            isObject={this.props.isObject}
            onRemove={this.onRemove}
            onSelect={this.onSelect}
            onChange={this.onChange}
            options={this.props.options}
            placeholder={this.props.placeholder}
            required={this.props.isRequired}
            selectedValues={this.props.selectedValues}
            selectionLimit={this.props.selectionLimit}
            showCheckbox={this.props.showCheckbox}
            singleSelect={this.props.singleSelect}
            singleSelectAndTypeSearch={this.props.singleSelectAndTypeSearch}
            triggerValidation={this.props.triggerValidation}
            isInvalid={this.props.isInvalid}
            isValid={this.props.isValid}
            validationMessage={this.props.validationMessage}
            disable={this.props.disable}
          />
          {this.props.isInvalid && (
            <PPMSErrorMessage>{this.props.validationMessage}</PPMSErrorMessage>
          )}
        </PPMSFormGroup>
      </>
    );
  }
}
const infoTip = (props) => (
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
      >
        <FaInfoCircle />
      </button>
    }
  />
);
