import React from "react";
import { Link } from "react-router-dom";
import { Paths } from "../../../../Router";
import {
  CATEGORY_200_2310_2320_210_OR_220_FLEET_SALES_NOT_FSC_2331,
  CATEGORY_200_2310_2320_210_OR_220_NOT_FLEET_SALES_NOT_FSC_2331,
  CATEGORY_999,
  DOCUMENT_REQUIRED,
  DOI_AND_PBS,
  DOI_ONLY_TERMS_AND_CONDITION,
  FIRST_4_CHARS_OF_SPECIAL_INSTRUCTION_IS_USMS_AND_AAC_1531F8,
  FLEET_SALES_INSPECION_STATEMENT,
  FSC_2311,
  FSC_2312_AND_CONDITION_CODE_S,
  FSC_2312_AND_CONDITION_CODE_X,
  FSC_2331_NO_MAKE_MODEL,
  FSC_2331_WITH_BODY_TYPE_MOBILE_HOME,
  FSC_2331_WITH_BODY_TYPE_TRAILER,
  FSC_2331_WITH_MAKE_MODEL,
  FSC_3610_6525_6625_6720_7730_FSG_58_59_70_CONDITION_X_S,
  INSPECTION_AND_REMOVAL_INFORMATION,
  INSPECTION_CUSTOMIZED_MESSAGES,
  MOBILEHOME_NOT_2330_2331,
  PBS_DOI_SALE_METHOD_NOTE,
  PBS_STATIC_TEXT,
  PPMS_SALES_INSPECTION_STATEMENT,
  REGION_N_IN_SALES_NUMBER_ONLY_FOR_DOI,
  STATIC_MESSAGES,
  TRAILER_PARKMODEL_MOBILEHOME_NOTICE_2330,
  TRAILER_PARKMODEL_NOTICE_2330,
  USMS_WARNING,
} from "./constant/DescriptionConstants";
import { formatCurrency } from "../../../../../ui-kit/utilities/FormatUtil";
interface AuctionDescriptionDetailsProps {
  match?: any;
  descriptions?: string[];
  imageFlag?: boolean;
  pocContact?: any;
  regionAddressDetails?: any;
  auctionDescriptionDTO?: any;
  auctionData: any;
  auctionDetails: any;
}

