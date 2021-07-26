import React, { createContext, Dispatch, useState } from "react";
import { IcnState, IcnStateDefault, updateIcnNav } from "./icn-class/IcnState";
import {
  AgencyInfoState,
  AgencyInfoStateDefault,
  updateAgencyInfoNav,
} from "./agency-info-class/AgencyInfoState";
import {
  PropertyInfoState,
  PropertyInfoStateDefault,
  updatePropInfoNav,
} from "./property-info-class/PropertyInfoState";
import {
  RepAgencyAddressState,
  RepAgencyAddressStateDefault,
  updateRepAddressNav,
} from "./rep-agency-address-class/RepAgencyAddressState";

import {
  PocState,
  PocStateDefault,
  updatePocStateNav,
} from "./point-of-contact-class/PocState";

import {
  PropertyLocationState,
  PropertyLocationStateDefault,
  updatePropertyLocationNav,
} from "./property-location-class/PropertyLocationState";

import {
  PropCustState,
  PropCustStateDefault,
  updatePropCustNav,
} from "./property-custodian-class/PropCustState";
import {
  PropertyReportState,
  PropertyReportStateDefault,
} from "./PropertyReportState";
import {
  UnitOfIssueState,
  UnitOfIssueStateDefaults,
  updateUnitOfIssueNav,
} from "./unit-of-issue-class/UnitOfIssueState";
import {
  FSCVehicleState,
  FSCVehicleStateDefault,
} from "./federal-supply-class/model/FSCVehicleState";
import {
  FSCState,
  FSCStateDefaults,
  updateFSCNav,
} from "./federal-supply-class/model/FSCState";
import {
  AdditionalInfoState,
  AdditionalInfoStateDefault,
  updateAdditionalInfoNav,
} from "./additional-info-class/AdditionalInfoState";
import {
  ERDValidation,
  isEmptyCheck,
  SRDValidation,
  validateExcessReleaseDate,
  validateSurplusReleaseDate,
} from "./validations/propertyFieldValidations";
import moment from "moment";
import {
  FSCTrailerState,
  FSCTraillerStateDefaults,
} from "./federal-supply-class/model/FSCTrailerState";
import {
  FSCComputersState,
  FSCComputersStateDefault,
} from "./federal-supply-class/model/FSCComputerState";
import {
  FSCOtherState,
  FSCOtherStateDefault,
} from "./federal-supply-class/model/FSCOtherState";
import {
  FSCWeaponsState,
  FSCWeaponsStateDefault,
} from "./federal-supply-class/model/FSCWeaponsState";
import {
  FSCVesselDefaults,
  FSCVesselState,
} from "./federal-supply-class/model/FSCVesselState";
import {
  FSCAircraftDefaults,
  FSCAircraftState,
} from "./federal-supply-class/model/FSCAircraftState";
import {
  GiftInformationState,
  GiftInformationStateDefaults,
  updateGiftInfoNav,
} from "../../foreign-gift/create-update-foreign-gift/gift-information/GiftInformationState";
import {
  AdminState,
  AdminStateDefault,
} from "../../foreign-gift/administration/AdministrationState";
import {
  AppraisalAgencyInformationState,
  AppraisalAgencyInformationStateDefaults,
  updateAppraisalAgencyInfoNav,
} from "../../foreign-gift/create-update-foreign-gift/appraisal-agency-information/AppraisalAgencyInformationState";
import {
  appraisalInformationDefault,
  AppraisalInformationState,
  updateAppraisalInfoNav,
} from "../../foreign-gift/create-update-foreign-gift/appraisalInformation/AppraisalInformationState";
import {
  RecipientInfoState,
  RecipientInfoStateDefaults,
  updateRecipientInfoNav,
} from "../../foreign-gift/create-update-foreign-gift/recipient-information/RecipientInfoState";
import {
  DonorInfoState,
  DonorInfoStateDefaults,
  updateDonorInfoNav,
} from "../../foreign-gift/create-update-foreign-gift/donor-information/DonorInfoState";
import {
  SalesNotesState,
  SalesNotesStateDefault,
  updateSalesNotesNav,
} from "./sales-notes-class/SalesNotesState";
import {
  ReportAgainState,
  ReportAgainStateDefault,
} from "./common/ReportAgainState";

