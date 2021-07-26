import React, { createContext, useState } from "react";
import {
  EmailContentState,
  EmailContentStateDefault,
} from "./email-content/EmailContentState";
import {
  EmailCriteriaState,
  EmailCriteriaStateDefault,
} from "./email-criteria/EmailCriteriaState";
import { GroupEmailsState, GroupEmailsStateDefault } from "./GroupEmailsState";

interface GroupEmailContext {
  emailCriteriaState: EmailCriteriaState;
  updateEmailCriteriaState: React.Dispatch<React.SetStateAction<any>>;

  emailContentState: EmailContentState;
  updateEmailContentState: React.Dispatch<React.SetStateAction<any>>;

  groupEmailsState: GroupEmailsState;
  updateGroupEmailsState: React.Dispatch<React.SetStateAction<any>>;
}

export const GroupEmailsContext = createContext({} as GroupEmailContext);

export const GroupEmailsProvider = ({ children }) => {
  const [emailCriteriaState, setEmailCriteriaState] = useState<EmailCriteriaState>(EmailCriteriaStateDefault);
  const [emailContentState, setEmailContentState] = useState<EmailContentState>(
    EmailContentStateDefault
  );
  const [groupEmailsState, setGroupEmailsState] = useState<GroupEmailsState>(
    GroupEmailsStateDefault
  );

  const value = {
    emailCriteriaState,
    updateEmailCriteriaState,
    emailContentState,
    updateEmailContentState,
    groupEmailsState,
    updateGroupEmailsState,
  };

  function updateEmailCriteriaState(newSate: any) {
    setEmailCriteriaState((prevState: any) => {
      return { ...prevState, ...newSate };
    });
  }

  function updateEmailContentState(newState: any) {
    setEmailContentState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateGroupEmailsState(newState: any) {
    setGroupEmailsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <GroupEmailsContext.Provider value={value}>
      {children}
    </GroupEmailsContext.Provider>
  );
};
