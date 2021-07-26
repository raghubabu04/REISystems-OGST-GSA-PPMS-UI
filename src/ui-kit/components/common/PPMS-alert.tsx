import React from "react";
import { Alert } from "react-bootstrap";

export interface PPMSAlertProps {
  alertBody?: string;
  isAlertSlim?: boolean;
  alertClassName: string;
  alertHeading?: string;
  alertHeadingText?: string;
  alertStartWithBoldText?: string;
  alertKey: string;
  alertVariant:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "dark"
    | "light"
    | "display";
  id: string;
  show: boolean;
  alertBodyArray?: string[];
}
export interface PPMSAlertState {}
export class PPMSAlert extends React.Component<PPMSAlertProps, PPMSAlertState> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getUSWDSAlertClass() {
    switch (this.props.alertVariant) {
      case "primary":
        return "usa-alert--info";
      case "success":
        return "usa-alert--success";
      case "warning":
        return "usa-alert--warning";
      case "danger":
        return "usa-alert--error";
      case "display":
        return "special-inspection-bg";
      default:
        return "usa-alert--info";
    }
  }

  render() {
    let alertBody;
    if (this.props.alertBodyArray && this.props.alertBodyArray.length > 0) {
      alertBody = this.props.alertBodyArray.map((data: any, index) => (
        <React.Fragment key={"ekey-" + index}>
          <p
            className={`${this.props.alertClassName} usa-alert__body usa-alert__text`}
            key={index}
          >
            {data}
          </p>
          <br />
        </React.Fragment>
      ));
    } else {
      alertBody = (
        <div>
          <p
            className={`${this.props.alertClassName} usa-alert__body usa-alert__text`}
          >
            {this.props.alertStartWithBoldText !== null ? (
              <span className={"text-starts-with-bold"}>
                {this.props.alertStartWithBoldText}
              </span>
            ) : (
              ""
            )}

            {this.props.alertBody}
          </p>
        </div>
      );
    }

    return (
      <Alert
        show={this.props.show}
        key={this.props.alertKey}
        id={this.props.id}
        className={`usa-alert ${this.getUSWDSAlertClass()} ${
          this.props.isAlertSlim ? "usa-alert--slim" : ""
        }`}
      >
        {this.props.alertHeading && (
          <Alert.Heading className={"usa-alert__heading"}>
            {this.props.alertHeading}
          </Alert.Heading>
        )}
        {this.props.alertHeadingText && (
          <p className={"usa-alert__text"}>{this.props.alertHeadingText}</p>
        )}
        {this.props.alertHeading && this.props.alertHeadingText && <hr />}
        {alertBody}
      </Alert>
    );
  }
}
