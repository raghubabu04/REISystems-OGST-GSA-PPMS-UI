import React, { ChangeEvent } from "react";
import { PPMSFormGroup } from "../form/PPMS-form-group";
import { DatePickerV2 } from "./components/DatePicker";
import PPMSLabel from "../form/PPMS-label";
import { DEFAULT_MIN_DATE } from "./constants/Constants";
import PPMSErrorMessage from "../form/PPMS-error-message";
interface PPMSDatePickerV2Props {
  id: string;
  name: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string;
  minDate?: string;
  maxDate?: string;
  rangeDate?: string;
  onChange?: ((val?: string) => void) &
    ((event: ChangeEvent<HTMLInputElement>) => void);
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLDivElement>
  ) => void;
  isInvalid?: boolean;
  validationMessage?: string;
  hint?: string;
  label?: string;
}
function PPMSDatePickerV2(props: PPMSDatePickerV2Props) {
  const {
    id,
    name,
    defaultValue,
    disabled,
    required,
    minDate = DEFAULT_MIN_DATE,
    maxDate,
    rangeDate,
    onChange,
    onBlur,
    isInvalid,
    validationMessage,
    hint,
    label,
  } = props;

  return (
    <PPMSFormGroup error={isInvalid}>
      <PPMSLabel id={`${label}-label`} htmlFor={name}>
        {label}
      </PPMSLabel>
      <div className="usa-hint" id={`${label}-hint`}>
        {hint ? hint : "mm/dd/yyyy"}
      </div>
      <DatePickerV2
        id={id}
        name={name}
        aria-describedby={`${label}-label ${label}-hint`}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        defaultValue={defaultValue}
        required={required}
        rangeDate={rangeDate}
        onChange={onChange}
        onBlur={onBlur}
        validationStatus={isInvalid ? "error" : ""}
      />
      {isInvalid && (
        <PPMSErrorMessage id={`errorMessage-${id}`}>
          {validationMessage}
        </PPMSErrorMessage>
      )}
    </PPMSFormGroup>
  );
}

export default PPMSDatePickerV2;
