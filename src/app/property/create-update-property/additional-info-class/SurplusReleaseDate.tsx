import React, { useContext } from "react";
import { PropertyContext } from "../PropertyContext";
import { validateDateOnModal } from "../validations/ChangeRequestModalValidation";
import moment from "moment";
import { PPMSDatepicker } from "../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import { UserUtils } from "../../../../utils/UserUtils";

interface SRDProps {
  startDate: Date;
  id: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  isValid?: boolean;
  isDisabled?: boolean;
  validationMsg?: string;
}
function SurplusReleaseDate(props: SRDProps) {
  const { updateAdditionalInfoState, additionalInfoState } = useContext(
    PropertyContext
  );

  function handleSurplusReleaseDateChange(event: any) {
    updateAdditionalInfoState({
      [`${props.id}`]: event,
    });
    let validation = validateDateOnModal(event);
    updateAdditionalInfoState({
      srdOnModalIsInvalid: validation.isInvalid,
      srdOnModalIsValid: validation.isValid,
      srdOnModalErrorMsg: validation.validationError,
    });
  }

  return (
    <PPMSDatepicker
      id={`${props.id}`}
      format={"MM/DD/YYYY"}
      startDate={props.startDate}
      updateDate={handleSurplusReleaseDateChange}
      display={"bottom-end"}
      label={"Surplus Release Date"}
      isRequired={true}
      placeholder={"Surplus Release Date"}
      validationMessage={props.validationMsg}
      isInvalid={props.isInvalid ? props.isInvalid : false}
      minDate={
        additionalInfoState.excessReleaseDate
          ? moment(additionalInfoState.excessReleaseDate)
              .add("1", "days")
              .toDate()
          : moment(new Date(Date.now())).toDate()
      }
      maxDate={
        UserUtils.hasPermission("SM")
          ? moment(new Date(Date.now())).add(2100, "years").toDate()
          : moment(additionalInfoState.surplusReleaseDate)
              .add("15", "days")
              .toDate()
      }
      useDefaultValidation={false}
      infoTipContent={
        props.isDisabled
          ? "Please contact your Area Property Officer to change Surplus Release Date. SRD change can be requested after the item had been screened for 3 days"
          : "You can request to change the Surplus Release Date to be the 3rd day from the report date until 15 days after the current Surplus Release Date"
      }
      isDisabled={props.isDisabled ? props.isDisabled : false}
    />
  );
}

export default SurplusReleaseDate;
