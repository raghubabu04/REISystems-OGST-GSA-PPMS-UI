import { WrapperService } from "../wrapper.service";
import { Environment } from "../../environments/environment";
import { NuoEditUser, NuoUser } from "../../app/models/User";
import { authHeader } from "../../_redux/_helpers/auth-header";
import { SalesUserDTO } from "../../app/models/SalesUser";
import {
  BidderConfirmUserDTO,
  BidderUserDTO,
} from "../../app/models/BidderUser";
import { UserAccount, UserAccountDTO } from "../../app/models/userAccountDTO";
import { isEmptyCheck } from "../../ui-kit/components/validations/FieldValidations";

export class UserApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.USER_URL;

  public sendGroupEmails(data) {
    let apiParam = {
      name: "email",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/email/groups`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getGroupEmailUploadedItem(groupEmailId: string) {
    const apiParam = {
      name: "user",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/uploadedItems/${groupEmailId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public uploadGroupEmailItem(data: any) {
    const apiParam = {
      name: "user",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/file/upload`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async deleteGroupEmailItem(ids) {
    const apiParam = {
      name: "user",
      method: "DELETE",
      params: {},
      headers: authHeader(),
      body: ids,
      suffixURL: `/file/deleteFiles`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateGroupEmailItems(data: any) {
    const apiParam = {
      name: "user",
      method: "PATCH",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/file/updateItems`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateGroupEmailFile(data: any) {
    const apiParam = {
      name: "user",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/file/updateFile`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public mfaResetFactors(email: string) {
    let apiParam = {
      name: "userManagement",
      method: "POST",
      params: {},
      headers: { "Content-Type": "application/json" },
      body: {},
      suffixURL: `/users/reset-mfa/${email}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public registerUser(data: any) {
    let body = data.body;

    let apiParam = {
      name: "selfRegistration",
      method: "POST",
      params: {},
      headers: { "Content-Type": "application/json" },
      body: body,
      suffixURL: "/register",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  /**
   * Endpoint: http://localhost:8080/ppms/api/v1/user/nuo-register
   * @param data
   */
  public registerNuoUser(data: NuoUser) {
    const apiParam = {
      name: "userManagement",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: "/users",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public addUserAccount(userId, data: UserAccount) {
    const apiParam = {
      name: "userManagement",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/users/${userId}/user-accounts`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public editNuoUser(data: NuoEditUser) {
    const apiParam = {
      name: "userManagement",
      method: "PUT",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: "/users",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateUserAccount(data: UserAccountDTO) {
    const apiParam = {
      name: "userManagement",
      method: "PUT",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: "/users/user-accounts",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getUser(data) {
    let params = data.params;
    const apiParam = {
      name: "userManagement",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/users/${params.userAccountId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getUserAccountByAccountId(accountId) {
    const apiParam = {
      name: "userManagement",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/users/user-account/${accountId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getUserWithMultipleAccounts(data) {
    let params = data.params;
    const apiParam = {
      name: "userManagement",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/users/multiple-user-accounts/${params.userId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public activateOrDeactivateUserAccount(data) {
    let params = data.params;
    const apiParam = {
      name: "users",
      method: "PATCH",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/${params}/action`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  /**
   *
   * @param data make sure to set to {params:{userAccountId: <VALUE>}}
   */
  public getUserPermission(data) {
    let params = data.params;
    const apiParam = {
      name: "userManagement",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/users/${params.userAccountId}/user-permissions`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public lockAndUnLockUser(data) {
    let params = data.params;
    const apiParam = {
      name: "users",
      method: "PATCH",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/${params.emailId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public lockAndUnLockBidderUser(data) {
    let params = data.params;
    const apiParam = {
      name: "bidder",
      method: "PATCH",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/${params.emailId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getNuoContactForAgencyBureau(data) {
    let params = data.params;
    const apiParam = {
      name: "nuoContacts",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/${params.agencyBureauCd}/contacts`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public generateVerificationCode(data) {
    let params = data.params;

    let apiParam = {
      name: "selfRegistration",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/${params.email}/verification-code/generate`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public checkStatus(data) {
    let params = data.params;

    let apiParam = {
      name: "selfRegistration",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/${params.email}/registration-status/verify`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public verifyEmailExists(data) {
    let params = data.params;

    let apiParam = {
      name: "userManagement",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/users/${params.email}/verify-email`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public validateVerificationCode(data) {
    let body = data.body;

    let apiParam = {
      name: "selfRegistration",
      method: "POST",
      params: {},
      headers: { "Content-Type": "application/json" },
      body: body,
      suffixURL: "/verification-code/verify",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  //Does not look like its used anywhere
  public getAgencyBureau(data) {
    let agencyCode = data.params.agencyCode;

    let apiParam = {
      name: "agency",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/${agencyCode}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAgencyBureauCodesForNUO() {
    let apiParam = {
      name: "nuoContacts",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/agency-bureau-codes`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAgencyBureauCodesAndLongNameForNUO() {
    let apiParam = {
      name: "nuoContacts",
      method: "GET",
      params: { showLongName: true },
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/agency-bureau-codes`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public checkValidAgencyBureauForLoggedInNUO(agencyBureauCd) {
    let apiParam = {
      name: "nuoContacts",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/${agencyBureauCd}/verify-agency-bureau`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getUserList(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "userManagement",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: "/users",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getLeaList(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "leaUsers",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      suffixURL: "",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public downloadLeaUsersFile(data) {
    let apiParam = {
      name: "leaUsers",
      method: "POST",
      params: data.params,
      headers: authHeader(),
      body: data,
      suffixURL: `/file/download`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "blob",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public async getUserDetails() {
    let header = authHeader();
    let apiParam = {
      name: "userManagement",
      method: "GET",
      params: [],
      headers: header,

      body: {},
      suffixURL: `/users/logged-in-user-details`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getGrantPermissions() {
    let header = authHeader();
    let apiParam = {
      name: "userManagement",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: "/users/grant-permissions",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getUserProfilePermissions() {
    let header = authHeader();
    let apiParam = {
      name: "userManagement",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: "/users/user-profile-permissions",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getNUOContactsForAgencyBureauCode(agencyBureauCd) {
    let header = authHeader();
    let apiParam = {
      name: "nuoContacts",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/${agencyBureauCd}/contacts`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getApprovingOfficialByEmail(email: string) {
    let header = authHeader();
    let apiParam = {
      name: "userManagement",
      method: "GET",
      headers: header,
      params: {},
      body: {},
      suffixURL: `/users/${email}/approving-official`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getUserDetailsByEmail(email: string) {
    let header = authHeader();
    let apiParam = {
      name: "userManagement",
      method: "GET",
      headers: header,
      params: {},
      body: {},
      suffixURL: `/users/${email}/details`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  /**
   * Returns a list of Agency Bireai Codes for the user found by email.
   * results.data = array
   * @param email
   */
  public getAgencyBureauCodesByEmail(email: string) {
    let header = authHeader();
    let apiParam = {
      name: "users",
      method: "GET",
      headers: header,
      params: {},
      body: {},
      suffixURL: `/user-management/users/${email}/agency-bureau-codes`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAPOContactByZip(zipCode) {
    let header = authHeader();
    let apiParam = {
      name: "apoContacts",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/${zipCode}/contacts`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getSalesUserList(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "users",
      method: "GET",
      params: params,
      headers: header,
      body: {},
      suffixURL: "/sales",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getManageBiddersList(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "users",
      method: "POST",
      params: params,
      headers: header,
      body: data,
      suffixURL: "/bidders",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getSalesUser(data) {
    let params = data.params;
    const apiParam = {
      name: "users",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/sales/${params.userId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getAllSalesRoles() {
    let header = authHeader();
    let apiParam = {
      name: "users",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: "/sales/roles",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public registerSalesUser(data: SalesUserDTO) {
    const apiParam = {
      name: "users",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: "/sales",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getSalesUsersByRoleAndZone(params) {
    const apiParam = {
      name: "users",
      method: "GET",
      params: params,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: "/sales/zone/role",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getSalesUsersByRoleForAllZones(params) {
    const apiParam = {
      name: "users",
      method: "GET",
      params: params,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: "/sales/role",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public lockAndUnLockSalesUser(data) {
    let params = data.params;
    const apiParam = {
      name: "users",
      method: "PATCH",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/sales/${params.emailId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getSalesUserDetailsByEmail(email) {
    const apiParam = {
      name: "users",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/sales/${email}/details`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getUserPreferences(email) {
    let header = authHeader();
    let apiParam = {
      name: "userManagement",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/users/${email}/getUserPreferences`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public verifyBidderUsernameExists(userName) {
    const apiParam = {
      name: "bidders",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/verify/${userName}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBidderVersionNumber() {
    const apiParam = {
      name: "bidder",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/versionNumber`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateBidderVersionNumber(data) {
    let params = data.params;
    const apiParam = {
      name: "bidders",
      method: "PATCH",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/termsAndConditions`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public verifySsnExists(ssn) {
    const apiParam = {
      name: "bidders",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/verify/ssn/${ssn}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateWantListDocumentType(data) {
    let header = authHeader();
    let apiParam = {
      name: "userManagement",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: "/users/updateWantListDocumentType/",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public confirmBidderUser(data: BidderConfirmUserDTO) {
    const apiParam = {
      name: "bidders",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: "/addBidder",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public registerBidderUser(data: BidderUserDTO) {
    const apiParam = {
      name: "bidders",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: "/register",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBidderUser(userName) {
    const apiParam = {
      name: "bidders",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/${userName}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBidderUserById(id) {
    const apiParam = {
      name: "bidders",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/bidder/${id}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public editBidderUser(data: BidderUserDTO, userName: string) {
    const apiParam = {
      name: "bidders",
      method: "PUT",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/${userName}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public addLeaUserShippingAddress(userId, data) {
    let header = authHeader();
    let apiParam = {
      name: "user-management",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/users/${userId}/addLeaUserShippingAddress`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public resetPasswordAndNotify(email) {
    let header = authHeader();
    let apiParam = {
      name: "userManagement",
      method: "POST",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/users/reset-password/${email}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public resetPasswordForNonGSAOktaUsers(data) {
    let header = authHeader();
    let apiParam = {
      name: "userManagement",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: "/users/reset-password/",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getLeaUser(data) {
    let params = data.params;
    const apiParam = {
      name: "leaUsers",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/${params.email}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getLeaUserById(data) {
    let params = data.params;
    const apiParam = {
      name: "userManagement",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/users/getUserDetailsByUserId/${params.userId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getActionHistoryForUserObject(data) {
    let params = data.params;
    let header = authHeader();
    let apiParam = {
      name: "userActionHistory",
      method: "GET",
      params: params,
      headers: header,
      body: authHeader(),
      suffixURL: ``,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public addLeaUser(data: NuoUser) {
    const apiParam = {
      name: "leaUsers",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: "/add",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getOktaUserId(emailId: string) {
    const apiParam = {
      name: "userManagement",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/users/okta-id/${emailId}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "text",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getSecurityQuestion(email: string) {
    const apiParam = {
      name: "users",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/${email}/security-question`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "text",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public validateSecurityAnswer(data) {
    const apiParam = {
      name: "users",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/validate-security`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updatePassword(data) {
    const apiParam = {
      name: "users",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/update-password`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBidderDetails(email) {
    const apiParam = {
      name: "users",
      method: "GET",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: {},
      suffixURL: `/${email}/bidder-info`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBidderUserByEmailId(emailId) {
    let header = authHeader();
    const apiParam = {
      name: "bidders",
      method: "GET",
      params: { emailId },
      headers: header,
      body: {},
      suffixURL: `/bidderUser/byEmailId`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public getAccountsList() {
    let header = authHeader();
    let apiParam = {
      name: "userManagement",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: "/users/user-accounts",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBidderAccountsList() {
    let header = authHeader();
    let apiParam = {
      name: "userManagement",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: "/users/bidders/user-accounts",
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateUserToken(header, userAccountId) {
    let apiParam = {
      name: "userManagement",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/users/${userAccountId}/update-user-token`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getBidderUserIdsByEmailId(emailId) {
    let header = authHeader();
    const apiParam = {
      name: "bidders",
      method: "GET",
      params: { emailId },
      headers: header,
      body: {},
      suffixURL: `/getBidderUserIds/byEmailId`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public getBidderUserByUserId(bidderUsername) {
    let header = authHeader();
    const apiParam = {
      name: "bidders",
      method: "GET",
      headers: header,
      params: {},
      body: {},
      suffixURL: `/bidder-user/${bidderUsername}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public saveCreditCard(data) {
    const apiParam = {
      name: "user",
      method: "POST",
      params: {},
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: data,
      suffixURL: `/bidders/saveCreditCardInfo`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public getStoredCreditCardInfo() {
    let header = authHeader();
    const apiParam = {
      name: "users",
      method: "GET",
      headers: header,
      params: {},
      body: {},
      suffixURL: `/bidders/creditCardInfo`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public saveBidderRemarks(userName, data) {
    let header = authHeader();
    let apiParam = {
      name: "bidders",
      method: "POST",
      params: {},
      headers: header,
      body: data,
      suffixURL: `/bidderNotes/${userName}`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public getFleetUserList() {
    let header = authHeader();
    let apiParam = {
      name: "users",
      method: "GET",
      params: {},
      headers: header,
      body: {},
      suffixURL: `/fleetUsers`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
