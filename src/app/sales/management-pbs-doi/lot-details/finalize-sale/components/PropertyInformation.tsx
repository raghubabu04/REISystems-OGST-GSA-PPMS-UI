import React, { useEffect, useState } from "react";
import { SalesApiService } from "../../../../../../api-kit/sales/sales-api-service";
import { PPMSImageGallery } from "../../../../../../ui-kit/components/image-carousel/PPMS-image-gallery";
import { PPMSTooltip } from "../../../../../../ui-kit/components/common/PPMS-tooltip";
import { FaDownload } from "react-icons/fa";
import moment from "moment";
import { Environment } from "../../../../../../environments/environment";
import parse from "html-react-parser";

interface PropertyInformationProps {
  lotInformation: any;
  lotId: number;
}

const PropertyInformation = (props: PropertyInformationProps) => {
  const { lotInformation, lotId } = props;
  const [files, updateFiles] = useState({ documents: [], image: [] });
  const [fileNames, updateFileNames] = useState({ documents: [], image: [] });

  let salesAPIService = new SalesApiService();
  const getLotUploadedItems = (lotId) => {
    salesAPIService
      .getLotUploadedItems(lotId)
      .then((response) => {
        let documentNames = [];
        let imageNames = [];
        response.data.documents.forEach((document) => {
          documentNames.push(document.name);
        });
        response.data.image.forEach((image) => {
          imageNames.push(image.name);
        });
        updateFiles(response.data);
        updateFileNames({ documents: documentNames, image: imageNames });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getLotUploadedItems(lotId);
  }, []);

  const downloadFile = (file) => {
    let url =
      Environment.COMMON_URL +
      "/api/v1/downloadFile?path=" +
      file.uri +
      "&fileType=" +
      file.itemType +
      "&fileName=" +
      file.name;
    window.location.href = url;
  };

  const LotDocuments = ({ documents }) => {
    const documentsView = documents
      ?.sort((a, b) => a.attachmentOrder - b.attachmentOrder)
      .map((file, index) => (
        <tr>
          <td className={"tableColumnWrapper"}>{file.name}</td>
          <td>{Math.round(file.size / 1000)} KB</td>
          <td>
            <PPMSTooltip
              trigger={"focus"}
              id={"download-image"}
              placement={"top"}
              tooltipContent={`Download Document`}
              triggerSource={
                <button
                  className="usa-button usa-button--unstyled lot-review-buttons-no-shadow"
                  type="button"
                  id={"download-file-" + index}
                  onClick={() => downloadFile(file)}
                >
                  <FaDownload className={"image-icons"} />
                </button>
              }
            />
          </td>
          <td>{moment(file.modifiedDate).format("MM/DD/YYYY")}</td>
        </tr>
      ));
    return (
      <>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col property-attachment-container"}>
            <table role="table" className={"lot-documents-table"}>
              <thead role="row" className="upload-table-header">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">File Size</th>
                  <th scope="col">Actions</th>
                  <th scope="col">Modified Date</th>
                </tr>
              </thead>
              <tbody>
                {documentsView?.length === 0 && (
                  <tr role="row" className="upload-table-row">
                    <td role="cell" className="text-center" colSpan={4}>
                      No Documents
                    </td>
                  </tr>
                )}
                {documentsView}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-12"}>
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <h3 className={"lot-review-h2"}>Property Description</h3>
            </div>
          </div>
          <div className={"grid-row text-break-spaces"}>
            <div className={"grid-col-12 "}>
              {lotInformation?.itemDescription
                ? parse(lotInformation?.itemDescription)
                : ""}
            </div>
          </div>
        </div>
      </div>
      <div className={"grid-row"}>
        <div className={"grid-col-12"}>
          <h3 className={"lot-review-h2"}>IMAGES</h3>
          {files.image.length > 0 ? (
            <PPMSImageGallery
              images={files.image}
              names={fileNames.image}
              width={800}
              height={600}
            />
          ) : (
            "No Images"
          )}
        </div>
      </div>
      <div className={"grid-row"}>
        <div className={"grid-col-12"}>
          <h3 className={"lot-review-h2"}>DOCUMENTS</h3>
          <LotDocuments documents={files.documents} />
        </div>
      </div>
    </>
  );
};

export default PropertyInformation;
