import React, {useContext} from "react";
import {PPMSSelect} from "../../../../../ui-kit/components/common/select/PPMS-select";
import {sendEmailTo} from "../../constants/Constants";
import {MarketingCampaignContext} from "../MarketingCampaignContext";
import {PPMSTextEditor} from "../../../../../ui-kit/components/common/PPMS-texteditor";
import {NotificationApiService} from "../../../../../api-kit/notification/notification-api.service";
import {
  validateEmailTemplate,
  validateTemplateContent,
  validateTemplateName,
} from "../../validations/AddEditCampaignValidations";
import {PPMSButton} from "../../../../../ui-kit/components/common/PPMS-button";
import {EmailSelectionCriteriaState,} from "./EmailSelectionCriteriaState";
import {PPMSModal} from "../../../../../ui-kit/components/common/PPMS-modal";
import {PPMSInput} from "../../../../../ui-kit/components/common/input/PPMS-input";
import PPMSErrorMessage from "../../../../../ui-kit/components/common/form/PPMS-error-message";

export interface EmailSelectionCriteriaProps {
}

export function EmailSelectionCriteriaClass(
  props: EmailSelectionCriteriaProps
) {
  let notificationService = new NotificationApiService();
  const {
    emailSelectionCriteriaState,
    updateEmailSelectionCriteriaState,
  } = useContext(MarketingCampaignContext);

  function handleSendEmailTo(event) {
    let sendEmailSelected = event.target.value;
    updateEmailSelectionCriteriaState({
      sendEmailTo: sendEmailSelected,
    });
  }

  function handleCustomEmailTemplateChange(event) {
    let validation = validateEmailTemplate(event);
    let customEmailTemplateLength: number = 0;
    const customEmailTemplateMaxLength: number = 2000;
    if (
      emailSelectionCriteriaState.customEmailTemplateValue.length < event.length
    ) {
      customEmailTemplateLength =
        customEmailTemplateMaxLength -
        event.trim().replace(/(<([^>]+)>)/g, "").length;
    } else {
      customEmailTemplateLength =
        emailSelectionCriteriaState.customEmailTemplateCharacterLeft +
        (emailSelectionCriteriaState.customEmailTemplateValue.length -
          event.length);
    }
    customEmailTemplateLength =
      customEmailTemplateLength > customEmailTemplateMaxLength
        ? customEmailTemplateMaxLength
        : customEmailTemplateLength;
    updateEmailSelectionCriteriaState({
      customEmailTemplateCharacterLeft: customEmailTemplateLength,
      customEmailTemplateValue: event,
      customEmailTemplateInvalid: validation.isInvalid,
      customEmailTemplateValidationMsg: validation.validationError,
    });
  }

  function handleSelectEmailTemplate(event) {
    let selectedTemplateId =
      event.target.options[event.target.selectedIndex].id;

    let templates = emailSelectionCriteriaState.emailTemplateList;

    let selectedTemplate = templates.find(
      (template) =>
        template.notificationTemplateId.toString() ===
        selectedTemplateId.toString()
    );

    updateEmailSelectionCriteriaState({
      customEmailTemplateValue: selectedTemplate
        ? selectedTemplate.notificationTemplateContent
        : "",
      emailTemplateSelectedValue: selectedTemplate
        ? selectedTemplate.notificationTemplateId
        : "",
    });
  }

  //started ppms-2329

  function getUpdatedAddTemplateState(newState: any) {
    let oldState = emailSelectionCriteriaState.addEmailTemplateModelState;
    return { ...oldState, ...newState };
  }
  function handleAddTemplateNameChange(event) {
    const inputValue = event.target.value;
    let validation = validateTemplateName(inputValue);
    let updatedAddTemplateState = getUpdatedAddTemplateState({
      templateName: inputValue,
      isTemplateNameInvalid: validation.isInvalid,
      templateNameValidationMsg: validation.validationError,
    });
    updateEmailSelectionCriteriaState({
      addEmailTemplateModelState: updatedAddTemplateState,
    });
  }

  function updateTemplate(
    emailSelectionCriteriaState: EmailSelectionCriteriaState
  ) {
    notificationService
      .updateTemplate(emailSelectionCriteriaState)
      .then((response) => {
        showHideUpdateTemplateModel(false);
        notificationService.getTemplates().then((response) => {
          updateEmailSelectionCriteriaState({
            emailTemplateList: response?.data,
          });
        });
      });
  }

  function showHideAddTemplateModel(flag: boolean) {
    let updatedAddTemplateState = getUpdatedAddTemplateState({
      show: flag,
    });

    updateEmailSelectionCriteriaState({
      addEmailTemplateModelState: updatedAddTemplateState,
    });
  }
  function saveAddTemplate(
    emailSelectionCriteriaState: EmailSelectionCriteriaState
  ) {
    let selectedTemplateId = "";
    notificationService
      .addTemplate(emailSelectionCriteriaState)
      .then((response) => {
        selectedTemplateId = response.data.notificationTemplateId;
        showHideAddTemplateModel(false);
        return notificationService.getTemplates();
      })
      .then((response) => {
        let emailTemplates = response?.data;
        let optionsArray = [];

        emailTemplates.forEach((item) => {
          optionsArray.push({
            id: item.notificationTemplateId,
            value: item.notificationTemplateName,
          });
        });
        let selectedTemplate = emailTemplates.find(
          (template) =>
            template.notificationTemplateId.toString() ===
            selectedTemplateId.toString()
        );
        updateEmailSelectionCriteriaState({
          emailTemplateOptions: optionsArray,
          emailTemplateList: response?.data,
          customEmailTemplateValue: selectedTemplate
            ? selectedTemplate.notificationTemplateContent
            : "",
          emailTemplateSelectedValue: selectedTemplate
            ? selectedTemplate.notificationTemplateId
            : "",
        });
      });
  }

  //ppms-2330 defect
  function showHideUpdateTemplateModel(flag: boolean) {
    let updateDailogueTemplateState = getUpdatedDialogueTemplateState({
      show: flag,
    });

    updateEmailSelectionCriteriaState({
      updateEmailTemplateModelState: updateDailogueTemplateState,
    });
  }
  function getUpdatedDialogueTemplateState(newState: any) {
    let oldState = emailSelectionCriteriaState.updateEmailTemplateModelState;
    return { ...oldState, ...newState };
  }

  function handleUpdateTemplateContentChange(event) {
    const inputValue = event.target.value;
    let validation = validateTemplateContent(inputValue);
    let updateddialogueTemplateState = getUpdatedDialogueTemplateState({
      templateContent: inputValue,
      isTemplateContentInvalid: validation.isInvalid,
      templateContentValidationMsg: validation.validationError,
    });
    updateEmailSelectionCriteriaState({
      updateEmailTemplateModelState: updateddialogueTemplateState,
    });
  }

  return (
    <>
      <div className="grid-row">
        <div className="grid-col-5">
          <PPMSSelect
            identifierKey={"id"}
            identifierValue={"value"}
            id={"select-send-email-to"}
            name={"send-email-to"}
            selectName={"send-email-to"}
            label={"Send Email To"}
            isRequired={false}
            values={sendEmailTo}
            placeholderValue={"Send Email To"}
            onChange={handleSendEmailTo}
            selectedValue={emailSelectionCriteriaState.sendEmailTo}
          />
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col-5">
          <PPMSSelect
            identifierKey={"id"}
            identifierValue={"value"}
            id={"select-email-template-select"}
            name={"select-email-Template"}
            selectName={"select-email-template"}
            label={"Select Email Template"}
            isRequired={false}
            values={emailSelectionCriteriaState.emailTemplateOptions}
            placeholderValue={"Custom Email Template"}
            onChange={handleSelectEmailTemplate}
            selectedValue={
              emailSelectionCriteriaState.emailTemplateSelectedValue
            }
          />
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col">
          <PPMSTextEditor
            id={"propertyDescription"}
            value={emailSelectionCriteriaState.customEmailTemplateValue}
            onChange={handleCustomEmailTemplateChange}
            label={"Custom Email Template"}
            isInvalid={emailSelectionCriteriaState.customEmailTemplateInvalid}
            isValid={false}
            message={"Optional"}
            isRequired={false}
            validationMessage={
              emailSelectionCriteriaState.customEmailTemplateValidationMsg
            }
          />
        </div>
      </div>
      {emailSelectionCriteriaState.customEmailTemplateCharacterLeft >= 0 ? (
        <span>
          <strong>
            {emailSelectionCriteriaState.customEmailTemplateCharacterLeft}
          </strong>{" "}
          Character(s) left
        </span>
      ) : (
        ""
      )}
      <br />
      <br />
      <div className="grid-row grid-gap">
        <div className="grid-column">
          <PPMSButton
            id={"add-template"}
            type={"button"}
            value={"addTemplate"}
            label={"Add Template"}
            isDisabled={
              emailSelectionCriteriaState.customEmailTemplateValue?.trim()
                ?.length == 0 ||
              emailSelectionCriteriaState?.emailTemplateSelectedValue
            }
            onPress={(event) => showHideAddTemplateModel(true)}
          />
          <PPMSButton
            id={"update-template"}
            type={"button"}
            value={"updateTemplate"}
            label={"Update Template"}
            isDisabled={
              !emailSelectionCriteriaState?.emailTemplateSelectedValue
            }
            onPress={(event) => showHideUpdateTemplateModel(true)}
            //onPress={(event) =>  updateTemplate(emailSelectionCriteriaState)}
          />
        </div>
      </div>

      <div className="grid-row grid-gap-4">
        <PPMSModal
          show={emailSelectionCriteriaState.addEmailTemplateModelState.show}
          handleClose={(event) => showHideAddTemplateModel(false)}
          handleSave={(event) => saveAddTemplate(emailSelectionCriteriaState)}
          title={"Add Template"}
          centered={true}
          backdrop={"static"}
          label={"Save"}
          labelCancel={"Cancel"}
          body={
            <div>
              <div className="grid-row">
                <div className="grid-col">
                  <PPMSInput
                    isInvalid={
                      emailSelectionCriteriaState.addEmailTemplateModelState
                        .isTemplateNameInvalid
                    }
                    isValid={true}
                    id={"add-template-name-id"}
                    name={"add-template-name"}
                    isRequired={true}
                    inputType={"text"}
                    isDisabled={false}
                    label={"Template Name"}
                    maxLength={20}
                    minLength={8}
                    onChange={handleAddTemplateNameChange}
                    value={
                      emailSelectionCriteriaState.addEmailTemplateModelState
                        .templateName
                    }
                  />
                  {emailSelectionCriteriaState.addEmailTemplateModelState
                    .isTemplateNameInvalid && (
                    <PPMSErrorMessage>
                      {
                        emailSelectionCriteriaState.addEmailTemplateModelState
                          .templateNameValidationMsg
                      }
                    </PPMSErrorMessage>
                  )}
                </div>
              </div>
            </div>
          }
          id={"add-template-model"}
        />
      </div>
      <div className="grid-row grid-gap-4">
        <PPMSModal
          id={"updatemessage-template-name-id"}
          show={emailSelectionCriteriaState.updateEmailTemplateModelState.show}
          handleClose={(event) => showHideUpdateTemplateModel(false)}
          handleSave={(event) => updateTemplate(emailSelectionCriteriaState)}
          title={"Do you want to save changes to Update template?"}
          label={"Yes"}
          labelCancel={"No"}
        />
      </div>
    </>
  );
}