export interface IPropertyContext {
  icnState: IcnState;
  updateIcnState: Dispatch<React.SetStateAction<any>>;
  propertyInfoState: PropertyInfoState;
  updatePropertyInfoState: React.Dispatch<React.SetStateAction<any>>;
  agencyInfoState: AgencyInfoState;
  updateAgencyInfoState: React.Dispatch<React.SetStateAction<any>>;
  repAgencyAddressState: RepAgencyAddressState;
  updateRepAgencyAddressState: React.Dispatch<React.SetStateAction<any>>;
  pocState: PocState;
  updatePocState: React.Dispatch<React.SetStateAction<any>>;
  propertyLocationState: PropertyLocationState;
  updatePropertyLocationState: React.Dispatch<React.SetStateAction<any>>;
  propCustState: PropCustState;
  updatePropCustState: React.Dispatch<React.SetStateAction<any>>;
  fscState: FSCState;
  updateFSCState: React.Dispatch<React.SetStateAction<any>>;
  fscWeaponState: FSCWeaponsState;
  updateFSCWeaponState: React.Dispatch<React.SetStateAction<any>>;
  fscOtherState: FSCOtherState;
  updateFSCOtherState: React.Dispatch<React.SetStateAction<any>>;
  fscComputerState: FSCComputersState;
  updateFSCComputerState: React.Dispatch<React.SetStateAction<any>>;
  unitOfIssueState: UnitOfIssueState;
  updateUnitOfIssueState: React.Dispatch<React.SetStateAction<any>>;
  fscVehicleState: FSCVehicleState;
  updateFSCVehicleState: React.Dispatch<React.SetStateAction<any>>;
  propertyReportState: PropertyReportState;
  updatePropertyReportState: React.Dispatch<React.SetStateAction<any>>;
  additionalInfoState: AdditionalInfoState;
  updateAdditionalInfoState: React.Dispatch<React.SetStateAction<any>>;
  salesNotesState: SalesNotesState;
  updateSalesNotesState: React.Dispatch<React.SetStateAction<any>>;
  updateERDAndSRD: (
    exchangeSaleFlag?: string,
    aacCode?: string,
    agencyBureau?: string,
    isVessel50FeetOrOver?: boolean,
    agencyControlNumber?: string,
    disposalConditionCode?: string,
    isEquipmentForComputersForLearning?: boolean,
    fscCode?: string,
    screeningDays?: number,
    isInternalAgency?: boolean,
    isSubmitted?: boolean,
    submittedDate?: Date,
    isSubmittedFromUI?: boolean
  ) => void;
  fscTrailerState: FSCTrailerState;
  updateFSCTrailerState: React.Dispatch<React.SetStateAction<any>>;
  fscVesselState: FSCVesselState;
  updateFSCVesselState: React.Dispatch<React.SetStateAction<any>>;
  fscAircraftState: FSCAircraftState;
  updateFscAircraftState: React.Dispatch<React.SetStateAction<any>>;
  giftInformationState: GiftInformationState;
  updateGiftInformationState: React.Dispatch<React.SetStateAction<any>>;
  adminInfoState: AdminState;
  updateAdminInfoState: React.Dispatch<React.SetStateAction<any>>;
  donorInfoState: DonorInfoState;
  updateDonorInfoState: React.Dispatch<React.SetStateAction<any>>;
  recipientInfoState: RecipientInfoState;
  updateRecipientInfoState: React.Dispatch<React.SetStateAction<any>>;
  appraisalAgencyInformationState: AppraisalAgencyInformationState;
  updateAppraisalAgencyInformationState: React.Dispatch<
    React.SetStateAction<any>
  >;
  appraisalInformationState: AppraisalInformationState;
  updateAppraisalInformationState: React.Dispatch<React.SetStateAction<any>>;
  reportAgainState: ReportAgainState;
  updateReportAgainState: Dispatch<React.SetStateAction<any>>;
}

export const PropertyContext = createContext({} as IPropertyContext);

