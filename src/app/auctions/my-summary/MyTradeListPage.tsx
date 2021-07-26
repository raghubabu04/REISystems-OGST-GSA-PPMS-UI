import { table } from "console";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { CgNotes } from "react-icons/cg";
import { FaEye } from "react-icons/fa";
import { SalesApiService } from "../../../api-kit/sales/sales-api-service";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PPMSPopover } from "../../../ui-kit/components/common/PPMS-popover";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { PageHelper, Paths } from "../../Router";
import { formatCurrency } from "../../../ui-kit/utilities/FormatUtil";
import {Tab, Tabs} from "react-bootstrap";

const rowsPerPageOptions=[10, 20, 30, 40, 50];

interface MyTradesListState{
  totalPages:number,
  totalElements:number,
  tradeListDTO:any[],

}


const periodValuesSource = [
  {
    id: "30",
    value: "Past 30 Days",
  },
  {
    id: "60",
    value: "Past 60 Days",
  },
  {
    id: "90",
    value: "Past 90 Days",
  },
  {
    id: "allTrades",
    value: "All Trades"
  }
];

const defaultMyTradeList: MyTradesListState = {
  totalPages:0,
  totalElements:0,
  tradeListDTO:[]
};

interface MyTradeFilterState {
  currentPageNumber:number,
  currentPageSize:number,
  sortBy:string,
  tableFilter:any,
  tradeStatus: string,
}

const defaultMyTradeFilterState : MyTradeFilterState = {
  currentPageNumber:1,
  currentPageSize:rowsPerPageOptions[4],
  sortBy:"",
  tableFilter:{},
  tradeStatus: "",
}

