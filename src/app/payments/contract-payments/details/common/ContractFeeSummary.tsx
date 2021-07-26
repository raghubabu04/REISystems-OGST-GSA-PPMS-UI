import React from 'react';
import { PPMSInput } from '../../../../../ui-kit/components/common/input/PPMS-input';
import { formatCurrency } from '../../../../../ui-kit/utilities/FormatUtil';

interface ContractFeeSummaryProps{
    contractFeeDetails?: any;
    type?: string;
}
const ContractFeeSummary = (props: ContractFeeSummaryProps) => {
    const {contractFeeDetails, type} = props;
    const field = (type) => {
        let label ="";
        let value = "";
        switch(type){
            case "awardAmount":
                label ="Award Amount";
                value = formatCurrency.format(contractFeeDetails?.awardAmount);
                break;
            case "originalAwardAmount":
                label ="Original Award Amount";
                value = formatCurrency.format(contractFeeDetails?.originalAwardAmount);
                break;
            case "gsaFee":
                label ="GSA Fee";
                value = formatCurrency.format(contractFeeDetails?.gsaFee);
                break;
            case "agencyReimbursement":
                label ="Agency Reimbursement";
                value = formatCurrency.format(contractFeeDetails?.agencyReimbursement);
                break;
            case "liquidatedDamageFee":
                label ="Liquidated Damage Fee";
                value = formatCurrency.format(contractFeeDetails?.liquidatedDamageFee);
                break;
            case "totalRefundAmount":
                label ="Total Refund Amount";
                value = formatCurrency.format(contractFeeDetails?.totalRefundAmount);
                break;
            case "claimNumber":
                label ="Claim Number";
                value = contractFeeDetails?.claimNumber;
                break;
            case "chargebackAmount":
                label ="Chargeback Amount";
                value = formatCurrency.format(contractFeeDetails?.chargebackAmount);
                break;
            default:
                break;
        };
        return (            
            <PPMSInput 
                label={label}
                value={value}
                id={label}
                isDisabled={true}
                onChange={()=>{}}
                inputType={"text"}
                name={label}
                isRequired={true}
            />
        )
    }
    return (
        <div>
            <div className={"grid-row grid-gap-4 contract-fee-summary"}>
                <strong>Reason for refund : </strong>{contractFeeDetails?.reasonForRefund}
            </div>
            <div className={"grid-row grid-gap-4"}>
                {field("awardAmount")}
                {contractFeeDetails?.originalAwardAmount?field("originalAwardAmount"):<></>}
                {field("gsaFee")}
                {field("agencyReimbursement")}
                {contractFeeDetails?.reasonForRefund === "Cancellation"|| "ADR"?<></>:field("claimNumber")}
                {contractFeeDetails?.reasonForRefund === "Cancellation"|| "ADR"?<></>:field("liquidatedDamageFee")}
                {field("totalRefundAmount")}
            </div>
        </div>
    );
};

export default ContractFeeSummary;