import React, { ReactElement, StrictMode, useMemo, useState } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { addToast } from "../../../../../_redux/_actions/toast.actions";

import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import LotAuctionList from "../list/LotAuctionList";
import TerminateAuctionModal from "./TerminateAuctionModal";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { LotTerminationDTO } from "../Constants";
import IndeterminateCheckbox from "../../../../../ui-kit/components/common/datatable/IndeterminateCheckbox";

interface TerminateAuctionProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  sale?: any;
  saleNumber?: any;
  roles: any;
}

const TerminateAuction = (props: TerminateAuctionProps) => {
  const salesApiService = new SalesApiService();

  const { addToast } = props.actions;

  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  const [refresh, setRefresh] = useState(false);

  const [lotIds, setLotIds] = useState<number[]>();

  const [lotNumbers, setLotNumbers] = useState<string[]>();

  const [isAllPageRowsSelected, setIsAllPageRowsSelected] = useState(false);

  const [checkSelectedValue, setCheckSelectedValue] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const isButtonDisabled = (lotId: number) => {
    let isRowSelected: boolean = false;
    if (selectedRowIds.length > 0) {
      isRowSelected = selectedRowIds.indexOf(lotId) > -1;
    }
    return !isRowSelected;
  };

  const renderActionButtons = (row: any) => {
    return (
      <PPMSButton
        variant={"secondary"}
        label={"Terminate"}
        size={"sm"}
        onPress={() => {
          if (row.original.status !== "Void") {
            setLotIds([row.original.lotId]);
            setLotNumbers([row.original.lotNumber]);
            setShowModal(true);
          }
        }}
        isDisabled={isButtonDisabled(row.original.lotId)}
        id={`terminate-${row.original.lotId}`}
      />
    );
  };

  const renderButtons = () => {
    return (
      <PPMSButton
        id={"terminate-selected"}
        onPress={() => {
          setLotIds(selectedRowIds);
          setShowModal(true);
        }}
        label={"Terminate All Selected"}
        isDisabled={checkSelectedValue}
      />
    );
  };

  const handleTogglePageRow = (props: any, { instance, row }) => {
    let checked = false;
    if (selectedRowIds.length > 0) {
      const { manualRowSelectedKey = "isSelected" } = instance;
      checked =
        row.original && row.original[manualRowSelectedKey]
          ? true
          : row.isSelected;
    }
    return [
      props,
      {
        onChange: (e) => {
          row.toggleRowSelected(e.target.checked);
          const notTerminatedLotIds: any[] = instance.rows.filter(
            (row: any) => row.values.status !== "Void"
          );
          //even if one of the checkbox in the page is selected set "isAllPageRowsSelected" to false
          const index: number = selectedRowIds.indexOf(row.original.lotId);
          if (e.target.checked) {
            selectedRowIds.push(row.original.lotId);
          } else {
            if (index > -1) {
              selectedRowIds.splice(index, 1);
            }
          }
          setIsAllPageRowsSelected(
            selectedRowIds.length === notTerminatedLotIds.length
          );
          setCheckSelectedValue(
            selectedRowIds.length !== notTerminatedLotIds.length
          );
          setSelectedRowIds(selectedRowIds);
        },
        style: {
          cursor: "pointer",
        },
        checked,
        title: "Toggle Row Selected",
        indeterminate: row.isSomeSelected,
      },
    ];
  };

  const handleToggleAllPageRows = (props, { instance }) => [
    props,
    {
      onChange: (e: any) => {
        var checked: boolean = e.target.checked;
        let lotIds: number[] = [];
        let lotNumbers: string[] = [];
        instance.rows.forEach((row: any) => {
          if (row.values.status !== "Void") {
            row.toggleRowSelected(checked);
            if (checked) {
              lotIds.push(row.original.lotId);
              lotNumbers.push(row.original.lotNumber);
            }
          }
        });
        setLotIds(lotIds);
        setLotNumbers(lotNumbers);
        setSelectedRowIds(lotIds);
        setIsAllPageRowsSelected(checked);
        setCheckSelectedValue(lotIds.length === 0);
      },
      style: {
        cursor: "pointer",
      },
      checked: isAllPageRowsSelected,
      title: "Toggle All Current Page Rows Selected",
      indeterminate: false,
    },
  ];

  const handleTermination = async (
    terminationReason: string,
    otherReasonText: string
  ) => {
    const lotTerminationDTO: LotTerminationDTO = {
      lotIds: lotIds,
      terminationReason: terminationReason,
      otherReasonText: otherReasonText,
    };

    let response = await salesApiService.terminateSalesLot(lotTerminationDTO);

    if (response.status === 200) {
      setShowModal(false);
      setSelectedRowIds([]);
      setRefresh(true);
      setIsAllPageRowsSelected(false);
      setCheckSelectedValue(false);
      addToast({
        text: "Successfully terminated auctions",
        type: "success",
        heading: "Success",
      });
    } else {
      addToast({
        text: "Error terminated auctions",
        type: "error",
        heading: "Error",
      });
    }
  };

  const checkboxColumn =
    // Let's make a column for selection
    {
      id: "selection",
      width: "50",
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllPageRowsSelectedProps }) => (
        <div>
          <IndeterminateCheckbox
            id={"select-all-rows"}
            name={`select-all-rows`}
            {...getToggleAllPageRowsSelectedProps()}
          />
        </div>
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }) => (
        <div>
          <IndeterminateCheckbox
            id={`${row.id}-checkbox`}
            name={`${row.id}-checkbox`}
            disabled={row.values.status === "Void"}
            {...row.getToggleRowSelectedProps()}
          />
        </div>
      ),
    };

  return (
    <StrictMode>
      <LotAuctionList
        renderActionButtons={renderActionButtons}
        renderButtons={renderButtons}
        checkboxColumn={checkboxColumn}
        handleToggleAllPageRows={handleToggleAllPageRows}
        handleTogglePageRow={handleTogglePageRow}
        refresh={refresh}
        {...props}
      />
      <div className="grid-row grid-gap-4">
        <TerminateAuctionModal
          lotNumbers={lotNumbers}
          showModal={showModal}
          handleCancelTermination={() => {
            setShowModal(false);
          }}
          handleTermination={handleTermination}
        />
      </div>
    </StrictMode>
  );
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSaleInfo: (saleId, saleNumber, saleAction, zone) =>
      dispatch(saleAction.updateSaleInfo(saleId, saleNumber, saleAction, zone)),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TerminateAuction);
