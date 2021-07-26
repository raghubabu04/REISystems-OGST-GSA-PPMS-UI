import React, { createContext, useState } from "react";
import {
  UploadDocumentsState,
  UploadDocumentsStateDefault,
} from "../order-property/components/uploads/UploadDocumentsState";
import {
  ShippingDetailsState,
  ShippingDetailsStateDefault,
} from "../order-property/components/ShippingDetails/ShippingDetailsState";

interface AllocationContext {
  shippingDetailsState: ShippingDetailsState;
  updateShippingDetailsState: React.Dispatch<React.SetStateAction<any>>;
  uploadDocumentsState: UploadDocumentsState;
  updateUploadDocumentsState: React.Dispatch<React.SetStateAction<any>>;
}

export const AllocationContext = createContext({} as AllocationContext);

export const AllocationContextProvider = ({ children }) => {
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
    <AllocationContext.Provider value={value}>
      {children}
    </AllocationContext.Provider>
  );
};
