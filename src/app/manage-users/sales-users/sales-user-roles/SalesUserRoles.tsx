import React, {useContext, useEffect} from "react";
import {isFormSubmitted} from "../../../../service/validation.service";
import {PPMSToggleCheckbox} from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import {SalesUserContext} from "../SalesUserContext";
import {warrantLimitOptions} from "../constants/Constants";
import {PPMSSelect} from "../../../../ui-kit/components/common/select/PPMS-select";
import {validateWarrantLimit} from "../validations/AddEditSalesUserValidations";
import { UserUtils } from "../../../../utils/UserUtils";

interface SalesUserRolesProps {
}

export default function SalesUserRoles(props: SalesUserRolesProps) {
  const {salesUserRolesState, updateSalesUserRolesState, salesUserTypeState} = useContext(SalesUserContext);

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validate();
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [salesUserRolesState]);

  let sfoSelected;
  if (salesUserRolesState.isSFOSelected) {
    sfoSelected = <>
      <div className="grid-row">
        <div className="grid-col-6">
          <PPMSSelect
            identifierKey={"id"}
            identifierValue={"value"}
            id={"warrant-limit"}
            name={"warrant-limit"}
            selectName={"warrant-limit"}
            values={warrantLimitOptions}
            label={""}
            placeholderValue={"select warrant limit"}
            onChange={handleWarrantLimitOnChange}
            selectedValue={salesUserRolesState.selectWarrantLimit}
            validationMessage={salesUserRolesState.selectWarrantLimitValidationMessage}
            isInvalid={salesUserRolesState.selectWarrantLimitIsInvalid}
            isRequired={true}
          />
        </div>
      </div>
    </>
  }
  //let userRoleOptions=salesUserRolesState.salesUserRolesOptions;

  return (
    <React.Fragment>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSToggleCheckbox
            isRequired={true}
            id={"salesUserRoles"}
            options={salesUserRolesState.salesUserRolesOptions}
            isInline={false}
            isDisabled={false}
            name={"salesUserRoles"}
            className={"salesUserRoles"}
            label={""}
            validationMessage={salesUserRolesState.userRoleValidationMessage}
            isSingleSelect={false}
            onChange={handleRolesChange}
          />
          {sfoSelected}
        </div>
      </div>
    </React.Fragment>
  );

  function handleRolesChange(event) {
    let selectedRoles = [];
    let isSFOSelected = false;
    event.forEach((role) => {
      if (role.isSelected) {
        selectedRoles.push(role.id);
        if (role.id === "SCO") {
          isSFOSelected = true;
        }
      }
    });

    updateSalesUserRolesState({
      selectedRolesList: selectedRoles,
      isSFOSelected: isSFOSelected,
    });
    if(!salesUserRolesState.isSFOSelected){
      updateSalesUserRolesState({
        selectWarrantLimitIsInvalid: false,
        selectWarrantLimitValidationMessage: "",
        selectWarrantLimit:""
      });
    }
  };

  function handleWarrantLimitOnChange(event) {
    let warrantLimit = event.target.value;
    let errorMessage = validateWarrantLimit(event.target.value);
    if(salesUserRolesState.isSFOSelected){
      if (errorMessage) {
        updateSalesUserRolesState({
          selectWarrantLimitIsInvalid: errorMessage.isInvalid,
          selectWarrantLimitValidationMessage: errorMessage.validationError,
        });
      }
    }
    updateSalesUserRolesState({
      selectWarrantLimit: warrantLimit,
    });
  }

  function validate() {
    if (salesUserRolesState.selectedRolesList.length === 0) {
      updateSalesUserRolesState({
        isUserRoleIsInvalid: true,
        userRoleValidationMessage: "Select atleast one user role."
      });
    }
    if (salesUserRolesState.isSFOSelected) {
      if(salesUserRolesState.selectWarrantLimit.length === 0){
      updateSalesUserRolesState({
        selectWarrantLimitIsInvalid: true,
        selectWarrantLimitValidationMessage: "Warrant Limit must be selected."
      });
      }
    }
  }


}
