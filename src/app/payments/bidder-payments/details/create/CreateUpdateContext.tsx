import React, { createContext, useState } from "react";
import {
  PaymentDetailsState,
  PaymentDetailsStateDefault,
} from "../PaymentDetailsState";

interface PaymentDetailsContext {
  paymentDetailsState: PaymentDetailsState;
  updatePaymentDetailsState: React.Dispatch<React.SetStateAction<any>>;
}

export const PaymentDetailsContext = createContext({} as PaymentDetailsContext);

export const PaymentDetailsContextProvider = ({ children }) => {
  const [paymentDetailsState, setPaymentDetailsState] = useState<
    PaymentDetailsState
  >(PaymentDetailsStateDefault);

  const value = {
    paymentDetailsState,
    updatePaymentDetailsState,
  };
  function updatePaymentDetailsState(newState: any) {
    setPaymentDetailsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <PaymentDetailsContext.Provider value={value}>
      {children}
    </PaymentDetailsContext.Provider>
  );
};
