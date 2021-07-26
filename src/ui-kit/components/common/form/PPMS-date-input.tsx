import React from "react";
import classnames from "classnames";
import PPMSTextInput, { OptionalTextInputProps } from "./PPMS-text-input";
import { PPMSFormGroup } from "./PPMS-form-group";
import PPMSLabel from "./PPMS-label";

interface DateInputElementProps {
  id: string;
  name: string;
  label: string;
  unit: "month" | "day" | "year";
  maxLength: number;
  minLength?: number;
}

export const PPMSDateInput = (
  props: DateInputElementProps & OptionalTextInputProps
): React.ReactElement => {
  const {
    id,
    name,
    label,
    unit,
    maxLength,
    minLength,
    className,
    ...inputProps
  } = props;

  const formGroupClasses = classnames({
    "usa-form-group--month": unit == "month",
    "usa-form-group--day": unit == "day",
    "usa-form-group--year": unit == "year",
  });

  const inputClasses = classnames("usa-input--inline", className);

  return (
    <PPMSFormGroup className={formGroupClasses}>
      <PPMSLabel htmlFor={id}>{label}</PPMSLabel>
      <PPMSTextInput
        {...inputProps}
        className={inputClasses}
        id={id}
        name={name}
        type="text"
        maxLength={maxLength}
        minLength={minLength}
        pattern="[0-9]*"
        inputMode="numeric"
      />
    </PPMSFormGroup>
  );
};

export default PPMSDateInput;
