import { WrapperService } from "../wrapper.service";
import { Environment } from "../../environments/environment";
import { authHeader } from "../../_redux/_helpers/auth-header";

export class DashboardApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private propertyBaseURL = Environment.PROPERTY_URL;
  private userBaseURL = Environment.USER_URL;
  private propertyService = "property";
  private userService = "user";

  public async getPropertyCards() {
    let header = authHeader();
    let apiParam = {
      name: this.propertyService,
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/dashboard/tasks/count`,
      baseURL: this.propertyBaseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getUserCards() {
    let header = authHeader();
    let apiParam = {
      name: this.userService,
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/dashboard/tasks/count`,
      baseURL: this.userBaseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getChartData() {
    let header = authHeader();
    let apiParam = {
      name: this.propertyService,
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.propertyBaseURL,
      suffixURL: "/dashboard/chart-data",
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPropertyStatistics() {
    let header = authHeader();
    let apiParam = {
      name: this.propertyService,
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.propertyBaseURL,
      suffixURL: "/dashboard/statistics",
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
