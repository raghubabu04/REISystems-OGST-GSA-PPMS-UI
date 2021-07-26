import { commonConstants } from "../_constants/common.constants";
import { CommonApiService } from "../../api-kit/common/common-api.service";
import { PropertyApiService } from "../../api-kit/property/property-api-service";

export const commonActions = {
  getUnitOfIssues,
  getPriorityCodes,
  getRegionCodes,
  getHolidays,
  getAllAgencyBureaus,
  getPBSFSCCodes,
  getDOIFSCCodes,
  showManageProperties,
};

function getUnitOfIssues() {
  const commonApiService = new CommonApiService();
  return (dispatch) => {
    commonApiService
      .getUnitList()
      .then((response: any) => {
        let unitOfIssue = response.data;
        dispatch(success(unitOfIssue));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function success(unitOfIssue) {
    return {
      type: commonConstants.GET_UNIT_OF_ISSUE,
      unitOfIssue,
    };
  }
}

function showManageProperties() {
  const propertyApiService = new PropertyApiService();
  let showManageProperties: boolean = false;
  return (dispatch) => {
    propertyApiService
      .checkPropertiesForLoggedInUser()
      .then((response: any) => {
        showManageProperties = response.data;
        dispatch(success(showManageProperties));
      })
      .catch((error) => {
        console.log(error);
      });
    function success(showManageProperties) {
      return {
        type: commonConstants.SHOW_MANAGE_PROPERTIES,
        showManageProperties,
      };
    }
  };
}

function getHolidays(year) {
  const commonApiService = new CommonApiService();
  return (dispatch) => {
    commonApiService
      .getHolidays(year)
      .then((response: any) => {
        let holiday = {
          year: year,
          holidays: response.data.map((date) => {
            return new Date(date + "T00:00:00");
          }),
        };
        dispatch(success(holiday));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function success(holiday) {
    return {
      type: commonConstants.GET_HOLIDAYS,
      holiday,
    };
  }
}

function getPriorityCodes() {
  const commonApiService = new CommonApiService();
  return (dispatch) => {
    dispatch(request());
    commonApiService
      .getPriorityCodes()
      .then((response: any) => {
        let priorityCodes = response.data;
        dispatch(success(priorityCodes));
      })
      .catch((error) => {
        console.log(error);
        dispatch(failure());
      });
  };
  function request() {
    return { type: commonConstants.GET_DISASTER_CODES_REQUEST };
  }
  function success(priorityCodes) {
    return { type: commonConstants.GET_DISASTER_CODES_SUCCESS, priorityCodes };
  }
  function failure() {
    return {
      type: commonConstants.GET_DISASTER_CODES_FAILED,
      error: commonConstants.GET_DISASTER_CODES_FAILED,
    };
  }
}

function getRegionCodes() {
  const commonApiService = new CommonApiService();
  return (dispatch) => {
    dispatch(request());
    commonApiService
      .getRegionCodes()
      .then((response: any) => {
        let regionCodes = response.data;
        dispatch(success(regionCodes));
      })
      .catch((error) => {
        console.log(error);
        dispatch(failure());
      });
  };
  function request() {
    return { type: commonConstants.GET_REGION_CODES_REQUEST };
  }
  function success(regionCodes) {
    return { type: commonConstants.GET_REGION_CODES_SUCCESS, regionCodes };
  }
  function failure() {
    return {
      type: commonConstants.GET_REGION_CODES_FAILED,
      error: commonConstants.GET_REGION_CODES_FAILED,
    };
  }
}

function getAllAgencyBureaus() {
  const commonApiService = new CommonApiService();
  return (dispatch) => {
    commonApiService
      .getAllAgencyBureaus()
      .then((resp) => {
        let agencyBureaus = resp.data;
        dispatch(success(agencyBureaus));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function success(agencyBureaus) {
    return {
      type: commonConstants.GET_AGENCY_BUREAUS,
      agencyBureaus,
    };
  }
}

function getPBSFSCCodes() {
  const commonApiService = new CommonApiService();
  return (dispatch) => {
    commonApiService
      .getPBSFSCCodes()
      .then((resp) => {
        let pbsFSCCodes = resp.data;
        dispatch(success(pbsFSCCodes));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function success(pbsFSCCodes) {
    return {
      type: commonConstants.GET_PBS_FSC_CODES,
      pbsFSCCodes,
    };
  }
}

function getDOIFSCCodes() {
  const commonApiService = new CommonApiService();
  return (dispatch) => {
    commonApiService
      .getDOIFSCCodes()
      .then((resp) => {
        let doiFSCCodes = resp.data;
        dispatch(success(doiFSCCodes));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function success(doiFSCCodes) {
    return {
      type: commonConstants.GET_DOI_FSC_CODES,
      doiFSCCodes,
    };
  }
}
