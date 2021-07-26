import moment from "moment";
import React from "react";
import FormBuilder from "./FormBuilder";
import * as Yup from "yup";

interface state {
  validationSchema: any
}
export function errortext(){
  return  "name cannot be less than 5 characters"
}

interface Props {

}

export default class FormBuilderDemo extends React.Component<Props, state> {

  constructor(props: any) {
    super(props);
    this.state = {
      validationSchema :  Yup.object().shape({
        inputText2: Yup.string().required(this.validationMessage.inputText2.required),
        address: Yup.object().shape({
          address1: Yup.string().required(
            this.validationMessage.address.address1.required
          ),
          address2: Yup.string().required(
            this.validationMessage.address.address2.required
          ),
        }),
      })
    };
  }
   currentDate = moment().toDate();
   endDateValue = moment()
    .set("year", moment().toDate().getFullYear() + 1)
    .toDate();
   test = {
    title: "Demo Form Builder",
    className:"",
    button: {
      className: "grid-row grid-gap-4",
      buttons: [
        {
          id: "button",
          label: "save",
          type: "button",
          variant: "primary",
          className: "grid-col-auto",
        },
        {
          id: "submit",
          label: "Submit",
          type: "submit",
          variant: "primary",
          className: "grid-col-auto",
        },
        {
          id: "reset",
          label: "Reset",
          type: "reset",
          variant: "primary",
          className: "grid-col-auto",
        },
      ],
    },
    sections: [
      {
        navSide: true,
        accordion: true,
        label: "Accordion Label",
        id: "2-input-box",
        rows: [
          {
            id: "1",
            className: "grid-gap-2",
            label: "Row Label",
            cols: [
              {
                id: "inputText1",
                label: "Component Label",
                formType: "input",
                className: "tablet:grid-col-6",
                validationType:"string",
                validations:[
                  {
                    type: "required",
                    params: ["this field is required"]
                  },
                  {
                    type: "min",
                    params: [5, errortext()]
                  },
                ]
              },
              {
                id: "inputText2",
                label: "Component Label",
                formType: "input",
                className: "tablet:grid-col-6",
                type: "number",
              },
            ],
          },
          {
            id: "2",
            className: "grid-gap-2",
            label: "Row Label",
            cols: [
              {
                id: "inputText3",
                formType: "input",
                className: "tablet:grid-col-6",
                type: "tel",
              },
              {
                id: "inputText4",
                formType: "input",
                className: "tablet:grid-col-6",
                type: "text",
                validationType:"string",
                validations:[
                  {
                    type: "min",
                    params: [4, "name cannot be less than 4 characters"]
                  },
                ]
              }
            ],
          },
        ],
      },
      {
        label: "Mix Components",
        id: "mix-components",
        rows: [
          {
            id: "3",
            className: "grid-gap-2",
            cols: [
              {
                id: "date",
                label: "Date",
                formType: "date",
                message:" Start Here",
                endDayPickerdisplay:"left",
                startDayPickerdisplay:"right",
                currentDate: this.currentDate,
                endDate: this.endDateValue,
                className: "tablet:grid-col-8",
              },
              {
                id: "selector",
                label: "Selector",
                formType: "selector",
                options: [
                  { value: "Everyday", id: "EVD" },
                  { value: "Once a week", id: "OCW" },
                ],
                placeholderValue: "Select one",
                identifierKey:"id",
                identifierValue:"value",
                className: "tablet:grid-col-4",
              },
            ],
          },
          {
            id: "4",
            className: "grid-gap-3",
            label: "Test Label",
            cols: [
              {
                id: "checkbox",
                label: "CheckBox",
                formType: "checkbox",
                options: [
                  {
                    value: "Contractor Inventory",
                    id: "contractor-inventory",
                    isSelected: false,
                  },
                  {
                    value: "Overseas Inventory",
                    id: "overseas-inventory",
                    isSelected: false,
                  },
                ],
                className: "grid-col-4",
              },
              {
                id: "ratio",
                label: "Ratio",
                formType: "ratio",
                options: [
                  {
                    id: "1-ratio",
                    value: "New or Unused",
                    isSelected: false,
                  },
                  {
                    id: "4-ratio",
                    value: "Usable",
                    isSelected: false,
                  },
                ],
                className: "grid-col-4",
                isRequired: true,
                validationType:"string",
                validations:[
                  {
                    type: "required",
                    params: ["this field is required"]
                  },
                ]
              },
              {
                id: "selector1",
                label: "Selector 2",
                formType: "selector",
                identifierKey:"id",
                identifierValue:"value",
                options: [
                  { value: "Everyday", id: "EVD" },
                  { value: "Once a week", id: "OCW" },
                ],
                className: "grid-col-4",
              },
            ],
          },
        ],
      },
      {
        label: "Text Box",
        id: "text-box-section",
        rows: [
          {
            id: "6",

            cols: [
              {
                id: "textarea",
                label: "Textarea",
                type: "text",
                formType: "textarea",
                className: "tablet:grid-col-6",
              },
              {
                id: "richtext",
                label: "Rich Text",
                formType: "richtext",
                className: "tablet:grid-col-6",
              },
            ],
          },
        ],
      },
      {
        label: "Address",
        id: "address",
        rows: [
          {
            id: "7",

            cols: [
              {
                id:"address",
                address1Required: true,
                address2Required: true,
                zipRequired:true,
                label: "Address",
                formType: "address",
                validations:[
                  {
                    field: "zip",
                    type: "required",
                    params: ["this field is required"]
                  },
                  {
                    type: "min",
                    params: [5, errortext()]
                  },
                ]
              }
            ],
          },
        ],
      },
    ],
  };

   onSubmit = (data) => {
    alert(JSON.stringify(data, null, 4));
  };
   validationMessage = {
    inputText2: {
      required: "Title is Required",
    },
     address: {
       address1: {
         required: "Address Line 1 is Required",
       },
       address2: {
         required: "Address Line 2 is Required",
       },
     },
  };
   onPress = (event) => {
    console.log(event);
  };

  updateValidationSchema = (data) => {
    this.setState({
      validationSchema: data
    });
  }
  render() {
    return (
      <div className="App">
        <FormBuilder
          title="Demo Form Builder"
          model={this.test}
          onSubmit={(model) => {
            this.onSubmit(model);
          }}
          onPress={(event) => {
            this.onPress(event);
          }}
          validationSchema={this.state.validationSchema}
          updateValidationSchema={ (data) => {
            this.updateValidationSchema(data);
          }}
        />
      </div>
    );
  }

}
