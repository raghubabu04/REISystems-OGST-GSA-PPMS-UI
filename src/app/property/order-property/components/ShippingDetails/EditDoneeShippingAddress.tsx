import React, { useContext, useState, useEffect } from "react";
import { connect } from "react-redux";
import { ShoppingContext } from "../ShoppingCartContext";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { PropertyApiService } from "../../../../../api-kit/property/property-api-service";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { PPMSAddress } from "../../../../../ui-kit/components/PPMS-address";
import { UserApiService } from "../../../../../api-kit/user/user-api.service";
import { DoneeModal } from "../../../../models/DoneeModel";
import { isEmptyCheck } from "../../../../../ui-kit/components/validations/FieldValidations";
import { AllocationContext } from "../../../allocate-property/AllocationContext";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSTextArea } from "../../../../../ui-kit/components/common/input/PPMS-textarea";

export interface Props {
  toggleDoneeShippingModal?: any;
  showDoneeShipModal?: any;
  userId?: any;
  actions?: any;
  isAllocation?: boolean;
}

function EditDoneeShippingAddress(props: Props) {
  const propertyApiService = new PropertyApiService();
  const { toggleDoneeShippingModal, showDoneeShipModal, userId } = props;

  const { shippingDetailsState, updateShippingDetailsState } = useContext(
    props.isAllocation ? AllocationContext : ShoppingContext
  );
  const resetState = (event) => {
    toggleDoneeShippingModal(event);
  };

  useEffect(() => {
    propertyApiService
      .getDoneeShippingDetailsByCartId(shippingDetailsState.cartId)
      .then((res) => {
        let shippingDetails = res.data?.leaShippingAddress;
        updateShippingDetailsState({
          doneeShippingId: shippingDetails.addressId,
          doneeShippingAddressLine1: shippingDetails.line1,
          doneeShippingAddressLine2: shippingDetails.line2,
          doneeShippingAddressLine3: shippingDetails.line3,
          doneeShippingCity: shippingDetails.city,
          doneeShippingStateCode: shippingDetails.stateCode,
          doneeShippingZipcode: shippingDetails.zip,
          doneeShippingZipExt: shippingDetails.zip2,
          doneeShippingInstructions: shippingDetails.instructions,
          doneeShippingAddressAttn: res.data?.leaShippingAttn,
        });
      })
      .catch((error) => {});
  }, []);

  function validateDoneeShippingInfo() {
    let valid: boolean = true;
    let doneeShippingState = { ...shippingDetailsState };
    if (shippingDetailsState.doneeShippingDetailsDisabled) {
      return true;
    } else {
      if (isEmptyCheck(shippingDetailsState.doneeShippingZipcode)) {
        valid = false;
        doneeShippingState.doneeShippingZipcodeIsInvalid = true;
        doneeShippingState.doneeShippingZipcodeValidationMessage =
          "Zip code is Required.";
      }

      if (isEmptyCheck(shippingDetailsState.doneeShippingAddressLine1)) {
        valid = false;
        doneeShippingState.doneeShippingAddressLine1IsInvalid = true;
      }
      if (isEmptyCheck(shippingDetailsState.doneeShippingCity)) {
        valid = false;
        doneeShippingState.doneeShippingCityIsInvalid = true;
      }
      if (isEmptyCheck(shippingDetailsState.doneeShippingStateCode)) {
        valid = false;
        doneeShippingState.doneeShippingStateIsInvalid = true;
      }

      updateShippingDetailsState({
        ...doneeShippingState,
      });
      if (
        shippingDetailsState.doneeShippingZipcodeIsInvalid ||
        shippingDetailsState.doneeShippingAddressLine1IsInvalid ||
        shippingDetailsState.doneeShippingCityIsInvalid ||
        shippingDetailsState.doneeShippingStateIsInvalid
      ) {
        valid = false;
      }
    }
    return valid;
  }

  function toDoneeJson(): DoneeModal {
    let leaShippingAddress = {
      addressId: shippingDetailsState.doneeShippingId,
      line1: shippingDetailsState.doneeShippingAddressLine1,
      line2: shippingDetailsState.doneeShippingAddressLine2,
      line3: shippingDetailsState.doneeShippingAddressLine3,
      city: shippingDetailsState.doneeShippingCity,
      stateCode: shippingDetailsState.doneeShippingStateCode,
      zip: shippingDetailsState.doneeShippingZipcode,
      zip2: shippingDetailsState.doneeShippingZipExt,
      instructions: shippingDetailsState.doneeShippingInstructions,
    };
    return {
      cartId: shippingDetailsState.cartId,
      leaUserId: shippingDetailsState.doneeInfoUserId,
      leaShippingAttn: shippingDetailsState.doneeShippingAddressAttn,
      leaShippingAddress: leaShippingAddress,
    };
  }

  const onSave = (event) => {
    const { addToast } = props.actions;
    if (validateDoneeShippingInfo()) {
      let leaShippingData: DoneeModal = toDoneeJson();
      propertyApiService
        .saveCartRequestLeaInfo(leaShippingData)
        .then((res) => {
          let shippingAddress = res.data?.leaShippingAddress;
          updateShippingDetailsState({
            doneeShippingId: shippingAddress?.addressId,
            doneeTileShippingAddressLine1: shippingAddress?.line1,
            doneeTileShippingAddressLine2: shippingAddress?.line2,
            doneeTileShippingAddressLine3: shippingAddress?.line3,
            doneeTileShippingCity: shippingAddress?.city,
            doneeTileShippingStateCode: shippingAddress?.stateCode,
            doneeTileShippingZipcode: shippingAddress?.zip,
            doneeTileShippingZipExt: shippingAddress?.zip2,
            doneeTileShippingAddressAttn: res.data?.leaShippingAttn,
            doneeTileShippingInstructions: shippingAddress?.instructions,

            isShippingUpdated: true,
          });

          addToast({
            text: `Donee (LEA) Shipping Information successfully updated!`,
            type: "success",
            heading: "Success",
          });
          toggleDoneeShippingModal(event);
        })
        .catch((error) => {
          addToast({
            text:
              "Error updating Donee (LEA) Shipping Information. Please try again.",
            type: "error",
            heading: "Error",
          });
        });
    }
  };

  return (
    <PPMSModal
      body={
        <div className={"modal-adjustment"}>
          <PPMSInput
            value={shippingDetailsState.doneeShippingAddressAttn}
            label={"ATTN:"}
            id={"shippingDetailsAttn"}
            inputType={"text"}
            isRequired={false}
            isDisabled={false}
            maxLength={50}
            isValid={true}
            isInvalid={false}
            onChange={(event) => {
              updateShippingDetailsState({
                doneeShippingAddressAttn: event.target.value,
              });
            }}
          />
          <PPMSAddress
            id={"donee-address"}
            title={"Donee Shipping"}
            showAddressLine3={true}
            address1={shippingDetailsState.doneeShippingAddressLine1}
            address1Required={true}
            address1IsInvalid={
              shippingDetailsState.doneeShippingAddressLine1IsInvalid
            }
            address1IsValid={
              !shippingDetailsState.doneeShippingAddressLine1IsInvalid
            }
            address1ValidationMessage={
              shippingDetailsState.doneeShippingAddressLine1ValidationMessage
            }
            onChangeAddress1={(value) => {
              updateShippingDetailsState({
                doneeShippingAddressLine1: value,
              });
            }}
            updateAddress1={(value: any, validation: any) => {
              let valid = value?.length > 0;
              updateShippingDetailsState({
                doneeShippingAddressLine1: value,
                doneeShippingAddressLine1IsInvalid: !valid,
                doneeShippingAddressLine1IsValid: valid,
                doneeShippingAddressLine1ValidationMessage:
                  validation.validationError,
              });
            }}
            address2={shippingDetailsState.doneeShippingAddressLine2}
            address2Required={false}
            address2IsInvalid={
              shippingDetailsState.doneeShippingAddressLine2IsInvalid
            }
            address2IsValid={
              !shippingDetailsState.doneeShippingAddressLine2IsInvalid
            }
            address2ValidationMessage={
              shippingDetailsState.doneeShippingAddressLine2ValidationMessage
            }
            updateAddress2={(value: any, validation: any) => {
              let valid = value?.length > 0;
              updateShippingDetailsState({
                doneeShippingAddressLine2: value,
                doneeShippingAddressLine2IsInvalid: !valid,
                doneeShippingAddressLine2IsValid: valid,
                doneeShippingAddressLine2ValidationMessage:
                  validation.validationError,
              });
            }}
            address3={shippingDetailsState.doneeShippingAddressLine3}
            address3Required={false}
            address3IsInvalid={
              shippingDetailsState.doneeShippingAddressLine3IsInvalid
            }
            address3IsValid={
              !shippingDetailsState.doneeShippingAddressLine3IsInvalid
            }
            address3ValidationMessage={
              shippingDetailsState.doneeShippingAddressLine3ValidationMessage
            }
            updateAddress3={(value: any, validation: any) => {
              let valid = value?.length > 0;
              updateShippingDetailsState({
                doneeShippingAddressLine3: value,
                doneeShippingAddressLine3IsInvalid: !valid,
                doneeShippingAddressLine3IsValid: valid,
                doneeShippingAddressLine3ValidationMessage:
                  validation.validationError,
              });
            }}
            city={shippingDetailsState.doneeShippingCity}
            cityRequired={true}
            cityIsInvalid={shippingDetailsState.doneeShippingCityIsInvalid}
            cityIsValid={!shippingDetailsState.doneeShippingCityIsInvalid}
            cityValidationMessage={
              shippingDetailsState.doneeShippingCityValidationMessage
            }
            onChangeCity={(value) => {
              updateShippingDetailsState({
                doneeShippingCity: value,
              });
            }}
            updateCity={(value: any, validation: any) => {
              let valid = value?.length > 0;
              updateShippingDetailsState({
                doneeShippingCity: value,
                doneeShippingCityIsInvalid: !valid,
                doneeShippingCityIsValid: valid,
                doneeShippingCityValidationMessage: validation.validationError,
              });
            }}
            state={shippingDetailsState.doneeShippingStateCode}
            stateRequired={true}
            stateIsInvalid={shippingDetailsState.doneeShippingStateIsInvalid}
            stateIsValid={!shippingDetailsState.doneeShippingStateIsInvalid}
            updateState={(value: any, validation: any) => {
              let valid = value?.length > 0;
              updateShippingDetailsState({
                doneeShippingStateCode: value,
                doneeShippingStateIsInvalid: !valid,
                doneeShippingStateIsValid: valid,
                doneeShippingStateValidationMessage: validation.validationError,
              });
            }}
            zip={shippingDetailsState.doneeShippingZipcode}
            zipRequired={true}
            zipIsInvalid={shippingDetailsState.doneeShippingZipcodeIsInvalid}
            zipIsValid={!shippingDetailsState.doneeShippingZipcodeIsInvalid}
            zipValidationMessage={
              shippingDetailsState.doneeShippingZipcodeValidationMessage
            }
            onChangeZip={(value) => {
              updateShippingDetailsState({
                doneeShippingZipcode: value,
                doneeShippingZipcodeIsInvalid: false,
                doneeShippingZipcodeValidationMessage: "",
              });
            }}
            updateZip={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string,
              disabledZipExtension: boolean
            ) => {
              updateShippingDetailsState({
                doneeShippingZipcodeIsInvalid: inValid,
                doneeShippingZipcodeValidationMessage: validationError,
                doneeShippingdisabledZipExtension: disabledZipExtension,
              });
            }}
            validationExtensionMessage={
              shippingDetailsState.doneeShippingZipcodeValidationMessage
            }
            showZipExtension={false}
            zip2={shippingDetailsState.doneeShippingZipExt}
            zip2IsInvalid={shippingDetailsState.doneeShippingZipExtIsInvalid}
            zip2IsValid={!shippingDetailsState.doneeShippingZipExtIsInvalid}
            disabledZipExtension={
              shippingDetailsState.doneeShippingdisabledZipExtension
            }
            onChangeZipExtension={(value) => {
              updateShippingDetailsState({
                doneeShippingZipExt: value,
              });
            }}
            updateZipExtension={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string
            ) => {
              updateShippingDetailsState({
                doneeShippingZipExt: value,
                doneeShippingZipExtIsInvalid: inValid,
                doneeShippingZipExtIsValid: valid,
                doneeShippingZipExtValidationMessage: validationError,
              });
            }}
          />
          <PPMSTextArea
            label={"Shipping Instructions"}
            isInvalid={false}
            isValid={false}
            id={"doneeShippingDetailsInstructions"}
            isRequired={false}
            isDisabled={false}
            inputType={"text"}
            maxLength={200}
            defaultValue={shippingDetailsState.doneeShippingInstructions}
            onChange={(event) => {
              updateShippingDetailsState({
                doneeShippingInstructions: event.target.value,
              });
            }}
          />
        </div>
      }
      id={"donee-shipping-update"}
      show={showDoneeShipModal}
      handleClose={resetState}
      handleSave={onSave}
      title={"Edit Donee (LEA) Shipping Address"}
      label={"Save"}
      labelCancel={"Cancel"}
      disableSave={shippingDetailsState.doneeShippingSaveBtnDisabled}
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDoneeShippingAddress);
