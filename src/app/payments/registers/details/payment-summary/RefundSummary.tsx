import React, { Fragment, useEffect, useState } from "react";
import parse from "html-react-parser";
import PPMSAccordion from "../../../../../ui-kit/components/common/accordion/PPMS-accordion";
import PPMSDatatable from "../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { formatCurrency } from "../../../../../ui-kit/utilities/FormatUtil";

interface iProps {
  registerId: string;
}

const RefundSummary = (props: iProps) => {
  const { registerId } = props;
  const salesApiService = new SalesApiService();
  const [paymentTotal, updatePaymentTotal] = useState(null);
  const [paymentDetails, updatePaymentDetails] = useState(null);
  const getPaymentDetails = () => {
    //      suffixURL: `/getPaymentsByRegisterId/${registerId}`,
    salesApiService
      .getRefundSummaryByRegisterId(registerId)
      .then((response) => {
        let data = [
          {
            type: "ADR",
            noOfPayments: response.data.totalOfADR,
            amount: formatCurrency.format(response.data.totalAmountOfADR),
          },
          {
            type: "Cancellation",
            noOfPayments: response.data.totalOfCancellation,
            amount: formatCurrency.format(
              response.data.totalAmountOfCancellation
            ),
          },
          {
            type: " Default for Non-Removal",
            noOfPayments: response.data.totalOfNonRemoval,
            amount: formatCurrency.format(
              response.data.totalAmountOfNonRemoval
            ),
          },
          {
            type: "Chargeback",
            noOfPayments: response.data.totalOfChargeback,
            amount: formatCurrency.format(
              response.data.totalAmountOfChargeback
            ),
          },
        ];
        updatePaymentDetails(data);
        updatePaymentTotal(response.data.totalRefundAmount);
      })
      .catch((error) => {
        console.log("failure", error);
      });
  };
  useEffect(() => {
    getPaymentDetails();
  }, []);

  const paymentColumns = [
    {
      Header: "Refund Type",
      accessor: "type",
    },
    {
      Header: "Number of Refunds",
      accessor: "noOfPayments",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
  ];
  const handleSort = (sortBy) => {};
  return (
    <PPMSAccordion
      bordered={true}
      items={[
        {
          title: (
            <>
              <span>Proceeds Breakdown</span>
              <span>
                Refund Summary:{" "}
                {paymentTotal ? formatCurrency.format(paymentTotal) : "$0"}
              </span>
            </>
          ),
          content: (
            <Fragment>
              <div className="usa-accordion--bordered desktop:grid-col-12">
                <div className="short-table manage-payments">
                  <PPMSDatatable
                    title={"Refunds"}
                    data={paymentDetails ? paymentDetails : []}
                    columns={paymentColumns}
                    defaultSortField={"paymentType"}
                    isPaginationEnabled={false}
                    loading={false}
                    totalRows={paymentDetails?.length}
                    handleSort={(sortBy) => handleSort(sortBy)}
                  />
                </div>
              </div>
            </Fragment>
          ),
          expanded: true,
          id: "payments-refunds",
          className: "payments-refunds",
        },
      ]}
    />
  );
};

export default RefundSummary;
