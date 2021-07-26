import React from "react";
import classnames from "classnames";

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
  error?: boolean;
  id?: string;
}

export const PPMSFormGroup = (props: FormGroupProps): React.ReactElement => {
  const { children, className, error } = props;

  const classes = classnames(
    "usa-form-group",
    { "usa-form-group--error": error },
    className
  );

  return (
    <div data-testid="formGroup" id={props.id} className={classes}>
      {children}
    </div>
  );
};
