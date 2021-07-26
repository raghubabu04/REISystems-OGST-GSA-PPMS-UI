import React, {
    useEffect,
    useState,
} from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { LotReviewApprovalContext } from "./LotReviewApprovalContext";
import {
    formatICN} from "../../../../ui-kit/utilities/FormatUtil";
import { PPMSPopover } from "../../../../ui-kit/components/common/PPMS-popover";
import { FaDownload, FaFileAlt, FaInfoCircle } from "react-icons/fa";
import parse from "html-react-parser";
import { PPMSTooltip } from "../../../../ui-kit/components/common/PPMS-tooltip";
import moment from "moment";
import { Table } from "../../../../ui-kit/components/sales/common/Common";
import PPMSPaginationV2 from "../../../../ui-kit/components/common/pagination/PPMS-pagination-v2";
import PPMSAccordion from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { PPMSImageGallery } from "../../../../ui-kit/components/image-carousel/PPMS-image-gallery";
import { PPMSTextEditor } from "../../../../ui-kit/components/common/PPMS-texteditor";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PPMSSalesActionList } from "../../../../ui-kit/components/sales/PPMS-sales-action-list";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { Environment } from "../../../../environments/environment";
import PPMSCardGroup from "../../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../../ui-kit/components/common/card/PPMS-card-body";

import { LotReviewUpload } from "./uploads/LotReviewUploads";
import { PPMSDatepicker } from "../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import { commonActions } from "../../../../_redux/_actions/common.actions";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { start } from "repl";
import { ApproveModal } from "./modals/ApproveModal";
import { DisapproveModal } from "./modals/DisapproveModal";
import { getUploadDocumentSection } from "./uploads/UploadDocumentSection";

