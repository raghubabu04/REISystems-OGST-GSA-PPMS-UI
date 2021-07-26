export interface UserProfileForSalesUserZoneState {
  zoneList: Array<any>;
}

export const userProfileForSalesUserZoneDefault: UserProfileForSalesUserZoneState = {
  zoneList: [],
};

export const UserProfileForSalesUserZoneStateJson = (
  salesUserZoneState: UserProfileForSalesUserZoneState
) => [
  {
    userZones: salesUserZoneState.zoneList,
  },
];
