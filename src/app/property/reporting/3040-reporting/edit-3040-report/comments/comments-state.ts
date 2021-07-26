export interface Comments3040State {
  saspComments: string;
  saspCommentsIsRequired: boolean;
  saspCommentsIsInValid: boolean;
  saspCommentsIsValid: boolean;
  saspCommentsValidationMessage: string;
  gsaComments: string;
  gsaCommentsIsRequired: boolean;
  gsaCommentsValidationMessage: string;
  gsaCommentsIsInValid: boolean;
  gsaCommentsIsValid: boolean;
}

export const comments3040StateDefault: Comments3040State = {
  saspComments: "",
  saspCommentsIsRequired: false,
  saspCommentsValidationMessage: "",
  saspCommentsIsInValid: false,
  saspCommentsIsValid: false,
  gsaComments: "",
  gsaCommentsIsRequired: false,
  gsaCommentsValidationMessage: "",
  gsaCommentsIsInValid: false,
  gsaCommentsIsValid: false,
};
