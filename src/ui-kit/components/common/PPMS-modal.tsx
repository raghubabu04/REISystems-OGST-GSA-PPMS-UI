import React from "react";
import {Modal} from "react-bootstrap";
import {PPMSButton} from "./PPMS-button";
import ReactToPrint from "react-to-print";
import {PPMSTooltip} from "./PPMS-tooltip";

export interface PPMSModalProps {
  body?: {};
  id: string;
  show: boolean;
  title: string;
  size?: "lg" | "sm" | "xl";
  centered?: boolean;
  backdrop?: "static";
  handleClose: any;
  handleSave: any;
  handleSaveType?: "button" | "submit" | "reset";
  label?:
    | "Save"
    | "Submit"
    | "Add"
    | "Yes"
    | "Apply"
    | "Logout"
    | "Ok"
    | "Print"
    | "Confirm"
    | "Confirm Bid";
  customLabel?: string;
  labelVariant?:
    | "link"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "dark"
    | "light"
    | "outline-primary"
    | "outline-secondary"
    | "outline-success"
    | "outline-danger"
    | "outline-warning"
    | "outline-info"
    | "outline-dark"
    | "outline-light";
  hideLabel?: boolean;
  labelCancel?: "No" | "Cancel" | "Remove" | "Continue" | "Close";
  labelCancelVariant?:
    | "link"
    | "hide"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "dark"
    | "light"
    | "outline-primary"
    | "outline-secondary"
    | "outline-success"
    | "outline-danger"
    | "outline-warning"
    | "outline-info"
    | "outline-dark"
    | "outline-light";
  hideLabelSave?: boolean;
  hideLabelCancel?: boolean;
  disableSave?: boolean;
  btnVariant?: "hide" | "secondary";
  saveIsLoading?: boolean;
  isToolTipEnabledBtnDisabled?: boolean;
  toolTipContent?: string;
}
export interface PPMSModalState {
  show: boolean;
}
export class PPMSModal extends React.Component<PPMSModalProps, PPMSModalState> {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  componentRef;
  handleClose = (event) => {
    //this.setState({ show: false });
    this.props.handleClose(event);
  };
  handleSave = (event) => {
    //this.setState({ show: true });
    this.props.handleSave(event);
  };

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.handleClose}
        size={this.props.size}
        centered={this.props.centered}
        backdrop={this.props.backdrop}
        className={"ui-ppms"}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>{this.props.title}</h3>
          </Modal.Title>
        </Modal.Header>
        {this.props?.body && (
          <Modal.Body ref={(el) => (this.componentRef = el)}>
            {this.props.body}
          </Modal.Body>
        )}
        <Modal.Footer>
          {!this.props.hideLabel && this.props.label !== "Print" && !this.props.isToolTipEnabledBtnDisabled &&(
            <PPMSButton
              id={this.props.id + "-save"}
              label={
                this.props.label
                  ? this.props.label
                  : this.props.customLabel
                  ? this.props.customLabel
                  : "Save"
              }
              className={"out-button"}
              type={this.props.handleSaveType}
              onPress={this.handleSave}
              isDisabled={this.props.disableSave}
              isLoading={
                this.props.saveIsLoading ? this.props.saveIsLoading : false
              }
              variant={
                this.props.labelVariant ? this.props.labelVariant : "primary"
              }
            />
          )}
          {!this.props.hideLabel && this.props.label === "Print" && (
            <ReactToPrint
              trigger={() => (
                <button type={"button"} className={"usa-button"}>
                  {this.props.label}
                </button>
              )}
              content={() => this.componentRef}
            />
          )}
          {this.props.isToolTipEnabledBtnDisabled && (
            <PPMSTooltip
            trigger={"click"}
            id={"tool-tip-button"}
            placement={"right"}
            tooltipContent={
              this.props.toolTipContent
            }
            triggerSource={
              <button className="usa-button tooltipdisabled" type="button">
                {this.props.customLabel}
              </button>
            }
          />
          )}
          {!this.props.hideLabelCancel && (
            <PPMSButton
              id={this.props.id + "-close"}
              label={this.props.labelCancel ? this.props.labelCancel : "Cancel"}
              className={"out-button"}
              onPress={this.handleClose}
              variant={
                this.props.labelCancelVariant
                  ? this.props.labelCancelVariant
                  : "secondary"
              }
            />
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}
