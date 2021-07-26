import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { AuctionsApiService } from "../../../api-kit/auctions/auctions-api-service";
import { LocationBrowse } from "../browse/LocationBrowse";
import { BrowseByRadius } from "../browse/RadiusBrowse";
import {
  RadiusSearchContext,
  RadiusSearchContextProvider,
} from "../browse/RadiusBrowseContext";
import { BrowseByCategory } from "./BrowseByCategory";
import BrowseByStatus from "./BrowseByStatus";

export const AuctionBrowseItems = (props) => {
  const auctionApi = new AuctionsApiService();

  return (
    <div className={"auction-browse-items"}>
      <h1>Browse Items</h1>
      <Tabs
        justify
        defaultActiveKey={"browse-by-category"}
        id="browse-items-tab"
        variant="tabs"
      >
        <Tab eventKey="browse-by-category" title="Category">
          <div className="bidder-wrapper">
            <BrowseByCategory />
          </div>
        </Tab>
        <Tab eventKey="browse-by-location" title="Location">
          <div className="bidder-wrapper">
            <LocationBrowse />
          </div>
        </Tab>
        <Tab eventKey="browse-by-status" title="Status">
          <div className="bidder-wrapper">
            <BrowseByStatus />
          </div>
        </Tab>
        <Tab eventKey="browse-by-radius" title="Radius">
          <div className="bidder-wrapper">
            <RadiusSearchContextProvider>
              <BrowseByRadius {...props} />
            </RadiusSearchContextProvider>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};
