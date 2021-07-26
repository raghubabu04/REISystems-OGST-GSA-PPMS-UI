import React from "react";
import PPMSPagination from "../../../ui-kit/components/common/pagination/PPMS-pagination";
import { connect } from "react-redux";
import { commonActions } from "../../../_redux/_actions/common.actions";
import { cartActions } from "../../../_redux/_actions/cart.actions";
import { bindActionCreators } from "redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { PPMSSalesProperty } from "../../../ui-kit/components/property/PPMS-sales-property";
import { dateFormatted } from "./validation/AdvancedSearchValidation";

interface SalesSearchListProps {
  title: string;
  items?: any[];
  defaultSortField?: string;
  loading?: boolean;
  rowsPerPageOptions?: any[];
  page?: number;
  totalRows?: number;
  totalPages?: number;
  rowsPerPage?: number;
  isPaginationEnabled?: boolean;
  onChangePage?: any;
  salesAttribute?: string;
}
interface SalesSearchListState {}

class SalesSearchList extends React.Component<
  SalesSearchListProps,
  SalesSearchListState
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  onChangePage = (event) => {
    this.props.onChangePage(event);
  };
  render() {
    console.log(this.props.items);
    return (
      <div>
        <SearchResults
          title={this.props.title}
          items={this.props.items}
          loading={this.props.loading}
          rowsPerPageOptions={this.props.rowsPerPageOptions}
          page={this.props.page}
          totalRows={this.props.totalRows}
          totalPages={this.props.totalPages}
          rowsPerPage={this.props.rowsPerPage}
          isPaginationEnabled={this.props.isPaginationEnabled}
          onChangePage={this.props.onChangePage}
          salesAttribute={this.props.salesAttribute}
        />
      </div>
    );
  }
}
function SearchResults({
  title,
  items,
  loading,
  rowsPerPageOptions,
  page,
  totalRows,
  totalPages,
  rowsPerPage,
  isPaginationEnabled,
  onChangePage,
  salesAttribute,
}) {
  console.log(items);
  return (
    <>
      <div className="grid-row">
        <h3>
          Sales Search List{" "}
          <span>- {items !== null ? items.length : 0} Results</span>
        </h3>
      </div>
      <div>
        <PPMSPagination
          page={page}
          pageSize={rowsPerPage}
          totalRows={totalRows}
          onChangePage={onChangePage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
        <div className="sales-list">
          {items.map((item, index) => (
            <PPMSSalesProperty
              salesAttribute={salesAttribute}
              key={index}
              // default config for sales search list
              noCardHeader={false}
              noCardMedia={true}
              noCardFooter={true}
              icn={item?.searchResultItemDto?.icn}
              itemName={item?.searchResultItemDto?.itemName}
              itemStatus={item?.searchResultItemDto?.itemStatus}
              itemReportedDate={dateFormatted(
                item?.searchResultItemDto?.itemReportedDate
              )}
              gsaAssignedUserEmail={
                item?.searchResultItemDto?.gsaAssignedUserEmail
              }
              gsaAssignedUserFirstName={
                item?.searchResultItemDto?.gsaAssignedUserFirstName
              }
              gsaAssignedUserLastName={
                item?.searchResultItemDto?.gsaAssignedUserLastName
              }
              fsc={item?.searchResultItemDto?.fsc}
              vin={item?.searchResultItemDto?.vin}
              zone={item?.searchResultItemDto?.zone}
              zoneName={item?.searchResultItemDto?.zoneName}
              awardAmount={item?.lotResultDto?.awardAmount}
              contractNumber={item?.lotResultDto?.contractNumber}
              contractStatus={item?.lotResultDto?.contractStatus}
              lotICN={item?.lotResultDto?.icn}
              lotName={item?.lotResultDto?.lotName}
              lotNumber={item?.lotResultDto?.lotNumber}
              saleNumber={item?.lotResultDto?.saleNumber}
              saleStartDate={dateFormatted(item?.lotResultDto?.saleStartDate)}
              saleStatus={item?.lotResultDto?.saleStatus}
              salesContractingOfficer={
                item?.lotResultDto?.salesContractingOfficer
              }
              lotVIN={item?.lotResultDto?.vin}
              bidderUserName={(salesAttribute === "Bidder" && item?.userName)? item.userName:item?.lotResultDto?.bidderUsername}
              bidderName={`${item?.firstName} ${item?.lastName}`}
              bidderEmail={item?.email}
              bidderNumber={
                salesAttribute === "Bidder"
                  ? item?.bidderNumber
                  : item?.lotResultDto?.bidderNumber
              }
              bidderStatus={item?.status}
            />
          ))}
        </div>
        <PPMSPagination
          page={page}
          pageSize={rowsPerPage}
          totalRows={totalRows}
          onChangePage={onChangePage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  roles: state.authentication.roles,
  priorityCodes: state.common.priorityCodes,
});

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
    getPriorityCodes: () => {
      dispatch(commonActions.getPriorityCodes());
    },
    updateQuantity: (payload) => {
      dispatch(cartActions.updateQuantity(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SalesSearchList);
