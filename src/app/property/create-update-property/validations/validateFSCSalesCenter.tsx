import { salesCenter_RequirementConstants } from "../constants/FSCConstants";

export default function validateFSCSalesCenter(
  fsc_AssetSalesCenter: string,
  selected_SupplyCode: string,
  icn_AAC: string,
  selected_StateCode: string,
  selected_AgencyCode: string
) {
  let validation: SalesCenterValidation = new SalesCenterValidation();

  const validateAgainst = salesCenter_RequirementConstants;

  const supplyCode_isAircraftRelated = selected_SupplyCode.startsWith("15");
  const supplyCode_isWaiverRequired = validateAgainst.fsc_WaiverRequiringClassCodes.includes(
    selected_SupplyCode
  );
  const supplyCode_isVehicleRelated = selected_SupplyCode.startsWith("23");
  const PropertyLocation_isMetroDC = validateAgainst.fsc_MetroDcLocations.includes(
    selected_StateCode
  );
  const AgencyCode_isLegislative = validateAgainst.fsc_legislativeAgencies.includes(
    selected_AgencyCode.substring(0, 2)
  );

  const salesCenteris_DOIorAMD =
    fsc_AssetSalesCenter && fsc_AssetSalesCenter === "4";
  const salesCenteris_DeptOfTreasury =
    fsc_AssetSalesCenter && fsc_AssetSalesCenter === "5";
  const salesCenteris_USDACEPO =
    fsc_AssetSalesCenter && fsc_AssetSalesCenter === "A";
  const salesCenteris_Legislative =
    fsc_AssetSalesCenter && fsc_AssetSalesCenter === "6";
  const salesCenteris_CoverdByApprovedWaiver =
    fsc_AssetSalesCenter && fsc_AssetSalesCenter === "N";

  // PPDMS:763 Validate against FSG = 15
  if (salesCenteris_DOIorAMD && !supplyCode_isAircraftRelated) {
    validation.isSalesCenterInValid = true;
    validation.salesCenterValidationMessage =
      "Sales Center DOI/AMD can be selected only if FSG=15";
  }
  // PPDMS:763 Validate against FSG = 23
  if (salesCenteris_DeptOfTreasury && !supplyCode_isVehicleRelated) {
    validation.isSalesCenterInValid = true;
    validation.salesCenterValidationMessage =
      "Sales Center Dept. of Treasury/IRS Vehicle Sales can be selected only if FSG = 23";
  }

  // PPDMS:763 Validate Against Location
  if (salesCenteris_USDACEPO && !PropertyLocation_isMetroDC) {
    validation.isSalesCenterInValid = true;
    validation.salesCenterValidationMessage =
      "Federal Assets Sale center for USDA-CEPO must be located in DC,MD,VA";
  }
  // PPDMS:763 Validate Against Agency Code
  if (salesCenteris_Legislative && !AgencyCode_isLegislative) {
    validation.isSalesCenterInValid = true;
    validation.salesCenterValidationMessage =
      "Sales Center Legislative or Judicial Branches can be selected only if Agency = 00, 10 or 11";
  }
  // PPDMS:763 Validate Against Federal Supply Code
  if (supplyCode_isWaiverRequired && !salesCenteris_CoverdByApprovedWaiver) {
    validation.isSalesCenterInValid = true;
    validation.salesCenterValidationMessage =
      "Select Approved Waiver of Federal Asset Sales Center for FSC 1005, 1010, 1015, 1020, 1025, 1030 or 1035";
  }
  return validation;
}

export function validateAACRistrictionInSalesCenter(AACCode: string) {
  let shouldDisable = false;
  salesCenter_RequirementConstants.fsc_icnAAC.forEach((icnaactoCheck: string) => {
    if (AACCode.toLowerCase() === icnaactoCheck.toLowerCase()) {
      shouldDisable = true;
    }
  });

  return shouldDisable;
}

export class SalesCenterValidation {
  isSalesCenterInValid: boolean = false;
  salesCenterValidationMessage: string = "";
  isSalesCenterdisabled: boolean = false;
}
