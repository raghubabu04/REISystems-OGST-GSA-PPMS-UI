import React, { StrictMode, useContext, useEffect } from "react";
import { Form } from "react-bootstrap";
import {
  RepAgencyAddressStateDefault,
  RepAgencyAddressStateJson,
} from "./rep-agency-address-class/RepAgencyAddressState";
import {
  PropertyLocationStateDefault,
  PropertyLocationStateJson,
} from "./property-location-class/PropertyLocationState";
import {
  PropCustStateDefault,
  PropCustStateJson,
} from "./property-custodian-class/PropCustState";
import { PropertyContext } from "./PropertyContext";
import IcnClass from "./icn-class/IcnClass";
import AgencyInfoClass from "./agency-info-class/AgencyInfoClass";
import RepAgencyAddressClass from "./rep-agency-address-class/RepAgencyAddressClass";
import PropertyLocationClass from "./property-location-class/PropertyLocationClass";
import PocClass from "./point-of-contact-class/PocClass";
import { FederalSupplyClass } from "./federal-supply-class/FederalSupplyClass";
import PropertyInfoClass from "./property-info-class/PropertyInfoClass";
import PropCustClass from "./property-custodian-class/PropCustClass";
import {
  PocStateDefault,
  PocStateJson,
} from "./point-of-contact-class/PocState";
import { IcnStateDefault } from "./icn-class/IcnState";
import { Upload } from "./uploads/Upload";
import { AdditionalInfoClass } from "./additional-info-class/AdditionalInfoClass";
import UnitOfIssueClass from "./unit-of-issue-class/UnitOfIssueClass";
import moment from "moment";
import { PropertyInfoStateDefault } from "./property-info-class/PropertyInfoState";
import { AgencyInfoStateDefault } from "./agency-info-class/AgencyInfoState";
import { FSCStateDefaultsOrigin } from "./federal-supply-class/model/FSCState";
import { UnitOfIssueStateDefaults } from "./unit-of-issue-class/UnitOfIssueState";
import { FSCVehicleStateDefault } from "./federal-supply-class/model/FSCVehicleState";
import { PropertyReportStateDefault } from "./PropertyReportState";
import { AdditionalInfoStateDefault } from "./additional-info-class/AdditionalInfoState";
import {
  asbestosTypes,
  joinIcn,
  reportAgainOptions,
} from "./constants/Constants";
import {
  getFormattedICN,
  isEmptyCheck,
  validateAcquisitionDate,
  validatePropertyDescription,
  validatePropTYpe,
  validateSalesNotes,
} from "./validations/propertyFieldValidations";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { PropertyReportDto } from "../../models/PropertyReport";
import { PageHelper, Paths } from "../../Router";
import { isFormSubmitted } from "../../../service/validation.service";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";
import { PPMSAccordion } from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { BarCodePrint } from "./common/BarcodePrint";
import SideNav from "./SideNav";
import { connect } from "react-redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import PropertyReportButtons from "./PropertyReportButtons";
import { cloneDeep } from "lodash";
import { UserUtils } from "../../../utils/UserUtils";
import { UserApiService } from "../../../api-kit/user/user-api.service";
import { SalesNotesStateDefault } from "./sales-notes-class/SalesNotesState";
import { SalesNotesClass } from "./sales-notes-class/SalesNotesClass";
import { PPMSToggleRadio } from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import { ReportAgain } from "./common/ReportAgain";
import { ReportAgainStateDefault } from "./common/ReportAgainState";
import { ReportAgainDTO } from "../../models/ReportAgain";

interface PropertyReportProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

