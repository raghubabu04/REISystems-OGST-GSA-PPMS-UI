import React from "react";
import { useTable } from "react-table";
interface TableProps {
  columns: any[];
  data: any[];
  index: number;
  lot?: any[];
  hideHeader: boolean;
}
export function Table(props: TableProps) {
  const { columns, data, index, lot, hideHeader } = props;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    index,
    lot,
    hideHeader,
  });

  return (
    <table {...getTableProps()} className={"usa-table ui-ppms"}>
      {!hideHeader && (
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
      )}
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
