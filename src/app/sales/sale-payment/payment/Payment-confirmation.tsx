import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FleetApiService } from "../../../../api-kit/sales/fleet-api-service";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { formatDecimalNumber } from "../constants/Validations";

interface PaymentConfirmationProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function FleetPaymentConfirmation(props: PaymentConfirmationProps) {
  const [fleetPaymentState, updateFleetPaymentState] = useState<any>({});
  const fleetApiService = new FleetApiService();
  const paymentIds = props.match.params.paymentIds;

  useEffect(() => {
    fleetApiService
      .getFleetPaymentDetails(paymentIds)
      .then((response) => {
        updateFleetPaymentState(response?.data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className={"grid-row ui-ppms grid-grap-4"}>
        <div className="header-row grid-row">
          <h1>Payment Confirmation</h1>
        </div>
      </div>
      <div className={"header-row grid-row ui-ppms"}>
        <div className={"grid-col"}>
          <PPMSAlert
            alertBodyArray={[
              "Your transaction is successful, a purchaser's receipt will be sent to your email account on record from the sales office that must be presented at pickup and removal.",
            ]}
            alertClassName={"dropzone-alert"}
            alertKey={"dropzone-alert-document"}
            alertVariant={"info"}
            id={"dropzone-alert-document"}
            show={true}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-2 payment-transaction margin-top-2"}>
        <h2 className={"ui-ppms padding-top-2 margin-bottom-0"}>
          TRANSACTION DETAILS
        </h2>
        <hr className={"payment-border"} />

        <table className="action-table">
          <thead>
            <tr>
              <th scope="col">Credit Card Number</th>
              <th scope="col">Amount Charged</th>
              <th scope="col">Status</th>
              <th scope="col">Confirmation Number</th>
            </tr>
          </thead>
          <tbody>
            {fleetPaymentState?.payments &&
              fleetPaymentState?.payments.map((payment) => {
                return (
                  <tr className="action-list-row">
                    <td>
                      <span className="action-list-message">
                        xxxx-xxxx-xxxx-{payment?.ccNumberLast4}
                      </span>
                    </td>
                    <td>
                      <span className="action-list-message">
                        $
                        {payment?.amountPaid
                          ? formatDecimalNumber(payment?.amountPaid, true)
                          : ""}
                      </span>
                    </td>
                    <td>
                      <span className="action-list-message">
                        {payment?.status}
                      </span>
                    </td>
                    <td>
                      <span className="action-list-message">
                        {payment?.confirmationNumber
                          ? payment?.confirmationNumber
                          : "-"}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <div className={"grid-col-12 padding-top-3"}>
          <div className={"grid-row"}>
            <b>Sale / Lot Number</b>
          </div>
          <br />
          <div className={"grid-row"}>{fleetPaymentState?.saleNumber}</div>
        </div>

        <div className={"grid-col-12 padding-top-3"}>
          <div className={"grid-row"}>
            <b>Item Name</b>
          </div>
          <br />
          <div className={"grid-row"}>{fleetPaymentState?.itemName}</div>
        </div>

        <div className={"grid-col-12 padding-top-3"}>
          <div className={"grid-row"}>
            <b>Amount Paid</b>
          </div>
          <br />
          <div className={"grid-row"}>
            $
            {fleetPaymentState.amountPaid
              ? formatDecimalNumber(fleetPaymentState.amountPaid, false)
              : ""}
          </div>
        </div>

        <div className={"grid-col-12 padding-top-3"}>
          <div className={"grid-row"}>
            <b>Payment Time and Date</b>
          </div>
          <br />
          <div className={"grid-row"}>
            {moment(fleetPaymentState?.paymentDate).format("MM/DD/yyyy hh:m A")}
          </div>
        </div>

        <div className={"grid-col-12 padding-top-3"}>
          <div className={"grid-row"}>
            <b>Vin Number</b>
          </div>
          <br />
          <div className={"grid-row"}>{fleetPaymentState?.vin}</div>
        </div>
      </div>

      <div className={"header-row grid-row ui-ppms"}>
        <div className={"grid-col"}>
          <PPMSAlert
            alertBodyArray={[
              "Please Note:To avoid duplicate payment processing, do not forward any additional credit card information to the Sales Offices.",
              "No Refunds except as permitted in accordance with form 114C and GSA Sales Terms and Conditions applicable to this sale.",
            ]}
            alertClassName={"dropzone-alert"}
            alertKey={"dropzone-alert-document"}
            alertVariant={"warning"}
            id={"dropzone-alert-document"}
            show={true}
          />
        </div>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(FleetPaymentConfirmation);
