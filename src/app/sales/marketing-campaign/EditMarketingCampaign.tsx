import React, {StrictMode, useContext, useEffect, useRef, useState,} from "react";
import {Form} from "react-bootstrap";
import {isFormSubmitted} from "../../../service/validation.service";
import {CommonApiService} from "../../../api-kit/common/common-api.service";
import moment from "moment";
import {Paths} from "../../Router";
import {PPMSAlert} from "../../../ui-kit/components/common/PPMS-alert";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";

import {connect} from "react-redux";
import {addToast} from "../../../_redux/_actions/toast.actions";
import {bindActionCreators} from "redux";
import {MarketingCampaignContext} from "./create-marketing-campaign/MarketingCampaignContext";
import MarketingCampaignSideNav from "./create-marketing-campaign/MarketingCampaignSideNav";
import MarketingCampaignButtons from "./create-marketing-campaign/MarketingCampaignButtons";
import {SalesApiService} from "../../../api-kit/sales/sales-api-service";
import {MarketingCampaignDto} from "../../models/MarketingCampaignModel";
import {CampaignDetailsClass} from "./create-marketing-campaign/campaign/CampaignDetailsClass";
import {ItemSelectionCriteriaClass} from "./create-marketing-campaign/item-selection-criteria/ItemSelectionCriteriaClass";
import {BidderSelectionCriteriaClass} from "./create-marketing-campaign/bidder-selection/BidderSelectionCriteriaClass";
import {EmailSelectionCriteriaClass} from "./create-marketing-campaign/email-criteria/EmailSelectionCriteriaClass";
import {
  validateCampaignName,
  validateCampaignRun,
  validateFsc,
  verifyCampaignName,
} from "./validations/AddEditCampaignValidations";
import {PPMSModal} from "../../../ui-kit/components/common/PPMS-modal";
import {SalesUpload} from "./create-marketing-campaign/SalesUpload";
import {NotificationApiService} from "../../../api-kit/notification/notification-api.service";

export interface EditMarketingCampaignProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

