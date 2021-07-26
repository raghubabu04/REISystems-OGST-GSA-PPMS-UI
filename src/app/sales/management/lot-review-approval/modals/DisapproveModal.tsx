import { PPMSToggleRadio } from "../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import React from "react";
import { PPMSTextEditor } from "../../../../../ui-kit/components/common/PPMS-texteditor";

export const DisapproveModal = ({
    options,
    updateDisapprovalOptions,
    acceptDisapproval,
    yesNo,
    yesReason,
    updateYesReasonText,
    index,
}) => {
    return (
        <>
            <div className={"grid-row"}>
                <div className={"grid-col-12"}>
                    <PPMSToggleRadio
                        label={"Are you sure you want to disapprove the lot?"}
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
                            acceptDisapproval(selectedValue?.value);
                            updateDisapprovalOptions(values);
                        }}
                    />
                </div>
            </div>
            {yesNo === "Yes" ? (
                <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                        <PPMSTextEditor
                            value={yesReason}
                            label={""}
                            isInvalid={false}
                            isValid={false}
                            isRequired={true}
                            onChange={(text) => {
                                updateYesReasonText(text);
                            }}
                            id={`disapprove-reason-${index}`}
                            isDisabled={false}
                        />
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};
