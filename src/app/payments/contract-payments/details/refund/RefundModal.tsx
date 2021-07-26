import React from 'react';
import { PPMSInput } from '../../../../../ui-kit/components/common/input/PPMS-input';

interface RefundModalProps{
  handleRefundAmountChange: any;
  handleTrackingIdChange: any;
  refundAmount?: any;
  trackingId?: any;
}
const RefundModal = (props: RefundModalProps) => {
  const {handleRefundAmountChange, handleTrackingIdChange, refundAmount, trackingId} = props;
    return (
        <>
        <div className={"grid-row"}>
          <PPMSInput
            id={"refund-amount"}
            inputType={"text"}
            value={refundAmount}
            onChange={(event)=>{
              handleRefundAmountChange(event.target.value)}}
            isDisabled={false}
            label={"Refund Amount"}
            isRequired={true}
            labelBold={true}
          />
          </div>
          <div className={"grid-row"}>
          <PPMSInput
            id={"tracking-id"}
            inputType={"text"}
            value={trackingId}
            onChange={(event)=>{handleTrackingIdChange(event.target.value)}}
            isDisabled={false}
            label={"Pay.gov Tracking ID"}
            labelBold={true}
            isRequired={true}
          />
          </div>
        </>
    );
};

export default RefundModal;