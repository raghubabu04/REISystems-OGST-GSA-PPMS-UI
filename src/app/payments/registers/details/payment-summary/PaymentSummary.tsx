import React, { Fragment, useEffect, useState } from "react";
import PPMSAccordion from "../../../../../ui-kit/components/common/accordion/PPMS-accordion";
import PPMSDatatable from "../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { formatCurrency } from "../../../../../ui-kit/utilities/FormatUtil";

interface PaymentSummaryProps {
  registerId: string;
}

const PaymentSummary = (props: PaymentSummaryProps) => {
  const { registerId } = props;
  const salesApiService = new SalesApiService();
  const [paymentTotal, updatePaymentTotal] = useState(null);
  const [paymentDetails, updatePaymentDetails] = useState(null);
  const getPaymentDetails = () => {
    salesApiService
      .getPaymentDetailsByRegisterId(registerId)
      .then((response) => {
        updatePaymentDetails(response.data);
        let total = 0;
        response.data.forEach((payment) => {
          payment.amount ? (total += payment.amount) : (total = total);
        });
        updatePaymentTotal(total);
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
      Header: "Payment Type",
      accessor: "type",
    },
    {
      Header: "Number of Payments",
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
              <span>Payments</span>
              <span>
                Payment Summary:{" "}
                {paymentTotal ? formatCurrency.format(paymentTotal) : "$0"}
              </span>
            </>
          ),
          content: (
            <Fragment>
              <div className="usa-accordion--bordered desktop:grid-col-12">
                <div className="short-table manage-payments">
                  <PPMSDatatable
                    title={"Payments"}
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

export default PaymentSummary;