export const PropertyProvider = ({ children }) => {
  const [propertyInfoState, setPropertyInfoState] = useState<PropertyInfoState>(
    PropertyInfoStateDefault
  );

  const [icnState, setIcnState] = useState<IcnState>(IcnStateDefault);

  const [agencyInfoState, setAgencyInfoState] = useState<AgencyInfoState>(
    AgencyInfoStateDefault
  );

  const [repAgencyAddressState, setRepAgencyAddressState] = useState<
    RepAgencyAddressState
  >(RepAgencyAddressStateDefault);

  const [pocState, setPocState] = useState<PocState>(PocStateDefault);

  const [propertyLocationState, setPropertyLocationState] = useState<
    PropertyLocationState
  >(PropertyLocationStateDefault);

  const [propCustState, setPropCustState] = useState<PropCustState>(
    PropCustStateDefault
  );

  const [fscState, setFSCState] = useState<FSCState>(FSCStateDefaults);

  const [fscWeaponState, setFSCWeaponState] = useState<FSCWeaponsState>(
    FSCWeaponsStateDefault
  );
  const [fscOtherState, setFSCOtherState] = useState<FSCOtherState>(
    FSCOtherStateDefault
  );
  const [fscComputerState, setFSCComputerState] = useState<FSCComputersState>(
    FSCComputersStateDefault
  );

  const [unitOfIssueState, setUnitOfIssueState] = useState<UnitOfIssueState>(
    UnitOfIssueStateDefaults
  );
  const [giftInformationState, setGiftInformationState] = useState<
    GiftInformationState
  >(GiftInformationStateDefaults);

  const [donorInfoState, setDonorInfoState] = useState<DonorInfoState>(
    DonorInfoStateDefaults
  );

  const [recipientInfoState, setRecipientInfoState] = useState<
    RecipientInfoState
  >(RecipientInfoStateDefaults);

  const [adminInfoState, setAdminInfoState] = useState<AdminState>(
    AdminStateDefault
  );

  const [
    appraisalAgencyInformationState,
    setAppraisalAgencyInformationState,
  ] = useState<AppraisalAgencyInformationState>(
    AppraisalAgencyInformationStateDefaults
  );

  const [fscVehicleState, setFSCVehicleState] = useState<FSCVehicleState>(
    FSCVehicleStateDefault
  );

  const [propertyReportState, setPropertyReportState] = useState<
    PropertyReportState
  >(PropertyReportStateDefault);

  const [additionalInfoState, setAdditionalInfoState] = useState<
    AdditionalInfoState
  >(AdditionalInfoStateDefault);
  const [salesNotesState, setSalesNotesState] = useState<SalesNotesState>(
    SalesNotesStateDefault
  );
  const [fscTrailerState, setSCTrailerState] = useState<FSCTrailerState>(
    FSCTraillerStateDefaults
  );
  const [fscVesselState, setFSCVesselState] = useState<FSCVesselState>(
    FSCVesselDefaults
  );
  const [fscAircraftState, setFscAircraftState] = useState<FSCAircraftState>(
    FSCAircraftDefaults
  );

  const [reportAgainState, setReportAgainState] = useState<ReportAgainState>(
    ReportAgainStateDefault
  );

  const [appraisalInformationState, setAppraisalInformationState] = useState<
    AppraisalInformationState
  >(appraisalInformationDefault);
  const value = {
    icnState,
    updateIcnState,
    propertyInfoState,
    updatePropertyInfoState,
    agencyInfoState,
    updateAgencyInfoState,
    repAgencyAddressState,
    updateRepAgencyAddressState,
    pocState,
    updatePocState,
    propertyLocationState,
    updatePropertyLocationState,
    propCustState,
    updatePropCustState,
    fscState,
    updateFSCState,
    fscWeaponState,
    updateFSCWeaponState,
    fscOtherState,
    updateFSCOtherState,
    fscComputerState,
    updateFSCComputerState,
    unitOfIssueState,
    updateUnitOfIssueState,
    fscVehicleState,
    updateFSCVehicleState,
    propertyReportState,
    updatePropertyReportState,
    additionalInfoState,
    updateAdditionalInfoState,
    salesNotesState,
    updateSalesNotesState,
    updateERDAndSRD,
    fscTrailerState,
    updateFSCTrailerState,
    fscVesselState,
    updateFSCVesselState,
    fscAircraftState,
    updateFscAircraftState,
    giftInformationState,
    updateGiftInformationState,
    adminInfoState,
    updateAdminInfoState,
    donorInfoState,
    updateDonorInfoState,
    appraisalAgencyInformationState,
    updateAppraisalAgencyInformationState,
    appraisalInformationState,
    updateAppraisalInformationState,
    recipientInfoState,
    updateRecipientInfoState,
    reportAgainState,
    updateReportAgainState,
  };

  //function called to update IcnState with new value
  function updateIcnState(newState: IcnState) {
    setIcnState((prevState: IcnState) => {
      updateIcnNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updateGiftInformationState(newState: GiftInformationState) {
    setGiftInformationState((prevState: GiftInformationState) => {
      updateGiftInfoNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updateReportAgainState(newState: any) {
    setReportAgainState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateDonorInfoState(newState: DonorInfoState) {
    setDonorInfoState((prevState: DonorInfoState) => {
      updateDonorInfoNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updateRecipientInfoState(newState: RecipientInfoState) {
    setRecipientInfoState((prevState: RecipientInfoState) => {
      updateRecipientInfoNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updateAdminInfoState(newState: any) {
    setAdminInfoState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  function updateAppraisalAgencyInformationState(
    newState: AppraisalAgencyInformationState
  ) {
    setAppraisalAgencyInformationState(
      (prevState: AppraisalAgencyInformationState) => {
        updateAppraisalAgencyInfoNav(newState, prevState);
        return { ...prevState, ...newState };
      }
    );
  }
  function updateFSCVesselState(newState: any) {
    setFSCVesselState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  function updateFSCTrailerState(newState: any) {
    setSCTrailerState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  //function called to update PropertyInfoState with new value
  function updatePropertyInfoState(newState: PropertyInfoState) {
    setPropertyInfoState((prevState: PropertyInfoState) => {
      updatePropInfoNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  //function called to update AgencyInfoState with new value
  function updateAgencyInfoState(newState: AgencyInfoState) {
    setAgencyInfoState((prevState: AgencyInfoState) => {
      updateAgencyInfoNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  //function called to update RepAgencyAddressState with new value
  function updateRepAgencyAddressState(newState: RepAgencyAddressState) {
    setRepAgencyAddressState((prevState: RepAgencyAddressState) => {
      updateRepAddressNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updatePropertyLocationState(newState: PropertyLocationState) {
    setPropertyLocationState((prevState: PropertyLocationState) => {
      updatePropertyLocationNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updatePropCustState(newState: PropCustState) {
    setPropCustState((prevState: PropCustState) => {
      updatePropCustNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updatePocState(newState: PocState) {
    setPocState((prevState: PocState) => {
      updatePocStateNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  //function called to update FSCState with new value
  function updateFSCState(newState: FSCState) {
    setFSCState((prevState: FSCState) => {
      if (!isEmptyCheck(newState?.fsc?.weapon?.type)) {
        console.log(newState.fsc.weapon.type);
      }
      updateFSCNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updateFSCWeaponState(newState: any) {
    setFSCWeaponState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateFSCOtherState(newState: any) {
    setFSCOtherState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateFSCComputerState(newState: FSCComputersState) {
    setFSCComputerState((prevState: FSCComputersState) => {
      return { ...prevState, ...newState };
    });
  }

  function updateUnitOfIssueState(newState: UnitOfIssueState) {
    setUnitOfIssueState((prevState: UnitOfIssueState) => {
      updateUnitOfIssueNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updateFSCVehicleState(newState: any) {
    setFSCVehicleState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateFscAircraftState(newState: any) {
    setFscAircraftState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updatePropertyReportState(newState: any) {
    setPropertyReportState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateAdditionalInfoState(newState: any) {
    setAdditionalInfoState((prevState: any) => {
      updateAdditionalInfoNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updateSalesNotesState(newState: SalesNotesState) {
    setSalesNotesState((prevState: SalesNotesState) => {
      updateSalesNotesNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updateAppraisalInformationState(
    newState: AppraisalInformationState
  ) {
    setAppraisalInformationState((prevState: AppraisalInformationState) => {
      updateAppraisalInfoNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  async function updateERDAndSRD(
    exchangeSaleFlag?: string,
    aacCode?: string,
    agencyBureau?: string,
    isVessel50FeetOrOver?: boolean,
    agencyControlNumber?: string,
    disposalConditionCode?: string,
    isEquipmentForComputersForLearning?: boolean,
    fscCode?: string,
    screeningDays?: number,
    isInternalAgency?: boolean,
    isSubmitted?: boolean,
    submittedDate?: Date,
    isSubmittedFromUI?: boolean
  ) {
    if (propertyReportState.isDraft) {
      const erdValidation: ERDValidation = await validateExcessReleaseDate(
        exchangeSaleFlag,
        aacCode,
        agencyBureau,
        agencyControlNumber,
        disposalConditionCode,
        isEquipmentForComputersForLearning,
        fscCode,
        screeningDays,
        isInternalAgency,
        isSubmitted,
        submittedDate
      );
      if (!isEmptyCheck(erdValidation.excessReleaseDate)) {
        updateAdditionalInfoState({
          excessReleaseDate: moment(erdValidation.excessReleaseDate).toDate(),
        });
      }

      const srdValidation: SRDValidation = await validateSurplusReleaseDate(
        exchangeSaleFlag,
        aacCode,
        fscCode,
        agencyBureau,
        isVessel50FeetOrOver,
        disposalConditionCode,
        isSubmitted,
        erdValidation?.excessReleaseDate,
        isInternalAgency,
        submittedDate,
        isSubmittedFromUI
      );
      if (!isEmptyCheck(srdValidation.surplusReleaseDate)) {
        updateAdditionalInfoState({
          surplusReleaseDate: moment(srdValidation.surplusReleaseDate).toDate(),
        });
      }
    }
  }

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};

export const PropertyContextConsumer = PropertyContext.Consumer;
