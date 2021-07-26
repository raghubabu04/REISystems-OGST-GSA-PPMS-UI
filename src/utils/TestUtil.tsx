import { act, waitFor } from "@testing-library/react";
import { HTMLAttributes, mount, ReactWrapper } from "enzyme";
import { ComponentType, ReactElement } from "react";
import { PPMSFormGroup } from "../ui-kit/components/common/form/PPMS-form-group";
import { PPMSInput } from "../ui-kit/components/common/input/PPMS-input";
import { PPMSSelect } from "../ui-kit/components/common/select/PPMS-select";
import { PPMSToggleRadio } from "../ui-kit/components/common/toggle/PPMS-toggle";
import { isEmptyCheck } from "../ui-kit/components/validations/FieldValidations";

export interface BasicValidation {
  targetValue: string;
  message?: string;
  event: "change" | "select" | "blur";
}

export interface Test {
  name: string;
  jestFn?: () => {};
}

export interface AsyncValidation extends BasicValidation {
  asyncMock?: jest.SpyInstance;
  asyncMockImplementation?: (...args: any) => any;
}

export interface DependentValidation extends AsyncValidation {
  dependentfields: DependentField[];
}

export interface TestField {
  id?: string;
  name?: string;
  label?: string;
  selectedValue?: string;
  values?: any[];
  inputType?: string;
  maxLength?: number;
  isRequired?: boolean;
  basicValidations?: BasicValidation[];
  asyncValidations?: AsyncValidation[];
  dependentValidations?: DependentValidation[];
}

export interface DependentField {
  id: string;
  message: string;
  inputType: string;
}

export interface TestComponent {
  id: string;
  generateSnapshot?: boolean;
  element: ReactElement;
  fields?: TestField[];
  tests?: Test[];
}

export interface AsycnTestComponent extends TestComponent {
  asyncMock: jest.SpyInstance;
  asyncMockImplementation: () => {};
}

export function testComponent(testConfig: TestComponent): ReactWrapper {
  let component: ReactWrapper = mount(testConfig.element);
  describe(`component: ${testConfig.id}`, () => {
    if (testConfig.generateSnapshot) {
      it("snapshot matched", () => {
        expect(component).toMatchSnapshot();
      });
    }
    if (!isEmptyCheck(testConfig.fields))
      testFields(component, testConfig.fields);
  });
  return component;
}

export function testComponentWithAsynCalls(
  testConfig: AsycnTestComponent
): ReactWrapper {
  testConfig.asyncMock.mockImplementationOnce(
    testConfig.asyncMockImplementation
  );
  let component: ReactWrapper = mount(testConfig.element);
  describe(`component: ${testConfig.id}`, () => {
    if (testConfig.generateSnapshot) {
      it("snapshot matched", async () => {
        await waitFor(() => {
          expect(testConfig.asyncMock).toHaveBeenCalled();
          expect(testConfig.asyncMock).toHaveReturned();
        });
        expect(component).toMatchSnapshot();
      });
    }
    if (!isEmptyCheck(testConfig.fields))
      testFields(component, testConfig.fields);
  });
  return component;
}

export function testFields(
  component: ReactWrapper,
  fields: TestField[],
  element?: ReactElement
) {
  fields.forEach((f) => {
    describe(`field: ${f.id}`, () => {
      const field: ReactWrapper<HTMLAttributes, any> = getField(
        component,
        f.id,
        f.name,
        f.inputType
      );
      const node = field.get(0);
      it("rendered", () => {
        expect(field.length).toBeGreaterThanOrEqual(1);
      });
      if (f.inputType === "text" || "multiselect") {
        if (f.maxLength) {
          it(`has maxLength "${f.maxLength}"`, () => {
            expect(node.props.maxLength).toBe(f.maxLength);
          });
        }
      } else if (f.inputType === "select") {
        it(`has default value "${f.selectedValue}"`, () => {
          expect(field.props().value).toBe(f.selectedValue);
        });
        if (f.values.length > 0) {
          it(`has all ${f.values.length} options`, () => {
            expect(field.find("option").length).toEqual(f.values.length);
            f.values.forEach((p, i) =>
              expect(field.find("option").at(i).props().value).toBe(p.id)
            );
          });
        }
      }
      if (f.isRequired) {
        it("is required", () => {
          expect(
            node.props.required ? node.props.required : node.props.isRequired
          ).toBe(true);
        });
      }
      if (!isEmptyCheck(f.basicValidations))
        testBasicValidations(component, field, f.basicValidations);
      if (!isEmptyCheck(f.asyncValidations))
        testAsyncValidations(component, field, f.asyncValidations);
      if (!isEmptyCheck(f.dependentValidations))
        testDependentValidations(
          component,
          field,
          f.inputType,
          f.dependentValidations
        );
    });
  });
}

export function testBasicValidations(
  component: ReactWrapper,
  field: ReactWrapper<HTMLAttributes, any>,
  fieldValidations: BasicValidation[]
) {
  describe("basic-validations:", () => {
    fieldValidations.forEach((validation) => {
      it(` ${validation.message}`, () => {
        field.simulate(validation.event, {
          target: { value: validation.targetValue },
        });
        const fieldError = component.find(
          `#errorMessage-${field.get(0).props.id}`
        );
        const node = fieldError.get(0);
        expect(node.props.children).toBe(validation.message);
      });
    });
  });
}

