import React from "react";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";

interface ContractTransactionButtonProps {
  voidContract?: () => void;
  defaultFunction?: () => void;
  cancelFunction?: () => void;

  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  isDeleteDisabled?: boolean;
  showActionHistory?: boolean;
  clearFunction?: () => void;
  viewDocument?: () => void;
  clearDisabled?: boolean;
  saveSubmitBtnLabel?: string;
  action?: string;
  salesId?: any;
  roles?: any;
  salesSCO?: any;
  userEmail?: any;
  alternateSCO?: any;
  contractNumber?: any;
  viewDocumentVariant?: any;
  selectImagesDocs?: () => void;
  selectContractDocs?: () => void;
  contractId?: any;
  actionDisable?: any;
}

export default function ContractTransactionButtons(
  props: ContractTransactionButtonProps
) {
  const { actionDisable} = props;
  return (
    <>
      <div className={"grid-col-auto"}>
        Change Contract Status:
      </div>
      <div className={"grid-col-6"}>
        
          <PPMSButton
            variant={"primary"}
            type={"reset"}
            label={"Void"}
            onPress={props.voidContract}
            id={"cancel"}
            isDisabled={actionDisable}
            className={"usa-button--sm"}
          />
          <PPMSButton
            variant={"primary"}
            type={"reset"}
            label={"Cancel"}
            onPress={props.clearFunction}
            id={"cancel"}
            isDisabled={true}
            className={"usa-button--sm"}
          />
          <PPMSButton
            variant={"primary"}
            type={"reset"}
            label={"Default"}
            onPress={props.clearFunction}
            id={"cancel"}
            isDisabled={true}
            className={"usa-button--sm"}
          />
        
      </div>
      <div className={"grid-col-3 text-right"}>
        <PPMSButton
          variant={props.viewDocumentVariant}
          className={"out-button usa-button--sm"}
          type={"button"}
          value={""}
          label={"View Documentation"}
          onPress={props.viewDocument}
          id={"view-documentations-contract"}
        />
      </div>
    </>
  );
}
