import React, {useEffect, useState} from "react";
import {SalesApiService} from "../../../api-kit/sales/sales-api-service";
import PPMSPagination from "../../../ui-kit/components/common/pagination/PPMS-pagination";
import {FavoritesListTile} from "./FavoritesListTile";
import {UserUtils} from "../../../utils/UserUtils";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {addToast} from "../../../_redux/_actions/toast.actions";
import {AuctionsApiService} from "../../../api-kit/auctions/auctions-api-service";

export interface FavoritesListProps {
  location?: any;
  router?: any;
  actions?: any;
  pbsFSCCodes?: any;
}

function FavoritesList(props: FavoritesListProps) {
  const [page, setPage] = useState<number>(1);

  const [totalRows, setTotalRows] = useState<number>(0);

  const [rowsPerPage, setRowsPerPage] = useState<number>(50);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const salesApiService = new SalesApiService();

  const [myFavorites, setMyFavorites] = useState<Array<any>>([]);
  let auctionsAPIService = new AuctionsApiService();

  const getMyFavorites = async (data: any) => {
    const { addToast } = props.actions;
    setIsLoading(true);
    let myFavorite = [];
    let totalRow = 0;
    let favoritesLength = 0;
    await salesApiService
      .getMyFavorites(data)
      .then((apiResponse) => {
        myFavorite =
          apiResponse && apiResponse.data && apiResponse.data.favoritesDTOList
            ? apiResponse.data.favoritesDTOList
            : [];
        totalRow =
          apiResponse && apiResponse.data && apiResponse.data.totalElements
            ? apiResponse.data.totalElements
            : 0;
        favoritesLength = myFavorite?.length;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });

    if (favoritesLength === 0) {
      setRowsPerPage(rowsPerPage);
    }
    setMyFavorites(myFavorite);
    setCurrentPage(1);
    setTotalRows(totalRow);
    setIsLoading(false);
  };

  useEffect(() => {
    const data = {
      params: {
        page: page,
        size: rowsPerPage,
      },
    };
    if (UserUtils.getUserTypeFromToken() === "BIDDERS") {
      getMyFavorites(data);
    }
  }, [page, rowsPerPage]);

  const handleAllocationsPageChange = async (
    page?: number | undefined,
    rowsPerPage?: number | undefined
  ) => {
    const data = {
      params: {
        page: page ? page : 1,
        size: rowsPerPage ? rowsPerPage : 50,
      },
    };
    getMyFavorites(data);
  };

  const handleBuyNow = (auctionId) => {
    auctionsAPIService
      .buyNow(auctionId)
      .then(() => {
        const data = {
          params: {
            page: page,
            size: rowsPerPage,
          },
        };
        getMyFavorites(data);
        addToast({
          text: `Item bought successfully.`,
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.error(error);
        addToast({
          text: `Error buying item.`,
          type: "error",
          heading: "Error",
        });
      });
  };

  const handlePlaceBid = (value, bidType, auctionId) => {
    let bidTypeCheck =
      bidType === "Flat Bid" ? "F" : bidType === "Automatic Bid" ? "A" : null;
    let data = {
      bidAmount: value,
      bidType: bidTypeCheck,
    };
    const { addToast } = props.actions;
    auctionsAPIService
      .placeBid(data, auctionId)
      .then((response) => {
        addToast({
          text: `Bid Placed Successfully.`,
          type: "success",
          heading: "success",
        });
      })
      .catch((error) => {
        console.log(error);
        addToast({
          text: `Error placing bid.`,
          type: "error",
          heading: "Error",
        });
      });
  };

  return (
    <div className="ui-ppms">
      <h1>My Favorites</h1>
      <div className="grid-conatiner ui-ppms">
        <div className="grid-row grid-gap-4">
          <div className="desktop:grid-col-12 usa-layout-docs__main">
            <div className="grid-conatiner">
              <div className="grid-row grid-gap-4">
                <div className="grid-col-12">
                  <div className="item-search-result">
                    {totalRows !== 0 && (
                      <PPMSPagination
                        page={1}
                        pageSize={rowsPerPage}
                        totalRows={totalRows}
                        onChangePage={(
                          currentPage: number | undefined,
                          rowsPerPage: number | undefined
                        ) => {
                          handleAllocationsPageChange(currentPage, rowsPerPage);
                        }}
                      />
                    )}
                  </div>
                  {isLoading
                    ? null
                    : myFavorites.map((item) => {
                        return (
                          <div
                            key={item.saleNumber}
                            className="item-search-result-wrapper"
                          >
                            <FavoritesListTile
                              favorites={item}
                              listPage={true}
                              handleBuyNow={handleBuyNow}
                              handlePlaceBid={handlePlaceBid}
                              pbsFSCCodes={props.pbsFSCCodes}
                            />
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
  pbsFSCCodes: state.common.pbsFSCCodes,
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesList);
