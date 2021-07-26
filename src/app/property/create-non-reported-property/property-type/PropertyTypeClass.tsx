import React, { useContext } from "react";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { NonNonReportedTransferContext } from "../NonReportedTransferContext";
import { propertyActionCodes, propertyTypeConst, propertyTypeValues, transferActionCodeOptions } from "../constants/Constants";
import { validatePropertyType } from "../validations/NonReportedTransferValidations";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";

export interface PropertyTypeProps {}

export function PropertyTypeClass(
  props: PropertyTypeProps
) {
  const { propertyTypeState,updatePropertyTypeState } = useContext(NonNonReportedTransferContext);

  function handlePropertyTypeChange(event) {
    const selectValue = event.target.value;
    let errorMessage = validatePropertyType(event.target.value);
    if (errorMessage) {
      updatePropertyTypeState({
        propertyTypeIsInvalid: errorMessage.isInvalid,
        propertyTypeValidationMessage: errorMessage.validationError,
      });
    }
    
    updatePropertyTypeState({
      propertyType: selectValue,
    });

    if(selectValue === propertyTypeConst.airportDonations) 
    { 
      updatePropertyTypeState({propertyActionCode: propertyActionCodes.publicReports}) 
    }

    if(selectValue === propertyTypeConst.donations) 
    { 
      updatePropertyTypeState({propertyActionCode: propertyActionCodes.surplusProperty}) 
    }

  }


  function handleTransferActionCode(event: any) {
    event.forEach((e) => {
      if (e.isSelected) {
        updatePropertyTypeState({
          propertyActionCode: e.value
        });
      }
    });
  }



  return (
    <>
     <div className="grid-row">
        <div className="grid-col-6">
          <PPMSSelect
            selectName={"property-type-values"}
            identifierKey={"id"}
            identifierValue={"value"}
            id={"property-type-values"}
            name={"property-type-values"}
            values={propertyTypeValues}
            label={"Property Type"}
            isRequired={true}
            onChange={handlePropertyTypeChange}
            selectedValue={propertyTypeState.propertyType}
            validationMessage={
              propertyTypeState.propertyTypeValidationMessage
            }
            isInvalid={propertyTypeState.propertyTypeIsInvalid}
          />
        </div>
      </div>
    
    {(propertyTypeState.propertyType === propertyTypeConst.airportDonations) 
    || (propertyTypeState.propertyType === propertyTypeConst.donations) ? 
    (<> 
     <div className={"grid-col"}>
    <PPMSInput 
      id={"property-action-code"}
      label={"Property Action Code"}
      isDisabled={true}
      inputType={"text"}
      isRequired={true}
      isInvalid={false}
      isValid={false}
      value={propertyTypeState.propertyActionCode}

    />
    </div>
    </>) : (<>
      <PPMSToggleRadio
        id={"transfer-action-code"}
        isInline={false}
        name={"transferActionCode"}
        isRequired={true}
        isDisabled={false}
        options={transferActionCodeOptions}
        validationMessage={""}
        onChange={handleTransferActionCode}
        isSingleSelect={true}
        label={"Property Action Code"}                      
     />
    </>)
    }

    </>
  );
}
