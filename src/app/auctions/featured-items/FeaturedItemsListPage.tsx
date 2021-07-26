import React, { useState, useEffect } from "react";
import { PPMSPagination } from "../../../ui-kit/components/common/pagination/PPMS-pagination";
import { SalesApiService } from "../../../api-kit/sales/sales-api-service";
import { AuctionPreviewTile } from "../preview/AuctionPreviewTile";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PageHelper, Paths } from "../../Router";
import { UserUtils } from "../../../utils/UserUtils";

export interface FeaturedListProps {
  location?: any;
  router?: any;
  actions?: any;
}

const FeaturedItemsList = (props: FeaturedListProps) => {
  const [totalRows, setTotalRows] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    UserUtils.getUserRoles().includes("RAI") ||
      UserUtils.getUserRoles().includes("COI")
      ? 10
      : 5
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [featured, setFeatured] = useState<Array<any>>([]);
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const [itemToBeRemoved, setItemToRemoved] = useState<any>();

  const salesApiService = new SalesApiService();

  const [page, setPage] = useState<number>(1);

  const getFeaturedItems = async (data: any) => {
    //setIsLoading(true);
    let result = [];
    let totalRow = 0;
    if (
      UserUtils.getUserRoles().includes("RAI") ||
      UserUtils.getUserRoles().includes("COI")
    ) {
      await salesApiService
        .getPBSFeaturedItems(data)
        .then((apiResponse) => {
          result =
            apiResponse &&
            apiResponse.data &&
            apiResponse.data.featuredItemDTOList
              ? apiResponse.data.featuredItemDTOList
              : [];
          totalRow =
            apiResponse && apiResponse.data && apiResponse.data.totalElements
              ? apiResponse.data.totalElements
              : 0;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    } else {
      await salesApiService
        .getFeaturedItems(data)
        .then((apiResponse) => {
          result =
            apiResponse &&
            apiResponse.data &&
            apiResponse.data.featuredItemDTOList
              ? apiResponse.data.featuredItemDTOList
              : [];
          totalRow =
            apiResponse && apiResponse.data && apiResponse.data.totalElements
              ? apiResponse.data.totalElements
              : 0;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }
    setFeatured(result);
    setCurrentPage(1);
    setTotalRows(totalRow);
    setIsLoading(false);
  };

  const handlePageChange = async (
    page?: number | undefined,
    rowsPerPage?: number | undefined
  ) => {
    const data = {
      params: {
        page: page ? page : 1,
        size: rowsPerPage ? rowsPerPage : 50,
      },
    };
    setIsLoading(true);
    getFeaturedItems(data);
  };

  const handleModalClose = () => {
    setShowRemoveModal(false);
  };

  function handleModalRemove() {
    const { addToast } = props.actions;

    salesApiService
      .removeFeaturedItem(itemToBeRemoved)
      .then((response) => {
        addToast({
          text: response.data.status,
          type: "success",
          heading: "Success",
        });
        setShowRemoveModal(false);
        const data = {
          params: {
            page: page ? page : 1,
            size: rowsPerPage ? rowsPerPage : 50,
          },
        };
        getFeaturedItems(data);
      })
      .catch((error) => {
        console.log(error);
        setShowRemoveModal(false);
        addToast({
          text: `Error Removing featured Item`,
          type: "error",
          heading: "Error",
        });
      });
  }

  useEffect(() => {
    const data = {
      params: {
        page: page,
        size: rowsPerPage,
      },
    };
    setIsLoading(true);
    getFeaturedItems(data);
  }, [page, rowsPerPage]);
  return (
    <div className="ui-ppms">
      <div className="grid-conatiner">
        <div className="grid-row ">
          <div className="grid-col-6">
            <h1>My Featured Items</h1>
          </div>
          <div className="grid-col-6 align-self-center">
            <PPMSButton
              id="search-add"
              label="Search or Add Feature Items"
              className={"create-property out-button"}
              onPress={() => {
                PageHelper.openPage(Paths.searchSaleOrLot);
              }}
            ></PPMSButton>
          </div>
        </div>
      </div>

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
                          handlePageChange(currentPage, rowsPerPage);
                        }}
                      />
                    )}
                  </div>
                  {isLoading
                    ? null
                    : featured.map((item) => {
                        return (
                          <div
                            key={item.saleNumber}
                            className="item-search-result-wrapper"
                          >
                            <AuctionPreviewTile
                              auction={item}
                              listPage={true}
                              isFeaturedList={true}
                              addedToFeatured={true}
                              handleFeaturedItem={() => {
                                setShowRemoveModal(true);
                                setItemToRemoved(item.id);
                              }}
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
      <PPMSModal
        show={showRemoveModal}
        centered={true}
        backdrop={"static"}
        handleClose={handleModalClose}
        handleSave={handleModalRemove}
        title={"Remove Confirmation"}
        body={"Do you want to remove the Featured Items?"}
        id={"delete-confirmation"}
        label={"Yes"}
        labelCancel={"No"}
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FeaturedItemsList);
