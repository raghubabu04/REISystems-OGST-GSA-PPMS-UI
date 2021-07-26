import React, { StrictMode, useContext, useEffect } from "react";
import { BidderContext } from "./BidderContext";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import { bindActionCreators } from "redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import BidderSideNavBar from "./BidderSideNavbar";
import { PPMSForm } from "../../../ui-kit/components/common/form/PPMS-form";
import { isFormSubmitted } from "../../../service/validation.service";
import BidderButtons from "./BidderButtons";
import { Paths } from "../../Router";
import BidderLoginInformation from "./bidder-login-information/BidderLoginInformation";
import BidderPersonalInformation from "./bidder-personal-information/BidderPersonalInformation";
import BidderPrimaryAddressInformation from "./bidder-primary-address-information/BidderPrimaryAddressInformation";
import BidderSecondaryAddressInformation from "./bidder-secondary-address-information/BidderSecondaryAddressInformation";
import BidderContactInformation from "./bidder-contact-information/BidderContactInformation";
import BidderTermsAndConditions from "./bidder-terms-and-conditions/BidderTermsAndCondition";
import BidderExperianVerification from "./bidder-experian-verification/BidderExperianVerification";
import BidderAccountPreferences from "./bidder-account-preferences/BidderAccountPreferences";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";
import { BidderUserDTO } from "../../models/BidderUser";
import { UserApiService } from "../../../api-kit/user/user-api.service";
import {
  bidderLoginInformationStateDefault,
  BidderLoginInformationStateJson,
} from "./bidder-login-information/BidderLoginInformationState";
import {
  bidderPersonalInformationStateDefault,
  BidderPersonalInformationStateJson,
} from "./bidder-personal-information/BidderPersonalInformationState";
import {
  bidderPrimaryAddressInformationStateDefault,
  BidderPrimaryAddressInformationStateJson,
} from "./bidder-primary-address-information/BidderPrimaryAddressInformationState";
import {
  bidderSecondaryAddressInformationStateDefault,
  BidderSecondaryAddressInformationStateJson,
} from "./bidder-secondary-address-information/BidderSecondaryAddressInformationState";
import {
  bidderContactInformationStateDefault,
  BidderContactInformationStateJson,
} from "./bidder-contact-information/BidderContatInformationState";
import {
  bidderExperianVerificationDefault,
  BidderExperianVerificationStateJson,
} from "./bidder-experian-verification/BidderExperianVerificationState";
import {
  bidderAccountPreferencesStateDefault,
  BidderAccountPreferencesStateJson,
} from "./bidder-account-preferences/BidderAccountPreferencesState";
import { bidderTermsAndConditionsStateDefault } from "./bidder-terms-and-conditions/BidderTermsAndConditionState";

interface AddBidderProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

