import moment from "moment";
import React from "react";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardFooter from "../../../ui-kit/components/common/card/PPMS-card-footer";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PageUtils } from "../../../utils/PageUtils";
import {
  PropertyGroupType,
  TcnStatus,
} from "../create-update-property/constants/Constants";
import { PPMSTooltip } from "../../../ui-kit/components/common/PPMS-tooltip";
import { CgNotes } from "react-icons/cg";
import { UserUtils } from "../../../utils/UserUtils";

interface TCNInfoProps {
  tcnInfo: any;
  listPage?: boolean;
  handleViewAndAllocateTCN?: any;
  requireDisabled?: any;
  approveTransfer?: boolean;
  allocation?: boolean;
  requisition?: boolean;
  completeTransfer?: boolean;
  comfirmedTransfer?: boolean;
}
export const TCNTile = (props: TCNInfoProps) => {
  const tcnInfo = props.tcnInfo;
  const listPage = props.listPage;
  const getDateForApproval = () => {
    let dateLabel;
    let date;
    let isAllocationConfirmed =
      tcnInfo?.tcnStatus === TcnStatus.ALLOCATION_CONFIRMED ||
      tcnInfo?.tcnStatus === TcnStatus.PENDING_AO_APPROVAL ||
      tcnInfo?.requestStatus === TcnStatus.ALLOCATION_CONFIRMED ||
      tcnInfo?.requestStatus === TcnStatus.PENDING_AO_APPROVAL;
    let isAODenied =
      tcnInfo?.tcnStatus === TcnStatus.DENIED_BY_AO ||
      tcnInfo?.requestStatus === TcnStatus.DENIED_BY_AO;
    let isAOApproved =
      tcnInfo?.tcnStatus === TcnStatus.APPROVED_BY_AO ||
      tcnInfo?.requestStatus === TcnStatus.APPROVED_BY_AO ||
      tcnInfo?.tcnstatus == TcnStatus.PENDING_APO_REQUISITION ||
      tcnInfo?.requestStatus == TcnStatus.PENDING_APO_REQUISITION;

    if (isAllocationConfirmed) {
      dateLabel = "Date Allocated";
      date = tcnInfo?.allocatedDate;
    } else if (isAOApproved) {
      dateLabel = "Date Approved";
      date = tcnInfo?.allocatedDate;
    } else if (isAODenied) {
      dateLabel = "Date Denied";
      date = tcnInfo?.allocatedDate;
    }

    return (
      dateLabel &&
      date &&
      getTcnField(dateLabel, date ? moment(date).format("MM/DD/YYYY") : null)
    );
  };

  const isForeignGift = () => {
    return tcnInfo?.propertyGroup === PropertyGroupType.FOREIGN_GIFT;
  };

  const getDateForAllocation = () => {
    let dateLabel;
    let date;
    let isAllocationConfirmed =
      tcnInfo?.tcnStatus === TcnStatus.ALLOCATION_CONFIRMED ||
      tcnInfo?.requestStatus === TcnStatus.ALLOCATION_CONFIRMED;
    let isAllocationDenied =
      tcnInfo?.tcnStatus === TcnStatus.ALLOCATION_DENIED ||
      tcnInfo?.requestStatus === TcnStatus.ALLOCATION_DENIED;

    if (isAllocationConfirmed) {
      dateLabel = "Date Allocated";
      date = tcnInfo?.allocatedDate;
    } else if (isAllocationDenied) {
      dateLabel = "Date Denied";
      date = tcnInfo?.allocatedDate;
    }

    return (
      dateLabel &&
      date &&
      getTcnField(dateLabel, date ? moment(date).format("MM/DD/YYYY") : null)
    );
  };

  const getDateForTransfer = () => {
    let dateLabel;
    let date;
    let isTransferred =
      tcnInfo?.tcnStatus === TcnStatus.TRANSFERRED ||
      tcnInfo?.requestStatus === TcnStatus.TRANSFERRED;
    let isDonated =
      tcnInfo?.tcnStatus === TcnStatus.DONATED ||
      tcnInfo?.requestStatus === TcnStatus.DONATED;
    let isTransferDenied =
      tcnInfo?.tcnStatus === TcnStatus.TRANSFER_DENIED ||
      tcnInfo?.tcnStatus === TcnStatus.DONATION_DENIED ||
      tcnInfo?.requestStatus === TcnStatus.TRANSFER_DENIED ||
      tcnInfo?.requestStatus === TcnStatus.DONATION_DENIED;
    let isAOApproved =
      tcnInfo?.tcnStatus === TcnStatus.APPROVED_BY_AO ||
      tcnInfo?.requestStatus === TcnStatus.APPROVED_BY_AO ||
      tcnInfo?.tcnstatus == TcnStatus.PENDING_APO_REQUISITION ||
      tcnInfo?.requestStatus == TcnStatus.PENDING_APO_REQUISITION;
    if (isTransferred) {
      dateLabel = "Date Transferred";
      date = tcnInfo?.transferDate;
    } else if (isTransferDenied) {
      dateLabel = "Date Denied";
      date = tcnInfo?.denialDate;
    } else if (isAOApproved) {
      dateLabel = "Date Approved";
      date = tcnInfo?.allocatedDate;
    } else if (isDonated) {
      dateLabel = "Date Donated";
      date = tcnInfo?.transferDate;
    }
    return (
      dateLabel &&
      date &&
      getTcnField(dateLabel, date ? moment(date).format("MM/DD/YYYY") : null)
    );
  };

  const getNavigationButton = () => {
    let label;

    if (props.allocation) {
      label =
        tcnInfo.requestStatus === TcnStatus.PENDING_ALLOCATION ||
        tcnInfo.requestStatus === TcnStatus.REQUESTED
          ? "Allocate"
          : "View TCN Details";
    }
    if (props.approveTransfer) {
      label =
        tcnInfo.requestStatus === TcnStatus.APPROVED_BY_AO ||
        tcnInfo.requestStatus === TcnStatus.DENIED_BY_AO ||
        tcnInfo.requestStatus === TcnStatus.INTERNAL_TRANSFER
          ? "View TCN Details"
          : "Approve/Deny";
    }
    if (props.requisition) {
      label =
        tcnInfo.requestStatus === TcnStatus.APPROVED_BY_AO ||
        tcnInfo.requestStatus === TcnStatus.PENDING_APO_REQUISITION ||
        tcnInfo.requestStatus === TcnStatus.ALLOCATION_CONFIRMED
          ? "Requisition"
          : "View TCN Details";
    }

    if (props.comfirmedTransfer) {
      label = "Recall/View Transfer";
    }

    return (
      <PPMSCardFooter>
        <div className="grid-row tablet:grid-gap-2">
          <div className={"grid-col-10"}>
            <PPMSButton
              id={`tcn-details-navigation-${tcnInfo.transferControlNumber}`}
              label={label}
              className={"out-button"}
              variant={"primary"}
              onPress={() => {
                props.handleViewAndAllocateTCN(tcnInfo.transferControlNumber);
              }}
            />
          </div>
        </div>
      </PPMSCardFooter>
    );
  };

  const getTcnHeader = () => {
    return (
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col">
          <strong>
            TCN:{" "}
            {tcnInfo?.transferControlNumber?.replace(
              /(.{2})(.{2})(.{6})/,
              "$1-$2-$3"
            )}
          </strong>
        </div>
        <div className="tablet:grid-col tcn-header-status">
          <strong>TCN Status:</strong>{" "}
          {listPage ? tcnInfo?.requestStatus : tcnInfo?.tcnStatus}
        </div>
      </div>
    );
  };

  const getLocation = () => {
    if (listPage) {
      if (tcnInfo?.city) {
        return `${tcnInfo?.city}, ${tcnInfo?.state} ${tcnInfo?.zip}`;
      } else return "";
    } else {
      return tcnInfo?.location?.includes("Null") ? "" : tcnInfo?.location;
    }
  };

  const getTcnField = (label, value = "") => {
    switch (label) {
      case "Location":
        value = getLocation();
        break;
      case "Surplus Release Date":
        value = tcnInfo?.surplusReleaseDate;
        break;
      case "Excess Release Date":
        value = tcnInfo?.excessReleaseDate;
        break;
      case "Region":
        value = tcnInfo?.region;
        break;
      case "Priority":
        value = tcnInfo?.priority;
        break;
      case "Agency Bureau":
        value =
          tcnInfo?.agencyBureau?.code + "-" + tcnInfo?.agencyBureau?.longName;
        break;
      case "Property AAC":
        value = tcnInfo?.propertyAACId;
        break;
      case "Requested ICNs":
        listPage
          ? (value = tcnInfo?.noOfICNs)
          : (value = tcnInfo?.totalRequestedICN);
        break;
      case "Date Requested":
        value = tcnInfo?.requestedDate
          ? moment(tcnInfo.requestedDate).format("MM/DD/YYYY")
          : null;
        break;
      case "Total OAC":
        value = tcnInfo?.totalOAC
          ? PageUtils.getFormattedCurrency(tcnInfo.totalOAC)
          : PageUtils.getFormattedCurrency(0);
        break;
      case "Vault Location":
        value = tcnInfo?.vaultLocation;
        break;
    }
    return (
      <li>
        <strong>{label}:</strong>{" "}
        <span className="tcn-data-point">
          {value}{" "}
          {label === "Priority" && tcnInfo?.justification && (
            <PPMSTooltip
              trigger={"focus"}
              id={"other-info"}
              placement={"right"}
              tooltipContent={tcnInfo?.justification}
              triggerSource={
                <button
                  id={`other-info-button`}
                  type={"button"}
                  className={"usa-button usa-button--unstyled"}
                  title="Additional Information"
                >
                  <CgNotes />
                </button>
              }
            />
          )}
        </span>
      </li>
    );
  };

  return (
    <>
      <PPMSCardGroup
        className={"ppms-card-group ui-ppms"}
        data-testid={tcnInfo?.transferControlNumber}
      >
        <PPMSCard>
          <PPMSCardBody className="tcn-header-row">
            {getTcnHeader()}
          </PPMSCardBody>
          <PPMSCardBody className="tcn-body-row">
            <div className="grid-row grid-gap ">
              {
                <>
                  <div className="tablet:grid-col">
                    <ul className={"usa-list usa-list--unstyled"}>
                      {isForeignGift()
                        ? getTcnField("Vault Location")
                        : getTcnField("Location")}
                      {!isForeignGift() &&
                        getTcnField(
                          `${
                            tcnInfo?.excessReleaseDate
                              ? "Excess Release Date"
                              : "Surplus Release Date"
                          }`
                        )}
                      {!isForeignGift() && getTcnField("Region")}
                      {!isForeignGift() &&
                        tcnInfo?.priority &&
                        getTcnField("Priority")}
                    </ul>
                  </div>
                  <div className="tablet:grid-col">
                    <ul className={"usa-list usa-list--unstyled"}>
                      {getTcnField("Agency Bureau")}
                      {getTcnField("Property AAC")}
                    </ul>
                  </div>

                  <div className="tablet:grid-col">
                    <ul className={"usa-list usa-list--unstyled"}>
                      {getTcnField("Requested ICNs")}
                      {getTcnField("Date Requested")}
                      {props.approveTransfer
                        ? getDateForApproval()
                        : props.comfirmedTransfer || props.requisition
                        ? getDateForTransfer()
                        : getDateForAllocation()}
                      {(props.approveTransfer ||
                        props.requisition ||
                        props.comfirmedTransfer) &&
                        !isForeignGift() &&
                        getTcnField("Total OAC")}
                    </ul>
                  </div>
                </>
              }
            </div>
          </PPMSCardBody>
          {listPage ? getNavigationButton() : <> </>}
        </PPMSCard>
      </PPMSCardGroup>
    </>
  );
};
