import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardFooter from "../../../ui-kit/components/common/card/PPMS-card-footer";
import { history } from "../../../_redux/_helpers/history";
import { Paths } from "../../Router";
import { bindActionCreators } from "redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { FilterContext } from "../FilterContext";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";
import PPMSPagination from "../../../ui-kit/components/common/pagination/PPMS-pagination";
import { PPMSTooltip } from "../../../ui-kit/components/common/PPMS-tooltip";
import { CgNotes } from "react-icons/cg";
import { PPMSSpinner } from "../../../ui-kit/components/common/PPMS-spinner";
import { PropertyGroupType } from "../create-update-property/constants/Constants";

export interface MyRequestListProps {
  authentication?: any;
  loggedIn?: boolean;
  permissions?: boolean;
  user?: any;
  aacs?: any[];
  currentPage?: any[];
  cartTotal: number;
  actions?: any;
  roles?: any;
  location?: Location;
}

const MyRequestsList2 = (props: MyRequestListProps) => {
  const [tcnItems, setTcnItems] = useState<Array<any>>([]);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setmodalType] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [totalRows, setTotalRows] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tcnToDelete, setTcnToDelete] = useState<string>("");

  const propertyApiService = new PropertyApiService();

  const { searchCriteria, hasQueryParams } = useContext(FilterContext);

  const getMyRequests = async (data) => {
    setIsLoading(true);

    data["searchCriteria"] = searchCriteria;
    try {
      let apiResponse = await propertyApiService.getMyRequests(data);
      let tcnItemsLength = apiResponse?.data?.myRequestsDTOS.length;
      if (tcnItemsLength === 0) {
        setTotalRows(0);
        setRowsPerPage(10);
        if (props.location.search) {
          setmodalType("myRequestsSearch");
          setShowModal(true);
          setModalMessage(`No records found for your search.`);
        }
      }
      setTcnItems(apiResponse.data.myRequestsDTOS);
      setError("");
      setIsLoading(false);
      setCurrentPage(
        tcnItemsLength > 0 ? apiResponse?.data?.currentPageNumber : 1
      );
      setTotalRows(tcnItemsLength > 0 ? apiResponse?.data?.totalElements : 0);
    } catch (error) {
      setError(`Error getting the list of requests.`);
      setIsLoading(false);
      console.error(
        `My request page has an error on getMyRequests:`,
        error?.message
      );
    }
  };

  const handleDeleteTCNSave = async () => {
    const { addToast } = props.actions;
    try {
      let apiResonseDelete = await propertyApiService.deleteTCN(tcnToDelete);
      if (apiResonseDelete.status === 200) {
        renderData();
        setTcnToDelete("");
        setShowModal(false);
        addToast({
          text: `TCN: ${tcnToDelete} successfully deleted!`,
          type: "success",
          heading: "Success",
        });
      }
    } catch (error) {
      addToast({
        text: "Error deleting the TCN. Please try again.",
        type: "error",
        heading: "Error",
      });
      setTcnToDelete("");
      setShowModal(false);
    }
  };

  const renderData = () => {
    let params = {
      page: 1,
      size: 10,
    };
    let data = {};
    data["params"] = params;
    getMyRequests(data);
  };

  useEffect(() => {
    if (hasQueryParams) renderData();
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

  const handleMyRequestsPageChange = async (page?: number, size?: number) => {
    setRowsPerPage(size);
    let data = prepareParamsForAPI(page, size);
    await getMyRequests(data);
  };

  const handleUpdateViewTCN = (tcn: string) => {
    history.push(Paths.tcnDetails + "/" + tcn);
  };

  const handleDeleteTCNOpen = (tcnNo: string) => {
    setShowModal(true);
    setTcnToDelete(tcnNo);
  };

  const handleDeleteClose = () => {
    setShowModal(false);
  };

  const pluralizeResults = (count, noun, suffix = "s") =>
    `${count} ${noun}${count !== 1 && count !== 0 ? suffix : ""}`;
  return isLoading ? (
    <div className="loader-container">
      <div className="loader">
        <PPMSSpinner
          animation={"border"}
          variant={"primary"}
          loadingText={"Loading..."}
        />
      </div>
    </div>
  ) : (
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
              Property Requests List - {pluralizeResults(totalRows, "Result")}
            </h2>
            {totalRows !== 0 && (
              <PPMSPagination
                page={currentPage}
                pageSize={rowsPerPage}
                totalRows={totalRows}
                onChangePage={(currentPage, pageSize) => {
                  handleMyRequestsPageChange(currentPage, pageSize);
                }}
              />
            )}
          </div>

          {tcnItems.map((item) => {
            return (
              <>
                <div className="ui-ppms">
                  <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
                    <PPMSCard className="">
                      <PPMSCardBody
                        id={item.cartRequestId}
                        className="non-tcn-main-row tcn-header-row card-header-height widget-header"
                      >
                        <div className="grid-row grid-gap">
                          <div className="tablet:grid-col">
                            <strong>
                              TCN:{" "}
                              {item.transferControlNumber?.replace(
                                /(.{2})(.{2})(.{6})/,
                                "$1-$2-$3"
                              )}
                            </strong>
                          </div>
                          <div className="tablet:grid-col tcn-header-status">
                            <strong>TCN status: </strong>
                            {item.requestStatus}
                          </div>
                        </div>
                      </PPMSCardBody>
                      <PPMSCardBody>
                        <div className="grid-row tcn-body-row">
                          <div className={"tablet:grid-col"}>
                            <ul
                              className={
                                "usa-list usa-list--unstyled wide-list"
                              }
                            >
                              <li>
                                {item.propertyGroup ===
                                PropertyGroupType.FOREIGN_GIFT ? (
                                  <>
                                    <strong>Vault Location: </strong>
                                    <span className={"tcn-data-point"}>
                                      {" "}
                                      {item.vaultLocation}
                                      {" - "}
                                      {item.vaultShelfNumber}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <strong>Location: </strong>
                                    <span className={"tcn-data-point"}>
                                      {item.city}, {item.state} {item.zip}{" "}
                                    </span>
                                  </>
                                )}
                              </li>
                              {item.priority && (
                                <li>
                                  <strong>Priority: </strong>
                                  <span className={"tcn-data-point"}>
                                    {item.priority}{" "}
                                    {item?.justification && (
                                      <PPMSTooltip
                                        trigger={"focus"}
                                        id={"other-info"}
                                        placement={"right"}
                                        tooltipContent={item?.justification}
                                        triggerSource={
                                          <button
                                            id={`other-info-button`}
                                            type={"button"}
                                            className={
                                              "usa-button usa-button--unstyled"
                                            }
                                            title="Additional Information"
                                          >
                                            <CgNotes />
                                          </button>
                                        }
                                      />
                                    )}
                                  </span>
                                </li>
                              )}

                              {item.erd && !item.isSrd && (
                                <li>
                                  <strong>Excess release date: </strong>
                                  <span className={"tcn-data-point"}>
                                    {item.erd}
                                  </span>
                                </li>
                              )}

                              {item.srd && item.isSrd && (
                                <li>
                                  <strong>Surplus release date: </strong>
                                  <span className={"tcn-data-point"}>
                                    {item.srd}
                                  </span>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </PPMSCardBody>
                      <PPMSCardFooter>
                        <div className="grid-row">
                          <div className={"grid-col"}>
                            {item.requestStatus === "Requested" && (
                              <PPMSButton
                                id={"delete-property"}
                                label={"Delete TCN"}
                                className={
                                  "delete-property out-button d-inline"
                                }
                                variant={"primary"}
                                onPress={() =>
                                  handleDeleteTCNOpen(
                                    item.transferControlNumber
                                  )
                                }
                              />
                            )}
                            <PPMSButton
                              id={"update-view-tcn-details"}
                              label={"Update / View TCN Details"}
                              className={"delete-property out-button d-inline"}
                              variant={"primary"}
                              onPress={() =>
                                handleUpdateViewTCN(item.transferControlNumber)
                              }
                            />
                          </div>
                        </div>
                      </PPMSCardFooter>
                    </PPMSCard>
                  </PPMSCardGroup>
                </div>
              </>
            );
          })}
        </div>
      </div>

      <div className={"grid-col"}>
        <PPMSModal
          show={showModal}
          handleClose={handleDeleteClose}
          handleSave={
            modalType === "myRequestsSearch"
              ? handleDeleteClose
              : handleDeleteTCNSave
          }
          title={
            modalType === "myRequestsSearch"
              ? "Property Request Search"
              : "Delete TCN"
          }
          centered={true}
          backdrop={"static"}
          label={modalType === "myRequestsSearch" ? "Ok" : "Yes"}
          labelCancel={modalType === "myRequestsSearch" ? "Cancel" : "No"}
          body={
            modalType === "myRequestsSearch" ? (
              modalMessage
            ) : (
              <ModalDeleteContent />
            )
          }
          id={
            modalType === "myRequestsSearch"
              ? "my-requests-modal"
              : "delete-tcn-modal"
          }
        />
      </div>
    </div>
  );
};

const ModalDeleteContent = () => {
  return (
    <div>
      <p>
        Are you sure you want to Delete TCN? This will remove all items on this
        TCN from your cart.
      </p>
    </div>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
const mapStateToProps = (state) => ({ roles: state.authentication.roles });
export default connect(mapStateToProps, mapDispatchToProps)(MyRequestsList2);
