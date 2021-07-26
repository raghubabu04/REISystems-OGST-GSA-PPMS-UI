import React, { useContext, useEffect, useMemo } from "react";
import { PropertyContext } from "../PropertyContext";
import { PropertyLocationModal } from "./PropertyLocationModal";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { nullToStringUtil } from "../../../../ui-kit/utilities/FormatUtil";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSAddress } from "../../../../ui-kit/components/PPMS-address";
import {
  zipValidation,
  zipInvalidMessage,
} from "../../../../ui-kit/components/validations/FieldValidations";
import { isFormSubmitted } from "../../../../service/validation.service";
import validateFSCSalesCenter from "../validations/validateFSCSalesCenter";
import { connect } from "react-redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { PropertyLocationInfoTip } from "./PropertyLocationInfoTip";
import { PropertyLocationStateDefault } from "./PropertyLocationState";
import { FaTrash } from "react-icons/fa";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";

interface PropertyLocationProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function PropertyLocationClass(props: PropertyLocationProps) {
  //set state for this functional componnet
  const {
    propertyLocationState,
    updatePropertyLocationState,
    updateFSCState,
    fscState,
    icnState,
    agencyInfoState,
  } = useContext(PropertyContext);
  const { addToast } = props.actions;

  let commonApiService = new CommonApiService();
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
  }, [propertyLocationState]);

  function handleSelection(value: any) {
    if (!value) {
      updatePropertyLocationState({
        ...PropertyLocationStateDefault,
        propLocValues: propertyLocationState.propLocValues,
      });
    } else {
      const pLoc = propertyLocationState.propLocValues.filter(
        (o) => o["keyDisplayStr"] === value
      );
      if (pLoc[0]) {
        updatePropertyLocationState({
          propLocationId: pLoc[0] ? pLoc[0]["aacPropertyLocationId"] : null,
          addressId: pLoc[0]["addressId"],
          propAacCode: pLoc[0]["aacCode"],
          propAddress1: pLoc[0]["line1"],
          propAddress2: pLoc[0]["line2"],
          propAddress3: pLoc[0]["line3"],
          propCity: pLoc[0]["city"],
          propState: pLoc[0]["stateCode"],
          propStateCode: pLoc[0]["stateCode"],
          propZipCode: pLoc[0]["zip"],
          propZip2Code: nullToStringUtil(pLoc[0]["zip2"]),
          keyDisplayStr: pLoc[0]["keyDisplayStr"],
          updateDisabled: false,
          propAddress1IsInvalid: false,
          propAddress1IsValid: true,
          propAddress2IsInvalid: false,
          propAddress2IsValid: true,
          propAddress3IsInvalid: false,
          propAddress3IsValid: true,
          propCityIsInvalid: false,
          propCityIsValid: true,
          propStateIsInvalid: false,
          propStateIsValid: true,
          propZipIsInvalid: false,
          propZipIsValid: true,
          propZip2IsInvalid: false,
          propZip2IsValid: true,
          disabledZipExtension: false,
        });
      }
    }
  }

  function handleDeletePropertyLocation(){
    commonApiService.deletePropertyLocationById(propertyLocationState.propLocationId).then((res)=>{
      updatePropertyLocationState(PropertyLocationStateDefault);
      refreshPropertyLocationList();
      addToast({
        text: "Property Location deleted Successfully",
        type: "success",
        heading: "Success",
      });
    })
  }


  function validateForm() {
    let validateAddressLine1 = propertyLocationState.propAddress1?.length > 0;
    let validateCity = propertyLocationState.propCity?.length > 0;
    let validateState = propertyLocationState.propStateCode?.length > 0;
    let validateZip = zipValidation(propertyLocationState.propZipCode, true);

    if (
      propertyLocationState.propZipValidationMessage.indexOf(
        zipInvalidMessage
      ) !== -1
    ) {
      validateZip.isInvalid = true;
      validateZip.validationError = zipInvalidMessage;
    }

    if (!validateAddressLine1) {
      updatePropertyLocationState({
        propAddress1IsInvalid: true,
        propAddress1IsValid: false,
      });
    } else {
      updatePropertyLocationState({
        propAddress1IsInvalid: false,
        propAddress1IsValid: true,
      });
    }

    if (!validateCity) {
      updatePropertyLocationState({
        propCityIsInvalid: true,
        propCityIsValid: false,
      });
    } else {
      updatePropertyLocationState({
        propCityIsInvalid: false,
        propCityIsValid: true,
        propCityValidationMessage: "",
      });
    }

    if (!validateState) {
      updatePropertyLocationState({
        propStateIsInvalid: true,
        propStateIsValid: false,
      });
    }

    if (validateZip.isInvalid) {
      updatePropertyLocationState({
        propZipIsInvalid: validateZip.isInvalid,
        propZipIsvalid: !validateZip.isInvalid,
      });
    } else {
      updatePropertyLocationState({
        propZipIsInvalid: validateZip.isInvalid,
        propZipIsvalid: !validateZip.isInvalid,
        propZipValidationMessage: "",
      });
    }

    if (
      validateAddressLine1 &&
      validateCity &&
      validateState &&
      !validateZip.isInvalid &&
      !propertyLocationState.propZip2IsInvalid
    )
      return true;
    else return false;
  }

  function handlePropertyLocationUpdate() {
    const { addToast } = props.actions;
    if (validateForm()) {
      let propertyLocation = {
        aacPropertyLocationId: propertyLocationState.propLocationId
          ? propertyLocationState.propLocationId
          : null,
        aacCode: propertyLocationState.propAacCode,
        line1: propertyLocationState.propAddress1,
        line2: propertyLocationState.propAddress2,
        line3: propertyLocationState.propAddress3,
        city: propertyLocationState.propCity,
        stateCode: propertyLocationState.propStateCode,
        zip: propertyLocationState.propZipCode,
        zip2: propertyLocationState.propZip2Code,
        addressId: propertyLocationState.addressId,
      };
      let updatedKey =
     
        propertyLocationState.propAddress1 +
        "-" +
        propertyLocationState.propCity;
      let canUpdate = true;
      propertyLocationState.propLocValues.some((propLocValue: any) => {
        if (
          propLocValue["line1"].toLowerCase() ===
            propertyLocation.line1.toLowerCase() &&
          propLocValue["line2"].toLowerCase() ===
            propertyLocation.line2.toLowerCase() &&
          propLocValue["city"].toLowerCase() ===
            propertyLocation.city.toLowerCase() &&
          propLocValue["zip"] + "" === propertyLocation.zip + "" &&
          propLocValue["aacPropertyLocationId"] !==
            propertyLocation.aacPropertyLocationId
        ) {
          canUpdate = false;
          return true;
        } else {
          return false;
        }
      });
      if (canUpdate) {
        commonApiService
          .saveAndUpdatePropertyLocation(propertyLocation)
          .then((response) => {
            refreshPropertyLocationList();
            updatePropertyLocationState({
              keyDisplayStr: updatedKey,
              updateDisabled: false,
              propAddress1IsInvalid: false,
              propAddress1IsValid: true,
              propAddress2IsInvalid: false,
              propAddress2IsValid: true,
              propAddress3IsInvalid: false,
              propAddress3IsValid: true,
              propCityIsInvalid: false,
              propCityIsValid: true,
              propStateIsInvalid: false,
              propStateIsValid: true,
              propZipIsInvalid: false,
              propZipIsValid: true,
              propZip2IsInvalid: false,
              propZip2IsValid: true,
              disabledZipExtension: false,
            });
            addToast({
              text: "Property Location successfully Updated",
              type: "success",
              heading: "Success",
            });
          })
          .catch(() => {
            addToast({
              text: "Property Location failed to update.",
              type: "error",
              heading: "Error",
            });
          });
      } else {
        updatePropertyLocationState({
          propAddress1IsInvalid: true,
          propAddress1IsValid: false,
          propAddress1ValidationMessage:
            "Property Location Address Line 1 already exists.",
          propCityIsInvalid: true,
          propCityIsValid: false,
          propCityValidationMessage: "Property Location City already exists.",
          propZipIsInvalid: true,
          propsZipIsvalid: false,
          propZipValidationMessage: "Property Location Zip Code already exists",
        });
      }
    } else {
      //VALIDATION Errors
    }
  }
  function refreshPropertyLocationList() {
    commonApiService
      .getPropertyLocationList(propertyLocationState.propAacCode)
      .then((res: any) => {
        if (res.data) {
          let propLoc: any = res.data;
          let values: any = [];
          values = [];
          updatePropertyLocationState({
            propLocValues: values,
          });
          propLoc.forEach((locOb: any) => {
            let value: any = {};
            let keyDisplayStr =
           
              locOb["line1"].trim() +
              "-" +
              locOb["city"].trim();
            value = { ...locOb, keyDisplayStr: keyDisplayStr };
            values.push(value);
          });
          updatePropertyLocationState({
            propLocValues: values,
          });
        }
      })
      .catch(() => {
        //TODO - Handle these in future
        // console.log(error);
      });
  }

  function modalOpen() {
    updatePropertyLocationState({ modalShow: true });
  }

  function handleModalShow(data: any) {
    updatePropertyLocationState({ modalShow: false });
    refreshPropertyLocationList();
    if (data !== "close")
      updatePropertyLocationState({
        ...data,
        updateDisabled: false,
        propAddress1IsInvalid: false,
        propAddress1IsValid: true,
        propAddress2IsInvalid: false,
        propAddress2IsValid: true,
        propAddress3IsInvalid: false,
        propAddress3IsValid: true,
        propCityIsInvalid: false,
        propCityIsValid: true,
        propStateIsInvalid: false,
        propStateIsValid: true,
        propZipIsInvalid: false,
        propZipIsValid: true,
        propZip2IsInvalid: false,
        propZip2IsValid: true,
        disabledZipExtension: false,
      });
  }
  // PPDMS:763 -Validate "Federal Asset Sales Center" against "Selected FederalSalesCenter"
  function handleFederalAssetSalesCenter(state: any) {
    let validatedSalesCenter = validateFSCSalesCenter(
      //Passing state as selectedStateCode
      fscState.fcsSelectedValue,
      fscState.data.fscCode,
      icnState.aacCode,
      state,
      agencyInfoState.aac
    );

    // PPDMS:763 -Update FSCState after Validation"
    updateFSCState({
      isSalesCenterValid: !validatedSalesCenter.isSalesCenterInValid,
      isSalesCenterInvalid: validatedSalesCenter.isSalesCenterInValid,
      salesCenterValidationMessage:
        validatedSalesCenter.salesCenterValidationMessage,
      disabled: validatedSalesCenter.isSalesCenterdisabled,
      fcsSelectedValue: fscState.federalSalesCenter,
      federalSalesCenter: fscState.federalSalesCenter,
    });
  }

  return useMemo(() => {
    return (
      <React.Fragment>
        <PPMSSelect
          placeholderValue={"Select Property Location"}
          selectName={"selectPropertyLocation"}
          values={propertyLocationState.propLocValues}
          onChange={(event) => handleSelection(event.target.value)}
          isValid={false}
          isInvalid={false}
          validationMessage={""}
          identifierKey={"keyDisplayStr"}
          identifierValue={"keyDisplayStr"}
          selectedValue={propertyLocationState.keyDisplayStr}
          label={"Property Locations"}
          isRequired={false}
          infoTipContent={<PropertyLocationInfoTip />}
          infoTipClass={"ppms-usa-input-info-body"}
        />
        <PPMSAddress
          id={"property-location"}
          title={"Property Location"}
          showAddressLine3={true}
          disableZipValidation={
            fscState.specialInstructions === "Overseas Inventory"
          }
          //updateParentState={handleToUpdateAddressState.bind(this)}
          address1={propertyLocationState.propAddress1}
          address1Required={true}
          address1IsInvalid={propertyLocationState.propAddress1IsInvalid}
          address1IsValid={propertyLocationState.propAddress1IsValid}
          address1ValidationMessage={
            propertyLocationState.propAddress1ValidationMessage
          }
          onChangeAddress1={(value) => {
            updatePropertyLocationState({
              propAddress1: value,
            });
          }}
          updateAddress1={(value: any, validation: any) => {
            let valid = value.length > 0;
            updatePropertyLocationState({
              propAddress1: value,
              propAddress1IsInvalid: !valid,
              propAddress1IsValid: valid,
              propAddress1ValidationMessage: validation.validationError,
              propAddress2IsInvalid: false,
              propAddress2IsValid: false,
              propAddress2ValidationMessage: "",
              propCityIsInvalid: false,
              propCityIsValid: false,
              propCityValidationMessage: "",
              propZipIsInvalid: false,
              propZipIsValid: false,
              propZipValidationMessage: "",
            });
          }}
          address2={propertyLocationState.propAddress2}
          address2Required={false}
          address2IsInvalid={propertyLocationState.propAddress2IsInvalid}
          address2IsValid={propertyLocationState.propAddress2IsValid}
          address2ValidationMessage={
            propertyLocationState.propAddress2ValidationMessage
          }
          updateAddress2={(value: any, validation: any) => {
            let valid = value.length > 0 ? true : false;
            updatePropertyLocationState({
              propAddress2: value,
              propAddress2IsInvalid: !valid,
              propAddress2IsValid: valid,
              propAddress2ValidationMessage: validation.validationError,
            });
          }}
          address3={propertyLocationState.propAddress3}
          address3Required={false}
          address3IsInvalid={propertyLocationState.propAddress3IsInvalid}
          address3IsValid={propertyLocationState.propAddress3IsValid}
          address3ValidationMessage={
            propertyLocationState.propAddress3ValidationMessage
          }
          updateAddress3={(value: any, validation: any) => {
            let valid = value.length > 0 ? true : false;
            updatePropertyLocationState({
              propAddress3: value,
              propAddress3IsInvalid: !valid,
              propAddress3IsValid: valid,
              propAddress3ValidationMessage: validation.validationError,
            });
          }}
          city={propertyLocationState.propCity}
          cityRequired={true}
          cityIsInvalid={propertyLocationState.propCityIsInvalid}
          cityIsValid={propertyLocationState.propCityIsValid}
          cityValidationMessage={
            propertyLocationState.propCityValidationMessage
          }
          onChangeCity={(value) => {
            updatePropertyLocationState({
              propCity: value,
            });
          }}
          updateCity={(value: any, validation: any) => {
            let valid = value.length > 0;
            updatePropertyLocationState({
              propCity: value,
              propCityIsInvalid: !valid,
              propCityIsValid: valid,
              propCityValidationMessage: validation.validationError,
              propAddress2IsInvalid: false,
              propAddress2IsValid: false,
              propAddress2ValidationMessage: "",
              propAddress1IsInvalid: false,
              propAddress1IsValid: false,
              propAddress1ValidationMessage: "",
              propZipIsInvalid: false,
              propZipIsValid: false,
              propZipValidationMessage: "",
            });
          }}
          state={propertyLocationState.propStateCode}
          stateRequired={true}
          stateIsInvalid={propertyLocationState.propStateIsInvalid}
          stateIsValid={propertyLocationState.propStateIsValid}
          updateState={(value: any, validation: any) => {
            handleFederalAssetSalesCenter(value);
            updatePropertyLocationState({
              propStateCode: value,
              propState: value,
              propStateIsInvalid: validation.isInvalid,
              propStateIsValid: !validation.isInvalid,
              propStateValidationMessage: validation.error,
            });
          }}
          zip={propertyLocationState.propZipCode}
          zipRequired={true}
          showZipExtension={true}
          zipIsInvalid={propertyLocationState.propZipIsInvalid}
          zipIsValid={propertyLocationState.propZipIsValid}
          zipValidationMessage={propertyLocationState.propZipValidationMessage}
          onChangeZip={(value) => {
            updatePropertyLocationState({
              propZipCode: value,
            });
          }}
          updateZip={(
            value: any,
            inValid: boolean,
            valid: boolean,
            validationError: string,
            disabledZipExtension: boolean
          ) => {
            updatePropertyLocationState({
              propZipCode: value,
              propZipIsInvalid: inValid,
              propZipIsValid: valid,
              propZipValidationMessage: validationError,
              disabledZipExtension: disabledZipExtension,
            });
          }}
          validationExtensionMessage={
            propertyLocationState.propZip2ValidationMessage
          }
          zip2={propertyLocationState.propZip2Code}
          zip2IsInvalid={propertyLocationState.propZip2IsInvalid}
          zip2IsValid={propertyLocationState.propZip2IsValid}
          disabledZipExtension={propertyLocationState.disabledZipExtension}
          onChangeZipExtension={(value) => {
            updatePropertyLocationState({
              propZip2Code: value,
            });
          }}
          updateZipExtension={(
            value: any,
            inValid: boolean,
            valid: boolean,
            validationError: string
          ) => {
            updatePropertyLocationState({
              propZip2Code: value,
              propZip2IsInvalid: inValid,
              propZip2IsValid: valid,
              propZip2ValidationMessage: validationError,
            });
          }}
        />  
        <div className={"grid-row grid-gap-4 update-buttons"}>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              id={"update-pl"}
              variant={"primary"}
              type={"button"}
              value={""}
              isDisabled={propertyLocationState.updateDisabled}
              label={"Update Property Location"}
              onPress={handlePropertyLocationUpdate}
            />
          </div>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              variant={"primary"}
              type={"button"}
              label={"Add Property Location"}
              onPress={modalOpen.bind(this)}
              id={"add-pl"}
            />
          </div>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              variant={"danger"}
              type={"button"}
              label={" Delete"}
              icon={<FaTrash />}
              isDisabled={propertyLocationState.updateDisabled}
              onPress={() => {
                updatePropertyLocationState({
                  deleteAlert: true
                })
              }}
              id={"delete-pl"}
            />
          </div>
        </div>
        <PropertyLocationModal
          modalOpen={propertyLocationState.modalShow}
          onModalChange={(data: any) => {
            handleModalShow(data);
          }}
          aacCode={propertyLocationState.propAacCode}
          propLocValues={propertyLocationState.propLocValues}
          {...props}
        />
          <PPMSModal
          show={propertyLocationState.deleteAlert}
          backdrop={"static"}
          body={"Do you want to delete the selected property location?"}
          id={"pocDeleteModal"}
          handleClose={() => {
            updatePropertyLocationState({
              deleteAlert: false,
            });
          }}
          centered={true}
          handleSaveType={"button"}
          handleSave={handleDeletePropertyLocation}
          title={"Delete Confirmation"}
          label={"Yes"}
          labelCancel={"No"}
        />
      </React.Fragment>
    );
  }, [propertyLocationState, fscState.specialInstructions]);
}

//export default PropertyLocationClass;
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(PropertyLocationClass);
