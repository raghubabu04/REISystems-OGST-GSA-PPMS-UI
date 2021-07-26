import React, { useContext, useState } from "react";
import { PPMSDatepicker } from "../../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import moment from "moment";
import { ContractTransactionContext } from "./ContractTransactionContext";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { commonActions } from "../../../../../_redux/_actions/common.actions";
import { formatClaimNumber } from "../../../../../ui-kit/utilities/FormatUtil";

interface RemovalInformationDetailsProps {
  dueDate: any;
  finalDefaultDate: any;
  preliminaryRemovalDueDate: any;
  actions?: any;
  actualRemovalDate?: any;
  holiday?: any;
  getHolidays?: any;
  canEdit: boolean;
}

const RemovalInformationDetails = (props: RemovalInformationDetailsProps) => {
  const { holiday, getHolidays } = props;
  const {
    contractTransactionState,
    updateContractTransactionState,
  } = useContext(ContractTransactionContext);
  const [isPrelRemovalDueDateValid, setIsPrelRemovalDueDateValid] = useState(
    true
  );
  const [
    isActualRemovalDueDateValid,
    setIsActualRemovalDueDateValid,
  ] = useState(true);
  const [inValidMsg, setInValidMsg] = useState("");
  const { contractData } = contractTransactionState;

  const handlePrelimDateUpdate = (value) => {
    if (value !== null && moment(value).isValid()) {
      contractData.prelRemovalDueDate = moment(value.toString()).format(
        "MM/DD/YYYY"
      );
      if (moment(value.toString()).isBefore(moment())) {
        setInValidMsg("Please pick a future date");
        setIsPrelRemovalDueDateValid(false);
      } else {
        setInValidMsg("");
        setIsPrelRemovalDueDateValid(true);
      }
      updateContractTransactionState({ contractData });
    }
  };

  const handleActualRemovalDateUpdate = (value) => {
    if (value !== null && moment(value).isValid()) {
      const { data, contractData } = contractTransactionState;
      contractData.removalDate = moment(value.toString()).format("MM/DD/YYYY");

      if (moment(value.toString()).isBefore(moment())) {
        setInValidMsg("Please pick a future date");
        setIsActualRemovalDueDateValid(false);
      } else {
        setInValidMsg("");
        setIsActualRemovalDueDateValid(true);
      }
      updateContractTransactionState({ contractData });
    }
  };

  const getHolidaysByYear = (year) => {
    if (year !== holiday?.year) {
      getHolidays(year);
    }
  };

  const updateContract = async () => {
    const salesService = new SalesApiService();
    const { addToast } = props.actions;
    let { contractData } = contractTransactionState;
    let currentDate = moment().format("MM/DD/YYYY");
    if (
      (contractData.removalDate === null ||
        moment(contractData.removalDate).isAfter(currentDate, "days") ||
        moment(contractData.removalDate).isSame(currentDate)) &&
      (contractData.prelRemovalDueDate === null ||
        moment(contractData.prelRemovalDueDate).isAfter(currentDate, "days") ||
        moment(contractData.prelRemovalDueDate).isSame(currentDate))
    ) {
      contractData.removalDate =
        contractData?.removalDate === null
          ? ""
          : moment(contractData?.removalDate?.toString()).format("MM/DD/YYYY");

      contractData.prelRemovalDueDate = moment(
        contractData.prelRemovalDueDate.toString()
      ).format("MM/DD/YYYY");
      contractData.prelPaymentDueDate = moment(
        contractData.prelPaymentDueDate.toString()
      ).format("MM/DD/YYYY");

      updateContractTransactionState(contractData);

      let updateContractResponse = await salesService.updateContract(
        contractData
      );
      if (updateContractResponse) {
        addToast({
          text:
            "Successfully update Preliminary Removal Date and Actual Removal Date",
          type: "success",
          heading: "Success",
        });
      } else {
        addToast({
          text:
            "Error updating Preliminary Removal Date and Actual Removal Date",
          type: "error",
          heading: "Error",
        });
      }
    } else {
      addToast({
        text: "Error updating Preliminary Removal Date and Actual Removal Date",
        type: "error",
        heading: "Error",
      });
    }
  };

  let startDate = moment(
    contractTransactionState?.contractData?.removalDate
  ).isValid()
    ? moment(
        new Date(contractTransactionState?.contractData?.removalDate)
      ).toDate()
    : null;

  let startDatePrel = moment(
    contractTransactionState?.contractData?.prelRemovalDueDate
  ).isValid()
    ? moment(
        new Date(contractTransactionState?.contractData?.prelRemovalDueDate)
      ).toDate()
    : null;

  return (
    <>
      <div
        className={
          "ui-ppms usa-layout-docs__main desktop:grid-col-auto usa-prose usa-layout-docs"
        }
      >
        <div className="grid-row">
          <h2 className="lot-review-h2 full">Removal Information</h2>
        </div>
        <div className="tablet:grid-row">
          <div className={"grid-row grid-gap-2 flex-justify"}>
            <div className={"grid-row grid-gap"}>
              <div className="tablet:grid-col-auto">
                <div className="tablet:grid-row-12">
                  <div className="tablet:grid-row bolderText paymentHeader">
                    Removal Due Date:
                  </div>
                  <div className="tablet:grid-row">
                    {contractTransactionState?.data?.salesDetails.removalDueDate
                      ? moment(
                          contractTransactionState?.data?.salesDetails
                            .removalDueDate
                        ).format("MM/DD/YYYY")
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div className="tablet:grid-col-auto">
                <div className="tablet:grid-row-12">
                  <div className="tablet:grid-row bolderText paymentHeader">
                    Final Default Date:
                  </div>
                  <div className="tablet:grid-row">
                    {contractTransactionState?.contractData?.nonRemDefaultDate
                      ? moment(
                          contractTransactionState?.contractData
                            ?.nonRemDefaultDate
                        ).format("MM/DD/YYYY")
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div className="tablet:grid-col-auto">
                <div className="tablet:grid-row-12 payment">
                  <PPMSDatepicker
                    format={"MM/DD/YYYY"}
                    id={"preliminary-removal-date"}
                    label={"Preliminary Removal Date:"}
                    display={""}
                    className={""}
                    labelBold={true}
                    updateDate={handlePrelimDateUpdate}
                    startDate={startDatePrel}
                    minDate={startDatePrel}
                    isRequired={true}
                    notShowFormat={true}
                    isDisabled={props.canEdit}
                    excludeWeekends={true}
                    excludeHolidays={true}
                    isInvalid={!isPrelRemovalDueDateValid}
                    useDefaultValidation={false}
                    setHolidayYear={(year) => getHolidaysByYear(year)}
                    holidayList={holiday?.holidays}
                    validationMessage={inValidMsg}
                  />
                </div>
              </div>
              <div className="tablet:grid-col-auto">
                <div className="tablet:grid-row-12 payment">
                  <PPMSDatepicker
                    format={"MM/DD/YYYY"}
                    id={"actual-removal-date"}
                    label={"Actual Removal Date:"}
                    display={""}
                    className={""}
                    labelBold={true}
                    updateDate={handleActualRemovalDateUpdate}
                    startDate={startDate}
                    minDate={startDate}
                    isRequired={true}
                    notShowFormat={true}
                    isDisabled={props.canEdit}
                    excludeWeekends={true}
                    excludeHolidays={true}
                    isInvalid={!isActualRemovalDueDateValid}
                    useDefaultValidation={false}
                    setHolidayYear={(year) => getHolidaysByYear(year)}
                    holidayList={holiday?.holidays}
                    validationMessage={inValidMsg}
                  />
                </div>
              </div>
              {contractTransactionState?.contractData?.removalClaimNumber && (
                <div className="tablet:grid-col-auto">
                  <div className="tablet:grid-row-12">
                    <div className="tablet:grid-row bolderText paymentHeader">
                      Claim Number:
                    </div>
                    <div className="tablet:grid-row">
                      {formatClaimNumber(
                        contractTransactionState?.contractData
                          ?.removalClaimNumber
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"d-flex justify-content-center grid-col"}>
            <ul className="usa-button-group usa-button-group--segmented">
              <li className="usa-button-group__item">
                <PPMSButton
                  variant={"outline-secondary"}
                  type={"reset"}
                  label={"Update Removal Information"}
                  onPress={updateContract}
                  id={"update-payment-information"}
                  isDisabled={props.canEdit}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
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
    updateSaleInfo: (contractId, contractNumber, saleAction, zone) =>
      dispatch(
        saleAction.updateSaleInfo(contractId, contractNumber, saleAction, zone)
      ),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemovalInformationDetails);
