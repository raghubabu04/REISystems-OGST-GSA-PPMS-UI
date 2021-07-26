import React from "react";
import { Modal } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
export interface PPMSModalProps {
  body?: {};
  id: string;
  show: boolean;
  title: string;
  size?: "lg" | "sm" | "xl";
  centered?: boolean;
  backdrop?: "static";
  handleClose: any;
  handleSaveType?: "button" | "submit" | "reset";
  hideLabel?: boolean;
  labelCancel?: "Cancel";
  hideLabelSave?: boolean;
  hideLabelCancel?: boolean;
  disableSave?: boolean;
  btnVariant?: "hide" | "secondary";
}
export interface PPMSModalState {
  show: boolean;
}
export class PrintAcceptanceLettersModal extends React.Component<
  PPMSModalProps,
  PPMSModalState
> {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
    };
    this.handleClose = this.handleClose.bind(this);

  }
  componentRef;
  handleClose = (event) => {
    this.props.handleClose(event);
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
          <div className="hidden">
            <Modal.Body ref={(el) => (this.componentRef = el)}>
              {this.props.body}
            </Modal.Body>
            <ReactToPrint
            trigger={() => (
              <button type={"button"} className={"usa-button"}>
                Print acceptance letter(s)
              </button>
            )}
            content={() => this.componentRef}
          />
          </div>
        )}
      </Modal>
    );
  }
}
