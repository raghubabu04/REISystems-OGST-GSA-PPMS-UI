import React from "react";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";

interface TransactionButtonsProps {
  onSubmit?: any;
  onClear?: any;
  onActionHistory?: any;
  type?: string;
  roles?: any;
  status?: string;
  showActionHistory?: boolean;
}

const TransactionButtons = (props: TransactionButtonsProps) => {
  const {
    onSubmit,
    onClear,
    onActionHistory,
    type,
    roles,
    status,
    showActionHistory,
  } = props;

  return (
    <div className="grid-row grid-gap-2">
      <div className="desktop:grid-col-3">
        {roles?.isCOI || status === "Closed" ? (
          <></>
        ) : (
          <PPMSButton
            id={"submit-sale-transaction-pbsdoi"}
            label={type === "update" ? "Save" : "Submit"}
            type={"button"}
            variant={"primary"}
            onPress={onSubmit}
            isDisabled={false}
          />
        )}
      </div>
      <div className="desktop:grid-col-3" />
      <div className="desktop:grid-col-3">
        {type === "update" ? (
          <> </>
        ) : (
          <PPMSButton
            id={"clear-sale-transaction-pbsdoi"}
            label={"Clear Form"}
            type={"reset"}
            variant={"outline-primary"}
            onPress={onClear}
            isDisabled={false}
          />
        )}
      </div>
      <div className="desktop:grid-col-3">
        {showActionHistory ? (
          <PPMSButton
            id={"action-history-sale-transaction-pbsdoi"}
            label={"Action History"}
            type={"button"}
            className={"float-right"}
            variant={"outline-primary"}
            onPress={onActionHistory}
            isDisabled={false}
          />
        ) : (
          <> </>
        )}
      </div>
    </div>
  );
};

export default TransactionButtons;
