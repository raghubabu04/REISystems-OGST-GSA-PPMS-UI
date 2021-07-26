import { WrapperService } from "../wrapper.service";
import { authHeader } from "../../_redux/_helpers/auth-header";
import { Environment } from "../../environments/environment";

export class InventoryApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.PROPERTY_URL;

  public getAnnualInventoryList(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "annualInventory",
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

  public getPossessionHistoryList(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "annualInventory",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/possessionHistoryList`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateAnnualInventory(data) {
    let header = authHeader();
    let apiParam = {
      name: "inventory",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/updateAnnualInventory`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveAnnualInventoryCycle(data) {
    let header = authHeader();
    let apiParam = {
      name: "inventory",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/startAnnualInventoryCycle`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public findActiveInventory() {
    let header = authHeader();
    let apiParam = {
      name: "inventory",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/findActiveAnnualInventoryCycle`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public downloadAnnualInventoryFile(data) {
    let apiParam = {
      name: "annualInventory",
      method: "POST",
      params: data.params,
      headers: authHeader(),
      body: data,
      suffixURL: `/download/annualInventoryFile`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "blob",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public downloadPossessionHistory(data) {
    let apiParam = {
      name: "annualInventory",
      method: "POST",
      params: data.params,
      headers: authHeader(),
      body: data,
      suffixURL: `/download/possessionHistory`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "blob",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getFireArmByICN(icn: string) {
    let apiParam = {
      name: "inventory",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/firearmDonee/${icn}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public uploadPossessionFile(data) {
    let apiParam = {
      name: "inventory",
      method: "POST",
      params: {},
      headers: {
        ...authHeader(),
      },
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/possession-history/file/upload`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updatePossessionItems(data) {
    let apiParam = {
      name: "inventory",
      method: "PATCH",
      params: {},
      headers: authHeader(),
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/possession-history/file/updateItems`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async deletePossessionFiles(data) {
    let apiParam = {
      name: "inventory",
      method: "DELETE",
      params: {},
      headers: authHeader(),
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/possession-history/file/deleteFiles`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updatePossessionFile(data) {
    let header = {
      ...authHeader(),
    };
    let apiParam = {
      name: "inventory",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/possession-history/file/updateFile`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPossessionUploadedItems(icn, type) {
    let header = authHeader();
    let apiParam = {
      name: "inventory",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/possession-history/uploadedItems/${type}/${icn}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateFirearmStatus(data) {
    let apiParam = {
      name: "inventory",
      method: "POST",
      params: {},
      headers: {},
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/updateFirearmDoneeStatus/`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public transferFirearm(data) {
    let apiParam = {
      name: "inventory",
      method: "POST",
      params: {},
      headers: {},
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/transferFirearm/`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
