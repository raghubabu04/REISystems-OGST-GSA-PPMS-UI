import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FleetApiService } from "../../../../api-kit/sales/fleet-api-service";
import { isFormSubmitted } from "../../../../service/validation.service";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { formatContractNumber } from "../constants/Constants";
import {
  formatDecimalNumber,
  requiredValidation,
  vinValidation,
} from "../constants/Validations";
import { SalePaymentContext } from "../PaymentContext";

interface SearchContractProps {}

function SearchContract(props: SearchContractProps) {
  const {
    searchContractState,
    updateSearchContractState,
    paymentState,
    updatePaymentState,
  } = useContext(SalePaymentContext);

  const fleetApiService = new FleetApiService();

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
  }, [searchContractState]);

  function validateForm() {
    onBlurContractNumber(searchContractState.contractNumber);
    onBlurVinNumber(searchContractState.last4Vin);
  }

  function onBlurContractNumber(value) {
    let validation = requiredValidation(value, "Contract Number");

    if (!validation.inValid) {
      fleetApiService
        .getContractNumber(value)
        .then((response) => {
          updateSearchContractState({
            contractNumberIsInValid: false,
            contractNumberIsValid: false,
            contractNumberValidationMessage: "",
          });
        })
        .catch((error) => {
          if (error.status === 404) {
            updateSearchContractState({
              contractNumberIsInValid: true,
              contractNumberIsValid: false,
              contractNumberValidationMessage: "Contract Number is invalid.",
              searchVinNumber: "",
              searchContractNumber: "",
              isSearchValid: false,
            });
          }
        });
    } else {
      updateSearchContractState({
        contractNumberIsInValid: validation.inValid,
        contractNumberIsValid: !validation.inValid,
        contractNumberValidationMessage: validation.validationError,
      });
      if (validation.inValid) {
        updateSearchContractState({
          searchVinNumber: "",
          searchContractNumber: "",
          isSearchValid: false,
        });
      }
    }
  }

  function onBlurVinNumber(value) {
    let validation = requiredValidation(value, "VIN Number");
    if (!validation.inValid) {
      validation = vinValidation(value);
    }

    if (!validation.inValid) {
      fleetApiService
        .getVinNumber(value)
        .then((response) => {
          updateSearchContractState({
            last4VinIsInValid: false,
            last4VinIsValid: false,
            last4VinValidationMessage: "",
          });
        })
        .catch((error) => {
          if (error.status === 404) {
            updateSearchContractState({
              last4VinIsInValid: true,
              last4VinIsValid: false,
              last4VinValidationMessage: "VIN Number is invalid.",
              searchVinNumber: "",
              searchContractNumber: "",
              isSearchValid: false,
            });
          }
        });
    } else {
      updateSearchContractState({
        last4VinIsInValid: validation.inValid,
        last4VinIsValid: !validation.inValid,
        last4VinValidationMessage: validation.validationError,
      });
      if (validation.inValid) {
        updateSearchContractState({
          searchVinNumber: "",
          searchContractNumber: "",
          isSearchValid: false,
        });
      }
    }
  }

  function handleSearch() {
    if (
      !searchContractState.contractNumberIsInValid &&
      !searchContractState.last4VinIsInValid &&
      searchContractState.contractNumber.length !== 0 &&
      searchContractState.last4Vin.length !== 0
    ) {
      let data = {
        contractNumber: searchContractState.contractNumber,
        vin: searchContractState.last4Vin,
      };

      fleetApiService
        .getContractNumAndVin(data)
        .then((response) => {
          updateSearchContractState({
            searchVinNumber: response?.data?.vin,
            isSearchValid: true,
            searchContractNumber: response?.data?.contractNumber,
            searchContractId: response?.data?.contractId,
          });
          if (response?.data?.partiallyPaid) {
            let totalPurchase = response?.data?.totalPurchasePrice
              ? formatDecimalNumber(response?.data?.totalPurchasePrice, false)
              : "";
            let pendingAmount = response?.data?.pendingAmount
              ? formatDecimalNumber(response?.data?.pendingAmount, false)
              : "";
            if (pendingAmount === "") {
              pendingAmount = "0";
            }

            updatePaymentState({
              totalPurchase: totalPurchase,
              pendingAmount: pendingAmount,
              partiallyPaid: true,
              enablePrimary: false,
              totalPurchaseAmountIsDisabled: true,
              dynamicPendingAmount: pendingAmount,
            });
          } else {
            const { primary } = paymentState;
            primary.cardNumber = "";
            primary.cardType = "";
            primary.expDate = "";
            primary.cvv = "";
            primary.amount = "";
            primary.cardHolderName = "";
            primary.cardHolderNameIsInValid = false;
            primary.cardHolderNameIsValid = false;
            primary.cardHolderValidationMessage = "";
            primary.cardNumberIsInValid = false;
            primary.cardNumberIsValid = false;
            primary.cardNumberValidationMessage = "";
            primary.cardTypeIsInValid = false;
            primary.cardTypeIsValid = false;
            primary.cardTypeValidationMessage = "";
            primary.expDateIsInValid = false;
            primary.expDateIsValid = false;
            primary.expDateValidationMessage = "";
            primary.cvvIsInValid = false;
            primary.cvvIsValid = false;
            primary.cvvValidationMessage = "";
            primary.amountIsInValid = false;
            primary.amountIsValid = false;
            primary.amountValidationMessage = "";
            const { secondary } = paymentState;
            secondary.cardNumber = "";
            secondary.cardType = "";
            secondary.expDate = "";
            secondary.cvv = "";
            secondary.amount = "";
            secondary.cardHolderName = "";
            secondary.cardHolderNameIsInValid = false;
            secondary.cardHolderNameIsValid = false;
            secondary.cardHolderValidationMessage = "";
            secondary.cardNumberIsInValid = false;
            secondary.cardNumberIsValid = false;
            secondary.cardNumberValidationMessage = "";
            secondary.cardTypeIsInValid = false;
            secondary.cardTypeIsValid = false;
            secondary.cardTypeValidationMessage = "";
            secondary.expDateIsInValid = false;
            secondary.expDateIsValid = false;
            secondary.expDateValidationMessage = "";
            secondary.cvvIsInValid = false;
            secondary.cvvIsValid = false;
            secondary.cvvValidationMessage = "";
            secondary.amountIsInValid = false;
            secondary.amountIsValid = false;
            secondary.amountValidationMessage = "";
            let otherModePayment = [
              {
                id: "otherModeOfPayment",
                value: "Other Mode Of Payment",
                isSelected: false,
              },
            ];
            updatePaymentState({
              totalPurchase: "",
              totalPurchaseIsInValid: false,
              totalPurchaseIsValid: false,
              totalPurchaseValidationMessage: "",
              pendingAmount: "",
              pendingAmountIsInValid: false,
              pendingAmountIsValid: false,
              pendingAmountValidationMessage: "",
              otherModeOfPayment: false,
              amount: "",
              totalPurchaseAmountIsDisabled: false,
              otherModeOptions: otherModePayment,
              amountIsInValid: false,
              amountIsValid: false,
              amountValidationMessage: "",
              paymentDescription: "",
              paymentDescriptionIsInValid: false,
              paymentDescriptionIsValid: false,
              paymentDescriptionValidationMessage: "",
              enableSecondary: false,
              enablePrimary: true,
              isSecondaryButtonDisabled: false,
              partiallyPaid: false,
              primary,
              secondary,
            });
          }
        })
        .catch((error) => {
          if (error.status === 404) {
            updateSearchContractState({
              last4VinIsInValid: true,
              last4VinIsValid: false,
              last4VinValidationMessage:
                "VIN is not linked to the contract number provided.",
              searchVinNumber: "",
              searchContractNumber: "",
              isSearchValid: false,
            });
          }
        });
    } else {
      onBlurContractNumber(searchContractState.contractNumber);
      onBlurVinNumber(searchContractState.last4Vin);
    }
  }

  function handleClear() {
    updateSearchContractState({
      contractNumber: "",
      contractNumberIsInValid: false,
      contractNumberIsValid: false,
      contractNumberValidationMessage: "",
      last4Vin: "",
      last4VinIsInValid: false,
      last4VinIsValid: false,
      last4VinValidationMessage: "",
      searchVinNumber: "",
      searchContractNumber: "",
      isSearchValid: false,
    });
  }

  return (
    <>
      <div className="grid-row grid-gap-4">
        <div className={"grid-col-3"}>
          <PPMSInput
            id={"payment-contractNumber"}
            name={"contractNumber"}
            label={"Contract Number"}
            value={searchContractState.contractNumber}
            onBlur={(event) => {
              onBlurContractNumber(event.target.value);
            }}
            onChange={(event) => {
              updateSearchContractState({
                contractNumber: event.target.value.toUpperCase(),
                contractNumberIsInValid: false,
                contractNumberIsValid: false,
                contractNumberValidationMessage: "",
              });
            }}
            isDisabled={false}
            inputType={"text"}
            isInvalid={searchContractState.contractNumberIsInValid}
            isValid={searchContractState.contractNumberIsValid}
            isRequired={true}
            validationMessage={
              searchContractState.contractNumberValidationMessage
            }
            maxLength={30}
          />
        </div>
        <div className={"grid-col-3"}>
          <PPMSInput
            id={"payment-vin"}
            name={"contractNumber"}
            label={"Last 6 digits of VIN"}
            value={searchContractState.last4Vin}
            onBlur={(event) => {
              onBlurVinNumber(event.target.value);
            }}
            onChange={(event) => {
              updateSearchContractState({
                last4Vin: event.target.value.toUpperCase(),
                last4VinIsInValid: false,
                last4VinIsValid: false,
                last4VinValidationMessage: "",
              });
            }}
            isDisabled={false}
            inputType={"text"}
            isInvalid={searchContractState.last4VinIsInValid}
            isValid={searchContractState.last4VinIsValid}
            isRequired={true}
            validationMessage={searchContractState.last4VinValidationMessage}
            maxLength={6}
          />
        </div>
        <div className={"margin-top-7 col-md-auto"}>
          <PPMSButton
            variant={"primary"}
            type={"button"}
            value={""}
            label={"Search"}
            onPress={handleSearch}
            id={"saleContractSearch"}
          />
        </div>
        <div className={"margin-top-7 col-md-auto"}>
          <PPMSButton
            variant={"primary"}
            type={"button"}
            value={""}
            label={"Clear"}
            onPress={handleClear}
            id={"paymentClear"}
          />
        </div>
      </div>
      {searchContractState.isSearchValid && (
        <div className="grid-row grid-gap-4">
          <div className={"grid-col-5"}>
            <PPMSInput
              id={"search-vehicleIdNum"}
              name={"vehicleIdNum"}
              label={"Vehicle Identification Number"}
              value={searchContractState.searchVinNumber}
              onChange={(event) => {}}
              isDisabled={true}
              inputType={"text"}
              isInvalid={false}
              isValid={true}
              isRequired={true}
              validationMessage={""}
            />
          </div>

          <div className={"grid-col-3"}>
            <PPMSInput
              id={"payment-contractNumber"}
              name={"contractNumber"}
              label={"Contract Number"}
              value={formatContractNumber(
                searchContractState.searchContractNumber
              )}
              onChange={(event) => {}}
              isDisabled={true}
              inputType={"text"}
              isInvalid={false}
              isValid={true}
              isRequired={true}
              validationMessage={""}
            />
          </div>
        </div>
      )}
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(SearchContract);