export function PropertyReportCreate(props: PropertyReportProps) {
  let commonApiService = new CommonApiService();
  let userApiService = new UserApiService();

  let propertyService = new PropertyApiService();
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
    additionalInfoState,
    fscWeaponState,
    reportAgainState,
    updatePocState,
    updatePropertyReportState,
    updateFSCState,
    updateFSCOtherState,
    updateIcnState,
    updateAgencyInfoState,
    updateSalesNotesState,
    updateRepAgencyAddressState,
    updatePropertyLocationState,
    updatePropCustState,
    updatePropertyInfoState,
    updateUnitOfIssueState,
    updateFSCVehicleState,
    updateAdditionalInfoState,
    updateFSCWeaponState,
    updateERDAndSRD,
    updateReportAgainState,
    fscVesselState,
    fscTrailerState,
    fscAircraftState,
    fscComputerState,
    fscVehicleState,
  } = useContext(PropertyContext);
  const { addToast } = props.actions;
  //By passing in an empty array, we're telling React not to track any changes, only run once, effectively simulating componentDidMount.
  useEffect(() => {
    window.scrollTo(0, 0);
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
    updateSalesNotesState(SalesNotesStateDefault);
    updateRepAgencyAddressState(RepAgencyAddressStateDefault);
    updatePocState(PocStateDefault);
    updatePropertyLocationState(PropertyLocationStateDefault);
    updatePropCustState(PropCustStateDefault);
    updateFSCState(cloneDeep(FSCStateDefaultsOrigin));
    updateUnitOfIssueState(UnitOfIssueStateDefaults);
    updateFSCVehicleState(FSCVehicleStateDefault);
    updatePropertyReportState(PropertyReportStateDefault);
    updateAdditionalInfoState(AdditionalInfoStateDefault);
    let FSCOtherData = {
      make: "",
      model: "",
      itemName: "",
      specialDescriptionCode: "",
      specialDescriptionText: "",
    };

    updateFSCOtherState({ FSCOtherData: FSCOtherData });
    let data = {
      fscCode: "",
      fscCategory: "",
    };

    let specialInstructionsOptions = [
      {
        value: "Contractor Inventory",
        id: "contractor-inventory",
        isSelected: false,
        isDisabled: false,
      },
      {
        value: "Overseas Inventory",
        id: "overseas-inventory",
        isSelected: false,
        isDisabled: false,
      },
    ];

    updateFSCState({
      data: data,
      specialInstructionsOptions: specialInstructionsOptions,
    });

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
      if (UserUtils.isUserNuo()) {
        callUserApiToRetrieveDataForNUO(data);
      } else {
        callCommonApiToRetrieveData(data);
      }
    }
  }

  function callUserApiToRetrieveDataForNUO(data) {
    let aacValue = data.params.agencyCode;
    userApiService
      .checkValidAgencyBureauForLoggedInNUO(aacValue)
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

  async function updateBureauAndContactDetails(
    response: any,
    aacValue: string
  ) {
    if (response.data) {
      const aacBureau = `${response.data.code} ${response.data.longName}`;
      const agency = response.data.code.substring(0, 2);
      const agencyClassRequired = agency === "70";
      const isTagRequired = agency === "70";
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
      let validation = validateAcquisitionDate(
        response.data.code,
        additionalInfoState.acquisitionDate
      );
      const agencyRep = !isEmptyCheck(agencyBureau)
        ? agencyBureau.substring(0, 2)
        : "";

      let screeningDays: number = 0;
      try {
        let internalAgencyResponse = await new CommonApiService().getInternalAgency(
          agencyRep
        );
        screeningDays = !isEmptyCheck(internalAgencyResponse)
          ? internalAgencyResponse?.data?.screeningDays
          : 0;
      } catch (err) {
        // TypeError: failed to fetch
      }
      updateAdditionalInfoState({
        acquisitionDateIsRequired: validation.acquisitionDateIsRequired,
        acquisitionDateMsg: validation.acquisitionDateMsg,
        //TO show DROP AFTER INTERNAL SCREENING RADIO OPTIONS
        isDropAfterInternalScreeningRequired: isInternalAgency,
        screeningDays: screeningDays,
      });

      //only updateERDAndSRD when the the property is getting created and it is in draft status
      if (
        isEmptyCheck(propertyReportState.propertyId) &&
        !UserUtils.isSalesUser()
      ) {
        //Excess release date will only be visible if the ageny is an internalAgency
        updateERDAndSRD(
          propertyInfoState.isExchangeSales,
          aacValue,
          agencyBureau,
          fscVesselState.vesselFSCData.isVessel50FeetOrOver,
          propertyInfoState.agencyControlNumber,
          additionalInfoState.condition,
          null,
          fscState?.fsc?.fscCode,
          screeningDays,
          isInternalAgency,
          propertyReportState.isSubmitted,
          propertyReportState.submittedDate,
          true
        );
      }

      const validationMessage = fscVehicleState.validationMessage;
      validationMessage["agencyClassRequired"] = agencyClassRequired;
      validationMessage["isTagRequired"] = isTagRequired;
      updateFSCVehicleState({
        validationMessage: validationMessage,
      });
    }
    updatePropCustState({
      aacCode: aacValue,
    });
    updatePropertyLocationState({
      propAacCode: aacValue,
    });
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
              repOb["line1"].trim() + "-" + repOb["city"].trim();
            value = { ...repOb, keyDisplayStr: keyDisplayStr };
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
              pocOb["lastName"].trim() + "-" + pocOb["email"].trim();
            value = { ...pocOb, keyDisplayStr: keyDisplayStr };
            values.push(value);
          });
          updatePocState({
            pocValues: values,
          });
          values = [];
          //Property Location dropdown
          propLoc.forEach((locOb: any) => {
            let value: any = {};
            let keyDisplayStr =
              locOb["line1"].trim() + "-" + locOb["city"].trim();
            value = { ...locOb, keyDisplayStr: keyDisplayStr };
            values.push(value);
          });
          updatePropertyLocationState({
            propLocValues: values,
          });
          values = [];
          //Property Custodian dropdown
          porpCust.forEach((custOb: any) => {
            let value: any = {};
            let keyDisplayStr =
              custOb["lastName"].trim() + "-" + custOb["email"].trim();
            value = { ...custOb, keyDisplayStr: keyDisplayStr };
            values.push(value);
          });
          updatePropCustState({
            propCustValues: values,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
    propertyReportState.propertyGroup = "property";

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

      airCraft: fscState.fsc.aircraft ? fscAircraftState.aircraftFSCData : {},
      vehicle: fscState.fsc.vehicle
        ? {
            agencyClass: fscVehicleState.vehicleFSCData.agencyClass,
            transmissionType: fscVehicleState.vehicleFSCData.transmissionType,
            numberOfCylinders: fscVehicleState.vehicleFSCData.noOfCylinders,
            tag: fscVehicleState.vehicleFSCData.tag,
            modelYear: fscVehicleState.vehicleFSCData.modelYear,
            fuelType: fscVehicleState.vehicleFSCData.fuelType,
            bodyStyle: fscVehicleState.vehicleFSCData.bodyStyle,
            color: fscVehicleState.vehicleFSCData.color,
            colorGradient: fscVehicleState.vehicleFSCData.colorGradient,
            vin: fscVehicleState.vehicleFSCData.vin,
            estimatedMileage: fscVehicleState.vehicleFSCData.estimatedMileage,
            recalled: fscVehicleState.vehicleFSCData.recalled,
          }
        : {},

      weapon: fscState.fsc.weapon
        ? {
            type: fscState.fsc.weapon.type,
            size: fscState.fsc.weapon.size,
          }
        : {},
      trailerHome: fscState.fsc.trailerHome
        ? fscTrailerState.trailerFSCData
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

      //fscState.fsc.vessel ? fscVesselState.vesselFSCData : {},
      computer: fscState.fsc.computer ? fscComputerState.fscComputersData : {},
      itemName: fscState.fsc.itemName,
      make: fscState.fsc.make,
      model: fscState.fsc.model,
      valueAddedServices: fscState.fsc?.fscCode?.startsWith("23")
        ? fscState.valueAddedServices
        : "",
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
      acquisitionDate: moment(
        additionalInfoState.acquisitionDate,
        "yyyy-MM-dd"
      ),
      manufacturer: additionalInfoState.manufacturer,
      manufactureDate: moment(
        additionalInfoState.dateOfManufacture,
        "yyyy-MM-dd"
      ),
      surplusReleaseDate: !additionalInfoState.dropAfterInternalScreening
        ? moment(additionalInfoState.surplusReleaseDate, "yyyy-MM-dd")
        : null,
      excessReleaseDate: moment(
        additionalInfoState.excessReleaseDate,
        "yyyy-MM-dd"
      ),
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
        fscState.fsc.specialInstructions === "Contractor Inventory" ? "Y" : "N",
      overseasInventoryCode:
        fscState.fsc.specialInstructions === "Overseas Inventory" ? "Y" : "N",
      federalSalesCenter: fscState.fcsSelectedValue
        ? fscState.fcsSelectedValue
        : "G",
      categoryCode: categoryInfo.length > 0 ? categoryInfo[0][0] : "",
      categoryName: categoryInfo.length > 0 ? categoryInfo[0][1] : "",
      propertyGroup: "property",
    } as unknown) as PropertyReportDto;
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

    if (typeof fscState.fsc.fscCode === "undefined") {
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

    if (fscState.fsc.vessel.isVessel50FeetOrOver) {
      updateAdditionalInfoState({
        dateOfManufactureIsValid: false,
        dateOfManufactureIsInValid: true,
      });
    }

    if (
      form.checkValidity() === false ||
      validationMessages.length > 0 ||
      propertyDescriptionValidation.isInvalid ||
      salesNotesValidation.isInvalid ||
      propertyReportState.fileInfectedStatus ||
      !additionalInfoState.condition
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
        .then(() => {
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
        .then(() => {
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

  function joinReportAgainIcn() {
    let icnVal = "";
    if (reportAgainState.modalSuffix) {
      icnVal = `${icnState.aacCode}${reportAgainState.modalJulianDate}${reportAgainState.modalSerialNumber}${reportAgainState.modalSuffix}`;
    } else {
      icnVal = `${icnState.aacCode}${reportAgainState.modalJulianDate}${reportAgainState.modalSerialNumber}`;
    }
    return icnVal;
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
        addToast({
          text: `Record Added-${data.oldIcn}; Verify/change data for new record.`,
          type: "success",
          heading: "Success",
        });
        reportAgainOptions.forEach((element) => {
          element.isSelected = false;
        });
        updateReportAgainState({
          reportAgainOptions: reportAgainOptions,
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
    updatePocState({
      pocOption: [
        {
          id: "notify-poc",
          isSelected: false,
          value: "Notify Point of Contact when Available for Sale",
        },
      ],
    });
    updateAdditionalInfoState({
      dropAfterInternalScreeningOptions: [
        { value: "Yes", id: "Y", isSelected: false },
        { value: "No", id: "N", isSelected: true },
      ],
      dropAfterInternalScreeningDisabledOptions: [
        { value: "Yes", id: "Y", isSelected: true },
        {
          value: "No",
          id: "N",
          isSelected: false,
          isDisabled: true,
        },
      ],
      demilitarizationOptions: [
        {
          id: "A",
          value: "Demilitarization not required",
          isSelected: true,
        },
        {
          id: "B",
          value:
            "Demilitarization not required, Trade Security Controls not required",
          isSelected: false,
        },
        {
          id: "C",
          value:
            "Remove and/or demilitarize installed key point(s), or lethal parts, components, and accessories",
          isSelected: false,
        },
        {
          id: "D",
          value:
            "Demilitarize by mutilation to preclude restoration or repair or, if authorized, by burial or deep water dumping",
          isSelected: false,
        },
        {
          id: "E",
          value:
            "Demilitarize based on instructions furnished by DOD Demilitarization Program Office",
          isSelected: false,
        },
        {
          id: "F",
          value:
            "Demilitarize based on instructions furnished by Item/Technical Manager",
          isSelected: false,
        },
        {
          id: "G",
          value: "Demilitarize and declassify or remove any sensitive markings",
          isSelected: false,
        },
        {
          id: "P",
          value:
            "Demilitarize and declassify or remove any sensitive markings for Security classified items",
          isSelected: false,
        },
        {
          id: "Q",
          value:
            "Demilitarization not required, Strategic List item controlled by the Dept. of Commerce, subject to Export Administration regulations",
          isSelected: false,
        },
      ],
      conditionOptions: [
        {
          id: "N",
          value: "New or Unused",
          isSelected: false,
        },
        {
          id: "U",
          value: "Usable",
          isSelected: false,
        },
        {
          id: "R",
          value: "Repairable",
          isSelected: false,
        },
        {
          id: "X",
          value: "Salvage",
          isSelected: false,
        },
        {
          id: "S",
          value: "Scrap",
          isSelected: false,
        },
      ],
      hazardousOptions: [
        {
          id: "M",
          value: "Hazardous Material",
          isSelected: false,
        },
        {
          id: "W",
          value: "Hazardous Waste",
          isSelected: false,
        },
        {
          id: "N",
          value: "No",
          isSelected: true,
        },
      ],
      flightSafetyOptions: [
        {
          id: "B",
          value: "Blank",
          isSelected: true,
        },
        {
          id: "E",
          value: "FSCAP hardened for nuclear warfare",
          isSelected: false,
        },
        {
          id: "F",
          value: "Flight Safety Critical Aircraft Part",
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
      content: <IcnClass resetOptions={resetOptions} />,
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
      content: <AdditionalInfoClass />,
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

  const salesNotes = {
    title: "Sales Notes",
    content: <SalesNotesClass />,
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
            <div className={"grid-row "}>
              {icnState.isIcnValid && (
                <PropertyReportButtons
                  saveFunction={handlePropertySave}
                  isSubmitDisabled={propertyReportState.isSubmitDisabled}
                  isSubmitLoading={propertyReportState.isSubmitLoading}
                  cancelFunction={handleCancel}
                  isSaveAndReportDisplayed={true}
                  saveAndReportAgain={submitAndReportAgainCheck}
                />
              )}
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
              </div>
            </div>
            <div className={"grid-row grid-gap-2"}>
              <div className={"margin-top-2 col-md-auto"}>
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
            <br />
            {icnState.isIcnValid && (
              <div>
                <PPMSAccordion bordered={true} items={items} />
                <br />
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
              </div>
            )}
          </Form>
        </main>
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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(PropertyReportCreate);

export function checkIfSelected(options: any[]) {
  let optionIsSelected: boolean = false;
  options.forEach((option) => {
    if (option.isSelected) {
      optionIsSelected = true;
    }
  });
  return optionIsSelected;
}
