import React from "react";

import { when } from "jest-when";
import configureMockStore from "redux-mock-store";
import { mount } from "enzyme";
import { MyTaskListPage } from "../../../app/property/my-task/MyTaskListPage";

import { UserUtils } from "../../../utils/UserUtils";
import {
  checkButtonExist,
  checkButtonName,
  checkButtonNotExist,
} from "../../../utils/TestUtil";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import {
  MockedCountResponseAP,
  MockedCountResponseNU,
  MockedCountResponsePR,
  MockedCountResponseSM,
  MockedCountResponseAC,
} from "./Constants";

const mockStore = configureMockStore();
const store = mockStore({});

const userPermissionMock: jest.SpyInstance = jest.spyOn(
  UserUtils,
  "getUserPermissions"
);

const isInternalUserMock: jest.SpyInstance = jest.spyOn(
  UserUtils,
  "getUserInfo"
);

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

const getCountOfTasks: jest.SpyInstance = jest.spyOn(
  PropertyApiService.prototype,
  "getCountOfTasks"
);

/***Test to SM user */
describe("component: my-task ListPage", () => {
  getCountOfTasks.mockReturnValue(
    Promise.resolve({
      data: {
        myAllocations: MockedCountResponseSM.myAllocations,
        myRequests: MockedCountResponseSM.myRequests,
        myApprovals: MockedCountResponseSM.myApprovals,
      },
    })
  );

  when(userPermissionMock).calledWith().mockReturnValue("SM");
  when(isInternalUserMock)
    .calledWith()
    .mockReturnValue({ internalAgencyUser: false });

  let myTaskListPageClass = mount(
    <MyTaskListPage
      match={""}
      location={""}
      history={""}
      context={""}
    ></MyTaskListPage>
  );
  it("should show My Requests and Allocation buttons for SM user", () => {
    checkButtonExist(myTaskListPageClass, "my-task-change-request");
    checkButtonExist(myTaskListPageClass, "my-task-allocation");
    checkButtonExist(myTaskListPageClass, "my-task-approve-transfer-orders");

    checkButtonName(
      myTaskListPageClass,
      "my-task-change-request",
      `Change Requests (${MockedCountResponseSM.myRequests})`
    );
    checkButtonName(
      myTaskListPageClass,
      "my-task-allocation",
      `Allocations (${MockedCountResponseSM.myAllocations})`
    );
    checkButtonName(
      myTaskListPageClass,
      "my-task-approve-transfer-orders",
      `Approve Transfer Orders (${MockedCountResponseSM.myApprovals})`
    );
  });
});

/***Test to NU user */
describe("component: my-task ListPage", () => {
  getCountOfTasks.mockReturnValue(
    Promise.resolve({
      data: {
        myAllocations: MockedCountResponseNU.myAllocations,
        myRequests: MockedCountResponseNU.myRequests,
        myApprovals: MockedCountResponseNU.myApprovals,
      },
    })
  );

  when(userPermissionMock).calledWith().mockReturnValue("NU");
  when(isInternalUserMock)
    .calledWith()
    .mockReturnValue({ internalAgencyUser: true });

  let myTaskListPageClass = mount(
    <MyTaskListPage
      match={""}
      location={""}
      history={""}
      context={""}
    ></MyTaskListPage>
  );
  it("should show Change Requests, Allocations and Approve Transfer Orders buttons for NUO user", () => {
    checkButtonExist(myTaskListPageClass, "my-task-change-request");
    checkButtonExist(myTaskListPageClass, "my-task-allocation");
    checkButtonExist(myTaskListPageClass, "my-task-approve-transfer-orders");

    checkButtonName(
      myTaskListPageClass,
      "my-task-change-request",
      `Change Requests (${MockedCountResponseNU.myRequests})`
    );
    checkButtonName(
      myTaskListPageClass,
      "my-task-allocation",
      `Allocations (${MockedCountResponseNU.myAllocations})`
    );
    checkButtonName(
      myTaskListPageClass,
      "my-task-approve-transfer-orders",
      `Approve Transfer Orders (${MockedCountResponseNU.myApprovals})`
    );
  });
});

