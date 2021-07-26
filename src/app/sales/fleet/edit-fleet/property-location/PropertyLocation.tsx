import React, { useContext, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { PPMSAddress } from "../../../../../ui-kit/components/PPMS-address";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { FleetContext } from "../Fleet-context";
import { isFormSubmitted } from "../../../../../service/validation.service";
import { UserUtils } from "../../../../../utils/UserUtils";

interface PropertyLocationProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function PropertyLocation(props: PropertyLocationProps) {
  const { propertyLocationState, updatePropertyLocationState } = useContext(
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
  }, [propertyLocationState]);

  function validateForm() {
    let locationState = propertyLocationState;
    let cityValid = locationState.city.length > 0;
    let stateValid = locationState.state.length > 0;
    let zipCodeValid = locationState.zipCode.length > 0;
    let propertyLocationCodeValid =
      locationState.propertyLocationCode.length > 0;

    if (!cityValid) {
      locationState.cityIsInValid = true;
      locationState.cityIsValid = false;
      locationState.cityValidationMessage =
        "Property Location city is Required.";
    }
    if (!stateValid) {
      locationState.stateIsInValid = true;
      locationState.stateIsValid = false;
      locationState.stateValidationMessage =
        "Property Location state is Required";
    }
    if (!zipCodeValid) {
      locationState.zipCodeIsInValid = true;
      locationState.ZipCodeIsValid = false;
      locationState.zipCodeValidationMessage =
        "Property Location zip code is Required.";
    }
    if (!propertyLocationCodeValid && !UserUtils.isUserFleetExt()) {
      locationState.propertyLocationCodeIsInValid = true;
      locationState.propertyLocationCodeIsValid = true;
      locationState.propertyLocationCodeValidationMessage =
        "Property Location code is Required.";
    }
    updatePropertyLocationState(locationState);
  }

  return (
    <>
      <div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-7"}>
            <PPMSInput
              id={"fleetSiteName"}
              inputType={"text"}
              label={"Site Name"}
              labelBold={false}
              isRequired={false}
              maxLength={30}
              minLength={1}
              isDisabled={false}
              placeHolder={" "}
              value={propertyLocationState.siteName}
              onChange={(event) => {
                updatePropertyLocationState({
                  siteName: event?.target?.value,
                });
              }}
              isValid={false}
              isInvalid={false}
              validationMessage={""}
            />
          </div>
        </div>
        <PPMSAddress
          title={"Property Location"}
          address1={propertyLocationState.addressLine1}
          onChangeAddress1={(value) => {
            updatePropertyLocationState({
              addressLine1: value,
            });
          }}
          address1MaxLength={30}
          address2MaxLength={30}
          showAddressLine3={false}
          address1Required={false}
          address2={propertyLocationState.addressLine2}
          updateAddress2={(value) => {
            updatePropertyLocationState({
              addressLine2: value,
            });
          }}
          address2Required={false}
          cityRequired={true}
          city={propertyLocationState.city}
          cityIsInvalid={propertyLocationState.cityIsInValid}
          cityIsValid={propertyLocationState.cityIsValid}
          cityValidationMessage={propertyLocationState.cityValidationMessage}
          onChangeCity={(value) => {
            updatePropertyLocationState({
              city: value,
              cityIsInValid: false,
              cityIsValid: false,
              cityValidationMessage: "",
            });
          }}
          updateCity={(value: any, validation: any) => {
            updatePropertyLocationState({
              cityIsInValid: validation.isInvalid,
              cityIsValid: !validation.isInvalid,
              cityValidationMessage: validation.validationError,
            });
          }}
          state={propertyLocationState.state}
          stateRequired={true}
          stateIsInvalid={propertyLocationState.stateIsInValid}
          stateIsValid={propertyLocationState.stateIsValid}
          stateValidationMessage={propertyLocationState.stateValidationMessage}
          updateState={(value: any, validation: any) => {
            updatePropertyLocationState({
              state: value,
              stateIsInValid: validation.isInvalid,
              stateIsValid: !validation.isInvalid,
              stateValidationMessage: validation.error,
            });
          }}
          zipRequired={true}
          zip={propertyLocationState.zipCode}
          zipIsInvalid={propertyLocationState.zipCodeIsInValid}
          zipIsValid={propertyLocationState.ZipCodeIsValid}
          zipValidationMessage={propertyLocationState.zipCodeValidationMessage}
          onChangeZip={(value) => {
            updatePropertyLocationState({
              zipCode: value,
            });
          }}
          updateZip={(
            value: any,
            inValid: boolean,
            valid: boolean,
            validationError: string,
            disabledZipExtension: any
          ) => {
            updatePropertyLocationState({
              zipCodeIsInValid: inValid,
              ZipCodeIsValid: valid,
              zipCodeValidationMessage: validationError,
            });
          }}
          showZipExtension={true}
          zip2={propertyLocationState.zipCodeExtension}
          zip2IsInvalid={propertyLocationState.zipCodeExtensionIsInValid}
          zip2IsValid={propertyLocationState.zipCodeExtensionIsValid}
          validationExtensionMessage={
            propertyLocationState.zipCodeExtensionValidationMessage
          }
          onChangeZipExtension={(value) => {
            updatePropertyLocationState({
              zipCodeExtension: value,
            });
          }}
          updateZipExtension={(
            value: any,
            inValid: boolean,
            valid: boolean,
            validationError: string
          ) => {
            updatePropertyLocationState({
              zipCodeExtensionIsInValid: inValid,
              zipCodeExtensionIsValid: valid,
              zipCodeExtensionValidationMessage: validationError,
            });
          }}
        />
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-7"}>
            <PPMSInput
              id={"fleetPropertyLocationCode"}
              inputType={"text"}
              label={"Property Location Code"}
              labelBold={false}
              isRequired={true}
              maxLength={6}
              minLength={1}
              isDisabled={UserUtils.isUserFleetExt()}
              placeHolder={" "}
              value={propertyLocationState.propertyLocationCode}
              onChange={(event) => {
                updatePropertyLocationState({
                  propertyLocationCode: event?.target?.value,
                  propertyLocationCodeIsValid: false,
                  propertyLocationCodeIsInValid: false,
                  propertyLocationCodeValidationMessage: "",
                });
              }}
              onBlur={() => {
                let valid: boolean =
                  propertyLocationState.propertyLocationCode.length !== 0;
                updatePropertyLocationState({
                  propertyLocationCodeIsInValid: !valid,
                  propertyLocationCodeIsValid: valid,
                  propertyLocationCodeValidationMessage: valid
                    ? ""
                    : "Property Location code is Required.",
                });
              }}
              isValid={propertyLocationState.propertyLocationCodeIsValid}
              isInvalid={propertyLocationState.propertyLocationCodeIsInValid}
              validationMessage={
                propertyLocationState.propertyLocationCodeValidationMessage
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(PropertyLocation);
