import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { formatDateTime } from "../../../../../../ui-kit/utilities/FormatUtil";
import { PageUtils } from "../../../../../../utils/PageUtils";
import { authentication } from "../../../../../../_redux/_reducers/authentication.reducer";
interface CurrentBidsProps {
  data?: any;
  user?: any;
}
const TopBids = (props: CurrentBidsProps) => {
  const { data, user } = props;
  const bids = data?.map((item, index) => (
    <tr>
      <td className={"tableColumnWrapper"}>
        Bidder#{item.bidderNumber} {index === 0 ? "(Current High Bid)" : null}{" "}
        {item.bidderUserName ? "(" + item.bidderUserName + ")" : ""}
      </td>
      <td>{PageUtils.getFormattedCurrency(item.bidAmount)}</td>
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
                <th scope="col">Bidder</th>
                <th scope="col">Bid Amount</th>
                <th scope="col">Bid Time</th>
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
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
  sale: state.sale,
  holiday: state.common.holiday,
});

export default connect(mapStateToProps, null)(TopBids);
