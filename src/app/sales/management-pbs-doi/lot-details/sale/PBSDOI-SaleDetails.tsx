import * as React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { StrictMode, useEffect, useState } from "react";
import SalesSideNavPBSDOI from "../../common/SideNav";
import { PageHelper, Paths } from "../../../../Router";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { Description } from "../../common/Description";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { formatLotNumber } from "../property/common/constants/Utils";
import CreateUpdate from "./create-update/CreateUpdate";
import queryString from "query-string";
interface LotDetailsProps {
  actions?: any;
  location?: any;
  match: any;
}
const PBSDOISaleDetails = (props: LotDetailsProps) => {
  const { match, location } = props;
  let salesAPIService = new SalesApiService();
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
  const [lotInformation, updateLotInformation] = useState({
    lotNumber: null,
    itemName: null,
    lotStatus: null,
  });
  const [saleInformation, updateSaleInformation] = useState({
    salesNumber: null,
    salesMethod: null,
    status: null,
  });
  const getLotInformation = () => {
    salesAPIService
      .getSalesPBSDOI(saleId)
      .then((response1) => {
        updateSaleInformation(response1.data);
        salesAPIService
          .getStoreFrontProperty(lotId)
          .then((response2) => {
            updateLotInformation(response2.data);
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

  return (
    <StrictMode>
      <div className={"ui-ppms grid-row grid-gap-4"}>
        {/*<Breadcrumb*/}
        {/*  pathname={location.pathname}*/}
        {/*  saleId={saleId}*/}
        {/*/>*/}
        <div className="grid-row header-row mb-3">
          <h1>SALE DETAILS</h1>
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
                  currentPage={Paths.salesDetailsPBSDOI}
                />
              </nav>
            </div>
          </div>
        </div>
        <div className="ui-ppms usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <Description
            method={saleInformation?.salesMethod}
            number={
              saleInformation?.salesNumber +
              (lotInformation?.lotNumber
                ? formatLotNumber(lotInformation?.lotNumber.toString(), 3)
                : "")
            }
            propertyName={lotInformation?.itemName}
            status={saleInformation?.status}
            zoneId={zoneId}
            id={saleId}
          />
          <CreateUpdate
            saleId={saleId}
            saleNumber={saleInformation?.salesNumber}
            lotId={lotId}
            lotInformation={lotInformation}
            updateLotInformation={getLotInformation}
            lotStatus={lotInformation.lotStatus}
            saleMethod={saleInformation?.salesMethod}
          />
        </div>
      </div>
      <div className="grid-row grid-gap-2 next-prev-page">
        <div className="desktop:grid-col-3" />
        <div className="desktop:grid-col-9">
          <PPMSButton
            id={"lot-details"}
            type={"button"}
            variant={"link"}
            label={"< Add Property"}
            onPress={() =>
              PageHelper.openPage(
                Paths.salesAddPropertyPBSDOI +
                  "/" +
                  saleId +
                  "/" +
                  lotId +
                  "?zoneId=" +
                  zoneId
              )
            }
          />
          <PPMSButton
            id={"sale-details"}
            type={"button"}
            variant={"link"}
            className={"usa-link float-right"}
            label={"Finalize Sale >"}
            onPress={() => {
              PageHelper.openPage(
                Paths.salesFinalizePBSDOI +
                  "/" +
                  saleId +
                  "/" +
                  lotId +
                  "?zoneId=" +
                  zoneId
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

export default connect(mapStateToProps, mapDispatchToProps)(PBSDOISaleDetails);
