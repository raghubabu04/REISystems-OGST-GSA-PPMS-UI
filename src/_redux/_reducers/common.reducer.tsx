import { commonConstants } from "../_constants/common.constants";
import moment from "moment";

const initState = {
  unitOfIssue: [],
  priorityCodes: [],
  regionCodes: [],
  holiday: { year: moment().year(), holidays: [] },
  agencyBureaus: [],
  pbsFSCCodes: [],
  doiFSCCodes: [],
  showManageProperties: false,
};
export function common(state = initState, action) {
  switch (action.type) {
    case commonConstants.GET_UNIT_OF_ISSUE:
      return {
        ...state,
        unitOfIssue: action.unitOfIssue,
        error: "",
      };
    case commonConstants.GET_DISASTER_CODES_SUCCESS:
      return {
        ...state,
        priorityCodes: action.priorityCodes,
      };
    case commonConstants.GET_REGION_CODES_SUCCESS:
      return {
        ...state,
        regionCodes: action.regionCodes,
      };
    case commonConstants.GET_HOLIDAYS:
      return {
        ...state,
        holiday: action.holiday,
      };
    case commonConstants.GET_AGENCY_BUREAUS:
      return {
        ...state,
        agencyBureaus: action.agencyBureaus,
        error: "",
      };
    case commonConstants.GET_PBS_FSC_CODES:
      return {
        ...state,
        pbsFSCCodes: action.pbsFSCCodes,
        error: "",
      };
    case commonConstants.GET_DOI_FSC_CODES:
      return {
        ...state,
        doiFSCCodes: action.doiFSCCodes,
        error: "",
      };
    case commonConstants.SHOW_MANAGE_PROPERTIES:
      return {
        ...state,
        showManageProperties: action.showManageProperties,
        error: "",
      };
    default:
      return {
        ...state,
      };
  }
}
