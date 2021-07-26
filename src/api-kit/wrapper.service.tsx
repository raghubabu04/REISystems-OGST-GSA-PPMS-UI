import axios from "axios";
import { BatchRecorder, ExplicitContext, jsonEncoder, Tracer } from "zipkin";
import { HttpLogger } from "zipkin-transport-http";
import { Environment } from "../environments/environment";

//create the recorder for the tracer
const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: "https://zipkin-collector.mgmt-ppm.fcs.gsa.gov/api/v2/spans", // Required
    jsonEncoder: jsonEncoder.JSON_V2, // JSON encoder to use. Optional (defaults to JSON_V1)
    httpInterval: 1000, // How often to sync spans. Optional (defaults to 1000)
    timeout: 1000, // Timeout for HTTP Post. Optional (defaults to 0)
    maxPayloadSize: 0, // Max payload size for zipkin span. Optional (defaults to 0)
  }),
});

const ctxImpl = new ExplicitContext();

//define the tracer
const tracer = new Tracer({
  recorder,
  ctxImpl, // this would typically be a CLSContext or ExplicitContext
  localServiceName:
    "UI-" + (process.env.ENVIRONMENT || Environment.ENVIRONMENT),
});

const wrapAxios = require("zipkin-instrumentation-axiosjs");

//wrap axios with zipkin
const zipkinAxios = wrapAxios(axios, { tracer });

export interface ApiParameters {
  name: string;
  method: any;
  headers: { [key: string]: string };
  params: { [key: string]: any };
  suffixURL: string;
  baseURL: string;
  body: { [key: string]: any };
  timeout: number;
  withCredentials: boolean;
  responseType: any;
  responseEncoding: string;
}

const onSuccess = (response: any) => {
  return Promise.resolve(response);
};

const onError = (error: any) => {
  console.log(error);
  if (error.response) console.log("Server Side Error: " + error.response);
  else console.error("Request Error:", error.message);
  return Promise.reject(error.response || error.message);
};

export class WrapperService {
  public APIs: any = {
    actionHistory: "/api/v1/action-history",
    userActionHistory: "/api/v1/users/action-history",
    agency: "/api/v1/agency",
    apoContacts: "/api/v1/apo-contacts",
    auth: "/api/v1",
    auctionCategories: "/api/v1/auction-categories",
    bidders: "/api/v1/users/bidders",
    country: "/api/v1/country",
    declaredDisasters: "/api/v1/declared-disasters",
    downloadFile: "/api/v1/downloadFile",
    foreigngiftFscCodes: "/api/v1/foreign-gift-fsc-codes",
    foreignGifts: "/api/v1/foreignGifts",
    fscCodes: "/api/v1/fscCodes",
    pbsFSCCodes: "api/v1/pbs-fsc-codes",
    doiFSCCodes: "api/v1/getFSCsByAuctionCategory",
    holidays: "/api/v1/holidays",
    icnRequest: "/api/v1/property",
    internal_screening: "/api/v1/internal-screening",
    internalAgency: "/api/v1/internalAgency",
    internalScreening: "/api/v1/internalScreening",
    itemCategories: "api/v1/itemCategories",
    notification: "/api/v1/notification",
    nuoContacts: "/api/v1/nuo-contacts",
    presidents: "/api/v1/presidents",
    property: "/api/v1/property",
    propertyActionHistory: "/api/v1/property/action-history",
    propertyAgencyContact: "api/v1/propertyAgencyContact",
    regions: "/api/v1/regions",
    sales: "/api/v1/sales",
    auctions: "api/v1/auctions",
    salesActionHistory: "/api/v1/sales/action-history",
    auctionsActionHistory: "api/v1/auctions/action-history",
    salesRegions: "/api/v1/sales-regions",
    salesPBSDOI: "/api/v1/salesPBSDOI",
    selfRegistration: "/api/v1/self-registration",
    specialDescription: "/api/v1",
    state: "/api/v1/state",
    storage: "/api/v1/storage",
    storefront: "/api/v1/store-front",
    unit: "/api/v1/list",
    user: "/api/v1/user",
    userManagement: "/api/v1/user-management",
    users: "/api/v1/users",
    wantList: "/api/v1/wantList",
    weaponTypes: "/api/v1/weaponTypes",
    zipcode: "api/v1/zipcode",
    zones: "/api/v1/zones",
    leaUsers: "/api/v1/users/lea",
    annualInventory: "/api/v1/annualInventory",
    inventory: "/api/v1/inventory",
    bidder: "/api/v1/users/bidder",
    bid: "/api/v1/bid",
    lea: "/api/v1/lea",
    state3040Report: "/api/v1/state3040Report",
    email: "/api/v1",
    auctionBidder: "/api/v1/bidder",
    fleet: "/api/v1/fleet",
    payments: "/api/v1/payments",
    registers: "/api/v1/registers",
    pay: "/api/v1/pay",
    refund: "/api/v1/refund",

  };
  public httpCall(apiParam: ApiParameters, authenticatedCall: boolean = false) {
    const middleURL = apiParam.name ? this.APIs[apiParam.name] : "";
    const suffixURL = apiParam.suffixURL || "";
    return zipkinAxios
      .request({
        baseURL: apiParam.baseURL,
        url: `${middleURL}${suffixURL}`,
        method: apiParam.method,
        params: apiParam.params,
        data: apiParam.body,
        headers: apiParam.headers,
        timeout: apiParam.timeout,
        responseType: apiParam.responseType,
      })
      .then(onSuccess)
      .catch(onError);
  }
}
