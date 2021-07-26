import React from "react";
import classnames from "classnames";
import { PPMSPopover } from "../PPMS-popover";
import { FaInfoCircle } from "react-icons/fa";

interface RadioProps {
  id: string;
  name: string;
  className?: string;
  label: React.ReactNode;
  infoTip?: string;
  inputRef?:
    | string
    | ((instance: HTMLInputElement | null) => void)
    | React.RefObject<HTMLInputElement>
    | null
    | undefined;
}

export const PPMSRadio = (
  props: RadioProps & JSX.IntrinsicElements["input"]
): React.ReactElement => {
  const {
    id,
    name,
    className,
    label,
    infoTip,
    inputRef,
    ...inputProps
  } = props;

  const classes = classnames("usa-radio", className);
  const showInfoTip = (infoTip, label, id) => (
    <PPMSPopover
      trigger={["click"]}
      id={id + "InfoTip"}
      placement={"right"}
      popoverTitle={label}
      popoverContent={infoTip}
      className={"radio-info-tip"}
      triggerSource={
        <button
          id={`${id}-tooltip-button`}
          type={"button"}
          className={"usa-button  usa-button--unstyled"}
          title="additional information"
        >
          <FaInfoCircle />
        </button>
      }
    />
  );

  return (
    <div data-testid="radio" className={classes}>
      <input
        key={Math.random()}
        className="usa-radio__input"
        id={id}
        type="radio"
        name={name}
        ref={inputRef}
        {...inputProps}
        autoComplete="off"
      />
      <label className="usa-radio__label" htmlFor={id}>
        {label} {infoTip && showInfoTip(infoTip, label, id)}
      </label>
    </div>
  );
};

export default PPMSRadio;
