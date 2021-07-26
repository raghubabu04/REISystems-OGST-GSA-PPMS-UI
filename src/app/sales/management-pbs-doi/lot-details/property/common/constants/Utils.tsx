import {
  faxValidation,
  isRequiredValidation,
  phoneExtensionValidation,
  ppmsEmailValidation,
  validateFormattedFaxNumber,
  validatePhoneFax,
  zipExtensionValidation,
  zipValidation,
  validateZipStateCity,
} from "../../../../../../../ui-kit/components/validations/FieldValidations";
import { ExternalApiService } from "../../../../../../../api-kit/external/external-api-service";
import {
  formatExtension,
  formatPhone,
} from "../../../../../../../ui-kit/utilities/FormatUtil";
import { CommonApiService } from "../../../../../../../api-kit/common/common-api.service";
import { isEmpty } from "lodash";

let externalService = new ExternalApiService();
let commonApiService = new CommonApiService();

export const validateCityStateZip = (
  state: any,
  errorMessageValid: any,
  errorMessage: any
) => {
  let validation: any = {
    isInvalid: errorMessageValid,
    validationError: errorMessage,
  };
  state.propertyDetail.validation.address.zip = validation;
  return state;
};

export const propertyDetailValidate = (type, value, state) => {
  switch (type) {
    case "lot-number":
      state.lot.validation.lotNumber = isRequiredValidation(
        "Lot Number",
        value
      );
      break;
    case "property-name":
      state.propertyDetail.validation.propertyName = isRequiredValidation(
        "Property Name",
        value
      );
      break;
    case "property-description":
      state.propertyDetail.validation.description = isRequiredValidation(
        "Description",
        value
      );
      break;
    case "property-category":
      state.propertyDetail.validation.category = isRequiredValidation(
        "Category",
        value.auctionCategoryCode
      );
      if (state.sales.sellingAgency === "DOI") {
        state.propertyDetail.validation.fsc = isRequiredValidation(
          "Category",
          value.auctionCategoryCode
        );
      }
      break;
    case "fsc":
      state.propertyDetail.validation.fsc = isRequiredValidation(
        "FSC Code",
        value
      );
      break;
    case "fscDoi":
      state.propertyDetail.validation.fsc = isRequiredValidation(
        "FSC Code",
        value.code
      );
      break;
    case "address-1":
      state.propertyDetail.validation.address.addressLine1 = isRequiredValidation(
        "Address Line 1",
        value
      );
      break;
    case "city":
      state.propertyDetail.validation.address.city = isRequiredValidation(
        "City",
        value
      );
      break;
    case "state":
      state.propertyDetail.validation.address.state = isRequiredValidation(
        "State",
        value
      );
      break;
    case "zip":
      if (value && value.length === 5) {
        const cityToVerify = state.propertyDetail.data.address.city;
        const stateToVerify = state.propertyDetail.data.address.state;
        if (cityToVerify && stateToVerify) {
          commonApiService
            .getZipCode(value)
            .then((response: any) => {
              state.propertyDetail.validation.address.zip = validateZipStateCity(
                response.data,
                cityToVerify,
                stateToVerify
              );
            })
            .catch((error) => {
              console.log(error);
              return error;
            });
        }
      } else {
        state.propertyDetail.validation.address.zip = zipValidation(
          value,
          true
        );
      }
      break;
    case "zip2":
      state.propertyDetail.validation.address.addressLine2 = zipExtensionValidation(
        value
      );
      break;
    case "latitude":
      state.propertyDetail.validation.latitude = isRequiredValidation(
        "Latitude",
        value
      );
      break;
    case "longitude":
      state.propertyDetail.validation.longitude = isRequiredValidation(
        "Longitude",
        value
      );
      break;
  }
  return state;
};