const MyTradeListPage = (props: any) =>{
  const items=[];
  //const rowsPerPageOptions=[10, 20, 30, 40, 50];

  const [tableProp, setTableProp] = useState<MyTradesListState>(defaultMyTradeList);
  const [filterProp, setFilterProp] = useState<MyTradeFilterState>(defaultMyTradeFilterState);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(periodValuesSource[0].id);
  const [isPaymentDueDateHidden, setIsPaymentDueDateHidden] = useState<boolean>(false);

  useEffect(() => fetchTradeList(), [filterProp]);

  const columns=[
    {
      Header: "Sale / Lot Number",
      accessor: "saleLotNumber",
      filter: "search",
	  maxWidth: 400,
      minWidth: 140,
      width: 250,
    },
    {
      Header: "Lot Name",
      accessor: "lotName",
      filter: "search",
    },
    {
      Header: "Payment Due Date",
      accessor: "paymentDueDate",
      filter: "search",
    },
    {
      Header: "Award Date",
      accessor: "awardDate",
      filter: "search",
	  maxWidth: 400,
      minWidth: 140,
      width: 200,
    },
    {
      Header: "Contract Status",
      accessor: "status",
      maxWidth: 400,
      minWidth: 140,
      width: 300,
      Cell: (data) => {

          const name: string = data.row.values["status"];
          return (
            <>
              {name}&nbsp;&nbsp;&nbsp;
              {(name === "Default" ||
                name === "Default - For non-payment") && (
                <PPMSPopover
                  trigger={["hover"]}
                  id={"my-trades-status-tooltip"}
                  placement={"right"}
                  popoverTitle={"Default - For non-payment"}
                  popoverContent={"You are in default for failure to pay for your contract. To pay your liquidated damages, please contact 1-800-676-3690 and reference your claim number (on the termination notice emailed to you)."}
                  triggerSource={
                    <button
                      id={`prop-type-tooltip-button`}
                      type={"button"}
                      className={"usa-button  usa-button--unstyled"}
                    >
                      <CgNotes />
                    </button>
                  }
                />
              )}
            </>
          );

      },
      filter: "search",
    },
    {
      Header: "Contract Number",
      accessor: "contractNumber",
      filter: "search",
    },
    {
      Header: "Award Amount",
      accessor: "awardAmount",
	  alignItem: 'right',
	  Cell: (data:any) => {
		var awardAmount = formatCurrency.format(data.row.values["awardAmount"]);
		return <div style={{ textAlign: "right" }}>{awardAmount}</div>
      },
      filter: "search",
    },

	{
      Header: "Amount Paid",
	  accessor: "amountPaid",
	  Cell: (data:any) => {
		var amountPaid = formatCurrency.format(data.row.values["amountPaid"]);
		return <div style={{ textAlign: "right" }}>{amountPaid}</div>
      },
	  filter: "search",
    },


    {
      Header: "Actions",
      id: "actions",
      ApplyFilter: (columns) => {
        return (
          <>
            <div id="spacer"></div>
            <PPMSButton
              id={"apply-filter"}
              onPress={() => {
                let filter = {};
                columns.columns.forEach((column) => {
                  filter[column.id] = column["filterValue"];
                });
                setFilterProp({...filterProp, tableFilter: filter});
              }}
              label={"Search"}
            />
            <PPMSButton
              id={"clear-filter"}
              onPress={() => {
                let filter = {};
                columns.columns.forEach((column) => {
                  filter[column.id] = "";
                  column.setFilter("");
                });
                setFilterProp({...filterProp, tableFilter: filter});
              }}
              label={"Clear"}
            />
          </>
        );
      },
      Cell:(data) => (
        <>
        {data.row.values.status=="Awarded" && data.row.values["amountPaid"] < data.row.values["awardAmount"] &&
          <PPMSButton
              variant={"secondary"}
              label={"Pay"}
              className={"manage-list-actions"}
              size={"sm"}
              icon={<FaEye />}
              onPress={() =>{
                let pageRoute=Paths.payTradeAwards + "/"+ data.row.original["contractId"];
                PageHelper.openPage(pageRoute);
              }}
              id={"pay"}
          />}
		  {data.row.values.status=="Default"  || data.row.values.status=="Canceled" &&
          <PPMSButton
              variant={"secondary"}
              label={"View"}
              className={"manage-list-actions"}
              size={"sm"}
              icon={<FaEye />}
              id={"view"}
        />}
        </>
      )
    },

  ];


  const accordianItems = [{
    title: "Filters",
    content: (
      <>
        <div className={"grid-col-2"}>
          <PPMSSelect
            id={"period"}
            name={"Period"}
            selectName={"hazardous"}
            values={periodValuesSource}
            onChange={(event) => {
              setSelectedPeriod(event.target.value);
            }}
            identifierKey={"id"}
            identifierValue={"value"}
            selectedValue={selectedPeriod}
            label={"Period"}
            isRequired={true}
            disabled={false}
          />
        </div>
        <br></br>
        <div className={"grid-row"}>
              <PPMSButton
                id={"apply-filter-top"}
                onPress={() => {
                  fetchTradeList();
                }}
                label={"Apply Filter"}
                className={"create-property"}
              />
              <PPMSButton
                id={"clear-filter-top"}
                onPress={() => {
                  setSelectedPeriod(periodValuesSource[0].id);
                  setTimeout(() => fetchTradeList(), 500);
                }}
                label={"Clear"}
                className={"create-property"}
                isDisabled={false}
              />
            </div>
      </>
    ),
    expanded: true,
    id: "filters",
    trigger: "common",
  }];

   function fetchTradeList(){
    if(filterProp.currentPageNumber===0){
      return;
    }
    if(filterProp.tradeStatus !== "others"){
      filterProp.tradeStatus = "unpaid";
    }
    let filterBody={
       "saleNumber": filterProp.tableFilter.saleLotNumber?.substring(0,11) || "",
       "lotNumber": filterProp.tableFilter.saleLotNumber?.substring(11,14) || "",
       "lotName": filterProp.tableFilter.lotName || "",
       "paymentDueDate": filterProp.tableFilter.paymentDueDate || "",
       "awardDate": filterProp.tableFilter.awardDate || "",
       "status": filterProp.tableFilter.status || "",
       "contractNumber": filterProp.tableFilter.contractNumber || "",
       "awardAmount": filterProp.tableFilter.awardAmount || "",
       "amountPaid": filterProp.tableFilter.amountPaid || "",
       "tradeStatus": filterProp.tradeStatus || "",
   }

   let params={
    "page":filterProp.currentPageNumber,
    "size":filterProp.currentPageSize,
    "period":selectedPeriod,
    "sort":filterProp.sortBy
   }
   const salesApiService = new SalesApiService();
   salesApiService.getTradeList(params,filterBody).then((response: any) => {
     let newTableProp={
      totalPages:response.data.totalPages,
      totalElements:response.data.totalElements,
      tradeListDTO:response.data.myTradesDTO,
     };
     setTableProp(newTableProp);
   }).catch((error: any) => {
    console.log(error);
  });

  }

  function handleTabSelect(value) {
     if(value === "unpaid"){
       filterProp.tradeStatus = "unpaid";
       setIsPaymentDueDateHidden(false);
       fetchTradeList();
     } else if(value === "others"){
       filterProp.tradeStatus = "others";
       setIsPaymentDueDateHidden(true);
       fetchTradeList();
     }
  }
  return (
    <>
      <div className="ui-ppms">
        <PPMSDatatable
            title={"MY TRADES"}
            data={tableProp.tradeListDTO}
            columns={columns}
            defaultSortField={"status"}
            loading={false}
            rowsPerPageOptions={rowsPerPageOptions}
            totalRows={tableProp.totalElements}
            totalPages={tableProp.totalPages}
            rowsPerPage={filterProp.currentPageSize}
            isPaginationEnabled={true}
            hiddenColumns={["contractId",
              isPaymentDueDateHidden? "paymentDueDate" : ""]}
            onChange={(pageSize:number,pageIndex:number)=>  {
                setFilterProp({...filterProp, currentPageSize:pageSize,currentPageNumber:pageIndex})
              }
            }
            serverSort={true}
            handleSort={(sortBy) => {
              let sort;
              let order;
              sortBy ? (!sortBy.desc ? (order = "ASC") : (order = "DESC")) : (sort = "");
              if (order) sort = sortBy?.id + "," + order;
              setFilterProp({...filterProp, sortBy:sort})
            }}
            currentPage={filterProp.currentPageNumber-1}
            showFilters={true}
            subHeaderComponent={
              <>
                <div className={"grid-col"}>
                  <div className={"grid-row"}>
                    <PPMSAccordion bordered={true} items={accordianItems} />
                  </div>
                </div>
              </>
            }
            tabComponent={
              <>
                <br />
                <Tabs
                  defaultActiveKey="unpaid"
                  id="active-my-trades-tab"
                  className="ppms-tabs"
                  onSelect={(value) => {
                    handleTabSelect(value);
                  }}
                >
                  <Tab eventKey="unpaid" title="Unpaid Awards"/>
                  <Tab eventKey="others" title="Others Awards"/>
                </Tabs>
              </>
            }
        />
      </div>
    </>
  );
}

export default MyTradeListPage;
