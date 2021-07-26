import React, { createContext, useState } from "react";

import {
  ShippingDetailsState,
  ShippingDetailsStateDefault,
} from "./ShippingDetails/ShippingDetailsState";
import {
  UploadDocumentsState,
  UploadDocumentsStateDefault,
} from "./uploads/UploadDocumentsState";

interface ShoppingContext {
  shippingDetailsState: ShippingDetailsState;
  updateShippingDetailsState: React.Dispatch<React.SetStateAction<any>>;
  uploadDocumentsState: UploadDocumentsState;
  updateUploadDocumentsState: React.Dispatch<React.SetStateAction<any>>;
}

export const ShoppingContext = createContext({} as ShoppingContext);

export const ShoppingContextProvider = ({ children }) => {
  const [shippingDetailsState, setShippingDetailsState] = useState<
    ShippingDetailsState
  >(ShippingDetailsStateDefault);

  const [uploadDocumentsState, setUploadDocumentsState] = useState<
    UploadDocumentsState
  >(UploadDocumentsStateDefault);

  const value = {
    shippingDetailsState,
    updateShippingDetailsState,
    uploadDocumentsState,
    updateUploadDocumentsState,
  };

  function updateShippingDetailsState(newState: any) {
    setShippingDetailsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  function updateUploadDocumentsState(newState: any) {
    setUploadDocumentsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  return (
    <ShoppingContext.Provider value={value}>
      {children}
    </ShoppingContext.Provider>
  );
};
