import { WrapperService } from "../wrapper.service";
import { authHeader } from "../../_redux/_helpers/auth-header";
import { Environment } from "../../environments/environment";
import {
  LotExtensionDTO,
  LotTerminationDTO,
} from "../../app/auctions/manage-auctions/manage-auction-access/Constants";

export class SalesApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.SALES_URL;

  public getSalesInformation(saleId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/${saleId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getStatusUpdate(data, salesNumber) {
    let apiParam = {
      name: "specialDescription",
      method: "PATCH",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/${salesNumber}/upload-selected-lot`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public searchSalesByCategory(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "sales",
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

  public previewAuctions(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/preview/auctions`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getICNSalesControlsList(params) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: "/properties/zone",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getMyFavorites(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: "/auctions/favourites",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getFeaturedItems(data?: any) {
    let params = data?.params;
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: "/featuredItems",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPBSFeaturedItems(data?: any) {
    let params = data?.params;
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: "/pbs/featuredItems",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getLotsForSale(params) {
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/getLots`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getICNFilesByLot(lotId) {
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/lot/${lotId}/files`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public verifyCampaignName(name: string) {
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/campaigns/checkName/${name}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public deleteMarketingCampaign(campaignId) {
    let apiParam = {
      name: "sales",
      method: "DELETE",
      params: {},
      headers: authHeader(),
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/campaigns/${campaignId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveMarketingCampaign(payload) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: payload,
      suffixURL: `/campaigns`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getRegisterUploads(registerId) {
    let header = authHeader();
    let apiParam = {
      name: "registers",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/uploadedItems/${registerId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public copyMarketingCampaign(campaignId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/campaigns/${campaignId}/copy`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getListOfCampaigns(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: `/campaigns`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getCampaignDetailsById(campaignId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      headers: header,
      params: {},
      body: {},
      suffixURL: `/campaigns/${campaignId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public uploadFile(data) {
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: {
        ...authHeader(),
      },
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/campaigns/upload`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateFile(data) {
    let header = {
      ...authHeader(),
    };
    let apiParam = {
      name: "sales",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/campaigns/files/update`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async deleteFiles(data) {
    let apiParam = {
      name: "sales",
      method: "DELETE",
      params: {},
      headers: authHeader(),
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/campaigns/files/delete`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getUploadedItems(campaignId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/campaigns/${campaignId}/upload-items`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  /**
   * -------------------------------
   * ------------- SALES -----------
   */
  public getSaleNumber(data) {
    let apiParam = {
      name: "sales",
      method: "GET",
      params: data,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/getSaleNumber`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getSaleTransactionsForPBSDOI(params) {
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/getSalePBSDOITransactions`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveSales(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: ``,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getActionHistoryForSalesObject(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "salesActionHistory",
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

  public deleteSales(id) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "DELETE",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/${id}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getSaleDetails(id) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/${id}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public addNewLot(params) {
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/addNewLot`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public getLotList(params) {
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/getLotList`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public addICNToLot(data) {
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/addICNToLot`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveLotDetails(data) {
    let apiParam = {
      name: "sales",
      method: "PATCH",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/lot`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getTransactionList(params) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: "/getSaleTransactions",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getSalesToManageAuction(params) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: "/getSalesToManageAuction",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getICNListByLotId(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: data.params,
      headers: header,
      body: {},
      suffixURL: `/lot/${data.lotId}/icnList`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getICNDetailsList(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: data.params,
      headers: header,
      body: {},
      suffixURL: `/lot/${data.lotId}/icnDetailsList`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public transferLot(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/transferLot`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  /**
   * ------- File Uploads for Sales --------
   */

  public getLotUploadedItems(lotId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/uploadedItems/lot/${lotId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getSalesUploadedItems(salesId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/uploadedItems/sales/${salesId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public uploadLotFile(data) {
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: {
        ...authHeader(),
      },
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/file/upload`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public addLotFile(data) {
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: {
        ...authHeader(),
      },
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/lot/addFiles`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateLotFile(data) {
    let header = {
      ...authHeader(),
    };
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/file/updateFile`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async deleteLotFiles(data) {
    let apiParam = {
      name: "sales",
      method: "DELETE",
      params: {},
      headers: authHeader(),
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/file/deleteFiles`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public updateLotItems(data) {
    let apiParam = {
      name: "sales",
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

  /**
   * Custodian Information
   */

  public saveInspection(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/lot/inspection`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getLotsForCustodianBySale(id, params) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: `/custodian/${id}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getLotCustodiansForSale(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: data.param,
      headers: header,
      body: data.body,
      suffixURL: `/custodians`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getICNCustodianLocation(id) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/lot/${id}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveLotCustodian(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/lot/custodian`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateLotCustodian(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/lot/custodian`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getLotAuctionList(params) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: "/lot/auctionLots",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public async getTemplateCodes(zoneId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/templateCode/${zoneId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public getCustodianById(id) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/lotCustodian/${id}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getLotsForCustodian(id, params) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: `/lots/${id}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getSalesByEmail(params, email) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: params.page,
      headers: header,
      body: params.data,
      suffixURL: `/custodian/email/${email}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public getCustodianInformation(saleId, email) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/${saleId}/custodian/${email}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public submitToCustodian(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/lot/submitCustodian/${data}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveNotes(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/notes`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveFinalRemovalDate(data, lotId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/lot/updateLotRemovalDate/${lotId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public saveRegisterNotes(data) {
    let header = authHeader();
    let apiParam = {
      name: "registers",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/notes`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public approveOrDisapprove(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/custodian/approveOrDisapprove`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getContractsListBySalesId(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/contractList`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    if (!data.salesId) return;
    return this.apiService.httpCall(apiParam, false);
  }

  public getContractsListByBidder(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/contractList`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    if (!data.bidderUsername) return;
    return this.apiService.httpCall(apiParam, false);
  }

  public generateIFBPDF(saleId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/generateIFBPDF/${saleId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getContractByContractNumber(contractNumber) {
    console.log();
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/lot/contractDetail/${contractNumber}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public getContractDetails(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/lot/contractDetail`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    if (!data.salesId) return;
    return this.apiService.httpCall(apiParam, false);
  }
  public getContractUploadedItems(contractId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/uploadedItems/contract/${contractId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getContractRefundUploadedItems(contractId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/uploadedItems/contract/refund/${contractId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getContractByContractId(contractId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/lot/contractById/${contractId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAuctionItem(lotId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/preview/auctions/${lotId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getNasaItemList(data, lotId) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/preview/auctions/${lotId}/items`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public searchContracts(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/contractList`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public generatePBSDOISaleNumber(params) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/getPbsDoiSaleNumber`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public delotAllICNS(data) {
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/lot/delotICN`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public transferLotWithContract(data) {
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/lot/transferLotWithContract`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public addToFavourites(lotId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/auctions/addfavourites/${lotId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public removeFromFavorite(lotId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "DELETE",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/auctions/removeFavourite/${lotId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAllFavourites() {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/auctions/favourites`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  /**
   * Store Front APIs
   */

  public saveSalesPBSDOI(data) {
    let header = authHeader();
    let apiParam = {
      name: "salesPBSDOI",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: ``,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public getSalesPBSDOI(saleId) {
    let header = authHeader();
    let apiParam = {
      name: "salesPBSDOI",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/${saleId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateSalesPBSDOI(saleId, data) {
    let header = authHeader();
    let apiParam = {
      name: "salesPBSDOI",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/${saleId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveLotProperty(data) {
    let params = {};
    let header = authHeader();
    let apiParam = {
      name: "storefront",
      method: "PATCH",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/lot`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public cloneLotProperty(lotId) {
    let params = {};
    let header = authHeader();
    let apiParam = {
      name: "storefront",
      method: "POST",
      params: params,
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/clone-lot/${lotId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getStoreFrontProperty(lotId) {
    let header = authHeader();
    let apiParam = {
      name: "storefront",
      method: "GET",
      params: {},
      headers: header,
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

  public copySaleForSalePBSDOI(lotId) {
    let params = {};
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: params,
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/copyPbsDoiSales/${lotId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getLotsForSalePBSDOI(saleId, params) {
    let apiParam = {
      name: "salesPBSDOI",
      method: "GET",
      params: params,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/getLotsForSalePBSDOI/${saleId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public deletePropertyPBSDOI(lotId) {
    let apiParam = {
      name: "storefront",
      method: "DELETE",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/lot/${lotId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public finalizeLot(lotId) {
    let header = authHeader();
    let apiParam = {
      name: "storefront",
      method: "POST",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/finalize-lot/${lotId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public searchSalesOrLot(saleOrLotNumber) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/searchSalesOrLot/${saleOrLotNumber}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public removeFeaturedItem(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "PATCH",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/removeFeaturedItem/${data}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public addToFeaturedItems(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/addToFeaturedItem/${data.id}/${data.type}/${data.userType}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public terminateSalesLot(data: LotTerminationDTO) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/lot/terminate`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public extendSalesLot(data: LotExtensionDTO) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/lot/extend`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getFleetItems(data?: any) {
    let apiParam = {
      name: "sales",
      method: "POST",
      params: data?.params,
      headers: authHeader(),
      body: data,
      suffixURL: `/fleetList`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateFleetItems(data?: any) {
    let apiParam = {
      name: "sales",
      method: "POST",
      params: data?.params,
      headers: authHeader(),
      body: data,
      suffixURL: `/updateFleetFMSLot`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public defaultContractAndBidder(data: number[], bidderId: number) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/contract/default/bidder/${bidderId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateSales(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/update`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public sendToGSAAuction(data?: any) {
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: authHeader(),
      body: data,
      suffixURL: `/sendToAGsaAuctions`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPaymentDetails(data) {
    let header = authHeader();
    let apiParam = {
      name: "payments",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/getPaymentsByContractId`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public addPayments(data, bidderId) {
    let apiParam = {
      name: "pay",
      method: "POST",
      params: {},
      headers: authHeader(),
      body: data,
      suffixURL: `/contracts/${bidderId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public liquidatedDamagePayment(data, bidderId) {
    let apiParam = {
      name: "pay",
      method: "POST",
      params: {},
      headers: authHeader(),
      body: data,
      suffixURL: `/liquidatedDamages/${bidderId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateContract(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/contract/update`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getManangeRegistersList(data) {
    let header = authHeader();
    let apiParam = {
      name: "registers",
      method: "POST",
      params: data.params,
      headers: header,
      body: data,
      suffixURL: `/registerSaleDetail`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBidderPaymentHistory(data, bidderId) {
    let header = authHeader();
    let apiParam = {
      name: "payments",
      method: "POST",
      params: data.params,
      headers: header,
      body: data,
      suffixURL: `/bidderPaymentHistory/${bidderId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public getPaymentDetailsByRegisterId(registerId) {
    let header = authHeader();
    let apiParam = {
      name: "payments",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/getPaymentsByRegisterId/${registerId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getRegisterDetails(registerId) {
    let header = authHeader();
    let apiParam = {
      name: "registers",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/register/getRegisterByRegisterId/${registerId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public getBidderTransactions(data, registerId) {
    let header = authHeader();
    let apiParam = {
      name: "payments",
      method: "POST",
      params: data.params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/getBidderTransactions/${registerId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateRegister(data) {
    let header = authHeader();
    let apiParam = {
      name: "registers",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/register/updateRegister`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public getContractRefundDetails(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: data.params,
      headers: header,
      body: data,
      suffixURL: `/contract/refund-details`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public getTradeList(params, body) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: params,
      headers: header,
      body: body,
      suffixURL: `/contract/my-trades`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public initiateRefund(data) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "PATCH",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/contract/refund`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public fetchContractDetailsData(contractId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/contract/${contractId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public payMyTrades(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/bidder/pay`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPaymentConfirmation(paymentId) {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/payment/${paymentId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPropertySummaryGrouped(registerId) {
    let header = authHeader();
    let apiParam = {
      name: "payments",
      method: "POST",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/getGroupedPropertySummary/${registerId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public countRefundChargebacksLiquidated() {
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/contract/count-refund-chargebacks-liquidated`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public updateItems(data) {
    let apiParam = {
      name: "sales",
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

  public getBidderPurchaseHistory(userName, data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "sales",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: `/payment/bidderpurchasehistory/${userName}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveRefund(data) {
    let header = authHeader();
    let apiParam = {
      name: "refund",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: ``,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public submitRefund(contractId, data) {
    let header = authHeader();
    let apiParam = {
      name: "refund",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/submit/${contractId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public cancelRefund(contractId) {
    let header = authHeader();
    let apiParam = {
      name: "refund",
      method: "POST",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/cancel/${contractId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public downloadBidderPurchaseHistory(userName) {
    let apiParam = {
      name: "sales",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/purchase-history/${userName}/download`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateRecordChargeBack(data, bidderId) {
    let apiParam = {
      name: "pay",
      method: "POST",
      params: {},
      headers: authHeader(),
      body: data,
      suffixURL: `/recordChargeback/${bidderId}`,
      baseURL: this.baseURL,
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
      name: "payments",
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
  public downloadRefundRorReport(registerId) {
    let header = authHeader();
    let apiParam = {
      name: "auth",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/reports/refundror/${registerId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "blob",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public downloadRorReport(registerId) {
    let header = authHeader();
    let apiParam = {
      name: "auth",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/reports/ror/${registerId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "blob",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getRefundSummaryByRegisterId(registerId) {
    let header = authHeader();
    let apiParam = {
      name: "refund",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/summary/${registerId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
