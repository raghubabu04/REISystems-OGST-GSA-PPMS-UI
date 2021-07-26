import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { PPMSInput } from "../../ui-kit/components/common/input/PPMS-input";
import { PPMSSubmit } from "../../ui-kit/components/PPMS-submit";
import { PPMSButton } from "../../ui-kit/components/common/PPMS-button";
import { PPMSFieldset } from "../../ui-kit/components/common/form/PPMS-fieldset";
import { PPMSForm } from "../../ui-kit/components/common/form/PPMS-form";
import { PPMSSelect } from "../../ui-kit/components/common/select/PPMS-select";
import moment from "moment";
import { PPMSAddress } from "../../ui-kit/components/PPMS-address";
import PPMSLabel from "../../ui-kit/components/common/form/PPMS-label";

function SampleClass() {
  const validationMessage = {
    title: {
      required: "Title is Required",
    },
    firstName: {
      required: "First Name is Required",
    },
    lastName: {
      required: "Last Name is Required",
    },
    email: {
      required: "Email is Required",
      email: "Email is Invalid",
    },
    age: {
      required: "Age is Required",
      positive: "Age must be a positive number",
      integer: "Age must be an integer",
    },
    address: {
      address1: {
        required: "Address Line 1 is Required",
      },
      address2: {
        required: "Address Line 2 is Required",
      },
    },
    date: {
      required: "Date is Required",
      withinSelectableDays: "Date is Invalid",
    },
  };

  // form validation rules
  const validationSchema = Yup.object().shape({
    title: Yup.string().required(validationMessage.title.required),
    firstName: Yup.string().required(validationMessage.firstName.required),
    lastName: Yup.string().required(validationMessage.lastName.required),
    email: Yup.string()
      .required(validationMessage.email.required)
      .email(validationMessage.email.email),
    address: Yup.object().shape({
      address1: Yup.string().required(
        validationMessage.address.address1.required
      ),
      address2: Yup.string().required(
        validationMessage.address.address2.required
      ),
    }),
    age: Yup.number()
      .required(validationMessage.age.required)
      .integer(validationMessage.age.integer)
      .positive(validationMessage.age.positive),
    date: Yup.string()
      .required(validationMessage.date.required)
      .test(
        "withinSelectableDays",
        validationMessage.date.withinSelectableDays,
        customValidation
      ),
  });
  function customValidation(date) {
    if (date) {
      return moment(date).isValid();
    } else {
      return true;
    }
  }

  // functions to build form returned by useForm() hook
  const { register, handleSubmit, control, reset, errors } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  function onSubmit(data) {
    // display form data on success
    alert("SUCCESS!! :-)\n\n" + JSON.stringify(data, null, 4));
  }

  const options = [
    { value: "Mr", id: "mr" },
    { value: "Mrs", id: "mrs" },
    { value: "Miss", id: "miss" },
    { value: "Ms", id: "ms" },
  ];

  return (
    <div>
      <h4>React Hook Form and Schema Validation with Yup</h4>
      <div>
        <PPMSForm onSubmit={handleSubmit(onSubmit)}>
          <PPMSFieldset>
            <PPMSSelect
              name="title"
              inputRef={register}
              values={options}
              isInvalid={errors.title?.message}
              validationMessage={errors.title?.message}
              isRequired={true}
              identifierValue={"value"}
              identifierKey={"id"}
              label={"Title"}
              placeholderValue={"Select Title"}
            />
            <PPMSInput
              name="firstName"
              inputType="text"
              inputRef={register}
              id={"firstName"}
              isDisabled={false}
              isRequired={true}
              label={"First Name"}
              isInvalid={!!errors.firstName}
              validationMessage={errors.firstName?.message}
            />
            <PPMSInput
              name="lastName"
              inputType="text"
              inputRef={register}
              id={"lastName"}
              isDisabled={false}
              isRequired={true}
              label={"Last Name"}
              isInvalid={!!errors.lastName}
              validationMessage={errors.lastName?.message}
            />
            <PPMSLabel htmlFor={"address"} className={"text-secondary"}>
              {errors.address ? "Errors in Address Section" : ""}
            </PPMSLabel>
            <PPMSAddress
              address1Required={true}
              address2Required={true}
              inputRef={register}
              showAddressLine3={true}
              address1IsInvalid={!!errors.address?.address1}
              address1ValidationMessage={errors.address?.address1?.message}
              address2IsInvalid={!!errors.address?.address2}
              address2ValidationMessage={errors.address?.address2?.message}
              updateState={() => {}}
              showZipExtension={true}
            />
            <PPMSInput
              name="age"
              defaultValue={"0"}
              inputType="number"
              inputRef={register}
              id={"age"}
              isDisabled={false}
              isRequired={true}
              label={"Age"}
              isInvalid={!!errors.age}
              validationMessage={errors.age?.message}
              onChange={() => {
                console.log(errors);
              }}
            />
            <PPMSInput
              name="email"
              inputType="text"
              inputRef={register}
              id={"email"}
              isDisabled={false}
              isRequired={true}
              label={"Email"}
              isInvalid={!!errors.email}
              validationMessage={errors.email?.message}
            />
            <PPMSInput
              name="date"
              inputType="text"
              inputRef={register}
              id={"date"}
              isDisabled={false}
              isRequired={true}
              label={"Date"}
              isInvalid={!!errors.date}
              validationMessage={errors.date?.message}
            />
            <PPMSSubmit
              disabled={false}
              isLoading={false}
              variant={"primary"}
            />
            <PPMSButton id={"reset"} label={"Reset"} type={"reset"} />
          </PPMSFieldset>
        </PPMSForm>
      </div>
      <DevTool control={control} />
    </div>
  );
}

export { SampleClass };
