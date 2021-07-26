export function validateEmailText(text) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  text = text?.replace(/(<([^>]+)>)/g, "");
  text = text?.replace("'", ".");
  text = text?.replace(/&nbsp;/gi, " ");
  text = text?.replace(/&amp;/g, "&");

  if (text?.length == 0) {
    validation.isInvalid = true;
    validation.validationError = "Email text is required";
    return validation;
  }

  if (text?.length < 100 && text?.length !== 0) {
    validation.isInvalid = true;
    validation.validationError =
      "Email Text must be 100 characters or longer";
    return validation;
  }

  if (text?.length > 5000 && text?.length !== 0) {
    validation.isInvalid = true;
    validation.validationError =
      "Email Text must be less than 5000 characters";
    return validation;
  }

  return validation;
}

export function validateSubjectLine(text) {
  let validation = {
    isInvalid: false,
    validationError: "",
  }

  if (text.length == 0) {
    validation.isInvalid = true;
    validation.validationError = "Subject line is required";
    return validation;
  }


  if (text.length < 10 && text.trim().length !== 0) {
    validation.isInvalid = true;
    validation.validationError = "Subject Line must be 10 characters or longer.";
    return validation;
  }

  if (text.length > 100 && text.trim().length !== 0) {
    validation.isInvalid = true;
    validation.validationError = "Subject Line must be less than 100 characters.";
    return validation;
  }
  return validation;
}
