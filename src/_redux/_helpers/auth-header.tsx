export function getToken() {
  let token = localStorage.getItem("usertoken");
  if (token) {
    return token;
  } else {
    return "";
  }
}

export function authHeader() {
  let token = getToken();
  if (token) {
    return { Authorization: "Bearer " + token };
  } else {
    return {};
  }
}

function parseJwt(token) {
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

export function getUserInfo() {
  let userInfo = null;
  const jwtToken = getToken();
  if (jwtToken) {
    try {
      userInfo = JSON.parse(parseJwt(jwtToken).usertoken);
    } catch (e) {}
  }
  return userInfo;
}

export function getTokenExpTime() {
  let expTime = null;
  const jwtToken = getToken();
  if (jwtToken) {
    try {
      expTime = JSON.parse(parseJwt(jwtToken).exp);
    } catch (e) {}
  }
  return expTime;
}

export function getSalesUserZones(): string[] {
  const zones = [];
  const userInfo = getUserInfo();
  const userAccounts = userInfo && userInfo.userZones ? userInfo.userZones : [];
  userAccounts.forEach((userRole) => {
    zones.push(userRole);
  });
  return zones.reduce((acc, val) => acc.concat(val), []);
}

export function getUserPermissions(): string[] {
  const permissions = [];
  const userInfo = getUserInfo();
  let userAccounts;
  if (userInfo && userInfo.userAccounts && userInfo.userAccounts?.length > 0) {
    userAccounts = userInfo.userAccounts;
    userAccounts.forEach((userAccount) => {
      permissions.push(userAccount.permissions.map((role) => role));
    });
  } else if (
    userInfo &&
    userInfo?.userRoles &&
    userInfo?.userRoles.length > 0
  ) {
    userAccounts = userInfo.userRoles;
    userAccounts.forEach((userRole) => {
      permissions.push(userRole);
    });
  } else {
    userAccounts = [];
  }

  return permissions.reduce((acc, val) => acc.concat(val), []);
}

export function getUserAACs(): string[] {
  const aacCodes = [];
  const userInfo = getUserInfo();
  const userAccounts =
    userInfo && userInfo.userAccounts ? userInfo.userAccounts : [];
  userAccounts.forEach((userAccount) => {
    aacCodes.push(userAccount.aacCodes.map((role) => role));
  });
  return aacCodes.reduce((acc, val) => acc.concat(val), []);
}
