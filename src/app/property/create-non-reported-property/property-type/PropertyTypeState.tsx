import { propertyActionCodes, propertyTypeConst } from "../constants/Constants";

export interface PropertyTypeState {
  propertyType: string;
  propertyActionCode: string;
  propertyTypeIsInvalid?: any;
  propertyTypeValidationMessage?: any;
  }
  
export const PropertyTypeStateDefault = {
  propertyType: propertyTypeConst.airportDonations,
  propertyActionCode:propertyActionCodes.publicReports,
  propertyTypeIsInvalid: false,
  propertyTypeValidationMessage: "",
  };
  