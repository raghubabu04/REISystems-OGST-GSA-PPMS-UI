import React, { useContext, useState, useEffect } from "react";
import { connect } from "react-redux";
import { ShoppingContext } from "../ShoppingCartContext";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSState } from "../../../../../ui-kit/components/PPMS-state";
import { PropertyApiService } from "../../../../../api-kit/property/property-api-service";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { CommonApiService } from "../../../../../api-kit/common/common-api.service";
import { validateZipStateCity } from "../../../../../ui-kit/components/validations/FieldValidations";
import { AllocationContext } from "../../../allocate-property/AllocationContext";
import { PPMSTextArea } from "../../../../../ui-kit/components/common/input/PPMS-textarea";

export interface Props {
  toggleModal?: any;
  showModal?: any;
  tcn?: any;
  actions?: any;
  isAllocation?: boolean;
}

function EditShippingInfo(props: Props) {
  const propertyApiService = new PropertyApiService();
  const commonApiService = new CommonApiService();
  const { toggleModal, showModal, tcn } = props;

  const {
    shippingDetailsState: shippingDetails,
    updateShippingDetailsState,
  } = useContext(props.isAllocation ? AllocationContext : ShoppingContext);
  const [shippingDetailsState, setShippingDetailsState] = useState({
    ...shippingDetails,
  });

  const resetState = (event) => {
    toggleModal(event);
  };

  useEffect(() => {
    const details = { ...shippingDetailsState };
    let validation = details.validation;

    validation.shippingDetailsAddressLine1ValidationMessage = "";
    validation.shippingDetailsAddressLine1isValid = true;
    validation.shippingDetailsAddressLine1isInvalid = false;
    validation.shippingDetailsAddressLine1isRequired = true;
    validation.shippingDetailsAddressLine2ValidationMessage = "";
    validation.shippingDetailsAddressLine2isValid = true;
    validation.shippingDetailsAddressLine2isInvalid = false;
    validation.shippingDetailsAddressLine2isRequired = true;
    validation.shippingDetailsCityValidationMessage = "";
    validation.shippingDetailsCityisValid = true;
    validation.shippingDetailsCityisInvalid = false;
    validation.shippingDetailsCityisRequired = true;
    validation.shippingDetailsZipcodeValidationMessage = "";
    validation.shippingDetailsZipcodeisValid = true;
    validation.shippingDetailsZipcodeisInvalid = false;
    validation.shippingDetailsZipcodeisRequired = true;
    validation.shippingDetailsAttnValidationMessage = "";
    validation.shippingDetailsAttnisValid = true;
    validation.shippingDetailsAttnisInvalid = false;
    validation.shippingDetailsStateisInvalid = false;

    const ids = [
      "shippingDetailsAddressLine1",
      "shippingDetailsAddressLine2",
      "shippingDetailsZipcode",
      "shippingDetailsCity",
      "shippingDetailsState",
    ];
    const res = ids.filter((id) => !details[id]);
    if (res.length > 0) validation.shippingDetailsSaveBtnDisabled = true;
    else validation.shippingDetailsSaveBtnDisabled = false;

    setShippingDetailsState(details);
  }, []);
  const onChangeDetails = (event) => {
    const obj = { ...shippingDetailsState };

    obj[event.target.id] = event.target.value;

    if (
      obj.validation[event.target.id + "isRequired"] &&
      event.target.value === "" &&
      event.target.id !== "shippingDetailsAttn"
    ) {
      obj.validation[event.target.id + "ValidationMessage"] =
        event.target.name + " is Required";
      obj.validation[event.target.id + "isInvalid"] = true;
      obj.validation[event.target.id + "isValid"] = false;
      obj.validation.shippingDetailsSaveBtnDisabled = true;
    } else if (event.target.id === "shippingDetailsZipcode") {
      if (event.target.value.length !== 5) {
        obj.validation[event.target.id + "ValidationMessage"] =
          event.target.name + " should have 5 numbers";
        obj.validation[event.target.id + "isInvalid"] = true;
        obj.validation[event.target.id + "isValid"] = false;
        obj.validation.shippingDetailsSaveBtnDisabled = true;
      } else {
        obj.validation[event.target.id + "ValidationMessage"] = "";
        obj.validation[event.target.id + "isInvalid"] = false;
        obj.validation[event.target.id + "isValid"] = true;
        const invalidArr = [
          "shippingDetailsAttnisInvalid",
          "shippingDetailsAddressLine1isInvalid",
          "shippingDetailsAddressLine2isInvalid",
          "shippingDetailsCityisInvalid",
          "shippingDetailsStateisInvalid",
        ];
        const res = invalidArr.filter((id) => obj.validation[id]);
        if (res.length > 0)
          obj.validation.shippingDetailsSaveBtnDisabled = true;
        else obj.validation.shippingDetailsSaveBtnDisabled = false;
      }
    } else {
      obj.validation[event.target.id + "ValidationMessage"] = "";
      obj.validation[event.target.id + "isInvalid"] = false;
      obj.validation[event.target.id + "isValid"] = true;
      const invalidArr = [
        "shippingDetailsAttnisInvalid",
        "shippingDetailsAddressLine1isInvalid",
        "shippingDetailsAddressLine2isInvalid",
        "shippingDetailsZipcodeisInvalid",
        "shippingDetailsCityisInvalid",
        "shippingDetailsStateisInvalid",
      ];
      const res = invalidArr.filter((id) => obj.validation[id]);
      if (res.length > 0) obj.validation.shippingDetailsSaveBtnDisabled = true;
      else obj.validation.shippingDetailsSaveBtnDisabled = false;
    }

    if (event.target.id === "shippingDetailsAttn") {
      obj.validation[event.target.id + "ValidationMessage"] = "";
      obj.validation[event.target.id + "isInValid"] = false;
      obj.validation[event.target.id + "isValid"] = true;
      //loop through all elements and check if they are invalid then do not enable save btn else enable
      const invalidArr = [
        "shippingDetailsAddressLine1isInvalid",
        "shippingDetailsAddressLine2isInvalid",
        "shippingDetailsZipcodeisInvalid",
        "shippingDetailsCityisInvalid",
        "shippingDetailsStateisInvalid",
      ];
      const res = invalidArr.filter((id) => obj.validation[id]);
      if (res.length > 0) obj.validation.shippingDetailsSaveBtnDisabled = true;
      else obj.validation.shippingDetailsSaveBtnDisabled = false;
    }

    let city = shippingDetailsState.shippingDetailsCity;
    let zip = shippingDetailsState.shippingDetailsZipcode;
    if (event.target.id === "shippingDetailsZipcode") {
      zip = event.target.value;
      zipCityStateValidation(
        obj,
        city,
        shippingDetailsState.shippingDetailsState,
        zip
      );
    } else if (event.target.id === "shippingDetailsCity") {
      city = event.target.value;
      zipCityStateValidation(
        obj,
        city,
        shippingDetailsState.shippingDetailsState,
        zip
      );
    } else {
      setShippingDetailsState(obj);
    }
  };

  const zipCityStateValidation = (
    details,
    city: string,
    state: string,
    zip: string
  ) => {
    if (city && state && zip && zip.toString().length === 5) {
      commonApiService
        .getZipCode(zip)
        .then((response: any) => {
          let errorMessage = validateZipStateCity(response.data, city, state);
          details.validation.shippingDetailsZipcodeisValid =
            errorMessage.length === 0;
          details.validation.shippingDetailsZipcodeisInvalid =
            errorMessage.length !== 0;
          details.validation.shippingDetailsZipcodeValidationMessage = errorMessage;
          if (details.validation.shippingDetailsZipcodeisInvalid) {
            details.validation.shippingDetailsSaveBtnDisabled = true;
          }
          if (details.validation.shippingDetailsZipcodeisValid) {
            details.validation.shippingDetailsSaveBtnDisabled = false;
          }
          setShippingDetailsState(details);
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    } else {
      setShippingDetailsState(details);
    }
  };

  const updateState = (value) => {
    const details = { ...shippingDetailsState };
    if (value === "") {
      details.validation.shippingDetailsStateisInvalid = true;
      details.validation.shippingDetailsSaveBtnDisabled = true;
    } else {
      details.validation.shippingDetailsStateisInvalid = false;
      details.validation.shippingDetailsSaveBtnDisabled = false;
    }

    details["shippingDetailsState"] = value;
    //setShippingDetailsState(details);

    zipCityStateValidation(
      details,
      shippingDetailsState.shippingDetailsCity,
      value,
      shippingDetailsState.shippingDetailsZipcode
    );
  };

  const onSave = (event) => {
    updateShippingDetailsState(shippingDetailsState);
    let shippingAddress = {
      line1: shippingDetailsState.shippingDetailsAddressLine1,
      line2: shippingDetailsState.shippingDetailsAddressLine2,
      line3: shippingDetailsState.shippingDetailsAddressLine3,
      city: shippingDetailsState.shippingDetailsCity,
      stateCode: shippingDetailsState.shippingDetailsState,
      zip: shippingDetailsState.shippingDetailsZipcode,
      instructions: shippingDetailsState.shippingDetailsInstructions,
    };

    let shippingAttn = shippingDetailsState.shippingDetailsAttn;
    let payload = {
      shippingAddress: shippingAddress,
      shippingAttn: shippingAttn,
    };
    const { addToast } = props.actions;
    propertyApiService
      .saveShippingDetails(tcn, payload)
      .then((response) => {
        addToast({
          text: `Shipping details successfully updated!`,
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        addToast({
          text: "Error updating shipping details. Please try again.",
          type: "error",
          heading: "Error",
        });
      });

    toggleModal(event);
  };
  return (
    <PPMSModal
      size={"lg"}
      body={
        <div className={"modal-adjustment"}>
          <div className="grid-row grid-gap-2">
            <div className={"tablet:grid-col-6"}>
              <PPMSInput
                value={shippingDetailsState.shippingDetailsAttn}
                label={"ATTN:"}
                id={"shippingDetailsAttn"}
                inputType={"text"}
                isRequired={false}
                isDisabled={false}
                maxLength={50}
                isValid={shippingDetailsState.validation.shippingDetailsAttnisValid}
                isInvalid={
                  shippingDetailsState.validation.shippingDetailsAttnisInvalid
                }
                validationMessage={
                  shippingDetailsState.validation
                    .shippingDetailsAttnValidationMessage
                }
                onChange={onChangeDetails}
              />
            </div>
          </div>
          <div className="grid-row grid-gap-2">
            <div className={"tablet:grid-col-8"}>
              <PPMSInput
                label={"Address Line 1"}
                id={"shippingDetailsAddressLine1"}
                inputType={"text"}
                name={"Address Line 1"}
                maxLength={36}
                value={shippingDetailsState.shippingDetailsAddressLine1}
                isDisabled={false}
                isRequired={
                  shippingDetailsState.validation
                    .shippingDetailsAddressLine1isRequired
                }
                isValid={
                  shippingDetailsState.validation.shippingDetailsAddressLine1isValid
                }
                isInvalid={
                  shippingDetailsState.validation
                    .shippingDetailsAddressLine1isInvalid
                }
                validationMessage={
                  shippingDetailsState.validation
                    .shippingDetailsAddressLine1ValidationMessage
                }
                onChange={onChangeDetails}
              />
            </div>
          </div>
          <div className="grid-row grid-gap-2">
            <div className={"tablet:grid-col-8"}>
              <PPMSInput
                value={shippingDetailsState.shippingDetailsAddressLine2}
                label={"Address Line 2"}
                name={"Address Line 2"}
                maxLength={36}
                id={"shippingDetailsAddressLine2"}
                inputType={"text"}
                isRequired={false}
                isDisabled={false}
                isValid={true}
                isInvalid={false}
                onChange={onChangeDetails}
              />
            </div>
          </div>
          <div className="grid-row grid-gap-2">
            <div className={"tablet:grid-col-8"}>
              <PPMSInput
                value={shippingDetailsState.shippingDetailsAddressLine3}
                label={"Address Line 3"}
                id={"shippingDetailsAddressLine3"}
                maxLength={36}
                inputType={"text"}
                isRequired={false}
                isDisabled={false}
                isValid={true}
                isInvalid={false}
                onChange={onChangeDetails}
              />
            </div>
          </div>
          <div className="grid-row grid-gap-2">
            <div className={"tablet:grid-col-6"}>
              <PPMSInput
                value={shippingDetailsState.shippingDetailsCity}
                label={"City"}
                id={"shippingDetailsCity"}
                maxLength={36}
                name={"City"}
                inputType={"text"}
                isRequired={
                  shippingDetailsState.validation.shippingDetailsCityisRequired
                }
                isDisabled={false}
                isValid={shippingDetailsState.validation.shippingDetailsCityisValid}
                isInvalid={
                  shippingDetailsState.validation.shippingDetailsCityisInvalid
                }
                validationMessage={
                  shippingDetailsState.validation
                    .shippingDetailsCityValidationMessage
                }
                onChange={onChangeDetails}
              />
            </div>
            <div className={"tablet:grid-col-4"}>
              <PPMSState
                id={"shippingDetailsState"}
                label={"State"}
                required={true}
                isInvalid={false}
                isValid={true}
                selectedState={shippingDetailsState.shippingDetailsState}
                updateLocationState={(value: any) => {
                  updateState(value);
                }}
                disabled={false}
              />
            </div>
          </div>
          <div className="grid-row grid-gap-2">
            <div className={"tablet:grid-col-3"}>
              <PPMSInput
                value={shippingDetailsState.shippingDetailsZipcode}
                className={"edit-shipping-zipcode"}
                label={"Zipcode"}
                name={"Zipcode"}
                id={"shippingDetailsZipcode"}
                inputType={"number"}
                isRequired={
                  shippingDetailsState.validation.shippingDetailsZipcodeisRequired
                }
                isDisabled={false}
                isValid={
                  shippingDetailsState.validation.shippingDetailsZipcodeisValid
                }
                isInvalid={
                  shippingDetailsState.validation.shippingDetailsZipcodeisInvalid
                }
                validationMessage={
                  shippingDetailsState.validation
                    .shippingDetailsZipcodeValidationMessage
                }
                onChange={(e) => {
                  if (e.target.value.length > 5) {
                    e.preventDefault();
                    return false;
                  } else {
                    onChangeDetails(e);
                  }
                }}
              />
            </div>
          </div>
          
            <PPMSTextArea
              label={"Shipping Instructions"}
              isInvalid={false}
              isValid={false}
              id={"shippingDetailsInstructions"}
              isRequired={false}
              isDisabled={false}
              inputType={"text"}
              maxLength={200}
              defaultValue={shippingDetailsState.shippingDetailsInstructions}
              onChange={onChangeDetails}
            />
            <span>
              <strong>{200}</strong> max length
            </span>
          
        </div>
      }
      id={"shipping-update"}
      show={showModal}
      handleClose={resetState}
      handleSave={onSave}
      title={"Shipping Information"}
      label={"Save"}
      labelCancel={"Cancel"}
      disableSave={
        shippingDetailsState.validation.shippingDetailsSaveBtnDisabled
      }
      backdrop={"static"}
    />
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(EditShippingInfo);
