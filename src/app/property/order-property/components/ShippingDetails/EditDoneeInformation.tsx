import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { ShoppingContext } from "../ShoppingCartContext";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSEmail } from "../../../../../ui-kit/components/PPMS-email";
import { PropertyApiService } from "../../../../../api-kit/property/property-api-service";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { UserApiService } from "../../../../../api-kit/user/user-api.service";
import { PPMSPhoneNumber } from "../../../../../ui-kit/components/PPMS-phone-number";
import { PPMSFirstNameLastName } from "../../../../../ui-kit/components/PPMS-firstname-lastname";
import { PPMSAddress } from "../../../../../ui-kit/components/PPMS-address";
import { isEmptyCheck } from "../../../../../ui-kit/components/validations/FieldValidations";
import {
  formatExtension,
  formatPhone,
} from "../../../../../ui-kit/utilities/FormatUtil";
import { AllocationContext } from "../../../allocate-property/AllocationContext";
import { NuoUser } from "../../../../models/User";

import { defaultDoneeInfoDetails } from "../ShippingDetails/ShippingDetailsState";
import { DoneeModal } from "../../../../models/DoneeModel";
import { PPMSAlert } from "../../../../../ui-kit/components/common/PPMS-alert";

export interface Props {
  toggleDoneeInfoModal?: any;
  showDoneeInfoModal?: any;
  tcn?: any;
  actions?: any;
  isAllocation?: boolean;
  shippingDetailsState?: any;
}