export function EditMarketingCampaign(props: EditMarketingCampaignProps) {
  const [isSticky, setSticky] = useState(false);
  const ref = useRef(null);
  const handleScroll = () => {
    if (ref.current) {
      setSticky(ref.current.getBoundingClientRect().top <= 0);
    }
  };

  const {
    //Marketing Campaign Page
    marketingCampaignState,
    updateMarketingCampaignState,

    //Campaign Details
    campaignDetailsState,
    updateCampaignDetailsState,

    //Item Selection Criteria
    itemSelectionCriteriaState,
    updateItemSelectionCriteriaState,

    //Bidder Selection
    bidderSelectionState,
    updateBidderSelectionState,

    //Email Selection Criteria
    emailSelectionCriteriaState,
    updateEmailSelectionCriteriaState,
  } = useContext(MarketingCampaignContext);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // setDefaultValues()
    let emailTemplates;
    notificationService.getTemplates().then((response) => {
      emailTemplates = response?.data;
      let optionsArray = [];
      emailTemplates.forEach((item) => {
        optionsArray.push({
          id: item.notificationTemplateId,
          value: item.notificationTemplateName,
        });
      });
      updateEmailSelectionCriteriaState({
        emailTemplateOptions: optionsArray,
        emailTemplateList: response?.data,
      });
    });
    commonApiService
      .getFSCCodes()
      .then((resp: any) => {
        updateItemSelectionCriteriaState({
          fscOptions: resp?.data,
        });
        let fscArrayOptions = resp?.data;
        salesApiService
          .getCampaignDetailsById(props.match.params.campaignId)
          .then((response) => {
            let marketingCampaignResponse = response?.data;
            verifyCampaignName(
              marketingCampaignResponse?.campaignName,
              updateCampaignDetailsState
            );

            updateCampaignDetailsState({
              campaignId: marketingCampaignResponse?.campaignId
                ? marketingCampaignResponse?.campaignId
                : "",
              campaignName: marketingCampaignResponse?.campaignName
                ? marketingCampaignResponse?.campaignName
                : "",
              campaignStartDate: marketingCampaignResponse?.campaignStartDate
                ? moment(
                    marketingCampaignResponse?.campaignStartDate,
                    "YYYY-MM-DD"
                  ).toDate()
                : "",
              campaignEndDate: marketingCampaignResponse?.campaignEndDate
                ? moment(
                    marketingCampaignResponse?.campaignEndDate,
                    "YYYY-MM-DD"
                  ).toDate()
                : "",

              campaignRun: marketingCampaignResponse?.campaignFrequency
                ? marketingCampaignResponse?.campaignFrequency
                : "",
            });
            let fscSelectedValue = fscArrayOptions.find((option) => {
              return option.code === marketingCampaignResponse.fscCode;
            });
            updateItemSelectionCriteriaState({
              fscSelectedValues: fscSelectedValue ? [fscSelectedValue] : [],
              saleItemNumber: marketingCampaignResponse?.saleItemNumber
                ? marketingCampaignResponse?.saleItemNumber
                : "",
              bidAmountRangeFrom: marketingCampaignResponse?.bidAmountStart
                ? "$" + marketingCampaignResponse?.bidAmountStart
                : "",
              bidAmountRangeTo: marketingCampaignResponse?.bidAmountEnd
                ? "$" + marketingCampaignResponse?.bidAmountEnd
                : "",
              bidderNumFrom: marketingCampaignResponse?.biddersFrom
                ? marketingCampaignResponse?.biddersFrom
                : "",
              bidderNumTo: marketingCampaignResponse?.biddersTo
                ? marketingCampaignResponse?.biddersTo
                : "",
              auctionStart: marketingCampaignResponse?.auctionStart
                ? marketingCampaignResponse?.auctionStart
                : "",
              auctionEnd: marketingCampaignResponse?.auctionEnd
                ? marketingCampaignResponse?.auctionEnd
                : "",
              selectItem: marketingCampaignResponse?.itemSortType
                ? marketingCampaignResponse?.itemSortType
                : "",
            });
            updateBidderSelectionState({
              lastBiddenDate: marketingCampaignResponse?.bidderFscSameAs
                ? marketingCampaignResponse?.bidderFscSameAs
                : "",
              includeBidders: marketingCampaignResponse?.includeBidderType
                ? marketingCampaignResponse?.includeBidderType
                : "",
            });
            let selectedTemplateId = marketingCampaignResponse?.templateId
              ? marketingCampaignResponse?.templateId
              : "";
            let templates = emailTemplates;
            let selectedTemplate = undefined;
            if (templates) {
              selectedTemplate = templates.find(
                (template) =>
                  template.notificationTemplateId.toString() ===
                  selectedTemplateId.toString()
              );
            }
            updateEmailSelectionCriteriaState({
              sendEmailTo: marketingCampaignResponse?.sendEmailTo
                ? marketingCampaignResponse?.sendEmailTo
                : "",
              emailTemplateSelectedValue: marketingCampaignResponse?.templateId
                ? marketingCampaignResponse?.templateId
                : "",
              customEmailTemplateValue: selectedTemplate
                ? selectedTemplate.notificationTemplateContent
                : "",
            });
          });
      })
      .catch((error) => {
        console.log(error);
      });

    isFormSubmitted.next(false);
    return () => {
      window.removeEventListener("scroll", () => handleScroll);
    };
  }, []);
  const isButtonDisabled = () => {
    updateMarketingCampaignState({ isSubmitDisabled: true });
  };
  const isButtonEnabled = () => {
    updateMarketingCampaignState({ isSubmitDisabled: false });
  };
  const items = [
    {
      title: "Campaign Details",
      content: <CampaignDetailsClass />,
      expanded: marketingCampaignState.accordianExpanded,
      id: "campaign-details-id",
      trigger: "common",
    },
    {
      title: "Item Selection Criteria",
      content: <ItemSelectionCriteriaClass />,
      expanded: marketingCampaignState.accordianExpanded,
      id: "item-selection-criteria-id",
      trigger: "common",
    },
    {
      title: "Bidder Selection Criteria",
      content: <BidderSelectionCriteriaClass />,
      expanded: marketingCampaignState.accordianExpanded,
      id: "bidder-selection-criteria-id",
      trigger: "common",
    },
    {
      title: "Email Selection Criteria",
      content: <EmailSelectionCriteriaClass />,
      expanded: marketingCampaignState.accordianExpanded,
      id: "email-selection-criteria-id",
      trigger: "common",
    },
    {
      title: "Upload Images and Documents",
      content: (
        <SalesUpload
          disabled={false}
          campaignId={campaignDetailsState.campaignId}
          fileInfectedStatus={(value) => alert("File virus status:" + value)}
          onFilesUpdated={(files) => {
            updateCampaignDetailsState({ uploadedFiles: files });
          }}
          isButtonDisabled={isButtonDisabled}
          isButtonEnabled={isButtonEnabled}
        />
      ),
      expanded: marketingCampaignState.accordianExpanded,
      id: "upload-selection-criteria-id",
      trigger: "common",
    },
  ];

  let commonApiService = new CommonApiService();
  let salesApiService = new SalesApiService();
  let notificationService = new NotificationApiService();

  function toJSON(status: string): MarketingCampaignDto {
    removeCommaBidAmount();
    return ({
      campaignStatus: status,
      campaignId: campaignDetailsState.campaignId,
      campaignName: campaignDetailsState.campaignName,
      campaignFrequency:
        campaignDetailsState.campaignRun === ""
          ? null
          : campaignDetailsState.campaignRun,
      campaignStartDate: campaignDetailsState.campaignStartDate
        ? moment(campaignDetailsState.campaignStartDate).format(
            "YYYY-MM-DDTHH:mm:ss"
          )
        : null,
      campaignEndDate: campaignDetailsState.campaignStartDate
        ? moment(campaignDetailsState.campaignEndDate).format(
            "YYYY-MM-DDTHH:mm:ss"
          )
        : null,

      fscCode: itemSelectionCriteriaState?.fscSelectedValues[0]?.code,
      saleItemNumber: itemSelectionCriteriaState.saleItemNumber,
      bidAmountStart: itemSelectionCriteriaState.bidAmountRangeFrom,
      bidAmountEnd: itemSelectionCriteriaState.bidAmountRangeTo,
      biddersFrom: itemSelectionCriteriaState.bidderNumFrom,
      biddersTo: itemSelectionCriteriaState.bidderNumTo,
      auctionStart:
        itemSelectionCriteriaState.auctionStart === ""
          ? null
          : itemSelectionCriteriaState.auctionStart,
      auctionEnd:
        itemSelectionCriteriaState.auctionEnd === ""
          ? null
          : itemSelectionCriteriaState.auctionEnd,
      itemSortType:
        itemSelectionCriteriaState.selectItem === ""
          ? null
          : itemSelectionCriteriaState.selectItem,

      bidderFscSameAs:
        bidderSelectionState.lastBiddenDate === ""
          ? null
          : bidderSelectionState.lastBiddenDate,
      includeBidderType:
        bidderSelectionState.includeBidders === ""
          ? null
          : bidderSelectionState.includeBidders,

      sendEmailTo:
        emailSelectionCriteriaState.sendEmailTo === ""
          ? null
          : emailSelectionCriteriaState.sendEmailTo,
      templateId: emailSelectionCriteriaState.emailTemplateSelectedValue,
      uploadCampaignDocList: campaignDetailsState.uploadedFiles,
    } as unknown) as MarketingCampaignDto;
  }

  function removeCommaBidAmount() {
    if (itemSelectionCriteriaState.bidAmountRangeFrom) {
      itemSelectionCriteriaState.bidAmountRangeFrom = itemSelectionCriteriaState?.bidAmountRangeFrom
        .toString()
        .replace("$", "")
        .replace(/,/g, "");
    }
    if (itemSelectionCriteriaState.bidAmountRangeTo) {
      itemSelectionCriteriaState.bidAmountRangeTo = itemSelectionCriteriaState?.bidAmountRangeTo
        .toString()
        .replace("$", "")
        .replace(/,/g, "");
    }
  }

  function saveCampaignDraft() {
    const payload = toJSON("DRAFT");
    const { addToast } = props.actions;
    let isCampaignNameProvided = campaignDetailsState.campaignName
      ? campaignDetailsState.campaignName
      : null;
    let errorMessage = validateCampaignName(campaignDetailsState.campaignName);
    verifyCampaignName(
      campaignDetailsState.campaignName,
      updateCampaignDetailsState
    );
    if (isCampaignNameProvided === null) {
      updateCampaignDetailsState({
        campaignNameIsInvalid: true,
        campaignNameValidationMessage: "Campaign name field is required.",
      });
    } else if (errorMessage.isInvalid) {
      updateCampaignDetailsState({
        campaignNameValidationMessage: errorMessage.validationError,
        campaignNameIsInvalid: errorMessage.isInvalid,
      });
    } else {
      salesApiService
        .saveMarketingCampaign(payload)
        .then(() => {
          addToast({
            text: "Draft saved successfully",
            type: "success",
            heading: "Success",
          });
        })
        .catch(() => {
          addToast({
            text: "Error saving campaign draft",
            type: "error",
            heading: "Error",
          });
        });
    }
  }

  function handleCancel() {
    isFormSubmitted.next(false);
    props.history.push({
      pathname: `${Paths.manageMarketingCampaign}`,
    });
  }

  function checkRequiredField() {
    let errorMessage = validateCampaignName(campaignDetailsState.campaignName);
    if (errorMessage) {
      updateCampaignDetailsState({
        campaignNameValidationMessage: errorMessage.validationError,
        campaignNameIsInvalid: errorMessage.isInvalid,
      });
    }

    let errorMessage1 = validateCampaignRun(campaignDetailsState.campaignRun);
    if (errorMessage1) {
      updateCampaignDetailsState({
        campaignRunValidationMessage: errorMessage1.validationError,
        campaignRunIsInvalid: errorMessage1.isInvalid,
      });
    }

    let errorMessage2 = validateFsc(
      itemSelectionCriteriaState.fscSelectedValues
    );
    if (errorMessage2) {
      updateItemSelectionCriteriaState({
        fscInvalidMessage: errorMessage2.validationError,
        fscInvalid: errorMessage2.isInvalid,
      });
    }

    let isInvalidForm: boolean =
      errorMessage.isInvalid ||
      errorMessage1.isInvalid ||
      errorMessage2.isInvalid ||
      itemSelectionCriteriaState.startRangeInvalid ||
      itemSelectionCriteriaState.endingRangeInvalid ||
      itemSelectionCriteriaState.bidderNumToInvalid ||
      itemSelectionCriteriaState.bidderNumFromInvalid ||
      campaignDetailsState.campaignEndDateIsInvalid ||
      campaignDetailsState.campaignStartDateIsInvalid;

    updateMarketingCampaignState({
      isFormValidated: !isInvalidForm,
    });

    return isInvalidForm;
  }

  function handleSubmit(event: any) {
    isFormSubmitted.next(true);
    event.preventDefault();

    updateMarketingCampaignState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
      triggerValidation: true,
    });

    if (!checkRequiredField()) {
      updateMarketingCampaignState({
        revealConfirmSubmitModal: true,
      });
    }
  }

  function submitCampaignDetails() {
    const { addToast } = props.actions;
    const data: MarketingCampaignDto = toJSON("SUBMITTED");
    salesApiService
      .saveMarketingCampaign(data)
      .then(() => {
        updateMarketingCampaignState({
          isSubmitLoading: false,
          isSubmitDisabled: false,
          FormErrorMessage: "",
          showErrorAlert: false,
          isSubmitted: true,
          revealConfirmSubmitModal: false,
        });
        props.history.push({
          pathname: `${Paths.manageMarketingCampaign}`,
        });
        addToast({
          text: "Campaign request successfully submitted.",
          type: "success",
          heading: "Success",
        });
      })
      .catch((error: any) => {
        updateMarketingCampaignState({
          FormErrorMessage: error?.data?.message,
          showErrorAlert: true,
          isSubmitLoading: false,
          isSubmitDisabled: false,
          revealConfirmSubmitModal: false,
        });
        addToast({
          text: "Error submitting campaign.",
          type: "error",
          heading: "Error",
        });
      });
  }

  return (
    <StrictMode>
      <div className={"add-marketing-campaign grid-row ui-ppms"}>
        <div className="header-row grid-row grid-gap-4">
          <h1>Edit Marketing Campaign</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <MarketingCampaignSideNav/>
              </nav>
            </div>
          </div>
        </div>
        <div
          className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs"
          id="edit-marketing-campaign"
        >
          <div className="grid-row">
            <div className={"desktop:grid-col-12"}>
              <PPMSAlert
                id={"form-verification-error"}
                show={marketingCampaignState.showErrorAlert}
                alertBody={
                  marketingCampaignState.FormErrorMessage ||
                  " Error submitting request."
                }
                alertClassName={"form-verification-error"}
                alertVariant={"danger"}
                alertKey={"form-verification-error"}
                alertBodyArray={marketingCampaignState.alertBodyArray}
              />
              {marketingCampaignState.showErrorAlert && <hr />}
            </div>
          </div>
          <Form
            noValidate
            className={"usa-accordion--bordered desktop:grid-col-8"}
            validated={marketingCampaignState.isFormValidated}
            onSubmit={handleSubmit}
          >
            <div className={"grid-row grid-gap-4"}>
              <MarketingCampaignButtons
                saveFunction={saveCampaignDraft}
                isSubmitDisabled={marketingCampaignState.isSubmitDisabled}
                isSubmitLoading={marketingCampaignState.isSubmitLoading}
                cancelFunction={handleCancel}
              />
            </div>
            <br />
            <PPMSAccordion bordered={true} items={items}/>
            <br/>
            <div className={"grid-row grid-gap-4"}>
              <MarketingCampaignButtons
                saveFunction={saveCampaignDraft}
                isSubmitDisabled={marketingCampaignState.isSubmitDisabled}
                isSubmitLoading={marketingCampaignState.isSubmitLoading}
                cancelFunction={handleCancel}
              />
            </div>
          </Form>
        </div>
      </div>
      <PPMSModal
        show={marketingCampaignState.revealConfirmSubmitModal}
        handleClose={() => {
          updateMarketingCampaignState({
            revealConfirmSubmitModal: false,
          });
        }}
        handleSaveType={"button"}
        handleSave={() => {
          submitCampaignDetails();
        }}
        title={"Confirm submit"}
        centered={true}
        backdrop={"static"}
        label={"Yes"}
        labelCancel={"No"}
        body={"Do you want to Submit the item?"}
        id={"confirm-submit-modal"}
      />
    </StrictMode>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(EditMarketingCampaign);
