import React, { useContext, useEffect } from "react";
import PPMSMultiSelect from "../../../../../ui-kit/components/PPMS-multi-select";
import { WantListContext } from "../WantListContext";
import { CommonApiService } from "../../../../../api-kit/common/common-api.service";
import { PPMSToggleRadio } from "../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSDatepicker } from "../../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import moment from "moment";
import { PPMSSelect } from "../../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { advancedSearchValues } from "../../../create-update-property/constants/Constants";
import { yesOrNoOptions } from "../../constants/constants";
import { PPMSLabel } from "../../../../../ui-kit/components/common/form/PPMS-label";
import {
  formatICN,
  isEmptyCheck,
  validateExpirationDateChange,
  validateItemControlNumber,
} from "../../validations/FieldValidations";
import { WantListApiService } from "../../../../../api-kit/property/wantList-api-service";
import { isFormSubmitted } from "../../../../../service/validation.service";
import { PPMSTextInput } from "../../../../../ui-kit/components/common/form/PPMS-text-input";
import { PPMSErrorMessage } from "../../../../../ui-kit/components/common/form/PPMS-error-message";
import { conditionOptions } from "../../../create-non-reported-property/constants/Constants";

interface ItemInformationProps {
  router?: any;
  location?: any;
}

export function ItemInformationClass(props: ItemInformationProps) {
  const { itemInformationState, updateItemInformationState } = useContext(
    WantListContext
  );
  let wantListApi = new WantListApiService();

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validateForm();
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [itemInformationState]);

  useEffect(() => {
    setDefaultState();
    let commonApiService = new CommonApiService();
    commonApiService
      .getStateList()
      .then((response: any) => {
        let individualState = response.data.map((item) => {
          return {
            state: item.stateName,
            id: item.stateCode,
          };
        });
        updateItemInformationState({
          statesOptions: individualState,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    commonApiService
      .getFSCCodes()
      .then((response: any) => {
        updateItemInformationState({ fscOptions: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function setDefaultState() {
    conditionOptions.forEach((opt) => {
      opt.isSelected = false;
    });
    yesOrNoOptions.forEach((opt) => {
      if (opt.id === "N") {
        opt.isSelected = true;
      } else {
        opt.isSelected = false;
      }
    });
    updateItemInformationState({
      conditionOptions: conditionOptions,
      fcsSelectedValues: [],
      fscSelectedList: [],
      yesOrNoOptions: yesOrNoOptions,
      selectedStateValues: [],
      selectedStateList: [],
    });
  }

  function validateForm() {
    handleWantListNameBlur();
  }

  function handleStateChange(event) {
    let stateList = [];
    let stateValues = [];
    event.forEach((e) => {
      stateList.push(e.id);
      stateValues.push(e);
    });

    if (stateList.length !== 0) {
      updateItemInformationState({
        searchInvalid: isEmptyCheck(itemInformationState.searchText),
      });
    } else {
      let searchInvalid =
        (itemInformationState.fscCodeList.length != 0 ||
          !isEmptyCheck(itemInformationState.condition) ||
          itemInformationState.reimbursementRequired === "Y") &&
        isEmptyCheck(itemInformationState.searchText)
          ? true
          : false;
      updateItemInformationState({
        searchInvalid: searchInvalid,
      });
    }

    updateItemInformationState({
      selectedStateList: stateList,
      selectedStateValues: stateValues,
    });
  }

  function handleConditionChange(event) {
    event.forEach((e) => {
      if (e.isSelected) {
        updateItemInformationState({
          condition: e.id,
          conditionValidationMsg: "",
          searchInvalid:
            isEmptyCheck(itemInformationState.searchText) &&
            isEmptyCheck(itemInformationState.icn),
        });
      }
    });
  }

  function handleExpirationDateChange(value) {
    let validation = validateExpirationDateChange(value);
    updateItemInformationState({
      expirationDate: value,
      expirationDateIsInvalid: validation.inValid,
      expirationDateIsValid: !validation.inValid,
      expirationDateMsg: validation.validationMsg,
    });
  }

  function handleSearchType(event) {
    let searchOption = event.target.options[event.target.selectedIndex].text;
    updateItemInformationState({
      searchType: event.target.value,
      searchOption: searchOption,
    });
  }

  function handleReimbursementRequiredChange(event) {
    let selectedValue = event.find((item) => item.isSelected === true);
    if (selectedValue.id === "Y") {
      updateItemInformationState({
        reimbursementRequired: "Y",
        searchInvalid:
          isEmptyCheck(itemInformationState.searchText) &&
          isEmptyCheck(itemInformationState.icn),
      });
    } else if (selectedValue.id === "N") {
      let searchInvalid =
        (itemInformationState.fscCodeList.length != 0 &&
          isEmptyCheck(itemInformationState.searchText)) ||
        (itemInformationState.selectedStateList.length != 0 &&
          isEmptyCheck(itemInformationState.searchText)) ||
        (!isEmptyCheck(itemInformationState.condition) &&
          isEmptyCheck(itemInformationState.searchText) &&
          isEmptyCheck(itemInformationState.icn))
          ? true
          : false;
      updateItemInformationState({
        reimbursementRequired: "N",
        searchInvalid: searchInvalid,
      });
    }
  }

  function handleicn() {
    let validation = validateItemControlNumber(
      itemInformationState.icn,
      itemInformationState.icnIsRequired
    );

    if (validation.otherFields) {
      updateItemInformationState({
        stateSelectionLimit: 0,
        fscSelectionLimit: 0,
        fcsSelectedValues: [],
        fscCodeList: [],
        selectedStateList: [],
        selectedStateValues: [],
        searchInvalid: false,
        itemNameIsDisabled: true,
        searchText: "",
      });
    } else {
      updateItemInformationState({
        stateSelectionLimit: "",
        fscSelectionLimit: "",
        itemNameIsDisabled: false,
        searchInvalid:
          !isEmptyCheck(itemInformationState.condition) ||
          itemInformationState.reimbursementRequired === "Y",
      });
    }
    updateItemInformationState({
      icnInvalid: validation.Invalid,
      icnValdiationMessage: validation.validationMsg,
    });
  }

  function handleWantListNameBlur() {
    if (!isEmptyCheck(itemInformationState.wantListName)) {
      wantListApi
        .checkValidWantListName(
          itemInformationState.wantListName,
          itemInformationState.wantListId
            ? itemInformationState.wantListId
            : "0"
        )
        .then((response) => {
          if (response.data) {
            updateItemInformationState({
              wantListNameIsInvalid: true,
              wantListNameValidationMsg: "Duplicate Want List Name.",
            });
          }
        })
        .catch((error) => {});
    } else {
      updateItemInformationState({
        wantListNameIsInvalid: true,
        wantListNameValidationMsg: "Want List Name is Required.",
      });
    }
  }

  function handleFscChange(event) {
    let fscSelectedList = [];
    let fcsSelectedValues = [];
    event.forEach((e) => {
      fscSelectedList.push(e.code);
      fcsSelectedValues.push(e);
    });

    if (fscSelectedList.length !== 0) {
      updateItemInformationState({
        searchInvalid: isEmptyCheck(itemInformationState.searchText),
      });
    } else {
      let searchInvalid =
        (itemInformationState.selectedStateList.length != 0 ||
          !isEmptyCheck(itemInformationState.condition) ||
          itemInformationState.reimbursementRequired === "Y") &&
        isEmptyCheck(itemInformationState.searchText)
          ? true
          : false;
      updateItemInformationState({
        searchInvalid: searchInvalid,
      });
    }

    updateItemInformationState({
      fscCodeList: fscSelectedList,
      fcsSelectedValues: fcsSelectedValues,
    });
  }

  function handleSearchItemName() {
    if (isEmptyCheck(itemInformationState.searchText) && searchIsRequired) {
      updateItemInformationState({
        searchInvalid: true,
      });
    } else {
      updateItemInformationState({
        searchInvalid: false,
      });
    }
  }

  const searchIsRequired =
    itemInformationState.fscCodeList.length != 0 ||
    (!isEmptyCheck(itemInformationState.condition) &&
      isEmptyCheck(itemInformationState.icn)) ||
    itemInformationState.selectedStateList.length != 0 ||
    (itemInformationState.reimbursementRequired === "Y" &&
      isEmptyCheck(itemInformationState.icn));

  return (
    <>
      <div className="grid-row grid-gap-10">
        <div className="grid-col-5">
          <PPMSInput
            id={"wantListName"}
            name={"wantListName"}
            label={"Want List Name"}
            isRequired={true}
            isDisabled={false}
            inputType={"text"}
            value={itemInformationState.wantListName}
            onChange={(event) => {
              updateItemInformationState({
                wantListName: event.target.value,
                wantListNameIsInvalid: false,
                wantListNameIsValid: false,
                wantListNameValidationMsg: "",
              });
            }}
            onBlur={handleWantListNameBlur}
            validationMessage={itemInformationState.wantListNameValidationMsg}
            isInvalid={itemInformationState.wantListNameIsInvalid}
            isValid={itemInformationState.wantListNameIsValid}
          />
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col-12">
          <PPMSLabel
            className={"wantListSearch"}
            hint={searchIsRequired ? "" : "(Optional)"}
            htmlFor={"advanced-search-id"}
          >
            Item Name
          </PPMSLabel>
        </div>
        <div className="ppms-select-position grid-col-3">
          <PPMSSelect
            values={advancedSearchValues}
            identifierKey={"caps"}
            identifierValue={"value"}
            isInvalid={false}
            isValid={false}
            isRequired={false}
            selectedValue={itemInformationState.searchType}
            selectName={"searchtype"}
            selectClass={"wantListItemNameDropDown"}
            validationMessage={""}
            onChange={handleSearchType}
          />
        </div>
        <div className="grid-col-9">
          <PPMSTextInput
            disabled={itemInformationState.itemNameIsDisabled}
            name={"itemName"}
            placeholder={"Search by Item Name or Property Description"}
            id={"advanced-search-id"}
            type={"text"}
            required={searchIsRequired}
            value={itemInformationState.searchText}
            onChange={(event) => {
              updateItemInformationState({
                searchText: event.target.value,
                searchInvalid: false,
              });
            }}
            validationStatus={itemInformationState.searchInvalid ? "error" : ""}
            onBlur={handleSearchItemName}
            maxLength={50}
          />
        </div>

        {itemInformationState.searchInvalid && (
          <PPMSErrorMessage id={"errorMessage-search-text"}>
            {itemInformationState.searchValidationMsg}
          </PPMSErrorMessage>
        )}
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"tablet:grid-col-7"}>
          <PPMSInput
            isDisabled={false}
            placeHolder={""}
            id={"item-control-number"}
            inputType={"text"}
            name={"Item Control Number"}
            label={"Item Control Number"}
            isInvalid={itemInformationState.icnInvalid}
            isValid={itemInformationState.icnIsValid}
            isRequired={itemInformationState.icnIsRequired}
            validationMessage={itemInformationState.icnValdiationMessage}
            value={formatICN(itemInformationState.icn)}
            onChange={(event) => {
              updateItemInformationState({
                icnInvalid: false,
                icnIsInvalid: false,
                icnValdiationMessage: "",
                icn: event.target.value.replaceAll("-", "").toUpperCase(),
              });
            }}
            onBlur={handleicn}
            maxLength={18}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSMultiSelect
            avoidHighlightFirstOption={true}
            caseSensitiveSearch={false}
            emptyRecordMsg={"---- No FSC Code Found ----"}
            chipVariant={"primary"}
            label={"Federal Supply Class"}
            id={"fscCode"}
            options={itemInformationState.fscOptions}
            isRequired={itemInformationState.fscIsRequired}
            placeholder={"Enter FSC Code"}
            displayValue={"longName"}
            selectedValues={itemInformationState.fcsSelectedValues}
            showCheckbox={false}
            message={itemInformationState.fscIsRequired ? "" : "Optional"}
            selectionLimit={itemInformationState.fscSelectionLimit}
            isObject={true}
            onSelect={handleFscChange}
            onRemove={handleFscChange}
            singleSelect={false}
            closeOnSelect={true}
            isInvalid={itemInformationState.fscInvalid}
            isValid={itemInformationState.fscIsValid}
            validationMessage={itemInformationState.fscValidationMsg}
            validate={() => {
              updateItemInformationState({});
            }}
          />
        </div>
      </div>

      <div className="grid-row grid-gap-4">
        <div className="grid-col-6">
          <PPMSToggleRadio
            id={"reimbursementRequired"}
            options={itemInformationState.yesOrNoOptions}
            isInline={true}
            isDisabled={false}
            name={"reimbursementRequired"}
            className={"reimbursementRequired"}
            label={"Exclude items that require reimbursement"}
            validationMessage={""}
            isRequired={itemInformationState.reimbursementIsRequired}
            onChange={handleReimbursementRequiredChange}
          />
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <div className={"grid-col-6"}>
          <PPMSMultiSelect
            label={"State"}
            avoidHighlightFirstOption={true}
            caseSensitiveSearch={false}
            emptyRecordMsg={"---- No State Found ----"}
            chipVariant={"primary"}
            id={"stateSearch"}
            isRequired={itemInformationState.statesIsRequired}
            placeholder={"Enter State"}
            options={itemInformationState.statesOptions}
            displayValue={"state"}
            message={itemInformationState.statesIsRequired ? "" : "Optional"}
            selectedValues={itemInformationState.selectedStateValues}
            selectionLimit={itemInformationState.stateSelectionLimit}
            showCheckbox={false}
            isObject={true}
            singleSelect={false}
            closeOnSelect={true}
            onSelect={handleStateChange}
            onRemove={handleStateChange}
          />
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <div className={"grid-col-12"}>
          <PPMSToggleRadio
            id={"condition"}
            options={itemInformationState.conditionOptions}
            isInline={true}
            isDisabled={false}
            name={"condition"}
            className={"condition"}
            label={"Minimum Condition code:"}
            validationMessage={itemInformationState.conditionValidationMsg}
            isSingleSelect={true}
            onChange={handleConditionChange}
            isRequired={false}
          />
        </div>
      </div>
      <div className={"tablet:grid-col-5"}>
        <PPMSDatepicker
          id={"expirationDate"}
          format={"MM/DD/YYYY"}
          startDate={itemInformationState.expirationDate}
          updateDate={handleExpirationDateChange}
          display={"bottom-end"}
          label={"Expiration Date "}
          isRequired={itemInformationState.expirationDateIsRequired}
          placeholder={"Expiration Date"}
          validationMessage={itemInformationState.expirationDateMsg}
          minDate={moment(new Date(Date.now())).toDate()}
          maxDate={moment(new Date(Date.now())).add("180", "days").toDate()}
          isInvalid={itemInformationState.expirationDateIsInvalid}
          useDefaultValidation={false}
        />
      </div>
    </>
  );
}
