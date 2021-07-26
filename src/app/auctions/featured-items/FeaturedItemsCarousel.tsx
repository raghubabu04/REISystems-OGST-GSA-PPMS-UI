import React, { StrictMode, useEffect, useState } from "react";
import { autoPlaySpeed, IFeaturedItem } from "../Constants";
import FeaturedItem from "./FeaturedItem";
import { PPMSCarousel } from "../../../ui-kit/components/image-carousel/PPMS-carousel";
import { formatLotNumber } from "../../sales/management-pbs-doi/lot-details/property/common/constants/Utils";

interface FeaturedItemsCarouselProps {
  asynCall: any;
  className: string;
  itemsToShow: number;
}

export const FeaturedItemsCarousel = (props: FeaturedItemsCarouselProps) => {
  const [featuredItems, setFeaturedItems] = useState<IFeaturedItem[]>([]);

  useEffect(() => {
    getFeaturedItems();
  }, []);

  const data = {
    params: {
      page: 1,
      size: 25,
    },
  };

  const getFeaturedItems = async () => {
    let response = await props.asynCall;
    const items: IFeaturedItem[] = [];
    if (response?.data?.featuredItemDTOList) {
      response?.data?.featuredItemDTOList?.forEach((fItem: any) => {
        let predesignedUrls: string[] = [];
        fItem.presignedUrlList?.forEach((url: any) => {
          predesignedUrls.push(url);
        });

        items.push({
          id:
            fItem.type == "SALES"
              ? fItem.salesNumber
              : `${fItem.salesNumber}-${formatLotNumber(
                  fItem.lotNumber?.toString(),
                  3
                )}`,
          description: fItem.description,
          closingTime: fItem.closingTime,
          salesNumber: fItem.salesNumber,
          lotNumber: fItem.lotNumber,
          auctionId: fItem.auctionId,
          type: fItem.type,
          location: fItem.location
            ? `${fItem.location.city},${fItem.location.state}`
            : "",
          predesignedUrls: predesignedUrls,
        });
      });
    }
    setFeaturedItems(items);
  };

  return (
    <StrictMode>
      {featuredItems.length > 0 ? (
        <div className="featured-items-carousal">
          <h1>Featured Items</h1>
          <PPMSCarousel
            autoPlaySpeed={autoPlaySpeed}
            itemsToShow={props.itemsToShow}
            items={featuredItems.map((item: IFeaturedItem) => (
              <FeaturedItem
                item={item}
                className={props.className}
                showFooter={true}
              />
            ))}
          ></PPMSCarousel>
        </div>
      ) : (
        ""
      )}
    </StrictMode>
  );
};
