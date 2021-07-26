import React, { useContext } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../../_redux/_actions/toast.actions";
import PPMSDatatable from "../../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { Reporting3040Context } from "../reporting-3040-context";
import {
  convertToNumber,
  formatNumber,
  formatNumberWithNegative,
  ReceiptsCategory,
  receiptsIndexs,
  receiptsInfoTips,
} from "../constants-3040";
import { PPMSPopover } from "../../../../../../ui-kit/components/common/PPMS-popover";
import { FaInfoCircle } from "react-icons/fa";
import { EditableCell } from "../report3040-editableCell";
import { UserUtils } from "../../../../../../utils/UserUtils";
import { isEmptyCheck } from "../../../../../../ui-kit/components/validations/FieldValidations";

interface Receipts3040Props {}

function Receipts3040(props: Receipts3040Props) {
  const {
    editReporting3040State,
    updateEditReporting3040State,
    receipts3040State,
    updateReceipts3040State,
    transfers3040State,
    donations3040State,
    updateComments3040State,
  } = useContext(Reporting3040Context);

  function updateReceiptvaluesOnBlur(index, value) {
    receipts3040State[receiptsIndexs.get(index)] = value;

    if (
      index === 0 &&
      UserUtils.isUserSA() &&
      isEmptyCheck(value) &&
      isEmptyCheck(transfers3040State.nonMisc.otherNegative) &&
      isEmptyCheck(donations3040State.publicProfit.other)
    ) {
      updateComments3040State({
        saspCommentsIsInValid: false,
        saspCommentsIsValid: true,
      });
    }

    let receiptSummary = 0;
    receiptsIndexs.forEach((value) => {
      if (receipts3040State[value]) {
        receiptSummary =
          +receiptSummary + +convertToNumber(receipts3040State[value]);
      }
    });

    let endingInventory = 0;

    endingInventory =
      +convertToNumber(editReporting3040State.beginningInventory) +
      +receiptSummary -
      (+convertToNumber(transfers3040State.transferSummary) +
        +convertToNumber(donations3040State.donationSummary));

    receipts3040State.receiptsSummary = formatNumber(receiptSummary);

    updateReceipts3040State(receipts3040State);

    updateEditReporting3040State({
      endingInventory: formatNumberWithNegative(endingInventory),
    });
  }

  let columns = [
    {
      Header: "Category",
      accessor: "category",
      Cell: (props) => (
        <>
          {props.value}
          {receiptsInfoTips.get(props.value) && (
            <PPMSPopover
              trigger={["hover", "focus"]}
              id={`Inventory-InfoTip-${props.value}`}
              placement={"top"}
              popoverTitle={"Info"}
              popoverContent={receiptsInfoTips.get(props.value)}
              className={"usa-label form-label usa-label-float float-right"}
              triggerSource={
                <button
                  id={"comment-tooltip-button"}
                  type={"button"}
                  className={"usa-button  usa-button--unstyled  infotip-margin"}
                >
                  <FaInfoCircle />
                </button>
              }
            />
          )}
        </>
      ),
      width: 300,
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: EditableCell,
    },
  ];

  let data = [
    {
      category: ReceiptsCategory.OTHER_RECEIPTS_ADJUST,
      amount: receipts3040State.pocAdjust,
    },
    {
      category: ReceiptsCategory.FROM_OVERSEAS,
      amount: receipts3040State.fromOverSeas,
    },
    {
      category: ReceiptsCategory.FROM_OTHER_STATES,
      amount: receipts3040State.fromOtherStates,
    },
    {
      category: ReceiptsCategory.FEDERAL_AGENCY,
      amount: receipts3040State.federalAgencyAmount,
    },
  ];

  return (
    <PPMSDatatable
      title={""}
      data={data}
      columns={columns}
      defaultSortField={""}
      loading={false}
      totalRows={4}
      isPaginationEnabled={false}
      onChange={() => {}}
      showFilters={false}
      disableSortBy={true}
      customTableClass={"table-row-3040"}
      updateData={(index, id, value) => {
        updateReceiptvaluesOnBlur(index, formatNumber(value));
      }}
    />
  );
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(Receipts3040);
