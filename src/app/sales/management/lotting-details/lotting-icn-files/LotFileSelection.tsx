import React, { StrictMode, useEffect, useState } from "react";
import PPMSAccordion from "../../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { Upload } from "../../../uploads/Upload";
import SaleNumberDetails from "../../common/SaleNumberDetails";
import Breadcrumb from "../../common/Breadcrumb";
import SalesSideNav from "../../common/SideNav";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import queryString from "query-string";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import PPMSPagination from "../../../../../ui-kit/components/common/pagination/PPMS-pagination";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import PPMSAlert from "../../../../../ui-kit/components/common/alert/PPMS-alert";
import { Paths } from "../../../../Router";
interface LotDocumentSelectionProps {
  match: any;
  location: any;
  actions?: any;
}

const LotFileSelection = (props: LotDocumentSelectionProps) => {
  const [ICNs, setICNs] = useState([]);
  const [icnAccordionList, setICNAccordionList] = useState([]);
  const [alertInfo, updateAlertInfo] = useState(null);
  const [alertError, updateAlertError] = useState(null);
  const [accordion, setAccordion] = useState({
    all: true,
    openItems: [],
  });
  const [existingFiles, setExistingFiles] = useState({
    image: [],
    documents: [],
  });
  const [page, setPage] = useState({
    currentPage: 1,
    totalRows: 0,
    pageSize: 10,
  });
  const { match, location } = props;
  const { addToast } = props.actions;
  let saleService = new SalesApiService();
  let search = location.search;
  let query = queryString.parse(search);
  let saleId = null;
  let zoneId = null;
  if (match?.params?.saleId) {
    saleId = match.params.saleId;
  }
  if (query?.zoneId) {
    zoneId = query.zoneId;
  }

  useEffect(() => {
    loadExistingFilesList(query?.lotId, page.currentPage, page.pageSize);
  }, []);

  const addFilesToLot = (files, type, existingFiles) => {
    if (type === "Image(s)" && existingFiles.image.length + files.length > 25) {
      updateAlertError(
        <>
          You have reached the limit of 25 images that can be included in a Lot
          Auction View. You may delete previously selected images and attach
          additional ones if needed.
        </>
      );
    } else if (
      type === "Document(s)" &&
      existingFiles.documents.length + files.length > 10
    ) {
      updateAlertError(
        <>
          You have reached the limit of 10 documents that can be included in a
          Lot Auction View. You may delete previously selected documents and
          attach additional ones if needed.
        </>
      );
    } else {
      let data = {
        uploadItemDTOList: files,
        lotId: query?.lotId,
        salesId: saleId,
      };
      saleService
        .addLotFile(data)
        .then(() => {
          addToast({
            text: `${type} successfully added to the Lot.`,
            type: "success",
            heading: "Success",
          });
          updateAlertError(null);
          loadExistingFilesList(query?.lotId, page.currentPage, page.pageSize);
        })
        .catch((error) => {
          console.log(error);
          addToast({
            text: `${type} could not be added to the Lot.`,
            type: "error",
            heading: "Error",
          });
        });
    }
  };

  const loadExistingFilesList = (lotId, currentPage, size) => {
    let data = {
      lotId: lotId,
      params: {
        page: currentPage,
        size: page.pageSize,
      },
    };
    saleService
      .getICNListByLotId(data)
      .then((response) => {
        let state = page;
        state.totalRows = response.data.totalElements;
        setICNs(response.data.icnList);
        let accordion = prepareAccordion(response.data.icnList);
        getExistingFilesForLot(lotId, response.data.icnList, accordion);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getExistingFilesForLot = (lotId, icns, accordionObject) => {
    saleService
      .getLotUploadedItems(lotId)
      .then((response) => {
        setExistingFiles(response.data);
        updateAlertInfo(
          <>
            There are currently <strong>{response.data.image.length}</strong>{" "}
            Image(s) and <strong>{response.data.documents.length}</strong>{" "}
            Document(s) assigned to this Lot {query?.lotNumber}. You can add{" "}
            <strong>
              {25 - response.data.image.length < 0
                ? 0
                : 25 - response.data.image.length}
            </strong>{" "}
            more Image(s) and{" "}
            <strong>
              {10 - response.data.documents.length < 0
                ? 0
                : 10 - response.data.documents.length}
            </strong>{" "}
            more Document(s).
          </>
        );
        icnListValues(icns, response.data, accordionObject);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const prepareAccordion = (icns) => {
    let accordion = {
      all: true,
      openItems: icns,
    };
    icns.forEach((icn) => {
      accordion[icn] = true;
    });
    setAccordion(accordion);
    return accordion;
  };

  const icnListValues = (icns, existingFiles, accordionObject) => {
    let list = [];
    icns?.forEach((icn) => {
      list.push({
        title: (
          <>
            <Link to={`${Paths.viewProperty}/${icn}`}>
              {icn.length <= 14
                ? icn.replace(/(.{6})(.{4})(.{4})/, "$1-$2-$3")
                : icn.replace(/(.{6})(.{4})(.{4})(.+)/, "$1-$2-$3-$4")}
            </Link>
          </>
        ),
        content: (
          <>
            <Upload
              icn={icn}
              lotId={query?.lotId.toString()}
              selectFiles={true}
              selectedFiles={(files, type) =>
                addFilesToLot(files, type, existingFiles)
              }
              fileInfectedStatus={false}
              selectFilesLabel={{
                images: ` Add Image(s) to Lot ${query?.lotNumber}`,
                documents: ` Add Document(s) to Lot ${query?.lotNumber}`,
              }}
              existingFiles={existingFiles}
            />
          </>
        ),
        expanded: accordionObject[icn],
        id: `${icn}`,
        trigger: "common",
        className: "auction-view",
        handleToggle: (event) =>
          toggleAccordion(event, icn, icns, accordionObject),
      });
    });
    setICNAccordionList(list);
  };
  const handleICNListPageChange = (currentPage, pageSize) => {
    let state = page;
    page.currentPage = currentPage;
    page.pageSize = pageSize;
    setPage(state);
    loadExistingFilesList(query?.lotId, currentPage, pageSize);
  };
  const toggleAccordion = (event, section, icns, accordionObject) => {
    let openItems = accordionObject.openItems;
    if (section === "All") {
      openItems = [];
      if (!accordionObject.all) {
        openItems = [];
        icns.forEach((icn) => {
          openItems.push(icn);
        });
      }
      let isExpanded = !accordionObject.all;
      icns.forEach((icn) => {
        accordionObject[icn] = isExpanded;
      });
      accordionObject.all = !accordionObject.all;
      accordionObject["openItems"] = openItems;
      setAccordion(accordionObject);
      icnListValues(icns, existingFiles, accordionObject);
    } else {
      openSelectedAccordion(icns, section, openItems, accordionObject);
    }
    event.stopPropagation();
  };
  function openSelectedAccordion(icns, section, openItems, accordionObject) {
    const itemIndex = openItems.indexOf(section);
    let cloneOpenItems = openItems.slice();
    if (!accordionObject[section]) {
      //add to open item list
      if (itemIndex === -1) {
        cloneOpenItems.push(section);
      }
    } else {
      //remove from the openItems
      cloneOpenItems.splice(itemIndex, 1);
    }
    //update particular accordion state
    accordionObject[section] = !accordionObject[section];
    accordionObject["openItems"] = cloneOpenItems;
    accordionObject.all = cloneOpenItems.length === icns.length;
    icnListValues(icns, existingFiles, accordionObject);
    setAccordion(accordionObject);
  }
  return (
    <StrictMode>
      <div className={"ui-ppms grid-row grid-gap-4"}>
        <Breadcrumb
          pathname={location.pathname}
          zoneId={zoneId}
          saleId={saleId}
        />
        <div className="grid-row header-row mb-3">
          <h1>Select Images/Documents</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Sales Management</h3>
                <SalesSideNav
                  saleId={saleId}
                  zoneId={zoneId}
                  currentPage={Paths.salesLottingDetailsDocs}
                />
              </nav>
            </div>
          </div>
        </div>
        <div className="ui-ppms usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <SaleNumberDetails saleId={saleId} zoneId={zoneId} />
          <div className={"grid-row"}>
            <div className={"grid-col"}>
              {alertInfo && (
                <PPMSAlert type={"info"} noIcon>
                  {alertInfo}
                </PPMSAlert>
              )}
              {alertError && (
                <PPMSAlert type={"error"} noIcon>
                  {alertError}
                </PPMSAlert>
              )}
            </div>
          </div>
          <br />
          <div className={"grid-row"}>
            <div className={"grid-col"}>
              <PPMSButton
                variant={"link"}
                className="usa-link float-right"
                id={"expandToggle"}
                type={"button"}
                label={accordion.all ? "Collapse All" : "Expand All"}
                onPress={(event) =>
                  toggleAccordion(event, "All", ICNs, accordion)
                }
              />
            </div>
          </div>
          <br />
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <PPMSPagination
                page={page.currentPage}
                pageSize={page.pageSize}
                totalRows={page.totalRows}
                onChangePage={(currentPage, pageSize) => {
                  handleICNListPageChange(currentPage, pageSize);
                }}
              />
            </div>
          </div>
          <br />
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <PPMSAccordion items={icnAccordionList} />
            </div>
          </div>
          <br />
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <PPMSPagination
                page={page.currentPage}
                pageSize={page.pageSize}
                totalRows={page.totalRows}
                onChangePage={(currentPage, pageSize) => {
                  handleICNListPageChange(currentPage, pageSize);
                }}
              />
            </div>
          </div>
          <br />
          <div className={"grid-row"}>
            <HashLink
              to={
                Paths.salesLottingDetails +
                "/" +
                saleId +
                "?zoneId=" +
                zoneId +
                "&page=" +
                query?.page +
                "#lot-" +
                query?.lotId
              }
              scroll={(element) =>
                element.scrollIntoView({ behavior: "smooth" })
              }
              className={""}
              key="back-to-lotting"
            >
              {`< Back to Lotting Details`}
            </HashLink>
          </div>
        </div>
      </div>
    </StrictMode>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(LotFileSelection);
