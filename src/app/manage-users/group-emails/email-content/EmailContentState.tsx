export interface EmailContentState {
  subjectLine?: any;
  EmailTextCharacterLeft?: any;
  EmailTextValue?: any;
  EmailTextInvalid?: boolean;
  EmailTextValidationMsg?: string;
  SubjectLineInvalid?: boolean;
  SubjectLineValidationMsg?: string;
}

export const EmailContentStateDefault = {
  subjectLine: "",
  EmailTextValue: "",
  EmailTextCharacterLeft: 5000,
  EmailTextInvalid: false,
  EmailTextValidationMsg: "",
  SubjectLineInvalid: false,
  SubjectLineValidationMsg: ""
};
