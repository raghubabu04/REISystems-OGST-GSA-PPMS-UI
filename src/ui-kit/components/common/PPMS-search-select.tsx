import React from "react";
import { GrFormClose } from "react-icons/gr";
import { Badge } from "react-bootstrap";
import { AiFillCaretDown } from "react-icons/ai";

export interface PPMSSearchSelectProps {
  avoidHighlightFirstOption?: boolean;
  caseSensitiveSearch: boolean;
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
  closeOnSelect: boolean;
  disablePreSelectedValues: boolean;
  displayValue: string;
  emptyRecordMsg: string;
  groupBy?: string;
  id: string;
  isObject: boolean;
  onRemove: any;
  onSelect: any;
  onChange: any;
  options: {};
  placeholder: string;
  required: boolean;
  selectedValues: any;
  selectionLimit: number;
  showCheckbox: boolean;
  singleSelect: boolean;
  triggerValidation: boolean;
  isInvalid?: boolean;
  isValid?: boolean;
  validationMessage?: string;
  singleSelectAndTypeSearch?: boolean;
  disable?: boolean;
}

export interface PPMSSearchSelectState {
  filteredOptions: any;
  groupedObject: any;
  highlightOption: number;
  index: number;
  inputValue: string;
  isInvalid: boolean;
  isObject: boolean;
  isValid: boolean;
  options: any;
  preSelectedValues: any;
  selectedValues: any;
  showCheckbox: boolean;
  toggleOptionsList: boolean;
  unfilteredOptions: any;
  singleSelectAndTypeSearch: boolean;
}

const alphaNumericOrDigitSearch = (itemList, input) => {
  //If the first Characther is Alphabete search for inclustion in word
  if (isNaN(input.charAt(0))) {
    return itemList.trim().toLowerCase().includes(input.toLowerCase());
  }
  //If the first Characther is Digits search for starting char.
  return itemList.trim().substring(0, 2).startsWith(input.substring(0, 2));
};

const sortWithIDAsPivot = (agencyObjectList: any, inputedAgencyID: string) => {
  let pivotedSortList = agencyObjectList.sort((agencyObject: any) => {
    //Sort Based on ID match
    if (agencyObject.id === inputedAgencyID) return -1;
  });
  return pivotedSortList;
};

export class PPMSSearchSelect extends React.Component<
  PPMSSearchSelectProps,
  PPMSSearchSelectState
