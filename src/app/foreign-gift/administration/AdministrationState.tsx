export interface AdminState {
  isRequired: boolean;

  presidentName: string;
  isInvalid?: boolean;
  isValid?: boolean;
  adminOptions?: any;
  validationMessage?: string;
}

export const AdminStateDefault = {
  isRequired: true,

  presidentName: "",
  isInvalid: false,
  isValid: false,
  adminOptions: [],
  validationMessage: "Adminstration is required",
};
