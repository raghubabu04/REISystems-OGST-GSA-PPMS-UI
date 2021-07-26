import React, {StrictMode, useContext, useEffect,} from "react";
import {PPMSForm} from "../../../../ui-kit/components/common/form/PPMS-form";
import {PPMSAccordion} from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import {PPMSModal} from "../../../../ui-kit/components/common/PPMS-modal";
import {CampaignDetailsClass} from "./campaign/CampaignDetailsClass";
import {BidderSelectionCriteriaClass} from "./bidder-selection/BidderSelectionCriteriaClass";
import {EmailSelectionCriteriaClass} from "./email-criteria/EmailSelectionCriteriaClass";
import {CommonApiService} from "../../../../api-kit/common/common-api.service";
import {MarketingCampaignContext} from "./MarketingCampaignContext";
import {ItemSelectionCriteriaClass} from "./item-selection-criteria/ItemSelectionCriteriaClass";
import {isFormSubmitted} from "../../../../service/validation.service";
import {addToast} from "../../../../_redux/_actions/toast.actions";
import {bindActionCreators} from "redux";

import {
  validateCampaignName,
  validateCampaignRun,
  validateFsc,
  verifyCampaignName,
} from "../validations/AddEditCampaignValidations";
import {MarketingCampaignDto} from "../../../models/MarketingCampaignModel";
import {SalesApiService} from "../../../../api-kit/sales/sales-api-service";
import moment from "moment";
import MarketingCampaignSideNav from "./MarketingCampaignSideNav";
import {PageHelper, Paths} from "../../../Router";
import {connect} from "react-redux";
import MarketingCampaignButtons from "./MarketingCampaignButtons";
import {NotificationApiService} from "../../../../api-kit/notification/notification-api.service";
import {SalesUpload} from "./SalesUpload";
import {AuctionsApiService} from "../../../../api-kit/auctions/auctions-api-service";

export interface AddMarketingCampaignProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
  alertSuccess: any;
  alertError: any;
}

