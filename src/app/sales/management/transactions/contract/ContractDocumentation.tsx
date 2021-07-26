import React, { StrictMode, useContext, useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import SalesSideNav from "../../common/SideNav";
import PPMSAccordion from "../../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { ContractDocumentationContext } from "./ContractDocumentationContext";
import PPMSCard from "../../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../../../ui-kit/components/common/card/PPMS-card-body";
import ContractDetails from "./ContractDetails";
import ContractTransactionButtons from "./ContractTransactionButton";
import { PPMSCardGroup } from "../../../../../ui-kit/components/common/card/PPMS-card-group";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { UserUtils } from "../../../../../utils/UserUtils";
import { saleActions } from "../../../../../_redux/_actions/sale.actions";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { ContractUpload } from "../../../uploads/ContractUpload";
import * as queryString from "querystring";
import { Paths } from "../../../../Router";
interface ContractDocumentationProps {
  user?: any;
  roles?: any;
  location?: any;
  vieDocument;
  voidContract;
  match;
  sale;
}

const ContractDocumentation = (props: ContractDocumentationProps) => {
  const {
    contractDocumentationState,
    updateContractDocumentationState,
  } = useContext(ContractDocumentationContext);
  const { user, roles, location, match, sale } = props;
  const [defaultZoneId, setdefaultZoneId] = useState(
    UserUtils.getDefaultZones()
  );
  let saleId = "";
  if (match?.params?.saleId) {
    saleId = match?.params?.saleId;
  }
  let search = location.search;
  let query = queryString.parse(search);
  let contractNumbers = [];
  if (query["?contractNumber"] != null) {
    contractNumbers.push(query["?contractNumber"]);
  }

  let contractIds = [];
  if (query["?contractId"] != null) {
    contractIds.push(query["?contractId"]);
  }

  const saleService = new SalesApiService();

  useEffect(() => {
    getSaleDetails();
    getContract();
  }, []);

  const getContract = () => {
    saleService
      .getContractByContractId(contractIds[0])
      .then((res) => {
        updateContractDocumentationState({
          contractData: res.data.contractDTO,
          lotData: res.data.lotDTO,
        });
        let contractDetails = res.data.contractDTO;
        if (
          contractDetails?.useAlternateSco === true &&
          contractDetails?.contractAlternateScoContact?.email !==
            user.emailAddress
        ) {
          updateContractDocumentationState({ actionDisabled: true });
        } else if (
          contractDetails?.useAlternateSco === false &&
          (contractDetails?.contractScoContact?.email === user.emailAddress ||
            contractDetails?.contractAlternateScoContact?.email ===
              user.emailAddress)
        ) {
          updateContractDocumentationState({ actionDisabled: false });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function getSaleDetails() {
    saleService
      .getSaleDetails(saleId)
      .then((res) => {
        let state = contractDocumentationState;
        let details = res.data.salesNumberDetails;
        state.salesDetails = details;
        console.log("Sales Number Details ", res.data);
        let todaysDate = new Date(Date.now());
        todaysDate.setHours(0, 0, 0, 0);
        updateContractDocumentationState(state);
        if (
          details.sco.email === user.emailAddress ||
          details?.alternateSCO?.email === user.emailAddress ||
          roles.isSG
        ) {
          updateContractDocumentationState({
            actionDisabled: false,
          });
        } else {
          updateContractDocumentationState({
            actionDisabled: true,
          });
        }
      })
      .catch((err) => {});
  }
  const items = [
    {
      title: "Upload Documents",
      content: (
        <ContractUpload
          lotId={contractDocumentationState.lotData.lotId}
          saleId={saleId}
          lotNumber={contractDocumentationState.lotData.lotNumber}
          saleNumber={contractDocumentationState.salesDetails.salesNumber}
          actionDisabled={contractDocumentationState.actionDisabled}
          objectType={"CONTRACT"}
          contractId={contractIds[0]}
          onlyDocuments={true}
          fileInfectedStatus={(value) =>
            updateContractDocumentationState({ fileInfectedStatus: value })
          }
        />
      ),
      expanded: true,
      id: "gsa-poc-detail-id",
    },
  ];

  return (
    <StrictMode>
      <div className={"add-marketing-campaign grid-row ui-ppms"}>
        <Breadcrumb
          pathname={location.pathname}
          zoneId={defaultZoneId}
          saleId={sale.saleId}
          lotId={"lotId"}
        />
        <div className="grid-row header-row mb-3">
          <h1>CONTRACT DOCUMENTATION</h1>
        </div>
        <br />
        <br />
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Sales Management</h3>
                <SalesSideNav
                  saleId={sale.saleId}
                  zoneId={defaultZoneId}
                  currentPage={Paths.contractDocumentation}
                />
              </nav>
            </div>
          </div>
        </div>
        <div className={"usa-layout-docs__sidenav desktop:grid-col-9"}>
          <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
            <PPMSCard>
              <PPMSCardBody className="sale-number-details">
                <ContractDetails
                  saleId={sale.saleId}
                  contractNumber={
                    contractDocumentationState?.contractData?.contractNumber
                  }
                  contractStatus={
                    contractDocumentationState?.contractData?.contractStatus
                  }
                  bidderEmail={
                    contractDocumentationState?.contractData?.bidderEmail
                  }
                  fscCode={contractDocumentationState?.contractData?.fscCode}
                  paymentDate={
                    contractDocumentationState?.contractData?.paymentDate
                  }
                  removalDate={
                    contractDocumentationState?.contractData?.removalDate
                  }
                  salesNumber={
                    contractDocumentationState?.contractData?.salesNumber
                  }
                  contractId={
                    contractDocumentationState?.contractData?.contractId
                  }
                  lotNumber={contractDocumentationState?.lotData.lotNumber}
                  showCurrentItems={true}
                  showAvailableLots={true}
                  isPropertyCustodian={true}
                />
              </PPMSCardBody>
              <PPMSCardBody className="sale-number-details-2">
                <div className="tablet:grid-row">
                  <div className={"grid-row grid-gap-2 flex-justify"}>
                    <ContractTransactionButtons
                      voidContract={props.voidContract}
                      cancelFunction={() => {}}
                      showActionHistory={true}
                      roles={roles}
                      salesId={
                        contractDocumentationState.contractData.saleNumber
                      }
                      userEmail={""}
                      isSubmitDisabled
                      isSubmitLoading
                      viewDocumentVariant={"hide"}
                      viewDocument={props.vieDocument}
                      actionDisable={contractDocumentationState.actionDisabled}
                    />
                  </div>
                </div>
              </PPMSCardBody>
            </PPMSCard>
          </PPMSCardGroup>
          <br />
          <PPMSAccordion items={items} />
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
    updateSaleInfo: (
      saleId,
      saleNumber,
      saleAction,
      zone,
      contractNumber,
      contractId
    ) =>
      dispatch(
        saleActions.updateSaleInfo(
          saleId,
          saleNumber,
          saleAction,
          zone,
          contractNumber,
          contractId
        )
      ),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractDocumentation);
