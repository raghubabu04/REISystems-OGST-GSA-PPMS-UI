export interface FSCOtherState {
  specialInstructions: string;
  modelMsg: string;
  modelValid: boolean;
  modelInvalid: boolean;
  modelIsRequired: boolean;
  makeMsg: string;
  makeValid: boolean;
  makeInvalid: boolean;
  makeIsRequired: boolean;
  itemNameMsg: string;
  itemNameValid: boolean;
  itemNameInvalid: boolean;
  itemNameIsRequired: boolean;
  specialDescriptionCodeMsg: string;
  specialDescriptionCodeValid: boolean;
  specialDescriptionCodeInvalid: boolean;
  specialDescriptionCodeIsRequired: boolean;
  specialDescriptionTextMsg: string;
  specialDescriptionTextValid: boolean;
  specialDescriptionTextInvalid: boolean;
  specialDescriptionTextIsRequired: boolean;
  FSCCode: string;
  FSCOtherData: {
    make: string;
    model: string;
    itemName: string;
    specialDescriptionCode: string;
    specialDescriptionText: string;
    validateFSCOtherSection?: boolean;
  };
}

export const FSCOtherStateDefault: FSCOtherState = {
  specialInstructions: "",
  modelMsg: "Model must be entered",
  modelValid: false,
  modelInvalid: false,
  modelIsRequired: false,
  makeMsg: "Make must be entered",
  makeValid: false,
  makeInvalid: false,
  makeIsRequired: false,
  itemNameMsg: "Item Name must be entered",
  itemNameValid: false,
  itemNameInvalid: false,
  itemNameIsRequired: false,
  specialDescriptionCodeMsg: "",
  specialDescriptionCodeValid: false,
  specialDescriptionCodeInvalid: false,
  specialDescriptionCodeIsRequired: false,
  specialDescriptionTextMsg: "",
  specialDescriptionTextValid: false,
  specialDescriptionTextInvalid: false,
  specialDescriptionTextIsRequired: false,
  FSCCode: "",
  FSCOtherData: {
    make: "",
    model: "",
    itemName: "",
    specialDescriptionCode: "",
    specialDescriptionText: "",
    validateFSCOtherSection: false,
  },
};
