import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";

interface PaymentInquiriesProps {
  propertyData: any;
}

interface PaymentInquiriesState {}

export default class PaymentInquiries extends React.Component<
  PaymentInquiriesProps,
  PaymentInquiriesState
> {
  async componentDidMount() {}
  render() {
    return (
      
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget ppms-sub-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaMapMarkerAlt />}</i> Payment
              Inquiries
            </PPMSCardHeader>
            <PPMSCardBody className={"card-height supporting-details"}>
              <div>
                {this.props?.propertyData?.regionDescription && (
                  <div>
                    <b>Region : </b>
                    {this.props?.propertyData?.regionDescription}
                  </div>
                )}
                {this.props?.propertyData?.address?.addressLine1 && (
                  <div>
                    <b>Address :</b>
                  </div>
                )}
                <div>
                  {this.props?.propertyData?.address?.addressLine1}
                  {this.props?.propertyData?.address?.addressLine1 && (
                    <span></span>
                  )}
                </div>

                {this.props?.propertyData?.address?.addressLine2 && (
                  <div>{this.props?.propertyData?.address?.addressLine2}</div>
                )}
                {this.props?.propertyData?.address?.addressLine3 && (
                  <div>{this.props?.propertyData?.address?.addressLine3}</div>
                )}
                {this.props?.propertyData?.address?.city && (
                  <span className={"sr-only"}>
                    <b>City :</b>
                  </span>
                )}
                {this.props?.propertyData?.address?.city}
                {this.props?.propertyData?.address?.city && <span>, </span>}
                {this.props?.propertyData?.address?.state && (
                  <span className={"sr-only"}>
                    <b>State :</b>
                  </span>
                )}
                {this.props?.propertyData?.address?.state}
                {this.props?.propertyData?.address?.state && <span> </span>}
                {this.props?.propertyData?.address?.zipCode && (
                  <span className={"sr-only"}>
                    <b>Zip Code :</b>
                  </span>
                )}
                {this.props?.propertyData?.address?.zipCode}
                {this.props?.propertyData?.address?.zipCode && <br />}
              </div>
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      
    );
  }
}
