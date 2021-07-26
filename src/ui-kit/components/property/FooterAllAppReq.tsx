import React from "react";
import PPMSCardFooter from "../common/card/PPMS-card-footer";
import PPMSErrorMessage from "../common/form/PPMS-error-message";
import { PPMSInput } from "../common/input/PPMS-input";
import { PPMSButton } from "../common/PPMS-button";

export interface FooterProps {
  page: string;
  approveTO?: boolean;
  requisition?: boolean;
  inputQty?: number;
  qtyAllocated?: number;
  handleQuantityChange?: any;
  handleAllocateOrUpdateQuantity?: any;
  qtyButtonDisabled?: any;
  icnStatus?: string;
  setShowDeny?: any;
  handleDenyICN?: any;
  isQuantityValid?: boolean;
  verificationMessage?: string;
  qtyApproved?: number;
  icnApproveStatus?: string;
  disableAllIcns?: boolean;
  qtyTransferred?: number;
  max?: number;
  approveAll?: boolean;
  icnTransferStatus?: string;
  isApproveAll?: boolean;
  isForeignGift?: boolean;
  tcnStatus?: string;
  isDonee?: boolean;
}
export const FooterForAllAppReq = (props: FooterProps) => {
  let inputValue: number = 0;
  let inputDisable: boolean = false;
  let onChange: Function;
  let firstBtnLabel: string;
  let firstBtnPress: Function;
  let firstBtnDisable: boolean = false;
  let secondBtnLabel: string;
  let secondBtnDisable: boolean = false;
  let secondBtnPress: Function;
  let notForeignGiftAndDonee = !props.isForeignGift && !props.isDonee;
  switch (props.page) {
    case "allocation":
      inputValue = props.inputQty;
      onChange = (e) => props.handleQuantityChange(e);

      firstBtnLabel =
        props.icnStatus !== "Denied"
          ? props.qtyAllocated && notForeignGiftAndDonee
            ? "Update Allocated Quantity"
            : notForeignGiftAndDonee
            ? "Allocate Quantity"
            : "Allocate"
          : notForeignGiftAndDonee
          ? "Reallocate Quantity"
          : "Reallocate";
      firstBtnPress = (e) => props.handleAllocateOrUpdateQuantity(e);
      firstBtnDisable = notForeignGiftAndDonee
        ? props.qtyButtonDisabled
        : props.tcnStatus === "Allocation Confirmed" ||
          props.tcnStatus === "Allocation Denied" ||
          props.icnStatus === "Allocated";
      //Need to be able to reallocate on denied properties
      firstBtnDisable =
        props.tcnStatus === "Allocation Denied"
          ? props.isDonee
            ? false
            : firstBtnDisable
          : firstBtnDisable;
      secondBtnLabel =
        props.icnStatus === "Denied" ? "Denial Reason (Optional)" : "Deny";
      secondBtnPress = (e) =>
        props.icnStatus === "Denied"
          ? props.setShowDeny(e)
          : props.handleDenyICN(e);
      break;
    case "approval":
      inputValue = props.inputQty;
      onChange = (e) => props.handleQuantityChange(e);
      firstBtnLabel =
        props.icnApproveStatus !== "AO Denied"
          ? notForeignGiftAndDonee
            ? "Update Approved Quantity"
            : notForeignGiftAndDonee
            ? "Approve Quantity"
            : "Approve"
          : notForeignGiftAndDonee
          ? "Approve Quantity"
          : "Reapprove";
      firstBtnPress = (e) => props.handleAllocateOrUpdateQuantity(e);
      firstBtnDisable = notForeignGiftAndDonee
        ? props.qtyButtonDisabled || (props.approveAll && props.isApproveAll)
        : props.icnStatus === "Denied" ||
          props.disableAllIcns ||
          props.icnApproveStatus === "Approved"
        ? true
        : false;
      secondBtnLabel =
        props.icnApproveStatus === "AO Denied" && !props.disableAllIcns
          ? "Denial Reason (Optional)"
          : "Deny";
      secondBtnDisable =
        props.icnStatus === "Denied" || props.disableAllIcns ? true : false;
      secondBtnPress = (e) =>
        props.icnApproveStatus === "AO Denied"
          ? props.setShowDeny(e)
          : props.handleDenyICN(e);
      break;
    case "requisition":
      inputValue = props.inputQty;
      onChange = (e) => props.handleQuantityChange(e);

      firstBtnLabel =
        props.icnTransferStatus !== "Donation Denied" &&
        props.icnTransferStatus !== "Transfer Denied"
          ? props.qtyTransferred && notForeignGiftAndDonee
            ? "Update Transfer Quantity"
            : notForeignGiftAndDonee
            ? "Transfer Quantity"
            : "Transfer"
          : notForeignGiftAndDonee
          ? "Transfer Quantity"
          : "Retransfer";
      firstBtnPress = (e) => props.handleAllocateOrUpdateQuantity(e);
      firstBtnDisable =
        (props.icnStatus === "Denied" || props.icnApproveStatus === "AO Denied") ||
        props.icnTransferStatus === "Transferred";
      secondBtnLabel =
        props.icnTransferStatus === "Transfer Denied" ||
        props.icnTransferStatus === "Donation Denied"
          ? "Denial Reason (Optional)"
          : "Deny";
      secondBtnPress = (e) =>
        props.icnTransferStatus === "Transfer Denied" ||
        props.icnTransferStatus === "Donation Denied"
          ? props.setShowDeny(e)
          : props.handleDenyICN(e);
      secondBtnDisable =notForeignGiftAndDonee
      ? props.qtyButtonDisabled
      : (props.isForeignGift || props.isDonee) &&
        (props.tcnStatus === "Transferred" ||
          props.icnApproveStatus == "AO Denied" ||
          props.icnStatus == "Denied" || props.icnTransferStatus == "Transfer Denied");
      break;
    default:
      break;
  }

  return (
    <PPMSCardFooter>
      <div className="grid-container item-search-result-input">
        <div className="grid-row tablet:grid-gap-3">
          <div className={"grid-col-auto margin-top-05 cart-row"}>
            {!props.isForeignGift && !props.isDonee ? (
              <PPMSInput
                isDisabled={inputDisable}
                id={`${props.page}-qty-input`}
                name={`${props.page}-qty-input`}
                isInvalid={false}
                isValid={false}
                isRequired={true}
                value={inputValue}
                onChange={onChange}
                inputType={"number"}
                className={"property-select"}
                max={props.max}
              />
            ) : (
              ""
            )}

            <PPMSButton
              id={`${props.page}-quantity`}
              label={firstBtnLabel}
              variant={"primary"}
              onPress={firstBtnPress}
              isDisabled={firstBtnDisable}
            />

            <PPMSButton
              id={"deny"}
              label={secondBtnLabel}
              className={"property-select"}
              variant={"primary"}
              onPress={secondBtnPress}
              isDisabled={secondBtnDisable}
            />
          </div>
        </div>
      </div>
      <div className="grid-row tablet:grid-gap-3">
        {!props.isQuantityValid && (
          <PPMSErrorMessage id={"quantity-error"}>
            {props.verificationMessage}
          </PPMSErrorMessage>
        )}
      </div>
    </PPMSCardFooter>
  );
};
