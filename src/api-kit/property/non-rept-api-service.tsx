import { WrapperService } from "../wrapper.service";
import { authHeader } from "../../_redux/_helpers/auth-header";
import { Environment } from "../../environments/environment";

export class NonReptApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.PROPERTY_URL;

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
      suffixURL: `/nonreported/uploadFile`,
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
      name: "property",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/nonreported/uploadedItems`,
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
      name: "property",
      method: "DELETE",
      params: {},
      headers: authHeader(),
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/nonreported/deleteFiles`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public async deleteFileForUser() {
    let apiParam = {
      name: "property",
      method: "DELETE",
      params: {},
      headers: authHeader(),
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/nonreported/deleteFileForUser`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
