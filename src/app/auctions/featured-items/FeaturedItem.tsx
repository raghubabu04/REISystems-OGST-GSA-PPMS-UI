import moment from "moment";
import React, { StrictMode, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { isEmptyCheck } from "../../internal-agency/validations/InternalAgencyFieldValidations";
import { Paths } from "../../Router";
import { IFeaturedItem } from "../Constants";
import placeholderImage from "../../../assets/images/placeholder-img.jpg";

interface FeaturedItemProps {
  item: IFeaturedItem;
  className: string;
  showFooter: boolean;
}

const FeaturedItem = (props: FeaturedItemProps) => {
  const [predesignedUrl, setPredesignedUrl] = useState<string>(
    props.item.predesignedUrls[0]
  );

  const [curItem, setCurItem] = useState(0);

  useEffect(() => {
    const predesignedUrls: string[] = props.item.predesignedUrls;
    if (predesignedUrls.length > 1) {
      const timer = window.setInterval(() => {
        setCurItem((prevItem) =>
          prevItem != predesignedUrls.length - 1 ? prevItem + 1 : 0
        );
      }, 1000);
      return () => {
        window.clearInterval(timer);
      };
    }
  }, []);

  useEffect(() => {
    const predesignedUrl: string = props.item.predesignedUrls[curItem];
    setPredesignedUrl(
      !isEmptyCheck(predesignedUrl) ? predesignedUrl : placeholderImage
    );
  }, [curItem]);

  const location = () => {
    let location: string = "";
    if (props.className === "pbs-featured-item") {
      location = props.item.location;
    }
    return (
      <>
        <li>{location}</li>
      </>
    );
  };

  return (
    <StrictMode>
      <div className={props.className} key={props.item.id}>
        <Link
          to={{
            pathname:
              props.item.type === "SALES"
                ? `${Paths.auctionsList + "/sale/" + props.item.salesNumber}`
                : `${Paths.previewAuctions}/${props.item.auctionId}`,
          }}
        >
          <div className="image-available">
            <img src={predesignedUrl} />
          </div>
        </Link>
        {props.showFooter ? (
          <p>
            <div className={"grid-row grid-gap-4"}>
              <div className="tablet:grid-col-12">
                <ul className={"usa-list usa-list--unstyled"}>
                  <li className="text-bold">{props.item.id ? props.item.id : <div>&nbsp;</div>}</li>
                  <li>
                    {props.item.description ? (
                      props.item.description
                    ) : (
                      <div>&nbsp;</div>
                    )}
                  </li>
                  <li>
                    {props.item.closingTime ? (
                      moment(moment(props.item.closingTime, "YYYY-MM-DDTHH:mm"))
                        .format("MM/DD/YYYY hh:mm A")
                        .toString()
                    ) : (
                      <div>&nbsp;</div>
                    )}
                  </li>
                </ul>
              </div>
              <div className="tablet:grid-col">
                <ul className={"usa-list usa-list--unstyled"}>{location()}</ul>
              </div>
            </div>
          </p>
        ) : (
          ""
        )}
      </div>
    </StrictMode>
  );
};

export default FeaturedItem;
