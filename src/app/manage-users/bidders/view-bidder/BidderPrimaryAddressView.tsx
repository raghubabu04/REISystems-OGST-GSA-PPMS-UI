import React from "react";
import PPMSCard from "../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardGroup from "../../../../ui-kit/components/common/card/PPMS-card-group";
import {FaMapMarkerAlt} from "react-icons/fa";

interface BidderPrimaryAddressProps {
  match: any;
  bidderData: any;
}

interface BidderPrimaryAddressState {
}

export default class BidderPrimaryAddressView extends React.Component<BidderPrimaryAddressProps,
  BidderPrimaryAddressState> {
  async componentDidMount() {
  }

  render() {
    return (
      <div>
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget ppms-sub-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaMapMarkerAlt/>}</i> Primary Address
            </PPMSCardHeader>
            <PPMSCardBody className={"card-height supporting-details"}>
              <div>
                {this.props?.bidderData?.address?.addressLine1 &&
                (
                  <div>
                    <b>Address :</b>
                  </div>
                )}
                <div>
                  {this.props?.bidderData?.address?.addressLine1}
                  {this.props?.bidderData?.address?.addressLine1 && (
                    <span></span>
                  )}
                </div>

                {this.props?.bidderData?.address?.addressLine2 && (
                  <div>{this.props?.bidderData?.address?.addressLine2}</div>
                )}
                {this.props?.bidderData?.address?.addressLine3 && (
                  <div>{this.props?.bidderData?.address?.addressLine3}</div>
                )}
                {this.props?.bidderData?.address?.city && (
                  <span className={"sr-only"}>
                    <b>City :</b>
                  </span>
                )}
                {this.props?.bidderData?.address?.city}
                {this.props?.bidderData?.address?.city && (
                  <span>, </span>
                )}
                {this.props?.bidderData?.address?.stateCode && (
                  <span className={"sr-only"}>
                    <b>State :</b>
                  </span>
                )}
                {this.props?.bidderData?.address?.stateCode}
                {this.props?.bidderData?.address?.stateCode && (
                  <span> </span>
                )}
                {this.props?.bidderData?.address?.zip && (
                  <span className={"sr-only"}>
                    <b>Zip Code :</b>
                  </span>
                )}
                {this.props?.bidderData?.address?.zip}
                {this.props?.bidderData?.address?.zip && <br/>}
              </div>
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      </div>
    );
  }
}
