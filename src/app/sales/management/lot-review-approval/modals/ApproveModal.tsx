import { PPMSToggleRadio } from "../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import React from "react";
import { PPMSTextEditor } from "../../../../../ui-kit/components/common/PPMS-texteditor";

 export const ApproveModal = ({
    options,
    updateApprovalOptions,
    acceptApproval,
    approveReason,
    updateApprovalReasonText,
    index,
}) => {
    return (
        <>
            <div className={"grid-row"}>
                <div className={"grid-col-12"}>
                    <PPMSToggleRadio
                        label={
                            "You are attempting to approve this lot without custodian approval. If this is correct, please select a reason from the list below:"
                        }
                        isDisabled={false}
                        isRequired={true}
                        id={`disapproval-${index}`}
                        name={`disapproval-${index}`}
                        isInline
                        options={options}
                        validationMessage={""}
                        onChange={(values) => {
                            let selectedValue = values.filter(
                                (value) => value?.isSelected === true
                            )[0];
                            acceptApproval(selectedValue?.value);
                            updateApprovalOptions(values);
                        }}
                    />
                </div>
            </div>
            <div className={"grid-row"}>
                <div className={"grid-col-12"}>
                    <PPMSTextEditor
                        value={approveReason}
                        label={""}
                        isInvalid={false}
                        isValid={false}
                        isRequired={true}
                        onChange={(text) => {
                            updateApprovalReasonText(text);
                        }}
                        id={`approve-reason-${index}`}
                        isDisabled={false}
                    />
                </div>
            </div>
        </>
    );
};