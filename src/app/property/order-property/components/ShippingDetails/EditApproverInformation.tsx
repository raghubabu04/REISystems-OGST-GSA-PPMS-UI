import React, { useContext, useState, useEffect } from "react";
import { connect } from "react-redux";
import { ShoppingContext } from "../ShoppingCartContext";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSEmail } from "../../../../../ui-kit/components/PPMS-email";
import { PropertyApiService } from "../../../../../api-kit/property/property-api-service";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { UserApiService } from "../../../../../api-kit/user/user-api.service";
import { AllocationContext } from "../../../allocate-property/AllocationContext";
import { PPMSFormattedPhoneFax } from "../../../../../ui-kit/components/PPMS-formatted-phone-fax";
import { PPMSPhoneNumber } from "../../../../../ui-kit/components/PPMS-phone-number";
import { CartRequestContactDto } from "../../../../models/CartRequestContact";
import { UpdateCartRequestContactDto } from "../../../../models/UpdateCartRequestContact";
import {
  validateFormattedPhoneNumber,
  validateFormattedFaxNumber,
  validateEmailAddress,
} from "../../../../../ui-kit/components/validations/FieldValidations";
import {
  nullToStringUtil,
  formatPhone,
  formatExtension,
} from "../../../../../ui-kit/utilities/FormatUtil";
import { isEmptyCheck } from "../../../create-update-property/validations/ChangeRequestModalValidation";

export interface Props {
  toggleApprovalModal?: any;
  showApprovalModal?: any;
  tcn?: any;
  actions?: any;
  isAllocation?: boolean;
  alertSuccess: any;
  alertError: any;
  alertInfo: any;
}

const propertyApiService = new PropertyApiService();
const userApiService = new UserApiService();

enum errorMessages {
  notChanged = " ",
  userNotFound = "User with that email not found",
  unexpectedError = "Unexpected error looking user up.",
  notAuthorized = "User with email exists but does not have Approving Official permission",
  notInAAC = "Requestor and AO does not belong to same agency",
  emailRequired = "Email Address is Required.",
  invalidEmail = "Email Address is invalid.",
  noError = "",
}

