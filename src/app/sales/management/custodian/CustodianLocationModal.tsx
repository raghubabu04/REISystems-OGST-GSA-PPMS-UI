import React, { useContext, useState } from "react";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSTextArea } from "../../../../ui-kit/components/common/input/PPMS-textarea";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import {
  PPMSToggleCheckbox,
  PPMSToggleRadio,
} from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSEmail } from "../../../../ui-kit/components/PPMS-email";
import { PPMSPhoneNumber } from "../../../../ui-kit/components/PPMS-phone-number";
import { PPMSState } from "../../../../ui-kit/components/PPMS-state";
import {
  formatPhone,
  nullToStringUtil,
  formatExtension,
} from "../../../../ui-kit/utilities/FormatUtil";
import { CustodianLocationContext } from "./CustodianLocationContext";
import {
  checkEmail,
  validateFormattedPhoneNumber,
  zipValidation,
  zipExtensionValidation,
  validateZipStateCity,
} from "../../../../ui-kit/components/validations/FieldValidations";
import { UserApiService } from "../../../../api-kit/user/user-api.service";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { selectAllOption } from "./Constants";
import { isEmpty } from "lodash";
import { UserUtils } from "../../../../utils/UserUtils";
import { getSalesUserZones } from "../../../../_redux/_helpers/auth-header";
import { getZones } from "../../../../_redux/_helpers/roles";

