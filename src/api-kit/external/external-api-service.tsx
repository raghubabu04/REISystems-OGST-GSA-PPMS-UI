import { WrapperService } from "../wrapper.service";
import { Environment } from "../../environments/environment";

export class ExternalApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private mapQuestURL = Environment.MAPQUEST;

  public getLocationCoordinates(params) {
    const apiParam = {
      name: "",
      method: "GET",
      params: params,
      headers: {
        "Content-Type": "application/json",
      },
      body: {},
      suffixURL: `/geocoding/v1/address?key=${Environment.MAPQUEST_API_KEY}`,
      baseURL: this.mapQuestURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
