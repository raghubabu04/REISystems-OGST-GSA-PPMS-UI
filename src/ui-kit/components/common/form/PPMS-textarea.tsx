import React from "react";
import classnames from "classnames";
type TextareaRef =
  | string
  | ((instance: HTMLTextAreaElement | null) => void)
  | React.RefObject<HTMLTextAreaElement>
  | null
  | undefined;

export interface TextareaProps {
  id: string;
  label: string;
  name: string;
  className?: string;
  error?: boolean;
  success?: boolean;
  children?: React.ReactNode;
  inputRef?: TextareaRef;
}

export const PPMSTextarea = (
  props: TextareaProps & JSX.IntrinsicElements["textarea"]
): React.ReactElement => {
  const {
    id,
    label,
    name,
    className,
    error,
    success,
    children,
    inputRef,
    ...inputProps
  } = props;

  const classes = classnames(
    "usa-textarea",
    {
      "usa-input--error": error,
      "usa-input--success": success,
    },
    className
  );

  return (
    <textarea
      data-testid="textarea"
      className={classes}
      id={id}
      aria-label={label}
      name={name}
      ref={inputRef}
      {...inputProps}
    >
      {children}
    </textarea>
  );
};

export default PPMSTextarea;
