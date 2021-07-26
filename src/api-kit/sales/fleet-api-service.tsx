import { WrapperService } from "../wrapper.service";
import { authHeader } from "../../_redux/_helpers/auth-header";
import { Environment } from "../../environments/environment";
import { EditFleetDTO } from "../../app/sales/fleet/edit-fleet/editFleetDto";
import { SalePaymentDTO } from "../../app/sales/sale-payment/salePaymentDTO";

export class FleetApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.SALES_URL;

  public getFmsLotItemDetails(lotId) {
    let apiParam = {
      name: "fleet",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/lot/${lotId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public submitFleetLotDetails(payload: EditFleetDTO) {
    let header = authHeader();
    let apiParam = {
      name: "fleet",
      method: "POST",
      params: {},
      headers: header,
      body: payload,
      suffixURL: `/updateFmsLot`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getContractNumber(contractNumber) {
    let apiParam = {
      name: "fleet",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/checkIsContractNumValid/${contractNumber}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getVinNumber(vin) {
    let apiParam = {
      name: "fleet",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/checkIsVinValid/${vin}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getContractNumAndVin(payload) {
    let header = authHeader();
    let apiParam = {
      name: "fleet",
      method: "POST",
      params: {},
      headers: header,
      body: payload,
      suffixURL: `/contractAndVinSearch`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getCardPaymentThreshold(data) {
    let header = authHeader();
    let apiParam = {
      name: "payments",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/validCCardPaymentAmountThreshold`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public submitLiveSalePayment(payload: SalePaymentDTO) {
    let header = authHeader();
    let apiParam = {
      name: "fleet",
      method: "POST",
      params: {},
      headers: header,
      body: payload,
      suffixURL: `/submitLiveSalePayment`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getFleetPaymentDetails(paymentIds) {
    let header = authHeader();
    let apiParam = {
      name: "payments",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/fleet/${paymentIds}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
