import React, {useContext, useEffect} from "react";
import {isFormSubmitted} from "../../../../service/validation.service";
import {PPMSToggleRadio} from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { UserUtils } from "../../../../utils/UserUtils";
import { Role } from "../../../../_redux/_constants/role.constants";
import {SalesUserContext} from "../SalesUserContext";
import { SALES_USER_TYPE_TO_ROLE_MAP } from "./SalesUserTypeState";

export const SALES_USER_TYPES = [
  {id: "PPMS", value: "PPMS Sales User", isSelected: false},
  {id: "FMU", value: "Fleet", isSelected: false},
  {id: "PBS", value: "PBS", isSelected: false},
  {id: "DOI", value: "DOI", isSelected: false}
];


interface SalesUserTypeProps {
  salesUserType?: string,
}

export default function SalesUserType(props: SalesUserTypeProps) {
  const {
    salesUserTypeState, updateSalesUserTypeState, salesUserRolesState, updateSalesUserRolesState,
    salesUserZoneState, updateSalesUserZoneState, salesUserInformationState
  } = useContext(SalesUserContext);

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
  }, [salesUserTypeState]);

  return (
    <React.Fragment>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSToggleRadio
            id={"sales-user-type"}
            name={"salesUserType"}
            options={updateSalesUserType(props?.salesUserType)}
            isInline={true}
            isDisabled={salesUserInformationState?.id !== null}
            isSingleSelect={true}
            isRequired={true}
            validationMessage={"Invalid value"}
            onChange={salesUserTypeChanged}
          />
        </div>
      </div>
    </React.Fragment>
  );

  function updateSalesUserType(salesUserType?: string) {
    const infoSalesUserType = UserUtils.getUserInfo().salesUserType;

    let options = [];

    if(infoSalesUserType =="PPMS") {
      options = ["PPMS"];
    } else if(infoSalesUserType =="FMU"){
      options = ["FMU"];
    }else if(infoSalesUserType =="PBS"){
      options = ["PBS"];
    }else if(infoSalesUserType =="DOI"){
      options = ["DOI"];
    }

    let salesUserTypes = SALES_USER_TYPES.filter((userType) => options.indexOf(userType.id)>-1);

    salesUserTypes.every((user, index) => {
      if(salesUserType && salesUserType===user.id){
        user.isSelected=true;
        return false;
      }else if(index === 0){
        user.isSelected=true;
        return false;
      }
    });
    return salesUserTypes;
  }

    function salesUserTypeChanged(updatedOptions : any[]) {

        const selectedType = updatedOptions.find(option => option.isSelected);

        if(selectedType == null) {
            updateSalesUserTypeState({
                isUserTypeInvalid : true,
                userTypeInvalidErrorMessage:"Please select user type"
            });
        } else {
          updateSalesUserTypeState({
            userType: selectedType.id,
            isUserTypeInvalid: false,
            userTypeInvalidErrorMessage: "",
          });

          let allowedRoles =  SALES_USER_TYPE_TO_ROLE_MAP[selectedType.id];
          let roles = salesUserRolesState.salesUserRolesOptions
          .filter(role => !allowedRoles || allowedRoles.includes(role.value))
          .map(role => ({...role,isSelected:false }));

          if (roles) {
            updateSalesUserRolesState({
              salesUserRolesOptions: [...roles]
            })
          }
          // clearing roles and zones if user type radio buttons are changed from one to another
          updateSalesUserZoneState({
            zoneRegions: [],
            addedZonesList: [],
            isAddAllDisabled: false
          })

          // clearing warrant limit when user type is changed while creating sales user
          updateSalesUserRolesState({
            selectWarrantLimit: "",
            isSFOSelected: false,
          })
        }
    }

    function validate(){
        if(!salesUserTypeState.userType){
            updateSalesUserTypeState({
                isUserTypeInvalid : true,
                userTypeInvalidErrorMessage:"Please Select User Type"
            });
        }
    }

}
