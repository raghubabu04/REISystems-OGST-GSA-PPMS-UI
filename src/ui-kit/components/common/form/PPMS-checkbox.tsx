import React, { useEffect } from "react";
import classnames from "classnames";
import { PageUtils } from "../../../../utils/PageUtils";
interface CheckboxProps {
  id: string;
  name: string;
  className?: string;
  label: React.ReactNode;
  inputRef?: React.RefObject<HTMLInputElement>;
  isInvalid:boolean;
}

export const PPMSCheckbox = (
  props: CheckboxProps & JSX.IntrinsicElements["input"]
): React.ReactElement => {
  const { id, name, className, label, inputRef,isInvalid, ...inputProps } = props;

  const classes = classnames("usa-checkbox", className);
  const ref = React.createRef<HTMLInputElement>();


  useEffect(() => {
    let compRef = inputRef ? inputRef : ref;
    if (isInvalid) {
      PageUtils.setCustomValidity(compRef.current, "Error");
    } else {
      PageUtils.setCustomValidity(compRef.current, "");
    }
  }, [isInvalid]);
  return (
    <div data-testid="checkbox" className={classes}>
      <input
        key={Math.random()}
        className="usa-checkbox__input"
        id={id}
        type="checkbox"
        name={name}
        ref={inputRef ? inputRef : ref}
        {...inputProps}
        autoComplete="off"
      />
      <label className="usa-checkbox__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default PPMSCheckbox;
