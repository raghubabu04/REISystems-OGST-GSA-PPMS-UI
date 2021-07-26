import React, { useEffect, useState } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { PPMSTextInput } from "../../../../ui-kit/components/common/form/PPMS-text-input";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { AuctionPreviewTile } from "../../preview/AuctionPreviewTile";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { regexForTCNandICN } from "../../../sales/constant/Constants";

interface SearchSaleOrLotProps {
  match?: any;
  roles?: any;
  actions?: any;
}
interface SearchSaleOrLotState {
  searchText: string;
  isLoading: boolean;
  featuredItem: any;
  addedToFeatured: boolean;
  showRemoveModal: boolean;
  itemToBeRemoved: any;
}

class SearchSalesOrLot extends React.Component<
  SearchSaleOrLotProps,
  SearchSaleOrLotState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      searchText: "",
      isLoading: false,
      featuredItem: [],
      addedToFeatured: false,
      showRemoveModal: false,
      itemToBeRemoved: "",
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleFeaturedItem = this.handleFeaturedItem.bind(this);
    this.handleModalRemove = this.handleModalRemove.bind(this);
  }
  private salesAPIService: SalesApiService = new SalesApiService();
  handleSearch() {
    console.log("This is the roles ", this.props.roles);
    const { addToast } = this.props.actions;
    this.setState({
      isLoading: true,
    });

    this.salesAPIService
      .searchSalesOrLot(this.state.searchText)
      .then((response: any) => {
        if(response.data.salesNumber){
          this.setState({
           isLoading: false,
           featuredItem: response.data,
           addedToFeatured: response.data.isAddedToFeaturedItems,
          });
        }
        else{
          addToast({
            text: "No Sales/Lot search result found",
            type: "error",
            heading: "Error",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        addToast({
          text: "No Sales/Lot search result found",
          type: "error",
          heading: "Error",
        });
      });
  }
  handleModalRemove() {
    const { addToast } = this.props.actions;
    this.salesAPIService
      .removeFeaturedItem(this.state?.itemToBeRemoved)
      .then((response) => {
        addToast({
          text: response.data.status,
          type: "success",
          heading: "Success",
        });
        this.setState({
          showRemoveModal: false,
          addedToFeatured: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          showRemoveModal: false,
        });
        addToast({
          text: `Error Removing featured Item`,
          type: "error",
          heading: "Error",
        });
      });
    // this.handleSearch();
  }

  handleFeaturedItem(event) {
    const { addToast } = this.props.actions;
    var data = {};
    if (this.state?.featuredItem?.type === "SALES") {
      data = {
        id: this.state?.featuredItem?.salesId,
        type: "SALES",
        userType:
          this.props.roles.isRAI || this.props.roles.isCOI ? "pbs" : "sls",
      };
    } else {
      data = {
        id: this.state?.featuredItem?.lotId,
        type: "LOT",
        userType:
          this.props.roles.isRAI || this.props.roles.isCOI ? "pbs" : "sls",
      };
    }
    if (this.state?.addedToFeatured === true) {
      this.setState({
        showRemoveModal: true,
        itemToBeRemoved: this.state?.featuredItem?.id,
      });
    } else {
      this.salesAPIService
        .addToFeaturedItems(data)
        .then((response: any) => {
          let resultMap = response.data;
          if (resultMap.isSaved === true) {
            this.setState({
              addedToFeatured: true,
            });
            addToast({
              text: `Sale/Lot added as Featured item Successfully`,
              type: "success",
              heading: "Success",
            });
          } else if (resultMap.isItemsFull === true) {
            addToast({
              text:
                "Featured Items are at maximum capacity. Item could not be added at this time.",
              type: "error",
              heading: "Error",
            });
          } else if (resultMap.isZoneFull === true) {
            addToast({
              text:
                "Your Featured Items are at maximum capacity. Item could not be added at this time.",
              type: "error",
              heading: "Error",
            });
          }
          this.handleSearch();
        })
        .catch((error) => {
          console.log(error);
          addToast({
            text: "Error while saving the item",
            type: "error",
            heading: "Error",
          });
        });
    }
  }

  render() {
    return (
      <div className="ui-ppms">
        <h1>Search and Add Featured Items</h1>
        <div className="grid-conatiner ui-ppms">
          <div className={"grid-row grid-gap-2"}>
            <div className="grid-col-4">
              <PPMSTextInput
                className={"no-margin-top"}
                name={"itemName"}
                placeholder={"Search Sale or Lot"}
                id={"advanced-search-id"}
                type={"text"}
                required={true}
                value={this.state.searchText}
                onChange={(event) => {
                  let value: string = event.target.value
                    .replaceAll(regexForTCNandICN, "")
                    .trim();
                  this.setState({
                    searchText: value,
                  });
                }}
                maxLength={18}
              />
            </div>
            <div className="grid-col-6">
              <PPMSButton
                id={"search"}
                label={"Search"}
                variant={"primary"}
                onPress={this.handleSearch}
              />
            </div>
          </div>
          {this.state.isLoading
            ? null
            : this.state.featuredItem.length !== 0 && (
                <>
                  <br />
                  <div
                    key={this.state.featuredItem.salesNumber}
                    className="item-search-result-wrapper"
                  >
                    <AuctionPreviewTile
                      auction={this.state.featuredItem}
                      listPage={true}
                      isFeaturedList={true}
                      handleFeaturedItem={this.handleFeaturedItem}
                      addedToFeatured={this.state?.addedToFeatured}
                    />
                  </div>
                </>
              )}
        </div>
        <PPMSModal
          show={this.state?.showRemoveModal}
          centered={true}
          backdrop={"static"}
          handleClose={() => {
            this.setState({
              showRemoveModal: false,
            });
          }}
          handleSave={this.handleModalRemove}
          title={"Remove Confirmation"}
          body={"Do you want to remove the Featured Items?"}
          id={"delete-confirmation"}
          label={"Yes"}
          labelCancel={"No"}
        />
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
const mapStateToProps = (state) => ({
  roles: state.authentication.roles,
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchSalesOrLot);
