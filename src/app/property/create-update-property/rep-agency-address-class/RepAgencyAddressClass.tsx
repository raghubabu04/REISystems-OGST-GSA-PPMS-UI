import React, { useContext, useEffect, useMemo } from "react";
import { PropertyContext } from "../PropertyContext";
import { RepAgencyAddressModal } from "./RepAgencyAddressModal";
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
import { connect } from "react-redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { RepAgencyInfoTip } from "./RepAgencyInfoTip";
import { RepAgencyAddressStateDefault } from "./RepAgencyAddressState";
import { FaTrash } from "react-icons/fa";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";

interface RepAgencyAddressProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function RepAgencyAddressClass(props: RepAgencyAddressProps) {
  //set state for this functional componnet

  const { addToast } = props.actions;
  const { repAgencyAddressState, updateRepAgencyAddressState } = useContext(
    PropertyContext
  );
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
  }, [repAgencyAddressState]);

  function handleSelection(event: any) {
    let value = event.target.value;
    if (!value) {
      updateRepAgencyAddressState({
        ...RepAgencyAddressStateDefault,
        repLocValues: repAgencyAddressState.repLocValues,
      });
    } else {
      const repLoc = repAgencyAddressState.repLocValues.filter(
        (o) => o["keyDisplayStr"] === value
      );
      if (repLoc[0]) {
        updateRepAgencyAddressState({
          repAddressId: repLoc[0] ? repLoc[0]["aacReportingAddressId"] : null,
          addressId: repLoc[0]["addressId"],
          repAacCode: repLoc[0]["aacCode"],
          repAddress1: repLoc[0]["line1"],
          repAddress2: repLoc[0]["line2"],
          repAddress3: repLoc[0]["line3"],
          repCity: repLoc[0]["city"],
          repState: repLoc[0]["stateCode"],
          repStateCode: repLoc[0]["stateCode"],
          repZipCode: repLoc[0]["zip"],
          repZip2Code: nullToStringUtil(repLoc[0]["zip2"]),
          keyDisplayStr: repLoc[0]["keyDisplayStr"],
          updateDisabled: false,
          repAddress1IsInvalid: false,
          repAddress1IsValid: true,
          repAddress2IsInvalid: false,
          repAddress2IsValid: true,
          repAddress3IsInvalid: false,
          repAddress3IsValid: true,
          repCityIsInvalid: false,
          repCityIsValid: true,
          repStateIsInvalid: false,
          repStateIsValid: true,
          repZipIsInvalid: false,
          repZipIsValid: true,
          repZip2IsInvalid: false,
          repZip2IsValid: true,
          disableExtension: false,
        });
      }
    }
  }

  function handleDeleteRepAgency() {
    commonApiService
      .deleteReportingAddressById(repAgencyAddressState.repAddressId)
      .then((res) => {
        updateRepAgencyAddressState(RepAgencyAddressStateDefault);
        refreshReportingAddressList();
        addToast({
          text: "Reporting Agency deleted Successfully",
          type: "success",
          heading: "Success",
        });
      });
  }

  function validateForm() {
    let validateAddressLine1 = repAgencyAddressState?.repAddress1?.length > 0;
    let validateCity = repAgencyAddressState?.repCity?.length > 0;
    let validateState = repAgencyAddressState?.repStateCode?.length > 0;
    let validateZip = zipValidation(repAgencyAddressState?.repZipCode, true);
    if (
      repAgencyAddressState.repZipValidationMessage.indexOf(
        zipInvalidMessage
      ) !== -1
    ) {
      validateZip.isInvalid = true;
      validateZip.validationError = zipInvalidMessage;
    }

    if (!validateAddressLine1) {
      updateRepAgencyAddressState({
        repAddress1IsInvalid: true,
        repAddress1IsValid: false,
      });
    } else {
      updateRepAgencyAddressState({
        repAddress1IsInvalid: false,
        repAddress1IsValid: true,
      });
    }

    if (!validateCity) {
      updateRepAgencyAddressState({
        repCityIsInvalid: true,
        repCityIsValid: false,
      });
    } else {
      updateRepAgencyAddressState({
        repCityIsInvalid: false,
        repCityIsValid: true,
        repCityValidationMessage: "",
      });
    }

    if (!validateState) {
      updateRepAgencyAddressState({
        repStateIsInvalid: true,
        repStateIsValid: false,
      });
    }

    if (validateZip.isInvalid) {
      updateRepAgencyAddressState({
        repZipIsInvalid: validateZip.isInvalid,
        repZipIsValid: !validateZip.isInvalid,
      });
    } else {
      updateRepAgencyAddressState({
        repZipIsInvalid: validateZip.isInvalid,
        repZipIsValid: !validateZip.isInvalid,
        repZipValidationMessage: "",
      });
    }

    if (
      validateAddressLine1 &&
      validateCity &&
      validateState &&
      !validateZip.isInvalid &&
      !repAgencyAddressState.repZip2IsInvalid
    )
      return true;
    else {
      return false;
    }
  }

  function handleRepAddressUpdate(event) {
    const { addToast } = props.actions;
    if (validateForm()) {
      let repLocation = {
        aacReportingAddressId: repAgencyAddressState.repAddressId
          ? repAgencyAddressState.repAddressId
          : null,
        aacCode: repAgencyAddressState.repAacCode,
        line1: repAgencyAddressState.repAddress1,
        line2: repAgencyAddressState.repAddress2,
        line3: repAgencyAddressState.repAddress3,
        city: repAgencyAddressState.repCity,
        stateCode: repAgencyAddressState.repStateCode,
        zip: repAgencyAddressState.repZipCode,
        zip2: repAgencyAddressState.repZip2Code,
        addressId: repAgencyAddressState.addressId,
      };
      let updatedKey =
       
        repAgencyAddressState.repAddress1 +
        "-" +
        repAgencyAddressState.repCity;
      let canUpdate = true;
      repAgencyAddressState.repLocValues.some((repLocValue: any) => {
        if (
          repLocValue["line1"].toLowerCase() ===
            repLocation.line1.toLowerCase() &&
          repLocValue["line2"].toLowerCase() ===
            repLocation.line2.toLowerCase() &&
          repLocValue["city"].toLowerCase() ===
            repLocation.city.toLowerCase() &&
          repLocValue["zip"] + "" === repLocation.zip + "" &&
          repLocValue["aacReportingAddressId"] !==
            repLocation.aacReportingAddressId
        ) {
          canUpdate = false;
          return true;
        } else {
          return false;
        }
      });
      if (canUpdate) {
        commonApiService
          .saveAndUpdateReportingAddress(repLocation)
          .then((response) => {
            refreshReportingAddressList();
            updateRepAgencyAddressState({
              keyDisplayStr: updatedKey,
              updateDisabled: false,
              repAddress1IsInvalid: false,
              repAddress1IsValid: true,
              repAddress2IsInvalid: false,
              repAddress2IsValid: true,
              repAddress3IsInvalid: false,
              repAddress3IsValid: true,
              repCityIsInvalid: false,
              repCityIsValid: true,
              repStateIsInvalid: false,
              repStateIsValid: true,
              repZipIsInvalid: false,
              repZipIsValid: true,
              repZip2IsInvalid: false,
              repZip2IsValid: true,
              disableExtension: false,
            });
            addToast({
              text: "Reporting Agency successfully Updated",
              type: "success",
              heading: "Success",
            });
          })
          .catch(() => {
            addToast({
              text: "Reporting Agency failed to update.",
              type: "error",
              heading: "Error",
            });
          });
      } else {
        updateRepAgencyAddressState({
          repAddress1IsInvalid: true,
          repAddress1IsValid: false,
          repAddress1ValidationMessage:
            "Reporting Agency Address Line 1 already exists.",
          repCityIsInvalid: true,
          repCityIsValid: false,
          repCityValidationMessage: "Reporting Agency City already exists.",
          repZipIsInvalid: true,
          repZipIsvalid: false,
          repZipValidationMessage: "Reporting Agency Zip Code already exists",
        });
      }
    } else {
      console.log("Validation error");
    }
  }

  function modalOpen() {
    updateRepAgencyAddressState({ modalShow: true });
  }

  function handleModalShow(data: any) {
    updateRepAgencyAddressState({ modalShow: false });
    refreshReportingAddressList();
    if (data !== "close")
      updateRepAgencyAddressState({
        ...data,
        updateDisabled: false,
        repAddress1IsInvalid: false,
        repAddress1IsValid: true,
        repAddress2IsInvalid: false,
        repAddress2IsValid: true,
        repAddress3IsInvalid: false,
        repAddress3IsValid: true,
        repCityIsInvalid: false,
        repCityIsValid: true,
        repStateIsInvalid: false,
        repStateIsValid: true,
        repZipIsInvalid: false,
        repZipIsValid: true,
        repZip2IsInvalid: false,
        repZip2IsValid: true,
        disableExtension: false,
      });
  }
  function refreshReportingAddressList() {
    commonApiService
      .getReportingAddressList(repAgencyAddressState.repAacCode)
      .then((res: any) => {
        if (res.data) {
          let repAdd: any = res.data;
          let values: any = [];
          values = [];
          updateRepAgencyAddressState({
            repLocValues: values,
          });
          repAdd.forEach((locOb: any) => {
            let value: any = {};
            let keyDisplayStr =
             
              locOb["line1"].trim() +
              "-" +
              locOb["city"].trim();
            value = { ...locOb, keyDisplayStr: keyDisplayStr };
            values.push(value);
          });
          updateRepAgencyAddressState({
            repLocValues: values,
          });
        }
      })
      .catch(() => {
        //TODO - Handle these in future
        // console.log(error);
      });
  }

  return useMemo(() => {
    return (
      <React.Fragment>
        <PPMSSelect
          id={"reporting-agency-select"}
          placeholderValue={"Select Reporting Agency Address"}
          selectName={"selectReportingAddress"}
          values={repAgencyAddressState.repLocValues}
          onChange={handleSelection}
          isValid={false}
          isInvalid={false}
          validationMessage={""}
          identifierKey={"keyDisplayStr"}
          identifierValue={"keyDisplayStr"}
          selectedValue={repAgencyAddressState.keyDisplayStr}
          label={"Reporting Agency Addresses"}
          isRequired={false}
          infoTipContent={<RepAgencyInfoTip />}
          infoTipClass={"ppms-usa-input-info-body"}
        />
        <PPMSAddress
          id={"reporting-agency"}
          title={"Reporting Agency"}
          showAddressLine3={true}
          address1={repAgencyAddressState.repAddress1}
          address1Required={true}
          address1IsInvalid={repAgencyAddressState.repAddress1IsInvalid}
          address1IsValid={repAgencyAddressState.repAddress1IsValid}
          address1ValidationMessage={
            repAgencyAddressState.repAddress1ValidationMessage
          }
          onChangeAddress1={(value) => {
            updateRepAgencyAddressState({ repAddress1: value });
          }}
          updateAddress1={(value: any, validation: any) => {
            let valid = value?.length > 0;
            updateRepAgencyAddressState({
              repAddress1: value,
              repAddress1IsInvalid: !valid,
              repAddress1IsValid: valid,
              repAddress1ValidationMessage: validation.validationError,
              repAddress2IsInvalid: false,
              repAddress2IsValid: false,
              repAddress2ValidationMessage: "",
              repCityIsInvalid: false,
              repCityIsValid: false,
              repCityValidationMessage: "",
              repZipIsInvalid: false,
              repZipIsValid: false,
              repZipValidationMessage: "",
            });
          }}
          address2={repAgencyAddressState.repAddress2}
          address2Required={false}
          address2IsInvalid={repAgencyAddressState.repAddress2IsInvalid}
          address2IsValid={repAgencyAddressState.repAddress2IsValid}
          address2ValidationMessage={
            repAgencyAddressState.repAddress2ValidationMessage
          }
          updateAddress2={(value: any) => {
            updateRepAgencyAddressState({
              repAddress2: value,
            });
          }}
          address3={repAgencyAddressState.repAddress3}
          address3Required={false}
          address3IsInvalid={repAgencyAddressState.repAddress3IsInvalid}
          address3IsValid={repAgencyAddressState.repAddress3IsValid}
          address3ValidationMessage={
            repAgencyAddressState.repAddress3ValidationMessage
          }
          updateAddress3={(value: any) => {
            updateRepAgencyAddressState({
              repAddress3: value,
            });
          }}
          city={repAgencyAddressState.repCity}
          cityRequired={true}
          cityIsInvalid={repAgencyAddressState.repCityIsInvalid}
          cityIsValid={repAgencyAddressState.repCityIsValid}
          cityValidationMessage={repAgencyAddressState.repCityValidationMessage}
          onChangeCity={(value) => {
            updateRepAgencyAddressState({
              repCity: value,
            });
          }}
          updateCity={(value: any, validation: any) => {
            let valid = value?.length > 0;
            updateRepAgencyAddressState({
              repCity: value,
              repCityIsInvalid: !valid,
              repCityIsValid: valid,
              repCityValidationMessage: validation.validationError,
              repAddress1IsInvalid: false,
              repAddress1IsValid: false,
              repAddress1ValidationMessage: "",
              repAddress2IsInvalid: false,
              repAddress2IsValid: false,
              repAddress2ValidationMessage: "",
              repZipIsInvalid: false,
              repZipIsValid: false,
              repZipValidationMessage: "",
            });
          }}
          state={repAgencyAddressState.repStateCode}
          stateRequired={true}
          stateIsInvalid={repAgencyAddressState.repStateIsInvalid}
          stateIsValid={repAgencyAddressState.repStateIsValid}
          updateState={(value: any, validation: any) => {
            updateRepAgencyAddressState({
              repStateCode: value,
              repState: value,
              repStateIsInvalid: validation.isInvalid,
              repStateIsValid: !validation.isInvalid,
              repStateValidationMessage: validation.validationError,
            });
          }}
          showZipExtension={true}
          disabledZipExtension={repAgencyAddressState.disableExtension}
          zip={repAgencyAddressState.repZipCode}
          zipRequired={true}
          zipIsInvalid={repAgencyAddressState.repZipIsInvalid}
          zipIsValid={repAgencyAddressState.repZipIsValid}
          zipValidationMessage={repAgencyAddressState.repZipValidationMessage}
          onChangeZip={(value) => {
            updateRepAgencyAddressState({
              repZipCode: value,
            });
          }}
          updateZip={(
            value: any,
            inValid: boolean,
            valid: boolean,
            validationError: string,
            disabledZipExtension: boolean
          ) => {
            updateRepAgencyAddressState({
              repZipCode: value,
              repZipIsInvalid: inValid,
              repZipIsValid: valid,
              repZipValidationMessage: validationError,
              disableExtension: disabledZipExtension,
            });
          }}
          zip2={repAgencyAddressState.repZip2Code}
          zip2IsInvalid={repAgencyAddressState.repZip2IsInvalid}
          zip2IsValid={repAgencyAddressState.repZip2IsValid}
          onChangeZipExtension={(value) => {
            updateRepAgencyAddressState({
              repZip2Code: value,
            });
          }}
          validationExtensionMessage={
            repAgencyAddressState.repZip2ValidationMessage
          }
          updateZipExtension={(
            value: any,
            inValid: boolean,
            valid: boolean,
            validationError: string
          ) => {
            updateRepAgencyAddressState({
              repZip2Code: value,
              repZip2IsInvalid: inValid,
              repZip2IsValid: valid,
              repZip2ValidationMessage: validationError,
            });
          }}
        />
        <div className={"grid-row grid-gap update-buttons"}>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              id={"update-raa"}
              variant={"primary"}
              type={"button"}
              value={""}
              isDisabled={repAgencyAddressState.updateDisabled}
              label={"Update Reporting Agency Address"}
              onPress={handleRepAddressUpdate}
            />
          </div>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              variant={"primary"}
              type={"button"}
              label={"Add Reporting Agency Address"}
              onPress={modalOpen.bind(this)}
              id={"add-raa"}
            />
          </div>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              variant={"danger"}
              type={"button"}
              label={" Delete"}
              icon={<FaTrash />}
              isDisabled={repAgencyAddressState.updateDisabled}
              onPress={() => {
                updateRepAgencyAddressState({
                  deleteAlert: true,
                });
              }}
              id={"delete-raa"}
            />
          </div>
        </div>
        <RepAgencyAddressModal
          modalOpen={repAgencyAddressState.modalShow}
          onModalChange={(data: any) => {
            handleModalShow(data);
          }}
          aacCode={repAgencyAddressState.repAacCode}
          repLocValues={repAgencyAddressState.repLocValues}
          {...props}
        />
        <PPMSModal
          show={repAgencyAddressState.deleteAlert}
          backdrop={"static"}
          body={"Do you want to delete the selected reporting agency address?"}
          id={"pocDeleteModal"}
          handleClose={() => {
            updateRepAgencyAddressState({
              deleteAlert: false,
            });
          }}
          centered={true}
          handleSaveType={"button"}
          handleSave={handleDeleteRepAgency}
          title={"Delete Confirmation"}
          label={"Yes"}
          labelCancel={"No"}
        />
      </React.Fragment>
    );
  }, [repAgencyAddressState]);
}
//export default RepAgencyAddressClass;
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(RepAgencyAddressClass);
