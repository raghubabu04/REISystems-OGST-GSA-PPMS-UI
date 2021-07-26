import React, { useContext, useMemo } from "react";
import { agencyInfoFields } from "./AgencyInfoFields";
import { PropertyContext } from "../PropertyContext";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";

function AgencyInfoClass() {
  const { agencyInfoState } = useContext(PropertyContext);

  //get fields for this class
  const fields = agencyInfoFields(agencyInfoState);

  //use conditional rendering ti dynamically render fields
  return useMemo(() => {
    return (
      <React.Fragment>
        {fields.map((f, id) => {
          const component = f.inputType
            ? React.createElement(PPMSInput, f)
            : React.createElement(PPMSSelect, f);
          return (
            <div
              className={"grid-row grid-gap-4"}
              key={`row-${f.id ? f.id : id}`}
            >
              <div className={"grid-col"}>{component}</div>
            </div>
          );
        })}
      </React.Fragment>
    );
  }, [agencyInfoState]);
}

export default AgencyInfoClass;
