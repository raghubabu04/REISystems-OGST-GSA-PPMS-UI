/**@jsx jsx */
import React from "react";
import {PPMSButton} from "../../../../ui-kit/components/common/PPMS-button";
import {connect} from "react-redux";
import {jsx} from "@emotion/core";
import {PPMSModal} from "../../../../ui-kit/components/common/PPMS-modal";
import {PPMSActionList} from "../../../../ui-kit/components/PPMS-action-list";
import BidderInformationView from "./BidderInformationView";
import BidderPhysicalAddressView from "./BidderPhysicalAddressView";
import BidderPrimaryAddressView from "./BidderPrimaryAddressView";
import BidderContactInformationView from "./BidderContactInformationView";
import {UserApiService} from "../../../../api-kit/user/user-api.service";
import {bindActionCreators} from "redux";
import {addToast} from "../../../../_redux/_actions/toast.actions";
import BidderRemarks from "./BidderRemarks";
import BidderPurchaseHistory from "./BidderPurchaseHistory";

interface BidderViewProps {
  match: any;
  roles?: any;
  getPriorityCodes: any;
  priorityCodes?: any[];
}

interface BidderViewState {
  bidderData: any;
  userData: any;
  showActionHistoryModal: boolean;
  showAddToCartModal: boolean;
  actionHistoryData: any;
  emailAddress: any;
  bidderPurchaseHistoryData: any;
  bidderRemarksData: any;
}

class BidderView extends React.Component<BidderViewProps, BidderViewState> {
  constructor(props: any) {
    super(props);
    this.state = {
      bidderData: "",
      userData: "",
      showActionHistoryModal: false,
      showAddToCartModal: false,
      actionHistoryData: [],
      emailAddress: "",
      bidderPurchaseHistoryData: {},
      bidderRemarksData: []
    };
  }

  private userAPIService: UserApiService = new UserApiService();

  componentDidMount() {
    this.userAPIService
      .getBidderUser(this.props.match.params.userName)
      .then((response: any) => {
        this.setState({
          bidderData: response.data.bidderUser,
          userData: response.data,
          emailAddress: response.data.emailAddress,
          bidderRemarksData: response?.data?.bidderUser?.bidderNotes
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  handleActionHistory = () => {
    const data = {
      params: {
        objectType: "BIDDERS",
        objectId: this.props.match.params.userName,
      },
    };
    this.userAPIService
      .getActionHistoryForUserObject(data)
      .then((response: any) => {
        this.setState({
          actionHistoryData: response.data,
          showActionHistoryModal: true,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  handleClose = () => {
    this.setState({
      showActionHistoryModal: false,
    });
  };

  render() {
    return (
      <div className={"ui-ppms"}>
        <div className={""}>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <div className={"container"}>
                <div className="item-search-result">
                  <h1>Bidder Information</h1>
                </div>
              </div>
            </div>
          </div>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <div className="grid-row tablet:grid-gap-2  ">
                <div className={"grid-col cart-row cart-tray"}></div>
                <div className="grid-col-3 flex-top-tray">
                  <PPMSButton
                    className={"out-button"}
                    type={"button"}
                    value={""}
                    label={"Action History"}
                    onPress={this.handleActionHistory}
                    id={"action-history"}
                  />
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className={"grid-row grid-gap-4 "}>
            <div className={"grid-col-12 ppms-details-container"}>
              <BidderInformationView
                bidderData={this.state?.bidderData}
                userData={this.state?.userData}
                emailAddress={this.state?.emailAddress}
                {...this.props}
              />
              <br />
            </div>
          </div>

          <div className={"grid-row ppms-details-container  grid-gap-4"}>
            <div className={"grid-col-4"}>
              <BidderPrimaryAddressView
                bidderData={this.state?.bidderData}
                {...this.props}
              />
            </div>
            {this.state?.bidderData?.address?.isAddressPoBox && (
              <div className={"grid-col-4"}>
                <BidderPhysicalAddressView
                  bidderData={this.state?.bidderData}
                  {...this.props}
                />
              </div>
            )}
            <div className={"grid-col-4"}>
              <BidderContactInformationView
                bidderData={this.state?.bidderData}
                {...this.props}
              />
            </div>
            <div className={"grid-col-12"}>
              <BidderPurchaseHistory
                bidderPurchaseHistoryData={this.state?.bidderPurchaseHistoryData}
                {...this.props}
              />
            </div>
            <div className={"grid-col-12"}>
              <BidderRemarks
                bidderRemarksData={this.state?.bidderRemarksData}
                {...this.props}
              />
            </div>
          </div>
        </div>

        <div className="grid-row grid-gap-4">
          <PPMSModal
            body={
              <ModalActionHistoryContent
                data={this.state.actionHistoryData}
                listID={"list-id"}
                title={this.props.match.params.userId}
              />
            }
            id={"show-action-history-view"}
            show={this.state.showActionHistoryModal}
            handleClose={this.handleClose}
            handleSave={""}
            title={
              "Action History for Bidder User: " +
              this.props.match.params.userName
            }
            centered={true}
            backdrop={"static"}
            label={"Ok"}
            hideLabelCancel={true}
            hideLabel={this.state.showActionHistoryModal ? true : false}
            size={this.state.showActionHistoryModal ? "lg" : null}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const ModalActionHistoryContent = ({ data, listID, title }) => {
  return (
    <div className={"action-history-container"}>
      <PPMSActionList data={data} listID={listID} title={title} />
    </div>
  );
};

export default connect(null, mapDispatchToProps)(BidderView);
