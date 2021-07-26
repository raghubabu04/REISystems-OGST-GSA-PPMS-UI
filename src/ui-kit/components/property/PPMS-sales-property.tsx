import React from "react";
import { Link } from "react-router-dom";
import placeholderImage from "../../../assets/images/placeholder-img.jpg";
import PPMSCardHeader from "../common/card/PPMS-card-header";
import PPMSCardMedia from "../common/card/PPMS-card-media";
import PPMSCardBody from "../common/card/PPMS-card-body";
import PPMSCard from "../common/card/PPMS-card";
import PPMSCardGroup from "../common/card/PPMS-card-group";
import { Paths } from "../../../app/Router";
import { PageUtils } from "../../../utils/PageUtils";
import { data } from "../data/constants";

interface PPMSSalesPropertyProps {
  salesAttribute?: string;
  propertyId?: string;
  icn?: any;
  itemName?: string;
  itemStatus?: string;
  itemReportedDate?: string;
  gsaAssignedUserEmail?: string;
  gsaAssignedUserFirstName?: string;
  gsaAssignedUserLastName?: string;
  fsc?: string;
  vin?: string;
  zone?: string;
  zoneName?: string;
  awardAmount?: string;
  contractNumber?: string;
  contractStatus?: string;
  lotICN?: string;
  lotName?: string;
  lotNumber?: string;
  saleNumber?: string;
  saleStartDate?: string;
  saleStatus?: string;
  salesContractingOfficer?: string;
  lotVIN?: string;
  thumb_image?: string;
  noCardHeader?: boolean;
  noCardMedia?: boolean;
  noCardFooter?: boolean;
  bidderUserName?: string;
  bidderName?: string;
  bidderEmail?: string;
  bidderNumber?: string;
  bidderStatus?: string;
}
interface PPMSSalesPropertyState {}

