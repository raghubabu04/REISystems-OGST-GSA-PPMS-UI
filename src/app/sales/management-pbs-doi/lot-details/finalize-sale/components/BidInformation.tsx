import React from "react";
import PPMSDatatable from "../../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { formatCurrency } from "../../../../../../ui-kit/utilities/FormatUtil";

interface BidInformationProps {
  lotInformation: any;
}

const BidInformation = (props: BidInformationProps) => {
  const { lotInformation } = props;
  const columns = React.useMemo(
    () => [
      {
        Header: "Property Name",
        accessor: "propertyName",
        filter: "search",
        disableSortBy: true,
      },
      {
        Header: "Category",
        accessor: "category",
        filter: "search",
        disableSortBy: true,
      },
      {
        Header: "Starting Bid",
        accessor: "startingBid",
        filter: "search",
        disableSortBy: true,
      },
      {
        Header: "Bid Deposit Amount",
        accessor: "bidDepositAmount",
        filter: "search",
        disableSortBy: true,
      },
    ],
    []
  );
  const generateData = (lotInformation) => {
    return [
      {
        propertyName: lotInformation?.itemName,
        category: lotInformation?.categoryCode,
        startingBid: lotInformation?.biddingDetailsPBSDOIDTO?.startingBid
          ? formatCurrency.format(
              lotInformation?.biddingDetailsPBSDOIDTO?.startingBid
            )
          : "",
        bidDepositAmount: lotInformation?.biddingDetailsPBSDOIDTO
          ?.bidDepositAmount
          ? formatCurrency.format(
              lotInformation?.biddingDetailsPBSDOIDTO?.bidDepositAmount
            )
          : "",
      },
    ];
  };
  return (
    <>
      <PPMSDatatable
        title={""}
        columns={columns}
        defaultSortField={"propertyName"}
        data={generateData(lotInformation)}
        loading={false}
        totalRows={3}
      />
    </>
  );
};

export default BidInformation;
