import React from "react";
import { useBarcode } from "react-barcodes";

interface PPMSBarcodeProps {
  value: string;
  background: string;
  format?:
    | "CODE128"
    | "CODE128A"
    | "CODE128B"
    | "CODE128C"
    | "EAN13"
    | "UPC"
    | "EAN8"
    | "EAN5"
    | "EAN2"
    | "CODE39"
    | "ITF14"
    | "MSI"
    | "MSI10"
    | "MSI11"
    | "MSI1010"
    | "MSI1110"
    | "pharmacode"
    | "codabar";
}

function PPMSBarcode(props: PPMSBarcodeProps) {
  const { inputRef } = useBarcode({
    value: props.value,
    options: {
      background: props.background,
      width: 1.5,
      format: props.format ? props.format : "CODE128",
    },
  });

  return <svg ref={inputRef} />;
}

export default PPMSBarcode;
