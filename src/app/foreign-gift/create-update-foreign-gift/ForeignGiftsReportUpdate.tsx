import React, { useContext, useState } from "react";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ForeignGiftsReportCreate from "./ForeignGiftsReportCreate";
import { useEffect } from "react";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { PropertyContext } from "../../property/create-update-property/PropertyContext";
import { isFormSubmitted } from "../../../service/validation.service";
import {
  formatExtension,
  formatPhone,
  nullToStringUtil,
} from "../../../ui-kit/utilities/FormatUtil";
import {
  appraisalToUploadOptions,
  buyOptions,
} from "../../property/create-update-property/constants/Constants";
import moment from "moment";
import { UserUtils } from "../../../utils/UserUtils";
import {
  ForeignGiftsStatus,
  restrictedItemOptions,
  vaultLocationOptions,
} from "./constants/Constants";
import {
  validateFGMReceivedDate, validateRestrictedItem, validateVaultLocation,
  validateVaultShelfNumber
} from "../../property/create-update-property/validations/propertyFieldValidations";

interface ForeignGiftsReportProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}
function ForeignGiftsReportUpdate(props: ForeignGiftsReportProps) {
  let commonApiService = new CommonApiService();

  let propertyService = new PropertyApiService();

  const {
    updatePocState,
    updatePropertyReportState,
    updateIcnState,
    updateAgencyInfoState,
    updateRepAgencyAddressState,
    updateFSCState,
    updateGiftInformationState,
    updateAdminInfoState,
    updateAppraisalInformationState,
    updateAppraisalAgencyInformationState,
    updateDonorInfoState,
    updateRecipientInfoState,
  } = useContext(PropertyContext);

  const [isApproveForeignGiftFlow, setIsApproveForeignGiftFlow] = useState(
    false
  );

  useEffect(() => {
    propertyService
      .getProperty(props.match.params.icn)
      .then((response: any) => {
        let aacCode = response?.data?.aacId;

        let icn = response?.data?.itemControlNumber;

        let propertyStatus: string = response?.data?.propertyStatus?.statusName?.toUpperCase();

        let approveForeignGiftAllowedStatus = [
          ForeignGiftsStatus.PENDING,
          ForeignGiftsStatus.RECALLED,
          ForeignGiftsStatus.EXCESS_SCREENING,
          ForeignGiftsStatus.AWAITING_DOS_APPROVAL,
          ForeignGiftsStatus.SALE_APPROVAL,
          ForeignGiftsStatus.AVAILABLE,
          ForeignGiftsStatus.RESTRICTED,
          ForeignGiftsStatus.LOTTED
        ];

        setIsApproveForeignGiftFlow(
          approveForeignGiftAllowedStatus.includes(propertyStatus)
        );

       if (
          ( propertyStatus === ForeignGiftsStatus.PENDING ||
            propertyStatus === ForeignGiftsStatus.RECALLED ||
            propertyStatus === ForeignGiftsStatus.EXCESS_SCREENING ||
            ForeignGiftsStatus.AWAITING_DOS_APPROVAL,
            ForeignGiftsStatus.SALE_APPROVAL,
            ForeignGiftsStatus.AVAILABLE,
            ForeignGiftsStatus.RESTRICTED,
            ForeignGiftsStatus.LOTTED) &&
          (UserUtils.isSystemAdminUser() || UserUtils.isUserFg())
        ) {
          updateGiftInformationState({ workflow: "APPROVE_FOREIGN_GIFT" });
        }
        updatePropertyReportState({
          propertyData: response?.data,
          propertyId: response?.data?.propertyId,
          isSubmitted:
            response?.data?.propertyStatus?.statusName !== "DRAFT" &&
            response?.data?.propertyStatus?.statusName !== "WITHDRAWN",
          isDraft: response?.data?.propertyStatus?.statusName === "DRAFT",
          submittedDate: response?.data?.submittedDate,
        });

        let serialNum =
          icn.length === 14
            ? icn.substring(10, icn.length)
            : icn.substring(10, icn.length - 1);
        let suffix = icn.length === 14 ? "" : icn.substring(icn.length - 1);
        let julianDate = icn.substr(6, 4);
        updateIcnState({
          isIcnValid: true,
          aacCode: aacCode.toUpperCase(),
          serialNum: serialNum.toUpperCase(),
          suffix: suffix.toUpperCase(),
          julianDate: julianDate,
          disableAAC: true,
          disableJulianDate: true,
          julianDateIsInvalid: false,
          julianDateIsValid: false,
          disableSerialNumber: true,
          disableSuffix: true,
          disableIcnConfirmButton: true,
        });

        const data = {
          params: {
            agencyCode: aacCode,
          },
        };
        commonApiService.getBureau(data).then((resp: any) => {
          updateAgencyInfoState({
            aac: resp?.data?.code,
            agencyBureau: resp?.data?.code + " " + resp?.data?.longName,
            isInternalAgency: resp?.data?.isInternalAgency,
          });
        });
        let repKeyDisplayStr: any =

          response?.data?.reportingAgencyAddress?.line1 +
          "-" +
          response?.data?.reportingAgencyAddress?.city;

        let pocKeyDisplayStr: any =
  
          response?.data?.propertyPOC?.lastName +
          "-" +
          response?.data?.propertyPOC?.email;

        updateRepAgencyAddressState({
          repAddress1: response?.data?.reportingAgencyAddress?.line1,
          repAddress2: response?.data?.reportingAgencyAddress?.line2,
          repAddress3: response?.data?.reportingAgencyAddress?.line3,
          repCity: response?.data?.reportingAgencyAddress?.city,
          repStateCode: response?.data?.reportingAgencyAddress?.stateCode,
          repZipCode: response?.data?.reportingAgencyAddress?.zip,
          repZip2Code: response?.data?.reportingAgencyAddress?.zip2,
          keyDisplayStr: repKeyDisplayStr,
          disableExtension: false,
        });
        //Enable and disable update button of RepAgencyAddressState and add the addressID.
        commonApiService
          .getReportingAddressList(response?.data?.aacId)
          .then((res: any) => {
            let rep: any = res.data;
            let updateButtonDisabled: boolean = true;
            let addressId: any = "";
            let aacReportingAddressId: any = "";
            let values: any = [];
            rep.forEach((repData: any) => {
              if (
                response?.data?.reportingAgencyAddress?.line1 ===
                  repData["line1"].trim() &&
                response?.data?.reportingAgencyAddress?.city ===
                  repData["city"].trim()
              )
                updateButtonDisabled = false;
              addressId = repData["addressId"];
              aacReportingAddressId = repData["aacReportingAddressId"];
              let value: any = {};
              let keyDisplayStr =
   
                repData["line1"].trim() +
                "-" +
                repData["city"].trim();
              value = { ...repData, keyDisplayStr: keyDisplayStr };
              values.push(value);
            });
            updateRepAgencyAddressState({
              updateDisabled: updateButtonDisabled,
              addressId: addressId,
              repAddressId: aacReportingAddressId,
              repLocValues: values,
              repAacCode: aacCode.toUpperCase(),
            });
          })
          .catch((error) => {
            //todo handle the error.
            console.log(error);
          });

        updatePocState({
          pocFirstName: response?.data?.propertyPOC?.firstName,
          pocLastName: response?.data?.propertyPOC?.lastName,
          pocPhone: response?.data?.propertyPOC?.phone
            ? formatPhone(
                nullToStringUtil(response?.data?.propertyPOC?.phone) + ""
              )
            : "",
          pocPhoneExt: formatExtension(
            nullToStringUtil(response?.data?.propertyPOC?.phoneExtension) + ""
          ),
          keyDisplayStr: pocKeyDisplayStr,
          pocFax: response?.data?.propertyPOC?.fax
            ? formatPhone(
                nullToStringUtil(response?.data?.propertyPOC?.fax) + ""
              )
            : "",
          pocEmail: response?.data?.propertyPOC?.email,
          pocCcEmail: response?.data?.propertyPOC?.ccEmail,
          pocNotify: response?.data?.notify_poc,
          pocNotifyDefault: response?.data?.notify_poc ? "notify-poc" : "",
          pocOption: [
            {
              value: "Notify Point of Contact when Available for Sale",
              id: "notify-poc",
              isSelected: response?.data?.notify_poc,
            },
          ],
        });

        //Enable and disable update button for POC
        commonApiService
          .getPointOfContactList(response?.data?.aacId)
          .then((res: any) => {
            let poc: any = res.data;
            let updateButtonDisabled: boolean = true;
            let contactId: any = "";
            let pocId: any = "";
            let values = [];
            poc.forEach((pocData: any) => {
              if (
                response?.data?.propertyPOC?.lastName ===
                  pocData["lastName"].trim() &&
                response?.data?.propertyPOC?.email === pocData["email"].trim()
              )
                updateButtonDisabled = false;
              contactId = pocData["contactID"];
              pocId = pocData["aacPocId"];
              let value: any = {};
              let keyDisplayStr =
         
                pocData["lastName"].trim() +
                "-" +
                pocData["email"].trim();
              value = { ...pocData, keyDisplayStr: keyDisplayStr };
              values.push(value);
            });
            updatePocState({
              updateDisabled: updateButtonDisabled,
              contactId: contactId,
              pocValues: values,
              pocAacCode: aacCode.toUpperCase(),
              pocId: pocId,
            });
          })
          .catch((error) => {
            //todo handle the error.
            console.log(error);
          });

        updateGiftInformationState({
          giftInfoId: response?.data?.giftInfo?.giftInfoId,
          presidentName: response?.data?.giftInfo?.administration,
          fscCode: response?.data?.fscCode,
          itemName: response?.data?.itemName,
          wantToBuy: response?.data?.giftInfo?.recipientWantsToBuy
            ? response?.data?.giftInfo?.recipientWantsToBuy
            : false,
          interestedOptions: selectedValueOptions(
            buyOptions,
            response?.data?.giftInfo?.recipientWantsToBuy ? ["Y"] : ["N"]
          ),
          fiscalYear: response?.data?.giftInfo?.fiscalYear,
          fairMarketValue: getDollorAmount(
            response?.data?.giftInfo?.fairMarketValue
          ),
          fairMarketValueSave: response?.data?.giftInfo?.fairMarketValue
            ? response?.data?.giftInfo?.fairMarketValue
            : "",
          unitOfIssue: response?.data?.giftInfo?.unitOfIssue,
          propertyDescription: response?.data?.propertyDescription,

          recipientReceivedDate: response?.data?.giftInfo
            ?.dateReceivedByRecipient
            ? moment(
                (response?.data?.giftInfo?.dateReceivedByRecipient).toString()
              ).toDate()
            : "",
          dateReceivedByFGM:
            setAdditionalFieldvalue(response) &&
            response?.data?.giftInfo?.dateReceivedByFgm
              ? moment(
                  (response?.data?.giftInfo?.dateReceivedByFgm).toString()
                ).toDate()
              : "",

          restrictedItemSelectedOptions:
            setAdditionalFieldvalue(response) &&
            response?.data?.giftInfo?.isItemRestricted != null
              ? selectedValueOptions(
                  restrictedItemOptions,
                  response?.data?.giftInfo?.isItemRestricted
                    ? ["restrictedYes"]
                    : ["restrictedNo"]
                )
              : selectedValueOptions(
                  restrictedItemOptions,
                  response?.data?.giftInfo?.isItemRestricted ? [""] : [""]
                ),
          restrictedItemSelectedValue:setAdditionalFieldvalue(response) &&
            response?.data?.giftInfo?.isItemRestricted,

          vaultLocationSelectedValue: setAdditionalFieldvalue(response) &&response?.data?.giftInfo?.vaultLocation,

          vaultLocationSelectedOptions:
            setAdditionalFieldvalue(response) &&
            response?.data?.giftInfo?.vaultLocation != ""
              ? selectedValueOptions(
                  vaultLocationOptions,
                  response?.data?.giftInfo?.vaultLocation === "Franconia"
                    ? ["franconia"]
                    : ["doe"]
                )
              : selectedValueOptions(
                  vaultLocationOptions,
                  response?.data?.giftInfo?.vaultLocation ? [""] : [""]
                ),

          vaultShelfNumber: setAdditionalFieldvalue(response)
            ? response?.data?.giftInfo?.vaultShelfNumber
            : "",

          upsetPriceSave:
            setAdditionalFieldvalue(response) &&
            response?.data?.giftInfo?.upsetPrice
              ? response?.data?.giftInfo?.upsetPrice
              : "",

          upsetPrice:
            setAdditionalFieldvalue(response) &&
            response?.data?.giftInfo?.upsetPrice
              ? getDollorAmount(response?.data?.giftInfo?.upsetPrice)
              : getDollorAmount(response?.data?.giftInfo?.fairMarketValue),
          giftPropertyStatus: response?.data?.propertyStatus?.statusName,
          dosApprovalDate:
            response?.data?.dosApprovalDate
              ? moment(
              (response?.data?.dosApprovalDate).toString()
              ).toDate()
              : null,
        });

        if (setAdditionalFieldvalue(response)){
          validateVaultShelfNumber(response?.data?.giftInfo?.vaultShelfNumber,updateGiftInformationState)
          validateFGMReceivedDate(response?.data?.giftInfo?.dateReceivedByFgm, response?.data?.giftInfo?.dateReceivedByRecipient,
            "Date Received by FGM",true, updateGiftInformationState);
          validateRestrictedItem(response?.data?.giftInfo?.isItemRestricted,updateGiftInformationState);
          validateVaultLocation(response?.data?.giftInfo?.vaultLocation, updateGiftInformationState);
        }
        updateAdminInfoState({
          presidentName: response?.data?.giftInfo?.administration,
        });

        updateAppraisalAgencyInformationState({
          appraisalAgencyInfoId:
            response?.data?.appraisalAgencyInfo?.appraisalAgencyInfoId,
          companyName: response?.data?.appraisalAgencyInfo?.companyName,
          companyAddress1:
            response?.data?.appraisalAgencyInfo?.companyAddress?.line1,
          companyAddress2:
            response?.data?.appraisalAgencyInfo?.companyAddress?.line2,
          companyAddress3:
            response?.data?.appraisalAgencyInfo?.companyAddress?.line3,
          companyCity:
            response?.data?.appraisalAgencyInfo?.companyAddress?.city,
          companyStateCode:
            response?.data?.appraisalAgencyInfo?.companyAddress?.stateCode,
          companyZipCode:
            response?.data?.appraisalAgencyInfo?.companyAddress?.zip,
          companyZip2Code:
            response?.data?.appraisalAgencyInfo?.companyAddress?.zip2,
          companyUrl: response?.data?.appraisalAgencyInfo?.companyUrl,
          appraisalToUploadOptions: selectedValueOptions(
            appraisalToUploadOptions,
            response?.data?.appraisalAgencyInfo?.isAppraisalToUpload
              ? ["Y"]
              : ["N"]
          ),
          wantToBuyGift: response?.data?.giftInfo?.recipientWantsToBuy
            ? response?.data?.giftInfo?.recipientWantsToBuy
            : false,
        });

        let dateOfApproval = response?.data?.appraisalInfo?.dateOfApproval
          ? moment(response?.data?.dateOfApproval).toDate()
          : null;
        updateAppraisalInformationState({
          appraisalInfoId: response?.data?.appraisalInfo?.appraisalInfoId,
          firstName: response?.data?.appraisalInfo?.firstName,
          lastName: response?.data?.appraisalInfo?.lastName,
          phoneNumber: response?.data?.appraisalInfo?.phone
            ? formatPhone(
                nullToStringUtil(response?.data?.appraisalInfo?.phone) + ""
              )
            : "",
          phoneExtension: formatExtension(
            nullToStringUtil(response?.data?.appraisalInfo?.phoneExtension) + ""
          ),
          emailAddress: response?.data?.appraisalInfo?.email,
          appraisalValue: getDollorAmount(
            response?.data?.appraisalInfo?.appraisalValue
          ),
          dateOfApproval: dateOfApproval,
          wantToBuyGift: response?.data?.giftInfo?.recipientWantsToBuy
            ? response?.data?.giftInfo?.recipientWantsToBuy
            : false,
        });

        updateDonorInfoState({
          donorLastName: response?.data?.donorInfo?.lastName,
          donorFirstName: response?.data?.donorInfo?.firstName,
          country: response?.data?.donorInfo?.countryCode,
          title: response?.data?.donorInfo?.donorTitle,
        });

        updateRecipientInfoState({
          title: response?.data?.recipientInfo?.recipientTitle,
          emailAddress: response?.data?.recipientInfo?.email,
          recipientTitle: response?.data?.recipientInfo?.recipientTitle,
          recipientFirstName: response?.data?.recipientInfo?.firstName,
          recipientLastName: response?.data?.recipientInfo?.lastName,
          phoneNumber: response?.data?.recipientInfo?.phone
            ? formatPhone(
                nullToStringUtil(response?.data?.recipientInfo?.phone) + ""
              )
            : "",
          phoneExtension: formatExtension(
            nullToStringUtil(response?.data?.recipientInfo?.phoneExtension) + ""
          ),
        });

        commonApiService
          .getFSCCodes()
          .then((res: any) => {
            const fscData = res.data;
            fscData.forEach((item) => {
              if (item?.code === response?.data?.fscCode) {
                let selectedValue = [];
                let fscData = {};
                selectedValue.push(item);
                fscData["fscCode"] = item.code;

                updateFSCState({
                  fcsSelectedValues: selectedValue,
                  fcsSelectedValue: response?.data?.federalSalesCenter,
                  data: fscData,
                });
              }
            });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    commonApiService.getStateList().then((response: any) => {
      updatePropertyReportState({
        stateValues: response.data,
      });
    });

    return () => {
      isFormSubmitted.next(false);
    };
  }, []);

  return (
    <ForeignGiftsReportCreate
      workflow={
        isApproveForeignGiftFlow &&
        (UserUtils.isSystemAdminUser() || UserUtils.isUserFg())
          ? "APPROVE_FOREIGN_GIFT"
          : ""
      }
      {...props}
    />
  );
}

function selectedValueOptions(options: any[], selectedValues: any[]) {
  options.forEach((option) => {
    if (selectedValues.includes(option.id)) {
      option.isSelected = true;
    } else {
      option.isSelected = false;
    }
  });
  return options;
}

function getDollorAmount(value: any) {
  let dollarValue = "";
  if (value) {
    dollarValue = value
      .toString()
      .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
      .toString();

    dollarValue = dollarValue.replace(/^[0]+$/, "");

    if (/^\d+\.\d\d\d$/.test(dollarValue)) {
      dollarValue = Number(dollarValue).toFixed(2);
    }
    dollarValue =
      "$" +
      dollarValue
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        .replace("$", "");
  }
  return dollarValue;
}
function setAdditionalFieldvalue(response: any) {
  console.log("Statuses to see ", response?.data?.propertyStatus?.statusName);
  if (
    (response?.data?.propertyStatus?.statusName ===
      ForeignGiftsStatus.PENDING ||
      response?.data?.propertyStatus?.statusName ===
      ForeignGiftsStatus.EXCESS_SCREENING ||
      response?.data?.propertyStatus?.statusName ===
        ForeignGiftsStatus.RECALLED ||
      response?.data?.propertyStatus?.statusName ===
        ForeignGiftsStatus.AWAITING_DOS_APPROVAL ||
      response?.data?.propertyStatus?.statusName ===
        ForeignGiftsStatus.SALE_APPROVAL ||
      response?.data?.propertyStatus?.statusName?.toUpperCase() ===
        ForeignGiftsStatus.AVAILABLE ||
      response?.data?.propertyStatus?.statusName ===
        ForeignGiftsStatus.RESTRICTED ||
      response?.data?.propertyStatus?.statusName?.toUpperCase() ===
        ForeignGiftsStatus.LOTTED
    ) &&
    (UserUtils.isUserFg() || UserUtils.isSystemAdminUser())
  )
    return true;
  else return false;
}
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(ForeignGiftsReportUpdate);
