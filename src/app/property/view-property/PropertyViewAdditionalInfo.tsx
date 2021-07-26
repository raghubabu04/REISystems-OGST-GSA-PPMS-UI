import React from "react";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import {
  hazardous,
  demilitarization,
  flightSafety,
} from "../create-update-property/constants/Constants";
import { FaInfoCircle } from "react-icons/fa";

interface PPMSViewAdditionalInfoProps {
  match: any;
  propertyData: any;
  isNonReportedProperty: boolean;
}

interface PPMSViewAdditionalInfoState {
  hazardousDisplay: string;
  fscapDisplay: string;
  demilitarizationDisplay: string;
}

export default class PPMSViewAdditionalInfo extends React.Component<
  PPMSViewAdditionalInfoProps,
  PPMSViewAdditionalInfoState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      hazardousDisplay: "",
      fscapDisplay: "",
      demilitarizationDisplay: "",
    };
  }

  componentDidMount() {
    this.setDisplayName();
  }

  componentWillReceiveProps() {
    this.setDisplayName();
  }

  setDisplayName() {
    for (let value of hazardous) {
      if (value.id === this.props?.propertyData?.hazardous) {
        this.setState({
          hazardousDisplay: value.value,
        });
      }
    }
    for (let value of flightSafety) {
      if (value.id === this.props?.propertyData?.fscapCode) {
        this.setState({
          fscapDisplay: value.value,
        });
      }
    }
    for (let value of demilitarization) {
      if (value.id === this.props?.propertyData?.demilitarizationCode) {
        this.setState({
          demilitarizationDisplay: value.value,
        });
      }
    }
  }

  render() {
    return (
      <div className="PPMSViewInfo">
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget ppms-sub-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaInfoCircle />}</i> Additional
              Information
            </PPMSCardHeader>
            <PPMSCardBody className={"supporting-details"}>
              {!this.props.isNonReportedProperty && (
                <ul className={"usa-list"}>
                  <li>
                    <span>
                      <b>Hazardous : </b>
                    </span>
                    {this.state.hazardousDisplay}
                  </li>
                  <br />
                  <li>
                    <span>
                      <b>Flight Safety Critical Aircraft Part :</b>
                    </span>
                    {this.state.fscapDisplay}
                  </li>
                  <br />
                  <li>
                    <span>
                      <b>Demilitarization :</b>
                    </span>
                    {this.state.demilitarizationDisplay}
                  </li>
                  <br />
                </ul>
              )}
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      </div>
    );
  }
}
