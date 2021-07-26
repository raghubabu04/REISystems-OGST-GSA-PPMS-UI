import React, { ReactElement } from "react";
import AgencyInfoClass from "../../../../app/property/create-update-property/agency-info-class/AgencyInfoClass";
import { agencyInfoFields } from "../../../../app/property/create-update-property/agency-info-class/AgencyInfoFields";
import { AgencyInfoStateDefault } from "../../../../app/property/create-update-property/agency-info-class/AgencyInfoState";
import { PropertyProvider } from "../../../../app/property/create-update-property/PropertyContext";
import { testComponent, TestField } from "../../../../utils/TestUtil";

const fields: TestField[] = agencyInfoFields(AgencyInfoStateDefault);

const element: ReactElement = (
  <PropertyProvider>
    <AgencyInfoClass />
  </PropertyProvider>
);

testComponent({
  id: "agency-info-class",
  element: element,
  fields: fields,
});
