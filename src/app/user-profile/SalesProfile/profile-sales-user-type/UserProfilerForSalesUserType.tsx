import React, { useContext, useEffect } from "react";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { UserProfileSaleContext } from "../UserProfileForSalesContext";

interface UserProfileForSalesUserTypeProps { 
}

export default function UserProfileForSalesUserType(props: UserProfileForSalesUserTypeProps) {
    const {salesProfileUserTypeState, updateSalesProfileUserTypeState} = useContext(UserProfileSaleContext);

    return (
        <React.Fragment>
            <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}> 
                    {salesProfileUserTypeState.userType}
                </div>
            </div>
        </React.Fragment>
    ); 
}
 
