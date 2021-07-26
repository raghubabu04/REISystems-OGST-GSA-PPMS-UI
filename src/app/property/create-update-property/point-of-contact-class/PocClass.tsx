import React, { useContext, useEffect, useMemo } from "react";
import { PropertyContext } from "../PropertyContext";
import { PocModal } from "./PocModal";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
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
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { isFormSubmitted } from "../../../../service/validation.service";
import { connect } from "react-redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { PointOfContactInfoTip } from "./PointOfContactInfoTip";
import { PocStateDefault } from "./PocState";
import { FaTrash } from "react-icons/fa";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";

interface PocProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function PocClass(props: PocProps) {
  const { pocState, updatePocState } = useContext(PropertyContext);
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
  }, [pocState]);
  function handleToUpdatePocState(event: any, validation: any) {
    let fieldValue: string = event.substring(event.indexOf(":") + 1);
    let field: string = fieldValue.substring(0, fieldValue.indexOf(":"));
    let value: string = fieldValue.substring(fieldValue.indexOf(":") + 1);
    switch (field) {
      case "firstName":
        if (value.length > 0) {
          updatePocState({
            pocFirstName: value,
            pocFirstNameIsInvalid: false,
            pocFirstNameIsValid: true,
          });
        } else {
          updatePocState({
            pocFirstName: value,
            pocFirstNameIsInvalid: true,
            pocFirstNameIsValid: false,
            pocFirstNameValidationMessage: "",
          });
        }
        break;
      case "lastName":
        if (value.length > 0) {
          updatePocState({
            pocLastName: value,
            pocLastNameIsInvalid: false,
            pocLastNameIsValid: true,
          });
        } else {
          updatePocState({
            pocLastName: value,
            pocLastNameIsInvalid: true,
            pocLastNameIsValid: false,
            pocLastNameValidationMessage: "",
          });
        }
        break;
      case "phone":
        updatePocState({
          pocPhone: value,
          pocPhoneIsInvalid: validation.isInvalid,
          pocPhoneIsValid: !validation.isInvalid,
          pocPhoneValidationMessage: validation.validationError,
          pocDisabledExtension: value.length < 0,
        });
        break;
      case "phExt":
        updatePocState({
          pocPhoneExt: value,
        });
        break;
      case "fax":
        updatePocState({
          pocFax: value,
          pocFaxIsInvalid: validation.isInvalid,
          pocFaxIsValid: !validation.isInvalid,
          pocFaxValidationMessage: validation.validationError,
        });

        break;
      case "email":
        if (value === "") {
          updatePocState({
            pocEmail: value,
            pocEmailIsInvalid: true,
            pocEmailIsValid: false,
            pocEmailValidationMessage: "",
          });
        } else {
          updatePocState({
            pocEmail: value,
            pocEmailIsInvalid: validation.isInvalid,
            pocEmailIsValid: !validation.isInvalid,
            pocEmailValidationMessage: validation.validationError,
          });
        }
        break;
      case "ccEmail":
        if (value === "") {
          updatePocState({
            pocCcEmail: value,
            pocCcEmailIsInvalid: false,
            pocCcEmailIsValid: true,
            pocCcEmailValidationMessage: "",
          });
        } else {
          updatePocState({
            pocCcEmail: value,
            pocCcEmailIsInvalid: validation.isInvalid,
            pocCcEmailIsValid: !validation.isInvalid,
            pocCcEmailValidationMessage: validation.validationError,
          });
        }
        break;
      case "notify":
        if (value === "true") {
          updatePocState({
            pocNotify: true,
          });
        } else {
          updatePocState({
            pocNotify: false,
          });
        }

        break;
    }
  }

  function validateForm() {
    let validateFirstName: boolean = pocState.pocFirstName?.length > 0;
    let validateSecondName: boolean = pocState.pocLastName?.length > 0;
    let validateEmail = validateEmailAddress(pocState.pocEmail);
    let validationPhone = validatePhoneFax(pocState.pocPhone);
    if (!validateFirstName) {
      updatePocState({ pocFirstNameIsInvalid: true });
    }

    if (!validateSecondName) {
      updatePocState({ pocLastNameIsInvalid: true });
    }

    if (validateEmail.isInvalid) {
      updatePocState({
        pocEmailIsInvalid: true,
        pocEmailIsValid: false,
      });
    }

    if (validationPhone.isInvalid) {
      updatePocState({
        pocPhoneIsInvalid: true,
        pocPhoneIsValid: false,
      });
    }
    if (
      validateFirstName &&
      validateSecondName &&
      !validateEmail.isInvalid &&
      !validationPhone.isInvalid &&
      !pocState.pocFaxIsInvalid &&
      !pocState.pocCcEmailIsInvalid
    )
      return true;
    else return false;
  }

  function modalOpen() {
    updatePocState({ modalShow: true });
  }

  function handleModalShow(data: any) {
    updatePocState({ modalShow: false });
    refreshPointOfContactList();
    if (data !== "close")
      updatePocState({
        ...data,
        updateDisabled: false,
        pocFirstNameIsInvalid: false,
        pocFirstNameIsValid: true,
        pocLastNameIsInvalid: false,
        pocLastNameIsValid: true,
        pocPhoneIsInvalid: false,
        pocPhoneIsValid: true,
        pocPhoneExtIsInvalid: false,
        pocPhoneExtIsValid: true,
        pocDisabledExtension: false,
        pocFaxIsInvalid: false,
        pocFaxIsValid: true,
        pocEmailIsInvalid: false,
        pocEmailIsValid: true,
        pocCcEmailIsInvalid: false,
        pocCcEmailIsValid: false,
      });
  }

  function handleSelection(value: any) {
    if (!value) {
      updatePocState({ ...PocStateDefault, pocValues: pocState.pocValues });
    } else {
      const poc = pocState.pocValues.filter(
        (o) => o["keyDisplayStr"] === value
      );
      if (poc[0]) {
        updatePocState({
          updateDisabled: false,
          pocId: poc[0]["aacPocId"],
          pocAacCode: poc[0]["aacCode"],
          contactId: poc[0]["contactID"],
          pocFirstName: poc[0]["firstName"],
          pocLastName: poc[0]["lastName"],
          pocPhone: formatPhone(nullToStringUtil(poc[0]["phone"]) + ""),
          pocPhoneExt: formatExtension(
            nullToStringUtil(poc[0]["phoneExtension"]) + ""
          ),
          pocFax: formatPhone(nullToStringUtil(poc[0]["fax"]) + ""),
          pocEmail: poc[0]["email"],
          pocCcEmail: poc[0]["ccEmail"],
          keyDisplayStr: poc[0]["keyDisplayStr"],
          pocFirstNameIsInvalid: false,
          pocFirstNameIsValid: true,
          pocLastNameIsInvalid: false,
          pocLastNameIsValid: true,
          pocPhoneIsInvalid: false,
          pocPhoneIsValid: true,
          pocPhoneExtIsInvalid: false,
          pocPhoneExtIsValid: true,
          pocDisabledExtension: false,
          pocFaxIsInvalid: false,
          pocFaxIsValid: true,
          pocEmailIsInvalid: false,
          pocEmailIsValid: true,
          pocCcEmailIsInvalid: false,
          pocCcEmailIsValid: false,
        });
      }
    }
  }

  function handlePointOfContactUpdate(event) {
    const { addToast } = props.actions;
    if (validateForm()) {
      let pointOfContact = {
        aacPocId: pocState.pocId ? pocState.pocId : null,
        aacCode: pocState.pocAacCode,
        firstName: pocState.pocFirstName,
        lastName: pocState.pocLastName,
        phone: pocState.pocPhone.replace(/[^0-9]/g, ""),
        phoneExtension: pocState.pocPhoneExt.replace(/[^0-9]/g, ""),
        fax: pocState.pocFax.replace(/[^0-9]/g, ""),
        email: pocState.pocEmail,
        ccEmail: pocState.pocCcEmail,
        contactID: pocState.contactId,
      };
      let updatedKey =
       
        pocState.pocLastName +
        "-" +
        pocState.pocEmail;
      commonApiService
        .saveAndUpdatePointOfContact(pointOfContact)
        .then((response) => {
          refreshPointOfContactList();
          updatePocState({
            keyDisplayStr: updatedKey,
          });
          addToast({
            text: "Point of Contact successfully Updated",
            type: "success",
            heading: "Success",
          });
        })
        .catch(() => {
          addToast({
            text: "Point of Contact failed to update.",
            type: "error",
            heading: "Error",
          });
        });
    }
  }

  function handleDeletePoc() {
    commonApiService.deletePointOfContactById(pocState.pocId).then((res) => {
      updatePocState(PocStateDefault);
      refreshPointOfContactList();
      addToast({
        text: "Point Of Contact deleted Successfully",
        type: "success",
        heading: "Success",
      });
    });
  }

  function refreshPointOfContactList() {
    commonApiService
      .getPointOfContactList(pocState.pocAacCode)
      .then((res: any) => {
        if (res.data) {
          let poc: any = res.data;
          let values: any = [];
          values = [];
          updatePocState({
            pocValues: values,
          });
          poc.forEach((locOb: any) => {
            let value: any = {};
            let keyDisplayStr =
           
              locOb["lastName"].trim() +
              "-" +
              locOb["email"].trim();
            value = { ...locOb, keyDisplayStr: keyDisplayStr };
            values.push(value);
          });
          updatePocState({
            pocValues: values,
          });
        }
      })
      .catch((error) => {
        //TODO - Handle these in future
      });
  }

  return useMemo(() => {
    return (
      <>
        <PPMSSelect
          id={"POC-select"}
          placeholderValue={"Select Point of Contact"}
          selectName={"selectPointOfContact"}
          values={pocState.pocValues}
          onChange={(event) => handleSelection(event.target.value)}
          isValid={false}
          isInvalid={false}
          validationMessage={""}
          identifierKey={"keyDisplayStr"}
          identifierValue={"keyDisplayStr"}
          selectedValue={pocState.keyDisplayStr}
          label={"Point of Contacts"}
          isRequired={false}
          infoTipContent={<PointOfContactInfoTip />}
          infoTipClass={"ppms-usa-input-info-body"}
        />
        <PPMSContact
          id={"point-of-contact"}
          title={"Point of Contact"}
          updateParentState={handleToUpdatePocState.bind(this)}
          firstLastNameRequired={true}
          showMiddleName={false}
          firstLastNameMaxLength={30}
          firstName={pocState.pocFirstName}
          firstNameIsInvalid={pocState.pocFirstNameIsInvalid}
          firstNameIsValid={pocState.pocFirstNameIsValid}
          firstNameValidationMessage={pocState.pocFirstNameValidationMessage}
          onChangeFirstName={(value: any) =>
            updatePocState({ pocFirstName: value })
          }
          middleName={""}
          lastName={pocState.pocLastName}
          lastNameIsInvalid={pocState.pocLastNameIsInvalid}
          lastNameIsValid={pocState.pocLastNameIsValid}
          lastNameValidationMessage={pocState.pocLastNameValidationMessage}
          onChangeLastName={(value: any) =>
            updatePocState({ pocLastName: value })
          }
          phone={pocState.pocPhone}
          phoneIsInvalid={pocState.pocPhoneIsInvalid}
          phoneIsValid={pocState.pocPhoneIsValid}
          phoneValidationMessage={pocState.pocPhoneValidationMessage}
          onChangePhoneNumber={(value: any) =>
            updatePocState({ pocPhone: value })
          }
          extension={pocState.pocPhoneExt}
          extensionIsInvalid={pocState.pocPhoneExtIsInvalid}
          extensionIsValid={pocState.pocPhoneExtIsValid}
          onChangePhoneExt={(value: any) =>
            updatePocState({ pocPhoneExt: value })
          }
          disabledExtension={pocState.pocDisabledExtension}
          extensionValidationMessage={pocState.pocPhoneExtValidationMessage}
          phoneExtRequired={true}
          phoneFax={pocState.pocFax}
          phoneFaxIsInvalid={pocState.pocFaxIsInvalid}
          phoneFaxIsValid={pocState.pocFaxIsValid}
          phoneFaxValidationMessage={pocState.pocFaxValidationMessage}
          onChangePhoneFax={(value: any) => updatePocState({ pocFax: value })}
          phoneFaxRequired={false}
          email={pocState.pocEmail}
          emailIsInvalid={pocState.pocEmailIsInvalid}
          emailIsValid={pocState.pocEmailIsValid}
          emailValidationMessage={pocState.pocEmailValidationMessage}
          onChangeEmail={(value) => {
            updatePocState({ pocEmail: value });
          }}
          emailRequired={true}
          ccEmail={pocState.pocCcEmail}
          ccEmailIsInvalid={pocState.pocCcEmailIsInvalid}
          ccEmailIsValid={pocState.pocCcEmailIsValid}
          ccEmailValidationMessage={pocState.pocCcEmailValidationMessage}
          onChangeCcEmail={(value: any) =>
            updatePocState({ pocCcEmail: value })
          }
          emailMaxLength={64}
          options={pocState.pocOption}
        />
        <PPMSAlert
          id={"form-verification-error"}
          show={pocState.showErrorAlert}
          alertBody={pocState.FormErrorMessage || "Error submitting request."}
          alertClassName={"form-verification-error"}
          alertVariant={"danger"}
          alertKey={"form-verification-error"}
          alertBodyArray={pocState.alertBodyArray}
        />
        <div className={"grid-row grid-gap-4 update-buttons"}>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              id={"update-poc"}
              variant={"primary"}
              type={"button"}
              value={""}
              isDisabled={pocState.updateDisabled}
              label={"Update Point Of Contact"}
              onPress={handlePointOfContactUpdate}
            />
          </div>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              variant={"primary"}
              type={"button"}
              label={"Add Point Of Contact"}
              onPress={modalOpen.bind(this)}
              id={"add-poc"}
            />
          </div>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              variant={"danger"}
              type={"button"}
              label={" Delete"}
              icon={<FaTrash />}
              isDisabled={pocState.updateDisabled}
              onPress={() => {
                updatePocState({
                  deleteAlert: true,
                });
              }}
              id={"delete-poc"}
            />
          </div>
        </div>
        <PocModal
          modalOpen={pocState.modalShow}
          aacCode={pocState.pocAacCode}
          onModalChange={(data: any) => {
            handleModalShow(data);
          }}
          {...props}
        />
        <PPMSModal
          show={pocState.deleteAlert}
          backdrop={"static"}
          body={"Do you want to delete the selected point of contact?"}
          id={"pocDeleteModal"}
          handleClose={() => {
            updatePocState({
              deleteAlert: false,
            });
          }}
          centered={true}
          handleSaveType={"button"}
          handleSave={handleDeletePoc}
          title={"Delete Confirmation"}
          label={"Yes"}
          labelCancel={"No"}
        />
      </>
    );
  }, [pocState]);
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(PocClass);
