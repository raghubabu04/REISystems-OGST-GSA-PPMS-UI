import React, {  StrictMode,
  useContext,
  useEffect,
  useState,
} from "react";
import Breadcrumb from "../common/Breadcrumb";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import SaleNumberDetails from "../common/SaleNumberDetails";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import queryString from "query-string";
import { LotReviewApprovalContext } from "./LotReviewApprovalContext";
import { MdEmail } from "react-icons/md";
import { ImPhone } from "react-icons/im";
import {
  formatPhone,
} from "../../../../ui-kit/utilities/FormatUtil";
import PPMSPagination from "../../../../ui-kit/components/common/pagination/PPMS-pagination";
import PPMSAccordion from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import SalesSideNav from "../common/SideNav";
import { PageHelper, Paths } from "../../../Router";
import {
  formatCurrency,
  numPadding,
} from "../../../../ui-kit/utilities/FormatUtil";
import Lot from "./Lot";

interface LotReviewApprovalProps {
  match: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  agencyBureaus: any;
  sale?: any;
  roles: any;
  user: any;
}

const LotReviewApproval = (props: LotReviewApprovalProps) => {
  const { match, location, agencyBureaus, roles, user } = props;
  const { addToast } = props.actions;
  let salesAPIService = new SalesApiService();
  const { lotReviewApprovalState, updateLotReviewApprovalState } = useContext(
    LotReviewApprovalContext
  );
  let search = location.search;
  let query = queryString.parse(search);

  const [pendingLots, setPendingLots] = useState("");
  const [accordion, setAccordion] = useState({
    all: false,
  });
  const [saleNumber, setSaleNumber] = useState("");
  let saleId = null;
  let custodianId = null;
  let lotId = null;
  let zoneId = null;
  if (match.params.saleId) {
    saleId = match.params.saleId;
  }
  if (match.params.custodianId) {
    custodianId = match.params.custodianId;
  }
  if (match.params.lotId) {
    lotId = match.params.lotId;
  }
  if (match.params.saleId) {
    zoneId = match.params.zoneId;
  }
  const [printLotIndex, setPrintLotIndex] = useState(-1);
  const [salesUsers, updateSalesUsers] = useState({
    loggedInUser: user?.emailAddress,
    sco: "",
    alternateSco: "",
    marketingSpecialist: "",
  });

  const toggleAccordion = (event, section, lots, accordionObject, lotOject) => {
    let state = lotReviewApprovalState;
    if (section !== null && section === "All") {
      lots.forEach((lot) => {
        lot.isExpanded = !accordionObject.all;
      });
      accordionObject.all = !accordionObject.all;
      state.data.lots = lots;
      updateLotReviewApprovalState(state);
      setAccordion(accordionObject);
    } else {
      lots.forEach((lot) => {
        if (lot.lotNumber === lotOject.lotNumber) {
          lot.isExpanded = !lotOject.isExpanded;
        }
      });
      state.data.lots = lots;
      updateLotReviewApprovalState(state);
    }
    event.stopPropagation();
  };

  useEffect(() => {
    let state = lotReviewApprovalState;
    state.other.agencyBureaus = agencyBureausList(agencyBureaus);
    updateLotReviewApprovalState(state);
    if (custodianId) {
      getCustodian(custodianId);
      getLotsByCustodian(
        custodianId,
        state.other.lots.page.currentPage,
        state.other.lots.page.pageSize
      );
    }
  }, [agencyBureaus]);

  useEffect(() => {
    if (printLotIndex !== -1) {
      window.print();
      setPrintLotIndex(-1);
    }
  }, [printLotIndex]);
  useEffect(() => {
    salesAPIService.getSaleDetails(saleId).then((response) => {
      let sale = response.data.salesNumberDetails;
      setSaleNumber(sale?.salesNumber);
      updateSalesUsers({
        loggedInUser: user?.emailAddress,
        sco: sale?.sco?.email,
        alternateSco: sale?.alternateSCO?.email,
        marketingSpecialist: sale?.marketingSpecialist?.email,
      });
    });
  }, []);

  const reload = () => {
    getLotsByCustodian(
      custodianId,
      lotReviewApprovalState.other.lots.page.currentPage,
      lotReviewApprovalState.other.lots.page.pageSize
    );
  };
  const agencyBureausList = (agencyBureaus) => {
    let agencyBureausList = [];
    if (agencyBureaus) {
      agencyBureausList = agencyBureaus.map((item) => {
        return {
          value: item.longName.trim(),
          agencyBureau: item.code + "-" + item.longName.trim(),
          id: item.code,
          isSelected: false,
        };
      });
    }
    return agencyBureausList;
  };
  const getCustodian = (custodianId) => {
    salesAPIService
      .getCustodianById(custodianId)
      .then((response) => {
        let state = lotReviewApprovalState;
        state.data.custodian = response.data;
        updateLotReviewApprovalState(state);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getLotsByCustodian = (custodianId, page, size) => {
    let params = {
      page: page,
      size: lotReviewApprovalState.other.lots.page.pageSize,
      lotId: query?.lotId ? query.lotId : null,
    };
    salesAPIService
      .getLotsForCustodian(custodianId, params)
      .then((response) => {
        let state = lotReviewApprovalState;
        state.data.lots = response.data.lots;
        state.data.lots.forEach((lot) => {
          lot.isExpanded = false;
        });
        state.other.lots.page.totalRows = response.data.totalElements;
        updateLotReviewApprovalState(state);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleLotPageChange = (currentPage, pageSize) => {
    accordion.all = false;
    setAccordion(accordion);
    let state = lotReviewApprovalState;
    state.other.lots.page.currentPage = currentPage;
    state.other.lots.page.pageSize = pageSize;
    updateLotReviewApprovalState(state);
    getLotsByCustodian(custodianId, currentPage, pageSize);
  };

  const numofPendingLot = (lotReviewApprovalState) => {
    const page = lotReviewApprovalState?.other?.lots?.page?.totalRows;
    const approveCount =
      lotReviewApprovalState?.data?.custodian?.lotApprovedCount;
    return page - approveCount;
  };
  return (
    <StrictMode>
      <div className={"ui-ppms grid-row grid-gap-4 lot-review"}>
        {user.userType === "SLS" ? (
          <Breadcrumb
            pathname={location.pathname}
            zoneId={query?.zoneId}
            saleId={saleId}
            lotId={query?.zoneId}
            custodianId={custodianId}
          />
        ) : (
          <></>
        )}
        <div className="grid-row header-row mb-3">
          <h1>Lot Review and Approval</h1>
        </div>
        {user.userType === "SLS" ? (
          <div className="usa-layout-docs__sidenav desktop:grid-col-3">
            <div className={`sticky-wrapper sticky`}>
              <div className={"sticky-inner"}>
                <nav aria-label="Secondary navigation">
                  <h3>Sales Management</h3>
                  <SalesSideNav
                    saleId={saleId}
                    zoneId={query.zoneId}
                    currentPage={Paths.salesLotReviewApproval}
                  />
                </nav>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div
          className={`ui-ppms usa-layout-docs__main ${
            user.userType === "SLS"
              ? "desktop:grid-col-9"
              : "desktop:grid-col-12"
          } usa-prose usa-layout-docs`}
        >
          <SaleNumberDetails
            saleId={saleId}
            zoneId={query.zoneId}
            isPropertyCustodian={roles?.isPC}
          />
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col-7"}>
              <h2 className={"lot-review-h2"}>PROPERTY CUSTODIAN</h2>
              <PropertyCustodian
                custodian={lotReviewApprovalState.data.custodian}
                agencyBureau={
                  lotReviewApprovalState.other.agencyBureaus?.filter(
                    (agencyBureau) => {
                      return (
                        agencyBureau.id ===
                        lotReviewApprovalState.data?.custodian
                          ?.custodianInformation?.agencyBureauCd
                      );
                    }
                  )[0]
                }
              />
            </div>
            <div className={"grid-col-5"}>
              <h2 className={"lot-review-h2"}>INSPECTION DATE AND TIME</h2>
              <LotsInspection
                inspection={lotReviewApprovalState.data.custodian}
              />
            </div>
          </div>
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <h2 className={"lot-review-h2"}>INSPECTION INSTRUCTIONS</h2>
              <InspectionInstructions
                instructions={
                  lotReviewApprovalState.data.custodian.instructions
                }
              />
            </div>
          </div>
          <br />
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <h3>
                Lot(s) Pending Review: {numofPendingLot(lotReviewApprovalState)}
              </h3>
            </div>
            <div className={"grid-col-12"}>
              <Lots
                key={"lots"}
                reload={reload}
                addToast={addToast}
                custodianId={custodianId}
                page={lotReviewApprovalState.other.lots.page}
                lots={lotReviewApprovalState.data.lots}
                printLotIndex={printLotIndex}
                setPrintLotIndex={setPrintLotIndex}
                handleLotPageChange={handleLotPageChange}
                roles={roles}
                salesUsers={salesUsers}
                accordion={accordion}
                toggleAccordion={toggleAccordion}
                saleId={saleId}
                saleNumber={saleNumber}
              />
            </div>
          </div>
        </div>
      </div>
    </StrictMode>
  );
};

const PropertyCustodian = ({ custodian, agencyBureau }) => {
  const info = custodian?.custodianInformation;
  const address = custodian?.custodianInformation?.addressDTO;
  return (
    <>
      <div className={"grid-row"}>
        <div className={"grid-col-12"}>
          <h3 className={"margin-bottom-0 margin-top-0"}>
            {info?.firstName} {info?.lastName} |{" "}
            <span className={"custodian"}>
              {address?.addressLine1 && address?.addressLine1.trim() !== ""
                ? `${address?.addressLine1.toLowerCase()}, `
                : ""}
              {address?.addressLine2 && address?.addressLine2.trim() !== ""
                ? `${address?.addressLine2.toLowerCase()}, `
                : ""}
              {address?.addressLine3 && address?.addressLine3.trim() !== ""
                ? `${address?.addressLine3.toLowerCase()}, `
                : ""}
              {address?.city && address?.city.trim() !== ""
                ? `${address?.city.toLowerCase()}, `
                : ""}
              {address?.state && address?.state.trim() !== ""
                ? address?.state
                : ""}{" "}
              {address?.zipCode && address?.zipCode.trim() !== ""
                ? address?.zipCode
                : ""}{" "}
              {address?.zipExtn && address?.zipExtn.trim() !== ""
                ? `-${address?.zipExtn}`
                : ""}{" "}
            </span>
            <br />
          </h3>
        </div>
        <div className={"grid-col-12"}>
          <h4 className={"margin-0"}>
            {agencyBureau?.agencyBureau && (
              <span className={"custodian"}>{agencyBureau?.agencyBureau} </span>
            )}
          </h4>
        </div>
        <div className={"grid-col-12"}>
          <h4 className={"margin-0"}>
            {info?.email && (
              <span className={"text-normal"}>
                <MdEmail size={"1.2em"} /> {info?.email.toLowerCase()}
              </span>
            )}{" "}
            {info?.phone && (
              <span className={"text-normal"}>
                <ImPhone size={"1.2em"} /> {formatPhone(info?.phone.toString())}
              </span>
            )}
          </h4>
        </div>
      </div>
    </>
  );
};

const LotsInspection = ({ inspection }) => {
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-12"}>
          <div className={"grid-row"}>
            The dates and times below are a general timeframe that we'd
            appreciate you being available to answer inquiries and schedule
            inspections.
          </div>
        </div>
      </div>
      <br />
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-6"}>
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>Inspection From</div>
            <div className={"grid-col-12"}>
              {inspection.inspectionFromDate ? (
                <strong>
                  {inspection.inspectionFromDate} @{" "}
                  {inspection.inspectionFromTime}
                </strong>
              ) : (
                "-"
              )}
            </div>
          </div>
        </div>
        <div className={"grid-col-6"}>
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>Inspection To</div>
            <div className={"grid-col-12"}>
              {inspection.inspectionToDate ? (
                <strong>
                  {inspection.inspectionToDate} @ {inspection.inspectionToTime}
                </strong>
              ) : (
                "-"
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const InspectionInstructions = ({ instructions }) => {
  return <>{instructions ? instructions : "-"}</>;
};

const Lots = ({
  lots,
  custodianId,
  addToast,
  reload,
  page,
  handleLotPageChange,
  printLotIndex,
  setPrintLotIndex,
  roles,
  salesUsers,
  toggleAccordion,
  accordion,
  saleId,
  saleNumber,
}) => {
  return (
    <>
      <div className="item-search-result hide-print">
        <PPMSPagination
          page={page.currentPage}
          pageSize={page.pageSize}
          totalRows={page.totalRows}
          onChangePage={(currentPage, pageSize) => {
            handleLotPageChange(currentPage, pageSize);
          }}
        />
        <div className={"grid-row margin-top-2"}>
          <>
            <PPMSButton
              variant={"link"}
              className="usa-link float:left"
              id={"expandToggle"}
              type={"button"}
              label={accordion.all ? "Collapse All" : "Expand All"}
              onPress={(event) =>
                toggleAccordion(event, "All", lots, accordion, null)
              }
            />
          </>
          <br />
        </div>
      </div>
      <br />
      <div className="item-search-result-wrapper">
        {lots?.map((lot, index) =>
          printLotIndex === -1 || printLotIndex === index ? (
            <>
              <PPMSAccordion
                key={`custodian-lot-view-${index}`}
                className={"custodian-lot-view"}
                items={[
                  {
                    title: (
                      <>
                        <div className={"grid-row grid-gap-2"}>
                          <div className={"grid-col-3"}>
                            <strong>Lot Number</strong>
                            <span className={"lot-content-header"}>
                              {numPadding(lot?.lotNumber, 3)}
                            </span>
                          </div>
                          <div className={"grid-col-3"}>
                            <strong>Lot Name </strong>
                            <span className={"lot-content-header"}>
                              {lot?.lotName ? lot.lotName : "-"}
                            </span>
                          </div>
                          <div className={"grid-col-3"}>
                            <strong>Starting Bid </strong>
                            <span className={"lot-content-header"}>
                              {formatCurrency.format(lot?.startingBid)}
                            </span>
                          </div>
                          <div className={"grid-col-3"}>
                            <strong>Reserve Price </strong>
                            <span className={"lot-content-header"}>
                              {formatCurrency.format(lot?.reservePrice)}
                            </span>
                          </div>
                        </div>
                      </>
                    ),
                    content: (
                      <Lot  
                        lot={lot}
                        addToast={addToast}
                        custodianId={custodianId}
                        index={index}
                        key={`lot-${index}`}
                        reload={reload}
                        setPrintLotIndex={setPrintLotIndex}
                        roles={roles}
                        salesUsers={salesUsers}
                        saleId={saleId}
                        saleNumber={saleNumber}
                      />
                    ),
                    expanded: lot?.isExpanded,
                    id: `custodian-lot-view-${index}`,
                    className: "custodian-lot-view",
                    handleToggle: (event) =>
                      toggleAccordion(event, null, lots, accordion, lot),
                  },
                ]}
              />
            </>
          ) : (
            <></>
          )
        )}
      </div>
      <br />
      <div className="item-search-result hide-print">
        <PPMSPagination
          page={page.currentPage}
          pageSize={page.pageSize}
          totalRows={page.totalRows}
          onChangePage={(currentPage, pageSize) => {
            handleLotPageChange(currentPage, pageSize);
          }}
        />
      </div>
      <div className="grid-row grid-gap-2 next-prev-page">
        <PPMSButton
          id={"sales-transaction"}
          type={"button"}
          variant={"link"}
          className={"usa-link"}
          label={"< Lot Management"}
          onPress={() => {
            PageHelper.openPage(Paths.custodianLotManagement);
          }}
        />
      </div>
    </>
  );
};



const mapStateToProps = (state) => ({
  agencyBureaus: state.common.agencyBureaus,
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSaleInfo: (saleId, saleNumber, saleAction, zone) =>
      dispatch(saleAction.updateSaleInfo(saleId, saleNumber, saleAction, zone)),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LotReviewApproval);
