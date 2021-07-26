import { formatCurrency } from "../../../../ui-kit/utilities/FormatUtil";
import { isEmptyCheck } from "../../../property/create-update-property/validations/propertyFieldValidations";

export interface ContractFeeState {
  awardAmount: string;
  gsaFee: string;
  agencyReimbursement: string;
  liquidatedDamageFee: string;
  totalRefundAmount?: string;
  claimNumber: string;
  reasonForRefund: string;
  salesNotes?: string;
  originalAwardAmount?: string;
  contractStatus: string;
  paymentStatus: string;
  chargebackAmount: string;
}

export interface BidderState {
  bidderData: any;
  userData: any;
  bidderId?: string;
  bidderEmail?: string;
  bidderUsername?: string;
}

export const BidderStateDefault = {
  bidderData: {},
  userData: {},
  bidderId: "",
  bidderEmail: "",
  bidderUsername: "",
};

export const ContractFeeDefault = {
  awardAmount: "$0.00",
  gsaFee: "$0.00",
  agencyReimbursement: "$0.00",
  liquidatedDamageFee: "$0.00",
  claimNumber: "",
  reasonForRefund: "Default for Non-Removal",
  contractStatus: "Default for non removal",
  paymentStatus: "",
  totalRefundAmount: "$0.00",
  originalAwardAmount: "$0.00",
  chargebackAmount: "",
};

const commonProps = {
  inputType: "text",
  maxLength: 18,
  minLength: 2,
  isRequired: true,
  isInvalid: false,
  isValid: true,
};

export function getFormatedValue(value: string): string {
  return value
    .replace(/([^.]*\.[^.]*)\./g, "$1")
    .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
    .replace(/^[0]+$/, "")
    .toString();
}

export function getFormatedValueWithDolloar(value: string): string {
  let val: string = getFormatedValue(value);
  if (/^\d+\.\d\d\d$/.test(val)) {
    val = Number(val).toFixed(2);
  } else if (val.includes(".")) {
    val = val;
  } else {
    val = val.substring(0, 11);
  }
  val =
    "$" +
    val
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      .replace("$", "");
  return val;
}

export enum RefundReason {
  DEFAULT_FOR_NON_REMOVAL = "Default for non removal",
  DEFAULT_FOR_NON_PAYMENT = "Default for non payment",
  ADR = "ADR",
  CANCELLATION = "Cancellation",
}

export enum ContractStatus {
  PAID = "Paid",
  DEFAULT_FOR_NON_PAYMENT = "Default for non payment",
  DEFAULT_FOR_NON_REMOVAL = "Default for non removal",
  AWARDED = "Awarded",
  AWARD_PENDING = "Award Pending",
}

export const contractFeeFieldsForChargeBack = (
  state: ContractFeeState,
  handleChange: any
) => {
  return [
    {
      id: "awardAmount",
      name: "awardAmount",
      label: "Award Amount",
      value: !isEmptyCheck(state?.awardAmount)
        ? state.awardAmount
        : ContractFeeDefault.awardAmount,
      onChange: handleChange,
      isDisabled: true,
      ...commonProps,
    },
    {
      id: "gsaFee",
      name: "gsaFee",
      label: "GSA Fee",
      value: !isEmptyCheck(state?.gsaFee)
        ? state.gsaFee
        : ContractFeeDefault.gsaFee,
      isDisabled: state?.contractStatus != ContractStatus.PAID,
      onChange: handleChange,
      ...commonProps,
    },
    {
      id: "agencyReimbursement",
      name: "agencyReimbursement",
      label: "Agency Reimbursement",
      value: !isEmptyCheck(state?.agencyReimbursement)
        ? state.agencyReimbursement
        : ContractFeeDefault.agencyReimbursement,
      isDisabled: state?.contractStatus != ContractStatus.PAID,
      onChange: handleChange,
      ...commonProps,
    },
  ];
};

export const contractFeeFields = (
  state: ContractFeeState,
  handleChange: any
) => [
  //only display the "Original Award Amount" if the "Original Award Amount" is changed
  ...(!isEmptyCheck(state?.originalAwardAmount)
    ? [
        {
          id: "originalAwardAmount",
          name: "originalAwardAmount",
          label: "Original Award Amount",
          value: !isEmptyCheck(state?.originalAwardAmount)
            ? state.originalAwardAmount
            : ContractFeeDefault.originalAwardAmount,
          onChange: handleChange,
          isDisabled: true,
          ...commonProps,
        },
      ]
    : []),
  ...(state?.contractStatus === ContractStatus.DEFAULT_FOR_NON_REMOVAL ||
  state?.contractStatus === ContractStatus.PAID ||
  state?.contractStatus === ContractStatus.AWARD_PENDING
    ? [
        {
          id: "awardAmount",
          name: "awardAmount",
          label: "Award Amount",
          value: !isEmptyCheck(state?.awardAmount)
            ? state.awardAmount
            : ContractFeeDefault.awardAmount,
          onChange: handleChange,
          isDisabled: true,
          ...commonProps,
        },
        {
          id: "gsaFee",
          name: "gsaFee",
          label: "GSA Fee",
          value: !isEmptyCheck(state?.gsaFee)
            ? state.gsaFee
            : ContractFeeDefault.gsaFee,
          onChange: handleChange,
          ...commonProps,
        },
        {
          id: "agencyReimbursement",
          name: "agencyReimbursement",
          label: "Agency Reimbursement",
          value: !isEmptyCheck(state?.agencyReimbursement)
            ? state.agencyReimbursement
            : ContractFeeDefault.agencyReimbursement,
          onChange: handleChange,
          ...commonProps,
        },
      ]
    : []),
  ...(state?.contractStatus !== ContractStatus.PAID &&
    state?.contractStatus !== ContractStatus.AWARD_PENDING
    ? [
        {
          id: "liquidatedDamageFee",
          name: "liquidatedDamageFee",
          label: "Liquidated Damage Fee",
          value: !isEmptyCheck(state?.liquidatedDamageFee)
            ? state?.liquidatedDamageFee
            : ContractFeeDefault.liquidatedDamageFee,
          isDisabled:
            state?.contractStatus === "Default for non removal" ||
            state?.contractStatus === ContractStatus.PAID ||
            state?.contractStatus === ContractStatus.AWARD_PENDING,
          onChange: handleChange,
          ...commonProps,
        },
      ]
    : []),
  ...(state?.contractStatus !== ContractStatus.PAID &&
  state?.contractStatus !== ContractStatus.AWARD_PENDING
    ? [
        {
          id: "claimNumber",
          name: "claimNumber",
          label: "Claim Number",
          value: state.claimNumber,
          isDisabled: true,
          onChange: handleChange,
          ...commonProps,
        },
      ]
    : []),
  ...(state?.contractStatus === ContractStatus.DEFAULT_FOR_NON_REMOVAL ||
  state?.contractStatus === ContractStatus.PAID ||
  state?.contractStatus == ContractStatus.AWARD_PENDING
    ? [
        {
          id: "totalRefundAmount",
          name: "totalRefundAmount",
          label: "Total Refund Amount",
          value: !isEmptyCheck(state?.totalRefundAmount)
            ? state.totalRefundAmount
            : ContractFeeDefault.totalRefundAmount,
          onChange: handleChange,
          ...commonProps,
        },
        {
          id: "reasonForRefund",
          name: "reasonForRefund",
          label: "Reason for Refund",
          value: state.reasonForRefund,
          isDisabled: true,
          onChange: handleChange,
          ...commonProps,
        },
      ]
    : []),
];
