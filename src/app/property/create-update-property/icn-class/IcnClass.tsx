import React, { useContext, useMemo } from "react";
import { PropertyContext } from "../PropertyContext";
import { IcnState } from "./IcnState";
import AacCode from "./AacCode";
import { validateAACRistrictionInSalesCenter } from "../validations/validateFSCSalesCenter";
import { validatePropertyField } from "../../../../ui-kit/components/validations/FieldValidations";
import { UserUtils } from "../../../../utils/UserUtils";
import { PropertyApiService } from "../../../../api-kit/property/property-api-service";
import { PPMSTooltip } from "../../../../ui-kit/components/common/PPMS-tooltip";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { history } from "../../../../_redux/_helpers/history";
import { PropertyGroupType } from "../constants/Constants";

interface IcnProps {
  resetOptions?: any;
  propertyGroup?: any;
}

function IcnClass(props: IcnProps) {
  let propertyApiService = new PropertyApiService();
  const {
    icnState,
    updateIcnState,
    propertyInfoState,
    agencyInfoState,
    updateFSCState,
    updatePropertyReportState,
  } = useContext(PropertyContext);

  function handleSerialNumChange(event: any) {
    const validation = validatePropertyField(
      event.target.id,
      icnState.serialNum
    );
    updateIcnState({
      // serialNum: event.target.value.toUpperCase(),
      serialValidationMessage: validation.validationError,
      serialIsInvalid: validation.isInvalid,
      serialIsValid: !validation.isInvalid,
      showIcnCodeValid: false,
    });
  }

  function handleSuffixChange(event: any) {
    const validation = validatePropertyField(event.target.id, icnState.suffix);
    updateIcnState({
      suffix: event.target.value.toUpperCase(),
      suffixValidationMessage: validation.validationError,
      suffixIsInvalid: validation.isInvalid,
      suffixIsValid: !validation.isInvalid,
      showIcnCodeValid: false,
    });
  }

  function checkIfValuesAreEntered() {
    if (icnState.aacCode === "") {
      updateIcnState({
        aacIsInvalid: true,
        aacValidationMessage:
          "Please enter all 6 characters of Activity Address Code.",
      });
    }
    if (icnState.julianDate === "") {
      updateIcnState({
        julianDateIsInvalid: true,
        julianDateValidationMessage: "Julian date must be 4 numbers",
      });
    }
    if (icnState.serialNum === "") {
      updateIcnState({
        serialValidationMessage: "Serial Number must be 4 Characters",
        serialIsInvalid: true,
      });
    }
  }

  function handleConfirmICN() {
    props.resetOptions();
    if (!icnState.isIcnValid) {
      if (
        icnState.aacIsInvalid ||
        icnState.aacCode === "" ||
        icnState.julianDateIsInvalid ||
        icnState.julianDate === "" ||
        icnState.serialIsInvalid ||
        icnState.serialNum === "" ||
        icnState.suffixIsInvalid
      ) {
        checkIfValuesAreEntered();
        updateIcnState({
          showForm: false,
        });
      } else {
        updateIcnState({
          disableIcnConfirmButton: true,
        });

        let savePropertyReportBody = {
          itemControlNumber: joinIcn(icnState),
          aacId: icnState.aacCode,
          agencyBureau: agencyInfoState.aac,
        };

        if (props.propertyGroup === PropertyGroupType.FOREIGN_GIFT) {
          savePropertyReportBody = {
            ...savePropertyReportBody,
            ...{
              propertyGroup: props.propertyGroup,
              recipientInfo: {
                email: "",
                firstName: "",
                lastName: "",
                phone: "",
                phoneExtension: "",
                recipientTitle: "",
              },
              giftInfo: {
                administration: "",
                dateReceivedByFgm: null,
                dateReceivedByRecipient: null,
                fairMarketValue: null,
                fiscalYear: "",
                giftFscCode: "",
                recipientWantsToBuy: null,
                unitOfIssue: "EA",
                upsetPrice: null,
                vaultLocation: "",
                vaultShelfNumber: "",
              },
            },
          };
        } else {
          savePropertyReportBody = {
            ...savePropertyReportBody,
            ...{ propertyGroup: "property" },
          };
        }

        propertyApiService
          .verifyICN(joinIcn(icnState))
          .then((response) => {
            if (response.data.status === "ICN NOT FOUND") {
              propertyApiService
                .savePropertyReport(savePropertyReportBody)
                .then((response) => {
                  updatePropertyReportState({
                    propertyId: response.data.propertyId,
                  });
                  updateIcnState({
                    disableAAC: true,
                    disableJulianDate: true,
                    disableSerialNumber: true,
                    disableSuffix: true,
                    showIcnCodeValid: true,
                    isIcnValid: true,
                    icnVerificationMessage: "ICN is Confirmed",
                  });
                })
                .catch(() => {
                  updateIcnState({
                    showIcnCodeValid: true,
                    isIcnValid: false,
                    icnVerificationMessage:
                      "Error Confirming ICN. Please try again.",
                  });
                });
            } else if (response.data.status === "ICN Found") {
              updateIcnState({
                showIcnCodeValid: true,
                isIcnValid: false,
                icnVerificationMessage:
                  "ICN already exists in the System. Please enter another ICN.",
              });
            }
          })
          .catch(() => {
            updateIcnState({
              showIcnCodeValid: true,
              isIcnValid: false,
              icnVerificationMessage: "Error Confirming ICN. Please try again.",
            });
          })
          .finally(() => {
            updateIcnState({
              disableIcnConfirmButton: false,
            });
          });
      }
    }

    // PPDMS:763 Validate against ICN AAC=47310K
    let isAACCodeRestrictedInSalesCenter = validateAACRistrictionInSalesCenter(
      icnState.aacCode
    );

    if (isAACCodeRestrictedInSalesCenter) {
      updateFSCState({
        federalSalesCenter: "G",
        isSalesCenterdisabled: true,
      });
    }
  }

  function joinIcn(state: IcnState) {
    let icnVal = "";
    if (icnState.suffix) {
      icnVal = `${icnState.aacCode}${icnState.julianDate}${icnState.serialNum}${icnState.suffix}`;
    } else {
      icnVal = `${icnState.aacCode}${icnState.julianDate}${icnState.serialNum}`;
    }
    return icnVal;
  }

  function handleJulianDateChange(event: any) {
    const validation = validatePropertyField(
      event.target.id,
      event.target.value
    );
    updateIcnState({
      julianDate: event.target.value,
      julianDateValidationMessage: validation.validationError,
      julianDateIsInvalid: validation.isInvalid,
      julianDateIsValid: !validation.isInvalid,
      showIcnCodeValid: false,
    });
  }

  return useMemo(() => {
    return (
      <React.Fragment>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-2"}>
            <AacCode />
          </div>
          <div className={"tablet:grid-col-2"}>
            <PPMSInput
              id={"julian-date"}
              name={"julianDate"}
              label={"Julian date"}
              maxLength={4}
              onChange={handleJulianDateChange}
              validationMessage={icnState.julianDateValidationMessage}
              isRequired={true}
              isDisabled={
                !icnState.disableJulianDate
                  ? !(
                      UserUtils.hasPermission("APO") ||
                      UserUtils.hasPermission("NU") ||
                      UserUtils.hasPermission("SM")
                    )
                  : true
              }
              value={icnState.julianDate}
              inputType={"text"}
              isInvalid={icnState.julianDateIsInvalid}
              isValid={
                history?.location?.pathname === "/createPropertyReport"
                  ? icnState.julianDateIsValid
                  : !icnState.disableJulianDate
              }
            />
          </div>
          <div className={"tablet:grid-col-2"}>
            <PPMSInput
              id={"serial-number"}
              name={"serialNum"}
              label={"Serial Number"}
              maxLength={4}
              onChange={(event) => {
                updateIcnState({
                  serialNum: event.target.value.toUpperCase(),
                });
              }}
              onBlur={handleSerialNumChange}
              isRequired={true}
              validationMessage={icnState.serialValidationMessage}
              isInvalid={icnState.serialIsInvalid}
              isValid={icnState.serialIsValid}
              isDisabled={icnState.disableSerialNumber}
              inputType={"text"}
              value={icnState.serialNum}
            />
          </div>
          <div className={"tablet:grid-col-2"}>
            <PPMSInput
              id={"suffix"}
              name={"suffix"}
              label={"Suffix"}
              maxLength={1}
              onChange={(event) => {
                updateIcnState({
                  suffix: event.target.value.toUpperCase(),
                });
              }}
              onBlur={handleSuffixChange}
              validationMessage={icnState.suffixValidationMessage}
              isInvalid={icnState.suffixIsInvalid}
              isValid={icnState.suffixIsValid}
              isDisabled={icnState.disableSuffix}
              inputType={"text"}
              isRequired={false}
              value={icnState.suffix}
            />
          </div>
        </div>
        <div className={"grid-row update-buttons"}>
          {!icnState.isIcnValid && (
            <div className={"tablet:grid-col-4"}>
              <PPMSTooltip
                trigger={"focus"}
                id={"confirm-icn"}
                placement={"right"}
                tooltipContent={"ICN cannot be changed once confirmed."}
                triggerSource={
                  <button
                    className="usa-button"
                    type="button"
                    disabled={icnState.disableIcnConfirmButton}
                    onClick={handleConfirmICN}
                  >
                    Confirm ICN
                  </button>
                }
              />
            </div>
          )}
          <div className={"tablet:grid-col-8"}>
            <PPMSAlert
              id={"icn-verification-danger-msg"}
              show={icnState.showIcnCodeValid && !icnState.isIcnValid}
              alertBody={icnState.icnVerificationMessage}
              alertClassName={"email-verification-error"}
              alertKey={"email-verification-error"}
              alertVariant={"danger"}
            />
            <PPMSAlert
              id={"icn-verification-success-msg"}
              show={icnState.showIcnCodeValid && icnState.isIcnValid}
              alertBody={icnState.icnVerificationMessage}
              alertClassName={"email-verification-error"}
              alertVariant={"success"}
              alertKey={"email-verification-error"}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }, [icnState, propertyInfoState]);
}

export default IcnClass;
