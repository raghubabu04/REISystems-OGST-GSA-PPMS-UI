import React from "react";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import {FaInfoCircle} from "react-icons/fa";
import {formatDate, formatTCN} from "../../../ui-kit/utilities/FormatUtil";

interface PPMSRequestInfoProps {
  propertyRequestData: any;
  location?: any;
}

interface PPMSRequestInfoState {
  propertyRequestData: any;
}

export default class PPMSRequestInfo extends React.Component<
  PPMSRequestInfoProps,
  PPMSRequestInfoState
> {
  targetRef;
  constructor(props: any) {
    super(props);
    this.state = {
      propertyRequestData: {},
    };
    this.targetRef = React.createRef();
  }
  scrollToTarget = () => {
    setTimeout(() => {
      this.targetRef.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  };
  componentDidMount() {
    if (this.props.location.state) {
      this.scrollToTarget();
    }
  }
  render() {
    return (
      <div
        className="PPMSRequestInfo"
        ref={(ref) => {
          this.targetRef = ref;
        }}
      >
        <PPMSCardGroup
          className={"ppms-card-group ui-ppms"}
          id="property-request-info"
        >
          <PPMSCard className={"ppms-widget ppms-sub-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaInfoCircle />}</i> Property
              Requests
            </PPMSCardHeader>
            <PPMSCardBody className={"supporting-details"}>
              <table style={{ width: "100%" }} className="action-table">
                <thead>
                  <tr>
                    <th className="dtHeader">TCN</th>
                    <th className="dtHeader">Status</th>
                    <th className="dtHeader">Request Details</th>
                    <th className="dtHeader">Allocation Details</th>
                    <th className="dtHeader">Approval Details</th>
                    <th className="dtHeader">Requisition Details</th>
                    <th className="dtHeader"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.propertyRequestData.propertyDetails &&
                    this.props.propertyRequestData.propertyDetails.map((d) => {
                      let requestedByLabel = d.requestDetail?.qty
                        ? "Requested Qty:" + d.requestDetail?.qty
                        : "";

                      let label = "";
                      if (
                        d.requestStatus === "Transferred" &&
                        d.requisitionDetail.qty
                      ) {
                        label = "Transferred Qty:" + d.requisitionDetail.qty;
                      } else if (
                        d.requestStatus === "Donated" &&
                        d.requisitionDetail.qty
                      ) {
                        label = "Donated Qty:" + d.requisitionDetail.qty;
                      }

                      let allocatedByLabel = d.allocationDetail?.qty
                        ? "Allocated Qty:" + d.allocationDetail?.qty
                        : "";
                      let approvedQtyLabel = d.approvalDetail?.qty
                        ? "Approved Qty:" + d.approvalDetail?.qty
                        : "";

                      return (
                        <tr className="action-list-row">
                          <td><span className="action-list-message">{formatTCN(d.transferControlNumber)}</span></td>
                          <td><span className="action-list-message">{d.requestStatus}</span></td>
                          <td>
                            <div className="action-list-message">{requestedByLabel}</div>
                            <div className="action-list-message">{d.requestDetail.email}</div>
                            <div className="action-list-message">{formatDate(d.requestDetail.date)}</div>
                          </td>
                          <td>
                            <div className="action-list-message">{allocatedByLabel}</div>
                            <div className="action-list-message">{d.allocationDetail.email}</div>
                            <div className="action-list-message">{formatDate(d.allocationDetail.date)}</div>
                          </td>
                          <td>
                            <div className="action-list-message">{approvedQtyLabel}</div>
                            <div className="action-list-message">{d.approvalDetail.email}</div>
                            <div className="action-list-message">{formatDate(d.approvalDetail.date)}</div>
                          </td>
                          <td>
                            <div className="action-list-message">{label}</div>
                            <div className="action-list-message">{d.requisitionDetail.email}</div>
                            <div className="action-list-message">{formatDate(d.requisitionDetail.date)}</div>
                          </td>
                          <td></td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      </div>
    );
  }
}