function ShowApproverModal(props: Props) {
  const { toggleApprovalModal, showApprovalModal, tcn } = props;
  const [validationMessage, setValidationMessage] = useState<
    String | errorMessages
  >(errorMessages.notChanged);
  const { shippingDetailsState, updateShippingDetailsState } = useContext(
    props.isAllocation ? AllocationContext : ShoppingContext
  );

  const resetState = (event) => {
    updateShippingDetailsState({
      agencyApprovalOfficerFirstNameModal: "",
      agencyApprovalOfficerMiddleNameModal: "",
      agencyApprovalOfficerLastNameModal: "",
      agencyApprovalOfficerFaxModal: "",
      agencyApprovalOfficerPhoneModal: "",
      agencyApprovalOfficerPhoneExtModal: "",
      agencyApprovalOfficerEmailIsInValid: false,
      agencyApprovalOfficerEmailValidationMessage: "",
      agencyApprovalOfficerPhoneIsInValid: false,
      agencyApprovalOfficerPhoneValidationMessage: "",
      agencyApprovalOfficerFirstNameIsInValid: false,
      agencyApprovalOfficerLastNameIsInValid: false,
      agencyApprovalOfficerLastNameValidationMessage: "",
    });
    toggleApprovalModal(event);
  };

  useEffect(() => {
    if (shippingDetailsState.contactId) {
      propertyApiService
        .getRequestorAgencyApprovalInfoById(shippingDetailsState.contactId)
        .then((res) => {
          updateShippingDetailsState({
            agencyApprovalOfficerEmailModal: res.data.email,
            agencyApprovalOfficerFirstNameModal: res.data.firstName,
            agencyApprovalOfficerMiddleNameModal: res.data.middleName
              ? res.data.middleName
              : "",
            agencyApprovalOfficerLastNameModal: res.data.lastName
              ? res.data.lastName
              : "",
            agencyApprovalOfficerFaxModal: res.data.fax ? res.data.fax : "",
            agencyApprovalOfficerPhoneModal: res.data.phone,
            agencyApprovalOfficerPhoneExtModal: res.data.phoneExtension
              ? res.data.phoneExtension
              : "",
            agencyApprovalOfficerEmailIsInValid: false,
            agencyApprovalOfficerEmailValidationMessage: "",
            agencyApprovalOfficerDetailsSaveBtnDisabled: true,
          });
        })
        .catch((error) => {});
    }
  }, []);

  const handleEmailChangeUpdate = (value) => {
    const { addToast } = props.actions;
    let validation = validateEmailAddress(value);
    if (!validation.isInvalid) {
      if (shippingDetailsState.agencyApprovalOfficerEmail !== value) {
        userApiService
          .getApprovingOfficialByEmail(value)
          .then((res) => {
            if (res.status === 200) {
              updateShippingDetailsState({
                agencyApprovalOfficerFirstNameModal: res.data.firstName,
                agencyApprovalOfficerMiddleNameModal: res.data.middleName
                  ? res.data.middleName
                  : "",
                agencyApprovalOfficerLastNameModal: res.data.lastName,
                agencyApprovalOfficerFaxModal: res.data.faxNumber
                  ? res.data.faxNumber
                  : "",
                agencyApprovalOfficerPhoneModal: res.data.phoneNumber
                  ? res.data.phoneNumber
                  : "",
                agencyApprovalOfficerPhoneExtModal: res.data.phoneExt
                  ? res.data.phoneExt
                  : "",
                agencyApprovalOfficerAgencyBureauModal: res.data.agencyBureauCd,
                agencyApprovalOfficerEmailIsInValid: false,
                agencyApprovalOfficerEmailValidationMessage: "",
                agencyApprovalOfficerFirstNameIsInValid: false,
                agencyApprovalOfficerMiddleNameIsInValid: false,
                agencyApprovalOfficerLastNameIsInValid: false,
                agencyApprovalOfficerFaxIsInValid: false,
                agencyApprovalOfficerPhoneIsInValid: false,
                agencyApprovalOfficerPhoneExtIsInValid: false,
                agencyApprovalOfficerFirstNameValidationMessage: "",
                agencyApprovalOfficerMiddleNameValidationMessage: "",
                agencyApprovalOfficerLastNameValidationMessage: "",
                agencyApprovalOfficerFaxValidationMessage: "",
                agencyApprovalOfficerPhoneValidationMessage: "",
                agencyApprovalOfficerPhoneExtValidationMessage: "",
                isExistingAPO: true,
              });
            } else if (res.status === 204) {
              updateShippingDetailsState({
                agencyApprovalOfficerFirstNameModal: "",
                agencyApprovalOfficerMiddleNameModal: "",
                agencyApprovalOfficerLastNameModal: "",
                agencyApprovalOfficerFaxModal: "",
                agencyApprovalOfficerPhoneModal: "",
                agencyApprovalOfficerPhoneExtModal: "",
                agencyApprovalOfficerAgencyBureauModal: "",
                agencyApprovalOfficerFirstNameIsInValid: false,
                agencyApprovalOfficerMiddleNameIsInValid: false,
                agencyApprovalOfficerLastNameIsInValid: false,
                agencyApprovalOfficerFaxIsInValid: false,
                agencyApprovalOfficerPhoneIsInValid: false,
                agencyApprovalOfficerPhoneExtIsInValid: false,
                agencyApprovalOfficerEmailIsInValid: true,
                agencyApprovalOfficerEmailIsValid: false,
                agencyApprovalOfficerFirstNameValidationMessage: "",
                agencyApprovalOfficerMiddleNameValidationMessage: "",
                agencyApprovalOfficerLastNameValidationMessage: "",
                agencyApprovalOfficerFaxValidationMessage: "",
                agencyApprovalOfficerPhoneValidationMessage: "",
                agencyApprovalOfficerPhoneExtValidationMessage: "",
                agencyApprovalOfficerEmailValidationMessage: "User with email exists but does not have Approving Official permission",
                isExistingAPO: false,
              });
            }  
          })
          .catch((error) => {
            updateShippingDetailsState({
              agencyApprovalOfficerFirstNameModal: "",
              agencyApprovalOfficerMiddleNameModal: "",
              agencyApprovalOfficerLastNameModal: "",
              agencyApprovalOfficerFaxModal: "",
              agencyApprovalOfficerPhoneModal: "",
              agencyApprovalOfficerPhoneExtModal: "",
              agencyApprovalOfficerAgencyBureauModal: "",
              agencyApprovalOfficerFirstNameIsInValid: false,
              agencyApprovalOfficerMiddleNameIsInValid: false,
              agencyApprovalOfficerLastNameIsInValid: false,
              agencyApprovalOfficerFaxIsInValid: false,
              agencyApprovalOfficerPhoneIsInValid: false,
              agencyApprovalOfficerPhoneExtIsInValid: false,
              agencyApprovalOfficerEmailIsInValid: true,
              agencyApprovalOfficerEmailIsValid: false,
              agencyApprovalOfficerFirstNameValidationMessage: "",
              agencyApprovalOfficerMiddleNameValidationMessage: "",
              agencyApprovalOfficerLastNameValidationMessage: "",
              agencyApprovalOfficerFaxValidationMessage: "",
              agencyApprovalOfficerPhoneValidationMessage: "",
              agencyApprovalOfficerPhoneExtValidationMessage: "",
              agencyApprovalOfficerEmailValidationMessage: "User with email does not exist",
              isExistingAPO: false,
            });
          });
      } else {
        propertyApiService
          .getRequestorAgencyApprovalInfoById(shippingDetailsState.contactId)
          .then((res) => {
            updateShippingDetailsState({
              agencyApprovalOfficerFirstNameModal: res.data.firstName,
              agencyApprovalOfficerMiddleNameModal: res.data.middleName
                ? res.data.middleName
                : "",
              agencyApprovalOfficerLastNameModal: res.data.lastName,
              agencyApprovalOfficerFaxModal: res.data.fax ? res.data.fax : "",
              agencyApprovalOfficerPhoneModal: res.data.phone
                ? res.data.phone
                : "",
              agencyApprovalOfficerPhoneExtModal: res.data.phoneExtension
                ? res.data.phoneExtension
                : "",
              agencyApprovalOfficerEmailIsInValid: false,
              agencyApprovalOfficerEmailValidationMessage: "",
              agencyApprovalOfficerFirstNameIsInValid: false,
              agencyApprovalOfficerMiddleNameIsInValid: false,
              agencyApprovalOfficerLastNameIsInValid: false,
              agencyApprovalOfficerFaxIsInValid: false,
              agencyApprovalOfficerPhoneIsInValid: false,
              agencyApprovalOfficerPhoneExtIsInValid: false,
              agencyApprovalOfficerFirstNameValidationMessage: "",
              agencyApprovalOfficerMiddleNameValidationMessage: "",
              agencyApprovalOfficerLastNameValidationMessage: "",
              agencyApprovalOfficerFaxValidationMessage: "",
              agencyApprovalOfficerPhoneValidationMessage: "",
              agencyApprovalOfficerPhoneExtValidationMessage: "",
            });
          });
      }
    } else {
      updateShippingDetailsState({
        agencyApprovalOfficerEmailIsInValid: true,
        agencyApprovalOfficerEmailValidationMessage: validation.validationError,
      });
    }
  };

  const handleEmailChangeOnChange = (value) => {
    updateShippingDetailsState({
      agencyApprovalOfficerEmailModal: value,
      agencyApprovalOfficerEmailIsInValid: false,
      agencyApprovalOfficerEmailValidationMessage: "",
    });
  };

  const handleChange = (event, field) => {
    const details = { ...shippingDetailsState };
    let value;
    let validation;
    if (field === "phone" || field === "phoneExt" || field === "fax") {
      value = event;
    } else {
      value = event.target.value;
    }
    switch (field) {
      case "firstName":
        details.agencyApprovalOfficerFirstNameModal = value;
        if (value.length === 0) {
          details.agencyApprovalOfficerFirstNameIsInValid = true;
          details.agencyApprovalOfficerFirstNameValidationMessage =
            "First Name is Required.";
        } else {
          details.agencyApprovalOfficerFirstNameIsInValid = false;
        }
        break;
      case "middleName":
        details.agencyApprovalOfficerMiddleNameModal = value;
        break;
      case "lastName":
        details.agencyApprovalOfficerLastNameModal = value;
        if (value.length === 0) {
          details.agencyApprovalOfficerLastNameIsInValid = true;
          details.agencyApprovalOfficerLastNameValidationMessage =
            "Last Name is Required.";
        } else {
          details.agencyApprovalOfficerLastNameIsInValid = false;
        }
        break;
      case "phone":
        validation = validateFormattedPhoneNumber(value);
        if (validation.isInvalid) {
          details.agencyApprovalOfficerPhoneIsInValid = validation.isInvalid;
          details.agencyApprovalOfficerPhoneValidationMessage =
            validation.validationError;
        } else {
          details.agencyApprovalOfficerPhoneIsInValid = false;
          details.agencyApprovalOfficerPhoneValidationMessage = "";
        }
        details.agencyApprovalOfficerPhoneModal = value.replace(/[^0-9]/g, "");
        break;
      case "phoneExt":
        details.agencyApprovalOfficerPhoneExtModal = value;
        break;
      case "fax":
        validation = validateFormattedFaxNumber(value);
        if (value.length !== 0) {
          details.agencyApprovalOfficerFaxIsInValid = validation.isInvalid;
          details.agencyApprovalOfficerFaxValidationMessage =
            validation.validationError;
        } else {
          details.agencyApprovalOfficerFaxIsInValid = false;
          details.agencyApprovalOfficerFaxValidationMessage = "";
        }
        details.agencyApprovalOfficerFaxModal = value.replace(/[^0-9]/g, "");
        break;
    }
    if (
      details.agencyApprovalOfficerPhoneIsInValid ||
      details.agencyApprovalOfficerFaxIsInValid ||
      details.agencyApprovalOfficerFirstNameIsInValid ||
      details.agencyApprovalOfficerLastNameIsInValid
    ) {
      details.validation.agencyApprovalOfficerDetailsSaveBtnDisabled = true;
    } else {
      details.validation.agencyApprovalOfficerDetailsSaveBtnDisabled = false;
    }
    updateShippingDetailsState(details);
  };

  function toJSON(): CartRequestContactDto {
    let cartRequestContact: CartRequestContactDto = {
      contactId: shippingDetailsState.contactId,
      email: shippingDetailsState.agencyApprovalOfficerEmailModal,
      firstName: shippingDetailsState.agencyApprovalOfficerFirstNameModal,
      lastName: shippingDetailsState.agencyApprovalOfficerLastNameModal,
      middleName: shippingDetailsState.agencyApprovalOfficerMiddleNameModal,
      phone: shippingDetailsState.agencyApprovalOfficerPhoneModal
        ? shippingDetailsState.agencyApprovalOfficerPhoneModal
            .toString()
            .replace(/[^0-9]/g, "")
        : "",
      fax: shippingDetailsState.agencyApprovalOfficerFaxModal
        ? shippingDetailsState.agencyApprovalOfficerFaxModal
            .toString()
            .replace(/[^0-9]/g, "")
        : "",
      phoneExtension: shippingDetailsState.agencyApprovalOfficerPhoneExtModal
        ? shippingDetailsState.agencyApprovalOfficerPhoneExtModal
            .toString()
            .replace(/[^0-9]/g, "")
        : "",
    };

    return cartRequestContact;
  }

  function requiredCheck() {
    let requiredCheck = false;

    if (
      isEmptyCheck(shippingDetailsState.agencyApprovalOfficerFirstNameModal)
    ) {
      requiredCheck = true;
      updateShippingDetailsState({
        agencyApprovalOfficerFirstNameIsInValid: true,
        agencyApprovalOfficerFirstNameValidationMessage:
          "First Name is Required.",
      });
    }

    if (isEmptyCheck(shippingDetailsState.agencyApprovalOfficerPhoneModal)) {
      requiredCheck = true;
      updateShippingDetailsState({
        agencyApprovalOfficerPhoneIsInValid: true,
        agencyApprovalOfficerPhoneValidationMessage:
          "Phone Number is Required.",
      });
    }

    if (isEmptyCheck(shippingDetailsState.agencyApprovalOfficerLastNameModal)) {
      requiredCheck = true;
      updateShippingDetailsState({
        agencyApprovalOfficerLastNameIsInValid: true,
        agencyApprovalOfficerLastNameValidationMessage:
          "Last Name is Required.",
      });
    }

    if (isEmptyCheck(shippingDetailsState.agencyApprovalOfficerEmailModal)) {
      requiredCheck = true;
      updateShippingDetailsState({
        agencyApprovalOfficerEmailIsInValid: true,
        agencyApprovalOfficerEmailValidationMessage:
          "Email Address is Required.",
      });
    }

    return requiredCheck;
  }

  const onSave = (event) => {
    event.preventDefault();
    const { addToast } = props.actions;
    const data: CartRequestContactDto = toJSON();
    if (
      !requiredCheck() &&
      !shippingDetailsState.agencyApprovalOfficerFaxIsInValid
    ) {
      propertyApiService
        .saveRequestorAgencyApprovalInfo(data)
        .then((response) => {
          updateShippingDetailsState({
            contactId: response.data.contactId,
            agencyApprovalOfficerFirstName:
              shippingDetailsState.agencyApprovalOfficerFirstNameModal,
            agencyApprovalOfficerMiddleName:
              shippingDetailsState.agencyApprovalOfficerMiddleNameModal,
            agencyApprovalOfficerLastName:
              shippingDetailsState.agencyApprovalOfficerLastNameModal,
            agencyApprovalOfficerFax:
              shippingDetailsState.agencyApprovalOfficerFaxModal,
            agencyApprovalOfficerPhone:
              shippingDetailsState.agencyApprovalOfficerPhoneModal,
            agencyApprovalOfficerPhoneExt:
              shippingDetailsState.agencyApprovalOfficerPhoneExtModal,
            agencyApprovalOfficerEmail:
              shippingDetailsState.agencyApprovalOfficerEmailModal,
            agencyApprovalOfficerAgencyBureau:
              shippingDetailsState.agencyApprovalOfficerAgencyBureauModal,
            agencyApprovalOfficerDetailsSaveBtnDisabled: true,
          });
          let linkPayload: UpdateCartRequestContactDto = {
            cartRequestId: shippingDetailsState.cartId,
            contactId: response.data.contactId,
            contactType: "AO",
          };
          propertyApiService
            .linkRequestorToCart(linkPayload)
            .then((response: any) => {
              addToast({
                text: `Approver details successfully updated!`,
                type: "success",
                heading: "Success",
              });
            })
            .catch((error) => {
              console.log("error", error);
            });
          toggleApprovalModal(event);
        })
        .catch((error) => {
          addToast({
            text: "Error updating approver details. Please try again.",
            type: "error",
            heading: "Error",
          });
          setValidationMessage(errorMessages.notAuthorized);
        });
    }
  };
  return (
    <PPMSModal
      size={"lg"}
      body={
        <div className={"modal-adjustment"}>
          <div className="grid-row grid-gap-2">
            <div className={"tablet:grid-col-6"}>
              <PPMSEmail
                email={shippingDetailsState.agencyApprovalOfficerEmailModal}
                emailLabel={"Agency Approval Officer Email"}
                id={"requestorEmail"}
                required={true}
                disabled={false}
                maxLength={64}
                isValid={!shippingDetailsState.agencyApprovalOfficerEmailIsInValid}
                isInvalid={shippingDetailsState.agencyApprovalOfficerEmailIsInValid}
                validationMessage={
                  shippingDetailsState.agencyApprovalOfficerEmailValidationMessage
                }
                updateEmail={handleEmailChangeUpdate}
                onChangeEmail={handleEmailChangeOnChange}
              />
            </div>
          </div>
          <div className="grid-row grid-gap-2">
            <div className={"tablet:grid-col-4"}>
              <PPMSInput
                label={"First Name"}
                id={"requestorFirstName"}
                inputType={"text"}
                name={"requestorFirstName"}
                maxLength={36}
                value={shippingDetailsState.agencyApprovalOfficerFirstNameModal}
                onBlur={(event) => {
                  handleChange(event, "firstName");
                }}
                onChange={(event) => {
                  updateShippingDetailsState({
                    agencyApprovalOfficerFirstNameModal: event.target.value,
                    agencyApprovalOfficerFirstNameIsInValid: false,
                    agencyApprovalOfficerFirstNameValidationMessage: "",
                  });
                }}
                isDisabled={false}
                isRequired={true}
                isInvalid={
                  shippingDetailsState.agencyApprovalOfficerFirstNameIsInValid
                }
                validationMessage={
                  shippingDetailsState.agencyApprovalOfficerFirstNameValidationMessage
                }
              />
              </div>
            <div className={"tablet:grid-col-3"}>
              <PPMSInput
                value={shippingDetailsState.agencyApprovalOfficerMiddleNameModal}
                label={"Middle Initial"}
                name={"requestorMiddleName"}
                maxLength={1}
                id={"requestorMiddleName"}
                onChange={(event) => {
                  handleChange(event, "middleName");
                }}
                inputType={"text"}
                isRequired={false}
                isDisabled={false}
              />
            </div>
            <div className={"tablet:grid-col-4"}>
              <PPMSInput
                value={shippingDetailsState.agencyApprovalOfficerLastNameModal}
                label={"Last Name"}
                id={"requestorLastName"}
                name={"requestorLastName"}
                onBlur={(event) => {
                  handleChange(event, "lastName");
                }}
                onChange={(event) => {
                  updateShippingDetailsState({
                    agencyApprovalOfficerLastNameModal: event.target.value,
                    agencyApprovalOfficerLastNameIsInValid: false,
                    agencyApprovalOfficerLastNameValidationMessage: "",
                  });
                }}
                maxLength={30}
                inputType={"text"}
                isRequired={true}
                isDisabled={false}
                isInvalid={
                  shippingDetailsState.agencyApprovalOfficerLastNameIsInValid
                }
                validationMessage={
                  shippingDetailsState.agencyApprovalOfficerLastNameValidationMessage
                }
              />
            </div>
          </div>
          <div className="grid-row grid-gap-2">
              <PPMSPhoneNumber
                phone={formatPhone(
                  nullToStringUtil(
                    shippingDetailsState?.agencyApprovalOfficerPhoneModal
                  ) + ""
                )}
                showExtension={true}
                extension={formatExtension(
                  nullToStringUtil(
                    shippingDetailsState.agencyApprovalOfficerPhoneExtModal
                  ) + ""
                )}
                id={"Phone"}
                updatePhoneNumber={(value, validation) => {
                  updateShippingDetailsState({
                    agencyApprovalOfficerPhoneIsInValid: validation.isInvalid,
                    agencyApprovalOfficerPhoneValidationMessage:
                      validation.validationError,
                  });
                }}
                onChangePhoneNumber={(value) => {
                  updateShippingDetailsState({
                    agencyApprovalOfficerPhoneModal: value
                      .replace(/[^0-9]/g, "")
                      .substring(0, 10),
                    agencyApprovalOfficerPhoneIsInValid: false,
                    agencyApprovalOfficerPhoneValidationMessage: "",
                  });
                }}
                onChangePhoneExt={(event) => {
                  handleChange(event, "phoneExt");
                }}
                updatePhoneExtension={(event) => {}}
                maxLength={16}
                maxLengthExtension={7}
                required={true}
                disabled={false}
                isInvalid={shippingDetailsState.agencyApprovalOfficerPhoneIsInValid}
                validationMessage={
                  shippingDetailsState.agencyApprovalOfficerPhoneValidationMessage
                }
              />
            
          </div>
          <div className="grid-row grid-gap-2">
            <PPMSFormattedPhoneFax
              phoneFax={formatPhone(
                nullToStringUtil(
                  shippingDetailsState?.agencyApprovalOfficerFaxModal
                ) + ""
              )}
              disabled={false}
              id={"requestorFax"}
              maxLength={16}
              numberFormatType="Fax"
              required={false}
              size={"sm"}
              updatePhoneFax={(event) => {
                handleChange(event, "fax");
              }}
              onChangePhoneFax={(event) => {
                handleChange(event, "fax");
              }}
              isInvalid={shippingDetailsState.agencyApprovalOfficerFaxIsInValid}
              isValid={true}
              validationMessage={
                shippingDetailsState.agencyApprovalOfficerFaxValidationMessage
              }
            />
          </div>
        </div>
      }
      id={"agencyApprovalOfficer-update"}
      show={showApprovalModal}
      handleClose={resetState}
      handleSave={onSave}
      title={"Edit Agency Approval Officer Information"}
      label={"Save"}
      labelCancel={"Cancel"}
      disableSave={false}
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
export default connect(mapStateToProps, mapDispatchToProps)(ShowApproverModal);
