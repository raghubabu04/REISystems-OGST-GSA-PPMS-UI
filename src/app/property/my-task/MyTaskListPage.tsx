import React from "react";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { UserUtils } from "../../../utils/UserUtils";
import { PageHelper, Paths } from "../../Router";
import { SalesApiService } from "../../../api-kit/sales/sales-api-service";

enum myTaskRedirect {
  CHANGEREQUEST = "CHANGEREQUEST",
  ALLOCATION = "ALLOCATION",
  APPROVE_TRANSFER_ORDERS = "APPROVE_TRANSFER_ORDER",
  REQUISITION = "REQUISITION",
  NONE = "NONE",
  COMPLETE_TRANSFER_ORDERS = "COMPLETED_TRANSFERS",
  LOT_MANAGEMENT = "LOT_MANAGEMENT",
  REFUNDS = "REFUNDS",
  LIQUIDATED_DAMAGES = "LIQUIDATED_DAMAGES",
  CHARGEBACKS = "CHARGEBACKS",
}

interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
}

interface State {
  loading: boolean;
  totalPendingRowsRequests: number;
  totalPendingRowsAllocations: number;
  isUserSmOrApoOrNuo: boolean;
  isUserApoOrNuo: boolean;
  successMessage: string;
  approveTransferOrderCount: number;
  isUserSmOrAoOrNuo: boolean;
  isUserSmOrNuOrAcOrRP: boolean;
  isUserSmOrApo: boolean;
  isUserPC: boolean;
  totalRequisitions: number;
  isUserSales?: boolean;
  noOfContractRefunds: number;
  noOfContractChargebacks: number;
  noOfLiquidatedDamages: number;
}

