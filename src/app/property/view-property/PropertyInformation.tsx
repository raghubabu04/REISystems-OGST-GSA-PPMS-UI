import React from "react";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import { CommonApiService } from "../../../api-kit/common/common-api.service";

import PropertyFSCSection from "./PropertyFSCSection";
import moment from "moment";
import { PageUtils } from "../../../utils/PageUtils";
import { condition } from "../create-update-property/constants/Constants";
import { formatDate, formatICN } from "../../../ui-kit/utilities/FormatUtil";
import { FaInfoCircle } from "react-icons/fa";

interface PropertyInformationProps {
  match: any;
  propertyData: any;
  isNonReportedProperty: boolean;
}

interface PropertyInformationState {
  unitOfIssue: any;
  agencyBureau: any;
  conditionCode: any;
  unitIssueList: any;
}

export default class PropertyInformation extends React.Component<
  PropertyInformationProps,
  PropertyInformationState
> {
  private commonAPIService: CommonApiService = new CommonApiService();

  componentDidMount() {
    let unitOfIssueCode = this.props?.propertyData?.unitOfIssue;
    if (unitOfIssueCode) {
      this.commonAPIService
        .getUnitList()
        .then((response) => {
          this.setState({
            unitIssueList: response.data,
          });
          if (unitOfIssueCode) {
            let unitOfIssue = response.data.filter(
              (item) => item.code === unitOfIssueCode
            );
            this.setState({
              unitOfIssue: unitOfIssue.description,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return error;
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

    condition.forEach((item) => {
      if (item.id === this.props?.propertyData?.conditionCode) {
        this.setState({
          conditionCode: item.value,
        });
      }
    });
  }

  shouldComponentUpdate(
    nextProps: Readonly<PropertyInformationProps>,
    nextState: Readonly<PropertyInformationState>
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
      nextProps?.propertyData?.conditionCode !==
      this.props?.propertyData?.conditionCode
    ) {
      condition.forEach((item) => {
        if (item.id === nextProps?.propertyData?.conditionCode) {
          this.setState({
            conditionCode: item.value,
          });
        }
      });
    }

    if (
      nextProps?.propertyData?.unitOfIssue &&
      nextProps?.propertyData?.unitOfIssue !==
        this.props?.propertyData?.unitOfIssue
    ) {
      let unitOfIssueCode = nextProps?.propertyData?.unitOfIssue;
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
    return true;
  }

  render() {
    let todaysDate = moment().startOf("day").format("YYYY-MM-DD").toString();
    let isDropAfterInternalScreeningYes = this.props?.propertyData
      ?.dropAfterInternalScreening
      ? true
      : false;
    let isTodayBeforeErd =
      moment(todaysDate).isBefore(
        this.props?.propertyData?.excessReleaseDate
      ) ||
      moment(todaysDate).isSame(this.props?.propertyData?.excessReleaseDate);

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
                  {this.props.isNonReportedProperty && (
                    <li>
                      <span>
                        <b>Property Action Code:</b>
                      </span>
                      {this.props?.propertyData.actionCode}
                    </li>
                  )}
                  {this.props.isNonReportedProperty && (
                    <li>
                      <span>
                        <b>Source Code:</b>
                      </span>
                      {this.props?.propertyData.sourceCode}
                    </li>
                  )}
                  {!this.props.isNonReportedProperty && (
                    <li>
                      {this.props?.propertyData?.surplusReleaseDate && (
                        <span>
                          <b>Surplus Release Date :</b>
                        </span>
                      )}
                      {formatDate(this.props?.propertyData?.surplusReleaseDate)}
                    </li>
                  )}
                  {formatDate(this.props?.propertyData?.surplusReleaseDate) && (
                    <br />
                  )}
                  <PropertyFSCSection
                    propertyData={this.props?.propertyData}
                    {...this.props}
                  />
                  {this.props?.propertyData?.excessReleaseDate &&
                    !this.props.isNonReportedProperty &&
                    isTodayBeforeErd && (
                      <li>
                        <span>
                          <b>Excess Release Date : </b>
                        </span>
                        {isTodayBeforeErd &&
                          formatDate(
                            this.props?.propertyData?.excessReleaseDate
                          )}
                        {isTodayBeforeErd &&
                          formatDate(
                            this.props?.propertyData?.excessReleaseDate
                          ) && <br />}
                      </li>
                    )}
                  {this.props?.propertyData?.excessReleaseDate &&
                    isTodayBeforeErd &&
                    !this.props.isNonReportedProperty &&
                    isDropAfterInternalScreeningYes && (
                      <li>
                        <span>
                          <b>Drop After Internal Screening :</b>
                        </span>
                        {isTodayBeforeErd &&
                          formatDate(
                            this.props?.propertyData?.excessReleaseDate
                          )}
                        {isTodayBeforeErd &&
                          formatDate(
                            this.props?.propertyData?.excessReleaseDate
                          ) && <br />}
                      </li>
                    )}
                  <li>
                    {this.state?.conditionCode && (
                      <span>
                        <b>Condition :</b>
                      </span>
                    )}
                    {this.state?.conditionCode}
                    {this.state?.conditionCode && <br />}
                  </li>
                  <li>
                    {this.state?.unitOfIssue && this.state?.unitOfIssue && (
                      <span>
                        <b>Unit of Issue :</b>
                      </span>
                    )}
                    {this.state?.unitOfIssue}
                    {this.state?.unitOfIssue && <br />}
                  </li>
                  {this.props?.propertyData?.reimbursementRequiredFlag ===
                    "Y" && (
                    <li>
                      <span>
                        <b>Reimbursement Required :</b>
                      </span>
                      Yes
                    </li>
                  )}
                  {this.props?.propertyData?.reimbursementRequiredFlag ===
                    "Y" && <br />}
                  {this.props?.propertyData?.reimbursementRequiredFlag ===
                    "Y" &&
                    this.props?.propertyData?.fairMarketValue && (
                      <li>
                        <span>
                          <b>Fair Market Value :</b>
                        </span>

                        {this.props?.propertyData?.reimbursementRequiredFlag ===
                          "Y" &&
                          PageUtils.getFormattedCurrency(
                            this.props?.propertyData?.fairMarketValue
                          )}
                        {this.props?.propertyData?.reimbursementRequiredFlag ===
                          "Y" &&
                          this.props?.propertyData?.fairMarketValue && <br />}
                      </li>
                    )}
                  <li>
                    <span>
                      {!this.props.isNonReportedProperty ? (
                        <b>Quantity Available :</b>
                      ) : (
                        <b>Quantity:</b>
                      )}
                    </span>
                    {this.props?.propertyData?.quantity}
                  </li>
                  {!this.props.isNonReportedProperty && (
                    <li>
                      <span>
                        <b>Total Quantity Requested :</b>
                      </span>
                      {this.props?.propertyData?.quantityRequested}
                    </li>
                  )}
                  <li>
                    <span>
                      <b>Original Unit Acquisition Cost :</b>
                    </span>
                    {PageUtils.getFormattedCurrency(
                      this.props?.propertyData?.originalAcquisitionCost
                    )}
                    <br />
                  </li>
                  <li>
                    <span>
                      <b>Total Acquisition Cost :</b>
                    </span>
                    {PageUtils.getFormattedCurrency(
                      this.props?.propertyData?.totalAcquisitionCost
                    )}
                    <br />
                  </li>
                  {this.props?.propertyData?.manufacturer && (
                    <li>
                      <span>
                        <b>Manufacturer :</b>
                      </span>
                      {this.props?.propertyData?.manufacturer}
                      {this.props?.propertyData?.manufacturer && <br />}
                    </li>
                  )}
                  {this.props.isNonReportedProperty &&
                    this.props.propertyData.salesCenter && (
                      <li>
                        <span>
                          <b>Personal Property Center:</b>
                        </span>
                        {this.props.propertyData.salesCenter}
                      </li>
                    )}
                  {this.props.isNonReportedProperty &&
                    this.props.propertyData.propertyStatus && (
                      <li>
                        <span>
                          <b>Status:</b>
                        </span>
                        {this.props.propertyData.propertyStatus.statusName}
                      </li>
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
