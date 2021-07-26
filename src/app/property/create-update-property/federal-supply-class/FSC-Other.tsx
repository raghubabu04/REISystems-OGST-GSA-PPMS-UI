import React, { Component } from "react";

import {
  isEmptyCheck,
  validateCommonItemName,
  validateCommonMake,
  validateCommonModel,
} from "../validations/propertyFieldValidations";

import { IPropertyContext, PropertyContextConsumer } from "../PropertyContext";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { isFormSubmitted } from "../../../../service/validation.service";
import {
  FSC_RequiringValueAddedServices,
  valueAddedServicesOptions,
} from "../constants/Constants";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";

export interface FSCOtherProps {
  updateFSCOther: any;
  triggerValidation?: boolean;
  makeIsRequired: boolean;
  modelIsRequired: boolean;
  itemNameIsRequired: boolean;
  specialDescriptionCodeIsRequired: boolean;
  specialDescriptionTextIsRequired: boolean;
  validateFSCOtherSection: boolean;
}

export default class FSCOther extends Component<FSCOtherProps, any> {
  private commonApiService: CommonApiService = new CommonApiService();
  private isCurrent = true;
  componentDidMount() {
    //TODO: need to look into this to make sure that is set from FSC instead of here.
    this.contextProps.updateFSCOtherState({
      makeIsRequired: this.props.makeIsRequired,
      modelIsRequired: this.props.modelIsRequired,
      itemNameIsRequired: this.props.itemNameIsRequired,
      specialDescriptionCodeIsRequired: this.props
        .specialDescriptionCodeIsRequired,
      specialDescriptionTextIsRequired: this.props
        .specialDescriptionTextIsRequired,
    });
    isFormSubmitted.subscribe((submit) => {
      if (submit && this.isCurrent) {
        this.validateForm();
        isFormSubmitted.next(false);
      }else if(this.props.validateFSCOtherSection){
        this.validateForm();
        this.contextProps.updateFSCState({
          validateFscSection: false,
        });
      }
    });
  }
  componentWillUnmount() {
    this.isCurrent = false;
  }
  handleSpecialDescriptionCodeChange = (event: any) => {
    const { FSCOtherData } = this.contextProps.fscOtherState;
    FSCOtherData["specialDescriptionCode"] = event.target.value;
    this.props.updateFSCOther({
      other: FSCOtherData,
    });
  };
  handleSpecialDescriptionTextChange = (event: any) => {
    const { FSCOtherData } = this.contextProps.fscOtherState;

    FSCOtherData["specialDescriptionText"] = event.target.value;

    this.props.updateFSCOther({
      other: FSCOtherData,
    });
  };
  handleItemNameChange = (value) => {
    let validations = validateCommonItemName(value);
    this.contextProps.updateFSCState({
      itemNameInvalid: validations.isInvalid,
    });
    this.contextProps.updateFSCOtherState({
      itemName: value,
      itemNameInvalid: validations.isInvalid,
      itemNameMsg: validations.validationError,
    });
    const { FSCOtherData } = this.contextProps.fscOtherState;

    FSCOtherData["itemName"] = value;

    this.props.updateFSCOther({
      other: FSCOtherData,
    });
  };
  handleMakeChange = ({ value, required }) => {
    //Handle pattern validations
    let validations = validateCommonMake(value, required);
    this.contextProps.updateFSCState({
      makeInvalid: validations.isInvalid,
    });
    this.contextProps.updateFSCOtherState({
      make: value,
      makeInvalid: validations.isInvalid,
      makeMsg: validations.validationError,
    });
    this.contextProps.updateFSCState({
      make: value,
      makeInvalid: validations.isInvalid,
      makeMsg: validations.validationError,
    });
    //only checks empty validation if it is currently required
    if (this.contextProps.fscState.makeIsRequired === true) {
      if (isEmptyCheck(value)) {
        this.contextProps.updateFSCOtherState({
          makeInvalid: true,
          makeMsg: "Make must be entered",
        });

        this.contextProps.updateFSCState({
          makeInvalid: true,
          makeMsg: "Make must be entered",
        });
      }
    }
    const { FSCOtherData } = this.contextProps.fscOtherState;

    FSCOtherData["make"] = value;

    this.props.updateFSCOther({
      other: FSCOtherData,
    });
  };
  handleModelChange = ({ value, required }) => {
    //Same as make
    let validations = validateCommonModel(value, required);
    this.contextProps.updateFSCState({
      modelInvalid: validations.isInvalid,
    });
    this.contextProps.updateFSCOtherState({
      model: value,
      modelInvalid: validations.isInvalid,
      modelMsg: validations.validationError,
    });
    this.contextProps.updateFSCState({
      model: value,
      modelInvalid: validations.isInvalid,
      modelMsg: validations.validationError,
    });
    if (this.contextProps.fscState.modelIsRequired === true) {
      if (isEmptyCheck(value)) {
        this.contextProps.updateFSCOtherState({
          modelInvalid: true,
          modelMsg: "Model must be entered",
        });
        this.contextProps.updateFSCState({
          modelInvalid: true,
          modelMsg: "Model must be entered",
        });
      }
    }
    const { FSCOtherData } = this.contextProps.fscOtherState;

    FSCOtherData["model"] = value;

    this.props.updateFSCOther({
      other: FSCOtherData,
    });
  };

