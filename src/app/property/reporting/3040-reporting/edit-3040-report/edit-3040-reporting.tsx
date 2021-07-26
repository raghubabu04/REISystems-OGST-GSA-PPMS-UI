import React, { StrictMode, useContext, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { PPMSAlert } from "../../../../../ui-kit/components/common/PPMS-alert";
import { Reporting3040Context } from "./reporting-3040-context";
import PPMSAccordion from "../../../../../ui-kit/components/common/accordion/PPMS-accordion";
import SideNav3040Reporting from "./sideNav-3040Reporting";
import Receipts3040 from "./receipts/receipts";
import Donations3040 from "./donations/donations";
import Transfers3040 from "./transfers/transfers";
import Comments3040 from "./comments/comments";
import { DisplayCard3040 } from "./display-card-3040";
import { ReportingButtons } from "./reporting-3040-buttons";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { PropertyApiService } from "../../../../../api-kit/property/property-api-service";
import {
  convertToNumber,
  donationsPublicAmountIndexs,
  donationsPublicOtherAmountIndexs,
  formatInventoryValue,
  formatNumber,
  miscAmountIndexs,
  miscOtherAmountIndexs,
  nonMiscAmountIndexs,
  nonMiscOtherAmountIndexs,
  nonProfitDonationsAmountIndexs,
  nonProfitDonationsOtherAmountIndexs,
  numberWithCommas,
  Quarters,
  ReportStatus,
  titleInfoTips,
  Titles3040,
  validateComments,
} from "./constants-3040";

import { Report3040Dto } from "./report3040DTO";
import { PageHelper, Paths } from "../../../../Router";
import { Form } from "react-bootstrap";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { ModalActionHistoryContent } from "../../../../sales/management/transactions/SalesTransaction";
import { UserUtils } from "../../../../../utils/UserUtils";
import { FaInfoCircle } from "react-icons/fa";
import { PPMSPopover } from "../../../../../ui-kit/components/common/PPMS-popover";

interface Edit3040Props {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
  view?: boolean;
}

function Edit3040Reporting(props: Edit3040Props) {
  const {
    editReporting3040State,
    updateEditReporting3040State,
    receipts3040State,
    updateReceipts3040State,
    donations3040State,
    updateDonations3040State,
    transfers3040State,
    updateTransfers3040State,
    comments3040State,
    updateComments3040State,
  } = useContext(Reporting3040Context);

  const propertyApiService = new PropertyApiService();

  const { addToast } = props.actions;

  useEffect(() => {
    propertyApiService
      .get3040Report(props.match.params.reportId)
      .then((response) => {
        let reportData = response.data;
        const { publicProfit } = donations3040State;
        const { nonProfit } = donations3040State;
        const { misc } = transfers3040State;
        const { nonMisc } = transfers3040State;
        if (props.view) {
          updateEditReporting3040State({
            viewEnabled: true,
          });
        }
        publicProfit.conversation = numberWithCommas(
          reportData?.donationConservation
        );
        publicProfit.assistanceToHomeless = numberWithCommas(
          reportData?.donationHomeless
        );
        publicProfit.assistanceToOlderAmericans = numberWithCommas(
          reportData?.donationOlder
        );
        publicProfit.FamiliesOrIndividuals = numberWithCommas(
          reportData?.donationFamily
        );
        publicProfit.economicDevelopment = numberWithCommas(
          reportData?.donationEconomic
        );
        publicProfit.education = numberWithCommas(
          reportData?.donationEducation
        );
        publicProfit.other = numberWithCommas(reportData?.donationOther);
        publicProfit.parksAndRecreation = numberWithCommas(
          reportData?.donationParks
        );
        publicProfit.publicHealth = numberWithCommas(
          reportData?.donationPublicHealth
        );
        publicProfit.publicSafety = numberWithCommas(
          reportData?.donationPublicSafety
        );
        publicProfit.tableConversation = numberWithCommas(
          reportData?.donationConservation
        );
        publicProfit.twoOrMore = numberWithCommas(
          reportData?.donationAboveMore
        );

        nonProfit.assistanceToHomeless = numberWithCommas(
          reportData?.nonProfitHomeless
        );
        nonProfit.assistanceToOlderAmericans = numberWithCommas(
          reportData?.nonProfitOlder
        );
        nonProfit.education = numberWithCommas(reportData?.nonProfitEducation);
        nonProfit.familiesOrIndividuals = numberWithCommas(
          reportData?.nonProfitFamilies
        );
        nonProfit.publicHealth = numberWithCommas(
          reportData?.nonProfitPublicHealth
        );

        misc.returnToFederal = numberWithCommas(reportData?.miscFederal);
        misc.sbaDisasterTransfers = numberWithCommas(
          reportData?.miscSbaDisaster
        );
        misc.sbaTransfers = numberWithCommas(reportData?.miscSba8a);
        misc.sbaVOSBtransfers = numberWithCommas(reportData?.miscSbaVosb);
        misc.seaTransfers = numberWithCommas(reportData?.miscSeaTrans);
        misc.transferToOther = numberWithCommas(reportData?.miscOtherStates);
        misc.transfersToSASP = numberWithCommas(reportData?.miscSasp);
        misc.transfersToVeteran = numberWithCommas(reportData?.miscVeterans);

        nonMisc.abandoned = numberWithCommas(reportData?.miscNonAbandoned);
        nonMisc.otherNegative = numberWithCommas(reportData?.miscNonNegative);
        nonMisc.sold = numberWithCommas(reportData?.miscNonSold);

        updateDonations3040State({
          publicProfit: publicProfit,
          nonProfit: nonProfit,
          donationSummary: formatNumber(
            donationSummaryValue(publicProfit, nonProfit)
          ),
        });

        updateTransfers3040State({
          misc: misc,
          nonMisc: nonMisc,
          transferSummary: formatNumber(transferSummaryValue(misc, nonMisc)),
        });

        updateEditReporting3040State({
          financialYear: reportData?.financialYear,
          beginningInventory: numberWithCommas(reportData?.beginningInventory),
          endingInventory: numberWithCommas(reportData?.endingInventory),
          quarter: reportData?.quarter,
          reportStatus: reportData?.status,
          reportStartDate: reportData?.startDate,
          reportState: reportData?.state,
          reportedDate: reportData?.reportedDate,
          reportEndDate: reportData?.endDate,
        });

        //receipts
        updateReceipts3040State({
          federalAgencyAmount: numberWithCommas(reportData?.receiptFedAgency),
          fromOtherStates: numberWithCommas(reportData?.receiptOtherStates),
          fromOverSeas: numberWithCommas(reportData?.receiptOverseas),
          pocAdjust: numberWithCommas(reportData?.receiptPocAdjust),
          receiptsSummary: numberWithCommas(reportData?.totalReceipts),
        });
        //comments
        updateComments3040State({
          gsaComments: reportData?.gsaComments,
          saspComments: reportData?.saspComments,
        });
      })
      .catch((error) => {});
  }, []);

  function transferSummaryValue(misc, nonMisc) {
    let transferSummary = 0;

    miscAmountIndexs.forEach((value) => {
      if (misc[value]) {
        transferSummary = +transferSummary + +convertToNumber(misc[value]);
      }
    });

    miscOtherAmountIndexs.forEach((value) => {
      if (misc[value]) {
        transferSummary = +transferSummary + +convertToNumber(misc[value]);
      }
    });

    nonMiscAmountIndexs.forEach((value) => {
      if (nonMisc[value]) {
        transferSummary = +transferSummary + +convertToNumber(nonMisc[value]);
      }
    });

    nonMiscOtherAmountIndexs.forEach((value) => {
      if (nonMisc[value]) {
        transferSummary = +transferSummary + +convertToNumber(nonMisc[value]);
      }
    });

    return transferSummary;
  }

  function donationSummaryValue(publicProfit, nonProfit) {
    let donationSummary = 0;

    donationsPublicAmountIndexs.forEach((value) => {
      if (publicProfit[value]) {
        donationSummary =
          +donationSummary + +convertToNumber(publicProfit[value]);
      }
    });

    donationsPublicOtherAmountIndexs.forEach((value) => {
      if (publicProfit[value]) {
        donationSummary =
          +donationSummary + +convertToNumber(publicProfit[value]);
      }
    });

    nonProfitDonationsAmountIndexs.forEach((value) => {
      if (nonProfit[value]) {
        donationSummary = +donationSummary + +convertToNumber(nonProfit[value]);
      }
    });

    nonProfitDonationsOtherAmountIndexs.forEach((value) => {
      if (nonProfit[value]) {
        donationSummary = +donationSummary + +convertToNumber(nonProfit[value]);
      }
    });

    return donationSummary;
  }

  function getData(): Report3040Dto {
    return {
      id: props.match.params.reportId,
      beginningInventory: convertToNumber(
        editReporting3040State.beginningInventory
      ),
      donationAboveMore: convertToNumber(
        donations3040State.publicProfit.twoOrMore
      ),
      donationEconomic: convertToNumber(
        donations3040State.publicProfit.economicDevelopment
      ),
      donationEducation: convertToNumber(
        donations3040State.publicProfit.education
      ),
      donationFamily: convertToNumber(
        donations3040State.publicProfit.FamiliesOrIndividuals
      ),
      donationHomeless: convertToNumber(
        donations3040State.publicProfit.assistanceToHomeless
      ),
      donationOlder: convertToNumber(
        donations3040State.publicProfit.assistanceToOlderAmericans
      ),
      donationOther: convertToNumber(donations3040State.publicProfit.other),
      donationParks: convertToNumber(
        donations3040State.publicProfit.parksAndRecreation
      ),
      donationPublicHealth: convertToNumber(
        donations3040State.publicProfit.publicHealth
      ),
      donationPublicSafety: convertToNumber(
        donations3040State.publicProfit.publicSafety
      ),
      donationConservation: convertToNumber(
        donations3040State.publicProfit.conversation
      ),
      endingInventory: editReporting3040State.endingInventory.replaceAll(
        ",",
        ""
      ),
      gsaComments: comments3040State.gsaComments
        ? comments3040State.gsaComments
        : "",
      miscFederal: convertToNumber(transfers3040State.misc.returnToFederal),
      miscNonAbandoned: convertToNumber(transfers3040State.nonMisc.abandoned),
      miscNonNegative: convertToNumber(
        transfers3040State.nonMisc.otherNegative
      ),
      miscNonSold: convertToNumber(transfers3040State.nonMisc.sold),
      miscOtherStates: convertToNumber(transfers3040State.misc.transferToOther),
      miscSasp: convertToNumber(transfers3040State.misc.transfersToSASP),
      miscSba8a: convertToNumber(transfers3040State.misc.sbaTransfers),
      miscSbaDisaster: convertToNumber(
        transfers3040State.misc.sbaDisasterTransfers
      ),
      miscSbaVosb: convertToNumber(transfers3040State.misc.sbaVOSBtransfers),
      miscSeaTrans: convertToNumber(transfers3040State.misc.seaTransfers),
      miscVeterans: convertToNumber(transfers3040State.misc.transfersToVeteran),
      nonProfitEducation: convertToNumber(
        donations3040State.nonProfit.education
      ),
      nonProfitFamilies: convertToNumber(
        donations3040State.nonProfit.familiesOrIndividuals
      ),
      nonProfitHomeless: convertToNumber(
        donations3040State.nonProfit.assistanceToHomeless
      ),
      nonProfitOlder: convertToNumber(
        donations3040State.nonProfit.assistanceToOlderAmericans
      ),
      nonProfitPublicHealth: convertToNumber(
        donations3040State.nonProfit.publicHealth
      ),
      quarter: editReporting3040State.quarter,
      receiptFedAgency: convertToNumber(receipts3040State.federalAgencyAmount),
      receiptOtherStates: convertToNumber(receipts3040State.fromOtherStates),
      receiptOverseas: convertToNumber(receipts3040State.fromOverSeas),
      receiptPocAdjust: convertToNumber(receipts3040State.pocAdjust),
      saspComments: comments3040State.saspComments
        ? comments3040State.saspComments
        : "",
      totalDeductions:
        +convertToNumber(transfers3040State.transferSummary) +
        +convertToNumber(donations3040State.donationSummary),
      totalReceipts: convertToNumber(receipts3040State.receiptsSummary),
      financialYear: editReporting3040State.financialYear,
      status: editReporting3040State.reportStatus,
      startDate: editReporting3040State.reportStartDate,
      state: editReporting3040State.reportState,
      reportedDate: editReporting3040State.reportedDate,
      endDate: editReporting3040State.reportEndDate,
    };
  }

  function handleSave() {
    propertyApiService
      .save3040Report(getData())
      .then((response) => {
        addToast({
          text: "Report saved successfully.",
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {});
  }

  function commentsSASPValidation(): boolean {
    if (UserUtils.isUserSA()) {
      let validation = validateComments(
        comments3040State.saspComments,
        donations3040State.publicProfit.other.length !== 0 ||
          transfers3040State.nonMisc.otherNegative.length !== 0 ||
          receipts3040State.pocAdjust.length !== 0,
        "SASP comments"
      );
      updateComments3040State({
        saspCommentsIsInValid: validation.isInvalid,
        saspCommentsIsValid: !validation.isInvalid,
        saspCommentsValidationMessage: validation.validationError,
      });
      return validation.isInvalid;
    } else {
      return false;
    }
  }

  function validationGSAComments(): boolean {
    if (UserUtils.isUserSA()) {
      return true;
    } else {
      let validation = validateComments(
        comments3040State.gsaComments,
        false,
        "Gsa comments"
      );
      updateComments3040State({
        gsaCommentsIsInValid: validation.isInvalid,
        gsaCommentsIsValid: !validation.isInvalid,
        gsaCommentsValidationMessage: validation.validationError,
      });
      return !validation.isInvalid;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    updateEditReporting3040State({
      isSubmitLoading: true,
      isSubmitDisabled: true,
      triggerValidation: true,
    });
    if (commentsSASPValidation() && UserUtils.isUserSA()) {
      event.stopPropagation();
      updateEditReporting3040State({
        isSubmitLoading: false,
        isSubmitDisabled: false,
        FormErrorMessage: "Error submitting request.",
        showErrorAlert: true,
      });
      updateComments3040State({
        saspCommentsIsInValid: true,
        saspCommentsIsValid: false,
      });
    } else if (validationGSAComments()) {
      propertyApiService
        .submit3040Report(getData())
        .then((response) => {
          updateEditReporting3040State({
            isSubmitLoading: false,
            isSubmitDisabled: false,
            FormErrorMessage: "",
            showErrorAlert: false,
          });

          props.history.push({
            pathname: `${Paths.reporting3040List}`,
          });
          addToast({
            text: "Report submitted successfully.",
            type: "success",
            heading: "Success",
          });
        })
        .catch((error) => {});
    } else {
      event.stopPropagation();
      updateEditReporting3040State({
        isSubmitLoading: false,
        isSubmitDisabled: false,
        FormErrorMessage: "Error submitting request.",
        showErrorAlert: true,
      });
    }
  }

  function toggleAccordion(event, section) {
    let openItems = editReporting3040State.accordion.openItems;
    let { accordion } = editReporting3040State;
    if (section === "All") {
      if (accordion["toggleAllAccordion"]) {
        openItems = [];
      } else {
        openItems = [
          "toggleReceiptsAccordion",
          "toggleDonationsAccordion",
          "toggleTransferAccordion",
          "toggleCommentsAccordion",
        ];
      }
      let isExpanded = !accordion["toggleAllAccordion"];
      accordion["toggleAllAccordion"] = isExpanded;
      accordion["toggleReceiptsAccordion"] = isExpanded;
      accordion["toggleDonationsAccordion"] = isExpanded;
      accordion["toggleTransferAccordion"] = isExpanded;
      accordion["toggleCommentsAccordion"] = isExpanded;
      accordion["openItems"] = openItems;
      updateEditReporting3040State({
        accordion: accordion,
      });
    } else {
      openSelectedAccordion(section, openItems, accordion);
    }
    event.stopPropagation();
  }

  function openSelectedAccordion(section, openItems, accordion) {
    const itemIndex = openItems.indexOf(section);
    if (!accordion[section]) {
      if (itemIndex === -1) {
        openItems.push(section);
      }
    } else {
      openItems.splice(itemIndex, 1);
    }
    accordion[section] = !accordion[section];
    accordion["openItems"] = openItems;
    accordion["toggleAllAccordion"] = openItems.length === 11;
    updateEditReporting3040State({
      accordion: accordion,
    });
  }

  function handleActionHistory() {
    const data = {
      params: {
        objectType: "REPORT",
        objectId: props.match.params.reportId,
      },
    };
    propertyApiService
      .getActionHistoryForObject(data)
      .then((response: any) => {
        updateEditReporting3040State({
          actionHistoryData: response.data,
          showActionHistoryModal: true,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  function handleCloseActionHistory() {
    updateEditReporting3040State({
      showActionHistoryModal: false,
    });
  }

  function handleCancel() {
    PageHelper.openPage(Paths.reporting3040List);
  }

  const Header = ({ title, summaryValue, positive }) => {
    return (
      <div className="grid-row">
        <div className="grid-col-3">
          {title}{" "}
          {titleInfoTips.get(title) && (
            <PPMSPopover
              trigger={["hover", "focus"]}
              id={`Inventory-InfoTip-${title}`}
              placement={"top"}
              popoverTitle={"Info"}
              popoverContent={titleInfoTips.get(title)}
              className={"usa-label form-label usa-label-float float-right"}
              triggerSource={
                <button
                  id={"comment-tooltip-button"}
                  type={"button"}
                  className={"usa-button  usa-button--unstyled infotip-margin"}
                >
                  <FaInfoCircle />
                </button>
              }
            />
          )}
        </div>
        {title !== Titles3040.COMMENTS && (
          <div className="grid-col-9 title-3040">
            {`${title} Summary: `}
            {positive ? (
              <a className={"postive-value"}>
                {summaryValue ? `+$${summaryValue}` : "+$0"}
              </a>
            ) : (
              <a className={"negative-value"}>
                {summaryValue ? `-$${summaryValue}` : "-$0"}
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  const items = [
    {
      title: (
        <Header
          title={Titles3040.RECEIPTS}
          summaryValue={`${receipts3040State.receiptsSummary}`}
          positive={true}
        />
      ),
      content: <Receipts3040 />,
      expanded: editReporting3040State.accordion.toggleReceiptsAccordion,
      id: "receipts-3040-report",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleReceiptsAccordion"),
    },
    {
      title: (
        <Header
          title={Titles3040.DONATIONS}
          summaryValue={`${donations3040State.donationSummary}`}
          positive={false}
        />
      ),
      content: <Donations3040 />,
      expanded: editReporting3040State.accordion.toggleDonationsAccordion,
      id: "donations-3040-report",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleDonationsAccordion"),
    },
    {
      title: (
        <Header
          title={Titles3040.TRANSFERS}
          summaryValue={`${transfers3040State.transferSummary}`}
          positive={false}
        />
      ),
      content: <Transfers3040 />,
      expanded: editReporting3040State.accordion.toggleTransferAccordion,
      id: "transfers-3040-report",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleTransferAccordion"),
    },
    {
      title: Titles3040.COMMENTS,
      content: <Comments3040 />,
      expanded: editReporting3040State.accordion.toggleCommentsAccordion,
      id: "comments-3040-report",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleCommentsAccordion"),
    },
  ];

  function approveEnabled(): boolean {
    if (UserUtils.isUserSA()) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <StrictMode>
      <div className={"want-list-data-creation grid-row ui-ppms"}>
        <div className="grid-row header-row mb-3">
          <h1>Edit 3040 Reporting</h1>
        </div>

        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <SideNav3040Reporting />
              </nav>
            </div>
          </div>
        </div>
        <div className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <div className={"desktop:grid-col-9"}>
            <PPMSAlert
              id={"form-verification-error-alert"}
              show={editReporting3040State.showErrorAlert}
              alertBody={editReporting3040State.FormErrorMessage}
              alertClassName={"form-verification-error"}
              alertVariant={"danger"}
              alertKey={"form-verification-error"}
            />
            {editReporting3040State.showErrorAlert && <hr />}
          </div>
          <br />
          <Form
            noValidate
            validated={editReporting3040State.isFormValidated}
            onSubmit={handleSubmit}
            className={"usa-accordion--bordered desktop:grid-col-8"}
            aria-multiselectable="true"
          >
            <div className={"grid-row grid-gap-6"}>
              {!props.view && (
                <ReportingButtons
                  saveFunction={handleSave}
                  isSubmitDisabled={editReporting3040State.isSubmitDisabled}
                  isSubmitLoading={editReporting3040State.isSubmitLoading}
                  approveEnabled={approveEnabled()}
                  cancelFunction={handleCancel}
                />
              )}
              <div className={props.view ? "grid-col" : "grid-row-col"}>
                <PPMSButton
                  variant={"primary"}
                  type={"button"}
                  label={"Action History"}
                  onPress={handleActionHistory}
                  id={"reporting-3040-action-history"}
                  className={"out-button"}
                />
              </div>
              <div
                className={props.view ? "grid-col title-3040" : "grid-row-col"}
              >
                <div className={"margin-top-2 col-md-auto"}>
                  <PPMSButton
                    variant={"link"}
                    className="usa-link float:right"
                    id={"expandToggle"}
                    type={"button"}
                    label={
                      editReporting3040State.accordion.toggleAllAccordion
                        ? "Collapse All"
                        : "Expand All"
                    }
                    onPress={(event) => toggleAccordion(event, "All")}
                    isDisabled={false}
                  />
                </div>
              </div>
            </div>
            <br />
            <DisplayCard3040
              fy={editReporting3040State.financialYear}
              beginningInventory={formatInventoryValue(
                editReporting3040State.beginningInventory
              )}
              endingInventory={formatInventoryValue(
                editReporting3040State.endingInventory
              )}
              quarter={Quarters.get(editReporting3040State.quarter)}
            />
            <PPMSAccordion bordered={true} items={items} />
            <br />
            <div className={"grid-row grid-gap-6"}>
              {!props.view && (
                <ReportingButtons
                  saveFunction={handleSave}
                  isSubmitDisabled={editReporting3040State.isSubmitDisabled}
                  isSubmitLoading={editReporting3040State.isSubmitLoading}
                  approveEnabled={approveEnabled()}
                  cancelFunction={handleCancel}
                />
              )}
              <div className={props.view ? "grid-col" : "grid-row-col"}>
                <PPMSButton
                  variant={"primary"}
                  type={"button"}
                  label={"Action History"}
                  onPress={handleActionHistory}
                  id={"reporting-3040-action-history"}
                  className={"out-button"}
                />
              </div>
            </div>
          </Form>
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <PPMSModal
          show={editReporting3040State.showActionHistoryModal}
          handleClose={handleCloseActionHistory}
          handleSave={() => {}}
          title={"Action History"}
          centered={true}
          backdrop={"static"}
          label={"Ok"}
          hideLabelCancel={true}
          hideLabel={
            editReporting3040State.showActionHistoryModal ? true : false
          }
          size={editReporting3040State.showActionHistoryModal ? "lg" : null}
          body={
            <ModalActionHistoryContent
              data={editReporting3040State.actionHistoryData}
              listID={"list-id"}
              title={""}
            />
          }
          id={"reporting-3040-history"}
        />
      </div>
    </StrictMode>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(Edit3040Reporting);