interface CustodianLocationModalProps {
  showModal?: boolean;
  handleClose?: any;
  handleSave?: any;
  custodianState?: any;
  getEmptyFieldValues?: any;
  addToast?: any;
  editCustodian?: boolean;
}
const CustodianLocationModal = (props: CustodianLocationModalProps) => {
  const { custodianLocationState, updateCustodianLocationState } = useContext(
    CustodianLocationContext
  );
  let userService = new UserApiService();
  let salesService = new SalesApiService();
  let commonApiService = new CommonApiService();

  const handleLotSelection = React.useCallback(async (values: any) => {
    let state = custodianLocationState;
    values
      .filter((item) => item.isSelected === true)
      .map((lot) => {
        var check = state.other.lotsList.includes(lot.lotId);
        if (check === false) {
          state.other.lotsList.push(lot.lotId);
        }
      });
    values
      .filter((item) => item.isSelected === false)
      .map((lot) => {
        var check = state.other.lotsList.includes(lot.lotId);
        if (check === true) {
          var index = state.other.lotsList.indexOf(lot.lotId);
          state.other.lotsList.splice(index, 1);
        }
      });
    updateCustodianLocationState(state);
    let isLotUpdated =
      state.other.lotsList.length == state.other.editLots &&
      state.other.lotsList.every(
        (item) => state.other.editLots.indexOf(parseInt(item)) > -1
      );
    if (!isEmpty(custodianLocationState.other.lotsList)) {
      const details = { ...custodianLocationState };
      await salesService
        .getICNCustodianLocation(custodianLocationState.other.lotsList[0])
        .then((response) => {
          let custodianData =
            response.data?.propertyResultMap?.propertyCustodian;
          let locationData = response.data?.propertyResultMap?.propertyLocation;
          details.data.custodian.lotIds = custodianLocationState.other.lotsList;
          details.data.custodian.custodianInformation.ccEmail =
            custodianData?.ccEmail;
          details.data.custodian.custodianInformation.email =
            custodianData?.email;
          details.data.custodian.custodianInformation.firstName =
            custodianData?.firstName;
          details.data.custodian.custodianInformation.lastName =
            custodianData?.lastName;
          details.data.custodian.custodianInformation.phone =
            custodianData?.phone;
          details.data.custodian.custodianInformation.phoneExtension =
            custodianData?.phoneExtension;

          details.data.custodian.custodianInformation.addressDTO.addressLine1 = locationData?.line1
            ? locationData?.line1
            : locationData?.addressLine1;
          details.data.custodian.custodianInformation.addressDTO.addressLine2 = locationData?.line1
            ? locationData?.line2
            : locationData?.addressLine2;
          details.data.custodian.custodianInformation.addressDTO.addressLine3 = locationData?.line1
            ? locationData?.line3
            : locationData?.addressLine3;
          details.data.custodian.custodianInformation.addressDTO.city =
            locationData?.city;
          details.data.custodian.custodianInformation.addressDTO.state = locationData?.stateCode
            ? locationData?.stateCode
            : locationData?.state;
          details.data.custodian.custodianInformation.addressDTO.zipCode = locationData?.zip
            ? locationData?.zip
            : locationData?.zipCode;
          details.data.custodian.custodianInformation.addressDTO.zipExtn = locationData?.zip2
            ? locationData?.zip2
            : locationData?.zipExt;
          details.data.custodian.custodianInformation.contactId =
            response.data?.propertyResultMap?.propertyGroup === "foreignGift" &&
            custodianData?.contactId
              ? custodianData?.contactId
              : null;
          const disabled: boolean =
            UserUtils.isUserSCO() &&
            response.data?.propertyResultMap?.propertyGroup === "foreignGift";

          details.other.custodianDisabledOnly = disabled;
          details.other.locationDisableOnly = disabled;
          details.validation.userCCEmailDisable = disabled;
          details.validation.userEmailDisable = disabled;
          let bureau = response.data?.propertyResultMap?.agencyBureau;
          let filteredAgency = details.other.agencyBureaus.filter(
            (item) => item.id === bureau
          );
          details.data.custodian.custodianInformation.agencyBureauCd = filteredAgency[0]?.agencyBureau?.substr(
            0,
            4
          );
          details.validation.saveBtnDisabled = false;
          details.data.custodian.updateAssignedLots = !isLotUpdated;
          if (
            details.other.lotsList.length === details.other.lotOptions.length
          ) {
            details.validation.assignBtnDisabled = true;
          } else {
            details.validation.assignBtnDisabled = false;
          }
          if (
            details.other.lotsList.length !== details.other.lotOptions.length
          ) {
            selectAllOption[0].isSelected = false;
          }
        });
      updateCustodianLocationState(details);
    } else {
      props.getEmptyFieldValues();
    }
  }, []);

  const handleSelectAll = (value) => {
    let state = custodianLocationState;
    let list = [];
    list = value.filter((item) => item.isSelected === true);
    if (list.length === 1) {
      state.other.lotOptions.map((item) => {
        item.isSelected = true;
      });
      state.validation.saveBtnDisabled = false;
    } else {
      state.other.lotOptions.map((item) => {
        item.isSelected = false;
      });
      state.validation.assignBtnDisabled = false;
    }
    updateCustodianLocationState(state);
    if (list.length === 1) {
      handleLotSelection(custodianLocationState.other.lotOptions);
    } else {
      props.getEmptyFieldValues();
    }
  };

  const handleAgencyBureau = (event) => {
    let id = event.target.options[event.target.selectedIndex].id;
    let state = custodianLocationState;
    state.data.custodian.custodianInformation.agencyBureauCd = id;
    state.validation.agencyBureauIsInvalid = false;
    updateCustodianLocationState(state);
  };

  const handleFranconiaAsset = (event) => {
    let details = custodianLocationState;
    let selected = event.find((value) => value.isSelected === true);
    const franconiaAsset: boolean = selected["id"] === "Y";
    details.data.custodian.franconiaAsset = franconiaAsset;
    updateCustodianLocationState(details);
  };
  const handleEmailChange = (event) => {
    let details = custodianLocationState;
    details.data.custodian.custodianInformation.email = event.target.value;
    details.validation.userEmailIsInvalid = false;
    updateCustodianLocationState(details);
    let validation = {
      isInvalid: details.validation.userEmailIsInvalid,
      validationError: details.validation.userEmailValidationMessage,
    };
    if (
      checkEmail(
        custodianLocationState.data.custodian.custodianInformation.email
      )
    ) {
      handleEmailChangeCall(
        custodianLocationState.data.custodian.custodianInformation.email,
        validation
      );
    } else {
      details.validation.userEmailIsInvalid = true;
      details.validation.userEmailValidationMessage = "Email is Invalid";
      updateCustodianLocationState(details);
    }
  };
  const handleEmailChangeCall = React.useCallback(
    async (value: any, validation: any) => {
      const details = { ...custodianLocationState };
      details.validation.userEmailIsValid =
        validation === undefined ? false : !validation?.isInvalid;
      details.validation.userEmailIsInvalid =
        validation === undefined ? false : validation?.isInvalid;
      details.validation.userEmailValidationMessage =
        validation === undefined
          ? "Email is Required."
          : validation?.validationError;
      if (validation !== undefined && !validation?.isInvalid) {
        let state = custodianLocationState;
        state.data.custodian.custodianInformation.email = value;
        await userService
          .getUserDetailsByEmail(value)
          .then((response) => {
            details.data.custodian.custodianInformation.firstName =
              response.data.firstName;
            details.data.custodian.custodianInformation.lastName =
              response.data.lastName;
            details.data.custodian.custodianInformation.ccEmail =
              response.data?.ccEmail;
            details.data.custodian.custodianInformation.phone = response.data
              .phoneNumber
              ? response.data.phoneNumber
              : "";
            details.data.custodian.custodianInformation.phoneExtension = response
              .data.phoneExtn
              ? response.data.phoneExtn
              : "";
            let bureau = response.data?.agencyBureauCd;
            let filteredAgency = details.other.agencyBureaus.filter(
              (item) => item.id === bureau
            );
            details.data.custodian.custodianInformation.agencyBureauCd = filteredAgency[0].agencyBureau.substr(
              0,
              4
            );
            details.validation.userEmailIsValid = true;
            details.validation.userFirstNameIsInvalid = false;
            details.validation.userFirstNameValidationMessage = "";
            details.validation.userPhoneIsInvalid = false;
            details.validation.userPhoneValidationMessage = "";
            details.validation.userCCEmailDisable = false;
          })
          .catch((error) => {
            details.data.custodian.custodianInformation.firstName = "";
            details.data.custodian.custodianInformation.lastName = "";
            details.data.custodian.custodianInformation.phone = "";
            details.data.custodian.custodianInformation.phoneExtension = "";
            details.data.custodian.custodianInformation.agencyBureauCd = "";
            details.validation.userEmailIsValid = true;
            details.validation.userEmailIsInvalid = false;
            details.other.custodianDisabledOnly = false;
            details.other.locationDisableOnly = false;
            details.validation.userCCEmailDisable = false;
            details.other.emailNew = true;
          });
      }
      updateCustodianLocationState(details);
    },
    []
  );

  const handleCCEmailChange = (value: any, validation: any) => {
    const details = { ...custodianLocationState };
    details.validation.userCCEmailIsValid =
      validation === undefined ? false : !validation?.isInvalid;
    details.validation.userCCEmailIsInvalid =
      validation === undefined ? false : validation?.isInvalid;
    details.validation.userCCEmailValidationMessage =
      validation === undefined ? "" : validation?.validationError;
    updateCustodianLocationState(details);
  };

  const handlePhoneUpdate = (value, validation, field) => {
    const details = { ...custodianLocationState };
    switch (field) {
      case "phone":
        details.validation.userPhoneIsInvalid = validation?.isInvalid;
        details.validation.userPhoneValidationMessage =
          validation?.validationError;
        break;
      case "extension":
        details.validation.userPhoneExtnIsInvalid = validation?.isInvalid;
        details.validation.userPhoneExtnValidationMessage =
          validation?.validationError;
        break;
      default:
        break;
    }
    updateCustodianLocationState(details);
  };

  const handleValueChange = (event, field) => {
    const details = { ...custodianLocationState };
    let value;
    let validation;
    if (
      field === "phone" ||
      field === "phoneExt" ||
      field === "email" ||
      field === "ccEmail" ||
      field === "state"
    ) {
      value = event;
    } else {
      value = event.target.value;
    }
    switch (field) {
      case "firstName":
        details.data.custodian.custodianInformation.firstName = value;
        if (value.length === 0) {
          details.validation.userFirstNameIsInvalid = true;
          details.validation.userFirstNameValidationMessage =
            "First Name is Required";
        } else {
          details.validation.userFirstNameIsInvalid = false;
        }
        break;
      case "lastName":
        details.data.custodian.custodianInformation.lastName = value;
        if (value.length === 0) {
          details.validation.userLastNameIsInvalid = true;
          details.validation.userLastNameValidationMessage =
            "Last Name is Required";
        } else {
          details.validation.userLastNameIsInvalid = false;
        }
        break;
      case "ccEmail":
        details.data.custodian.custodianInformation.ccEmail = value;
        details.validation.userCCEmailIsInvalid = false;
        break;
      case "email":
        details.data.custodian.custodianInformation.email = value;
        details.validation.userEmailIsInvalid = false;
        break;
      case "phone":
        validation = validateFormattedPhoneNumber(value);
        if (validation?.isInvalid) {
          details.validation.userPhoneIsInvalid = validation?.isInvalid;
          details.validation.userPhoneValidationMessage =
            validation?.validationError;
        } else {
          details.validation.userPhoneIsInvalid = false;
          details.validation.userPhoneValidationMessage = "";
        }
        details.data.custodian.custodianInformation.phone = value
          .replace(/[^0-9]/g, "")
          .substring(0, 10);
        break;
      case "phoneExt":
        details.data.custodian.custodianInformation.phoneExtension = value;
        details.validation.userPhoneExtnIsInvalid = false;
        details.validation.userPhoneExtnValidationMessage = "";
        break;
      case "notes":
        details.data.custodian.notes = value;
        break;
      case "state":
        details.data.custodian.custodianInformation.addressDTO.state = value;
        if (
          details.data.custodian.custodianInformation.addressDTO.state === ""
        ) {
          details.validation.stateisInvalid = true;
        } else {
          details.validation.stateisInvalid = false;
        }
        break;
      case "city":
        details.data.custodian.custodianInformation.addressDTO.city = value;
        if (
          details.data.custodian.custodianInformation.addressDTO.city === ""
        ) {
          details.validation.cityisInvalid = true;
          details.validation.cityValidationMessage = "City is required";
        } else {
          details.validation.cityisInvalid = false;
        }
        break;
      case "addressLine1":
        details.data.custodian.custodianInformation.addressDTO.addressLine1 = value;
        if (
          details.data.custodian.custodianInformation.addressDTO
            .addressLine1 === ""
        ) {
          details.validation.addressLine1isInvalid = true;
          details.validation.addressLine1ValidationMessage =
            "Address line 1 is required";
        } else {
          details.validation.addressLine1isInvalid = false;
        }
        break;
      case "addressLine2":
        details.data.custodian.custodianInformation.addressDTO.addressLine2 = value;
        break;
      case "addressLine3":
        details.data.custodian.custodianInformation.addressDTO.addressLine3 = value;
        break;
      case "zipCode":
        details.data.custodian.custodianInformation.addressDTO.zipCode = value;
        let validateZip = zipValidation(value, true);
        if (validateZip.isInvalid) {
          details.validation.zipcodeisInvalid = true;
          details.validation.zipcodeValidationMessage =
            validateZip.validationError;
        } else {
          details.validation.zipcodeisInvalid = false;
          details.validation.zipcodeValidationMessage = "";
          const cityToVerify =
            details.data.custodian.custodianInformation.addressDTO.city;
          const stateToVerify =
            details.data.custodian.custodianInformation.addressDTO.state;
          if (cityToVerify && stateToVerify) {
            commonApiService
              .getZipCode(value)
              .then((response: any) => {
                let zipCityStateValidation = validateZipStateCity(
                  response.data,
                  cityToVerify,
                  stateToVerify
                );

                if (zipCityStateValidation !== "") {
                  details.validation.zipcodeisInvalid = true;
                  details.validation.zipcodeisValid = false;
                  details.validation.zipcodeValidationMessage = zipCityStateValidation;
                } else {
                  details.validation.zipcodeisInvalid = false;
                  details.validation.zipcodeValidationMessage = "";
                }
                updateCustodianLocationState(details);
              })
              .catch((error) => {
                console.log(error);
                return error;
              });
          } else {
            details.validation.zipcodeisInvalid = false;
            details.validation.zipcodeValidationMessage = "";
          }
        }
        break;
      case "zipExtn":
        details.data.custodian.custodianInformation.addressDTO.zipExtn = value;
        let validateZipExtn = zipExtensionValidation(value);
        if (validateZipExtn.isInvalid) {
          details.validation.zipcodeExtensionisInvalid = true;
          details.validation.zipcodeExtensionValidationMessage =
            validateZipExtn.validationError;
        } else {
          details.validation.zipcodeExtensionisInvalid = false;
        }

        break;
      default:
        break;
    }
    updateCustodianLocationState(details);
  };
  return (
    <PPMSModal
      show={props.showModal}
      handleClose={() => {
        props.handleClose();
      }}
      handleSave={() => {
        let type = props.editCustodian ? "update" : "save";
        props.handleSave(true, type);
      }}
      title={`${props.editCustodian ? "Update" : "Add"} Custodian/Location`}
      centered={true}
      backdrop={"static"}
      hideLabel
      hideLabelCancel
      body={
        <>
          <div className={"grid-row"}>
            <CustodianLocationContent
              custodianState={custodianLocationState}
              handleAgencyBureau={handleAgencyBureau}
              handleLotSelection={handleLotSelection}
              handleEmailChange={handleEmailChange}
              handleFranconiaAsset={handleFranconiaAsset}
              handleValueChange={handleValueChange}
              handleSelectAll={handleSelectAll}
              handleCCEmailChange={handleCCEmailChange}
              handlePhoneUpdate={handlePhoneUpdate}
              editCustodian={props.editCustodian}
              franconiaOptions={custodianLocationState.franconiaOptions}
            />
          </div>
          <br />
          <div className={"grid-row"}>
            <div className={"desktop:grid-col-6"}>
              <PPMSButton
                id={"save-custodian-btn"}
                label={"Save"}
                onPress={() => {
                  let type = props.editCustodian ? "update" : "save";
                  props.handleSave(true, type);
                }}
                isDisabled={custodianLocationState.validation.saveBtnDisabled}
              />
            </div>
            {custodianLocationState.other.edit ? (
              <></>
            ) : (
              <div className={"desktop:grid-col-6"}>
                <PPMSButton
                  id={"assign-nextcustodian-btn"}
                  label={"Assign Next Available Lot(s)"}
                  onPress={() => {
                    let type = props.editCustodian ? "update" : "save";
                    props.handleSave(false, type);
                  }}
                  className={"float-right"}
                  isDisabled={
                    custodianLocationState.validation.assignBtnDisabled
                  }
                />
              </div>
            )}
          </div>
        </>
      }
      id={"custodian-modal"}
      size="xl"
    />
  );
};

