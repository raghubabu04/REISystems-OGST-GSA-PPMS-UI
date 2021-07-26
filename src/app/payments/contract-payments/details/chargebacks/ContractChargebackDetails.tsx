import React, { StrictMode, useContext, useEffect, useState } from "react";
import {
  ContractDetailsContext,
  ContractDetailsContextProvider,
} from "../common/ContractDetailsContext";
import ContractBidderSummary from "../common/ContractBidderSummary";
import { isEmptyCheck } from "../../../../property/create-update-property/validations/propertyFieldValidations";
import ContractFeeDetails from "../../../../sales/contracts/contract-refund/ContractFeeDetails";
import ContractPaymentList from "../common/ContractPaymentList";
import ContractNotesFileUpload from "../common/ContractNotesFileUpload";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSToggleRadio } from "../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import {
  currencyToNumber,
  formatCurrency,
} from "../../../../../ui-kit/utilities/FormatUtil";
import { isRequiredValidation } from "../../../../../ui-kit/components/validations/FieldValidations";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { PageHelper, Paths } from "../../../../Router";
interface ContractChargebackDetailsProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  roles: any;
  title;
}
const ContractChargebackDetails = (props: ContractChargebackDetailsProps) => {
  const { match, actions, title } = props;
  let contractNumber: string = "";
  if (match?.params?.contractNumber) {
    contractNumber = match?.params?.contractNumber;
  }
  let { contractDetailsState, updateContractDetailsState } = useContext(
    ContractDetailsContext
  );
  let salesAPIService = new SalesApiService();
  const [currentRefundNotes, setCurrentRefundNotes] = useState("");
  const [registerId, setRegisterId] = useState(null);
  const [chargeBackAmount, updateChargeBackAmount] = useState({
    value: null,
    isInvalid: null,
    validationMessage: "",
  });
  const [refundedByOptions, setRefundedByOptions] = useState(
    getRefundedByOption(
      contractDetailsState?.data?.contractFeeDetails?.refundType
    )
  );
  const submitChargeBack = (state, notes, chargeBackAmount) => {
    let data = {
      contractPaymentDTO: {
        contractId: [state?.data?.contractDetails?.contractId],
      },
      refundType: state.data.contractFeeDetails.refundType,
      currentNotes: notes,
      chargeBackAmount: currencyToNumber(chargeBackAmount.value),
    };
    let bidderId = state.data.bidderDetails.bidderId;
    salesAPIService
      .updateRecordChargeBack(data, bidderId)
      .then(() => {
        addToast({
          text: `Payment submitted successfully.`,
          type: "success",
          heading: "Success",
        });
        setRefundedByOptions(
          getRefundedByOption(
            contractDetailsState?.data?.contractFeeDetails?.refundType
          )
        );
        PageHelper.openPage(Paths.bidderPayments);
      })
      .catch((error) => {
        console.error(error);
        addToast({
          text: `Payment could not be processed.`,
          type: "error",
          heading: "Error",
        });
      });
  };
  const updateRefundedBy = (options) => {
    const selected = options?.find((option) => option.isSelected);
    let state = contractDetailsState;
    state.data.contractFeeDetails.refundType = selected?.value;
    updateContractDetailsState(state);
  };
  function getRefundedByOption(type) {
    return [
      {
        id: "refunded-by-cc",
        value: "CC Company",
        isSelected: type === "CC Company",
      },
      {
        id: "refunded-by-gas",
        value: "GSA",
        isSelected: type === "GSA",
      },
    ];
  }

  useEffect(() => {
    if (
      currencyToNumber(
        contractDetailsState.data.contractFeeDetails.chargebackAmount
      ) > 0
    ) {
      updateChargeBackAmount({
        value: contractDetailsState.data.contractFeeDetails.chargebackAmount
          ? formatCurrency.format(
              parseInt(
                contractDetailsState.data.contractFeeDetails.chargebackAmount
              )
            )
          : null,
        isInvalid: null,
        validationMessage: "",
      });
    }
  }, [contractDetailsState.data.contractFeeDetails.chargebackAmount]);

  return (
    <>
      <StrictMode>
        <div className={"grid-conatiner ui-ppms"}>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <div className={"container"}>
                <div className="item-search-result">
                  <h1>{title}</h1>
                </div>
              </div>
            </div>
          </div>
          <br />
          <ContractBidderSummary
            setRegisterId={setRegisterId}
            contractNumber={contractNumber}
          />
          {!isEmptyCheck(
            contractDetailsState?.data?.contractDetails?.lotId
          ) && (
            <div className={"grid-row grid-gap-4"}>
              <ContractFeeDetails type={"chargeback"} {...props} />
            </div>
          )}

          <ContractPaymentList
            paymentDetails={contractDetailsState?.data?.paymentDetails}
            registerId={registerId}
          />
          <div className={"grid-row grid-gap-4 chargeback-checkbox"}>
            <PPMSInput
              id={`chargebackAmount`}
              name={`chargebackAmount`}
              inputType={"text"}
              isDisabled={false}
              isRequired={true}
              label={"Chargeback Amount"}
              value={chargeBackAmount.value}
              onChange={(event) =>
                updateChargeBackAmount({
                  value: event.target.value.replace(/[^0-9.]/g, ""),
                  isInvalid: chargeBackAmount.isInvalid,
                  validationMessage: chargeBackAmount.validationMessage,
                })
              }
              onBlur={(event) => {
                let formattedValue = event.target.value
                  ? event.target.value.replace(/[^0-9.]/g, "")
                  : null;
                let validity = isRequiredValidation(
                  "Chargeback Amount",
                  event.target.value
                );
                updateChargeBackAmount({
                  value: formattedValue
                    ? formatCurrency.format(formattedValue)
                    : null,
                  isInvalid: validity.isInvalid,
                  validationMessage: validity.validationError,
                });
              }}
              isInvalid={chargeBackAmount.isInvalid}
              validationMessage={chargeBackAmount.validationMessage}
            />
            <PPMSToggleRadio
              id={"refunded-by-radio"}
              options={refundedByOptions}
              isInline={true}
              isDisabled={false}
              name={"refundType"}
              className={""}
              label={"Refunded By"}
              validationMessage={""}
              isRequired={true}
              isSingleSelect={true}
              onChange={(event) => {
                updateRefundedBy(event);
              }}
            />
          </div>
          <ContractNotesFileUpload
            contractDetails={contractDetailsState?.data?.contractDetails}
            setCurrentRefundNotes={setCurrentRefundNotes}
            noteType={"REFUND"}
          />
          <div className="desktop:grid-col-9">
            <PPMSButton
              id={"add-new-lot-link"}
              label={"Submit"}
              className={"out-button"}
              onPress={() =>
                submitChargeBack(
                  contractDetailsState,
                  currentRefundNotes,
                  chargeBackAmount
                )
              }
              isDisabled={
                !contractDetailsState?.data?.contractFeeDetails?.refundType ||
                !chargeBackAmount
              }
            />
            <PPMSButton
              id={"add-new-lot-link"}
              label={"Cancel"}
              className={"out-button"}
              onPress={() => {
                window.location.reload();
              }}
              isDisabled={false}
            />
          </div>
        </div>
      </StrictMode>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: bindActionCreators({ addToast }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractChargebackDetails);
