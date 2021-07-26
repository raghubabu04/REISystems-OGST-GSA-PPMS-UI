import React, { useContext, useEffect } from "react";
import { PPMSSelect } from "../../../../../ui-kit/components/common/select/PPMS-select";
import { campaignRunValues } from "../../constants/Constants";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSDatepickerAdvanced } from "../../../../../ui-kit/components/common/datepicker/PPMS-date-picker-advanced";
import moment from "moment";
import { MarketingCampaignContext } from "../MarketingCampaignContext";
import {
  validateCampaignName,
  validateCampaignRun,
  verifyCampaignName,
} from "../../validations/AddEditCampaignValidations";
import { PPMSLabel } from "../../../../../ui-kit/components/common/form/PPMS-label";

export interface CampaignDetailsProps {}

export function CampaignDetailsClass(props: CampaignDetailsProps) {
  var currentDate = moment().toDate();
  var endDateValue = moment()
    .set("year", moment().toDate().getFullYear() + 1)
    .toDate();
  const { campaignDetailsState, updateCampaignDetailsState } = useContext(
    MarketingCampaignContext
  );
  useEffect(() => {
    updateCampaignDetailsState({
      campaignStartDate: currentDate,
      campaignEndDate: endDateValue,
    });
  }, []);

  //Campaign Name
  function handleCampaignNameInputChange(event) {
    const inputValue = event.target.value;
    if (campaignDetailsState.typingTimeout) {
      clearTimeout(campaignDetailsState.typingTimeout);
    }
    let errorMessage = validateCampaignName(inputValue);
    if (errorMessage) {
      if (!errorMessage.isInvalid) {
        updateCampaignDetailsState({
          campaignNameValidationMessage: "",
          campaignNameIsInvalid: false,
        });
        updateCampaignDetailsState({
          typingTimeout: setTimeout(function () {
            verifyCampaignName(inputValue, updateCampaignDetailsState);
          }, 500),
        });
      } else {
        updateCampaignDetailsState({
          campaignNameValidationMessage: errorMessage.validationError,
          campaignNameIsInvalid: errorMessage.isInvalid,
        });
      }
    }
    updateCampaignDetailsState({
      campaignName: inputValue,
    });
  }

  // Campaign Date
  function handleCampaignStartDate(event) {
    let selectedStartDate = moment(event).toDate();
    updateCampaignDetailsState({
      campaignStartDate: selectedStartDate,
    });
  }

  function handleCampaignEndDate(event) {
    let selectedEndDate = moment(event).toDate();
    updateCampaignDetailsState({
      campaignEndDate: selectedEndDate,
    });
  }

  function handleIsInvalidDate(event) {
    if (event.typeDate === "startDate") {
      updateCampaignDetailsState({
        campaignStartDateIsInvalid: event.isInvalid,
      });
    } else {
      updateCampaignDetailsState({
        campaignEndDateIsInvalid: event.isInvalid,
      });
    }
  }

  // Campaign Run Select
  function handleCampaignRunSelectChange(event) {
    const selectValue = event.target.value;
    let errorMessage = validateCampaignRun(event.target.value);
    if (errorMessage) {
      updateCampaignDetailsState({
        campaignRunIsInvalid: errorMessage.isInvalid,
        campaignRunValidationMessage: errorMessage.validationError,
      });
    }
    updateCampaignDetailsState({
      campaignRun: selectValue,
    });
  }

  return (
    <>
      <div className="grid-row">
        <div className="grid-col-8">
          <PPMSInput
            isInvalid={campaignDetailsState.campaignNameIsInvalid}
            isValid={false}
            id={"campaign-name"}
            name={"campaign-name"}
            isRequired={true}
            inputType={"text"}
            isDisabled={false}
            label={"Campaign Name"}
            maxLength={52}
            minLength={10}
            validationMessage={
              campaignDetailsState.campaignNameValidationMessage
            }
            onChange={handleCampaignNameInputChange}
            value={campaignDetailsState.campaignName}
          />
        </div>
      </div>
      <div className="grid-row grid-gap-2px mt-1">
        <div className="grid-col labelMargin">
          <PPMSLabel htmlFor={"start-date end-date"}>Campaign Date</PPMSLabel>
          <PPMSDatepickerAdvanced
            isValid={false}
            isRequired={true}
            minStartDate={currentDate}
            maxDate={moment(campaignDetailsState.campaignEndDate)
              .subtract(1, "day")
              .toDate()}
            minEndDate={moment(campaignDetailsState.campaignStartDate)
              .add(1, "day")
              .toDate()}
            message={"Start date"}
            endDayPickerdisplay={"left"}
            startDayPickerdisplay={"right"}
            id={"advanced"}
            isStartDateInvalid={campaignDetailsState.campaignStartDateIsInvalid}
            startDateValidationMessage={
              campaignDetailsState.campaignStartDateValidationMessage
            }
            startDate={
              campaignDetailsState.campaignStartDate
                ? campaignDetailsState.campaignStartDate
                : currentDate
            }
            isEndDateInvalid={campaignDetailsState.campaignEndDateIsInvalid}
            endDateValidationMessage={
              campaignDetailsState.campaignEndDateValidationMessage
            }
            endDate={
              campaignDetailsState.campaignEndDate
                ? campaignDetailsState.campaignEndDate
                : endDateValue
            }
            updateDate={handleCampaignStartDate}
            updateEndDate={handleCampaignEndDate}
            updateIsInvalidDates={handleIsInvalidDate}
            label={"Campaign"}
          />
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col-6">
          <PPMSSelect
            selectName={"campaign-run"}
            identifierKey={"id"}
            identifierValue={"value"}
            id={"select-campaign-run"}
            name={"campaign-run"}
            values={campaignRunValues}
            label={"How often should the campaign run"}
            isRequired={true}
            placeholderValue={"Select Campaign Option"}
            onChange={handleCampaignRunSelectChange}
            selectedValue={campaignDetailsState.campaignRun}
            validationMessage={
              campaignDetailsState.campaignRunValidationMessage
            }
            isInvalid={campaignDetailsState.campaignRunIsInvalid}
          />
        </div>
      </div>
    </>
  );
}
