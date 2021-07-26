import React, { useEffect, useState } from "react";
import { PPMSInput } from "../common/input/PPMS-input";
import PPMSAccordion from "../common/accordion/PPMS-accordion";
import { FaInfoCircle } from "react-icons/fa";
import { PPMSPopover } from "../common/PPMS-popover";
import { PPMSTextEditor } from "../common/PPMS-texteditor";
import { PPMSSelect } from "../common/select/PPMS-select";
import { PPMSButton } from "../common/PPMS-button";
import PPMSAlert from "../common/alert/PPMS-alert";
import { Table } from "./common/Common";
import { PPMSToggleRadio } from "../common/toggle/PPMS-toggle";
import { PageUtils } from "../../../utils/PageUtils";
import {
  formatCurrencyWODecimal,
  formatCurrency as formatCurrencyMain,
  numPadding,
} from "../../utilities/FormatUtil";

interface PPMSLotProps {
  data: any[];
  columns: any;
  lot: any;
  salesDetails: any;
  templateCodes: string[];
  propTypeInfo?: any;
  conditionCodeInfo?: any;
  changeLotDetails: any;
  updateLotDescription: any;
  index: number;
  selectImagesDocs?: any;
  changeLotDescriptionType: any;
  lotDescriptionType: any[];
  isLotDescriptionDisabled: boolean;
  cancelDescription: any;
  uploadDocuments: any;
  actionsData: any;
  toggleAllAccordions?: boolean;
  hideAuctionAccordion: boolean;
}
const PPMSLot = (props: PPMSLotProps) => {
  const {
    data,
    columns,
    lot,
    salesDetails,
    templateCodes,
    propTypeInfo,
    conditionCodeInfo,
    index,
    changeLotDetails,
    updateLotDescription,
    changeLotDescriptionType,
    lotDescriptionType,
    isLotDescriptionDisabled,
    cancelDescription,
    selectImagesDocs,
    uploadDocuments,
    actionsData,
    toggleAllAccordions,
    hideAuctionAccordion,
  } = props;
  const [expandAccordion, setExpandAccordion] = useState(
    toggleAllAccordions !== undefined ? toggleAllAccordions : true
  );
  useEffect(() => {
    updateCurrentLotDescription(lot.lotDescription);
    updateDisable(lot.lotDescriptionType === "ICN");
    updateValidationMessage("");
    setStartingBid(lot.startingBid ? lot.startingBid : 0);
    setReservePrice(lot.reservePrice ? lot.reservePrice : 0);
    setPropertyType(lot.propType ? lot.propType : "");
    setLotName(lot.lotName ? lot.lotName : "");
    setTemplateCode(lot.templateCode);
    setCitizenshipRequired(lot.citizenshipRequired);
    setExportControlRequired(lot.exportControlRequired);
    setDocumentRequired(isSpecialFSC(data) ? true : lot.documentRequired);
    if (isSpecialFSC(data)) {
      setDocumentRequiredOptions(createRequiredOption(true, "dr"));
    } else {
      setDocumentRequiredOptions(
        createRequiredOption(lot.documentRequired, "dr")
      );
    }
    setAAC(lot.aac ? lot.aac : "");
    setAgencyBureau(lot.agencyBureau ? lot.agencyBureau : "");
    setConditionCode(lot.conditionCode ? lot.conditionCode : "");
    setCitizenshipRequiredOptions(
      createRequiredOption(lot.citizenshipRequired, "cr")
    );
    setExportControlRequiredOptions(
      createRequiredOption(lot.exportControlRequired, "ecr")
    );
  }, [lot]);
  useEffect(() => {
    resetRequiredFields();
  }, [salesDetails.salesMethod]);
  useEffect(() => {
    setExpandAccordion(toggleAllAccordions);
  }, [toggleAllAccordions]);

  function resetRequiredFields() {
    setReservePriceRequired(
      salesDetails.salesMethod === "retail" ||
        salesDetails.salesMethod === "sasp" ||
        salesDetails.salesMethod === "buynow" ||
        ((lot.propType === "B" || lot.propType === "E") &&
          (salesDetails.salesMethod === "internet" ||
            salesDetails.salesMethod === "vas"))
    );
    setstartingBidRequired(
      salesDetails.salesMethod === "internet" ||
        salesDetails.salesMethod === "vas" ||
        salesDetails.salesMethod === "retail" ||
        salesDetails.salesMethod === "sasp" ||
        salesDetails.salesMethod === "buynow"
    );
    setTemplateCodeRequired(
      salesDetails.salesMethod === "internet" ||
        salesDetails.salesMethod === "vas" ||
        salesDetails.salesMethod === "buynow"
    );
  }
  const [
    selectedLotDescriptionType,
    updateSelectedLotDescriptionType,
  ] = useState(lot.lotDescriptionType);
  const [currentLotDescription, updateCurrentLotDescription] = useState(
    lot.lotDescription
  );

  const [reservePriceRequired, setReservePriceRequired] = useState(
    salesDetails.salesMethod === "retail" ||
      salesDetails.salesMethod === "sasp" ||
      salesDetails.salesMethod === "buynow" ||
      ((lot.propType === "B" || lot.propType === "E") &&
        (salesDetails.salesMethod === "internet" ||
          salesDetails.salesMethod === "vas"))
  );

  const [startingBidRequired, setstartingBidRequired] = useState(
    salesDetails.salesMethod === "internet" ||
      salesDetails.salesMethod === "vas" ||
      salesDetails.salesMethod === "retail" ||
      salesDetails.salesMethod === "sasp" ||
      salesDetails.salesMethod === "buynow"
  );

  const [templateCodeRequired, setTemplateCodeRequired] = useState(
    salesDetails.salesMethod === "internet" ||
      salesDetails.salesMethod === "vas" ||
      salesDetails.salesMethod === "buynow"
  );

  const [disable, updateDisable] = useState(lot.lotDescriptionType === "ICN");
  const [validationMessage, updateValidationMessage] = useState<any>("");
  const [startingBid, setStartingBid] = useState(
    lot.startingBid ? lot.startingBid : 0
  );
  const [reservePrice, setReservePrice] = useState(
    lot.reservePrice ? lot.reservePrice : 0
  );
  const [propertyType, setPropertyType] = useState(
    lot.propType ? lot.propType : ""
  );

  const [lotName, setLotName] = useState(lot.lotName ? lot.lotName : "");

  const [templateCode, setTemplateCode] = useState(lot.templateCode);

  const [aac, setAAC] = useState(lot.aac ? lot.aac : "");

  const [agencyBureau, setAgencyBureau] = useState(
    lot.agencyBureau ? lot.agencyBureau : ""
  );

  const [conditionCode, setConditionCode] = useState(
    lot.conditionCode ? lot.conditionCode : ""
  );
  const [citizenshipRequired, setCitizenshipRequired] = useState(
    lot.citizenshipRequired
  );
  const [exportControlRequired, setExportControlRequired] = useState(
    lot.exportControlRequired
  );
  const [documentRequired, setDocumentRequired] = useState(
    lot.documentRequired
  );
  const [citizenshipRequiredOptions, setCitizenshipRequiredOptions] = useState(
    createRequiredOption(lot.citizenshipRequired, "cr")
  );

  const [
    exportControlRequiredOptions,
    setExportControlRequiredOptions,
  ] = useState(createRequiredOption(lot.exportControlRequired, "ecr"));

  const [documentRequiredOptions, setDocumentRequiredOptions] = useState(
    createRequiredOption(lot.documentRequired, "dr")
  );

  function createRequiredOption(isRequired, type) {
    let option = [];
    if (isRequired) {
      option = [
        {
          id: `${type}-yes-${index}`,
          flag: true,
          value: "Yes",
          isSelected: true,
        },
        {
          id: `${type}-no-${index}`,
          flag: false,
          value: "No",
          isSelected: false,
        },
      ];
    } else {
      option = [
        {
          id: `${type}-yes-${index}`,
          flag: true,
          value: "Yes",
          isSelected: false,
        },
        {
          id: `${type}-no-${index}`,
          flag: false,
          value: "No",
          isSelected: true,
        },
      ];
    }
    return option;
  }

  function trimValue(object) {
    object.target.value = object.target?.value?.replace(/[^a-zA-Z0-9 ]/g, "");
  }
  function trimNumberValue(object) {
    object.target.value = object.target?.value?.replace(/[^0-9]/g, "");
  }
  function formatCurrency(object) {
    trimNumberValue(object);
    object.target.value =
      "$" + object.target.value.split(/(?=(?:\d{3})+(?:\.|$))/g).join(",");
  }
  // function formatDefaultCurrency(value) {
  //   let formattedValue = value.toString().replace(/[^0-9]/g, "");
  //   return formattedValue.split(/(?=(?:\\d{3})+(?:\\.|$))/g).join(",");
  // }

  function onChangeStartingBid(event) {
    if (/^\d+$/.test(event.target.value)) {
      setStartingBid(parseFloat(event.target.value));
      formatCurrency(event);
    } else {
      const bd = event.target.value.substring(1).replace(/,/g, "");
      setStartingBid(parseFloat(bd));
      formatCurrency(event);
    }
  }

  function onChangeReservePrice(event) {
    if (/^\d+$/.test(event.target.value)) {
      setReservePrice(parseFloat(event.target.value));
      formatCurrency(event);
    } else {
      const rp = event.target.value.substring(1).replace(/,/g, "");
      setReservePrice(parseFloat(rp));
      formatCurrency(event);
    }
  }

  function isSpecialFSC(data) {
    return data.some(
      (d) =>
        (d.condition === "X" || d.condition === "S") &&
        (d.fsc === "7730" ||
          d.fsc === "6525" ||
          d.fsc === "3610" ||
          d.fsc === "6625" ||
          d.fsc?.startsWith("70") ||
          d.fsc?.startsWith("58") ||
          d.fsc?.startsWith("59"))
    );
  }

  const templateCodeCheck = (event) => {
    trimValue(event);
    setTemplateCode(event.target.value);
  };
  const lotNameCheck = (event) => {
    trimValue(event);
    setLotName(event.target.value);
  };
  const validateLot = (requiredValue, type) => {
    let errors = [];
    if (!lotName) {
      errors.push("Lot Name is required.");
    }
    if (lotName && lotName.length < 8) {
      errors.push("The Lot Name must contain a minimum of 8 characters.");
    }
    if (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(lotName)) {
      errors.push("Lot Name cannot contain special characters.");
    }
    if (templateCodeRequired && !templateCode) {
      errors.push("Template Code is required.");
    }
    if (
      templateCode &&
      (templateCode.length > 4 ||
        !/^[a-z0-9]+$/i.test(templateCode) ||
        (templateCode !== "" && templateCodes.indexOf(templateCode) === -1))
    ) {
      errors.push(
        "An invalid Template Code was entered, please enter a valid template code with a maximum of 4 alphanumeric characters."
      );
    }
    if (reservePriceRequired && (!reservePrice || reservePrice === 0)) {
      errors.push("Reserve Price is required");
    }
    if (reservePrice < 0 || reservePrice > 99999999) {
      errors.push("Reserve Price must be between 0 and 99999999.");
    }
    if (
      reservePriceRequired &&
      reservePrice > 0 &&
      reservePrice < startingBid
    ) {
      errors.push(
        "Reserve Price must be greater than or equal to the starting bid."
      );
    }
    if (
      reservePriceRequired &&
      reservePrice > 100 &&
      reservePrice === startingBid
    ) {
      errors.push(
        "Reserve Price & Starting Bid cannot be the same when Reserve Price > $100.00."
      );
    }
    if (startingBidRequired && (!startingBid || startingBid === 0)) {
      errors.push("Starting Bid is required.");
    }

    if (startingBid < 0 || startingBid > 99999999) {
      errors.push("Starting Bid must be between 0 and 99999999.");
    }

    if (!propertyType) {
      errors.push("No ICNs present in the Lot.");
    }

    if (
      !lot.lotDescription ||
      lot.lotDescription === "" ||
      lot.lotDescription === " " ||
      lot.lotDescription.length === 0
    ) {
      errors.push("Lot Description is required.");
    }
    if (errors.length > 0) {
      updateValidationMessage(
        <ul>
          {errors.map((er, idx, arr) => {
            return (
              <li key={`lot-${lot.lotId}-error-${idx}`}>
                {er} {idx < arr.length - 1 ? <br /> : ""}
              </li>
            );
          })}
        </ul>
      );
      return false;
    }
    updateValidationMessage("");
    if (
      lot.lotName !== lotName ||
      lot.templateCode !== templateCode ||
      lot.reservePrice !== reservePrice ||
      lot.startingBid !== startingBid ||
      lot.propertyType !== propertyType
    ) {
      changeLotDetails({
        lotName,
        templateCode,
        reservePrice,
        startingBid,
        propertyType,
        citizenshipRequired:
          type === "cr" ? requiredValue : citizenshipRequired,
        exportControlRequired:
          type === "ecr" ? requiredValue : exportControlRequired,
        documentRequired: type === "dr" ? requiredValue : documentRequired,
        lotDescription: currentLotDescription,
        lotDescriptionType: selectedLotDescriptionType,
      });
    }
    return true;
  };
  return (
    <>
      {
        <PPMSAccordion
          key={`lot-${toggleAllAccordions ? lot.lotNumber : ""}`}
          className={"lot-details"}
          items={[
            {
              title: (
                <>
                  <div className={"grid-row grid-gap-1 lot-details-header"}>
                    <div className={"grid-col-2"}>
                      <strong>Lot Number</strong>
                      <span className={"lot-content-header"}>
                        {numPadding(lot.lotNumber, 3)}
                      </span>
                    </div>
                    <div className={"grid-col-2"}>
                      <strong>Lot Name </strong>
                      <span className={"lot-content-header"}>
                        {lot.lotName ? lot.lotName : "-"}
                      </span>
                    </div>
                    <div className={"grid-col-2"}>
                      <strong>Template Code</strong>
                      <span className={"lot-content-header"}>
                        {templateCode ? templateCode : "-"}
                      </span>
                    </div>
                    <div className={"grid-col-2"}>
                      <strong>Starting Bid </strong>
                      <span className={"lot-content-header"}>
                        {formatCurrencyMain.format(lot.startingBid)}
                      </span>
                    </div>
                    <div className={"grid-col-2"}>
                      <strong>Reserve Price </strong>
                      <span className={"lot-content-header"}>
                        {formatCurrencyMain.format(lot.reservePrice)}
                      </span>
                    </div>
                  </div>
                </>
              ),
              content: (
                <div>
                  <div className={"usa-summary-box"}>
                    <div className={"usa-summary-box__body"}>
                      <h2 className={"usa-summary-box__heading lot-review-h2"}>
                        Lot Details
                      </h2>
                      <PPMSButton
                        className={"out-button lot-review-print"}
                        type={"button"}
                        value={""}
                        label={"Save"}
                        onPress={() => {
                          validateLot(false, "");
                        }}
                        id={`save-${index}`}
                      />
                      {validationMessage && (
                        <PPMSAlert type="error" slim={true} noIcon={true}>
                          {validationMessage}
                        </PPMSAlert>
                      )}
                      <div className={"grid-row grid-gap-2 "}>
                        <div className={"grid-col-3"}>
                          <PPMSInput
                            id={`lot-name-${index}`}
                            inputType={"text"}
                            //isDisabled={actionDisabled}
                            isDisabled={actionsData.lotNameDisabled}
                            isRequired={true}
                            label={"Lot Name"}
                            labelBold={true}
                            onChange={lotNameCheck}
                            value={lotName}
                            name={`lot-name-${index}`}
                            maxLength={69}
                            className={"add-to-lot-input"}
                            addBreak={true}
                          />
                        </div>
                        <div className={"grid-col-3"}>
                          <PPMSInput
                            id={`template-${index}`}
                            inputType={"text"}
                            //isDisabled={actionDisabled}
                            isDisabled={actionsData.templateDisabled}
                            isRequired={templateCodeRequired}
                            maxLength={4}
                            label={"Template"}
                            labelBold={true}
                            value={templateCode}
                            name={`template-${index}`}
                            onChange={templateCodeCheck}
                            className={"add-to-lot-input"}
                            addBreak={true}
                          />
                        </div>
                        <div className={"grid-col-3"}>
                          <PPMSInput
                            id={`starting-bid-${index}`}
                            inputType={"text"}
                            isDisabled={actionsData.startingbidDisabled}
                            maxLength={11}
                            isRequired={startingBidRequired}
                            label={"Starting Bid"}
                            labelBold={true}
                            onChange={onChangeStartingBid}
                            value={`${
                              startingBid
                                ? formatCurrencyWODecimal.format(startingBid)
                                : "0"
                            }`}
                            name={`starting-bid-${index}`}
                            className={"add-to-lot-input"}
                            addBreak={true}
                          />
                        </div>
                        <div className={"grid-col-3"}>
                          <div className={"grid-row"}>
                            <div className={"grid-col-11 grid-offset-1"}>
                              <PPMSInput
                                id={`reserve-price-${index}`}
                                inputType={"text"}
                                maxLength={11}
                                isRequired={reservePriceRequired}
                                label={"Reserve Price"}
                                labelBold={true}
                                onChange={onChangeReservePrice}
                                isDisabled={actionsData.actionDisabled}
                                value={`${
                                  reservePrice
                                    ? formatCurrencyWODecimal.format(
                                        reservePrice
                                      )
                                    : "0"
                                }`}
                                name={`reserve-price-${index}`}
                                className={"add-to-lot-input "}
                                addBreak={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={"grid-row grid-gap-3 flex-wrap: nowrap"}>
                        <div className={"grid-col-3"}>
                          <div className={"grid-row"}>
                            <div className={"grid-col-10"}>
                              <PPMSInput
                                id={`prop-type-${index}`}
                                inputType={"text"}
                                isDisabled={true}
                                isRequired={true}
                                label={"Property Type"}
                                labelBold={true}
                                value={propertyType}
                                name={`prop-type-${index}`}
                                className={"add-to-lot-input"}
                                addBreak={true}
                              />
                            </div>
                            <div className={"grid-col-auto"}>
                              {propertyType && (
                                <PPMSPopover
                                  trigger={["click"]}
                                  id={`${index}-info-tip`}
                                  placement={"right"}
                                  popoverTitle={"Property Type Description"}
                                  popoverContent={propTypeInfo}
                                  triggerSource={
                                    <button
                                      id={`${index}-tooltip-button`}
                                      type={"button"}
                                      className={
                                        "usa-button usa-button--unstyled lot-prop-type"
                                      }
                                    >
                                      <FaInfoCircle />
                                    </button>
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={"grid-col-3"}>
                          <PPMSToggleRadio
                            isDisabled={actionsData.actionDisabled}
                            isRequired={true}
                            id={`citizenship-required-${index}`}
                            name={`citizenship-required-${index}`}
                            options={citizenshipRequiredOptions}
                            isInline={true}
                            label={"Citizenship Required"}
                            labelBold={true}
                            validationMessage={""}
                            className={""}
                            onChange={(values) => {
                              let value = values.filter(
                                (value) => value.isSelected === true
                              )[0].flag;
                              setCitizenshipRequired(value);
                              validateLot(value, "cr");
                              setCitizenshipRequiredOptions(values);
                            }}
                          />
                        </div>
                        <div className={"grid-col-3"}>
                          <PPMSToggleRadio
                            isDisabled={
                              actionsData.actionDisabled || isSpecialFSC(data)
                            }
                            isRequired={true}
                            id={`document-required-${index}`}
                            name={`document-required-${index}`}
                            options={documentRequiredOptions}
                            isInline={true}
                            label={"Buyer Documentation Required"}
                            labelBold={true}
                            validationMessage={""}
                            className={""}
                            onChange={(values) => {
                              let value = values.filter(
                                (value) => value.isSelected === true
                              )[0].flag;
                              setDocumentRequired(value);
                              validateLot(value, "dr");
                              setDocumentRequiredOptions(values);
                            }}
                          />
                        </div>
                        <div className={"grid-col-3 export-control"}>
                          <PPMSToggleRadio
                            isDisabled={actionsData.actionDisabled}
                            isRequired={true}
                            id={`export-control-required-${index}`}
                            name={`export-control-required-${index}`}
                            options={exportControlRequiredOptions}
                            isInline={true}
                            label={"Export Control Required"}
                            labelBold={true}
                            validationMessage={""}
                            className={""}
                            onChange={(values) => {
                              let value = values.filter(
                                (value) => value.isSelected === true
                              )[0].flag;
                              setExportControlRequired(value);
                              validateLot(value, "ecr");
                              setExportControlRequiredOptions(values);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"margin-top-2"}>
                    <Table
                      columns={columns}
                      data={data}
                      lot={lot}
                      index={index}
                      hideHeader={false}
                    />
                    <br />
                    { !hideAuctionAccordion && 
                    <PPMSAccordion
                      className={"lot-accordion"}
                      items={[
                        {
                          title: "Auction View",
                          content: accordionContent(
                            lot,
                            updateLotDescription,
                            changeLotDescriptionType,
                            selectedLotDescriptionType,
                            updateSelectedLotDescriptionType,
                            isLotDescriptionDisabled,
                            lotDescriptionType,
                            changeLotDetails,
                            cancelDescription,
                            selectImagesDocs,
                            disable,
                            updateDisable,
                            uploadDocuments,
                            validateLot,
                            actionsData,
                            updateCurrentLotDescription
                          ),
                          expanded: false,
                          id: `auction-view-${index}`,
                          className: "auction-view",
                        },
                      ]}
                    />
                    }
                  </div>
                </div>
              ),
              expanded:
                toggleAllAccordions !== undefined
                  ? toggleAllAccordions
                  : expandAccordion,
              id: `auction-view-${index}`,
              className: "auction-view",
            },
          ]}
        />
      }
    </>
  );
};

function accordionContent(
  lot,
  updateLotDescription,
  changeLotDescriptionType,
  selectedLotDescriptionType,
  updateSelectedLotDescriptionType,
  isLotDescriptionDisabled,
  lotDescriptionType,
  changeLotDetails,
  cancelDescription,
  selectImagesDocs,
  disable,
  updateDisable,
  uploadDocuments,
  validateLot,
  actionData,
  updateCurrentLotDescription
) {
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-12"}>
          <div className={"grid-row"}>
            <div className={"grid-col-8"}>
              <h3>Lot Description</h3>
            </div>
            <div className={"grid-col-4 saveNotes-btn"}>
              <PPMSButton
                type={"button"}
                label={"Save Description"}
                onPress={() => validateLot(false, "")}
                id={"custom-description"}
              />
            </div>
          </div>
          <PPMSSelect
            values={lotDescriptionType}
            identifierKey={"id"}
            identifierValue={"value"}
            onChange={(event) => {
              changeLotDescriptionType(event.target.selectedIndex);
              if (event.target.selectedIndex === 0) {
                updateDisable(true);
              } else {
                updateDisable(false);
              }
              updateSelectedLotDescriptionType(
                lotDescriptionType[event.target.selectedIndex].id
              );
            }}
            selectedValue={selectedLotDescriptionType}
            disabled={actionData.lotdescriptionDisabled}
          />
          <PPMSTextEditor
            id={`lotDescription-${lot.lotId}`}
            value={lot.lotDescription}
            onChange={(descData: any) => {
              updateLotDescription({ propertyDescription: descData });
              updateCurrentLotDescription(descData);
            }}
            label={""}
            isValid={false}
            isRequired={true}
            validationMessage={""}
            isInvalid={false}
            isDisabled={
              actionData.actionDisabled ? actionData.actionDisabled : disable
            }
          />
        </div>
      </div>
      <br />
      <div className={"grid-row"}>
        <div className={"grid-col"}>
          <PPMSButton
            id={`select-lot-documents-${lot.lotId}`}
            label={"Select Images/Documents"}
            onPress={() => {
              selectImagesDocs(lot.lotId);
            }}
            isDisabled={actionData.imageDisabled}
          />
        </div>
      </div>
      <div className={"grid-row"}>
        <div className={"grid-col"}>{uploadDocuments}</div>
      </div>
    </>
  );
}

export default PPMSLot;
