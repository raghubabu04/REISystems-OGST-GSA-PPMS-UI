import React, { StrictMode, useEffect, useState } from "react";
import { AuctionsApiService } from "../../../api-kit/auctions/auctions-api-service";
import { Paths } from "../../Router";

interface LocationBrowseProps {}
export const LocationBrowse = (props: LocationBrowseProps) => {
  const auctionApi = new AuctionsApiService();

  const [stateAuction, setStateAuction] = useState<any>();
  useEffect(() => {
    auctionApi.getStateAuctions().then((response) => {
      setStateAuction(response.data);
    });
  }, []);

  return (
    <>
      <div className="grid-row grid-gap">
        <div className="desktop:grid-col-12">
          <ul className="limheight">
            {stateAuction &&
              stateAuction.map((item) => {
                return (
                  <li>
                    <a
                      href={
                        Paths.auctionsList +
                        "/state/" +
                        item.stateCode +
                        "/active-preview"
                      }
                      id={item.stateCode}
                    >
                      {item.stateName}
                    </a>
                    {` (${item.count})`}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
};
