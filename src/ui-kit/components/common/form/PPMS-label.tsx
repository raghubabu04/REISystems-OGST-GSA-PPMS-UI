import React from "react";
import classnames from "classnames";

interface LabelProps {
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
  error?: boolean;
  hint?: React.ReactNode;
  srOnly?: boolean;
  infoTipContent?: any;
  id?: string;
  addBreak?: boolean;
}

export const PPMSLabel = (props: LabelProps): React.ReactElement => {
  const {
    children,
    htmlFor,
    className,
    error,
    hint,
    srOnly,
    infoTipContent,
    id,
    addBreak,
  } = props;

  const classes = classnames(
    {
      "usa-label": !srOnly,
      "usa-sr-only": srOnly,
      "usa-label--error": error,
    },
    className
  );
  const hintValue = hint && <span className="usa-hint"> {hint} </span>;
  return (
    <label id={id} data-testid="label" className={classes} htmlFor={htmlFor}>
      {children} {infoTipContent}
      {addBreak ? (
        <>
          {" "}
          <div className="grid-row hint-break-height">{hint}</div>
        </>
      ) : (
        <> {hintValue}</>
      )}
    </label>
  );
};

export default PPMSLabel;
