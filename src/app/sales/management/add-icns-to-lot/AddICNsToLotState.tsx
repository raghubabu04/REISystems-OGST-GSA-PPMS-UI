import React from "react";

export interface AddICNsToLotState {
  data: {
    selectedLot: string;
    propertyList: any[];
    salesId: number;
    salesDetails: any;
  };
  constants: { lotOptions: any[]; lotOptionsData: any[]; addLotOptions: any[] };
  other: { isLotDropdownDisabled: boolean; page: any; actionDisabled: boolean };
  email: string;
  startingIcn: string;
  endingIcn: string;
  aac: string;
  agency: any;
  include: string;
  propType: string;
  fsc: any[];
  hazardous: string;
  assignment: string;
  condition: string;
  stateCode: any[];
  region: string;
  addedService: string;
}
export const AddICNsToLotStateDefault: AddICNsToLotState = {
  data: { selectedLot: "", propertyList: [], salesId: 0, salesDetails: [] },
  constants: {
    lotOptions: [],
    lotOptionsData: [],
    addLotOptions: [
      {
        id: "add-to-new-lot",
        value: "Add to New Lot",
        isSelected: false,
      },
      { id: "add-to-same-lot", value: "Add to Same Lot", isSelected: true },
      {
        id: "add-to-existing-lot",
        value: "Add to Existing Lot",
        isSelected: false,
      },
    ],
  },
  other: {
    isLotDropdownDisabled: false,
    page: {
      currentPage: 1,
      totalRows: 0,
      pageSize: 10,
    },
    actionDisabled: true,
  },
  email: "",
  startingIcn: "",
  endingIcn: "",
  aac: "",
  agency: "",
  include: "Include",
  propType: "",
  fsc: [],
  hazardous: "",
  assignment: "Assigned to Me",
  condition: "",
  stateCode: [],
  region: "",
  addedService: "",
};
