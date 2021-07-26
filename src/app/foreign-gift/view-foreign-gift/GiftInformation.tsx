import React from "react";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import { CommonApiService } from "../../../api-kit/common/common-api.service";

import PropertyFSCSection from "../../property/view-property/PropertyFSCSection";
import { PageUtils } from "../../../utils/PageUtils";
import { formatDate, formatICN } from "../../../ui-kit/utilities/FormatUtil";
import { FaInfoCircle } from "react-icons/fa";

interface GiftInformationProps {
  match: any;
  propertyData: any;
  isNonReportedProperty: boolean;
}

interface GiftInformationState {
  unitOfIssue: any;
  agencyBureau: any;
  unitIssueList: any;
  countryList: any;
  country: any;
}

export default class GiftInformation extends React.Component<
  GiftInformationProps,
  GiftInformationState
> {
  private commonAPIService: CommonApiService = new CommonApiService();

  componentDidMount() {
    let unitOfIssueCode = this.props?.propertyData?.giftInfo?.unitOfIssue;
    if (unitOfIssueCode) {
      this.commonAPIService
        .getUnitList()
        .then((response) => {
          this.setState({
            unitIssueList: response.data,
          });
          let unitOfIssue = response.data.filter(
            (item) => item.code === unitOfIssueCode
          );
          this.setState({
            unitOfIssue: unitOfIssue.description,
          });
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }

    let countryCode = this.props?.propertyData?.donorInfo?.countryCode;
    if (countryCode) {
      this.commonAPIService.getCountryList().then((response) => {
        this.setState({
          countryList: response.data,
        });
        let country = response.data.filter(
          (item) => item.countryCode === countryCode
        );
        this.setState({
          country: country[0].countryName,
        });
      });
    }

    if (this.props?.propertyData?.aacId) {
      const data = {
        params: {
          agencyCode: this.props?.propertyData?.aacId,
        },
      };
      this.commonAPIService
        .getBureau(data)
        .then((response: any) => {
          this.setState({
            agencyBureau: response?.code + " - " + response?.longName,
          });
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }
  }

  shouldComponentUpdate(
    nextProps: Readonly<GiftInformationProps>,
    nextState: Readonly<GiftInformationState>
  ): boolean {
    if (
      nextProps?.propertyData?.aacId &&
      nextProps?.propertyData?.aacId !== this.props?.propertyData?.aacId
    ) {
      const data = {
        params: {
          agencyCode: nextProps?.propertyData?.aacId,
        },
      };
      this.commonAPIService
        .getBureau(data)
        .then((response: any) => {
          this.setState({
            agencyBureau:
              response?.data?.code + " - " + response?.data?.longName,
          });
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }

    if (
      nextProps?.propertyData?.giftInfo?.unitOfIssue &&
      nextProps?.propertyData?.giftInfo?.unitOfIssue !==
        this.props?.propertyData?.giftInfo?.unitOfIssue
    ) {
      let unitOfIssueCode = nextProps?.propertyData?.giftInfo?.unitOfIssue;
      this.commonAPIService
        .getUnitList()
        .then((response) => {
          if (unitOfIssueCode) {
            let unitOfIssue = response.data.filter(
              (item) => item.code === unitOfIssueCode
            );
            this.setState({
              unitOfIssue: unitOfIssue[0].description,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }

    if (
      nextProps?.propertyData?.donorInfo?.countryCode &&
      nextProps?.propertyData?.donorInfo?.countryCode !==
        this.props?.propertyData?.donorInfo?.countryCode
    ) {
      let countryCode = nextProps?.propertyData?.donorInfo?.countryCode;
      this.commonAPIService
        .getCountryList()
        .then((response) => {
          if (countryCode) {
            let country = response.data.filter(
              (item) => item.countryCode === countryCode
            );
            this.setState({
              country: country[0].countryName,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }

    return true;
  }

  render() {
    return (
      <div className="PPMSViewInfo text-adjustment">
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaInfoCircle />}</i> Property
              Information
            </PPMSCardHeader>
            <PPMSCardBody className={"card-height"}>
              <div>
                <ul className={"usa-list ui-shade"}>
                  <li>
                    <span>
                      <b>Item Name : </b>{" "}
                    </span>
                    {this.props?.propertyData?.itemName}
                  </li>
                  <li>
                    <span>
                      <b> Item Control Number :</b>
                    </span>
                    {formatICN(this.props?.propertyData?.itemControlNumber)}
                  </li>

                  <li>
                    {this.state?.agencyBureau && (
                      <span>
                        <b>Agency Bureau :</b>
                      </span>
                    )}
                    {this.state?.agencyBureau}
                    {this.state?.agencyBureau && <br />}
                  </li>
                </ul>
                {!this.props.isNonReportedProperty ? (
                  <div className="product-description">
                    {this.props?.propertyData?.propertyDescription && (
                      <span>
                        <b>Item Description :</b>
                      </span>
                    )}

                    <Description
                      content={this?.props.propertyData?.propertyDescription}
                    />
                    {this.props?.propertyData?.propertyDescription && <br />}
                  </div>
                ) : (
                  <div></div>
                )}
                <ul className={"usa-list"}>
                  <li>
                    <span>
                      <b>Administration:</b>
                    </span>
                    {this.props?.propertyData?.giftInfo?.administration}
                  </li>
                  <li>
                    <span>
                      <b>Donor Country:</b>
                    </span>
                    {this.state?.country}
                    {this.state?.country && <br />}
                    {/* {this.props?.propertyData?.donorInfo?.countryCode} */}
                  </li>
                  <li>
                    <span>
                      <b>Donor Name:</b>
                    </span>
                    {this.props?.propertyData?.donorInfo?.firstName +
                      " " +
                      this.props?.propertyData?.donorInfo?.lastName}
                  </li>
                  <li>
                    <span>
                      <b>Recipient Name:</b>
                    </span>
                    {this.props?.propertyData?.recipientInfo?.firstName +
                      " " +
                      this.props?.propertyData?.recipientInfo?.lastName}
                  </li>
                  <li>
                    <span>
                      <b>Status:</b>
                    </span>
                    {this.props?.propertyData?.propertyStatus?.statusName}
                  </li>
                  <li>
                    <span>
                      <b>Date Reported:</b>
                    </span>
                    {formatDate(this.props?.propertyData?.submittedDate)}
                  </li>

                  <PropertyFSCSection
                    propertyData={this.props?.propertyData}
                    {...this.props}
                  />

                  <li>
                    <span>
                      <b>Vault Location:</b>
                    </span>
                    {this.props?.propertyData?.giftInfo?.vaultLocation +
                      " - " +
                      this.props?.propertyData?.giftInfo?.vaultShelfNumber}
                  </li>

                  <li>
                    <span>
                      <b>Fiscal Year:</b>
                    </span>
                    {`FY ${this.props?.propertyData?.giftInfo?.fiscalYear}`}
                  </li>
                  <li>
                    {this.state?.unitOfIssue && (
                      <span>
                        <b>Unit of Issue :</b>
                      </span>
                    )}
                    {this.state?.unitOfIssue}
                    {this.state?.unitOfIssue && <br />}
                  </li>
                  <li>
                    <span>
                      <b>Fair Market Value:</b>
                    </span>
                    {PageUtils.getFormattedCurrency(
                      this.props?.propertyData?.giftInfo?.fairMarketValue
                    )}
                  </li>
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
