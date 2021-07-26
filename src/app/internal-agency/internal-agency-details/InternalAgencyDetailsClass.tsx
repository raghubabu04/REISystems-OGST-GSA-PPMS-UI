import React, { useContext, useEffect, useMemo } from "react";
import { InternalAgencyContext } from "../InternalAgencyContext";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import {
  validateAbbreviatedAgency,
  validateInternalAgencyCode,
} from "../validations/InternalAgencyFieldValidations";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { UserApiService } from "../../../api-kit/user/user-api.service";
import { UserUtils } from "../../../utils/UserUtils";
import { isFormSubmitted } from "../../../service/validation.service";

interface InternalAgencyProps {
  editValidation: boolean;
}

function InternalAgencyDetailsClass(props: InternalAgencyProps) {
  //set state for this functional componnet
  const {
    internalAgencyDetailsState,
    updateInternalAgencyDetailsState,
  } = useContext(InternalAgencyContext);
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
  }, [internalAgencyDetailsState]);
  let commonApiService = new CommonApiService();
  let userApiService = new UserApiService();

  function validateForm() {
    if (props.editValidation) {
      handleInternalAgencyCode({
        value: internalAgencyDetailsState.internalAgencyCode,
      });
      handleInternalAbbreviatedAgency({
        value: internalAgencyDetailsState.internalAbbreviatedAgency,
      });
    }
  }
  function handleInternalAgencyCode({ value }) {
    let agencyCode = value;
    let validation = validateInternalAgencyCode(value);
    let nuoAgencyCodeCheck = false;
    if (!validation.isInvalid) {
      if (UserUtils.isUserNuo()) {
        userApiService.getAgencyBureauCodesForNUO().then((code) => {
          let agencyBureauCode = code.data.map((item) => {
            return item.substring(0, 2);
          });
          if (agencyCode?.trim()?.length === 2) {
            if (!agencyBureauCode?.includes(agencyCode)) {
              nuoAgencyCodeCheck = true;
              updateInternalAgencyDetailsState({
                internalAgencyName: "",
                internalAgencyCodeValidationMessage:
                  "Please enter the correct agency code",
                internalAgencyCodeIsInvalid: true,
              });
            }
          }

          if (!nuoAgencyCodeCheck) {
            validateIfAgencyExists(agencyCode, validation);
          }
        });
      } else {
        validateIfAgencyExists(agencyCode, validation);
      }
    }
    updateInternalAgencyDetailsState({
      internalAgencyName: "",
      internalAgencyCode: value,
      internalAgencyCodeValidationMessage: validation.validationError,
      internalAgencyCodeIsInvalid: validation.isInvalid,
    });
  }

  function handleInternalAbbreviatedAgency({ value }) {
    let validation = validateAbbreviatedAgency(value);
    updateInternalAgencyDetailsState({
      internalAbbreviatedAgency: validation.value,
      internalAbbreviatedAgencyIsInvalid: validation.isInvalid,
      internalAbbreviatedAgencysIsValid: !validation.isInvalid,
      internalAbbreviatedAgencyValidationMessage: validation.validationError,
    });
  }

  function validateIfAgencyExists(agencyCode: any, validation: any) {
    commonApiService
      .getBureauNameByAgencyBureauCode(agencyCode + "00")
      .then((res) => {
        if (res.status === 200) {
          let agencyName = "";
          if (res.data.isInternalAgency === true) {
            validation.validationError = "Internal Agency Already Exists.";
            validation.isInvalid = true;
            agencyName = "";
          } else {
            agencyName = res.data.longName.trim();
          }
          updateInternalAgencyDetailsState({
            internalAgencyName: agencyName,
            internalAgencyCodeValidationMessage: validation.validationError,
            internalAgencyCodeIsInvalid: validation.isInvalid,
          });
        }
      })
      .catch((error) => {
        updateInternalAgencyDetailsState({
          internalAgencyName: "",
          internalAgencyCodeValidationMessage:
            "Internal Agency Code is not available",
          internalAgencyCodeIsInvalid: true,
        });
      });
  }

  return useMemo(() => {
    return (
      <React.Fragment>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-3"}>
            <PPMSInput
              isDisabled={
                internalAgencyDetailsState.internalAgencyCodeIsDisabled
              }
              label={"Internal Agency Code"}
              id={"internal-agency-code"}
              name={"internal-agency-code"}
              inputType={"text"}
              validationMessage={
                internalAgencyDetailsState.internalAgencyCodeValidationMessage
              }
              isInvalid={internalAgencyDetailsState.internalAgencyCodeIsInvalid}
              isValid={internalAgencyDetailsState.internalAgencyCodeIsValid}
              isRequired={true}
              hint={"ex: 10"}
              minLength={2}
              maxLength={2}
              value={internalAgencyDetailsState.internalAgencyCode}
              onChange={(event) => handleInternalAgencyCode(event.target)}
              className={"usa-input--small"}
            />
          </div>
          <div className={"tablet:grid-col-3"}>
            <PPMSInput
              isDisabled={false}
              label={"Abbreviated Agency Name"}
              id={"abbreviated-agency-name"}
              name={"abbreviated-agency-name"}
              inputType={"text"}
              validationMessage={
                internalAgencyDetailsState.internalAbbreviatedAgencyValidationMessage
              }
              isInvalid={
                internalAgencyDetailsState.internalAbbreviatedAgencyIsInvalid
              }
              isValid={
                internalAgencyDetailsState.internalAbbreviatedAgencyIsValid
              }
              isRequired={true}
              minLength={1}
              maxLength={4}
              hint={"ex: GSA"}
              value={internalAgencyDetailsState.internalAbbreviatedAgency}
              onChange={(event) =>
                handleInternalAbbreviatedAgency(event.target)
              }
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-12"}>
            <PPMSInput
              isDisabled={true}
              label={"Agency Name"}
              id={"agency-name"}
              name={"agency-name"}
              inputType={"text"}
              validationMessage={
                internalAgencyDetailsState.internalAgencyNameValidationMessage
              }
              isInvalid={internalAgencyDetailsState.internalAgencyNameIsInvalid}
              isValid={internalAgencyDetailsState.internalAgencyNameIsValid}
              isRequired={true}
              value={internalAgencyDetailsState.internalAgencyName}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }, [internalAgencyDetailsState]);
}

export default InternalAgencyDetailsClass;
