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
import { PPMSPhoneNumber } from "../../../../../ui-kit/components/PPMS-phone-number";
import { PPMSFormattedPhoneFax } from "../../../../../ui-kit/components/PPMS-formatted-phone-fax";
import {
  validateFormattedPhoneNumber,
  validateFormattedFaxNumber,
} from "../../../../../ui-kit/components/validations/FieldValidations";
import {
  nullToStringUtil,
  formatPhone,
  formatExtension,
} from "../../../../../ui-kit/utilities/FormatUtil";
import { isEmptyCheck } from "../../../create-non-reported-property/validations/NonReportedTransferValidations";

export interface Props {
  toggleRequestorModal?: any;
  showRequestorModal?: any;
  tcn?: any;
  actions?: any;
  isAllocation?: boolean;
}

function EditRequestorInfo(props: Props) {
  const propertyApiService = new PropertyApiService();
  const userApiService = new UserApiService();
  const { toggleRequestorModal, showRequestorModal, tcn } = props;

  const {
    shippingDetailsState: shippingDetails,
    updateShippingDetailsState,
  } = useContext(props.isAllocation ? AllocationContext : ShoppingContext);
  const [shippingDetailsState, setShippingDetailsState] = useState({
    ...shippingDetails,
  });
  const [emailEntry, setEmailEntry] = useState("");

  const resetState = (event) => {
    toggleRequestorModal(event);
  };

  useEffect(() => {
    const details = { ...shippingDetailsState };
    let validation = details.validation;
    setEmailEntry(details.userEmail);
    validation.userEmailValidationMessage = "";
    validation.userEmailIsValid = true;
    validation.userEmailIsInvalid = false;
    details.validation.userPhoneIsInvalid = false;
    details.validation.userFaxIsInvalid = false;
    if (shippingDetailsState.userId) {
      propertyApiService
        .getRequestorAgencyApprovalInfoById(shippingDetailsState.userId)
        .then((resp) => {
          details.userFirstNameModal = resp.data.firstName;
          details.userLastNameModal = resp.data.lastName;
          details.userPhoneModal = resp.data.phone ? resp.data.phone : "";
          details.userPhoneExtModal = resp.data.phoneExtension
            ? resp.data.phoneExtension
            : "";
          details.userMiddleNameModal = resp.data.middleName
            ? resp.data.middleName
            : "";
          details.userFaxModal = resp.data.fax ? resp.data.fax : "";
          userApiService
            .getUserDetailsByEmail(shippingDetailsState.userEmail)
            .then((response) => {
              let permissions = response.data.permissions;
              let locationState = response.data.locationState;
              if (permissions.includes("FI") && permissions.includes("SA")) {
                details.showLeaInfoByRequestor = true;
                details.doneeInfoState = locationState;
              } else {
                details.showLeaInfoByRequestor = false;
              }
            });

          validation.userEmailIsValid = true;
          validation.userEmailIsInvalid = false;
          validation.requestorDetailsSaveBtnDisabled = false;
          validation.userFirstNameIsInvalid = false;
          validation.userFirstNameValidationMessage = "";
          validation.userLastNameIsInvalid = false;
          validation.userLastNameValidationMessage = "";
          validation.userFaxIsInvalid = false;
          validation.userFaxValidationMessage = "";
          validation.userPhoneIsInvalid = false;
          validation.userPhoneValidationMessage = "";
          setShippingDetailsState(details);
          updateShippingDetailsState({});
        })
        .catch((error) => {});
    }

    setShippingDetailsState(details);
    updateShippingDetailsState({});
  }, []);

  const handleEmailChange = React.useCallback(
    async (value: any, validation: any) => {
      const details = { ...shippingDetailsState };
      details.validation.userEmailIsValid =
        validation === undefined ? false : !validation.isInvalid;
      details.validation.userEmailIsInvalid =
        validation === undefined ? false : validation.isInvalid;
      details.validation.userEmailValidationMessage =
        validation === undefined
          ? "Email is Required."
          : validation.validationError;
      if (validation !== undefined && !validation.isInvalid) {
        if (shippingDetailsState.userEmail === value) {
          let resp = await propertyApiService
            .getRequestorAgencyApprovalInfoById(shippingDetailsState.userId)
            .then((res) => res)
            .catch((err) => err);
          if (resp.status === 200) {
            details.userFirstNameModal = resp.data.firstName;
            details.userLastNameModal = resp.data.lastName;
            details.userPhoneModal = resp.data.phone ? resp.data.phone : "";
            details.userPhoneExtModal = resp.data.phoneExtension
              ? resp.data.phoneExtension
              : "";
            details.userMiddleNameModal = resp.data.middleName
              ? resp.data.middleName
              : "";
            details.userFaxModal = resp.data.fax ? resp.data.fax : "";
            details.validation.userEmailIsValid = true;
            details.validation.userEmailIsInvalid = false;
            details.validation.requestorDetailsSaveBtnDisabled = false;
            details.validation.userFirstNameIsInvalid = false;
            details.validation.userFirstNameValidationMessage = "";
            details.validation.userFaxIsInvalid = false;
            details.validation.userFaxValidationMessage = "";
            details.validation.userPhoneIsInvalid = false;
            details.validation.userPhoneValidationMessage = "";
            userApiService
              .getUserDetailsByEmail(value)
              .then((resp) => {
                details.activityAddressCode = resp.data.primaryAac;
              })
              .catch((error) => {});
          } else {
            details.validation.userEmailValidationMessage =
              "Unexpected error looking up email";
            details.validation.userEmailIsValid = false;
            details.validation.userEmailIsInvalid = true;
            details.validation.requestorDetailsSaveBtnDisabled = true;
          }
        } else {
          await userApiService
            .getUserDetailsByEmail(value)
            .then((resp) => {
              details.userEmailModal = value;
              details.userFirstNameModal = resp.data.firstName;
              details.userLastNameModal = resp.data.lastName;
              details.userPhoneModal = resp.data.phoneNumber;
              details.userPhoneExtModal = resp.data.phoneExtension;
              details.userMiddleNameModal = resp.data.middleName;
              details.userFaxModal = resp.data.faxNumber;
              details.activityAddressCode = resp.data.primaryAac;
              details.validation.userEmailIsValid = true;
              details.validation.userEmailIsInvalid = false;
              details.validation.requestorDetailsSaveBtnDisabled = false;
              details.validation.userFirstNameIsInvalid = false;
              details.validation.userFirstNameValidationMessage = "";
              details.validation.userFaxIsInvalid = false;
              details.validation.userFaxValidationMessage = "";
              details.validation.userPhoneIsInvalid = false;
              details.validation.userPhoneValidationMessage = "";

              details.agencyApprovalOfficerAgencyBureau =
                resp.data.approvingOfficial?.agencyBureauCd || "";

              details.agencyApprovalOfficerFirstName =
                resp.data.approvingOfficial?.firstName || "";

              details.agencyApprovalOfficerMiddleName =
                resp.data.approvingOfficial?.middleName || "";
              details.agencyApprovalOfficerLastName =
                resp.data.approvingOfficial?.lastName || "";
              details.agencyApprovalOfficerFax =
                resp.data.approvingOfficial?.faxNumber || "";
              details.agencyApprovalOfficerPhone =
                resp.data.approvingOfficial?.phoneNumber || "";
              details.agencyApprovalOfficerPhoneExt =
                resp.data.approvingOfficial?.agencyApprovalOfficerPhoneExt ||
                "";
              details.agencyApprovalOfficerEmail =
                resp.data.approvingOfficial?.emailAddress || "";
              details.shippingDetailsAddressLine1 =
                resp.data.shippingAddressLine1 || "";
              details.shippingDetailsAddressLine2 =
                resp.data.shippingAddressLine2 || "";
              details.shippingDetailsAddressLine3 =
                resp.data.shippingAddressLine3 || "";
              details.shippingDetailsCity = resp.data.shippingAddressCity || "";
              details.shippingDetailsState =
                resp.data.shippingAddressStateCode || "";
              details.shippingDetailsZipcode = resp.data.zipCode || "";
              details.shippingDetailsAttn = "";
              details.shippingDetailsInstructions = "";
            })
            .catch((error) => {
              details.userFirstNameModal = "";
              details.userLastNameModal = "";
              details.userPhoneModal = "";
              details.userPhoneExtModal = "";
              details.userMiddleNameModal = "";
              details.userFaxModal = "";
              details.validation.userEmailIsValid = true;
              details.validation.userEmailIsInvalid = false;
              details.validation.requestorDetailsSaveBtnDisabled = false;
              details.validation.userEmailValidationMessage =
                "User with email does not exist";

              alert("Email address not found in the system");
            });
        }
      } else {
      }
      setShippingDetailsState(details);
    },
    [shippingDetailsState, setShippingDetailsState]
  );

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
        details.userFirstNameModal = value;
        if (value.length === 0) {
          details.validation.userFirstNameIsInvalid = true;
          details.validation.userFirstNameValidationMessage =
            "First Name is Required";
        } else {
          details.validation.userFirstNameIsInvalid = false;
        }
        break;
      case "middleName":
        details.userMiddleNameModal = value;
        break;
      case "lastName":
        details.userLastNameModal = value;
        if (value.length === 0) {
          details.validation.userLastNameIsInvalid = true;
          details.validation.userLastNameValidationMessage =
            "Last Name is Required";
        } else {
          details.validation.userLastNameIsInvalid = false;
        }
        break;
      case "phone":
        validation = validateFormattedPhoneNumber(value);
        if (validation.isInvalid) {
          details.validation.userPhoneIsInvalid = validation.isInvalid;
          details.validation.userPhoneValidationMessage =
            validation.validationError;
        } else {
          details.validation.userPhoneIsInvalid = false;
          details.validation.userPhoneValidationMessage = "";
        }
        details.userPhoneModal = value.replace(/[^0-9]/g, "");
        break;
      case "phoneExt":
        details.userPhoneExtModal = value;
        break;
      case "fax":
        validation = validateFormattedFaxNumber(value);
        if (value.length !== 0) {
          details.validation.userFaxIsInvalid = validation.isInvalid;
          details.validation.userFaxValidationMessage =
            validation.validationError;
        } else {
          details.validation.userFaxIsInvalid = false;
          details.validation.userFaxValidationMessage = "";
        }
        details.userFaxModal = value.replace(/[^0-9]/g, "");
        break;
    }
    if (
      details.validation.userPhoneIsInvalid ||
      details.validation.userFaxIsInvalid ||
      details.validation.userFirstNameIsInvalid ||
      details.validation.userLastNameIsInvalid
    ) {
      details.validation.requestorDetailsSaveBtnDisabled = true;
    } else {
      details.validation.requestorDetailsSaveBtnDisabled = false;
    }
    setShippingDetailsState(details);
    updateShippingDetailsState(details);
  };

  function requiredCheck() {
    let requiredCheck = false;
    const details = { ...shippingDetailsState };
    if (isEmptyCheck(shippingDetailsState.userFirstNameModal)) {
      requiredCheck = true;
      details.validation.userFirstNameIsInvalid = true;
      details.validation.userFirstNameValidationMessage =
        "First Name is Required.";
    }

    if (isEmptyCheck(shippingDetailsState.userLastNameModal)) {
      requiredCheck = true;
      details.validation.userLastNameIsInvalid = true;
      details.validation.userLastNameValidationMessage =
        "Last Name is Required.";
    }

    if (isEmptyCheck(shippingDetailsState.userPhoneModal)) {
      requiredCheck = true;
      details.validation.userPhoneIsInvalid = true;
      details.validation.userPhoneValidationMessage =
        "Phone Number is Required.";
    }

    if (isEmptyCheck(emailEntry)) {
      requiredCheck = true;
      details.validation.userEmailIsInvalid = true;
      details.validation.userEmailValidationMessage =
        "Email Address is Required.";
    }
    setShippingDetailsState(details);
    updateShippingDetailsState(details);
    return requiredCheck;
  }

  const onSave = (event) => {
    let payload = {
      contactId: shippingDetailsState.userId,
      firstName: shippingDetailsState.userFirstNameModal,
      lastName: shippingDetailsState.userLastNameModal,
      middleName: shippingDetailsState.userMiddleNameModal,
      email: emailEntry,
      phone: shippingDetailsState.userPhoneModal
        ? shippingDetailsState.userPhoneModal.toString().replace(/[^0-9]/g, "")
        : "",
      fax: shippingDetailsState.userFaxModal
        ? shippingDetailsState.userFaxModal.toString().replace(/[^0-9]/g, "")
        : "",
      phoneExtension: shippingDetailsState.userPhoneExtModal
        ? shippingDetailsState.userPhoneExtModal
            .toString()
            .replace(/[^0-9]/g, "")
        : "",
    };

    let aoPayload = {
      contactId: shippingDetailsState.contactId,
      email: shippingDetailsState.agencyApprovalOfficerEmail,
      firstName: shippingDetailsState.agencyApprovalOfficerFirstName,
      lastName: shippingDetailsState.agencyApprovalOfficerLastName,
      middleName: shippingDetailsState.agencyApprovalOfficerMiddleName,
      phone: shippingDetailsState.agencyApprovalOfficerPhone
        ? shippingDetailsState.agencyApprovalOfficerPhone
            .toString()
            .replace(/[^0-9]/g, "")
        : "",
      fax: shippingDetailsState.agencyApprovalOfficerFax
        ? shippingDetailsState.agencyApprovalOfficerFax
            .toString()
            .replace(/[^0-9]/g, "")
        : "",
      phoneExtension: shippingDetailsState.agencyApprovalOfficerPhoneExt
        ? shippingDetailsState.agencyApprovalOfficerPhoneExt
            .toString()
            .replace(/[^0-9]/g, "")
        : "",
    };

    const { addToast } = props.actions;
    if (!requiredCheck() && !shippingDetailsState.validation.userFaxIsInvalid) {
      userApiService
        .getUserDetailsByEmail(shippingDetailsState.userEmailModal)
        .then((resp) => {
          let permissions = resp.data.permissions;
          let showLeaInfoByRequestor =
            permissions.includes("FI") && permissions.includes("SA")
              ? true
              : false;
          let doneeInfoState =
            permissions.includes("FI") && permissions.includes("SA")
              ? resp.data.locationState
              : "";
          //Create Cart Request Contact for Requestor
          propertyApiService
            .saveRequestorAgencyApprovalInfo(payload)
            .then((response) => {
              updateShippingDetailsState({
                userId: response.data.contactId,
                userFirstName: shippingDetailsState.userFirstNameModal,
                userMiddleName: shippingDetailsState.userMiddleNameModal,
                userLastName: shippingDetailsState.userLastNameModal,
                userPhone: shippingDetailsState.userPhoneModal,
                userPhoneExt: shippingDetailsState.userPhoneExtModal,
                userFax: shippingDetailsState.userFaxModal,
                userEmail: emailEntry,
                showLeaInfoByRequestor: showLeaInfoByRequestor,
                doneeInfoState: doneeInfoState,
              });

              let linkPayload = {
                cartRequestId: shippingDetailsState.cartId,
                contactId: response.data.contactId,
                contactType: "REQUESTOR",
              };
              //Link Cart Request Contact for Requestor
              propertyApiService
                .linkRequestorToCart(linkPayload)
                .then((response) => {
                  addToast({
                    text: `Requestor details successfully updated!`,
                    type: "success",
                    heading: "Success",
                  });
                  toggleRequestorModal(event);
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
              addToast({
                text: "Error updating requestor details. Please try again.",
                type: "error",
                heading: "Error",
              });
            });
          if (shippingDetailsState.agencyApprovalOfficerEmail !== "") {
            propertyApiService
              .saveRequestorAgencyApprovalInfo(aoPayload)
              .then((response) => {
                updateShippingDetailsState({
                  contactId: response.data.contactId,
                  agencyApprovalOfficerFirstName:
                    shippingDetailsState.agencyApprovalOfficerFirstName,
                  agencyApprovalOfficerMiddleName:
                    shippingDetailsState.agencyApprovalOfficerMiddleName,
                  agencyApprovalOfficerLastName:
                    shippingDetailsState.agencyApprovalOfficerLastName,
                  agencyApprovalOfficerFax:
                    shippingDetailsState.agencyApprovalOfficerFax,
                  agencyApprovalOfficerPhone:
                    shippingDetailsState.agencyApprovalOfficerPhone,
                  agencyApprovalOfficerPhoneExt:
                    shippingDetailsState.agencyApprovalOfficerPhoneExt,
                  agencyApprovalOfficerEmail:
                    shippingDetailsState.agencyApprovalOfficerEmail,
                  agencyApprovalOfficerAgencyBureau:
                    shippingDetailsState.agencyApprovalOfficerAgencyBureau,
                });
                let aoLinkPayload = {
                  cartRequestId: shippingDetailsState.cartId,
                  contactId: response.data.contactId,
                  contactType: "AO",
                };
                propertyApiService
                  .linkRequestorToCart(aoLinkPayload)
                  .then((response: any) => {
                    addToast({
                      text: `Approver details successfully updated!`,
                      type: "success",
                      heading: "Success",
                    });
                    toggleRequestorModal(event);
                  })
                  .catch((error) => {
                    console.log("error", error);
                  });
              })
              .catch((error) => {});
          }
        })
        .catch((error) => {});
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
                email={emailEntry}
                emailLabel={"Requestor Email"}
                id={"requestorEmail"}
                required={true}
                disabled={false}
                maxLength={64}
                isValid={shippingDetailsState.validation.userEmailIsValid}
                isInvalid={shippingDetailsState.validation.userEmailIsInvalid}
                validationMessage={
                  shippingDetailsState.validation.userEmailValidationMessage
                }
                updateEmail={(value, validation) => {
                  handleEmailChange(value, validation);
                }}
                onChangeEmail={(value) => {
                  setEmailEntry(value);
                }}
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
                maxLength={30}
                onBlur={(event) => {
                  handleChange(event, "firstName");
                }}
                onChange={(event) => {
                  handleChange(event, "firstName");
                }}
                value={shippingDetailsState.userFirstNameModal}
                isDisabled={false}
                isRequired={true}
                isInvalid={
                  shippingDetailsState.validation.userFirstNameIsInvalid
                }
                validationMessage={
                  shippingDetailsState.validation.userFirstNameValidationMessage
                }
              />
            </div>
            <div className={"tablet:grid-col-3"}>
              <PPMSInput
                value={shippingDetailsState.userMiddleNameModal}
                label={"Middle Initial"}
                name={"requestorMiddleName"}
                maxLength={1}
                onChange={(event) => {
                  handleChange(event, "middleName");
                }}
                id={"requestorMiddleName"}
                inputType={"text"}
                isRequired={false}
                isDisabled={false}
              />
            </div>
            <div className={"tablet:grid-col-4"}>
              <PPMSInput
                value={shippingDetailsState.userLastNameModal}
                label={"Last Name"}
                id={"requestorLastName"}
                name={"requestorLastName"}
                onChange={(event) => {
                  handleChange(event, "lastName");
                }}
                onBlur={(event) => {
                  handleChange(event, "lastName");
                }}
                maxLength={36}
                inputType={"text"}
                isRequired={true}
                isDisabled={false}
                isInvalid={
                  shippingDetailsState.validation.userLastNameIsInvalid
                }
                validationMessage={
                  shippingDetailsState.validation.userLastNameValidationMessage
                }
              />
            </div>
          </div>
          <div className="grid-row grid-gap-2">
            <PPMSPhoneNumber
            showExtension={true}
              phone={formatPhone(
                nullToStringUtil(shippingDetailsState?.userPhoneModal) + ""
              )}
              extension={formatExtension(
                nullToStringUtil(shippingDetailsState.userPhoneExtModal) + ""
              )}
              id={"Phone"}
              disabled={false}
              disabledExtension={false}
              updatePhoneExtension={() => {}}
              onChangePhoneExt={(event) => {
                handleChange(event, "phoneExt");
              }}
              updatePhoneNumber={(value, validation) => {
                const details = { ...shippingDetailsState };
                details.validation.userPhoneIsInvalid = validation.isInvalid;
                details.validation.userPhoneValidationMessage =
                  validation.validationError;
                setShippingDetailsState(details);
                updateShippingDetailsState(details);
              }}
              onChangePhoneNumber={(value) => {
                const details = { ...shippingDetailsState };
                details.userPhoneModal = value
                  .replace(/[^0-9]/g, "")
                  .substring(0, 10);
                details.validation.userPhoneIsInvalid = false;
                details.validation.userPhoneValidationMessage = "";
                setShippingDetailsState(details);
                updateShippingDetailsState(details);
              }}
              maxLength={16}
              isInvalid={shippingDetailsState.validation.userPhoneIsInvalid}
              validationMessage={
                shippingDetailsState.validation.userPhoneValidationMessage
              }
              maxLengthExtension={7}
              required={true}
            />
          </div>
          <div className="grid-row grid-gap-2">
            <PPMSFormattedPhoneFax
              disabled={false}
              id={"requestorFax"}
              maxLength={16}
              isInvalid={shippingDetails.validation.userFaxIsInvalid}
              validationMessage={
                shippingDetailsState.validation.userFaxValidationMessage
              }
              isValid={true}
              numberFormatType="Fax"
              phoneFax={formatPhone(
                nullToStringUtil(shippingDetailsState?.userFaxModal) + ""
              )}
              required={false}
              size={"sm"}
              updatePhoneFax={(event) => {
                handleChange(event, "fax");
              }}
              onChangePhoneFax={(event) => {
                handleChange(event, "fax");
              }}
            />
          </div>
        </div>
      }
      id={"requestor-update"}
      show={showRequestorModal}
      handleClose={resetState}
      handleSave={onSave}
      title={"Edit Requestor Information"}
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
export default connect(mapStateToProps, mapDispatchToProps)(EditRequestorInfo);
