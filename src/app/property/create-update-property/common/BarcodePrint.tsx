import React from "react";
import PPMSBarcode from "../../../../ui-kit/components/PPMS-barcode";

export interface BarCodeProps {
  icn: string;
}

export class BarCodePrint extends React.Component<BarCodeProps, any> {
  render() {
    return (
      <div className={"justify-content-md-center"}>
        <PPMSBarcode value={this.props.icn} background={"#ffffff"} />
      </div>
    );
  }
}
