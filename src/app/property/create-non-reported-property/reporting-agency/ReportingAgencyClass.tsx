import React, { useContext, useEffect } from "react";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { isFormSubmitted } from "../../../../service/validation.service";
import { aacCodeValidation } from "../../../../ui-kit/components/validations/FieldValidations";
import { NonReportedPoc } from "../NonReportedPoc";
import { NonNonReportedTransferContext } from "../NonReportedTransferContext";
import { isEmptyCheck } from "../validations/NonReportedTransferValidations";

export interface ReportingAgencyProps {}

export function ReportingAgencyClass(props: ReportingAgencyProps) {
  const { reportingAgencyState, updateReportingAgencyState } = useContext(
    NonNonReportedTransferContext
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
  }, [reportingAgencyState]);

  function validateForm() {
    if (!reportingAgencyState.aacIsInvalid) {
      let aacValidation = aacCodeValidation(reportingAgencyState.aacCode);
      if (aacValidation.isInvalid) {
        updateReportingAgencyState({
          aacIsInvalid: true,
          aacValidationMessage: aacValidation.validationError,
        });
      }
    }

    if (!reportingAgencyState.cityIsInvalid) {
      if (reportingAgencyState.city.length === 0) {
        updateReportingAgencyState({
          cityIsInvalid: true,
          cityValidationMessage: "City is Required.",
        });
      }
    }

    if (isEmptyCheck(reportingAgencyState.state)) {
      updateReportingAgencyState({
        stateIsInvalid: true,
        stateValidationMessage: "State is Required.",
      });
    }

    if (!reportingAgencyState.emailIsInValid) {
      if (isEmptyCheck(reportingAgencyState.email)) {
        updateReportingAgencyState({
          emailIsInValid: true,
          emailValidationMessage: "Email is Required.",
        });
      }
    }
  }

  function handleAddressSelection(value: any) {
    if (!value) {
      updateReportingAgencyState({ pocAddress: value });
    } else {
      const pocAddress = reportingAgencyState.pocAddressValues.filter(
        (address: any) => address["pocAddress"] === value
      );
      if (pocAddress[0]) {
        updateReportingAgencyState({
          city: pocAddress[0]["city"],
          state: pocAddress[0]["stateCode"],
          pocAddress: pocAddress[0]["pocAddress"],
          cityIsValid: false,
          cityIsInvalid: false,
          cityValidationMessage: "",
          stateIsInvalid: false,
          stateIsValid: false,
          stateValidationMessage: "",
        });
      }
    }
  }

  function handleEmailSelection(value: any) {
    if (!value) {
      updateReportingAgencyState({ pocEmail: value });
    } else {
      const pocEmail = reportingAgencyState.pocEmailValues.filter(
        (email: any) => email["pocEmail"] === value
      );
      if (pocEmail[0]) {
        updateReportingAgencyState({
          email: pocEmail[0]["email"],
          pocEmail: pocEmail[0]["pocEmail"],
          emailIsValid: false,
          emailIsInValid: false,
          emailValidationMessage: "",
        });
      }
    }
  }

  function handleAccChange(validation: any) {
    if (!validation.isInvalid) {
      const data = {
        params: {
          agencyCode: reportingAgencyState.aacCode,
        },
      };
      commonApiService
        .getBureau(data)
        .then(async (response: any) => {
          let aacBureau = `${response.data.code} ${response.data.longName}`;
          updateReportingAgencyState({
            agencyBureau: aacBureau,
            agencyBureauCode: response?.data?.code,
          });
          commonApiService
            .getContacts(reportingAgencyState.aacCode)
            .then((res: any) => {
              if (res.data) {
                let repAdd: any = res["data"].repAdd;
                let poc: any = res["data"].poc;

                let addressValues: any = [];
                repAdd.forEach((repOb: any) => {
                  let value: any = {};
                  let addressStr = repOb["city"] + "-" + repOb["stateCode"];
                  value = { ...repOb, pocAddress: addressStr };
                  addressValues.push(value);
                });

                updateReportingAgencyState({
                  pocAddressValues: addressValues,
                });

                let emailValues: any = [];
                poc.forEach((pocOb: any) => {
                  let value: any = {};
                  let emailStr = pocOb["email"];
                  value = { email: pocOb["email"], pocEmail: emailStr };
                  emailValues.push(value);
                });

                updateReportingAgencyState({
                  pocEmailValues: emailValues,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          updateReportingAgencyState({
            aacIsInvalid: true,
            aacValidationMessage: "AAC Not Found",
            agencyBureau: "",
            pocEmailValues: [],
            pocAddressValues: [],
          });
        });
    } else {
      updateReportingAgencyState({
        aacIsInvalid: true,
        aacValidationMessage: validation.validationError,
        agencyBureau: "",
        pocEmailValues: [],
        pocAddressValues: [],
      });
    }
  }

  return (
    <>
      <NonReportedPoc
        id={"reportingAgency"}
        aacCode={reportingAgencyState.aacCode}
        handleAccChange={(validation: any) => {
          handleAccChange(validation);
        }}
        onChangeAacCode={(value: any) =>
          updateReportingAgencyState({
            aacCode: value,
            aacValidationMessage: "",
            aacIsInvalid: false,
          })
        }
        selectTag={"ReportingAgency"}
        handleAddressSelection={handleAddressSelection}
        aacIsInvalid={reportingAgencyState.aacIsInvalid}
        aacIsValid={reportingAgencyState.aacIsValid}
        aacValidationMessage={reportingAgencyState.aacValidationMessage}
        agencyBureau={reportingAgencyState.agencyBureau}
        pocAddressValues={reportingAgencyState.pocAddressValues}
        pocAddress={reportingAgencyState.pocAddress}
        pocEmailValues={reportingAgencyState.pocEmailValues}
        pocEmail={reportingAgencyState.pocEmail}
        email={reportingAgencyState.email}
        emailIsValid={reportingAgencyState.emailIsValid}
        emailIsInValid={reportingAgencyState.emailIsInValid}
        emailValidationMessage={reportingAgencyState.emailValidationMessage}
        city={reportingAgencyState.city}
        cityIsValid={reportingAgencyState.cityIsValid}
        cityIsInvalid={reportingAgencyState.cityIsInvalid}
        cityValidationMessage={reportingAgencyState.cityValidationMessage}
        onChangCity={(value: any) => {
          updateReportingAgencyState({
            city: value,
            cityIsInvalid: false,
            cityIsValid: false,
          });
        }}
        handleCityChange={(value: any) => {
          let valid = value?.length > 0;
          updateReportingAgencyState({
            cityIsInvalid: !valid,
            cityIsValid: valid,
          });
        }}
        selectedState={(value: any) => {
          updateReportingAgencyState({
            state: value,
            stateIsInvalid: isEmptyCheck(value),
          });
        }}
        state={reportingAgencyState.state}
        stateIsInvalid={reportingAgencyState.stateIsInvalid}
        stateIsValid={reportingAgencyState.stateIsValid}
        stateValidationMessage={reportingAgencyState.stateValidationMessage}
        handleEmailSelection={handleEmailSelection}
        onChangeEmail={(value) => {
          updateReportingAgencyState({
            email: value,
            emailIsInValid: false,
            emailValidationMessage: "",
          });
        }}
        updateEmail={(value: any, validation: any) => {
          updateReportingAgencyState({
            emailIsInValid: validation.isInvalid,
            emailValidationMessage: validation.validationError,
          });
        }}
      />
    </>
  );
}
