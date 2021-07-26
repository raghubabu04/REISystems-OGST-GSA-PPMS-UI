import React, { useEffect, useState } from "react";
interface PPMSPaginationV2Props {
  totalPages: number;
  pageListLength: number;
  handlePageChange: any;
}
const PPMSPaginationV2 = (props: PPMSPaginationV2Props) => {
  const { totalPages, pageListLength, handlePageChange } = props;
  const [currentPage, setCurrentPage] = useState(1);
  let pageLength =
    pageListLength % 2 === 0 ? pageListLength : pageListLength + 1;
  const createPageList = (currentPage) => {
    let pageList = [];
    for (let i = 0; i <= pageLength; i++) {
      if (i < pageLength / 2) {
        if (currentPage - (pageLength / 2 - i) > 0) {
          pageList.push(currentPage - (pageLength / 2 - i));
        }
      } else if (i === pageLength / 2) {
        pageList.push(currentPage);
      } else {
        if (currentPage + (i - pageLength / 2) <= totalPages) {
          pageList.push(currentPage + (i - pageLength / 2));
        }
      }
    }
    return pageList;
  };

  const createButtonList = (currentPage) => {
    let pageList = createPageList(currentPage);
    return pageList.map((page, index) => (
      <>
        <button
          type={"button"}
          id={`page-${page}`}
          className={`usa-button usa-button--outline usa-button--unstyled ${
            page === currentPage
              ? "usa-step-indicator__current-step"
              : "usa-step-indicator__total-steps"
          }`}
          disabled={currentPage === page}
          onClick={() => onPageChange(page, "page")}
        >
          {page}
        </button>
      </>
    ));
  };
  const onPageChange = (page, action) => {
    switch (action) {
      case "page":
        handlePageChange(page);
        setCurrentPage(page);
        break;
      case "previous":
        handlePageChange(currentPage - 1);
        setCurrentPage(currentPage - 1);
        break;
      case "next":
        handlePageChange(currentPage + 1);
        setCurrentPage(currentPage + 1);
        break;
      case "first":
        handlePageChange(1);
        setCurrentPage(1);
        break;
      case "last":
        handlePageChange(totalPages);
        setCurrentPage(totalPages);
        break;
      default:
        break;
    }
  };

  useEffect(() => {}, []);
  return (
    <div className={"display-flex flex-column flex-align-center"}>
      <div className="usa-step-indicator__header">
        <h2 className="usa-step-indicator__heading pagination-v2-header">
          <span className="usa-step-indicator__heading-counter pagination-v2">
            <span className="usa-sr-only">Step</span>
            <button
              type={"button"}
              id={`page-first`}
              disabled={currentPage === 1}
              className="usa-button usa-button--outline usa-button--unstyled usa-step-indicator__total-steps"
              onClick={() => onPageChange("", "first")}
            >
              {`<< `}
            </button>
            <button
              type={"button"}
              id={`page-previous`}
              disabled={currentPage === 1}
              className="usa-button usa-button--outline usa-button--unstyled usa-step-indicator__total-steps"
              onClick={() => onPageChange("", "previous")}
            >
              {`<`}
            </button>
            {currentPage > pageLength / 2 + 1 && (
              <>
                <button
                  type={"button"}
                  id={`page-1`}
                  className="usa-button usa-button--outline usa-button--unstyled usa-step-indicator__total-steps"
                  onClick={() => onPageChange(1, "page")}
                >
                  {`1 `}
                </button>
                ...
              </>
            )}
            {createButtonList(currentPage)}
            {currentPage + pageLength / 2 < totalPages && (
              <>
                ...{" "}
                <button
                  type={"button"}
                  id={`page-${totalPages}`}
                  className="usa-button usa-button--outline usa-button--unstyled usa-step-indicator__total-steps"
                  onClick={() => onPageChange(totalPages, "page")}
                >
                  {`${totalPages}`}
                </button>
              </>
            )}
            <button
              type={"button"}
              id={"page-next"}
              disabled={currentPage === totalPages}
              className="usa-button usa-button--outline usa-button--unstyled usa-step-indicator__total-steps"
              onClick={() => onPageChange("", "next")}
            >
              {`>`}
            </button>
            <button
              type={"button"}
              id={"page-last"}
              disabled={currentPage === totalPages}
              className="usa-button usa-button--outline usa-button--unstyled usa-step-indicator__total-steps"
              onClick={() => onPageChange("", "last")}
            >
              {` >>`}
            </button>
          </span>
        </h2>
      </div>
    </div>
  );
};

export default PPMSPaginationV2;
