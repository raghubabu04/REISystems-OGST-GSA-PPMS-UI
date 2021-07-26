import { mount, ReactWrapper, HTMLAttributes } from "enzyme";

import React from "react";
import { CommonApiService } from "../api-kit/common/common-api.service";
import IcnClass from "../app/property/create-update-property/icn-class/IcnClass";
import { PropertyProvider } from "../app/property/create-update-property/PropertyContext";

const icnClassComponent: ReactWrapper = mount(
  <PropertyProvider>
    <IcnClass />
  </PropertyProvider>
);

const mock: jest.SpyInstance = jest.spyOn(
  CommonApiService.prototype,
  "getBureau"
);

describe("component: item-control-number", () => {
  //when test, we need to create the update snapshot so the Julian Date matches. Otherwise, it will fail as the test date past the snapshot date.
  it("rendered", () => {
    expect(icnClassComponent).toMatchSnapshot();
  });
  describe(`field: aac-code`, () => {
    const field: ReactWrapper<HTMLAttributes, any> = icnClassComponent.find(
      `input[name="aacCode"]`
    );

    it("rendered field", () => {
      expect(field.length).toEqual(1);
    });

    const node = field.get(0);
    it(`has maxLength 6`, () => {
      expect(node.props.maxLength).toBe(6);
    });
    it("is required", () => {
      expect(node.props.required).toBe(true);
    });
    it(`Basic validation for AAC-Code.`, () => {
      field.simulate("change", { target: { value: "123#678" } });
      const fieldError = icnClassComponent.find(`#errorMessage-aac-code`);
      const node = fieldError.get(0);
      expect(node.props.children).toBe("Special characters are not allowed.");
    });
  });
});
