import React from "react";
import { RefundNotesClass } from "../../../../sales/contracts/contract-refund/RefundNotesClass";
import { ContractUpload } from "../../../../sales/uploads/ContractUpload";

interface ContractNotesFileUploadProps {
  setCurrentRefundNotes?: any;
  contractDetails?: any;
  noteType: "REFUND";
  resetNotes?: boolean;
}

const ContractNotesFileUpload = (props: ContractNotesFileUploadProps) => {
  const {
    contractDetails,
    setCurrentRefundNotes,
    noteType,
    resetNotes,
  } = props;

  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <RefundNotesClass
            actionHistorydata={contractDetails?.notesHistory}
            currentNotesData={(value) => {
              setCurrentRefundNotes(value);
            }}
            resetNotes={resetNotes}
          />
        </div>
      </div>
      <br />
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <ContractUpload
            isRefundUpload={true}
            objectType={noteType}
            contractId={contractDetails?.contractId}
            saleId={contractDetails?.saleId}
            lotNumber={contractDetails?.lotNumber}
            saleNumber={contractDetails?.salesNumber}
            fileInfectedStatus={() => {}}
          />
        </div>
      </div>
      <br />
    </>
  );
};

export default ContractNotesFileUpload;
