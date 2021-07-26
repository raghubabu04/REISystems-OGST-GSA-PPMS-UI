import React, { useContext, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSSelect } from "../../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSToggleRadio } from "../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { FleetContext } from "../Fleet-context";
import {
  vehicleColorToneValues,
  vehicleColorValues,
} from "../../../constant/Constants";
import { isFormSubmitted } from "../../../../../service/validation.service";
import { PPMSTextEditor } from "../../../../../ui-kit/components/common/PPMS-texteditor";
import { UserUtils } from "../../../../../utils/UserUtils";
import {
  validateEmptyCheck,
  validateVin,
  validatePropertyDescription,
} from "../validations/fleetValidations";
import { formatPriceNumber } from "../../constants/Constants";

interface VehicleInformationProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function VehicleInformation(props: VehicleInformationProps) {
  const { vehicleInformationState, updateVehicleInformationState } = useContext(
    FleetContext
  );

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validateForm();
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [vehicleInformationState]);

  const vehicleInfoJSON = {
    vin: vehicleInformationState.vehicleVin,
    class: vehicleInformationState.vehicleClass,
    tag: vehicleInformationState.vehicleTag,
    make: vehicleInformationState.vehicleMake,
    model: vehicleInformationState.vehicleModel,
    year: vehicleInformationState.vehicleYear,
    bodyStyle: vehicleInformationState.vehicleBody,
    color: vehicleInformationState.vehicleColor,
    colorTone: vehicleInformationState.vehicleColorTone,
    cylinder: vehicleInformationState.vehicleCylinder,
    axle: vehicleInformationState.vehicleAxle,
    horsePower: vehicleInformationState.vehicleHorsepower,
    engineNumber: vehicleInformationState.engineNumber,
    fuelType: vehicleInformationState.fuelType,
    gwvr: vehicleInformationState.GWVR,
    vehicleType: vehicleInformationState.vehicleType,
    dualWheel: vehicleInformationState.dualWheel,
    tire: vehicleInformationState.tire,
    noPass: vehicleInformationState.noPass,
    wheelBase: vehicleInformationState.wheelBase,
    payload: vehicleInformationState.payload,
    mileage: vehicleInformationState.mileage,
    salvageScrap: vehicleInformationState.salvageScrap,
    odometerCorrect: vehicleInformationState.odometerCorrect,
    loanValue: vehicleInformationState.loanValue,
    tradeInValue: vehicleInformationState.tradeInValue,
    retailValue: vehicleInformationState.retailValue,
    msrp: vehicleInformationState.MSRP,
  };

  function validateForm() {
    if (!UserUtils.isUserFleetExt()) {
      //Vin
      let errorVin = validateVin(vehicleInformationState.vehicleVin);
      if (errorVin.isInvalid) {
        updateVehicleInformationState({
          isVinInValid: errorVin.isInvalid,
          vinValidationMessage: errorVin.validationError,
        });
      }
      //Make
      let errorMake = validateEmptyCheck(vehicleInformationState.vehicleMake);
      if (errorMake.isInvalid) {
        updateVehicleInformationState({
          isVehicleMakeInValid: errorMake.isInvalid,
        });
      }
      //Model
      let errorModel = validateEmptyCheck(vehicleInformationState.vehicleModel);
      if (errorModel.isInvalid) {
        updateVehicleInformationState({
          isVehicleModelInValid: errorModel.isInvalid,
        });
      }
      //Year
      let errorYear = validateEmptyCheck(vehicleInformationState.vehicleYear);
      if (errorYear.isInvalid) {
        updateVehicleInformationState({
          isVehicleYearInValid: errorYear.isInvalid,
        });
      }
      //Color
      let errorColor = validateEmptyCheck(vehicleInformationState.vehicleColor);
      if (errorColor.isInvalid) {
        updateVehicleInformationState({
          isColorInValid: errorColor.isInvalid,
        });
      }
      //Color Tone
      let errorColorTone = validateEmptyCheck(
        vehicleInformationState.vehicleColorTone
      );
      if (errorColorTone.isInvalid) {
        updateVehicleInformationState({
          isColorToneInValid: errorColorTone.isInvalid,
        });
      }
      //Engine Number
      let errorEngineNumber = validateEmptyCheck(
        vehicleInformationState.engineNumber
      );
      if (errorEngineNumber.isInvalid) {
        updateVehicleInformationState({
          engineNumberIsInvalid: errorEngineNumber.isInvalid,
        });
      }
      //Vehicle Type
      let errorVehicleType = validateEmptyCheck(
        vehicleInformationState.vehicleType
      );
      if (errorVehicleType.isInvalid) {
        updateVehicleInformationState({
          vehicleTypeIsInvalid: errorVehicleType.isInvalid,
        });
      }
    }
    //Fields available to external users
    //Mileage
    let errorMileage = validateEmptyCheck(vehicleInformationState.mileage);
    if (errorMileage.isInvalid) {
      updateVehicleInformationState({
        mileageIsInvalid: errorMileage.isInvalid,
      });
    }
    //Transmission
    let errorTransmission = validateEmptyCheck(
      vehicleInformationState.transmission
    );
    if (errorTransmission.isInvalid) {
      updateVehicleInformationState({
        transmissionIsInvalid: errorTransmission.isInvalid,
      });
    }
    handlePropertyDescriptionChange();
  }

  function handleOdometerChange(event: any) {
    event.forEach((e) => {
      if (e.isSelected) {
        updateVehicleInformationState({
          odometerCorrect: e.id === "Y" ? "true" : "false",
        });
      }
    });
  }

  function handleSalvageScrapChange(event: any) {
    event.forEach((e) => {
      if (e.isSelected) {
        updateVehicleInformationState({
          salvageScrap: e.id === "Y" ? "true" : "false",
        });
      }
    });
  }

  const vinChanged = (event) => {
    const spaceRegex = /\s/;
    const vinValue = event.target.value.substring(0, 11);
    const vinHasSpaces = spaceRegex.test(vinValue);
    let vinSpaceValidation = vinHasSpaces
      ? "VIN has spaces."
      : vinValue.length === 0
      ? "VIN is required."
      : vinValue.length < 11
      ? "VIN is invalid."
      : "";
    updateVehicleInformationState({
      isVinInValid:
        vinHasSpaces || vinValue.length < 11 || vinValue.length === 0,
      vinValidationMessage: vinSpaceValidation,
    });
  };

  const vehicleColorChanged = (event) => {
    const validColor = !event.target.value && event.target.value.length === 0;
    updateVehicleInformationState({
      vehicleColor: event.target.value,
      isColorInValid: validColor,
    });
  };

  const vehicleYearChanged = (vehicleYear) => {
    const validYear = vehicleYear.length < 4;
    updateVehicleInformationState({
      isVehicleYearInValid: validYear,
    });
  };

  const colorToneChanged = (event) => {
    const validColorTone =
      !event.target.value && event.target.value.length === 0;
    updateVehicleInformationState({
      vehicleColorTone: event.target.value,
      isColorToneInValid: validColorTone,
    });
  };

  const handlePropertyDescriptionChange = () => {
    let validation = validatePropertyDescription(
      vehicleInformationState.itemDescription
    );

    updateVehicleInformationState({
      itemDescriptionIsInvalid: validation.isInvalid,
      itemDescriptionErrorMsg: validation.validationError,
    });
  };

  function formatCurrency(value) {
    if (!value) {
      return "";
    }
    return "$" + value.replace("$", "");
  }

  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSInput
            label={"VIN"}
            isDisabled={UserUtils.isUserFleetExt()}
            id={"vehicleVin"}
            inputType={"text"}
            onChange={(event) => {
              updateVehicleInformationState({
                vehicleVin: event.target.value,
                isVinInValid: false,
              });
            }}
            onBlur={(event) => {
              vinChanged(event);
            }}
            validationMessage={vehicleInformationState.vinValidationMessage}
            isValid={!vehicleInformationState.isVinInValid}
            isInvalid={vehicleInformationState.isVinInValid}
            isRequired={true}
            maxLength={17}
            value={vehicleInformationState.vehicleVin}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"vehicleClass"}
            inputType={"text"}
            label={"Class"}
            isDisabled={true}
            isRequired={true}
            isInvalid={false}
            isValid={true}
            validationMessage={""}
            value={vehicleInformationState.vehicleClass}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"vehicleTag"}
            inputType={"text"}
            label={"Tag"}
            isDisabled={true}
            isRequired={true}
            isInvalid={false}
            isValid={true}
            validationMessage={""}
            value={vehicleInformationState.vehicleTag}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSInput
            id={"vehicleMake"}
            inputType={"text"}
            label={"Make"}
            isDisabled={UserUtils.isUserFleetExt()}
            isRequired={true}
            maxLength={10}
            value={vehicleInformationState.vehicleMake}
            onChange={(event) => {
              updateVehicleInformationState({
                vehicleMake: event.target.value,
                isVehicleMakeInValid: false,
              });
            }}
            validationMessage={
              vehicleInformationState.vehicleMakeValidationMessage
            }
            isValid={!vehicleInformationState.isVehicleMakeInValid}
            isInvalid={vehicleInformationState.isVehicleMakeInValid}
            onBlur={(event) => {
              if (!event.target.value) {
                updateVehicleInformationState({
                  isVehicleMakeInValid: true,
                });
              }
            }}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"vehicleModel"}
            inputType={"text"}
            label={"Model"}
            isDisabled={UserUtils.isUserFleetExt()}
            isRequired={true}
            maxLength={12}
            value={vehicleInformationState.vehicleModel}
            onChange={(event) => {
              updateVehicleInformationState({
                vehicleModel: event.target.value,
                isVehicleModelInValid: false,
              });
            }}
            validationMessage={vehicleInformationState.modelValidation}
            isValid={!vehicleInformationState.isVehicleModelInValid}
            isInvalid={vehicleInformationState.isVehicleModelInValid}
            onBlur={(event) => {
              if (!event.target.value) {
                updateVehicleInformationState({
                  isVehicleModelInValid: true,
                });
              }
            }}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"vehicleYear"}
            inputType={"text"}
            label={"Year"}
            maxLength={4}
            isDisabled={UserUtils.isUserFleetExt()}
            isRequired={true}
            value={vehicleInformationState.vehicleYear}
            onChange={(event) => {
              if (/^[0-9]*$/.test(event.target.value)) {
                updateVehicleInformationState({
                  vehicleYear: event.target.value,
                  isVehicleYearInValid: false,
                });
              }
            }}
            validationMessage={
              vehicleInformationState.vehicleYearValidationMessage
            }
            isValid={!vehicleInformationState.isVehicleYearInValid}
            isInvalid={vehicleInformationState.isVehicleYearInValid}
            onBlur={(event) => {
              vehicleYearChanged(event.target.value);
            }}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSSelect
            id={"transmission"}
            identifierKey={"id"}
            identifierValue={"longName"}
            name={"transmission"}
            values={vehicleInformationState.transmissionOptions}
            label={"Transmission"}
            isRequired={true}
            placeholderValue={"Select Transmission Type"}
            selectedValue={vehicleInformationState.transmission}
            onChange={(event) => {
              let valid = event.target.value.length !== 0;
              updateVehicleInformationState({
                transmission: event.target.value,
                transmissionIsInvalid: !valid,
              });
            }}
            isInvalid={vehicleInformationState.transmissionIsInvalid}
            validationMessage={"Transmission is required"}
            disabled={false}
            title={"transmission-values"}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"vehicleBodyStyle"}
            inputType={"text"}
            label={"Body Style"}
            isDisabled={UserUtils.isUserFleetExt()}
            isRequired={false}
            maxLength={8}
            value={vehicleInformationState.vehicleBody}
            onChange={(event) => {
              updateVehicleInformationState({
                vehicleBody: event.target.value,
              });
            }}
            isValid={true}
            isInvalid={false}
            validationMessage={""}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSSelect
            id={"colorStyle"}
            identifierKey={"id"}
            identifierValue={"value"}
            title={" Color"}
            placeholderValue={"Select Color"}
            label={"Color"}
            isInvalid={vehicleInformationState.isColorInValid}
            isValid={!vehicleInformationState.isColorInValid}
            values={vehicleColorValues}
            disabled={UserUtils.isUserFleetExt()}
            isRequired={true}
            selectedValue={vehicleInformationState.vehicleColor}
            validationMessage={
              vehicleInformationState.vehicleColorValidationMessage
            }
            onChange={(event) => vehicleColorChanged(event)}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSSelect
            id={"colorTone"}
            identifierKey={"id"}
            identifierValue={"value"}
            title={"Color Tone"}
            placeholderValue={"Select Color Tone"}
            label={" Color Tone"}
            values={vehicleColorToneValues}
            disabled={UserUtils.isUserFleetExt()}
            isRequired={true}
            isInvalid={vehicleInformationState.isColorToneInValid}
            isValid={!vehicleInformationState.isColorToneInValid}
            selectedValue={vehicleInformationState.vehicleColorTone}
            validationMessage={
              vehicleInformationState.colorToneValidationMessage
            }
            onChange={(event) => colorToneChanged(event)}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"vehicleCylinder"}
            inputType={"text"}
            label={"Cylinder"}
            isDisabled={UserUtils.isUserFleetExt()}
            isRequired={false}
            maxLength={2}
            value={vehicleInformationState.vehicleCylinder}
            onChange={(event) => {
              updateVehicleInformationState({
                vehicleCylinder: event.target.value,
              });
            }}
            isValid={true}
            isInvalid={false}
            validationMessage={""}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"vehicleAxle"}
            inputType={"text"}
            label={"Axle"}
            isDisabled={UserUtils.isUserFleetExt()}
            isRequired={false}
            maxLength={2}
            value={vehicleInformationState.vehicleAxle}
            onChange={(event) => {
              updateVehicleInformationState({
                vehicleAxle: event.target.value,
              });
            }}
            isValid={true}
            isInvalid={false}
            validationMessage={""}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-3"}>
        <div className={"grid-col"}>
          <PPMSInput
            id={"engineNumber"}
            name={"engineNumber"}
            label={"Engine Number"}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={vehicleInformationState.engineNumber}
            onChange={(event) => {
              updateVehicleInformationState({
                engineNumber: event.target.value,
                engineNumberIsInvalid: false,
              });
            }}
            onBlur={(event) => {
              if (!event.target.value) {
                updateVehicleInformationState({
                  engineNumberIsInvalid: true,
                });
              }
            }}
            validationMessage={
              vehicleInformationState.engineNumberValidationMsg
            }
            isInvalid={vehicleInformationState.engineNumberIsInvalid}
            isRequired={true}
            maxLength={10}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"fuelType"}
            name={"fuelType"}
            label={"Fuel Type"}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={vehicleInformationState.fuelType}
            onChange={(event) => {
              updateVehicleInformationState({
                fuelType: event.target.value,
              });
            }}
            maxLength={6}
            isRequired={false}
            isValid={false}
            isInvalid={false}
            validationMessage={""}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"GWVR"}
            name={"GWVR"}
            label={"GWVR"}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={vehicleInformationState.GWVR}
            onChange={(event) => {
              updateVehicleInformationState({
                GWVR: event.target.value,
              });
            }}
            maxLength={6}
            isRequired={false}
            isValid={false}
            isInvalid={false}
            validationMessage={""}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-3"}>
        <div className={"grid-col"}>
          <PPMSInput
            id={"vehicleType"}
            name={"vehicleType"}
            label={"Vehicle Type"}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={vehicleInformationState.vehicleType}
            onChange={(event) => {
              updateVehicleInformationState({
                vehicleType: event.target.value,
                vehicleTypeIsInvalid: false,
              });
            }}
            onBlur={(event) => {
              if (!event.target.value) {
                updateVehicleInformationState({
                  vehicleTypeIsInvalid: true,
                });
              }
            }}
            validationMessage={vehicleInformationState.vehicleTypeValidationMsg}
            isInvalid={vehicleInformationState.vehicleTypeIsInvalid}
            isRequired={true}
            maxLength={13}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"dualWheel"}
            name={"dualWheel"}
            label={"Dual Wheel"}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={vehicleInformationState.dualWheel}
            onChange={(event) => {
              updateVehicleInformationState({
                dualWheel: event.target.value,
              });
            }}
            maxLength={2}
            isRequired={false}
            isValid={false}
            isInvalid={false}
            validationMessage={""}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"tire"}
            name={"tire"}
            label={"Tire"}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={vehicleInformationState.tire}
            onChange={(event) => {
              updateVehicleInformationState({
                tire: event.target.value,
              });
            }}
            maxLength={1}
            isRequired={false}
            isValid={false}
            isInvalid={false}
            validationMessage={""}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-3"}>
        <div className={"grid-col"}>
          <PPMSInput
            id={"noPass"}
            name={"noPass"}
            label={"No Pass"}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={vehicleInformationState.noPass}
            onChange={(event) => {
              updateVehicleInformationState({
                noPass: event.target.value,
              });
            }}
            maxLength={2}
            isRequired={false}
            isValid={false}
            isInvalid={false}
            validationMessage={""}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"wheelBase"}
            name={"wheelBase"}
            label={"Wheel Base"}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={vehicleInformationState.wheelBase}
            onChange={(event) => {
              updateVehicleInformationState({
                wheelBase: event.target.value,
              });
            }}
            maxLength={4}
            isRequired={false}
            isValid={false}
            isInvalid={false}
            validationMessage={""}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"payload"}
            name={"payload"}
            label={"Payload"}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={vehicleInformationState.payload}
            onChange={(event) => {
              updateVehicleInformationState({
                payload: event.target.value,
              });
            }}
            maxLength={3}
            isRequired={false}
            isValid={false}
            isInvalid={false}
            validationMessage={""}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-3"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"vehicleHorsepower"}
            inputType={"text"}
            label={"Horsepower"}
            isDisabled={UserUtils.isUserFleetExt()}
            isRequired={false}
            maxLength={3}
            value={vehicleInformationState.vehicleHorsepower}
            onChange={(event) => {
              updateVehicleInformationState({
                vehicleHorsepower: event.target.value,
              });
            }}
            isValid={true}
            isInvalid={false}
            validationMessage={""}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"mileage"}
            name={"mileage"}
            label={"Mileage"}
            isDisabled={false}
            inputType={"text"}
            value={vehicleInformationState.mileage}
            onChange={(event) => {
              updateVehicleInformationState({
                mileage: event.target.value.replace(/\D+/g, ""),
                mileageIsInvalid: false,
              });
            }}
            onBlur={(event) => {
              if (!event.target.value) {
                updateVehicleInformationState({
                  mileageIsInvalid: true,
                });
              }
            }}
            validationMessage={vehicleInformationState.mileageValidationMsg}
            isInvalid={vehicleInformationState.mileageIsInvalid}
            isValid={!vehicleInformationState.mileageIsInvalid}
            isRequired={true}
            maxLength={6}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSToggleRadio
            isInline={true}
            label={"Odometer Correct"}
            name={`odometerCorrect`}
            isRequired={true}
            isDisabled={UserUtils.isUserFleetExt()}
            options={vehicleInformationState.odometerOptions}
            validationMessage={""}
            onChange={handleOdometerChange}
            id={`odometerCorrect`}
            isSingleSelect={true}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-3"}>
        <div className={"grid-col"}>
          <PPMSToggleRadio
            isInline={true}
            label={"Salvage/Scrap"}
            name={`salvage-scrap`}
            isRequired={true}
            isDisabled={false}
            options={vehicleInformationState.salvageScrapOptions}
            validationMessage={""}
            onChange={handleSalvageScrapChange}
            id={`salvage-scrap`}
            isSingleSelect={true}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"loanValue"}
            name={"loanValue"}
            label={"Loan Value"}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={vehicleInformationState.loanValue}
            onChange={(event) => {
              if (/^[0-9,$]*$/.test(event.target.value)) {
                updateVehicleInformationState({
                  loanValue: formatCurrency(
                    formatPriceNumber(event.target.value)
                  ),
                });
              }
            }}
            isRequired={false}
            isValid={false}
            isInvalid={false}
            validationMessage={""}
            maxLength={8}
            placeHolder={"$0"}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            id={"tradeInValue"}
            name={"tradeInValue"}
            label={"Trade-in Value"}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={vehicleInformationState.tradeInValue}
            onChange={(event) => {
              if (/^[0-9,$]*$/.test(event.target.value)) {
                updateVehicleInformationState({
                  tradeInValue: formatCurrency(
                    formatPriceNumber(event.target.value)
                  ),
                });
              }
            }}
            isRequired={false}
            isValid={false}
            isInvalid={false}
            validationMessage={""}
            maxLength={8}
            placeHolder={"$0"}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-3"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"retailValue"}
            name={"retailValue"}
            label={"Retail Value"}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={vehicleInformationState.retailValue}
            onChange={(event) => {
              if (/^[0-9,$]*$/.test(event.target.value)) {
                updateVehicleInformationState({
                  retailValue: formatCurrency(
                    formatPriceNumber(event.target.value)
                  ),
                });
              }
            }}
            isRequired={false}
            isValid={false}
            isInvalid={false}
            validationMessage={""}
            maxLength={8}
            placeHolder={"$0"}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"msrp"}
            name={"msrp"}
            label={"MSRP"}
            isDisabled={UserUtils.isUserFleetExt()}
            inputType={"text"}
            value={vehicleInformationState.MSRP}
            onChange={(event) => {
              if (/^[0-9,$]*$/.test(event.target.value)) {
                updateVehicleInformationState({
                  MSRP: formatCurrency(formatPriceNumber(event.target.value)),
                });
              }
            }}
            isRequired={false}
            isValid={false}
            isInvalid={false}
            validationMessage={""}
            maxLength={8}
            placeHolder={"$0"}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSInput
            id={"propertyDescription"}
            name={"propertyDescription"}
            label={"Property Description"}
            isDisabled={true}
            inputType={"text"}
            value={vehicleInformationState.propertyDescription}
            onChange={(event) => {}}
            isRequired={true}
            isValid={false}
            isInvalid={false}
            validationMessage={""}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSTextEditor
            id={"itemDescription"}
            label={"Item Description"}
            value={vehicleInformationState.itemDescription}
            onChange={(desc) => {
              updateVehicleInformationState({
                itemDescription: desc,
                itemDescriptionIsInvalid: false,
                itemDescriptionErrorMsg: "",
              });
            }}
            onBlur={() => {
              handlePropertyDescriptionChange();
            }}
            validationMessage={vehicleInformationState.itemDescriptionErrorMsg}
            isValid={!vehicleInformationState.itemDescriptionIsInvalid}
            isInvalid={vehicleInformationState.itemDescriptionIsInvalid}
            isRequired={false}
            onBlurCheck={true}
            message={"Optional"}
          />
        </div>
      </div>
      <br />
    </>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(VehicleInformation);
