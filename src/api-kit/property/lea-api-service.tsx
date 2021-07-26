import { WrapperService } from "../wrapper.service";
import { authHeader } from "../../_redux/_helpers/auth-header";
import { Environment } from "../../environments/environment";

export class LEAApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.PROPERTY_URL;

  public uploadFileForLEA(data) {
    let header = authHeader();
    let apiParam = {
      name: "lea",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/uploadFile/${data.leaId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getFilesForLEA(leaId) {
    let header = authHeader();
    let apiParam = {
      name: "lea",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/uploadedItems/${leaId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateFilesForLEA(data) {
    let header = authHeader();
    let apiParam = {
      name: "lea",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/updateItems`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public deleteFilesForLEA(data) {
    let header = authHeader();
    let apiParam = {
      name: "lea",
      method: "DELETE",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/deleteFiles`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
