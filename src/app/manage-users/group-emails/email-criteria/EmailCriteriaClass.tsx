import React, {useContext, useEffect} from "react";
import {GroupEmailsContext} from "../GroupEmailsContext";
import {PPMSToggleCheckbox, PPMSToggleRadio} from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import {PPMSInput} from "../../../../ui-kit/components/common/input/PPMS-input";
import PPMSMultiSelect from "../../../../ui-kit/components/PPMS-multi-select";
import {CommonApiService} from "../../../../api-kit/common/common-api.service";
import {PPMSSelect} from "../../../../ui-kit/components/common/select/PPMS-select";
import {UserUtils} from "../../../../utils/UserUtils";
import PPMSErrorMessage from "../../../../ui-kit/components/common/form/PPMS-error-message";
import {isFormSubmitted} from "../../../../service/validation.service";
import {UserApiService} from "../../../../api-kit/user/user-api.service";

export const RECIPIENT_TYPE = [
  {id: "federal", value: "Federal", isSelected: false},
  {id: "state", value: "State", isSelected: false},
  {id: "airport", value: "Airport", isSelected: false},
];

export const All_Registered_Active_Bidders = [
  {id: "all", value: "All registered (active) bidders", isSelected: false},
  {id: "location", value: "Registered bidders in a specific city and state", isSelected: false},
  {id: "sales", value: "All active bidders on a sale/lot", isSelected: false},
];
export const Registered_Bidders = [
  {id: "location", value: "Registered bidders in a specific city and state", isSelected: false},
  {id: "sales", value: "All active bidders on a sale/lot", isSelected: false},
];
export const All_Active_Bidders = [
  {id: "sales", value: "All active bidders on a sale/lot", isSelected: false},
];

export interface EmailCriteriaClassProps {
}




