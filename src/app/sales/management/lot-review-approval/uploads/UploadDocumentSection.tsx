import PPMSCard from "../../../../../ui-kit/components/common/card/PPMS-card";
import React from "react";
import PPMSCardGroup from "../../../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCardBody from "../../../../../ui-kit/components/common/card/PPMS-card-body";
import { FaFileAlt } from "react-icons/fa";
import { LotReviewUpload } from "./LotReviewUploads";
import { LotReviewApprovalContext } from "../LotReviewApprovalContext";

export const getUploadDocumentSection = (lot, saleId, saleNumber) => {
    return (
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>

            <PPMSCard className="ppms-widget">
                <PPMSCardBody className="non-tcn-main-row card-header-height widget-header">
                    <div>
                        <strong>
                            <i className="fas head-icon">
                                {<FaFileAlt role="img" title={"Documents"} />}
                            </i>{" "}
            Documents
          </strong>
                    </div>
                </PPMSCardBody>
                <PPMSCardBody>
                    {uploadedItemsTag(
                        lot?.lotId,
                        lot?.lotNumber,
                        lot?.contractStatus,
                        lot?.contractId,
                        lot?.contractNumber,
                        saleId,
                        saleNumber,
                        false
                    )}
                </PPMSCardBody>
            </PPMSCard>
        </PPMSCardGroup>);
}
let uploadedItemsTag = (
    lotId,
    lotNumber,
    contractStatus,
    contractId,
    contractNumber,
    saleId,
    saleNumber,
    actionDisabled
) => (
    <>
        <LotReviewUpload
            lotId={lotId}
            saleId={saleId}
            contractId={contractId}
            contractNumber={contractNumber}
            contractStatus={contractStatus}
            lotNumber={lotNumber}
            saleNumber={saleNumber}
            actionDisabled={actionDisabled}
            fileInfectedStatus={() => { }}
            context={LotReviewApprovalContext}
        />

    </>
);
