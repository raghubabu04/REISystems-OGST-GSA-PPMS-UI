import React, { StrictMode, useEffect, useState } from "react";
import { AuctionsApiService } from "../../../api-kit/auctions/auctions-api-service";
import { Paths } from "../../Router";

export const BrowseByCategory = (props) => {
  const auctionsApiService = new AuctionsApiService();
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    auctionsApiService
      .getCategoryCounts()
      .then((response) => {
        let categories: any[] = response.data.map((item: any) => {
          return {
            value: item.categoryName + `(${item.total})`,
            categoryName: item.categoryName,
            id: item.categoryCode,
            isSelected: item.isSelected,
            isDisabled: item.count === 0 && item.total === 0,
            count: item.count,
          };
        });
        setCategories(categories);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div className="grid-row grid-gap">
        <div className="desktop:grid-col-12">
          <ul className="limheight">
            {categories &&
              categories.map((item) => {
                return (
                  <li>
                    <a
                      href={
                        Paths.auctionsList +
                        "/category/" +
                        item.id +
                        "/active-preview"
                      }
                      id={item.categoryCode}
                    >
                      {item.value}
                    </a>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
};
