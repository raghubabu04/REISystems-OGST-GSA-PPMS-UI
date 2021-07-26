import React, { useContext } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../../_redux/_actions/toast.actions";
import { Reporting3040Context } from "../reporting-3040-context";
import { PPMSDatatable } from "../../../../../../ui-kit/components/common/datatable/PPMS-datatable";

import {
  convertToNumber,
  formatNumber,
  formatNumberWithNegative,
  miscAmountIndexs,
  MiscNonTransfer,
  miscNonTransferInfoTips,
  miscOtherAmountIndexs,
  MiscTransfer,
  miscTransferInfoTips,
  nonMiscAmountIndexs,
  nonMiscOtherAmountIndexs,
  titleInfoTips,
  Titles3040,
} from "../constants-3040";
import { PPMSPopover } from "../../../../../../ui-kit/components/common/PPMS-popover";
import { FaInfoCircle } from "react-icons/fa";
import { EditableCell } from "../report3040-editableCell";
import { UserUtils } from "../../../../../../utils/UserUtils";
import { isEmptyCheck } from "../../../../../../ui-kit/components/validations/FieldValidations";

interface Transfer3040Props {}

function Transfer3040(props: Transfer3040Props) {
  const {
    transfers3040State,
    updateTransfers3040State,
    editReporting3040State,
    updateEditReporting3040State,
    donations3040State,
    receipts3040State,
    updateComments3040State,
  } = useContext(Reporting3040Context);

  function updateMiscvaluesOnBlur(index, id, value) {
    const { misc } = transfers3040State;
    const { nonMisc } = transfers3040State;
    if (id === "amount") {
      misc[miscAmountIndexs.get(index)] = value;
    } else {
      misc[miscOtherAmountIndexs.get(index)] = value;
    }
    let transferSummary = transferSummaryValue(misc, nonMisc);

    let endingInventory = endingInventoryValue(transferSummary);

    updateEditReporting3040State({
      endingInventory: formatNumberWithNegative(endingInventory),
    });

    updateTransfers3040State({
      misc: misc,
      transferSummary: formatNumber(transferSummary),
    });
  }

  function updateNonMiscvaluesOnBlur(index, id, value) {
    const { misc } = transfers3040State;
    const { nonMisc } = transfers3040State;
    if (id === "amount") {
      nonMisc[nonMiscAmountIndexs.get(index)] = value;
      if (
        index === 0 &&
        UserUtils.isUserSA() &&
        isEmptyCheck(value) &&
        isEmptyCheck(receipts3040State.pocAdjust) &&
        isEmptyCheck(donations3040State.publicProfit.other)
      ) {
        updateComments3040State({
          saspCommentsIsInValid: false,
          saspCommentsIsValid: true,
        });
      }
    } else {
      nonMisc[nonMiscOtherAmountIndexs.get(index)] = value;
    }
    let transferSummary = transferSummaryValue(misc, nonMisc);

    let endingInventory = endingInventoryValue(transferSummary);

    updateEditReporting3040State({
      endingInventory: formatNumberWithNegative(endingInventory),
    });

    updateTransfers3040State({
      nonMisc: nonMisc,
      transferSummary: formatNumber(transferSummary),
    });
  }

  function endingInventoryValue(transferSummary) {
    let endingInventory = 0;

    endingInventory =
      +convertToNumber(editReporting3040State.beginningInventory) +
      +convertToNumber(receipts3040State.receiptsSummary) -
      (+convertToNumber(donations3040State.donationSummary) + transferSummary);

    return endingInventory;
  }

  function transferSummaryValue(misc, nonMisc) {
    let transferSummary = 0;

    miscAmountIndexs.forEach((value) => {
      if (misc[value]) {
        transferSummary = +transferSummary + +convertToNumber(misc[value]);
      }
    });

    miscOtherAmountIndexs.forEach((value) => {
      if (misc[value]) {
        transferSummary = +transferSummary + +convertToNumber(misc[value]);
      }
    });

    nonMiscAmountIndexs.forEach((value) => {
      if (nonMisc[value]) {
        transferSummary = +transferSummary + +convertToNumber(nonMisc[value]);
      }
    });

    nonMiscOtherAmountIndexs.forEach((value) => {
      if (nonMisc[value]) {
        transferSummary = +transferSummary + +convertToNumber(nonMisc[value]);
      }
    });

    return transferSummary;
  }

  let columns = [
    {
      Header: "Category",
      accessor: "category",
      Cell: (props) => (
        <>
          {props.value}
          {miscTransferInfoTips.get(props.value) && (
            <PPMSPopover
              trigger={["hover", "focus"]}
              id={`Inventory-InfoTip-${props.value}`}
              placement={"top"}
              popoverTitle={"Info"}
              popoverContent={miscTransferInfoTips.get(props.value)}
              className={"usa-label form-label usa-label-float float-right"}
              triggerSource={
                <button
                  id={"comment-tooltip-button"}
                  type={"button"}
                  className={"usa-button  usa-button--unstyled infotip-margin"}
                >
                  <FaInfoCircle />
                </button>
              }
            />
          )}
        </>
      ),
    },
    {
      Header: "Amount",
      accessor: "amount",
      selector: "amount",
      Cell: EditableCell,
    },
    {
      Header: "Category",
      accessor: "otherCategory",
      Cell: (props) => (
        <>
          {props.value}
          {miscTransferInfoTips.get(props.value) && (
            <PPMSPopover
              trigger={["hover", "focus"]}
              id={`Inventory-InfoTip-${props.value}`}
              placement={"top"}
              popoverTitle={"Info"}
              popoverContent={miscTransferInfoTips.get(props.value)}
              className={"usa-label form-label usa-label-float float-right"}
              triggerSource={
                <button
                  id={"comment-tooltip-button"}
                  type={"button"}
                  className={"usa-button  usa-button--unstyled infotip-margin"}
                >
                  <FaInfoCircle />
                </button>
              }
            />
          )}
        </>
      ),
    },
    {
      Header: "Amount",
      accessor: "otherAmount",
      Cell: EditableCell,
    },
  ];

  let nonMiscColumns = [
    {
      Header: "Category",
      accessor: "category",
      Cell: (props) => (
        <>
          {props.value}
          {miscNonTransferInfoTips.get(props.value) && (
            <PPMSPopover
              trigger={["hover", "focus"]}
              id={`Inventory-InfoTip-${props.value}`}
              placement={"top"}
              popoverTitle={"Info"}
              popoverContent={miscNonTransferInfoTips.get(props.value)}
              className={"usa-label form-label usa-label-float float-right"}
              triggerSource={
                <button
                  id={"comment-tooltip-button"}
                  type={"button"}
                  className={"usa-button  usa-button--unstyled infotip-margin"}
                >
                  <FaInfoCircle />
                </button>
              }
            />
          )}
        </>
      ),
    },
    {
      Header: "Amount",
      accessor: "amount",
      selector: "amount",
      Cell: EditableCell,
    },
    {
      Header: "Category",
      accessor: "otherCategory",
      Cell: (props) => (
        <>
          {props.value ? (
            <>
              {props.value}
              {miscNonTransferInfoTips.get(props.value) && (
                <PPMSPopover
                  trigger={["hover", "focus"]}
                  id={`Inventory-InfoTip-${props.value}`}
                  placement={"top"}
                  popoverTitle={"Info"}
                  popoverContent={miscNonTransferInfoTips.get(props.value)}
                  className={"usa-label form-label usa-label-float float-right"}
                  triggerSource={
                    <button
                      id={"comment-tooltip-button"}
                      type={"button"}
                      className={
                        "usa-button  usa-button--unstyled infotip-margin"
                      }
                    >
                      <FaInfoCircle />
                    </button>
                  }
                />
              )}
            </>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      Header: "Amount",
      accessor: "otherAmount",
      Cell: EditableCell,
    },
  ];

  let data = [
    {
      category: MiscTransfer.TRANSFERS_TO_VETERAN_ORGANIZATIONS,
      amount: transfers3040State.misc.transfersToVeteran,
      otherCategory: MiscTransfer.SBA_DISASTER_TRANSFERS,
      otherAmount: transfers3040State.misc.sbaDisasterTransfers,
    },
    {
      category: MiscTransfer.SEA_TRANSFERS,
      amount: transfers3040State.misc.seaTransfers,
      otherCategory: MiscTransfer.SBA_VOSB_TRANSFERS,
      otherAmount: transfers3040State.misc.sbaVOSBtransfers,
    },
    {
      category: MiscTransfer.TRANSFERS_TO_SASP,
      amount: transfers3040State.misc.transfersToSASP,
      otherCategory: MiscTransfer.SBA_8_TRANSFERS,
      otherAmount: transfers3040State.misc.sbaTransfers,
    },
    {
      category: MiscTransfer.TRANSFERS_TO_OTHER_STATES,
      amount: transfers3040State.misc.transferToOther,
      otherCategory: MiscTransfer.RETURN_TO_FEDERAL_AGENCY,
      otherAmount: transfers3040State.misc.returnToFederal,
    },
  ];

  let nonMiscData = [
    {
      category: MiscNonTransfer.OTHER_NEGATIVE_ADJUSTMENTS,
      amount: transfers3040State.nonMisc.otherNegative,
      otherCategory: "",
      otherAmount: "",
    },
    {
      category: MiscNonTransfer.SOLD,
      amount: transfers3040State.nonMisc.sold,
      otherCategory: MiscNonTransfer.ABANDONED_AND_DESTORYED,
      otherAmount: transfers3040State.nonMisc.abandoned,
    },
  ];

  const TransferHeader = ({ title }) => {
    return (
      <>
        <h4>
          {title}
          <PPMSPopover
            trigger={["hover", "focus"]}
            id={`Inventory-InfoTip-${title}`}
            placement={"top"}
            popoverTitle={"Info"}
            popoverContent={titleInfoTips.get(title)}
            className={"usa-label form-label usa-label-float float-right"}
            triggerSource={
              <button
                id={"comment-tooltip-button"}
                type={"button"}
                className={"usa-button  usa-button--unstyled infotip-margin"}
              >
                <FaInfoCircle />
              </button>
            }
          />
        </h4>
      </>
    );
  };

  return (
    <>
      <div className="header-3040">
        <TransferHeader title={Titles3040.MISC_TRANSFERS} />
        <PPMSDatatable
          title={""}
          data={data}
          columns={columns}
          defaultSortField={""}
          loading={false}
          totalRows={6}
          isPaginationEnabled={false}
          onChange={() => {}}
          showFilters={false}
          disableSortBy={true}
          customTableClass={"table-row-3040"}
          updateData={(index, id, value) => {
            updateMiscvaluesOnBlur(index, id, formatNumber(value));
          }}
        />
      </div>
      <div className="header-3040">
        <TransferHeader title={Titles3040.MISC_NON_TRANSFERS} />
        <PPMSDatatable
          title={""}
          data={nonMiscData}
          columns={nonMiscColumns}
          defaultSortField={""}
          loading={false}
          totalRows={6}
          isPaginationEnabled={false}
          onChange={() => {}}
          showFilters={false}
          disableSortBy={true}
          customTableClass={"table-row-3040"}
          updateData={(index, id, value) => {
            updateNonMiscvaluesOnBlur(index, id, formatNumber(value));
          }}
        />
      </div>
    </>
  );
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(Transfer3040);
