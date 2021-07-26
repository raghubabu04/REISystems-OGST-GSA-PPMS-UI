import React, { useContext, useEffect, useMemo } from "react";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PropertyContext } from "../../../property/create-update-property/PropertyContext";
import { PPMSFirstNameLastName } from "../../../../ui-kit/components/PPMS-firstname-lastname";
import {
  validateTitle,
  Validation,
} from "../../../property/create-update-property/validations/propertyFieldValidations";
import { PPMSCountry } from "../../../../ui-kit/components/PPMS-country";
import { isFormSubmitted } from "../../../../service/validation.service";
export interface DonorInformationProps {}
export function DonorInformation(props: DonorInformationProps) {
  const { donorInfoState, updateDonorInfoState } = useContext(PropertyContext);

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
  }, [donorInfoState]);

  function handleOnChangeTitle(value: any) {
    updateDonorInfoState({
      title: value,
      titleMsg: "",
      titleInvalid: false,
    });
  }

  function handleTitle(value: any) {
    let validations = validateTitle(value, "Donor");
    updateDonorInfoState({
      title: value,
      titleInvalid: validations.isInvalid,
      titleMsg: validations.validationError,
    });
  }

  function handleNameUpdate(value: any, name: string) {
    let isInValid: any;
    let validationMsg: any;
    if (name === "First Name") {
      isInValid = donorInfoState.firstNameInvalid;
      validationMsg = donorInfoState.firstMessage;
    } else {
      isInValid = donorInfoState.lastNameInvalid;
      validationMsg = donorInfoState.lastNameInvalid;
    }

    if (null == value || value.length === 0) {
      isInValid = true;
      validationMsg = "Donor " + name + " is required";
    } else {
      isInValid = false;
      validationMsg = "";
    }
    if (name === "First Name") {
      updateDonorInfoState({
        donorFirstName: value,
        firstNameInvalid: isInValid,
        firstMessage: validationMsg,
      });
    } else {
      updateDonorInfoState({
        donorLastName: value,
        lastNameInvalid: isInValid,
        lastMessage: validationMsg,
      });
    }
  }

  function handleValidateCountry(value: string, validation: Validation) {
    updateDonorInfoState({
      country: value,
      countryIsInvalid: validation.isInvalid,
    });
  }

  function validateForm() {
    handleTitle(donorInfoState.title);
    handleNameUpdate(donorInfoState.donorFirstName, "First Name");
    handleNameUpdate(donorInfoState.donorLastName, "Last Name");
  }

  return useMemo(() => {
    return (
      <>
        <div className={"grid-row grid-gap-4"}>
          <PPMSFirstNameLastName
            id={"donor-info-first-middle-last-name"}
            maxLength={30}
            disabled={false}
            required={true}
            firstName={donorInfoState.donorFirstName}
            onChangeFirstName={(value: any) =>
              updateDonorInfoState({
                firstMessage: "",
                firstNameInvalid: false,
                donorFirstName: value,
              })
            }
            updateFirstName={(value: any) => {
              handleNameUpdate(value, "First Name");
            }}
            validationFirstMessage={donorInfoState.firstMessage}
            isFirstNameInvalid={donorInfoState.firstNameInvalid}
            lastName={donorInfoState.donorLastName}
            onChangeLastName={(value: any) => {
              updateDonorInfoState({
                lastMessage: "",
                lastNameInvalid: false,
                donorLastName: value,
              });
            }}
            updateLastName={(value: any) => {
              handleNameUpdate(value, "Last Name");
            }}
            validationLastMessage={donorInfoState.lastMessage}
            isLastNameInvalid={donorInfoState.lastNameInvalid}
          />
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-8"}>
            <PPMSInput
              id={"donor-title"}
              name={"title"}
              label={"Title"}
              isRequired={true}
              isDisabled={false}
              inputType={"text"}
              value={donorInfoState.title}
              onChange={(event) => handleOnChangeTitle(event.target.value)}
              onBlur={(event) => handleTitle(event.target.value)}
              validationMessage={donorInfoState.titleMsg}
              maxLength={64}
              minLength={1}
              isInvalid={donorInfoState.titleInvalid}
              isValid={!donorInfoState.titleInvalid}
            />
          </div>
        </div>
        <div className={"tablet:grid-col-5"}>
          <PPMSCountry
            id={"donor-country"}
            label={"Country"}
            required={true}
            selectedCountry={donorInfoState.country}
            isInvalid={donorInfoState.countryIsInvalid}
            updateLocationCountry={(value: string, validation: Validation) =>
              handleValidateCountry(value, validation)
            }
          />
        </div>
      </>
    );
  }, [donorInfoState]);
}
