import { validateJulianDate } from "../../../../ui-kit/components/validations/FieldValidations";

it("validate julian date same value", () => {
  let current = "0191";
  let value = "0191";
  let test = validateJulianDate(current, value);
  expect(test.isInvalid).toBeFalsy();
});

it("validate julian date value is greater", () => {
  let current = "0191";
  let value = "0193";
  let test = validateJulianDate(current, value);
  expect(test.isInvalid).toBeTruthy();
});

it("validate julian date value is less", () => {
  let current = "0191";
  let value = "0190";
  let test = validateJulianDate(current, value);
  expect(test.isInvalid).toBeFalsy();
});

it("validate julian date when year is 9 and current is 0", () => {
  let current = "0001";
  let value = "9365";
  let test = validateJulianDate(current, value);
  expect(test.isInvalid).toBeFalsy();
});

it("validate julian date when year is greater than 0 years", () => {
  let current = "0001";
  let value = "8365";
  let test = validateJulianDate(current, value);
  expect(test.isInvalid).toBeTruthy();
});

it("validate julian date when value in future with year change", () => {
  let current = "2355";
  let value = "3001";
  let test = validateJulianDate(current, value);
  expect(test.isInvalid).toBeTruthy();
});

it("validate julian date when value value year is zero and current value is greater than 0", () => {
  let current = "1001";
  let value = "0364";
  let test = validateJulianDate(current, value);
  expect(test.isInvalid).toBeFalsy();
});

it("validate julian date when value value year is zero and current value is greater than 0 for true", () => {
  let current = "1044";
  let value = "0364";
  let test = validateJulianDate(current, value);
  expect(test.isInvalid).toBeTruthy();
});

it("validate julian date more than 30 less", () => {
  let current = "0191";
  let value = "0160";
  let test = validateJulianDate(current, value);
  console.log(test);
  expect(test.isInvalid).toBeTruthy();
});
