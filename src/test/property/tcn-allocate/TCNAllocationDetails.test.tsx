import React from "react";
import TCNAllocationDetails from "../../../app/property/allocate-property/TCNAllocationDetails";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { render } from "@testing-library/react";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { TCNDetailsMocked } from "./Constants";
import { AllocationContextProvider } from "../../../app/property/allocate-property/AllocationContext";

const mockStore = configureMockStore([thunk]);
const store = mockStore({
  common: {
    unitOfIssue: [{ id: "EA", name: "EACH" }],
  },
  authentication: {
    roles: [],
    permissions: ["SM"],
  },
});
let x = { params: { tcn: "123456789" } };
let y = {
  tcn: "9921841036",
  approvingOfficial: {
    phoneNumber: "",
  },
  icnStatusMap: {},
  tcnStatus: "",
  requisition: true,
};

const tcnClassComponent = render(
  <Provider store={store}>
    <AllocationContextProvider>
      <TCNAllocationDetails match={x} tcnInfo={y} />
    </AllocationContextProvider>
  </Provider>
);

let useEffect;
const mockUseEffect = () => {
  useEffect.mockImplementationOnce((f) => f());
};
const myRequestMock: jest.SpyInstance = jest.spyOn(
  PropertyApiService.prototype,
  "getTCNDetails"
);

myRequestMock.mockImplementationOnce(() => Promise.resolve(TCNDetailsMocked));

describe("TCNAllocationDetailsComponent", () => {
  beforeEach(() => {
    useEffect = jest.spyOn(React, "useEffect");
    mockUseEffect();
  });

  test("checking request items present", () => {
    TCNDetailsMocked.forEach(function (item) {
      //const ppmsCard = container.queryByTestId(item.transferControlNumber);
      tcnClassComponent
        .findByTestId(item.transferControlNumber)
        .then((element) => {
          //expect(element).toBeInTheDocument();
          expect(element).toContain(
            "<strong>Requested ICNs:</strong>" + item.requestItems.length
          );
        });
    });
  });

  test(" show no of requested items", () => {
    TCNDetailsMocked.forEach(function (item) {
      tcnClassComponent.findByText("Requested ICNs:").then((element) => {
        expect(element.innerHTML).toBe(
          "<strong>Requested ICNs:</strong>" + item.requestItems.length
        );
      });
    });
  });

  test(" button", () => {
    TCNDetailsMocked.forEach(function (item) {
      const ppmsCard = tcnClassComponent.findByTestId(
        "edit shipping information"
      );
      console.log({ ppmsCard });
    });
  });
});