export function testAsyncValidations(
  component: ReactWrapper,
  field: ReactWrapper<HTMLAttributes, any>,
  fieldValidations: AsyncValidation[]
) {
  describe("async-validations:", () => {
    fieldValidations.forEach((validation) => {
      it(` ${validation.message}`, async () => {
        validation.asyncMock.mockImplementationOnce(
          validation.asyncMockImplementation
        );

        field.simulate("change", {
          target: { value: validation.targetValue },
        });
        await waitFor(() => {
          expect(validation.asyncMock).toHaveBeenCalled();
          expect(validation.asyncMock).toHaveReturned();
        });
        if (!isEmptyCheck(validation.message)) {
          let fieldComp: ComponentType = PPMSInput;
          switch (field.get(0).type) {
            case "select":
              fieldComp = PPMSSelect;
              break;
            case "radio":
              fieldComp = PPMSToggleRadio;
              break;
            default:
              fieldComp = PPMSInput;
              break;
          }
          const node = component
            .find(fieldComp)
            .first()
            .find(PPMSFormGroup)
            .getDOMNode();
          var fieldError: Element = node.querySelector(
            `#errorMessage-${field.get(0).props.id}`
          );
          expect(fieldError.innerHTML).toBe(validation.message);
        }
      });
    });
  });
}

export function testDependentValidations(
  component: ReactWrapper<HTMLAttributes, any>,
  field: ReactWrapper<HTMLAttributes, any>,
  inputType: string,
  fieldValidations: DependentValidation[]
) {
  fieldValidations.forEach((validation) => {
    describe("dependent-validations:", () => {
      validation.dependentfields.forEach((dependentValidation) => {
        it(`${dependentValidation.message}`, () => {
          field.simulate(validation.event, {
            target: { value: validation.targetValue },
          });
          if (inputType === "multiselect") {
            const option = component.find(`#option0`);
            option.simulate("click");
          }
          const dependentFieldEvent = getEvent(dependentValidation.inputType);
          const id = `${
            dependentValidation.inputType === "text" || "multiselect"
              ? "input"
              : dependentValidation.inputType
          }[id="${dependentValidation.id}"]`;
          const dependentField = component.find(id);
          const dependentFieldNode = dependentField.get(0);
          //first set some value
          dependentField.simulate(dependentFieldEvent, {
            target: {
              name: dependentFieldNode?.props?.name,
              value: "test",
            },
          });
          //then empty the field
          dependentField.simulate(dependentFieldEvent, {
            target: {
              name: dependentFieldNode?.props?.name,
              value: "",
            },
          });
          const error = component.find(
            `#errorMessage-${dependentValidation.id}`
          );
          const node = error.get(0);
          expect(node.props.children).toBe(dependentValidation.message);
        });
      });
    });
  });
}

let getEvent = function (inputType: string): string {
  var event: string = "change";
  switch (inputType) {
    case "multiselect":
      event = "change";
      break;
    case "select":
      event = "select";
      break;
    default:
      event = "change";
      break;
  }
  return event;
};

let getField = function (
  component: ReactWrapper,
  id: string,
  name: string,
  inputType: string
): ReactWrapper<HTMLAttributes, any> {
  var field: ReactWrapper<HTMLAttributes, any> = null;
  if (inputType === "multiselect") {
    field = component.find(`input[id="${id}"]`);
  } else {
    field = component.find(
      `${inputType === "text" ? "input" : inputType}[name="${name}"]`
    );
  }
  return field;
};

export let checkButtonIsEnabled = function (
  component: ReactWrapper<HTMLAttributes, any>,
  id: string
): any {
  const erdChangeRequestBtn: ReactWrapper<HTMLAttributes, any> = component.find(
    `button[id="${id}"]`
  );

  expect(erdChangeRequestBtn.length).toEqual(1);
  const node = erdChangeRequestBtn.get(0);
  expect(node.props.disabled).toBe(false);
};

export let checkButtonIsDisabled = function (
  component: ReactWrapper<HTMLAttributes, any>,
  id: string
): any {
  const erdChangeRequestBtn: ReactWrapper<HTMLAttributes, any> = component.find(
    `button[id="${id}"]`
  );

  expect(erdChangeRequestBtn.length).toEqual(1);
  const node = erdChangeRequestBtn.get(0);
  expect(node.props.disabled).toBe(true);
};

export let checkButtonExist = function (
  component: ReactWrapper<HTMLAttributes, any>,
  id: string
): any {
  const erdChangeRequestBtn: ReactWrapper<HTMLAttributes, any> = component.find(
    `button[id="${id}"]`
  );
  expect(erdChangeRequestBtn.length).toEqual(1);
};

export let checkButtonNotExist = function (
  component: ReactWrapper<HTMLAttributes, any>,
  id: string
): any {
  const button: ReactWrapper<HTMLAttributes, any> = component.find(
    `button[id="${id}"]`
  );
  expect(button.length).toEqual(0);
};

export let checkButtonName = function (
  component: ReactWrapper<HTMLAttributes, any>,
  id: string,
  name: string
): any {
  const button: ReactWrapper<HTMLAttributes, any> = component.find(
    `button[id="${id}"]`
  );
  expect(button.text()).toEqual(name);
};
