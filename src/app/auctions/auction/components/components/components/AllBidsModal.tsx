import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { PageUtils } from "../../../../../../utils/PageUtils";
import moment from "moment";
import { PPMSModal } from "../../../../../../ui-kit/components/common/PPMS-modal";
import PPMSPagination from "../../../../../../ui-kit/components/common/pagination/PPMS-pagination";
import {
  formatCurrency,
  formatDateTime,
} from "../../../../../../ui-kit/utilities/FormatUtil";
import { max } from "lodash";

interface AllBidsModalProps {
  data?: any;
  showModal: boolean;
  updateAllBidsModal: any;
  currentPage: number;
  pageSize: number;
  totalRows: number;
  handlePageChange: any;
  auction: any;
  authentication: any;
}

const AllBidsModal = (props: AllBidsModalProps) => {
  const {
    data,
    showModal,
    updateAllBidsModal,
    currentPage,
    pageSize,
    totalRows,
    handlePageChange,
    auction,
    authentication,
  } = props;
  const bids = data?.map((item, index) => {
    let bidType = "";
    if (item.proxyBid) {
      if (item.bidType === "F") {
        bidType = "Flat Bid";
      } else if (item.bidType === "A") {
        bidType = "Proxy Bid";
      }
    } else {
      bidType = "Hidden";
    }
    let proxyBid = "N/A";
    if (item.bidType === "A") {
      if (item.proxyBid) {
        proxyBid = formatCurrency.format(item.proxyBid);
      } else {
        proxyBid = "Hidden";
      }
    }
    return (
      <tr
        className="action-list-row"
        id={`all-bid-${index}`}
        key={`all-bid-${index}`}
      >
        <td className="action-list-message">{item.bidNumber}</td>
        <td className={"action-list-message"}>
          {`Bidder#${item.bidderNumber} ${
            item.currentHighBid ? " (Current High Bid) " : ""
          } ${item.bidderUserName ? "(" + item.bidderUserName + ")" : ""}`}
        </td>
        <td className="action-list-message">
          {PageUtils.getFormattedCurrency(item.bidAmount)}
        </td>
        <td className="action-list-message">
          {formatDateTime(item.createdAt)}
        </td>
        {authentication.loggedIn && (
          <>
            <td className="action-list-message">{proxyBid}</td>
            <td className="action-list-message">{bidType}</td>
          </>
        )}
      </tr>
    );
  });

  const closeModal = () => {
    updateAllBidsModal(false);
  };

  const getModalBody = () => {
    return (
      <>
        <div className={"margin-bottom-10px"}>
          <a
            href={"#"}
            onClick={() => {
              closeModal();
            }}
          >
            Back to Item Description
          </a>
        </div>
        <div className={"grid-row"}>
          <div className={"grid-col"}>
            <p>
              <strong>Sale Number: </strong>
              {auction?.salesNumber}
            </p>
          </div>
          <br />
          <div className={"grid-col"}>
            <p>
              <strong>Property Name: </strong>
              {auction?.lotName}
            </p>
          </div>
        </div>
        <table className="action-table">
          <thead>
            <tr>
              <th scope="col">Bid#</th>
              <th scope="col">Bidder</th>
              <th scope="col">Bid Amount</th>
              <th scope="col">Bid Time</th>
              {authentication.loggedIn && (
                <>
                  <th scope="col">Proxy Bid Amount</th>
                  <th scope="col">Bid Type</th>
                </>
              )}
            </tr>
          </thead>
          <tbody role="row">
            {bids?.length === 0 && (
              <tr role="row" className="not-found-row">
                <td
                  role="cell"
                  className="text-center"
                  colSpan={authentication.loggedIn ? 6 : 4}
                >
                  No Bids
                </td>
              </tr>
            )}
            {bids}
          </tbody>
        </table>

        <PPMSPagination
          page={currentPage}
          pageSize={pageSize}
          totalRows={totalRows}
          onChangePage={(currentPage, pageSize) => {
            handlePageChange(currentPage, pageSize);
          }}
        />
      </>
    );
  };
  return (
    <>
      <PPMSModal
        body={getModalBody()}
        id={"show-action-history-view"}
        show={showModal}
        handleSave={""}
        handleClose={closeModal}
        title={"All bids"}
        centered={true}
        hideLabel={true}
        hideLabelSave={true}
        hideLabelCancel={true}
        size={"xl"}
        // hideLabel={this.state.showActionHistoryModal ? true : false}
        // size={this.state.showActionHistoryModal ? "lg" : null}
      />
    </>
  );
};
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  authentication: state.authentication,
  roles: state.authentication.roles,
  sale: state.sale,
  holiday: state.common.holiday,
});

export default connect(mapStateToProps, null)(AllBidsModal);
