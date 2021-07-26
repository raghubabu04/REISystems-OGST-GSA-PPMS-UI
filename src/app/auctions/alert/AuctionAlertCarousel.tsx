import React, { StrictMode, useEffect, useState } from "react";
import { AuctionsApiService } from "../../../api-kit/auctions/auctions-api-service";
import { PPMSCarousel } from "../../../ui-kit/components/image-carousel/PPMS-carousel";
import AuctionAlert from "./AuctionAlert";

interface AuctionAlertCarouselProps {}

export const AuctionAlertCarousel = (props: AuctionAlertCarouselProps) => {
  const auctionsAPIService = new AuctionsApiService();

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getAlerts();
  }, []);

  const category = "PPMAuctions";

  const getAlerts = async () => {
    let response = await auctionsAPIService.getListofAlertsByCategory(category);
    console.log(response, "response get alerts");
    setAlerts(response.data);
  };

  return (
    <StrictMode>
      {alerts.length > 0 ? (
        <div className="auction-alert-carousal">
          <PPMSCarousel
            itemsToShow={1}
            hidePagination={true}
            items={alerts.map((item) => (
              <AuctionAlert item={item} />
            ))}
          ></PPMSCarousel>
        </div>
      ) : (
        ""
      )}
    </StrictMode>
  );
};
