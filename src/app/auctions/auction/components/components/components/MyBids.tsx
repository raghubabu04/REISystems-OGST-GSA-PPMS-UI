import moment from "moment";
import React from "react";
import { formatDateTime } from "../../../../../../ui-kit/utilities/FormatUtil";

interface PersonalBidsProps {
  data?: any;
}
const MyBids = (props: PersonalBidsProps) => {
  const { data } = props;
  const bids = data?.map((item, index) => (
    <tr>
      <td className={"tableColumnWrapper"}>{item.bidNumber}</td>
      <td>{item.bidAmount ? item.bidAmount + "USD" : null} </td>
      <td>{item.maxLimit ? item.maxLimit + "USD" : null}</td>
      <td>{item.bidStatus}</td>
      <td>{formatDateTime(item.createdAt)}</td>
    </tr>
  ));
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col property-attachment-container"}>
          <table role="table" className={"lot-documents-table usa-table"}>
            <thead role="row" className="upload-table-header">
              <tr>
                <th scope="col">Bid #</th>
                <th scope="col">Bid Amount</th>
                <th scope="col">Max Limit</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {bids?.length === 0 && (
                <tr role="row" className="upload-table-row">
                  <td role="cell" className="text-center" colSpan={4}>
                    No Bids
                  </td>
                </tr>
              )}
              {bids}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MyBids;
