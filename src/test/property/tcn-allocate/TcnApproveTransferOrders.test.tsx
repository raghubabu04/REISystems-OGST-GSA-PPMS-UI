import { act } from "@testing-library/react";
import React from "react";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import {
  AllocationsApproveTransferOrdersStateMocked,
  ApproveTransferOrdersResponseMocked,
} from "./Constants";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import AllocationsApproveTransferOrders from "../../../app/property/allocate-property/AllocationsApproveTransferOrders";
import { mount } from "enzyme";

const mockStore = configureMockStore();
const store = mockStore({
  authentication: {
    roles: [],
  },
});

jest.mock("../../../api-kit/property/property-api-service");

const setHookState = (newState: {}) =>
  jest.fn().mockImplementation((state: {}) => [newState, (newState: {}) => {}]);

describe("component: tcnApproveTransferOrders", () => {
  let allocationsApproveTransferOrderWrapper;
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, "useState");
  const useStateMock: any = (initState: any) => [initState, setState];

  beforeEach(() => {
    allocationsApproveTransferOrderWrapper = mount(
      <Provider store={store}>
        <AllocationsApproveTransferOrders workflow="APPROVE TRANSFER ORDERS" />
      </Provider>
    );
    PropertyApiService.mockImplementation(() => ({
      getApprovals: () =>
        Promise.resolve({ data: ApproveTransferOrdersResponseMocked }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("rendered: Checking Header Text", () => {
    act(() => {
      jest.spyOn(React, "useState").mockImplementation(useStateMock);
    });
    expect(
      allocationsApproveTransferOrderWrapper
        .find(".item-search-result-header")
        .exists()
    ).toBe(true);
    expect(
      allocationsApproveTransferOrderWrapper
        .find(".item-search-result-header")
        .exists()
    ).toBeTruthy;
  });

  it("rendered: Checking approve transfer orders items are all present", () => {
    expect(setState).toHaveBeenCalled();

    act(() => {
      jest
        .spyOn(React, "useState")
        .mockImplementationOnce(() =>
          useStateMock(!AllocationsApproveTransferOrdersStateMocked.isLoading)
        )
        .mockImplementationOnce(() =>
          useStateMock(AllocationsApproveTransferOrdersStateMocked.tcnItems)
        )
        .mockImplementationOnce(() =>
          useStateMock(AllocationsApproveTransferOrdersStateMocked.error)
        )
        .mockImplementationOnce(() =>
          useStateMock(AllocationsApproveTransferOrdersStateMocked.isLoading)
        )
        .mockImplementationOnce(() =>
          useStateMock(AllocationsApproveTransferOrdersStateMocked.currentPage)
        )
        .mockImplementationOnce(() =>
          useStateMock(AllocationsApproveTransferOrdersStateMocked.totalRows)
        );
    });

    requestAnimationFrame(() => {
      ApproveTransferOrdersResponseMocked.allocationDTOS.forEach((element) => {
        console.log(allocationsApproveTransferOrderWrapper.debug());
        const ppmdCard = allocationsApproveTransferOrderWrapper.find(
          `.ppms-card-group[data-testid=${element.transferControlNumber}]`
        );
        expect(ppmdCard.length).toEqual(1);
      });
    });
  });
});
