import React, { useEffect, useState } from "react";
import PPMSDatatable from "../../ui-kit/components/common/datatable/PPMS-datatable";
import { formatICN, formatSaleNumber } from "../../ui-kit/utilities/FormatUtil";
import { SalesApiService } from "../../api-kit/sales/sales-api-service";
import { PPMSCardGroup } from "../../ui-kit/components/common/card/PPMS-card-group";
import { PPMSCard } from "../../ui-kit/components/common/card/PPMS-card";
import { PPMSCardBody } from "../../ui-kit/components/common/card/PPMS-card-body";
import { PPMSButton } from "../../ui-kit/components/common/PPMS-button";
import { formatLotNumber } from "../sales/management-pbs-doi/lot-details/property/common/constants/Utils";
import { PageHelper, Paths } from "../Router";
interface Props {
  match: any;
  actions?: any;
}

export default function NasaItemList(props: Props) {
  let salesAPIService = new SalesApiService();

  const [filteredItems, setFilteredItems] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState<Array<number>>([
    10,
    20,
    30,
    40,
    50,
  ]);
  const [salesNumber, setSalesNumber] = useState<String>("");
  const [lotNumber, setLotNumber] = useState<String>("");
  const [lotName, setLotName] = useState<String>("");

  useEffect(() => {
    const data = {
      params: {
        page: 1,
        size: perPage,
      },
    };
    loadNasaItemListOnPageLoad(data);
  }, []);

  async function loadNasaItemListOnPageLoad(data) {
    let param = {
      params: {
        page: data.params.page,
        size: data.params.size,
      },
    };
    let lotId = props?.match?.params?.lotId;
    salesAPIService.getNasaItemList(param, lotId).then((response) => {
      console.log(response.data);
      let filteredRows = [];
      if (response.data.nasaSaleLotItemDTOs) {
        for (let property of response.data.nasaSaleLotItemDTOs) {
          let row = {
            icn: property.icn,
            itemName: property.itemName,
            itemDescription: property.itemDescription,
            fscCode: property.fscCode,
            manufacturer: property?.manufacturer,
            model: property?.model,
            serialNumber: property?.serialNumber,
            qty: property.qty + " " + property.unitOfIssue + ".",
            unitOfIssue: property.unitOfIssue,
            conditionCode: property.conditionCode,
            eccn: property.eccn,
            itarCode: property.itarCode,
          };
          filteredRows.push(row);
        }
      }
      let totalElements =
        response && response.data && response.data.totalElements
          ? response.data.totalElements
          : 0;

      setSalesNumber(response.data?.salesNumber);
      setLotNumber(response.data?.lotNumber);
      setLotName(response.data?.lotName);
      setFilteredItems(filteredRows);
      setTotalRows(totalElements);
      setTotalPages(response.data.totalPages);
      setLoading(false);
      setCurrentPage(data.params.page);
      setPerPage(data.params.size);
    });
  }

  async function handleChange(perPage, page) {
    let param = {
      params: {
        page: page,
        size: perPage,
      },
    };
    loadNasaItemListOnPageLoad(param);
    setCurrentPage(param.params.page);
    setPerPage(param.params.size);
  }

  function formatDescription(text: any) {
    let removedTags = text.replace(/(<([^>]+)>)/gi, "");
    if (removedTags.length <= 200)
      return (
        <>
          <div className="property-description">{removedTags}</div>
        </>
      );
    else {
      return (
        <>
          <div className="property-description">
            {removedTags.substring(0, 200) + "..."}
          </div>
          <div className="hide">{removedTags}</div>
        </>
      );
    }
  }
  let columns = [
    {
      Header: "Report No",
      accessor: "icn",
      Cell: (props) => <div>{formatICN(props.value)}</div>,
      disableSortBy: true,
    },
    {
      Header: "Item Name",
      accessor: "itemName",
      disableSortBy: true,
    },
    {
      Header: "Item Description",
      accessor: "itemDescription",
      disableSortBy: true,
      width: 400,
      Cell: (props) => <div>{formatDescription(props.value)}</div>,
    },
    {
      Header: "FSC Code",
      accessor: "fscCode",
      disableSortBy: true,
    },
    {
      Header: "Manufacturer",
      accessor: "manufacturer",
      disableSortBy: true,
    },
    {
      Header: "Model",
      accessor: "model",
      disableSortBy: true,
    },
    {
      Header: "Serial Number",
      accessor: "serialNumber",
      disableSortBy: true,
    },
    {
      Header: "Quantity",
      accessor: "qty",
      disableSortBy: true,
    },
    {
      Header: "Condition Code",
      accessor: "conditionCode",
      disableSortBy: true,
    },
    {
      Header: "ECCN",
      accessor: "eccn",
      disableSortBy: true,
    },
    {
      Header: "ITAR Code",
      accessor: "itarCode",
      disableSortBy: true,
    },
  ];
  return (
    <>
      <div className="ui-ppms">
        <PPMSDatatable
          title={"NASA ADDITIONAL INFORMATION"}
          data={filteredItems}
          columns={columns}
          defaultSortField={"itemControlNumber"}
          loading={loading}
          serverSort={true}
          rowsPerPageOptions={rowsPerPageOptions}
          totalRows={totalRows}
          totalPages={totalPages}
          rowsPerPage={perPage}
          isPaginationEnabled={true}
          onChange={handleChange}
          showFilters={false}
          currentPage={currentPage - 1}
          subHeaderComponent={
            <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
              <PPMSCard>
                <PPMSCardBody className="nasa-additional-information">
                  <div className={"grid-row grid-gap"}>
                    <div className="tablet:grid-col">
                      <div className="tablet:grid-row">
                        Sale Number/Lot #:{" "}
                        {formatSaleNumber(salesNumber) +
                          "/" +
                          formatLotNumber(lotNumber, 3)}
                      </div>
                    </div>
                    <div className="tablet:grid-col">
                      <div className="tablet:grid-row">Lot Name: {lotName}</div>
                    </div>
                  </div>
                </PPMSCardBody>
              </PPMSCard>
            </PPMSCardGroup>
          }
          bulkActions={
            <>
              <br />
              <PPMSButton
                variant={"primary"}
                type={"button"}
                value={"backToAuctionView"}
                label={"Back to Auction View"}
                className={"create-property out-button"}
                onPress={() => {
                  PageHelper.openPage(
                    Paths.previewAuctions + "/" + props?.match?.params?.lotId
                  );
                }}
                id={"back-to-auction-view"}
              />
            </>
          }
          hideBulkActionsTitle={true}
        />
      </div>
    </>
  );
}
