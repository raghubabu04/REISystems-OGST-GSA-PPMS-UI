import React from "react";
import classnames from "classnames";

export interface PPMSStepIndicatorProps {
  id: string;
  type?: "default" | "centered" | "counters" | "small-counters";
  className?: string;
  showExtras?: boolean;
  steps: any[];
}
export interface PPMSStepIndicatorState {}
export const PPMSStepIndicator = (
  props: PPMSStepIndicatorProps
): React.ReactElement => {
  const { id, type, className, showExtras, steps } = props;
  const currentIndex = steps.findIndex((x) => x.current === true);
  const list = steps.map((step: any, index) => (
    <li
      key={`step-${index}`}
      className={`usa-step-indicator__segment ${
        index < currentIndex
          ? "usa-step-indicator__segment--complete"
          : index === currentIndex
          ? "usa-step-indicator__segment--current"
          : ""
      }`}
      aria-current={index === currentIndex}
    >
      <span className="usa-step-indicator__segment-label">
        {step.label}{" "}
        {index < currentIndex ||
          (index > currentIndex && (
            <span className="usa-sr-only">
              {(index < currentIndex && <>completed</>) ||
                (index > currentIndex && <>not completed</>)}
            </span>
          ))}
      </span>
    </li>
  ));

  const classes = classnames(
    "usa-step-indicator",
    {
      "usa-step-indicator--center": type === "centered",
      "usa-step-indicator--counters": type === "counters",
      "usa-step-indicator--counters-sm": type === "small-counters",
    },
    className
  );
  const extras = showExtras && (
    <div className="usa-step-indicator__header">
      <h2 className="usa-step-indicator__heading">
        <span className="usa-step-indicator__heading-counter">
          <span className="usa-sr-only">Step</span>
          <span className="usa-step-indicator__current-step">
            {currentIndex + 1}
          </span>
          <span className="usa-step-indicator__total-steps">
            of {steps.length}
          </span>
        </span>
        <span className="usa-step-indicator__heading-text">
          {steps[currentIndex].label}
        </span>
      </h2>
    </div>
  );
  return (
    <>
      <div id={id} className={classes} aria-label="progress">
        <ol className="usa-step-indicator__segments">{list}</ol>
        {extras}
      </div>
    </>
  );
};

export default PPMSStepIndicator;
