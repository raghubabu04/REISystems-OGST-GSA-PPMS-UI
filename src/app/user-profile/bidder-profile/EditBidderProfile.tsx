import React, { StrictMode, useContext, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { PPMSActionList } from "../../../ui-kit/components/PPMS-action-list";
import { BidderContext } from "../../manage-users/bidders/BidderContext";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";
import { PPMSForm } from "../../../ui-kit/components/common/form/PPMS-form";
import BidderButtons from "../../manage-users/bidders/BidderButtons";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import { isFormSubmitted } from "../../../service/validation.service";
import BidderPersonalInformation from "../../manage-users/bidders/bidder-personal-information/BidderPersonalInformation";
import BidderPrimaryAddressInformation from "../../manage-users/bidders/bidder-primary-address-information/BidderPrimaryAddressInformation";
import BidderContactInformation from "../../manage-users/bidders/bidder-contact-information/BidderContactInformation";
import BidderAccountPreferences from "../../manage-users/bidders/bidder-account-preferences/BidderAccountPreferences";
import BidderSecondaryAddressInformation from "../../manage-users/bidders/bidder-secondary-address-information/BidderSecondaryAddressInformation";
import BidderSideNavBar from "../../manage-users/bidders/BidderSideNavbar";
import { editBidderProfileStateDefault } from "./EditBidderProfileState";
import { UserApiService } from "../../../api-kit/user/user-api.service";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { formatPhone } from "../../../ui-kit/utilities/FormatUtil";
import { BidderUserDTO } from "../../models/BidderUser";
import { Paths } from "../../Router";
import { BidderLoginInformationStateJson } from "../../manage-users/bidders/bidder-login-information/BidderLoginInformationState";
import { BidderPersonalInformationStateJson } from "../../manage-users/bidders/bidder-personal-information/BidderPersonalInformationState";
import { BidderPrimaryAddressInformationStateJson } from "../../manage-users/bidders/bidder-primary-address-information/BidderPrimaryAddressInformationState";
import { BidderSecondaryAddressInformationStateJson } from "../../manage-users/bidders/bidder-secondary-address-information/BidderSecondaryAddressInformationState";
import { BidderContactInformationStateJson } from "../../manage-users/bidders/bidder-contact-information/BidderContatInformationState";
import { BidderAccountPreferencesStateJson } from "../../manage-users/bidders/bidder-account-preferences/BidderAccountPreferencesState";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import moment from "moment";
import {
  securityAnswerValidation,
  securityQuestionValidation,
} from "../../../ui-kit/components/validations/FieldValidations";

interface EditBidderProfileProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

export function EditBidderProfile(props: EditBidderProfileProps) {
  const commonApiService = new CommonApiService();
  const userApiService = new UserApiService();

  const {
    editBidderProfileState,
    updateEditBidderProfileState,
    bidderLoginInformationState,
    updateBidderLoginInformationState,
    bidderPersonalInformationState,
    updateBidderPersonalInformationState,
    bidderPrimaryAddressInformationState,
    updateBidderPrimaryAddressInformationState,
    bidderSecondaryAddressInformationState,
    updateBidderSecondaryAddressInformationState,
    bidderContactInformationState,
    updateBidderContactInformationState,
    bidderAccountPreferencesState,
    updateBidderAccountPreferencesState,
  } = useContext(BidderContext);

  let editBidderLoginInfo = (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSInput
            className={"edit-bidder-login-username"}
            isDisabled={true}
            id={"edit-bidder-login-username"}
            name={"edit-bidder-login-username"}
            label={"User Name"}
            onChange={() => {}}
            inputType={"text"}
            isRequired={true}
            value={bidderLoginInformationState.bidderUsername}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            className={"edit-bidder-login-reg-type"}
            isDisabled={true}
            id={"edit-bidder-login-reg-type"}
            name={"edit-bidder-login-reg-type"}
            label={"Registration Type"}
            onChange={() => {}}
            inputType={"text"}
            isRequired={true}
            value={bidderLoginInformationState.regTypeToggle}
          />
        </div>
      </div>
      <div className={"grid-row"}>
        <div className={"grid-col"}>
          <PPMSInput
            className={"edit-bidder-login-sec-ques"}
            isDisabled={bidderLoginInformationState.isSecurityQuestionDisabled}
            id={"edit-bidder-login-sec-ques"}
            name={"edit-bidder-login-sec-ques"}
            isInvalid={bidderLoginInformationState.isSecurityQuestionInvalid}
            label={"Security Question"}
            onChange={(event) =>
              handleSecurityQuestionChange(event.target.value)
            }
            placeHolder={"Security Question"}
            isRequired={true}
            inputType={"text"}
            validationMessage={
              bidderLoginInformationState.bidderSecurityQuestionValidationMessage
            }
            value={bidderLoginInformationState.bidderSecurityQuestion}
            hint={"Limit: 80 characters"}
            maxLength={80}
          />
        </div>
      </div>
      <div className={"grid-row"}>
        <div className={"grid-col"}>
          <PPMSInput
            className={"edit-bidder-login-sec-ans"}
            isDisabled={bidderLoginInformationState.isSecurityAnswerDisabled}
            id={"edit-bidder-login-sec-ans"}
            name={"edit-bidder-login-sec-ans"}
            isInvalid={bidderLoginInformationState.isSecurityAnswerInvalid}
            label={"Security Answer"}
            onChange={(event) => handleSecurityAnswerChange(event.target.value)}
            placeHolder={"Security Answer"}
            isRequired={true}
            inputType={"text"}
            validationMessage={
              bidderLoginInformationState.bidderSecurityAnswerValidationMessage
            }
            value={bidderLoginInformationState.bidderSecurityAnswer}
            hint={"Limit: 60 characters"}
            maxLength={60}
          />
        </div>
      </div>
    </>
  );

  let physicalAddress;
  if (bidderPrimaryAddressInformationState.isPrimaryAddressPoBox) {
    physicalAddress = {
      title: "Physical Address Information",
      content: <BidderSecondaryAddressInformation />,
      expanded: true,
      id: "edit-secondary-address-information-id",
      trigger: "common",
    };
  }

  const itemsWithoutPhysicalAddress = [
    {
      title: "Login Information",
      content: editBidderLoginInfo,
      expanded: true,
      id: "edit-login-information-id",
      trigger: "common",
    },
    {
      title: "Personal Information",
      content: <BidderPersonalInformation disabled={true} />,
      expanded: true,
      id: "edit-personal-information-id",
      trigger: "common",
    },
    {
      title: "Primary Address information",
      content: <BidderPrimaryAddressInformation />,
      expanded: true,
      id: "edit-primary-address-information-id",
      trigger: "common",
    },
    {
      title: "Contact information",
      content: <BidderContactInformation />,
      expanded: true,
      id: "edit-contact-information-id",
      trigger: "common",
    },
    {
      title: "Account Preferences",
      content: <BidderAccountPreferences />,
      expanded: true,
      id: "edit-account-preferences-id",
      trigger: "common",
    },
  ];

  const itemsWithPhysicalAddress = [
    {
      title: "Login Information",
      content: editBidderLoginInfo,
      expanded: true,
      id: "edit-login-information-id",
      trigger: "common",
    },
    {
      title: "Personal Information",
      content: <BidderPersonalInformation disabled={true} />,
      expanded: true,
      id: "edit-personal-information-id",
      trigger: "common",
    },
    {
      title: "Primary Address information",
      content: <BidderPrimaryAddressInformation />,
      expanded: true,
      id: "edit-primary-address-information-id",
      trigger: "common",
    },
    {
      title: "Physical Address Information",
      content: <BidderSecondaryAddressInformation />,
      expanded: true,
      id: "edit-secondary-address-information-id",
      trigger: "common",
    },
    {
      title: "Contact information",
      content: <BidderContactInformation />,
      expanded: true,
      id: "edit-contact-information-id",
      trigger: "common",
    },
    {
      title: "Account Preferences",
      content: <BidderAccountPreferences />,
      expanded: true,
      id: "edit-account-preferences-id",
      trigger: "common",
    },
  ];

  useEffect(() => {
    setDefaultValues();
  }, []);

  function setDefaultValues() {
    isFormSubmitted.next(false);
    updateEditBidderProfileState(editBidderProfileStateDefault);

    userApiService
      .getBidderUser(props.match.params.userName)
      .then((response) => {
        let info = response.data;
        updateBidderLoginInformationState({
          id: info.id,
          bidderUsername: info.bidderUser.userName,
          regTypeToggle: info.bidderUser.registrationType.registrationType,
          bidderSecurityQuestion: info.securityQuestion,
          bidderSecurityAnswer: info.securityAnswer,
        });
        if (info.bidderUser.status.status === "APPROVED") {
          updateEditBidderProfileState({ submitLabel: "Submit" });
        } else if (info.bidderUser.status.status === "DISAPPROVED") {
          updateEditBidderProfileState({ submitLabel: "Approve" });
        }
        let usaCitizenOptions = [
          { value: "Yes", id: "Y", isSelected: false },
          { value: "No", id: "N", isSelected: false },
        ];
        info.bidderUser.usCitizen
          ? (usaCitizenOptions[0].isSelected = true)
          : (usaCitizenOptions[1].isSelected = true);
        let dateOfBirth = info?.bidderUser?.dateOfBirth
          ? moment(info?.bidderUser?.dateOfBirth).toDate()
          : null;
        updateBidderPersonalInformationState({
          id: info.id,
          firstName: info.firstName,
          middleName: info.middleName,
          lastName: info.lastName,
          emailAddress: info.emailAddress,
          confirmEmailAddress: info.emailAddress,
          confirmDisabled: true,
          dateOfBirth: dateOfBirth,
          usaCitizenToggle: info.bidderUser.usCitizen,
          usaCitizenOptions: usaCitizenOptions,
          country: info.bidderUser.address.countryCode,
          isCountryDisabled: true,
          ssn: info.bidderUser.socialSecurity,
          confirmSSN: info.bidderUser.socialSecurity,
          ein: info.bidderUser.einNumber,
          confirmEIN: info.bidderUser.einNumber,
          companyName: info.bidderUser.companyName,
        });
        let isAddressPoBox = [
          { value: "Yes", id: "Y", isSelected: false },
          { value: "No", id: "N", isSelected: false },
        ];
        info.bidderUser.address.isAddressPoBox
          ? (isAddressPoBox[0].isSelected = true)
          : (isAddressPoBox[1].isSelected = true);
        updateBidderPrimaryAddressInformationState({
          isAddressPoBoxOptions: isAddressPoBox,
          isPrimaryAddressPoBox: info.bidderUser.address.isAddressPoBox,
          addressLine1: info.bidderUser.address.addressLine1,
          addressLine2: info.bidderUser.address.addressLine2,
          addressLine3: info.bidderUser.address.addressLine3,
          city: info.bidderUser.address.city,
          stateCode: info.bidderUser.address.stateCode,
          zip: info.bidderUser.address.zip,
          zipExtension: info.bidderUser.address.zipExtension,
        });
        if (info.bidderUser.address.isAddressPoBox) {
          updateBidderSecondaryAddressInformationState({
            secondaryAddressLine1:
              info.bidderUser.address.secondaryAddressLine1,
            secondaryAddressLine2:
              info.bidderUser.address.secondaryAddressLine2,
            secondaryAddressLine3:
              info.bidderUser.address.secondaryAddressLine3,
            secondaryCity: info.bidderUser.address.secondaryCity,
            secondaryStateCode: info.bidderUser.address.secondaryStateCode,
            secondaryZip: info.bidderUser.address.secondaryZip,
            secondaryZipExtension:
              info.bidderUser.address.secondaryZipExtension,
          });
        }
        updateBidderContactInformationState({
          daytimePhone: info.bidderUser.dayPhone
            ? formatPhone(info.bidderUser.dayPhone.toString())
            : "",
          daytimePhoneExt: info.bidderUser.dayPhoneExt,
          eveningPhone: info.bidderUser.eveningPhone
            ? formatPhone(info.bidderUser.eveningPhone.toString())
            : "",
          eveningPhoneExt: info.bidderUser.eveningPhoneExt,
          internationalPhone: formatPhone(info.bidderUser.internationalPhone),
        });
        let accountPreferencesOptions = [
          {
            value: "Notify me when I don't win an auction",
            id: "notifyAuctionWin",
            isSelected: false,
          },
          {
            value: "Notify me when I am outbid for an item",
            id: "notifyItemOutbid",
            isSelected: false,
          },
        ];
        if (info.bidderUser.notifyAuctionWin) {
          accountPreferencesOptions[0].isSelected = true;
          updateBidderAccountPreferencesState({
            notifyAuctionWin: true,
          });
        }
        if (info.bidderUser.notifyItemOutbid) {
          accountPreferencesOptions[1].isSelected = true;
          updateBidderAccountPreferencesState({
            notifyItemOutbid: true,
          });
        }
        updateBidderAccountPreferencesState({
          accountPreferencesOptions: accountPreferencesOptions,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  function handleActionHistory() {
    const data = {
      params: {
        objectType: "BIDDERS",
        objectId: props.match.params.userName,
      },
    };
    userApiService
      .getActionHistoryForUserObject(data)
      .then((response: any) => {
        updateEditBidderProfileState({
          actionHistoryData: response.data,
          showActionHistoryModal: true,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  function handleClose() {
    updateEditBidderProfileState({
      showActionHistoryModal: false,
    });
  }

  function handleSecurityQuestionChange(event) {
    let validation = securityQuestionValidation(event);
    updateBidderLoginInformationState({
      isSecurityQuestionInvalid: validation.isInvalid,
      bidderSecurityQuestionValidationMessage: validation.validationError,
      bidderSecurityQuestion: event,
    });
  }

  function handleSecurityAnswerChange(event) {
    let validation = securityAnswerValidation(
      event,
      bidderLoginInformationState.bidderSecurityQuestion
    );
    updateBidderLoginInformationState({
      isSecurityAnswerInvalid: validation.isInvalid,
      bidderSecurityAnswerValidationMessage: validation.validationError,
      bidderSecurityAnswer: event,
    });
  }

  function toJSON(): BidderUserDTO {
    let bidderLoginInformation = BidderLoginInformationStateJson(
      bidderLoginInformationState
    )[0];
    let bidderPersonalInformation = BidderPersonalInformationStateJson(
      bidderPersonalInformationState
    )[0];
    let bidderPrimaryAddressInformation = BidderPrimaryAddressInformationStateJson(
      bidderPrimaryAddressInformationState
    )[0];
    let bidderSecondaryAddressInformation = BidderSecondaryAddressInformationStateJson(
      bidderSecondaryAddressInformationState
    )[0];
    let bidderContactInformation = BidderContactInformationStateJson(
      bidderContactInformationState
    )[0];
    let bidderAccountPreferences = BidderAccountPreferencesStateJson(
      bidderAccountPreferencesState
    )[0];

    return ({
      id: bidderLoginInformation.id,
      registrationType: bidderLoginInformation.registrationType,
      bidderUserName: bidderLoginInformation.bidderUserName,
      securityQuestion: bidderLoginInformation.securityQuestion,
      securityAnswer: bidderLoginInformation.securityAnswer,
      bidderStatus: "APPROVED",

      firstName: bidderPersonalInformation.firstName,
      middleName: bidderPersonalInformation.middleName,
      lastName: bidderPersonalInformation.lastName,
      emailAddress: bidderPersonalInformation.emailAddress,
      dateOfBirth: bidderPersonalInformation.dateOfBirth,
      ssn: bidderPersonalInformation.ssn,
      companyName: bidderPersonalInformation.companyName,
      ein: bidderPersonalInformation.ein,
      isUsCitizen: bidderPersonalInformation.isUsCitizen,
      country: bidderPersonalInformation.country,

      isPrimaryAddressPoBox:
        bidderPrimaryAddressInformation.isPrimaryAddressPoBox,
      addressLine1: bidderPrimaryAddressInformation.addressLine1,
      addressLine2: bidderPrimaryAddressInformation.addressLine2,
      addressLine3: bidderPrimaryAddressInformation.addressLine3,
      city: bidderPrimaryAddressInformation.city,
      stateCode: bidderPrimaryAddressInformation.stateCode,
      zip: bidderPrimaryAddressInformation.zip,
      zipExtension: bidderPrimaryAddressInformation.zipExtension,
      secondaryAddressLine1:
        bidderSecondaryAddressInformation.secondaryAddressLine1,
      secondaryAddressLine2:
        bidderSecondaryAddressInformation.secondaryAddressLine2,
      secondaryAddressLine3:
        bidderSecondaryAddressInformation.secondaryAddressLine3,
      secondaryStateCode: bidderSecondaryAddressInformation.secondaryStateCode,
      secondaryCity: bidderSecondaryAddressInformation.secondaryCity,
      secondaryZip: bidderSecondaryAddressInformation.secondaryZip,
      secondaryZipExtension:
        bidderSecondaryAddressInformation.secondaryZipExtension,

      daytimePhone: bidderContactInformation.daytimePhone.replace(
        /[^0-9]/g,
        ""
      ),
      eveningPhone: bidderContactInformation.eveningPhone.replace(
        /[^0-9]/g,
        ""
      ),
      daytimePhoneExt: bidderContactInformation.daytimePhoneExt,
      eveningPhoneExt: bidderContactInformation.eveningPhoneExt,
      internationalPhone: bidderContactInformation.internationalPhone.replace(
        /[^0-9]/g,
        ""
      ),

      notifyAuctionWin: bidderAccountPreferences.notifyAuctionWin,
      notifyItemOutbid: bidderAccountPreferences.notifyItemOutbid,
    } as unknown) as BidderUserDTO;
  }

  function handleSubmit(event) {
    isFormSubmitted.next(true);
    event.preventDefault();
    updateEditBidderProfileState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
    });
    const form = event.currentTarget;
    if (form.checkValidity()) {
      updateEditBidderProfileState({
        showErrorAlert: false,
      });
      const data: BidderUserDTO = toJSON();
      const { addToast } = props.actions;

      userApiService
        .editBidderUser(data, bidderLoginInformationState.bidderUsername)
        .then(() => {
          updateEditBidderProfileState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
          addToast({
            text: "Profile Updated Successfully!",
            type: "success",
            heading: "Success",
          });
          props.history.push(Paths.home);
        })
        .catch(() => {
          updateEditBidderProfileState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
            showErrorAlert: true,
          });
        });
    } else {
      event.stopPropagation();
      updateEditBidderProfileState({
        isSubmitLoading: false,
        isSubmitDisabled: false,
        showErrorAlert: true,
      });
    }
  }

  function handleCancel() {
    isFormSubmitted.next(false);
    props.history.push(Paths.home);
  }

  return (
    <StrictMode>
      <div className={"grid-row ui-ppms"}>
        <div className="header-row grid-row grid-gap-4">
          <h1>MY PROFILE</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <BidderSideNavBar
                  isEditBidder={true}
                  isEditBidderWithSecondary={physicalAddress}
                  isPrimaryAddressPoBox={
                    bidderPrimaryAddressInformationState.isPrimaryAddressPoBox
                  }
                />
              </nav>
            </div>
          </div>
        </div>

        <main
          className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs"
          id="edit-bidder"
        >
          <div className="grid-row">
            <div className={"desktop:grid-col-8"}>
              <PPMSAlert
                id={"form-verification-error"}
                show={editBidderProfileState.showErrorAlert}
                alertBody={"Error submitting request."}
                alertClassName={"form-verification-error"}
                alertVariant={"danger"}
                alertKey={"form-verification-error"}
                alertBodyArray={editBidderProfileState.alertMessages}
              />
              {editBidderProfileState.showErrorAlert && <hr />}
            </div>
          </div>
          <PPMSForm
            noValidate
            large={false}
            search={true}
            onSubmit={handleSubmit}
            className={
              "usa-accordion--bordered desktop:grid-col-10 add-margin-to-btn"
            }
          >
            <div className={"grid-row grid-gap-2"}>
              <BidderButtons
                isSubmitDisabled={false}
                isSubmitLoading={false}
                cancelFunction={handleCancel}
                submitLabel={editBidderProfileState.submitLabel}
              />
              <div className={"margin-left-auto col-md-auto"}>
                <div className={"action-history-bidders"}>
                  <PPMSButton
                    className={"out-button"}
                    type={"button"}
                    value={""}
                    label={"Action History"}
                    onPress={handleActionHistory}
                    id={"action-history-bidders"}
                  />
                </div>
              </div>
            </div>
            <br />
            <PPMSAccordion
              bordered={true}
              items={
                bidderPrimaryAddressInformationState.isPrimaryAddressPoBox
                  ? itemsWithPhysicalAddress
                  : itemsWithoutPhysicalAddress
              }
            />
            <div className={"grid-row grid-gap-2"}>
              <BidderButtons
                isSubmitDisabled={false}
                isSubmitLoading={false}
                cancelFunction={handleCancel}
                submitLabel={editBidderProfileState.submitLabel}
              />
            </div>
            <div className="grid-row grid-gap-4">
              <PPMSModal
                body={
                  <ModalActionHistoryContent
                    data={editBidderProfileState.actionHistoryData}
                    listID={"list-id"}
                    title={props.match.params.userId}
                  />
                }
                id={"show-action-history"}
                show={editBidderProfileState.showActionHistoryModal}
                handleClose={handleClose}
                handleSave={""}
                title={
                  "Action History for Bidder User: " +
                  props.match.params.userName
                }
                centered={true}
                backdrop={"static"}
                label={"Ok"}
                hideLabelCancel={true}
                hideLabel={editBidderProfileState.showActionHistoryModal}
                size={
                  editBidderProfileState.showActionHistoryModal ? "lg" : null
                }
              />
            </div>
          </PPMSForm>
          <br />
        </main>
      </div>
    </StrictMode>
  );
}

const ModalActionHistoryContent = ({ data, listID, title }) => {
  return (
    <div className={"action-history-container"}>
      <PPMSActionList data={data} listID={listID} title={title} />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(EditBidderProfile);
