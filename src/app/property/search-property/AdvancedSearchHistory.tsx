import React, { StrictMode, useEffect } from "react";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { PPMSLabel } from "../../../ui-kit/components/common/form/PPMS-label";
import PPMSMultiSelect from "../../../ui-kit/components/PPMS-multi-select";
import { historyPropertyFilter } from "../create-update-property/constants/Constants";

interface AdvacnedSearchHistoryProps{
    historySelectedValue?:string;
    handleHistoryPropertyType?:any;
}


 export function AdvancedSearchHistory(props: AdvacnedSearchHistoryProps){

 function handleHistoryPropertyType(event) {
    props.handleHistoryPropertyType(event);
  }

return(
<div className={"grid-row grid-gap-4 margin-top-2"}>
        <div className={"tablet:grid-col-6"}>
          <div className={"flat-widget ppms-widget"}>
            <div
              className={
                "usa-card__body non-tcn-main-row card-header-height widget-header"
              }
            >
              History Status Records
            </div>
            <div className={"usa-card__body"}>
              <div className={"grid-row grid-gap-4"}>
                <div className="advance-search-label grid-col-12">
                  <PPMSLabel htmlFor={"history status"}>
                  History Status
                  </PPMSLabel>
                </div>
                <div className="p-0 grid-col-12">
                <PPMSSelect
                      id={"filter-by-property"}
                      selectName={"filterProperty"}
                      values={historyPropertyFilter}
                      selectedValue={props.historySelectedValue}
                      onChange={handleHistoryPropertyType}
                      isValid={false}
                      isInvalid={false}
                      validationMessage={""}
                      identifierKey={"id"}
                      identifierValue={"value"}
                      isRequired={false}
                      selectClass={"inventory"}
                    />
                  </div>
                </div>
              </div>
              {/**End Body */}
            </div>
        </div>
    </div>
);

}
