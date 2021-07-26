import moment from "moment";
import React, { useContext } from "react";
import { PPMSDatepicker } from "../../../../ui-kit/components/common/datepicker/PPMS-datepicker";

export const EditableDateCell = ({ data: data, updateData }) => {
  const [value, setValue] = React.useState(
    data.row.subRows[0].original.saleStartDate
  );

  const onChange = (e) => {
    setValue(e);
    updateData(data.row.subRows[0].original.salesNumber, null, value);
  };

  React.useEffect(() => {
    setValue(
      data.row.subRows[0].original.saleStartDate
        ? `$${data.row.subRows[0].original.saleStartDate}`
        : ""
    );
  }, [data.row.subRows[0].original.saleStartDate]);

  return (
    <>
      <PPMSDatepicker
        id={`startDate-${data.row.subRows[0].original.salesNumber}`}
        format={"MM/DD/YYYY"}
        startDate={
          data.row.subRows[0].original.saleStartDate
            ? moment(
                new Date(data.row.subRows[0].original.saleStartDate),
                "MM/DD/YYYY"
              ).toDate()
            : null
        }
        notShowFormat={true}
        className={"sale-date-picker"}
        updateDate={() => {}}
        label={"Sale Start Date"}
        display={"bottom-end"}
        isDisabled={true}
        minDate={moment(new Date(Date.now())).toDate()}
        isRequired={true}
        labelBold={true}
      />
    </>
  );
};
