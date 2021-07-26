import React from "react";
import PPMSAccordion from "../common/accordion/PPMS-accordion";
import { FaShoppingCart } from "react-icons/fa";
import { PPMSButton } from "../common/PPMS-button";
import { PPMSProperty } from "./PPMS-property";
import { PPMSModal } from "../common/PPMS-modal";
import { PPMSTooltip } from "../common/PPMS-tooltip";
import { CgNotes } from "react-icons/cg";
import { PropertyGroupType } from "../../../app/property/create-update-property/constants/Constants";
interface PropertyGroupProps {
  handleAddToCart?: any;
  handleUpdateQuantity?: any;
  handleDeleteProperty?: any;
  handleDeleteTCN?: any;
  requests: any[];
  actionType?:
    | "Add to Cart"
    | "Update Quantity"
    | "Confirm_Cart"
    | "Submission"
    | "";
  checkout?: any;
  expand?: boolean;
  showCheckout: boolean;
  roles?: any;
  unitOfIssue?: any[];
  priorityCodes?: any[];
  priorityLabel: string;
  savePriority?: any;
  showPriorityModal?: any;
  isForeignGift?: boolean;
}
interface PropertyGroupState {
  showDeleteModal: boolean;
  tcnToDelete: string;
}
export class PPMSPropertyGroup extends React.Component<
  PropertyGroupProps,
  PropertyGroupState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      showDeleteModal: false,
      tcnToDelete: "",
    };
  }

  handleDeleteTCN = (event) => {
    event.stopPropagation();
    this.props.handleDeleteTCN(this.state.tcnToDelete, event);
    this.handleDeleteCloseModal(event);
  };
  handleDeleteCloseModal = (event) => {
    this.setState({
      showDeleteModal: false,
      tcnToDelete: "",
    });
  };
  handleDeleteOpenModal = (tcn, event) => {
    event.stopPropagation();
    this.setState({
      showDeleteModal: true,
      tcnToDelete: tcn,
    });
  };

  showPriorityModal(event: any, priorityData: any) {
    this.props.showPriorityModal(event, priorityData);
  }

  render() {
    let isConfirmInformation = window.location.href.includes(
      "confirmInformation"
    );
    let items = this.props.requests;
    let tcnItems = items
      ? items.map((item: any, index) => {
          const requestItems = item.requestItems?.map((requestItem: any) => {
            return (
              <>
                <PPMSProperty
                  key={requestItem.requestItem.propertyId}
                  propertyId={requestItem.requestItem.propertyId}
                  icn={requestItem.requestItem.itemControlNumber}
                  itemName={requestItem.requestItem.itemName}
                  location={requestItem.requestItem.location}
                  itemStatus={requestItem.requestItem.itemStatus}
                  federalSupplyClass={
                    requestItem.requestItem.federalSupplyClass
                  }
                  fscDescription={
                    requestItem.requestItem.federalSupplyClassDescription
                  }
                  fairMarketValue={requestItem.requestItem.fairMarketValue}
                  conditionCode={requestItem.requestItem.conditionCode}
                  originalAcquisitionCost={
                    requestItem.requestItem.originalAcquisitionCost
                  }
                  unitOfIssueValue={requestItem.requestItem.unitOfIssue}
                  reimbursementRequired={
                    requestItem.requestItem.reimbursementRequired
                  }
                  categoryName={requestItem.requestItem.categoryName}
                  agencyBureau={requestItem.requestItem.agencyBureau}
                  date_release={requestItem.requestItem.releaseDate}
                  categoryCode={requestItem.requestItem.categoryCode}
                  qty_available={requestItem.requestItem.quantityAvailable}
                  qty_requested={requestItem.requestItem.quantityRequested}
                  quantity={requestItem.requestItem.cartCount}
                  qty_req_by_me={requestItem.requestItem.quantityReqByMe}
                  thumb_image={requestItem.requestItem.presignedUrl}
                  addCartType={this.props.actionType}
                  propertyGroup={requestItem.requestItem.propertyGroup}
                  fiscalYear={requestItem?.requestItem?.giftInfoDTO?.fiscalYear}
                  administration={requestItem?.requestItem?.giftInfoDTO?.administration}
                  recipientName={(requestItem?.requestItem?.recipientDTO?.lastName  != null
                  && requestItem?.requestItem?.recipientDTO?.firstName != null) ?
                    requestItem?.requestItem?.recipientDTO?.lastName + ", " +
                    requestItem?.requestItem?.recipientDTO?.firstName : ""}
                  donorCountry={requestItem?.requestItem?.donorInfoDTO?.donorCountry}
                  donorName={requestItem?.requestItem?.donorInfoDTO?.lastName != null
                  && requestItem?.requestItem?.donorInfoDTO?.firstName != null?
                    requestItem.requestItem.donorInfoDTO.lastName + ", " +
                    requestItem.requestItem?.donorInfoDTO?.firstName : ""}
                  vaultLocation={requestItem?.requestItem?.giftInfoDTO?.vaultLocation}
                  vaultShelfNumber={requestItem?.requestItem?.giftInfoDTO?.vaultShelfNumber
                  }
                  handleAddToCart={(payload) => {
                    this.props.handleAddToCart(payload);
                  }}
                  handleUpdateQuantity={(payload) => {
                    this.props.handleUpdateQuantity(payload);
                  }}
                  handleDeleteProperty={(payload) => {
                    this.props.handleDeleteProperty(payload);
                  }}
                  requestedItemId={requestItem.requestItem.requestedItemId}
                  surplusReleaseDate={
                    requestItem.requestItem.surplusReleaseDate
                  }
                  priorityLabel={this.props.priorityLabel}
                  priorityCodes={this.props.priorityCodes}
                  priorityId={requestItem.requestItem.priorityCode}
                  savePriority={this.props.savePriority}
                  roles={this.props.roles}
                  isForeignGift={item.propertyGroup === "foreignGift"}
                  creationSource={
                    item.propertyGroup === "foreignGift" ? "foreignGift" : ""
                  }
                />
              </>
            );
          });
          return {
            title: (
              <>
                <div className={"accordion-custom"}>
                  <div className="accordion-custom-labels">
                    <div>
                      <span className="accordion-header-label">TCN:</span>{" "}
                      <span className="accordion-header-data">
                        {item.transferControlNumber?.replace(
                          /(.{2})(.{2})(.{6})/,
                          "$1-$2-$3"
                        )}
                      </span>
                    </div>
                    <div>
                      {item.propertyGroup !== PropertyGroupType.FOREIGN_GIFT ? (
                        <div>
                          <span className="accordion-header-label">
                            Location:
                          </span>
                          <span className="accordion-header-data">
                            {item.city}, {item.state}, {item.zip}{" "}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="accordion-header-label">Vault:</span>
                          <span className="accordion-header-data">
                            {" "}
                            {item.vaultLocation}
                            {" - "}
                            {item.vaultShelfNumber}
                          </span>
                        </div>
                      )}
                      {item.erd && !item.isSrd && (
                        <>
                          {" "}
                          | <span className="accordion-header-label">
                            ERD:
                          </span>{" "}
                          <span className="accordion-header-data">
                            {item.erd}
                          </span>
                        </>
                      )}{" "}
                      {item.srd && item.isSrd && (
                        <>
                          {" "}
                          | <span className="accordion-header-label">
                            SRD:
                          </span>{" "}
                          <span className="accordion-header-data">
                            {item.srd}
                          </span>
                        </>
                      )}{" "}
                      {item.priority && (
                        <>
                          {" "}
                          |{" "}
                          <span className="accordion-header-label">
                            Priority:
                          </span>{" "}
                          <span className="accordion-header-data">
                            {item.priority}{" "}
                            {item.justification && (
                              <PPMSTooltip
                                trigger={"focus"}
                                id={"other-info"}
                                placement={"right"}
                                tooltipContent={item.justification}
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
                        </>
                      )}
                    </div>
                  </div>
                  {this.props.showCheckout && (
                    <span className={"infected"}>
                      <>
                        {item.priority && (
                          <PPMSButton
                            id={item.transferControlNumber + "-updatePriority"}
                            label={"Update Justification"}
                            type={"button"}
                            className={"out-button"}
                            onPress={(event) => {
                              const tcn = item?.transferControlNumber;

                              const priorityId =
                                item?.requestItems[0]?.requestItem
                                  ?.priorityCode;
                              const justification =
                                item?.requestItems[0]?.requestItem
                                  ?.justification;
                              const priorityData = {
                                tcn: tcn,
                                priorityId: priorityId,
                                justification: justification,
                              };
                              this.showPriorityModal(event, priorityData);
                            }}
                          />
                        )}
                      </>
                      <PPMSButton
                        id={item.transferControlNumber + "-delete-tcn"}
                        label={"Delete"}
                        type={"button"}
                        className={"out-button"}
                        onPress={(event) =>
                          this.handleDeleteOpenModal(
                            item.transferControlNumber,
                            event
                          )
                        }
                      />
                      {!isConfirmInformation ? (
                        <PPMSButton
                          icon={<FaShoppingCart />}
                          id={item.transferControlNumber + "-checkout"}
                          label={" Checkout"}
                          type={"button"}
                          className={"out-button"}
                          onPress={(event) =>
                            this.props.checkout(
                              item.transferControlNumber,
                              event
                            )
                          }
                        />
                      ) : (
                        ""
                      )}
                    </span>
                  )}
                </div>
                <div className="grid-row grid-gap-4">
                  <PPMSModal
                    show={this.state.showDeleteModal}
                    handleClose={this.handleDeleteCloseModal}
                    handleSave={this.handleDeleteTCN}
                    title={"Delete TCN"}
                    centered={true}
                    backdrop={"static"}
                    label={"Yes"}
                    labelCancel={"No"}
                    body={<ModalDeleteContent />}
                    id={"delete-files"}
                  />
                </div>
              </>
            ),
            content: requestItems ? requestItems : [],
            expanded: !!this.props.expand,
            id: index + "-tcn",
            className: "myCustomAccordionItem",
          };
        })
      : [];
    return (
      <>
        <PPMSAccordion items={tcnItems} bordered={true} key={"item"} />
      </>
    );
  }
}

const ModalDeleteContent = () => {
  return (
    <div>
      <p>Are you sure you want to Delete TCN?</p>
    </div>
  );
};
