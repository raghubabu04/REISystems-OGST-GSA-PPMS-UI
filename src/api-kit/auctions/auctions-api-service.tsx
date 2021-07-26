import { authHeader } from "../../_redux/_helpers/auth-header";
import { WrapperService } from "../wrapper.service";
import { Environment } from "../../environments/environment";
export class AuctionsApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.AUCTIONS_URL;

  public buyNow(auctionId) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "POST",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/auctions/buyNow/${auctionId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public placeBid(data, auctionId) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/auctions/placeBid/${auctionId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public previewAuctions(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "auctions",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/getAuctions`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getCategoryCounts() {
    let header = authHeader();
    let apiParam = {
      name: "auctions",
      method: "POST",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/categoryCounts`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public uploadSelectedLots(data, zoneId) {
    let apiParam = {
      name: "auctions",
      method: "PATCH",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/setAuctions?zoneId=${zoneId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAuction(auctionId) {
    let header = authHeader();
    let apiParam = {
      name: "auctions",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/getAuction/${auctionId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPBSAuction(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "auctions",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/getPbsDoiAuctions`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getTopBids(auctionId) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/top-bids/${auctionId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAllBids(auctionId, data) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "POST",
      params: data.params,
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/bids/${auctionId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getMyBids(auctionId) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/my-bids/${auctionId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getListofBanners() {
    let header = authHeader();
    let apiParam = {
      name: "auctions",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/banners`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getListofAlertsByCategory(category) {
    let apiParam = {
      name: "auctions",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/home/getAlerts/${category}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getStateAuctions() {
    let apiParam = {
      name: "auctions",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/stateCountList`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public addBidderToAuction(auctionId, bidderId) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "POST",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/auctions/addBidder/${auctionId}/${bidderId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBiddingActionHistory(bidderId, data) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "GET",
      params: data.params,
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/messages/${bidderId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getLotsBySaleNumber(saleNumber, data, body) {
    let header = authHeader();
    let apiParam = {
      name: "auctions",
      method: "POST",
      params: data,
      headers: header,
      body: body,
      baseURL: this.baseURL,
      suffixURL: `/${saleNumber}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBidBidderList(data, auctionId) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/getBidBidderList/${auctionId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public cancelBid(bidId) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "POST",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/cancelBid/${bidId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public reviveBid(bidId, contractId) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "PATCH",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/revive-bid/${contractId}/${bidId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public awardBid(bidId, contractId) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "PATCH",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/award-bid/${contractId}/${bidId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public modifyBid(data, contractId) {
    let body = data.body;
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "PATCH",
      params: {},
      headers: header,
      body: body,
      baseURL: this.baseURL,
      suffixURL: `/modify-bid/${contractId}/${data.bidId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getActionHistoryForAuctions(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "auctionsActionHistory",
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

  public addBidAmount(data) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/bidAmount/bidder`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getTopBidders(auctionId) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/topBidders/${auctionId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public cancelBidAwardInformation(data) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/cancelBidWithReason`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAwardInformation(lotId) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/getAwardInformation/${lotId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBidderPayments(data) {
    let header = authHeader();
    let apiParam = {
      name: "auctionBidder",
      method: "POST",
      params: data.params,
      headers: header,
      body: data,
      suffixURL: `/awarded/bidders`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getCheckSaleOrLot(checkSaleOrLot) {
    let header = authHeader();
    let apiParam = {
      name: "auctions",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/checkSaleOrLot/${checkSaleOrLot}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public checkIfContractCanBeVoid(lotId) {
    let header = authHeader();
    let apiParam = {
      name: "auctions",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/contract/${lotId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  

  public getTradeList(params,body) {
    let header = authHeader();
    let apiParam = {
      name: "auctions",
      method: "POST",
      params: params,
      headers: header,
      body: body,
      suffixURL: `/my-trades`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAwardDetails(contractId) {
    let header = authHeader();
    let apiParam = {
      name: "auctionBidder",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/award-details/${contractId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public placeOffLineBid(data) {
    let header = authHeader();
    let apiParam = {
      name: "bid",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/auctions/addOffLineBidder`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