> {
  listRef = React.createRef<HTMLUListElement>();
  constructor(props) {
    super(props);
    this.state = {
      filteredOptions: this.props.options,
      groupedObject: [],
      highlightOption: this.props.avoidHighlightFirstOption ? -1 : 0,
      index: 0,
      inputValue: "",
      isInvalid: false,
      isObject: this.props.isObject,
      isValid: false,
      options: this.props.options,
      preSelectedValues: Object.assign([], this.props.selectedValues),
      selectedValues: Object.assign([], this.props.selectedValues),
      showCheckbox: this.props.showCheckbox,
      toggleOptionsList: false,
      unfilteredOptions: this.props.options,
      singleSelectAndTypeSearch: false,
    };
    this.fadeOutSelection = this.fadeOutSelection.bind(this);
    this.filterOptionsByInput = this.filterOptionsByInput.bind(this);
    this.getSelectedItems = this.getSelectedItems.bind(this);
    this.getSelectedItemsCount = this.getSelectedItemsCount.bind(this);
    this.isDisablePreSelectedValues = this.isDisablePreSelectedValues.bind(
      this
    );
    this.isSelectedValue = this.isSelectedValue.bind(this);
    this.listenerCallback = this.listenerCallback.bind(this);
    this.onArrowKeyNavigation = this.onArrowKeyNavigation.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRemoveSelectedItem = this.onRemoveSelectedItem.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.removeSelectedValuesFromOptions = this.removeSelectedValuesFromOptions.bind(
      this
    );
    this.renderGroupByOptions = this.renderGroupByOptions.bind(this);
    this.renderMultiSelectContainer = this.renderMultiSelectContainer.bind(
      this
    );
    this.renderNormalOption = this.renderNormalOption.bind(this);
    this.renderSelectedList = this.renderSelectedList.bind(this);
    this.resetSelectedValues = this.resetSelectedValues.bind(this);
    this.searchBox = React.createRef();
    this.searchWrapper = React.createRef();
    this.toggleOptionList = this.toggleOptionList.bind(this);
    this.blurToggleOptionList = this.blurToggleOptionList.bind(this);
  }
  searchWrapper;
  searchBox;
  initialSetValue() {
    const { showCheckbox, groupBy, singleSelect } = this.props;
    const { options } = this.state;
    if (!showCheckbox && !singleSelect) {
      this.removeSelectedValuesFromOptions(false);
    }
    if (groupBy && showCheckbox) {
      this.groupByOptions(options);
    }
  }

  removeInputValue() {
    this.setState({
      inputValue: "",
    });
  }

  resetSelectedValues() {
    const { unfilteredOptions } = this.state;
    this.setState(
      {
        selectedValues: [],
        preSelectedValues: [],
        options: unfilteredOptions,
        filteredOptions: unfilteredOptions,
      },
      this.initialSetValue
    );
  }

  getSelectedItems() {
    return this.state.selectedValues;
  }

  getSelectedItemsCount() {
    return this.state.selectedValues.length;
  }

  componentDidMount() {
    this.initialSetValue();
    this.searchWrapper.current.addEventListener("click", this.listenerCallback);
  }

  componentDidUpdate(prevProps) {
    const { options, selectedValues } = this.props;
    const {
      options: prevOptions,
      selectedValues: prevSelectedvalues,
    } = prevProps;
    if (JSON.stringify(prevOptions) !== JSON.stringify(options)) {
      this.setState(
        {
          options,
          filteredOptions: options,
          unfilteredOptions: options,
        },
        this.initialSetValue
      );
    }
    if (JSON.stringify(prevSelectedvalues) !== JSON.stringify(selectedValues)) {
      this.setState(
        { selectedValues, preSelectedValues: selectedValues },
        this.initialSetValue
      );
      if (
        !this.props.selectedValues ||
        this.props.selectedValues?.length === 0
      ) {
        this.setState({
          options: this.props.options,
          groupedObject: [],
          filteredOptions: this.props.options,
        });
      }
    }
  }

  listenerCallback() {
    this.searchBox.current.focus();
  }

  componentWillUnmount() {
    this.searchWrapper.current.removeEventListener(
      "click",
      this.listenerCallback
    );
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      (this.props.required && this.state.selectedValues.length === 0) ||
      nextProps.isInvalid
    ) {
      this.setState({
        isInvalid: true,
        isValid: false,
        selectedValues: nextProps.selectedValues,
      });
    } else {
      this.setState({
        isInvalid: false,
        isValid: true,
        selectedValues: nextProps.selectedValues,
      });
    }
  }

  removeSelectedValuesFromOptions(skipCheck) {
    const { isObject, displayValue, groupBy } = this.props;
    const { selectedValues = [], unfilteredOptions, options } = this.state;
    if (!skipCheck && groupBy) {
      this.groupByOptions(options);
    }
    if (!selectedValues.length && !skipCheck) {
      return;
    }
    if (isObject) {
      let optionList = unfilteredOptions.filter((item) => {
        return (
          selectedValues.findIndex(
            (v) => v[displayValue] === item[displayValue]
          ) === -1
        );
      });
      if (groupBy) {
        this.groupByOptions(optionList);
      }
      this.setState(
        { options: optionList, filteredOptions: optionList },
        this.filterOptionsByInput
      );
      return;
    }
    let optionList = unfilteredOptions.filter(
      (item) => selectedValues.indexOf(item) === -1
    );

    this.setState(
      { options: optionList, filteredOptions: optionList },
      this.filterOptionsByInput
    );
  }

  groupByOptions(options) {
    const { groupBy } = this.props;
    const groupedObject = options.reduce(function (r, a) {
      const key = a[groupBy] || "Others";
      r[key] = r[key] || [];
      r[key].push(a);
      return r;
    }, Object.create({}));

    this.setState({ groupedObject });
  }

  onChange(event) {
    if (this.props.required) {
      this.setState({
        isInvalid: true,
        isValid: false,
      });
    }
    this.props.onChange(event);

    this.setState(
      {
        inputValue: event.target.value,
      },
      this.filterOptionsByInput
    );

  }

  filterOptionsByInput() {
    let { options, filteredOptions, inputValue } = this.state;
    const { isObject, displayValue } = this.props;
    let numberRegex = /^[0-9]+$/;

    let isInputPivotable =
      this.props.isPivotSorted &&
      inputValue.length >= 4 &&
      numberRegex.test(inputValue.substring(0, 4));

    if (isObject) {
      options = filteredOptions.filter((i) =>
        this.matchValues(i[displayValue], inputValue)
      );
      if (isInputPivotable) {
        options = sortWithIDAsPivot(options, inputValue);
      }
    } else {
      options = filteredOptions.filter((i) => this.matchValues(i, inputValue));
      if (isInputPivotable) {
        options = sortWithIDAsPivot(options, inputValue);
      }
      this.setState({ inputValue: "" });
    }

    this.groupByOptions(options);
    this.setState({ options });
  }

  matchValues(value, search) {
    if (this.props.caseSensitiveSearch) {
      return value.trim().indexOf(search) > -1;
    }
    if (this.props.alphaNumericOrDigitSearch) {
      return alphaNumericOrDigitSearch(value, search);
    }
    return value.trim().toLowerCase().indexOf(search.toLowerCase()) > -1;
  }

  onArrowKeyNavigation(e) {
    const {
      options,
      highlightOption,
      toggleOptionsList,
      inputValue,
      selectedValues,
    } = this.state;
    if (e.keyCode === 8 && !inputValue && selectedValues.length) {
      this.onRemoveSelectedItem(selectedValues.length - 1);
    }
    if (!options.length) {
      return;
    }
    if (e.keyCode === 38) {
      if (highlightOption > 0) {
        this.setState((previousState) => ({
          highlightOption: previousState.highlightOption - 1,
        }));
        this.scrollPosition(highlightOption - 1);
      } else {
        this.setState({ highlightOption: options.length - 1 });
        this.scrollPosition(options.length - 1);
      }
    } else if (e.keyCode === 40) {
      if (highlightOption < options.length - 1) {
        this.setState((previousState) => ({
          highlightOption: previousState.highlightOption + 1,
        }));
        this.scrollPosition(highlightOption + 1);
      } else {
        this.setState({ highlightOption: 0 });
        this.scrollPosition(0);
      }
    } else if (e.key === "Enter" && options.length && toggleOptionsList) {
      this.setState({ toggleOptionsList: false });
      if (highlightOption === -1) {
        return;
      }
      this.onSelectItem(options[highlightOption]);
    }
  }

  scrollPosition(index: number) {
    let item = this.listRef.current.children[index];
    item.scrollIntoView({ block: "nearest" });
  }

  onRemoveSelectedItem(item) {
    let { selectedValues, index = 0, isObject } = this.state;
    const { onRemove, showCheckbox, displayValue } = this.props;
    if (isObject) {
      index = selectedValues.findIndex(
        (i) => i[displayValue] === item[displayValue]
      );
    } else {
      index = selectedValues.indexOf(item);
    }

    selectedValues.splice(index, 1);
    onRemove(selectedValues, item);
    if (this.props.required && selectedValues.length === 0) {
      this.setState({
        isInvalid: true,
        isValid: false,
      });
    }
    if (selectedValues.length === 0) {
      this.setState({
        inputValue: "",
      });
    }

    this.setState({ selectedValues }, () => {
      if (!showCheckbox) {
        this.removeSelectedValuesFromOptions(true);
      }
    });
  }

  onSelectItem(item) {
    if (this.props.required) {
      this.setState({
        isValid: true,
        isInvalid: false,
      });
    }
    this.setState({
      inputValue: "",
    });
    const { selectedValues } = this.state;
    const { selectionLimit, onSelect, singleSelect, showCheckbox } = this.props;
    if (singleSelect) {
      this.onSingleSelect(item);
      onSelect([item], item);
      return;
    }
    if (this.isSelectedValue(item)) {
      this.onRemoveSelectedItem(item);
      return;
    }
    if (selectionLimit === selectedValues.length) {
      return;
    }
    selectedValues.push(item);
    onSelect(selectedValues, item);
    this.setState({ selectedValues }, () => {
      if (!showCheckbox) {
        this.removeSelectedValuesFromOptions(true);
      }
    });
    if (!this.props.closeOnSelect) {
      this.searchBox.current.focus();
    }
  }

  // changed toggleoptionlist from false to true as it was not closing the dropdown for agency Bureau on property search page
  onSingleSelect(item) {
    this.setState({ selectedValues: [item], toggleOptionsList: true });
  }

  isSelectedValue(item) {
    const { isObject, displayValue } = this.props;
    const { selectedValues } = this.state;
    if (isObject) {
      return (
        selectedValues.filter((i) => i[displayValue] === item[displayValue])
          .length > 0
      );
    }
    return selectedValues.filter((i) => i === item).length > 0;
  }

  renderOptionList() {
    const { groupBy, emptyRecordMsg } = this.props;
    const { options } = this.state;
    return (
      <ul ref={this.listRef} className={`ppms-option-container`}>
        {options?.length === 0 && (
          <span className={`ppms-not-found`}>{emptyRecordMsg}</span>
        )}
        {!groupBy ? this.renderNormalOption() : this.renderGroupByOptions()}
      </ul>
    );
  }

  renderGroupByOptions() {
    const {
      isObject = false,
      displayValue,
      showCheckbox,
      singleSelect,
    } = this.props;
    const { groupedObject } = this.state;
    return Object.keys(groupedObject).map((obj) => {
      return (
        <React.Fragment key={obj}>
          <li className={"ppms-group-heading"}>{obj}</li>
          {groupedObject[obj].map((option, i) => (
            <li
              key={`option${i}`}
              className={`ppms-group-child ${
                this.fadeOutSelection(option) && "ppms-disable-selection"
              } ppms-option`}
              onClick={() => this.onSelectItem(option)}
            >
              {showCheckbox && !singleSelect && (
                <input
                  type="checkbox"
                  className={"ppms-checkbox"}
                  readOnly
                  checked={this.isSelectedValue(option)}
                  autoComplete={"off"}
                />
              )}
              {isObject ? option[displayValue] : (option || "").toString()}
            </li>
          ))}
        </React.Fragment>
      );
    });
  }

  renderNormalOption() {
    const {
      isObject = false,
      displayValue,
      showCheckbox,
      singleSelect,
      id,
    } = this.props;
    const { highlightOption } = this.state;
    return this.state?.options?.map((option, i) => (
      <li
        id={`${id}-option-${i}`}
        key={`option${i}`}
        className={`${
          highlightOption === i ? `ppms-highlight-option highlight` : ""
        } ${
          this.fadeOutSelection(option) && "ppms-disable-selection"
        } ppms-option`}
        onClick={() => this.onSelectItem(option)}
      >
        {showCheckbox && !singleSelect && (
          <input
            type="checkbox"
            readOnly
            className={`ppms-checkbox`}
            checked={this.isSelectedValue(option)}
            autoComplete={"off"}
          />
        )}
        {isObject ? option[displayValue] : (option || "").toString()}
      </li>
    ));
  }

  renderSelectedList() {
    const { isObject = false, displayValue, singleSelect } = this.props;
    const { selectedValues } = this.state;
    return selectedValues.map((value, index) => (
      <Badge
        pill={true}
        variant={this.props.chipVariant}
        className={`${singleSelect && "ppms-single-badge"} ${
          this.isDisablePreSelectedValues(value) && "ppms-disable-selection"
        }`}
        key={index}
      >
        {!isObject ? (value || "").toString() : value[displayValue]}
        <GrFormClose
          className={"ppms-close-icon"}
          aria-label={"close-icon"}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              this.onRemoveSelectedItem(value);
            }
          }}
          onClick={() => this.onRemoveSelectedItem(value)}
        />
      </Badge>
    ));
  }

  isDisablePreSelectedValues(value) {
    const { isObject, disablePreSelectedValues, displayValue } = this.props;
    const { preSelectedValues } = this.state;
    if (!disablePreSelectedValues || !preSelectedValues.length) {
      return false;
    }
    if (isObject) {
      return (
        preSelectedValues.filter((i) => i[displayValue] === value[displayValue])
          .length > 0
      );
    }
    return preSelectedValues.filter((i) => i === value).length > 0;
  }

  fadeOutSelection(item) {
    const { selectionLimit, showCheckbox, singleSelect } = this.props;
    if (singleSelect) {
      return;
    }
    const { selectedValues } = this.state;
    if (selectionLimit === -1) {
      return false;
    }
    if (selectionLimit !== selectedValues.length) {
      return false;
    }
    if (selectionLimit === selectedValues.length) {
      if (!showCheckbox) {
        return true;
      } else {
        if (this.isSelectedValue(item)) {
          return false;
        }
        return true;
      }
    }
  }

  // added event to toggleOptionList because when we click on the agency bureau drop down and click outside does not work properly, this is on search property
  toggleOptionList(event) {
    if (this.props.selectionLimit === this.state.selectedValues.length) {
      this.setState({
        toggleOptionsList: false,
      });
    } else {
      this.setState({
        toggleOptionsList: true,
        highlightOption: this.props.avoidHighlightFirstOption ? -1 : 0,
      });
    }
  }

  //OnBlur force options list to close as it will sometimes stay forced open
  blurToggleOptionList(event) {
    this.setState({
      toggleOptionsList: false,
      highlightOption: this.props.avoidHighlightFirstOption ? -1 : 0,
    });
  }

  renderMultiSelectContainer() {
    const { inputValue, toggleOptionsList, selectedValues } = this.state;
    const {
      placeholder,
      singleSelect,
      singleSelectAndTypeSearch,
      id,
      selectionLimit,
    } = this.props;
    return (
      <div
        className={"ppms-multi-select-container"}
        id={`${id || ""} "ppms-multi-select-container"`}
      >
        <div
          className={`ppms-search-wrapper ppms-search-select-form-control ppms-usa-input ${
            this.props.isInvalid ? "is-invalid ppms-usa-input--error" : ""
          } ${this.props.isValid ? "is-valid ppms-usa-input--success" : ""} ${
            singleSelect ? "ppms-single-select" : ""
          }`}
          ref={this.searchWrapper}
          onClick={
            !this.props.disable || (singleSelect && !singleSelectAndTypeSearch)
              ? this.toggleOptionList
              : () => {}
          }
        >
          {this.renderSelectedList()}
          <input
            className="ppms-search-box"
            disabled={
              this.props.disable ||
              (singleSelect && !singleSelectAndTypeSearch) ||
              this.props.selectionLimit === this.state.selectedValues.length
            }
            id={`${id || "search"}`}
            onBlur={() => {
              this.removeInputValue();
              setTimeout(this.blurToggleOptionList, 200);
            }}
            onChange={this.onChange}
            onFocus={this.toggleOptionList}
            onKeyPress={this.toggleOptionList}
            onKeyDown={this.onArrowKeyNavigation}
            placeholder={
              (singleSelect && selectedValues.length) ||
              (selectedValues.length === 1 && selectionLimit === 1)
                ? ""
                : placeholder
            }
            ref={this.searchBox}
            type="text"
            value={inputValue}
            autoComplete={"off"}
            required={this.props.required}
          />
          {singleSelect && <AiFillCaretDown className={"ppms-icon-down-dir"} />}
        </div>
        <div
          className={`ppms-option-list-container ${
            toggleOptionsList ? "ppms-display-block" : "ppms-display-none"
          }`}
        >
          {this.renderOptionList()}
        </div>
      </div>
    );
  }
  render() {
    return this.renderMultiSelectContainer();
  }
}
