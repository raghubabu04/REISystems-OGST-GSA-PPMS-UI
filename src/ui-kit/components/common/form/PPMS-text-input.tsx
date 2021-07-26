import React from "react";
import classnames from "classnames";
type TextInputRef =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;
interface RequiredTextInputProps {
  id: string;
  name: string;
  type:
    | "text"
    | "email"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "time"
    | "datetime-local"
    | "url";
  ariaLabel?: string;
}

interface CustomTextInputProps {
  className?: string;
  validationStatus?: "error" | "success" | "";
  inputSize?: "small" | "medium";
  inputRef?: TextInputRef;
}

export type OptionalTextInputProps = CustomTextInputProps &
  JSX.IntrinsicElements["input"];

export type TextInputProps = RequiredTextInputProps & OptionalTextInputProps;

export const PPMSTextInput = (props: TextInputProps): React.ReactElement => {
  const {
    id,
    name,
    type,
    ariaLabel,
    className,
    validationStatus,
    inputSize,
    inputRef,
    ...inputProps
  } = props;

  const isError = validationStatus ? validationStatus === "error" : false;
  const isSuccess = validationStatus ? validationStatus === "success" : false;
  const isSmall = inputSize ? inputSize === "small" : false;
  const isMedium = inputSize ? inputSize === "medium" : false;
  const classes = classnames(
    "usa-input",
    {
      "usa-input--error": isError,
      "usa-input--success": isSuccess,
      "usa-input--small": isSmall,
      "usa-input--medium": isMedium,
    },
    className
  );

  return (
    <input
      data-testid="textInput"
      className={classes}
      id={id}
      aria-label={ariaLabel}
      key={`key-${id}`}
      name={name}
      type={type}
      ref={inputRef}
      {...inputProps}
    />
  );
};

export default PPMSTextInput;
