import { WrapperService } from "../wrapper.service";
import { Environment } from "../../environments/environment";
import { authHeader } from "../../_redux/_helpers/auth-header";

export class AuthApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.AUTH_URL;

  public getOktaUrl() {
    let apiParam = {
      name: "auth",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: "/auth/getOktaUrl",
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "text",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getOktaAuthenticationToken(sessionToken: string) {
    let apiParam = {
      name: "auth",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/auth/oktaUser/${sessionToken}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getUpdatedOktaAuthenticationToken(accountId: any) {
    let apiParam = {
      name: "auth",
      method: "GET",
      params: {},
      headers: authHeader(),
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/auth/user/${accountId}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getSecureAuthURL() {
    let apiParam = {
      name: "auth",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: "/auth/secureAuthUrl",
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "text",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getUserSessionByKey(key) {
    let apiParam = {
      name: "auth",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/auth/userSession/${key}`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "text",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public extendSession() {
    let apiParam = {
      name: "auth",
      method: "GET",
      params: {},
      headers: authHeader(),
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/auth/extendSession`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public checkSendOTP(oktaUserId: string) {
    let apiParam = {
      name: "auth",
      method: "POST",
      params: {},
      headers: {},
      body: {},
      baseURL: this.baseURL,
      suffixURL: `/okta/${oktaUserId}/forgot-password`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public verifyOTP(data) {
    let apiParam = {
      name: "auth",
      method: "POST",
      params: {},
      headers: {},
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/okta/verify-otp`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateForgotPassword(data) {
    let apiParam = {
      name: "auth",
      method: "POST",
      params: {},
      headers: {},
      body: data,
      baseURL: this.baseURL,
      suffixURL: `/okta/update-password`,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