function EditDoneeInformation(props: Props) {
  const propertyApiService = new PropertyApiService();
  const userApiService = new UserApiService();
  const { toggleDoneeInfoModal, showDoneeInfoModal, tcn } = props;
  const { shippingDetailsState, updateShippingDetailsState } = useContext(
    props.isAllocation ? AllocationContext : ShoppingContext
  );

  const resetState = (event) => {
    resetDoneeInfoState();
    toggleDoneeInfoModal(event);
  };

  useEffect(() => {
    if (shippingDetailsState.doneeTileEmail) {
      getDoneeInfo(shippingDetailsState.doneeTileEmail);
    }
  }, []);

  function resetDoneeInfoState() {
    updateShippingDetailsState({ ...defaultDoneeInfoDetails });
  }

  function toJson(): NuoUser {
    let approvingOfficial: any;
    let leaInformationDTO: any;

    approvingOfficial = {
      emailAddress: shippingDetailsState.doneeInfoApprovalOfficerEmail,
    };
    leaInformationDTO = {
      doneeOrganizationName: shippingDetailsState.doneeInfoOrgName,
      title: shippingDetailsState.doneeInfoTitle,
      addressLine1: shippingDetailsState.doneeInfoAddressLine1,
      addressLine2: shippingDetailsState.doneeInfoAddressLine2,
      addressLine3: shippingDetailsState.doneeInfoAddressLine3,
      city: shippingDetailsState.doneeInfoCity,
      stateCode: shippingDetailsState.doneeInfoState,
      zip: shippingDetailsState.doneeInfoZipcode,
      zipExtension: shippingDetailsState.doneeInfoZipExt,
    };
    return {
      firstName: shippingDetailsState.doneeInfoFirstName,
      lastName: shippingDetailsState.doneeInfoLastName,
      middleName: shippingDetailsState.doneeInfoMiddleName,
      emailAddress: shippingDetailsState.doneeInfoEmail,
      aac: "",
      aacCodes: [],
      agencyBureauCd: "",
      phoneNumber: shippingDetailsState.doneeInfoPhone.replace(/[^0-9]/g, ""),
      phoneExt: shippingDetailsState.doneeInfoPhoneExt.replace(/[^0-9]/g, ""),
      zipCode: shippingDetailsState.doneeInfoZipcode,
      locationState: shippingDetailsState.doneeInfoState,
      nuoEmailAddress: "",
      requestorInfoEmail: shippingDetailsState.userEmail,
      approvingOfficialEmail:
        shippingDetailsState.doneeInfoApprovalOfficerEmail,
      fedContractorNonFedRecipientDonee: false,
      permissions: [],
      leaInformationDTO: leaInformationDTO,
      approvingOfficial: approvingOfficial,
    } as NuoUser;
  }

  function toDoneeJson(): DoneeModal {
    let leaShippingAddress = {
      addressId: shippingDetailsState.doneeShippingId,
      line1: shippingDetailsState.doneeInfoAddressLine1,
      line2: shippingDetailsState.doneeInfoAddressLine2,
      line3: shippingDetailsState.doneeInfoAddressLine3,
      city: shippingDetailsState.doneeInfoCity,
      stateCode: shippingDetailsState.doneeInfoState,
      zip: shippingDetailsState.doneeInfoZipcode,
      zip2: shippingDetailsState.doneeInfoZipExt,
      instructions: "",
    };
    return {
      cartId: shippingDetailsState.cartId,
      leaUserId: shippingDetailsState.doneeInfoUserId,
      leaShippingAttn:"",
      leaShippingAddress: leaShippingAddress,
    };
  }

  function validateDoneeInfo() {
    let valid: boolean = true;
    let doneeInfoState = { ...shippingDetailsState };
    if (shippingDetailsState.doneeInfoUserDetailsDisabled) {
      return true;
    } else {
      if (isEmptyCheck(shippingDetailsState.doneeInfoFirstName)) {
        valid = false;
        doneeInfoState.doneeInfoFirstNameIsInvalid = true;
        doneeInfoState.doneeInfoFirstNameValidationMessage =
          "First Name is Required.";
      }
      if (isEmptyCheck(shippingDetailsState.doneeInfoLastName)) {
        valid = false;
        doneeInfoState.doneeInfoLastNameIsInvalid = true;
        doneeInfoState.doneeInfoLastNameValidationMessage =
          "Last Name is Required.";
      }
      if (isEmptyCheck(shippingDetailsState.doneeInfoPhone)) {
        valid = false;
        doneeInfoState.doneeInfoPhoneIsInvalid = true;
        doneeInfoState.doneeInfoPhoneValidationMessage =
          "Phone Number is Required.";
      }
      if (isEmptyCheck(shippingDetailsState.doneeInfoZipcode)) {
        valid = false;
        doneeInfoState.doneeInfoZipcodeIsInvalid = true;
        doneeInfoState.doneeInfoZipcodeValidationMessage =
          "Zip code is Required.";
      }
      if (isEmptyCheck(shippingDetailsState.doneeInfoApprovalOfficerEmail)) {
        valid = false;
        doneeInfoState.doneeInfoApprovalOfficerEmailIsInvalid = true;
        doneeInfoState.doneeInfoApprovalOfficerEmailValidationMessage =
          "Approval Officer Email is Required.";
      }
      if (isEmptyCheck(shippingDetailsState.doneeInfoAddressLine1)) {
        valid = false;
        doneeInfoState.doneeInfoAddressLine1IsInvalid = true;
      }
      if (isEmptyCheck(shippingDetailsState.doneeInfoCity)) {
        valid = false;
        doneeInfoState.doneeInfoCityIsInvalid = true;
      }
      if (isEmptyCheck(shippingDetailsState.doneeInfoState)) {
        valid = false;
        doneeInfoState.doneeInfoStateIsInvalid = true;
      }
      if (isEmptyCheck(shippingDetailsState.doneeInfoOrgName)) {
        valid = false;
        doneeInfoState.doneeInfoOrgNameIsInvalid = true;
        doneeInfoState.doneeInfoOrgNameValidationMessage =
          "Organization Name is Required.";
      }
      updateShippingDetailsState({
        ...doneeInfoState,
      });
      if (
        shippingDetailsState.doneeInfoFirstNameIsInvalid ||
        shippingDetailsState.doneeInfoLastNameIsInvalid ||
        shippingDetailsState.doneeInfoPhoneIsInvalid ||
        shippingDetailsState.doneeInfoZipcodeIsInvalid ||
        shippingDetailsState.doneeInfoApprovalOfficerEmailIsInvalid ||
        shippingDetailsState.doneeInfoAddressLine1IsInvalid ||
        shippingDetailsState.doneeInfoCityIsInvalid ||
        shippingDetailsState.doneeInfoStateIsInvalid ||
        shippingDetailsState.doneeInfoOrgNameIsInvalid
      ) {
        valid = false;
      }
    }
    return valid;
  }

  const onSave = () => {
    if (validateDoneeInfo()) {
      const { addToast } = props.actions;
      let data: NuoUser = toJson();
      let leaData: DoneeModal = toDoneeJson();
      if (shippingDetailsState.doneeInfoUserDetailsDisabled) {
        propertyApiService
          .saveCartRequestLeaInfo(leaData)
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
            });
            addToast({
              text: `Donee (LEA) Information successfully updated.`,
              type: "success",
              heading: "Success",
            });
            toggleDoneeInfoModal();
          })
          .catch((err) => {
            addToast({
              text: `Donee (LEA) Information failed to update.`,
              type: "error",
              heading: "Error",
            });
          });
      }

      if (!shippingDetailsState.doneeInfoUserDetailsDisabled) {
        userApiService
          .addLeaUser(data)
          .then((res) => {
            leaData.leaUserId = res.data.leaUserId;
            propertyApiService
              .saveCartRequestLeaInfo(leaData)
              .then((response) => {
                let shippingAddress = response.data?.leaShippingAddress;
                updateShippingDetailsState({
                  doneeInfoUserId: res.data,
                  doneeTileEmail: data.emailAddress,
                  doneeTileFirstName: data.firstName,
                  doneeTileLastName: data.lastName,
                  doneeTileMiddleName: data.middleName,
                  doneeTilePhoneNumber: formatPhone(data.phoneNumber),
                  doneeTileOrg: data.leaInformationDTO.doneeOrganizationName,
                  doneeTileTitle: data.leaInformationDTO.title,
                  doneeTilePhoneExt: formatExtension(data.phoneExt),
                  doneeShippingId: shippingAddress?.addressId,
                  doneeTileShippingAddressLine1: shippingAddress?.line1,
                  doneeTileShippingAddressLine2: shippingAddress?.line2,
                  doneeTileShippingAddressLine3: shippingAddress?.line3,
                  doneeTileShippingCity: shippingAddress?.city,
                  doneeTileShippingStateCode: shippingAddress?.stateCode,
                  doneeTileShippingZipcode: shippingAddress?.zip,
                  doneeTileShippingZipExt: shippingAddress?.zip2,
                });
                addToast({
                  text: `New Donee (LEA) Information successfully Added.`,
                  type: "success",
                  heading: "Success",
                });
                toggleDoneeInfoModal();
              })
              .catch((err) => {
                addToast({
                  text: `Donee (LEA) Information failed to Add.`,
                  type: "error",
                  heading: "Error",
                });
              });
          })
          .catch((err) => {});
      } else {
        updateShippingDetailsState({
          doneeTileEmail: data.emailAddress,
          doneeTileFirstName: data.firstName,
          doneeTileLastName: data.lastName,
          doneeTileMiddleName: data.middleName,
          doneeTilePhoneNumber: formatPhone(data.phoneNumber),
          doneeTileOrg: data.leaInformationDTO.doneeOrganizationName,
          doneeTileTitle: data.leaInformationDTO.title,
          doneeTilePhoneExt: formatExtension(data.phoneExt),
        });
      }
    }
  };

  function validateAoEmail(aoEmail) {
    userApiService
      .getApprovingOfficialByEmail(aoEmail)
      .then((resp) => {
        if (resp.status === 204) {
          updateShippingDetailsState({
            doneeInfoApprovalOfficerEmailValidationMessage:
              "User with email exists but does not have Approving Official permission",
            doneeInfoApprovalOfficerEmailIsInvalid: true,
          });
        } else if (resp.status === 200) {
          updateShippingDetailsState({
            doneeInfoApprovalOfficerFirstName: resp.data.firstName,
            doneeInfoApprovalOfficerMiddleName: resp.data.middleName
              ? resp.data.middleName
              : "",
            doneeInfoApprovalOfficerLastName: resp.data.lastName,
          });
        }
      })
      .catch((error) => {
        if (error.status === 400) {
          updateShippingDetailsState({
            doneeInfoApprovalOfficerEmailValidationMessage:
              "User with email does not exist",
            doneeInfoApprovalOfficerEmailIsInvalid: true,
          });
        }
      });
  }

  function getDoneeInfo(email) {
    const data = {
      params: {
        email: email,
      },
    };
    userApiService
      .getLeaUser(data)
      .then((res) => {
        if (res.data !== null && res.status === 200) {
          let aac = res.data?.primaryAac;
          if (shippingDetailsState.activityAddressCode !== aac) {
            updateShippingDetailsState({
              doneeInfoLeaDetailsDisabled: true,
              doneeInfoEmailIsInvalid: true,
              doneeInfoEmailIsValid: false,
              doneeInfoEmailValidationMessage:
                "LEA does not belong to the state",
              showDoneeAlert: false,
              doneeAlertMessage: "",
            });
          } else {
            let leaInfo = res.data?.leaInformationDTO;
            let approvingOfficial = res.data?.approvingOfficial;
            if (leaInfo) {
              updateShippingDetailsState({
                doneeInfoUserId: res.data?.leaUserId,
                doneeInfoEmail: email,
                doneeInfoFirstName: res.data?.firstName,
                doneeInfoMiddleName: res.data?.middleName,
                doneeInfoLastName: res.data?.lastName,
                doneeInfoPhone: res.data?.phoneNumber
                  ? formatPhone(res.data?.phoneNumber + "")
                  : "",
                doneeInfoPhoneExt: res.data?.phoneExt
                  ? formatExtension(res.data?.phoneExt + "")
                  : "",
                doneeInfoApprovalOfficerEmail: approvingOfficial.emailAddress,
                doneeInfoApprovalOfficerFirstName: approvingOfficial.firstName,
                doneeInfoApprovalOfficerMiddleName:
                  approvingOfficial.middleName,
                doneeInfoApprovalOfficerLastName: approvingOfficial.lastName,

                doneeInfoUserDetailsDisabled: true,
                doneeInfoOrgName: leaInfo?.doneeOrganizationName,
                doneeInfoTitle: leaInfo?.title,
                doneeInfoAddressId: leaInfo?.addressId,
                doneeInfoAddressLine1: leaInfo?.addressLine1,
                doneeInfoAddressLine2: leaInfo?.addressLine2,
                doneeInfoAddressLine3: leaInfo?.addressLine3,
                doneeInfoCity: leaInfo?.city,
                doneeInfoState: leaInfo?.stateCode,
                doneeInfoZipcode: leaInfo?.zip,
                doneeInfoZipExt: leaInfo?.zipExtension,
                doneeInfoLeaDetailsDisabled: true,
                doneeInfoEmailIsValid: true,
                showDoneeAlert: false,
                doneeAlertMessage: "",
              });
            }
          }
        } else if (res.status === 204) {
          updateShippingDetailsState({
            doneeInfoLeaDetailsDisabled: true,
            doneeInfoEmailIsInvalid: true,
            doneeInfoEmailIsValid: false,
            doneeInfoEmailValidationMessage: "User is not LEA",
            showDoneeAlert: false,
            doneeAlertMessage: "",
          });
        }
      })
      .catch((err) => {
        updateShippingDetailsState({
          doneeInfoEmailIsInvalid: false,
          doneeInfoEmailIsValid: true,
          doneeInfoEmailValidationMessage: "",
          showDoneeAlert: true,
          doneeAlertMessage:
            "LEA not found. To create a new LEA, enter the LEA and shipping information. If this is not a new LEA, please verify the email address or contact the GSA Firearms Manager for assistance",
        });
      });
  }

  return (
    <PPMSModal
      size={"lg"}
      body={
        <div className={"modal-adjustment"}>
          <div className="grid-row grid-gap-2">
            <div className="tablet:grid-col-6">
              <PPMSEmail
                email={shippingDetailsState.doneeInfoEmail}
                emailLabel={"Donee Email"}
                id={"donee-email"}
                required={true}
                disabled={false}
                maxLength={64}
                isInvalid={shippingDetailsState.doneeInfoEmailIsInvalid}
                validationMessage={
                  shippingDetailsState.doneeInfoEmailValidationMessage
                }
                updateEmail={(value, validation) => {
                  if (!validation.isInvalid) {
                    getDoneeInfo(value);
                  } else {
                    updateShippingDetailsState({
                      doneeInfoEmailIsInvalid: validation.isInvalid,
                      doneeInfoEmailIsValid: !validation.isInvalid,
                      doneeInfoEmailValidationMessage:
                        validation.validationError,
                    });
                  }
                }}
                onChangeEmail={(value) => {
                  resetDoneeInfoState();
                  updateShippingDetailsState({
                    doneeInfoEmail: value,
                    doneeInfoEmailIsValid: false,
                    doneeInfoEmailIsInvalid: false,
                    doneeInfoEmailValidationMessage: "",
                  });
                }}
              />
            </div>
            <div className="tablet:grid-col-12">
              <PPMSAlert
                isAlertSlim={true}
                id={"icn-verification-success-msg"}
                show={shippingDetailsState.showDoneeAlert}
                alertBody={shippingDetailsState.doneeAlertMessage}
                alertClassName={"email-verification-error"}
                alertVariant={"warning"}
                alertKey={"email-verification-error"}
              />
            </div>
          </div>
          <div className="grid-row grid-gap-2">
            <PPMSFirstNameLastName
              id={"donee-firstname-lastname"}
              required={true}
              maxLength={30}
              showMiddleName={true}
              disabled={shippingDetailsState.doneeInfoUserDetailsDisabled}
              firstName={shippingDetailsState.doneeInfoFirstName}
              isFirstNameInvalid={
                shippingDetailsState.doneeInfoFirstNameIsInvalid
              }
              validationFirstMessage={
                shippingDetailsState.doneeInfoFirstNameValidationMessage
              }
              middleName={shippingDetailsState.doneeInfoMiddleName}
              lastName={shippingDetailsState.doneeInfoLastName}
              isLastNameInvalid={
                shippingDetailsState.doneeInfoLastNameIsInvalid
              }
              validationLastMessage={
                shippingDetailsState.doneeInfoLastNameValidationMessage
              }
              maxMiddleLength={1}
              updateFirstName={(value) => {
                let isInvalid = isEmptyCheck(value);
                updateShippingDetailsState({
                  doneeInfoFirstNameIsInvalid: isInvalid,
                });
              }}
              updateLastName={(value) => {
                let isInvalid = isEmptyCheck(value);
                updateShippingDetailsState({
                  doneeInfoLastNameIsInvalid: isInvalid,
                });
              }}
              updateMiddleName={() => {}}
              onChangeMiddleName={(value) => {
                updateShippingDetailsState({
                  doneeInfoMiddleName: value,
                });
              }}
              onChangeFirstName={(value) => {
                updateShippingDetailsState({
                  doneeInfoFirstName: value,
                  doneeInfoFirstNameIsInvalid: false,
                });
              }}
              onChangeLastName={(value) => {
                updateShippingDetailsState({
                  doneeInfoLastName: value,
                  doneeInfoLastNameIsInvalid: false,
                });
              }}
            />
          </div>
          <div className="grid-row grid-gap-2">
            <PPMSPhoneNumber
              phone={shippingDetailsState.doneeInfoPhone}
              extension={shippingDetailsState.doneeInfoPhoneExt}
              showExtension={true}
              id={"Phone"}
              disabled={shippingDetailsState.doneeInfoUserDetailsDisabled}
              disabledExtension={
                shippingDetailsState.doneeInfoUserDetailsDisabled
              }
              updatePhoneExtension={(value) => {}}
              onChangePhoneExt={(value) => {
                updateShippingDetailsState({
                  doneeInfoPhoneExt: value,
                });
              }}
              updatePhoneNumber={(value, validation: any) => {
                updateShippingDetailsState({
                  doneeInfoPhoneIsInvalid: validation.isInvalid,
                  doneeInfoPhoneValidationMessage: validation.validationError,
                });
              }}
              onChangePhoneNumber={(value) => {
                updateShippingDetailsState({
                  doneeInfoPhone: value,
                  doneeInfoPhoneIsInvalid: false,
                  doneeInfoPhoneValidationMessage: "",
                });
              }}
              maxLength={16}
              isInvalid={shippingDetailsState.doneeInfoPhoneIsInvalid}
              validationMessage={
                shippingDetailsState.doneeInfoPhoneValidationMessage
              }
              maxLengthExtension={7}
              required={true}
            />
          </div>
          <div className="grid-row grid-gap-2">
            <div className="tablet:grid-col-8">
              <PPMSInput
                id={"doneeInfoOrgName"}
                name={"Organization Name"}
                label={"Organization Name"}
                isRequired={true}
                isDisabled={shippingDetailsState.doneeInfoLeaDetailsDisabled}
                inputType={"text"}
                value={shippingDetailsState.doneeInfoOrgName}
                onChange={(event) => {
                  updateShippingDetailsState({
                    doneeInfoOrgName: event.target.value,
                    doneeInfoOrgNameIsInvalid: false,
                  });
                }}
                onBlur={(event) => {
                  updateShippingDetailsState({
                    doneeInfoOrgNameIsInvalid: !event.target.validity.valid,
                  });
                }}
                validationMessage={
                  shippingDetailsState.doneeInfoOrgNameValidationMessage
                }
                maxLength={40}
                minLength={1}
                isInvalid={shippingDetailsState.doneeInfoOrgNameIsInvalid}
                isValid={!shippingDetailsState.doneeInfoOrgNameIsInvalid}
              />
            </div>
          </div>
          <div className="grid-row grid-gap-2">
            <div className="tablet:grid-col-8">
              <PPMSInput
                id={"doneeInfoTitle"}
                name={"Title"}
                label={"Title"}
                isRequired={false}
                isDisabled={shippingDetailsState.doneeInfoLeaDetailsDisabled}
                inputType={"text"}
                value={shippingDetailsState.doneeInfoTitle}
                onChange={(event) => {
                  updateShippingDetailsState({
                    doneeInfoTitle: event.target.value,
                    doneeInfoTitleIsInvalid: false,
                  });
                }}
                onBlur={(event) => {
                  updateShippingDetailsState({
                    doneeInfoTitleIsInvalid: !event.target.validity.valid,
                  });
                }}
                validationMessage={
                  shippingDetailsState.doneeInfoTitleValidationMessage
                }
                maxLength={40}
                minLength={1}
                isInvalid={shippingDetailsState.doneeInfoTitleIsInvalid}
                isValid={!shippingDetailsState.doneeInfoTitleIsInvalid}
              />
            </div>
          </div>

          <PPMSAddress
            id={"donee-address"}
            title={"Donee"}
            showAddressLine3={true}
            addressDisabaled={shippingDetailsState.doneeInfoLeaDetailsDisabled}
            address1={shippingDetailsState.doneeInfoAddressLine1}
            address1Required={true}
            address1IsInvalid={
              shippingDetailsState.doneeInfoAddressLine1IsInvalid
            }
            address1IsValid={
              !shippingDetailsState.doneeInfoAddressLine1IsInvalid
            }
            address1ValidationMessage={
              shippingDetailsState.doneeInfoAddressLine1ValidationMessage
            }
            onChangeAddress1={(value) => {
              updateShippingDetailsState({
                doneeInfoAddressLine1: value,
                // doneeInfoAddressLine1IsInvalid: false,
              });
            }}
            updateAddress1={(value: any, validation) => {
              updateShippingDetailsState({
                doneeInfoAddressLine1IsInvalid: validation.isInvalid,
              });
            }}
            address2={shippingDetailsState.doneeInfoAddressLine2}
            address2Required={false}
            address2IsInvalid={false}
            address2IsValid={true}
            updateAddress2={(value: any) => {
              updateShippingDetailsState({
                doneeInfoAddressLine2: value,
              });
            }}
            address3={shippingDetailsState.doneeInfoAddressLine3}
            address3Required={false}
            address3IsInvalid={false}
            address3IsValid={true}
            updateAddress3={(value: any) => {
              updateShippingDetailsState({
                doneeInfoAddressLine3: value,
                doneeInfoAddressLine3IsInvalid: false,
                doneeInfoAddressLine3ValidationMessage: "",
              });
            }}
            city={shippingDetailsState.doneeInfoCity}
            cityRequired={true}
            cityIsInvalid={shippingDetailsState.doneeInfoCityIsInvalid}
            cityIsValid={!shippingDetailsState.doneeInfoCityIsInvalid}
            cityValidationMessage={
              shippingDetailsState.doneeInfoCityValidationMessage
            }
            onChangeCity={(value) => {
              updateShippingDetailsState({
                doneeInfoCity: value,
                doneeInfoCityIsInvalid: false,
                doneeInfoCityValidationMessage: "",
              });
            }}
            updateCity={(value: any, validation) => {
              updateShippingDetailsState({
                doneeInfoCityIsInvalid: validation.isInvalid,
                doneeInfoCityValidationMessage: validation.validationError,
              });
            }}
            state={shippingDetailsState.doneeInfoState}
            stateRequired={true}
            stateIsInvalid={shippingDetailsState.doneeInfoStateIsInvalid}
            stateIsValid={!shippingDetailsState.doneeInfoStateIsInvalid}
            stateDisabled={true}
            updateState={(value: any, validation: any) => {
              updateShippingDetailsState({
                doneeInfoState: value,
              });
            }}
            zip={shippingDetailsState.doneeInfoZipcode}
            zipRequired={true}
            zipIsInvalid={shippingDetailsState.doneeInfoZipcodeIsInvalid}
            zipIsValid={!shippingDetailsState.doneeInfoZipcodeIsInvalid}
            zipValidationMessage={
              shippingDetailsState.doneeInfoZipcodeValidationMessage
            }
            showZipExtension={true}
            onChangeZip={(value) => {
              updateShippingDetailsState({
                doneeInfoZipcode: value,
                doneeInfoZipcodeIsInvalid: false,
                doneeInfoZipcodeValidationMessage: "",
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
                doneeInfoZipcodeIsInvalid: inValid,
                doneeInfoZipcodeValidationMessage: validationError,
                doneeInfodisabledZipExtension: disabledZipExtension,
              });
            }}
            validationExtensionMessage={
              shippingDetailsState.doneeInfoZipExtValidationMessage
            }
            zip2={shippingDetailsState.doneeInfoZipExt}
            zip2IsInvalid={shippingDetailsState.doneeInfoZipExtIsInvalid}
            zip2IsValid={!shippingDetailsState.doneeInfoZipExtIsInvalid}
            disabledZipExtension={
              shippingDetailsState.doneeInfodisabledZipExtension
            }
            onChangeZipExtension={(value) => {
              updateShippingDetailsState({
                doneeInfoZipExt: value,
              });
            }}
          />
          <div className="grid-row grid-gap-2">
            <div className="tablet:grid-col-6">
              <PPMSEmail
                email={shippingDetailsState.doneeInfoApprovalOfficerEmail}
                emailLabel={"Approving Official Email"}
                id={"ao-email"}
                required={true}
                disabled={shippingDetailsState.doneeInfoUserDetailsDisabled}
                maxLength={64}
                isValid={
                  !shippingDetailsState.doneeInfoApprovalOfficerEmailIsInvalid
                }
                isInvalid={
                  shippingDetailsState.doneeInfoApprovalOfficerEmailIsInvalid
                }
                validationMessage={
                  shippingDetailsState.doneeInfoApprovalOfficerEmailValidationMessage
                }
                updateEmail={(value, validation) => {
                  if (validation.isInvalid) {
                    updateShippingDetailsState({
                      doneeInfoApprovalOfficerEmailIsInvalid:
                        validation.isInvalid,
                      doneeInfoApprovalOfficerEmailValidationMessage:
                        validation.validationError,
                    });
                  } else {
                    validateAoEmail(value);
                  }
                }}
                onChangeEmail={(value) => {
                  updateShippingDetailsState({
                    doneeInfoApprovalOfficerEmail: value,
                    doneeInfoApprovalOfficerEmailIsInvalid: false,
                    doneeInfoApprovalOfficerEmailValidationMessage: "",
                  });
                }}
              />
            </div>
          </div>
          <div className="grid-row grid-gap-2">
            <PPMSFirstNameLastName
              id={"donee-ao-firstname-lastname"}
              required={true}
              maxLength={30}
              showMiddleName={true}
              disabled={true}
              firstName={shippingDetailsState.doneeInfoApprovalOfficerFirstName}
              isFirstNameInvalid={false}
              validationFirstMessage={""}
              middleName={
                shippingDetailsState.doneeInfoApprovalOfficerMiddleName
              }
              lastName={shippingDetailsState.doneeInfoApprovalOfficerLastName}
              isLastNameInvalid={false}
              validationLastMessage={""}
              maxMiddleLength={100}
              updateFirstName={() => {}}
              updateLastName={() => {}}
              updateMiddleName={() => {}}
              onChangeMiddleName={() => {}}
              onChangeFirstName={() => {}}
              onChangeLastName={() => {}}
            />
          </div>
        </div>
      }
      id={"donee-info-update"}
      show={showDoneeInfoModal}
      handleClose={resetState}
      handleSave={onSave}
      title={"Donee (LEA) Information"}
      label={"Save"}
      labelCancel={"Cancel"}
      disableSave={!shippingDetailsState.doneeInfoEmailIsValid}
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
)(EditDoneeInformation);
