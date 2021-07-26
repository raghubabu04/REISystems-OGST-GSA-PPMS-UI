import React, { useContext, useEffect } from "react";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { NonNonReportedTransferContext } from "../NonReportedTransferContext";
import { gainingAgencyReason } from "../constants/Constants";
import {
  isEmptyCheck,
  validateGainingAgencyReason,
} from "../validations/NonReportedTransferValidations";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { NonReportedPoc } from "../NonReportedPoc";
import { aacCodeValidation } from "../../../../ui-kit/components/validations/FieldValidations";
import { isFormSubmitted } from "../../../../service/validation.service";

export interface GainingAgencyProps {}

export function GainingAgencyClass(props: GainingAgencyProps) {
  const { gainingAgencyState, updateGainingAgencyState } = useContext(
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
  }, [gainingAgencyState]);

  useEffect(() => {
    commonApiService
      .getRegionCodes()
      .then((response: any) => {
        let regionValues = response.data;
        updateGainingAgencyState({
          regionValues: regionValues,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    commonApiService
      .getPriorityCodes()
      .then((response: any) => {
        let priorityValues = response.data;
        updateGainingAgencyState({
          priorityValues: priorityValues,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function validateForm() {
    if (!gainingAgencyState.aacIsInvalid) {
      let aacValidation = aacCodeValidation(gainingAgencyState.aacCode);
      if (aacValidation.isInvalid) {
        updateGainingAgencyState({
          aacIsInvalid: true,
          aacValidationMessage: aacValidation.validationError,
        });
      }
    }

    if (!gainingAgencyState.cityIsInvalid) {
      if (gainingAgencyState.city.length === 0) {
        updateGainingAgencyState({
          cityIsInvalid: true,
          cityValidationMessage: "City is Required.",
        });
      }
    }

    if (isEmptyCheck(gainingAgencyState.state)) {
      updateGainingAgencyState({
        stateIsInvalid: true,
        stateValidationMessage: "State is Required.",
      });
    }

    if (!gainingAgencyState.emailIsInValid) {
      if (isEmptyCheck(gainingAgencyState.email)) {
        updateGainingAgencyState({
          emailIsInValid: true,
          emailValidationMessage: "Email is Required.",
        });
      }
    }

    if (isEmptyCheck(gainingAgencyState.selectedRegion)) {
      updateGainingAgencyState({
        regionIsInvalid: true,
        regionValidationMessage: "Region is Required.",
      });
    }

    handleGainingAgencyReasonChange(gainingAgencyState.gainingAgencyReason);
  }

  function handleAddressSelection(value: any) {
    if (!value) {
      updateGainingAgencyState({ pocAddress: value });
    } else {
      const pocAddress = gainingAgencyState.pocAddressValues.filter(
        (address: any) => address["pocAddress"] === value
      );
      if (pocAddress[0]) {
        updateGainingAgencyState({
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
      updateGainingAgencyState({ pocEmail: value });
    } else {
      const pocEmail = gainingAgencyState.pocEmailValues.filter(
        (email: any) => email["pocEmail"] === value
      );
      if (pocEmail[0]) {
        updateGainingAgencyState({
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
          agencyCode: gainingAgencyState.aacCode,
        },
      };
      commonApiService
        .getBureau(data)
        .then(async (response: any) => {
          let aacBureau = `${response.data.code} ${response.data.longName}`;
          updateGainingAgencyState({
            agencyBureau: aacBureau,
            agencyBureauCode: response?.data?.code,
          });
          commonApiService
            .getContacts(gainingAgencyState.aacCode)
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

                updateGainingAgencyState({
                  pocAddressValues: addressValues,
                });

                let emailValues: any = [];
                poc.forEach((pocOb: any) => {
                  let value: any = {};
                  let emailStr = pocOb["email"];
                  value = { email: pocOb["email"], pocEmail: emailStr };
                  emailValues.push(value);
                });

                updateGainingAgencyState({
                  pocEmailValues: emailValues,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          updateGainingAgencyState({
            aacIsInvalid: true,
            aacValidationMessage: "AAC Not Found",
            agencyBureau: "",
            pocEmailValues: [],
            pocAddressValues: [],
          });
        });
    } else {
      updateGainingAgencyState({
        aacIsInvalid: true,
        aacValidationMessage: validation.validationError,
        agencyBureau: "",
        pocEmailValues: [],
        pocAddressValues: [],
      });
    }
  }

  function handleRegionSelect(event: any) {
    let value = event.target.value;
    if (!value) {
      updateGainingAgencyState({
        selectedRegion: value,
      });
    } else {
      const region = gainingAgencyState.regionValues.filter(
        (o) => o["regionCode"] === value
      );
      if (region[0]) {
        updateGainingAgencyState({
          selectedRegion: region[0]["regionCode"],
          regionIsInvalid: false,
          regionValidationMessage: "",
        });
      }
    }
  }

  function handlePrioritySelect(event: any) {
    let value = event.target.value;
    if (!value) {
      updateGainingAgencyState({
        selectedPriority: value,
      });
    } else {
      const priority = gainingAgencyState.priorityValues.filter(
        (o) => o["disasterCode"] === value
      );
      if (priority[0]) {
        updateGainingAgencyState({
          selectedPriority: priority[0]["disasterCode"],
          priorityIsInvalid: false,
          priorityValidationMessage: "",
        });
      }
    }
  }

  function handleGainingAgencyReasonChange(value: any) {
    let errorMessage = validateGainingAgencyReason(value);
    if (errorMessage) {
      updateGainingAgencyState({
        gainingAgencyReasonIsInvalid: errorMessage.isInvalid,
        gainingAgencyReasonValidationMessage: errorMessage.validationError,
      });
    }
    updateGainingAgencyState({
      gainingAgencyReason: value,
    });
  }

  return (
    <>
      <NonReportedPoc
        id={"gainingAgency"}
        aacCode={gainingAgencyState.aacCode}
        handleAccChange={(validation: any) => {
          handleAccChange(validation);
        }}
        onChangeAacCode={(value: any) =>
          updateGainingAgencyState({
            aacCode: value,
            aacValidationMessage: "",
            aacIsInvalid: false,
          })
        }
        selectTag={"GainingAgency"}
        handleAddressSelection={handleAddressSelection}
        aacIsInvalid={gainingAgencyState.aacIsInvalid}
        aacIsValid={gainingAgencyState.aacIsValid}
        aacValidationMessage={gainingAgencyState.aacValidationMessage}
        agencyBureau={gainingAgencyState.agencyBureau}
        pocAddressValues={gainingAgencyState.pocAddressValues}
        pocAddress={gainingAgencyState.pocAddress}
        pocEmailValues={gainingAgencyState.pocEmailValues}
        pocEmail={gainingAgencyState.pocEmail}
        email={gainingAgencyState.email}
        emailIsValid={gainingAgencyState.emailIsValid}
        emailIsInValid={gainingAgencyState.emailIsInValid}
        emailValidationMessage={gainingAgencyState.emailValidationMessage}
        city={gainingAgencyState.city}
        cityIsValid={gainingAgencyState.cityIsValid}
        cityIsInvalid={gainingAgencyState.cityIsInvalid}
        cityValidationMessage={gainingAgencyState.cityValidationMessage}
        onChangCity={(value: any) => {
          updateGainingAgencyState({
            city: value,
            cityIsInvalid: false,
            cityIsValid: false,
          });
        }}
        handleCityChange={(value: any) => {
          let valid = value?.length > 0;
          updateGainingAgencyState({
            cityIsInvalid: !valid,
            cityIsValid: valid,
          });
        }}
        selectedState={(value: any) => {
          updateGainingAgencyState({
            state: value,
            stateIsInvalid: isEmptyCheck(value),
          });
        }}
        state={gainingAgencyState.state}
        stateIsInvalid={gainingAgencyState.stateIsInvalid}
        stateIsValid={gainingAgencyState.stateIsValid}
        stateValidationMessage={gainingAgencyState.stateValidationMessage}
        handleEmailSelection={handleEmailSelection}
        onChangeEmail={(value) => {
          updateGainingAgencyState({
            email: value,
            emailIsInValid: false,
            emailValidationMessage: "",
          });
        }}
        updateEmail={(value: any, validation: any) => {
          updateGainingAgencyState({
            emailIsInValid: validation.isInvalid,
            emailValidationMessage: validation.validationError,
          });
        }}
      />

      <div className="grid-row grid-gap-4">
        <div className="grid-col-5">
          <PPMSSelect
            placeholderValue={"Select Requesting Region"}
            selectName={"region"}
            label={"Requesting Region"}
            values={gainingAgencyState.regionValues}
            isRequired={true}
            onChange={handleRegionSelect}
            identifierValue={"regionDescription"}
            identifierKey={"regionCode"}
            isInvalid={gainingAgencyState.regionIsInvalid}
            isValid={gainingAgencyState.regionIsValid}
            defaultValue={gainingAgencyState.selectedRegion}
            selectedValue={gainingAgencyState.selectedRegion}
            validationMessage={gainingAgencyState.regionValidationMessage}
          />
        </div>
      </div>

      <div className="grid-row grid-gap-4">
        <div className="grid-col-5">
          <PPMSSelect
            placeholderValue={"Select Priority"}
            selectName={"priority"}
            label={"Disaster Relief"}
            values={gainingAgencyState.priorityValues}
            isRequired={false}
            onChange={handlePrioritySelect}
            identifierValue={"disasterName"}
            identifierKey={"disasterCode"}
            isInvalid={gainingAgencyState.priorityIsInvalid}
            isValid={gainingAgencyState.priorityIsValid}
            defaultValue={gainingAgencyState.selectedPriority}
            selectedValue={gainingAgencyState.selectedPriority}
            validationMessage={gainingAgencyState.priorityValidationMessage}
          />
        </div>
      </div>

      <div className="grid-row grid-gap-4">
        <div className="grid-col-5">
          <PPMSSelect
            selectName={"gaining-agency-reason"}
            identifierKey={"id"}
            identifierValue={"value"}
            id={"gaining-agency-reason"}
            name={"gaining-agency-reason"}
            values={gainingAgencyReason}
            label={"Reason"}
            isRequired={true}
            placeholderValue={"Select Reason"}
            onChange={(event) =>
              handleGainingAgencyReasonChange(event.target.value)
            }
            selectedValue={gainingAgencyState.gainingAgencyReason}
            validationMessage={
              gainingAgencyState.gainingAgencyReasonValidationMessage
            }
            isInvalid={gainingAgencyState.gainingAgencyReasonIsInvalid}
          />
        </div>
      </div>
    </>
  );
}
