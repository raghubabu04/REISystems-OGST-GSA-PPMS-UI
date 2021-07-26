import React, { useContext, useEffect } from "react";
import { isFormSubmitted } from "../../../../service/validation.service";
import { PPMSFirstNameLastName } from "../../../../ui-kit/components/PPMS-firstname-lastname";
import { PPMSEmailConfirm } from "../../../../ui-kit/components/PPMS-email-confirm";
import { BidderContext } from "../BidderContext";
import { PPMSDatepicker } from "../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import {
  validateCompanyName,
  validateDateofBirth,
} from "../validations/BidderFieldValidations";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSssnConfirm } from "../../../../ui-kit/components/PPMS-ssn-confirm";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSeinConfirm } from "../../../../ui-kit/components/PPMS-ein-confirm";
import { PPMSCountry } from "../../../../ui-kit/components/PPMS-country";
import moment from "moment";

interface BidderPersonalInformationProps {
  disabled?: boolean;
}

export default function BidderPersonalInformation(
  props: BidderPersonalInformationProps
) {
  const {
    bidderPersonalInformationState,
    updateBidderPersonalInformationState,
    bidderLoginInformationState,
  } = useContext(BidderContext);

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validate();
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [bidderPersonalInformationState]);

  let showSSNField;
  if (
    (bidderPersonalInformationState.defaultUSACitizenToggle === "" &&
      bidderPersonalInformationState.country.toUpperCase() === "US") ||
    (bidderPersonalInformationState.defaultUSACitizenToggle !== "" &&
      bidderPersonalInformationState.country.toUpperCase() === "US") ||
    (bidderPersonalInformationState.defaultUSACitizenToggle !== "N" &&
      bidderPersonalInformationState.country.toUpperCase() !== "US")
  ) {
    showSSNField = (
      <>
        <div className="grid-row grid-gap-4">
          <PPMSssnConfirm
            id={"bidder-ssn"}
            ssn={bidderPersonalInformationState.ssn}
            updateSSN={(value: any) => {
              updateBidderPersonalInformationState({ ssn: value });
            }}
            registrationType={bidderLoginInformationState.regTypeToggle}
            confirmSSN={bidderPersonalInformationState.confirmSSN}
            updateConfirmSSN={(value: any) => {
              updateBidderPersonalInformationState({ confirmSSN: value });
            }}
            isRequired={
              bidderLoginInformationState.regTypeToggle.toUpperCase() ===
              "INDIVIDUAL"
            }
          />
        </div>
      </>
    );
  }
  /*
   * Showing EIN if company is selected from login information
   */
  let showEIN;
  if (
    bidderLoginInformationState.regTypeToggle.toLowerCase() === "company" &&
    ((bidderPersonalInformationState.defaultUSACitizenToggle === "" &&
      bidderPersonalInformationState.country.toUpperCase() === "US") ||
      (bidderPersonalInformationState.defaultUSACitizenToggle !== "" &&
        bidderPersonalInformationState.country.toUpperCase() === "US") ||
      (bidderPersonalInformationState.defaultUSACitizenToggle === "Y" &&
        bidderPersonalInformationState.country.toUpperCase() !== "US") ||
      (bidderPersonalInformationState.defaultUSACitizenToggle !== "N" &&
        bidderPersonalInformationState.country.toUpperCase() !== "US"))
  ) {
    showEIN = (
      <>
        <div className={"grid-row grid-gap-4"}>
          <PPMSeinConfirm
            id={"bidder-ein"}
            ein={bidderPersonalInformationState.ein}
            updateEIN={(value: any) => {
              updateBidderPersonalInformationState({ ein: value });
            }}
            confirmEIN={bidderPersonalInformationState.confirmEIN}
            updateConfirmEIN={(value: any) => {
              updateBidderPersonalInformationState({ confirmEIN: value });
            }}
            // isDisabled={bidderPersonalInformationState.usaCitizenToggle === false && bidderPersonalInformationState.country.toUpperCase() !== "US"}
          />
        </div>
      </>
    );
  }

  /*
   * Showing Company name if company is selected from login information
   */
  let showCompanyNameField;
  if (bidderLoginInformationState.regTypeToggle.toLowerCase() === "company") {
    showCompanyNameField = (
      <>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-12"}>
            <PPMSInput
              id={"company-name"}
              name={"company-name"}
              label={"Company Name"}
              isDisabled={props?.disabled}
              inputType={"text"}
              value={bidderPersonalInformationState.companyName}
              onBlur={(event) => handleCompanyNameChange(event.target)}
              onChange={(event) =>
                updateBidderPersonalInformationState({
                  companyName: event.target.value,
                })
              }
              maxLength={40}
              minLength={0}
              isRequired={bidderPersonalInformationState.companyNameIsRequired}
              isInvalid={bidderPersonalInformationState.companyNameIsInValid}
              validationMessage={
                bidderPersonalInformationState.companyNameValidationMsg
              }
            />
          </div>
        </div>
      </>
    );
  }

  /*
   * Showing DOB if individual is selected from login information
   */
  let showDOB;
  if (
    bidderLoginInformationState.regTypeToggle.toLowerCase() === "individual"
  ) {
    showDOB = (
      <>
        <div className={"grid-row grid-gap-4"}>
          <PPMSDatepicker
            id={"dateOfBirthDate"}
            format={"MM/DD/YYYY"}
            name={"dateOfBirthDate"}
            startDate={bidderPersonalInformationState.dateOfBirth}
            updateDate={(date) => handleDateOfBirthUpdate(date)}
            display={"bottom-end"}
            label={"Date of Birth"}
            placeholder={"Date of Birth"}
            maxDate={moment(new Date()).toDate()}
            isDisabled={props?.disabled}
            isRequired={bidderPersonalInformationState.dateOfBirthIsRequired}
            isInvalid={bidderPersonalInformationState.dateOfBirthIsInValid}
            validationMessage={bidderPersonalInformationState.dateOfBirthMsg}
          />
        </div>
      </>
    );
  }

  return (
    <React.Fragment>
      <div className={"grid-row grid-gap-4"}>
        <PPMSFirstNameLastName
          id={"bidder-user-information-firstname-lastname"}
          required={true}
          disabled={props?.disabled}
          maxLength={30}
          maxMiddleLength={1}
          showMiddleName={true}
          firstName={bidderPersonalInformationState.firstName}
          isFirstNameInvalid={bidderPersonalInformationState.isFirstNameInvalid}
          validationFirstMessage={
            bidderPersonalInformationState.firstNameInvalidErrorMessage
          }
          middleName={bidderPersonalInformationState.middleName}
          lastName={bidderPersonalInformationState.lastName}
          isLastNameInvalid={bidderPersonalInformationState.isLastNameInvalid}
          validationLastMessage={
            bidderPersonalInformationState.lastNameInvalidErrorMessage
          }
          updateFirstName={firstNameUpdated}
          updateLastName={lastNameUpdated}
          updateMiddleName={(value) =>
            updateBidderPersonalInformationState({ middleName: value })
          }
          onChangeFirstName={(value) =>
            updateBidderPersonalInformationState({ firstName: value })
          }
          onChangeLastName={(value) =>
            updateBidderPersonalInformationState({ lastName: value })
          }
          onChangeMiddleName={(value) =>
            updateBidderPersonalInformationState({ middleName: value })
          }
        />
      </div>
      {showCompanyNameField}
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-6"}>
          <PPMSEmailConfirm
            id={"bidder-user-email"}
            required={true}
            validateExistingUser={false}
            disabled={bidderPersonalInformationState.id !== null}
            email={bidderPersonalInformationState.emailAddress}
            isEmailInvalid={
              bidderPersonalInformationState.isEmailAddressInvalid
            }
            isEmailValid={!bidderPersonalInformationState.isEmailAddressValid}
            confirmEmail={bidderPersonalInformationState.confirmEmailAddress}
            confirmDisabled={bidderPersonalInformationState.confirmDisabled}
            isConfirmEmailInvalid={
              bidderPersonalInformationState.isConfirmEmailAddressInvalid
            }
            isConfirmEmailValid={
              !bidderPersonalInformationState.isConfirmEmailAddressValid
            }
            showEmailConfirm={!props?.disabled}
            updateEmail={emailAddressUpdated}
            updateConfirmEmail={confirmEmailAddressUpdated}
            emailValidationMessage={
              bidderPersonalInformationState.emailAddressInvalidErrorMessage
            }
            confirmEmailValidationMessage={
              bidderPersonalInformationState.confirmEmailAddressInvalidErrorMessage
            }
          />
        </div>
      </div>
      {showDOB}
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSToggleRadio
            id={"citizen-of-usa"}
            options={bidderPersonalInformationState.usaCitizenOptions}
            isInline={false}
            isDisabled={props?.disabled}
            name={"usaCitizen"}
            className={"usaCitizen"}
            label={"Are you a citizen of the United States of America?"}
            isSingleSelect={true}
            validationMessage={
              bidderPersonalInformationState.usaCitizenToggleValidationMessage
            }
            onChange={handleUSACitizenToggle}
            isRequired={true}
          />
        </div>
        <div className={"grid-col-6"}>
          <PPMSCountry
            id={"bidder-country-of-residence"}
            label={"Country of Residence"}
            required={true}
            disabled={bidderPersonalInformationState.isCountryDisabled}
            selectedCountry={
              bidderPersonalInformationState.country !== null
                ? bidderPersonalInformationState.country
                : "US"
            }
            isInvalid={bidderPersonalInformationState.countryIsInvalid}
            validationMessage={
              bidderPersonalInformationState.countryValidationMessage
            }
            updateLocationCountry={(value: any, validation: any) => {
              updateBidderPersonalInformationState({
                isConfirmLoginDisabled: false,
                country: value,
                countryIsInvalid: validation.isInvalid,
                countryValidationMessage: validation.validationMessage,
              });
              if (
                bidderPersonalInformationState.usaCitizenToggle === false &&
                bidderPersonalInformationState.country.toUpperCase() !== "US"
              ) {
                updateBidderPersonalInformationState({
                  ein: "",
                  confirmEIN: "",
                });
              }
            }}
          />
        </div>
      </div>
      {!props?.disabled && showSSNField}
      {!props?.disabled && showEIN}
    </React.Fragment>
  );

  function firstNameUpdated(value: string) {
    if (value && value.length > 0) {
      updateBidderPersonalInformationState({
        firstName: value,
        isFirstNameInvalid: false,
        firstNameInvalidErrorMessage: "",
      });
    } else {
      updateBidderPersonalInformationState({
        firstName: value,
        isFirstNameInvalid: true,
        firstNameInvalidErrorMessage: "First Name is Required",
      });
    }
  }

  function lastNameUpdated(value: string) {
    if (value && value.length > 0) {
      updateBidderPersonalInformationState({
        lastName: value,
        isLastNameInvalid: false,
        lastNameInvalidErrorMessage: "",
      });
    } else {
      updateBidderPersonalInformationState({
        lastName: value,
        isLastNameInvalid: true,
        lastNameInvalidErrorMessage: "Last Name is Required",
      });
    }
  }

  function handleCompanyNameChange({ value }) {
    let validation = validateCompanyName(
      value,
      bidderPersonalInformationState.companyNameIsRequired
    );
    updateBidderPersonalInformationState({
      companyName: value,
      companyNameIsInValid: validation.isInvalid,
      companyNameValueMsg: validation.validationError,
    });
  }

  function emailAddressUpdated(value: string, validation: any) {
    updateBidderPersonalInformationState({
      emailAddress: value,
      isEmailAddressInvalid: validation.isInvalid,
      emailAddressInvalidErrorMessage: validation.validationError,
      confirmDisabled: validation.confirmDisabled,
    });
  }

  function confirmEmailAddressUpdated(value: string, validation: any) {
    updateBidderPersonalInformationState({
      confirmEmailAddress: value,
      isConfirmEmailAddressInvalid: validation.isInvalid,
      confirmEmailAddressInvalidErrorMessage: validation.validationError,
    });
  }

  function handleDateOfBirthUpdate(date: any) {
    let validation = validateDateofBirth(
      date,
      bidderPersonalInformationState.dateOfBirthIsRequired
    );
    updateBidderPersonalInformationState({
      dateOfBirth: date,
      dateOfBirthIsInValid: validation.isInvalid,
      dateOfBirthIsValid: !validation.isInvalid,
      dateOfBirthMsg: validation.validationError,
    });
  }

  function handleUSACitizenToggle(event) {
    let selectedUSACitizenValue = "";
    let isUsCitizen = "";
    event.forEach((item) => {
      if (item.isSelected) {
        selectedUSACitizenValue = item.value;
        isUsCitizen = item.id;
      }
    });
    updateBidderPersonalInformationState({
      usaCitizenToggle: selectedUSACitizenValue === "Yes",
      defaultUSACitizenToggle: isUsCitizen,
    });
    // below changes is for clearing ssn field
    if (selectedUSACitizenValue === "No") {
      updateBidderPersonalInformationState({
        ssn: "",
        confirmSSN: "",
      });
    }
    if (
      selectedUSACitizenValue === "No" &&
      bidderPersonalInformationState.country.toUpperCase() !== "US"
    ) {
      updateBidderPersonalInformationState({
        ein: "",
        confirmEIN: "",
      });
    }
  }

  function validate() {
    firstNameUpdated(bidderPersonalInformationState.firstName);
    lastNameUpdated(bidderPersonalInformationState.lastName);
    handleDateOfBirthUpdate(bidderPersonalInformationState.dateOfBirth);
    let validation = validateCompanyName(
      bidderPersonalInformationState.companyName,
      bidderPersonalInformationState.companyNameIsRequired
    );
    updateBidderPersonalInformationState({
      companyNameIsInValid: validation.isInvalid,
      companyNameValueMsg: validation.validationError,
    });
    if (bidderPersonalInformationState.country?.length === 0) {
      updateBidderPersonalInformationState({
        isCountryInvalid: true,
        countryValidationMessage: "Country of Residence is Required",
      });
    }
  }
}
