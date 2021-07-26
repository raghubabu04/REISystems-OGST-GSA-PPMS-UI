import React from "react";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { PPMSEmail } from "../../../ui-kit/components/PPMS-email";
import { PPMSState } from "../../../ui-kit/components/PPMS-state";
import { aacCodeValidation } from "../../../ui-kit/components/validations/FieldValidations";


export interface NonReportedPoc {
    id: string;
    aacCode: string;
    handleAccChange: any;
    onChangeAacCode: any;
    handleAddressSelection: any;
    aacIsInvalid: boolean;
    aacIsValid: boolean;
    aacValidationMessage: any;
    agencyBureau: string;
    pocAddressValues: any;
    pocAddress: any;
    pocEmailValues: any;
    pocEmail: any;
    email: string;
    emailIsValid: boolean;
    emailIsInValid: boolean;
    emailValidationMessage: string;
    city: string;
    selectTag:string;
    cityIsValid: boolean;
    cityIsInvalid: boolean;
    cityValidationMessage:string;
    onChangCity: any;
    handleCityChange: any;
    selectedState: any;
    state:string;
    stateIsInvalid: boolean;
    stateIsValid: boolean;
    stateValidationMessage: string;
    handleEmailSelection: any;
    onChangeEmail: any;
    updateEmail: any;
}


export function NonReportedPoc(
    props: NonReportedPoc
  ) {



function handleAccChange(event: any){
  let aacValue = event.target.value.toUpperCase();
  let validation = aacCodeValidation(aacValue);
  props.handleAccChange(validation);   
}


    return (
    <>
    <div className={"grid-row grid-gap-1"}>
    <div className={"tablet:grid-col-3"}>
   <PPMSInput
    id={`${props.id}-aac-code`}
    name={"aacCode"}
    label={"AAC CODE"}
    onBlur={handleAccChange}
    onChange={(event)=>{
      props.onChangeAacCode(event.target.value)
    }}
    isRequired={true}
    maxLength={6}
    validationMessage={props.aacValidationMessage}
    isInvalid={props.aacIsInvalid}
    isValid={props.aacIsValid}
    isDisabled={false}
    inputType={"text"}
    value={props.aacCode}
  />
  </div>
  <div className={"tablet:grid-col-9"}>
    <PPMSInput
      id={`${props.id}-agency-bureau`}
      name={"agencyBureau"}
      label={"Agency Bureau"}
      onBlur={()=>{}}
      onChange={()=> {}}
      isRequired={true}
      maxLength={6}
      validationMessage={""}
      isInvalid={false}
      isValid={false}
      isDisabled={true}
      inputType={"text"}
      value={props.agencyBureau} 
      />
        </div>  

        </div>
      <PPMSSelect
        placeholderValue={"Address"}
        selectName={`select${props.selectTag}Address`}
        values={props.pocAddressValues}
        onChange={(event) => props.handleAddressSelection(event.target.value)}
        isValid={false}
        isInvalid={false}
        validationMessage={""}
        identifierKey={"pocAddress"}
        identifierValue={"pocAddress"}
        selectedValue={props.pocAddress}
        label={"Select POC Address"}
        isRequired={false}
        />

    <div className={"grid-row grid-gap-4"}>
        <div className={"tablet:grid-col-7"}>
          <PPMSInput
            id={`${props.id}-city`}
            inputType={"text"}
            label={"City"}
            isRequired={true}
            maxLength={28}
            minLength={1}
            isDisabled={false}
            value={props.city}
            onChange={(event: any)=>{props.onChangCity(event.target.value)}}
            onBlur={(event: any) =>props.handleCityChange(event.target.value)}
            isValid={props.cityIsValid}
            isInvalid={props.cityIsInvalid}
            validationMessage={props.cityIsInvalid ? "City is Required.":""}
          />
        </div>
        <div className={"tablet:grid-col-5"}>
          <PPMSState
            id={`${props.id}-state`}
            label={"State"}
            required={true}
            isInvalid={props.stateIsInvalid}
            isValid={props.stateIsValid}
            selectedState={props.state}
            updateLocationState={(value: any)=>props.selectedState(value)}
            disabled={false}
            validationMessage={props.stateIsInvalid ? "State is Required.":"" }
          />
        </div>
      </div>

      <PPMSSelect
        placeholderValue={"POC Email"}
        selectName={`select${props.selectTag}Email`}
        values={props.pocEmailValues}
        onChange={(event) => props.handleEmailSelection(event.target.value)}
        isValid={false}
        isInvalid={false}
        validationMessage={""}
        identifierKey={"pocEmail"}
        identifierValue={"pocEmail"}
        selectedValue={props.pocEmail}
        label={"Select POC Email"}
        isRequired={false}
        />


      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-12"}>
          <PPMSEmail
            id={`${props.id}-email`}
            required={true}
            disabled={false}
            email={props.email}
            emailLabel={"POC Email"}
            isValid={props.emailIsValid}
            isInvalid={props.emailIsInValid}
            validationMessage={props.emailValidationMessage}
            onChangeEmail={(value: any)=>props.onChangeEmail(value)}
            updateEmail={(value: any, validation: any)=>{   
              props.updateEmail(value,validation)}}
            maxLength={50}
          />
        </div>
    </div>


  </>
  );

  }
