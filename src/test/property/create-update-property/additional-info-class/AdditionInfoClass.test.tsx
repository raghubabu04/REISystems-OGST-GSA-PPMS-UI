import React from "react";
import { AdditionalInfoClass } from "../../../../app/property/create-update-property/additional-info-class/AdditionalInfoClass";
import { AgencyInfoStateDefault } from "../../../../app/property/create-update-property/agency-info-class/AgencyInfoState";

import { PropertyProvider } from "../../../../app/property/create-update-property/PropertyContext";
import { PropertyReportStateDefault } from "../../../../app/property/create-update-property/PropertyReportState";

import { UserUtils } from "../../../../utils/UserUtils";
import { when } from "jest-when";

import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { HTMLAttributes, mount, ReactWrapper } from "enzyme";
import {
  checkButtonIsDisabled,
  checkButtonIsEnabled,
} from "../../../../utils/TestUtil";
import { AdditionalInfoStateDefault } from "../../../../app/property/create-update-property/additional-info-class/AdditionalInfoState";
import { FederalSupplyClass } from "../../../../app/property/create-update-property/federal-supply-class/FederalSupplyClass";

PropertyReportStateDefault.isSubmitted = true;

AgencyInfoStateDefault.isInternalAgency = true;

const mockStore = configureMockStore();
const store = mockStore({});

const userPermissionMock: jest.SpyInstance = jest.spyOn(
  UserUtils,
  "hasPermission"
);

when(userPermissionMock)
  .calledWith("SM")
  .mockReturnValue(true)
  .calledWith("NU")
  .mockReturnValue(true)
  .calledWith("AC")
  .mockReturnValue(true);

const additionalInfoClass = mount(
  <Provider store={store}>
    <PropertyProvider>
      <AdditionalInfoClass propertyId={1} />
    </PropertyProvider>
  </Provider>
);

describe("component: additional-info-class", () => {
  it("NUO/SM should be able to update ERD", () => {
    checkButtonIsEnabled(additionalInfoClass, "requestExcessReleaseDateChange");
  });
});

describe("component: additional-info-class", () => {
  it("APO/SM should be able to update SRD", () => {
    checkButtonIsEnabled(
      additionalInfoClass,
      "requestSurplusReleaseDateChange"
    );
  });
});

//PPDMS-2368
describe("component: additional-info-class", () => {
  AdditionalInfoStateDefault.excessReleaseDate = new Date(Date.now() - 864e5);

  const userTypeMock: jest.SpyInstance = jest.spyOn(UserUtils, "getUserType");

  it("For SM, Excess Release Date/Request Change Button enabled even if ERD past due", () => {
    when(userTypeMock).calledWith().mockReturnValue("SM");

    const additionalInfoClassPastDueSM = mount(
      <Provider store={store}>
        <PropertyProvider>
          <AdditionalInfoClass propertyId={1} />
        </PropertyProvider>
      </Provider>
    );
    checkButtonIsEnabled(
      additionalInfoClassPastDueSM,
      "requestExcessReleaseDateChange"
    );
  });

  it("For NUO, Excess Release Date/Request Change Button disabled if ERD past due", () => {
    when(userTypeMock).calledWith().mockReturnValue("NUO");

    const additionalInfoClassPastDueNU = mount(
      <Provider store={store}>
        <PropertyProvider>
          <AdditionalInfoClass propertyId={1} />
        </PropertyProvider>
      </Provider>
    );
    checkButtonIsDisabled(
      additionalInfoClassPastDueNU,
      "requestExcessReleaseDateChange"
    );
  });
});

//PPDMS-2554 - Demilitarization Validation

const componentsMounted: ReactWrapper = mount(
  <PropertyProvider>
    <FederalSupplyClass />
    <AdditionalInfoClass />
  </PropertyProvider>
);
describe(`field: Demilitarization`, () => {
  const demilitarizationField: ReactWrapper<
    HTMLAttributes,
    any
  > = componentsMounted.find(`select[id="demilitarization"]`);
  const FASCField: ReactWrapper<HTMLAttributes, any> = componentsMounted.find(
    `select[id="federal-sales-center"]`
  );

  //When Demilitarization requires waiver it should show Errors
  it(`When Waiver is required`, () => {
    demilitarizationField.simulate("change", { target: { value: "D" } });
    const fieldError = componentsMounted.find(
      `span[id="errorMessage-undefined"]`
    );
    const node = fieldError.get(0);
    expect(node.props.children).toBe(
      "Select Approved Waiver option of Federal Asset Sales Center for Demilitarization code that you have selected."
    );
  });
  //When Demilitarization does not required waiver it should show no Errors
  it(`When Waiver is not required`, () => {
    demilitarizationField.simulate("change", { target: { value: "A" } });

    expect(
      componentsMounted.contains(`span[id="errorMessage-undefined"]`)
    ).toBe(false);
  });

  //When Demilitarization is required and wavier is selected in FASCField it should show no Errors
  it(`When Demilitarization is required but has wavier`, () => {
    demilitarizationField.simulate("change", { target: { value: "D" } });
    FASCField.simulate("change", { target: { value: "N" } });
    expect(
      componentsMounted.contains(`span[id="errorMessage-undefined"]`)
    ).toBe(false);
  });
});
