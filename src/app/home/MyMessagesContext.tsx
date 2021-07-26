import React, { createContext, useState } from "react";
import { MyMessagesState, MyMessagesDefaultState } from "./MyMessagesState";

interface MyMessagesContext {
  myMessagesState: MyMessagesState;
  updateMyMessagesState: React.Dispatch<React.SetStateAction<any>>;
}

export const MyMessagesContext = createContext({} as MyMessagesContext);

export const MyMessagesContextProvider = ({ children }) => {
  const [myMessagesState, setMyMessagesState] = useState<MyMessagesState>(
    MyMessagesDefaultState
  );

  const value = {
    myMessagesState,
    updateMyMessagesState,
  };
  function updateMyMessagesState(newState: any) {
    setMyMessagesState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <MyMessagesContext.Provider value={value}>
      {children}
    </MyMessagesContext.Provider>
  );
};
