import React, { useEffect } from "react";
import { useTable } from "react-table";
import Moment from "moment";
import "moment-timezone";
import parse from "html-react-parser";
import { PPMSPopover } from "../common/PPMS-popover";
import { CgNotes } from "react-icons/cg";

export interface iActionListRow {
  id?: string | number;
  date?: string;
  time?: string;
  triggeredBy: string;
  description: string;
  createdAt: Date;
}

export interface ActionListProps {
  data: iActionListRow[];
  title?: string;
  listID: string;
  className?: string;
}

const columns = [
  { Header: "Date", accessor: "date" },
  { Header: "Time", accessor: "time" },
  { Header: "Description", accessor: "description" },
  { Header: "Email Address", accessor: "triggeredBy" },
];

export const PPMSSalesActionList: React.FunctionComponent<ActionListProps> = ({
  data,
  title,
  listID,
  className,
}: ActionListProps): React.ReactElement => {
  const actClassName = className || "action-table";
  const [id, setId] = React.useState<string>("");
  useEffect(() => {
    if (id != listID) {
      setId(listID);
    }
  }, [listID]);
  const { getTableProps, getTableBodyProps, rows } = useTable({
    columns,
    data: data,
  });

  let body = rows.map((row, index) => {
    const rowId = "actionListRow-" + index;
    return (
      <tr
        id={rowId}
        className="action-list-row"
        key={`action-list-row-${index}`}
      >
        <td className="action-list-dtcell">
          <span className="action-list-date">
            {Moment(row.original.createdAt).format("MM/DD/YYYY")}
          </span>
          <span className="action-list-slash">@</span>
          <span className="action-list-time">
            {Moment(row.original.createdAt)
              .tz("America/Chicago")
              .format("hh:mm:ss.SSS CT")}
          </span>
          {row.values.description ? (
            <>
              <span className="action-list-message sales-notes">
                {removeTags(row.values.description)?.substring(0, 50)}
              </span>
              {row.values.description?.length > 50 && (
                <>
                  ...
                  <PPMSPopover
                    trigger={["hover", "focus"]}
                    id={"description"}
                    placement={"right"}
                    popoverTitle={"Overall content"}
                    popoverContent={<>{parse(row.values.description)}</>}
                    triggerSource={
                      <span className={"cursor-pointer lot-notes-icon"}>
                        <CgNotes />
                      </span>
                    }
                  />
                </>
              )}
            </>
          ) : row.original.notes ? (
            <>
              <span className="action-list-message sales-notes">
                {removeTags(row.original.notes)?.substring(0, 50)}
              </span>
              {row.original.notes?.length > 50 && (
                <>
                  ...
                  <PPMSPopover
                    trigger={["hover", "focus"]}
                    id={"description"}
                    placement={"right"}
                    popoverTitle={"Notes"}
                    popoverContent={<>{parse(row.original.notes)}</>}
                    triggerSource={
                      <span className={"cursor-pointer lot-notes-icon"}>
                        <CgNotes />
                      </span>
                    }
                  />
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </td>
        <td className="action-list-email">
          {row.values.triggeredBy ? (
            <span className="action-list-message">
              {row.values.triggeredBy}
            </span>
          ) : row.original.createdBy ? (
            <span className="action-list-message">
              {row.original.createdBy}
            </span>
          ) : (
            <></>
          )}
        </td>
      </tr>
    );
  });
  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  }
  return (
    <table {...getTableProps()} title={title} className={actClassName}>
      <thead>
        <tr>
          <th className="dtHeader">Date/Time/Message</th>
          <th className="emailHeader">Activity Email</th>
        </tr>
      </thead>
      <tbody {...getTableBodyProps()}>{body}</tbody>
    </table>
  );
};