export const propertyDetailUpdate = (type, value, state) => {
  switch (type) {
    case "case-number":
      state.propertyDetail.data.caseNumber = value;
      break;
    case "property-name":
      state.propertyDetail.data.propertyName = value;
      break;
    case "property-description":
      state.propertyDetail.data.description = value;
      break;
    case "property-category":
      state.propertyDetail.data.category = value;
      state.propertyDetail.validation.fsc.isDisabled = false;
      break;
    case "fscDoi":
      state.propertyDetail.data.fscDoi = value;
      break;
    case "fsc":
      state.propertyDetail.data.fsc = value.code;
      break;
    case "address-1":
      state.propertyDetail.data.address.addressLine1 = value;
      break;
    case "address-2":
      state.propertyDetail.data.address.addressLine2 = value;
      break;
    case "address-3":
      state.propertyDetail.data.address.addressLine3 = value;
      break;
    case "city":
      state.propertyDetail.data.address.city = value;
      break;
    case "state":
      state.propertyDetail.data.address.state = value;
      break;
    case "zip":
      state.propertyDetail.data.address.zip = value;
      break;
    case "zip2":
      state.propertyDetail.data.address.zip2 = value;
      break;
    case "lat-long":
      state.propertyDetail.data.latitude = value.latitude;
      state.propertyDetail.data.longitude = value.longitude;
      break;
    case "ifb-number":
      state.propertyDetail.data.ifb = value.replace(/[^0-9]/g, "");
      break;
    case "urls":
      state.propertyDetail.data.urls = value;
      break;
  }
  return state;
};

export const pocValidate = (type, value, state) => {
  switch (type) {
    case "firstName":
      state.poc.validation.firstName = isRequiredValidation(
        "First Name",
        value
      );
      break;
    case "lastName":
      state.poc.validation.lastName = isRequiredValidation("Last Name", value);
      break;
    case "phoneNumber":
      state.poc.validation.phone = validatePhoneFax(value);
      break;
    case "phoneExtension":
      state.poc.validation.phoneExtension = phoneExtensionValidation(value);
      break;
    case "fax":
      state.poc.validation.fax = faxValidation(value);
      break;
    case "emailAddress":
      state.poc.validation.email = ppmsEmailValidation(value, true);
      break;
  }
  return state;
};

export const pocUpdate = (type, value, state) => {
  switch (type) {
    case "firstName":
      state.poc.data.firstName = value;
      break;
    case "middleName":
      state.poc.data.middleName = value;
      break;
    case "lastName":
      state.poc.data.lastName = value;
      break;
    case "phoneNumber":
      state.poc.data.phone = value;
      break;
    case "phoneExtension":
      state.poc.data.phoneExtension = value;
      break;
    case "fax":
      state.poc.data.fax = value;
      break;
    case "emailAddress":
      state.poc.data.email = value;
      break;
  }
  return state;
};

export const checkValidation = (state) => {
  propertyDetailValidate("lot-number", state.lot.data.lotNumber, state);

  propertyDetailValidate(
    "case-number",
    state.propertyDetail.data.caseNumber,
    state
  );

  propertyDetailValidate(
    "property-name",
    state.propertyDetail.data.propertyName,
    state
  );
  propertyDetailValidate(
    "property-description",
    state.propertyDetail.data.description,
    state
  );
  propertyDetailValidate(
    "property-category",
    state.propertyDetail.data.category,
    state
  );
  if (state.sales.sellingAgency === "DOI") {
    propertyDetailValidate("fscDoi", state.propertyDetail.data.fscDoi, state);
  } else {
    propertyDetailValidate("fsc", state.propertyDetail.data.fsc, state);
  }
  propertyDetailValidate(
    "address-1",
    state.propertyDetail.data.address.addressLine1,
    state
  );
  propertyDetailValidate(
    "address-2",
    state.propertyDetail.data.address.addressLine2,
    state
  );
  propertyDetailValidate(
    "address-3",
    state.propertyDetail.data.address.addressLine3,
    state
  );
  propertyDetailValidate("city", state.propertyDetail.data.address.city, state);
  propertyDetailValidate(
    "state",
    state.propertyDetail.data.address.state,
    state
  );
  propertyDetailValidate("zip", state.propertyDetail.data.address.zip, state);
  propertyDetailValidate("lat", state.propertyDetail.data.latitude, state);
  propertyDetailValidate("long", state.propertyDetail.data.longitude, state);
  propertyDetailValidate("ifb-number", state.propertyDetail.data.ifb, state);
  propertyDetailValidate(
    "longitude",
    state.propertyDetail.data.longitude,
    state
  );
  propertyDetailValidate("latitude", state.propertyDetail.data.latitude, state);
  pocValidate("firstName", state.poc.data.firstName, state);
  pocValidate("lastName", state.poc.data.lastName, state);
  pocValidate("phoneNumber", state.poc.data.phone, state);
  pocValidate("phoneExtension", state.poc.data.phoneExtension, state);
  pocValidate("fax", state.poc.data.fax, state);
  pocValidate("emailAddress", state.poc.data.email, state);

  return state;
};

