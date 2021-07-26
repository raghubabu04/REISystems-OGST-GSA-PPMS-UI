import React, { useContext } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../../_redux/_actions/toast.actions";
import { PPMSDatatable } from "../../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { Reporting3040Context } from "../reporting-3040-context";
import {
  convertToNumber,
  DonationsNonProfit,
  donationsNonProfitInfoTips,
  DonationsPublic,
  donationsPublicAmountIndexs,
  donationsPublicInfoTips,
  donationsPublicOtherAmountIndexs,
  formatNumber,
  formatNumberWithNegative,
  nonProfitDonationsAmountIndexs,
  nonProfitDonationsOtherAmountIndexs,
  titleInfoTips,
  Titles3040,
} from "../constants-3040";
import { PPMSPopover } from "../../../../../../ui-kit/components/common/PPMS-popover";
import { FaInfoCircle } from "react-icons/fa";
import { EditableCell } from "../report3040-editableCell";
import { UserUtils } from "../../../../../../utils/UserUtils";
import { isEmptyCheck } from "../../../../../../ui-kit/components/validations/FieldValidations";

interface Donations3040Props {}

function Donations3040(props: Donations3040Props) {
  const {
    donations3040State,
    updateDonations3040State,
    editReporting3040State,
    receipts3040State,
    transfers3040State,
    updateEditReporting3040State,
    updateComments3040State,
  } = useContext(Reporting3040Context);

  function updatePublicDonationsvaluesOnBlur(index, id, value) {
    const { publicProfit } = donations3040State;
    const { nonProfit } = donations3040State;
    if (id === "amount") {
      publicProfit[donationsPublicAmountIndexs.get(index)] = value;
      if (
        donationsPublicAmountIndexs.get(index) ===
          DonationsPublic.OTHERS.toLowerCase() &&
        UserUtils.isUserSA() &&
        isEmptyCheck(value) && isEmptyCheck(receipts3040State.pocAdjust) && isEmptyCheck(transfers3040State.nonMisc.otherNegative)
      ) {
        updateComments3040State({
          saspCommentsIsInValid: false,
          saspCommentsIsValid: true,
        });
      }
    } else {
      publicProfit[donationsPublicOtherAmountIndexs.get(index)] = value;
    }

    let donationSummary = donationSummaryValue(publicProfit, nonProfit);

    let endingInventory = endingInventoryValue(donationSummary);

    updateEditReporting3040State({
      endingInventory: formatNumberWithNegative(endingInventory),
    });

    updateDonations3040State({
      publicProfit: publicProfit,
      donationSummary: formatNumber(donationSummary),
    });
  }

  function updateNonProfitDonationsvaluesOnBlur(index, id, value) {
    const { nonProfit } = donations3040State;
    const { publicProfit } = donations3040State;
    if (id === "amount") {
      nonProfit[nonProfitDonationsAmountIndexs.get(index)] = value;
    } else {
      nonProfit[nonProfitDonationsOtherAmountIndexs.get(index)] = value;
    }

    let donationSummary = donationSummaryValue(publicProfit, nonProfit);

    let endingInventory = endingInventoryValue(donationSummary);

    updateEditReporting3040State({
      endingInventory: formatNumberWithNegative(endingInventory),
    });

    updateDonations3040State({
      nonProfit: nonProfit,
      donationSummary: formatNumber(donationSummary),
    });
  }

  function endingInventoryValue(donationSummary) {
    let endingInventory = 0;

    endingInventory =
      +convertToNumber(editReporting3040State.beginningInventory) +
      +convertToNumber(receipts3040State.receiptsSummary) -
      (+convertToNumber(transfers3040State.transferSummary) + donationSummary);

    return endingInventory;
  }

  function donationSummaryValue(publicProfit, nonProfit) {
    let donationSummary = 0;

    donationsPublicAmountIndexs.forEach((value) => {
      if (publicProfit[value]) {
        donationSummary =
          +donationSummary + +convertToNumber(publicProfit[value]);
      }
    });

    donationsPublicOtherAmountIndexs.forEach((value) => {
      if (publicProfit[value]) {
        donationSummary =
          +donationSummary + +convertToNumber(publicProfit[value]);
      }
    });

    nonProfitDonationsAmountIndexs.forEach((value) => {
      if (nonProfit[value]) {
        donationSummary = +donationSummary + +convertToNumber(nonProfit[value]);
      }
    });

    nonProfitDonationsOtherAmountIndexs.forEach((value) => {
      if (nonProfit[value]) {
        donationSummary = +donationSummary + +convertToNumber(nonProfit[value]);
      }
    });

    return donationSummary;
  }

  let columns = [
    {
      Header: "Category",
      accessor: "category",
      Cell: (props) => (
        <>
          {props.value}
          {donationsPublicInfoTips.get(props.value) && (
            <PPMSPopover
              trigger={["hover", "focus"]}
              id={`Inventory-InfoTip-${props.value}`}
              placement={"top"}
              popoverTitle={"Info"}
              popoverContent={donationsPublicInfoTips.get(props.value)}
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
              {donationsPublicInfoTips.get(props.value) && (
                <PPMSPopover
                  trigger={["hover", "focus"]}
                  id={`Inventory-InfoTip-${props.value}`}
                  placement={"top"}
                  popoverTitle={"Info"}
                  popoverContent={donationsPublicInfoTips.get(props.value)}
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
      category: DonationsPublic.OTHERS,
      amount: donations3040State.publicProfit.other,
      otherCategory: "",
      otherAmount: "",
    },
    {
      category: DonationsPublic.OLDER_AMERICANS,
      amount: donations3040State.publicProfit.assistanceToOlderAmericans,
      otherCategory: DonationsPublic.TWO_OR_MORE,
      otherAmount: donations3040State.publicProfit.twoOrMore,
    },
    {
      category: DonationsPublic.HOMELESS,
      amount: donations3040State.publicProfit.assistanceToHomeless,
      otherCategory: DonationsPublic.FAMILIES_OR_INDIVIDUALS,
      otherAmount: donations3040State.publicProfit.FamiliesOrIndividuals,
    },
    {
      category: DonationsPublic.PUBLIC_HEALTH,
      amount: donations3040State.publicProfit.publicHealth,
      otherCategory: DonationsPublic.PUBLIC_SAFETY,
      otherAmount: donations3040State.publicProfit.publicSafety,
    },
    {
      category: DonationsPublic.EDUCATION,
      amount: donations3040State.publicProfit.education,
      otherCategory: DonationsPublic.PARKS_AND_RECREATION,
      otherAmount: donations3040State.publicProfit.parksAndRecreation,
    },
    {
      category: DonationsPublic.CONSERVATION,
      amount: donations3040State.publicProfit.conversation,
      otherCategory: DonationsPublic.ECONOMIC_DEVELOPMENT,
      otherAmount: donations3040State.publicProfit.economicDevelopment,
    },
  ];

  let nonProfitColumns = [
    {
      Header: "Category",
      accessor: "category",
      Cell: (props) => (
        <>
          {props.value}
          {donationsNonProfitInfoTips.get(props.value) && (
            <PPMSPopover
              trigger={["hover", "focus"]}
              id={`Inventory-InfoTip-${props.value}`}
              placement={"top"}
              popoverTitle={"Info"}
              popoverContent={donationsNonProfitInfoTips.get(props.value)}
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
              {donationsNonProfitInfoTips.get(props.value) && (
                <PPMSPopover
                  trigger={["hover", "focus"]}
                  id={`Inventory-InfoTip-${props.value}`}
                  placement={"top"}
                  popoverTitle={"Info"}
                  popoverContent={donationsNonProfitInfoTips.get(props.value)}
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

  let nonProfitData = [
    {
      category: DonationsNonProfit.OLDER_AMERICANS,
      amount: donations3040State.nonProfit.assistanceToOlderAmericans,
      otherCategory: "",
      otherAmount: "",
    },
    {
      category: DonationsNonProfit.HOMELESS,
      amount: donations3040State.nonProfit.assistanceToHomeless,
      otherCategory: DonationsNonProfit.FAMILIES_OR_INDIVIDUALS,
      otherAmount: donations3040State.nonProfit.familiesOrIndividuals,
    },
    {
      category: DonationsNonProfit.EDUCATION,
      amount: donations3040State.nonProfit.education,
      otherCategory: DonationsNonProfit.PUBLIC_HEALTH,
      otherAmount: donations3040State.nonProfit.publicHealth,
    },
  ];

  const DonationHeader = ({ title }) => {
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
        <DonationHeader title={Titles3040.PUBLIC_AGENCY_DONATIONS} />
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
            updatePublicDonationsvaluesOnBlur(index, id, formatNumber(value));
          }}
        />
      </div>
      <div className="header-3040">
        <DonationHeader title={Titles3040.NON_PROFIT_DONATIONS} />
        <PPMSDatatable
          title={""}
          data={nonProfitData}
          columns={nonProfitColumns}
          defaultSortField={""}
          loading={false}
          totalRows={6}
          isPaginationEnabled={false}
          onChange={() => {}}
          showFilters={false}
          disableSortBy={true}
          customTableClass={"table-row-3040"}
          updateData={(index, id, value) => {
            updateNonProfitDonationsvaluesOnBlur(
              index,
              id,
              formatNumber(value)
            );
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
export default connect(null, mapDispatchToProps)(Donations3040);
