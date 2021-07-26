import React, { useEffect, useState } from "react";
import { ToggleCategory } from "../../property/search-property/ToggleCategory";
import { connect } from "react-redux";
import { SalesApiService } from "../../../api-kit/sales/sales-api-service";
import { bindActionCreators } from "redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { AuctionsApiService } from "../../../api-kit/auctions/auctions-api-service";
import { Environment } from "../../../environments/environment";
import RealEstateMap from "./RealEstateMap";
import { FeaturedItemsCarousel } from "../featured-items/FeaturedItemsCarousel";
import { AuctionPreviewTile } from "../preview/AuctionPreviewTile";

export interface ActionRealEstatePreviewProps {
  location?: any;
  router?: any;
  salesNumber?: any;
}

function RealEstate(props: ActionRealEstatePreviewProps) {
  const [categories, setCategories] = useState<any[]>([]);

  const [cateorySelectionChanged, setCategorySelectionChanged] = useState<
    boolean
  >(false);

  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

  const [page, setPage] = useState<number>(1);

  const [totalRows, setTotalRows] = useState<number>(0);

  const [rowsPerPage, setRowsPerPage] = useState<number>(50);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const salesApiService = new SalesApiService();

  const auctionsApiService = new AuctionsApiService();

  const [auctions, setAuctions] = useState<Array<any>>([]);

  let whichPageText: string = "Auctions";

  const getPbsDoiAuctions = async (data: any) => {
    setIsLoading(true);
    let apiResponse = await auctionsApiService.getPBSAuction(data);
    let auctions = apiResponse?.data?.auctionDTOList;
    let auctionsLength = auctions?.length;

    if (auctionsLength === 0) {
      setRowsPerPage(50);
    }
    setRowsPerPage(data?.params?.size);
    setAuctions(auctions);
    setCurrentPage(apiResponse?.data?.currentPageNumber);
    setTotalRows(
      apiResponse?.data?.totalElements > 0
        ? apiResponse?.data?.totalElements
        : 0
    );
    setIsLoading(false);

    let categories: any[] = apiResponse.data.lotAuctionsCategoryCountDTOList.map(
      (item: any) => {
        return {
          value:
            item.categoryCode === "1"
              ? item.categoryName
              : item.categoryName + `(${item.total})`,
          categoryName: item.categoryName,
          id: item.categoryCode,
          isSelected: item.isSelected,
          isDisabled:
            item.categoryCode === "1"
              ? false
              : item.count === 0 && item.total === 0,
          count:
            item.categoryCode === "1"
              ? apiResponse.data.totalElements
              : item.count,
        };
      }
    );
    setCategories(categories);
  };

  useEffect(() => {
    let data = {
      lotStatus: "Preview",
      salesNumber: props?.salesNumber,
      cateorySelectionChanged: cateorySelectionChanged,
      categoryCodeList:
        selectedCategories.length !== 0
          ? selectedCategories.includes("1")
            ? []
            : selectedCategories
          : [],
      params: {
        page: page === 0 ? 1 : page,
        size: rowsPerPage,
      },
    };
    getPbsDoiAuctions(data);
  }, [selectedCategories]);

  const handleAllocationsPageChange = async (
    page?: number,
    pageSize?: number
  ) => {
    let data = {
      lotStatus: "Preview",
      cateorySelectionChanged: cateorySelectionChanged,
      salesNumber: props?.salesNumber,
      categoryCodeList:
        selectedCategories.length !== 0
          ? selectedCategories.includes("1")
            ? []
            : selectedCategories
          : [],
      params: {
        page: page ? page : 1,
        size: pageSize,
      },
    };
    getPbsDoiAuctions(data);
  };

  const handleCheckboxToggleChange = (categoryIds: any[]) => {
    setCategorySelectionChanged(true);
    setSelectedCategories(categoryIds);
  };

  const pluralizeResults = (count: number, noun: string, suffix = "s") =>
    `${count} ${noun}${count !== 1 && count !== 0 ? suffix : ""}`;

  const data = {
    params: {
      page: 1,
      size: 25,
    },
  };

  return (
    <div className="grid-conatiner ui-ppms">
      <div className="grid-row grid-gap-4">
        <div className="grid-col-3 pushToggleDown filter-cards usa-layout-docs__sidenav">
          <ToggleCategory
            title={"Browse by Category"}
            options={categories}
            onSelect={handleCheckboxToggleChange}
            type={"real-estate"}
          />
        </div>

        <div className="desktop:grid-col-9 usa-layout-docs__main">
        {isLoading
                  ? null
                  : auctions.map((item) => {
                      return (
                          <AuctionPreviewTile auction={item} listPage={true} />
                      );
                    })}
          <div className={"grid-row grid-gap-4"}>
            <FeaturedItemsCarousel
              asynCall={salesApiService.getPBSFeaturedItems(data)}
              className={"pbs-featured-item"}
              itemsToShow={3}
            />
          </div>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col-12"}>
              <RealEstateMap auctionURL={Environment.PBS_DOI_AUCTIONS} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RealEstate);
