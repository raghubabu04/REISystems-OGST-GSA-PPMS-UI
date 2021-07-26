import * as React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../../_redux/_actions/toast.actions";
import { useContext, useEffect } from "react";
import { SaleDetailsCreateContext } from "./CreateUpdateContext";
import { PPMSAccordion } from "../../../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { PPMSButton } from "../../../../../../ui-kit/components/common/PPMS-button";
import Auction from "../common/components/Auction";
import Bid from "../common/components/Bid";
import OpenHouse from "../common/components/OpenHouse";
import { commonActions } from "../../../../../../_redux/_actions/common.actions";
import {
  checkValidation,
  generateValidRequest,
  saleDetailUpdate,
  saleDetailValidate,
  validity,
} from "../common/constants/Utils";
import { SalesApiService } from "../../../../../../api-kit/sales/sales-api-service";
import { updateStateValues } from "../common/constants/Utils";
import { resetState } from "../common/constants/Constants";

interface CreateProps {
  actions?: any;
  location?: any;
  saleId: number;
  saleNumber: string;
  lotId: number;
  lotInformation: any;
  updateLotInformation: any;
  holiday?: any;
  getHolidays?: any;
  roles?: any;
  lotStatus?: string;
  saleMethod?: string;
}

const CreateUpdate = (props: CreateProps) => {
  const {
    saleId,
    saleNumber,
    lotId,
    lotInformation,
    holiday,
    getHolidays,
    updateLotInformation,
    roles,
    lotStatus,
    saleMethod,
  } = props;
  const { addToast } = props.actions;
  const { createSaleDetailsState, updateCreateSaleDetailsState } = useContext(
    SaleDetailsCreateContext
  );
  let salesAPIService = new SalesApiService();
  useEffect(() => {
    let state = resetState();
    state.sales.saleId = saleId;
    state.sales.saleNumber = saleNumber;
    state.sales.saleMethod = saleMethod;
    state.lot.data.lotId = lotId;
    state.lot.data.lotNumber = lotInformation?.lotNumber;
    if (roles?.isCOI || lotStatus === "Closed") {
      state.other.fieldDisabled = true;
      state.auctionDetail.validation.startTime.isDisabled = true;
      state.auctionDetail.validation.startDate.isDisabled = true;
      state.auctionDetail.validation.endDate.isDisabled = true;
      state.auctionDetail.validation.endTime.isDisabled = true;
      state.bidDetail.validation.bidDepositAmount.isDisabled = true;
      state.bidDetail.validation.reserveAmount.isDisabled = true;
      state.bidDetail.validation.bidIncrement.isDisabled = true;
      state.bidDetail.validation.inactivityPeriod.isDisabled = true;
      state.bidDetail.validation.startingBid.isDisabled = true;
      state.openHouseDetail.validation.fromDate.isDisabled = true;
      state.openHouseDetail.validation.fromTime.isDisabled = true;
      state.openHouseDetail.validation.toDate.isDisabled = true;
      state.openHouseDetail.validation.toTime.isDisabled = true;
      state.other.saveDisabled = true;
    } else if (lotStatus === "Preview") {
      state.other.fieldDisabled = true;
    } else if (lotStatus === "Active") {
      state.other.fieldDisabled = true;
      state.auctionDetail.validation.startTime.isDisabled = true;
      state.auctionDetail.validation.startDate.isDisabled = true;
      state.bidDetail.validation.startingBid.isDisabled = true;
    }
    updateCreateSaleDetailsState(state);
    updateStateValues(state, lotInformation);
  }, [lotInformation]);

const updateSaleDetail = (type, value) => {
    let state = createSaleDetailsState;
    updateCreateSaleDetailsState(saleDetailUpdate(type, value, state));
  };

  const validateSaleDetail = (type, value) => {
    let state = createSaleDetailsState;
    updateCreateSaleDetailsState(saleDetailValidate(type, value, state));
  };

  const getHolidaysByYear = (year) => {
    if (year !== holiday?.year) {
      getHolidays(year);
    }
  };

  const submitProperty = () => {
    let state = checkValidation(createSaleDetailsState);
    state.other.saveDisabled = true;
    updateCreateSaleDetailsState(state);
    let validation = validity(state);
    if (validation.valid) {
      let body = generateValidRequest(state);
      salesAPIService
        .saveLotProperty(body)
        .then((response) => {
          updateLotInformation();
          addToast({
            text: `Sale Details for Lot ${
              response?.data?.lotNumber.length === 1
                ? `00${response?.data?.lotNumber}`
                : response?.data?.lotNumber.length === 2
                ? `0${response?.data?.lotNumber}`
                : `${response?.data?.lotNumber}`
            } Updated Successfully.`,
            type: "success",
            heading: "Success",
          });
        })
        .catch((error) => {
          console.error(error);
          addToast({
            text: `Error Submitting Request.`,
            type: "error",
            heading: "Error",
          });
        })
        .finally(() => {
          let state = createSaleDetailsState;
          state.other.saveDisabled = false;
          updateCreateSaleDetailsState(state);
        });
    } else {
      addToast({
        text: `${validation.invalidMessage}`,
        type: "error",
        heading: "Error",
      });
      let state = createSaleDetailsState;
      state.other.saveDisabled = false;
      updateCreateSaleDetailsState(state);
    }
  };
  return (
    <>
      <div className={"grid-row"}>
        <div className={"grid-col-12"}>
          <PPMSAccordion
            items={[
              {
                title: "Auction Details",
                content: (
                  <Auction
                    auctionDetail={createSaleDetailsState.auctionDetail}
                    holiday={holiday}
                    updateAuctionDetail={updateSaleDetail}
                    validateAuctionDetail={validateSaleDetail}
                    getHolidaysByYear={getHolidaysByYear}
                    fieldDisabled={createSaleDetailsState.other.fieldDisabled}
                    saleInformation={createSaleDetailsState.sales}
                  />
                ),
                expanded: true,
                id: "auction-details-id",
                className: "auction-details",
              },
              {
                title: "Bid Details",
                content: (
                  <Bid
                    bidDetail={createSaleDetailsState.bidDetail}
                    updateBidDetail={updateSaleDetail}
                    validateBidDetail={validateSaleDetail}
                    fieldDisabled={createSaleDetailsState.other.fieldDisabled}
                  />
                ),
                expanded: true,
                id: "bid-details-id",
                className: "bid-details",
              },
              {
                title: `${
                  createSaleDetailsState?.sales?.saleNumber?.substr(0, 1) !==
                  "N"
                    ? "Open House Details"
                    : "Inspection Details"
                }`,
                content: (
                  <OpenHouse
                    getHolidaysByYear={getHolidaysByYear}
                    openHouseDetail={createSaleDetailsState.openHouseDetail}
                    updateOpenHouseDetail={updateSaleDetail}
                    validateOpenHouseDetail={validateSaleDetail}
                    fieldDisabled={createSaleDetailsState.other.fieldDisabled}
                    auctionDetail={createSaleDetailsState.auctionDetail}
                  />
                ),
                expanded: true,
                id: "open-house-details-id",
                className: "open-house-details",
              },
            ]}
          />
        </div>
        <br />
      </div>
      <div className="grid-row grid-gap-2">
        <div className="grid-col">
          <div className={"grid-row grid-gap-3"}>
            <div className={"grid-col-1"}>
              <PPMSButton
                id={"save-property"}
                label={"Save"}
                type={"button"}
                className={"primary"}
                onPress={submitProperty}
                isDisabled={createSaleDetailsState.other.saveDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
    getHolidays: (year) => {
      dispatch(commonActions.getHolidays(year));
    },
  };
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
  holiday: state.common.holiday,
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateUpdate);
