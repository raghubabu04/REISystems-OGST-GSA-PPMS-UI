import React, { useContext, useEffect, useState } from "react";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { history } from "../../../_redux/_helpers/history";
import { Paths } from "../../Router";
import { connect } from "react-redux";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { TCNTile } from "./TCNTile";
import PPMSPagination from "../../../ui-kit/components/common/pagination/PPMS-pagination";
import { FilterContext } from "../FilterContext";
import { TcnWorkFlowType } from "../create-update-property/constants/Constants";

interface AllocationsOrdersProps {
  /*** Tp check if it is for Allocations page or Approve Transfer Orders Page */
  workflow?: any;
  /***  Props related with Approve Transfer Orders page */
  tcnInfo?: any;
  history?: any;
  /***  Props related with Allocations page */
  roles?: any;
  location?: Location;
}

const AllocationsApproveTransferOrders = (props: AllocationsOrdersProps) => {
  const [tcnItems, setTcnItems] = useState<Array<any>>([]);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [totalRows, setTotalRows] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { searchCriteria, hasQueryParams } = useContext(FilterContext);
  const propertyApiService = new PropertyApiService();

  let apiServiceGetData: Function;
  let pathBaseUrl: string;
  let isApproveTransfer: boolean = false;
  let whichPageText: string;
  let isRequisitionTransfer: boolean = false;
  let isAllocation: boolean = false;
  let isConfirmedTransfer: boolean = false;

  switch (props.workflow) {
    case TcnWorkFlowType.ALLOCATIONS:
      apiServiceGetData = (data) => propertyApiService.getAllocations(data);
      pathBaseUrl = Paths.tcnAllocationDetails + "/";
      isAllocation = true;
      whichPageText = "Allocations";
      break;
    case TcnWorkFlowType.APPROVE_TRANSFER_ORDERS:
      apiServiceGetData = (data) => propertyApiService.getApprovals(data);
      pathBaseUrl = Paths.approveTransferOrderDetails + "/";
      isApproveTransfer = true;
      whichPageText = "Approve Transfer Orders";
      break;
    case TcnWorkFlowType.REQUISITION_TRANSFER_ORDERS:
      apiServiceGetData = (data) => propertyApiService.getRequisition(data);
      pathBaseUrl = Paths.requisitionTcnDetails + "/";
      isRequisitionTransfer = true;
      whichPageText = "Requisition Transfer Orders";
      break;
    case TcnWorkFlowType.COMPLETED_TRASFER:
      apiServiceGetData = (data) =>
        propertyApiService.getConfirmedTransferTcn(data);
      pathBaseUrl = Paths.completeTransferDetails + "/";
      isConfirmedTransfer = true;
      whichPageText = "Completed Transfers";
      break;
    default:
      break;
  }

  const getAllocationsApproveOrders = async (data) => {
    setIsLoading(true);
    data["searchCriteria"] = searchCriteria;
    try {
      let apiResponse = await apiServiceGetData(data);
      let tcnItemsLength = apiResponse?.data?.allocationDTOS.length;

      if (tcnItemsLength === 0) {
        setTotalRows(0);
        setRowsPerPage(10);
        if (props.location.search) {
          setShowModal(true);
          setModalMessage(`No records found for your search.`);
        }
      }
      setTcnItems(apiResponse.data.allocationDTOS);
      setError("");
      setIsLoading(false);
      setCurrentPage(
        tcnItemsLength > 0 ? apiResponse?.data?.currentPageNumber : 1
      );
      setTotalRows(tcnItemsLength > 0 ? apiResponse?.data?.totalElements : 0);
    } catch (error) {
      setError(`Error getting the ${whichPageText} requests.`);
      setIsLoading(false);
      console.error(
        `${whichPageText} Page has an error on getAllocationsFromAPI:`,
        error?.message
      );
    }
  };

  useEffect(() => {
    let params = {
      page: 1,
      size: 10,
    };
    let data = {};
    data["params"] = params;
    if (hasQueryParams) {
      getAllocationsApproveOrders(data);
    }
  }, [searchCriteria]);

  const prepareParamsForAPI = (page?: number, size?: number) => {
    let data = {
      params: {
        page: page ? page : 1,
        size: size ? size : rowsPerPage,
      },
    };
    return data;
  };

  const handleAllocationsPageChange = async (page?: number, size?: number) => {
    setRowsPerPage(size);
    let params = prepareParamsForAPI(page, size);
    await getAllocationsApproveOrders(params);
  };

  const handleViewAndAllocateTCN = (tcn: string) => {
    history.push(pathBaseUrl + tcn);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const requireDisabled = (item) => {
    let isRequiredDisabled: boolean;
    props.workflow === TcnWorkFlowType.ALLOCATIONS &&
    (item.requestStatus === "ALLOCATION_CONFIRMED" ||
      item.requestStatus === "ALLOCATION_DENIED")
      ? (isRequiredDisabled = true)
      : (isRequiredDisabled = false);
    return isRequiredDisabled;
  };

  const pluralizeResults = (count, noun, suffix = "s") =>
    `${count} ${noun}${count !== 1 && count !== 0 ? suffix : ""}`;

  return (
    <>
      <div className="grid-conatiner">
        <PPMSAlert
          id={"allocations-error-msg"}
          show={!!error}
          alertBody={error}
          alertClassName={"allocation-error"}
          alertKey={"allocation-error"}
          alertVariant={"danger"}
        />

        <div className="grid-row grid-gap-4">
          <div className="grid-col-12">
            <div className="item-search-result">
              <h2 className="item-search-result-header h-red">
                {whichPageText} List - {pluralizeResults(totalRows, "Result")}
              </h2>
              {totalRows !== 0 && (
                <PPMSPagination
                  page={1}
                  pageSize={rowsPerPage}
                  totalRows={totalRows}
                  onChangePage={(currentPage, pageSize) => {
                    handleAllocationsPageChange(currentPage, pageSize);
                  }}
                />
              )}
            </div>

            {isLoading
              ? null
              : tcnItems.map((item) => {
                  return (
                    <div>
                      <TCNTile
                        tcnInfo={item}
                        listPage={true}
                        approveTransfer={isApproveTransfer}
                        allocation={isAllocation}
                        requisition={isRequisitionTransfer}
                        comfirmedTransfer={isConfirmedTransfer}
                        handleViewAndAllocateTCN={handleViewAndAllocateTCN}
                        requireDisabled={requireDisabled}
                      />
                    </div>
                  );
                })}
          </div>
        </div>

        <PPMSModal
          body={modalMessage}
          id={"allocations-modal"}
          show={showModal}
          handleClose={handleClose}
          handleSave={handleClose}
          labelCancelVariant="hide"
          title={whichPageText + " Search"}
          label={"Ok"}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  roles: state.authentication.roles,
});

export default connect(mapStateToProps)(AllocationsApproveTransferOrders);
