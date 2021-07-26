import React, { StrictMode, useContext, useEffect } from "react";
import { Form } from "react-bootstrap";
import { RepAgencyAddressStateJson } from "./rep-agency-address-class/RepAgencyAddressState";
import { PropertyLocationStateJson } from "./property-location-class/PropertyLocationState";
import { PropCustStateJson } from "./property-custodian-class/PropCustState";
import { PropertyContext } from "./PropertyContext";
import IcnClass from "./icn-class/IcnClass";
import AgencyInfoClass from "./agency-info-class/AgencyInfoClass";
import RepAgencyAddressClass from "./rep-agency-address-class/RepAgencyAddressClass";
import PropertyLocationClass from "./property-location-class/PropertyLocationClass";
import PocClass from "./point-of-contact-class/PocClass";
import { FederalSupplyClass } from "./federal-supply-class/FederalSupplyClass";
import PropertyInfoClass from "./property-info-class/PropertyInfoClass";
import PropCustClass from "./property-custodian-class/PropCustClass";
import { PocStateJson } from "./point-of-contact-class/PocState";
import { IcnState } from "./icn-class/IcnState";
import { Upload } from "./uploads/Upload";
import { AdditionalInfoClass } from "./additional-info-class/AdditionalInfoClass";
import UnitOfIssueClass from "./unit-of-issue-class/UnitOfIssueClass";
import { UserUtils } from "../../../utils/UserUtils";
import {
  aircraftFSCCode,
  reportAgainOptions,
  vehicleFSCCode,
  vesselFSCCode,
  weaponsFSCCode,
} from "./constants/Constants";

import { computersFSCCode } from "./constants/ComputerConstants";
import moment from "moment";
import {
  getFormattedICN,
  isEmptyCheck,
  validatePropertyDescription,
  validateSalesNotes,
} from "./validations/propertyFieldValidations";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import {
  FSCAircraftData,
  FSCComputerData,
  FSCModel,
  FSCOtherData,
  FSCTrailerData,
  FSCVehicleData,
  FSCVesselData,
} from "./federal-supply-class/model/FSCModel";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { PropertyReportDto } from "../../models/PropertyReport";
import { PageHelper, Paths } from "../../Router";
import { isFormSubmitted } from "../../../service/validation.service";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import SideNav from "./SideNav";
import { BarCodePrint } from "./common/BarcodePrint";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import PropertyReportButtons from "./PropertyReportButtons";
import {
  formatExtension,
  formatPhone,
  nullToStringUtil,
} from "../../../ui-kit/utilities/FormatUtil";
import { PPMSActionList } from "../../../ui-kit/components/PPMS-action-list";
import { SalesNotesClass } from "./sales-notes-class/SalesNotesClass";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ReportAgainDTO } from "../../models/ReportAgain";
import { PPMSToggleRadio } from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import { ReportAgain } from "./common/ReportAgain";
import { ReportAgainStateDefault } from "./common/ReportAgainState";
import { checkIfSelected } from "./PropertyReportCreate";

interface PropertyReportProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions?: any;
}

