import React from "react";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { PageUtils } from "../../../utils/PageUtils";
import { FaPhoneAlt, FaEnvelope, FaAddressCard } from "react-icons/fa";
import { PropertyGroupType } from "../create-update-property/constants/Constants";
import PaymentInquiries from "./PaymentInquiriesView";

interface PPMSViewPOCProps {
  propertyData: any;
}

interface PPMSViewPOCState {
  reportingAgency?: string;
  pocFirstName?: string;
  pocLastName?: string;
  pocPhone?: string;
  pocEmail?: string;
}

export default class PPMSViewPOC extends React.Component<
  PPMSViewPOCProps,
  PPMSViewPOCState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      reportingAgency: "",
    };
  }
  private commonService = new CommonApiService();
  componentDidMount() {
    const data = {
      params: {
        agencyCode: this.props?.propertyData?.aacId,
      },
    };
    if (data?.params?.agencyCode) {
      this.commonService.getBureau(data).then((response: any) => {
        this.setState({
          reportingAgency: response?.data?.longName,
        });
      });
    }
  }

  shouldComponentUpdate(
    nextProps: Readonly<PPMSViewPOCProps>,
    nextState: Readonly<PPMSViewPOCState>,
    nextContext: any
  ): boolean {
    if (nextProps?.propertyData?.aacId !== this.props?.propertyData?.aacId) {
      const data = {
        params: {
          agencyCode: nextProps?.propertyData?.aacId,
        },
      };
      this.commonService.getBureau(data).then((response: any) => {
        this.setState({
          reportingAgency: response?.data?.longName,
        });
      });
    }

    return true;
  }

  render() {
    return (

        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget ppms-sub-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaAddressCard />} </i>
              {this.props?.propertyData?.propertyGroup ===
              PropertyGroupType.FOREIGN_GIFT
                ? "GSA Point of Contact"
                : "Point of Contact"}
              {/* Point of Contact */}
            </PPMSCardHeader>
            <PPMSCardBody className={"card-height supporting-details"}>
              {this.props?.propertyData?.saleLotNumber && (
                <span>For questions related to contractual issues, contact the following GSA Sales Representative:</span>
              )}
              <div>

                {(this.props?.propertyData?.propertyPOC?.firstName ||
                  this.props?.propertyData?.propertyPOC?.lastName ||
                  this.props?.propertyData?.propertyPOC?.email) && (
                  <div>
                    <b>Contact :</b>
                  </div>
                )}
                {this.props?.propertyData?.propertyPOC?.firstName}{" "}
                {this.props?.propertyData?.propertyPOC?.lastName}
                {(this.props?.propertyData?.propertyPOC?.firstName ||
                  this.props?.propertyData?.propertyPOC?.lastName) && <br />}
                {this.props?.propertyData?.propertyPOC?.phone && (
                  <span>
                    <i className="fas mr-2">{<FaPhoneAlt />}</i>
                  </span>
                )}{" "}
                &nbsp;
                {PageUtils.getFormattedPhone(
                  this.props?.propertyData?.propertyPOC?.phone
                )}{" "}
                {this.props?.propertyData?.propertyPOC?.phone && <br />}
                {this.props?.propertyData?.propertyPOC?.email && (
                  <span>
                    <i className="fas mr-2">{<FaEnvelope />}</i>
                  </span>
                )}
                &nbsp;
                <a
                  href={
                    "mailto:" + this.props?.propertyData?.propertyPOC?.email
                  }
                >
                  {this.props?.propertyData?.propertyPOC?.email}
                </a>
                <br />
                {this.props?.propertyData?.propertyPOC?.ccEmail && (
                  <span>
                    <b>CC Email Address :</b>
                  </span>
                )}
                <a
                  href={
                    "mailto:" + this.props?.propertyData?.propertyPOC?.ccEmail
                  }
                  title={"Mail to Property POC"}
                >
                  {this.props?.propertyData?.propertyPOC?.ccEmail}
                </a>
              </div>
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>

    );
  }
}
