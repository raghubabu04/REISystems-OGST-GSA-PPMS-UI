import React, { useEffect, useState } from "react";
import { AuctionsApiService } from "../../../../../api-kit/auctions/auctions-api-service";
import TopBids from "./components/TopBids";
import AllBidsModal from "./components/AllBidsModal";

import MyBids from "./components/MyBids";
import { bidding_history_notes } from "./constant/AuctionConstants";

interface BiddingHistoryProps {
  auctionId: number;
  authentication: any;
}
const BiddingHistory = (props: BiddingHistoryProps) => {
  const { auctionId, authentication } = props;
  let auctionsAPIService = new AuctionsApiService();
  const [topBids, setTopBids] = useState();
  const [myBids, setMyBids] = useState();
  const [sellingAgency, setSellingAgency] = useState();
  const [allBids, setAllBids] = useState();
  const [showAllBidsModal, updateShowAllBidsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [pageSize, setPAgeSize] = useState(10);
  const [auction, setAuction] = useState();

  const getTopBids = () => {
    auctionsAPIService
      .getTopBids(auctionId)
      .then((response) => {
        setTopBids(response?.data);
      })
      .catch((error) => {
        console.log("errors: ", error);
      });
  };
  const getAllBids = (page, size) => {
    let data = {
      params: {
        page: page,
        size: size,
      },
    };
    auctionsAPIService
      .getAllBids(auctionId, data)
      .then((response) => {
        setAllBids(response.data?.bidDTOList);
        setTotalRow(response.data?.totalElements);
      })
      .catch();
  };

  const getMyBids = () => {
    auctionsAPIService
      .getMyBids(auctionId)
      .then((response) => {
        setMyBids(response?.data);
      })
      .catch((error) => {
        console.log("errors: ", error);
      });
  };

  const getAuctions = () => {
    auctionsAPIService
      .getAuction(auctionId)
      .then((response) => {
        setSellingAgency(response?.data.sellingAgency);
        setAuction(response?.data);
      })
      .catch((error) => {
        console.log("errors: ", error);
      });
  };

  const handleAllBidsPageChange = (currentPage, pageSize) => {
    setCurrentPage(currentPage);
    setPAgeSize(pageSize);
    getAllBids(currentPage, pageSize);
  };

  useEffect(() => {
    getAuctions();
    getTopBids();
    if (authentication.loggedIn) {
      getMyBids();
    }
  }, []);

  const openAllBidsModal = () => {
    updateShowAllBidsModal(!showAllBidsModal);
  };
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <p className={"usa-auction-description-text"}>
                {bidding_history_notes}
              </p>
              <div className={"usa-auction-description-text"}>
                <h4 className={"custodian-h4"}>
                  Bidders in the Auction (Current top 10 bidders)
                </h4>
                <TopBids data={topBids} />
                {sellingAgency === "PBS" || sellingAgency === "DOI" ? (
                  <div className="margin-bottom-1px">
                    <a
                      href={"#"}
                      onClick={() => {
                        getAllBids(currentPage, pageSize);
                        openAllBidsModal();
                      }}
                    >
                      Click here to see all bids
                    </a>
                  </div>
                ) : (
                  <></>
                )}
                <AllBidsModal
                  data={allBids}
                  showModal={showAllBidsModal}
                  updateAllBidsModal={(value) => {
                    updateShowAllBidsModal(value);
                  }}
                  handlePageChange={handleAllBidsPageChange}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  totalRows={totalRow}
                  auction={auction}
                />
                {authentication.loggedIn && (
                  <>
                    <h4 className={"custodian-h4"}>Your Bids</h4>{" "}
                    <MyBids data={myBids} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BiddingHistory;
