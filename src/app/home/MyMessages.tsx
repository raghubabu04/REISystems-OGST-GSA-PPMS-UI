import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import PPMSPagination from "../../ui-kit/components/common/pagination/PPMS-pagination";
import { Link } from "react-router-dom";
import { Paths } from "../Router";
import Moment from "moment";
import { AuctionsApiService } from "../../api-kit/auctions/auctions-api-service";
import { MyMessagesContext } from "./MyMessagesContext";
import { formatLotNumber } from "../sales/management-pbs-doi/lot-details/property/common/constants/Utils";
import { FaExclamationTriangle } from "react-icons/fa";
import { GoInfo } from "react-icons/go";
import {
  formatDateTime,
  formatSaleNumber,
} from "../../ui-kit/utilities/FormatUtil";
export interface MyMessagesProps {
  user: any;
  userAccess: string[];
  roles: any;
  loggedIn: boolean;
  permissions: any[];
  aacs: any[];
  authentication: any;
}

const MyMessages = (props: MyMessagesProps) => {
  const { user } = props;
  let auctionsAPIService = new AuctionsApiService();
  const { myMessagesState, updateMyMessagesState } = useContext(
    MyMessagesContext
  );

  useEffect(() => {
    getBiddingActionHistory(1, 50);
  }, []);

  const getBiddingActionHistory = (currentPage, pageSize) => {
    let data = {
      params: {
        page: currentPage,
        size: pageSize,
      },
    };
    auctionsAPIService
      .getBiddingActionHistory(user.bidderId, data)
      .then((response) => {
        let state = myMessagesState;
        state.data.filteredRows = response.data.bidMessageDTOList;
        state.other.page.currentPage = response.data.currentPageNumber;
        state.other.page.pageSize = response.data.currentPageSize;
        state.other.page.totalRows = response.data.totalElements;
        updateMyMessagesState(state);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let body = myMessagesState.data.filteredRows.map((row, index) => {
    const rowId = "actionListRow-" + index;
    return (
      <div className={"bidding-action-list"}>
        <div className={"grid-row grid-gap-2"}>
          <div
            className={`grid-col-9 ${
              row.message.includes("no longer") ||
              row.message.includes("terminated")
                ? "message-text-color"
                : ""
            } `}
          >
            {row.message.includes("no longer") ||
            row.message.includes("terminated") ? (
              <FaExclamationTriangle color="#ffbe2e" />
            ) : (
              <GoInfo />
            )}
            {row.message}
          </div>
          <div className={"grid-col-3"}>
            {Moment(row.createdAt).format("MM/DD/YYYY")} @{" "}
            {formatDateTime(row.createdAt)}
          </div>
        </div>
        <div className={"grid-row"}>
          <div className={"grid-col-7"}>
            <Link
              to={`${Paths.previewAuctions}${
                row.auctionId ? "/" + row.auctionId : ""
              }`}
              className={"sale-lot-auction"}
              key="sale-lot-auction-id"
            >
              (
              {formatSaleNumber(
                row.saleNumber + formatLotNumber(row.lotNumber?.toString(), 3)
              )}
              )
            </Link>
          </div>
        </div>
      </div>
    );
  });
  const handlePageChange = (currentPage, pageSize) => {
    getBiddingActionHistory(currentPage, pageSize);
  };

  return (
    <div className={"ui-ppms grid-row grid-gap-4"}>
      <div className={"header-row grid-row"}>
        <h1>Bidding Action History</h1>
        <div
          className={"grid-col-12 bidding-action-header bidding-action-list"}
        >
          <strong>Messages for {user.firstName + " " + user.lastName}</strong>
        </div>
      </div>
      <br />
      <div className={"header-row grid-row grid-gap-4"}>
        <div className={"grid-col-12 margin-top-1"}>
          Updated as of &nbsp;
          <strong>
            {" "}
            {Moment(new Date()).format("MM/DD/YYYY")} @{" "}
            {formatDateTime(new Date())}
          </strong>
        </div>
      </div>
      <br />
      <br />
      <div
        className={
          "ui-ppms usa-layout-docs__main desktop:grid-col-12 usa-prose usa-layout-docs"
        }
      >
        <div className={"item-search-result-wrapper header-row"}>
          <div className={"grid-row bidding-action-list"}>
            <div className={"grid-col-12"}>
              <PPMSPagination
                page={myMessagesState.other.page.currentPage}
                pageSize={myMessagesState.other.page.pageSize}
                totalRows={myMessagesState.other.page.totalRows}
                onChangePage={(currentPage, pageSize) => {
                  handlePageChange(currentPage, pageSize);
                }}
              />
            </div>
            <br />
            <br />
          </div>
          {body}
          <br />

          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <PPMSPagination
                page={myMessagesState.other.page.currentPage}
                pageSize={myMessagesState.other.page.pageSize}
                totalRows={myMessagesState.other.page.totalRows}
                onChangePage={(currentPage, pageSize) => {
                  handlePageChange(currentPage, pageSize);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
  sale: state.sale,
});
export default connect(mapStateToProps, null)(MyMessages);
