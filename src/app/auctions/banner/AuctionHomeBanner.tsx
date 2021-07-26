import React, { StrictMode, useEffect, useState } from "react";
import { AuctionsApiService } from "../../../api-kit/auctions/auctions-api-service";
import { PPMSImageSlider } from "../../../ui-kit/components/image-carousel/PPMS-image-slider";
interface BannerProps {}

export const AuctionHomeBanner = (props: BannerProps) => {
  let auctionsAPIService = new AuctionsApiService();
  const [bannerList, setBannerList] = useState([]);

  useEffect(() => {
    getListOfBanners();
  }, []);

  const getListOfBanners = async () => {
    let bannerListResponse = await auctionsAPIService.getListofBanners();
    setBannerList(bannerListResponse.data);
  };

  return (
    <StrictMode>
      <PPMSImageSlider
        images={bannerList}
        height="auto"
        width="800"
        imageSlideType="banner"
        autoPlaySpeed="5000"
      />
    </StrictMode>
  );
};