  handleSpecialInstructionsChange = (values) => {
    let selectedValue = values.filter((item) => {
      if (item.isSelected === true) {
        return item;
      }
      return {};
    });
    if (selectedValue.length > 0) {
      this.contextProps.updateFSCOtherState({
        specialInstructions: selectedValue[0].value,
      });
    } else {
      this.contextProps.updateFSCOtherState({ specialInstructions: "" });
    }
  };
  contextProps: IPropertyContext = null;
  validateForm() {
    this.handleItemNameChange(
      this.contextProps.fscState.fsc.itemName
    );
    let make: any = this.contextProps.fscOtherState.FSCOtherData.make;
    let makeRequired: any = this.contextProps.fscOtherState.makeIsRequired;
    let model: any = this.contextProps.fscOtherState.FSCOtherData.model;
    let modelRequired: any = this.contextProps.fscOtherState.modelIsRequired;
    this.handleMakeChange({ value: make, required: makeRequired });
    this.handleModelChange({ value: model, required: modelRequired });
  }

  checkIfValueAddedServiceToggleIsRequired() {
    if (
      FSC_RequiringValueAddedServices.includes(
        this.contextProps.fscState.data.fscCode
      )
    ) {
      return (
        <PPMSToggleRadio
          className=""
          id={"ValueAddedServices"}
          isRequired={true}
          options={this.contextProps.fscState.valueAddedServicesOptions}
          isInline={false}
          isDisabled={false}
          name={"Value Added Services"}
          label={"Value Added Services"}
          validationMessage={
            this.contextProps.fscState.valueAddedServiceValidationMsg
          }
          isSingleSelect={true}
          onChange={this.handleValueAddedService.bind(this)}
        />
      );
    }
  }

  handleValueAddedService(OptionsState: typeof valueAddedServicesOptions) {
    let valueAddedServices = this.contextProps.fscState.valueAddedServices;
    OptionsState.forEach((option) => {
      if (option.isSelected) {
        valueAddedServices = option.id;
        this.contextProps.updateFSCState({
          valueAddedServices: valueAddedServices,
        });
      }
    });
  }

