import React, {useContext, useEffect} from "react";
import {BidderContext} from "../BidderContext";
import {isFormSubmitted} from "../../../../service/validation.service";
import {PPMSInput} from "../../../../ui-kit/components/common/input/PPMS-input";
import {PPMSToggleCheckbox} from "../../../../ui-kit/components/common/toggle/PPMS-toggle";

export default function BidderExperianVerification() {

  const {bidderExperianVerificationState, updateBidderExperianVerificationState} = useContext(BidderContext);
  const experianConsent = [{
    value: "You understand that by checking this box you AGREE that you are providing 'written instructions' to the General Services Administration (GSA) under the Fair Credit Reporting Act authorizing GSA to obtain information from your personal credit profile or other information from Experian. You authorize GSA to obtain such information solely to confirm your identity to avoid fraudulent transactions in your name",
    id: "experianConsent",
    isSelected: bidderExperianVerificationState.experianConsent,
  }];

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validate();
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [bidderExperianVerificationState]);

  function handleCreditCardNumberChange(event) {
    const formattedCreditCardNumber = formatCreditCard(event);
    updateBidderExperianVerificationState({
      creditCardNumber: formattedCreditCardNumber,
      isCreditCardInvalid: false,
      creditCardValidationMessage: ""
    })
  }

  function formatCreditCard(event) {
    const input = event.replace(/[^0-9]/g, "").substring(0, 16);
    if (event.length === 0 || input.length === 0) {
      return "";
    }
    const card1 = input.substring(0, 4);
    const card2 = input.substring(4, 8);
    const card3 = input.substring(8, 12);
    const card4 = input.substring(12, 16);
    if (input.length > 12) {
      event = `${card1} ${card2} ${card3} ${card4}`;
    } else if (input.length > 8) {
      event = `${card1} ${card2} ${card3}`;
    } else if (input.length > 4) {
      event = `${card1} ${card2}`;
    } else {
      event = input;
    }
    return event;
  }

  function handleExperianConsent(event: any) {
    bidderExperianVerificationState.experianConsent = event[0].isSelected;
  }

  function validate() {
    if (bidderExperianVerificationState.creditCardNumber.length !== 0 && bidderExperianVerificationState.creditCardNumber.length !== 19) {
      updateBidderExperianVerificationState({
        isCreditCardInvalid: true,
        creditCardValidationMessage: "Invalid Credit Card Number."
      })
    }
    if (!bidderExperianVerificationState.experianConsent) {
      updateBidderExperianVerificationState({experianConsentValidationMessage: "Please accept Consent for Experian"})
    }
  }

  function toggleTermsOfUse() {
    let display = document.getElementById("terms-of-use").style.display;
    (display === "none")
      ? document.getElementById("terms-of-use").style.display = "block"
      : document.getElementById("terms-of-use").style.display = "none"
  }

  return (
    <React.Fragment>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-5"}>
          <PPMSInput
            className={"bidder-creditcard"}
            isDisabled={false}
            id={"bidder-creditcard"}
            name={"bidder-creditcard"}
            isInvalid={bidderExperianVerificationState.isCreditCardInvalid}
            label={"Credit Card Number"}
            onChange={(event) => handleCreditCardNumberChange(event.target.value)}
            placeHolder={"Enter a credit card number"}
            isRequired={false}
            inputType={"text"}
            validationMessage={bidderExperianVerificationState.creditCardValidationMessage}
            value={bidderExperianVerificationState.creditCardNumber}
            maxLength={19}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-12"}>
          <PPMSToggleCheckbox
            isRequired={true}
            id={"experianVerification"}
            options={experianConsent}
            isInline={false}
            isDisabled={false}
            name={"experianVerification"}
            className={"experianVerification"}
            label={"Consent for Experian Verification"}
            validationMessage={bidderExperianVerificationState.experianConsentValidationMessage}
            onChange={handleExperianConsent}
          />
          <a href={"#terms-of-use"} onClick={toggleTermsOfUse}>Terms Of Use</a>
        </div>
      </div>
      <div id="terms-of-use" style={{display: "none"}}>
        <h4>Terms Of Use</h4>
        <span>
          <h4>You must be able to identify information about yourself and:</h4>
          – Have a Social Security Number
          – Have a U.S. Mailing Address (including U.S territories)
          You can only verify your own identity. You cannot attempt identity verification on behalf of another person or using another person’s identity or information, even if you have written permission.
          <h4>What will we do with your information?</h4>
          GSA will use the information that you give to us to verify your identity through Experian’s Credit Services. When an identity verification request is made by Experian, they may use information in the bidder's credit report to verify the bidder’s identity. As a result, you may see an entry called a “soft inquiry” on their Experian Credit Report. This will show an inquiry by the General Services Administration with our address and the date of the request. Soft inquiries do not affect your credit score and you will not incur any charges related to them. Soft inquiries are displayed in the version of the credit profile viewable only to consumers and are not reported to lenders. The soft inquiry will generally be removed from your credit report after 25 months. Once your identity has been verified, you will not generate additional soft inquiries when using your eAuthentication account unless you attempt to register more than once.
          <h4>What happens if you provide false information or misuse of this service?</h4>
          You may be subject to criminal or civil penalties, or both, if you provide false or misleading statements or engage in unauthorized use of this service.
        </span>
      </div>
    </React.Fragment>
  );
}
