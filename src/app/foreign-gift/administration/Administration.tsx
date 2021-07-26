import React, { useContext, useEffect } from "react";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { PropertyContext } from "../../property/create-update-property/PropertyContext";
import { stateValidation } from "../../../ui-kit/components/validations/FieldValidations";
import { isFormSubmitted } from "../../../service/validation.service";

export interface AdministrationProps {
  validationMessage?: any;
  id: string;
  disabled: boolean;
  identifierKey?: string;
  identifierValue?: any;
  selectedAdminstration?: string;
  required: boolean;
  label: string;
  isValid?: boolean;
  isInvalid?: boolean;
}

export function Administration(props: AdministrationProps) {
  const {
    adminInfoState,
    updateAdminInfoState,
    updateGiftInformationState,
  } = useContext(PropertyContext);
  const commonApiService = new CommonApiService();
  useEffect(() => {
    commonApiService.getAllPresidents().then(async (response) => {
      let list = response.data.map((item) => {
        return {
          presidentName: item.presidentName,
          presidentCode: item.presidentCode,
        };
      });
      updateAdminInfoState({
        adminOptions: list,
      });
    });
  }, []);
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
  }, [updateAdminInfoState]);
  function validateForm() {
    handleAdminChanges(adminInfoState.presidentName);
  }
  return (
    <PPMSSelect
      id={"props.id"}
      disabled={props.disabled}
      placeholderValue={"Select Administration"}
      selectName={props.id + "-administration"}
      name={props.id + ".administration"}
      identifierKey={
        props.identifierKey ? props.identifierKey : "presidentName"
      }
      identifierValue={
        props.identifierValue ? this.props.identifierValue : "presidentName"
      }
      isInvalid={props.isInvalid}
      isValid={props.isValid}
      label={props.label}
      isRequired={props.required}
      selectedValue={props.selectedAdminstration}
      validationMessage={
        props.validationMessage
          ? props.validationMessage
          : "Administration is Required."
      }
      values={adminInfoState.adminOptions}
      onChange={(event) => handleChange(event.target)}
    />
  );

  function handleChange({ selectedIndex }) {
    const name = adminInfoState.adminOptions[selectedIndex - 1]
      ? adminInfoState.adminOptions[selectedIndex - 1].presidentName
      : "";
    handleAdminChanges(name);
  }
  function handleAdminChanges(name: string) {
    let validation = stateValidation(name);
    updateAdminInfoState({
      isInvalid: validation.isInvalid,
      isValid: !validation.isInvalid,
      validationMessage: validation.validationError,
      presidentName: name,
    });
    updateGiftInformationState({
      presidentNameInvalid: validation.isInvalid,
      presidentName: name,
    });
  }
}
