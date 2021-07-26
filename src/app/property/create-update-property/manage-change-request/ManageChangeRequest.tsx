import React, { StrictMode } from "react";
import { Form } from "react-bootstrap";
import moment from "moment";
import { changeRequestStatus } from "../constants/Constants";
import {
  ChangeRequestDTO,
  ChangeRequestStatus,
  ChangeRequestType,
} from "../../../models/ChangeRequestModel";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { UserUtils } from "../../../../utils/UserUtils";
import { PropertyApiService } from "../../../../api-kit/property/property-api-service";
import { PPMSSubmit } from "../../../../ui-kit/components/PPMS-submit";
import { PPMSDatepicker } from "../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import { Paths } from "../../../Router";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSTextArea } from "../../../../ui-kit/components/common/input/PPMS-textarea";
import { isFormSubmitted } from "../../../../service/validation.service";
import { PPMSAccordion } from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import SideNav from "./SideNav";

interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
}

interface State {
  currentDate: moment.Moment;
  requestedDate: moment.Moment;
  approvedDate: Date;
  approvedDateMsg: string;
  approvedDateValid: boolean;
  approvedDateInvalid: boolean;
  requestType: string;
  requestName: string;
  status: ChangeRequestStatus;
  justification: string;
  statusMsg: string;
  statusInvalid: boolean;
  statusValid: boolean;
  comments: string;
  commentsMsg: string;
  commentsValid: boolean;
  commentsInvalid: boolean;
  isPending: boolean;
  submitDisable: boolean;
  isLoading: boolean;
  showErrorAlert: boolean;
  FormErrorMessage: string;
  alertBodyArray: string[];
  maxDateValue: Date;
  currentDateSt: string;
  accordion: any;
  isApprovedDisabled: boolean;
}

interface validate {
  isInvalid: boolean;
  message: string;
}

