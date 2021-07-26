import React, { ReactElement } from "react";

import { cleanup } from "@testing-library/react";

import {
  PropertyInfoState,
  PropertyInfoStateDefault,
} from "../../../../app/property/create-update-property/property-info-class/PropertyInfoState";
import { PropertyProvider } from "../../../../app/property/create-update-property/PropertyContext";
import PropertyInfoClass from "../../../../app/property/create-update-property/property-info-class/PropertyInfoClass";

import {
  testComponentWithAsynCalls,
  TestField,
} from "../../../../utils/TestUtil";

import { UserApiService } from "../../../../api-kit/user/user-api.service";
import { APOContactsReponse } from "../Constants";
import { propertyTypes } from "../../../../app/property/create-update-property/constants/Constants";

afterEach(cleanup);

const userApiMock: jest.SpyInstance = jest.spyOn(
  UserApiService.prototype,
  "getAPOContactByZip"
);

const propertyInfoFields = (state: PropertyInfoState): TestField[] => [
  {
    id: "propType",
    name: "propType",
    label: "Property Type",
    selectedValue: state.propType,
    values: propertyTypes,
    inputType: "select",
    isRequired: true,
    dependentValidations: [
      {
        event: "blur",
        targetValue: "ES",
        dependentfields: [
          {
            id: "agency-location-code",
            message: PropertyInfoStateDefault.alcValidationMessage,
            inputType: "text",
          },
          {
            id: "amount-to-be-reimbursed",
            message: PropertyInfoStateDefault.afcReqMsg,
            inputType: "text",
          },
        ],
      },
    ],
  },
  //PPDMS-2807 Remove 3 flags from "Property Information" Section.
  {
    id: "agency-location-code",
    name: "agencyLocationCode",
    label: "Agency Location Code",
    inputType: "text",
    maxLength: 8,
    isRequired: state.isAlcRequired,
  },
  {
    id: "amount-to-be-reimbursed",
    name: "amountTobeReimbursed",
    label: "Appropriation/TAS fund to be reimbursed",
    inputType: "text",
    maxLength: 80,
    isRequired:
      state.isAppropriationTasRequired && !state.isAppropriationTasDisabled,
  },
  {
    id: "agency-control-number",
    name: "agencyControlNumber",
    label: "Agency Control Number",
    inputType: "text",
    maxLength: 17,
  },
];

const fields: TestField[] = propertyInfoFields(PropertyInfoStateDefault);

const element: ReactElement = (
  <PropertyProvider>
    <PropertyInfoClass />
  </PropertyProvider>
);

testComponentWithAsynCalls({
  id: "property-info-class",
  element: element,
  fields: fields,
  asyncMock: userApiMock,
  asyncMockImplementation: () => Promise.resolve(APOContactsReponse),
});
