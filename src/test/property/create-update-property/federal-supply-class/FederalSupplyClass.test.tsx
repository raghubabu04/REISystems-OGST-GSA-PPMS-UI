import React, { ReactElement } from "react";
import { PropertyProvider } from "../../../../app/property/create-update-property/PropertyContext";
import { FederalSupplyClass } from "../../../../app/property/create-update-property/federal-supply-class/FederalSupplyClass";

import { AdditionalInfoClass } from "../../../../app/property/create-update-property/additional-info-class/AdditionalInfoClass";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { FSCCodeReponse } from "../Constants";
import { cleanup } from "@testing-library/react";
import {
  testComponentWithAsynCalls,
  TestField,
} from "../../../../utils/TestUtil";

afterEach(cleanup);

const fscCodeApiMock: jest.SpyInstance = jest.spyOn(
  CommonApiService.prototype,
  "getFSCCodes"
);

const fscCodeSuccessResponseMock = () => Promise.resolve(FSCCodeReponse);

const fields: TestField[] = [
  {
    id: "fscCode",
    label: "Federal Supply Class / National Stock Number",
    inputType: "multiselect",
    isRequired: true,
    dependentValidations: [
      {
        event: "change",
        targetValue: "1510",
        dependentfields: [
          {
            id: "manufacturer",
            message: "Manufacturer is Required.",
            inputType: "text",
          },
        ],
      },
    ],
  },
];

Date.now = jest.fn(() => new Date(Date.UTC(2020, 7, 9, 8)).valueOf());

const element: ReactElement = (
  <PropertyProvider>
    <FederalSupplyClass />
    <AdditionalInfoClass />
  </PropertyProvider>
);

testComponentWithAsynCalls({
  id: "federal-supply-class",
  element: element,
  fields: fields,
  asyncMock: fscCodeApiMock,
  asyncMockImplementation: fscCodeSuccessResponseMock,
});
