import React, {useContext, useEffect} from "react";
import {SalesUserContext} from "../SalesUserContext";
import PPMSDatatable from "../../../../ui-kit/components/common/datatable/PPMS-datatable";
import {PPMSSelect} from "../../../../ui-kit/components/common/select/PPMS-select";
import {PPMSInput} from "../../../../ui-kit/components/common/input/PPMS-input";
import {PPMSButton} from "../../../../ui-kit/components/common/PPMS-button";
import {isFormSubmitted} from "../../../../service/validation.service";
import {MdDelete} from "react-icons/md";
import {CommonApiService} from "../../../../api-kit/common/common-api.service";
import { UserUtils } from "../../../../utils/UserUtils";
import { zipObject } from "lodash";

interface SalesUserZoneProps {
}

const ALL_ZONES = [1, 2, 3, 4, 5, 6];
const ALL_REGIONS = [
  ["1", "2", "3"],
  ["4", "5"],
  ["6", "7", "8"],
  ["10a", "9"],
  [],
  ["W"],
];

export default function SalesUserZone(props: SalesUserZoneProps) {
  const {
    salesUserZoneState,
    updateSalesUserZoneState,
    salesUserTypeState,
  } = useContext(SalesUserContext);

  const commonApiService = new CommonApiService();
  const userRoles = UserUtils.getUserRoles();
  const RadioBtn = ({ zone, onChange }) => (
    <input
      id={zone.cell.row.original.zoneCode}
      onClick={onChange}
      checked={
        !!zone.data.find(
          (data) =>
            data.isZoneDefault === true &&
            data.zoneCode === zone.cell.row.original.zoneCode
        )
      }
      type="radio"
    />
  );

  const zoneColumns = [
    {
      Header: "Default",
      id: "isZoneDefault",
      Cell: (zone) => (
        <RadioBtn zone={zone} onChange={() => handleDefaultZone(zone)} />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      Header: "Zone Name",
      accessor: "zoneName",
    },
    {
      Header: "Regions",
      accessor: "regions",
    },
    {
      Header: "Delete Zone",
      id: "delete-zone",
      Cell: (zone) => (
        <PPMSButton
          id={"delete-zone"}
          variant={"danger"}
          label={"Delete"}
          size={"sm"}
          icon={<MdDelete />}
          onPress={async () => {
            const addedZonesList = [...salesUserZoneState.addedZonesList];
            const zoneIndex = addedZonesList.findIndex(
              (z) => z.zoneCode === zone.row.original.zoneCode
            );
            const wasDefault = addedZonesList.find(
              (z) => z.zoneCode === zone.row.original.zoneCode
            ).isZoneDefault;
            addedZonesList.splice(zoneIndex, 1);
            if (wasDefault && addedZonesList.length > 0 )
              addedZonesList[0].isZoneDefault = true && !(userRoles?.includes("FIA"));
            updateSalesUserZoneState({
              addedZonesList: addedZonesList,
              isAddDisabled: false,
              isAddAllDisabled: false,
            });
          }}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      grow: 2,
    },
  ];

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validate();
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [salesUserZoneState]);

   
  return (
    <React.Fragment>
      <div className="usa-accordion--bordered desktop:grid-col-12">
        <div className="short-table">
          <PPMSDatatable
            title={"Added Zones"}
            data={salesUserZoneState.addedZonesList}
            columns={zoneColumns.filter(zc =>!(userRoles?.includes("FIA") && (zc.id=='isZoneDefault')))}
            defaultSortField={"zoneName"}
            isPaginationEnabled={false}
            loading={false}
            totalRows={salesUserZoneState.addedZonesList.length}
            handleSort={() => {}}
          />
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-4"}>
            <PPMSSelect
              id={"select-zone"}
              title={"select-zones"}
              placeholderValue={"Select Zone"}
              label={"Zone"}
              identifierKey={"zoneId"}
              identifierValue={"zoneName"}
              values={salesUserZoneState.zoneList}
              isRequired={true}
              isInvalid={salesUserZoneState.isZoneEmpty}
              validationMessage={salesUserZoneState.validationMessage}
              onChange={(event) => handleChange(event.target)}
            />
          </div>
          <div className={"grid-col-8"}>
            <PPMSInput
              isDisabled={true}
              id={"regions"}
              name={"regions"}
              inputType={"text"}
              label={"Regions"}
              isRequired={true}
              value={salesUserZoneState.zoneRegions.toString().split(',').map(s => s.split('-')[0]).join()}
              minLength={0}
              maxLength={5}
            />
          </div>
        </div>
        <br />
        <PPMSButton
          id={"add-zone"}
          label={"Add"}
          type={"button"}
          variant={"primary"}
          isDisabled={salesUserZoneState.isAddDisabled}
          onPress={handleAddZone}
        />
        <PPMSButton
          id={"add-all-zones"}
          label={"Add All Zones"}
          type={"button"}
          variant={"primary"}
          isDisabled={
            salesUserZoneState.isAddAllDisabled ||
            salesUserZoneState.addedZonesList.length === 6
          }
          onPress={handleAddAllZones}
        />
      </div>
    </React.Fragment>
  );

  function handleChange(target) {
    if (target.value === "" || target.value === 0)
      updateSalesUserZoneState({
        zoneRegions: [],
        isZoneEmpty: true,
        validationMessage: "Please select a zone.",
      });
    else {
      updateSalesUserZoneState({ isAddDisabled: false });
      let zoneRegions = [];
      commonApiService
        .getZoneRegions(target.value)
        .then((response: any) => {
          response?.data.forEach((region) => {
            zoneRegions.push(region.regionCode);
          });
          updateSalesUserZoneState({
            selectedZone: target.value,
            zoneRegions: zoneRegions,
            isZoneEmpty: false,
            validationMessage: "",
          });
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }
  }

  function handleDefaultZone(zone: any) {
    const addedZoneList = [...salesUserZoneState.addedZonesList];
    addedZoneList.forEach((z) => {
      z.isZoneDefault = z.zoneCode === zone.cell.row.original.zoneCode;
    });
    updateSalesUserZoneState({ addedZonesList: addedZoneList });
  }

  function handleAddZone() {
    let addedZoneList = [...salesUserZoneState.addedZonesList];
    let isZoneAdded = addedZoneList.find(
      (z) =>
        z.zoneCode.toString() === salesUserZoneState.selectedZone.toString()
    );
    updateSalesUserZoneState({ isAddDisabled: true });
    if (salesUserZoneState.selectedZone === "")
      updateSalesUserZoneState({
        isZoneEmpty: true,
        validationMessage: "Please select a zone.",
      });
    else if (!isZoneAdded) {
      addedZoneList.push({
        zoneCode: salesUserZoneState.selectedZone,
        zoneName: salesUserZoneState.zoneList.find(
          (z) => z.zoneId.toString() === salesUserZoneState.selectedZone
        ).zoneName,
        regions: salesUserZoneState.zoneRegions.toString().split(',').map(s => s.split('-')[0]).join(),
        isZoneDefault: addedZoneList.length === 0 && !(userRoles?.includes("FIA")),
      });
      updateSalesUserZoneState({
        addedZonesList: addedZoneList,
        isZoneEmpty: false,
        validationMessage: "",
      });
    }
  }

  function handleAddAllZones() {
    let addedZoneList = [...salesUserZoneState.addedZonesList];
    updateSalesUserZoneState({ isAddDisabled: true, isAddAllDisabled: true });
    console.log("addedZoneList",addedZoneList);
    //salesUserZoneState.zoneList
    salesUserZoneState.zoneList.forEach((zone) => {
      //console.log("salesUserTypeState.userType === zone.zoneGroup",salesUserTypeState.userType === zone.zoneGroup);
      //if (salesUserTypeState.userType === zone.zoneGroup) {
        if (
          !addedZoneList.find(
            (zl) => zl.zoneCode.toString() === zone.zoneId.toString()
          )
        ) {
          commonApiService
            .getZoneRegions(zone.zoneId)
            .then((response: any) => {
              let zoneRegions = [];
              response?.data.forEach((region) => {
                zoneRegions.push(region.regionCode);
              });
              addedZoneList.push({
                zoneCode: zone.zoneId,
                zoneName: zone.zoneName,
                regions: zoneRegions.join(),
                isZoneDefault: addedZoneList.length === 0 && !(userRoles?.includes("FIA")),
              });
              updateSalesUserZoneState({
                addedZonesList: addedZoneList,
                isZoneEmpty: false,
                validationMessage: "",
              });
            })
            .catch((error) => {
              console.log(error);
              return error;
            });
        }
      //}
    });
  }

  function validate() {
    if (salesUserZoneState.addedZonesList.length === 0)
      updateSalesUserZoneState({
        isZoneEmpty: true,
        validationMessage: "At least one zone is required.",
      });
  }
}
