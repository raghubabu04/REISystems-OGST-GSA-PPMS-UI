import React from "react";
import { internetVASContent } from "../constant/AuctionConstants";

const Description = (props) => (
  <div
    className="biddingDetails-description"
    dangerouslySetInnerHTML={{ __html: props.content }}
  />
);

const InternetVASContent = () => {
  return (
    <>
      <div className={"margin-adjustment"}>
        <h3>
          {internetVASContent.closingRules.header}
        </h3>
        <div className="bid-details-content">
          <Description content={internetVASContent.closingRules.content} />
        </div>
      
      
      <h3> {internetVASContent.howToBid.header}</h3>
      <div className="bid-details-content">
        {internetVASContent.howToBid.content.map((item) => {
          return (
            <>
              <strong> {item.header}</strong>
              <p><Description content={item.content} /></p>
            </>
            
          );
        })}
      </div>
      <div className="bid-details-content">
        <strong>{internetVASContent.maximumBidProxyBid.header}</strong>
        <p><Description content={internetVASContent.maximumBidProxyBid.content} /></p>
      </div>

      <div className="bid-details-content">
        <strong> {internetVASContent.winningTrading.winningTrading.header}</strong>
        <p><Description content={internetVASContent.winningTrading.winningTrading.content}/></p>
      </div>

      <div className="bid-details-content">
      
        
          <strong>
            {" "}
            {
              internetVASContent.winningTrading.reductionBidIncrementNotes
                .header
            }
          </strong>
        
        <p><Description content={internetVASContent.winningTrading.reductionBidIncrementNotes.content}/></p>
      
      </div>
      </div>  </>  
  );
};

export default InternetVASContent;
