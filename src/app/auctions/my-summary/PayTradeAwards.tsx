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
import {PageHelper, Paths} from "../../Router";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { FiPlus } from "react-icons/fi";

import { cardValidation, cvvNumberValidation, expiryDateNumber, expiryDateValidation, formatDecimalNumber, requiredValidation, validateAmountNotOver25K, validateTotalPaymentAmount } from "../../sales/sale-payment/constants/Validations";
import { FaTrashAlt } from "react-icons/fa";
import { FleetApiService } from "../../../api-kit/sales/fleet-api-service";
import { Form } from "react-bootstrap";
import { values } from "lodash";
import { formatCurrency } from "../../../ui-kit/utilities/FormatUtil";
import { PPMSToggleCheckbox } from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import { UserApiService } from "../../../api-kit/user/user-api.service";
import creditCardType from "credit-card-type";
import { AwardCardComponent } from "./AwardCardComponent";

interface Creditcard{
    cardHolderName:string,
    isCardHolderNameValid:boolean,
    cardHolderNameValidationMessage:string,
    cardNumber:number | null,
    iscardNumberValid:boolean,
    cardNumberValidationMessage:string,
    cardExpiryDate:string,
    iscardExpiryDateValid:boolean,
    cardExpiryDateValidationMessage:string,
    cardCVV:number | null,
    iscardCVVValid:boolean,
    cardCVVValidationMessage:string,
    cardAmount:string,
    iscardAmountValid:boolean,
    cardAmountValidationMessage:string,
    isValidCard:boolean
}
interface payTradeAwardsProps {
    match: any;
    location: any;
    history: any;
    context: any;
    actions: any;
  }

   interface CreditCardPaymentState {
      cardHolderName: string;
      cardNumber: string;
      cardType: string;
      expDate: string;
      cvv: string;
      amount: string;
      cardHolderNameIsInValid: boolean;
      cardHolderNameIsValid: boolean;
      cardHolderValidationMessage: string;
      cardNumberIsInValid: boolean;
      cardNumberIsValid: boolean;
      cardNumberValidationMessage: string;
      cardTypeIsInValid: boolean;
      cardTypeIsValid: boolean;
      cardTypeValidationMessage: string;
      expDateIsInValid: boolean;
      expDateIsValid: boolean;
      expDateValidationMessage: string;
      cvvIsInValid: boolean;
      cvvIsValid: boolean;
      cvvValidationMessage: string;
      amountIsInValid: boolean;
      amountIsValid: boolean;
      amountValidationMessage: string;
  }

   const defaultPaymentState: CreditCardPaymentState = {
      cardNumber: "",
      cardType: "",
      expDate: "",
      cvv: "",
      amount: "",
      cardHolderName: "",
      cardHolderNameIsInValid: false,
      cardHolderNameIsValid: false,
      cardHolderValidationMessage: "",
      cardNumberIsInValid: false,
      cardNumberIsValid: false,
      cardNumberValidationMessage: "",
      cardTypeIsInValid: false,
      cardTypeIsValid: false,
      cardTypeValidationMessage: "",
      expDateIsInValid: false,
      expDateIsValid: false,
      expDateValidationMessage: "",
      cvvIsInValid: false,
      cvvIsValid: false,
      cvvValidationMessage: "",
      amountIsInValid: false,
      amountIsValid: false,
      amountValidationMessage: "",
  };

 export const RECIPIENT_OPTION = [
    {id: "cardProfileToggle", value: "Please check this box to use the card on profile", isSelected: false},
  ];

  export const AUTOFILL_CARD_OPTION = [
    {id: "autoFillCardToggle", value: "Please provide your consent to save this Creditcard to you profile for future use", isSelected: false},
  ];
  
