import {
  cflEligibleOptions,
  hardDiskStatus,
  isEquipmentForComputersForLearning,
} from "../../constants/ComputerConstants";
import { FSCComputerData } from "./FSCModel";

export interface FSCComputersState {
  make: string;
  computerModel: string;
  makeCFLEligibleForMandatory: boolean;
  fscComputersData: FSCComputerData;
  validationMessage: {
    isEquipmentForCFLValid: boolean;
    isEquipmentForCFLInvalid: boolean;
    isEquipmentForCFLValidationMsg: string;
    cflEligibleorCFLValid: boolean;
    cflEligibleForCFLInvalid: boolean;
    cflEligibleForValidationMsg: string;
    specialDescriptionCodeMsg: string;
    specialDescriptionCodeValid: boolean;
    specialDescriptionCodeInvalid: boolean;
    specialDescriptionTextMsg: string;
    specialDescriptionTextValid: boolean;
    specialDescriptionTextInvalid: boolean;
    itemNameMsg: string;
    itemNameValid: boolean;
    itemNameInvalid: boolean;
  };
  cflEligibleOptions: any[];
  hardDiskStatusOptions: any[];
  isEquipmentForComputersForLearningOptions: any[];
}

export const FSCComputersStateDefault: FSCComputersState = {
  make: "",
  computerModel: "",
  makeCFLEligibleForMandatory: true,
  fscComputersData: new FSCComputerData(),
  validationMessage: {
    isEquipmentForCFLValid: false,
    isEquipmentForCFLInvalid: false,
    isEquipmentForCFLValidationMsg:
      "Is Equipment for Computers for Learning (CFL) is Required.",
    cflEligibleorCFLValid: false,
    cflEligibleForCFLInvalid: false,
    specialDescriptionCodeMsg: "Special Description Code is Required.",
    specialDescriptionCodeValid: false,
    specialDescriptionCodeInvalid: false,
    cflEligibleForValidationMsg: "Is CFL Equipment Eligible is Required.",
    specialDescriptionTextMsg: "Special Description Text is Required.",
    specialDescriptionTextValid: false,
    specialDescriptionTextInvalid: false,
    itemNameMsg: "Item Name is Required.",
    itemNameValid: false,
    itemNameInvalid: false,
  },
  cflEligibleOptions: cflEligibleOptions,
  hardDiskStatusOptions: hardDiskStatus,
  isEquipmentForComputersForLearningOptions: isEquipmentForComputersForLearning,
};
