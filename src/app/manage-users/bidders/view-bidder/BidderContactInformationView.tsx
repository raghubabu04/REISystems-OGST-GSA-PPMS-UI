import React from "react";
import PPMSCard from "../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardGroup from "../../../../ui-kit/components/common/card/PPMS-card-group";
import {PageUtils} from "../../../../utils/PageUtils";
import {FaAddressCard, FaPhoneAlt} from "react-icons/fa";

interface BidderContactInformationViewProps {
  match: any;
  bidderData: any;
}

interface BidderContactInformationViewState {
  reportingAgency?: string;
  pocFirstName?: string;
  pocLastName?: string;
  pocPhone?: string;
  pocEmail?: string;
}

export default class BidderContactInformationView extends React.Component<BidderContactInformationViewProps,
  BidderContactInformationViewState> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="PPMSViewPOC">
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget ppms-sub-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaAddressCard/>}</i>
              Contact Information
            </PPMSCardHeader>
            <PPMSCardBody className={"card-height supporting-details"}>
              <div>
                {this.props?.bidderData?.dayPhone && (
                  <b>Day Phone :</b>
                )}
                <br/>
                {this.props?.bidderData?.dayPhone && (
                  <span>
                    <i className="fas mr-2">{<FaPhoneAlt/>}</i>
                  </span>
                )}{" "}
                &nbsp;
                {PageUtils.getFormattedPhone(
                  this.props?.bidderData?.dayPhone
                )}{" "}
                {this.props?.bidderData?.dayPhone && <br/>}
                &nbsp;
              </div>
              <br/>
              <div>
                {this.props?.bidderData?.eveningPhone && (
                  <b>Evening Phone :</b>
                )}
                <br/>
                {this.props?.bidderData?.eveningPhone && (
                  <span>
                    <i className="fas mr-2">{<FaPhoneAlt/>}</i>
                  </span>
                )}{" "}
                &nbsp;
                {PageUtils.getFormattedPhone(
                  this.props?.bidderData?.eveningPhone
                )}{" "}
                {this.props?.bidderData?.eveningPhone && <br/>}
                &nbsp;
              </div>
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      </div>
    );
  }
}
