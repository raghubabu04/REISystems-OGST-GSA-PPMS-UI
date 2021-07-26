export interface FSCWeaponsState {
  weaponTypes: any;

  serialValidation: string;
  specialDescriptionCodeMsg: string;
  specialDescriptionCodeInvalid: boolean;
  specialDescriptionTextMsg: string;
  specialDescriptionTextInvalid: boolean;
  weaponTypesIsValid: boolean;
  weaponTypesIsInvalid: boolean;
  isInvalid: boolean;
  isValid: boolean;
  validationMessage: string;
  weaponsTypeValidationMessage: string;
  selectedValues: any;
  itemName: string;
  itemNameMsg: string;
  itemNameValid: boolean;
  itemNameInvalid: boolean;
  FSCWeaponData: {
    type: string;
    make: string;
    model: string;
    size: string;
    longName: string;
    specialDescriptionCode: string;
    specialDescriptionText: string;
  };
}

export const FSCWeaponsStateDefault: FSCWeaponsState = {
  weaponTypes: [],
  serialValidation: "Serial Number is mandatory",
  specialDescriptionCodeMsg: "You must provide correct description",
  specialDescriptionCodeInvalid: false,
  specialDescriptionTextMsg: "Special Description Text is required",
  specialDescriptionTextInvalid: false,
  weaponTypesIsValid: false,
  weaponTypesIsInvalid: false,
  isInvalid: false,
  isValid: false,
  validationMessage: "",
  weaponsTypeValidationMessage: "",
  selectedValues: [],
  itemName: "",
  itemNameMsg: "Item Name is required",
  itemNameValid: false,
  itemNameInvalid: false,
  FSCWeaponData: {
    type: "",
    make: "",
    model: "",
    size: "",
    longName: "",
    specialDescriptionCode: "",
    specialDescriptionText: "",
  },
};