const salesApiService = new SalesApiService();
const fleetApiService = new FleetApiService();
const userApiService = new UserApiService();
const PayTradeAwards=(props:any) => {
    const contractId=props.match.params.contractId;
    const [contractDetails,setContractDetails]= useState<any>({});
    const [paymentState, setPaymentState] = useState<CreditCardPaymentState>(defaultPaymentState);

    /*const updatePaymentState = (newState: any) => {
        setPaymentState((prevState) => {
            return {...prevState, ...newState};
        });
    };*/

    useEffect(() => {
        salesApiService.fetchContractDetailsData(contractId)
        .then(resp => setContractDetails(resp.data))
        .catch(error => console.log(error));
    }, []);

    const cardView=(<>
        <div>
          <b>Partial payment not accepted. Payment in full required for online payment.</b>
        </div>
        {(
          <div
            key={"credit-primary"}
            className={"grid-row grid-gap-2 credit-card-box margin-top-2"}
            style={{width:"100%"}}
          >
            <h4 className="margin-top-0 margin-bottom-0">Primary Credit Card</h4>
            <div className={"grid-col-12"}>
              <AwardCardComponent
                cardHolderName={paymentState.cardHolderName}
                cardNumber={paymentState.cardNumber}
                expDate={paymentState.expDate}
                cvv={paymentState.cvv}
                amount={paymentState.amount}
                cardNumberIsInValid={paymentState.cardNumberIsInValid}
                cardNumberIsValid={paymentState.cardNumberIsValid}
                cardNumberValidationMessage={
                  paymentState.cardNumberValidationMessage
                }
                cardTypeIsInValid={paymentState.cardTypeIsInValid}
                cardTypeIsValid={paymentState.cardNumberIsValid}
                cardTypeValidationMessage={
                  paymentState.cardNumberValidationMessage
                }
                expDateIsInValid={paymentState.expDateIsInValid}
                expDateIsValid={paymentState.expDateIsValid}
                expDateValidationMessage={
                  paymentState.expDateValidationMessage
                }
                cvvIsInValid={paymentState.cvvIsInValid}
                cvvIsValid={paymentState.cvvIsValid}
                cvvValidationMessage={paymentState.cvvValidationMessage}
                amountIsInValid={paymentState.amountIsInValid}
                amountIsValid={paymentState.amountIsValid}
                amountValidationMessage={
                  paymentState.amountValidationMessage
                }
                cardHolderNameIsInValid={
                  paymentState.cardHolderNameIsInValid
                }
                cardHolderNameIsValid={paymentState.cardHolderNameIsValid}
                cardHolderNameValidationMessage={
                  paymentState.cardHolderValidationMessage
                }
                onBlurCardHolderName={(value) => {
                  onBlurCardHolderName(value);
                }}
                onChangeCardHolderName={(value) => {
                  paymentState.cardHolderName = value;
                  paymentState.cardHolderNameIsInValid = false;
                  paymentState.cardHolderNameIsValid = false;
                  paymentState.cardHolderValidationMessage = "";
                  setPaymentState({...paymentState});
                }}
                onChangeCardNumber={(value,cardType) => {
                  console.log("cardType%%%%",cardType);
                  paymentState.cardNumber = value;
                  paymentState.cardNumberIsInValid = false;
                  paymentState.cardNumberIsValid = false;
                  paymentState.cardNumberValidationMessage = "";
                  paymentState.cardType=cardType.niceType;
                  setPaymentState({...paymentState});
                }}
                onBlurCardNumber={(value) => {
                  onBlurCardNumber(value);
                }}
                onChangeExpDate={(value) => {
                  value = expiryDateNumber(value);                  
                  paymentState.expDate = value;
                  paymentState.expDateIsInValid = false;
                  paymentState.expDateIsValid = false;
                  paymentState.expDateValidationMessage = "";
                  setPaymentState({...paymentState});
                }}
                onBlurExpDate={(value) => {
                  onBlurExpDate(value);
                }}
                onChangeCVV={(value) => {
                  value = value.replace(/\D+/g, "");
                  paymentState.cvv = value;
                  paymentState.cvvIsInValid = false;
                  paymentState.cvvIsValid = false;
                  paymentState.cvvValidationMessage = "";
                  setPaymentState({...paymentState});
                }}
                onBlurCVV={(value) => {
                  onBlurCVV(value);
                }}
                onChangeAmount={(value) => onChangeAmount(value)}
                onBlurAmount={(value) => {
                  onBlurAmount(value);
                }}
              />
            </div>
          </div>
        )}
    </>
  );

    const accordianItems = [{
        title: "Creditcard Information",
        content: (
          <>
            <div className="bidder-terms-checkbox" style={{backgroundColor:"#e7f6f8"}}>
                <div className={"grid-col-12"}>
                  <PPMSToggleCheckbox
                    id={"bidder-agreement-registration-id"}
                    options={RECIPIENT_OPTION}
                    isDisabled={false}
                    name={"cardProfile"}
                    className={"toggle-single-checkbox"}
                    label={""}
                    validationMessage={""}
                    onChange={(options) => {
                      if(options[0]?.isSelected){
                        userApiService.getStoredCreditCardInfo()
                        .then(resp => {
                         let data=resp.data;
                         let expDateFormat=formatCardExpiryDateReverse(data.expDate);
                         let newPaymentState = {...paymentState};
                         newPaymentState.cardHolderName = data.nameOnCard;
                         newPaymentState.cardNumber = data.cardNumber;
                         newPaymentState.expDate = expDateFormat;
                         newPaymentState.cardType = data.type;
                         setPaymentState(newPaymentState);      
                        })
                        .catch(error => console.log(error));
                      }else{
                        setPaymentState({...defaultPaymentState});      
                      }
                    }}
                  />
                </div>
            </div>
            
            <div className={"grid-row grid-grap-4"}>
                {cardView}
            </div>

            <div className="bidder-terms-checkbox" style={{backgroundColor:"#e7f6f8"}}>
              <div className={"grid-col-12"}>
                <PPMSToggleCheckbox
                  id={"bidder-agreement-registration-id"}
                  options={AUTOFILL_CARD_OPTION}
                  isDisabled={false}
                  name={"autofillCard"}
                  className={"toggle-single-checkbox"}
                  label={""}
                  validationMessage={""}
                  onChange={(event) => console.log(event)}
                />
              </div>
            </div>
            
          </>
        ),
        expanded: true,
        id: "creditcard-information",
        trigger: "common",
    }];



    function onBlurAmount(value) {
        value = formatDecimalNumber(value, true);
        let validation = requiredValidation(value, "Amount");
        if (!validation.inValid) {
            let amount = parseInt(value.replaceAll(/\D+/g, ""));
            let awardedAmount = parseInt(contractDetails.awardAmount.toString().replaceAll(/\D+/g, ""));

            if(amount >=25000) {
              validation.validationError = "Maximum of $24,999.99 allowed per card per day";
              validation.inValid = true;
            } else if(awardedAmount > amount){
              validation.validationError ="Amount entered is less than Award amount";
              validation.inValid = true;
            } else if(awardedAmount < amount){
              validation.validationError ="Amount entered is more than Award amount";
              validation.inValid = true;
            }
        }
        if (!validation.inValid) {
            validation = validateAmountNotOver25K(value);
        }

        if (!validation.inValid) {
            let data = {
              screditCardNumber: paymentState.cardNumber,
              scardType: paymentState.cardType,
              amount: value.replace(",", ""),
            };
            fleetApiService
              .getCardPaymentThreshold(data)
              .then((res) => {
                if (!res?.data?.valid) {
                  validation.inValid = true;
                  validation.validationError =
                    "Maximum of $24,999.99 allowed per card per day";
                  paymentState.amount = value;
                  paymentState.amountIsInValid = validation.inValid;
                  paymentState.amountIsValid = !validation.inValid;
                  paymentState.amountValidationMessage = validation.validationError;
                  setPaymentState({...paymentState});
                }
              })
              .catch((error) => {});
          } else {
            paymentState.amount = value;
            paymentState.amountIsInValid = validation.inValid;
            paymentState.amountIsValid = !validation.inValid;
            paymentState.amountValidationMessage = validation.validationError;
            setPaymentState({...paymentState});
          }
    }

    function onChangeAmount(value) {
         value = formatDecimalNumber(value, false);
         paymentState.amountIsInValid = false;
         paymentState.amountIsValid = false;
         paymentState.amountValidationMessage = "";
         paymentState.amount = value;
         setPaymentState({...paymentState});
      }

    function onBlurCVV(value) {
         
        let validation = cvvNumberValidation(value, paymentState.cardType); 
        paymentState.cvvIsInValid = validation.inValid;
        paymentState.cvvIsValid = !validation.inValid;
        paymentState.cvvValidationMessage = validation.validationError;
        setPaymentState({...paymentState});
        return validation.inValid;
      }
    function onBlurExpDate(value) {
        let validation = expiryDateValidation(value);
        paymentState.expDateIsInValid = validation.inValid;
        paymentState.expDateIsValid = !validation.inValid;
        paymentState.expDateValidationMessage = validation.validationError;
        paymentState.expDate = value;
        setPaymentState({...paymentState});
        return validation.inValid;
      }
    function onBlurCardNumber(value) {
        let validation = cardValidation(value);
        paymentState.cardNumberIsInValid = validation.inValid;
        paymentState.cardNumberIsValid = !validation.inValid;
        paymentState.cardNumberValidationMessage = validation.validationError;
          let cvvValidation = cvvNumberValidation(paymentState.cvv, paymentState.cardType);
          paymentState.cvvIsInValid = cvvValidation.inValid;
          paymentState.cvvIsValid = !cvvValidation.inValid;
          paymentState.cvvValidationMessage = cvvValidation.validationError;
          setPaymentState({...paymentState});
        return validation.inValid;
      }

    function onBlurCardHolderName(value) {
        let validation = requiredValidation(value, "Name on card");
        paymentState.cardHolderNameIsInValid = validation.inValid;
        paymentState.cardHolderNameIsValid = !validation.inValid;
        paymentState.cardHolderValidationMessage = validation.validationError;
        setPaymentState({...paymentState});
        return validation.inValid;
      }

    function handleSubmit(event) {
        event.preventDefault();
        let isValid= validateForm();
        if(isValid){
            let body={
                "contractId":contractId,
                "creditCardNumber1":paymentState.cardNumber,
                "creditCardNumberName1": paymentState.cardHolderName,
                "creditCardExpiry1":formatCardExpiryDate(paymentState.expDate),
                "creditCardCvv1":paymentState.cvv,
                "creditCardAmount1":paymentState.amount.replaceAll(/\D+/g, ""),
                "creditCardType":paymentState.cardType,
                "creditCardSaveFlag": AUTOFILL_CARD_OPTION[0].isSelected,
                "creditCardNumber2":"",
                "creditCardNumberName2": "",
                "creditCardExpiry2":"",
                "creditCardCvv2":"",
                "creditCardAmount2":""
            }
            salesApiService.payMyTrades(body).then((response: any) => {
                const { addToast } = props.actions;
                addToast({
                    text: "Payment is completed",
                    type: "success",
                    heading: "Success",
                });

                const url = Paths.PaymentConfirmation + "/"+ response.data;
                props.history.push(url, {contractDetails});
            }).catch((error: any) => {
                console.log(error);
              });
        }
    }

    function validateForm() {
        let isValid=true;
        isValid=!onBlurCardNumber(paymentState.cardNumber) && isValid;
        isValid=!onBlurCVV(paymentState.cvv) && isValid;
        isValid=!onBlurExpDate(paymentState.expDate) && isValid;
        isValid=!onBlurCardHolderName(paymentState.cardHolderName) && isValid;
        if (!paymentState.amountIsInValid) {
          onBlurAmount(paymentState.amount);
        }

        return isValid;
      }

    function formatCardExpiryDate(val:string){
        if(val){
            val = val.split("/").reverse().join("-");
        }
        return val;
    }

    function formatCardExpiryDateReverse(val:string){
      if(val){
          val = val.split("-").reverse().join("/");
      }
      return val;
  }

    return (
        <>
            <div className={"grid-row ui-ppms grid-grap-4"}>
                <div className="header-row grid-row">
                    <h1>Payment</h1>
                </div>
                <div className="header-row grid-row">
                    <h2>Payment Method</h2>
                </div>
                <div className={"header-row grid-row ui-ppms"}>
                    <div className={"grid-col"}>
                        <PPMSAlert
                            alertBodyArray={["Please verify the item detail before proceeding to pay"]}
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
                    <h2 className={"ui-ppms"}>Sale Information</h2>
                    <hr style={{width:"100%"}}/>
                    <div className={"grid-col-3"}>
                        <div className={"grid-row ui-ppms"}><b>Sale/lot number</b></div>
                        <br/>
                        <div className={"grid-row ui-ppms"}>{contractDetails.salesNumber}</div>
                    </div>
                    <div className={"grid-col-3"}>
                        <div className={"grid-row ui-ppms"}><b>Award amount</b></div>
                        <br/>
                        <div className={"grid-row ui-ppms"}>{formatCurrency.format(contractDetails.awardAmount)}</div>
                    </div>
                    <div className={"grid-col-3"}>
                        <div className={"grid-row ui-ppms"}><b>Lot Name</b></div>
                        <br/>
                        <div className={"grid-row ui-ppms"}>{contractDetails.lotName}</div>
                    </div>
                    <div className={"grid-col-3"}>
                        <div className={"grid-row ui-ppms"}><b>Award Date</b></div>
                        <br/>
                        <div className={"grid-row ui-ppms"}>{contractDetails.awardDate}</div>
                    </div>
                </div>
                <div className={"grid-row grid-grap-4"}>
                    &nbsp;
                    <br/>
                    <br/>
                </div>
                <div className={"header-row grid-row ui-ppms"}>
                    <Form
                        noValidate
                        onSubmit={handleSubmit}
                        className={"usa-accordion--bordered desktop:grid-col-12"}
                        aria-multiselectable="true"
                        > 
                        <PPMSAccordion bordered={true} items={accordianItems} />
                        
                        <div className={"grid-row grid-gap-6 margin-top-1"}>
                            <div className={"grid-row"}>
                                <PPMSButton
                                    variant={"primary"}
                                    type={"submit"}
                                    label={"Submit"}
                                    onPress={handleSubmit}
                                    id={"submitButton"}
                                    className={"out-button"}
                                />
                                <PPMSButton
                                    variant={"primary"}
                                    type={"reset"}
                                    label={"Cancel"}
                                    onPress={() => {
                                      isFormSubmitted.next(false);
                                      setPaymentState({...defaultPaymentState});
                                      RECIPIENT_OPTION.forEach(r => r.isSelected=false);
                                      AUTOFILL_CARD_OPTION.forEach(r => r.isSelected=false);
                                      PageHelper.openPage(Paths.myTrades);
                                    }}
                                    id={"cancelButton"}
                                    className={"out-button"}
                                    />
                            </div>
                        </div>
                    </Form>
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
export default connect(null, mapDispatchToProps)(PayTradeAwards);
//export default PayTradeAwards;
