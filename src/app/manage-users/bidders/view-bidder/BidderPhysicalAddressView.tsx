import React from "react";
import PPMSCard from "../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardGroup from "../../../../ui-kit/components/common/card/PPMS-card-group";
import {FaMapMarkerAlt} from "react-icons/fa";

interface BidderPhysicalAddressProps {
  match: any;
  bidderData: any;
}

interface BidderPhysicalAddressState {
}

export default class BidderPhysicalAddressView extends React.Component<BidderPhysicalAddressProps,
  BidderPhysicalAddressState> {
  async componentDidMount() {
  }

  render() {
    return (
      <div>
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget ppms-sub-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaMapMarkerAlt/>}</i> Physical Address
            </PPMSCardHeader>
            <PPMSCardBody className={"card-height supporting-details"}>
              <div>
                {this.props?.bidderData?.address?.secondaryAddressLine1 &&
                (
                  <div>
                    <b>Address :</b>
                  </div>
                )}
                <div>
                  {this.props?.bidderData?.address?.secondaryAddressLine1}
                  {this.props?.bidderData?.address?.secondaryAddressLine1 && (
                    <span></span>
                  )}
                </div>

                {this.props?.bidderData?.address?.secondaryAddressLine2 && (
                  <div>{this.props?.bidderData?.address?.secondaryAddressLine2}</div>
                )}
                {this.props?.bidderData?.address?.secondaryAddressLine2 && (
                  <div>{this.props?.bidderData?.address?.secondaryAddressLine2}</div>
                )}
                {this.props?.bidderData?.address?.secondaryCity && (
                  <span className={"sr-only"}>
                    <b>City :</b>
                  </span>
                )}
                {this.props?.bidderData?.address?.secondaryCity}
                {this.props?.bidderData?.address?.secondaryCity && (
                  <span>, </span>
                )}
                {this.props?.bidderData?.address?.secondaryStateCode && (
                  <span className={"sr-only"}>
                    <b>State :</b>
                  </span>
                )}
                {this.props?.bidderData?.address?.secondaryStateCode}
                {this.props?.bidderData?.address?.secondaryStateCode && (
                  <span> </span>
                )}
                {this.props?.bidderData?.address?.secondaryZip && (
                  <span className={"sr-only"}>
                    <b>Zip Code :</b>
                  </span>
                )}
                {this.props?.bidderData?.address?.secondaryZip}
                {this.props?.bidderData?.address?.secondaryZip && <br/>}
              </div>
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      </div>
    );
  }
}
