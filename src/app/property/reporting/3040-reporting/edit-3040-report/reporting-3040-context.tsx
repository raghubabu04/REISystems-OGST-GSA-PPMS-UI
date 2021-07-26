import React, { createContext, useState } from "react";
import {
  Comments3040State,
  comments3040StateDefault,
} from "./comments/comments-state";
import {
  Donations3040State,
  donations3040StateDefault,
} from "./donations/dontations-state";
import {
  Edit3040ReportingState,
  Edit3040ReportingStateDefault,
} from "./edit-3040-reporting-state";
import {
  Receipts3040State,
  receipts3040StateDefault,
} from "./receipts/receipts-state";
import {
  Transfers3040State,
  transfers3040StateDefault,
} from "./transfers/transfers-state";

interface IReporting3040Context {
  editReporting3040State: Edit3040ReportingState;
  updateEditReporting3040State: React.Dispatch<React.SetStateAction<any>>;
  receipts3040State: Receipts3040State;
  updateReceipts3040State: React.Dispatch<React.SetStateAction<any>>;
  donations3040State: Donations3040State;
  updateDonations3040State: React.Dispatch<React.SetStateAction<any>>;
  transfers3040State: Transfers3040State;
  updateTransfers3040State: React.Dispatch<React.SetStateAction<any>>;
  comments3040State: Comments3040State;
  updateComments3040State: React.Dispatch<React.SetStateAction<any>>;
}

export const Reporting3040Context = createContext({} as IReporting3040Context);

export const Reporting3040ContextProvider = ({ children }) => {
  const [editReporting3040State, setReporting3040State] = useState<
    Edit3040ReportingState
  >(Edit3040ReportingStateDefault);

  const [receipts3040State, setReceipts3040State] = useState<Receipts3040State>(
    receipts3040StateDefault
  );

  const [donations3040State, setDonations3040State] = useState<
    Donations3040State
  >(donations3040StateDefault);

  const [transfers3040State, setTransfers3040State] = useState<
    Transfers3040State
  >(transfers3040StateDefault);

  const [comments3040State, setComments3040State] = useState<Comments3040State>(
    comments3040StateDefault
  );

  const value = {
    editReporting3040State,
    updateEditReporting3040State,
    receipts3040State,
    updateReceipts3040State,
    donations3040State,
    updateDonations3040State,
    transfers3040State,
    updateTransfers3040State,
    comments3040State,
    updateComments3040State,
  };

  function updateEditReporting3040State(newState: any) {
    setReporting3040State((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateReceipts3040State(newState: any) {
    setReceipts3040State((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateDonations3040State(newState: any) {
    setDonations3040State((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateTransfers3040State(newState: any) {
    setTransfers3040State((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateComments3040State(newState: any) {
    setComments3040State((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  return (
    <Reporting3040Context.Provider value={value}>
      {children}
    </Reporting3040Context.Provider>
  );
};
