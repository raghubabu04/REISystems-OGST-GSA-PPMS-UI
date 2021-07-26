import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";

export function isEmptyCheck(val) {
  return !val || 0 === val.length;
}

export function validateCampaignName(value: string) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "Campaign name must be given";
  } else if (!/^[a-zA-Z]$/.test(value?.charAt(0))) {
    validation.isInvalid = true;
    validation.validationError =
      "Campaign name cannot start with Special Character, Number, or a Space";
  } else if (!/^[A-Z]$/.test(value?.charAt(0))) {
    validation.isInvalid = true;
    validation.validationError =
      "Campaign name first letter should be a upper case";
  } else if (value.includes("  ")) {
    validation.isInvalid = true;
    validation.validationError = "Multiple spaces are not allowed";
  } else if (!isEmptyCheck(value) && value.length! <= 10) {
    validation.isInvalid = true;
    validation.validationError = "Minimum length must be 10 characters";
  }
  return validation;
}

export function verifyCampaignName(value, updateCampaignDetailsState) {
  let salesApiService = new SalesApiService();

  salesApiService
    .verifyCampaignName(value)
    .then((response: any) => {
      if (response.data.doesCampaignNameExist) {
        updateCampaignDetailsState({
          campaignNameValidationMessage:
            "Campaign name already exists in the System. Please enter another Campaign Name",
          campaignNameIsInvalid: true,
        });
      } else {
        updateCampaignDetailsState({
          campaignNameValidationMessage: "",
          campaignNameIsInvalid: false,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      // return error;
    });
}

export function validateWholeNumber(number) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!/^[0-9- ]*$/.test(number)) {
    validation.isInvalid = true;
    validation.validationError = "Special characters are not allowed.";
  }
  return validation;
}
export function validateBidderFrom(from, to) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (parseInt(from) >= parseInt(to)) {
    validation.isInvalid = true;
    validation.validationError =
      "Value in 'To' field should be greater than the value in 'From' field.";
  }
  return validation;
}

export function validateEndingRangeValue(start, end) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  var startValue = parseInt(
    start.toString().replace(/,/gi, "").replace("$", "")
  );
  var endValue = parseInt(end.toString().replace(/,/gi, "").replace("$", ""));
  if (endValue < startValue || endValue === startValue) {
    validation.isInvalid = true;
    validation.validationError =
      "Ending range should be greater than the starting range";
  }
  return validation;
}

export function validateCampaignRun(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "Campaign run option must be selected";
  }
  return validation;
}

export function validateFsc(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (value?.length === 0) {
    validation.isInvalid = true;
    validation.validationError = "Federal Supply Class is required.";
  }
  return validation;
}

export function validateTemplateName(templateName: string) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(templateName)) {
    validation.isInvalid = true;
    validation.validationError = "Template name must be given";
  } else if (templateName.length < 8) {
    validation.isInvalid = true;
    validation.validationError = "Minimum length must be 8 characters";
  } else if (templateName.length > 20) {
    validation.isInvalid = true;
    validation.validationError =
      "Maximum length must be less than 20 characters";
  }
  return validation;
}

export function validateTemplateContent(templateContent: string) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(templateContent)) {
    validation.isInvalid = true;
    validation.validationError = "Template Content must be given";
  } else if (templateContent.length < 100) {
    validation.isInvalid = true;
    validation.validationError = "Minimum length must be 100 characters";
  } else if (templateContent.length > 2000) {
    validation.isInvalid = true;
    validation.validationError =
      "Maximum length must be less than 2000 characters";
  }
  return validation;
}

export function validateEmailTemplate(template) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  template = template.trim().replace(/(<([^>]+)>)/g, "");
  template = template.replace("'", ".");
  template = template.replace(/&nbsp;/gi, " ");
  template = template.replace(/&amp;/g, "&");

  if (template.length < 100 && template.trim().length !== 0) {
    validation.isInvalid = true;
    validation.validationError =
      "Custom Email Template must be 100 characters or longer";
    return validation;
  }

  if (template.length > 2000 && template.trim().length !== 0) {
    validation.isInvalid = true;
    validation.validationError =
      "Custom Email Template must be less than 2000 characters";
    return validation;
  }

  return validation;
}
