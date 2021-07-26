import React, { useContext, useEffect, useMemo } from "react";

import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { ContractFeeContext } from "./ContractFeeContext";
import {
  contractFeeFields,
  contractFeeFieldsForChargeBack,
  getFormatedValueWithDolloar,
} from "./Constants";
import { isEmpty } from "lodash";

interface ContractFeeProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  roles: any;
  type: string;
  contractFeeDetails?: any;
}

function ContractFeeDetails(props: ContractFeeProps) {
  const { contractFeeState, updateContractFeeState } = useContext(
    ContractFeeContext
  );
  function handleChange(event: any) {
    let val: string = getFormatedValueWithDolloar(event.target.value);
    const obj = { ...contractFeeState };
    obj[event.target.id] = val;

    updateContractFeeState(obj);
  }

  useEffect(()=>{
    if(!isEmpty(props.contractFeeDetails)){
let state = contractFeeState;
state.awardAmount = props.contractFeeDetails.awardAmount;
state.agencyReimbursement = props.contractFeeDetails.agencyReimbursement;
state.originalAwardAmount = props.contractFeeDetails.originalAwardAmount;
state.claimNumber = props.contractFeeDetails.claimNumber;
state.gsaFee = props.contractFeeDetails.gsaFee;
state.liquidatedDamageFee = props.contractFeeDetails.liquidatedDamageFee;
updateContractFeeState(state)
    }
  },[])

  const fields =
    props.type === "chargeback" || props.type === "Chargebacks"
      ? contractFeeFieldsForChargeBack(contractFeeState, handleChange)
      : contractFeeFields(contractFeeState, handleChange);

  return useMemo(() => {
    return (
      <React.Fragment>
        {fields.map((f, id) => {
          return (
            <div className={"tablet:grid-col-2"}>
              {React.createElement(PPMSInput, f)}
            </div>
          );
        })}
      </React.Fragment>
    );
  }, [contractFeeState]);
}

export default ContractFeeDetails;
