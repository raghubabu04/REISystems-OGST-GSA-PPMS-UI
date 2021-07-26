import React from "react";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";

const limit = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};
interface PPMSDatatableProps {
  totalRows: number;
  onChangePage?: any;
  page: number;
  pageSize: number;
  rowsPerPageOptions?: any[];
}
interface PPMSDatatableState {
  pager: any;
  pageSize: number;
  rowsPerPageOptions: any[];
}
export class PPMSPagination extends React.Component<
  PPMSDatatableProps,
  PPMSDatatableState
> {
  constructor(props) {
    super(props);
    this.state = {
      pager: this.getPager(
        this.props.totalRows,
        this.props.page,
        this.props.pageSize
      ),
      pageSize: this.props.pageSize,
      rowsPerPageOptions:
        this.props.rowsPerPageOptions !== undefined &&
        this.props.rowsPerPageOptions.length !== 0
          ? this.props.rowsPerPageOptions
          : [10, 20, 30, 40, 50],
    };
  }
  componentWillMount() {
    if (this.props.totalRows > 0) {
      var pager = this.state.pager;
      pager = this.getPager(
        this.props.totalRows,
        this.props.page,
        this.props.pageSize
      );
      this.setState({ pager: pager });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.totalRows !== prevProps.totalRows ||
      this.props.page !== prevProps.page ||
      this.props.pageSize !== prevProps.pageSize
    ) {
      let pager = this.getPager(
        this.props.totalRows,
        this.props.page,
        this.props.pageSize
      );
      this.setState({ pager: pager });
    }
  }

  setPage(page) {
    let { totalRows } = this.props;
    let pager = this.state.pager;
    this.props.onChangePage(page, pager.pageSize);
    pager = this.getPager(totalRows, page, pager.pageSize);
    this.setState({ pager: pager });
  }

  getPager(totalRows, currentPage, pageSize) {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 10
    pageSize = pageSize || 10;
    let basecount = 1;
    // calculate total pages
    let totalPages = Math.ceil(totalRows / pageSize);
    if (totalPages === 0) {
      currentPage = 1;
      basecount = 0;
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalRows - 1);
    return {
      totalRows: totalRows,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startIndex: startIndex,
      endIndex: endIndex,
      basecount: basecount,
    };
  }

  render() {
    let pager = this.state.pager;
    let paginationComponent;
    if (pager?.totalRows > 0) {
      paginationComponent = (
        <div className="grid-row ui-ppms">
          <div className="grid-col show-count">
            <span>
              Showing{" "}
              <strong>
                {limit(
                  pager?.totalRows > 0
                    ? (pager.currentPage - 1) * pager.pageSize + 1
                    : 0,
                  pager.basecount,
                  pager.totalRows
                )}{" "}
                -
                {limit(
                  pager?.totalRows > 0
                    ? (pager.currentPage - 1) * pager.pageSize + pager.pageSize
                    : 0,
                  pager.basecount,
                  pager.totalRows
                )}
                &nbsp; of {pager.totalRows}
              </strong>{" "}
            </span>
          </div>
          <div className="grid-col text-center pagination-controls">
            <button
              title={"first-page"}
              className={"usa-button usa-button--unstyled"}
              onClick={() => this.setPage(1)}
              disabled={pager.currentPage === 1 || pager.currentPage === 0}
            >
              {<MdFirstPage />}
            </button>
            &nbsp; &nbsp;
            <button
              title={"previous-page"}
              className={"usa-button usa-button--unstyled"}
              onClick={() => this.setPage(pager.currentPage - 1)}
              disabled={pager.currentPage === 1 || pager.currentPage === 0}
            >
              {<MdNavigateBefore />}
            </button>
            &nbsp; &nbsp;
            <span>
              Page{" "}
              <strong>
                {pager.totalPages > 0 ? pager.currentPage : pager.totalPages} of{" "}
                {pager.totalPages}
              </strong>{" "}
            </span>
            &nbsp; &nbsp;
            <button
              title={"next-page"}
              className={"usa-button usa-button--unstyled"}
              onClick={() => this.setPage(pager.currentPage + 1)}
              disabled={
                pager.totalRows === 0 || pager.currentPage === pager.totalPages
              }
            >
              {<MdNavigateNext />}
            </button>
            &nbsp; &nbsp;
            <button
              title={"last-page"}
              className={"usa-button usa-button--unstyled"}
              onClick={() => this.setPage(pager.totalPages)}
              disabled={
                pager.totalRows === 0 || pager.currentPage === pager.totalPages
              }
            >
              {<MdLastPage />}
            </button>
          </div>
          <div className="grid-col text-right page-viewer">
            <select
              title={"select-page-size"}
              value={pager.pageSize}
              onChange={(e) => {
                pager.pageSize = Number(e.target.value);
                this.setPage(1);
              }}
            >
              {this.state.rowsPerPageOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    /*if (!pager.pages || pager.pages.length <= 1) {
      // don't display pager if there is only 1 page
      return null;
  } */

    return <div>{paginationComponent}</div>;
  }
}
export default PPMSPagination;
