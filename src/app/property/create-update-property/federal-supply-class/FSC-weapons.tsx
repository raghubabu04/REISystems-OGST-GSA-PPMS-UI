import React, { useContext, useEffect, useMemo } from "react";
import { weaponsFSCCode } from "../constants/Constants";
import {
  validateSerialNumberExist,
  validateWeaponSelection,
  validateWeaponSerialNumber,
} from "../validations/propertyFieldValidations";
import { PropertyContext } from "../PropertyContext";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import PPMSMultiSelect from "../../../../ui-kit/components/PPMS-multi-select";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { isFormSubmitted } from "../../../../service/validation.service";

export interface FSCWeaponsProps {
  updateFSCWeapons: any;
  fscCode: string;
  triggerValidation?: boolean;
  validateFscSection: boolean;
}

export function FSCWeapons(props: FSCWeaponsProps) {
  const commonApiService: CommonApiService = new CommonApiService();
  const {
    icnState,
    fscWeaponState,
    updateFSCWeaponState,
    fscState,
    updateFSCState,
  } = useContext(PropertyContext);

  function handleWeaponSelection(value) {
    let validation = validateWeaponSelection(value);
    updateFSCWeaponState({
      weaponsTypeValidationMessage: validation.validationError,
      weaponTypesIsInvalid: validation.isInvalid,
      weaponTypesIsValid: !validation.isInvalid,
    });
    updateFSCState({ weaponInvalid: validation.isInvalid });
    const { FSCWeaponData } = fscWeaponState;
    populateWeaponsData(value, FSCWeaponData);
    if (value.length > 0) {
      const weaponObj = value[0];
      const itemName = weaponObj.longName.toString();
      fscState.fsc["itemName"] = itemName;
      updateFSCState({
        fscState: itemName,
      });
    } else {
      const itemName = "";
      fscState.fsc["itemName"] = itemName;
      updateFSCState({
        fscState: itemName,
      });
    }
    updateFSCWeaponState({ FSCWeaponData: FSCWeaponData });
    props.updateFSCWeapons({
      weapon: FSCWeaponData,
    });
  }

  function populateWeaponsData(value, FSCWeaponData) {
    if (value.length > 0) {
      const weaponObj = value[0];
      FSCWeaponData["longName"] = weaponObj.longName;
      FSCWeaponData["size"] = weaponObj.size;
      FSCWeaponData["type"] = weaponObj.type;
      FSCWeaponData["make"] = weaponObj.make;
      FSCWeaponData["model"] = weaponObj.model;
    } else {
      FSCWeaponData["longName"] = "";
      FSCWeaponData["size"] = "";
      FSCWeaponData["type"] = "";
      FSCWeaponData["make"] = "";
      FSCWeaponData["model"] = "";
    }
  }

  function validateSerialNumber(value: string) {
    let validation = validateWeaponSerialNumber(value ? value : "");
    updateFSCWeaponState({
      serialValidation: validation.validationError,
      isInvalid: validation.isInvalid,
      isValid: !validation.isInvalid,
    });
    if (!validation.isInvalid) {
      validateSerialNumberExist(
        props.fscCode,
        value,
        icnState.aacCode +
          icnState.julianDate +
          icnState.serialNum +
          icnState.suffix
      ).then((response) => {
        if (response.status === 200 && response.data === true) {
          updateFSCWeaponState({
            serialValidation:
              "Weapon's serial number already exists, Please change",
            isInvalid: true,
            isValid: false,
          });
          updateFSCState({ weaponInvalid: true });
        }
      });
    }
    return validation;
  }

  function handleSerialNumberChange(value) {
    if (weaponsFSCCode.includes(props.fscCode)) {
      let validationSerialNumber = validateSerialNumber(value);
      updateFSCWeaponState({
        isInvalid: validationSerialNumber.isInvalid,
        isValid: !validationSerialNumber.isInvalid,
      });
      updateFSCState({ weaponInvalid: validationSerialNumber.isInvalid });
    }
    const FSCWeaponData = fscWeaponState.FSCWeaponData;

    FSCWeaponData.specialDescriptionCode = value;

    updateFSCWeaponState({ FSCWeaponData, serialNumber: value });
    props.updateFSCWeapons({
      weapon: FSCWeaponData,
    });
  }

  function handleSpecialDescriptionTextChange(event) {
    const { FSCWeaponData } = fscWeaponState;
    const { fsc } = fscState;

    FSCWeaponData["specialDescriptionText"] = event.target.value;
    if (event.currentTarget.name === "specialDescriptionText") {
      fsc["specialDescriptionText"] = event.currentTarget.value;
      updateFSCState({
        fsc: fsc,
      });
    }

    updateFSCWeaponState({
      FSCWeaponData,
    });
    updateFSCState({
      specialDescriptionText: event.target.value,
    });
    props.updateFSCWeapons({
      weapon: FSCWeaponData,
    });
  }

  useEffect(() => {
    commonApiService
      .getAllWeaponTypes()
      .then((response: any) => {
        updateFSCWeaponState({ weaponTypes: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validateForm();
        isFormSubmitted.next(false);
      } else if (props.validateFscSection) {
        validateForm();
        updateFSCState({
          validateFscSection: false,
        });
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [fscWeaponState]);

  function validateForm() {
    let validationSerialNumber = validateSerialNumber(
      fscState.specialDescriptionCode
    );
    let validationWeaponSelection = validateWeaponSelection([
      fscState.fsc?.weapon?.longName,
    ]);
    updateFSCState({
      weaponInvalid:
        validationSerialNumber.isInvalid || validationWeaponSelection.isInvalid,
    });
  }

  return useMemo(() => {
    return (
      <>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <PPMSMultiSelect
              avoidHighlightFirstOption={true}
              caseSensitiveSearch={false}
              chipVariant={"primary"}
              closeIcon={"cancel"}
              closeOnSelect={true}
              disablePreSelectedValues={false}
              displayValue={"longName"}
              emptyRecordMsg={"No matches found"}
              id={"weaponType"}
              isObject={true}
              label={"Weapon Selection"}
              hint={"Please select Weapon from the dropdown."}
              onRemove={handleWeaponSelection}
              onSelect={handleWeaponSelection}
              options={fscWeaponState.weaponTypes}
              placeholder="Select Weapon"
              isRequired={true}
              selectedValues={fscWeaponState.selectedValues}
              selectionLimit={1} //-1 for multi-select
              showCheckbox={false}
              singleSelect={false}
              triggerValidation={props.triggerValidation}
              validate={validateWeaponSelection([
                fscState.fsc?.weapon?.longName,
              ])}
              validationMessage={fscWeaponState.weaponsTypeValidationMessage}
              isValid={fscWeaponState.weaponTypesIsValid}
              isInvalid={fscWeaponState.weaponTypesIsInvalid}
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-4"}>
            <PPMSInput
              id={"serialNumber"}
              name={"serialNumber"}
              label={"Serial Number"}
              isRequired={true}
              isDisabled={false}
              inputType={"text"}
              minLength={0}
              maxLength={12}
              isInvalid={fscWeaponState.isInvalid}
              isValid={fscWeaponState.isValid}
              value={fscWeaponState.FSCWeaponData.specialDescriptionCode}
              onBlur={(event) => handleSerialNumberChange(event.target.value)}
              onChange={(event) => {
                fscWeaponState.FSCWeaponData.specialDescriptionCode =
                  event.target.value;
                updateFSCWeaponState({
                  fscWeaponState,
                });
              }}
              validationMessage={fscWeaponState.serialValidation}
            />
          </div>
          <div className={"tablet:grid-col-8"}>
            <PPMSInput
              id={"specialDescriptionText"}
              name={"specialDescriptionText"}
              label={"Special Description Text"}
              isRequired={false}
              isDisabled={false}
              inputType={"text"}
              value={fscState.fsc.specialDescriptionText}
              onChange={handleSpecialDescriptionTextChange}
              validationMessage={fscWeaponState.specialDescriptionTextMsg}
              maxLength={69}
              minLength={0}
              isInvalid={fscWeaponState.specialDescriptionTextInvalid}
              isValid={false}
            />
          </div>
        </div>
      </>
    );
  }, [fscState, fscWeaponState]);
}
