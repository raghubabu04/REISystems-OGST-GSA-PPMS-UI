import React from "react";
import { PPMSDatatable } from "../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import moment from "moment";
import { Link } from "react-router-dom";
import { Paths } from "../../../../Router";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { FaEdit, FaEye } from "react-icons/fa";
import { isEmpty } from "lodash";

interface ContractPaymentDetailsProps {
  paymentDetails?: any;
  registerId?: number;
  registerNumber?: string;
  type?: string;
  handleRefund?: any;
  roles?: any
}

const ContractPaymentList = (props: ContractPaymentDetailsProps) => {
  const { paymentDetails, registerId, type, handleRefund, roles, registerNumber } = props;
  const columns = [
    {
      Header: "Payment Method",
      accessor: "method",
      id: "method",
    },
    {
      Header: "Payment Details",
      accessor: "paymentDetails",
      id: "paymentDetails",
      Cell: (data) => {
        return data?.row?.values?.method === "Credit Card"
          ? `${data?.row?.original?.ccType} - ${data?.row?.original?.ccNumberL4}`
          : data?.row?.original?.depositNumber;
      },
    },
    {
      Header: "Payment Date",
      accessor: "paymentDate",
      id: "paymentDate",
      width: "200",
      Cell: (data) => {
        return moment(data?.value).format("MM/DD/YYYY hh:mm A");
      },
    },
    {
      Header: "Payment Amount",
      accessor: "paymentAmount",
      id: "paymentAmount",
      Cell: (data) => {
        return ` $${data.value}`;
      },
    },
    {
      Header: "Payment Register",
      accessor: "paymentDetails",
      id: "paymentRegister",
      Cell: (data) => {
        return (
          <>
            <Link to={Paths.paymentRegisterManager + "/" + registerId}>
              {registerNumber}
            </Link>
          </>
        );
      },
    },
    {
      Header: "Refund Amount",
      accessor: "refundAmount",
      id: "refundAmount",
      Cell: (data) => {
        return `$${data.value? data.value : 0.00}`;
      },
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: (contract) => {
        return (
          type === "refund" && roles.isCLO?  <PPMSButton
          variant={"secondary"}
          label={"Refund"}
          icon={<FaEdit />}
          size={"sm"}
          onPress={() => {
            handleRefund(contract?.row?.original?.id, contract?.row?.original?.refundAmount, contract?.row?.original?.refundTrackingId)
          }}
          id={"view"}
        />: <> </>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    }
  ];
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSDatatable
            title={""}
            data={paymentDetails}
            columns={columns}
            defaultSortField={"contractNumber"}
            totalRows={100}
            isPaginationEnabled={false}
            showFilters={false}
            serverSort={true}
            loading={false}
          />
        </div>
      </div>
    </>
  );
};

export default ContractPaymentList;
