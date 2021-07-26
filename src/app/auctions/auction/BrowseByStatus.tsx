import React from "react";
import { Link } from "react-router-dom";
import { Paths } from "../../Router";

function BrowseByStatus() {

  return(
    <div>
        <ul className="limheight">
          <li>
            <a href={Paths.auctionsList + "/status/" + "preview"} id="preview">
            Preview Auctions
            </a>
          </li>  
          <li>
            <a href={Paths.auctionsList + "/status/" + "new"} id="new">
              New Today
            </a>
          </li>
          <li>
            <a href={Paths.auctionsList + "/status/" + "closing"} id="closing">
              Closing Today
            </a>
          </li>
          <li>
            <a href={Paths.auctionsList + "/status/" + "closed"} id="closed">
              Closed Auctions
            </a>
          </li>
          <li>
          <a href="#">
            Bid Deposit Only
          </a>
          </li>
        </ul>
    </div>
  )

}

export default BrowseByStatus;