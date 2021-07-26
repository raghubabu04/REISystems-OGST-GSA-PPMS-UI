import React from "react";

export class BidderPrimaryAddressInfoTip extends React.Component {
  render() {
    return (
      <>
        <p>
        <b>Important Note:</b>
            Your primary/mailing address will be sent to Experian to authenticate your identity.  
            If your mailing address is a PO Box or Personal Mailbox (PMB), you must provide a 
            secondary address that is your physical address of residency.
        </p>
      </>
    );
  }
}
