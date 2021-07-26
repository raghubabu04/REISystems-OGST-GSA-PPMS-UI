import React from "react";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { PPMSPopover } from "../../../ui-kit/components/common/PPMS-popover";
import { FaInfoCircle } from "react-icons/fa";
import { RecallNotice } from "./RecallNotice";

import {
  aircraftFSCCode,
  bodyStyle,
  truckBodyStyle,
  color,
  colorGradient,
  federalSalesCenterTypes,
  fuelType,
  militaryAirCraftOnly,
  noOfCylindersOptions,
  otherMissingComponentsOptions,
  trailerBodyStyle,
  trailerFSCCode,
  transmissionType,
  vehicleFSCCode,
  vesselFSCCode,
  weaponsFSCCode,
  yesOrNoOptions,
} from "../create-update-property/constants/Constants";

import { computersFSCCode } from "../create-update-property/constants/ComputerConstants";

interface PropertyFSCSectionProps {
  propertyData: any;
}

interface PropertyFSCSectionState {
  fscOptions: any[];
}

export default class PropertyFSCSection extends React.Component<
  PropertyFSCSectionProps,
  PropertyFSCSectionState
> {
  commonApiService = new CommonApiService();

  yesNoTrueFalse = [
    { value: "Yes", id: true },
    { value: "No", id: false },
  ];

  componentDidMount() {
    this.commonApiService
      .getFSCCodes()
      .then((response: any) => {
        this.setState({
          fscOptions: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getTextForDropDownValue(id: string, list: any[]) {
    var result = list.find((obj) => {
      return obj["id"] === id;
    });
    let value = "";
    if (result) {
      value = result["value"];
    }
    return value;
  }

  getFSCLongName(id: string) {
    let value = "";
    if (this.state) {
      var result = this.state.fscOptions.find((obj) => {
        return obj["code"] === id;
      });

      if (result) {
        value = result["longName"];
      }
    }
    return value;
  }

  militrayAircraft(airCraft) {
    let toReturn = "";
    if (airCraft.isAircraftAuthorizedForSaleAndExchangeForCommUse) {
      toReturn = this.getTextForDropDownValue(
        "isAircraftAuthorizedForSaleAndExchangeForCommUse",
        militaryAirCraftOnly
      );
    } else if (airCraft.isAircraftPreviouslyUsedForInstrAndOrStaticDisp) {
      toReturn = this.getTextForDropDownValue(
        "isAircraftPreviouslyUsedForInstrAndOrStaticDisp",
        militaryAirCraftOnly
      );
    } else if (airCraft.isAircraftCombatConfAsDeterminedByDod) {
      toReturn = this.getTextForDropDownValue(
        "isAircraftCombatConfAsDeterminedByDod",
        militaryAirCraftOnly
      );
    }
    return toReturn;
  }

  render() {
    return (
      <>
        {this.props?.propertyData?.fscCode ? (
          <>
            {" "}
            <li>
              <span>
                <b>Federal Supply Class : </b>
              </span>{" "}
              {this.getFSCLongName(this.props?.propertyData?.fscCode)}{" "}
            </li>
            <br />{" "}
          </>
        ) : (
          <></>
        )}

        {this.props?.propertyData?.propertyGroup !== "foreignGift" ? (
          <>
            {this.props?.propertyData?.federalSalesCenter ? (
              <>
                {" "}
                <li>
                  <span>
                    <b>Federal Asset Sales Center : </b>
                  </span>{" "}
                  {this.getTextForDropDownValue(
                    this.props?.propertyData?.federalSalesCenter,
                    federalSalesCenterTypes
                  )}{" "}
                </li>
                <br />
              </>
            ) : (
              <></>
            )}
            {this.props?.propertyData?.niinCode ? (
              <>
                {" "}
                <li>
                  <span>
                    <b>National Item Identification Number (NIIN) : </b>
                  </span>{" "}
                  {this.props?.propertyData?.niinCode}
                </li>{" "}
                <br />
              </>
            ) : (
              <></>
            )}
            {this.props?.propertyData?.contractInventoryCode ? (
              <>
                {" "}
                <li>
                  <span>
                    <b>Contract Inventory : </b>
                  </span>{" "}
                  {this.getTextForDropDownValue(
                    this.props?.propertyData?.contractInventoryCode,
                    yesOrNoOptions
                  )}{" "}
                </li>
                <br />
              </>
            ) : (
              <></>
            )}
            {this.props?.propertyData?.overseasInventoryCode ? (
              <>
                {" "}
                <li>
                  <span>
                    <b>Overseas Inventory : </b>
                  </span>{" "}
                  {this.getTextForDropDownValue(
                    this.props?.propertyData?.overseasInventoryCode,
                    yesOrNoOptions
                  )}{" "}
                </li>
                <br />
              </>
            ) : (
              <></>
            )}

            {weaponsFSCCode.find(
              (weaponsCode) =>
                this.props?.propertyData?.fscCode === weaponsCode &&
                this.props.propertyData.propertyCreationSource !==
                  "NON_REPORT_PROP"
            ) ? (
              <>
                <li>
                  <span>
                    <b>Weapon Selection : </b>
                  </span>
                  {this.props?.propertyData?.weapon?.type}:
                  {this.props?.propertyData?.weapon?.size}:
                  {this.props?.propertyData?.make}:
                  {this.props?.propertyData?.model}
                </li>
                <br />
                <li>
                  <span>
                    <b>Serial Number : </b>
                  </span>{" "}
                  {this.props?.propertyData?.specialDescriptionCode}
                </li>
                <br />
                {this.props?.propertyData?.specialDescriptionText ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Special Description Text : </b>
                      </span>{" "}
                      {this.props?.propertyData?.specialDescriptionText}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}

            {vehicleFSCCode.find(
              (vehicleCode) =>
                this.props?.propertyData?.fscCode === vehicleCode &&
                this.props.propertyData.propertyCreationSource !==
                  "NON_REPORT_PROP"
            ) ? (
              <>
                {this.props?.propertyData?.vehicle?.transmissionType ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Transmission Type : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.vehicle?.transmissionType,
                        transmissionType
                      )}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.vehicle?.agencyClass ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Agency Class : </b>
                      </span>{" "}
                      {this.props?.propertyData?.vehicle?.agencyClass}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.vehicle?.tag ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Tag : </b>
                      </span>{" "}
                      {this.props?.propertyData?.vehicle?.tag}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.vehicle?.numberOfCylinders ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>No Of Cylinders : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.vehicle?.numberOfCylinders,
                        noOfCylindersOptions
                      )}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.vehicle?.modelYear ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Model Year : </b>
                      </span>{" "}
                      {this.props?.propertyData?.vehicle?.modelYear}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.vehicle?.fuelType ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Fuel Type : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.vehicle?.fuelType,
                        fuelType
                      )}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.vehicle?.bodyStyle ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Body Style : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.vehicle?.bodyStyle,
                        (this.props?.propertyData?.fscCode === '2320') ? truckBodyStyle: bodyStyle 
                      )}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.vehicle?.vin ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Vehicle Identification Number : </b>
                      </span>{" "}
                      {this.props?.propertyData?.vehicle?.vin}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.vehicle?.recalled ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Open Recall : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.vehicle?.recalled,
                        yesOrNoOptions
                      )}
                    </li>
                    {this.props?.propertyData?.vehicle?.recalled === "Y" ? (
                      <>
                        <PPMSPopover
                          trigger={["click"]}
                          id={"recall"}
                          placement={"right"}
                          popoverTitle={"Recall Information"}
                          popoverContent={<RecallNotice />}
                          className={""}
                          triggerSource={
                            <FaInfoCircle className={"ppms-recall-info-icon"} />
                          }
                        />
                      </>
                    ) : (
                      <></>
                    )}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.make ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Make : </b>
                      </span>{" "}
                      {this.props?.propertyData?.make}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.model ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Model : </b>
                      </span>{" "}
                      {this.props?.propertyData?.model}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.valueAddedServices ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Value Added Services : </b>
                      </span>{" "}
                      {this.props?.propertyData?.valueAddedServices === "Y"
                        ? "Yes"
                        : "No"}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.vehicle?.estimatedMileage ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Estimated Mileage : </b>
                      </span>{" "}
                      {this.props?.propertyData?.vehicle?.estimatedMileage}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.vehicle?.color ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Color : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.vehicle?.color,
                        color
                      )}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.vehicle?.colorGradient ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Color Gradient : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.vehicle?.colorGradient,
                        colorGradient
                      )}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.specialDescriptionCode ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Special Description Code : </b>
                      </span>{" "}
                      {this.props?.propertyData?.specialDescriptionCode}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.specialDescriptionText ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Special Description Text : </b>
                      </span>{" "}
                      {this.props?.propertyData?.specialDescriptionText}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}

            {vesselFSCCode.find(
              (code) =>
                this.props?.propertyData?.fscCode === code &&
                this.props.propertyData.propertyCreationSource !==
                  "NON_REPORT_PROP"
            ) ? (
              <>
                {
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Is this vessel 50 feet or over : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.vessel.isVessel50FeetOrOver,
                        this.yesNoTrueFalse
                      )}{" "}
                    </li>
                    <br />
                  </>
                }
                {this.props?.propertyData?.vessel.isVessel50FeetOrOver ? (
                  <>
                    {this.props?.propertyData?.vessel.nameOfVessel ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Name of Vessel : </b>
                          </span>{" "}
                          {this.props?.propertyData?.vessel.nameOfVessel}{" "}
                        </li>
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                    {this.props?.propertyData?.make ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Make : </b>
                          </span>{" "}
                          {this.props?.propertyData?.make}{" "}
                        </li>
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                    {this.props?.propertyData?.model ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Model : </b>
                          </span>{" "}
                          {this.props?.propertyData?.model}
                        </li>{" "}
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                    {this.props?.propertyData?.vessel.hullIdNumber ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Hull Id Number : </b>
                          </span>{" "}
                          {this.props?.propertyData?.vessel.hullIdNumber}
                        </li>{" "}
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                    {
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Vessel Seaworthy : </b>
                          </span>{" "}
                          {this.getTextForDropDownValue(
                            this.props?.propertyData?.vessel.isVesselSeaworthy,
                            this.yesNoTrueFalse
                          )}{" "}
                        </li>
                        <br />
                      </>
                    }
                    {this.props?.propertyData?.vessel.length ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Length : </b>
                          </span>{" "}
                          {this.props?.propertyData?.vessel.length}
                        </li>{" "}
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                    {this.props?.propertyData?.vessel.beam ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Beam : </b>
                          </span>{" "}
                          {this.props?.propertyData?.vessel.beam}
                        </li>{" "}
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                    {this.props?.propertyData?.vessel.draft ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Draft : </b>
                          </span>{" "}
                          {this.props?.propertyData?.vessel.draft}
                        </li>{" "}
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                    {
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Major Components Missing : </b>
                          </span>{" "}
                          {this.getTextForDropDownValue(
                            this.props?.propertyData?.vessel
                              .areMajorComponentsMissing,
                            this.yesNoTrueFalse
                          )}{" "}
                        </li>
                        <br />
                      </>
                    }
                    {this.props?.propertyData?.vessel
                      .areMajorComponentsMissing ? (
                      <>
                        {
                          <>
                            {" "}
                            <li>
                              <span>
                                <b>Engine Missing : </b>
                              </span>{" "}
                              {this.props?.propertyData?.vessel.isEngineMissing
                                ? "Yes"
                                : "No"}{" "}
                            </li>
                            <br />
                          </>
                        }
                        {
                          <>
                            <li>
                              <span>
                                <b>Electronic Missing : </b>
                              </span>{" "}
                              {this.props?.propertyData?.vessel
                                .isElectronicMissing
                                ? "Yes"
                                : "No"}{" "}
                            </li>
                            <br />
                          </>
                        }
                        {
                          <>
                            {" "}
                            <li>
                              <span>
                                <b>Other Missing : </b>
                              </span>{" "}
                              {this.props?.propertyData?.vessel.isOtherMissing
                                ? "Yes"
                                : "No"}{" "}
                            </li>
                            <br />
                          </>
                        }
                      </>
                    ) : (
                      <></>
                    )}
                    {this.props?.propertyData?.vessel.typesOfEngines ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Types of Engines : </b>
                          </span>{" "}
                          {this.props?.propertyData?.vessel.typesOfEngines}
                        </li>{" "}
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                    {this.props?.propertyData?.vessel.hoursOnEngine ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Hours on Engine : </b>
                          </span>{" "}
                          {this.props?.propertyData?.vessel.hoursOnEngine}{" "}
                        </li>
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                    {
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Vessel have PCBs : </b>
                          </span>{" "}
                          {this.getTextForDropDownValue(
                            this.props?.propertyData?.vessel.vesselHasPCB,
                            this.yesNoTrueFalse
                          )}{" "}
                        </li>
                        <br />
                      </>
                    }
                    {
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Vessel have asbestos : </b>
                          </span>{" "}
                          {this.getTextForDropDownValue(
                            this.props?.propertyData?.vessel.vesselHasAsbestos,
                            this.yesNoTrueFalse
                          )}{" "}
                        </li>
                        <br />
                      </>
                    }
                    {this.props?.propertyData?.vessel.vesselHasAsbestos ? (
                      <>
                        {this.props?.propertyData?.vessel.friable ? (
                          <>
                            <li>
                              <span>
                                <b>Friable : Yes</b>
                              </span>{" "}
                            </li>
                            <br />{" "}
                          </>
                        ) : (
                          <>
                            <li>
                              <span>
                                <b>Non Friable : Yes</b>
                              </span>{" "}
                            </li>
                            <br />
                          </>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                    {
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Vessel been inspected by the Coast Guard : </b>
                          </span>{" "}
                          {this.getTextForDropDownValue(
                            this.props?.propertyData?.vessel
                              .vesselInspectedByCoastGuard,
                            this.yesNoTrueFalse
                          )}{" "}
                        </li>
                        <br />
                      </>
                    }
                    {
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Marine Survey of the vessel available : </b>
                          </span>{" "}
                          {this.getTextForDropDownValue(
                            this.props?.propertyData?.vessel
                              .marineSurveyAvailable,
                            this.yesNoTrueFalse
                          )}{" "}
                        </li>
                        <br />
                      </>
                    }
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.specialDescriptionCode ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Special Description Code : </b>
                      </span>{" "}
                      {this.props?.propertyData?.specialDescriptionCode}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.specialDescriptionText ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Special Description Text : </b>
                      </span>{" "}
                      {this.props?.propertyData?.specialDescriptionText}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}

            {trailerFSCCode.find(
              (code) =>
                this.props?.propertyData?.fscCode === code &&
                this.props.propertyData.propertyCreationSource !==
                  "NON_REPORT_PROP"
            ) ? (
              <>
                {this.props?.propertyData?.trailerHome.bodyStyle ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Body Style : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.trailerHome.bodyStyle,
                        trailerBodyStyle
                      )}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.make ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Make : </b>
                      </span>{" "}
                      {this.props?.propertyData?.make}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.model ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Model : </b>
                      </span>{" "}
                      {this.props?.propertyData?.model}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.trailerHome.modelYear ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Model Year : </b>
                      </span>{" "}
                      {this.props?.propertyData?.trailerHome.modelYear}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.trailerHome.vin ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Vehicle Identification Number : </b>
                      </span>{" "}
                      {this.props?.propertyData?.trailerHome.vin}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.trailerHome.length ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Length (feet) : </b>
                      </span>{" "}
                      {this.props?.propertyData?.trailerHome.length}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.trailerHome.barcode ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Barcode : </b>
                      </span>{" "}
                      {this.props?.propertyData?.trailerHome.barcode}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.trailerHome.bodyStyle === "PM" ||
                this.props?.propertyData?.trailerHome.bodyStyle === "MH" ? (
                  <>
                    {this.props?.propertyData?.trailerHome.numberOfAxles ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Number of Axles : </b>
                          </span>{" "}
                          {this.props?.propertyData?.trailerHome.numberOfAxles}{" "}
                        </li>
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                    {this.props?.propertyData?.trailerHome.numberOfBedrooms ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Number of Bedrooms : </b>
                          </span>{" "}
                          {
                            this.props?.propertyData?.trailerHome
                              .numberOfBedrooms
                          }{" "}
                        </li>
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                    {this.props?.propertyData?.trailerHome.numberOfBathrooms ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Number of Bathrooms : </b>
                          </span>{" "}
                          {
                            this.props?.propertyData?.trailerHome
                              .numberOfBathrooms
                          }{" "}
                        </li>
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                    {this.props?.propertyData?.trailerHome.windZone ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Wind Zone : </b>
                          </span>{" "}
                          {this.props?.propertyData?.trailerHome.windZone}{" "}
                        </li>
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.trailerHome.bodyStyle === "TT" ? (
                  <>
                    <div>Trailer Type</div>
                    <li>
                      <span>
                        <b>Slide out : </b>
                      </span>
                      {this.props?.propertyData?.trailerHome.isSlideOut
                        ? "Yes"
                        : "No"}
                    </li>
                    <br />
                    <li>
                      <span>
                        <b>Awning : </b>
                      </span>
                      {this.props?.propertyData?.trailerHome.isAwning
                        ? "Yes"
                        : "No"}
                    </li>
                    <br />
                    <li>
                      <span>
                        <b>Neither : </b>
                      </span>{" "}
                      {this.props?.propertyData?.trailerHome
                        .isNeitherTrailerType
                        ? "Yes"
                        : "No"}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.specialDescriptionCode ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Special Description Code : </b>
                      </span>{" "}
                      {this.props?.propertyData?.specialDescriptionCode}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.specialDescriptionText ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Special Description Text : </b>
                      </span>{" "}
                      {this.props?.propertyData?.specialDescriptionText}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}

            {aircraftFSCCode.find(
              (code) =>
                this.props?.propertyData?.fscCode === code &&
                this.props.propertyData.propertyCreationSource !==
                  "NON_REPORT_PROP"
            ) ? (
              <>
                {this.props?.propertyData?.make ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Make : </b>
                      </span>{" "}
                      {this.props?.propertyData?.make}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.model ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Model : </b>
                      </span>{" "}
                      {this.props?.propertyData?.model}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.airCraft?.serialNumber ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Serial Number : </b>
                      </span>{" "}
                      {this.props?.propertyData?.airCraft?.serialNumber}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Aircraft Operational : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.airCraft
                          ?.isAircraftOperational,
                        this.yesNoTrueFalse
                      )}{" "}
                    </li>
                    <br />
                  </>
                }
                {
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Major Components Missing : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.airCraft
                          ?.areMajorComponentsMissing,
                        this.yesNoTrueFalse
                      )}{" "}
                    </li>
                    <br />
                  </>
                }
                {this.props?.propertyData?.airCraft
                  ?.areMajorComponentsMissing ? (
                  <>
                    {
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Engine Missing : </b>
                          </span>{" "}
                          {this.getTextForDropDownValue(
                            this.props?.propertyData?.airCraft?.isEngineMissing,
                            this.yesNoTrueFalse
                          )}{" "}
                        </li>
                        <br />
                      </>
                    }
                    {this.props?.propertyData?.airCraft
                      ?.avionicsOtherNoMissing ? (
                      <>
                        <li>
                          <span>
                            <b>Avionics or Other Missing : </b>
                          </span>{" "}
                          {this.getTextForDropDownValue(
                            this.props?.propertyData?.airCraft
                              ?.avionicsOtherNoMissing,
                            otherMissingComponentsOptions
                          )}{" "}
                        </li>
                        <br />
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Dataplate available : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.airCraft
                          ?.isDataPlateAvailable,
                        this.yesNoTrueFalse
                      )}{" "}
                    </li>
                    <br />
                  </>
                }
                {
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Historical and Maintainence records available : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.airCraft
                          ?.areHistoricalMaintenanceRecordsAvailable,
                        this.yesNoTrueFalse
                      )}{" "}
                    </li>
                    <br />
                  </>
                }
                {
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>
                          Aircraft been certificated by the Federal Aviations
                          Administration :{" "}
                        </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.airCraft
                          ?.isAircraftCertifiedByFAA,
                        this.yesNoTrueFalse
                      )}{" "}
                    </li>
                    <br />
                  </>
                }
                {
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>
                          Aircraft been maintained to Federal Aviations
                          Administration standards :{" "}
                        </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.airCraft
                          ?.isAircraftMaintainedByFAA,
                        this.yesNoTrueFalse
                      )}{" "}
                    </li>
                    <br />
                  </>
                }
                {
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Aircraft been used for non flight purpose : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.airCraft
                          ?.isAircraftUsedNonFlightPurpose,
                        this.yesNoTrueFalse
                      )}{" "}
                    </li>
                    <br />
                  </>
                }

                {this.props?.propertyData?.airCraft
                  ?.isAircraftUsedNonFlightPurpose ? (
                  <>
                    {
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Ground Training : </b>
                          </span>{" "}
                          {this.getTextForDropDownValue(
                            this.props?.propertyData?.airCraft
                              ?.isGroundTraining,
                            this.yesNoTrueFalse
                          )}{" "}
                        </li>
                        <br />
                      </>
                    }
                    {
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Static Display : </b>
                          </span>{" "}
                          {this.getTextForDropDownValue(
                            this.props?.propertyData?.airCraft?.isStaticDisplay,
                            this.yesNoTrueFalse
                          )}{" "}
                        </li>
                        <br />
                      </>
                    }
                    {
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Extensive Disassemby and re-assembly : </b>
                          </span>{" "}
                          {this.getTextForDropDownValue(
                            this.props?.propertyData?.airCraft
                              ?.isExtensiveDisassemblyAndReassembly,
                            this.yesNoTrueFalse
                          )}{" "}
                        </li>
                        <br />
                      </>
                    }
                    {
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>
                              Repeated burning for fire-fighting training :{" "}
                            </b>
                          </span>{" "}
                          {this.getTextForDropDownValue(
                            this.props?.propertyData?.airCraft
                              ?.isRepeatedBurningForFireFightingTraining,
                            this.yesNoTrueFalse
                          )}{" "}
                        </li>
                        <br />
                      </>
                    }
                    {
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Extensive cannibalization : </b>
                          </span>{" "}
                          {this.getTextForDropDownValue(
                            this.props?.propertyData?.airCraft
                              ?.isExtensiveCannibalization,
                            this.yesNoTrueFalse
                          )}{" "}
                        </li>
                        <br />
                      </>
                    }
                  </>
                ) : (
                  <></>
                )}
                {this.props.propertyData?.agencyBureau.startsWith("21") ||
                this.props.propertyData?.agencyBureau.startsWith("17") ||
                this.props.propertyData?.agencyBureau.startsWith("57") ||
                this.props.propertyData?.agencyBureau.startsWith("97") ? (
                  <>
                    {
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Military Aircraft Only : </b>
                          </span>{" "}
                          {this.militrayAircraft(
                            this.props?.propertyData?.airCraft
                          )}{" "}
                        </li>
                        <br />
                      </>
                    }
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.specialDescriptionText ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Special Description Text : </b>
                      </span>{" "}
                      {this.props?.propertyData?.specialDescriptionText}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}

            {computersFSCCode.find(
              (code) =>
                this.props?.propertyData?.fscCode === code &&
                this.props.propertyData.propertyCreationSource !==
                  "NON_REPORT_PROP"
            ) ? (
              <>
                {this.props?.propertyData?.computer.hardwareType ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Hardware : </b>
                      </span>{" "}
                      {this.props?.propertyData?.computer.hardwareType}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.computer.equipmentType ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Equipment : </b>
                      </span>{" "}
                      {this.props?.propertyData?.computer.equipmentType}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.make ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Make : </b>
                      </span>{" "}
                      {this.props?.propertyData?.make}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.model ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Model : </b>
                      </span>{" "}
                      {this.props?.propertyData?.model}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.computer.processorType ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Processor Type : </b>
                      </span>{" "}
                      {this.props?.propertyData?.computer.processorType}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.computer.processingSpeed ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Processing Speed : </b>
                      </span>{" "}
                      {this.props?.propertyData?.computer.processingSpeed}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.computer.ram ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>RAM : </b>
                      </span>{" "}
                      {this.props?.propertyData?.computer.ram}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.computer.hardDiskSize ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Hard Disk size : </b>
                      </span>{" "}
                      {this.props?.propertyData?.computer.hardDiskSize}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.computer.hardDiskStatus ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Hard Drive Status : </b>
                      </span>{" "}
                      {this.props?.propertyData?.computer.hardDiskStatus}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Computer for learning Module : </b>
                      </span>{" "}
                      {this.getTextForDropDownValue(
                        this.props?.propertyData?.computer
                          .isEquipmentForComputersForLearning,
                        this.yesNoTrueFalse
                      )}{" "}
                    </li>
                    <br />
                  </>
                }
                {this.props?.propertyData?.computer
                  .isEquipmentForComputersForLearning ? (
                  <>
                    {this.props?.propertyData?.computer
                      .isEquipmentForComputersForLearningEligible === "A" ? (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Who should screen this item in CFL : </b>
                          </span>{" "}
                          Schools and non-profits
                        </li>{" "}
                        <br />
                      </>
                    ) : (
                      <>
                        {" "}
                        <li>
                          <span>
                            <b>Who should screen this item in CFL : </b>
                          </span>{" "}
                          Schools Only
                        </li>
                        <br />
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.specialDescriptionCode ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Special Description Code : </b>
                      </span>{" "}
                      {this.props?.propertyData?.specialDescriptionCode}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.specialDescriptionText ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Special Description Text : </b>
                      </span>{" "}
                      {this.props?.propertyData?.specialDescriptionText}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}

            {!weaponsFSCCode.find(
              (weaponsCode) => this.props?.propertyData?.fscCode === weaponsCode
            ) &&
            !vehicleFSCCode.find(
              (vehicleCode) => this.props?.propertyData?.fscCode === vehicleCode
            ) &&
            !vesselFSCCode.find(
              (code) => this.props?.propertyData?.fscCode === code
            ) &&
            !trailerFSCCode.find(
              (code) => this.props?.propertyData?.fscCode === code
            ) &&
            !aircraftFSCCode.find(
              (code) => this.props?.propertyData?.fscCode === code
            ) &&
            !computersFSCCode.find(
              (code) => this.props?.propertyData?.fscCode === code
            ) ? (
              <>
                {this.props?.propertyData?.make ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Make : </b>
                      </span>{" "}
                      {this.props?.propertyData?.make}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.model ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Model : </b>
                      </span>{" "}
                      {this.props?.propertyData?.model}
                    </li>{" "}
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.specialDescriptionCode ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Special Description Code : </b>
                      </span>{" "}
                      {this.props?.propertyData?.specialDescriptionCode}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.specialDescriptionText ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Special Description Text : </b>
                      </span>{" "}
                      {this.props?.propertyData?.specialDescriptionText}{" "}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {this.props?.propertyData?.valueAddedServices ? (
                  <>
                    {" "}
                    <li>
                      <span>
                        <b>Value Added Services : </b>
                      </span>{" "}
                      {this.props?.propertyData?.valueAddedServices === "Y"
                        ? "Yes"
                        : "No"}
                    </li>
                    <br />
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
}
