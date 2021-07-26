import React from "react";
import PPMSTextInput from "../form/PPMS-text-input";
import PPMSRangeInput from "../form/PPMS-range-input";
import PPMSDropdown from "../form/PPMS-dropdown";

// Define a default UI for filtering
export function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = (value) => {
    setGlobalFilter(value || undefined);
  };

  return (
    <span>
      Search:{" "}
      <PPMSTextInput
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
        id={"global"}
        name={"global"}
        type={"text"}
      />
    </span>
  );
}
export const defaultColumn = {
  // Let's set up our default Filter UI
  Filter: DefaultColumnFilter,
};

export function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, id },
}) {
  return (
    <>
      <PPMSTextInput
        value={filterValue || ""}
        id={`${id}-search`}
        title={id}
        name={"search"}
        type={"text"}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
      />
    </>
  );
}
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options: any = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <PPMSDropdown
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      id={"dropdown"}
      name={"dropdown"}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </PPMSDropdown>
  );
}
export function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <PPMSRangeInput
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10));
        }}
        id={"range"}
        name={"range"}
      />
    </>
  );
}
export function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <PPMSTextInput
        value={filterValue[0] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            val ? parseInt(val, 10) : undefined,
            old[1],
          ]);
        }}
        placeholder={`${min}`}
        style={{
          width: "70px",
          marginRight: "0.5rem",
        }}
        id={"min"}
        name={"min"}
      />
      to
      <PPMSTextInput
        value={filterValue[1] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            old[0],
            val ? parseInt(val, 10) : undefined,
          ]);
        }}
        placeholder={`${max}`}
        style={{
          width: "70px",
          marginLeft: "0.5rem",
        }}
        id={"max"}
        name={"max"}
      />
    </div>
  );
}
