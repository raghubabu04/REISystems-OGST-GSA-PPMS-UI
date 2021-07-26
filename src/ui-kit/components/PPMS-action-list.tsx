import React from "react";
import {useTable} from 'react-table';
import {cloneDeep} from "lodash";
import Moment from 'moment';
import "moment-timezone";

export interface iActionListRow{
  id: string|number;
  date: string;
  time: string;
  triggeredBy: string;
  description: string;
  createdAt: Date;
}

export interface ActionListProps{
  data: iActionListRow[];
  title:string;
  listID: string;
  className?: string;
}

const columns = [
  {Header: 'Date', accessor: 'date'},
  {Header: 'Time', accessor: 'time'},
  {Header: 'Description', accessor: 'description'},
  {Header: 'Email Address', accessor: 'triggeredBy'},
];

export const PPMSActionList: React.FunctionComponent<ActionListProps> = (
  {
    data,
    title,
    listID,
    className
  }:ActionListProps
): React.ReactElement =>{
  const actClassName = className || 'action-table';
  const [id, setId] = React.useState<string>('');
  const tableData = React.useMemo(() =>{
    if (id != listID) {

      setId(listID);
      return cloneDeep(data);
    }
    else return tableData;
  },[listID]);

  const {
    getTableProps,
    getTableBodyProps,
    rows,
  } = useTable({columns, data: tableData})

  let body = rows.map((row, index) => {
    const rowId = 'actionListRow-' + index;
    return (
      <tr id={rowId} className='action-list-row'>
        <td className='action-list-dtcell'>
          <span className="action-list-date">{Moment(row.original.createdAt).format('MM/DD/YYYY')}</span><span className='action-list-slash'>@</span>
          <span className="action-list-time">{Moment(row.original.createdAt).tz("America/Chicago").format('hh:mm:ss.SSS CT')}</span>
          <span className="action-list-message">{row.values.description}</span>
        </td>
        <td className="action-list-email">
          <span className="action-list-message">{row.values.triggeredBy}</span>
        </td>
      </tr>
    );
  });

  return (
    <table {...getTableProps()} title={title} className={actClassName} >
      <thead>
      <tr>
        <th className='dtHeader'>Date/Time/Message </th>
        <th className="emailHeader">Activity Email</th>
      </tr>
      </thead>
      <tbody {...getTableBodyProps()}>
      {body}
      </tbody>
  </table>
  );
}
