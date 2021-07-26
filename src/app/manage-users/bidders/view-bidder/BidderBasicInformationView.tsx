import React from "react";
import PPMSCardGroup from "../../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../../ui-kit/components/common/card/PPMS-card-body";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { FaInfoCircle } from "react-icons/fa";
import { formatDate } from "../../../../ui-kit/utilities/FormatUtil";
import { Paths } from "../../../Router";

interface BidderInformationProps {
  match?: any;
  bidderData: any;
  userData: any;
  emailAddress: any;
}

interface BidderInformationState {}

export default class BidderBasicInformationView extends React.Component<
  BidderInformationProps,
  BidderInformationState
> {
  render() {
    return (
      <div className="PPMSViewInfo text-adjustment">
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaInfoCircle />}</i> Bidder
              Information
            </PPMSCardHeader>
            <PPMSCardBody>
              <div>
                <ul className={"usa-list ui-shade"}>
                  <>
                    <li>
                      <span>
                        <b>User Name : </b>
                      </span>
                      <a
                        href={
                          Paths.viewBidder +
                          "/" +
                          this.props?.bidderData?.userName
                        }
                      >
                        {this.props?.bidderData?.userName
                          ? this.props?.bidderData?.userName
                          : "-"}
                      </a>
                    </li>
                    <li>
                      <span>
                        <b>Bidder Name : </b>
                      </span>
                      {this.props?.userData?.firstName}
                      {this.props?.userData?.middleName}
                      {this.props?.userData?.lastName}
                    </li>
                    <li>
                      <span>
                        <b>Email Address :</b>
                      </span>
                      {this.props?.emailAddress}
                    </li>
                  </>
                </ul>
              </div>
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      </div>
    );
  }
}

const Description = (props) => (
  <div dangerouslySetInnerHTML={{ __html: props.content }} />
);
