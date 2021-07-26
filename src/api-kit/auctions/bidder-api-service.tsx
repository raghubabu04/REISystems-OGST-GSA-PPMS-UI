import { authHeader } from "../../_redux/_helpers/auth-header";
import { WrapperService } from "../wrapper.service";
import { Environment } from "../../environments/environment";

export class BidderApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.AUCTIONS_URL;

  public getBidders(auctionId, params, body) {
    let header = authHeader();
    let apiParam = {
      name: "auctionBidder",
      method: "POST",
      params: params,
      headers: header,
      body: body,
      baseURL: this.baseURL,
      suffixURL: `/bidders/${auctionId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateBidderStatus(bidderId, data) {
    let header = authHeader();
    let apiParam = {
      name: "auctionBidder",
      method: "POST",
      params: data,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/updateStatus/${bidderId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBidderContractDetails(bidderId, data, searchCriteria) {
    let header = authHeader();
    let apiParam = {
      name: "auctionBidder",
      method: "POST",
      params: data,
      headers: header,
      body: searchCriteria,
      baseURL: this.baseURL,
      suffixURL: `/contract-info/${bidderId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getMyBidsForUser(params) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/my-bids/`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
