import React, { useContext } from "react";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";

export const EditableCell = ({
  value: initialValue,
  row: { index, values },
  column: { id },
  updateData,
}) => {
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(`$${numberWithCommas(e?.target?.value?.replace(/[^0-9]+/g, ""))}`);
  };

  const onBlur = () => {
    updateData(id, values.lotId, value);
  };

  React.useEffect(() => {
    setValue(initialValue ? `$${initialValue}` : "");
  }, [initialValue]);

  function numberWithCommas(value) {
    if (value || value === 0) {
      if (value.toString().substring(0, 1) === "0") {
        return "0";
      } else {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    } else {
      return "";
    }
  }

  return (
    <>
      {values.lotId && (
        <PPMSInput
          id={`r-${index}`}
          name={"amount"}
          isRequired={true}
          isDisabled={values.bid}
          inputType={"text"}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          placeHolder={"$0"}
          validationMessage={""}
          maxLength={11}
          minLength={1}
          isInvalid={false}
          isValid={true}
          className={"editable-cell"}
        />
      )}
    </>
  );
};
