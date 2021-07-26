export function addModalFormValidation(form) {
  let validateFormControlGroup = form.parentNode.parentElement
    .getElementsByClassName("modal-body")[0]
    .getElementsByClassName("form-control");
  let validation = true;

  for (let i = 0; i < validateFormControlGroup.length; i++) {
    if (
      validateFormControlGroup[i].validity &&
      !validateFormControlGroup[i].validity.valid
    ) {
      if (
        validateFormControlGroup[i].parentNode.classList.contains(
          "usa-form-group"
        )
      )
        validation = false;
      {
        validateFormControlGroup[i].parentNode.classList.add(
          "usa-form-group--error"
        );
      }

      validateFormControlGroup[i].classList.add(
        "is-invalid",
        "usa-input--error"
      );
    } else if (
      validateFormControlGroup[i].validity &&
      validateFormControlGroup[i].validity.valid &&
      validateFormControlGroup[i].required &&
      !validateFormControlGroup[i].disabled
    ) {
      validateFormControlGroup[i].classList.add("usa-input--success");
    }
  }
  return validation;
}

export function updateFieldValidations(form) {
  let validateFormControlGroup = form.parentElement.parentNode.parentElement.getElementsByClassName(
    "form-control"
  );
  let validation = true;
  for (let i = 0; i < validateFormControlGroup.length; i++) {
    if (
      validateFormControlGroup[i].validity &&
      !validateFormControlGroup[i].validity.valid
    ) {
      if (
        validateFormControlGroup[i].parentNode.classList.contains(
          "usa-form-group"
        )
      )
        validation = false;
      {
        validateFormControlGroup[i].parentNode.classList.add(
          "usa-form-group--error"
        );
      }

      validateFormControlGroup[i].classList.add(
        "is-invalid",
        "usa-input--error"
      );
    } else if (
      validateFormControlGroup[i].validity &&
      validateFormControlGroup[i].validity.valid &&
      validateFormControlGroup[i].required &&
      !validateFormControlGroup[i].disabled
    ) {
      validateFormControlGroup[i].classList.add("usa-input--success");
    }
  }
  return validation;
}
