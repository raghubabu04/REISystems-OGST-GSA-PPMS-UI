import React, { useContext, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { FleetContext } from "../Fleet-context";
import { UserUtils } from "../../../../../utils/UserUtils";
import { PPMSState } from "../../../../../ui-kit/components/PPMS-state";
import {
  validateZipState,
  zipInvalidStateMessage,
  zipInvalidMessage,
  validateZipStateCity,
} from "../../../../../ui-kit/components/validations/FieldValidations";
import { PPMSZip } from "../../../../../ui-kit/components/PPMS-zip";
import { CommonApiService } from "../../../../../api-kit/common/common-api.service";
import { isFormSubmitted } from "../../../../../service/validation.service";
import { validateEmptyCheck } from "../validations/fleetValidations";
import { zip } from "rxjs";

interface ReportingAgencyProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function ReportingAgencyState(props: ReportingAgencyProps) {
  const { reportingAgencyState, updateReportingAgencyState } = useContext(
    FleetContext
  );

  const commonApiService = new CommonApiService();

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
    //Agency Name
    if (!UserUtils.isUserFleetExt()) {
      let errorAgencyName = validateEmptyCheck(reportingAgencyState.agencyName);
      if (errorAgencyName.isInvalid) {
        updateReportingAgencyState({
          agencyNameIsInvalid: errorAgencyName.isInvalid,
        });
      }
      //Address Line 1
      let errorAddress1 = validateEmptyCheck(reportingAgencyState.addressLine1);
      if (errorAddress1.isInvalid) {
        updateReportingAgencyState({
          addressLine1IsInvalid: errorAddress1.isInvalid,
        });
      }
      //City
      let errorCity = validateEmptyCheck(reportingAgencyState.city);
      if (errorCity.isInvalid) {
        updateReportingAgencyState({
          cityIsInvalid: errorCity.isInvalid,
        });
      }
    }
  }

  function handleZip(value, inValid, valid, validationError) {
    updateReportingAgencyState({
      zip: value,
      zipIsInvalid: inValid,
      zipIsValid: valid,
      zipValidationError: validationError,
    });

    if (
      !inValid ||
      reportingAgencyState.zipValidationError === zipInvalidStateMessage
    ) {
      commonApiService
        .getZipCode(value)
        .then((response: any) => {
          let errorMessage = validateZipState(
            response.data,
            reportingAgencyState.state
          );
          updateReportingAgencyState({
            zipIsInvalid: errorMessage.length !== 0,
            zipIsValid: errorMessage.length === 0,
            zipValidationError: errorMessage,
          });

          //Recheck City
          let obj = response.data.find(
            (o) =>
              o.zipCity.toUpperCase().trim() ===
              reportingAgencyState.city.toUpperCase().trim()
          );
          if (!obj) {
            updateReportingAgencyState({
              cityIsInvalid: true,
              cityValidationMsg: "Reporting agency city does not match zipcode",
            });
          } else {
            updateReportingAgencyState({
              cityIsInvalid: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    } else if (!value) {
      updateReportingAgencyState({
        zipIsInvalid: true,
        zipIsValid: false,
        zipValidationError: "Zip Code is Required.",
      });
    }
  }

  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-5"}>
          <PPMSInput
            id={"agencyName"}
            name={"agencyName"}
            label={"Agency Name"}
            isRequired={true}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={reportingAgencyState.agencyName}
            onChange={(event) => {
              updateReportingAgencyState({
                agencyName: event.target.value,
                agencyNameIsInvalid: false,
              });
            }}
            onBlur={(event) => {
              if (!event.target.value) {
                updateReportingAgencyState({
                  agencyNameIsInvalid: true,
                });
              }
            }}
            validationMessage={"Agency name is Required."}
            isInvalid={reportingAgencyState.agencyNameIsInvalid}
            maxLength={30}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-7"}>
          <PPMSInput
            id={"address1"}
            name={"addressLine1"}
            label={"Address Line 1"}
            isRequired={true}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={reportingAgencyState.addressLine1}
            onChange={(event) => {
              updateReportingAgencyState({
                addressLine1: event.target.value,
                addressLine1IsInvalid: false,
              });
            }}
            onBlur={(event) => {
              if (!event.target.value) {
                updateReportingAgencyState({
                  addressLine1IsInvalid: true,
                });
              }
            }}
            validationMessage={"Address line 1 is Required."}
            isInvalid={reportingAgencyState.addressLine1IsInvalid}
            maxLength={30}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-7"}>
          <PPMSInput
            id={"address2"}
            name={"addressLine2"}
            label={"Address Line 2"}
            isRequired={false}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={reportingAgencyState.addressLine2}
            onChange={(event) => {
              updateReportingAgencyState({
                addressLine2: event.target.value,
              });
            }}
            validationMessage={""}
            isInvalid={false}
            maxLength={30}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"city"}
            name={"city"}
            label={"City"}
            isRequired={true}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={reportingAgencyState.city}
            onChange={(event) => {
              if (/^[0-9a-zA-Z]*$/.test(event.target.value)) {
                updateReportingAgencyState({
                  city: event.target.value,
                  cityIsInvalid: false,
                });
              }
            }}
            onBlur={(event) => {
              if (!event.target.value) {
                updateReportingAgencyState({
                  cityIsInvalid: true,
                  cityValidationMsg: "Reporting agency city is Required.",
                });
              } else if (
                reportingAgencyState.zip &&
                reportingAgencyState.zip.length === 5
              ) {
                commonApiService
                  .getZipCode(reportingAgencyState.zip)
                  .then((response: any) => {
                    let obj = response.data.find(
                      (o) =>
                        o.zipCity.toUpperCase().trim() ===
                        reportingAgencyState.city.toUpperCase().trim()
                    );
                    if (!obj) {
                      updateReportingAgencyState({
                        cityIsInvalid: true,
                        cityValidationMsg:
                          "Reporting agency city does not match zipcode.",
                      });
                    } else {
                      updateReportingAgencyState({
                        cityIsInvalid: false,
                      });
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            }}
            validationMessage={reportingAgencyState.cityValidationMsg}
            isInvalid={reportingAgencyState.cityIsInvalid}
            maxLength={25}
          />
        </div>
        <div className={"grid-col-3"}>
          <PPMSState
            id={"state-selection"}
            label={"State"}
            required={true}
            selectedState={reportingAgencyState.state}
            isInvalid={reportingAgencyState.stateIsInvalid}
            updateLocationState={(value: any, validation: any) => {
              updateReportingAgencyState({
                state: value,
                stateIsInvalid: validation.isInvalid,
              });

              if (reportingAgencyState.zip) {
                commonApiService
                  .getZipCode(reportingAgencyState.zip)
                  .then((response: any) => {
                    let errorMessage = validateZipState(response.data, value);
                    updateReportingAgencyState({
                      zipIsInvalid: errorMessage.length !== 0,
                      zipIsValid: errorMessage.length === 0,
                      zipValidationError: errorMessage,
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                    return error;
                  });
              }
            }}
            disabled={UserUtils.isUserFleetExt()}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-7"}>
          <PPMSZip
            id={"zip-selection"}
            isRequired={true}
            disabled={UserUtils.isUserFleetExt()}
            zip={reportingAgencyState.zip}
            onChangeZip={(value) => {
              if (/^[0-9a-zA-Z]*$/.test(value)) {
                updateReportingAgencyState({
                  zip: value,
                });
              }
            }}
            isZipValid={reportingAgencyState.zipIsValid}
            isZipInvalid={reportingAgencyState.zipIsInvalid}
            updateZip={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: any
            ) => {
              handleZip(value, inValid, valid, validationError);
            }}
            validationMessage={reportingAgencyState.zipValidationError}
            showZipExtension={true}
            zipExtension={reportingAgencyState.zipExtension}
            onChangeZipExtension={(value: any) => {
              if (/^[0-9a-zA-Z]*$/.test(value)) {
                updateReportingAgencyState({ zipExtension: value });
              }
            }}
            updateZipExtension={(value: any) => {
              updateReportingAgencyState({ zipExtension: value });
            }}
          />
        </div>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(ReportingAgencyState);