export function PropertyReportUpdate(props: PropertyReportProps) {
  let commonApiService = new CommonApiService();

  let propertyService = new PropertyApiService();
  //set state for this functional componet
  const {
    propertyInfoState,
    icnState,
    agencyInfoState,
    salesNotesState,
    repAgencyAddressState,
    propertyLocationState,
    propCustState,
    pocState,
    propertyReportState,
    unitOfIssueState,
    fscState,
    reportAgainState,
    updateReportAgainState,
    updatePocState,
    updateFSCWeaponState,
    updateFSCOtherState,
    updateFSCComputerState,
    updatePropertyReportState,
    updateFSCState,
    updateFSCVehicleState,
    updateIcnState,
    updateAgencyInfoState,
    updateSalesNotesState,
    updateRepAgencyAddressState,
    updatePropertyLocationState,
    updatePropCustState,
    updatePropertyInfoState,
    updateUnitOfIssueState,
    updateAdditionalInfoState,
    additionalInfoState,
    fscTrailerState,
    fscVesselState,
    updateFSCVesselState,
    updateFSCTrailerState,
    fscAircraftState,
    updateFscAircraftState,
    fscComputerState,
    fscVehicleState,
  } = useContext(PropertyContext);
  const { addToast } = props.actions;

  //By passing in an empty array, we're telling React not to track any changes, only run once, effectively simulating componentDidMount.
  useEffect(() => {
    window.scrollTo(0, 0);
    propertyService
      .getProperty(props.match.params.icn)
      .then((response: any) => {
        let aacCode = response?.data?.aacId;
        let agencyBureau = response?.data?.agencyBureau;
        let icn = response?.data?.itemControlNumber;
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

        let plKeyDisplayStr: any =
          response?.data?.propertyLocation?.line1 +
          "-" +
          response?.data?.propertyLocation?.city;

        let pcKeyDisplayStr: any =
          response?.data?.propertyCustodian?.lastName +
          "-" +
          response?.data?.propertyCustodian?.email;
        updateRepAgencyAddressState({
          repAacCode: response?.data?.aacId,
          repAddress1: response?.data?.reportingAgencyAddress?.line1,
          repAddress2: response?.data?.reportingAgencyAddress?.line2,
          repAddress3: response?.data?.reportingAgencyAddress?.line3,
          repCity: response?.data?.reportingAgencyAddress?.city,
          repState: response?.data?.reportingAgencyAddress?.stateCode,
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
                repData["line1"].trim() + "-" + repData["city"].trim();
              value = { ...repData, keyDisplayStr: keyDisplayStr };
              values.push(value);
            });
            updateRepAgencyAddressState({
              updateDisabled: updateButtonDisabled,
              addressId: addressId,
              repAddressId: aacReportingAddressId,
              repLocValues: values,
            });
          })
          .catch((error) => {
            //todo handle the error.
            console.log(error);
          });

        updatePocState({
          pocAacCode: response?.data?.aacId,
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
            //Point of Contact Dropdown
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
                pocData["lastName"].trim() + "-" + pocData["email"].trim();
              value = { ...pocData, keyDisplayStr: keyDisplayStr };
              values.push(value);
            });
            updatePocState({
              updateDisabled: updateButtonDisabled,
              contactId: contactId,
              pocValues: values,
              pocId: pocId,
            });
          })
          .catch((error: any) => {
            //todo handle the error.
            console.log(error);
          });
        updatePropertyLocationState({
          propAacCode: response?.data?.aacId,
          propAddress1: response?.data?.propertyLocation?.line1
            ? response?.data?.propertyLocation?.line1
            : "",
          propAddress2: response?.data?.propertyLocation?.line2
            ? response?.data?.propertyLocation?.line2
            : "",
          propAddress3: response?.data?.propertyLocation?.line3
            ? response?.data?.propertyLocation?.line3
            : "",
          propCity: response?.data?.propertyLocation?.city
            ? response?.data?.propertyLocation?.city
            : "",
          propState: response?.data?.propertyLocation?.stateCode
            ? response?.data?.propertyLocation?.stateCode
            : "",
          propStateCode: response?.data?.propertyLocation?.stateCode
            ? response?.data?.propertyLocation?.stateCode
            : "",
          propZipCode: response?.data?.propertyLocation?.zip
            ? response?.data?.propertyLocation?.zip
            : "",
          propZip2Code: response?.data?.propertyLocation?.zip2
            ? response?.data?.propertyLocation?.zip2
            : "",
          keyDisplayStr: plKeyDisplayStr,
          disabledZipExtension: false,
        });

        commonApiService
          .getPropertyLocationList(response?.data?.aacId)
          .then((res: any) => {
            let pll: any = res.data;
            let updateButtonDisabled: boolean = true;
            let addressId: any = "";
            let aacPropertyLocationId: any = "";
            let values: any = [];
            pll.forEach((pllData: any) => {
              if (
                response?.data?.propertyLocation?.line1 ===
                  pllData["line1"].trim() &&
                response?.data?.propertyLocation?.city ===
                  pllData["city"].trim()
              )
                updateButtonDisabled = false;
              addressId = pllData["addressId"];
              aacPropertyLocationId = pllData["aacPropertyLocationId"];

              //Property Location dropdown
              let value: any = {};
              let keyDisplayStr =
                pllData["line1"].trim() + "-" + pllData["city"].trim();
              value = { ...pllData, keyDisplayStr: keyDisplayStr };
              values.push(value);
            });

            updatePropertyLocationState({
              updateDisabled: updateButtonDisabled,
              addressId: addressId,
              propLocationId: aacPropertyLocationId,
              propLocValues: values,
            });
          })
          .catch((error) => {
            //todo handle the error.
            console.log(error);
          });
        updatePropCustState({
          aacCode: response?.data?.aacId,
          propCustFirstName: response?.data?.propertyCustodian?.firstName
            ? response?.data?.propertyCustodian?.firstName
            : "",
          propCustLastName: response?.data?.propertyCustodian?.lastName
            ? response?.data?.propertyCustodian?.lastName
            : "",
          propCustPhone: response?.data?.propertyCustodian?.phone
            ? formatPhone(
                nullToStringUtil(response?.data?.propertyCustodian?.phone) + ""
              )
            : "",
          propCustPhoneExt: response?.data?.propertyCustodian?.phoneExtension
            ? formatExtension(
                nullToStringUtil(
                  response?.data?.propertyCustodian?.phoneExtension
                ) + ""
              )
            : "",
          propCustFax: response?.data?.propertyCustodian?.fax
            ? formatPhone(
                nullToStringUtil(response?.data?.propertyCustodian?.fax) + ""
              )
            : "",
          propCustEmail: response?.data?.propertyCustodian?.email
            ? response?.data?.propertyCustodian?.email
            : "",
          propCustCcEmail: response?.data?.propertyCustodian?.ccEmail
            ? response?.data?.propertyCustodian?.ccEmail
            : "",
          propCustNotify: true,
          propCustNotifyDefault: true ? "notify-propCust" : "",
          keyDisplayStr: pcKeyDisplayStr,
          propCustOptions: [
            {
              value: "Notify Property Custodian when Available for Sale",
              id: "notify-propCust",
              isSelected: response?.data?.notifyCustodian,
            },
          ],
        });
        commonApiService
          .getPropertyCustodianList(response?.data?.aacId)
          .then((res: any) => {
            let pcl: any = res.data;
            let updateButtonDisabled: boolean = true;
            let contactId: any = "";
            let aacPropertyCustodianId: any = "";
            let values: any = [];
            pcl.forEach((pclData: any) => {
              if (
                response?.data?.propertyCustodian?.lastName ===
                  pclData["lastName"].trim() &&
                response?.data?.propertyCustodian?.email ===
                  pclData["email"].trim()
              )
                updateButtonDisabled = false;
              contactId = pclData["contactID"];
              aacPropertyCustodianId = pclData["aacPropertyCustodianId"];
              let value: any = {};
              let keyDisplayStr =
                pclData["lastName"].trim() + "-" + pclData["email"].trim();
              value = { ...pclData, keyDisplayStr: keyDisplayStr };
              values.push(value);
            });
            updatePropCustState({
              updateDisabled: updateButtonDisabled,
              contactId: contactId,
              propCustId: aacPropertyCustodianId,
              propCustValues: values,
            });
          })
          .catch((error) => {
            //todo handle the error.
            console.log(error);
          });
        updatePropertyInfoState({
          propType: response?.data?.propertyType
            ? response?.data?.propertyType
            : "",
          agencyLocationCode: response?.data?.agencyLocationCode
            ? response?.data?.agencyLocationCode
            : "",
          amountTobeReimbursed: response?.data?.amountTobeReimbursed
            ? response?.data?.amountTobeReimbursed
            : "",
          agencyControlNumber: response?.data?.agencyControlNumber
            ? response?.data?.agencyControlNumber
            : "",
          reimbursementIsReq: response?.data?.reimbursementRequiredFlag
            ? response?.data?.reimbursementRequiredFlag
            : "",
          isDonation: response?.data?.isDonation
            ? response?.data?.isDonation
            : "",
          isExchangeSales: response?.data?.isExchangeSale
            ? response?.data?.isExchangeSale
            : "",
        });
        let fsc = new FSCModel();
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
                fscData["fscCategory"] = getFscCategory(
                  item.code,
                  aacCode,
                  agencyBureau
                );
                updateFSCState({
                  isValid: true,
                  fcsSelectedValues: selectedValue,
                  fcsSelectedValue: response?.data?.federalSalesCenter,
                  data: fscData,
                });
                switch (fscData["fscCategory"]) {
                  case "weapon":
                    let weaponObject = {
                      make: response?.data?.make ? response.data.make : "",
                      model: response?.data?.model ? response.data.model : "",
                      type: response?.data?.weapon?.type
                        ? response.data.weapon.type
                        : "",
                      size: response?.data?.weapon?.size
                        ? response.data.weapon.size
                        : "",
                      longName: "",
                      specialDescriptionCode: response?.data
                        ?.specialDescriptionCode
                        ? response.data.specialDescriptionCode
                        : "",
                      specialDescriptionText: response?.data
                        ?.specialDescriptionText
                        ? response.data.specialDescriptionText
                        : "",
                    };
                    if (response?.data?.weapon?.weaponId) {
                      weaponObject.longName = `${weaponObject.type} ${weaponObject.size} ${weaponObject.make} ${weaponObject.model}`;
                    }
                    fsc.weapon = weaponObject;
                    fsc.specialDescriptionCode =
                      weaponObject.specialDescriptionCode;
                    fsc.specialDescriptionText =
                      weaponObject.specialDescriptionText;
                    updateFSCWeaponState({
                      selectedValues:
                        response?.data?.weapon &&
                        !isEmptyCheck(response.data.weapon.type)
                          ? [weaponObject]
                          : [],
                      FSCWeaponData: weaponObject,
                    });
                    break;
                  case "other":
                    let otherData = {
                      itemName: response?.data?.itemName
                        ? response.data.itemName
                        : "",
                      make: response?.data?.make ? response.data.make : "",
                      model: response?.data?.model ? response.data.model : "",
                      specialDescriptionCode: response?.data
                        ?.specialDescriptionCode
                        ? response.data.specialDescriptionCode
                        : "",
                      specialDescriptionText: response?.data
                        ?.specialDescriptionText
                        ? response.data.specialDescriptionText
                        : "",
                      valueAddedServices: response?.data?.valueAddedServices
                        ? response.data.valueAddedServices
                        : "",
                    };
                    updateFSCOtherState({
                      FSCOtherData: otherData,
                      valueAddedServices: selectedValueOptions(
                        fscState.valueAddedServicesOptions,
                        [otherData.valueAddedServices]
                      ),
                    });
                    fsc.other = otherData;
                    fsc.specialDescriptionCode =
                      otherData.specialDescriptionCode;
                    fsc.specialDescriptionText =
                      otherData.specialDescriptionText;
                    break;
                  case "computer":
                    fscComputerState.fscComputersData = response?.data?.computer
                      ? response.data.computer
                      : {};

                    updateFSCComputerState({
                      fscComputerState,
                    });
                    updateFSCState({ fsc });
                    break;
                }
              }
            });
          })
          .catch((error) => {
            console.log(error);
          });
        updateUnitOfIssueState({
          quantity: response?.data?.quantity ? response?.data?.quantity : "",
          unitOfIssue: response?.data?.unitOfIssue
            ? response?.data?.unitOfIssue
            : "",
          originalAcqCost: response?.data?.originalAcquisitionCost
            ? "$" +
              response?.data?.originalAcquisitionCost
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : "",
          totalAcqCost: response?.data?.totalAcquisitionCost
            ? "$" +
              response?.data?.totalAcquisitionCost
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : "",
        });
        let manufactureDate = response?.data?.manufactureDate
          ? moment(response?.data?.manufactureDate).toDate()
          : null;
        let acquisitionDate = response?.data?.acquisitionDate
          ? moment(response?.data?.acquisitionDate).toDate()
          : null;
        let surplusReleaseDate = response?.data?.surplusReleaseDate
          ? moment(response?.data?.surplusReleaseDate).toDate()
          : null;

        let excessReleaseDate = response?.data?.excessReleaseDate
          ? moment(response?.data?.excessReleaseDate).toDate()
          : null;
        let fairMaketValue = "";

        if (response?.data?.fairMarketValue) {
          fairMaketValue = response.data.fairMarketValue
            .toString()
            .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
            .toString();

          fairMaketValue = fairMaketValue.replace(/^[0]+$/, "");

          if (/^\d+\.\d\d\d$/.test(fairMaketValue)) {
            fairMaketValue = Number(fairMaketValue).toFixed(2);
          }
          fairMaketValue =
            "$" +
            fairMaketValue
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              .replace("$", "");
        }
        updateAdditionalInfoState({
          fairMarketValue: fairMaketValue,
          fairMarketValueSave: response?.data?.fairMarketValue
            ? response?.data?.fairMarketValue
            : "",
          condition: response?.data?.conditionCode
            ? response?.data?.conditionCode
            : "",
          conditionOptions: selectedValueOptions(
            additionalInfoState.conditionOptions,
            response?.data?.conditionCode
              ? [response?.data?.conditionCode]
              : [""]
          ),
          hazardous: response?.data?.hazardous ? response?.data?.hazardous : "",
          hazardousOptions: selectedValueOptions(
            additionalInfoState.hazardousOptions,
            response?.data?.hazardous ? [response?.data?.hazardous] : [""]
          ),
          fightSafetyCriticalAircraftPart: response?.data?.fscapCode
            ? response?.data?.fscapCode
            : "",
          flightSafetyOptions: selectedValueOptions(
            additionalInfoState.flightSafetyOptions,
            response?.data?.fscapCode ? [response?.data?.fscapCode] : [""]
          ),
          dropAfterInternalScreeningOptions: selectedValueOptions(
            additionalInfoState.dropAfterInternalScreeningOptions,
            response?.data?.dropAfterInternalScreening ? ["Y"] : ["N"]
          ),
          dropAfterInternalScreeningFlag: response?.data
            ?.dropAfterInternalScreening
            ? "Y"
            : "N",
          dropAfterInternalScreening:
            response?.data?.dropAfterInternalScreening,
          manufacturer: response.data.manufacturer,
          propertyDescription: response.data.propertyDescription,
          acquisitionDate: acquisitionDate,
          dateOfManufacture: manufactureDate,
          surplusReleaseDate: surplusReleaseDate,
          excessReleaseDate: excessReleaseDate,
          demilitarization: response?.data?.demilitarizationCode,
          demilitarizationOptions: selectedValueOptions(
            additionalInfoState.demilitarizationOptions,
            [response?.data?.demilitarizationCode]
          ),
        });
        let salesActionHistoryNotes = [];
        const regex = /(<([^>]+)>)/gi;
        response?.data?.propertyNotes?.forEach((note) => {
          let historyNote = {
            triggeredBy: note.createdBy,
            description: note?.notes
              .replace(regex, "")
              .replaceAll("&nbsp;", ""),
            createdAt: note.updatedAt,
          };
          salesActionHistoryNotes.push(historyNote);
        });
        updateSalesNotesState({
          salesNotes: "",
          actionHistoryData: [...salesActionHistoryNotes],
        });
        fsc.fscCode = response?.data?.fscCode;
        fsc.itemName = response?.data?.itemName;
        fsc.model = response.data.model;
        fsc.make = response.data.make;
        fsc.specialDescriptionText = response.data.specialDescriptionText;
        fsc.specialDescriptionCode = response.data.specialDescriptionCode;
        updateFSCState({
          valueAddedServices: response.data.valueAddedServices
            ? response.data.valueAddedServices
            : "",
          niin: response?.data?.niinCode ? response?.data?.niinCode : "",
          federalSalesCenter: response?.data?.federalSalesCenter
            ? response?.data?.federalSalesCenter
            : "",
          itemName: response?.data?.itemName ? response?.data?.itemName : "",
          make: response?.data?.make ? response?.data?.make : "",
          model: response?.data?.model ? response?.data?.model : "",
          specialDescriptionCode: response?.data?.specialDescriptionCode
            ? response?.data?.specialDescriptionCode
            : "",
          specialDescriptionText: response?.data?.specialDescriptionText
            ? response?.data?.specialDescriptionText
            : "",
          fairMarketValue: response?.data?.fairMarketValue
            ? response?.data?.fairMarketValue
            : "",
          manufacturer: response?.data?.manufacturer
            ? response?.data?.manufacturer
            : "",
          specialInstructions:
            response?.data?.contractInventoryCode &&
            response?.data?.contractInventoryCode === "Y"
              ? "Contractor Inventory"
              : response?.data?.overseasInventoryCode &&
                response?.data?.overseasInventoryCode === "Y"
              ? "Overseas Inventory"
              : "",
          specialInstructionsOptions: [
            {
              value: "Contractor Inventory",
              id: "contractor-inventory",
              isSelected:
                response?.data?.contractInventoryCode &&
                response?.data?.contractInventoryCode === "Y",
              isDisabled:
                response?.data?.overseasInventoryCode &&
                response?.data?.overseasInventoryCode === "Y",
            },
            {
              value: "Overseas Inventory",
              id: "overseas-inventory",
              isSelected:
                response?.data?.overseasInventoryCode &&
                response?.data?.overseasInventoryCode === "Y",
              isDisabled:
                response?.data?.contractInventoryCode &&
                response?.data?.contractInventoryCode === "Y",
            },
          ],
          fsc: fsc,
        });
        if (!isEmptyCheck(response.data.vehicle)) {
          const fscVehicle = response.data.vehicle;
          updateFSCOtherState({
            valueAddedServices: selectedValueOptions(
              fscState.valueAddedServicesOptions,
              [response.data.valueAddedServices]
            ),
          });
          let vehicleFSCData: FSCVehicleData = {
            vehicleId: fscVehicle.vehicleId,
            transmissionType: fscVehicle.transmissionType,
            agencyClass: fscVehicle.agencyClass,
            tag: fscVehicle.tag,
            noOfCylinders: fscVehicle.numberOfCylinders,
            modelYear: fscVehicle.modelYear,
            fuelType: fscVehicle.fuelType,
            bodyStyle: fscVehicle.bodyStyle,
            vin: fscVehicle.vin,
            make: response.data.make,
            model: response.data.model,
            estimatedMileage: fscVehicle.estimatedMileage,
            color: fscVehicle.color,
            colorGradient: fscVehicle.colorGradient,
            recalled: fscVehicle.recalled,
            itemName: response?.data?.itemName,
            specialDescriptionCode: response?.data?.specialDescriptionCode
              ? response?.data?.specialDescriptionCode
              : "",
            specialDescriptionText: response?.data?.specialDescriptionText
              ? response.data.specialDescriptionText
              : "",
          };
          fsc.vehicle = vehicleFSCData;
          // updateFSCState({ fsc: fsc });
          updateFSCVehicleState({
            vehicleFSCData: vehicleFSCData,
            transmissionTypeOptions: selectedValueOptions(
              fscVehicleState.transmissionTypeOptions,
              [vehicleFSCData.transmissionType]
            ),
            recallOptions: selectedValueOptions(fscVehicleState.recallOptions, [
              vehicleFSCData.recalled,
            ]),
          });
        }

        if (!isEmptyCheck(response.data.vessel)) {
          const fscVessel = response.data.vessel;
          fscVesselState.vesselFSCData = fscVessel;
          fscVesselState.vesselFSCData.beam = fscVessel?.beam.toString();
          fscVesselState.vesselFSCData.draft = fscVessel?.draft.toString();
          fscVesselState.vesselFSCData.length = fscVessel?.length.toString();
          fscVesselState.componentsMissingDisable = fscVessel.areMajorComponentsMissing
            ? false
            : true;
          fscVesselState.asbestosTypeDisable = fscVessel.vesselHasAsbestos
            ? false
            : true;
          updateFSCVesselState({
            asbestosTypes: selectedValueOptions(
              fscVesselState.asbestosTypes,
              fscVessel.friable ? ["F"] : ["NF"]
            ),
            areMajorComponentsMissingOptions: selectedValueOptions(
              fscVesselState.areMajorComponentsMissingOptions,
              fscVessel.areMajorComponentsMissing ? ["Y"] : ["N"]
            ),
            doesVesselHaveAsbestosOptions: selectedValueOptions(
              fscVesselState.doesVesselHaveAsbestosOptions,
              fscVessel.vesselHasAsbestos ? ["Y"] : ["N"]
            ),
            doesVesselHavePCSOptions: selectedValueOptions(
              fscVesselState.doesVesselHavePCBOptions,
              fscVessel.vesselHasPCB ? ["Y"] : ["N"]
            ),
            isSurveyAvailableOptions: selectedValueOptions(
              fscVesselState.isSurveyAvailableOptions,
              fscVessel.marineSurveyAvailable ? ["Y"] : ["N"]
            ),
            isVessel50FeetOrOverOptions: selectedValueOptions(
              fscVesselState.isVessel50FeetOrOverOptions,
              fscVessel.isVessel50FeetOrOver ? ["Y"] : ["N"]
            ),
            missingOptions: selectedValueOptions(
              fscVesselState.missingOptions,
              [
                fscVessel.isEngineMissing ? "EN" : "",
                fscVessel.isElectronicMissing ? "EL" : "",
                fscVessel.isOtherMissing ? "OT" : "",
              ]
            ),
            isVesselInspectedOptions: selectedValueOptions(
              fscVesselState.isVesselInspectedOptions,
              fscVessel.vesselInspectedByCoastGuard ? ["Y"] : ["N"]
            ),
            isVesselSeaworthyOptions: selectedValueOptions(
              fscVesselState.isVesselSeaworthyOptions,
              fscVessel.isVesselSeaworthy ? ["Y"] : ["N"]
            ),
            itemName: response?.data?.itemName,
            length: fscVessel.length,
            make: fscVessel.make,
            model: fscVessel.model,
            specialDescriptionCode: response?.data?.specialDescriptionCode
              ? response?.data?.specialDescriptionCode
              : "",
            specialDescriptionText: response?.data?.specialDescriptionText
              ? response.data.specialDescriptionText
              : "",
          });
        }

        if (!isEmptyCheck(response.data.airCraft)) {
          const fscAircraft = response.data.airCraft;
          fscAircraftState.aircraftFSCData = fscAircraft;
          updateFscAircraftState({
            isAircraftOperationalOptions: selectedValueOptions(
              fscAircraftState.isAircraftOperationalOptions,
              [
                fscAircraft.isAircraftOperational ? "Y" : "",
                fscAircraft.isAircraftOperational === false ? "N" : "",
              ]
            ),
            areMajorComponentsMissingOptions: selectedValueOptions(
              fscAircraftState.areMajorComponentsMissingOptions,
              [
                fscAircraft.areMajorComponentsMissing ? "Y" : "",
                fscAircraft.areMajorComponentsMissing === false ? "N" : "",
              ]
            ),
            isDataPlateAvailableOptions: selectedValueOptions(
              fscAircraftState.isDataPlateAvailableOptions,
              [
                fscAircraft.isDataPlateAvailable ? "Y" : "",
                fscAircraft.isDataPlateAvailable === false ? "N" : "",
              ]
            ),
            areHistoricalMaintenanceRecordsAvailableOptions: selectedValueOptions(
              fscAircraftState.areHistoricalMaintenanceRecordsAvailableOptions,
              [
                fscAircraft.areHistoricalMaintenanceRecordsAvailable ? "Y" : "",
                fscAircraft.areHistoricalMaintenanceRecordsAvailable === false
                  ? "N"
                  : "",
              ]
            ),
            isAircraftCertifiedByFAAOptions: selectedValueOptions(
              fscAircraftState.isAircraftCertifiedByFAAOptions,
              [
                fscAircraft.isAircraftCertifiedByFAA ? "Y" : "",
                fscAircraft.isAircraftCertifiedByFAA === false ? "N" : "",
              ]
            ),
            isAircraftMaintainedByFAAOptions: selectedValueOptions(
              fscAircraftState.isAircraftMaintainedByFAAOptions,
              [
                fscAircraft.isAircraftMaintainedByFAA ? "Y" : "",
                fscAircraft.isAircraftMaintainedByFAA === false ? "Y" : "",
              ]
            ),

            isAircraftUsedNonFlightPurposeOptions: selectedValueOptions(
              fscAircraftState.isAircraftUsedNonFlightPurposeOptions,
              [
                fscAircraft.isAircraftUsedNonFlightPurpose ? "Y" : "",
                fscAircraft.isAircraftUsedNonFlightPurpose === false ? "N" : "",
              ]
            ),

            isEngineMissingOptions: selectedValueOptions(
              fscAircraftState.isEngineMissingOptions,
              [fscAircraft.isEngineMissing ? "EM" : ""]
            ),

            otherMissingComponentsOptions: selectedValueOptions(
              fscAircraftState.otherMissingComponentsOptions,
              [
                fscAircraft.avionicsOtherNoMissing === "Y" ? "Y" : "",
                fscAircraft.avionicsOtherNoMissing === "O" ? "O" : "",
                fscAircraft.avionicsOtherNoMissing === "N" ? "N" : "",
              ]
            ),

            nonFlightPurposeOptions: selectedValueOptions(
              fscAircraftState.nonFlightPurposeOptions,
              [
                fscAircraft.isGroundTraining === true ? "isGroundTraining" : "",
                fscAircraft.isStaticDisplay === true ? "isStaticDisplay" : "",
                fscAircraft.isExtensiveDisassemblyAndReassembly === true
                  ? "isExtensiveDisassemblyAndReassembly"
                  : "",
                fscAircraft.isRepeatedBurningForFireFightingTraining === true
                  ? "isRepeatedBurningForFireFightingTraining"
                  : "",
                fscAircraft.isExtensiveCannibalization === true
                  ? "isExtensiveCannibalization"
                  : "",
              ]
            ),
          });
        }

        if (!isEmptyCheck(response.other)) {
          fsc.other = new FSCOtherData();
        }

        if (!isEmptyCheck(response.data.computer)) {
          fscComputerState.fscComputersData = response.data.computer;
          const comData = fscComputerState.fscComputersData;

          updateFSCComputerState({
            isEquipmentForComputersForLearningOptions: selectedValueOptions(
              fscComputerState.isEquipmentForComputersForLearningOptions,
              [comData.isEquipmentForComputersForLearning === true ? "Y" : "N"]
            ),

            cflEligibleOptions: selectedValueOptions(
              fscComputerState.cflEligibleOptions,
              [
                comData.isEquipmentForComputersForLearningEligible === "A"
                  ? "allOrganizations"
                  : "",
                comData.isEquipmentForComputersForLearningEligible === "S"
                  ? "schoolsOnly"
                  : "",
              ]
            ),
            hardDiskStatus: selectedValueOptions(
              fscComputerState.hardDiskStatusOptions,
              [
                comData.hardDiskStatus === "Sanitized" ? "sanitized" : "",
                comData.hardDiskStatus === "Non-sanitized"
                  ? "nonSanitized"
                  : "",
                comData.hardDiskStatus === "Removed" ? "removed" : "",
                comData.hardDiskStatus === "Degaussed" ? "degaussed" : "",
                comData.hardDiskStatus === "Not applicable"
                  ? "notApplicable"
                  : "",
              ]
            ),
          });
        }

        if (!isEmptyCheck(response.data.trailerHome)) {
          const fscTrailer = response.data.trailerHome;
          fscTrailerState.trailerFSCData = response.data.trailerHome;
          updateFSCTrailerState({
            itemName: response?.data?.itemName,
            specialDescriptionCode: response?.data?.specialDescriptionCode
              ? response?.data?.specialDescriptionCode
              : "",
            specialDescriptionText: response?.data?.specialDescriptionText
              ? response.data.specialDescriptionText
              : "",
            trailerBodyStyleOptions: selectedValueOptions(
              fscTrailerState.trailerBodyStyleOptions,
              [fscTrailer.bodyStyle === "TT" ? ["TM"] : "PM"]
            ),
            trailerTypeStyleOptions: selectedValueOptions(
              fscTrailerState.trailerTypeStyleOptions,
              [
                fscTrailer.isSlideOut === true ? "isSlideOut" : "",
                fscTrailer.isAwning === true ? "isAwning" : "",
                fscTrailer.isNeitherTrailerType === true
                  ? "isNeitherTrailerType"
                  : "",
              ]
            ),
          });
        }
      })

      .catch((error) => {
        console.log(error);
      });

    propertyService
      .verifyPendingChangeRequest(
        props.match.params.icn,
        "SURPLUS_RELEASE_DATE"
      )
      .then((response) => {
        if (response.data.status === "Pending Change Request Found") {
          updateAdditionalInfoState({
            changeRequestIdSubmitted: true,
          });
        } else if (response.data.status === "No Pending Change Request") {
          updateAdditionalInfoState({
            changeRequestIdSubmitted: false,
          });
        }
      })
      .catch((error) => {});

    propertyService
      .verifyPendingChangeRequest(props.match.params.icn, "EXCESS_RELEASE_DATE")
      .then((response) => {
        if (response.data.status === "Pending Change Request Found") {
          updateAdditionalInfoState({
            changeRequestERDIdSubmitted: true,
          });
        } else if (response.data.status === "No Pending Change Request") {
          updateAdditionalInfoState({
            changeRequestERDIdSubmitted: false,
          });
        }
      })
      .catch((error) => {});

    commonApiService.getStateList().then((response: any) => {
      updatePropertyReportState({
        stateValues: response.data,
      });
    });

    return () => {
      isFormSubmitted.next(false);
    };
  }, []);

  function getFscCategory(code, aacCode, agencyBureau) {
    if (!isEmptyCheck(code)) {
      updateFSCState({
        validateFscSection: true,
      });
    } else {
      updateFSCState({
        validateFscSection: true,
      });
    }
    if (vehicleFSCCode.find((vehicleCode) => code === vehicleCode)) {
      return "vehicle";
    } else if (vesselFSCCode.find((vesselCode) => code === vesselCode)) {
      return "vessel";
    } else if (weaponsFSCCode.find((weaponsCode) => code === weaponsCode)) {
      return "weapon";
    } else if (
      computersFSCCode.find((computersCode) => code === computersCode)
    ) {
      return "computer";
    } else if (aircraftFSCCode.find((aircraftCode) => code === aircraftCode)) {
      return "aircraft";
    } else if (
      (code === "2330" && aacCode === "703112") ||
      (code === "2331" && /^70\d\d$/.test(agencyBureau))
    ) {
      return "trailer";
    } else {
      return "other";
    }
  }

  function toJSON(isSubmitFlag: boolean): PropertyReportDto {
    let repAgencyAddress = RepAgencyAddressStateJson(repAgencyAddressState)[0],
      propertyLocation = PropertyLocationStateJson(propertyLocationState)[0],
      propCust = PropCustStateJson(propCustState)[0],
      propertyPOC = PocStateJson(pocState)[0];
    // getting category code and name by filtering and splitting
    let categoryInfo = fscState.fscOptions
      .filter((item) => item.code === fscState.fsc.fscCode)
      .map((item) => {
        if (item !== null) {
          return item.categoryCode.split(" - ");
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
      propertyReportState.fsc.federalSalesCenter === "G" &&
      propertyInfoState.reimbursementIsReq === "Y" &&
      propertyInfoState.isDonation === "N" &&
      propertyInfoState.isExchangeSales === "N" &&
      agencyInfoState.agencyBureau.startsWith("97")
    ) {
      propertyInfoState.reimbursemenCode = "8";
    } else if (
      propertyReportState.fsc.federalSalesCenter === "G" &&
      propertyInfoState.reimbursementIsReq === "Y" &&
      propertyInfoState.isDonation === "N" &&
      propertyInfoState.isExchangeSales === "N" &&
      !agencyInfoState.agencyBureau.startsWith("97")
    ) {
      propertyInfoState.reimbursemenCode = "1";
    } else if (
      propertyReportState.fsc.federalSalesCenter === "G" &&
      propertyInfoState.reimbursementIsReq === "Y" &&
      propertyInfoState.isDonation === "N" &&
      propertyInfoState.isExchangeSales !== "N"
    ) {
      propertyInfoState.reimbursemenCode = "4";
    } else if (
      propertyReportState.fsc.federalSalesCenter === "G" &&
      propertyInfoState.reimbursementIsReq !== "Y" &&
      propertyInfoState.isDonation !== "N" &&
      propertyInfoState.isExchangeSales === "N"
    ) {
      propertyInfoState.reimbursemenCode = "5";
    } else if (
      propertyReportState.fsc.federalSalesCenter !== "G" &&
      propertyInfoState.reimbursementIsReq === "Y" &&
      propertyInfoState.isDonation === "N" &&
      propertyInfoState.isExchangeSales === "N"
    ) {
      propertyInfoState.reimbursemenCode = "A";
    } else if (
      propertyReportState.fsc.federalSalesCenter === "N" &&
      propertyInfoState.reimbursementIsReq === "Y" &&
      propertyInfoState.isDonation === "N" &&
      propertyInfoState.isExchangeSales !== "N"
    ) {
      propertyInfoState.reimbursemenCode = "E";
    }
    if (
      propertyReportState.fsc.federalSalesCenter === "N" &&
      propertyInfoState.reimbursementIsReq !== "Y" &&
      propertyInfoState.isDonation !== "N" &&
      propertyInfoState.isExchangeSales === "N"
    ) {
      propertyInfoState.reimbursemenCode = "C";
    }

    if (propertyInfoState.reimbursementIsReq === "Y")
      propertyInfoState.isDonation = "N";
    else propertyInfoState.isDonation = "Y";

    return ({
      //ccEmail: "",
      itemControlNumber: joinIcn(icnState),
      agencyBureau: agencyInfoState.aac,
      aacId: icnState.aacCode,
      propertyType: propertyInfoState.propType,
      agencyLocationCode: propertyInfoState.agencyLocationCode,
      agencyControlNumber: propertyInfoState.agencyControlNumber,
      amountTobeReimbursed: propertyInfoState.amountTobeReimbursed,
      propertyId: propertyReportState.propertyId,
      reportingAgencyAddress: repAgencyAddress,
      propertyLocation: propertyLocation,
      propertyPOC: propertyPOC,
      notify_poc: pocState.pocNotify,
      notifyCustodian: true,
      isSubmitted: isSubmitFlag,
      propertyCustodian: propCust,
      dropAfterInternalScreening:
        additionalInfoState.dropAfterInternalScreening,
      airCraft:
        fscAircraftState.aircraftFSCData != null
          ? fscAircraftState.aircraftFSCData
          : new FSCAircraftData(),
      vehicle: fscState.fsc.vehicle
        ? {
            vehicleId: fscState.fsc.vehicle.vehicleId,
            agencyClass: fscState.fsc.vehicle.agencyClass,
            transmissionType: fscState.fsc.vehicle.transmissionType,
            numberOfCylinders: fscState.fsc.vehicle.noOfCylinders,
            tag: fscState.fsc.vehicle.tag,
            modelYear: fscState.fsc.vehicle.modelYear,
            fuelType: fscState.fsc.vehicle.fuelType,
            bodyStyle: fscState.fsc.vehicle.bodyStyle,
            color: fscState.fsc.vehicle.color,
            colorGradient: fscState.fsc.vehicle.colorGradient,
            vin: fscState.fsc.vehicle.vin,
            estimatedMileage: fscState.fsc.vehicle.estimatedMileage,
            recalled: fscState.fsc.vehicle.recalled,
          }
        : {},

      weapon: fscState.fsc.weapon
        ? {
            type: fscState.fsc.weapon.type,
            size: fscState.fsc.weapon.size,
          }
        : {},
      vessel: fscState.fsc.vessel
        ? {
            nameOfVessel: fscVesselState.vesselFSCData.nameOfVessel,
            hullIdNumber: fscVesselState.vesselFSCData.hullIdNumber,
            length: fscVesselState.vesselFSCData.length,
            beam: fscVesselState.vesselFSCData.beam,
            draft: fscVesselState.vesselFSCData.draft,
            typesOfEngines: fscVesselState.vesselFSCData.typesOfEngines,
            hoursOnEngine: fscVesselState.vesselFSCData.hoursOnEngine,

            isVessel50FeetOrOver:
              fscVesselState.vesselFSCData.isVessel50FeetOrOver,
            isVesselSeaworthy: checkIfSelected(
              fscVesselState.isVesselSeaworthyOptions
            )
              ? fscVesselState.vesselFSCData.isVesselSeaworthy
              : null,
            areMajorComponentsMissing: checkIfSelected(
              fscVesselState.areMajorComponentsMissingOptions
            )
              ? fscVesselState.vesselFSCData.areMajorComponentsMissing
              : null,
            vesselHasPCB: checkIfSelected(
              fscVesselState.doesVesselHavePCBOptions
            )
              ? fscVesselState.vesselFSCData.vesselHasPCB
              : null,
            vesselHasAsbestos: checkIfSelected(
              fscVesselState.doesVesselHaveAsbestosOptions
            )
              ? fscVesselState.vesselFSCData.vesselHasAsbestos
              : null,
            friable: checkIfSelected(fscVesselState.asbestosTypes)
              ? fscVesselState.vesselFSCData.friable
              : null,
            vesselInspectedByCoastGuard: checkIfSelected(
              fscVesselState.isVesselInspectedOptions
            )
              ? fscVesselState.vesselFSCData.vesselInspectedByCoastGuard
              : null,
            marineSurveyAvailable: checkIfSelected(
              fscVesselState.isSurveyAvailableOptions
            )
              ? fscVesselState.vesselFSCData.marineSurveyAvailable
              : null,
            isElectronicMissing: fscVesselState.isSurveyAvailableOptions?.[0]
              ?.isSelected
              ? fscVesselState.vesselFSCData.isElectronicMissing
              : null,
            isEngineMissing: fscVesselState.isSurveyAvailableOptions?.[0]
              ?.isSelected
              ? fscVesselState.vesselFSCData.isElectronicMissing
              : null,
            isOtherMissing: fscVesselState.isSurveyAvailableOptions?.[0]
              ?.isSelected
              ? fscVesselState.vesselFSCData.isElectronicMissing
              : null,
          }
        : {},
      trailerHome:
        fscTrailerState.trailerFSCData != null
          ? fscTrailerState.trailerFSCData
          : new FSCTrailerData(),

      computer:
        fscComputerState.fscComputersData != null
          ? fscComputerState.fscComputersData
          : new FSCComputerData(),

      itemName: fscState.fsc.itemName,
      make: fscState.fsc.make,
      model: fscState.fsc.model,
      specialDescriptionCode: fscState.fsc.specialDescriptionCode,
      specialDescriptionText: fscState.fsc.specialDescriptionText,
      quantity: unitOfIssueState.quantity,
      unitOfIssue: unitOfIssueState.unitOfIssue,
      originalAcquisitionCost: originalAcqCost,
      totalAcquisitionCost: totalAcqCost,
      fairMarketValue: additionalInfoState.fairMarketValueSave,
      conditionCode: additionalInfoState.condition,
      hazardous: additionalInfoState.hazardous,
      demilitarizationCode: additionalInfoState.demilitarization,
      fscapCode: additionalInfoState.fightSafetyCriticalAircraftPart,
      acquisitionDate: additionalInfoState.acquisitionDate,
      manufacturer: additionalInfoState.manufacturer,
      manufactureDate: additionalInfoState.dateOfManufacture,
      surplusReleaseDate: !additionalInfoState.dropAfterInternalScreening
        ? additionalInfoState.surplusReleaseDate
        : null,
      excessReleaseDate: additionalInfoState.excessReleaseDate,
      isDeleted: false,
      propertyDescription: additionalInfoState.propertyDescription,
      salesNotes: salesNotesState.salesNotes,
      fscCode: fscState.fsc.fscCode,
      niinCode: fscState.fsc.niin,
      reimbursementRequiredFlag: propertyInfoState.reimbursementIsReq,
      isExchangeSale: propertyInfoState.isExchangeSales,
      isDonation: propertyInfoState.isDonation,
      reimbursementCode: propertyInfoState.reimbursemenCode,
      contractInventoryCode:
        fscState.specialInstructions === "Contractor Inventory" ? "Y" : "N",
      overseasInventoryCode:
        fscState.specialInstructions === "Overseas Inventory" ? "Y" : "N",
      federalSalesCenter: fscState.fcsSelectedValue
        ? fscState.fcsSelectedValue
        : "G",
      categoryCode: categoryInfo.length > 0 ? categoryInfo[0][0] : "",
      categoryName: categoryInfo.length > 0 ? categoryInfo[0][1] : "",
      valueAddedServices: fscState.fsc?.fscCode?.startsWith("23")
        ? fscState.valueAddedServices
        : "",
    } as unknown) as PropertyReportDto;
  }
  function handleCancel() {
    isFormSubmitted.next(false);
    if (UserUtils.isSalesUser()) {
      props.history.push({
        pathname: `${Paths.salesICNStatusList}`,
      });
    } else {
      props.history.push({
        pathname: `${Paths.propertyList}`,
      });
    }
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

  function success_toast() {
    addToast({
      text: "Request successfully saved",
      type: "success",
      heading: "Success",
    });
  }

  function failure_toast() {
    addToast({
      text: "Error saving request",
      type: "error",
      heading: "Error",
    });
  }

  function checkDuplicateICN() {
    if (
      !(
        reportAgainState.serialNumberIsinvalid &&
        reportAgainState.julianDateIsinvalid &&
        reportAgainState.suffixIsInvalid
      )
    ) {
      propertyService
        .verifyICN(joinReportAgainIcn())
        .then((response) => {
          if (response.data.status === "ICN Found") {
            updateReportAgainState({
              icnValid: false,
              icnVerificationMessage:
                "ICN already exists in the System. Please enter another ICN.",
            });
          } else {
            submitProperty(true);
          }
        })
        .catch(() => {
          updateReportAgainState({
            icnValid: false,
            icnVerificationMessage: "Error Confirming ICN. Please try again.",
          });
        });
    }
  }

  function handlePropertySave() {
    let validationMessages = [];
    updatePropertyReportState({
      alertBodyArray: validationMessages,
      FormErrorMessage: "",
      showErrorAlert: false,
    });
    const data: PropertyReportDto = toJSON(false);
    if (!UserUtils.isSalesUser()) {
      propertyService
        .savePropertyReport(data)
        .then((response: any) => {
          updatePropertyReportState({
            propertyId: response.data.propertyId,
          });
          success_toast();
        })
        .catch(() => {
          failure_toast();
        });
    } else {
      propertyService
        .saveSalesPropertyReport(data)
        .then((response: any) => {
          updatePropertyReportState({
            propertyId: response.data.propertyId,
          });
          success_toast();
        })
        .catch(() => {
          failure_toast();
        });
    }
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
    isFormSubmitted.next(true);
    event.preventDefault();
    if (!propertyReportState.reportAgain) {
      updatePropertyReportState({
        isSubmitLoading: true,
        isSubmitDisabled: true,
        triggerValidation: true,
      });
    } else {
      updatePropertyReportState({
        triggerValidation: true,
      });
    }
    if (!fscState?.data?.fscCode) {
      updateFSCState({
        isInvalid: true,
      });
    }
    updateFSCState({
      triggerValidation: true,
    });

    const form = event.currentTarget;
    let validationMessages = [];
    let propertyDescriptionValidation = validatePropertyDescription(
      additionalInfoState.propertyDescription
    );

    updateAdditionalInfoState({
      propertyDescriptionErrorMsg:
        propertyDescriptionValidation.validationError,
      propertyDescriptionIsInvalid: propertyDescriptionValidation.isInvalid,
    });

    let salesNotesValidation = validateSalesNotes(salesNotesState.salesNotes);
    updateSalesNotesState({
      salesNotesErrorMsg: salesNotesValidation.validationError,
      salesNotesIsInvalid: salesNotesValidation.isInvalid,
    });

    if (
      form.checkValidity() === false ||
      validationMessages.length > 0 ||
      propertyDescriptionValidation.isInvalid ||
      salesNotesValidation.isInvalid ||
      propertyReportState.fileInfectedStatus
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
      if (!propertyReportState.reportAgain) {
        submitProperty(false);
      } else {
        updatePropertyReportState({ showReportAgain: true });
      }
    }
  };

  function submitAndReportAgainCheck() {
    reportAgainOptions.forEach((element) => {
      element.isSelected = false;
    });
    updatePropertyReportState({
      reportAgainOptions: reportAgainOptions,
      reportAgain: true,
    });
  }

  function submitProperty(reportAgain: boolean) {
    const data: PropertyReportDto = toJSON(true);

    if (!UserUtils.isSalesUser()) {
      propertyService
        .savePropertyReport(data)
        .then((response: any) => {
          updatePropertyReportState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
            FormErrorMessage: "",
            showErrorAlert: false,
            isSubmitted: true,
          });
          isFormSubmitted.next(false);
          if (reportAgain) {
            reportAgainFunc();
          } else {
            props.history.push({
              pathname: `${Paths.propertyList}`,
            });
            success_toast();
          }
        })
        .catch((error: any) => {
          updatePropertyReportState({
            FormErrorMessage: error.data.message,
            showErrorAlert: true,
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
          failure_toast();
        });
    } else {
      propertyService
        .saveSalesPropertyReport(data)
        .then((response: any) => {
          updatePropertyReportState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
            FormErrorMessage: "",
            showErrorAlert: false,
            isSubmitted: true,
          });
          isFormSubmitted.next(false);
          if (reportAgain) {
            reportAgainFunc();
          } else {
            props.history.push({
              pathname: `${Paths.salesICNStatusList}`,
            });
            success_toast();
          }
        })
        .catch((error: any) => {
          updatePropertyReportState({
            FormErrorMessage: error.data.message,
            showErrorAlert: true,
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
          failure_toast();
        });
    }
  }

  function reportAgainFunc() {
    const data: ReportAgainDTO = {
      oldIcn: joinIcn(icnState),
      newIcn: joinReportAgainIcn(),
      copyAll: reportAgainState.copyAllData,
    };
    propertyService
      .reportAgain(data)
      .then((response) => {
        updateReportAgainState({
          showReportAgain: false,
        });
        PageHelper.openPage(Paths.editPropertyReport + "/" + data.newIcn);
        window.location.reload();
        addToast({
          text: `Record Added-${data.oldIcn}; Verify/change data for new record.`,
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        updatePropertyReportState({
          FormErrorMessage: error.data.message,
          showErrorAlert: true,
          isSubmitLoading: false,
          isSubmitDisabled: false,
        });
        failure_toast();
      });
  }

  function joinReportAgainIcn() {
    let icnVal = "";
    if (reportAgainState.modalSuffix) {
      icnVal = `${icnState.aacCode}${reportAgainState.modalJulianDate}${reportAgainState.modalSerialNumber}${reportAgainState.modalSuffix}`;
    } else {
      icnVal = `${icnState.aacCode}${reportAgainState.modalJulianDate}${reportAgainState.modalSerialNumber}`;
    }
    return icnVal;
  }

  function joinIcn(state: IcnState) {
    if (props?.match?.params?.icn) {
      return props?.match?.params?.icn;
    } else {
      let icnVal = "";
      if (state.suffix) {
        icnVal = `${state.aacCode}${state.julianDate}${state.serialNum}${state.suffix}`;
      } else {
        icnVal = `${state.aacCode}${state.julianDate}${state.serialNum}`;
      }
      return icnVal;
    }
  }

  function toggleAccordion(event, section) {
    let openItems = propertyReportState.accordion.openItems;
    let { accordion } = propertyReportState;
    openItems.indexOf(section);
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
          .getActionHistoryForObject(data)
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

  const onFileUpload = (data: any) => {
    updatePropertyInfoState({ fileUploaded: data.fileUploaded });
  };

  const icnItem = [
    {
      title: "Item Control Number",
      content: <IcnClass />,
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
      title: "Property Location",
      content: <PropertyLocationClass />,
      expanded: propertyReportState.accordion.togglePropertyLocationAccordion,
      id: "propertyLocation",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "togglePropertyLocationAccordion"),
    },
    {
      title: "Property Custodian",
      content: <PropCustClass />,
      expanded: propertyReportState.accordion.togglePropertyCustodianAccordion,
      id: "propertyCustodian",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "togglePropertyCustodianAccordion"),
    },
    {
      title: "Property Type/Reimbursement",
      content: <PropertyInfoClass />,
      expanded:
        propertyReportState.accordion.togglePropertyInformationAccordion,
      id: "propertyInformation",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "togglePropertyInformationAccordion"),
    },
    {
      title: "Federal Supply Class",
      content: <FederalSupplyClass />,
      expanded: propertyReportState.accordion.toggleFederalSupplyClassAccordion,
      id: "federalSupplyClass",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleFederalSupplyClassAccordion"),
    },
    {
      title: "Quantity and Cost",
      content: <UnitOfIssueClass />,
      expanded: propertyReportState.accordion.toggleQuantityAndCostAccordion,
      id: "quantityandCost",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleQuantityAndCostAccordion"),
    },
    {
      title: "Additional Information",
      content: (
        <AdditionalInfoClass propertyId={propertyReportState.propertyId} />
      ),
      expanded:
        propertyReportState.accordion.toggleAdditionalInformationAccordion,
      id: "additionalInformation",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleAdditionalInformationAccordion"),
    },

    {
      title: "Upload Images and Documents",
      content: (
        <Upload
          icn={joinIcn(icnState)}
          fileInfectedStatus={(value) =>
            updatePropertyReportState({ fileInfectedStatus: value })
          }
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

  function showSalesNotes() {
    if (
      UserUtils.getUserRoles().includes("CO") ||
      UserUtils.getUserRoles().includes("SFU") ||
      UserUtils.getUserRoles().includes("SG") ||
      UserUtils.getUserRoles().includes("SMS") ||
      UserUtils.getUserRoles().includes("SCO") ||
      UserUtils.getUserRoles().includes("SSA") ||
      UserUtils.getUserRoles().includes("FMS") ||
      UserUtils.getUserRoles().includes("FMS") ||
      UserUtils.getUserRoles().includes("CLO")
    ) {
      return true;
    }
  }

  const salesNotes = {
    title: "Sales Notes",
    content: <SalesNotesClass propertyId={propertyReportState.propertyId} />,
    expanded: propertyReportState.accordion.toggleSalesNotesAccordion,
    id: "salesNotes",
    trigger: "common",
    handleToggle: (event) =>
      toggleAccordion(event, "toggleSalesNotesAccordion"),
  };

  if (showSalesNotes()) {
    items.splice(items?.length + 1, 0, salesNotes);
  }

  const disableReportAgainSave: boolean = !(
    reportAgainState.julianDateisValid && reportAgainState.serialNumberIsValid
  );

  return (
    <StrictMode>
      <div className={"property-registration grid-row ui-ppms"}>
        <div className="header-row grid-row grid-gap-4">
          <h1>Property Report Data Creation</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <SideNav isIcnValid={icnState.isIcnValid} />
              </nav>
            </div>
          </div>
        </div>
        <main
          className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs"
          id="main-content"
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
            aria-multiselectable="true"
            onSubmit={focusOnErrorAfterSubmit}
          >
            <div className={"grid-row"}>
              <PropertyReportButtons
                saveFunction={handlePropertySave}
                isSubmitDisabled={propertyReportState.isSubmitDisabled}
                isSubmitLoading={propertyReportState.isSubmitLoading}
                cancelFunction={handleCancel}
                isSaveAndReportDisplayed={true}
                saveAndReportAgain={submitAndReportAgainCheck}
              />
            </div>

            <div className={"grid-row grid-gap-0"}>
              <div className="grid-col-auto">
                <PPMSButton
                  className={"out-button"}
                  type={"button"}
                  value={""}
                  label={"Action History"}
                  onPress={handleActionHistory}
                  id={"action-history"}
                />
              </div>
              <div className={"margin-left-auto col-md-auto"}>
                <PPMSButton
                  id={"generate-barcode"}
                  label={" Generate Barcode"}
                  type={"button"}
                  isDisabled={!icnState.isIcnValid}
                  onPress={openBarcodeModal}
                  className={"out-button"}
                />
              </div>
            </div>
            <div className={"grid-row margin-top-2"}>
              <PPMSButton
                variant={"link"}
                className="usa-link float:left"
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

            <br />
            <PPMSAccordion bordered={true} items={icnItem} />
            <PPMSAccordion bordered={true} items={items} />
            <br />
            <div className={"grid-row grid-gap-2"}>
              <PropertyReportButtons
                saveFunction={handlePropertySave}
                isSubmitDisabled={propertyReportState.isSubmitDisabled}
                isSubmitLoading={propertyReportState.isSubmitLoading}
                cancelFunction={handleCancel}
                isSaveAndReportDisplayed={true}
                saveAndReportAgain={submitAndReportAgainCheck}
              />
            </div>
          </Form>
        </main>
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
      <PPMSModal
        id={"barcode-modal"}
        show={propertyReportState.showReportAgain}
        label={"Submit"}
        labelCancel={"Cancel"}
        title={"Report Again"}
        handleClose={() => {
          reportAgainOptions.forEach((element) => {
            element.isSelected = false;
          });
          updateReportAgainState({
            ...ReportAgainStateDefault,
            reportAgainOptions: reportAgainOptions,
          });
          updatePropertyReportState({
            showReportAgain: false,
            reportAgain: false,
          });
          updatePropertyReportState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
        }}
        body={
          <div className={"withdraw-property-confirmation"}>
            <div className={"grid-row grid-gap"}>
              <div className={"grid-col-6"}>
                <PPMSToggleRadio
                  isInline={true}
                  name={"reportAgain"}
                  isRequired={true}
                  isDisabled={false}
                  isInvalid={reportAgainState.optionsInvalid}
                  options={reportAgainState.reportAgainOptions}
                  validationMessage={"Please select an Option"}
                  onChange={(options) => {
                    options.forEach((element) => {
                      if (element.id === "All" && element.isSelected === true) {
                        updateReportAgainState({
                          copyAllData: true,
                          optionValue: element.value,
                        });
                      } else {
                        updateReportAgainState({
                          copyAllData: false,
                          optionValue: element.value,
                        });
                      }
                    });
                  }}
                  className=""
                  id={"report-Again-toggle"}
                  label={"Selection Type"}
                />
              </div>
            </div>
            {reportAgainState.optionValue ? (
              <ReportAgain
                aacCode={icnState.aacCode}
                julianDate={icnState.julianDate}
              />
            ) : (
              ""
            )}
          </div>
        }
        handleSave={() => {
          checkDuplicateICN();
        }}
        disableSave={disableReportAgainSave}
        size={"xl"}
        centered={true}
      />
    </StrictMode>
  );
}

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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const ModalActionHistoryContent = ({ data, listID, title }) => {
  return (
    <div className={"action-history-container"}>
      <PPMSActionList data={data} listID={listID} title={title} />
    </div>
  );
};

export default connect(null, mapDispatchToProps)(PropertyReportUpdate);
