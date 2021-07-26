import { WrapperService } from "../wrapper.service";
import { Environment } from "../../environments/environment";
import { authHeader } from "../../_redux/_helpers/auth-header";

export class CommonApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.COMMON_URL;

  public async changeInternalAgencyStatus(agencyCode) {
    let ac = agencyCode.agencyCode;
    let header = authHeader();

    let apiParam = {
      name: "changeInternalAgencyStatus",
      method: "PATCH",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/${ac}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async deleteInternalAgency(agencyCode) {
    let ac = agencyCode.agencyCode;
    let apiParam = {
      name: "internalAgency",
      method: "DELETE",
      params: {},
      headers: authHeader(),
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/delete/${ac}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveInternalAgency(data) {
    let header = authHeader();
    let apiParam = {
      name: "internalAgency",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/saveInternalAgency`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getInternalAgencyList(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "internalAgency",
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
  public getActionHistoryForObject(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "actionHistory",
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

  public getInternalAgency(agencyBureau: string) {
    let header = authHeader();
    let apiParam = {
      name: "internalAgency",
      method: "GET",
      headers: header,
      params: {},
      body: {},
      suffixURL: `/${agencyBureau}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBureauNameByAgencyBureauCode(agencyCode: any) {
    let apiParam = {
      name: "agency",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/bureau/${agencyCode}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getStateList() {
    let apiParam = {
      name: "state",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/getStateList`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getCountryList() {
    let apiParam = {
      name: "country",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/list`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getCountryNameFromCode(countryCode: string) {
    let apiParam = {
      name: "country",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/${countryCode}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAllAgencyBureaus() {
    let apiParam = {
      name: "agency",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/agencyBureaus`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getStateNameFromCode(statecode: any) {
    let apiParam = {
      name: "state",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/${statecode}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBureau(data) {
    let agencyCode = data.params.agencyCode;

    let apiParam = {
      name: "agency",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/${agencyCode}/bureau`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBureauFromPropertyAgencyContact(data) {
    let agencyCode = data.params.agencyCode;

    let apiParam = {
      name: "propertyAgencyContact",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/${agencyCode}/bureau`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getContacts(aacCode: string) {
    let apiParam = {
      name: "agency",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/${aacCode}/contacts`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPropertyLocationList(aacCode: string) {
    let apiParam = {
      name: "agency",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/property-locations/${aacCode}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public deletePropertyLocationById(propertyLocationID: number) {
    let header = authHeader();
    let apiParam = {
      name: "agency",
      method: "DELETE",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/deletePropertyLocationById/${propertyLocationID}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPropertyCustodianList(aacCode: string) {
    let apiParam = {
      name: "agency",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/property-custodians/${aacCode}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public deletePropertyCustodianById(custodianId: number) {
    let header = authHeader();
    let apiParam = {
      name: "agency",
      method: "DELETE",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/deletePropertyCustodianById/${custodianId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPointOfContactList(aacCode: string) {
    let apiParam = {
      name: "agency",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/point-of-contacts/${aacCode}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public deletePointOfContactById(pocID: number) {
    let header = authHeader();
    let apiParam = {
      name: "agency",
      method: "DELETE",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/deletePointOfContactById/${pocID}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getReportingAddressList(aacCode: string) {
    let apiParam = {
      name: "agency",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/reporting-addresses/${aacCode}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public deleteReportingAddressById(reportingAddressId: number) {
    let header = authHeader();
    let apiParam = {
      name: "agency",
      method: "DELETE",
      params: {},
      headers: header,
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/deleteReportingAddressById/${reportingAddressId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAgencyAddress(data) {
    let params = data.params;
    let apiParam = {
      name: "agency",
      method: "GET",
      params: params,
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/address-contact`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAllWeaponTypes() {
    let apiParam = {
      name: "weaponTypes",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: "",
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getFSCCodes() {
    let apiParam = {
      name: "fscCodes",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: "",
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getForeignGiftFSCCodes() {
    let apiParam = {
      name: "foreigngiftFscCodes",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: "",
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getUnitList() {
    let apiParam = {
      name: "unit",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/unit-of-issues`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public downloadFile(param) {
    let apiParam = {
      name: "downloadFile",
      method: "GET",
      params: param,
      headers: {},
      body: {},
      suffixURL: ``,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "blob",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getPresignedURL(fileName: string, path: string) {
    let apiParam = {
      name: "storage",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/presignedUrl?path=${path}&fileName=${fileName}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateRepAddress(data) {
    let header = authHeader();
    let apiParam = {
      name: "agency",
      method: "PUT",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/reporting-agency-address`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveAndUpdateReportingAddress(data) {
    let header = authHeader();
    let apiParam = {
      name: "agency",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/saveReportingAddress`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveAndUpdatePropertyLocation(data) {
    let header = authHeader();
    let apiParam = {
      name: "agency",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/savePropertyLocation`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveAndUpdatePointOfContact(data) {
    let header = authHeader();
    let apiParam = {
      name: "agency",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/savePointOfContact`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveAndUpdatePropertyCustodian(data) {
    let header = authHeader();
    let apiParam = {
      name: "agency",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/savePropertyCustodian`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getItemCategories() {
    let apiParam = {
      name: "itemCategories",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: "",
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public async getPriorityCodes() {
    let header = authHeader();
    let apiParam = {
      name: "declaredDisasters",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: "",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getRegionCodes() {
    let header = authHeader();
    let apiParam = {
      name: "regions",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: "",
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
      name: "storage",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "multipart/form-data",
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

  public async getZipCode(zipCode: string) {
    let apiParam = {
      name: "zipcode",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/${zipCode}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  /**Get Zones from Common API
   *
   */
  public async getZoneSalesControlList(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "zones",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: "",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getZoneList() {
    let header = authHeader();
    let apiParam = {
      name: "zones",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: "",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getZoneRegions(zoneId: string) {
    let header = authHeader();
    let apiParam = {
      name: "salesRegions",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/zone/${zoneId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getRegionsForZones(data) {
    let apiParam = {
      name: "salesRegions",
      method: "GET",
      params: data,
      headers: authHeader(),
      body: {},
      suffixURL: `/zones`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getAllPresidents() {
    let apiParam = {
      name: "presidents",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: "",
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getHolidays(year) {
    let apiParam = {
      name: "holidays",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/${year}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getPBSFSCCodes() {
    let apiParam = {
      name: "pbsFSCCodes",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: "",
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getDOIFSCCodes() {
    let apiParam = {
      name: "doiFSCCodes",
      method: "GET",
      params: { auctionCategory: 20 },
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: "",
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getItemCategoryByCode(categoryCode) {
    let apiParam = {
      name: "itemCategories",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/${categoryCode}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAuctionCategoryByCode(categoryCode) {
    let apiParam = {
      name: "auctionCategories",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/${categoryCode}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAuctionCategories() {
    let apiParam = {
      name: "auctionCategories",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: ``,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