export function AddMarketingCampaign(props: AddMarketingCampaignProps) {
  let commonApiService = new CommonApiService();
  let salesApiService = new SalesApiService();
  let notificationService = new NotificationApiService();
  let auctionsAPIService = new AuctionsApiService();
  const {
    //Marketing Campaign Page
    marketingCampaignState,
    updateMarketingCampaignState,

    //Item Selection Criteria
    itemSelectionCriteriaState,
    updateItemSelectionCriteriaState,

    //Bidder Selection
    bidderSelectionState,

    //Campaign Details
    campaignDetailsState,
    updateCampaignDetailsState,

    //Email Selection Criteria
    emailSelectionCriteriaState,
    updateEmailSelectionCriteriaState,
  } = useContext(MarketingCampaignContext);
  useEffect(() => {
    // setDefaultValues()
    commonApiService
      .getFSCCodes()
      .then((response: any) => {
        updateItemSelectionCriteriaState({
          fscOptions: response?.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    notificationService.getTemplates().then((response) => {
      let emailTemplates = response?.data;
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

    isFormSubmitted.next(false);
  });

  function checkRequiredField() {
    let errorMessage = validateCampaignName(campaignDetailsState.campaignName);
    if (errorMessage) {
      if (!errorMessage.isInvalid) {
        verifyCampaignName(
          campaignDetailsState.campaignName,
          updateCampaignDetailsState
        );
      } else {
        updateCampaignDetailsState({
          campaignNameValidationMessage: errorMessage.validationError,
          campaignNameIsInvalid: errorMessage.isInvalid,
        });
      }
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
      campaignDetailsState.campaignNameIsInvalid ||
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

  function removeCommaBidAmount() {
    if (itemSelectionCriteriaState.bidAmountRangeFrom) {
      itemSelectionCriteriaState.bidAmountRangeFrom = itemSelectionCriteriaState.bidAmountRangeFrom
        .replace("$", "")
        .replace(/,/g, "");
    }
    if (itemSelectionCriteriaState.bidAmountRangeTo) {
      itemSelectionCriteriaState.bidAmountRangeTo = itemSelectionCriteriaState.bidAmountRangeTo
        .replace("$", "")
        .replace(/,/g, "");
    }
  }

  function toJSON(status: string): MarketingCampaignDto {
    removeCommaBidAmount();
    let campaign: MarketingCampaignDto = {
      campaignStatus: status,
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
    };
    if (campaignDetailsState.campaignId) {
      campaign.campaignId = campaignDetailsState.campaignId;
    }
    return campaign;
  }

  function handleSubmitWithSaleOrLotValidation(event){
    event.preventDefault();
    let value = itemSelectionCriteriaState.saleItemNumber.replaceAll("-","");
    if(value && !(value.length===11 || value.length===14)){
      updateItemSelectionCriteriaState({
        isSaleOrLotInvalid:true,
        saleOrLotValidationErrorMessage:"Please enter the valid Sale/lot Number"
      });
    }else if(value && (value.length===11 || value.length===14)){
     //api
     auctionsAPIService
     .getCheckSaleOrLot(value)
     .then((response) => {
        console.log("response",response.data);
        if(response.data){
          handleSubmit(event);
        }else{
          updateItemSelectionCriteriaState({
            isSaleOrLotInvalid:true,
            saleOrLotValidationErrorMessage:"Sale/lot number not found"
          });
        }
     })
     .catch((error) => {
       console.log(error);
     });
    }else{
      handleSubmit(event);
    }
  }
  function handleSubmit(event) {
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

  const saveFileBinder = async () => {
    if (campaignDetailsState.campaignId) return campaignDetailsState.campaignId;
    const payload = toJSON("DRAFT");
    return await salesApiService
      .saveMarketingCampaign(payload)
      .then((success) => {
        updateCampaignDetailsState({
          campaignId: success.data.campaignId,
        });
        return success.data.campaignId;
      })
      .catch(() => {
        console.error("Failed to get image info");
        addToast({
          text: "Error attaching file",
          type: "error",
          heading: "Error",
        });
        return null;
      });
  };

  function saveCampaignDraft() {
    const payload = toJSON("DRAFT");
    const { addToast } = props.actions;
    if (
      !(
        campaignDetailsState.campaignNameIsInvalid ||
        campaignDetailsState.campaignName.length === 0
      )
    ) {
      salesApiService
        .saveMarketingCampaign(payload)
        .then((succes) => {
          // fget camp id

          addToast({
            text: "Draft saved successfully",
            type: "success",
            heading: "Success",
          });
          PageHelper.openPage(
            Paths.editMarketingCampaign + "/" + succes.data.campaignId
          );
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

  function cancelButtonClick() {
    isFormSubmitted.next(false);
    props.history.push(Paths.manageMarketingCampaign);
  }

  return (
    <StrictMode>
      <div className={"add-marketing-campaign grid-row ui-ppms"}>
        <div className="grid-row header-row mb-3">
          <h1>Create Marketing Campaign </h1>
        </div>

        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <MarketingCampaignSideNav />
              </nav>
            </div>
          </div>
        </div>
        <div className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <PPMSForm
            noValidate
            // validate={marketingCampaignState.isFormValidated}
            large={false}
            search={true}
            onSubmit={handleSubmitWithSaleOrLotValidation}
            className={"usa-accordion--bordered desktop:grid-col-12"}
          >
            <div className={"grid-row grid-gap-2"}>
              <MarketingCampaignButtons
                saveFunction={saveCampaignDraft}
                isSubmitDisabled={false}
                isSubmitLoading={false}
                cancelFunction={cancelButtonClick}
                cancelId={"marketing-campign-cancel-button-1"}
                saveId={"marketing-campign-save-button-1"}
              />
            </div>
            <br />

            <PPMSAccordion
              items={[
                {
                  title: "Campaign Details",
                  content: <CampaignDetailsClass />,
                  expanded: true,
                  id: "campaign-details-id",
                  className: "campaign-details",
                },
              ]}
            />

            <br />
            <PPMSAccordion
              items={[
                {
                  title: "Item Selection Criteria",
                  content: <ItemSelectionCriteriaClass />,
                  expanded: true,
                  id: "item-selection-criteria-id",
                  className: "item-selection-criteria",
                },
              ]}
            />

            <br />
            <PPMSAccordion
              items={[
                {
                  title: "Bidder Selection Criteria",
                  content: <BidderSelectionCriteriaClass />,
                  expanded: true,
                  id: "bidder-selection-criteria-id",
                  className: "bidder-selection-criteria",
                },
              ]}
            />

            <br />
            <PPMSAccordion
              items={[
                {
                  title: "Email Selection Criteria",
                  content: <EmailSelectionCriteriaClass />,
                  expanded: true,
                  id: "email-selection-criteria-id",
                  className: "email-selection-criteria",
                },
              ]}
            />

            <br />
            <PPMSAccordion
              items={[
                {
                  title: "Upload Documents",
                  content: (
                    <SalesUpload
                      campProvider={saveFileBinder}
                      campaignId={campaignDetailsState.campaignId}
                      disabled={
                        campaignDetailsState.campaignNameIsInvalid ||
                        campaignDetailsState.campaignName.length === 0
                      }
                      onFilesUpdated={(files) => {
                        updateCampaignDetailsState({ uploadedFiles: files });
                      }}
                    />
                  ),
                  expanded: true,
                  id: "upload-selection-criteria-id",
                },
              ]}
            />

            <br />
            <div className={"grid-row grid-gap-2"}>
              <MarketingCampaignButtons
                saveFunction={saveCampaignDraft}
                isSubmitDisabled={false}
                isSubmitLoading={false}
                cancelFunction={cancelButtonClick}
                cancelId={"marketing-campign-cancel-button-2"}
                saveId={"marketing-campign-save-button-2"}
              />
            </div>
          </PPMSForm>
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
      </div>
    </StrictMode>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(AddMarketingCampaign);
