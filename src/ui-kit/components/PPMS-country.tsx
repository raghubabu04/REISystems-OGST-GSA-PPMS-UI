import React, { useEffect, useState } from "react";
import { PPMSSelect } from "./common/select/PPMS-select";
import { CommonApiService } from "../../api-kit/common/common-api.service";
import { countryValidation } from "./validations/FieldValidations";
import { isFormSubmitted } from "../../service/validation.service";

export interface PPMSCountryProps {
  identifierKey?: string;
  identifierValue?: string;
  id: string;
  isInvalid?: boolean;
  isValid?: boolean;
  disabled?: boolean;
  label?: string;
  locationCountryptions?: any;
  placeHolderValue?: string;
  required: boolean;
  selectedCountry?: string;
  validationMessage?: string;
  updateLocationCountry: any;
  inputRef?: any;
  name?: string;
}

export function PPMSCountry(props: PPMSCountryProps) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let commonApiService = new CommonApiService();
    commonApiService
      .getCountryList()
      .then((response: any) => {
        let countryList = [];
        response.data.map((country) => {
          countryList.push({
            countryCode: `${country.countryCode}-${props.id}`,
            countryName: country.countryName,
          });
        });
        setOptions(countryList);
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
      }
    });
    return () => {
      isCurrent = false;
    };
  });

  function validateForm() {
    let validation = countryValidation(props.selectedCountry);
    props.updateLocationCountry(props.selectedCountry, validation);
  }

  function handleChange({ selectedIndex }) {
    const countryCode = options[selectedIndex - 1]
      ? options[selectedIndex - 1].countryCode
      : "";
    let validation = countryValidation(countryCode);
    props.updateLocationCountry(countryCode.split("-")[0], validation);
  }
  return (
    <PPMSSelect
      disabled={props.disabled}
      placeholderValue={
        props.placeHolderValue ? this.props.placeHolderValue : "Select Country"
      }
      selectName={props.id + "-country"}
      name={props.id + ".country"}
      identifierKey={props.identifierKey ? props.identifierKey : "countryCode"}
      identifierValue={
        props.identifierValue ? props.identifierValue : "countryName"
      }
      isInvalid={props.isInvalid}
      isValid={props.isValid}
      label={props.label}
      isRequired={props.required}
      selectedValue={`${props.selectedCountry}-${props.id}`}
      validationMessage={
        props.validationMessage
          ? props.validationMessage
          : "Country is required"
      }
      values={options}
      onChange={(event) => handleChange(event.target)}
      inputRef={props.inputRef}
    />
  );
}
