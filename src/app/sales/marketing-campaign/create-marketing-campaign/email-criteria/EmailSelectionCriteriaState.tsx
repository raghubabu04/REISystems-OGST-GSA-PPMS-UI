export interface EmailSelectionCriteriaState {
  sendEmailTo?: any;
  emailTemplateOptions?: any;
  emailTemplateList?: any;
  emailTemplateSelectedValue?: any;
  customEmailTemplateCharacterLeft?: any;
  customEmailTemplateValue?: any;
  customEmailTemplateInvalid?: boolean;
  customEmailTemplateValidationMsg?: string;
  addEmailTemplateModelState? :AddEmailTemplateModelState;
  updateEmailTemplateModelState? :UpdateEmailTemplateModelState;
}



export interface UpdateEmailTemplateModelState
{
  show?: boolean;
  templateContent?: string;
  isTemplateContentInvalid?: boolean,
  templateContentValidationMsg? : string,
}


export interface AddEmailTemplateModelState  {
  show?: boolean;
  templateName?: string;
  isTemplateNameInvalid?: boolean,
  templateNameValidationMsg? : string,
}

export const EmailSelectionCriteriaStateDefault = {
  sendEmailTo: "",
  emailTemplateOptions: [],
  emailTemplateList: [],
  customEmailTemplateValue: "",
  customEmailTemplateCharacterLeft: 2000,
  customEmailTemplateInvalid: false,
  customEmailTemplateValidationMsg: "",
  addEmailTemplateModelState : {
    show: false,
    templateName : ""
  },
  updateEmailTemplateModelState : {
    show: false,
    templateContent : ""
  }
};