export function AddBidder(props: AddBidderProps) {
  const {
    bidderLoginInformationState,
    updateBidderLoginInformationState,
    addBidderState,
    updateAddBidderState,
    bidderPrimaryAddressInformationState,
    updateBidderPrimaryAddressInformationState,
    bidderTermsAndConditionsState,
    updateBidderTermsAndConditionsState,
    bidderPersonalInformationState,
    updateBidderPersonalInformationState,
    bidderSecondaryAddressInformationState,
    updateBidderSecondaryAddressInformationState,
    bidderContactInformationState,
    updateBidderContactInformationState,
    bidderExperianVerificationState,
    updateBidderExperianVerificationState,
    bidderAccountPreferencesState,
    updateBidderAccountPreferencesState,
  } = useContext(BidderContext);

  let experianVerification;
  let userApiService = new UserApiService();

  useEffect(() => {
    setDefaultValues();
    isFormSubmitted.next(false);
  }, []);

  function setDefaultValues() {
    updateBidderLoginInformationState(bidderLoginInformationStateDefault);
    updateBidderTermsAndConditionsState(bidderTermsAndConditionsStateDefault);
    updateBidderAccountPreferencesState(bidderAccountPreferencesStateDefault);
    bidderLoginInformationState.loginInfoOptions.forEach((item) => {
      item.isDisabled = false;
      item.isSelected = false;
    });
    updateBidderLoginInformationState({
      loginInfoOptions: bidderLoginInformationState.loginInfoOptions,
    });
    bidderTermsAndConditionsState.agreementOptions.forEach((item) => {
      item.isSelected = false;
    });
    updateBidderTermsAndConditionsState({
      agreementOptions: bidderTermsAndConditionsState.agreementOptions,
    });
    bidderAccountPreferencesState.accountPreferencesOptions.forEach((item) => {
      item.isSelected = false;
    });
    updateBidderAccountPreferencesState({
      accountPreferencesOptions:
        bidderAccountPreferencesState.accountPreferencesOptions,
    });
    bidderPrimaryAddressInformationState.isAddressPoBoxOptions.forEach(
      (item) => {
        item.isSelected = false;
      }
    );
    bidderPersonalInformationState.usaCitizenOptions.forEach((item) => {
      item.isSelected = false;
    });
    updateBidderPrimaryAddressInformationState(
      bidderPrimaryAddressInformationStateDefault
    );
    updateBidderPersonalInformationState(bidderPersonalInformationStateDefault);
    updateBidderSecondaryAddressInformationState(
      bidderSecondaryAddressInformationStateDefault
    );
    updateBidderContactInformationState(bidderContactInformationStateDefault);
    updateBidderExperianVerificationState(bidderExperianVerificationDefault);
  }

  if (bidderLoginInformationState.regTypeToggle === "individual") {
    experianVerification = {
      title: "Experian Verification",
      content: <BidderExperianVerification />,
      expanded: true,
      id: "experian-verification-id",
      trigger: "common",
    };
  }

  let physicalAddress;
  if (bidderPrimaryAddressInformationState.isPrimaryAddressPoBox) {
    physicalAddress = {
      title: "Physical Address Information",
      content: <BidderSecondaryAddressInformation />,
      expanded: true,
      id: "secondary-address-information-id",
      trigger: "common",
    };
  }

  const loginInfo = [
    {
      title: "Login Information",
      content: <BidderLoginInformation />,
      expanded: true,
      id: "header-login-information-id",
      trigger: "common",
    },
  ];
  const termsCondition = [
    {
      title: "Terms and Conditions",
      content: <BidderTermsAndConditions />,
      expanded: true,
      id: "terms-and-conditions-id",
      trigger: "common",
    },
  ];

  const items = [
    {
      title: "Personal Information",
      content: <BidderPersonalInformation />,
      expanded: true,
      id: "personal-information-id",
      trigger: "common",
    },
    {
      title: "Primary Address information",
      content: <BidderPrimaryAddressInformation />,
      expanded: true,
      id: "primary-address-information-id",
      trigger: "common",
    },
    {
      title: "Contact information",
      content: <BidderContactInformation />,
      expanded: true,
      id: "contact-information-id",
      trigger: "common",
    },
    {
      title: "Account Preferences",
      content: <BidderAccountPreferences />,
      expanded: true,
      id: "account-preferences-id",
      trigger: "common",
    },
  ];
  if (experianVerification) items.splice(-1, 0, experianVerification);
  if (physicalAddress) items.splice(2, 0, physicalAddress);

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
    let bidderExperianVerification = BidderExperianVerificationStateJson(
      bidderExperianVerificationState
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
      bidderStatus: "SUBMITTED",

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
      creditCardNumber: bidderExperianVerification.creditCardNumber,
      consentForExperian: bidderExperianVerification.consentForExperian,
      notifyAuctionWin: bidderAccountPreferences.notifyAuctionWin,
      notifyItemOutbid: bidderAccountPreferences.notifyItemOutbid,
    } as unknown) as BidderUserDTO;
  }

  function handleSubmit(event) {
    isFormSubmitted.next(true);
    event.preventDefault();
    updateAddBidderState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
    });
    const form = event.currentTarget;
    if (
      form.checkValidity() &&
      bidderPersonalInformationState.defaultUSACitizenToggle.length !== 0 &&
      bidderPrimaryAddressInformationState.defaultIsPrimaryAddressPoBox
        .length !== 0
    ) {
      updateAddBidderState({
        showErrorAlert: false,
      });
      const data: BidderUserDTO = toJSON();
      const { addToast } = props.actions;

      userApiService
        .registerBidderUser(data)
        .then(() => {
          updateAddBidderState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
          addToast({
            text: "Bidder Successfully Added!",
            type: "success",
            heading: "Success",
          });
          props.history.push(Paths.auctionLogin);
        })
        .catch(() => {
          updateAddBidderState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
            showErrorAlert: true,
          });
        });
    } else {
      event.stopPropagation();
      updateAddBidderState({
        isSubmitLoading: false,
        isSubmitDisabled: false,
        showErrorAlert: true,
      });
    }
  }

  function cancelButtonClick() {
    // reset login information radio btn
    let loginRadioToggle = bidderLoginInformationState.loginInfoOptions;
    let resetRadio = loginRadioToggle.forEach((r) => (r.isSelected = false));
    updateBidderLoginInformationState({
      loginInfoOptions: resetRadio,
    });
    isFormSubmitted.next(false);
    props.history.push(Paths.auctionLogin);
  }

  return (
    <StrictMode>
      <div className={"grid-row ui-ppms"}>
        <div className="header-row grid-row grid-gap-4">
          <h1>BIDDER REGISTRATION</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <BidderSideNavBar
                  isConfirmLoginEnabled={
                    bidderLoginInformationState.showUsernameSuccess
                  }
                  isAllAgreementsEnabled={
                    bidderTermsAndConditionsState.isAllTermsAndConditionAccepted
                  }
                  isIndividualSelected={
                    bidderLoginInformationState.regTypeToggle === "individual"
                  }
                  isPhysicalAddressEnabled={
                    !bidderPrimaryAddressInformationState.isPrimaryAddressPoBox
                  }
                />
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
                id={"form-verification-error"}
                show={addBidderState.showErrorAlert}
                alertBody={"Error submitting request."}
                alertClassName={"form-verification-error"}
                alertVariant={"danger"}
                alertKey={"form-verification-error"}
                alertBodyArray={addBidderState.alertMessages}
              />
              {addBidderState.showErrorAlert && <hr />}
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
            {bidderTermsAndConditionsState.isAllTermsAndConditionAccepted ? (
              <div className={"grid-row grid-gap-2"}>
                <BidderButtons
                  isSubmitDisabled={false}
                  isSubmitLoading={false}
                  cancelFunction={cancelButtonClick}
                />
              </div>
            ) : (
              <div className={"grid-row grid-gap-2"}>
                <BidderButtons
                  isSubmitDisabled={true}
                  isSubmitLoading={false}
                  cancelFunction={cancelButtonClick}
                />
              </div>
            )}
            <br />
            <PPMSAccordion bordered={true} items={loginInfo} />
            {bidderLoginInformationState.showUsernameSuccess && (
              <PPMSAccordion bordered={true} items={termsCondition} />
            )}
            {bidderTermsAndConditionsState.isAllTermsAndConditionAccepted && (
              <PPMSAccordion bordered={true} items={items} />
            )}
            {bidderTermsAndConditionsState.isAllTermsAndConditionAccepted ? (
              <div className={"grid-row grid-gap-2 add-margin-top"}>
                <BidderButtons
                  isSubmitDisabled={false}
                  isSubmitLoading={false}
                  cancelFunction={cancelButtonClick}
                />
              </div>
            ) : (
              <div className={"grid-row grid-gap-2 add-margin-top"}>
                <BidderButtons
                  isSubmitDisabled={true}
                  isSubmitLoading={false}
                  cancelFunction={cancelButtonClick}
                />
              </div>
            )}
          </PPMSForm>
          <br />
        </main>
      </div>
    </StrictMode>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(AddBidder);
