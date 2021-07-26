import React, { createContext, useState } from "react";
import {
  LottingDetailsState,
  LottingDetailsStateDefault,
} from "./LottingDetailsState";

interface LottingDetailsContext {
  lottingDetailsState: LottingDetailsState;
  updateLottingDetailsState: React.Dispatch<React.SetStateAction<any>>;
}

export const LottingDetailsContext = createContext({} as LottingDetailsContext);

export const LottingDetailsContextProvider = ({ children }) => {
  const [lottingDetailsState, setLottingDetailsState] = useState<
    LottingDetailsState
  >(LottingDetailsStateDefault);

  const value = {
    lottingDetailsState,
    updateLottingDetailsState,
  };
  function updateLottingDetailsState(newState: any) {
    setLottingDetailsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <LottingDetailsContext.Provider value={value}>
      {children}
    </LottingDetailsContext.Provider>
  );
};