export const checkForValidity = (object) => {
  let inValidObject = { isInvalid: false, validationError: "" };
  Object.keys(object).every((key) => {
    let thisObject = object[key];
    if (thisObject?.isInvalid === true) {
      inValidObject = thisObject;
      return false;
    }
    return true;
  });
  return inValidObject;
};

export const validity = (state) => {
  let valid = false;
  let invalidMessage = "";
  let checkPD = checkForValidity(state.propertyDetail.validation);
  if (!checkPD?.isInvalid) {
    let checkAD = checkForValidity(state.propertyDetail.validation.address);
    if (!checkAD?.isInvalid) {
      let checkPOC = checkForValidity(state.poc.validation);
      if (!checkPOC.isInvalid) {
        valid = true;
      } else {
        invalidMessage = checkPOC.validationError;
      }
    } else {
      invalidMessage = checkAD.validationError;
    }
  } else {
    invalidMessage = checkPD.validationError;
  }
  return { valid: valid, invalidMessage: invalidMessage };
};

export const updateStateValues = (state, response) => {
  state.propertyDetail.data.caseNumber = response?.caseNumber;
  state.propertyDetail.data.propertyName = response?.itemName;
  state.propertyDetail.data.description = response?.itemDescription;
  let categoryCode = {
    code: response?.fscCode,
    auctionCategoryCode: response?.categoryCode,
  };
  console.log({ categoryCode });
  state.propertyDetail.data.category = categoryCode;
  state.propertyDetail.data.fsc = response?.fscCode;
  state.propertyDetail.data.fscDoi = categoryCode;
  state.propertyDetail.validation.fsc.isDisabled = categoryCode.code
    ? false
    : true;
  state.propertyDetail.data.address.addressLine1 =
    response?.propertyLocationDTO?.addressLine1;
  state.propertyDetail.data.address.addressLine2 =
    response?.propertyLocationDTO?.addressLine2;
  state.propertyDetail.data.address.addressLine3 =
    response?.propertyLocationDTO?.addressLine3;
  state.propertyDetail.data.address.city = response?.propertyLocationDTO?.city;
  state.propertyDetail.data.address.state =
    response?.propertyLocationDTO?.state;
  state.propertyDetail.data.address.zip =
    response?.propertyLocationDTO?.zipCode;
  state.propertyDetail.data.address.zip2 =
    response?.propertyLocationDTO?.zipExtn;
  state.propertyDetail.data.longitude =
    response?.propertyLocationDTO?.longitude;
  state.propertyDetail.data.latitude = response?.propertyLocationDTO?.latitude;
  state.propertyDetail.data.ifb = response?.ifbNumber;
  let urls = [];
  response?.lotPropertyUrlDTOs?.forEach((url) => {
    urls.push({ id: url?.id, name: url?.displayName, url: url?.url });
  });
  state.propertyDetail.data.urls = urls;
  state.poc.data.firstName = response?.pointOfContactDTO?.firstName;
  state.poc.data.lastName = response?.pointOfContactDTO?.lastName;
  state.poc.data.middleName = response?.pointOfContactDTO?.middleName;
  state.poc.data.phone = response?.pointOfContactDTO?.phone
    ? formatPhone(`${response?.pointOfContactDTO?.phone}`)
    : null;
  state.poc.data.phoneExtension = response?.pointOfContactDTO?.phoneExtension
    ? formatExtension(`${response?.pointOfContactDTO?.phoneExtension}`)
    : null;
  state.poc.data.fax = response?.pointOfContactDTO?.fax
    ? formatPhone(`${response?.pointOfContactDTO?.fax}`)
    : null;
  state.poc.data.email = response?.pointOfContactDTO?.email;
  return state;
};

