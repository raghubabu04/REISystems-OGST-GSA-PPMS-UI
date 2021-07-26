import React, {StrictMode, useContext, useEffect} from "react";
import {GroupEmailsContext} from "./GroupEmailsContext";
import GroupEmailsSideNav from "./GroupEmailsSideNav";
import GroupEmailsButtons from "./GroupEmailsButtons";
import {EmailContentClass} from "./email-content/EmailContentClass";
import {isFormSubmitted} from "../../../service/validation.service";
import {Paths} from "../../Router";
import {PPMSForm} from "../../../ui-kit/components/common/form/PPMS-form";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import {EmailCriteriaClass, RECIPIENT_TYPE} from "./email-criteria/EmailCriteriaClass";
import {Upload} from "./Uploads/Upload";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {addToast} from "../../../_redux/_actions/toast.actions";
import {UserApiService} from "../../../api-kit/user/user-api.service";
import {EmailCriteriaStateDefault} from "./email-criteria/EmailCriteriaState";
import {EmailContentStateDefault} from "./email-content/EmailContentState";
import {GroupEmailsStateDefault} from "./GroupEmailsState";
import {UserUtils} from "../../../utils/UserUtils";

export interface AddGroupEmailsProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
  alertSuccess: any;
  alertError: any;
}

export function AddGroupEmails(props: AddGroupEmailsProps) {
  const {
    //Email Criteria
    emailCriteriaState,
    updateEmailCriteriaState,

    //Email Content
    emailContentState,
    updateEmailContentState,

    groupEmailsState,
    updateGroupEmailsState,
  } = useContext(GroupEmailsContext);

  function setDefaultValues() {
    updateEmailCriteriaState(EmailCriteriaStateDefault);
    let recipientTypeList = RECIPIENT_TYPE.forEach((type) => {
      type.isSelected = false;
    })
    updateEmailCriteriaState({
      agency: [],
      state: [],
      recipientType: recipientTypeList
    });
    updateEmailContentState(EmailContentStateDefault);
    updateGroupEmailsState(GroupEmailsStateDefault);
  }

  function handleSubmit(event) {
    isFormSubmitted.next(true);
    event.preventDefault();
    updateGroupEmailsState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
    });

    const form = event.currentTarget;
    //form.checkValidity() &&
    if (form.checkValidity()) {
      updateGroupEmailsState({
        showErrorAlert: false,
      });

      const data = {
        id: groupEmailsState.groupEmailId,
        agencyBureaus: emailCriteriaState.agency.map((a) => a.id).join(),
        stateCodes: emailCriteriaState.state.map((a) => a.id).join(),
        recipientTypes: emailCriteriaState.recipientType
          ?.map((a) => a.id)
          .join(), //other valid values - Airport
        emailText: emailContentState.EmailTextValue,
        subjectLine: emailContentState.subjectLine,
        status: "Submitted", //other valid value - Draft
        emailCriteriaId: groupEmailsState.groupEmailCriteriaId,
        bidderType: emailCriteriaState.bidderType,
        bidderCity: emailCriteriaState.bidderCity,
        bidderStateCode: emailCriteriaState.bidderStateCode,
        saleNumber: emailCriteriaState.saleNumber,
        lotNumber: emailCriteriaState.lotNumber,
      };
      const { addToast } = props.actions;
      const userApiService = new UserApiService();

      userApiService
        .sendGroupEmails(data)
        .then(() => {
          updateGroupEmailsState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
          addToast({
            text: "Sent Group Emails Successfully",
            type: "success",
            heading: "Success",
          });
          props.history.push({
            pathname: `${Paths.home}`,
          });
        })
        .catch(() => {
          updateGroupEmailsState({
            showErrorAlert: true,
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
        });
    } else {
      event.stopPropagation();
      updateGroupEmailsState({
        isSubmitLoading: false,
        isSubmitDisabled: false,
        showErrorAlert: true,
      });
    }
  }

  useEffect(() => {
    setDefaultValues();
  }, []);

  function cancelButtonClick() {
    isFormSubmitted.next(false);
    props.history.push({
      pathname: `${Paths.home}`,
    });
  }

  const onFileUpload = (data: any) => {
    updateGroupEmailsState({ fileUploaded: data.fileUploaded });
  };
  const disableBtn = (disable: boolean) => {
    if (!disable) {
      updateGroupEmailsState({ disableBtn: disable });
    } else {
      updateGroupEmailsState({ disableBtn: true });
    }
  };

  const updateStateWithEmailIds = (
    groupEmailId: string,
    groupEmailCriteriaId: string
  ) => {
    updateGroupEmailsState({
      groupEmailId: groupEmailId,
      groupEmailCriteriaId: groupEmailCriteriaId,
    });
  };

  function isUserSmApoNuo(): boolean {
    //AC is the Permission for APO
    const roles = ["SM", "AC", "NU"];
    const userPermissions: string[] = UserUtils.getUserPermissions();
    return roles.some((i) => userPermissions.includes(i));
  }

  function isUserSales(): boolean {
    return UserUtils.getUserTypeFromToken() == 'SLS' &&
      (UserUtils.getUserRoles().includes("CLO") || UserUtils.getUserRoles().includes("SG") ||
        UserUtils.getUserRoles().includes("SCO") || UserUtils.getUserRoles().includes("CO") || UserUtils.getUserRoles().includes("SMS"))
  }

  return (
    <StrictMode>
      <div className={"add-marketing-campaign grid-row ui-ppms"}>
        <div className="grid-row header-row mb-3">
          <h1>Group Emails </h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <GroupEmailsSideNav />
              </nav>
            </div>
          </div>
        </div>
        <div className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <PPMSForm
            noValidate
            // validate={marketingCampaignState.isFormValidated}
            large={false}
            search={true}
            onSubmit={handleSubmit}
            className={"usa-accordion--bordered desktop:grid-col-12"}
          >
            <div className={"grid-row grid-gap-2"}>
              <GroupEmailsButtons
                isSubmitDisabled={groupEmailsState.disableBtn}
                isSubmitLoading={false}
                cancelFunction={cancelButtonClick}
              />
            </div>
            <br />
            {(isUserSmApoNuo() || isUserSales()) && (<PPMSAccordion
              items={[
                {
                  title: "Email Criteria",
                  content: <EmailCriteriaClass />,
                  expanded: true,
                  id: "email-criteria-id",
                  className: "email-criteria",
                },
              ]}
            />)}
            <PPMSAccordion
              items={[
                {
                  title: "Email Content",
                  content: <EmailContentClass />,
                  expanded: true,
                  id: "email-content-id",
                  className: "email-content",
                },
              ]}
            />
            <br />
            <PPMSAccordion
              items={[
                {
                  title: "Upload Attachments",
                  id: "documents",
                  className: "upload-documents",
                  content: (
                    <Upload
                      fileInfectedStatus={(value) =>
                        updateGroupEmailsState({ fileInfectedStatus: value })
                      }
                      onFileUpload={onFileUpload}
                      updateGroupEmailIds={updateStateWithEmailIds}
                      groupEmailId={groupEmailsState.groupEmailId}
                      disableBtn={disableBtn}
                    />
                  ),
                  expanded: true,
                },
              ]}
            />

            <br />
            <div className={"grid-row grid-gap-2"}>
              <GroupEmailsButtons
                isSubmitDisabled={groupEmailsState.disableBtn}
                isSubmitLoading={false}
                cancelFunction={cancelButtonClick}
              />
            </div>
          </PPMSForm>
        </div>
      </div>
    </StrictMode>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(AddGroupEmails);
