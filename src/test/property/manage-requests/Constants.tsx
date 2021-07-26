export interface ICartRequestResponse {
  data: {
    currentPageNumber: number;
    currentPageSize: number;
    myRequestsDTOS: CartRequest[];
    totalElements: number;
    totalPages: number;
  };
}

export interface CartRequest {
  transferControlNumber: string;
  cartRequestId: number;
  requestStatus: string;
  requestedAACId: string;
  requestedDate: string;
  requestedBy: string;
  city: string;
  state: string;
  zip: number;
  priority: string;
  isSrd: boolean;
  srd: string;
  shippingAddress: ShippingAddress;
}

export interface ShippingAddress {
  addressId: number;
  city: string;
  stateCode: string;
  zip: number;
  line1: string;
  line2?: string;
  line3?: string;
  zip2?: number;
  instructions?: string;
  overseasZip?: null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export const CartRequestResponse: ICartRequestResponse = {
  data: {
    currentPageNumber: 1,
    currentPageSize: 10,
    myRequestsDTOS: [
      {
        transferControlNumber: "9920925979",
        cartRequestId: 7,
        requestStatus: "REQUESTED",
        requestedAACId: "4745EA",
        requestedDate: "2020-10-05",
        requestedBy: "ppdms.sm.user@gmail.com",
        city: "RALEIGH",
        state: "NC",
        zip: 27607,
        priority: "AL -DR 4419 Tornados     ",
        isSrd: true,
        srd: "10/10/2020",
        shippingAddress: {
          createdAt: "2020-10-05T16:13:32.000+0000",
          updatedAt: "2020-10-05T16:13:32.000+0000",
          createdBy: "ppdms.sm.user@gmail.com",
          updatedBy: "ppdms.sm.user@gmail.com",
          addressId: 15,
          line1: "500 C St NW",
          line2: "St. 102",
          line3: "",
          city: "Washington ",
          stateCode: "DC",
          zip: 20121,
          zip2: null,
          instructions: "testing the field",
          overseasZip: null,
          isDeleted: false,
        },
      },
    ],
    totalElements: 1,
    totalPages: 1,
  },
};

export const CartRequestProps = {
  location: {
    hash: "",
    key: "8v0iah",
    pathname: "/requests",
    search: "",
    state: undefined,
  },
};
