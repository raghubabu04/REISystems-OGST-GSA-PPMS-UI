import React, { useContext, useEffect, useMemo } from "react";
import ChangeRequestModal from "../manage-change-request/ChangeRequestModal";
import { PPMSTextEditor } from "../../../../../src/ui-kit/components/common/PPMS-texteditor";
import {
  isEmptyCheck,
  SRDValidation,
  validateAcquisitionDate,
  validateCondition,
  validateDemilitarization,
  validateFairMarketValue,
  validateHazardous,
  validateManufacturer,
  validateManufacturerDate,
  validatePropertyDescription,
  validateSurplusReleaseDate,
} from "../validations/propertyFieldValidations";
import moment from "moment";
import { PropertyContext } from "../PropertyContext";
import SurplusReleaseDate from "./SurplusReleaseDate";
import ChangeRequestModalERD from "../manage-change-request/ChangeRequestModalERD";
import ExcessReleaseDate from "./ExcessReleaseDate";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { UserUtils } from "../../../../utils/UserUtils";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSDatepicker } from "../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSFormGroup } from "../../../../ui-kit/components/common/form/PPMS-form-group";
import PPMSLabel from "../../../../ui-kit/components/common/form/PPMS-label";
import { isFormSubmitted } from "../../../../service/validation.service";
import { demilitarizationForSales } from "../constants/Constants";

interface AdditionalInfoProps {
  propertyId?: number;
}

