import React, {StrictMode, useContext, useEffect} from "react";
import {CommonApiService} from "../../../api-kit/common/common-api.service";
import {PropertyApiService} from "../../../api-kit/property/property-api-service";
import {PropertyContext} from "../../property/create-update-property/PropertyContext";
import {isFormSubmitted} from "../../../service/validation.service";
import {IcnStateDefault} from "../../property/create-update-property/icn-class/IcnState";
import {PropertyInfoStateDefault} from "../../property/create-update-property/property-info-class/PropertyInfoState";
import {AgencyInfoStateDefault} from "../../property/create-update-property/agency-info-class/AgencyInfoState";
import {
  RepAgencyAddressStateDefault,
  RepAgencyAddressStateJson,
} from "../../property/create-update-property/rep-agency-address-class/RepAgencyAddressState";
import {PocStateDefault, PocStateJson,} from "../../property/create-update-property/point-of-contact-class/PocState";
import {addToast} from "../../../_redux/_actions/toast.actions";

import {PropertyLocationStateDefault} from "../../property/create-update-property/property-location-class/PropertyLocationState";
import {PropCustStateDefault} from "../../property/create-update-property/property-custodian-class/PropCustState";
import {FSCStateDefaultsOrigin} from "../../property/create-update-property/federal-supply-class/model/FSCState";
import {UnitOfIssueStateDefaults} from "../../property/create-update-property/unit-of-issue-class/UnitOfIssueState";
import {FSCVehicleStateDefault} from "../../property/create-update-property/federal-supply-class/model/FSCVehicleState";
import {PropertyReportStateDefault} from "../../property/create-update-property/PropertyReportState";
import {AdditionalInfoStateDefault} from "../../property/create-update-property/additional-info-class/AdditionalInfoState";
import {PPMSAlert} from "../../../ui-kit/components/common/PPMS-alert";
import {Form} from "react-bootstrap";
import PropertyReportButtons from "../../property/create-update-property/PropertyReportButtons";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import {PPMSAccordion} from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import {PPMSModal} from "../../../ui-kit/components/common/PPMS-modal";
import {BarCodePrint} from "../../property/create-update-property/common/BarcodePrint";
import {
  getFormattedICN,
  validatePropertyDescription,
  validatePropTYpe,
} from "../../property/create-update-property/validations/propertyFieldValidations";
import {joinIcn, PropertyGroupType,} from "../../property/create-update-property/constants/Constants";
import {PropertyReportDto} from "../../models/PropertyReport";
import {Paths} from "../../Router";
import IcnClass from "../../property/create-update-property/icn-class/IcnClass";
import AgencyInfoClass from "../../property/create-update-property/agency-info-class/AgencyInfoClass";
import RepAgencyAddressClass
  from "../../property/create-update-property/rep-agency-address-class/RepAgencyAddressClass";
import PocClass from "../../property/create-update-property/point-of-contact-class/PocClass";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ForeignGiftSideNav} from "../ForeignGiftSideNav";
import {GiftInformation} from "./gift-information/GiftInformation";
import {DonorInformation} from "./donor-information/DonorInformation";
import {AppraisalAgencyInformation} from "./appraisal-agency-information/AppraisalAgencyInformation";
import {DonorJson} from "./donor-information/DonorInfoState";
import {AppraisalAgencyInformationStateJson} from "./appraisal-agency-information/AppraisalAgencyInformationState";
import {AppraisalInformation} from "./appraisalInformation/AppraisalInformation";
import {RecipientInformation} from "./recipient-information/RecipientInformation";
import {RecipientJson} from "./recipient-information/RecipientInfoState";
import {Upload} from "../../property/create-update-property/uploads/Upload";
import {GiftInformationStateDefaults} from "./gift-information/GiftInformationState";
import {cloneDeep} from "lodash";

import {PPMSActionList} from "../../../ui-kit/components/PPMS-action-list";
import {UserUtils} from "../../../utils/UserUtils";

interface ForeignGiftsReportProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
  workflow: any;
}

