import React from "react";
import { MdEdit } from "react-icons/md";
import { data } from "./components/data/constants";
import { PPMSButton } from "./components/common/PPMS-button";
import PPMSDatatable from "./components/common/datatable/PPMS-datatable";

interface State {
  filterText: string;
  paginationResetDefaultPage: boolean;
  filteredItems: any[];
}
interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
}
export class DataTable extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      filterText: "",
      paginationResetDefaultPage: false,
      filteredItems: data,
    };

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onExport = this.onExport.bind(this);
  }

  handleButtonClick(event: any) {
    console.log("edit");
    console.log(event);
  }
  downloadCSV(array: any) {
    const link = document.createElement("a");
    let csv = this.convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }

  convertArrayOfObjectsToCSV(array: any) {
    let result: any;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item: any) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }
  onSearch(event: any) {
    this.setState({ filterText: event.target.value });
    this.setState({ filteredItems: this.filterData(event) });
  }
  onReset(event: any) {
    this.setState({ filterText: "" });
    this.setState({ filteredItems: data });
    this.setState({ paginationResetDefaultPage: true });
  }
  onExport(event: any) {
    console.log(this.state.filteredItems);
    this.downloadCSV(this.state.filteredItems);
  }
  filterData(event: any) {
    return data.filter(
      (item) =>
        item.title &&
        item.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
  }
  columnsName = [
    {
      Header: "Id",
      accessor: "userAccountId",
      sortable: true,
      style: {
        backgroundColor: "rgba(187, 204, 221, 1)",
      },
    },
    {
      Header: "First Name",
      accessor: "firstName",
      sortable: true,
      grow: 2,
    },
    {
      Header: "Last Name",
      accessor: "lastName",
      sortable: true,
      grow: 2,
    },
    {
      Header: "Email",
      accessor: "email",
      sortable: true,
      grow: 2,
    },
    {
      Header: "Agency Bureau",
      accessor: "agencyBureau",
      sortable: true,
      grow: 2,
    },
    {
      Header: "AAC",
      accessor: "aac",
      sortable: true,
    },
    {
      Header: "Officer First Name",
      accessor: "aoFirstName",
      sortable: true,
      grow: 2,
    },
    {
      Header: "Officer Last Name",
      accessor: "aoLastName",
      sortable: true,
      grow: 2,
    },
    {
      Header: "Granter First Name",
      accessor: "granterFirstName",
      sortable: true,
      grow: 2,
    },
    {
      Header: "Granter Last Name",
      accessor: "granterLastName",
      sortable: true,
      grow: 2,
    },
    {
      Header: "Phone Number",
      accessor: "phoneNumber",
      sortable: true,
      grow: 2,
    },
    {
      Header: "Role",
      accessor: "role",
      sortable: true,
    },
    {
      Cell: () => (
        <PPMSButton
          variant={"secondary"}
          label={"Edit"}
          size={"sm"}
          icon={<MdEdit />}
          onPress={this.handleButtonClick}
          id={"edit"}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  columns = [
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Director",
      accessor: "director",
    },
    {
      Header: "Year",
      accessor: "year",
    },
    {
      Header: "Edit",
      id: "edit",
      Cell: () => (
        <PPMSButton
          variant={"secondary"}
          label={"Edit"}
          size={"sm"}
          icon={<MdEdit />}
          onPress={this.handleButtonClick}
          isLoading={false}
          id={"edit"}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  onChange = () => {};
  render() {
    return (
      <div>
        <PPMSDatatable
          title={"PPMS DataTable"}
          columns={this.columns}
          data={this.state.filteredItems}
          defaultSortField="title"
          isPaginationEnabled={true}
          rowsPerPageOptions={[25, 30, 35, 40, 45, 50]}
          loading={false}
          totalRows={this.state.filteredItems.length}
          totalPages={25}
          rowsPerPage={25}
          onChange={this.onChange}
          subHeaderComponent={
            <div style={{ display: "flex", alignItems: "center" }}>
              <PPMSButton
                label={"Export"}
                onPress={this.onExport}
                id={"export"}
              />
            </div>
          }
        />
      </div>
    );
  }
}
