import { WrapperService } from "../wrapper.service";
import { Environment } from "../../environments/environment";
import { authHeader } from "../../_redux/_helpers/auth-header";

export class ForeignGiftsApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.PROPERTY_URL;

  public verifyICN(icnCode: string) {
    let apiParam = {
      name: "foreignGifts",
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

  public searchForeignGifts(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "foreignGifts",
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

  public approvedByDOS(data) {
    let apiParam = {
      name: "foreignGifts",
      method: "PATCH",
      params: {},
      headers: authHeader(),
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/approvedByDOS`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public sendToSale(data) {
    let apiParam = {
      name: "foreignGifts",
      method: "POST",
      params: {},
      headers: authHeader(),
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/sendToSale`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public downloadFile() {
    let apiParam = {
      name: "foreignGifts",
      method: "GET",
      params: {},
      headers: authHeader(),
      body: {},
      suffixURL: `/download/approvedByDOS`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "blob",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public downloadLabels(data) {
    let apiParam = {
      name: "foreignGifts",
      method: "POST",
      params: {},
      headers: authHeader(),
      body: data,
      suffixURL: `/downloadLabels`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "blob",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public downloadAcceptanceLetters(data) {
    let apiParam = {
      name: "foreignGifts",
      method: "POST",
      params: {},
      headers: authHeader(),
      body: data,
      suffixURL: `/downloadFGAcceptanceLetters`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "blob",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false)
  }

  public uploadFile(data) {
    let apiParam = {
      name: "foreignGifts",
      method: "POST",
      params: {},
      headers: authHeader(),
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/approvalDoS/uploadFile`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async deleteFileForUser() {
    let apiParam = {
      name: "foreignGifts",
      method: "DELETE",
      params: {},
      headers: authHeader(),
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/approvalDoS/deleteDOSApprovalFileForUser`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getUploadedItemsForUser() {
    let header = authHeader();
    let apiParam = {
      name: "foreignGifts",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/approvalDoS/uploadedItems`,
      baseURL: this.baseURL,
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

  public async deleteFiles(data) {
    let apiParam = {
      name: "foreignGifts",
      method: "DELETE",
      params: {},
      headers: authHeader(),
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/approvalDoS/deleteFiles`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public processUploadedFile() {
    let apiParam = {
      name: "foreignGifts",
      method: "GET",
      params: {},
      headers: authHeader(),
      body: {},
      suffixURL: `/approvalDoS/processApprovalFile`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "blob",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
