export interface SalesUserZoneState {
  isAddDisabled: boolean;
  isAddAllDisabled: boolean;
  isZoneEmpty: boolean;
  validationMessage: string;
  zoneList: Array<any>;
  selectedZone: string;
  zoneRegions: Array<any>;
  addedZonesList: Array<any>;
}

export const salesUserZoneDefault: SalesUserZoneState = {
  isAddDisabled: true,
  isAddAllDisabled: false,
  isZoneEmpty: false,
  validationMessage: "",
  zoneList: [],
  selectedZone: "",
  zoneRegions: [],
  addedZonesList: [],
}

export const SalesUserZoneStateJson = (
  salesUserZoneState: SalesUserZoneState
) => [
  {
    userZones: salesUserZoneState.addedZonesList,
  },
];
