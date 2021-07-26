import { render, waitFor } from "@testing-library/react";
import React from "react";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import MyRequests from "../../../app/property/my-requests/MyRequests";
import { CartRequestProps, CartRequestResponse } from "./Constants";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { FilterContextProvider } from "../../../app/property/FilterContext";
const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);
const store = mockStore({
  authentication: {
    roles: [],
  },
  common: { priorityCodes: [""] },
});

const myRequestMock: jest.SpyInstance = jest.spyOn(
  PropertyApiService.prototype,
  "getMyRequests"
);

myRequestMock.mockImplementationOnce(() =>
  Promise.resolve(CartRequestResponse)
);

const { getByTestId } = render(
  <Provider store={store}>
    <FilterContextProvider>
      <MyRequests {...CartRequestProps} />
    </FilterContextProvider>
  </Provider>
);

describe("component: my-requests", () => {
  it("rendered", async () => {
    await waitFor(() => {
      expect(myRequestMock).toHaveBeenCalledTimes(1);
      expect(myRequestMock).toHaveReturnedTimes(1);
      CartRequestResponse.data.myRequestsDTOS.forEach(function (item) {
        const ppmsCard: HTMLElement = getByTestId(`${item.cartRequestId}`);
        const TCN: string = `TCN: ${item.transferControlNumber?.replace(
          /(.{2})(.{2})(.{6})/,
          "$1-$2-$3"
        )}`;
        const elements: NodeListOf<HTMLElement> = ppmsCard.querySelectorAll(
          "strong"
        );
        const tcnElement: HTMLElement = elements[0];
        expect(tcnElement.innerHTML).toBe(TCN);
      });
    });
  });
});
