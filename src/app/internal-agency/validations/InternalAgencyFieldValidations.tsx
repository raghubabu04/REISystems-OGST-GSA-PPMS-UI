export function isEmptyCheck(val) {
  return !val || 0 === val.length;
}

export function trimString(val) {
  val = val.replace(/\s/g, "");
  return val;
}

export function validateRemarks(remarks) {
  let validation = {
    isInvalid: false,
    validationError: "",
    remarks: remarks,
  };

  let htmlTags = [
    "<SCRIPT>",
    "<script>",
    "HREF",
    "href",
    "<P>",
    "<p>",
    "<BR>",
    "<br>",
    "<",
    ">",
    "+",
    "=",
  ];

  if (isEmptyCheck(remarks) || remarks === "") {
    validation.isInvalid = true;
    validation.validationError = "Remarks is Required.";
    validation.remarks = remarks;
    return validation;
  }

  for (let i = 0; i < htmlTags.length; i++) {
    if (remarks.includes(htmlTags[i])) {
      remarks = remarks.replace(htmlTags[i], " ");
    }
  }
  remarks = remarks.replace("'", ".");

  validation.remarks = remarks;
  return validation;
}

export function validatelocalScreeningDays(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
    value: value,
  };
  if (!/^[1-9]*$/.test(value) || !/^\d+$/.test(value)) {
    if (/^[^0-9]+$/.test(value)) {
      validation.isInvalid = true;
      validation.validationError =
        "Local Screening Days can contain only numbers.";
    } else if (/^[0]*$/.test(value) && !isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError =
        "Local Screening Days must be greater than zero.";
      validation.value = value;
    }
  }
  return validation;
}

export function validateInternalScreeningDays(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
    value: value,
  };
  if (value.length === 0) {
    validation.isInvalid = true;
    validation.validationError = "Internal Screening Days is Required.";
  } else if (!/^[1-9]*$/.test(value) || !/^\d+$/.test(value)) {
    if (/^[^0-9]+$/.test(value)) {
      validation.isInvalid = true;
      validation.validationError =
        "Internal Screening Days can contain only numbers.";
    } else if (/^[0]*$/.test(value) && !isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError =
        "Internal Screening Days must be greater than zero.";
      validation.value = value;
    }
  }
  return validation;
}

export function validateInternalBeginDate(value, isRequired) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };

  if (isRequired && isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "Internal Begin Date is Required.";
    return validation;
  }
  return validation;
}

export function validateInternalAgencyCode(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
    internalAgencyCode: value,
  };
  if (value.length === 0) {
    validation.isInvalid = true;
    validation.internalAgencyCode = "";
    validation.validationError = "Internal Agency Code is Required.";
  } else if (value.length !== 2) {
    validation.isInvalid = true;
    validation.internalAgencyCode = "";
    validation.validationError =
      "Internal Agency code should be two AlphaNumeric.";
  }
  return validation;
}

export function validateAbbreviatedAgency(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
    value: value,
  };
  if (value.length === 0) {
    validation.isInvalid = true;
    validation.value = "";
    validation.validationError = "Abbreviated Agency Name is Required.";
  } else if (!/^[a-zA-Z0-9]{1,4}$/.test(value)) {
    validation.isInvalid = true;
    validation.validationError =
      "Abbreviated Agency Name can contain only AlphaNumeric.";
  }
  return validation;
}
