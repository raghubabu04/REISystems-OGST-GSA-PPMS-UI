import { truncate } from "fs";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SalesApiService } from "../../../api-kit/sales/sales-api-service";
import { isFormSubmitted } from "../../../service/validation.service";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import { PPMSDatepicker } from "../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import PropertyReportButtons from "../../property/create-update-property/PropertyReportButtons";
import { Paths } from "../../Router";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { formatCurrency } from "../../../ui-kit/utilities/FormatUtil";

interface paymentConfirmationProps {
    match: any;
    location: any;
    history: any;
    context: any;
    actions: any;
  }



const salesApiService = new SalesApiService();

const PaymentConfirmation=(props:any) => {
    const contractDetails = props.location.state && props.location.state.contractDetails;
    const paymentId=props.match.params.paymentId;
    const [paymentDetails,setPaymentDetails]= useState<any>({});

    useEffect(() => {
        salesApiService.getPaymentConfirmation(paymentId)
        .then(resp => setPaymentDetails(resp.data))
        .catch(error => console.log(error));
    }, []);

    return (
        <>
            <div className={"grid-row ui-ppms grid-grap-4"}>
                <div className="header-row grid-row">
                    <h1>Payment Confirmation</h1>
                </div>
                <div className={"header-row grid-row ui-ppms"}>
                    <div className={"grid-col"}>
                        <PPMSAlert
                            alertBodyArray={["Your tansaction is successful, A purchaser's receipt will be sent to your email account on record from the sales office that must be presented at pickup and removal."]}
                            alertClassName={"dropzone-alert"}
                            alertKey={"dropzone-alert-document"}
                            alertVariant={"info"}
                            id={"dropzone-alert-document"}
                            show={true}
                            />
                    </div>
                </div>
                <div className={"grid-row grid-grap-4"}>
                    &nbsp;
                    <br/>
                    <br/>
                </div>
                <div className={"header-row grid-row ui-ppms"} style={{backgroundColor:"#e7f6f8", padding: "20px",borderRadius:"5px"}}>
                    <h2 className={"ui-ppms"}>TRANSACTION DETAILS</h2>
                    <hr style={{width:"100%"}}/>
                    <div className={"grid-col-3"}>
                        <div className={"grid-row ui-ppms"}><b>CreditCard Number</b></div>
                        <br/>
                        <div className={"grid-row ui-ppms"}>XXXX-XXXX-XXXX-{paymentDetails.ccNumberLast4}</div>
                    </div>
                    <div className={"grid-col-3"}>
                        <div className={"grid-row ui-ppms"}><b>Amount Charged</b></div>
                        <br/>
                        <div className={"grid-row ui-ppms"}>{formatCurrency.format(paymentDetails.awardAmount)}</div>
                    </div>
                    <div className={"grid-col-3"}>
                        <div className={"grid-row ui-ppms"}><b>Status</b></div>
                        <br/>
                        <div className={"grid-row ui-ppms"}>{paymentDetails.status}</div>
                    </div>
                    <div className={"grid-col-3"}>
                        <div className={"grid-row ui-ppms"}><b>Confirmation Number</b></div>
                        <br/>
                        <div className={"grid-row ui-ppms"}>{paymentDetails.confirmationNumber}</div>
                    </div>
                </div>
                <div className={"header-row grid-row ui-ppms"} style={{backgroundColor:"#e7f6f8", padding: "20px",borderRadius:"5px"}}>
                     <div className={"grid-col-3"}>
                        <div className={"grid-row ui-ppms"}><b>Sale / Lot Number</b></div>
                        <br/>
                        <div className={"grid-row ui-ppms"}>{contractDetails.salesNumber}</div>
                     </div>
                </div>
                <div className={"header-row grid-row ui-ppms"} style={{backgroundColor:"#e7f6f8", padding: "20px",borderRadius:"5px"}}>
                     <div className={"grid-col-3"}>
                        <div className={"grid-row ui-ppms"}><b>Lot Name</b></div>
                        <br/>
                        <div className={"grid-row ui-ppms"}>{contractDetails.lotName}</div>
                     </div>
                </div>
                <div className={"header-row grid-row ui-ppms"} style={{backgroundColor:"#e7f6f8", padding: "20px",borderRadius:"5px"}}>
                     <div className={"grid-col-3"}>
                        <div className={"grid-row ui-ppms"}><b>Amount Paid</b></div>
                        <br/>
                        <div className={"grid-row ui-ppms"}>${paymentDetails.amountPaid}</div>
                     </div>
                </div>
                <div className={"header-row grid-row ui-ppms"} style={{backgroundColor:"#e7f6f8", padding: "20px",borderRadius:"5px"}}>
                     <div className={"grid-col-3"}>
                        <div className={"grid-row ui-ppms"}><b>Payment Time and Date</b></div>
                        <br/>
                        <div className={"grid-row ui-ppms"}>{moment(paymentDetails?.paymentDateAndTime).format("MM/DD/yyyy hh:m A")}</div>
                     </div>
                </div> 
                {paymentDetails.sellingAgency==="FLEET" && (
                    <div className={"header-row grid-row ui-ppms"} style={{backgroundColor:"#e7f6f8", padding: "20px",borderRadius:"5px"}}>
                        <div className={"grid-col-3"}>
                            <div className={"grid-row ui-ppms"}><b>Vin Number</b></div>
                            <br/>
                            <div className={"grid-row ui-ppms"}>{paymentDetails.vinNumber}</div>
                        </div>
                    </div>
                )}   
                
                <div className={"grid-row grid-grap-4"}>
                    &nbsp;
                    <br/>
                    <br/>
                </div>
                
                {paymentDetails.sellingAgency==="FLEET" && (
                    <div className={"header-row grid-row ui-ppms"}>
                        <div className={"grid-col"}>
                         <PPMSAlert
                            alertBodyArray={["No Refunds except as permitted in accordance with form 114C and GSA Sales Terms and Conditions applicable to this sale"]}
                            alertClassName={"dropzone-alert"}
                            alertKey={"dropzone-alert-document"}
                            alertVariant={"warning"}
                            id={"dropzone-alert-document"}
                            show={true}
                            />
                        </div>
                    </div> 
                )}  
                <div className={"grid-row grid-grap-4"}>
                    &nbsp;
                    <br/>
                    <br/>
                </div>
                <div className={"header-row grid-row ui-ppms"}>
                    <div className={"grid-col"}>
                        <PPMSAlert
                            alertBodyArray={["Please Note:To avoid duplicate payment processing, do not forward any addtional credit card information to the Sales Offices."]}
                            alertClassName={"dropzone-alert"}
                            alertKey={"dropzone-alert-document"}
                            alertVariant={"warning"}
                            id={"dropzone-alert-document"}
                            show={true}
                            />
                    </div>
                </div>  
                              
            </div>
            
        </>
    );
}


export default PaymentConfirmation;
