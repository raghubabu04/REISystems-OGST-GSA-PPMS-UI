import React, { createContext, useState } from "react";
import {
  ItemInformationState,
  ItemInformationStateDefault,
} from "./item-information-class/ItemInformationState";
import {
  CreateWantListState,
  CreateWantListStateDefault,
} from "./CreateWantListState";

interface WantListContext {
  createWantListState: CreateWantListState;
  updateCreateWantListState: React.Dispatch<React.SetStateAction<any>>;

  itemInformationState: ItemInformationState;
  updateItemInformationState: React.Dispatch<React.SetStateAction<any>>;
}

export const WantListContext = createContext({} as WantListContext);

export const WantListProvider = ({ children }) => {
  const [createWantListState, setCreateWantListState] = useState<
    CreateWantListState
  >(CreateWantListStateDefault);
  const [itemInformationState, setItemInformationState] = useState<
    ItemInformationState
  >(ItemInformationStateDefault);

  const value = {
    createWantListState,
    updateCreateWantListState,
    itemInformationState,
    updateItemInformationState,
  };

  function updateCreateWantListState(newState) {
    setCreateWantListState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateItemInformationState(newState) {
    setItemInformationState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <WantListContext.Provider value={value}>
      {children}
    </WantListContext.Provider>
  );
};