export class PPMSSalesProperty extends React.Component<
  PPMSSalesPropertyProps,
  PPMSSalesPropertyState
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);
    return (
      <>
        <PPMSCardGroup className={"ppms-card-group icn-card"}>
          <PPMSCard noHeaderSalesLayout={true} layout="flagDefault">
            {!this.props.noCardHeader && (
              <PPMSCardHeader
                className={`${this.props.noCardMedia ? "usa-body-wide " : ""} `}
              >
                {this.props.salesAttribute === "Item" && (
                  <>
                    <h3>
                      ICN:&nbsp;
                      <Link
                        to={{
                          pathname: `${Paths.viewProperty}/${this.props.icn}`,
                          state: { fromAllocationPage: true },
                        }}
                      >
                        {this.props.icn !== undefined
                          ? this.props.icn.length <= 14
                            ? this.props.icn.replace(
                                /(.{6})(.{4})(.{4})/,
                                "$1-$2-$3"
                              )
                            : this.props.icn.replace(
                                /(.{6})(.{4})(.{4})(.+)/,
                                "$1-$2-$3-$4"
                              )
                          : ""}
                      </Link>
                    </h3>
                    <div className={"grid-row grip-gap-2 usa-card-header"}>
                      <div className={"item-name"}>
                        {this.props.itemName !== null
                          ? "Item Name: " + this.props.itemName
                          : "Item Name: --"}
                      </div>
                      <div className={"item-name ml-auto"}>
                        {this.props.itemStatus !== null
                          ? "Item Status: " + this.props.itemStatus
                          : "Item Status: --"}
                      </div>
                    </div>
                  </>
                )}

                {(this.props.salesAttribute === "Sale" ||
                  this.props.salesAttribute === "Contract") && (
                  <>
                    <h3>
                      Sales #:&nbsp;
                      <Link
                        to={{
                          pathname: `${Paths.salesTransaction}/${this.props.saleNumber}`,
                          state: { fromAllocationPage: true },
                        }}
                      >
                        {this.props.saleNumber !== null
                          ? this.props?.saleNumber?.replace(
                              /(.{1})(.{1})(.{3})(.{1})(.{2})(.{3})/,
                              "$1-$2-$3-$4-$5-$6"
                            )
                          : "--"}
                      </Link>
                    </h3>
                    <div className={"grid-row grip-gap-2 usa-card-header"}>
                      <div className={"item-name ml-auto"}>
                        {this.props.saleStatus !== null
                          ? "Sales Status: " + this.props.saleStatus
                          : "Sales Status: --"}
                      </div>
                    </div>
                  </>
                )}

                {this.props.salesAttribute === "Bidder" && (
                  <>
                    <h3>
                      Bidder Username:&nbsp;
                      <Link
                        to={{
                          pathname: `${Paths.viewBidder}/${this.props.bidderUserName}`,
                          state: { fromAllocationPage: true },
                        }}
                      >
                        {this.props.bidderUserName}
                      </Link>
                    </h3>
                    <div className={"grid-row grip-gap-2 usa-card-header"}>
                      <div className={"item-name ml-auto"}>
                        {this.props.bidderStatus !== null
                          ? "Bidder Status: " + this.props.bidderStatus
                          : "Bidder Status: --"}
                      </div>
                    </div>
                  </>
                )}
              </PPMSCardHeader>
            )}

            {!this.props.noCardMedia && (
              <PPMSCardMedia>
                <img
                  src={
                    this.props.thumb_image
                      ? this.props.thumb_image
                      : placeholderImage
                  }
                  alt="A placeholder"
                />
              </PPMSCardMedia>
            )}
            {(this.props.salesAttribute === "Sale" ||
              this.props.salesAttribute === "Contract") && (
              <PPMSCardBody
                className={this.props.noCardMedia ? "usa-body-wide" : ""}
              >
                <>
                  <div className={"grid-row tablet:grid-gap-3"}>
                    <ul
                      className={
                        "usa-list usa-list-icn-card ui-shade usa-list-lot-icn-card"
                      }
                    >
                      <li>
                        <span>Lot #</span>
                        {this.props.saleNumber !== null
                          ? this.props.saleNumber?.substr(8, 11)
                          : "--"}
                      </li>
                      <li>
                        <span>Lot Name</span>
                        {this.props.lotName !== null
                          ? this.props.lotName
                          : "--"}
                      </li>
                      {this.props.lotVIN && (
                        <li>
                          <span>VIN</span>
                          {this.props.lotVIN}
                        </li>
                      )}
                      <li>
                        <span>SCO</span>
                        {this.props.salesContractingOfficer !== null
                          ? this.props.salesContractingOfficer
                          : "--"}
                      </li>
                      <li>
                        <span>Sales Start Date</span>
                        {this.props.saleStartDate !== null
                          ? this.props.saleStartDate
                          : "--"}
                      </li>
                    </ul>
                  </div>
                  <div className="grid-row tablet:grid-gap-3">
                    <ul
                      className={
                        "usa-list usa-list-icn-card usa-list-lot-icn-card"
                      }
                    >
                      <li>
                        <span>Contract #</span>
                        <Link
                          to={
                            Paths.contractTransaction +
                            `/${this.props.saleNumber}/${this.props.saleNumber}?contractNumber=${this.props.contractNumber}`
                          }
                        >
                          {this.props.contractNumber !== null
                            ? this.props.contractNumber
                            : "--"}
                        </Link>
                      </li>
                      <li>
                        <span>Contract Status</span>
                        {this.props.contractStatus !== null
                          ? this.props.contractStatus
                          : "--"}
                      </li>

                      {this.props.bidderUserName && (
                        <li>
                          <span>Bidder Username</span>
                          <Link
                            to={{
                              pathname: `${Paths.viewBidder}/${this.props.bidderUserName}`,
                              state: { fromAllocationPage: true },
                            }}
                          >
                            {this.props.bidderUserName}
                          </Link>
                        </li>
                      )}

                      {this.props.awardAmount !== "null" && (
                        <li>
                          <span>Award Amount</span>
                          {this.props.awardAmount !== "null"
                            ? PageUtils.getFormattedCurrency(
                                this.props.awardAmount
                              )
                            : "--"}
                        </li>
                      )}

                      <li>
                        <Link
                          to={
                            Paths.contractTransaction +
                            `/${this.props.saleNumber}/${this.props.saleNumber}?contractNumber=${this.props.contractNumber}`
                          }
                        >
                          Contract History
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {!this.props.noCardFooter && (
                    <div className="grid-row tablet:grid-gap-3">
                      <div className="grid-col-3 margin-top-7"></div>
                    </div>
                  )}
                </>
              </PPMSCardBody>
            )}

            {this.props.salesAttribute === "Item" && (
              <PPMSCardBody
                className={this.props.noCardMedia ? "usa-body-wide" : ""}
              >
                <>
                  <div className={"grid-row tablet:grid-gap-3"}>
                    <ul
                      className={`${
                        this.props.noCardMedia ? "usa-list-sales-icn-card" : ""
                      } usa-list usa-list-icn-card ui-shade`}
                    >
                      <li>
                        <span>
                          <strong>Item Reported Date </strong>
                        </span>
                        {this.props.itemReportedDate !== null
                          ? this.props.itemReportedDate
                          : "--"}
                      </li>
                      <li>
                        <span>
                          <strong>Federal Supply Class </strong>
                        </span>
                        {this.props.fsc !== null ? this.props.fsc : "--"}
                      </li>
                      {this.props.vin && (
                        <li>
                          <span>
                            <strong>VIN</strong>{" "}
                          </span>
                          {this.props.vin}
                        </li>
                      )}
                      <li>
                        <span>
                          <strong>Zone Assigned</strong>
                        </span>
                        {this.props.zoneName !== null
                          ? this.props.zoneName
                          : "--"}
                      </li>
                      <li>
                        <span>
                          <strong>GSA Assigned User</strong>
                        </span>
                        {this.props.gsaAssignedUserFirstName +
                          " " +
                          this.props.gsaAssignedUserLastName}
                      </li>
                    </ul>
                  </div>
                  <div className="grid-row tablet:grid-gap-3">
                    <ul
                      className={
                        "usa-list usa-list-icn-card usa-list-sales-icn-card"
                      }
                    >
                      <li>
                        <span>
                          <strong>Sale #</strong>
                        </span>
                        <Link
                          to={{
                            pathname: `${Paths.salesTransaction}/${this.props.icn}`,
                            state: { fromAllocationPage: true },
                          }}
                        >
                          {this.props.saleNumber !== null
                            ? this.props.saleNumber
                            : "--"}
                        </Link>
                      </li>
                      <li>
                        <span>
                          <strong>Lot #</strong>
                        </span>
                        {this.props.saleNumber !== null
                          ? this.props.saleNumber?.substr(8, 11)
                          : "--"}
                      </li>
                      <li>
                        <span>
                          <strong>Contract #</strong>
                        </span>
                        <Link
                          to={
                            Paths.contractTransaction +
                            `/${this.props.saleNumber}/${this.props.saleNumber}?contractNumber=${this.props.contractNumber}`
                          }
                        >
                          {this.props.contractNumber !== null
                            ? this.props.contractNumber
                            : "--"}
                        </Link>
                      </li>

                      {this.props.awardAmount !== "null" && (
                        <li>
                          <span>
                            <strong>Award Amount</strong>
                          </span>
                          {this.props.awardAmount !== "null"
                            ? PageUtils.getFormattedCurrency(
                                this.props.awardAmount
                              )
                            : "--"}
                        </li>
                      )}

                      {this.props.bidderUserName && (
                        <li>
                          <span>
                            <strong>Bidder Username</strong>
                          </span>
                          <Link
                            to={{
                              pathname: `${Paths.viewBidder}/${this.props.bidderUserName}`,
                              state: { fromAllocationPage: true },
                            }}
                          >
                            {this.props.bidderUserName}
                          </Link>
                        </li>
                      )}

                      <li>
                        <span>
                          <strong>Sales Contracting Officer</strong>
                        </span>
                        {this.props.salesContractingOfficer !== null
                          ? this.props.salesContractingOfficer
                          : "--"}
                      </li>
                    </ul>
                  </div>
                  {!this.props.noCardFooter && (
                    <div className="grid-row tablet:grid-gap-3">
                      <div className="grid-col-3 margin-top-7"></div>
                    </div>
                  )}
                </>
              </PPMSCardBody>
            )}

            {this.props.salesAttribute === "Bidder" && (
              <PPMSCardBody
                className={this.props.noCardMedia ? "usa-body-wide" : ""}
              >
                <>
                  <div className="grid-row tablet:grid-gap-4">
                    <ul
                      className={
                        "usa-list usa-list-icn-card usa-list-bidder-card"
                      }
                    >
                      <li>
                        <span>
                          <strong>Bidder Name:</strong>
                        </span>
                        {this.props.bidderName !== null
                          ? this.props.bidderName
                          : "--"}
                      </li>
                      <li>
                        <span>
                          <strong>Bidder Email:</strong>
                        </span>
                        {this.props.bidderEmail !== null
                          ? this.props.bidderEmail
                          : "--"}
                      </li>
                      <li>
                        <span>
                          <strong>Bidder Number:</strong>
                        </span>
                        {this.props.bidderNumber !== null
                          ? this.props.bidderNumber
                          : "N/A"}
                      </li>
                    </ul>
                  </div>
                  {!this.props.noCardFooter && (
                    <div className="grid-row tablet:grid-gap-3">
                      <div className="grid-col-3 margin-top-7"></div>
                    </div>
                  )}
                </>
              </PPMSCardBody>
            )}
          </PPMSCard>
        </PPMSCardGroup>
      </>
    );
  }
}
