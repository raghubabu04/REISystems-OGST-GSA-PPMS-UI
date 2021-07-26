import React, { useState, useEffect } from "react";
import classnames from "classnames";
import PPMSTextarea, { TextareaProps } from "../form/PPMS-textarea";
import PPMSTextInput, { TextInputProps } from "../form/PPMS-text-input";
const defaultCharacterCount = (text: string): number => Array.from(text).length;
const defaultMessage = (count: number, max: number): string => {
  const emptyMessageFormat = `${max} characters allowed`;
  const remainingPluralFormat = "$0 characters left";
  const remainingSingularFormat = "$0 character left";
  const overSingularFormat = "$0 character over limit";
  const overPluralFormat = "$0 characters over limit";
  const remainingCount = max - count;

  switch (remainingCount) {
    case max:
      return emptyMessageFormat;
    case 1:
      return remainingSingularFormat.replace("$0", "1");
    case -1:
      return overSingularFormat.replace("$0", "1");
    default:
      return remainingCount >= 0
        ? remainingPluralFormat.replace("$0", remainingCount.toString())
        : overPluralFormat.replace("$0", Math.abs(remainingCount).toString());
  }
};

/* Types */
interface BaseCharacterCountProps {
  id: string;
  name: string;
  maxLength: number;
  defaultValue?: string;
  className?: string;
  isTextArea?: boolean;
  getCharacterCount?: (text: string) => number;
  getMessage?: (remainingCount: number, max: number) => string;
}

type TextInputCharacterCountProps = BaseCharacterCountProps & TextInputProps;

type TextareaCharacterCountProps = BaseCharacterCountProps &
  TextareaProps &
  JSX.IntrinsicElements["textarea"];

/* Main */
export const CharacterCount = ({
  id,
  name,
  className,
  maxLength,
  defaultValue = "",
  isTextArea = false,
  getCharacterCount = defaultCharacterCount,
  getMessage = defaultMessage,
  ...remainingProps
}:
  | TextInputCharacterCountProps
  | TextareaCharacterCountProps): React.ReactElement => {
  const initialCount = getCharacterCount(defaultValue);
  const [length, setLength] = useState(initialCount);
  const [message, setMessage] = useState(getMessage(initialCount, maxLength));
  const [isValid, setIsValid] = useState(initialCount < maxLength);

  const classes = classnames("usa-character-count__field", className);
  const messageClasses = classnames(
    "usa-hint",
    "usa-character-count__message",
    { "usa-character-count__message--invalid": !isValid }
  );

  useEffect(() => {
    setMessage(getMessage(length, maxLength));
    setIsValid(length <= maxLength);
  }, [length]);

  const handleBlur = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback?: (e: any) => void
  ): void => {
    const validationMessage = !isValid ? "The content is too long." : "";
    e.target.setCustomValidity(validationMessage);
    if (callback) callback(e);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback?: (e: any) => void
  ): void => {
    const {
      target: { value = "" },
    } = e;
    setLength(getCharacterCount(value));

    if (callback) callback(e);
  };

  let InputComponent: React.ReactElement;
  if (isTextArea) {
    const {
      label,
      onBlur,
      onChange,
      inputRef,
      ...textAreaProps
    } = remainingProps as Partial<TextareaCharacterCountProps>;

    InputComponent = (
      <PPMSTextarea
        id={id}
        label={label}
        name={name}
        className={classes}
        defaultValue={defaultValue}
        onBlur={(e): void => handleBlur(e, onBlur)}
        onChange={(e): void => handleChange(e, onChange)}
        inputRef={inputRef}
        {...textAreaProps}
      />
    );
  } else {
    const {
      onBlur,
      onChange,
      inputRef,
      type = "text",
      ...inputProps
    } = remainingProps as Partial<TextInputCharacterCountProps>;

    InputComponent = (
      <PPMSTextInput
        id={id}
        type={type}
        name={name}
        className={classes}
        defaultValue={defaultValue}
        onBlur={(e): void => handleBlur(e, onBlur)}
        onChange={(e): void => handleChange(e, onChange)}
        inputRef={inputRef}
        {...inputProps}
      />
    );
  }

  return (
    <>
      {InputComponent}
      <span
        data-testid="characterCountMessage"
        id={`${id}-info`}
        className={messageClasses}
        aria-live="polite"
      >
        {message}
      </span>
    </>
  );
};

export default CharacterCount;
