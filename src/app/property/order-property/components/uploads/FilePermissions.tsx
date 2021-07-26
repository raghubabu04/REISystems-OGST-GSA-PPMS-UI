import { Upload } from "../../../create-update-property/uploads/Upload";

export interface TNCBasicInfo {
  user?: number;
  tcn?: string;
  aacs?: any[];
  status?: any; //?
  [key: string]: any;
}

export enum FilePermissions {
  Upload,
  Download,
  EditSelf,
  EditAll,
}

const aacsMatch = (set1, set2) => {
  for (const aac in set1) {
    if (set2.includes(aac)) return true;
  }
  return false;
};

const isSasp = (auth) => {
  if (
    auth.permissions.includes("SA") &&
    auth.permissions.includes("SP") &&
    auth.permissions.includes("FF")
  ) {
    return true;
  }
  return false;
};

export const updateFilePermissions = (files, permissions, user) => {
  files.forEach((file) => {
    if (file.createdBy === "system") {
      file.protected = true;
    } else if (permissions.includes(FilePermissions.EditAll)) {
      file.protected = false;
    } else if (file.createdBy === user.emailAddress) {
      file.protected = false;
    } else {
      file.protected = true;
    }
  });
};

export const getDocFilePermissions = (
  tcnInfo: TNCBasicInfo,
  store: any,
  tcnDetails: any
) => {
  let perms: FilePermissions[] = [
    FilePermissions.Upload,
    FilePermissions.Download,
  ];

  if ((store.authentication || null) !== null) {
    let auth = store.authentication;
    if (auth.permissions.includes("SM") || auth.permissions.includes("APO")) {
      perms.push(FilePermissions.EditAll);
    }
  }
  // tcnInfo was coming as an undefined because of that if block never executed.
  // instead of using tcnInfo, I passed new tcnDetails object. Below commented out code
  // is the old implementation, which was tcnInfo always undefined.
  if (tcnDetails && tcnDetails?.tcnStatus) {
    let auth = store.authentication;
    let status = tcnDetails?.tcnStatus?.toUpperCase();
    if (
      status === "REQUESTED" &&
      (auth.permissions.includes("NU") ||
        isSasp(auth) ||
        auth.permissions.includes("AO"))
    ) {
      perms.push(FilePermissions.EditSelf);
    }
  }
  // if( (tcnInfo||null) !== null) {
  //   let aacMatch = aacsMatch(tcnInfo.aacs, store.authentications.aacs);
  //   let auth = store.authentication;

  //   let stateMatch = tcnInfo.state === auth.userLocationState;
  //   if (
  //     tcnInfo.tcnStatus === "REQUESTED" &&
  //     (tcnInfo.user === auth.user.userId ||
  //       (aacMatch && auth.permissions.includes("NUO")) ||
  //       (stateMatch && isSasp(auth)) ||
  //       auth.permissions.includes("AO"))
  //   ) {
  //     perms.push(FilePermissions.EditSelf);
  //   }
  // }
  return perms;
};
