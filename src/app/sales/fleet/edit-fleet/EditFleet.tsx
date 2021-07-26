import React, { useContext, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { FleetContext } from "./Fleet-context";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { Form } from "react-bootstrap";
import { PPMSAccordion } from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import ItemInformation from "./item-information/ItemInformation";
import LotInformation from "./lot-information/LotInformation";
import PropertyLocation from "./property-location/PropertyLocation";
import PropertyCustodian from "./property-custodian/PropertyCustodian";
import VehicleInformation from "./vehicle-information/VehicleInformation";
import { SideNavFleet } from "./SideNav-fleet";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { FleetButtons } from "./FleetButtons";
import { FleetDisplayCard } from "./FleetDisplayCard";
import SaleInformation from "./sale-information/SaleInformation";
import { FleetApiService } from "../../../../api-kit/sales/fleet-api-service";
import { EditFleetDTO } from "./editFleetDto";
import {
  fromTime,
  modalFeatureItemOptions,
  time,
  toTime,
} from "../../management/transactions/constants/Constants";
import {
  fleetFscValues,
  formatItemControlNumber,
  formatPriceNumber,
  itemName,
} from "../constants/Constants";
import { formatSaleNumber } from "../../../auctions/preview/constants/AuctionPreviewConstant";
import {
  formatTime,
  validateEmptyCheck,
  validatePropertyDescription,
} from "./validations/fleetValidations";
import { isFormSubmitted } from "../../../../service/validation.service";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";

import { ModalActionHistoryContent } from "../../management/transactions/SalesTransaction";
import { PageHelper, Paths } from "../../../Router";
import { Upload } from "../../uploads/Upload";
import {
  formatPhone,
  getFiscalYearEndDate,
} from "../../../../ui-kit/utilities/FormatUtil";
import moment from "moment";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { saleActions } from "../../../../_redux/_actions/sale.actions";
import { commonActions } from "../../../../_redux/_actions/common.actions";
import ReportingAgency from "./reporting-agency/ReportingAgency";
import PointOfContact from "./point-of-contact/PointOfContact";
interface EditFleetProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function EditFleet(props: EditFleetProps) {
  const {
    editFleetState,
    saleInformationState,
    lotInformationState,
    itemInformationState,
    propertyLocationState,
    propertyCustodianState,
    vehicleInformationState,
    reportingAgencyState,
    pointOfContactState,
    updateEditFleetState,
    updateItemInformationState,
    updateLotInformationState,
    updatePropertyCustodianState,
    updatePropertyDescriptionState,
    updatePropertyLocationState,
    updateSaleInformationState,
    updateVehicleInformationState,
    updateReportingAgencyState,
    updatePointOfContactState,
  } = useContext(FleetContext);


  //default sale Time to 11:00 AM
  const defaultSaleTime: string = "1100";

  const fleetApiService = new FleetApiService();

  const saleService = new SalesApiService();

  const { addToast } = props.actions;

  useEffect(() => {
    fleetApiService
      .getFmsLotItemDetails(props.match.params.fleetId)
      .then((response) => {
        let fleetInfo: EditFleetDTO = response?.data;

        let saleMethod = fleetInfo?.salesMethod;
        updateSaleInformationState({
          saleStartDate: fleetInfo?.saleStartDate
            ? fleetInfo?.saleStartDate
            : "",

          saleEndDate: fleetInfo?.saleEndDate ? fleetInfo?.saleEndDate : "",
          saleMethod: saleMethod,
          saleTime: fleetInfo?.salesTime
            ? formatTime(fleetInfo?.salesTime)
            : formatTime(defaultSaleTime),
          saleStatus: fleetInfo?.saleStatus ? fleetInfo?.saleStatus : "",
          auctionStatus: fleetInfo?.auctionStatus
            ? fleetInfo?.auctionStatus
            : "",
        });

        if (fleetInfo?.salesTime) {
          let timeValue: string = fleetInfo?.salesTime.substr(5, 7);
          let saleTimeOptions = time();
          saleTimeOptions.forEach((a) => {
            if (a.value === timeValue) {
              a.isSelected = true;
            } else {
              a.isSelected = false;
            }
          });
          updateSaleInformationState({
            saleTimeAmPm: timeValue,
            saleTimeOptions: saleTimeOptions,
          });
        }

        updateEditFleetState({
          saleNumber: fleetInfo?.salesNumber
            ? formatSaleNumber(fleetInfo?.salesNumber)
            : "",
          lotNumber: fleetInfo?.lotNumber,
          aac: fleetInfo?.aac,
          agencyNumber: fleetInfo?.agency,
          itemControlNumber: fleetInfo?.icn,
          saleId: fleetInfo?.salesId,
          contractNumber: fleetInfo?.contactNumber,
          propertyType: fleetInfo?.propertyType
            ? fleetInfo.propertyType
            : "Fleet",
          disableAuctionButton:
            fleetInfo?.lotStatus !== "Lotted" ? true : false,
          submitted: fleetInfo?.submitted,
        });

        if (fleetInfo?.featuredItem) {
          modalFeatureItemOptions.forEach((element) => {
            element.isSelected =
              fleetInfo?.featuredItem === "true" ? true : false;
          });
          updateItemInformationState({
            modalFeatureItemOption: modalFeatureItemOptions,
          });
        }

        updateItemInformationState({
          itemControlNumber: fleetInfo?.icn ? fleetInfo?.icn : "",
          itemName: fleetInfo?.itemName
            ? fleetInfo?.itemName
            : itemName(fleetInfo?.make, fleetInfo?.model, fleetInfo?.year),
          unitOfIssue: fleetInfo?.unitMeasurement,
          quantity: fleetInfo?.qty,
          unitPrice: fleetInfo?.unitPrice
            ? formatPriceNumber(fleetInfo?.unitPrice)
            : "",
          startingPrice: fleetInfo?.startingPrice
            ? formatPriceNumber(fleetInfo?.startingPrice)
            : "",
          upsetPrice: fleetInfo?.upsetPrice
            ? formatPriceNumber(fleetInfo?.upsetPrice)
            : "",
          fcsSelectedValue: fleetInfo?.fsc ? fleetInfo?.fsc : "",
          featureItem: fleetInfo?.featuredItem === "true" ? true : false,
          conditionCode: fleetInfo?.conditionCode,
          alcStation: fleetInfo?.alcOrStationDeposit,
          appropriationFund: fleetInfo?.appropriationFundSymbol,
          submitted: fleetInfo?.submitted,
          lotIsInPreviewOrActive:
            response?.data?.lotStatus === "Active" ||
            response?.data?.lotStatus === "Preview"
              ? true
              : false,
        });

        if (fleetInfo?.inspectionToTime) {
          let timeValue: string = fleetInfo?.inspectionToTime.substr(5, 7);

          toTime.forEach((a) => {
            if (a.value === timeValue) {
              a.isSelected = true;
            } else {
              a.isSelected = false;
            }
          });
          updateLotInformationState({
            inspectionEndDate: fleetInfo?.inspectionToDate,
            inspectionEndTime: fleetInfo?.inspectionToTime
              ? formatTime(fleetInfo?.inspectionToTime)
              : "",
            endTime: toTime,
            amPmEndTime: timeValue,
            lotStatus: fleetInfo?.lotStatus ? fleetInfo?.lotStatus : "",
          });
        }
        if (fleetInfo?.inspectionFromTime) {
          let timeValue: string = fleetInfo?.inspectionFromTime.substr(5, 7);

          fromTime.forEach((a) => {
            if (a.value === timeValue) {
              a.isSelected = true;
            } else {
              a.isSelected = false;
            }
          });
          updateLotInformationState({
            inspectionStartDate: fleetInfo?.inspectionFromDate,
            inspectionStartTime: fleetInfo?.inspectionFromTime
              ? formatTime(fleetInfo?.inspectionFromTime)
              : "",
            startTime: fromTime,
            amPmStartTime: timeValue,
          });
        }

        updatePropertyCustodianState({
          custodianName: fleetInfo?.custodianName,
          emailAddress: fleetInfo?.custodianEmail,
          ccEmailAddress: fleetInfo?.custodianCcEmail,
          phoneNumber: fleetInfo?.custodianPhone
            ? formatPhone(fleetInfo?.custodianPhone.toString())
            : "",
          faxNumber: fleetInfo?.custodianFax
            ? formatPhone(fleetInfo?.custodianFax.toString())
            : "",
        });

        updatePropertyLocationState({
          siteName: fleetInfo?.siteName,
          addressLine1: fleetInfo?.siteAddr,
          addressLine2: fleetInfo?.siteStreet,
          city: fleetInfo?.siteCity,
          state: fleetInfo?.siteState,
          zipCode: fleetInfo?.siteZip ? fleetInfo?.siteZip : "",
          zipCodeExtension: fleetInfo?.siteZipExt ? fleetInfo?.siteZipExt : "",
          propertyLocationCode: fleetInfo?.locationCode,
        });

        updateVehicleInformationState({
          engineNumber: fleetInfo?.engineNumber,
          fuelType: fleetInfo?.fuelType,
          GWVR: fleetInfo?.gvwr,
          vehicleType: fleetInfo?.vehicleType,
          dualWheel: fleetInfo?.dualWheel,
          tire: fleetInfo?.tire,
          noPass: fleetInfo?.noPass,
          wheelBase: fleetInfo?.wheelbase,
          payload: fleetInfo?.payload,
          mileage: fleetInfo?.odometerReading,
          salvageScrap: fleetInfo?.isSalvageScrap,
          odometerCorrect: fleetInfo?.odometerCorrect,
          loanValue: truncateValue(fleetInfo?.loanValue),
          tradeInValue: truncateValue(fleetInfo?.tradeInValue),
          retailValue: truncateValue(fleetInfo?.retailValue),
          MSRP: truncateValue(fleetInfo?.manufactureSuggRetailPrice),
          vehicleVin: fleetInfo?.vin,
          vehicleMake: fleetInfo?.make,
          vehicleClass: fleetInfo?.tag.substring(0, 3),
          vehicleTag: fleetInfo?.tag,
          vehicleModel: fleetInfo?.model,
          vehicleYear: fleetInfo?.year,
          vehicleBody: fleetInfo?.body,
          vehicleColor: fleetInfo?.color,
          vehicleColorTone: fleetInfo?.tone,
          vehicleCylinder: fleetInfo?.cylinders,
          vehicleAxle: fleetInfo?.noAxle,
          vehicleHorsepower: fleetInfo?.hp,
          propertyDescription: fleetInfo?.propertyLotDescription,
          itemDescription: fleetInfo?.itemDescription,
          transmission: fleetInfo?.transmission,
        });

        updateReportingAgencyState({
          agencyName: fleetInfo?.reportingAgencyAddressDTO?.reportingAgencyName,
          addressLine1: fleetInfo?.reportingAgencyAddressDTO?.line1,
          addressLine2: fleetInfo?.reportingAgencyAddressDTO?.line2,
          city: fleetInfo?.reportingAgencyAddressDTO?.city,
          state: fleetInfo?.reportingAgencyAddressDTO?.stateCode,
          zip: fleetInfo?.reportingAgencyAddressDTO?.zip,
          zipExtension: fleetInfo?.reportingAgencyAddressDTO?.zip2,
        });

        updatePointOfContactState({
          firstName: fleetInfo?.pointOfContactDTO?.firstName,
          lastName: fleetInfo?.pointOfContactDTO?.lastName,
          phoneNumber: fleetInfo?.pointOfContactDTO?.phone,
          phoneExtension: fleetInfo?.pointOfContactDTO?.phoneExt,
          email: fleetInfo?.pointOfContactDTO?.email,
          ccEmail: fleetInfo?.pointOfContactDTO?.ccEmail,
        });

        if (fleetInfo?.odometerCorrect === "true") {
          updateVehicleInformationState({
            odometerOptions: [
              {
                id: `Y`,
                value: "Yes",
                isSelected: true,
              },
              {
                id: `N`,
                value: "No",
                isSelected: false,
              },
            ],
          });
        }
        if (fleetInfo?.isSalvageScrap === "true") {
          updateVehicleInformationState({
            salvageScrapOptions: [
              {
                id: `Y`,
                value: "Yes",
                isSelected: true,
              },
              {
                id: `N`,
                value: "No",
                isSelected: false,
              },
            ],
          });
        }
        if (fleetInfo?.conditionCode) {
          let newCondition = itemInformationState.conditionOptions;
          for (let i = 0; i < newCondition.length; i++) {
            if (newCondition[i].id === fleetInfo?.conditionCode) {
              newCondition[i].isSelected = true;
              break;
            }
          }
          updateItemInformationState({
            conditionOptions: newCondition,
          });
        }
        if (fleetInfo?.transmission) {
          let newTransmission = vehicleInformationState.transmissionOptions;
          for (let i = 0; i < newTransmission.length; i++) {
            if (newTransmission[i].id === fleetInfo?.transmission) {
              newTransmission[i].isSelected = true;
              break;
            }
          }
          updateVehicleInformationState({
            transmissionOptions: newTransmission,
          });
        }
      })
      .catch((error) => {
        addToast({
          text: "Error fetching the data.",
          type: "error",
          heading: "Error",
        });
      });
    isFormSubmitted.next(false);
  }, []);

  function truncateValue(value) {
    if (value === 0) {
      return "$" + value;
    } else if (!value) {
      return "";
    } else {
      return (
        "$" +
        formatPriceNumber(
          value.toString().substring(0, value.toString().length - 2)
        )
      );
    }
  }

  function sendToGSAAuction() {
    let state = editFleetState;
    state.sendAuctionSaveDisable = true;
    updateEditFleetState(state);
    saleService
      .sendToGSAAuction([props.match.params.fleetId])
      .then((response: any) => {
        state.showSendtoGSAAuctionModal = false;
        state.disableAuctionButton = true;
        state.isSendToGSA = false;
        state.sendAuctionSaveDisable = true;
        updateEditFleetState(state);
        addToast({
          text: "Record sent to GSA auction successfully",
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.log(error);
        state.showSendtoGSAAuctionModal = false;
        state.isSendToGSA = false;
        state.sendAuctionSaveDisable = true;
        updateEditFleetState(state);
        addToast({
          text: "Error sending fleet",
          type: "error",
          heading: "Error",
        });
      });
  }

  const items = [
    {
      title: "Sale Information",
      content: <SaleInformation />,
      expanded: editFleetState.accordion.toggleSaleAccordion,
      id: "fleetSaleInformation",
      handleToggle: (event) => toggleAccordion(event, "toggleSaleAccordion"),
    },
    {
      title: "Item Information",
      content: <ItemInformation />,
      expanded: editFleetState.accordion.toggleItemAccordion,
      id: "fleetItemInformation",
      handleToggle: (event) => toggleAccordion(event, "toggleItemAccordion"),
    },
    {
      title: "Lot Information",
      content: <LotInformation />,
      expanded: editFleetState.accordion.toggleLotAccordion,
      id: "fleetLotInformation",
      handleToggle: (event) => toggleAccordion(event, "toggleLotAccordion"),
    },
    {
      title: "Property Location",
      content: <PropertyLocation />,
      expanded: editFleetState.accordion.toggleLocationAccordion,
      id: "fleetPropertyLocation",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleLocationAccordion"),
    },
    {
      title: "Property Custodian",
      content: <PropertyCustodian />,
      expanded: editFleetState.accordion.toggleCustodianAccordion,
      id: "fleetPropertyCustodian",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleCustodianAccordion"),
    },
    {
      title: "Reporting Agency",
      content: <ReportingAgency />,
      expanded: editFleetState.accordion.toggleReportingAgencyAccordion,
      id: "fleetReportingAgency",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleReportingAgencyAccordion"),
    },
    {
      title: "Point Of Contact",
      content: <PointOfContact />,
      expanded: editFleetState.accordion.togglePointOfContactAccordion,
      id: "fleetPointOfContact",
      handleToggle: (event) =>
        toggleAccordion(event, "togglePointOfContactAccordion"),
    },
    {
      title: "Vehicle Information",
      content: <VehicleInformation />,
      expanded: editFleetState.accordion.toggleVehicleAccordion,
      id: "fleetVehicleInformation",
      handleToggle: (event) => toggleAccordion(event, "toggleVehicleAccordion"),
    },
    {
      title: "Upload Images and Documents",
      content: (
        <Upload
          lotId={props.match.params.fleetId}
          saleId={editFleetState.saleId}
          saleNumber={editFleetState.saleNumber.replaceAll("-", "")}
          lotNumber={editFleetState.lotNumber}
          validationMessage="Please upload images or documents"
          fileInfectedStatus={(value) =>
            updateEditFleetState({ fileInfectedStatus: value })
          }
        />
      ),
      expanded:
        editFleetState.accordion.toggleUploadMultiplPicturesDocumentsAccordion,
      id: "uploadMultiplPicturesDocuments",
      trigger: "common",
      handleToggle: (event) =>
        toggleAccordion(event, "toggleUploadMultiplPicturesDocumentsAccordion"),
    },
  ];

  function toggleAccordion(event, section) {
    let openItems = editFleetState.accordion.openItems;
    let { accordion } = editFleetState;
    if (section === "All") {
      if (accordion["toggleAllAccordion"]) {
        openItems = [];
      } else {
        openItems = [
          "toggleItemAccordion",
          "toggleLotAccordion",
          "toggleLocationAccordion",
          "toggleCustodianAccordion",
          "toggleReportingAgencyAccordion",
          "togglePointOfContactAccordion",
          "toggleVehicleAccordion",
          "toggleDescriptionAccordion",
          "toggleUploadAccordion",
          "toggleSaleAccordion",
          "toggleUploadMultiplPicturesDocumentsAccordion",
        ];
      }
      let isExpanded = !accordion["toggleAllAccordion"];
      accordion["toggleAllAccordion"] = isExpanded;
      accordion["toggleSaleAccordion"] = isExpanded;
      accordion["toggleItemAccordion"] = isExpanded;
      accordion["toggleLotAccordion"] = isExpanded;
      accordion["toggleLocationAccordion"] = isExpanded;
      accordion["toggleCustodianAccordion"] = isExpanded;
      accordion["toggleReportingAgencyAccordion"] = isExpanded;
      accordion["togglePointOfContactAccordion"] = isExpanded;
      accordion["toggleVehicleAccordion"] = isExpanded;
      accordion["toggleDescriptionAccordion"] = isExpanded;
      accordion["toggleUploadAccordion"] = isExpanded;
      accordion["toggleUploadMultiplPicturesDocumentsAccordion"] = isExpanded;
      accordion["openItems"] = openItems;
      updateEditFleetState({
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
    updateEditFleetState({
      accordion: accordion,
    });
  }

  function toJson(): EditFleetDTO {
    return {
      lotId: props.match.params.fleetId,
      lotNumber: editFleetState.lotNumber,
      salesId: editFleetState.saleId,
      salesNumber: editFleetState.saleNumber,
      aac: editFleetState.aac,
      agency: editFleetState.agencyNumber,
      contactNumber: editFleetState.contractNumber,
      propertyType: editFleetState.propertyType,
      submitted: editFleetState.submitted,

      //Sale Information Section
      saleStartDate: saleInformationState.saleStartDate
        ? saleInformationState.saleStartDate
        : "",
      saleEndDate: saleInformationState.saleEndDate
        ? saleInformationState.saleEndDate
        : "",
      salesTime: saleInformationState.saleTime
        ? saleInformationState.saleTime + saleInformationState.saleTimeAmPm
        : "",
      salesMethod: saleInformationState.saleMethod
        ? saleInformationState.saleMethod
        : "",
      saleStatus: saleInformationState.saleStatus
        ? saleInformationState.saleStatus
        : "",
      auctionStatus: saleInformationState.auctionStatus
        ? saleInformationState.auctionStatus
        : "",

      //Item Information Section
      icn: itemInformationState.itemControlNumber
        ? itemInformationState.itemControlNumber
        : "",
      itemName: itemInformationState.itemName
        ? itemInformationState.itemName
        : "",
      fsc: itemInformationState.fcsSelectedValue
        ? itemInformationState.fcsSelectedValue
        : "",
      qty: itemInformationState.quantity ? itemInformationState.quantity : "",
      unitPrice: itemInformationState.unitPrice.replace(/\D+/g, ""),
      unitMeasurement: "EA",
      startingPrice: itemInformationState.startingPrice.replace(/\D+/g, ""),
      upsetPrice: itemInformationState.upsetPrice.replace(/\D+/g, ""),
      featuredItem: itemInformationState.featureItem ? "true" : "false",
      alcOrStationDeposit: itemInformationState.alcStation,
      appropriationFundSymbol: itemInformationState.appropriationFund,
      conditionCode: itemInformationState.conditionCode,

      //Property Location Section:
      siteName: propertyLocationState.siteName
        ? propertyLocationState.siteName
        : "",
      siteAddr: propertyLocationState.addressLine1
        ? propertyLocationState.addressLine1
        : "",
      siteStreet: propertyLocationState.addressLine2
        ? propertyLocationState.addressLine2
        : "",
      siteCity: propertyLocationState.city ? propertyLocationState.city : "",
      siteState: propertyLocationState.state ? propertyLocationState.state : "",
      siteZip: propertyLocationState.zipCode
        ? propertyLocationState.zipCode
        : "",
      siteZipExt: propertyLocationState.zipCodeExtension
        ? propertyLocationState.zipCodeExtension
        : "",
      locationCode: propertyLocationState.propertyLocationCode
        ? propertyLocationState.propertyLocationCode
        : "",

      //  Custodian
      custodianName: propertyCustodianState.custodianName
        ? propertyCustodianState.custodianName
        : "",
      custodianEmail: propertyCustodianState.emailAddress
        ? propertyCustodianState.emailAddress
        : "",
      custodianCcEmail: propertyCustodianState.ccEmailAddress
        ? propertyCustodianState.ccEmailAddress
        : "",
      custodianPhone: propertyCustodianState.phoneNumber
        ? propertyCustodianState.phoneNumber.replace(/\D+/g, "")
        : "",
      custodianFax: propertyCustodianState.faxNumber
        ? propertyCustodianState.faxNumber.replace(/\D+/g, "")
        : "",

      //  Lot Information
      inspectionFromDate: lotInformationState.inspectionStartDate
        ? lotInformationState.inspectionStartDate
        : "",
      inspectionToDate: lotInformationState.inspectionEndDate
        ? lotInformationState.inspectionEndDate
        : "",
      inspectionFromTime: lotInformationState.inspectionStartTime
        ? lotInformationState.inspectionStartTime +
          lotInformationState.amPmStartTime
        : "",
      inspectionToTime: lotInformationState.inspectionEndTime
        ? lotInformationState.inspectionEndTime +
          lotInformationState.amPmEndTime
        : "",
      lotStatus: lotInformationState.lotStatus
        ? lotInformationState.lotStatus
        : "",

      //Vehicle Information
      engineNumber: vehicleInformationState.engineNumber
        ? vehicleInformationState.engineNumber
        : "",
      fuelType: vehicleInformationState.fuelType
        ? vehicleInformationState.fuelType
        : "",
      gvwr: vehicleInformationState.GWVR ? vehicleInformationState.GWVR : "",
      vehicleType: vehicleInformationState.vehicleType
        ? vehicleInformationState.vehicleType
        : "",
      dualWheel: vehicleInformationState.dualWheel
        ? vehicleInformationState.dualWheel
        : "",
      tire: vehicleInformationState.tire ? vehicleInformationState.tire : "",
      noPass: vehicleInformationState.noPass
        ? vehicleInformationState.noPass
        : "",
      wheelbase: vehicleInformationState.wheelBase
        ? vehicleInformationState.wheelBase
        : "",
      payload: vehicleInformationState.payload
        ? vehicleInformationState.payload
        : "",
      odometerReading: vehicleInformationState.mileage
        ? vehicleInformationState.mileage
        : "",
      isSalvageScrap: vehicleInformationState.salvageScrap,
      odometerCorrect: vehicleInformationState.odometerCorrect
        ? vehicleInformationState.odometerCorrect
        : "",
      loanValue: vehicleInformationState.loanValue
        ? vehicleInformationState.loanValue
            .replace("$", "")
            .replace(",", "")
            .concat("00")
        : "",
      tradeInValue: vehicleInformationState.tradeInValue
        ? vehicleInformationState.tradeInValue
            .replace("$", "")
            .replace(",", "")
            .concat("00")
        : "",
      retailValue: vehicleInformationState.retailValue
        ? vehicleInformationState.retailValue
            .replace("$", "")
            .replace(",", "")
            .concat("00")
        : "",
      manufactureSuggRetailPrice: vehicleInformationState.MSRP
        ? vehicleInformationState.MSRP.replace("$", "")
            .replace(",", "")
            .concat("00")
        : "",
      vin: vehicleInformationState.vehicleVin
        ? vehicleInformationState.vehicleVin.toString()
        : "",
      make: vehicleInformationState.vehicleMake
        ? vehicleInformationState.vehicleMake
        : "",
      tag: vehicleInformationState.vehicleTag
        ? vehicleInformationState.vehicleTag
        : "",
      model: vehicleInformationState.vehicleModel
        ? vehicleInformationState.vehicleModel
        : "",
      year: vehicleInformationState.vehicleYear
        ? vehicleInformationState.vehicleYear
        : "",
      body: vehicleInformationState.vehicleBody
        ? vehicleInformationState.vehicleBody
        : "",
      color: vehicleInformationState.vehicleColor
        ? vehicleInformationState.vehicleColor
        : "",
      tone: vehicleInformationState.vehicleColorTone
        ? vehicleInformationState.vehicleColorTone
        : "",
      cylinders: vehicleInformationState.vehicleCylinder
        ? vehicleInformationState.vehicleCylinder
        : "",
      noAxle: vehicleInformationState.vehicleAxle
        ? vehicleInformationState.vehicleAxle
        : "",
      hp: vehicleInformationState.vehicleHorsepower
        ? vehicleInformationState.vehicleHorsepower
        : "",
      propertyLotDescription: vehicleInformationState.propertyDescription
        ? vehicleInformationState.propertyDescription
        : "",
      transmission: vehicleInformationState.transmission,
      itemDescription: vehicleInformationState.itemDescription,

      //Reporting Agency
      reportingAgencyAddressDTO: {
        reportingAgencyName: reportingAgencyState.agencyName,
        reportingAddressId: reportingAgencyState.agencyId,
        line1: reportingAgencyState.addressLine1,
        line2: reportingAgencyState.addressLine2,
        city: reportingAgencyState.city,
        stateCode: reportingAgencyState.state,
        zip: reportingAgencyState.zip,
        zip2: reportingAgencyState.zipExtension,
      },

      pointOfContactDTO: {
        firstName: pointOfContactState.firstName,
        lastName: pointOfContactState.lastName,
        phone: +pointOfContactState.phoneNumber,
        phoneExt: pointOfContactState.phoneExtension,
        email: pointOfContactState.email,
        ccEmail: pointOfContactState.ccEmail,
      },
    };
  }

  function handleSubmit(event) {
    isFormSubmitted.next(true);
    event.preventDefault();
    const form = event.currentTarget;
    let data: EditFleetDTO = toJson();
    updateEditFleetState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
    });

    let descriptionValidation = validatePropertyDescription(
      vehicleInformationState.itemDescription
    );

    if (descriptionValidation.isInvalid) {
      updateVehicleInformationState({
        itemDescriptionIsInvalid: descriptionValidation.isInvalid,
        itemDescriptionErrorMsg: descriptionValidation.validationError,
      });
    }
    if (form.checkValidity() && !descriptionValidation.isInvalid) {
      fleetApiService
        .submitFleetLotDetails(data)
        .then((res) => {
          if (editFleetState.isSendToGSA) {
            editFleetState.showSendtoGSAAuctionModal = true;
            editFleetState.isSendToGSA = false;
            updateEditFleetState(editFleetState);
          } else {
            addToast({
              text: "Record updated successfully",
              type: "success",
              heading: "Success",
            });

            PageHelper.openPage(Paths.manageFleet);
          }
        })
        .catch((error) => {
          addToast({
            text: "Submission failed",
            type: "error",
            heading: "Error",
          });
        });
    } else {
      event.stopPropagation();
      updateEditFleetState({
        isSendToGSA: false,
        isSubmitLoading: false,
        isSubmitDisabled: false,
      });
    }
  }

  function handleActionHistory() {
    const data = {
      params: {
        objectType: "LOT",
        objectId: props.match.params.fleetId,
      },
    };
    saleService
      .getActionHistoryForSalesObject(data)
      .then((response: any) => {
        updateEditFleetState({
          actionHistoryData: response.data,
          showActionHistoryModal: true,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  return (
    <>
      <div className={"want-list-data-creation grid-row ui-ppms"}>
        <div className="grid-row header-row mb-3">
          <h1>FLEET SALES VEHICLE INFORMATION</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <SideNavFleet />
              </nav>
            </div>
          </div>
        </div>
        <div className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <div className={"desktop:grid-col-9"}>
            <PPMSAlert
              id={"form-verification-error-alert"}
              show={editFleetState.showErrorAlert}
              alertBody={editFleetState.FormErrorMessage}
              alertClassName={"form-verification-error"}
              alertVariant={"danger"}
              alertKey={"form-verification-error"}
            />
            {editFleetState.showErrorAlert && <hr />}
          </div>
          <br />
          <Form
            noValidate
            validated={editFleetState.isFormValidated}
            onSubmit={handleSubmit}
            className={"usa-accordion--bordered desktop:grid-col-12"}
            aria-multiselectable="true"
          >
            <FleetDisplayCard
              saleNumber={editFleetState.saleNumber}
              lotNumber={editFleetState.lotNumber}
              aac={editFleetState.aac}
              agencyNumber={editFleetState.agencyNumber}
              contractNumber={editFleetState.contractNumber}
              propertyType={editFleetState.propertyType}
            />
            <br />
            <div className={"grid-row grid-gap-6"}>
              <FleetButtons
                isSubmitDisabled={editFleetState.isSubmitDisabled}
                isSubmitLoading={editFleetState.isSubmitLoading}
                cancelFunction={() => {
                  PageHelper.openPage(Paths.manageFleet);
                }}
              />
              <PPMSButton
                id={"send-to-gsa-auctions"}
                onPress={() => {
                  editFleetState.isSendToGSA = true;
                  console.log("lotid " + props.match.params.fleetId);
                  updateEditFleetState(editFleetState);
                }}
                isDisabled={editFleetState.disableAuctionButton}
                label={"Send to GSA Auctions"}
                type={"submit"}
              />
              <div className={"grid-col title-3040"}>
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
            <div className={"grid-row"}>
              <div className={"margin-top-2 col-md-auto"}>
                <PPMSButton
                  variant={"link"}
                  className="usa-link float:left"
                  id={"expandToggle"}
                  type={"button"}
                  label={
                    editFleetState.accordion.toggleAllAccordion
                      ? "Collapse All"
                      : "Expand All"
                  }
                  onPress={(event) => toggleAccordion(event, "All")}
                  isDisabled={false}
                />
              </div>
            </div>
            <br />
            <PPMSAccordion bordered={true} items={items} />
            <div className={"grid-row grid-gap-6"}>
              <FleetButtons
                isSubmitDisabled={editFleetState.isSubmitDisabled}
                isSubmitLoading={editFleetState.isSubmitLoading}
                cancelFunction={() => {
                  PageHelper.openPage(Paths.manageFleet);
                }}
              />
              <PPMSButton
                id={"send-to-gsa-auctions"}
                onPress={() => {
                  editFleetState.isSendToGSA = true;
                  console.log("lotid " + props.match.params.fleetId);
                  updateEditFleetState(editFleetState);
                }}
                isDisabled={editFleetState.disableAuctionButton}
                label={"Send to GSA Auctions"}
                type={"submit"}
              />
              <div className={"grid-col title-3040"}>
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
          show={editFleetState.showActionHistoryModal}
          handleClose={() => {
            updateEditFleetState({ showActionHistoryModal: false });
          }}
          handleSave={() => {}}
          title={"Action History"}
          centered={true}
          backdrop={"static"}
          label={"Ok"}
          hideLabelCancel={true}
          hideLabel={editFleetState.showActionHistoryModal}
          size={editFleetState.showActionHistoryModal ? "lg" : null}
          body={
            <ModalActionHistoryContent
              data={editFleetState.actionHistoryData}
              listID={"list-id"}
              title={""}
            />
          }
          id={"fleet-history"}
        />
      </div>
      <PPMSModal
        show={editFleetState.showSendtoGSAAuctionModal}
        backdrop={"static"}
        body={"Do you want to send the fleet to GSA Auction?"}
        id={"sendToGSAModal"}
        handleClose={() => {
          editFleetState.showSendtoGSAAuctionModal = false;
          editFleetState.isSendToGSA = false;
          updateEditFleetState(editFleetState);
        }}
        centered={true}
        handleSaveType={"button"}
        handleSave={sendToGSAAuction}
        saveIsLoading={editFleetState.sendAuctionSaveDisable}
        title={"Send to GSA Auction"}
        label={"Yes"}
        labelCancel={"No"}
      />
    </>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(EditFleet);
