import React, { useContext, useMemo, useEffect } from "react";
import { propertyInfoFields } from "./PropertyInfoFields";
import { PropertyContext } from "../PropertyContext";
import {
  validateACN,
  validateALOnChangeOfALC,
  validateAmountToBeReimbersed,
  validatePropTYpe,
} from "../validations/propertyFieldValidations";

import { PPMSPopover } from "../../../../ui-kit/components/common/PPMS-popover";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { UserApiService } from "../../../../api-kit/user/user-api.service";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { isFormSubmitted } from "../../../../service/validation.service";
import { PropertyInfoStateDefault } from "./PropertyInfoState";
import { UserUtils } from "../../../../utils/UserUtils";

function PropertyInfoClass() {
  let userApiService = new UserApiService();

  //set state for this functional componet
  const {
    propertyInfoState,
    updatePropertyInfoState,
    agencyInfoState,
    fscState,
    icnState,
    additionalInfoState,
    updateAdditionalInfoState,
    propertyReportState,
    updateFSCState,
    updateERDAndSRD,
    propertyLocationState,
    fscVesselState,
  } = useContext(PropertyContext);

  //get fields for this class
  const fields = propertyInfoFields(
    propertyInfoState,
    handlePropTypeChange,
    handleChange,
    onChangeValue
  );

  useEffect(() => {
    //triggers on agency bureau change
    let agencyBureauCode = agencyInfoState.agencyBureau.substring(0, 4);
    let NUOList: any = [];
    userApiService
      .getNUOContactsForAgencyBureauCode(agencyBureauCode)
      .then((response: any) => {
        for (let i = 0; i < response.data.length; i++) {
          NUOList.push({
            firstName: response.data[i].firstName,
            lastName: response.data[i].lastName,
            email: response.data[i].email,
            fax: formatPhoneNumber(response.data[i].fax),
            phoneNumber: formatPhoneNumber(response.data[i].phoneNumber),
            phoneExt: response.data[i].phoneExt,
          });
        }
        updatePropertyInfoState({
          NUOContacts: NUOList,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [agencyInfoState.agencyBureau]);

  useEffect(() => {
    //trigers on property zip change
    let zipCode = propertyLocationState.propZipCode;
    let APOList: any = [];
    userApiService
      .getAPOContactByZip(zipCode)
      .then((response: any) => {
        for (let i = 0; i < response.data.length; i++) {
          APOList.push({
            contactName: response.data[i].contactName,
            email: response.data[i].email,
            fax: formatPhoneNumber(response.data[i].fax),
            phone: formatPhoneNumber(response.data[i].phone),
          });
        }
        updatePropertyInfoState({
          APOContacts: APOList,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [propertyLocationState.propZipCode]);
  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validateForm();
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [propertyInfoState, agencyInfoState]);
  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? "+1 " : "";
      return [intlCode, "", match[2], "-", match[3], "-", match[4]].join("");
    }
    return null;
  }

  useEffect(() => {
    //Force Correct mandatory ALC/TAS when loading property from save
    if (propertyInfoState.propType !== "NR") {
      updatePropertyInfoState({
        isAppropriationTasDisabled: false,
        isAlcRequired: true,
        isAppropriationTasRequired: true,
      });
    }
  }, [propertyInfoState.propType]);

  //function called when an when onChange event is triggerd for propType drop-down
  function handlePropTypeChange(e: any) {
    updatePropertyInfoState({
      [e.target.name]: e.target.value,
    });
    let validation = validatePropTYpe(
      agencyInfoState.agencyBureau,
      e.target.value ? e.target.value : ""
    );
    let reimbursementRequired = "";
    switch (e.target.value) {
      case "PR": {
        reimbursementRequired = "P";
        break;
      }
      case "NR": {
        reimbursementRequired = "N";
        break;
      }
      //PPDMS-2658 change of reimbursementRequired="Y" when WC
      case "WC": {
        reimbursementRequired = "Y";
        break;
      }
      case "NA": {
        reimbursementRequired = "Y";
        break;
      }
      case "TS": {
        reimbursementRequired = "Y";
        break;
      }
      case "WM": {
        reimbursementRequired = "Y";
        break;
      }
      case "ES": {
        reimbursementRequired = "Y";
        break;
      }
      default: {
        //statements;
        break;
      }
    }
    let exchangeSaleFlag = e.target.value === "ES" ? "Y" : "N";
    let shouldAppropriationBeDisabled = e.target.value === "NR";
    updatePropertyInfoState({
      reimbursementIsReq: reimbursementRequired,
      isExchangeSales: exchangeSaleFlag,
      isDonation: reimbursementRequired !== "Y" ? "Y" : "N",
      isAppropriationTasDisabled: shouldAppropriationBeDisabled,
      isAlcRequired: e.target.value !== "NR",
      isAppropriationTasRequired: e.target.value !== "NR",
      amountTobeReimbursed:
        propertyInfoState.propType === "PR" && e.target.value !== "G"
          ? ""
          : propertyInfoState.amountTobeReimbursed,
      isPropValid: !validation.isInvalid,
      isPropInValid: validation.isInvalid,
      propValidationMessage: validation.validationError,
      propType: e.target.value,
    });
    //whenever reimbursementRequired !== Y then remove the validation for ALC and AFC fields
    //(Note: make sure the validation message does not showup for ALC and AFC when reimbursementRequired === Y)
    //PPDMS-2817 ALC/TAS is to be required for PR & WC
    if (e.target.value === "NR") {
      updatePropertyInfoState({
        isAppropriationTasRequired:
          PropertyInfoStateDefault.isAppropriationTasRequired,
        isAfcValid: PropertyInfoStateDefault.isAfcValid,
        isAfcInvalid: PropertyInfoStateDefault.isAfcInvalid,
        isAlcRequired: PropertyInfoStateDefault.isAlcRequired,
        isALCValid: PropertyInfoStateDefault.isALCValid,
        isALCInValid: PropertyInfoStateDefault.isAfcInvalid,
      });
    }
    updateAdditionalInfoState({
      fairMarketValueIsRequired:
        reimbursementRequired === "Y" || e.target.value === "ES",
    });
    if (!UserUtils.isSalesUser()) {
      updateERDAndSRD(
        exchangeSaleFlag,
        icnState.aacCode,
        agencyInfoState.agencyBureau,
        fscVesselState.vesselFSCData.isVessel50FeetOrOver,
        e.target.name === "agencyControlNumber"
          ? e.target.value
          : propertyInfoState.agencyControlNumber,
        additionalInfoState.condition,
        null,
        fscState?.fsc?.fscCode,
        additionalInfoState.screeningDays,
        agencyInfoState.isInternalAgency,
        propertyReportState.isSubmitted,
        propertyReportState.submittedDate,
        true
      );
    }
  }

  function onChangeValue(e: any) {
    e.target.value = e.target.value.toUpperCase();
    updatePropertyInfoState({ [e.target.name]: e.target.value });
  }

  //function called when onChange event is triggerd for text fields
  function handleChange(e: any) {
    if (e.target.name === "agencyControlNumber" && e.target.value !== "")
      e.target.value = e.target.value.toUpperCase();

    updatePropertyInfoState({ [e.target.name]: e.target.value });
    if (e.target.name === "agencyControlNumber") {
      let validation = validateACN(
        agencyInfoState.agencyBureau,
        propertyInfoState.agencyControlNumber,
        fscState.data.fscCode,
        e.target.value ? e.target.value : ""
      );
      //a trigger to reset dropdown flag

      updateAdditionalInfoState({
        isDropAfterInternalScreeningRequired: agencyInfoState.isInternalAgency,
        //by default set value of dropAfterInternalScreening to "Yes"
        dropAfterInternalScreening:
          (agencyInfoState.isInternalAgency &&
            e.target.value &&
            e.target.value.startsWith("LOCAL")) ||
          (agencyInfoState.isInternalAgency &&
            e.target.value &&
            e.target.value.startsWith("ERLE") &&
            fscState.data.fscCode.startsWith("66")),
      });
      updatePropertyInfoState({
        isACNValid: !validation.isACNInvalid,
        isACNInValid: validation.isACNInvalid,
        acnValidationMessage: validation.acnvalidationError,
      });
      if (fscState.data.fscCode && fscState.data.fscCode !== "") {
        updateFSCState({
          isValid: !validation.isFscInvalid,
          isInvalid: validation.isFscInvalid,
          validationMessage: validation.fscValidationError,
          triggerValidation: validation.isFscInvalid,
        });
      }
    }
    if (e.target.name === "amountTobeReimbursed") {
      let validation1 = validateAmountToBeReimbersed(
        propertyInfoState.isAppropriationTasRequired,
        e.target.value
      );
      updatePropertyInfoState({
        afcReqMsg: validation1.validationError,
        isAfcValid: !validation1.isInvalid,
        isAfcInvalid: validation1.isInvalid,
      });
    }
    if (e.target.name === "agencyLocationCode") {
      let validation = validateALOnChangeOfALC(
        propertyInfoState.isAlcRequired,
        e.target.value
      );
      updatePropertyInfoState({
        alcValidationMessage: validation.validationError,
        isALCValid: !validation.isInvalid,
        isALCInValid: validation.isInvalid,
      });
    }
    if (!UserUtils.isSalesUser()) {
      updateERDAndSRD(
        e.target.name === "exchangeSalesFlag"
          ? e.target.value
          : propertyInfoState.isExchangeSales,
        icnState.aacCode,
        agencyInfoState.agencyBureau,
        fscVesselState.vesselFSCData.isVessel50FeetOrOver,
        e.target.name === "agencyControlNumber"
          ? e.target.value
          : propertyInfoState.agencyControlNumber,
        additionalInfoState.condition,
        null,
        fscState?.fsc?.fscCode,
        additionalInfoState.screeningDays,
        agencyInfoState.isInternalAgency,
        propertyReportState.isSubmitted,
        propertyReportState.submittedDate,
        true
      );
    }
  }
  function validateForm() {
    if (
      validatePropTYpe(agencyInfoState.agencyBureau, propertyInfoState.propType)
        .isInvalid
    ) {
      updatePropertyInfoState({ isPropInvalid: true });
    }
    let validation = validateALOnChangeOfALC(
      propertyInfoState.isAlcRequired,
      propertyInfoState.agencyLocationCode
    );
    let validation1 = validateAmountToBeReimbersed(
      propertyInfoState.isAppropriationTasRequired,
      propertyInfoState.amountTobeReimbursed
    );
    updatePropertyInfoState({
      alcValidationMessage: validation.validationError,
      isALCValid: !validation.isInvalid,
      isALCInValid: validation.isInvalid,
      afcReqMsg: validation1.validationError,
      isAfcValid: !validation1.isInvalid,
      isAfcInvalid: validation1.isInvalid,
    });
  }
  //use conditional rendering to dynamically render fields
  return useMemo(() => {
    const NUOcontacts = propertyInfoState.NUOContacts.map((contact) => (
      <div>
        <div>
          {contact.firstName} <span> </span>
          {contact.lastName}
        </div>
        <div>
          <span>
            <strong>Email: </strong>
          </span>
          {contact.email}
        </div>
        <div>
          <span>
            <strong>Phone: </strong>
          </span>
          {contact.phoneNumber}
        </div>
        {contact?.phoneExt && (
          <div>
            <span>
              <strong>Phone Ext: </strong>
            </span>
            {contact?.phoneExt}
          </div>
        )}
        <div>
          <span>
            <strong>Fax: </strong>
          </span>
          {contact.fax}
        </div>
        <br />
      </div>
    ));
    const APOcontacts = propertyInfoState.APOContacts.map((contact) => (
      <div>
        <div>{contact.contactName}</div>
        <div>
          <span>
            <strong>Email: </strong>
          </span>
          {contact.email}
        </div>
        <div>
          <span>
            <strong>Phone: </strong>
          </span>
          {contact.phone}
        </div>
        <div>
          <span>
            <strong>Fax: </strong>
          </span>
          {contact.fax}
        </div>
        <br />
      </div>
    ));
    const contactInfo = (
      <div>
        <h6>NUO Contacts</h6>
        {NUOcontacts}
        <h6>APO Contacts</h6>
        {APOcontacts}
      </div>
    );
    return (
      <React.Fragment>
        <PPMSPopover
          trigger={["click"]}
          id={"ContactInformation"}
          placement={"right"}
          popoverTitle={"Contact Information"}
          popoverContent={contactInfo}
          className={"contactInfo"}
          triggerSource={
            <a href="javascript:void();">NUO/APO Contact Information</a>
          }
        />
        <br />
        {fields.map((f, id) => {
          if (!Array.isArray(f)) {
            const component = f.inputType
              ? React.createElement(PPMSInput, f)
              : React.createElement(PPMSSelect, f);
            return (
              <div className={"grid-row grid-gap-4"}>
                <div className={"tablet:grid-col-10"}>{component}</div>
              </div>
            );
          } else if (Array.isArray(f)) {
            return (
              <div className={"grid-row grid-gap-4"}>
                {f.map((item, i) => {
                  return (
                    <div className={"grid-col"}>
                      {item.inputType
                        ? React.createElement(PPMSInput, item)
                        : React.createElement(PPMSSelect, item)}
                    </div>
                  );
                })}
              </div>
            );
          }
        })}
      </React.Fragment>
    );
  }, [propertyInfoState, additionalInfoState, agencyInfoState, fscState]);
}
export default PropertyInfoClass;
