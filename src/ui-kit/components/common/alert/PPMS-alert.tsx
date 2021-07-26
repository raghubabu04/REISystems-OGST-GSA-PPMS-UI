import React from "react";
import classnames from "classnames";

interface AlertProps {
  type: "success" | "warning" | "error" | "info";
  heading?: React.ReactNode;
  children?: React.ReactNode;
  cta?: React.ReactNode;
  dismiss?: React.ReactNode;
  slim?: boolean;
  noIcon?: boolean;
  validation?: boolean;
}

export const PPMSAlert = ({
  type,
  heading,
  cta,
  dismiss,
  children,
  slim,
  noIcon,
  className,
  validation,
  ...props
}: AlertProps & React.HTMLAttributes<HTMLDivElement>): React.ReactElement => {
  const classes = classnames(
    "usa-alert",
    {
      "usa-alert--success": type === "success",
      "usa-alert--warning": type === "warning",
      "usa-alert--error": type === "error",
      "usa-alert--info": type === "info",
      "usa-alert--slim": slim,
      "usa-alert--no-icon": noIcon,
      "usa-alert--validation": validation,
    },
    className
  );

  return (
    <div className={classes} data-testid="alert" {...props}>
      {dismiss && <div style={{ float: "right" }}>{dismiss}</div>}
      <div className="usa-alert__body">
        {heading && <h3 className="usa-alert__heading">{heading}</h3>}
        {children &&
          (validation ? (
            children
          ) : (
            <span className="usa-alert__text">{children}</span>
          ))}
      </div>
      {cta && <div>{cta}</div>}
    </div>
  );
};

export default PPMSAlert;
