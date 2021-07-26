import React from "react";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { FaMapMarkerAlt } from "react-icons/fa";

interface PPMSViewLocProps {
  propertyData: any;
  isNonReportedProperty: boolean;
}

interface PPMSViewLocState {}

export default class PPMSViewLocation extends React.Component<
  PPMSViewLocProps,
  PPMSViewLocState
> {
  async componentDidMount() {}
  render() {
    return (
      <div>
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget ppms-sub-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaMapMarkerAlt />}</i> Property
              Location
            </PPMSCardHeader>
            <PPMSCardBody className={"card-height supporting-details"}>
              <div>
                {this.props?.propertyData?.propertyLocation?.line1 &&
                  !this.props?.isNonReportedProperty && (
                    <div>
                      <b>Address :</b>
                    </div>
                  )}
                {this.props?.isNonReportedProperty && (
                  <div>
                    <b>Address :</b>
                  </div>
                )}
                {this.props?.isNonReportedProperty && (
                  <div>
                    {this.props?.propertyData?.reportingAgencyAddress?.city}
                    {", "}
                    {
                      this.props?.propertyData?.reportingAgencyAddress
                        ?.stateCode
                    }
                  </div>
                )}
                <div>
                  {this.props?.propertyData?.propertyLocation?.line1}
                  {this.props?.propertyData?.propertyLocation?.line1 && (
                    <span></span>
                  )}
                </div>

                {this.props?.propertyData?.propertyLocation?.line2 && (
                  <div>{this.props?.propertyData?.propertyLocation?.line2}</div>
                )}
                {this.props?.propertyData?.propertyLocation?.line3 && (
                  <div>{this.props?.propertyData?.propertyLocation?.line3}</div>
                )}
                {this.props?.propertyData?.propertyLocation?.city && (
                  <span className={"sr-only"}>
                    <b>City :</b>
                  </span>
                )}
                {this.props?.propertyData?.propertyLocation?.city}
                {this.props?.propertyData?.propertyLocation?.city && (
                  <span>, </span>
                )}
                {this.props?.propertyData?.propertyLocation?.stateCode && (
                  <span className={"sr-only"}>
                    <b>State :</b>
                  </span>
                )}
                {this.props?.propertyData?.propertyLocation?.stateCode}
                {this.props?.propertyData?.propertyLocation?.stateCode && (
                  <span> </span>
                )}
                {this.props?.propertyData?.propertyLocation?.zip && (
                  <span className={"sr-only"}>
                    <b>Zip Code :</b>
                  </span>
                )}
                {this.props?.propertyData?.propertyLocation?.zip}
                {this.props?.propertyData?.propertyLocation?.zip && <br />}
              </div>
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      </div>
    );
  }
}
