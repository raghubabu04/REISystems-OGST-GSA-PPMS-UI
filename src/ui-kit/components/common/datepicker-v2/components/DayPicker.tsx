import React, { forwardRef, KeyboardEvent } from "react";
import classnames from "classnames";
import { formatDate, isIosDevice } from "../utils/Utils";
import { DAY_OF_WEEK_LABELS, MONTH_LABELS } from "../constants/Constants";

export const DayPicker = forwardRef(
  (
    {
      date,
      onClick,
      onKeyDown,
      onMouseMove,
      isDisabled = false,
      isSelected = false,
      isFocused = false,
      isPrevMonth = false,
      isFocusedMonth = false,
      isNextMonth = false,
      isToday = false,
      isRangeDate = false,
      isRangeStart = false,
      isRangeEnd = false,
      isWithinRange = false,
    }: {
      date: Date;
      onClick: (value: string) => void;
      onKeyDown: (event: KeyboardEvent) => void;
      onMouseMove: (hoverDate: Date) => void;
      isDisabled?: boolean;
      isSelected?: boolean;
      isFocused?: boolean;
      isPrevMonth?: boolean;
      isFocusedMonth?: boolean;
      isNextMonth?: boolean;
      isToday?: boolean;
      isRangeDate?: boolean;
      isRangeStart?: boolean;
      isRangeEnd?: boolean;
      isWithinRange?: boolean;
    },
    ref: React.ForwardedRef<HTMLButtonElement>
  ): React.ReactElement => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const dayOfWeek = date.getDay();

    const formattedDate = formatDate(date);
    const tabIndex = isFocused ? 0 : -1;

    const classes = classnames("usa-date-picker__calendar__date", {
      "usa-date-picker__calendar__date--previous-month": isPrevMonth,
      "usa-date-picker__calendar__date--current-month": isFocusedMonth,
      "usa-date-picker__calendar__date--next-month": isNextMonth,
      "usa-date-picker__calendar__date--selected": isSelected,
      "usa-date-picker__calendar__date--today": isToday,
      "usa-date-picker__calendar__date--focused": isFocused,
      "usa-date-picker__calendar__date--range-date": isRangeDate,
      "usa-date-picker__calendar__date--range-date-start": isRangeStart,
      "usa-date-picker__calendar__date--range-date-end": isRangeEnd,
      "usa-date-picker__calendar__date--within-range": isWithinRange,
    });

    const monthStr = MONTH_LABELS[parseInt(`${month}`)];
    const dayStr = DAY_OF_WEEK_LABELS[parseInt(`${dayOfWeek}`)];

    const handleClick = (): void => {
      onClick(formattedDate);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>): void => {
      onKeyDown(e);
    };

    const handleMouseMove = (): void => {
      if (isDisabled || isIosDevice()) return;
      onMouseMove(date);
    };

    return (
      <button
        type="button"
        data-testid="select-date"
        ref={ref}
        onClick={handleClick}
        tabIndex={tabIndex}
        className={classes}
        data-day={day}
        data-month={month + 1}
        data-year={year}
        data-value={formattedDate}
        aria-label={`${day} ${monthStr} ${year} ${dayStr}`}
        aria-selected={isSelected}
        disabled={isDisabled}
        onKeyDown={handleKeyDown}
        onMouseMove={isFocusedMonth ? handleMouseMove : undefined}
      >
        {day}
      </button>
    );
  }
);

DayPicker.displayName = "Day";