export function EmailCriteriaClass(
  props: EmailCriteriaClassProps
) {
  const {emailCriteriaState, updateEmailCriteriaState} = useContext(
    GroupEmailsContext
  );


  useEffect(() => {
    const commonApiService = new CommonApiService();
    if(isUserSmApo()){
      commonApiService
        .getAllAgencyBureaus()
        .then((resp) => {
          let  agencyOptions = resp.data.map((item) => {
            return {
              agencyBureau: item.code,
              id: item.code,
              isSelected: false,
            };
          });
          updateEmailCriteriaState({
            agencyOptions:agencyOptions
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else if(isUserNuo()){
      const userApiService = new UserApiService();
      userApiService.getAgencyBureauCodesForNUO().then(resp => {
        let  agencyOptions = resp.data.map((item) => {
          return {
            agencyBureau: item,
            id: item,
            isSelected: false,
          };
        });
        updateEmailCriteriaState({
          agencyOptions:agencyOptions
        });
      })
    }

    commonApiService
      .getStateList()
      .then((response) => {
        let stateList = response.data.map((state) => {
         return {
          stateName: state.stateName,
          id:state.stateCode,
          isSelected: false,
        };
        });
        updateEmailCriteriaState({
          stateOptions:stateList
         });
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
  }, [emailCriteriaState]);

  function validateForm() {
    if(UserUtils.getUserTypeFromToken() === 'SLS'){
      validateBidderType(emailCriteriaState.bidderType)
    }
    validateState(emailCriteriaState.bidderStateCode)
    validateSaleAndLotNumber(emailCriteriaState.saleNumber)
  }

  function validateSaleAndLotNumber(saleNumber: string) {
    if(emailCriteriaState.bidderType === 'sales'){
      if(emailCriteriaState.saleNumber?.trim()?.length === 0){
        updateEmailCriteriaState({
          isSaleNumberInvalid: true,
          saleNumberInvalidMessage: "Sale Number is required"
        })
      }
    }
  }

  function validateState(bidderStateCode: string) {
    if(emailCriteriaState.bidderType === 'location'){
      if(emailCriteriaState.bidderStateCode?.length ===0){
        updateEmailCriteriaState({
          isStateInvalid: true,
          stateInvalidMessage: "Please select a state"
        })
      }
    }
  }

  function validateBidderType(bidderType: string) {
    if(emailCriteriaState.bidderType.trim().length === 0){
      updateEmailCriteriaState({
        isEmailCriteriaInvalid: true,
        isEmailCriteriaInvalidMessage: "Atleast one email criteria needs to be selected"
      })
    }
  }

  function isUserSmApo(): boolean {
    //AC is the Permission for APO
    const roles = ["SM", "AC"];
    const userPermissions: string[] = UserUtils.getUserPermissions();
    return roles.some((i) => userPermissions.includes(i));
  }

  function isUserNuo(): boolean {
    //AC is the Permission for APO
    const roles = ["NU"];
    const userPermissions: string[] = UserUtils.getUserPermissions();
    return roles.some((i) => userPermissions.includes(i));
  }


  let locationDiv=null;
  if(emailCriteriaState.bidderType==='location'){
    locationDiv=(
      <div className={"grid-row grid-gap-4"}>
        <div className="grid-col-6">
          <PPMSSelect
            id={"state"}
            title={"State"}
            placeholderValue={"Select State"}
            label={"State"}
            identifierKey={"id"}
            identifierValue={"stateName"}
            values={emailCriteriaState.stateOptions}
            isRequired={emailCriteriaState?.bidderType === 'location'}
            onChange={(event) => handleChange(event.target)}
            isInvalid={emailCriteriaState.isStateInvalid}
            validationMessage={emailCriteriaState.stateInvalidMessage}
          />
        </div>
        <div className="grid-col-6">
            <PPMSInput
              id={"city"}
              name={"city"}
              inputType={"text"}
              isDisabled={emailCriteriaState.bidderStateCode?.trim()?.length === 0}
              label={"City"}
              isRequired={false}
              onChange={changeCity}
              value={emailCriteriaState.bidderCity}
              //isInvalid={emailCriteriaState.SubjectLineInvalid}
              //isValid={!emailContentState.SubjectLineInvalid}
              //validationMessage={emailContentState.SubjectLineValidationMsg}
            />
          </div>
         </div>
      );
  }

  let salesDiv=null;
  if(emailCriteriaState.bidderType==='sales'){
    salesDiv= (<div className={"grid-row grid-gap-4"}>
      <div className="grid-col-6">
          <PPMSInput
            id={"saleNumber"}
            name={"saleNumber"}
            inputType={"text"}
            isDisabled={false}
            label={"Sale Number"}
            isRequired={emailCriteriaState.bidderType === 'sales'}
            onChange={changeSaleNumber}
            value={emailCriteriaState.saleNumber}
            isInvalid={emailCriteriaState.isSaleNumberInvalid}
            isValid={!emailCriteriaState.isSaleNumberInvalid}
            validationMessage={emailCriteriaState.saleNumberInvalidMessage}
          />
        </div>
        <div className="grid-col-6">
          <PPMSInput
            id={"lotNumber"}
            name={"lotNumber"}
            inputType={"text"}
            isDisabled={emailCriteriaState.saleNumber?.trim()?.length === 0}
            label={"Lot Number"}
            isRequired={true}
            onChange={changeLotNumber}
            value={emailCriteriaState.lotNumber}
            //isInvalid={emailCriteriaState.SubjectLineInvalid}
            //isValid={!emailContentState.SubjectLineInvalid}
            //validationMessage={emailContentState.SubjectLineValidationMsg}
          />
        </div>
       </div>
       );
  }

  let loggedUser=null;

  if(UserUtils.getUserTypeFromToken() == 'SLS' && UserUtils.getUserRoles().includes("CO")){
    loggedUser=(<div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSToggleRadio
            id={"allActiveBidders"}
            name={"All Registered Active Bidders"}
            label={""}
            options={All_Registered_Active_Bidders}
            isInline={true}
            isDisabled={false}
            isSingleSelect={true}
            isRequired={true}
            // isInvalid={emailCriteriaState.isEmailCriteriaInvalid}
            validationMessage={emailCriteriaState.isEmailCriteriaInvalidMessage}
            onChange={changeBidderType}
          />
        </div>
      </div>
    );
  } else if ((UserUtils.getUserTypeFromToken() == 'SLS' && UserUtils.getUserRoles().includes("CLO")) || UserUtils.getUserRoles().includes("SG")) {
    loggedUser = (<div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSToggleRadio
            id={"allActiveBidders"}
            name={"Register Bidders"}
            label={""}
            options={Registered_Bidders}
            isInline={true}
            isDisabled={false}
            isSingleSelect={true}
            isRequired={true}
            //isInvalid={emailCriteriaState.isEmailCriteriaInvalid}
            validationMessage={emailCriteriaState.isEmailCriteriaInvalidMessage}
            onChange={changeBidderType}
          />
        </div>
      </div>
    );
  } else if (UserUtils.getUserTypeFromToken() === 'SLS' || UserUtils.getUserRoles().includes("SCO") || UserUtils.getUserTypeFromToken() === 'SMS') {
    loggedUser = (<div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSToggleRadio
            id={"allActiveBidders"}
            name={"All Active Bidders"}
            label={""}
            options={All_Active_Bidders}
            isInline={true}
            isDisabled={false}
            isSingleSelect={true}
            isRequired={true}
            // isInvalid={emailCriteriaState.isEmailCriteriaInvalid}
            validationMessage={emailCriteriaState.isEmailCriteriaInvalidMessage}
            onChange={changeBidderType}
          />
        </div>
      </div>
      );
  }
  let undCriteria = null;
  if(UserUtils.getUserTypeFromToken() === "UND"){
    if(isUserSmApo()){
      undCriteria = (
        <div className={"grid-row grid-gap-4"}>
          <div className="grid-col-6">
            <PPMSMultiSelect
              avoidHighlightFirstOption={true}
              caseSensitiveSearch={false}
              hint={"(Optional)"}
              alphaNumericOrDigitSearch={true}
              isPivotSorted={true}
              emptyRecordMsg={"---- No Agency Bureau Found ----"}
              chipVariant={"primary"}
              label={"Agency / Bureau"}
              id={"agencyBureau"}
              options={emailCriteriaState.agencyOptions}
              isRequired={false}
              placeholder={emailCriteriaState.agency.length > 0 ? "" : "Select Agency Bureau"}
              displayValue={"agencyBureau"}
              selectedValues={emailCriteriaState.agency}
              showCheckbox={false}
              isObject={true}
              onSelect={handleAgencyBureau}
              onRemove={handleAgencyBureau}
              singleSelect={false}
              singleSelectAndTypeSearch={true}
              closeOnSelect={true}
              isInvalid={false}
              isValid={true}
            />
          </div>
          <div className="grid-col-6">
            <PPMSMultiSelect
              avoidHighlightFirstOption={true}
              caseSensitiveSearch={false}
              hint={"(Optional)"}
              alphaNumericOrDigitSearch={true}
              isPivotSorted={true}
              emptyRecordMsg={"---- No state found ----"}
              chipVariant={"primary"}
              label={"State"}
              id={"state"}
              options={emailCriteriaState.stateOptions}
              isRequired={false}
              placeholder={emailCriteriaState.state.length > 0 ? "" : "State"}
              displayValue={"stateName"}
              selectedValues={emailCriteriaState.state}
              showCheckbox={false}
              isObject={true}
              onSelect={handleState}
              onRemove={handleState}
              singleSelect={false}
              singleSelectAndTypeSearch={true}
              closeOnSelect={true}
              isInvalid={false}
              isValid={true}
            />
          </div>
          <br></br>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <PPMSToggleCheckbox
                id={"recipientType"}
                name={"recipientType"}
                label={"Recipient Type"}
                options={RECIPIENT_TYPE}
                className={""}
                validationMessage={""}
                isInline={true}
                isDisabled={false}
                isSingleSelect={false}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>
        </div>
      )
    } else if(isUserNuo()){
      undCriteria = (
        <div className={"grid-row grid-gap-4"}>
          <div className="grid-col-6">
            <PPMSMultiSelect
              avoidHighlightFirstOption={true}
              caseSensitiveSearch={false}
              hint={"(Optional)"}
              alphaNumericOrDigitSearch={true}
              isPivotSorted={true}
              emptyRecordMsg={"---- No Agency Bureau Found ----"}
              chipVariant={"primary"}
              label={"Agency / Bureau"}
              id={"agencyBureau"}
              options={emailCriteriaState.agencyOptions}
              isRequired={false}
              placeholder={emailCriteriaState.agency.length > 0 ? "" : "Select Agency Bureau"}
              displayValue={"agencyBureau"}
              selectedValues={emailCriteriaState.agency}
              showCheckbox={false}
              isObject={true}
              onSelect={handleAgencyBureau}
              onRemove={handleAgencyBureau}
              singleSelect={false}
              singleSelectAndTypeSearch={true}
              closeOnSelect={true}
              isInvalid={false}
              isValid={true}
            />
          </div>
          <div className="grid-col-6">
            <PPMSMultiSelect
              avoidHighlightFirstOption={true}
              caseSensitiveSearch={false}
              hint={"(Optional)"}
              alphaNumericOrDigitSearch={true}
              isPivotSorted={true}
              emptyRecordMsg={"---- No state found ----"}
              chipVariant={"primary"}
              label={"State"}
              id={"state"}
              options={emailCriteriaState.stateOptions}
              isRequired={false}
              placeholder={emailCriteriaState.state.length > 0 ? "" : "State"}
              displayValue={"stateName"}
              selectedValues={emailCriteriaState.state}
              showCheckbox={false}
              isObject={true}
              onSelect={handleState}
              onRemove={handleState}
              singleSelect={false}
              singleSelectAndTypeSearch={true}
              closeOnSelect={true}
              isInvalid={false}
              isValid={true}
            />
          </div>
        </div>
      )
    }

  }
  let pageDom = null;
  if(emailCriteriaState.isEmailCriteriaInvalid){
    pageDom = (
      <>
      <div className={"usa-form-group--error"}>
        {undCriteria}
        {loggedUser}
        {locationDiv}
        {salesDiv}
      </div>
      <PPMSErrorMessage>{emailCriteriaState.isEmailCriteriaInvalidMessage}</PPMSErrorMessage>
      </>
    )
  } else {
    pageDom = (
      <>
        {undCriteria}
        {loggedUser}
        {locationDiv}
        {salesDiv}
        </>
    )
  }

  return (
    <>
      {pageDom}
    </>
  );

  function handleAgencyBureau(selectedAgencyBureaus) {
    updateEmailCriteriaState({
      agency: selectedAgencyBureaus,
    });
  }

  function handleState(selectedValues) {
    updateEmailCriteriaState({
      state: selectedValues,
    });
  }

  function handleCheckboxChange(values: any) {
    let selectedValue = values.filter((item) => {
      return item.isSelected;
    });
    updateEmailCriteriaState({
      recipientType: selectedValue,
    });
  }

  function changeBidderType(val) {
    updateEmailCriteriaState({
      bidderType: val.find(a => a.isSelected)?.id,
      isEmailCriteriaInvalid: false,
      isEmailCriteriaInvalidMessage:""
    });
  }

  function changeCity(event) {
    updateEmailCriteriaState({
      bidderCity: event.target.value,
    });
  }


  function handleChange(e) {
    updateEmailCriteriaState({
      bidderStateCode: e.value,
    });
    if(e.value?.length > 0){
      updateEmailCriteriaState({
        isStateInvalid: false,
        stateInvalidMessage: ""
      });
    } else {
      updateEmailCriteriaState({
        isStateInvalid: true,
        stateInvalidMessage: "Please select a state"
      });
    }
  }

  function changeSaleNumber(event) {
    let value  = event?.target?.value;
    updateEmailCriteriaState({
      saleNumber: value,
    });
    if(emailCriteriaState.bidderType === 'sales'){
      if(value?.trim()?.length === 0){
        updateEmailCriteriaState({
          isSaleNumberInvalid: true,
          saleNumberInvalidMessage: "Sale Number is required"
        })
      } else {
        updateEmailCriteriaState({
          isSaleNumberInvalid: false,
          saleNumberInvalidMessage: ""
        })
      }
    }
  }

  function changeLotNumber(event) {
    updateEmailCriteriaState({
      lotNumber: event.target.value,
    });
  }
}
