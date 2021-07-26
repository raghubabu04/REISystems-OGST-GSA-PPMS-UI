import { WrapperService } from "../wrapper.service";
import { Environment } from "../../environments/environment";
import { authHeader } from "../../_redux/_helpers/auth-header";
import { WantListDTO } from "../../app/property/want-list/constants/wantListDto";

export class WantListApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.PROPERTY_URL;

  public checkValidWantListName(wantListName: string, wantListId: string) {
    let header = authHeader();
    let apiParam = {
      name: "wantList",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/checkWantListByUser/${wantListName}/${wantListId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public submitWantList(data: WantListDTO) {
    let header = authHeader();
    let apiParam = {
      name: "wantList",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/saveWantList`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getWantListById(wantListId) {
    let header = authHeader();
    let apiParam = {
      name: "wantList",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/getWantListById/${wantListId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public deleteWantListById(data) {
    let header = authHeader();
    let apiParam = {
      name: "wantList",
      method: "DELETE",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/delete/` + data,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