  render() {
    return (
      <PropertyContextConsumer>
        {(props) => {
          this.contextProps = props;
          return (
            <>
              {this.checkIfValueAddedServiceToggleIsRequired()}
              <div className={"grid-row grid-gap-4"}>
                <div className={"tablet:grid-col-8"}>
                  <PPMSInput
                    id={"itemName"}
                    name={"itemName"}
                    label={"Item Name"}
                    isRequired={
                      this.contextProps.fscOtherState.itemNameIsRequired
                    }
                    isDisabled={false}
                    inputType={"text"}
                    value={
                      this.contextProps.fscOtherState.FSCOtherData.itemName
                    }
                    onChange={(event: any) => {
                      const { FSCOtherData } = this.contextProps.fscOtherState;
                      FSCOtherData["itemName"] = event.target.value;
                      this.contextProps.updateFSCOtherState({
                        itemName: event.target.value,
                      });
                      this.props.updateFSCOther({
                        other: FSCOtherData,
                      });
                    }}
                    onBlur={(event) =>
                      this.handleItemNameChange(event.target.value)
                    }
                    validationMessage={
                      this.contextProps.fscOtherState.itemNameMsg
                    }
                    maxLength={69}
                    minLength={4}
                    isInvalid={this.contextProps.fscOtherState.itemNameInvalid}
                    isValid={false}
                  />
                </div>
              </div>
              <div className="grid-row grid-gap-4">
                <div className={"tablet:grid-col-4"}>
                  <PPMSInput
                    id={"make"}
                    name={"make"}
                    label={"Make"}
                    isRequired={this.contextProps.fscOtherState.makeIsRequired}
                    isDisabled={false}
                    inputType={"text"}
                    value={this.contextProps.fscOtherState.FSCOtherData.make}
                    onBlur={(event) => this.handleMakeChange(event.target)}
                    onChange={(event) => {
                      this.contextProps.updateFSCOtherState({
                        make: event.target.value,
                      });
                      const { FSCOtherData } = this.contextProps.fscOtherState;
                      FSCOtherData["make"] = event.target.value;
                      this.props.updateFSCOther({
                        other: FSCOtherData,
                      });
                    }}
                    validationMessage={this.contextProps.fscOtherState.makeMsg}
                    maxLength={50}
                    minLength={0}
                    isInvalid={this.contextProps.fscOtherState.makeInvalid}
                    isValid={false}
                  />
                </div>
                <div className={"tablet:grid-col-4"}>
                  <PPMSInput
                    id={"model"}
                    name={"model"}
                    label={"Model"}
                    isRequired={this.contextProps.fscOtherState.modelIsRequired}
                    isDisabled={false}
                    inputType={"text"}
                    value={this.contextProps.fscOtherState.FSCOtherData.model}
                    onBlur={(event) => this.handleModelChange(event.target)}
                    onChange={(event) => {
                      this.contextProps.updateFSCOtherState({
                        model: event.target.value,
                      });
                      const { FSCOtherData } = this.contextProps.fscOtherState;
                      FSCOtherData["model"] = event.target.value;

                      this.props.updateFSCOther({
                        other: FSCOtherData,
                      });
                    }}
                    validationMessage={this.contextProps.fscOtherState.modelMsg}
                    maxLength={50}
                    minLength={0}
                    isInvalid={this.contextProps.fscOtherState.modelInvalid}
                    isValid={false}
                  />
                </div>
              </div>
              <div className={"grid-row grid-gap-4"}>
                <div className={"tablet:grid-col-6"}>
                  <PPMSInput
                    id={"specialDescriptionCode"}
                    name={"specialDescriptionCode"}
                    label={"Special Description Code"}
                    isRequired={
                      this.contextProps.fscOtherState
                        .specialDescriptionCodeIsRequired
                    }
                    isDisabled={false}
                    inputType={"text"}
                    value={
                      this.contextProps.fscOtherState.FSCOtherData
                        .specialDescriptionCode
                    }
                    onChange={this.handleSpecialDescriptionCodeChange}
                    validationMessage={
                      this.contextProps.fscOtherState.specialDescriptionCodeMsg
                    }
                    maxLength={12}
                    minLength={0}
                    isInvalid={
                      this.contextProps.fscOtherState
                        .specialDescriptionCodeInvalid
                    }
                    isValid={false}
                  />
                </div>
                <div className={"tablet:grid-col-6"}>
                  <PPMSInput
                    id={"specialDescriptionText"}
                    name={"specialDescriptionText"}
                    label={"Special Description Text"}
                    isRequired={
                      this.contextProps.fscOtherState
                        .specialDescriptionTextIsRequired
                    }
                    isDisabled={false}
                    inputType={"text"}
                    value={
                      this.contextProps.fscOtherState.FSCOtherData
                        .specialDescriptionText
                    }
                    onChange={this.handleSpecialDescriptionTextChange}
                    validationMessage={
                      this.contextProps.fscOtherState.specialDescriptionTextMsg
                    }
                    maxLength={69}
                    minLength={0}
                    isInvalid={
                      this.contextProps.fscOtherState
                        .specialDescriptionTextInvalid
                    }
                    isValid={false}
                  />
                </div>
              </div>
            </>
          );
        }}
      </PropertyContextConsumer>
    );
  }
}
