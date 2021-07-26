import React, { useContext, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { FleetContext } from "../Fleet-context";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { isFormSubmitted } from "../../../../../service/validation.service";
import {
  validateItemName,
  validateFSC,
  validatePrice,
} from "../validations/fleetValidations";
import PPMSMultiSelect from "../../../../../ui-kit/components/PPMS-multi-select";
import {
  fleetFscValues,
  formatItemControlNumber,
  formatPriceNumber,
} from "../../constants/Constants";
import {
  PPMSToggleCheckbox,
  PPMSToggleRadio,
} from "../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { UserUtils } from "../../../../../utils/UserUtils";
import { PPMSSelect } from "../../../../../ui-kit/components/common/select/PPMS-select";
import { conditionOptions } from "../../../../../constants/Constants";
interface ItemInformationProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function ItemInformation(props: ItemInformationProps) {
  const { itemInformationState, updateItemInformationState } = useContext(
    FleetContext
  );
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

  function validateForm() {
    handleItemNameBlur(itemInformationState.itemName);
    handleStartingPriceChange(itemInformationState.startingPrice);
    handleUnitPriceChange(itemInformationState.unitPrice);
    handleUpSetPriceChange(itemInformationState.upsetPrice);
  }

  function handleCheckboxChange(values: any) {
    let isSelected = values[0].isSelected;
    updateItemInformationState({
      modalFeatureItemOption: values,
      featureItem: isSelected,
    });
  }

  function handleItemNameBlur(value: any) {
    let errorMessage = validateItemName(value);
    if (errorMessage) {
      updateItemInformationState({
        itemNameIsInvalid: errorMessage.isInvalid,
        itemNameValidationMsg: errorMessage.validationError,
      });
    }
  }

  function handleFscChange(value) {
    let validations = validateFSC(value);
    updateItemInformationState({
      fscIsInvalid: validations.isInvalid,
      fcsSelectedValue: value.length > 0 ? value[0].code : "",
      fscValidationMessage: validations.validationError,
    });
  }

  function handleUnitPriceChange(value: any) {
    value = value.replace("$", "").replace(",", "");
    let errorMessage = validatePrice(value, "Unit Price");
    updateItemInformationState({
      unitPriceIsInvalid: errorMessage.isInvalid,
      unitPriceValidationMsg: errorMessage.validationError,
    });
  }

  function handleStartingPriceChange(value: any) {
    value = value.replace("$", "").replace(",", "");
    let errorMessage = validatePrice(value, "Starting Bid");
    updateItemInformationState({
      startingPriceIsInvalid: errorMessage.isInvalid,
      startingPriceValidationMsg: errorMessage.validationError,
    });
  }

  function handleUpSetPriceChange(value: any) {
    value = value.replace("$", "").replace(",", "");
    let errorMessage = validatePrice(value, "Upset Price");
    updateItemInformationState({
      upsetPriceIsInvalid: errorMessage.isInvalid,
      upsetPriceValidationMsg: errorMessage.validationError,
    });
  }

  return (
    <>
      <div className={"grid-row"}>
        <div className={"grid-col-3"}>
          <PPMSInput
            id={"fleet-icn"}
            name={"fleetIcn"}
            label={"Item Control Number"}
            onChange={() => {}}
            isRequired={true}
            isDisabled={true}
            inputType={"text"}
            value={
              itemInformationState.itemControlNumber
                ? formatItemControlNumber(
                    itemInformationState.itemControlNumber
                  )
                : ""
            }
            maxLength={14}
          />
        </div>
      </div>
      <div className={"grid-row"}>
        <div className="grid-col-4">
          <PPMSInput
            id={"fleet-itemName"}
            name={"itemName"}
            label={"Item Name"}
            isRequired={true}
            isDisabled={false}
            inputType={"text"}
            value={itemInformationState.itemName}
            onChange={(event) => {
              let name = event.target.value.toString();
              updateItemInformationState({
                itemName: name,
                itemNameIsInvalid: false,
                itemNameValidationMsg: "",
              });
            }}
            onBlur={(event) => handleItemNameBlur(event.target.value)}
            validationMessage={itemInformationState.itemNameValidationMsg}
            isInvalid={itemInformationState.itemNameIsInvalid}
            isValid={false}
            maxLength={30}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-6"}>
          <PPMSSelect
            id={"fleet-fsc"}
            identifierKey={"id"}
            identifierValue={"longName"}
            name={"fsc-values"}
            values={itemInformationState.fscValues}
            label={"Federal Supply Class"}
            isRequired={false}
            placeholderValue={"Select"}
            selectedValue={itemInformationState.fcsSelectedValue}
            onChange={(event) => {
              updateItemInformationState({
                fcsSelectedValue: event.target.value,
              });
            }}
            isInvalid={false}
            isValid={false}
            validationMessage={""}
            disabled={UserUtils.isUserFleetExt()}
            title={"fsc-values"}
          />
        </div>
        <div className={"grid-col-2"}>
          <PPMSInput
            id={"fleet-UnitOfIssue"}
            name={"UnitOfIssue"}
            label={"Unit Of Issue"}
            onChange={() => {}}
            isRequired={true}
            isDisabled={true}
            inputType={"text"}
            value={itemInformationState.unitOfIssue}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-2"}>
          <PPMSInput
            id={"fleet-quantity"}
            name={"quantity"}
            label={"Quantity"}
            onChange={() => {}}
            isRequired={true}
            isDisabled={true}
            inputType={"text"}
            value={itemInformationState.quantity}
          />
        </div>
        <div className={"grid-col-3"}>
          <PPMSInput
            id={"fleet-unitPrice"}
            name={"unitPrice"}
            label={"Unit Price"}
            maxLength={11}
            value={
              itemInformationState.unitPrice
                ? `$${itemInformationState.unitPrice}`
                : ""
            }
            onBlur={(event) => handleUnitPriceChange(event.target.value)}
            onChange={(event) => {
              updateItemInformationState({
                unitPrice: event.target.value
                  ? formatPriceNumber(event.target.value)
                  : "",
                unitPriceIsInvalid: false,
                unitPriceValidationMsg: "",
              });
            }}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            isInvalid={itemInformationState.unitPriceIsInvalid}
            isValid={!itemInformationState.unitPriceIsInvalid}
            isRequired={true}
            validationMessage={itemInformationState.unitPriceValidationMsg}
            placeHolder={"$0.00"}
          />
        </div>
        <div className={"grid-col-3"}>
          <PPMSInput
            id={"fleet-starting-bid"}
            name={"startingBid"}
            label={"Starting Bid"}
            maxLength={11}
            value={
              itemInformationState.startingPrice
                ? `$${itemInformationState.startingPrice}`
                : ""
            }
            onBlur={(event) => handleStartingPriceChange(event.target.value)}
            onChange={(event) => {
              updateItemInformationState({
                startingPrice: event.target.value
                  ? formatPriceNumber(event.target.value)
                  : "",
                startingPriceIsInvalid: false,
                startingPriceValidationMsg: "",
              });
            }}
            isDisabled={false}
            inputType={"text"}
            isInvalid={itemInformationState.startingPriceIsInvalid}
            isValid={!itemInformationState.startingPriceIsInvalid}
            isRequired={true}
            validationMessage={itemInformationState.startingPriceValidationMsg}
            placeHolder={"$0"}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSInput
            id={"fleet-upsetPrice"}
            name={"upsetPrice"}
            label={"Reserve Price"}
            maxLength={11}
            value={
              itemInformationState.upsetPrice
                ? `$${itemInformationState.upsetPrice}`
                : ""
            }
            onBlur={(event) => handleUpSetPriceChange(event.target.value)}
            onChange={(event) => {
              updateItemInformationState({
                upsetPrice: event.target.value
                  ? formatPriceNumber(event.target.value)
                  : "",
                upsetPriceIsInvalid: false,
                upsetPriceValidationMsg: "",
              });
            }}
            isDisabled={false}
            inputType={"text"}
            isInvalid={itemInformationState.upsetPriceIsInvalid}
            isValid={!itemInformationState.upsetPriceIsInvalid}
            isRequired={true}
            validationMessage={itemInformationState.upsetPriceValidationMsg}
            placeHolder={"$0"}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className="grid-col-4">
          <PPMSSelect
            id={"conditionCode"}
            identifierKey={"id"}
            identifierValue={"longName"}
            name={"condition-code"}
            values={itemInformationState.conditionOptions}
            label={"Condition Code"}
            isRequired={false}
            placeholderValue={"Select Condition Code"}
            selectedValue={itemInformationState.conditionCode}
            onChange={(event) => {
              updateItemInformationState({
                conditionCode: event.target.value,
              });
            }}
            isInvalid={false}
            isValid={false}
            validationMessage={""}
            disabled={false}
            title={"condition-values"}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className="grid-col-4">
          <PPMSInput
            id={"alc-station-deposit"}
            name={"alcStation"}
            label={"ALC/Station Deposit"}
            isRequired={false}
            isDisabled={false}
            inputType={"text"}
            value={itemInformationState.alcStation}
            onChange={(event) => {
              let value = event.target.value.toString();
              let alphaNumeric = /^[a-zA-Z0-9]*$/;
              if (alphaNumeric.test(value)) {
                updateItemInformationState({
                  alcStation: value,
                });
              }
            }}
            validationMessage={""}
            isInvalid={false}
            isValid={false}
            maxLength={8}
          />
        </div>
        <div className="grid-col-4">
          <PPMSInput
            id={"appropriationFundSymbol"}
            name={"appropriationFundSymbol"}
            label={"Appropriation Fund Symbol"}
            isRequired={false}
            isDisabled={false}
            inputType={"text"}
            value={itemInformationState.appropriationFund}
            onChange={(event) => {
              let value = event.target.value.toString();
              let alphaNumeric = /^[a-zA-Z0-9]*$/;
              if (alphaNumeric.test(value)) {
                updateItemInformationState({
                  appropriationFund: value,
                });
              }
            }}
            validationMessage={""}
            isInvalid={false}
            isValid={false}
            maxLength={7}
          />
        </div>
      </div>
      <div className={"tablet:grid-col-4 grid-col-6"}>
        <PPMSToggleCheckbox
          id={"featuredItem"}
          name={"featuredItem"}
          label={"Featured Type"}
          options={itemInformationState.modalFeatureItemOption}
          className={""}
          validationMessage={""}
          isInline={true}
          isDisabled={
            !UserUtils.isUserFleetAdmin() ||
            !itemInformationState.lotIsInPreviewOrActive
          }
          isSingleSelect={false}
          onChange={handleCheckboxChange}
        />
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(ItemInformation);
