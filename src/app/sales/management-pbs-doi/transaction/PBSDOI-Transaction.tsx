import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { StrictMode } from "react";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import SalesSideNavPBSDOI from "../common/SideNav";
import { PageHelper, Paths } from "../../../Router";
import Update from "./update/Update";
import Create from "./create/Create";
import queryString from "query-string";
import Breadcrumb from "../common/Breadcrumb";
interface TransactionProps {
  actions?: any;
  location?: any;
  match: any;
}
const PBSDOITransaction = (props: TransactionProps) => {
  const { actions, location, match } = props;
  let saleId = null;
  let search = location.search;
  let query = queryString.parse(search);
  let zoneId = null;
  if (query?.zoneId) {
    zoneId = query.zoneId;
  }
  if (match.params.saleId) {
    saleId = match.params.saleId;
  }
  return (
    <StrictMode>
      <div className={"ui-ppms grid-row grid-gap-4"}>
        <Breadcrumb
          pathname={location.pathname}
          saleId={saleId}
          zoneId={zoneId}
        />
        <div className="grid-row header-row mb-3">
          <h1>SALE TRANSACTION</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Sales Management</h3>
                <SalesSideNavPBSDOI
                  saleId={saleId}
                  zoneId={zoneId}
                  currentPage={Paths.salesTransactionPBSDOI}
                />
              </nav>
            </div>
          </div>
        </div>
        <div className="ui-ppms usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          {saleId ? (
            <Update zoneId={zoneId} saleId={saleId} />
          ) : (
            <Create zoneId={zoneId} />
          )}
        </div>
      </div>
      <div className="grid-row grid-gap-2 next-prev-page">
        <div className="desktop:grid-col-3" />
        <div className="desktop:grid-col-9">
          {saleId && (
            <PPMSButton
              id={"create-property"}
              type={"button"}
              variant={"link"}
              className={"usa-link float-right"}
              label={"Lot Details >"}
              onPress={() => {
                PageHelper.openPage(
                  Paths.salesLotDetailsPBSDOI +
                    "/" +
                    saleId +
                    "?zoneId=" +
                    zoneId
                );
              }}
            />
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(PBSDOITransaction);
