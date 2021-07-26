import React, { StrictMode, useContext, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { PPMSActionList } from "../../../ui-kit/components/PPMS-action-list";
import { BidderContext } from "./BidderContext";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";
import { PPMSForm } from "../../../ui-kit/components/common/form/PPMS-form";
import BidderButtons from "./BidderButtons";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import { isFormSubmitted } from "../../../service/validation.service";
import BidderPersonalInformation from "./bidder-personal-information/BidderPersonalInformation";
import BidderPrimaryAddressInformation from "./bidder-primary-address-information/BidderPrimaryAddressInformation";
import BidderContactInformation from "./bidder-contact-information/BidderContactInformation";
import BidderAccountPreferences from "./bidder-account-preferences/BidderAccountPreferences";
import BidderSecondaryAddressInformation from "./bidder-secondary-address-information/BidderSecondaryAddressInformation";
import BidderSideNavBar from "./BidderSideNavbar";
import { editBidderStateDefault } from "./EditBidderState";
import { UserApiService } from "../../../api-kit/user/user-api.service";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { formatPhone } from "../../../ui-kit/utilities/FormatUtil";
import { BidderUserDTO } from "../../models/BidderUser";
import { Paths } from "../../Router";
import { BidderLoginInformationStateJson } from "./bidder-login-information/BidderLoginInformationState";
import { BidderPersonalInformationStateJson } from "./bidder-personal-information/BidderPersonalInformationState";
import { BidderPrimaryAddressInformationStateJson } from "./bidder-primary-address-information/BidderPrimaryAddressInformationState";
import { BidderSecondaryAddressInformationStateJson } from "./bidder-secondary-address-information/BidderSecondaryAddressInformationState";
import { BidderContactInformationStateJson } from "./bidder-contact-information/BidderContatInformationState";
import { BidderAccountPreferencesStateJson } from "./bidder-account-preferences/BidderAccountPreferencesState";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import moment from "moment";

interface EditBidderProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

export function EditBidder(props: EditBidderProps) {
  const commonApiService = new CommonApiService();
  const userApiService = new UserApiService();

  const {
    editBidderState,
    updateEditBidderState,
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
            isDisabled={true}
            id={"edit-bidder-login-sec-ques"}
            name={"edit-bidder-login-sec-ques"}
            label={"Security Question"}
            onChange={() => {}}
            inputType={"text"}
            isRequired={true}
            value={bidderLoginInformationState.bidderSecurityQuestion}
          />
        </div>
      </div>
      <div className={"grid-row"}>
        <div className={"grid-col"}>
          <PPMSInput
            className={"edit-bidder-login-sec-ans"}
            isDisabled={true}
            id={"edit-bidder-login-sec-ans"}
            name={"edit-bidder-login-sec-ans"}
            label={"Security Answer"}
            onChange={() => {}}
            inputType={"text"}
            isRequired={true}
            value={bidderLoginInformationState.bidderSecurityAnswer}
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
      content: <BidderPersonalInformation />,
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
      content: <BidderPersonalInformation />,
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
    updateEditBidderState(editBidderStateDefault);

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
          updateEditBidderState({ submitLabel: "Submit" });
        } else if (info.bidderUser.status.status === "DISAPPROVED") {
          updateEditBidderState({ submitLabel: "Approve" });
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
          firstName: info.firstName,
          middleName: info.middleName,
          lastName: info.lastName,
          emailAddress: info.emailAddress,
          confirmEmailAddress: info.emailAddress,
            dateOfBirth: dateOfBirth,
          usaCitizenToggle: info.bidderUser.usCitizen,
          usaCitizenOptions: usaCitizenOptions,
          country: info.bidderUser.address.countryCode,
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
        updateEditBidderState({
          actionHistoryData: response.data,
          showActionHistoryModal: true,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  function handleClose() {
    updateEditBidderState({
      showActionHistoryModal: false,
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
      daytimePhoneExt: bidderContactInformation.daytimePhoneExt.replace(
        /[^0-9]/g,
        ""
      ),
      eveningPhoneExt: bidderContactInformation.eveningPhoneExt.replace(
        /[^0-9]/g,
        ""
      ),
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
    updateEditBidderState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
    });
    const form = event.currentTarget;
    if (form.checkValidity()) {
      updateEditBidderState({
        showErrorAlert: false,
      });
      const data: BidderUserDTO = toJSON();
      const { addToast } = props.actions;

      userApiService
        .editBidderUser(data, bidderLoginInformationState.bidderUsername)
        .then(() => {
          updateEditBidderState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
          addToast({
            text: "Bidder Successfully Updated!",
            type: "success",
            heading: "Success",
          });
          props.history.push(Paths.manageBidderStatusList);
        })
        .catch(() => {
          updateEditBidderState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
            showErrorAlert: true,
          });
        });
    } else {
      event.stopPropagation();
      updateEditBidderState({
        isSubmitLoading: false,
        isSubmitDisabled: false,
        showErrorAlert: true,
      });
    }
  }

  function handleCancel() {
    isFormSubmitted.next(false);
    props.history.push(Paths.manageBidderStatusList);
  }

  return (
    <StrictMode>
      <div className={"grid-row ui-ppms"}>
        <div className="header-row grid-row grid-gap-4">
          <h1>
            {editBidderState.submitLabel === "Approve"
              ? "REVIEW BIDDER"
              : "EDIT BIDDER"}
          </h1>
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
                show={editBidderState.showErrorAlert}
                alertBody={"Error submitting request."}
                alertClassName={"form-verification-error"}
                alertVariant={"danger"}
                alertKey={"form-verification-error"}
                alertBodyArray={editBidderState.alertMessages}
              />
              {editBidderState.showErrorAlert && <hr />}
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
                submitLabel={editBidderState.submitLabel}
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
                submitLabel={editBidderState.submitLabel}
              />
            </div>
            <div className="grid-row grid-gap-4">
              <PPMSModal
                body={
                  <ModalActionHistoryContent
                    data={editBidderState.actionHistoryData}
                    listID={"list-id"}
                    title={props.match.params.userId}
                  />
                }
                id={"show-action-history"}
                show={editBidderState.showActionHistoryModal}
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
                hideLabel={editBidderState.showActionHistoryModal}
                size={editBidderState.showActionHistoryModal ? "lg" : null}
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
export default connect(null, mapDispatchToProps)(EditBidder);
