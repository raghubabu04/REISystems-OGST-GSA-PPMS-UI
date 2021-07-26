import React, {useContext, useEffect} from "react";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSToggleCheckbox } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { warrantLimitOptions } from "../../../manage-users/sales-users/constants/Constants";
import { validateWarrantLimit } from "../profile-sales-validations/UserProfileForAddEditSalesUserValidations";
import { UserProfileSaleContext } from "../UserProfileForSalesContext";


interface UserProfileForSalesUserRolesProps {
}

export default function UserProfileForSalesUserRoles(props: UserProfileForSalesUserRolesProps) {
    const {salesProfileUserRolesState, updateSalesProfileUserRolesState} = useContext(UserProfileSaleContext);
     
    const userRoles = salesProfileUserRolesState.userRoles?.map((ur, i) => 
     <div key={i}>{ur.roleDescription}</div>
    );
    
    let warrantLimit = null; 
    if(salesProfileUserRolesState.warrantLimit) {
      warrantLimit = ( <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  {"Warrant Limit-"+salesProfileUserRolesState.warrantLimit}
                </div>
              </div>);
    } 

    return (     
        <React.Fragment>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              {userRoles}
            </div>
          </div>
          {warrantLimit}
        </React.Fragment>
      );  
}