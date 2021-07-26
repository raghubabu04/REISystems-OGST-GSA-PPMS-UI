import React, {useContext, useEffect} from "react";
import {PropertyContext} from "../PropertyContext";
import {UserUtils} from "../../../../utils/UserUtils";
import {isEmptyCheck, validateAcquisitionDate, validatePropTYpe,} from "../validations/propertyFieldValidations";
import {CommonApiService} from "../../../../api-kit/common/common-api.service";
import {UserApiService} from "../../../../api-kit/user/user-api.service";
import {aacCodeValidation, acnValidation,} from "../../../../ui-kit/components/validations/FieldValidations";
import {PPMSInput} from "../../../../ui-kit/components/common/input/PPMS-input";

function AacCode() {
  let commonApiService = new CommonApiService();
  let userApiService = new UserApiService();
  const {
    icnState,
    fscVehicleState,
    updateIcnState,
    updateAgencyInfoState,
    updateFSCVehicleState,
    updateAdditionalInfoState,
    fscState,
    additionalInfoState,
    propertyInfoState,
    propertyReportState,
    updateFSCState,
    updatePropertyInfoState,
    updateRepAgencyAddressState,
    updatePocState,
    updatePropertyLocationState,
    updatePropCustState,
    updateERDAndSRD,
    fscVesselState,
  } = useContext(PropertyContext);

  function handleAccChange(event: any) {
    let aacValue = event.target.value.toUpperCase();
    const validation = aacCodeValidation(aacValue);

    if (validation && validation.isInvalid) {
      updateAdditionalInfoState({
        isDropAfterInternalScreeningRequired: false,
        dropAfterInternalScreening: false, //recheck when other agency is entered what should be sent to api
      });
    }

    const acnValidation1 = acnValidation(aacValue);
    updatePropertyInfoState({
      isACNVAlid: !acnValidation1.isInvalid,
      isACNInValid: acnValidation1.isInvalid,
      acnValidationMessage: acnValidation1.validationError,
    });
    updateIcnState({
      aacCode: aacValue,
      showIcnCodeValid: false,
      aacValidationMessage: validation.validationError,
      aacIsInvalid: validation.isInvalid,
      aacIsValid: !validation.isInvalid,
    });
    if (!validation.isInvalid) {
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

  useEffect(() => {
    if (!icnState.aacIsInvalid && !isEmptyCheck(icnState.aacCode)) {
      const aacValue = icnState.aacCode;
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
  }, []);

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

              repOb["line1"].trim() +
              "-" +
              repOb["city"].trim();
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

              pocOb["lastName"].trim() +
              "-" +
              pocOb["email"].trim();
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

              locOb["line1"].trim() +
              "-" +
              locOb["city"].trim();
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

              custOb["lastName"].trim() +
              "-" +
              custOb["email"].trim();
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

  return (
    <PPMSInput
      id={"aac-code"}
      name={"aacCode"}
      label={"AAC CODE"}
      onBlur={handleAccChange}
      onChange={(event) => {
        updateIcnState({
          aacCode: event.target.value.toUpperCase(),
        });
      }}
      isRequired={true}
      maxLength={6}
      validationMessage={icnState.aacValidationMessage}
      isInvalid={icnState.aacIsInvalid}
      isValid={icnState.aacIsValid}
      isDisabled={icnState.disableAAC}
      inputType={"text"}
      value={icnState.aacCode}
    />
  );
}

export default AacCode;
