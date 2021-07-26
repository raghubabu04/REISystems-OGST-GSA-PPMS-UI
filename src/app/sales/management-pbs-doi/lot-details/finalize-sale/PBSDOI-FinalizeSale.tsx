import React, { StrictMode, useContext, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { FinalizeSalePBSDOIContext } from "./PBSDOI-FinalizeSaleContext";
import SalesSideNavPBSDOI from "../../common/SideNav";
import { PageHelper, Paths } from "../../../../Router";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { Description } from "../../common/Description";
import queryString from "query-string";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import POCOpenHouseDetail from "./components/POCOpenHouseDetail";
import BidInformation from "./components/BidInformation";
import PropertyInformation from "./components/PropertyInformation";
import { formatSaleNumber } from "../../../../../ui-kit/utilities/FormatUtil";
import { AuctionsApiService } from "../../../../../api-kit/auctions/auctions-api-service";

interface LotDetailsProps {
  actions?: any;
  location?: any;
  match: any;
}
const PBSDOIFinalizeSale = (props: LotDetailsProps) => {
  const { location, match } = props;
  const { addToast } = props.actions;
  const { finalizeSalePBSDOIState, updateFinalizeSalePBSDOIState } = useContext(
    FinalizeSalePBSDOIContext
  );
  let salesAPIService = new SalesApiService();
  let auctionAPIService = new AuctionsApiService();
  let saleId = null;
  let lotId = null;
  if (match.params.saleId) {
    saleId = match.params.saleId;
  }
  if (match.params.lotId) {
    lotId = match.params.lotId;
  }
  let search = location.search;
  let query = queryString.parse(search);
  let zoneId = null;
  if (query?.zoneId) {
    zoneId = query.zoneId;
  }
  const getLotInformation = () => {
    salesAPIService
      .getSalesPBSDOI(saleId)
      .then((response1) => {
        let state = finalizeSalePBSDOIState;
        state.data.saleInformation = response1.data;
        updateFinalizeSalePBSDOIState(state);
        salesAPIService
          .getStoreFrontProperty(lotId)
          .then((response2) => {
            let state = finalizeSalePBSDOIState;
            state.data.lotInformation = response2.data;
            if (response2.data.lotStatus === "Closed") {
              state.other.disableButtons = true;
            } else {
              state.other.disableButtons = false;
            }
            updateFinalizeSalePBSDOIState(state);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getLotInformation();
  }, []);

  const copySale = () => {
    let state = finalizeSalePBSDOIState;
    state.other.disableButtons = true;
    updateFinalizeSalePBSDOIState(state);
    salesAPIService
      .copySaleForSalePBSDOI(lotId)
      .then((response) => {
        addToast({
          text: `Sale Copied.`,
          type: "success",
          heading: "Success",
        });
        PageHelper.openPage(
          `${Paths.salesLotDetailsPBSDOI}/${response.data.salesId}?zoneId=${zoneId}`
        );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        let state = finalizeSalePBSDOIState;
        state.other.disableButtons = false;
        updateFinalizeSalePBSDOIState(state);
      });
  };

  const finalizeSale = (lotInformation) => {
    let state = finalizeSalePBSDOIState;
    state.other.disableButtons = true;
    updateFinalizeSalePBSDOIState(state);
    let lotIds = [lotId];
    if (
      lotInformation?.itemName &&
      lotInformation?.auctionDetailsDTO?.saleStartDate
    ) {
      auctionAPIService
        .uploadSelectedLots(lotIds, zoneId)
        .then(() => {
          addToast({
            text: `Sale ${formatSaleNumber(
              finalizeSalePBSDOIState?.data?.saleInformation?.salesNumber
            )} was finalized.`,
            type: "success",
            heading: "Success",
          });
          PageHelper.openPage(
            `${Paths.salesLotDetailsPBSDOI}/${saleId}?zoneId=${zoneId}`
          );
        })
        .catch((error) => {
          console.error(error);
          addToast({
            text: `Sale could not be finalized.`,
            type: "error",
            heading: "Error",
          });
        })
        .finally(() => {
          let state = finalizeSalePBSDOIState;
          state.other.disableButtons = false;
          updateFinalizeSalePBSDOIState(state);
        });
    } else {
      let missing = !lotInformation?.itemName
        ? "Property Details"
        : "Sale Details";
      addToast({
        text: `${missing} are missing.`,
        type: "error",
        heading: "Error",
      });
      let state = finalizeSalePBSDOIState;
      state.other.disableButtons = false;
      updateFinalizeSalePBSDOIState(state);
    }
  };
  return (
    <StrictMode>
      <div className={"ui-ppms grid-row grid-gap-4"}>
        {/*<Breadcrumb*/}
        {/*  pathname={location.pathname}*/}
        {/*  saleId={saleId}*/}
        {/*/>*/}
        <div className="grid-row header-row mb-3">
          <h1>FINALIZE SALE</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Sales Management</h3>
                <SalesSideNavPBSDOI
                  saleId={saleId}
                  lotId={lotId}
                  zoneId={zoneId}
                  currentPage={Paths.salesFinalizePBSDOI}
                />
              </nav>
            </div>
          </div>
        </div>
        <div className="ui-ppms usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <Description
            method={finalizeSalePBSDOIState.data.saleInformation.salesMethod}
            number={finalizeSalePBSDOIState.data.saleInformation.salesNumber}
            status={finalizeSalePBSDOIState.data.saleInformation.status}
            propertyName={finalizeSalePBSDOIState.data.lotInformation.itemName}
            zoneId={zoneId}
            id={saleId}
          />
          <POCOpenHouseDetail
            lotInformation={finalizeSalePBSDOIState.data.lotInformation}
            sellingAgency={
              finalizeSalePBSDOIState.data.saleInformation.sellingAgency
            }
          />
          <BidInformation
            lotInformation={finalizeSalePBSDOIState.data.lotInformation}
          />
          <PropertyInformation
            lotInformation={finalizeSalePBSDOIState.data.lotInformation}
            lotId={lotId}
          />
          <br />
          <div className="grid-row grid-gap-2">
            <div className="grid-col">
              <div className={"grid-row grid-gap-3"}>
                <div className={"grid-col-2"}>
                  <PPMSButton
                    id={"save-property"}
                    label={"Finalize"}
                    type={"button"}
                    className={"primary"}
                    onPress={() =>
                      finalizeSale(
                        finalizeSalePBSDOIState?.data?.lotInformation
                      )
                    }
                    isDisabled={finalizeSalePBSDOIState?.other?.disableButtons}
                  />
                </div>
                <div className={"grid-col-3"}>
                  <PPMSButton
                    id={"add-new-property"}
                    label={"Copy Sale"}
                    type={"button"}
                    className={"primary"}
                    isDisabled={finalizeSalePBSDOIState?.other?.disableButtons}
                    onPress={copySale}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid-row grid-gap-2 next-prev-page">
        <div className="desktop:grid-col-3" />
        <div className="desktop:grid-col-9">
          <PPMSButton
            id={"sale-details"}
            type={"button"}
            variant={"link"}
            label={"< Sale Details"}
            onPress={() => {
              PageHelper.openPage(
                Paths.salesDetailsPBSDOI +
                  `/${saleId}/${lotId}?zoneId=${zoneId}`
              );
            }}
          />
        </div>
      </div>
    </StrictMode>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
});

export default connect(mapStateToProps, mapDispatchToProps)(PBSDOIFinalizeSale);
