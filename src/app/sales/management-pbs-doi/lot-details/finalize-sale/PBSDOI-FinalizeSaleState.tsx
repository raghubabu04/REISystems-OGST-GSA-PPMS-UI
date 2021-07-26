export interface FinalizeSalePBSDOIState {
  data: {
    saleInformation: any;
    lotInformation: any;
  };
  other: {
    disableButtons: boolean;
  };
}

export const FinalizeSalePBSDOIStateDefault: FinalizeSalePBSDOIState = {
  data: { saleInformation: {}, lotInformation: {} },
  other: {
    disableButtons: false,
  },
};
