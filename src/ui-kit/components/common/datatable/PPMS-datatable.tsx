import React, { useEffect, useState } from "react";
import {
  useTable,
  useFilters,
  useSortBy,
  usePagination,
  useRowSelect,
  useGroupBy,
  useExpanded,
} from "react-table";
import {
  FaCaretDown,
  FaCaretUp,
  FaChevronDown,
  FaChevronRight,
  FaCompressAlt,
  FaExpandAlt,
} from "react-icons/fa";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { defaultColumn } from "./Filters";
import { PPMSButton } from "../PPMS-button";
import { currencyToNumber } from "../../../utilities/FormatUtil";
interface PPMSDatatableProps {
  title: string;
  data: any[];
  columns: any[];
  defaultSortField: string;
  loading: boolean;
  rowsPerPageOptions?: any[];
  onChange?: any;
  totalRows: number;
  totalPages?: number;
  rowsPerPage?: number;
  bulkActions?: any;
  hideBulkActionsTitle?: boolean;
  subHeaderComponent?: any;
  radioButtonFilter?: any;
  isPaginationEnabled?: boolean;
  hiddenColumns?: any[];
  sortDesc?: boolean;
  currentPage?: any;
  handleSort?: any;
  serverSort?: boolean;
  filters?: any;
  showFilters?: boolean;
  setSelectedRows?: any;
  handleTogglePageRow?: any;
  handleToggleAllPageRows?: any;
  tabComponent?: any;
  changeRowId?: any;
  aggregate?: boolean;
  disableSortBy?: boolean;
  customTableClass?: string;
  updateData?: any;
  groupBy?: any;
  expandSubRows?: boolean;
}
interface PPMSDatatableState {
  pageCount: number;
}
export class PPMSDatatable extends React.Component<
  PPMSDatatableProps,
  PPMSDatatableState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      pageCount: 0,
    };
    this.onPageChange = this.onPageChange.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }
  onPageChange = (pageObject) => {
    if (this.props.isPaginationEnabled) {
      this.props.onChange(pageObject.pageSize, pageObject.pageIndex + 1);
    }
  };
  handleSort = (sortBy) => {
    if (this.props.handleSort) {
      this.props.handleSort(sortBy[0]);
    }
  };

  render() {
    return (
      <div>
        <Datatable
          title={this.props.title}
          isPaginationEnabled={this.props.isPaginationEnabled}
          data={this.props.data}
          columns={this.props.columns}
          defaultSortField={this.props.defaultSortField}
          pageCount={this.props.totalPages}
          loading={this.props.loading}
          bulkActions={this.props.bulkActions}
          hideBulkActionsTitle={this.props.hideBulkActionsTitle}
          subHeaderComponent={this.props.subHeaderComponent}
          radioButtonFilter={this.props.radioButtonFilter}
          rowsPerPageOptions={this.props.rowsPerPageOptions}
          onPageChange={this.onPageChange}
          pageSizeProps={this.props.rowsPerPage}
          totalRows={this.props.totalRows}
          hiddenColumns={this.props.hiddenColumns}
          sortDesc={this.props.sortDesc}
          currentPage={this.props.currentPage}
          onSort={this.handleSort}
          serverSort={this.props.serverSort}
          filters={this.props.filters}
          showFilters={this.props.showFilters}
          setSelectedRows={this.props.setSelectedRows}
          handleTogglePageRow={this.props.handleTogglePageRow}
          handleToggleAllPageRows={this.props.handleToggleAllPageRows}
          tabComponent={this.props.tabComponent}
          aggregate={this.props.aggregate}
          disableSortBy={this.props.disableSortBy}
          customTableClass={this.props.customTableClass}
          updateData={this.props.updateData}
          groupBy={this.props.groupBy}
          expandSubRows={this.props.expandSubRows}
        />
      </div>
    );
  }
}
function Datatable({
  title,
  columns,
  data,
  defaultSortField,
  loading,
  filters,
  showFilters,
  pageCount: controlledPageCount,
  rowsPerPageOptions,
  bulkActions,
  hideBulkActionsTitle,
  subHeaderComponent,
  radioButtonFilter,
  onPageChange,
  pageSizeProps,
  isPaginationEnabled,
  hiddenColumns,
  totalRows,
  sortDesc,
  currentPage,
  onSort,
  serverSort,
  setSelectedRows,
  handleTogglePageRow,
  handleToggleAllPageRows,
  tabComponent,
  aggregate,
  disableSortBy,
  customTableClass,
  updateData,
  groupBy,
  expandSubRows,
}) {
  const filterTypes = React.useMemo(
    () => ({
      /**
       * Add more filter types here. By default we are using text based Search Filter
       **/
      search: filters?.searchFilter,
      select: filters?.selectFilter,
      range: filters?.rangeSelectFilter,
      slider: filters?.sliderSelectFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    toggleAllRowsExpanded,
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      updateData,
      filterTypes,
      disableSortBy: disableSortBy ? disableSortBy : false,
      initialState: {
        hiddenColumns: hiddenColumns ? hiddenColumns : [],
        groupBy: groupBy ? groupBy : [],
        pageSize: pageSizeProps,
        pageIndex: currentPage === undefined ? 0 : currentPage,
        sortBy: [{ id: defaultSortField, desc: sortDesc, asc: !sortDesc }],
      },
      sortTypes: {
        alphanumeric: (row1, row2, columnName) => {
          return ignoreCaseSort(
            row1.values[columnName],
            row2.values[columnName]
          );
        },
        number: (row1, row2, columnName) => {
          return numberSort(row1.values[columnName], row2.values[columnName]);
        },
        customDate: (row1, row2, columnName) => {
          return dateSort(row1.values[columnName], row2.values[columnName]);
        },
      },
      manualPagination: true,
      manualSortBy: serverSort ? serverSort : false,
      manualFilters: true,
      pageCount: controlledPageCount,
      autoResetPage: currentPage !== undefined,

      //When false the selectedRowIds state will not reset even if data changes
      autoResetSelectedRows: false,
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks) => {
      if (handleTogglePageRow)
        hooks.getToggleRowSelectedProps = [handleTogglePageRow];
      if (handleToggleAllPageRows)
        hooks.getToggleAllPageRowsSelectedProps = [handleToggleAllPageRows];
    }
  );
  useEffect(() => {
    onSort(sortBy);
  }, [onSort, sortBy]);
  useEffect(() => {
    if (setSelectedRows) {
      setSelectedRows(selectedFlatRows);
    }
  }, [setSelectedRows, selectedFlatRows]);
  useEffect(() => {
    toggleAllRowsExpanded(true);
  }, [data]);

  function numberSort(a, b) {
    if (a != null && b != null) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    } else {
      if (a === null && b != null) return -1;
      if (b === null && a != null) return 1;
      return 0;
    }
  }

  function dateSort(a, b) {
    if (a != null && b != null) {
      let c = new Date(a);
      let d = new Date(b);
      if (c < d) return -1;
      if (c > d) return 1;
      return 0;
    } else {
      if (a === null && b != null) return -1;
      if (b === null && a != null) return 1;
      return 0;
    }
  }
  function ignoreCaseSort(a, b) {
    const currencyRegex = /(?=.*\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,2})?$/;
    if (
      a != null &&
      b != null &&
      currencyRegex.test(a) &&
      currencyRegex.test(b)
    ) {
      let currencyToNumberA = currencyToNumber(a);
      let currencyToNumberB = currencyToNumber(b);
      if (currencyToNumberA < currencyToNumberB) return -1;
      if (currencyToNumberA > currencyToNumberB) return 1;
      return 0;
    } else if (a != null && b != null) {
      if (a?.toString().toLowerCase() < b?.toString().toLowerCase()) return -1;
      if (a?.toString().toLowerCase() > b?.toString().toLowerCase()) return 1;
      return 0;
    } else {
      if (a === null && b != null) return -1;
      if (b === null && a != null) return 1;
      return 0;
    }
  }


  React.useEffect(() => {
    onPageChange({ pageSize, pageIndex });
  }, [onPageChange, pageSize, pageIndex]);

  let radioButtonFilterElement;
  let breakElement;
  let pagination;
  if (radioButtonFilter) {
    radioButtonFilterElement = <div>{radioButtonFilter}</div>;
    breakElement = <br />;
  }
  const [toggleFilters, updateToggleFilters] = useState(true);
  if (pageSize) {
    pagination = (placement) => (
      <tr>
        {loading ? (
          <th
            colSpan={columns.length}
            scope="colgroup"
            className={"pagination-header"}
          >
            Loading...
          </th>
        ) : (
          <th
            colSpan={columns.length}
            scope="colgroup"
            className={"pagination-header"}
            style={{ fontWeight: 700 }}
          >
            <div className="pagination-controls">
              <div className="show-count">
                Showing{" "}
                {currentPage === undefined
                  ? pageIndex * pageSize + 1
                  : currentPage * pageSize + 1}{" "}
                -{" "}
                {totalRows <
                (currentPage
                  ? (currentPage + 1) * pageSize
                  : (pageIndex + 1) * pageSize)
                  ? totalRows
                  : currentPage
                  ? (currentPage + 1) * pageSize
                  : (pageIndex + 1) * pageSize}{" "}
                of {totalRows} results
              </div>
              {showFilters && placement === "top" && (
                <div className={"pagination-show-filters"}>
                  <PPMSButton
                    type={"button"}
                    label={toggleFilters ? "Hide Filters" : "Show Filters"}
                    id={"show-filters"}
                    variant={"link"}
                    onPress={() => updateToggleFilters(!toggleFilters)}
                    className={"usa-link"}
                  />
                </div>
              )}
            </div>
          </th>
        )}
      </tr>
    );
  }

  let showBulkActions: any;
  if (bulkActions) {
    showBulkActions = (
      <>
        {!hideBulkActionsTitle ? (
          <p className="bulk-action-label">
            <b>Selected Bulk Actions:</b>
          </p>
        ) : (
          <></>
        )}

        <p>
          <div className={"btn-bulk-actions"}>{bulkActions}</div>
          <br />
        </p>
      </>
    );
  }

  let showResults;
  if (pageSize) {
    showResults = (
      <div className="pagination pagination-controls grid-row">
        <div className="grid-col show-count">
          <span>
            Go to page:{" "}
            <input
              type="number"
              value={
                totalRows > 0
                  ? currentPage !== undefined
                    ? currentPage + 1
                    : pageIndex + 1
                  : 0
              }
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
              aria-label="goto-page-input"
            />
          </span>
        </div>
        <div className="grid-col text-center pagination-controls">
          <button
            className={"usa-button usa-button--unstyled"}
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            aria-label="first-page"
          >
            {<MdFirstPage />}
          </button>
          &nbsp; &nbsp;
          <button
            className={"usa-button usa-button--unstyled"}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            aria-label="previous-page"
          >
            {<MdNavigateBefore />}
          </button>
          &nbsp; &nbsp;
          <span>
            Page{" "}
            <strong>
              {totalRows > 0
                ? currentPage !== undefined
                  ? currentPage + 1
                  : pageIndex + 1
                : 0}{" "}
              of {pageOptions.length}
            </strong>{" "}
          </span>
          &nbsp; &nbsp;
          <button
            className={"usa-button usa-button--unstyled"}
            onClick={() => nextPage()}
            disabled={!canNextPage}
            aria-label="next-page"
          >
            {<MdNavigateNext />}
          </button>
          &nbsp; &nbsp;
          <button
            className={"usa-button usa-button--unstyled"}
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            aria-label="last-page"
          >
            {<MdLastPage />}
          </button>
        </div>
        <div className="grid-col text-right page-viewer">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            aria-label="select rows per page"
          >
            {rowsPerPageOptions.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1>{title}</h1>
      {breakElement}
      {radioButtonFilterElement}
      <table
        {...getTableProps()}
        className={`usa-table ${customTableClass ? customTableClass : ""}`}
      >
        <caption className={"format-caption"}>
          {subHeaderComponent}
          {tabComponent}
          {showBulkActions}
        </caption>

        <thead>
          {showResults !== undefined && (
            <tr>
              <th
                colSpan={columns.length}
                scope="colgroup"
                className={"result-header"}
              >
                {showResults}
              </th>
            </tr>
          )}
          {pageSize && pagination("top")}
          {headerGroups.map((headerGroup) => (
            <>
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    key={`header-${index}`}
                    scope="col"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    width={column.width}
                    className={"table-header-row"}
                  >
                    {column.canGroupBy && aggregate ? (
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? <FaExpandAlt /> : <FaCompressAlt />}
                      </span>
                    ) : null}
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <FaCaretDown aria-label={"down desc"} />
                        ) : (
                          <FaCaretUp aria-label={"up desc"} />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                ))}
              </tr>
              {showFilters && toggleFilters && (
                <tr>
                  {headerGroup.headers.map((column, index) => (
                    <th key={`filter-${index}`}>
                      <div>
                        {column.id != "selection" &&
                          (column.canFilter
                            ? column.render("Filter")
                            : column.render("ApplyFilter"))}
                      </div>
                    </th>
                  ))}
                </tr>
              )}
            </>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {totalRows > 0 &&
            page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={`row-${i}`}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>
                        {cell.isGrouped ? (
                          <>
                            <span {...row.getToggleRowExpandedProps()}>
                              {row.isExpanded ? (
                                <FaChevronDown />
                              ) : (
                                <FaChevronRight />
                              )}
                            </span>{" "}
                            {cell.render("Cell")} ({row.subRows.length})
                          </>
                        ) : cell.isAggregated ? (
                          cell.render("Aggregated")
                        ) : cell.isPlaceholder ? null : (
                          cell.render("Cell")
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          {totalRows === 0 && !loading && (
            <tr>
              <td
                colSpan={columns.length}
                scope="colgroup"
                className={"pagination-header"}
              >
                No Records Found.
              </td>
            </tr>
          )}
          {pageSize && pagination("")}
        </tbody>
        {footerGroups && totalRows > 0 && (
          <tfoot>
            {footerGroups.map((group) => (
              <tr {...group.getFooterGroupProps()}>
                {group.headers.map((column) => (
                  <td
                    {...column.getFooterProps()}
                    className={"table-footer-row"}
                  >
                    {column.render("Footer")}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        )}
      </table>
      {showBulkActions}
      {isPaginationEnabled && showResults}
    </>
  );
}

export default PPMSDatatable;
