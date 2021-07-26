import React from "react";
import {PPMSTextEditor} from "../../../../ui-kit/components/common/PPMS-texteditor";
import {ModalActionHistoryContent, validateBidderRemarksNotes} from "./BidderConstants";
import PPMSCardGroup from "../../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../../ui-kit/components/common/card/PPMS-card-body";
import {PPMSButton} from "../../../../ui-kit/components/common/PPMS-button";
import {UserApiService} from "../../../../api-kit/user/user-api.service";

interface BidderRemarksProps {
  bidderRemarksData: any;
  location?: any;
  match: any;
}

interface BidderRemarksState {
  remarks: string;
  remarksIsValid: boolean;
  remarksIsInvalid: boolean;
  remarksErrorMsg: string;
  validationMessage: string;
  isValid: boolean;
  isInvalid: boolean;
  triggerValidation: boolean;
  bidderRemarksData:any;
}

export default class BidderRemarks extends React.Component<BidderRemarksProps,
  BidderRemarksState> {
  targetRef;

  constructor(props: any) {
    super(props);
    this.state = {
      remarks: "",
      remarksIsValid: false,
      remarksIsInvalid: false,
      remarksErrorMsg: "Remarks Notes is Required.",
      validationMessage: "",
      isValid: true,
      isInvalid: false,
      triggerValidation: false,
      bidderRemarksData:[]
    };
    this.targetRef = React.createRef();
  }

  private userApiService: UserApiService = new UserApiService();

  scrollToTarget = () => {
    setTimeout(() => {
      this.targetRef.scrollIntoView({behavior: "smooth"});
    }, 1000);
  };

  handleRemarksDescriptionChange = () => {
    let validation = validateBidderRemarksNotes(this.state.remarks);
    this.setState({
      remarksIsInvalid: validation.isInvalid,
      remarksErrorMsg: validation.validationError,
      remarks: validation.remarksNotes
    });
  }
  clearRemarks = () => {
    this.setState({
      remarks: ""
    })
  }

  saveRemarks = () => {
    const data = {
      notes: this.state.remarks
    }
    this.userApiService.saveBidderRemarks(this.props.match.params.userName, data)
      .then((response: any) => {
        if (response.status === 200) {
          this.userApiService
            .getBidderUser(this.props.match.params.userName)
            .then((response: any) => {
              this.setState({
                remarks: "",
                bidderRemarksData: response?.data?.bidderUser?.bidderNotes
              });
              this.showActionHistoryForRemarks();
        })
      .catch((error) => {
        console.log(error);
        return error;
      });
      }
   })
  }

  showActionHistoryForRemarks = () => {
    if (this.props.bidderRemarksData.length > 0 || this.state.bidderRemarksData.length) {
      return (
        <>
          <br/>
          <ModalActionHistoryContent
            data={this.state.bidderRemarksData.length > this.props.bidderRemarksData.length
              ? this.state.bidderRemarksData : this.props.bidderRemarksData}
            listID={"list-id"}
            title={"testing"}
          />
        </>
      );
    }
  }

  render() {
    return (
      <div
        className="BidderRemarks"
        ref={(ref) => {
          this.targetRef = ref;
        }}
      >
        <PPMSCardGroup
          className={"ppms-card-group ui-ppms"}
          id="bidder-remarks"
        >
          <PPMSCard className={"ppms-widget ppms-sub-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              Remarks (For internal use only)
            </PPMSCardHeader>
            <PPMSCardBody className={"supporting-details"}>
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  <PPMSTextEditor
                    id={"remarksNotes"}
                    value={this.state.remarks}
                    onChange={(notesData: any) => {
                      this.setState({remarks: notesData});
                    }}
                    onBlur={this.handleRemarksDescriptionChange}
                    label={"Remarks"}
                    isInvalid={this.state.remarksIsInvalid}
                    isValid={false}
                    isRequired={false}
                    validationMessage={this.state.remarksErrorMsg}
                    onBlurCheck={true}
                  />
                </div>
              </div>
              <br/>
              <div className={"grid-col-auto"}>
                <PPMSButton
                  variant={"primary"}
                  type={"button"}
                  value={""}
                  label={"Save"}
                  onPress={this.saveRemarks}
                  id={"save-remarks"}
                  isDisabled={this.state.remarks.length === 0}
                />
                <PPMSButton
                  variant={"primary"}
                  type={"reset"}
                  label={"Cancel"}
                  onPress={this.clearRemarks}
                  id={"clear-remarks"}
                  isDisabled={this.state.remarks.length === 0}
                />
              </div>
              {this.showActionHistoryForRemarks()}
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      </div>
    );
  }
}
