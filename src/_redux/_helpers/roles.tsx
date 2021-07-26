import { getSalesUserZones, getUserPermissions } from "./auth-header";
import { Role } from "../_constants/role.constants";

export function getRoles() {
  let roles = {};
  let permissions = getUserPermissions();
  if (permissions.length === 0) {
    roles = { isVisitor: true };
  } else {
    permissions.forEach((role, i) => {
      let foundRole = getRole(role);
      roles[Object.keys(foundRole)[0]] = Object.values(foundRole)[0];
    });
  }
  return roles;
}

export function getZones() {
  return getSalesUserZones();
}

function getRole(role) {
  switch (role) {
    case Role.AC:
      return {
        isAC: true,
      };
    case Role.AO:
      return {
        isAO: true,
      };
    case Role.MU:
      return {
        isMU: true,
      };
    case Role.NU:
      return {
        isNU: true,
      };
    case Role.RP:
      return {
        isRP: true,
      };
    case Role.SA:
      return {
        isSA: true,
      };
    case Role.SM:
      return {
        isSM: true,
      };
    case Role.IO:
      return {
        isIO: true,
      };
    case Role.IF:
      return {
        isIF: true,
      };
    case Role.IS:
      return {
        isIS: true,
      };
    case Role.FF:
      return {
        isFF: true,
      };
    case Role.SP:
      return {
        isSP: true,
      };
    case Role.PA:
      return {
        isPA: true,
      };
    case Role.S1:
      return {
        isS1: true,
      };
    case Role.S4:
      return {
        isS4: true,
      };
    case Role.VO:
      return {
        isVO: true,
      };
    case Role.CO:
      return {
        isCO: true,
      };
    case Role.SCO:
      return {
        isSCO: true,
      };
    case Role.SG:
      return {
        isSG: true,
      };
    case Role.SFU:
      return {
        isSFU: true,
      };
    case Role.CLO:
      return {
        isCLO: true,
      };
    case Role.SMS:
      return {
        isSMS: true,
      };
    case Role.SSA:
      return {
        isSSA: true,
      };
    case Role.FMS:
      return {
        isFMS: true,
      };
    case Role.FR:
      return {
        isFR: true,
      };
    case Role.FG:
      return {
        isFG: true,
      };
    case Role.FM:
      return {
        isFM: true,
      };
    case Role.FI:
      return {
        isFI: true,
      };
    case Role.PC:
      return {
        isPC: true,
      };
    case Role.COI:
      return {
        isCOI: true,
      };
    case Role.RAI:
      return {
        isRAI: true,
      };
    case Role.SAI:
      return {
        isSAI: true,
      };
    case Role.HD:
      return {
        isHD: true,
      };
    case Role.FEX:
      return {
        isFEX: true,
      };
    case Role.FIA:
      return {
        isFIA: true,
      };
    case Role.FIN:
      return {
        isFIN: true,
      };
    default:
      return {
        isVisitor: true,
      };
  }
}
