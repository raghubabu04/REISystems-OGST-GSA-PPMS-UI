import * as React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../../_redux/_actions/toast.actions";
import { useContext, useEffect } from "react";
import { PropertyDetailsCreateContext } from "./CreateUpdateContext";
import { Details } from "../common/components/Details";
import { PPMSAccordion } from "../../../../../../ui-kit/components/common/accordion/PPMS-accordion";
import ImagesDocuments from "../common/components/ImagesDocuments";
import PointOfContact from "../common/components/PointOfContact";
import {
  checkValidation,
  generateCoordinatesCall,
  generateValidRequest,
  pocUpdate,
  pocValidate,
  propertyDetailUpdate,
  propertyDetailValidate,
  updateStateValues,
  validity,
  validateCityStateZip,
} from "../common/constants/Utils";
import { PPMSButton } from "../../../../../../ui-kit/components/common/PPMS-button";
import { SalesApiService } from "../../../../../../api-kit/sales/sales-api-service";
import { PageHelper, Paths } from "../../../../../Router";
import { resetState } from "../common/constants/Constants";

interface CreateProps {
  actions?: any;
  location?: any;
  saleId: number;
  saleNumber: string;
  lotId: number;
  lotInformation: any;
  updateLotInformation: any;
  pbsFSCCodes: any[];
  doiFSCCodes: any[];
  roles: any;
  lotStatus?: string;
  zoneId?: number;
  sellingAgency?: string;
}

