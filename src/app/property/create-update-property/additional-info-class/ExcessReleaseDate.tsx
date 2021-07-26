import React, { useContext } from "react";
import { PropertyContext } from "../PropertyContext";
import { validateExcessReleaseDate } from "../validations/propertyFieldValidations";
import moment from "moment";

import { validateDateOnModal } from "../validations/ChangeRequestModalValidation";
import { PPMSDatepicker } from "../../../../ui-kit/components/common/datepicker/PPMS-datepicker";

interface ERDProps {
  startDate: Date;
  endDate?: Date;
  id: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  isValid?: boolean;
  isDisabled?: boolean;
  validationMsg?: string;
  message?: string;
}

function ExcessReleaseDate(props: ERDProps) {
  const {
    updateAdditionalInfoState,
    icnState,
    fscState,
    propertyInfoState,
  } = useContext(PropertyContext);

  function handleExcessReleaseDateChange(event: any) {
    let vali = validateDateOnModal(event);

    updateAdditionalInfoState({
      erdOnModalIsInvalid: vali.isInvalid,
      erdOnModalIsValid: vali.isValid,
      erdOnModalErrorMsg: vali.validationError,
    });
    updateAdditionalInfoState({
      [`${props.id}`]: event,
    });
  }

  return (
    <div className={"grid-row grid-gap-4"}>
      <div className={"grid-col"}>
        <PPMSDatepicker
          id={`${props.id}`}
          format={"MM/DD/YYYY"}
          startDate={props.startDate}
          maxDate={props.endDate}
          minDate={moment(new Date()).toDate()}
          updateDate={handleExcessReleaseDateChange}
          display={"bottom-end"}
          label={"Excess Release Date"}
          isRequired={props.isRequired ? props.isRequired : false}
          placeholder={"Excess Release Date"}
          validationMessage={props.validationMsg}
          isInvalid={props.isInvalid}
          isDisabled={props.isDisabled ? props.isDisabled : false}
          useDefaultValidation={false}
          infoTipContent={
            "You can request the Excess Release Date to be from reported date until your agency's default Excess (Internal screening) release date."
          }
        />
      </div>
    </div>
  );
}

export default ExcessReleaseDate;
