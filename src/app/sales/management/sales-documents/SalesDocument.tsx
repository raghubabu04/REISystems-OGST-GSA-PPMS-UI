import React, { StrictMode, useContext, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { saleActions } from "../../../../_redux/_actions/sale.actions";
import SalesSideNav from "../common/SideNav";
import { PageHelper, Paths } from "../../../Router";
import queryString from "query-string";
import Breadcrumb from "../common/Breadcrumb";
import { Upload } from "./uploads/Upload";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { SalesDocumentContext } from "./SalesDocumentContext";
import SaleNumberDetails from "../common/SaleNumberDetails";

interface SalesDocumentationProps {
  user?: any;
  roles?: any;
  actions?: any;
  location?: any;
  updateSaleInfo?: any;
  sale?: any;
  match: any;
}
const SalesDocument = (props: SalesDocumentationProps) => {
  const salesApiService = new SalesApiService();
  const { updateSaleInfo, user, sale, match, roles, location } = props;
  const { salesDocumentState, updateSalesDocumentState } = useContext(
    SalesDocumentContext
  );

  let saleId = "";
  let zone = [];
  let search = location.search;
  let query = queryString.parse(search);
  if (match?.params?.saleId) {
    saleId = match?.params?.saleId;
  }
  if (query?.zoneId) {
    zone.push(query.zoneId);
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    getSalesUploadedFiles(saleId);
    getSaleNumberBySaleID(saleId);
  }, []);
  const getSaleNumberBySaleID = (saleId: string) => {
    salesApiService
      .getSaleDetails(saleId)
      .then((res) => {
        updateSalesDocumentState({
          salesNumber: res.data?.salesNumberDetails?.salesNumber,
        });
      })
      .catch((error) => console.log(error));
  };

  const getSalesUploadedFiles = (salesId: string) => {
    salesApiService
      .getSalesUploadedItems(salesId)
      .then((response: any) => {
        let docsFilesList = response?.data?.documents;
        updateSalesDocumentState({
          docsFilesList: docsFilesList,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  return (
    <StrictMode>
      <div className={"add-marketing-campaign grid-row ui-ppms"}>
        <Breadcrumb
          pathname={location.pathname}
          zoneId={query.zoneId}
          saleId={saleId}
        />
        <div className="grid-row header-row mb-3">
          <h1>Sales Documentation</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Sales Management</h3>
                <SalesSideNav
                  saleId={saleId}
                  zoneId={query.zoneId}
                  currentPage={Paths.salesDocument}
                />
              </nav>
            </div>
          </div>
        </div>
        <div className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <SaleNumberDetails saleId={parseInt(saleId)} zoneId={query.zoneId} />
          <Upload
            fileInfectedStatus={(value) =>
              updateSalesDocumentState({ fileInfectedStatus: value })
            }
            saleId={saleId}
            saleNumber={salesDocumentState.salesNumber}
          />
        </div>
      </div>
      <div className="grid-row grid-gap-2 next-prev-page">
        <div className="desktop:grid-col-3" />
        <div className="desktop:grid-col-9">
          <PPMSButton
            id={"sales-transaction"}
            type={"button"}
            variant={"link"}
            className={"usa-link"}
            label={"< Sales Transaction"}
            onPress={() =>
              PageHelper.openPage(
                Paths.salesTransaction +
                  "/" +
                  saleId +
                  "?zoneId=" +
                  query.zoneId
              )
            }
          />
          <PPMSButton
            id={"add-icn"}
            type={"button"}
            variant={"link"}
            className={"usa-link float-right"}
            label={"Add ICN's to Lot(s) >"}
            onPress={() =>
              PageHelper.openPage(
                Paths.salesAddICNToLot +
                  "/" +
                  saleId +
                  "?zoneId=" +
                  query.zoneId
              )
            }
          />
        </div>
      </div>
    </StrictMode>
  );
};
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSaleInfo: (saleId, saleNumber, saleAction, zone) =>
      dispatch(
        saleActions.updateSaleInfo(saleId, saleNumber, saleAction, zone)
      ),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SalesDocument);