const AuctionDescriptionDetails = (props: AuctionDescriptionDetailsProps) => {
  const {
    descriptions,
    pocContact,
    regionAddressDetails,
    auctionDescriptionDTO,
  } = props;
  const inspectionInstructions = auctionDescriptionDTO?.inspectionInstructions;
  const descriptionDetails = descriptions
    ? descriptions.map((description: string, index) => {
        return (
          <p className={"usa-auction-description-text"}>
            {description === "FSC_2331_NO_MAKE_MODEL_FLAG" ? (
              FSC_2331_NO_MAKE_MODEL
            ) : description === "FSC_2331_WITH_MAKE_MODEL_FLAG" ? (
              FSC_2331_WITH_MAKE_MODEL
            ) : description === "FSC_2331_WITH_BODY_TYPE_TRAILER_FLAG" ? (
              FSC_2331_WITH_BODY_TYPE_TRAILER
            ) : description === "FSC_2331_WITH_BODY_TYPE_TRAILER_FLAG" ? (
              FSC_2331_WITH_BODY_TYPE_TRAILER
            ) : description === "FSC_2331_WITH_BODY_TYPE_MOBILE_HOME_FLAG" ? (
              FSC_2331_WITH_BODY_TYPE_MOBILE_HOME
            ) : description === "FSC_2311_FLAG" ? (
              FSC_2311
            ) : description === "FSC_2312_AND_CONDITION_CODE_S_FLAG" ? (
              FSC_2312_AND_CONDITION_CODE_S
            ) : description === "FSC_2312_AND_CONDITION_CODE_X_FLAG" ? (
              FSC_2312_AND_CONDITION_CODE_X
            ) : description === "NOT_FLEET_SALES_NOT_FSC_2331_FLAG" ? (
              CATEGORY_200_2310_2320_210_OR_220_NOT_FLEET_SALES_NOT_FSC_2331
            ) : description === "FLEET_SALES_NOT_FSC_2331_FLAG" ? (
              CATEGORY_200_2310_2320_210_OR_220_FLEET_SALES_NOT_FSC_2331
            ) : description === "REGION_N_IN_SALES_NUMBER_ONLY_FOR_DOI_FLAG" ? (
              REGION_N_IN_SALES_NUMBER_ONLY_FOR_DOI
            ) : description === "USMS_LOGO" ? (
              <div>
                <span>
                  <img
                    src={require("../../../../../assets/images/USMSLogo.PNG")}
                    alt="USMS Logo"
                  ></img>
                </span>
              </div>
            ) : description === "PDS_DOI_SALE_METHOD_NOTE_FLAG" ? (
              <div>{PBS_DOI_SALE_METHOD_NOTE}</div>
            ) : description === "DOI_AND_PBS_FLAG" ? (
              <div>
                {DOI_AND_PBS}
                {inspectionInstructions ? (
                  <div>
                    <div>
                      {" "}
                      <b>
                        <u>Additional Instructions</u>
                      </b>
                    </div>
                    <div>
                      {inspectionInstructions.map(
                        (specialInstruction: string, index) => {
                          return <span>{specialInstruction}</span>;
                        }
                      )}
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            ) : description === "INQUIRIES_FLAG" ? (
              <div>
                <span>
                  For inquiries/questions regarding payment, contact the
                  following sales office <br />
                </span>
                {auctionDescriptionDTO?.regionName} <br />
                {regionAddressDetails?.addressLine1}
                <br />
                {regionAddressDetails?.addressLine2}
                <br />
                {regionAddressDetails?.city +
                  " " +
                  regionAddressDetails?.state +
                  " " +
                  regionAddressDetails?.zipCode}
                <br />
                Phone: {auctionDescriptionDTO?.regionPhone} <br />
                Fax: {auctionDescriptionDTO?.regionFax} <br />
              </div>
            ) : description ===
              "FSC_3610_6525_6625_6720_7730_FSG_58_59_70_CONDITION_X_S_FLAG" ? (
              <div>
                {
                  FSC_3610_6525_6625_6720_7730_FSG_58_59_70_CONDITION_X_S[0]
                    .message1
                }
                {pocContact?.email} <br />
                {pocContact?.address?.addressLine1}
                <br />
                {pocContact?.address?.addressLine2}
                <br />
                {pocContact?.address?.city +
                  " " +
                  pocContact?.address?.state +
                  " " +
                  pocContact?.address?.zipCode}
                <br />
                {
                  FSC_3610_6525_6625_6720_7730_FSG_58_59_70_CONDITION_X_S[0]
                    .message2
                }
                {
                  FSC_3610_6525_6625_6720_7730_FSG_58_59_70_CONDITION_X_S[0]
                    .message3
                }
              </div>
            ) : description === "ITEM_DESCRIPTION_FLAG" ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: auctionDescriptionDTO?.itemDescription,
                }}
              />
            ) : description === "DOI_ONLY_TERMS_AND_CONDITION_FLAG" ? (
              DOI_ONLY_TERMS_AND_CONDITION
            ) : description === "CATEGORY_999_FLAG" ? (
              CATEGORY_999
            ) : description ===
              "SPECIAL_INSTRUCTION_IS_USMS_AND_AAC_1531F8_FLAG" ? (
              FIRST_4_CHARS_OF_SPECIAL_INSTRUCTION_IS_USMS_AND_AAC_1531F8
            ) : description === "INSPECTION_AND_REMOVAL_INFORMATION_FLAG" ? (
              <div>
                {auctionDescriptionDTO?.inspectionInstructions ? (
                  <div
                    className="usa-alert special-inspection-bg"
                    id="inspection-instructions"
                  >
                    <div>
                      {" "}
                      <b>
                        <u>Property Location Information</u>
                      </b>
                    </div>
                    <div>
                      <p className="usa-alert__body usa-alert__text">
                        {auctionDescriptionDTO?.inspectionInstructions}
                      </p>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {INSPECTION_AND_REMOVAL_INFORMATION}
              </div>
            ) : description === "STATIC_MESSAGES" ? (
              <div className={"usa-auction-description-text"}>
                <b>{STATIC_MESSAGES.toString()}</b>
              </div>
            ) : description === "PPMS_SALES_INSPECTION_STATEMENT" ? (
              PPMS_SALES_INSPECTION_STATEMENT
            ) : description === "FLEET_SALES_INSPECION_STATEMENTS" ? (
              FLEET_SALES_INSPECION_STATEMENT
            ) : description === "TRAILER_PARKMODEL_NOTICE_2330" ? (
              TRAILER_PARKMODEL_NOTICE_2330
            ) : description === "TRAILER_PARKMODEL_MOBILEHOME_NOTICE_2330" ? (
              TRAILER_PARKMODEL_MOBILEHOME_NOTICE_2330
            ) : description === "MOBILEHOME_NOT_2330_2331" ? (
              MOBILEHOME_NOT_2330_2331
            ) : description === "USMS_WARNING_FLAG" ? (
              USMS_WARNING /*: description === "PBS_STATIC_TEXT" ? (
              PBS_STATIC_TEXT
            )*/
            ) : description === "INSPECTION_CUSTOMIZED_MESSAGES_FLAG" ? (
              INSPECTION_CUSTOMIZED_MESSAGES
            ) : description === "STATIC_MESSAGES_FLAG" ? (
              STATIC_MESSAGES
            ) : description === "NASA_ITEM_LIST" ? (
              <Link
                to={
                  Paths.previewAuctions +
                  "/" +
                  props?.auctionDetails?.lotId +
                  "/items"
                }
              >
                Click here for NASA Item Additional Information
              </Link>
            ) : description === "DOCUMENT_REQUIRED_FLAG" ? (
              DOCUMENT_REQUIRED
            ) : description === "BID_DEPOSIT_REQUIRED_FLAG" ? (
              <p className="alert bold large">
                BID DEPOSIT REQUIRED:{" "}
                {formatCurrency.format(auctionDescriptionDTO.bidDepositAmount)}
              </p>
            ) : (
              <div></div>
            )}
          </p>
        );
      })
    : [];
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>{descriptionDetails}</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AuctionDescriptionDetails;
