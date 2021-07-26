import React from "react";
import { Upload } from "../../../../../uploads/Upload";
interface ImagesDocumentsProps {
  lotId?: number;
  lotNumber?: number;
  saleId: number;
  saleNumber: string;
  maxImages?: number;
  maxDocuments?: number;
  disable?: boolean;
}
function ImagesDocuments(props: ImagesDocumentsProps) {
  const {
    lotId,
    saleId,
    lotNumber,
    saleNumber,
    maxImages,
    maxDocuments,
    disable,
  } = props;
  return (
    <div className={"grid-row"}>
      <div className={"grid-col"}>
        <Upload
          lotId={lotId?.toString()}
          saleId={saleId?.toString()}
          lotNumber={lotNumber?.toString()}
          saleNumber={saleNumber}
          fileInfectedStatus={() => {}}
          maxImages={maxImages}
          maxDocuments={maxDocuments}
          actionDisabled={disable}
        />
      </div>
    </div>
  );
}

export default ImagesDocuments;
