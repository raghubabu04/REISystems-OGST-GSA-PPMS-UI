import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";

interface RegisterDetailsTabsWrapperProps {
  children: any;
  updateRegisterStatusField?: any;
}
const RegisterDetailsTabsWrapper = (props: RegisterDetailsTabsWrapperProps) => {
  const { children, updateRegisterStatusField } = props;
  const [registerStatus, setRegisterStatus] = useState("open");
  const buttonLabels = {
    open: "Close Register",
    "pending-closure": "Finalize",
    closed: "Reopen Register",
    "re-open": "Close Register",
    "closed-modified": "Reopen Register",
  };
  const registerStatusOrder = {
    open: "pending-closure",
    "pending-closure": "closed",
    closed: "re-open",
    "re-open": "closed-modified",
    "closed-modified": "open",
  };
  const updateRegisterStatus = () => {
    const status = registerStatusOrder[registerStatus];
    setRegisterStatus(status);
  };

  useEffect(() => {
    updateRegisterStatusField && updateRegisterStatusField(registerStatus);
  }, [registerStatus]);
  return <Fragment>{children}</Fragment>;
};

export default RegisterDetailsTabsWrapper;
