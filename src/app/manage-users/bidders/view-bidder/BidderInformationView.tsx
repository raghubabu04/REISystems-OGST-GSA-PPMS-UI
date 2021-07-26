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
  match: any;
  bidderData: any;
  userData: any;
  emailAddress: any;
}

interface BidderInformationState {}

export default class BidderInformationView extends React.Component<
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
                  {this.props?.bidderData ? (
                    <>
                      {" "}
                      <li>
                        <span>
                          <b>User Name : </b>{" "}
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
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                  {this.props?.bidderData ? (
                    <>
                      {" "}
                      <li>
                        <span>
                          <b> Registration Type :</b>
                        </span>
                        {this.props?.bidderData?.registrationType
                          ?.registrationType === "COMPANY"
                          ? "Company"
                          : "Individual"}
                      </li>
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                  {this.props?.bidderData?.address ? (
                    <>
                      {" "}
                      <li>
                        <span>
                          <b>Country of Residence:</b>
                        </span>
                        {this.props?.bidderData?.address?.countryCode}
                      </li>
                    </>
                  ) : (
                    <></>
                  )}
                </ul>
                <ul className={"usa-list"}>
                  {this.props?.bidderData ? (
                    <>
                      {" "}
                      <li>
                        <span>
                          <b>Bidder Name : </b>{" "}
                        </span>
                        {this.props?.userData?.firstName}{" "}
                        {this.props?.userData?.middleName}{" "}
                        {this.props?.userData?.lastName}
                      </li>
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                  {this.props ? (
                    <>
                      {" "}
                      <li>
                        <span>
                          <b>Email Address :</b>
                        </span>
                        {this.props?.emailAddress}
                      </li>
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                  {this.props?.bidderData ? (
                    <>
                      {" "}
                      <li>
                        <span>
                          <b>Citizen of the United States of America:</b>
                        </span>
                        {this.props?.bidderData?.usCitizen === true
                          ? "Yes"
                          : "No"}
                      </li>
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                  {this.props?.bidderData?.dateOfBirth ? (
                    <>
                      {" "}
                      <li>
                        <span>
                          <b>Date of Birth :</b>
                        </span>
                        {formatDate(this.props?.bidderData?.dateOfBirth)}
                      </li>
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                  {this.props?.bidderData?.socialSecurity ? (
                    <>
                      {" "}
                      <li>
                        <span>
                          <b>Social Security Number :</b>
                        </span>
                        {this.props?.bidderData?.socialSecurity}
                      </li>
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                  {this.props?.bidderData?.einNumber ? (
                    <>
                      {" "}
                      <li>
                        <span>
                          <b>Employee Identification Number :</b>
                        </span>
                        {this.props?.bidderData?.einNumber}
                      </li>
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                  {this.props?.bidderData?.notifyAuctionWin === true &&
                  this.props?.bidderData?.notifyItemOutbid === true ? (
                    <>
                      {" "}
                      <li>
                        <span>
                          <b>Notify Preferences :</b>
                        </span>
                        {this.props?.bidderData?.notifyAuctionWin === true
                          ? "Notify me when I don't win an auction"
                          : " "}
                        <br />
                        {this.props?.bidderData?.notifyItemOutbid === true
                          ? "Notify me when I am outbid for an item"
                          : " "}
                      </li>
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                </ul>{" "}
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
