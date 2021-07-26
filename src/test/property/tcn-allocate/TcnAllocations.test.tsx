import { render, waitFor } from "@testing-library/react";
import React from "react";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { AllocationsResponseMocked } from "./Constants";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import AllocationsApproveTransferOrders from "../../../app/property/allocate-property/AllocationsApproveTransferOrders";
import { FilterContext } from "../../../app/property/FilterContext";
import { FilterStateDefaults } from "../../../app/property/FilterState";

const mockStore = configureMockStore();
const store = mockStore({
  authentication: {
    roles: [],
  },
});

const myRequestMock: jest.SpyInstance = jest.spyOn(
  PropertyApiService.prototype,
  "getAllocations"
);

myRequestMock.mockImplementationOnce(() =>
  Promise.resolve(AllocationsResponseMocked)
);

//mapStateToProps(state);

const container = render(
  <Provider store={store}>
    <FilterContext.Provider
      value={{
        hasQueryParams: true,
        searchCriteria: FilterStateDefaults,
        updateSearchCriteria: () => {},
        setHasQueryParamsToTrue: () => {},
      }}
    >
      <AllocationsApproveTransferOrders workflow="ALLOCATIONS" />
    </FilterContext.Provider>
  </Provider>
);

describe("component: tcnallocations", () => {
  it("rendered", async () => {
    await waitFor(() => {
      expect(myRequestMock).toHaveBeenCalledTimes(1);
      expect(myRequestMock).toHaveReturnedTimes(1);
      //const container = shallow(<allocations />);
      AllocationsResponseMocked.forEach(function (item) {
        const allocatebtn = container.queryByTestId(item.transferControlNumber);

        if (allocatebtn != undefined) {
          //const allocatebtn = ppmsCard.querySelectorAll("button#allocate")[0];
          if (
            item.requestStatus == "ALLOCATION_CONFIRMED" ||
            item.requestStatus == "ALLOCATION_DENIED"
          ) {
            expect(allocatebtn.hasAttribute("disabled")).toBe(true);
          } else expect(allocatebtn.hasAttribute("disabled")).toBe(false);
          // else {
          //     if ((item.noOfIcns - item.noOfAllocatedIcns) == 0) {
          //         expect(allocatebtn.hasAttribute("disabled")).toBe(true);
          //     }
          //     expect(allocatebtn.hasAttribute("disabled")).toBe(false);
          // }
        }
      });
    });
  });

  test("display all tcns in cards", () => {
    AllocationsResponseMocked.forEach(function (item) {
      const ppmsCard = container.queryByTestId(item.transferControlNumber);
      container.findByText("TCN:").then((element) => {
        expect(element).toBeInTheDocument();
      });
    });
  });

  test(" show no of requested items", () => {
    AllocationsResponseMocked.forEach(function (item) {
      const ppmsCard = container.queryByTestId(item.transferControlNumber);
      container.findByText("Requested ICNs:").then((element) => {
        expect(element).toBeInTheDocument();
        expect(element.innerHTML).toBe(
          "<strong>Requested ICNs:</strong>" + item.noOfICNs
        );
      });
    });
  });
});
