import React from "react";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { PageUtils } from "../../../utils/PageUtils";
import { FaPhoneAlt, FaEnvelope, FaUserTag } from "react-icons/fa";
import { CommonApiService } from "../../../api-kit/common/common-api.service";

interface PPMSViewCustodianProps {
  propertyData: any;
  label?: any;
}

interface PPMSViewCustodianState {
  reportingAgency?: string;
}

export default class PPMSViewCustodian extends React.Component<
  PPMSViewCustodianProps,
  PPMSViewCustodianState
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
    nextProps: Readonly<PPMSViewCustodianProps>,
    nextState: Readonly<PPMSViewCustodianState>,
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
      <div className="PPMSViewCustodian">
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget ppms-sub-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaUserTag />} </i>
              {this.props?.label ? this.props.label : "Property Custodian"}
            </PPMSCardHeader>
            <PPMSCardBody className={"card-height supporting-details"}>
              {this.props?.propertyData?.saleLotNumber && (
                <span> For questions regarding the property, inspection, and removal, contact the following Property Custodian: </span> 
              )}
              <div>
              {this.state.reportingAgency && (
                  <>
                    <div>
                      <b>Reporting Agency :</b>
                    </div>
                    {this.state.reportingAgency}
                    <br />
                  </>
                )}
                {(this.props?.propertyData?.propertyCustodian?.firstName ||
                  this.props?.propertyData?.propertyCustodian?.lastName) && (
                  <div>
                    <b>Name :</b>
                  </div>
                )}
                {this.props?.propertyData?.propertyCustodian?.firstName}{" "}
                {this.props?.propertyData?.propertyCustodian?.lastName} <br />
                {this.props?.propertyData?.propertyCustodian?.phone && (
                  <span>
                    <i className="fas mr-2">{<FaPhoneAlt />}</i>
                  </span>
                )}{" "}
                &nbsp;
                {PageUtils.getFormattedPhone(
                  this.props?.propertyData?.propertyCustodian?.phone
                )}{" "}
                <br />
                {this.props?.propertyData?.propertyCustodian?.email && (
                  <span>
                    <i className="fas mr-2">{<FaEnvelope />}</i>
                  </span>
                )}
                &nbsp;
                <a
                  href={
                    "mailto:" +
                    this.props?.propertyData?.propertyCustodian?.email
                  }
                >
                  {this.props?.propertyData?.propertyCustodian?.email}
                </a>
                <br />
                {this.props?.propertyData?.propertyCustodian?.ccEmail && (
                  <span>
                    <b>CC Email Address :</b>
                  </span>
                )}
                <a
                  href={
                    "mailto:" +
                    this.props?.propertyData?.propertyCustodian?.ccEmail
                  }
                >
                  {this.props?.propertyData?.propertyCustodian?.ccEmail}
                </a>
              </div>
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      </div>
    );
  }
}
