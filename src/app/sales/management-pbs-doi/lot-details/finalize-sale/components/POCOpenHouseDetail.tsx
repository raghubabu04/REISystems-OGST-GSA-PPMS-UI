import React from "react";
import { formatPhone } from "../../../../../../ui-kit/utilities/FormatUtil";
import moment from "moment";

interface PocOpenHouseDetailProps {
  lotInformation: any;
  sellingAgency: string;
}

const POCOpenHouseDetail = (props: PocOpenHouseDetailProps) => {
  const { lotInformation, sellingAgency } = props;
  let info = lotInformation?.pointOfContactDTO;
  let address = lotInformation?.propertyLocationDTO;
  let openHouse = lotInformation?.openHouseDTO;
  let dateResponseFormat = "YYYY-MM-DDTHH:mm";
  let dateUIFormat = "MM/DD/YYYY";
  let timeUIFormat = "hh:mm";
  let meridianUIFormat = "A";
  let dateFrom = moment(openHouse?.openHouseFromDate, dateResponseFormat);
  let dateTo = moment(openHouse?.openHouseToDate, dateResponseFormat);
  let openHouseInspectionValue =
    sellingAgency === "PBS" ? "Open House" : "Inspection";
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-6"}>
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <h3 className={"lot-review-h2"}>Property POC and Location</h3>
            </div>
          </div>
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              {info?.firstName} {info?.lastName} |{" "}
              <span className={"custodian"}>
                {address?.city && address?.city?.trim() !== ""
                  ? `${address?.city.toLowerCase()}, `
                  : ""}
                {address?.state && address?.state?.trim() !== ""
                  ? address?.state
                  : ""}{" "}
                {address?.zipCode && address?.zipCode?.trim() !== ""
                  ? address?.zipCode
                  : ""}{" "}
                {address?.zipExtn && address?.zipExtn?.trim() !== ""
                  ? `-${address?.zipExtn}`
                  : ""}{" "}
              </span>
            </div>
          </div>
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              {info?.email ? `${info?.email},` : ""}{" "}
              {info?.phone ? formatPhone(`${info?.phone}`) : ""}{" "}
              {info?.phoneExtension ? info.phoneExtension : ""}
            </div>
          </div>
        </div>
        <div className={"grid-col-6"}>
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <h3 className={"lot-review-h2"}>
                {openHouseInspectionValue} Date and Time
              </h3>
            </div>
          </div>
          <div className={"grid-row"}>
            <div className={"grid-col-6"}>
              <div className={"grid-row"}>
                <div className={"grid-col-12"}>
                  <strong>{openHouseInspectionValue} From</strong>
                </div>
              </div>
              <div className={"grid-row"}>
                <div className={"grid-col-12"}>
                  {dateFrom.isValid()
                    ? `${moment(dateFrom.toDate()).format(
                        dateUIFormat
                      )} ${moment(dateFrom.toDate()).format(
                        timeUIFormat
                      )}${moment(dateFrom.toDate()).format(meridianUIFormat)}`
                    : ""}
                </div>
              </div>
            </div>
            <div className={"grid-col-6"}>
              <div className={"grid-row"}>
                <div className={"grid-col-12"}>
                  <strong>{openHouseInspectionValue} To</strong>
                </div>
              </div>
              <div className={"grid-row"}>
                <div className={"grid-col-12"}>
                  {dateTo.isValid()
                    ? `${moment(dateTo.toDate()).format(dateUIFormat)} ${moment(
                        dateTo.toDate()
                      ).format(timeUIFormat)}${moment(dateTo.toDate()).format(
                        meridianUIFormat
                      )}`
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-12"}>
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <h3 className={"lot-review-h2"}>Additional Instructions</h3>
            </div>
          </div>
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <p>{openHouse?.additionalInstructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default POCOpenHouseDetail;