export class MyTaskListPage extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      totalPendingRowsRequests: 0,
      totalPendingRowsAllocations: 0,
      isUserSmOrApoOrNuo: false,
      successMessage: this.props.location.successMessage,
      approveTransferOrderCount: 0,
      isUserApoOrNuo: false,
      isUserSmOrAoOrNuo: false,
      isUserSmOrNuOrAcOrRP: false,
      isUserSmOrApo: false,
      isUserPC: false,
      isUserSales: false,
      totalRequisitions: 0,
      noOfContractRefunds: 0,
      noOfContractChargebacks: 0,
      noOfLiquidatedDamages: 0,
    };
  }

  propertyApiService = new PropertyApiService();
  salesAPIService = new SalesApiService();

  userPermissions = UserUtils.getUserPermissions().toString();
  isInternalUser = UserUtils.getUserInfo().internalAgencyUser;
  userRoles = UserUtils.getUserRoles().toString();

  getCountOfTasks = async () => {
    try {
      const getCountOfTasksResponse: any = await this.propertyApiService.getCountOfTasks();
      return getCountOfTasksResponse;
    } catch (e) {
      console.error(
        `MyTaskListPage propertyApiService.getCountOfTasks has an error ${e}`
      );
      return e;
    }
  };

  getCountRefundChargebacksLiquidated = async () => {
    try {
      const countRefundChargebacksLiquidatedResp: any = await this.salesAPIService.countRefundChargebacksLiquidated();
      return countRefundChargebacksLiquidatedResp;
    } catch (e) {
      console.error(
        `MyTaskListPage salesAPIService.countRefundChargebacksLiquidated has an error ${e}`
      );
      return e;
    }
  };

  async componentDidMount() {
    this.setState({
      approveTransferOrderCount: 0,
      loading: false,
      noOfContractChargebacks: 0,
      noOfContractRefunds: 0,
      noOfLiquidatedDamages: 0,
      successMessage: "",
      totalPendingRowsAllocations: 0,
      totalPendingRowsRequests: 0,
      totalRequisitions: 0,
      isUserSmOrApoOrNuo:
        this.userPermissions.includes("AC") ||
        this.userPermissions.includes("NU") ||
        this.userPermissions.includes("SM"),
      //For Change Requests
      isUserApoOrNuo:
        this.userPermissions.includes("AC") ||
        this.userPermissions.includes("NU"),
      //For Approve Transfer Orders Button
      isUserSmOrAoOrNuo:
        this.userPermissions.includes("AO") ||
        this.userPermissions.includes("SM") ||
        //External NUO needs AO permission to Approve
        (this.userPermissions.includes("NU") && this.isInternalUser) ||
        //FGM with APO rights
        (this.userPermissions.includes("FG") &&
          this.userPermissions.includes("AC")),
      //For Allocations Buttons Button
      isUserSmOrNuOrAcOrRP:
        this.userPermissions.includes("SM") ||
        this.userPermissions.includes("NU") ||
        this.userPermissions.includes("AC") ||
        (this.userPermissions.includes("RP") && this.isInternalUser),
      //For Requisitions and Completed Transfers
      isUserSmOrApo:
        this.userPermissions.includes("AC") ||
        this.userPermissions.includes("SM"),
      isUserPC:
        this.userPermissions.includes("PC") ||
        this.userPermissions.includes("SM") ||
        this.userPermissions.includes("AC") ||
        this.userPermissions.includes("NU"),
      isUserSales:
        this.userRoles.includes("CLO") ||
        this.userRoles.includes("SCO") ||
        this.userRoles.includes("CO") ||
        this.userRoles.includes("SMS") ||
        this.userRoles.includes("SG")
    });

    this.setState({
      loading: true,
    });

    let [getCountOfTasksResponse] = await Promise.all([
      // this.getTaskList(dataGetTaskList),
      this.getCountOfTasks(),
    ]);

    let [countRefundChargebacksLiquidatedResp] = await Promise.all([
      this.getCountRefundChargebacksLiquidated(),
    ]);

    this.setState({
      loading: false,
    });

    // this.setTaskListData(getTaskListResponse);
    this.setState({
      totalPendingRowsAllocations: getCountOfTasksResponse.data?.myAllocations
        ? parseInt(getCountOfTasksResponse.data?.myAllocations)
        : 0,
      approveTransferOrderCount: getCountOfTasksResponse.data?.myApprovals
        ? parseInt(getCountOfTasksResponse.data?.myApprovals)
        : 0,
      totalPendingRowsRequests: getCountOfTasksResponse.data?.myRequests
        ? parseInt(getCountOfTasksResponse.data?.myRequests)
        : 0,
      totalRequisitions: getCountOfTasksResponse.data?.myRequisitions
        ? parseInt(getCountOfTasksResponse.data?.myRequisitions)
        : 0,
      noOfContractRefunds: countRefundChargebacksLiquidatedResp.data
        ?.noOfContractRefunds
        ? parseInt(
            countRefundChargebacksLiquidatedResp.data?.noOfContractRefunds
          )
        : 0,
      noOfContractChargebacks: countRefundChargebacksLiquidatedResp.data
        ?.noOfContractChargebacks
        ? parseInt(
            countRefundChargebacksLiquidatedResp.data?.noOfContractChargebacks
          )
        : 0,
      noOfLiquidatedDamages: countRefundChargebacksLiquidatedResp.data
        ?.noOfLiquidatedDamages
        ? parseInt(
            countRefundChargebacksLiquidatedResp.data?.noOfLiquidatedDamages
          )
        : 0
    });
  }

  handleRequestAllocationDisplay = (e) => {
    switch (e.target.value) {
      case myTaskRedirect.CHANGEREQUEST:
        PageHelper.openPage(Paths.tasks);
        break;
      case myTaskRedirect.ALLOCATION:
        PageHelper.openPage(Paths.allocations);
        break;
      case myTaskRedirect.APPROVE_TRANSFER_ORDERS:
        PageHelper.openPage(Paths.approveTransferOrders);
        break;
      case myTaskRedirect.REQUISITION:
        PageHelper.openPage(Paths.requisitionTransferOrders);
        break;
      case myTaskRedirect.COMPLETE_TRANSFER_ORDERS:
        PageHelper.openPage(Paths.completedTransfer);
        break;
      case myTaskRedirect.LOT_MANAGEMENT:
        PageHelper.openPage(Paths.custodianLotManagement);
        break;
      case myTaskRedirect.REFUNDS:
        PageHelper.openPage(Paths.contractRefundList);
        break;
      case myTaskRedirect.LIQUIDATED_DAMAGES:
        PageHelper.openPage(Paths.liquidatedDamagesList);
        break;
      case myTaskRedirect.CHARGEBACKS:
        PageHelper.openPage(Paths.contractChargebacksList);
        break;
    }
  };

  render() {
    return (
      <>
        <div className={"ui-ppms"}>
          <h1>My Tasks</h1>
          <div className={"margin-left-auto col-md-auto task-widget-container"}>
            {this.state.isUserApoOrNuo && (
              <div className="task-widget task-changes">

              <h3>
                <span className="task-number">{this.state.totalPendingRowsRequests}</span>
                Change Requests
              </h3>
              <p>
                Review and approve requested changes
              </p>
              <PPMSButton
                className={"out-button task-button"}
                type={"button"}
                value={myTaskRedirect.CHANGEREQUEST}
                //label={`Change Requests (${this.state.totalPendingRowsRequests})`}
                label={`Change Requests`}
                onPress={this.handleRequestAllocationDisplay}
                id={"my-task-change-request"}
              />

              </div>
            )}
            {this.state.isUserSmOrNuOrAcOrRP && (
              <div className="task-widget task-allocations">
                <h3>
                  <span className="task-number">
                    {this.state.totalPendingRowsAllocations}
                  </span>
                  Allocations
                </h3>
                <p>
                  Process the allocation of requested ICNs from users to
                  distribute items
                </p>
                <PPMSButton
                  className={"out-button task-button"}
                  type={"button"}
                  value={myTaskRedirect.ALLOCATION}
                  //label={`Allocations (${this.state.totalPendingRowsAllocations})`}
                  label={`Update Allocations`}
                  onPress={this.handleRequestAllocationDisplay}
                  id={"my-task-allocation"}
                />
              </div>
            )}
            {this.state.isUserSmOrAoOrNuo && (
              <div className="task-widget task-approves">
                <h3>
                  <span className="task-number">
                    {this.state.approveTransferOrderCount}
                  </span>
                  Approve Transfers
                </h3>
                <p>
                  Approve allocated ICNs to the requester and provide
                  adjustments
                </p>
                <PPMSButton
                  className={"out-button task-button"}
                  type={"button"}
                  value={myTaskRedirect.APPROVE_TRANSFER_ORDERS}
                  //label={`Approve Transfer Orders (${this.state.approveTransferOrderCount})`}
                  label={`Approve Transfers`}
                  onPress={this.handleRequestAllocationDisplay}
                  id={"my-task-approve-transfer-orders"}
                />
              </div>
            )}
            {this.state.isUserSmOrApo && (
              <>
                <div className="task-widget task-requistions">
                  <h3>
                    <span className="task-number">
                      {this.state.totalRequisitions}
                    </span>
                    Requisitions
                  </h3>
                  <p>
                    Transfer Requests and review the details to inform users of
                    transfers
                  </p>
                  <PPMSButton
                    className={"out-button task-button"}
                    type={"button"}
                    value={myTaskRedirect.REQUISITION}
                    //label={`Requisitions (${this.state.totalRequisitions})`}
                    label={`Requisition Transfers`}
                    onPress={this.handleRequestAllocationDisplay}
                    id={"my-requisitions"}
                  />
                </div>
                <div className="task-widget task-completed">
                  <h3>
                    <span className="task-number">&nbsp;</span>
                    Complete Transfers
                  </h3>
                  <p>Review recently completed transfers and withdraw TCNs</p>
                  <PPMSButton
                    className={"out-button task-button"}
                    type={"button"}
                    value={myTaskRedirect.COMPLETE_TRANSFER_ORDERS}
                    label={"Completed Transfers"}
                    onPress={this.handleRequestAllocationDisplay}
                    id={"completed-transfers"}
                  />
                </div>
              </>
            )}
            {this.state.isUserPC && (
              <>
                <div className="task-widget task-review">
                  <h3>
                    <span className="task-number">&nbsp;</span>
                    Auction Review
                  </h3>
                  <p>Review auctions and approve them for sale</p>
                  <PPMSButton
                    className={"out-button"}
                    type={"button"}
                    value={myTaskRedirect.LOT_MANAGEMENT}
                    label={`Auction Review/Approval`}
                    onPress={this.handleRequestAllocationDisplay}
                    id={"auction-review-approval"}
                  />
                </div>
              </>
            )}
            {this.state.isUserSales && (
              <>
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col-4"}>
                    <div className="task-widget task-refunds">
                      <h3>
                        <span className="task-number">
                          {this.state.noOfContractRefunds}
                        </span>
                        Refunds
                      </h3>
                      <p>Process Refunds for Paid Contracts</p>
                      <PPMSButton
                        className={"out-button"}
                        type={"button"}
                        value={myTaskRedirect.REFUNDS}
                        label={`Process Refund`}
                        onPress={this.handleRequestAllocationDisplay}
                        id={"process-refund-contracts"}
                      />
                    </div>
                  </div>
                  <div className={"grid-col-4"}>
                    <div className="task-widget task-damages">
                      <h3>
                        <span className="task-number">
                          {this.state.noOfLiquidatedDamages}
                        </span>
                        Liquidated Damages
                      </h3>
                      <p>Collect Liquidated Damages</p>
                      <PPMSButton
                        className={"out-button"}
                        type={"button"}
                        value={myTaskRedirect.LIQUIDATED_DAMAGES}
                        label={`Liquidated Damages Transaction`}
                        onPress={this.handleRequestAllocationDisplay}
                        id={"liquidated-damages-transaction"}
                      />
                    </div>
                  </div>
                  <div className={"grid-col-4"}>
                    <div className="task-widget task-chargebacks">
                      <h3>
                        <span className="task-number">
                          {this.state.noOfContractChargebacks}
                        </span>
                        Chargebacks
                      </h3>
                      <p>Process Chargebacks</p>
                      <PPMSButton
                        className={"out-button"}
                        type={"button"}
                        value={myTaskRedirect.CHARGEBACKS}
                        label={`Record Chargeback`}
                        onPress={this.handleRequestAllocationDisplay}
                        id={"record-chargeback"}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}