interface Props {
    lot: any;
    custodianId: any;
    addToToast: any;
    reload?: any;
    index?: any;
    setPrintLotIndex?: any;
    roles?: any;
    salesUsers?: any;
    saleId?: any;
    saleNumber?: any;
    holiday?: any;
    getHolidays?: any;
    actions: any
}
const Lot = (props: Props) => {
    let salesAPIService = new SalesApiService();
    const { holiday, getHolidays, index, lot, saleId, saleNumber, roles, reload, setPrintLotIndex, custodianId, salesUsers } = props;
    const {addToast} = props.actions
    const [files, updateFiles] = useState({ documents: [], image: [] });
    const [fileNames, updateFileNames] = useState({ documents: [], image: [] });
    const [notes, updateNotes] = useState("");
    const [showDisapproveModal, updateDisapproveModal] = useState(false);
    const [showApproveModal, updateApproveModal] = useState(false);
    const [yesNo, updateYesNo] = useState(null);
    const [approvalOptionSelected, updateApprovalOptionSelected] = useState(null);
    const [yesReason, updateYesReason] = useState(null);
    const [approveReason, updateApproveReason] = useState(null);
    const [removalDate, updateRemovalDate] = useState(lot.removalDate != null ? lot.removalDate : null);
    const [inValidMsg, setInValidMsg] = useState("");
    const [
        isFinalRemovalDueDateValid,
        setIsFinalRemovalDueDateValid,
    ] = useState(true);
    const options = () => [
        { id: `yes-${index}`, value: "Yes", required: true },
        { id: `no-${index}`, value: "No", required: true },
    ];
    const approveOptions = () => [
        { id: `email-${index}`, value: "Email Approval", required: true },
        { id: `phone-${index}`, value: "Phone Approval", required: true },
        { id: `verbal-${index}`, value: "Verbal Approval", required: true },
        { id: `other-${index}`, value: "Other", required: true },
    ];
    const [disapprovalOptions, setDisapprovalOptions] = useState(options());
    const [approvalOptions, setApprovalOptions] = useState(approveOptions());
    const updateDisapprovalOptions = (values) => {
        setDisapprovalOptions(values);
    };
    const updateApprovalOptions = (values) => {
        setApprovalOptions(values);
    };
    const updateYesReasonText = (text) => {
        updateYesReason(text);
    };
    const handleActualRemovalDateUpdate = (value) => {
        if (value !== null && moment(value).isValid()) {
            let finalRemovalDate = moment(value.toString()).format("MM/DD/YYYY");
            if (moment(value.toString()).isBefore(moment())) {
                setInValidMsg("Please pick a future date");
                setIsFinalRemovalDueDateValid(false);
            } else {
                setInValidMsg("");
                setIsFinalRemovalDueDateValid(true);
            }
            updateRemovalDate(finalRemovalDate);
        }
    };
    let startDate = moment(
        removalDate
      ).isValid()
        ? moment(
            new Date(removalDate)
          ).toDate()
        : null;

    const getHolidaysByYear = (year) => {
        if (year !== holiday?.year) {
            getHolidays(year);
        }
    };
    const saveFinalRemovalDate = () => {
        let data = {
            removalDate: removalDate
        }
        salesAPIService.saveFinalRemovalDate(data, lot.lotId).then(() => {
            addToast({
                text: "Final Removal Date saved successfully.",
                type: "success",
                heading: "Success",
            });
        })
        .catch((error) => {
            console.log(error);
            addToast({
                text: "Error saving Removal Date.",
                type: "error",
                heading: "Error",
            });
        });
    }
    const saveNotes = (note) => {
        if (note) {
            let data = {
                lotCustodianId: parseInt(custodianId),
                lotId: lot.lotId,
                notes: note,
            };
            salesAPIService
                .saveNotes(data)
                .then(() => {
                    addToast({
                        text: "Notes saved successfully.",
                        type: "success",
                        heading: "Success",
                    });
                    updateNotes("");
                    reload();
                })
                .catch((error) => {
                    console.log(error);
                    addToast({
                        text: "Error saving notes.",
                        type: "error",
                        heading: "Error",
                    });
                });
        }
    };
    const handleModalSave = async (isApproved) => {
        updateDisapproveModal(false);
        updateApproveModal(false);
        approveOrDisapprove(isApproved);
    };

    const prepareNotes = (reason, isApproved) => {
        let note = `${notes} <br/><span style="text-decoration: underline;"><strong>${!isApproved ? "Not" : ""
            } Approved Reason</strong></span></p><p>${reason}</p>`;
        if (reason) {
            updateNotes(note);
            saveNotes(note);
        }
    };
    const handleApprovalSave = () => {
        approveOrDisapprove(true);
    };
    const approveOrDisapprove = (isApproved) => {
        let data = {
            lotCustodianId: parseInt(custodianId),
            lotId: lot?.lotId,
            isApproved: isApproved,
        };
        salesAPIService
            .approveOrDisapprove(data)
            .then((response) => {
                addToast({
                    text: `Lot ${lot?.lotNumber} was ${isApproved ? "approved" : "not approved"
                        } successfully.`,
                    type: "success",
                    heading: "Success",
                });
                reload();
            })
            .catch((error) => {
                addToast({
                    text: `Error ${isApproved ? "approving" : "not approving"} Lot ${lot?.lotNumber
                        }.`,
                    type: "error",
                    heading: "Error",
                });
                console.log(error);
            });
    };
    useEffect(() => {
        getLotUploadedItems(lot?.lotId);
    }, []);
    const getLotUploadedItems = (lotId) => {
        salesAPIService
            .getLotUploadedItems(lotId)
            .then((response) => {
                let documentNames = [];
                let imageNames = [];
                response.data?.documents.forEach((document) => {
                    documentNames.push(document?.name);
                });
                response.data?.image.forEach((image) => {
                    imageNames.push(image?.name);
                });
                updateFiles(response.data);
                updateFileNames({ documents: documentNames, image: imageNames });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <div className={"usa-summary-box"}>
                <h2 className={"usa-summary-box__heading lot-review-h2"}>
                    Lot Details
          </h2>
                <PPMSButton
                    className={"out-button lot-review-print"}
                    type={"button"}
                    value={""}
                    label={"Print"}
                    onPress={() => {
                        setPrintLotIndex(index);
                    }}
                    id={"print"}
                />
                <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                        <div className={"grid-row"}>
                            <div className={"grid-col-2"}>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        <strong>Lot Name</strong>
                                    </div>
                                </div>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        {lot?.lotName ? lot.lotName : "-"}
                                    </div>
                                </div>
                            </div>
                            <div className={"grid-col-2"}>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        <strong>Prop. Type</strong>
                                    </div>
                                </div>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        <div className={"grid-row"}>
                                            <div className={"grid-col-12"}>
                                                {lot?.propType}{" "}
                                                {lot?.propType && (
                                                    <PPMSPopover
                                                        trigger={["click"]}
                                                        id={`${index}-info-tip`}
                                                        placement={"right"}
                                                        popoverTitle={"Property Type Description"}
                                                        popoverContent={getPropertyTypeInfo(lot?.propType)}
                                                        triggerSource={
                                                            <button
                                                                id={`${index}-tooltip-button`}
                                                                type={"button"}
                                                                className={
                                                                    "usa-button usa-button--unstyled lot-review-buttons-no-shadow"
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
                                </div>
                            </div>
                            <div className={"grid-col-2"}>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        <strong>Template</strong>
                                    </div>
                                </div>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        {lot?.templateCode ? lot.templateCode : "-"}
                                    </div>
                                </div>
                            </div>
                            <div className={"grid-col-2"}>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        <strong>Reserve Price</strong>
                                    </div>
                                </div>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        $
                      {lot?.reservePrice
                                            ? lot.reservePrice
                                                ?.toString()
                                                ?.split(/(?=(?:\d{3})+(?:\.|$))/g)
                                                .join(",")
                                            : "0"}
                                    </div>
                                </div>
                            </div>
                            <div className={"grid-col-2"}>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        <strong>Starting Bid</strong>
                                    </div>
                                </div>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        $
                      {lot?.startingBid
                                            ? lot.startingBid
                                                ?.toString()
                                                ?.split(/(?=(?:\d{3})+(?:\.|$))/g)
                                                .join(",")
                                            : "0"}
                                    </div>
                                </div>
                            </div>
                            <div className={"grid-col-2"}>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        <strong>Citizenship Required</strong>
                                    </div>
                                </div>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        {lot?.citizenshipRequired ? "Yes" : "No"}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className={"grid-row"}>
                            <div className={"grid-col-2"}>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        <strong>AAC</strong>
                                    </div>
                                </div>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        {lot?.aac ? lot.aac : "-"}
                                    </div>
                                </div>
                            </div>
                            <div className={"grid-col-2"}>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        <strong>Agency Bureau</strong>
                                    </div>
                                </div>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        {lot?.agencyBureau ? lot.agencyBureau : "-"}
                                    </div>
                                </div>
                            </div>
                            <div className={"grid-col-2"}>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        <strong>Condition Code</strong>
                                    </div>
                                </div>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        <div className={"grid-row"}>
                                            <div className={"grid-col-12"}>
                                                {lot?.conditionCode}{" "}
                                                {lot?.conditionCode && (
                                                    <PPMSPopover
                                                        trigger={["click"]}
                                                        id={`${index}-info-tip`}
                                                        placement={"right"}
                                                        popoverTitle={"Condition Code Description"}
                                                        popoverContent={getConditionCodeInfo(
                                                            lot.conditionCode
                                                        )}
                                                        triggerSource={
                                                            <button
                                                                id={`${index}-tooltip-button`}
                                                                type={"button"}
                                                                className={
                                                                    "usa-button usa-button--unstyled lot-review-buttons-no-shadow"
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
                                </div>
                            </div>
                            <div className={"grid-col-3"}>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        <strong>Export Control Required</strong>
                                    </div>
                                </div>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        {lot?.exportControlRequired ? "Yes" : "No"}
                                    </div>
                                </div>
                            </div>
                            <div className={"grid-col-3"}>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        <strong>Document Required</strong>
                                    </div>
                                </div>
                                <div className={"grid-row"}>
                                    <div className={"grid-col-12"}>
                                        {lot?.documentRequired ? "Yes" : "No"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"grid-row"}>
                <div className={"grid-col-12"}>
                    <div className={"grid-row grid-gap-4"}>
                        <div className={"grid-col-6"}>
                            <h2 className={"lot-review-h2"}>DESCRIPTION</h2>
                            <div className={"lot-description"}>
                                <LotDescription description={lot?.lotDescription} />
                            </div>
                        </div>
                        <div className={"grid-col-6"}>
                            <h2 className={"lot-review-h2"}>DOCUMENTS</h2>
                            <LotDocuments documents={files?.documents} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={"grid-row"}>
                <div className={"grid-col-12"}>
                    <h2 className={"lot-review-h2"}>IMAGES</h2>
                    {files?.image?.length > 0 ? (
                        <PPMSImageGallery
                            images={files?.image}
                            names={fileNames?.image}
                            width={800}
                            height={600}
                        />
                    ) : (
                        "No Images"
                    )}
                </div>
            </div>
            <br />
            <div className={"grid-row hide-print"}>
                <div className={"grid-col-12"}>
                    <PPMSAccordion
                        className={"custodian-lot-icns"}
                        items={[
                            {
                                title: (
                                    <>
                                        <strong>Item Control Numbers</strong>
                                    </>
                                ),
                                content: <ICNList index={index} lotId={lot?.lotId} />,
                                expanded: false,
                                id: `custodian-lot-icns-${index}`,
                                className: "custodian-lot-icns",
                            },
                        ]}
                    />
                </div>
            </div>
            <br></br>
            {(roles?.isPC && lot?.custodianEmail === salesUsers?.loggedInUser) && lot.contractStatus == "Paid" ?
            <div className="grid-col-12">
                <div className="grid-row">
                    <div className={"grid-col-4"}>
                        <PPMSDatepicker
                            format={"MM/DD/YYYY"}
                            id={"actual-removal-date"}
                            label={"Final Removal Date"}
                            display={""}
                            className={""}
                            labelBold={true}
                            updateDate={handleActualRemovalDateUpdate}
                            startDate={startDate}
                            minDate={startDate}
                            isRequired={true}
                            notShowFormat={true}
                            isDisabled={false}
                            excludeWeekends={true}
                            excludeHolidays={true}
                            isInvalid={!isFinalRemovalDueDateValid}
                            useDefaultValidation={false}
                            setHolidayYear={(year) => { getHolidaysByYear(year)}}
                            holidayList={holiday?.holidays}
                            validationMessage={inValidMsg}
                        />
                    </div>

                    <div className={"grid-col-4 saveRemovalDate-btn"}>
                        <PPMSButton
                            type="button"
                            label="Save Removal Date"
                            onPress={() => saveFinalRemovalDate()}
                            id="save-removal-date"
                        />
                    </div>
                </div>
            </div>: <></>}
            <br></br>
            {(roles?.isPC && lot?.custodianEmail === salesUsers?.loggedInUser) && lot.contractStatus == "Paid" ?
            <>{getUploadDocumentSection(lot, saleId, saleNumber)}</>: <></>}
            <br />
            <div className={"grid-row hide-print"}>
                <div className={"grid-col-12"}>
                    <div className={"grid-row lot-review-h2"}>
                        <div className={"grid-col-8"}>
                            <h2>NOTES</h2>
                        </div>
                        <div className={"grid-col-4 saveNotes-btn"}>
                            <PPMSButton
                                type={"button"}
                                label={"Save Notes"}
                                onPress={() => saveNotes(notes?.replaceAll(/&nbsp;/g, ""))}
                                id={"custodian-notes"}
                            />
                        </div>
                    </div>
                    <PPMSTextEditor
                        value={notes}
                        label={""}
                        isInvalid={false}
                        isValid={false}
                        isRequired={false}
                        id={`lot-notes-${index}`}
                        onChange={(value) => {
                            updateNotes(value);
                        }}
                    />
                    <div className={"action-history-container"}>
                        {lot?.notesHistory?.length > 0 && (
                            <PPMSSalesActionList
                                data={lot?.notesHistory ? lot.notesHistory : []}
                                listID={"list-id"}
                            />
                        )}
                    </div>
                </div>
            </div>
            <br />
            <div className={"grid-row hide-print"}>
                <div className={"grid-col-12"}>
                    <div className={"grid-row float-left"}>
                        {roles?.isPC && lot?.custodianEmail === salesUsers?.loggedInUser ? (
                            <PPMSButton
                                id={`approve-${index}`}
                                label={"Approve"}
                                type={"button"}
                                isDisabled={
                                    lot?.lotStatus === "Approved" ||
                                    lot?.lotStatus === "Preview" ||
                                    lot?.lotStatus === "Active"
                                }
                                onPress={() => {
                                    handleApprovalSave();
                                }}
                            />
                        ) : ((roles?.isSCO || roles?.isSMS) &&
                            (salesUsers?.loggedInUser === salesUsers?.sco ||
                                salesUsers?.loggedInUser === salesUsers?.alternateSco ||
                                salesUsers?.loggedInUser ===
                                salesUsers?.marketingSpecialist)) ||
                            roles?.isSG ? (
                            <PPMSButton
                                id={`approve-gsa-user-${index}`}
                                label={"Approve"}
                                type={"button"}
                                isDisabled={
                                    lot?.lotStatus === "Preview" || lot?.lotStatus === "Active"
                                }
                                onPress={() => {
                                    updateApproveModal(true);
                                }}
                            />
                        ) : (
                            <></>
                        )}
                        {roles?.isPC && lot?.custodianEmail === salesUsers?.loggedInUser ? (
                            <PPMSButton
                                id={`not-approve-${index}`}
                                label={"Not Approve"}
                                type={"button"}
                                isDisabled={
                                    lot?.lotStatus === "Preview" || lot?.lotStatus === "Active"
                                }
                                onPress={() => {
                                    updateDisapproveModal(true);
                                }}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
            <br />
            <PPMSModal
                handleClose={() => {
                    updateDisapprovalOptions(options());
                    updateYesNo(null);
                    updateDisapproveModal(false);
                }}
                handleSave={() => {
                    handleModalSave(false).then(() => prepareNotes(yesReason, false));
                }}
                label={"Submit"}
                labelCancel={"Cancel"}
                disableSave={yesReason === null || yesReason === ""}
                backdrop={"static"}
                id={"modal"}
                show={showDisapproveModal}
                body={
                    <DisapproveModal
                        options={disapprovalOptions}
                        updateDisapprovalOptions={(values) => {
                            updateDisapprovalOptions(values);
                        }}
                        acceptDisapproval={(value) => updateYesNo(value)}
                        yesNo={yesNo}
                        yesReason={yesReason}
                        updateYesReasonText={(text) => updateYesReasonText(text)}
                        index={index}
                    />
                }
                title={"Disapproval Reason"}
            />
            <PPMSModal
                handleClose={() => {
                    updateApprovalOptions(approveOptions());
                    updateApproveModal(false);
                    updateApprovalOptionSelected(null);
                }}
                handleSave={() => {
                    handleModalSave(true).then(() => {
                        prepareNotes(approveReason, true);
                    });
                }}
                label={"Submit"}
                labelCancel={"Cancel"}
                disableSave={!approvalOptionSelected}
                backdrop={"static"}
                id={"modal"}
                show={showApproveModal}
                body={
                    <ApproveModal
                        options={approvalOptions}
                        updateApprovalOptions={(values) => {
                            updateApprovalOptions(values);
                        }}
                        acceptApproval={(value) => updateApprovalOptionSelected(value)}
                        approveReason={approveReason}
                        updateApprovalReasonText={(text) => updateApproveReason(text)}
                        index={index}
                    />
                }
                title={"Lot Approval Reason"}
            />
        </>
    );
};
function getPropertyTypeInfo(propType) {
    switch (propType) {
        case "A":
            return "Excess (Surplus)";
        case "B":
            return "Exchange Sale";
        case "C":
            return "Other Reimbursable Property";
        case "G":
            return "Surplus Reimbursable";
        default:
            return "";
    }
}


function getConditionCodeInfo(conditionCode) {
    switch (conditionCode) {
        case "N":
            return "New or Unused";
        case "U":
            return "Usable";
        case "R":
            return "Repairable";
        case "X":
            return "Salvage";
        case "S":
            return "Scrap";
        default:
            return "";
    }
}

const LotDescription = ({ description }) => {
    return <>{description ? parse(description) : "-"}</>;
};

const downloadFile = (file) => {
    let url =
        Environment.COMMON_URL +
        "/api/v1/downloadFile?path=" +
        file?.uri +
        "&fileType=" +
        file?.itemType +
        "&fileName=" +
        file?.name;
    window.location.href = url;
};
const LotDocuments = ({ documents }) => {
    const documentsView = documents
        ?.sort((a, b) => a?.attachmentOrder - b?.attachmentOrder)
        .map((file, index) => (
            <tr>
                <td className={"tableColumnWrapper"}>{file?.name}</td>
                <td>{Math.round(file?.size / 1000)} KB</td>
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
                <td>{moment(file?.modifiedDate).format("MM/DD/YYYY")}</td>
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

const ICNList = ({ lotId, index }) => {
    let salesAPIService = new SalesApiService();
    const [page, updatePage] = useState({
        currentPage: 1,
        totalRows: 0,
        pageSize: 10,
        totalPages: 1,
    });
    const [ICNList, updateICNList] = useState([]);
    const handleICNPageChange = (pageNumber) => {
        let newPage = page;
        newPage.currentPage = pageNumber;
        updatePage(newPage);
        getICNDetailsList(lotId, pageNumber, page?.pageSize);
    };
    useEffect(() => {
        getICNDetailsList(lotId, page?.currentPage, page?.pageSize);
    }, []);
    const getICNDetailsList = (lotId, pageNumber, size) => {
        let data = {
            lotId: lotId,
            params: {
                page: pageNumber,
                size: page?.pageSize,
            },
        };
        salesAPIService
            .getICNDetailsList(data)
            .then((response) => {
                let newPage = page;
                newPage.totalRows = response.data?.totalElements;
                newPage.totalPages = Math.ceil(
                    response.data?.totalElements / page?.pageSize
                );
                updatePage(newPage);
                updateICNList(response.data?.icnDetailsList);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const columns = [
        {
            Header: "ICN",
            accessor: "itemControlNumber",
            Cell: (property) => (
                <a href={"/viewProperty/" + property?.value}>
                    {formatICN(property?.value)}
                </a>
            ),
            filter: "search",
        },
        {
            Header: "Item Name",
            accessor: "itemName",
            filter: "search",
        },
        {
            Header: "QTY.",
            accessor: "quantity",
            Cell: (property) => {
                return (
                    <>
                        {property?.value} {property?.data[0]?.unitOfIssue}
                    </>
                );
            },
            filter: "search",
        },
        {
            Header: "FMV",
            accessor: "fairMarketValue",
            Cell: (property) => {
                return (
                    <>
                        {property?.value
                            ? `$${property?.value
                                ?.toString()
                                .split(/(?=(?:\\\\d{3})+(?:\\\\.|$))/g)
                                .join(",")}`
                            : "-"}
                    </>
                );
            },
            filter: "search",
        },
    ];

    return (
        <>
            {page.totalPages > 1 && (
                <PPMSPaginationV2
                    totalPages={page?.totalPages}
                    pageListLength={6}
                    handlePageChange={handleICNPageChange}
                />
            )}
            <Table
                columns={columns}
                data={ICNList}
                index={index}
                hideHeader={false}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    agencyBureaus: state.common.agencyBureaus,
    user: state.authentication.user,
    zones: state.authentication.zones,
    roles: state.authentication.roles,
    sale: state.sale,
});
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getHolidays: (year) => {
            dispatch(commonActions.getHolidays(year));
        },
        updateSaleInfo: (saleId, saleNumber, saleAction, zone) =>
            dispatch(saleAction.updateSaleInfo(saleId, saleNumber, saleAction, zone)),
        actions: bindActionCreators({ addToast }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Lot);