/***Test to APO user */
describe("component: my-task ListPage", () => {
  it("should show both Change Requests and Allocations buttons for APO user", async () => {
    getCountOfTasks.mockReturnValue(
      Promise.resolve({
        data: {
          myAllocations: MockedCountResponseAP.myAllocations,
          myRequests: MockedCountResponseAP.myRequests,
          myApprovals: MockedCountResponseAP.myApprovals,
        },
      })
    );

    when(userPermissionMock).calledWith().mockReturnValue("AC");

    let myTaskListPageClass = mount(
      <MyTaskListPage
        match={""}
        location={""}
        history={""}
        context={""}
      ></MyTaskListPage>
    );

    await flushPromises();
    myTaskListPageClass.update();

    expect(getCountOfTasks).toBeCalled();

    checkButtonExist(myTaskListPageClass, "my-task-change-request");
    checkButtonExist(myTaskListPageClass, "my-task-allocation");
    checkButtonNotExist(myTaskListPageClass, "my-task-approve-transfer-orders");

    checkButtonName(
      myTaskListPageClass,
      "my-task-change-request",
      `Change Requests (${MockedCountResponseAP.myRequests})`
    );
    checkButtonName(
      myTaskListPageClass,
      "my-task-allocation",
      `Allocations (${MockedCountResponseAP.myAllocations})`
    );
  });
});

/***Test to PR user */
describe("component: my-task ListPage", () => {
  getCountOfTasks.mockReturnValue(
    Promise.resolve({
      data: {
        myAllocations: MockedCountResponsePR.myAllocations,
        myRequests: MockedCountResponsePR.myRequests,
        myApprovals: MockedCountResponsePR.myApprovals,
      },
    })
  );

  when(userPermissionMock).calledWith().mockReturnValue("RP");
  when(isInternalUserMock)
    .calledWith()
    .mockReturnValue({ internalAgencyUser: true });

  let myTaskListPageClass = mount(
    <MyTaskListPage
      match={""}
      location={""}
      history={""}
      context={""}
    ></MyTaskListPage>
  );
  it("should show My Requests and Allocation buttons for Internal Reporter user", () => {
    checkButtonNotExist(myTaskListPageClass, "my-task-change-request");
    checkButtonNotExist(myTaskListPageClass, "my-task-approve-transfer-orders");
    checkButtonExist(myTaskListPageClass, "my-task-allocation");

    checkButtonName(
      myTaskListPageClass,
      "my-task-allocation",
      `Allocations (${MockedCountResponsePR.myAllocations})`
    );
  });
});

/***Test to AO user */
describe("my TasksPage for Approve Transfer Orders", () => {
  getCountOfTasks.mockReturnValue(
    Promise.resolve({
      data: {
        myAllocations: MockedCountResponsePR.myAllocations,
        myRequests: MockedCountResponsePR.myRequests,
        myApprovals: MockedCountResponsePR.myApprovals,
      },
    })
  );

  when(userPermissionMock).calledWith().mockReturnValue("AO");
  when(isInternalUserMock)
    .calledWith()
    .mockReturnValue({ internalAgencyUser: true });

  let myTaskListPageClass = mount(
    <MyTaskListPage
      match={""}
      location={""}
      history={""}
      context={""}
    ></MyTaskListPage>
  );

  it("should show Approve Transfer Orders buttons for AO user", () => {
    checkButtonNotExist(myTaskListPageClass, "my-task-change-request");
    checkButtonNotExist(myTaskListPageClass, "my-task-allocation");
    checkButtonExist(myTaskListPageClass, "my-task-approve-transfer-orders");
    checkButtonName(
      myTaskListPageClass,
      "my-task-approve-transfer-orders",
      `Approve Transfer Orders (${MockedCountResponsePR.myApprovals})`
    );
  });
});

describe("my TasksPage for Requisitions", () => {
  getCountOfTasks.mockReturnValue(
    Promise.resolve({
      data: MockedCountResponseAC,
    })
  );

  when(userPermissionMock).calledWith().mockReturnValue("AC");

  let myTaskListPageClass = mount(
    <MyTaskListPage
      match={""}
      location={""}
      history={""}
      context={""}
    ></MyTaskListPage>
  );

  it("should show Requisitions buttons for AC user", () => {
    checkButtonExist(myTaskListPageClass, "my-requisitions");
    checkButtonName(
      myTaskListPageClass,
      "my-requisitions",
      `Requisitions (${MockedCountResponseAC.myRequisitions})`
    );
  });
});
