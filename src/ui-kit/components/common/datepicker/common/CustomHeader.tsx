import React from "react";
import moment from "moment";
import { months, years } from "./Constants";
import { PPMSButton } from "../../PPMS-button";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

interface CustomHeaderProps {
  date;
  changeYear;
  changeMonth;
  decreaseMonth;
  increaseMonth;
  prevMonthButtonDisabled;
  nextMonthButtonDisabled;
}

const CustomHeader = (props: CustomHeaderProps) => {
  const {
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  } = props;

  return (
    <>
      <div
        style={{
          margin: 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <PPMSButton
          id={"click-before"}
          label={""}
          size={"sm"}
          className={"date-picker-nav-button"}
          icon={<FaAngleDoubleLeft />}
          onPress={decreaseMonth}
          isDisabled={prevMonthButtonDisabled}
        />
        <select
          value={moment(date).year()}
          onChange={({ target: { value } }) => changeYear(value)}
          className={"usa-select date-picker-select"}
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={months[moment(date).month()]}
          onChange={({ target: { value } }) =>
            changeMonth(months.indexOf(value))
          }
          className={"usa-select date-picker-select"}
        >
          {months.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <PPMSButton
          id={"click-next"}
          label={""}
          size={"sm"}
          className={"date-picker-nav-button"}
          icon={<FaAngleDoubleRight />}
          isDisabled={nextMonthButtonDisabled}
          onPress={increaseMonth}
        />
      </div>
    </>
  );
};

export default CustomHeader;
