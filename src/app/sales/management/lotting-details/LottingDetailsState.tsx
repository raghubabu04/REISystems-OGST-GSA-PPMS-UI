export interface LottingDetailsState {
  data: {
    salesId: number;
    lots: any[];
    salesDetails: any;
    totalIcnCount: number;
    totalLotCount: number;
  };
  errors: {
    invalidLots: any[];
  };
  constants: {
    lotOptions: any[];
    lotOptionsData: any[];
    isLotDescriptionDisabled: boolean;
    selectedLotDescriptionType: string;
    lotDescriptionType: any[];
  };
edit_properties:{
  actionDisabled: boolean;
  lotNameDisabled: boolean;
  reservepriceDisabled:boolean;
  startingbidDisabled:boolean;
  templateDisabled:boolean;
  lotdescriptionDisabled:boolean;
  imageDisabled:boolean;
},
  other: {
    totalProperties: number;
    page: any;
    showDelotModal: boolean;
    showNoResultsModal: boolean;
    modalMessage: string;
    property: any;
    lotName: any;
    fscCodes: any[];
    fscCodeList: any[];
    fcsSelectedValues: any[];
    itemControlNumber: string;
    icnIsInvalid: boolean;
    icnIsValid: boolean;
    icnValidationMessage: string;
    aacId: string;
    aacIsInvalid: boolean;
    aacIsValid: boolean;
    aacValidationMessage: string;
    agencyBureaus: any[];
    agencyBureauIsInvalid: boolean;
    agencyBureauIsValid: boolean;
    agencyBureauValidationMessage: string;
    selectedAgencyBureaus: any[];
    selectedPropertyType: any;
    propertyTypeIsInvalid: boolean;
    propertyTypeIsValid: boolean;
    propertyTypeValidationMessage: string;
    includeExclude?: string;
    isChecked?: boolean;
  };
  filters: {
    agency: any;
    include: string;
    propType: string;
    fsc: any[];
    icn: string;
    lotName: string;
  };
}
export const LottingDetailsStateDefault: LottingDetailsState = {
  data: {
    salesId: 0,
    lots: [],
    totalIcnCount: 0,
    totalLotCount: 0,
    salesDetails: [],
  },
  constants: {
    lotOptions: [],
    lotOptionsData: [],
    selectedLotDescriptionType: "ICN",
    lotDescriptionType: [
      { id: "ICN", value: "Use ICN Description" },
      { id: "CUS", value: "Custom Description" },
    ],
    isLotDescriptionDisabled: true,
  },
  errors: {
    invalidLots: [],
  },
  edit_properties:{
    actionDisabled: true,
    lotNameDisabled: true,
    reservepriceDisabled:true,
    startingbidDisabled:true,
    templateDisabled:true,
    lotdescriptionDisabled:true,
    imageDisabled:true
  },
  other: {
    totalProperties: 0,
    page: {
      currentPage: 1,
      totalRows: 0,
      pageSize: 10,
    },
    showDelotModal: false,
    showNoResultsModal: false,
    modalMessage: "",
    property: {},
    lotName: "",
    fscCodes: [],
    fscCodeList: [],
    fcsSelectedValues: [],
    itemControlNumber: "",
    icnIsInvalid: false,
    icnIsValid: false,
    icnValidationMessage: "",
    aacId: "",
    aacIsInvalid: false,
    aacIsValid: false,
    aacValidationMessage: "",
    agencyBureaus: [],
    agencyBureauIsInvalid: false,
    agencyBureauIsValid: false,
    agencyBureauValidationMessage: "",
    selectedAgencyBureaus: [],
    selectedPropertyType: "",
    propertyTypeIsInvalid: false,
    propertyTypeIsValid: false,
    propertyTypeValidationMessage: "",
    includeExclude: "Include",
    isChecked: false,
  },
  filters: {
    agency: "",
    include: "Include",
    propType: "",
    fsc: [],
    icn: "",
    lotName: "",
  },
};
