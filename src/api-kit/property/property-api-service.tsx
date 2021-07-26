import { WrapperService } from "../wrapper.service";
import { Environment } from "../../environments/environment";
import { ChangeRequestDTO } from "../../app/models/ChangeRequestModel";
import { authHeader } from "../../_redux/_helpers/auth-header";
import { SRDRequestsDTO } from "../../app/models/SRDRequestDTO";
import { ERDRequestDTO } from "../../app/models/ERDRequestDTO";

export class PropertyApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.PROPERTY_URL;

  public getPropertyRequestsICN(icnCode: string) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/requests/${icnCode}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public verifyICN(icnCode: string) {
    let apiParam = {
      name: "property",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/checkICN/${icnCode}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public verifyPendingChangeRequest(
    icnCode: string,
    changeRequestType: string
  ) {
    let apiParam = {
      name: "property",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/checkPendingChangeRequest/${icnCode}/${changeRequestType}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public deletePropertyReport(icnCode: string) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "DELETE",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/delete/${icnCode}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public rejectForeignGiftReport(data) {
    let header = authHeader();
    let apiParam = {
      name: "foreignGifts",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/reject`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public destroyForeignGiftReport(data) {
    let header = authHeader();
    let apiParam = {
      name: "foreignGifts",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/destroy`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public savePropertyReport(data) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/savePropertyReport`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveSalesPropertyReport(data) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/saveSalesPropertyReport`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public approvePropertyReport(data) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/approvePropertyReport`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveChangeRequest(icn: string, data: ChangeRequestDTO) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/saveChangeRequest/${icn}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPropertyList(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/propertyList`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getCategoryCount() {
    // params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/categoryCount`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public searchPropertybyCategory(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/search`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public searchHistoryPropertybyCategory(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/history/search`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public submitNonReportedProperty(data) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/saveNonReportedProperty`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public uploadFile(data) {
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: {
        ...authHeader(),
      },
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/file/upload`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateItems(data) {
    let apiParam = {
      name: "property",
      method: "PATCH",
      params: {},
      headers: authHeader(),
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/file/updateItems`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateFile(data) {
    let header = {
      ...authHeader(),
    };
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/file/updateFile`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async deleteFiles(data) {
    let apiParam = {
      name: "property",
      method: "DELETE",
      params: {},
      headers: authHeader(),
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/file/deleteFiles`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getUploadedItems(icn, type) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/uploadedItems/${type}/${icn}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getHistoryUploadedItems(icn, type) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/history/uploadedItems/${type}/${icn}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPropertyByICNRequest(icn) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/${icn}/requests`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getProperty(icn) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/icn/${icn}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPropertiesByZoneAndRegion(params) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: `/sales/zone`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getHistoryProperty(icn) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/history/icn/${icn}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getTaskList(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/type/taskList`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getChangeRequest(id) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/changeRequest/${id}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public createChangeRequest(data: ChangeRequestDTO) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/saveChangeRequest`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateChangeRequest(changeRequestId: number, data: ChangeRequestDTO) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/updateChangeRequest/${changeRequestId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public withdrawProperty(data) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/withdraw`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getValidDate(type: string, data: SRDRequestsDTO | ERDRequestDTO) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/${type}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public addToCart(data) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/addToCart`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public addFGToCart(data) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/addForeignGiftToCart`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateQuantity(data) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/updateQuantity`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getCartItems() {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/getCartItems`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public checkPropertiesForLoggedInUser() {
    let header = authHeader();
    let apiParam = {
      name: "specialDescription",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/checkForExistingPropertiesByPC`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getMyRequests(data) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "POST",
      params: data.params,
      headers: header,
      body: data.searchCriteria,
      suffixURL: `/requests`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public deleteCartItem(data) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "DELETE",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/CartItem/` + data,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public deleteTCN(data) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "DELETE",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/removeTCN/` + data,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public checkoutCart(data) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: "/checkoutCart",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public directRequisition(data) {
    let header = authHeader();
    let apiParam = {
      name: "internal_screening",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: "/direct-requisition",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveShippingDetails(tcn, data) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: "/updateShipping/" + tcn,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public async getShippingInformation(tcn) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/getShippingInformation/` + tcn,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getCountOfTasks() {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/tasks/count`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public savePropertyPriority(data, tcn) {
    let apiParam = {
      name: "internalScreening",
      method: "POST",
      params: {},
      headers: authHeader(),
      body: data,
      suffixURL: "/priority/" + tcn,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getTCNDetails(tcn, params?: {}) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "GET",
      params: params ? params : {},
      headers: header,
      body: {},
      suffixURL: `/getTCN/` + tcn,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAllocations(data) {
    let header = authHeader();
    let apiParam = {
      name: "internal_screening",
      method: "POST",
      params: data.params,
      headers: header,
      body: data.searchCriteria,
      suffixURL: "/tcns/allocations",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getApprovals(data) {
    let header = authHeader();
    let apiParam = {
      name: "internal_screening",
      method: "POST",
      params: data.params,
      headers: header,
      body: data.searchCriteria,
      suffixURL: "/tcns/approvals",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getRequisition(data) {
    let header = authHeader();
    let apiParam = {
      name: "internal_screening",
      method: "POST",
      params: data.params,
      headers: header,
      body: data.searchCriteria,
      suffixURL: "/tcns/transfers",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getConfirmedTransferTcn(data) {
    let header = authHeader();
    let apiParam = {
      name: "internal_screening",
      method: "POST",
      params: data.params,
      headers: header,
      body: data.searchCriteria,
      suffixURL: "/tcns/recalls",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getNumberOfAllocations(data) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: data.params,
      headers: header,
      body: {},
      suffixURL: "/numberofAllocations",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public denyIcnAllocation(data, tcn) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: "/updateRequestItemStatus/" + tcn,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public denyAllIcnAllocation(data, tcn) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: "/updateMultipleRequestItemStatus/" + tcn,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public allocateProperty(data) {
    let header = authHeader();
    let apiParam = {
      name: "internal_screening",
      method: "PATCH",
      params: data,
      headers: header,
      body: {},
      suffixURL: "/update-allocated-quantity",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public confirmTCNAllocation(tcn: string) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "PATCH",
      params: {},
      headers: header,
      body: {},
      suffixURL: "/updateStatus/" + tcn,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateRequestorDetails(payload: any) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "PATCH",
      params: {},
      headers: header,
      body: payload,
      suffixURL: "/updateRequesterDetails",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateAssignItemsUserEmail(payload: any) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: payload,
      suffixURL: "/assignItems",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveRequestorAgencyApprovalInfo(payload: any) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "POST",
      params: {},
      headers: header,
      body: payload,
      suffixURL: "/saveRequestorAgencyApprovalInfo",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getRequestorAgencyApprovalInfoById(contactId: any) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/getRequestorAgencyApprovalInfo/` + contactId,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getRequestorAgencyApprovalInfoByEmail(email: any) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/getRequestorAOInfoByEmailId/` + email,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public linkRequestorToCart(data: any) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: "/updateRequestorAOInfo",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateAoDetails(payload: any) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "PATCH",
      params: {},
      headers: header,
      body: payload,
      suffixURL: "/tcn",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateOAC(payload: any) {
    let header = authHeader();
    let apiParam = {
      name: "internal_screening",
      method: "PATCH",
      params: {},
      headers: header,
      body: payload,
      suffixURL: "/property-oac",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public approveTCNAllocation(tcn: string) {
    let header = authHeader();
    let apiParam = {
      name: "internal_screening",
      method: "PATCH",
      params: {},
      headers: header,
      body: {},
      suffixURL: "/approve-tcn/" + tcn,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public confirmTcnUpdates(tcn: string) {
    let header = authHeader();
    let apiParam = {
      name: "internal_screening",
      method: "PATCH",
      params: {},
      headers: header,
      body: {},
      suffixURL: "/confirm-recall-tcn/" + tcn,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public confirmTcnTransfer(tcn: string) {
    let header = authHeader();
    let apiParam = {
      name: "internal_screening",
      method: "PATCH",
      params: {},
      headers: header,
      body: {},
      suffixURL: "/transfer-tcn/" + tcn,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public approveProperty(data) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: "/approveQuantity",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public approveAllIcns(tcn) {
    let header = authHeader();
    let apiParam = {
      name: "internal_screening",
      method: "PATCH",
      params: {},
      headers: header,
      body: {},
      suffixURL: "/" + tcn + "/approve-all",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public transferProperty(data) {
    let header = authHeader();
    let apiParam = {
      name: "internal_screening",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: "/transferQuantity",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public checkSpecialDescriptionCode(data) {
    let header = authHeader();
    let apiParam = {
      name: "specialDescription",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: "/specDesCode",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public recallProperty(data) {
    let header = authHeader();
    let apiParam = {
      name: "internal_screening",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: "/recall",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getStatus(icnCode: string) {
    let apiParam = {
      name: "property",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/${icnCode}/requests`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public checkAvailability(data) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/checkAvailability/${data.itemControlNumber}/${data.requestedItemId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public recallHistory(data) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: "/history/recall-history",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getWantLists(data) {
    let header = authHeader();
    let apiParam = {
      name: "wantList",
      method: "GET",
      params: data,
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: "/getWantListByUser",
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  //Foreign Gifts
  public searchForeignGiftsByCategory(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "foreignGifts",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/advancedSearch`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  //leauser

  public saveCartRequestLeaInfo(data) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/saveCartRequestLeaInfo`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getDoneeShippingDetailsByCartId(cartId: any) {
    let header = authHeader();
    let apiParam = {
      name: "internalScreening",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/getDoneeShippingDetailsByCartId/` + cartId,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public withdrawSalesProperty(data) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/sales/withdraw`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public reactivateSalesProperty(data) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/sales/reactivate`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public reactivateBulkSalesProperty(data) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/sales/bulkReactivate`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public withdrawBulkSalesProperty(data) {
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/sales/bulkWithdraw`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public recallForeignGiftReport(data) {
    let header = authHeader();
    let apiParam = {
      name: "foreignGifts",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/recall`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getActionHistoryForProperty(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "propertyActionHistory",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: ``,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public reportAgain(data) {
    let apiParam = {
      name: "property",
      method: "POST",
      params: {},
      headers: authHeader(),
      body: data,
      suffixURL: `/copyProperty`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public reporting3040List(data) {
    let apiParam = {
      name: "state3040Report",
      method: "POST",
      params: data.params,
      headers: authHeader(),
      body: data,
      suffixURL: `/list`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public get3040Report(id: string) {
    let apiParam = {
      name: "state3040Report",
      method: "GET",
      params: {},
      headers: authHeader(),
      body: {},
      suffixURL: `/editOrReview/${id}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public save3040Report(data) {
    let header = authHeader();
    let apiParam = {
      name: "state3040Report",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/save`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public submit3040Report(data) {
    let header = authHeader();
    let apiParam = {
      name: "state3040Report",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/submit`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getActionHistoryForObject(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "property",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: `/action-history`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public download3040ReportFile(data) {
    let apiParam = {
      name: "state3040Report",
      method: "GET",
      params: {},
      headers: authHeader(),
      body: {},
      suffixURL: `/download/${data.financialYear}/${data.quarter}/${data.state}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "blob",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
