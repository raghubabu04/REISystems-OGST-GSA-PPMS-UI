import React, { useContext, useEffect, useMemo } from "react";
import { PropertyContext } from "../PropertyContext";
import { PropCustModal } from "./PropCustModal";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import {
  validateEmailAddress,
  validatePhoneFax,
} from "../../../../ui-kit/components/validations/FieldValidations";
import {
  formatExtension,
  formatPhone,
  nullToStringUtil,
} from "../../../../ui-kit/utilities/FormatUtil";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSContact } from "../../../../ui-kit/components/PPMS-contact";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { isFormSubmitted } from "../../../../service/validation.service";
import { connect } from "react-redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { PropCustodianInfoTip } from "./PropCustodianInfoTip";
import { PropCustStateDefault } from "./PropCustState";
import { FaTrash } from "react-icons/fa";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";

interface PropCustProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function PropCustClass(props: PropCustProps) {
  const { addToast } = props.actions;
  let commonApiService = new CommonApiService();
  //set state for this functional component
  const { propCustState, updatePropCustState } = useContext(PropertyContext);
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
  }, [propCustState]);

  function handleToUpdatePropCustState(event: any, validation: any) {
    let fieldValue: string = event.substring(event.indexOf(":") + 1);
    let field: string = fieldValue.substring(0, fieldValue.indexOf(":"));
    let value: string = fieldValue.substring(fieldValue.indexOf(":") + 1);
    switch (field) {
      case "firstName":
        if (value.length > 0) {
          updatePropCustState({
            propCustFirstName: value,
            propCustFirstNameIsInvalid: false,
            propCustFirstNameIsValid: true,
          });
        } else {
          updatePropCustState({
            propCustFirstName: value,
            propCustFirstNameIsInvalid: true,
            propCustFirstNameIsValid: false,
            propCustFirstNameValidationMessage: "",
          });
        }
        break;
      case "lastName":
        if (value.length > 0) {
          updatePropCustState({
            propCustLastName: value,
            propCustLastNameIsInvalid: false,
            propCustLastNameIsValid: true,
          });
        } else {
          updatePropCustState({
            propCustLastName: value,
            propCustLastNameIsInvalid: true,
            propCustLastNameIsValid: false,
            propCustLastNameValidationMessage: "",
          });
        }
        break;
      case "phone":
        updatePropCustState({
          propCustPhone: value,
          propCustPhoneIsInvalid: validation.isInvalid,
          propCustPhoneIsValid: !validation.isInvalid,
          propCustPhoneValidationMessage: validation.validationError,
          propCustDisabledExtension: !(value.length > 0),
        });
        break;
      case "phExt":
        updatePropCustState({
          propCustPhoneExt: value,
        });
        break;
      case "fax":
        updatePropCustState({
          propCustFax: value,
          propCustFaxIsInvalid: validation.isInvalid,
          propCustFaxIsValid: !validation.isInvalid,
          propCustFaxValidationMessage: validation.validationError,
        });
        break;
      case "email":
        if (value === "") {
          updatePropCustState({
            propCustEmail: value,
            propCustEmailIsInvalid: true,
            propCustEmailIsValid: false,
            propCustEmailValidationMessage: "",
          });
        } else {
          updatePropCustState({
            propCustEmail: value,
            propCustEmailIsInvalid: validation.isInvalid,
            propCustEmailIsValid: !validation.isInvalid,
            propCustEmailValidationMessage: validation.validationError,
          });
        }
        break;
      case "ccEmail":
        if (value === "") {
          updatePropCustState({
            propCustCcEmail: value,
            propCustCcEmailIsInvalid: false,
            propCustCcEmailIsValid: true,
            propCustCcEmailValidationMessage: "",
          });
        } else {
          updatePropCustState({
            propCustCcEmail: value,
            propCustCcEmailIsInvalid: validation.isInvalid,
            propCustCcEmailIsValid: !validation.isInvalid,
            propCustCcEmailValidationMessage: validation.validationError,
          });
        }
        break;
    }
  }

  //Modal Events

  function modalOpen() {
    updatePropCustState({ modalShow: true });
  }
  function handleModalShow(data: any) {
    updatePropCustState({ modalShow: false });
    refreshPropertyCustodianList();
    if (data !== "close")
      updatePropCustState({
        ...data,
        updateDisabled: false,
        propCustFirstNameIsInvalid: false,
        propCustFirstNameIsValid: true,
        propCustLastNameIsInvalid: false,
        propCustLastNameIsValid: true,
        propCustPhoneIsInvalid: false,
        propCustPhoneIsValid: true,
        propCustDisabledExtension: false,
        pocFaxIsInvalid: false,
        pocFaxIsValid: true,
        propCustEmailIsInvalid: false,
        propCustEmailIsValid: true,
        propCustCcEmailIsInvalid: false,
        propCustCcEmailIsValid: false,
      });
  }

  function handleSelection(value: any) {
    if (!value) {
      updatePropCustState({
        ...PropCustStateDefault,
        propCustValues: propCustState.propCustValues,
      });
    } else {
      const cust = propCustState.propCustValues.filter(
        (o) => o["keyDisplayStr"] === value
      );
      if (cust[0]) {
        updatePropCustState({
          updateDisabled: false,
          propCustId: cust[0] ? cust[0]["aacPropertyCustodianId"] : null,
          contactId: cust[0]["contctId"],
          aacCode: cust[0]["aacCode"],
          propCustFirstName: cust[0]["firstName"],
          propCustLastName: cust[0]["lastName"],
          propCustPhone: formatPhone(nullToStringUtil(cust[0]["phone"]) + ""),
          propCustPhoneExt: formatExtension(
            nullToStringUtil(cust[0]["phoneExtension"]) + ""
          ),
          propCustFax: formatPhone(nullToStringUtil(cust[0]["fax"]) + ""),
          propCustEmail: cust[0]["email"],
          propCustCcEmail: cust[0]["ccEmail"],
          keyDisplayStr: cust[0]["keyDisplayStr"],
          propCustFirstNameIsInvalid: false,
          propCustFirstNameIsValid: true,
          propCustLastNameIsInvalid: false,
          propCustLastNameIsValid: true,
          propCustPhoneIsInvalid: false,
          propCustPhoneIsValid: true,
          propCustDisabledExtension: false,
          pocFaxIsInvalid: false,
          pocFaxIsValid: true,
          propCustEmailIsInvalid: false,
          propCustEmailIsValid: true,
          propCustCcEmailIsInvalid: false,
          propCustCcEmailIsValid: false,
        });
      }
    }
  }

  function handleDeletePropCust() {
    commonApiService
      .deletePropertyCustodianById(propCustState.propCustId)
      .then((res) => {
        updatePropCustState(PropCustStateDefault);
        refreshPropertyCustodianList();
        addToast({
          text: "Property custodian deleted Successfully",
          type: "success",
          heading: "Success",
        });
      });
  }

  function validateForm() {
    let validateFirstName: boolean =
      propCustState.propCustFirstName &&
      propCustState.propCustFirstName?.length > 0;
    let validateLastName: boolean =
      propCustState.propCustLastName &&
      propCustState.propCustLastName?.length > 0;
    let validateEmail = validateEmailAddress(propCustState.propCustEmail);
    let validationPhone = validatePhoneFax(propCustState.propCustPhone);
    if (!validateFirstName) {
      updatePropCustState({ propCustFirstNameIsInvalid: true });
    }

    if (!validateLastName) {
      updatePropCustState({ propCustLastNameIsInvalid: true });
    }

    if (validateEmail.isInvalid) {
      updatePropCustState({
        propCustEmailIsInvalid: true,
        propCustEmailIsValid: false,
      });
    }

    if (validationPhone.isInvalid) {
      updatePropCustState({
        propCustPhoneIsInvalid: true,
        propCustPhoneIsValid: false,
      });
    }
    if (
      validateFirstName &&
      validateLastName &&
      !validateEmail.isInvalid &&
      !validationPhone.isInvalid &&
      !propCustState.propCustFaxIsInvalid &&
      !propCustState.propCustCcEmailIsValid
    ) {
      return true;
    } else {
      return false;
    }
  }

  function handlePropertyCustodianUpdate(event) {
    const { addToast } = props.actions;
    if (validateForm()) {
      let propertyCustodian = {
        aacPropertyCustodianId: propCustState.propCustId
          ? propCustState.propCustId
          : null,
        aacCode: propCustState.aacCode,
        firstName: propCustState.propCustFirstName,
        lastName: propCustState.propCustLastName,
        phone: propCustState.propCustPhone.replace(/[^0-9]/g, ""),
        phoneExtension: propCustState.propCustPhoneExt.replace(/[^0-9]/g, ""),
        fax: propCustState.propCustFax.replace(/[^0-9]/g, ""),
        email: propCustState.propCustEmail,
        ccEmail: propCustState.propCustCcEmail,
        contactID: propCustState.contactId,
      };
      let updatedKey =
      
        propCustState.propCustLastName +
        "-" +
        propCustState.propCustEmail;
      commonApiService
        .saveAndUpdatePropertyCustodian(propertyCustodian)
        .then((response) => {
          refreshPropertyCustodianList();
          updatePropCustState({
            keyDisplayStr: updatedKey,
          });
          addToast({
            text: "Property Custodian successfully Updated",
            type: "success",
            heading: "Success",
          });
        })
        .catch(() => {
          addToast({
            text: "Property Custodian failed to update.",
            type: "error",
            heading: "Error",
          });
        });
    }
  }

  function refreshPropertyCustodianList() {
    commonApiService
      .getPropertyCustodianList(propCustState.aacCode)
      .then((res: any) => {
        if (res.data) {
          let porpCust: any = res.data;
          let values: any = [];
          values = [];
          updatePropCustState({
            propCustValues: values,
          });
          //Property Custodian dropdown
          porpCust.forEach((custOb: any) => {
            let value: any = {};
            let keyDisplayStr =
          
              custOb["lastName"].trim() +
              "-" +
              custOb["email"].trim();
            value = { ...custOb, keyDisplayStr: keyDisplayStr };
            values.push(value);
          });
          updatePropCustState({
            propCustValues: values,
          });
        }
      })
      .catch((error) => {
        //TODO - Handle these in future
        // console.log(error);
      });
  }

  return useMemo(() => {
    return (
      <>
        <PPMSSelect
          placeholderValue={"Select Property Custodian"}
          selectName={"selectPropertyCustodian"}
          values={propCustState.propCustValues}
          onChange={(event) => handleSelection(event.target.value)}
          isValid={false}
          isInvalid={false}
          validationMessage={""}
          identifierKey={"keyDisplayStr"}
          identifierValue={"keyDisplayStr"}
          selectedValue={propCustState.keyDisplayStr}
          label={"Property Custodians"}
          isRequired={false}
          infoTipContent={<PropCustodianInfoTip />}
          infoTipClass={"ppms-usa-input-info-body"}
        />
        <PPMSContact
          id={"property-custodian"}
          title={"Property Custodian"}
          updateParentState={handleToUpdatePropCustState.bind(this)}
          firstLastNameRequired={true}
          showMiddleName={false}
          firstLastNameMaxLength={30}
          firstName={propCustState.propCustFirstName}
          firstNameIsInvalid={propCustState.propCustFirstNameIsInvalid}
          firstNameIsValid={propCustState.propCustFirstNameIsValid}
          firstNameValidationMessage={
            propCustState.propCustFirstNameValidationMessage
          }
          onChangeFirstName={(value: any) =>
            updatePropCustState({ propCustFirstName: value })
          }
          middleName={""}
          lastName={propCustState.propCustLastName}
          lastNameIsInvalid={propCustState.propCustLastNameIsInvalid}
          lastNameIsValid={propCustState.propCustLastNameIsValid}
          onChangeLastName={(value: any) =>
            updatePropCustState({ propCustLastName: value })
          }
          lastNameValidationMessage={
            propCustState.propCustLastNameValidationMessage
          }
          phone={propCustState.propCustPhone}
          onChangePhoneNumber={(value) =>
            updatePropCustState({ propCustPhone: value })
          }
          phoneIsInvalid={propCustState.propCustPhoneIsInvalid}
          phoneIsValid={propCustState.propCustPhoneIsValid}
          phoneValidationMessage={propCustState.propCustPhoneValidationMessage}
          extension={propCustState.propCustPhoneExt}
          extensionIsInvalid={propCustState.propCustPhoneExtIsInvalid}
          extensionIsValid={propCustState.propCustPhoneExtIsValid}
          onChangePhoneExt={(value) =>
            updatePropCustState({ propCustPhoneExt: value })
          }
          extensionValidationMessage={
            propCustState.propCustPhoneExtValidationMessage
          }
          phoneExtRequired={true}
          disabledExtension={propCustState.propCustDisabledExtension}
          phoneFax={propCustState.propCustFax}
          phoneFaxIsInvalid={propCustState.propCustFaxIsInvalid}
          phoneFaxIsValid={propCustState.propCustFaxIsValid}
          phoneFaxValidationMessage={propCustState.propCustFaxValidationMessage}
          onChangePhoneFax={(value) => {
            updatePropCustState({ propCustFax: value });
          }}
          phoneFaxRequired={false}
          email={propCustState.propCustEmail}
          emailIsInvalid={propCustState.propCustEmailIsInvalid}
          emailIsValid={propCustState.propCustEmailIsValid}
          emailValidationMessage={propCustState.propCustEmailValidationMessage}
          onChangeEmail={(value: any) =>
            updatePropCustState({ propCustEmail: value })
          }
          emailRequired={true}
          ccEmail={propCustState.propCustCcEmail}
          ccEmailIsInvalid={propCustState.propCustCcEmailIsInvalid}
          ccEmailIsValid={propCustState.propCustCcEmailIsValid}
          onChangeCcEmail={(value: any) =>
            updatePropCustState({ propCustCcEmail: value })
          }
          ccEmailValidationMessage={
            propCustState.propCustCcEmailValidationMessage
          }
          emailMaxLength={64}
          options={propCustState.propCustOptions}
          disableNotifyToggle={true}
        />
        <PPMSAlert
          id={"form-verification-error"}
          show={propCustState.showErrorAlert}
          alertBody={
            propCustState.FormErrorMessage || "Error submitting request."
          }
          alertClassName={"form-verification-error"}
          alertVariant={"danger"}
          alertKey={"form-verification-error"}
          alertBodyArray={propCustState.alertBodyArray}
        />
        <div className={"grid-row grid-gap-4 update-buttons"}>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              id={"update-rep"}
              variant={"primary"}
              type={"button"}
              value={""}
              isDisabled={propCustState.updateDisabled}
              label={"Update Property Custodian"}
              onPress={handlePropertyCustodianUpdate}
            />
          </div>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              variant={"primary"}
              type={"button"}
              label={"Add Property Custodian"}
              onPress={modalOpen.bind(this)}
              id={"add-rep"}
            />
          </div>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              variant={"danger"}
              type={"button"}
              label={" Delete"}
              icon={<FaTrash />}
              isDisabled={propCustState.updateDisabled}
              onPress={() => {
                updatePropCustState({
                  deleteAlert: true,
                });
              }}
              id={"delete-rep"}
            />
          </div>
        </div>
        <PropCustModal
          modalOpen={propCustState.modalShow}
          aacCode={propCustState.aacCode}
          onModalChange={(data: any) => {
            handleModalShow(data);
          }}
          {...props}
        />
        <PPMSModal
          show={propCustState.deleteAlert}
          backdrop={"static"}
          body={"Do you want to delete the selected property custodian?"}
          id={"pocDeleteModal"}
          handleClose={() => {
            updatePropCustState({
              deleteAlert: false,
            });
          }}
          centered={true}
          handleSaveType={"button"}
          handleSave={handleDeletePropCust}
          title={"Delete Confirmation"}
          label={"Yes"}
          labelCancel={"No"}
        />
      </>
    );
  }, [propCustState]);
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(PropCustClass);
