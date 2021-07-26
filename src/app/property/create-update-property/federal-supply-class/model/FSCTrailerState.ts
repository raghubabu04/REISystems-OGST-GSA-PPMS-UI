import { trailerBodyStyle, trailerTypeStyle } from "../../constants/Constants";
import { FSCTrailerData } from "./FSCModel";

export interface FSCTrailerState {
  trailerFSCData: FSCTrailerData;
  trailerFSCDataisAwning: string;
  trailerTypeStyleOptions: any[];
  trailerBodyStyleOptions: any[];
  validationMessage: {
    modelMsg: string;
    modelValid: boolean;
    modelInvalid: boolean;
    makeMsg: string;
    makeValid: boolean;
    makeInvalid: boolean;
    modelYearMsg: string;
    modelYearValid: boolean;
    modelYearInvalid: boolean;
    vinMsg: string;
    vinValid: boolean;
    vinInvalid: boolean;
    lengthMsg: string;
    lengthValid: boolean;
    lengthInvalid: boolean;
    barcodeMsg: string;
    barcodeValid: boolean;
    barcodeInvalid: boolean;
    trailerTypeMsg: string;
    trailerTypeValid: boolean;
    trailerTypeInvalid: boolean;
    numberOfAxlesMsg: string;
    numberOfAxlesValid: boolean;
    numberOfAxlesInvalid: boolean;
    numberOfBedroomsMsg: string;
    numberOfBedroomsValid: boolean;
    numberOfBedroomsInvalid: boolean;
    numberOfBathroomsMsg: string;
    numberOfBathroomsValid: boolean;
    numberOfBathroomsInvalid: boolean;
    windZoneMsg: string;
    windZoneValid: boolean;
    windZoneInvalid: boolean;
    bodyStyleMsg: string;
    bodyStyleValid: boolean;
    bodyStyleInvalid: boolean;
    itemNameMsg: string;
    itemNameValid: boolean;
    itemNameInvalid: boolean;
    specialDescriptionCodeMsg: string;
    specialDescriptionCodeValid: boolean;
    specialDescriptionCodeInvalid: boolean;
    specialDescriptionTextMsg: string;
    specialDescriptionTextValid: boolean;
    specialDescriptionTextInvalid: boolean;
  };
}
export const FSCTraillerStateDefaults: FSCTrailerState = {
  trailerFSCData: new FSCTrailerData(),
  trailerFSCDataisAwning: "",
  trailerTypeStyleOptions: trailerTypeStyle,
  trailerBodyStyleOptions: trailerBodyStyle,
  validationMessage: {
    modelMsg: "Model is required",
    modelValid: false,
    modelInvalid: false,
    makeMsg: "Make is required",
    makeValid: false,
    makeInvalid: false,
    modelYearMsg: "Model year is required",
    modelYearValid: false,
    modelYearInvalid: false,
    vinMsg: "Vin is required",
    vinValid: false,
    vinInvalid: false,
    lengthMsg: "Length is required",
    lengthValid: false,
    lengthInvalid: false,
    barcodeMsg: "Barcode is required",
    barcodeValid: false,
    barcodeInvalid: false,
    trailerTypeMsg: "Trailer type is required",
    trailerTypeValid: true,
    trailerTypeInvalid: false,
    numberOfAxlesMsg: "Number of axles is required",
    numberOfAxlesValid: false,
    numberOfAxlesInvalid: false,
    numberOfBedroomsMsg: "Number of bedrooms is required",
    numberOfBedroomsValid: false,
    numberOfBedroomsInvalid: false,
    numberOfBathroomsMsg: "Number of bathrooms is required",
    numberOfBathroomsValid: false,
    numberOfBathroomsInvalid: false,
    windZoneMsg: "Wind zone is required",
    windZoneValid: false,
    windZoneInvalid: false,
    bodyStyleMsg: "Body style is required",
    bodyStyleValid: false,
    bodyStyleInvalid: false,
    itemNameMsg: "Item Name is required",
    itemNameValid: false,
    itemNameInvalid: false,
    specialDescriptionCodeMsg: "Special Description Code is required",
    specialDescriptionCodeValid: false,
    specialDescriptionCodeInvalid: false,
    specialDescriptionTextMsg: "Special Description Text is required",
    specialDescriptionTextValid: false,
    specialDescriptionTextInvalid: false,
  },
};