const ALL_ZONES = [
  "Mid Atlantic Zone",
  "Southeast - Great Lakes Zone",
  "Southwest - Central Zone",
  "Pacific Rim Zone",
  "National Capital Zone",
  "Central Office/Headquarters",
];

const CustodianLocationContent = ({
  custodianState,
  handleAgencyBureau,
  handleLotSelection,
  handleEmailChange,
  handleValueChange,
  handleSelectAll,
  handleCCEmailChange,
  handleFranconiaAsset,
  handlePhoneUpdate,
  franconiaOptions,
  editCustodian,
}) => {
  return (
    <>
      <div className={"grid-row"}>
        <div className={"desktop:grid-col flex-align-self-stretch"}>
          <h3>{editCustodian ? "Assigned/" : ""}Unassigned Available Lots</h3>
          <div className={"grid-row"}>
            <div className={"desktop:grid-col"}>
              <div className={"grid-row"}>
                <PPMSToggleCheckbox
                  isRequired={false}
                  id={"lots-selection-custodian-all"}
                  options={selectAllOption}
                  isInline={true}
                  isDisabled={false}
                  name={"lots-selection-custodian-all"}
                  className={""}
                  label={""}
                  validationMessage={""}
                  isSingleSelect={false}
                  onChange={handleSelectAll}
                  isInvalid={false}
                />
              </div>
            </div>
          </div>
          <div className={"grid-row"}>
            <PPMSToggleCheckbox
              isRequired={false}
              id={"lots-selection-custodian"}
              options={
                custodianState.other?.lotOptions
                  ? custodianState.other?.lotOptions
                  : []
              }
              isInline={true}
              isDisabled={false}
              name={"lots-selection-custodian"}
              className={""}
              label={""}
              validationMessage={""}
              isSingleSelect={false}
              onChange={handleLotSelection}
            />
          </div>
          <div className={"grid-row"}>
            <div className={"desktop:grid-col-8"}>
              <PPMSTextArea
                id={"custodian-notes"}
                isRequired={false}
                isDisabled={false}
                inputType={"text"}
                label={"Notes"}
                onChange={(value) => {
                  handleValueChange(value, "notes");
                }}
                maxLength={500}
                isInvalid={false}
                isValid={true}
                value={custodianState.data?.custodian?.notes}
                className={"textarea-sales"}
              />
            </div>
          </div>
          {"5" == getSalesUserZones()[0] && (
            <div className={"grid-row"}>
              <PPMSToggleRadio
                isRequired={true}
                id={"franconia-asset"}
                label={"Franconia Asset"}
                options={franconiaOptions}
                isInline={true}
                isDisabled={false}
                name={"franconia-asset"}
                validationMessage={""}
                onChange={(event) => handleFranconiaAsset(event)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={"grid-row grid-gap-4"}>
        <CustodianLocationInformation
          custodianState={custodianState}
          handleAgencyBureau={handleAgencyBureau}
          handleEmailChange={handleEmailChange}
          handleValueChange={handleValueChange}
          handleCCEmailChange={handleCCEmailChange}
          handlePhoneUpdate={handlePhoneUpdate}
        />
      </div>
    </>
  );
};

const CustodianLocationInformation = ({
  custodianState,
  handleAgencyBureau,
  handleEmailChange,
  handleValueChange,
  handleCCEmailChange,
  handlePhoneUpdate,
}) => {
  return (
    <>
      <div className={"desktop:grid-col-6"}>
        <h3>Property Custodian</h3>
        <PPMSInput
          label={"Email Address"}
          id={`custodian--email-address`}
          inputType={"text"}
          name={`custodian--email-address`}
          maxLength={64}
          value={custodianState.data.custodian?.custodianInformation?.email}
          isDisabled={custodianState.validation?.userEmailDisable}
          isRequired={true}
          isValid={custodianState.validation?.userEmailIsValid}
          isInvalid={custodianState.validation?.userEmailIsInvalid}
          validationMessage={
            custodianState.validation?.userEmailValidationMessage
          }
          onChange={(event) => {
            handleEmailChange(event);
          }}
        />
        <div className={"grid-row grid-gap-2"}>
          <div className={"desktop:grid-col-6"}>
            <PPMSInput
              label={"First Name"}
              id={`custodian-firstName`}
              inputType={"text"}
              name={`custodian-firstName`}
              maxLength={30}
              value={
                custodianState.data.custodian?.custodianInformation?.firstName
              }
              isDisabled={custodianState.other?.custodianDisabledOnly}
              isRequired={true}
              isInvalid={custodianState.validation?.userFirstNameIsInvalid}
              validationMessage={
                custodianState.validation?.userFirstNameValidationMessage
              }
              onChange={(event) => {
                handleValueChange(event, "firstName");
              }}
            />
          </div>
          <div className={"desktop:grid-col-6"}>
            <PPMSInput
              value={
                custodianState.data.custodian?.custodianInformation?.lastName
              }
              label={"Last Name"}
              id={`custodian-lastName`}
              name={`custodian-lastName`}
              maxLength={30}
              inputType={"text"}
              isRequired={true}
              isDisabled={custodianState.other?.custodianDisabledOnly}
              isInvalid={custodianState.validation?.userLastNameIsInvalid}
              validationMessage={
                custodianState.validation?.userLastNameValidationMessage
              }
              onChange={(event) => {
                handleValueChange(event, "lastName");
              }}
            />
          </div>
        </div>
        <PPMSEmail
          email={custodianState.data?.custodian?.custodianInformation?.ccEmail}
          emailLabel={"CC Email Address"}
          id={"custodian-cc-email-address"}
          required={false}
          disabled={custodianState.validation?.userCCEmailDisable}
          maxLength={64}
          isValid={custodianState.validation?.userCCEmailIsValid}
          isInvalid={custodianState.validation?.userCCEmailIsInvalid}
          validationMessage={
            custodianState.validation?.userCCEmailValidationMessage
          }
          updateEmail={(value, validation) => {
            handleCCEmailChange(value, validation);
          }}
          onChangeEmail={(value) => {
            handleValueChange(value, "ccEmail");
          }}
        />
        <div className={"grid-row grid-gap-2"}>
          <PPMSPhoneNumber
            showExtension={true}
            phone={formatPhone(
              nullToStringUtil(
                custodianState?.data?.custodian?.custodianInformation?.phone
              ) + ""
            )}
            extension={formatExtension(
              nullToStringUtil(
                custodianState?.data?.custodian?.custodianInformation
                  ?.phoneExtension
              ) + ""
            )}
            id={`custodian-phone`}
            maxLength={16}
            maxLengthExtension={7}
            required={true}
            disabled={custodianState.other?.custodianDisabledOnly}
            disabledExtension={custodianState.other?.custodianDisabledOnly}
            isInvalid={custodianState.validation?.userPhoneIsInvalid}
            isExtensionInvalid={
              custodianState.validation?.userPhoneExtnIsInvalid
            }
            validationMessage={
              custodianState.validation?.userPhoneValidationMessage
            }
            extensionValidationMessage={
              custodianState.validation?.userPhoneExtnValidationMessage
            }
            onChangePhoneNumber={(event) => {
              handleValueChange(event, "phone");
            }}
            updatePhoneNumber={(value, validation) => {
              handlePhoneUpdate(value, validation, "phone");
            }}
            updatePhoneExtension={(value, validation) => {
              handlePhoneUpdate(value, validation, "extension");
            }}
            onChangePhoneExt={(event) => {
              handleValueChange(event, "extension");
            }}
          />
        </div>
        <PPMSSelect
          id={"agency-bureau"}
          identifierKey={"id"}
          identifierValue={"agencyBureau"}
          name={"sale-method"}
          values={custodianState.other?.agencyBureaus}
          label={"Agency"}
          isRequired={true}
          placeholderValue={"Select Agency Bureau"}
          selectedValue={
            custodianState.data?.custodian?.custodianInformation?.agencyBureauCd
          }
          onChange={handleAgencyBureau}
          isInvalid={custodianState.validation?.agencyBureauIsInvalid}
          isValid={custodianState.validation?.agencyBureauIsValid}
          validationMessage={
            custodianState.validation?.agencyBureauValidationMessage
          }
          disabled={custodianState.other?.custodianDisabledOnly}
        />
      </div>
      <div className={"desktop:grid-col-6"}>
        <h3>Property Location</h3>
        <PPMSInput
          label={"Address"}
          id={`custodian-addressLine1`}
          inputType={"text"}
          name={"Address Line 1"}
          maxLength={36}
          value={
            custodianState.data?.custodian?.custodianInformation?.addressDTO
              ?.addressLine1
          }
          isDisabled={custodianState.other?.locationDisableOnly}
          isInvalid={custodianState.validation?.addressLine1isInvalid}
          isValid={custodianState.validation?.addressLine1isValid}
          validationMessage={
            custodianState.validation?.addressLine1ValidationMessage
          }
          isRequired={true}
          onChange={(event) => {
            handleValueChange(event, "addressLine1");
          }}
        />
        <PPMSInput
          value={
            custodianState.data?.custodian?.custodianInformation?.addressDTO
              ?.addressLine2
          }
          name={"Address Line 2"}
          maxLength={36}
          id={`custodian-addressLine2`}
          inputType={"text"}
          isRequired={false}
          isDisabled={custodianState.other?.locationDisableOnly}
          onChange={(event) => {
            handleValueChange(event, "addressLine2");
          }}
        />
        <PPMSInput
          value={
            custodianState.data.custodian?.custodianInformation?.addressDTO
              .addressLine3
          }
          id={`custodian-addressLine3`}
          maxLength={36}
          inputType={"text"}
          isRequired={false}
          isDisabled={custodianState.other?.locationDisableOnly}
          onChange={(event) => {
            handleValueChange(event, "addressLine3");
          }}
        />
        <div className={"grid-row grid-gap-2"}>
          <div className={"desktop:grid-col-6"}>
            <PPMSInput
              value={
                custodianState.data?.custodian?.custodianInformation?.addressDTO
                  ?.city
              }
              label={"City"}
              id={`custodian-city`}
              maxLength={36}
              name={"City"}
              inputType={"text"}
              isRequired={true}
              isDisabled={custodianState.other?.locationDisableOnly}
              isInvalid={custodianState.validation?.cityisInvalid}
              isValid={custodianState.validation?.cityisValid}
              validationMessage={
                custodianState.validation?.cityValidationMessage
              }
              onChange={(event) => {
                handleValueChange(event, "city");
              }}
            />
          </div>
          <div className={"desktop:grid-col-6"}>
            <PPMSState
              id={`custodian-state`}
              label={"State"}
              required={true}
              selectedState={
                custodianState.data?.custodian?.custodianInformation?.addressDTO
                  ?.state
              }
              updateLocationState={(event) => {
                handleValueChange(event, "state");
              }}
              disabled={custodianState.other?.locationDisableOnly}
              isInvalid={custodianState.validation?.stateisInvalid}
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-2"}>
          <div className={"grid-col-3"}>
            <PPMSInput
              value={
                custodianState.data?.custodian?.custodianInformation?.addressDTO
                  ?.zipCode
              }
              className={"edit-shipping-zipcode"}
              label={"Zipcode"}
              name={"Zipcode"}
              id={`custodian-zipcode`}
              inputType={"text"}
              isRequired={true}
              maxLength={5}
              minLength={5}
              isDisabled={custodianState.other?.locationDisableOnly}
              isInvalid={custodianState.validation?.zipcodeisInvalid}
              isValid={custodianState.validation?.zipcodeisValid}
              validationMessage={
                custodianState.validation?.zipcodeValidationMessage
              }
              onChange={(event) => {
                handleValueChange(event, "zipCode");
              }}
            />
          </div>
          <div className={"grid-col-3"}>
            <PPMSInput
              value={
                custodianState.data?.custodian?.custodianInformation?.addressDTO
                  ?.zipExtn
              }
              className={"edit-shipping-zipcode"}
              label={"Zip Ext."}
              placeHolder={"ex: 3254"}
              name={"Zipcode"}
              id={`custodian-zipextn`}
              inputType={"text"}
              isRequired={false}
              maxLength={4}
              minLength={4}
              isDisabled={custodianState.other?.locationDisableOnly}
              isInvalid={custodianState.validation?.zipcodeExtensionisInvalid}
              isValid={custodianState.validation?.zipcodeExtensionisValid}
              validationMessage={
                custodianState.validation?.zipcodeExtensionValidationMessage
              }
              onChange={(event) => {
                handleValueChange(event, "zipExtn");
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustodianLocationModal;
