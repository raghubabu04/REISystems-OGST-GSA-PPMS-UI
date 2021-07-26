import React from "react";
import classnames from "classnames";

interface DropdownProps {
  id: string;
  name: string;
  title?: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
  inputRef?:
    | string
    | ((instance: HTMLSelectElement | null) => void)
    | React.RefObject<HTMLSelectElement>
    | null
    | undefined;
  validationStatus?: "error" | "success" | "";
  inputSize?: "small" | "medium";
}

export const PPMSDropdown = (
  props: DropdownProps & JSX.IntrinsicElements["select"]
): React.ReactElement => {
  const {
    id,
    name,
    className,
    ariaLabel,
    title,
    inputRef,
    validationStatus,
    inputSize,
    children,
    ...inputProps
  } = props;
  const isError = validationStatus ? validationStatus === "error" : false;
  const isSuccess = validationStatus ? validationStatus === "success" : false;
  const isSmall = inputSize ? inputSize === "small" : false;
  const isMedium = inputSize ? inputSize === "medium" : false;
  const classes = classnames(
    "usa-select",
    {
      "usa-input--error": isError,
      "usa-input--success": isSuccess,
      "usa-input--small": isSmall,
      "usa-input--medium": isMedium,
    },
    className
  );

  return (
    <select
      data-testid="dropdown"
      className={classes}
      key={`key-${id}`}
      id={id}
      name={name}
      ref={inputRef}
      {...inputProps}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </select>
  );
};

export default PPMSDropdown;
