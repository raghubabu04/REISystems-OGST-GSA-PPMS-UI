import React, { useEffect, useState } from "react";
import PPMSDatatable from "../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { formatCurrency } from "../../../../../ui-kit/utilities/FormatUtil";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";

interface PropertySummaryProps {
  registerId: number;
}

const PropertySummary = (props: PropertySummaryProps) => {
  const { registerId } = props;
  const [showModal, updateShowModal] = useState(false);
  const [propertySummaryGrouped, updatePropertySummaryGrouped] = useState([]);
  let salesAPIService = new SalesApiService();
  const getPropertySummaryGrouped = (registerId) => {
    salesAPIService
      .getPropertySummaryGrouped(registerId)
      .then((response) => {
        updatePropertySummaryGrouped(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getPropertySummaryGrouped(registerId);
  }, []);

  const summary = {
    gsaRevenue: 2750,
    reimbursementAmount: 40200,
    miscFee: 800,
    totalProceeds: 43750,
  };
  const dataDetail = [
    {
      tas: "12F3845",
      alc: "12345678",
      gsaRevenue: 1100,
      reimbursementAmount: 13400,
      miscFee: 500,
    },
  ];
  const propertyTypeColumns = [
    {
      Header: "Property Type",
      accessor: "propertyType",
      Cell: (data) => {
        return (
          <PPMSButton
            id={"property-type"}
            label={data.value}
            type={"button"}
            variant={"link"}
            onPress={() => updateShowModal(true)}
          />
        );
      },
      Footer: "TOTAL",
    },
    {
      Header: "GSA Revenue",
      accessor: "gsaRevenue",
      class: "align-right",
      Cell: (data) => {
        return formatCurrency.format(data.value);
      },
      Footer: (info) => {
        const total = React.useMemo(
          () => info.rows.reduce((sum, row) => row.values.gsaRevenue + sum, 0),
          [info.rows]
        );

        return <>{formatCurrency.format(total)}</>;
      },
    },
    {
      Header: "Reimbursement Amount",
      accessor: "reimbursementAmount",
      Cell: (data) => {
        return formatCurrency.format(data.value);
      },
      Footer: (info) => {
        const total = React.useMemo(
          () =>
            info.rows.reduce(
              (sum, row) => row.values.reimbursementAmount + sum,
              0
            ),
          [info.rows]
        );

        return <>{formatCurrency.format(total)}</>;
      },
    },
    {
      Header: "Total Proceeds",
      accessor: "totalProceeds",
      Cell: (data) => {
        return formatCurrency.format(data.value);
      },
      Footer: (info) => {
        const total = React.useMemo(
          () =>
            info.rows.reduce((sum, row) => row.values.totalProceeds + sum, 0),
          [info.rows]
        );

        return <>{formatCurrency.format(total)}</>;
      },
    },
  ];
  const handleSort = (sortBy) => {};
  const handleClose = () => {
    updateShowModal(false);
  };
  const handleSave = () => {};
  return (
    <div>
      <PPMSDatatable
        title={""}
        showFilters={false}
        data={propertySummaryGrouped}
        columns={propertyTypeColumns}
        defaultSortField={"paymentType"}
        isPaginationEnabled={false}
        loading={false}
        totalRows={propertySummaryGrouped?.length}
        handleSort={(sortBy) => handleSort(sortBy)}
      />
      <PPMSModal
        id={"show-property-type"}
        show={showModal}
        body={
          <PropertyTypeDetail
            data={dataDetail}
            title={"Non-GSA Vehicles B/A:GS30;F/C;FD15K"}
            summary={summary}
          />
        }
        title={"Property Type Summary - Detail"}
        handleClose={handleClose}
        handleSave={handleSave}
        hideLabel={true}
        labelCancel={"Close"}
        size={"lg"}
        backdrop={"static"}
        centered={true}
      />
    </div>
  );
};
const PropertyTypeDetail = ({ data, title, summary }) => {
  const columns = [
    {
      Header: "TAS",
      accessor: "tas",
      filter: "search",
    },
    {
      Header: "ALC",
      accessor: "alc",
      filter: "search",
    },
    {
      Header: "GSA Revenue",
      accessor: "gsaRevenue",
      filter: "search",
    },
    {
      Header: "Reimb. Amount",
      accessor: "reimbursementAmount",
      filter: "search",
    },
    {
      Header: "Misc. Fee",
      accessor: "miscFee",
      filter: "search",
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: (row) => {
        return (
          <>
            <PPMSButton id={"save-fees"} label={"Save"} size={"sm"} />
          </>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];
  const summaryList = (summary) => {
    return (
      <>
        <li>
          <span>
            <strong>GSA Revenue:</strong>
          </span>
          {formatCurrency.format(summary.gsaRevenue)}
        </li>
        <li>
          <span>
            <strong>Reimb. Amount:</strong>
          </span>
          {formatCurrency.format(summary.reimbursementAmount)}
        </li>
        <li>
          <span>
            <strong>Misc.Fee:</strong>
          </span>
          {formatCurrency.format(summary.miscFee)}
        </li>
        <li>
          <span>
            <strong>Total Proceeds:</strong>
          </span>
          {formatCurrency.format(summary.totalProceeds)}
        </li>
      </>
    );
  };
  const handleSort = (sortBy) => {};
  const updateData = () => {
    //TODO update API
  };
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-auto"}>
          <h3>{title}</h3>
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-12"}>
          <div
            id={"summary-info"}
            className="usa-summary-box"
            role="complementary"
          >
            <div className="usa-summary-box__body">
              <div className="usa-summary-box__text">
                <ul className="usa-list usa-list-property-type">
                  {summaryList(summary)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={"grid-row  grid-gap-4"}>
        <div className={"grid-col-auto"}>
          <PPMSDatatable
            title={""}
            showFilters={false}
            data={data}
            columns={columns}
            defaultSortField={"paymentType"}
            isPaginationEnabled={false}
            loading={false}
            totalRows={data?.length}
            updateData={updateData}
            handleSort={(sortBy) => handleSort(sortBy)}
          />
        </div>
      </div>
    </>
  );
};
export default PropertySummary;
