import React, { ReactElement } from "react";

import { cleanup } from "@testing-library/react";

import IcnClass from "../../../../app/property/create-update-property/icn-class/IcnClass";

import { PropertyProvider } from "../../../../app/property/create-update-property/PropertyContext";

import {
  testComponent,
  TestField,
  BasicValidation,
  AsyncValidation,
} from "../../../../utils/TestUtil";

import { CommonApiService } from "../../../../api-kit/common/common-api.service";

afterEach(cleanup);

const fieldValidations: BasicValidation[] = [
  {
    event: "change",
    targetValue: "123#678",
    message: "Special characters are not allowed.",
  },
];

const mock: jest.SpyInstance = jest.spyOn(
  CommonApiService.prototype,
  "getBureau"
);

const asyncValidations: AsyncValidation[] = [
  {
    event: "change",
    targetValue: "123456",
    message:
      "AAC Not Found in Customer Address File, Please contact your Agency AAC Point of Contact to update",
    asyncMock: mock,
    asyncMockImplementation: () =>
      Promise.reject(new Error("Unable to retrieve agency bureau")),
  },
];

const fields: TestField[] = [
  {
    id: "aac-code",
    name: "aacCode",
    label: "AAC CODE",
    inputType: "text",
    maxLength: 6,
    isRequired: true,
    basicValidations: fieldValidations,
    asyncValidations: asyncValidations,
  },
  {
    id: "julian-date",
    name: "julianDate",
    label: "Julian date",
    inputType: "text",
    maxLength: 4,
    isRequired: true,
  },
  {
    id: "serial-number",
    name: "serialNum",
    label: "Serial Number",
    inputType: "text",
    maxLength: 4,
    isRequired: true,
  },
  {
    id: "suffix",
    name: "suffix",
    label: "Suffix",
    inputType: "text",
    maxLength: 1,
    isRequired: false,
  },
];

const element: ReactElement = (
  <PropertyProvider>
    <IcnClass />
  </PropertyProvider>
);

testComponent({
  id: "icn-class",
  element: element,
  fields: fields,
});