function ForeignGiftsReportCreate(props: ForeignGiftsReportProps) {
  let commonApiService = new CommonApiService();

  let propertyService = new PropertyApiService();

  const {
    propertyInfoState,
    updatePropertyInfoState,
    icnState,
    updateIcnState,
    agencyInfoState,
    updateAgencyInfoState,
    repAgencyAddressState,
    updateRepAgencyAddressState,
    updatePropertyLocationState,
    updatePropCustState,
    pocState,
    updatePocState,
    propertyReportState,
    updatePropertyReportState,
    unitOfIssueState,
    updateUnitOfIssueState,
    fscState,
    updateFSCState,
    fscWeaponState,
    updateFSCWeaponState,
    updateFSCVehicleState,
    updateAdditionalInfoState,
    adminInfoState,
    giftInformationState,
    updateGiftInformationState,
    appraisalAgencyInformationState,
    donorInfoState,
    recipientInfoState,
    updateAppraisalAgencyInformationState,
    appraisalInformationState,
    updateAppraisalInformationState,
  } = useContext(PropertyContext);
  useEffect(() => {
    setDefaultValues();
    commonApiService.getStateList().then((response: any) => {
      updatePropertyReportState({
        stateValues: response.data,
      });
    });
    return () => {
      isFormSubmitted.next(false);
    };
  }, []);

  function setDefaultValues() {
    updateIcnState(IcnStateDefault);
    updatePropertyInfoState(PropertyInfoStateDefault);
    updateAgencyInfoState(AgencyInfoStateDefault);
    updateRepAgencyAddressState(RepAgencyAddressStateDefault);
    updatePocState(PocStateDefault);
    updatePropertyLocationState(PropertyLocationStateDefault);
    updatePropCustState(PropCustStateDefault);
    updateFSCState(cloneDeep(FSCStateDefaultsOrigin));
    updateUnitOfIssueState(UnitOfIssueStateDefaults);
    updateFSCVehicleState(FSCVehicleStateDefault);
    updatePropertyReportState(PropertyReportStateDefault);
    updateAdditionalInfoState(AdditionalInfoStateDefault);
    updateGiftInformationState(GiftInformationStateDefaults);

    updateIcnState({
      aacCode: UserUtils.getPrimaryAAC(),
    });

    prePopulateAgencyBureau(UserUtils.getPrimaryAAC());
  }

  function prePopulateAgencyBureau(aacValue) {
    if (aacValue !== null) {
      const data = {
        params: {
          agencyCode: aacValue,
        },
      };
      callCommonApiToRetrieveData(data);
    }
  }

  function callCommonApiToRetrieveData(data: any) {
    let aacValue = data.params.agencyCode;
    commonApiService
      .getBureau(data)
      .then(async (response: any) => {
        updateBureauAndContactDetails(response, aacValue);
      })
      .catch(() => {
        updateIcnState({
          aacValidationMessage:
            "AAC Not Found in Customer Address File, Please contact your Agency AAC Point of Contact to update",
          aacIsInvalid: true,
          aacIsValid: false,
        });
      });
  }


  async function updateBureauAndContactDetails(
    response: any,
    aacValue: string
  ) {
    if (response.data) {
      const aacBureau = `${response.data.code} ${response.data.longName}`;
      let isInternalAgency = response.data.isInternalAgency;
      let agencyBureau = response.data.code;

      updateAgencyInfoState({
        agencyBureau: aacBureau,
        aac: `${response.data.code}`,
        isInternalAgency: isInternalAgency,
      });

      updateFSCState({
        aacCode: aacValue,
        agencyCode: response.data.code,
      });

      let propertyTypeValidation = validatePropTYpe(
        agencyBureau,
        propertyInfoState.propType
      );
      updatePropertyInfoState({
        isPropValid: !propertyTypeValidation.isInvalid,
        isPropInValid: propertyTypeValidation.isInvalid,
        propValidationMessage: propertyTypeValidation.validationError,
      });
    }
    updatePocState({
      pocAacCode: aacValue,
    });
    updateRepAgencyAddressState({
      repAacCode: aacValue,
    });
    commonApiService
      .getContacts(aacValue)
      .then((res: any) => {
        if (res.data) {
          let repAdd: any = res["data"].repAdd;
          let poc: any = res["data"].poc;
          let propLoc: any = res["data"].propLoc;
          let porpCust: any = res["data"].propCust;
          let values: any = [];
          //Property Reporting  dropdown
          repAdd.forEach((repOb: any) => {
            let value: any = {};
            let keyDisplayStr =
              repOb["line1"].trim() +
              "-" +
              repOb["city"].trim();
            value = {...repOb, keyDisplayStr: keyDisplayStr};
            values.push(value);
          });
          updateRepAgencyAddressState({
            repLocValues: values,
          });
          values = [];
          //Point of Contact Dropdown
          poc.forEach((pocOb: any) => {
            let value: any = {};
            let keyDisplayStr =
              pocOb["lastName"].trim() +
              "-" +
              pocOb["email"].trim();
            value = {...pocOb, keyDisplayStr: keyDisplayStr};
            values.push(value);
          });
          updatePocState({
            pocValues: values,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function toJSON(isSubmitFlag: boolean): PropertyReportDto {
    let repAgencyAddress = RepAgencyAddressStateJson(repAgencyAddressState)[0],
      propertyPOC = PocStateJson(pocState)[0];
    let donor = DonorJson(donorInfoState)[0];
    let recipient = RecipientJson(recipientInfoState)[0];

    let appraisalAgencyInformation = AppraisalAgencyInformationStateJson(
      appraisalAgencyInformationState
    )[0];
    // getting category code and name by filtering and splitting
    let categoryInfo = fscState.fscOptions
      .filter((item) => item.code === fscState.data.fscCode)
      .map((item) => {
        if (item !== null) {
          return item.fgCategoryCode.split(" - ");
        }
      });
    //remove $ form originalAcqCost and totalAcqCost
    let originalAcqCost = unitOfIssueState.originalAcqCost
      ?.toString()
      .replace("$", "")
      .replace(/,/g, "");
    let totalAcqCost = unitOfIssueState.totalAcqCost
      ?.toString()
      .replace("$", "")
      .replace(/,/g, "");
    if (
      fscState.fcsSelectedValue === "G" &&
      propertyInfoState.reimbursementIsReq === "Y" &&
      propertyInfoState.isDonation === "N" &&
      propertyInfoState.isExchangeSales === "N" &&
      agencyInfoState.agencyBureau.startsWith("97")
    ) {
      propertyInfoState.reimbursemenCode = "8";
    } else if (
      fscState.fcsSelectedValue === "G" &&
      propertyInfoState.reimbursementIsReq === "Y" &&
      propertyInfoState.isDonation === "N" &&
      propertyInfoState.isExchangeSales === "N" &&
      !agencyInfoState.agencyBureau.startsWith("97")
    ) {
      propertyInfoState.reimbursemenCode = "1";
    } else if (
      fscState.fcsSelectedValue === "G" &&
      propertyInfoState.reimbursementIsReq === "Y" &&
      propertyInfoState.isDonation === "N" &&
      propertyInfoState.isExchangeSales !== "N"
    ) {
      propertyInfoState.reimbursemenCode = "4";
    } else if (
      fscState.fcsSelectedValue === "G" &&
      propertyInfoState.reimbursementIsReq !== "Y" &&
      propertyInfoState.isDonation !== "N" &&
      propertyInfoState.isExchangeSales === "N"
    ) {
      propertyInfoState.reimbursemenCode = "5";
    } else if (
      fscState.fcsSelectedValue !== "G" &&
      propertyInfoState.reimbursementIsReq === "Y" &&
      propertyInfoState.isDonation === "N" &&
      propertyInfoState.isExchangeSales === "N"
    ) {
      propertyInfoState.reimbursemenCode = "A";
    } else if (
      fscState.fcsSelectedValue === "N" &&
      propertyInfoState.reimbursementIsReq === "Y" &&
      propertyInfoState.isDonation === "N" &&
      propertyInfoState.isExchangeSales !== "N"
    ) {
      propertyInfoState.reimbursemenCode = "E";
    }
    if (
      fscState.fcsSelectedValue === "N" &&
      propertyInfoState.reimbursementIsReq !== "Y" &&
      propertyInfoState.isDonation !== "N" &&
      propertyInfoState.isExchangeSales === "N"
    ) {
      propertyInfoState.reimbursemenCode = "C";
    }

    if (propertyInfoState.reimbursementIsReq === "Y")
      propertyInfoState.isDonation = "N";
    else propertyInfoState.isDonation = "Y";
    propertyReportState.propertyGroup = "foreignGift";
    let appraisalPhoneNumbertemp = appraisalInformationState.phoneNumber;
    let phoneExtensionTemp = appraisalInformationState.phoneExtension;
    let appraisalValueTemp = appraisalInformationState.appraisalValue;
    let restrictedItem: any;
    if (
      giftInformationState.restrictedItemSelectedValue != null &&
      (giftInformationState.restrictedItemSelectedValue == "Yes" ||
        giftInformationState.restrictedItemSelectedValue == true)
    ) {
      restrictedItem = true;
    } else if (
      giftInformationState.restrictedItemSelectedValue != null &&
      (giftInformationState.restrictedItemSelectedValue == "No" ||
        giftInformationState.restrictedItemSelectedValue == false
      )
    ) {
      restrictedItem = false;
    }
    return ({
      itemControlNumber: joinIcn(icnState),
      agencyBureau: agencyInfoState.aac,
      aacId: icnState.aacCode,
      propertyId: propertyReportState.propertyId,
      reportingAgencyAddress: repAgencyAddress,
      propertyPOC: propertyPOC,
      notify_poc: pocState.pocNotify,
      notifyCustodian: true,
      isSubmitted: isSubmitFlag,
      itemName: giftInformationState.itemName,
      propertyDescription: giftInformationState.propertyDescription,
      isDeleted: false,
      // fscCode: fscState.data.fscCode,
      fscCode: fscState.fcsSelectedValues[0]?.code,
      originalAcquisitionCost: giftInformationState.fairMarketValueSave,
      propertyGroup: "foreignGift",
      appraisalAgencyInfo: appraisalAgencyInformation,
      donorInfo: donor,
      recipientInfo: recipient,
      quantity: 1,
      giftInfo: {
        giftInfoId: giftInformationState.giftInfoId,
        fiscalYear: giftInformationState.fiscalYear,
        administration: adminInfoState.presidentName,
        fairMarketValue: giftInformationState.fairMarketValueSave,
        unitOfIssue: giftInformationState.unitOfIssue,
        recipientWantsToBuy: giftInformationState.wantToBuy,

        upsetPrice: giftInformationState.upsetPriceSave,
        dateReceivedByRecipient: giftInformationState.recipientReceivedDate,
        dateReceivedByFgm: giftInformationState.dateReceivedByFGM,
        isItemRestricted: restrictedItem,
        vaultLocation: giftInformationState.vaultLocationSelectedValue,
        vaultShelfNumber: giftInformationState.vaultShelfNumber,
        giftFscCode: fscState.data.fscCode,
      },
      appraisalInfo: {
        appraisalInfoId: appraisalInformationState.appraisalInfoId,
        firstName: appraisalInformationState.firstName,
        lastName: appraisalInformationState.lastName,
        email: appraisalInformationState.emailAddress,
        phone: appraisalPhoneNumbertemp
          ? appraisalPhoneNumbertemp.replace(/[^0-9]/g, "")
          : "",
        phoneExtension: phoneExtensionTemp
          ? phoneExtensionTemp.replace(/[^0-9]/g, "")
          : "",
        dateOfApproval: appraisalInformationState.dateOfApproval,
        appraisalValue: appraisalValueTemp
          ? appraisalValueTemp.replace(/\$|,/g, "")
          : "",
      },
      categoryCode: categoryInfo.length > 0 ? categoryInfo[0][0] : "",
      categoryName: categoryInfo.length > 0 ? categoryInfo[0][1] : "",
    } as unknown) as PropertyReportDto;
  }

  function handlePropertySave() {
    let validationMessages = [];
    updatePropertyReportState({
      alertBodyArray: validationMessages,
      FormErrorMessage: "",
      showErrorAlert: false,
    });
    const data: PropertyReportDto = toJSON(false);
    const { addToast } = props.actions;
    propertyService
      .savePropertyReport(data)
      .then((response: any) => {
        updatePropertyReportState({
          propertyId: response.data.propertyId,
        });
        updateGiftInformationState({
          giftInfoId: response.data.giftInfo.giftInfoId,
        });
        updateAppraisalInformationState({
          appraisalInfoId: response.data.appraisalInfo.appraisalInfoId,
        });
        updateAppraisalAgencyInformationState({
          appraisalAgencyInfoId:
            response.data.appraisalAgencyInfo.appraisalAgencyInfoId,
        });
        addToast({
          text: "Request successfully saved",
          type: "success",
          heading: "Success",
        });
      })
      .catch(() => {
        console.log("error while saved");
        addToast({
          text: "Error saving request",
          type: "error",
          heading: "Error",
        });
      });
  }

  function handleCancel() {
    isFormSubmitted.next(false);
    props.history.push({
      pathname: `${Paths.foreignGiftList}`,
    });
  }

  function validateRadioButton(items) {
    const selectedItem = items.filter((item) => item.isSelected === true);
    if (null != selectedItem && selectedItem.length > 0) return true;
    else return false;
  }

  const focusOnErrorAfterSubmit = async (event: any) => {
    await handleSubmit(event);
    const errorElement = document.querySelector<HTMLElement>(
      ".usa-sidenav__item__error"
    );
    if (errorElement && errorElement.hasChildNodes) {
      errorElement.scrollIntoView({ behavior: "smooth" });
      const errorLink = errorElement.querySelector<HTMLElement>(
        ".side-nav-links"
      );
      errorLink.click();
    }
  };

  const handleSubmit = async (event: any) => {
    const { addToast } = props.actions;
    isFormSubmitted.next(true);
    event.preventDefault();
    updatePropertyReportState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
      triggerValidation: true,
    });
    if (typeof fscState.data.fscCode === "undefined") {
      updateFSCState({
        isInvalid: true,
        triggerValidation: true,
      });
    } else {
      updateFSCState({
        triggerValidation: true,
      });
    }

    if (fscState.data.fscCategory === "weapon") {
      if (fscWeaponState.FSCWeaponData.longName === "")
        updateFSCWeaponState({
          weaponTypesIsInvalid: true,
        });
    }

    const form = event.currentTarget;
    let validationMessages = [];
    let propertyDescriptionValidation = validatePropertyDescription(
      giftInformationState.propertyDescription
    );

    updateGiftInformationState({
      propertyDescriptionErrorMsg:
        propertyDescriptionValidation.validationError,
      propertyDescriptionIsInvalid: propertyDescriptionValidation.isInvalid,
    });

    if (fscState.fsc.vessel.isVessel50FeetOrOver) {
      updateAdditionalInfoState({
        dateOfManufactureIsValid: false,
        dateOfManufactureIsInValid: true,
      });
    }

    let appraisalToUploadValidation = validateRadioButton(
      appraisalAgencyInformationState.appraisalToUploadOptions
    );
    let wantToBuyValidation = validateRadioButton(
      giftInformationState.interestedOptions
    );

    let isRestrictedItemVaultLocationValid = true;

    if (props.workflow === "APPROVE_FOREIGN_GIFT") {
      let restrictedItemValidation = validateRadioButton(
        giftInformationState.restrictedItemSelectedOptions
      );
      let vaultLocationValidation = validateRadioButton(
        giftInformationState.vaultLocationSelectedOptions
      );
      isRestrictedItemVaultLocationValid =
        restrictedItemValidation && vaultLocationValidation;
    }

    if (
      form.checkValidity() === false ||
      validationMessages.length > 0 ||
      propertyDescriptionValidation.isInvalid ||
      propertyReportState.fileInfectedStatus ||
      !appraisalToUploadValidation ||
      !wantToBuyValidation ||
      !isRestrictedItemVaultLocationValid
    ) {
      event.stopPropagation();
      if (propertyReportState.fileInfectedStatus) {
        validationMessages.push(
          "Upload Images and Documents: Please delete the infected file(s)."
        );
      }
      let filteredArray = validationMessages.filter((item, index) => {
        return validationMessages.indexOf(item) === index;
      });
      updatePropertyReportState({
        alertBodyArray: filteredArray,
        isSubmitLoading: false,
        isSubmitDisabled: false,
        showErrorAlert: true,
      });
    } else {
      const data: PropertyReportDto = toJSON(true);
      try {
        if (props.workflow === "APPROVE_FOREIGN_GIFT") {
          await propertyService.approvePropertyReport(data);
        } else {
          await propertyService.savePropertyReport(data);
        }
        updatePropertyReportState({
          isSubmitLoading: false,
          isSubmitDisabled: false,
          FormErrorMessage: "",
          showErrorAlert: false,
          isSubmitted: true,
        });
        isFormSubmitted.next(false);
        props.history.push({
          pathname: `${Paths.foreignGiftList}`,
        });
        addToast({
          text: "Request successfully submitted",
          type: "success",
          heading: "Success",
        });
      } catch (error) {
        updatePropertyReportState({
          FormErrorMessage: error.data?.message,
          showErrorAlert: true,
          isSubmitLoading: false,
          isSubmitDisabled: false,
        });
        addToast({
          text: "Error saving request",
          type: "error",
          heading: "Error",
        });
      }
    }
  };

  function toggleAccordion(event, section) {
    let openItems = propertyReportState.accordion.openItems;
    let { accordion } = propertyReportState;
    // const itemIndex = openItems.indexOf(section);
    if (section === "All") {
      // when clicked on expland All - set openItems to contain all the items
      if (accordion["toggleAllAccordion"]) {
        openItems = [];
      } else {
        openItems = [
          "toggleICNAccordion",
          "toggleAgencyInfoAccordion",
          "toggleReportingAgencyAddressAccordion",
          "togglePointofContactAccordion",
          "togglePropertyLocationAccordion",
          "togglePropertyCustodianAccordion",
          "togglePropertyInformationAccordion",
          "toggleFederalSupplyClassAccordion",
          "toggleQuantityAndCostAccordion",
          "toggleAdditionalInformationAccordion",
          "toggleUploadMultiplPicturesDocumentsAccordion",
          "toggleGiftInfoAccordion",
          "toggleDonorInfoAccordian",
          "toggleRecipientInfoAccordian",
          "toggleAppraisalInfoAccordion",
        ];
      }
      let isExpanded = !accordion["toggleAllAccordion"];
      accordion["toggleAllAccordion"] = isExpanded;
      accordion["toggleICNAccordion"] = isExpanded;
      accordion["toggleAgencyInfoAccordion"] = isExpanded;
      accordion["toggleReportingAgencyAddressAccordion"] = isExpanded;
      accordion["togglePointofContactAccordion"] = isExpanded;
      accordion["togglePropertyLocationAccordion"] = isExpanded;
      accordion["togglePropertyCustodianAccordion"] = isExpanded;
      accordion["togglePropertyInformationAccordion"] = isExpanded;
      accordion["toggleFederalSupplyClassAccordion"] = isExpanded;
      accordion["toggleQuantityAndCostAccordion"] = isExpanded;
      accordion["toggleAdditionalInformationAccordion"] = isExpanded;
      accordion["toggleUploadMultiplPicturesDocumentsAccordion"] = isExpanded;
      accordion["toggleGiftInfoAccordion: boolean;"] = isExpanded;
      accordion["toggleDonorInfoAccordian"] = isExpanded;
      accordion["toggleRecipientInfoAccordian"] = isExpanded;
      accordion["toggleAppraisalInfoAccordion"] = isExpanded;
      accordion["openItems"] = openItems;
      updatePropertyReportState({
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
      //add to open item list
      if (itemIndex === -1) {
        openItems.push(section);
      }
    } else {
      //remove from the openItems
      openItems.splice(itemIndex, 1);
    }
    //update particular accordion state
    accordion[section] = !accordion[section];
    accordion["openItems"] = openItems;
    accordion["toggleAllAccordion"] = openItems.length === 11;
    updatePropertyReportState({
      accordion: accordion,
    });
  }

  function openBarcodeModal() {
    updateIcnState({ showBarcodeModal: true });
  }

  function closeBarcodeModal() {
    updateIcnState({ showBarcodeModal: false });
  }
  /*
   * TODO : Find a better approach to reset options
   * */
  function resetOptions() {
    updateGiftInformationState({
      interestedOptions: [
        { value: "Yes", id: "Y", isSelected: false },
        { value: "No", id: "N", isSelected: false },
      ],
      restrictedItemSelectedOptions: [
        { value: "Yes", id: "restrictedYes", isSelected: false },
        { value: "No", id: "restrictedNo", isSelected: false },
      ],
      vaultLocationSelectedOptions: [
        { value: "Franconia", id: "franconia", isSelected: false },
        { value: "DOE", id: "doe", isSelected: false },
      ],
    });
    updatePocState({
      pocOption: [
        {
          id: "notify-poc",
          isSelected: false,
          value: "Notify Point of Contact when Available for Sale",
        },
      ],
    });
  }

  const onFileUpload = (data: any) => {
    updatePropertyInfoState({ fileUploaded: data.fileUploaded });
  };

  const icnItem = [
    {
      title: "Item Control Number",
      content: (
        <IcnClass
          resetOptions={resetOptions}
          propertyGroup={PropertyGroupType.FOREIGN_GIFT}
        />
      ),
      expanded: propertyReportState.accordion.toggleICNAccordion,
      id: "icn",
      trigger: "common",
      handleToggle: (event) => toggleAccordion(event, "toggleICNAccordion"),
    },
  ];
  const items = [
    {
      title: "Agency Information",
      content: <AgencyInfoClass />,
      expanded: propertyReportState.accordion.toggleAgencyInfoAccordion,
      id: "agencyInfo",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleAgencyInfoAccordion"),
    },
    {
      title: "Reporting Agency Address",
      content: <RepAgencyAddressClass />,
      expanded:
        propertyReportState.accordion.toggleReportingAgencyAddressAccordion,
      id: "reportingAgencyAddress",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleReportingAgencyAddressAccordion"),
    },
    {
      title: "Point of Contact",
      content: <PocClass />,
      expanded: propertyReportState.accordion.togglePointofContactAccordion,
      id: "pointofContact",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "togglePointofContactAccordion"),
    },
    {
      title: "Donor Information",
      content: <DonorInformation />,
      expanded: propertyReportState.accordion.toggleDonorInfoAccordian,
      id: "donorInfo",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleDonorInfoAccordian"),
    },
    {
      title: "Recipient Information",
      content: <RecipientInformation />,
      expanded: propertyReportState.accordion.toggleRecipientInfoAccordian,
      id: "recipientInfo",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleRecipientInfoAccordian"),
    },
    {
      title: "Gift information ",
      content: <GiftInformation workflow={props.workflow} />,
      expanded: propertyReportState.accordion.toggleGiftInfoAccordion,
      id: "giftInfo",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleGiftInfoAccordion"),
    },
    {
      title: "Appraisal Information",
      content: <AppraisalInformation />,
      expanded: propertyReportState.accordion.toggleAppraisalInfoAccordion,
      id: "appraisalInfo",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleAppraisalInfoAccordion"),
    },
    {
      title: "Appraisal Agency Information",
      content: <AppraisalAgencyInformation />,
      expanded:
        propertyReportState.accordion.toggleAppraisalAgencyInformationAccordian,
      id: "appraisalAgencyInformation",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleAppraisalAgencyInformationAccordian"),
    },
    {
      title: "Upload Images and Documents",
      content: (
        <Upload
          icn={joinIcn(icnState)}
          fileInfectedStatus={(value) =>
            updatePropertyReportState({ fileInfectedStatus: value })
          }
          inValid={appraisalAgencyInformationState.appraisalToUpload}
          validationMessage="Please upload images or documents"
          onFileUpload={onFileUpload}
        />
      ),
      expanded:
        propertyReportState.accordion
          .toggleUploadMultiplPicturesDocumentsAccordion,
      id: "uploadMultiplPicturesDocuments",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleUploadMultiplPicturesDocumentsAccordion"),
    },
  ];

  function handleActionHistory() {
    updatePropertyReportState({
      showActionHistoryModal: true,
    });
    callActionHistoryByObjectTypeAndId();
  }

  function callActionHistoryByObjectTypeAndId() {
    propertyService
      .getProperty(props.match.params.icn)
      .then((response: any) => {
        let icn = response?.data?.itemControlNumber;
        const data = {
          params: {
            objectType: "ICN",
            objectId: icn,
          },
        };

        propertyService
          .getActionHistoryForProperty(data)
          .then((response: any) => {
            updatePropertyReportState({
              actionHistoryData: response.data,
              showAddToPropertyActionModal: true,
            });
          })
          .catch((error: any) => {
            console.log(error);
          });
      });
  }

  function handleAddToPropertyClose(event: any) {
    updatePropertyReportState({
      showAddToPropertyActionModal: false,
      showActionHistoryModal: false,
    });
  }

  return (
    <StrictMode>
      <div className={"property-registration grid-row ui-ppms"}>
        <div className="header-row grid-row grid-gap-4">
          <h1>Foreign Gifts Report Data Creation</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <ForeignGiftSideNav isIcnValid={icnState.isIcnValid} />
              </nav>
            </div>
          </div>
        </div>
        <div
          className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs"
          id="foreign-gift-report-create-main-content"
        >
          <div className="grid-row">
            <div className={"desktop:grid-col-12"}>
              <PPMSAlert
                id={"form-verification-error"}
                show={propertyReportState.showErrorAlert}
                alertBody={
                  propertyReportState.FormErrorMessage ||
                  " Error submitting request."
                }
                alertClassName={"form-verification-error"}
                alertVariant={"danger"}
                alertKey={"form-verification-error"}
                alertBodyArray={propertyReportState.alertBodyArray}
              />
              {propertyReportState.showErrorAlert && <hr />}
            </div>
          </div>
          <Form
            noValidate
            validated={propertyReportState.isFormValidated}
            className={"usa-accordion--bordered desktop:grid-col-12"}
            onSubmit={focusOnErrorAfterSubmit}
          >
            <div className={"grid-row grid-gap-2"}>
              {icnState.isIcnValid && (
                <PropertyReportButtons
                  saveFunction={handlePropertySave}
                  isSubmitDisabled={propertyReportState.isSubmitDisabled}
                  isSubmitLoading={propertyReportState.isSubmitLoading}
                  cancelFunction={handleCancel}
                  workflow={props.workflow}
                  saveId={"save-property-top"}
                  cancelId={"cancel-property-top"}
                  approveId={"approve-property-top"}
                  isSaveAndReportDisplayed={false}
                />
              )}
              <div className={"margin-left-auto col-md-auto"}>
                {!propertyReportState.isDraft && (
                  <PPMSButton
                    className={"out-button"}
                    type={"button"}
                    value={""}
                    label={"Action History"}
                    onPress={handleActionHistory}
                    id={"action-history"}
                  />
                )}
              </div>
            </div>

            <div className={"grid-row grid-gap-2"}>
              <div className={"margin-top-3 col-md-auto margin-left-auto"}>
                <PPMSButton
                  id={"generate-barcode"}
                  label={" Generate Barcode"}
                  type={"button"}
                  isDisabled={!icnState.isIcnValid}
                  onPress={openBarcodeModal}
                  className={"out-button"}
                />
                <PPMSButton
                  variant={"link"}
                  className="usa-link float:right"
                  id={"expandToggle"}
                  type={"button"}
                  label={
                    propertyReportState.accordion.toggleAllAccordion
                      ? "Collapse All"
                      : "Expand All"
                  }
                  onPress={(event) => toggleAccordion(event, "All")}
                  isDisabled={!icnState.isIcnValid}
                />
              </div>
            </div>
            <br />

            <PPMSAccordion bordered={true} items={icnItem} />
            
            {icnState.isIcnValid && (
              <div>
                <PPMSAccordion bordered={true} items={items} />
                
                <div className={"grid-row grid-gap-2"}>
                  <PropertyReportButtons
                    saveFunction={handlePropertySave}
                    isSubmitDisabled={propertyReportState.isSubmitDisabled}
                    isSubmitLoading={propertyReportState.isSubmitLoading}
                    cancelFunction={handleCancel}
                    workflow={props.workflow}
                    saveId={"save-property-bottom"}
                    cancelId={"cancel-property-bottom"}
                    approveId={"approve-property-bottom"}
                    isSaveAndReportDisplayed={false}
                  />
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <PPMSModal
          show={propertyReportState.showAddToPropertyActionModal}
          handleClose={handleAddToPropertyClose}
          handleSave={handleAddToPropertyClose}
          title={
            propertyReportState.showActionHistoryModal
              ? "Action History ICN: " +
                getFormattedICN(
                  propertyReportState.propertyData?.itemControlNumber
                )
              : "This Item Requires Reimbursement"
          }
          centered={true}
          backdrop={"static"}
          label={"Ok"}
          hideLabelCancel={true}
          hideLabel={propertyReportState.showActionHistoryModal ? true : false}
          size={propertyReportState.showActionHistoryModal ? "lg" : null}
          body={
            propertyReportState.showActionHistoryModal ? (
              <ModalActionHistoryContent
                data={propertyReportState.actionHistoryData}
                listID={"list-id"}
                title={
                  propertyReportState.showActionHistoryModal
                    ? propertyReportState.propertyData?.itemControlNumber
                    : "This Item Requires Reimbursement"
                }
              />
            ) : (
              <ModalAddToCartContent />
            )
          }
          id={"addToCart-files"}
        />
      </div>
      <PPMSModal
        body={<BarCodePrint icn={getFormattedICN(joinIcn(icnState))} />}
        id={"barcode-modal"}
        show={icnState.showBarcodeModal}
        label={"Print"}
        labelCancel={"Cancel"}
        title={`ICN - ${getFormattedICN(joinIcn(icnState))}`}
        handleClose={closeBarcodeModal}
        handleSave={() => {}}
      />
    </StrictMode>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const ModalAddToCartContent = () => {
  return (
    <div>
      <p>
        You have selected an item that requires reimbursement of Fair Market
        Value. Do not checkout this item unless your agency is prepared to pay
        Fair Market Value. Please delete this item from your cart if you cannot
        pay Fair Market Value.
      </p>
    </div>
  );
};

const ModalActionHistoryContent = ({ data, listID, title }) => {
  return (
    <div className={"action-history-container"}>
      <PPMSActionList data={data} listID={listID} title={title} />
    </div>
  );
};
export default connect(null, mapDispatchToProps)(ForeignGiftsReportCreate);
