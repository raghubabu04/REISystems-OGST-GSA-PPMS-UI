import moment from "moment";
import React, { useContext } from "react";
import { formatCurrency } from "../../../../../../ui-kit/utilities/FormatUtil";
import { PaymentMethod } from "../../constants/Constants";
import { ContractTransactionContext } from "../ContractTransactionContext";

interface PaymentInformationDetailsProps {}

const PaymentInformationDetails = (props: PaymentInformationDetailsProps) => {
  const {
    contractTransactionState,
    updateContractTransactionState,
  } = useContext(ContractTransactionContext);

  return (
    <div
      className={
        "ui-ppms usa-layout-docs__main desktop:grid-col-auto usa-prose usa-layout-docs"
      }
    >
      {contractTransactionState?.contractData?.paymentInfoDTOList?.map(
        (paymentInfo, index) => {
          switch (paymentInfo.method) {
            case PaymentMethod.CREDIT_CARD: {
              return (
                <>
                  <div className="grid-row">
                    <h3 className="lot-review-h3 full">
                      Payment{" "}
                      {moment(paymentInfo.paymentDate).format("MM/DD/YYYY")}
                    </h3>
                  </div>
                  <div className="tablet:grid-row">
                    <div className={"grid-row grid-gap-2 flex-justify"}>
                      <div className={"grid-row grid-gap"}>
                        <div className="tablet:grid-col-auto">
                          <div className="tablet:grid-row-12">
                            <div className="tablet:grid-row bolderText">
                              Payment Method:
                            </div>
                            <div className="tablet:grid-row">
                              {paymentInfo?.method}
                            </div>
                          </div>
                        </div>
                        <div className="tablet:grid-col-auto">
                          <div className="tablet:grid-row-12">
                            <div className="tablet:grid-row bolderText">
                              CC Amount:
                            </div>
                            <div className="tablet:grid-row">
                              {formatCurrency.format(
                                paymentInfo?.paymentAmount
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="tablet:grid-col-auto">
                          <div className="tablet:grid-row-12">
                            <div className="tablet:grid-row bolderText">
                              Last 4 Digit of CC:
                            </div>
                            <div className="tablet:grid-row">
                              {paymentInfo?.ccNumberL4}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }
            case PaymentMethod.CASH: {
              return (
                <>
                  <div className="grid-row">
                    <h3 className="lot-review-h3 full">
                      Payment{" "}
                      {moment(paymentInfo.paymentDate).format("MM/DD/YYYY")}
                    </h3>
                  </div>
                  <div className="tablet:grid-row">
                    <div className={"grid-row grid-gap-2 flex-justify"}>
                      <div className={"grid-row grid-gap"}>
                        <div className="tablet:grid-col-auto">
                          <div className="tablet:grid-row-12">
                            <div className="tablet:grid-row bolderText">
                              Payment Method:
                            </div>
                            <div className="tablet:grid-row">
                              {paymentInfo?.method}
                            </div>
                          </div>
                        </div>
                        <div className="tablet:grid-col-auto">
                          <div className="tablet:grid-row-12">
                            <div className="tablet:grid-row bolderText">
                              Cash Amount:
                            </div>
                            <div className="tablet:grid-row">
                              {formatCurrency.format(
                                paymentInfo?.paymentAmount
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="tablet:grid-col-auto">
                          <div className="tablet:grid-row-12">
                            <div className="tablet:grid-row bolderText">
                              Deposit Ticket Number:
                            </div>
                            <div className="tablet:grid-row">
                              {paymentInfo?.depositNumber
                                ? paymentInfo?.depositNumber
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }
            case PaymentMethod.CHECK: {
              return (
                <>
                  <div className="grid-row">
                    <h3 className="lot-review-h3 full">
                      Payment{" "}
                      {moment(paymentInfo.paymentDate).format("MM/DD/YYYY")}
                    </h3>{" "}
                  </div>
                  <div className="tablet:grid-row">
                    <div className={"grid-row grid-gap-2 flex-justify"}>
                      <div className={"grid-row grid-gap"}>
                        <div className="tablet:grid-col-auto">
                          <div className="tablet:grid-row-12">
                            <div className="tablet:grid-row bolderText">
                              Payment Method:
                            </div>
                            <div className="tablet:grid-row">
                              {paymentInfo.method}
                            </div>
                          </div>
                        </div>
                        <div className="tablet:grid-col-auto">
                          <div className="tablet:grid-row-12">
                            <div className="tablet:grid-row bolderText">
                              Check Number:
                            </div>
                            <div className="tablet:grid-row">
                              {paymentInfo.checkNumber}
                            </div>
                          </div>
                        </div>
                        <div className="tablet:grid-col-auto">
                          <div className="tablet:grid-row-12">
                            <div className="tablet:grid-row bolderText">
                              Check Amount:
                            </div>
                            <div className="tablet:grid-row">
                              {formatCurrency.format(
                                paymentInfo?.paymentAmount
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }
            case PaymentMethod.WIRE_TRANSFER: {
              return (
                <>
                  <div className="grid-row">
                    <h3 className="lot-review-h3 full">
                      Payment{" "}
                      {moment(paymentInfo.paymentDate).format("MM/DD/YYYY")}
                    </h3>{" "}
                  </div>
                  <div className="tablet:grid-row">
                    <div className={"grid-row grid-gap-2 flex-justify"}>
                      <div className={"grid-row grid-gap"}>
                        <div className="tablet:grid-col-auto">
                          <div className="tablet:grid-row-12">
                            <div className="tablet:grid-row bolderText">
                              Payment Method:
                            </div>
                            <div className="tablet:grid-row">
                              {paymentInfo?.method}
                            </div>
                          </div>
                        </div>
                        <div className="tablet:grid-col-auto">
                          <div className="tablet:grid-row-12">
                            <div className="tablet:grid-row bolderText">
                              Wire Transfer Number:
                            </div>
                            <div className="tablet:grid-row">
                              {paymentInfo?.wireTransferNumber
                                ? paymentInfo?.wireTransferNumber
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="tablet:grid-col-auto">
                          <div className="tablet:grid-row-12">
                            <div className="tablet:grid-row bolderText">
                              Wire Transfer Amount:
                            </div>
                            <div className="tablet:grid-row">
                              {formatCurrency.format(
                                paymentInfo?.paymentAmount
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }
          }
        }
      )}
    </div>
  );
};

export default PaymentInformationDetails;