export default class ManageChangeRequest extends React.Component<Props, State> {
  propertyService = new PropertyApiService();
  private isCurrent = true;
  constructor(props) {
    super(props);

    this.state = {
      currentDate: null,
      requestedDate: null,
      requestType: null,
      approvedDate: null,
      approvedDateMsg: "",
      approvedDateValid: false,
      approvedDateInvalid: false,
      justification: "",
      status: null,
      statusInvalid: false,
      statusValid: false,
      statusMsg: "",
      requestName: null,
      comments: null,
      commentsMsg: "",
      commentsValid: false,
      commentsInvalid: false,
      isPending: true,
      submitDisable: false,
      isLoading: false,
      showErrorAlert: false,
      FormErrorMessage: "",
      alertBodyArray: null,
      maxDateValue: null,
      currentDateSt: "",
      accordion: {
        toggleAllAccordion: true,
        toggleChangeRequestAccordion: true,
        toggleReviewAccordion: true,
        openItems: ["toggleChangeRequestAccordion", "toggleReviewAccordion"],
      },
      isApprovedDisabled: true,
    };
    this.handleApprovedDateChanged = this.handleApprovedDateChanged.bind(this);
    this.handleRequestStatusChange = this.handleRequestStatusChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCommentsChange = this.handleCommentsChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  handleCancel(event) {
    this.props.history.push({
      pathname: `${Paths.tasks}`,
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.validateForm(event);
  }

  validateForm(event) {
    isFormSubmitted.next(true);
    let validationMessages = [];

    this.setState({
      alertBodyArray: validationMessages,
      FormErrorMessage: "",
      showErrorAlert: false,
    });

    let statusValidation: validate = this.validateRequestStatus(
      this.state.status
    );
    if (statusValidation.isInvalid) {
      validationMessages.push(statusValidation.message);
    }

    let commentValidation = this.validateComments(this.state.comments);
    if (commentValidation.isInvalid) {
      validationMessages.push(commentValidation.message);
    }

    let approveDateValidation = this.validateApprovedDate(
      this.state.approvedDate
    );
    if (approveDateValidation.isInvalid) {
      validationMessages.push(approveDateValidation.message);
    }

    if (validationMessages.length > 0) {
      this.setState({
        alertBodyArray: validationMessages,
        FormErrorMessage: "",
        showErrorAlert: true,
      });
    }
    if (validationMessages.length === 0) {
      this.submitForm();
    }
    isFormSubmitted.next(false);
  }

  submitForm() {
    let submitData: ChangeRequestDTO = {
      comment: this.state.comments,
      approvedDate: this.state.approvedDate,
      changeRequestStatus: this.state.status,
    };

    this.propertyService
      .updateChangeRequest(this.props.match.params.changeRequestId, submitData)
      .then((response: any) => {
        this.props.history.push({
          pathname: `${Paths.tasks}`,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  handleApprovedDateChanged(event) {
    if (this.state.isApprovedDisabled) return;
    this.validateApprovedDate(event);
  }

  handleRequestStatusChange(event) {
    let value = null;
    event.forEach((e) => {
      if (e.isSelected) {
        value = e.id;
      }
    });
    this.validateRequestStatus(value);
  }
  validateRequestStatus(value): validate {
    let validate: validate = {
      isInvalid: false,
      message: "",
    };

    if (!value || value.trim() === "") {
      validate = {
        isInvalid: true,
        message: "Please select approve or deny",
      };
    }

    this.setState({
      status: value,
      statusMsg: validate.message,
      statusValid: !validate.isInvalid,
      statusInvalid: validate.isInvalid,
    });
    return validate;
  }

  validateApprovedDate(value): validate {
    let validate: validate = {
      isInvalid: false,
      message: "",
    };

    if (!value) {
      validate = {
        isInvalid: true,
        message: `Approved ${this.state.requestName} is required`,
      };
    }

    this.setState({
      approvedDate: value,
      approvedDateMsg: validate.message,
      approvedDateInvalid: validate.isInvalid,
    });

    return validate;
  }

  validateComments(value): validate {
    let validate: validate = {
      isInvalid: false,
      message: "",
    };

    if (!value || value.trim() === "") {
      validate = {
        isInvalid: true,
        message: "Comments is required",
      };
    }

    this.setState({
      comments: value,
      commentsMsg: validate.message,
      commentsValid: !validate.isInvalid,
      commentsInvalid: validate.isInvalid,
    });

    return validate;
  }

  handleCommentsChange(event) {
    this.validateComments(event.target.value);
  }

  toggleAccordion(event, section) {
    let openItems = this.state.accordion.openItems;
    let { accordion } = this.state;
    if (section === "All") {
      // when clicked on expland All - set openItems to contain all the items
      if (accordion["toggleAllAccordion"]) {
        openItems = [];
      } else {
        openItems = ["toggleChangeRequestAccordion", "toggleReviewAccordion"];
      }
      let isExpanded = !accordion["toggleAllAccordion"];
      accordion["toggleAllAccordion"] = isExpanded;
      accordion["toggleChangeRequestAccordion"] = isExpanded;
      accordion["toggleReviewAccordion"] = isExpanded;
      this.setState({
        accordion: accordion,
      });
    } else {
      this.openSelectedAccordion(section, openItems, accordion);
    }
    event.stopPropagation();
  }

  openSelectedAccordion(section, openItems, accordion) {
    const itemIndex = openItems.indexOf(section);
    if (!accordion[section]) {
      //add to open item list
      if (itemIndex === -1) {
        openItems.push(section);
      }
    } else {
      //remove from the openItems
      openItems.splice(itemIndex, 1);
    }
    //update particular accordion state
    accordion[section] = !accordion[section];
    accordion["openItems"] = openItems;
    accordion["toggleAllAccordion"] = openItems.length === 2;
    this.setState({
      accordion: accordion,
    });
  }

  componentWillMount() {
    this.propertyService
      .getChangeRequest(this.props.match.params.changeRequestId)
      .then((d: any) => {
        let data: ChangeRequestDTO = d.data;
        moment(data.newValue).isBefore(moment(), "day")
          ? this.setState({ isApprovedDisabled: true })
          : this.setState({ isApprovedDisabled: false });
        changeRequestStatus.find(
          (ele) => ele.id === ChangeRequestStatus.APPROVED
        ).isDisabled = this.state.isApprovedDisabled;
        this.setState({
          currentDate:
            data.prevValue !== null
              ? moment(data.prevValue, "YYYY/MM/DD")
              : null,
          requestedDate:
            data.newValue !== null ? moment(data.newValue, "YYYY/MM/DD") : null,
          approvedDate:
            data.newValue !== null
              ? moment(data.newValue, "YYYY/MM/DD").toDate()
              : null,
          justification: data.reasonForChange,
          requestType: data.changeRequestType,
          isPending: data.changeRequestStatus === ChangeRequestStatus.PENDING,
          requestName:
            data.changeRequestType === ChangeRequestType.EXCESS_RELEASE_DATE
              ? "Excess Release Date (ERD)"
              : "Surplus Release Date (SRD)",
          showErrorAlert:
            data.changeRequestStatus !== ChangeRequestStatus.PENDING,
          alertBodyArray:
            data.changeRequestStatus === ChangeRequestStatus.PENDING
              ? []
              : [`This change request was already ${data.changeRequestStatus}`],
        });
        let maxValue: Date = null;
        this.setState({
          currentDateSt: moment(this.state.currentDate, "YYYY/MM/DD")
            .toDate()
            .toString(),
        });
        if (this.state.requestName === "Excess Release Date (ERD)") {
          maxValue = UserUtils.hasPermission("NU")
            ? moment(this.state.currentDate, "YYYY/MM/DD").toDate()
            : moment(new Date()).add(2100, "years").toDate();
        } else {
          maxValue =
            UserUtils.getUserPermissions()[0] === "AC"
              ? moment(
                  this.state.currentDate.add(30, "days"),
                  "YYYY/MM/DD"
                ).toDate()
              : moment(new Date()).add(2100, "years").toDate();
        }
        this.setState({
          maxDateValue: maxValue,
        });
      })
      .catch(console.log);
  }

  componentCleanup() {
    changeRequestStatus.forEach((ele) => {
      ele.isSelected = false;
    });
  }

  componentWillUnmount() {
    this.componentCleanup();
  }

  render() {
    const submitCancel = (
      <>
        {" "}
        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-auto">
            <PPMSSubmit
              variant={"primary"}
              disabled={this.state.submitDisable}
              isLoading={this.state.isLoading}
            />
          </div>
          <div className="tablet:grid-col-auto">
            <PPMSButton
              variant={"primary"}
              type={"reset"}
              label={"Cancel"}
              id={"cancel"}
              onPress={this.handleCancel}
            />
          </div>
        </div>
      </>
    );
    return (
      <StrictMode>
        <div className={"changeRequest grid-row ui-ppms"}>
          <div className="header-row grid-row grid-gap-4">
            <h1>Manage {this.state.requestName} change request</h1>
          </div>
          <div className="usa-layout-docs__sidenav desktop:grid-col-3">
            <div className={`sticky-wrapper`}>
              <div className={"sticky-inner"}>
                <nav aria-label="Secondary navigation">
                  <h3>Form Sections</h3>
                  <SideNav />
                </nav>
              </div>
            </div>
          </div>
          <main
            className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs"
            id="main-content"
          >
            <div className="grid-row">
              <div className={"desktop:grid-col-8"}>
                <PPMSAlert
                  id={"form-verification-error-change-request"}
                  show={this.state.showErrorAlert}
                  alertBody={
                    this.state.FormErrorMessage || " Error submitting request."
                  }
                  alertClassName={"form-verification-error"}
                  alertVariant={"danger"}
                  alertKey={"form-verification-error"}
                  alertBodyArray={this.state.alertBodyArray}
                />
              </div>
            </div>
            {this.state.showErrorAlert && <hr />}
            {this.state.isPending ? (
              <div className="grid-col-9">
                <Form
                  noValidate
                  validated={false}
                  className={"usa-accordion--bordered"}
                  aria-multiselectable="true"
                  onSubmit={this.handleSubmit}
                >
                  <div className="float-md-right">
                    <PPMSButton
                      variant={"link"}
                      className="usa-link float:right"
                      id={"expandToggle"}
                      type={"button"}
                      label={
                        this.state.accordion.toggleAllAccordion
                          ? "Collapse All"
                          : "Expand All"
                      }
                      onPress={(event) => this.toggleAccordion(event, "All")}
                    />
                  </div>
                  {submitCancel}
                  <br />
                  <PPMSAccordion
                    bordered={true}
                    items={[
                      {
                        title: "Change Request",
                        content: (
                          <div className="usa-accordion--bordered desktop:grid-col-12">
                            <div className={"grid-row grid-gap-4"}>
                              <div className={"grid-col"}>
                                <PPMSInput
                                  id={"erdCurrent"}
                                  name={"erdCurrent"}
                                  label={`Current ${this.state.requestName}`}
                                  isRequired={true}
                                  maxLength={6}
                                  isInvalid={false}
                                  isValid={false}
                                  isDisabled={true}
                                  inputType={"text"}
                                  value={moment(
                                    new Date(this.state.currentDateSt)
                                  ).format("MM/DD/YYYY")}
                                />
                              </div>
                              <div className={"grid-col"}>
                                <PPMSInput
                                  id={"erdRequested"}
                                  name={"erdRequested"}
                                  label={`Requested ${this.state.requestName}`}
                                  isRequired={true}
                                  maxLength={6}
                                  isInvalid={false}
                                  isValid={false}
                                  isDisabled={true}
                                  inputType={"text"}
                                  value={this.state.requestedDate?.format(
                                    "MM/DD/YYYY"
                                  )}
                                />
                              </div>
                            </div>
                            <div className={"grid-row grid-gap-4"}>
                              <div className={"tablet:grid-col-12"}>
                                <PPMSTextArea
                                  id={"justification"}
                                  name={"justification"}
                                  label={"Justification for change"}
                                  isRequired={true}
                                  isDisabled={true}
                                  inputType={"text"}
                                  value={this.state.justification}
                                  isInvalid={false}
                                  isValid={false}
                                />
                              </div>
                            </div>
                          </div>
                        ),
                        expanded: this.state.accordion
                          .toggleChangeRequestAccordion,
                        id: "changeRequest",
                        className: "change-requst-srd-erd",
                        handleToggle: (event) => {
                          this.toggleAccordion(
                            event,
                            "toggleChangeRequestAccordion"
                          );
                        },
                      },
                    ]}
                  />
                  <br />
                  <PPMSAccordion
                    bordered={true}
                    items={[
                      {
                        title: "Review",
                        content: (
                          <div className="usa-accordion--bordered desktop:grid-col-12">
                            <div className={"grid-row grid-gap-4"}>
                              <div className={"tablet:grid-col-3"}>
                                <PPMSDatepicker
                                  id={"erdApproved"}
                                  format={"MM/DD/YYYY"}
                                  startDate={this.state.approvedDate}
                                  updateDate={this.handleApprovedDateChanged}
                                  display={"bottom-start"}
                                  label={`Approved ${this.state.requestName}`}
                                  isRequired={true}
                                  placeholder={`Approved ${this.state.requestName}`}
                                  validationMessage={this.state.approvedDateMsg}
                                  isInvalid={this.state.approvedDateInvalid}
                                  useDefaultValidation={false}
                                  minDate={
                                    this.state.isApprovedDisabled
                                      ? this.state.approvedDate
                                      : moment(new Date()).toDate()
                                  }
                                  maxDate={
                                    this.state.isApprovedDisabled
                                      ? this.state.approvedDate
                                      : this.state.maxDateValue
                                  }
                                />
                              </div>
                            </div>

                            <div className={"grid-row grid-gap-4"}>
                              <div className={"tablet:grid-col-12"}>
                                <PPMSToggleRadio
                                  id={"requestStatus"}
                                  options={changeRequestStatus}
                                  isInline={false}
                                  isDisabled={false}
                                  name={"requestStatus"}
                                  className={"change-request-status"}
                                  label={"Are you approving the change?"}
                                  validationMessage={this.state.statusMsg}
                                  isSingleSelect={true}
                                  onChange={this.handleRequestStatusChange}
                                  isRequired={true}
                                />
                              </div>
                            </div>

                            <div className={"grid-row grid-gap-4"}>
                              <div className={"tablet:grid-col-12"}>
                                <PPMSTextArea
                                  id={"comments"}
                                  name={"comments"}
                                  label={"Comments"}
                                  placeHolder={
                                    "Enter your approve/deny comments here"
                                  }
                                  isRequired={true}
                                  isDisabled={false}
                                  inputType={"text"}
                                  value={this.state.comments}
                                  onChange={this.handleCommentsChange}
                                  isInvalid={this.state.commentsInvalid}
                                  isValid={this.state.commentsValid}
                                  maxLength={300}
                                  validationMessage={this.state.commentsMsg}
                                />
                              </div>
                            </div>
                          </div>
                        ),
                        expanded: this.state.accordion.toggleReviewAccordion,
                        id: "review",
                        className: "erd-review-comments",
                        handleToggle: (event) => {
                          this.toggleAccordion(event, "toggleReviewAccordion");
                        },
                      },
                    ]}
                  />

                  <br />
                  {submitCancel}
                </Form>
              </div>
            ) : (
              <div />
            )}
          </main>
        </div>
      </StrictMode>
    );
  }
}