export function AdditionalInfoClass(props: AdditionalInfoProps) {
  const {
    additionalInfoState,
    updateAdditionalInfoState,
    propertyInfoState,
    fscVesselState,
    fscState,
    icnState,
    agencyInfoState,
    updateERDAndSRD,
    propertyReportState,
  } = useContext(PropertyContext);

  useEffect(() => {
    let today = new Date();
    let erd = new Date(additionalInfoState.excessReleaseDate);
    let subDate = new Date(propertyReportState.submittedDate);
    if (agencyInfoState.isInternalAgency) {
      if (today < moment(erd).add("3", "days").toDate()) {
        updateAdditionalInfoState({
          isNotAllowedToRequest: true,
        });
      }
    } else {
      if (today < moment(subDate).add("3", "days").toDate()) {
        updateAdditionalInfoState({
          isNotAllowedToRequest: true,
        });
      }
    }
  }, [
    additionalInfoState.excessReleaseDate,
    propertyReportState.submittedDate,
    agencyInfoState.isInternalAgency,
  ]);
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
  }, [additionalInfoState]);
  function handleFairMarketValue({ value, id, name }) {
    let fairMarketValue = value;
    let validation = validateFairMarketValue(
      id,
      name,
      value,
      additionalInfoState.fairMarketValueIsRequired
    );
    updateAdditionalInfoState({
      fairMarketValue: fairMarketValue,
      fairMarketValueSave: !validation.isInvalid
        ? fairMarketValue.toString().replace(/,/gi, "").replace("$", "")
        : null,
      fairMarketValueIsInValid: validation.isInvalid,
      fairMarketValueIsValid: !validation.isInvalid,
      fairMarketValueMsg: validation.validationError,
    });
  }

  function handleConditionChange(event: any) {
    let selectedConditionCode = "";
    event.forEach((e) => {
      if (e.isSelected) {
        let validation = validateCondition(e.id);
        selectedConditionCode = e.id;
        updateAdditionalInfoState({
          condition: e.id,
          conditionErrorMsg: validation.validationError,
        });
      }
    });

    let fsc = fscState.fsc;
    if (fsc.fscCode === "1005" || fsc.fscCode === "1010") {
      if (
        selectedConditionCode === "R" ||
        selectedConditionCode === "X" ||
        selectedConditionCode === "S"
      ) {
        updateAdditionalInfoState({
          conditionErrorMsg:
            "Repairable, Salvage and Scrap items are not reportable for this FSC",
          conditionIsValid: false,
          conditionIsInValid: true,
        });
      } else {
        updateAdditionalInfoState({
          conditionErrorMsg: "",
          conditionIsValid: true,
          conditionIsInValid: false,
        });
      }
    }
    if (!UserUtils.isSalesUser()) {
      updateERDAndSRD(
        propertyInfoState.isExchangeSales,
        icnState.aacCode,
        agencyInfoState.agencyBureau,
        fscVesselState.vesselFSCData.isVessel50FeetOrOver,
        propertyInfoState.agencyControlNumber,
        selectedConditionCode,
        null,
        fsc.fscCode,
        additionalInfoState.screeningDays,
        agencyInfoState.isInternalAgency,
        propertyReportState.isSubmitted,
        propertyReportState.submittedDate,
        true
      );
    }
  }

  function handleHazardousChange(event: any) {
    event.forEach((e) => {
      if (e.isSelected) {
        let validation = validateHazardous(e.id);
        updateAdditionalInfoState({
          hazardous: e.id,
          hazardousErrorMsg: validation.validationError,
        });
      }
    });
  }

  function handleFlightSafetyCriticalAircraftPartChange(event: any) {
    event.forEach((e) => {
      if (e.isSelected) {
        updateAdditionalInfoState({
          fightSafetyCriticalAircraftPart: e.id,
        });
      }
    });
  }

  function handleDemilitarizationChange(
    selectedDemilitarizationValue: string,
    selectedFederalAssetSalesCenter = fscState.fcsSelectedValue
  ) {
    let validation = validateDemilitarization(
      selectedDemilitarizationValue,
      selectedFederalAssetSalesCenter
    );

    updateAdditionalInfoState({
      demilitarization: selectedDemilitarizationValue,
      demilitarizationIsInvalid: validation.isInvalid,
      demilitarizationlIsValid: !validation.isInvalid,
      demilitarizationErrorMsg: validation.errorMsg,
    });
  }

  function handleManufacturerChange({ value }) {
    let validation = validateManufacturer(
      value,
      additionalInfoState.manufactureIsRequired
    );
    updateAdditionalInfoState({
      manufacturer: value,
      manufacturerIsInValid: validation.isInvalid,
      manufacturerIsValid: !validation.isInvalid,
      manufacturerValueMsg: validation.validationError,
    });
  }

  function handleDateOfManufactureChange(event: any) {
    let validation = validateManufacturerDate(
      event,
      additionalInfoState.dateOfManufactureIsRequired,
      additionalInfoState.acquisitionDate,
      updateAdditionalInfoState
    );
    if (!validation.isInvalid) {
      updateAdditionalInfoState({
        dateOfManufacture: event,
      });
    }
    updateAdditionalInfoState({
      dateOfManufactureIsInValid: validation.isInvalid,
      dateOfManufactureIsValid: !validation.isInvalid,
      dateOfManufactureMsg: validation.validationError,
    });
  }

  function handleAcquisitionDateChange(event: any) {
    let validation = {
      acquisitionDateIsInvalid: false,
      acquisitionDateMsg: "",
    };
    if (
      event &&
      event?.length > 0 &&
      !moment(event, "MM/DD/YYYY", true).isValid()
    ) {
      validation.acquisitionDateIsInvalid = true;
      validation.acquisitionDateMsg = "Invalid date format.";
    } else {
      if (additionalInfoState.dateOfManufacture !== null && event !== null) {
        let dateOfManufacture = moment(
          additionalInfoState.dateOfManufacture,
          "yyyy-MM-dd"
        );
        let acquisitionDate = moment(event, "yyyy-MM-dd");
        if (
          acquisitionDate <
          moment(new Date(Date.now()), "yyyy-MM-dd").subtract("1", "days")
        ) {
          if (acquisitionDate < dateOfManufacture) {
            validation.acquisitionDateMsg =
              "Date of Acquisition must be after Manufacture date";
            validation.acquisitionDateIsInvalid = true;
          } else {
            updateAdditionalInfoState({
              dateOfManufactureIsInValid: false,
              dateOfManufactureIsValid: true,
              dateOfManufactureMsg: "",
            });
          }
        } else {
          validation.acquisitionDateMsg =
            "Date of Acquisition cannot be today or future date.";
          validation.acquisitionDateIsInvalid = true;
        }
      } else if (
        event !== null &&
        moment(event, "yyyy-MM-dd").toDate() >
          moment(new Date(Date.now()), "yyyy-MM-dd")
            .subtract("1", "days")
            .toDate()
      ) {
        validation.acquisitionDateMsg =
          "Date of Acquisition cannot be today or future date.";
        validation.acquisitionDateIsInvalid = true;
      } else if (
        additionalInfoState.acquisitionDateIsRequired &&
        event === null
      ) {
        validation = validateAcquisitionDate(agencyInfoState.aac, event);
      }
    }

    if (!validation.acquisitionDateIsInvalid) {
      updateAdditionalInfoState({
        acquisitionDate: event,
      });
    }
    updateAdditionalInfoState({
      acquisitionDateIsInvalid: validation.acquisitionDateIsInvalid,
      acquisitionDateMsg: validation.acquisitionDateMsg,
    });
  }
  function handlePropertyDescriptionChange() {
    let validation = validatePropertyDescription(
      additionalInfoState.propertyDescription
    );

    updateAdditionalInfoState({
      propertyDescriptionIsInvalid: validation.isInvalid,
      propertyDescriptionErrorMsg: validation.validationError,
    });
  }
  function handleSrdRequestChangeButton() {
    updateAdditionalInfoState({
      modalShowSRD: true,
    });
  }

  function handleErdRequestChangeButton() {
    const agencyRep = !isEmptyCheck(icnState.aacCode)
      ? icnState.aacCode.substring(0, 2)
      : "";
    let numOfScreeningDays: number;
    new CommonApiService()
      .getInternalAgency(agencyRep)
      .then((response: any) => {
        numOfScreeningDays = response.data.screeningDays;
        const newERDEndDate = moment(propertyReportState.submittedDate)
          .add(numOfScreeningDays, "days")
          .toDate();
        updateAdditionalInfoState({
          excessReleaseEndDate: newERDEndDate,
          modalShowERD: true,
        });
      })
      .catch((error: any) => {
        //TODO - handle error
        // For the timebeing, do nothing incase of an error
      });
  }

  function handleDropAfterInternalScreeningChange(items) {
    let value = "N";

    const selectedItem = items.filter((item) => item.isSelected === true);
    if (selectedItem.length > 0) {
      value = selectedItem[0].id;
    }
    updateAdditionalInfoState({
      dropAfterInternalScreening: value !== "N",
    });

    if (value === "N") {
      srdUpdate();
    }
  }

  async function srdUpdate() {
    const srdValidation: SRDValidation = await validateSurplusReleaseDate(
      propertyInfoState.isExchangeSales,
      icnState.aacCode,
      fscState.fsc.fscCode,
      agencyInfoState.agencyBureau,
      fscVesselState.vesselFSCData.isVessel50FeetOrOver,
      additionalInfoState.condition,
      propertyReportState.isSubmitted,
      additionalInfoState.excessReleaseDate,
      agencyInfoState.isInternalAgency,
      propertyReportState.submittedDate,
      true
    );

    if (!isEmptyCheck(srdValidation.surplusReleaseDate)) {
      updateAdditionalInfoState({
        surplusReleaseDate: moment(srdValidation.surplusReleaseDate).toDate(),
      });
    }
  }

  function setDropFlagDisabledElement(dropAfterInternalScreeningOptions) {
    let dropFlag = dropAfterInternalScreeningOptions.map((option) => (
      <div className={"custom-control custom-radio"}>
        <input
          id={option.id + "dropAfterInternalScreening"}
          name={"dropAfterInternalScreening"}
          type="radio"
          value={option.value}
          checked={option.isSelected}
          className={"custom-control-input"}
          disabled={option.isDisabled}
        />
        <label className={"custom-control-label"}>{option.value}</label>
      </div>
    ));

    return dropFlag;
  }

  function setDropAfterInternalScreeningOptions() {
    if (
      agencyInfoState &&
      agencyInfoState.aac.startsWith("89") &&
      fscState.fsc.fscCode &&
      fscState.fsc.fscCode.startsWith("66")
    ) {
      return additionalInfoState.dropAfterInternalScreeningDisabledOptions;
    } else if (propertyInfoState.agencyControlNumber.startsWith("LOCAL")) {
      return additionalInfoState.dropAfterInternalScreeningDisabledOptions;
    } else {
      return additionalInfoState.dropAfterInternalScreeningOptions;
    }
  }
  function validateForm() {
    handleFairMarketValue({
      value: additionalInfoState.fairMarketValue,
      id: "fairMarketValue",
      name: "Fair Market Value",
    });
    handleDemilitarizationChange(additionalInfoState.demilitarization);
    handleManufacturerChange({ value: additionalInfoState.manufacturer });
    handleDateOfManufactureChange(additionalInfoState.dateOfManufacture);
    handleAcquisitionDateChange(additionalInfoState.acquisitionDate);
    if (!additionalInfoState.condition) {
      updateAdditionalInfoState({
        conditionIsInValid: true,
      });
    }
  }
  return useMemo(() => {
    const displayERD = agencyInfoState.isInternalAgency ? (
      <ExcessReleaseDate
        id={"excessReleaseDate"}
        isRequired={true}
        startDate={additionalInfoState.excessReleaseDate}
        isDisabled={true}
      />
    ) : (
      ""
    );

    const srdChangeRequest =
      !isEmptyCheck(props.propertyId) && propertyReportState.isSubmitted ? (
        <>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              className={""}
              isDisabled={
                UserUtils.hasPermission("SM") || UserUtils.hasPermission("APO")
                  ? false
                  : additionalInfoState.changeRequestIdSubmitted ||
                    additionalInfoState.isNotAllowedToRequest
              }
              icon={""}
              id={"requestSurplusReleaseDateChange"}
              isLoading={false}
              label={
                UserUtils.hasPermission("SM") || UserUtils.hasPermission("APO")
                  ? "Update Surplus Release Date"
                  : "Request Change"
              }
              // size={"sm"}
              type={"button"}
              value={""}
              variant={"primary"}
              onPress={handleSrdRequestChangeButton}
            />
            <ChangeRequestModal />
          </div>
        </>
      ) : (
        ""
      );

    const validateErdChangeRequest = () => {
      let isDisabled;
      switch (UserUtils.getUserType()) {
        case "SM":
          isDisabled = false;
          break;
        case "NUO":
        case "APO":
          moment(additionalInfoState.excessReleaseDate).isBefore(
            moment(),
            "day"
          )
            ? (isDisabled = true)
            : (isDisabled = false);
          break;
        default:
          additionalInfoState.changeRequestERDIdSubmitted ||
          moment(additionalInfoState.excessReleaseDate).isBefore(
            moment(),
            "day"
          )
            ? (isDisabled = true)
            : (isDisabled = false);
      }
      return isDisabled;
    };

    const erdChangeRequest =
      !isEmptyCheck(props.propertyId) &&
      agencyInfoState.isInternalAgency &&
      propertyReportState.isSubmitted ? (
        <>
          <div className={"tablet:grid-col-auto"}>
            <PPMSButton
              className={""}
              isDisabled={validateErdChangeRequest()}
              icon={""}
              id={"requestExcessReleaseDateChange"}
              isLoading={false}
              label={
                UserUtils.hasPermission("SM") || UserUtils.hasPermission("NU")
                  ? "Update Excess Release Date"
                  : "Request Change"
              }
              size={"lg"}
              type={"button"}
              value={""}
              variant={"primary"}
              onPress={handleErdRequestChangeButton}
            />
            <ChangeRequestModalERD
              excessReleaseDate={additionalInfoState.excessReleaseDate}
              excessReleaseEndDate={additionalInfoState.excessReleaseEndDate}
            />
          </div>
        </>
      ) : (
        ""
      );

    let dropAfterInternalScreeningOptions = setDropAfterInternalScreeningOptions();
    let dropFlagEle;
    if (
      (additionalInfoState.isDropAfterInternalScreeningRequired &&
        fscState.fsc.fscCode &&
        fscState.fsc.fscCode.startsWith("66") &&
        agencyInfoState.aac.startsWith("89")) ||
      (additionalInfoState.isDropAfterInternalScreeningRequired &&
        propertyInfoState.agencyControlNumber.startsWith("LOCAL"))
    ) {
      dropFlagEle = setDropFlagDisabledElement(
        dropAfterInternalScreeningOptions
      );
    }
    return (
      <>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-3"}>
            <PPMSToggleRadio
              id={"condition"}
              options={additionalInfoState.conditionOptions}
              isInline={false}
              isDisabled={false}
              name={"condition"}
              className={"condition"}
              label={"Condition:"}
              validationMessage={additionalInfoState.conditionErrorMsg}
              isInvalid={additionalInfoState.conditionIsInValid}
              isSingleSelect={true}
              onChange={handleConditionChange}
              isRequired={true}
            />
          </div>

          <div className={"grid-col-3"}>
            <PPMSToggleRadio
              id={"hazardous"}
              options={additionalInfoState.hazardousOptions}
              isInline={false}
              isDisabled={false}
              name={"hazardous"}
              className={"hazardous"}
              label={"Hazardous:"}
              validationMessage={additionalInfoState.hazardousErrorMsg}
              isSingleSelect={true}
              onChange={handleHazardousChange}
              isRequired={true}
            />
          </div>

          <div className={"grid-col-3"}>
            <PPMSToggleRadio
              id={"fightSafetyCriticalAircraftPart"}
              options={additionalInfoState.flightSafetyOptions}
              isInline={false}
              isDisabled={false}
              name={"fightSafetyCriticalAircraftPart"}
              className={"fight-safety-critical-aircraft-part"}
              label={"Flight Safety Critical Aircraft Part:"}
              validationMessage={""}
              isSingleSelect={true}
              onChange={handleFlightSafetyCriticalAircraftPartChange}
              isRequired={true}
            />
          </div>
          <div className={"grid-col-3"}>
            {agencyInfoState.isInternalAgency ? (
              (fscState.fsc.fscCode &&
                fscState.fsc.fscCode.startsWith("66") &&
                agencyInfoState.aac.startsWith("89")) ||
              propertyInfoState.agencyControlNumber.startsWith("LOCAL") ? (
                //added this as PPMS-Toggle was not working for disabled buttons
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col"}>
                    <PPMSFormGroup className={"usa-form-group form-group"}>
                      <PPMSLabel
                        className={"usa-label form-label"}
                        htmlFor={"dropFlag"}
                      >
                        Drop After Internal Screening
                        {additionalInfoState.isDropAfterInternalScreeningRequired && (
                          <span className={"text-danger"}>*</span>
                        )}
                      </PPMSLabel>
                      <div className={"ppms-form-control form-control"}>
                        {dropFlagEle}
                      </div>
                    </PPMSFormGroup>
                  </div>
                </div>
              ) : (
                <PPMSToggleRadio
                  isInline={false}
                  name={"dropAfterInternalScreening"}
                  isRequired={
                    additionalInfoState.isDropAfterInternalScreeningRequired
                  }
                  isDisabled={false}
                  options={dropAfterInternalScreeningOptions}
                  validationMessage={""}
                  onChange={handleDropAfterInternalScreeningChange}
                  className=""
                  id=""
                  label={"Drop After Internal Agency Screening:"}
                />
              )
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <PPMSSelect
              selectName={"demilitarization"}
              label={"Demilitarization"}
              values={
                UserUtils.isSalesUser()
                  ? demilitarizationForSales
                  : additionalInfoState.demilitarizationOptions
              }
              isRequired={true}
              onChange={(event) =>
                handleDemilitarizationChange(event.target.value)
              }
              identifierValue={"value"}
              identifierKey={"id"}
              isInvalid={additionalInfoState.demilitarizationIsInvalid}
              isValid={additionalInfoState.demilitarizationlIsValid}
              infoTipClass={"ppms-usa-input-info-body"}
              selectedValue={additionalInfoState.demilitarization}
              validationMessage={additionalInfoState.demilitarizationErrorMsg}
            />
          </div>
        </div>

        {!UserUtils.isSalesUser() && (
          <div className={"grid-row grid-gap-4"}>
            <div className={"tablet:grid-col-5"}>
              {displayERD}
              {erdChangeRequest}
            </div>
          </div>
        )}
        {!additionalInfoState.dropAfterInternalScreening &&
          !UserUtils.isSalesUser() && (
            <div className={"grid-row grid-gap-4"}>
              <div className={"tablet:grid-col-5"}>
                <SurplusReleaseDate
                  id={"surplusReleaseDate"}
                  startDate={additionalInfoState.surplusReleaseDate}
                  isDisabled={
                    (UserUtils.isUserApo() || UserUtils.isSystemAdminUser()) &&
                    !propertyReportState.isSubmitted
                      ? false
                      : true
                  }
                />
                {srdChangeRequest}
              </div>
            </div>
          )}
        <br></br>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-6"}>
            <PPMSInput
              id={"fairMarketValue"}
              name={"Fair Market Value"}
              label={"Fair Market Value"}
              hint={"Per Unit"}
              isRequired={additionalInfoState.fairMarketValueIsRequired}
              isDisabled={false}
              inputType={"text"}
              value={additionalInfoState.fairMarketValue}
              onBlur={(event) => handleFairMarketValue(event.target)}
              onChange={(event) => {
                let fairMarketValue = event.target.value
                  .replace(/([^.]*\.[^.]*)\./g, "$1")
                  .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
                  .toString();

                fairMarketValue = fairMarketValue.replace(/^[0]+$/, "");

                if (/^\d+\.\d\d\d$/.test(fairMarketValue)) {
                  fairMarketValue = Number(fairMarketValue).toFixed(2);
                }

                fairMarketValue =
                  "$" +
                  fairMarketValue
                    .toString()
                    // .replace(/([^.]*\.[^.]*)\./g, '$1')
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    .replace("$", "");

                updateAdditionalInfoState({ fairMarketValue });
              }}
              validationMessage={additionalInfoState.fairMarketValueMsg}
              maxLength={50}
              minLength={0}
              isInvalid={additionalInfoState.fairMarketValueIsInValid}
              isValid={additionalInfoState.fairMarketValueIsValid}
              placeHolder={"$0.00"}
              infoTipContent={additionalInfoState.fairMarketValueTooltip}
              className="big-label"
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-4"}>
            <PPMSInput
              id={"manufacturer"}
              name={"manufacturer"}
              label={"Manufacturer"}
              isDisabled={false}
              inputType={"text"}
              value={additionalInfoState.manufacturer}
              onBlur={(event) => handleManufacturerChange(event.target)}
              onChange={(event) =>
                updateAdditionalInfoState({
                  manufacturer: event.target.value,
                })
              }
              maxLength={20}
              minLength={0}
              isRequired={additionalInfoState.manufactureIsRequired}
              isInvalid={additionalInfoState.manufacturerIsInValid}
              isValid={additionalInfoState.manufacturerIsValid}
              validationMessage={additionalInfoState.manufacturerValueMsg}
            />
          </div>
        </div>

        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-5"}>
            <PPMSDatepicker
              id={"dateOfManufacture"}
              format={"MM/DD/YYYY"}
              startDate={additionalInfoState.dateOfManufacture}
              updateDate={handleDateOfManufactureChange}
              formField={true}
              display={"bottom-end"}
              label={"Date of Manufacture"}
              placeholder={"Date of Manufacture"}
              maxDate={moment(new Date(Date.now()))
                .subtract("1", "days")
                .toDate()}
              isRequired={additionalInfoState.dateOfManufactureIsRequired}
              isInvalid={additionalInfoState.dateOfManufactureIsInValid}
              validationMessage={additionalInfoState.dateOfManufactureMsg}
            />
          </div>
          <div className={"tablet:grid-col-5"}>
            <PPMSDatepicker
              id={"acquisitionDate"}
              format={"MM/DD/YYYY"}
              startDate={additionalInfoState.acquisitionDate}
              updateDate={handleAcquisitionDateChange}
              formField={true}
              display={"bottom-end"}
              label={"Acquisition Date "}
              labelBold={true}
              isRequired={additionalInfoState.acquisitionDateIsRequired}
              placeholder={"Acquisition Date"}
              validationMessage={additionalInfoState.acquisitionDateMsg}
              maxDate={moment(new Date(Date.now()))
                .subtract("1", "days")
                .toDate()}
              isInvalid={additionalInfoState.acquisitionDateIsInvalid}
              useDefaultValidation={false}
            />
          </div>
        </div>

        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <PPMSTextEditor
              id={"propertyDescription"}
              value={additionalInfoState.propertyDescription}
              onChange={(descData: any) => {
                updateAdditionalInfoState({ propertyDescription: descData });
              }}
              onBlur={handlePropertyDescriptionChange}
              label={"Property Description"}
              isInvalid={additionalInfoState.propertyDescriptionIsInvalid}
              isValid={false}
              isRequired={true}
              validationMessage={
                additionalInfoState.propertyDescriptionErrorMsg
              }
              onBlurCheck={true}
            />
          </div>
        </div>
      </>
    );
  }, [fscState.fcsSelectedValue, additionalInfoState, agencyInfoState]);
}
