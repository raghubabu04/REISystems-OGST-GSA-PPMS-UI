export class UserUtils {
  /**
   * Gets the user's permissions from session if available
   */
  static getUserPermissions(): string[] {
    const permissions = [];
    const userInfo = UserUtils.getUserInfo();

    const userAccounts =
      userInfo && userInfo.userAccounts ? userInfo.userAccounts : [];
    userAccounts.forEach((userAccount) => {
      permissions.push(userAccount.permissions.map((role) => role));
    });
    return permissions.reduce((acc, val) => acc.concat(val), []);
  }

  /**
   * Gets the user's roles from session if available
   */
  static getUserRoles(): string[] {
    const roles = [];
    const userInfo = UserUtils.getUserInfo();
    const userRoles = userInfo && userInfo.userRoles ? userInfo.userRoles : [];
    userRoles.forEach((userRole) => {
      roles.push(userRole);
    });
    return roles;
  }

  /**
   * Gets the user's zones from session if available
   */
  static getUserZones(): string[] {
    const zones = [];
    const userInfo = UserUtils.getUserInfo();
    const userZones = userInfo && userInfo.userZones ? userInfo.userZones : [];
    userZones.forEach((userZone) => {
      zones.push(userZone);
    });
    return zones;
  }

  /**
   * Gets the user's zones from session if available
   */
  static getDefaultZones(): string {
    const userInfo = UserUtils.getUserInfo();
    return userInfo.defaultZone;
  }

  static isSalesUser(): boolean {
    const userInfo = UserUtils.getUserInfo();
    return (
      userInfo &&
      (UserUtils.getUserRoles().includes("CO") ||
        UserUtils.getUserRoles().includes("SSA") ||
        UserUtils.getUserRoles().includes("SSA") ||
        UserUtils.getUserRoles().includes("SG") ||
        UserUtils.getUserRoles().includes("SFU") ||
        UserUtils.getUserRoles().includes("CLO") ||
        UserUtils.getUserRoles().includes("SMS") ||
        UserUtils.getUserRoles().includes("SCO") ||
        UserUtils.getUserRoles().includes("FMS"))
    );
  }

  static getUserAACs(): string[] {
    const aacCodes = [];
    const userInfo = UserUtils.getUserInfo();
    const userAccounts =
      userInfo && userInfo.userAccounts ? userInfo.userAccounts : [];
    userAccounts.forEach((userAccount) => {
      aacCodes.push(userAccount.aacCodes.map((role) => role));
    });
    return aacCodes.reduce((acc, val) => acc.concat(val), []);
  }

  static getUserStateCode(): string[] {
    const userInfo = UserUtils.getUserInfo();
    return userInfo.userLocationState;
  }

  static isUserApo(): boolean {
    const userInfo = UserUtils.getUserInfo();
    const userPermissions = UserUtils.getUserPermissions();
    return (
      (userInfo && userInfo.apoUser) ||
      (userPermissions && userPermissions.includes("AC"))
    );
  }

  static isUserSaspAdmin(): boolean {
    const userPermissions = UserUtils.getUserPermissions();
    return (
      userPermissions &&
      userPermissions.length >= 2 &&
      userPermissions.includes("SA") &&
      userPermissions.includes("MU")
    );
  }

  static isUserSaspWithFI(): boolean {
    const userPermissions = UserUtils.getUserPermissions();
    return (
      userPermissions &&
      userPermissions.length >= 2 &&
      userPermissions.includes("SA") &&
      userPermissions.includes("FI")
    );
  }

  static isUserPC(): boolean {
    const userPermissions = UserUtils.getUserPermissions();
    return (
      userPermissions &&
      userPermissions.length === 1 &&
      userPermissions.includes("PC")
    );
  }

  static isUserFireArmManager(): boolean {
    const userPermissions = UserUtils.getUserPermissions();
    return (
      userPermissions &&
      userPermissions.length >= 2 &&
      userPermissions.includes("FM")
    );
  }

  static isUserFF(): boolean {
    const userPermissions = UserUtils.getUserPermissions();
    return (
      userPermissions &&
      userPermissions.length >= 2 &&
      userPermissions.includes("FF")
    );
  }
  static isUserCOorSalesAdmin(): boolean {
    const userRoles = UserUtils.getUserPermissions();
    return (
      userRoles &&
      userRoles.length > 0 &&
      (userRoles.includes("CO") || userRoles.includes("SSA"))
    );
  }
  static isUserFleetExt(): boolean {
    const userRoles = UserUtils.getUserRoles();
    return userRoles && userRoles.length > 0 && userRoles.includes("FEX");
  }
  static isUserFleetAdmin(): boolean {
    const userRoles = UserUtils.getUserRoles();
    return userRoles && userRoles.length > 0 && userRoles.includes("FIA");
  }
  static isUserFleetInt(): boolean {
    const userRoles = UserUtils.getUserRoles();
    return userRoles && userRoles.length > 0 && userRoles.includes("FIN");
  }
  static isUserPBSorDOIAdmin(): boolean {
    const userRoles = UserUtils.getUserRoles();
    return userRoles && userRoles.length > 0 && userRoles.includes("SAI");
  }
  static isUserSasp(): boolean {
    const userPermissions = UserUtils.getUserPermissions();
    return (
      userPermissions &&
      userPermissions.length >= 3 &&
      userPermissions.includes("SA") &&
      userPermissions.includes("FF") &&
      userPermissions.includes("SP")
    );
  }
  static isUserSA(): boolean {
    const userPermissions = UserUtils.getUserPermissions();
    return (
      userPermissions &&
      userPermissions.length >= 3 &&
      userPermissions.includes("SA")
    );
  }
  static isUserSP(): boolean {
    const userPermissions = UserUtils.getUserPermissions();
    return (
      userPermissions &&
      userPermissions.length >= 3 &&
      userPermissions.includes("SP")
    );
  }
  static isSystemAdminUser(): boolean {
    const userPermissions = UserUtils.getUserPermissions();
    if (userPermissions && userPermissions.includes("SM")) {
      return true;
    }
    return false;
  }
  static isUsCitizen(): boolean {
    const userInfo = UserUtils.getUserInfo();
    if (userInfo?.isUsCitizen) {
      return true;
    }
    return false;
  }
  /**
  /**
   * Gets the user information stored in sessions if available
   */
  static getUserInfo() {
    let userInfo = null;
    const jwtToken = localStorage.getItem("usertoken");
    if (jwtToken) {
      try {
        userInfo = JSON.parse(UserUtils.parseJwt(jwtToken).usertoken);
      } catch (e) {}
    }
    return userInfo;
  }

  static parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  static hasPermission(permission) {
    if (permission === "APO") {
      return this.isUserApo();
    }
    return this.getUserPermissions().indexOf(permission) === -1 ? false : true;
  }

  static isUserNuo() {
    const userPermissions = UserUtils.getUserPermissions();
    if (userPermissions && userPermissions.includes("NU")) {
      return true;
    }
    return false;
  }

  //Check user rights for Foreign Gift Reporter
  static isUserFr() {
    const userPermissions = UserUtils.getUserPermissions();
    return userPermissions && userPermissions.includes("FR");
  }

  //Check user rights for SCO
  static isUserSCO() {
    const userRoles = UserUtils.getUserRoles();
    return userRoles && userRoles.includes("SCO");
  }

  static isUserFg() {
    const userPermissions = UserUtils.getUserPermissions();
    return userPermissions && userPermissions.includes("FG");
  }

  static isUserOnlyFG(): boolean {
    const userPermissions: string[] = UserUtils.getUserPermissions();
    return userPermissions.includes("FG") && userPermissions.length === 1;
  }

  static isUserHelpDesk() {
    const userPermissions = UserUtils.getUserPermissions();
    return userPermissions && userPermissions.includes("HD");
  }

  static getUserType(): string {
    return UserUtils.isUserApo()
      ? "APO"
      : UserUtils.isUserNuo()
      ? "NUO"
      : UserUtils.isSystemAdminUser()
      ? "SM"
      : "";
  }

  static getPrimaryAAC(): any {
    const userInfo = UserUtils.getUserInfo();
    const userAccounts =
      userInfo && userInfo.userAccounts ? userInfo.userAccounts : [];
    return userAccounts[0]?.primaryAAC;
  }

  static getUserTypeFromToken(): string {
    const userInfo = UserUtils.getUserInfo();
    return userInfo?.userType;
  }

  static getUserFirstNameLastName(): string {
    const userInfo = UserUtils.getUserInfo();
    return userInfo?.firstName + " " + userInfo?.lastName;
  }

  static getUserAccountId(): string {
    const userInfo = UserUtils.getUserInfo();
    const userAccounts =
      userInfo && userInfo.userAccounts ? userInfo.userAccounts : [];
    return userAccounts[0]?.accountId;
  }

  static getUserId(): bigint {
    const userInfo = UserUtils.getUserInfo();
    return userInfo?.id;
  }

  static getBidderUserName(): string {
    const userInfo = UserUtils.getUserInfo();
    return userInfo?.bidderUserName;
  }

  static getSalesUserId(): string {
    const userInfo = UserUtils.getUserInfo();
    const userAccounts = userInfo && userInfo.salesUserId;
    return userInfo?.salesUserId;
  }

  static getLoggedInSalesUserType(): string {
    const userInfo = UserUtils.getUserInfo();
    return userInfo?.salesUserType;
  }

  static getLoggedInUserEmailAddress(): string {
    const useremailInfo = UserUtils.getUserInfo();
    console.log("checking mail address", useremailInfo.userName);
    return useremailInfo?.userName;
  }

  static getLoggedInUserEmail(): string {
    const useremailInfo = UserUtils.getUserInfo();
    console.log("checking mail address", useremailInfo.emailAddress);
    return useremailInfo?.emailAddress;
  }
}
