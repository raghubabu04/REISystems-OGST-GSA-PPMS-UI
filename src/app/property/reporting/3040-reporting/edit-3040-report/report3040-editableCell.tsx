import React, { useContext } from "react";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { numberWithCommas } from "./constants-3040";
import { Reporting3040Context } from "./reporting-3040-context";

export const EditableCell = ({
  value: initialValue,
  row: { index, values },
  column: { id },
  updateData,
  viewEnabled,
}) => {
  const [value, setValue] = React.useState(initialValue);
  const { editReporting3040State } = useContext(Reporting3040Context);

  const onChange = (e) => {
    setValue(`$${numberWithCommas(e?.target?.value?.replace(/[^0-9]+/g, ""))}`);
  };

  const onBlur = () => {
    updateData(index, id, value);
  };

  React.useEffect(() => {
    setValue(initialValue ? `$${initialValue}` : "");
  }, [initialValue]);

  if (values.otherCategory === "" && id === "otherAmount") {
    return "";
  } else {
    return (
      <PPMSInput
        id={`r-${index}`}
        name={"amount"}
        isRequired={true}
        isDisabled={editReporting3040State.viewEnabled}
        inputType={"text"}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        placeHolder={"$0"}
        validationMessage={""}
        maxLength={13}
        minLength={1}
        isInvalid={false}
        isValid={true}
        className="big-label-3040"
      />
    );
  }
};
