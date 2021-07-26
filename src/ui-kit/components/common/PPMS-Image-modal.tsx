import React from "react";
import { Modal } from "react-bootstrap";

export interface PPMSImageModalProps {
  body: {};
  id: string;
  show: boolean;
  title: string;
  size?: "lg" | "sm" | "xl";
  centered?: boolean;
  backdrop?: "static";
  handleClose?: any;
  handleSave?: any;
  handleNext?: any;
  handlePrevious?: any;
  label?: "Save" | "Submit" | "Add" | "Yes" | "Apply";
  labelCancel?: "No" | "Cancel" | "Remove";
}
export interface PPMSImageModalState {
  show: boolean;
}
export class PPMSImageModal extends React.Component<
  PPMSImageModalProps,
  PPMSImageModalState
> {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
  }
  handleClose = (event) => {
    //this.setState({ show: false });
    this.props.handleClose(event);
  };
  handleSave = (event) => {
    //this.setState({ show: true });
    this.props.handleSave(event);
  };

  handleNext = (event) => {
    //this.setState({ show: true });
    this.props.handleNext(event);
  };

  handlePrevious = (event) => {
    //this.setState({ show: true });
    this.props.handlePrevious(event);
  };

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.handleClose}
        size={this.props.size}
        centered={this.props.centered}
        backdrop={this.props.backdrop}
        dialogClassName={"modal-content-width"}
        className={"ui-ppms"}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>{this.props.title}</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.body}
          <a className="leftArrow" onClick={this.handlePrevious}>
            &#10094;
          </a>
          <a className="rightArrow" onClick={this.handleNext}>
            &#10095;
          </a>
        </Modal.Body>
      </Modal>
    );
  }
}
