import moment from "moment";
import React, { useContext, useState } from "react";
import { PPMSDatepicker } from "../../../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import { ContractTransactionContext } from "../ContractTransactionContext";
import { connect } from "react-redux";
import { commonActions } from "../../../../../../_redux/_actions/common.actions";
import { PPMSButton } from "../../../../../../ui-kit/components/common/PPMS-button";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../../_redux/_actions/toast.actions";
import { SalesApiService } from "../../../../../../api-kit/sales/sales-api-service";
import { formatClaimNumber } from "../../../../../../ui-kit/utilities/FormatUtil";
import PaymentInformationDetails from "./PaymentInformationDetails";
import { PageHelper, Paths } from "../../../../../Router";

interface PaymentInformationProps {
  actions: any;
  holiday?: any;
  getHolidays?: any;
  canEdit: boolean;
}

const PaymentInformation = (props: PaymentInformationProps) => {
  const { holiday, getHolidays } = props;
  const { addToast } = props.actions;
  const salesService = new SalesApiService();
  const [isPrelPaymentDueDateValid, setIsPrelPaymentDueDateValid] = useState(
    true
  );
  const [inValidMsg, setInValidMsg] = useState("");

  const {
    contractTransactionState,
    updateContractTransactionState,
  } = useContext(ContractTransactionContext);

  const getHolidaysByYear = (year) => {
    if (year !== holiday?.year) {
      getHolidays(year);
    }
  };

  const handleDateUpdate = (value) => {
    if (value !== null && moment(value).isValid()) {
      const { contractData } = contractTransactionState;
      contractData.prelPaymentDueDate = moment(value.toString()).format(
        "MM/DD/YYYY"
      );

      if (moment(value.toString()).isBefore(moment())) {
        setInValidMsg("Please pick a future date");
        setIsPrelPaymentDueDateValid(false);
      } else {
        setInValidMsg("");
        setIsPrelPaymentDueDateValid(true);
      }
      updateContractTransactionState({ contractData });
    }
  };

  const handlePaymentInfoUpdate = async () => {
    let { contractData } = contractTransactionState;
    let currentDate = moment().format("MM/DD/YYYY");
    if (
      contractData.prelPaymentDueDate === null ||
      moment(contractData.prelPaymentDueDate).isAfter(currentDate, "days") ||
      moment(contractData.prelPaymentDueDate).isSame(currentDate)
    ) {
      contractData.prelRemovalDueDate = moment(
        contractData?.prelRemovalDueDate?.toString()
      ).format("MM/DD/YYYY");
      contractData.prelPaymentDueDate = moment(
        contractData?.prelPaymentDueDate?.toString()
      ).format("MM/DD/YYYY");
      contractData.removalDate =
        contractData?.removalDate === null
          ? ""
          : moment(contractData?.removalDate?.toString()).format("MM/DD/YYYY");
      let saveSalesResponse = await salesService.updateContract(contractData);
      if (saveSalesResponse) {
        addToast({
          text: "Successfully update Preliminary Payment Due Date",
          type: "success",
          heading: "Success",
        });
      } else {
        addToast({
          text: "Error updating Preliminary Payment Due Date",
          type: "error",
          heading: "Error",
        });
      }
    } else {
      addToast({
        text: "Error updating Preliminary Payment Due Date",
        type: "error",
        heading: "Error",
      });
    }
  };

  //TODO
  const handleClickRecordChargeback = () => {
    PageHelper.openPage(
      Paths.contractSales +
        "/chargeback/" +
        contractTransactionState?.contractData?.contractNumber
    );
  };

  return (
    <div
      className={
        "ui-ppms usa-layout-docs__main desktop:grid-col-auto usa-prose usa-layout-docs"
      }
    >
      <div className="grid-row">
        <h2 className="lot-review-h2 full">Payment Information</h2>
      </div>
      <div className="tablet:grid-row">
        <div className={"grid-row grid-gap-2 flex-justify"}>
          <div className={"grid-row grid-gap"}>
            <div className="tablet:grid-col-auto">
              <div className="tablet:grid-row-12">
                <div className="tablet:grid-row bolderText paymentHeader">
                  Sale Creation Date:
                </div>
                <div className="tablet:grid-row">
                  {contractTransactionState?.data?.salesDetails?.salesDate}{" "}
                  {contractTransactionState?.data?.salesDetails?.salesTime}
                </div>
              </div>
            </div>
            <div className="tablet:grid-col-auto">
              <div className="tablet:grid-row-12">
                <div className="tablet:grid-row bolderText paymentHeader">
                  Payment Due Date:
                </div>
                <div className="tablet:grid-row">
                  {contractTransactionState?.data?.salesDetails?.paymentDueDate}
                </div>
              </div>
            </div>
            <div className="tablet:grid-col-auto">
              <div className="tablet:grid-row-12">
                <div className="tablet:grid-row bolderText paymentHeader">
                  Pay Completion Date:
                </div>
                <div className="tablet:grid-row">
                  {contractTransactionState?.contractData?.paymentDate
                    ? moment(
                        contractTransactionState?.contractData?.paymentDate
                      ).format("MM/DD/YYYY")
                    : "N/A"}
                </div>
              </div>
            </div>
            <div className="tablet:grid-col-auto">
              <div className="tablet:grid-row-12 payment">
                <PPMSDatepicker
                  id={"preliminary-payment-date"}
                  format={"MM/DD/YYYY"}
                  label={"Preliminary Payment Date:"}
                  display={""}
                  className={""}
                  labelBold={true}
                  updateDate={handleDateUpdate}
                  startDate={
                    moment(
                      contractTransactionState?.contractData?.prelPaymentDueDate
                    ).isValid()
                      ? moment(
                          new Date(
                            contractTransactionState?.contractData?.prelPaymentDueDate
                          )
                        ).toDate()
                      : null
                  }
                  minDate={moment(
                    new Date(
                      contractTransactionState?.data?.salesDetails?.paymentDueDate
                    )
                  ).toDate()}
                  isRequired={true}
                  notShowFormat={true}
                  isDisabled={props.canEdit}
                  excludeWeekends={true}
                  excludeHolidays={true}
                  isInvalid={!isPrelPaymentDueDateValid}
                  useDefaultValidation={false}
                  setHolidayYear={(year) => getHolidaysByYear(year)}
                  holidayList={holiday?.holidays}
                  validationMessage={inValidMsg}
                />
              </div>
            </div>
            <div className="tablet:grid-col-auto">
              <div className="tablet:grid-row-12">
                <div className="tablet:grid-row bolderText paymentHeader">
                  Final Default Date:
                </div>
                <div className="tablet:grid-row">
                  {contractTransactionState?.contractData?.nonPayDefaultDate
                    ? moment(
                        contractTransactionState?.contractData
                          ?.nonPayDefaultDate
                      ).format("MM/DD/YYYY")
                    : "N/A"}
                </div>
              </div>
            </div>
            {contractTransactionState?.contractData?.paymentClaimNumber && (
              <div className="tablet:grid-col-auto">
                <div className="tablet:grid-row-12">
                  <div className="tablet:grid-row bolderText paymentHeader">
                    Claim Number:
                  </div>
                  <div className="tablet:grid-row">
                    {formatClaimNumber(
                      contractTransactionState?.contractData?.paymentClaimNumber
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <PaymentInformationDetails />

      <div className={"grid-row grid-gap-4"}>
        <ul className="usa-button-group usa-button-group--segmented">
          <li className="usa-button-group__item">
            <PPMSButton
              variant={"outline-secondary"}
              type={"reset"}
              label={"Update Payment Information"}
              onPress={handlePaymentInfoUpdate}
              id={"update-payment-information"}
              isDisabled={props.canEdit}
            />
          </li>
        </ul>
        <ul className="usa-button-group usa-button-group--segmented">
          <li className="usa-button-group__item">
            <PPMSButton
              variant={"outline-secondary"}
              type={"button"}
              label={"Record Chargeback"}
              onPress={handleClickRecordChargeback}
              id={"record-chargeback"}
              isDisabled={
                contractTransactionState?.contractData?.contractStatus ===
                "Paid"
                  ? false
                  : true
              }
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  holiday: state.common.holiday,
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getHolidays: (year) => {
      dispatch(commonActions.getHolidays(year));
    },
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInformation);
function userState(arg0: boolean): any {
  throw new Error("Function not implemented.");
}