export const generateValidRequest = (state) => {
  let lotPropertyURLs = [];
  state?.propertyDetail?.data?.urls?.forEach((url, index) => {
    lotPropertyURLs.push({
      sequenceNo: index,
      displayName: url?.name,
      url: url?.url,
      id: url?.id,
    });
  });
  return {
    lotId: parseInt(state?.lot?.data?.lotId),
    lotNumber: parseInt(state?.lot?.data?.lotNumber),
    salesId: parseInt(state?.sales?.saleId),
    caseNumber: state?.propertyDetail?.data?.caseNumber,
    itemName: state?.propertyDetail?.data?.propertyName,
    itemDescription: state?.propertyDetail?.data?.description,
    fscCode:
      state?.sales?.sellingAgency === "DOI"
        ? state?.propertyDetail?.data?.fscDoi?.code
        : state?.propertyDetail?.data?.fsc,
    ifbNumber: state?.propertyDetail?.data?.ifb
      ? parseInt(state?.propertyDetail?.data?.ifb)
      : null,
    categoryCode: state?.propertyDetail?.data?.category?.auctionCategoryCode,
    propertyLocationDTO: {
      addressLine1: state?.propertyDetail?.data?.address?.addressLine1,
      addressLine2: state?.propertyDetail?.data?.address?.addressLine2,
      addressLine3: state?.propertyDetail?.data?.address?.addressLine3,
      zipCode: state?.propertyDetail?.data?.address?.zip,
      city: state?.propertyDetail?.data?.address?.city,
      state: state?.propertyDetail?.data?.address?.state,
      zipExtn: state?.propertyDetail?.data?.address?.zip2,
      latitude: state?.propertyDetail?.data?.latitude,
      longitude: state?.propertyDetail?.data?.longitude,
    },
    pointOfContactDTO: {
      firstName: state?.poc?.data?.firstName,
      middleName: state?.poc?.data?.middleName,
      lastName: state?.poc?.data?.lastName,
      email: state?.poc?.data?.email,
      phone: state?.poc?.data?.phone
        ? parseInt(
            state?.poc?.data?.phone
              ?.toString()
              .replaceAll(/[() -]+/g, "")
              .trim()
          )
        : null,
      fax: state?.poc?.data?.fax
        ? parseInt(
            state?.poc?.data?.fax
              ?.toString()
              .replaceAll(/[() -]+/g, "")
              .trim()
          )
        : null,
      phoneExtension: state?.poc?.data?.phoneExtension
        ? state.poc.data.phoneExtension
            .toString()
            .replace(/[() -]+/g, "")
            .trim()
        : null,
    },
    lotPropertyUrlDTOs: lotPropertyURLs,
  };
};

export const generateCoordinatesCall = (location: string) => {
  let param = {
    location: `${location}`,
  };
  return externalService.getLocationCoordinates(param);
};

export const formatLotNumber = (value, spaces) => {
  let slice = spaces - value.length === 0 ? 0 : spaces - value.length;
  let subStr =
    value.length !== spaces
      ? new Array(spaces).join("0").slice(slice * -1)
      : "";
  return subStr + value;
};
