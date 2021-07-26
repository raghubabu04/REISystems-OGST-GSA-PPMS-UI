import React from "react";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import {
  hazardous,
  demilitarization,
  flightSafety,
} from "../create-update-property/constants/Constants";
import { FaInfoCircle } from "react-icons/fa";

interface PPMSViewSalesInfoProps {
  match: any;
  propertyData: any;
  isNonReportedProperty: boolean;
}

interface PPMSViewSalesInfoInfoState {
  saleLotNo: string;
  contractNo: string;
  dateSaleCreated: string;
  saleStatus: string;
  dateSaleStatusUpdated: string;
  awardAmaount: string;
  paymentReceived: string;
  scoName: string;
  scoPhoneNo: string;
  scoEmail: string;
}

export default class PPMSViewSalesInfo extends React.Component<
  PPMSViewSalesInfoProps,
  PPMSViewSalesInfoInfoState
  > {
  constructor(props: any) {
    super(props);
    this.state = {
      saleLotNo: "",
      contractNo: "",
      dateSaleCreated: "",
      saleStatus: "",
      dateSaleStatusUpdated: "",
      awardAmaount: "",
      paymentReceived: "",
      scoName: "",
      scoPhoneNo: "",
      scoEmail: "",
    };
  }

  // componentDidMount() {
  //   this.setDisplayName();
  // }
  //
  // componentWillReceiveProps() {
  //   this.setDisplayName();
  // }

  // setDisplayName() {
  //   for (let value of hazardous) {
  //     if (value.id === this.props?.propertyData?.hazardous) {
  //       this.setState({
  //         hazardousDisplay: value.value,
  //       });
  //     }
  //   }
  //   for (let value of flightSafety) {
  //     if (value.id === this.props?.propertyData?.fscapCode) {
  //       this.setState({
  //         fscapDisplay: value.value,
  //       });
  //     }
  //   }
  //   for (let value of demilitarization) {
  //     if (value.id === this.props?.propertyData?.demilitarizationCode) {
  //       this.setState({
  //         demilitarizationDisplay: value.value,
  //       });
  //     }
  //   }
  // }

  render() {
    return (
      <div className="PPMSViewInfo">
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget ppms-sub-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaInfoCircle />}</i> Sales
              Information
            </PPMSCardHeader>
            <PPMSCardBody className={"supporting-details"}>
              {!this.props.isNonReportedProperty && (
                <ul className={"usa-list"}>
                  <li>
                    <span>
                      <b>Sale Lot # : </b>
                    </span>
                    {""}
                  </li>
                  <br />
                  <li>
                    <span>
                      <b>Contract # :</b>
                    </span>
                    {""}
                  </li>
                  <br />
                  <li>
                    <span>
                      <b>Date Sale Created :</b>
                    </span>
                    {""}
                  </li>
                  <br />
                  <li>
                    <span>
                      <b>Sale Status :</b>
                    </span>
                    {""}
                  </li>
                  <br />
                  <li>
                    <span>
                      <b>Date Sale Status Updated :</b>
                    </span>
                    {""}
                  </li>
                  <br />
                  <li>
                    <span>
                      <b>Award Amount :</b>
                    </span>
                    {""}
                  </li>
                  <br />
                  <li>
                    <span>
                      <b>Payment Received :</b>
                    </span>
                    {""}
                  </li>
                  <br />
                  <li>
                    <span>
                      <b>SCO Name :</b>
                    </span>
                    {""}
                  </li>
                  <br />
                  <li>
                    <span>
                      <b>SCO Phone # :</b>
                    </span>
                    {""}
                  </li>
                  <br />
                  <li>
                    <span>
                      <b>SCO Email :</b>
                    </span>
                    {""}
                  </li>
                </ul>
              )}
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      </div>
    );
  }
}