const CreateUpdate = (props: CreateProps) => {
  const {
    saleId,
    saleNumber,
    lotId,
    lotInformation,
    updateLotInformation,
    pbsFSCCodes,
    doiFSCCodes,
    roles,
    lotStatus,
    zoneId,
    sellingAgency,
  } = props;
  const { addToast } = props.actions;
  let salesAPIService = new SalesApiService();
  const {
    createPropertyDetailsState,
    updateCreatePropertyDetailsState,
  } = useContext(PropertyDetailsCreateContext);

  useEffect(() => {
    let state = resetState();
    state.sales.saleId = saleId;
    state.sales.saleNumber = saleNumber;
    state.sales.sellingAgency = sellingAgency;
    state.lot.data.lotId = lotId;
    state.lot.data.lotNumber = lotInformation?.lotNumber;
    if (roles?.isCOI || lotStatus === "Closed") {
      state.other.fieldDisabled = true;
      state.propertyDetail.validation.description.isDisabled = true;
      state.other.imagesDocumentsDisable = true;
      state.other.saveDisabled = true;
      state.other.addPropertyDisabled = true;
    } else if (lotStatus === "Preview") {
      state.other.fieldDisabled = true;
    } else if (lotStatus === "Active") {
      state.other.fieldDisabled = true;
    }
    updateCreatePropertyDetailsState(updateStateValues(state, lotInformation));
  }, [lotInformation]);

  const updatePropertyDetail = (type, value) => {
    let state = createPropertyDetailsState;
    updateCreatePropertyDetailsState(propertyDetailUpdate(type, value, state));
  };

  const validatePropertyDetail = (type, value) => {
    let state = createPropertyDetailsState;
    updateCreatePropertyDetailsState(
      propertyDetailValidate(type, value, state)
    );
  };

  const validateZipCityState = (
    value,
    errorMessageValid,
    errorMessageInvalid,
    errorMessage,
    zipExtn
  ) => {
    let state = createPropertyDetailsState;
    updateCreatePropertyDetailsState(
      validateCityStateZip(
        createPropertyDetailsState,
        errorMessageValid,
        errorMessage
      )
    );
  };

  const updatePoc = (type, value) => {
    let state = createPropertyDetailsState;
    updateCreatePropertyDetailsState(pocUpdate(type, value, state));
  };
  const validatePoc = (type, value) => {
    let state = createPropertyDetailsState;
    updateCreatePropertyDetailsState(pocValidate(type, value, state));
  };

  const generateCoordinates = (city, state) => {
    generateCoordinatesCall(`${city},${state}`)
      .then((response) => {
        let state = createPropertyDetailsState;
        state.propertyDetail.data.latitude =
          response.data.results[0].locations[0].displayLatLng.lat;
        state.propertyDetail.data.longitude =
          response.data.results[0].locations[0].displayLatLng.lng;
        updateCreatePropertyDetailsState(state);
      })
      .catch((error) => {
        let state = createPropertyDetailsState;
        state.propertyDetail.data.latitude = "39.001663";
        state.propertyDetail.data.longitude = "77.40325";
        updateCreatePropertyDetailsState(state);
        console.error(error);
      });
  };

  const submitProperty = (type) => {
    let state = checkValidation(createPropertyDetailsState);
    state.other.saveDisabled = true;
    state.other.addPropertyDisabled = true;
    updateCreatePropertyDetailsState(state);
    let validation = validity(state);
    if (validation.valid) {
      let body = generateValidRequest(state);
      salesAPIService
        .saveLotProperty(body)
        .then((response) => {
          if (type === "add") {
            salesAPIService
              .cloneLotProperty(response.data.lotId)
              .then((response1) => {
                let data = response1.data;
                PageHelper.openPage(
                  `${Paths.salesAddPropertyPBSDOI}/${saleId}/${data.lotId}?zoneId=${zoneId}`
                );
                addToast({
                  text: `Lot Property ${
                    response1?.data?.lotNumber.length === 1
                      ? `00${response1?.data?.lotNumber}`
                      : response1?.data?.lotNumber.length === 2
                      ? `0${response1?.data?.lotNumber}`
                      : `${response1?.data?.lotNumber}`
                  } added Successfully.`,
                  type: "success",
                  heading: "Success",
                });
              })
              .catch((error) => {
                console.error(error);
                addToast({
                  text: `Could not add new property.`,
                  type: "error",
                  heading: "Error",
                });
              })
              .finally(() => {
                let state = createPropertyDetailsState;
                state.other.saveDisabled = false;
                state.other.addPropertyDisabled = false;
              });
          } else {
            updateLotInformation();
            addToast({
              text: `Lot Property ${
                response?.data?.lotNumber.length === 1
                  ? `00${response?.data?.lotNumber}`
                  : response?.data?.lotNumber.length === 2
                  ? `0${response?.data?.lotNumber}`
                  : `${response?.data?.lotNumber}`
              } Updated Successfully.`,
              type: "success",
              heading: "Success",
            });
          }
        })
        .catch((error) => {
          console.error(error);
          addToast({
            text: `Error Saving Property.`,
            type: "error",
            heading: "Error",
          });
        })
        .finally(() => {
          let state = createPropertyDetailsState;
          state.other.saveDisabled = false;
          state.other.addPropertyDisabled = false;
          updateCreatePropertyDetailsState(state);
        });
    } else {
      addToast({
        text: `${validation.invalidMessage}`,
        type: "error",
        heading: "Error",
      });
      let state = createPropertyDetailsState;
      state.other.saveDisabled = false;
      state.other.addPropertyDisabled = false;
      updateCreatePropertyDetailsState(state);
    }
  };

  return (
    <>
      <div className={"grid-row"}>
        <div className={"grid-col-12"}>
          <PPMSAccordion
            items={[
              {
                title: "Property Details",
                content: (
                  <Details
                    validateZipCityState={validateZipCityState}
                    lotNumber={lotInformation?.lotNumber}
                    propertyDetail={createPropertyDetailsState.propertyDetail}
                    updatePropertyDetail={updatePropertyDetail}
                    validatePropertyDetail={validatePropertyDetail}
                    generateCoordinates={generateCoordinates}
                    categoryOptions={pbsFSCCodes}
                    sellingAgency={sellingAgency}
                    doiFSCCodes={doiFSCCodes}
                    fieldDisabled={
                      createPropertyDetailsState.other.fieldDisabled
                    }
                    saleNumber={saleNumber}
                  />
                ),
                expanded: true,
                id: "property-details-id",
                className: "property-details",
              },
              {
                title: "Upload Images and Documents",
                content: (
                  <ImagesDocuments
                    saleId={saleId}
                    saleNumber={saleNumber}
                    lotNumber={lotInformation?.lotNumber}
                    lotId={lotId}
                    maxImages={25}
                    maxDocuments={25}
                    disable={
                      createPropertyDetailsState.other.imagesDocumentsDisable
                    }
                  />
                ),
                expanded: true,
                id: "property-images-documents-id",
                className: "property-images-documents",
              },
              {
                title: "Property POC",
                content: (
                  <PointOfContact
                    poc={createPropertyDetailsState.poc}
                    updatePoc={updatePoc}
                    validatePoc={validatePoc}
                    fieldDisabled={
                      createPropertyDetailsState.other.fieldDisabled
                    }
                  />
                ),
                expanded: true,
                id: "property-poc-id",
                className: "property-poc",
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
                onPress={() => submitProperty("save")}
                isDisabled={createPropertyDetailsState.other.saveDisabled}
              />
            </div>
            <div className={"grid-col-3"}>
              <PPMSButton
                id={"add-new-property"}
                label={"Add New Property"}
                type={"button"}
                className={"primary"}
                isDisabled={
                  createPropertyDetailsState.other.addPropertyDisabled
                }
                onPress={() => submitProperty("add")}
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
  };
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
  pbsFSCCodes: state.common.pbsFSCCodes,
  doiFSCCodes: state.common.doiFSCCodes,
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateUpdate);
