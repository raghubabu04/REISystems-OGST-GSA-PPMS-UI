import * as React from "react";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { useContext, useEffect } from "react";
import { TransactionCreatePBSDOIContext } from "./CreateContext";
import SaleNumberDetails from "../common/SaleNumberDetails";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import PPMSAccordion from "../../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { isEmpty } from "lodash";
import RealtySpecialistOrSCODetails from "../common/RealtySpecialistOrSCODetails";
import {
  region1,
  region7,
  region9,
  region4,
  regionNCR,
  regionN,
} from "../../common/Constants";
import TransactionButtons from "../common/TransactionButtons";
import {
  checkValidations,
  resetState,
  updationOfFields,
  validationOfFields,
} from "../common/ValidateUpdateFields";
import { PageHelper, Paths } from "../../../../Router";
import {
  formatExtension,
  formatPhone,
  formatSaleNumber,
} from "../../../../../ui-kit/utilities/FormatUtil";
interface CreateProps {
  actions?: any;
  location?: any;
  zoneId?: string;
  user?: any;
}

const Create = (props: CreateProps) => {
  const { actions, location, zoneId, user } = props;
  const { createTransactionState, updateCreateTransactionState } = useContext(
    TransactionCreatePBSDOIContext
  );
  let salesApi = new SalesApiService();
  const { addToast } = props.actions;

  useEffect(() => {
    let state = createTransactionState;
    let stateNew = resetState();
    state.data = stateNew.data;
    state.data.contact.fax = stateNew?.data?.contact?.fax
      ? formatPhone(stateNew?.data?.contact?.fax)
      : stateNew?.data?.contact?.fax;
    state.data.contact.phone = stateNew?.data?.contact?.phone
      ? formatPhone(stateNew?.data?.contact?.phone)
      : stateNew?.data?.contact?.phone;
    state.data.contact.phoneExtension = stateNew?.data?.contact?.phoneExtension
      ? formatExtension(stateNew?.data?.contact?.phoneExtension)
      : stateNew?.data?.contact?.phoneExtension;
    state.validation = stateNew.validation;
    state.other = stateNew.other;
    state.constants = stateNew.constants;
    updateCreateTransactionState(state);
    zoneRegionValues();
  }, []);

  const zoneRegionValues = () => {
    let state = createTransactionState;
    switch (zoneId) {
      case "6":
        state.constants.regionPBSDOI = region1;
        break;
      case "7":
        state.constants.regionPBSDOI = region4;
        break;
      case "8":
        state.constants.regionPBSDOI = region7;
        break;
      case "9":
        state.constants.regionPBSDOI = region9;
        break;
      case "10":
        state.constants.regionPBSDOI = regionNCR;
        break;
      case "11":
        state.constants.regionPBSDOI = regionN;
        break;
      default:
        break;
    }
    updateCreateTransactionState(state);
  };

  const generateSaleNumber = () => {
    let state = createTransactionState;
    let params = {
      year: state.data.fiscalYear,
      region: state.data.region,
      regionCode: state.data.regionCode,
    };
    salesApi
      .generatePBSDOISaleNumber(params)
      .then((response) => {
        state.data.salesNumber = response?.data?.saleNumber;
        state.validation.generateSaleNumberButtonDisabled = true;
        state.validation.saleNumberIsInvalid = false;
        updateCreateTransactionState(state);
        addToast({
          text: "Successfully generated sale number",
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.log("Error for generating sale number", error);
        addToast({
          text: "Cannot generate sale number",
          type: "error",
          heading: "Error",
        });
      });
  };

  const updateValueOfField = (fieldName, value) => {
    let state = updationOfFields(fieldName, value, createTransactionState);
    updateCreateTransactionState(state);
    if (
      fieldName === "saleMethod" ||
      fieldName === "fiscalYear" ||
      fieldName === "region"
    ) {
      disableGenerateButton();
    }
  };

  const disableGenerateButton = () => {
    let state = createTransactionState;
    if (
      isEmpty(state.data.salesMethod) ||
      isEmpty(state.data.fiscalYear) ||
      isEmpty(state.data.region) ||
      state.validation.fiscalYearIsInvalid
    ) {
      state.validation.generateSaleNumberButtonDisabled = true;
    } else {
      state.validation.generateSaleNumberButtonDisabled = false;
    }
    updateCreateTransactionState(state);
  };

  const validateFields = (fieldName, value) => {
    let state = validationOfFields(fieldName, value, createTransactionState);
    updateCreateTransactionState(state);
  };

  const onSubmit = () => {
    let state = checkValidations(createTransactionState);
    state.data.contact.phone = state.data.contact.phone
      ? state.data.contact.phone
          .toString()
          .replace(/[() -]+/g, "")
          .trim()
      : state.data.contact.phone;
    state.data.contact.phoneExtension = state.data.contact.phoneExtension
      ? state.data.contact.phoneExtension
          .toString()
          .replace(/[() -]+/g, "")
          .trim()
      : state.data.contact.phoneExtension;
    state.data.contact.fax = state.data.contact.fax
      ? state.data.contact.fax
          .toString()
          .replace(/[() -]+/g, "")
          .trim()
      : state.data.contact.fax;
    updateCreateTransactionState(state);
    if (createTransactionState.other.validity) {
      let salesUserType = user.salesUserType;
      let data = {};
      salesUserType === "PBS"
        ? (data = {
            salesMethod: createTransactionState.data.salesMethod,
            realtySpecialist: createTransactionState.data.contact,
            salesNumber: createTransactionState.data.salesNumber.replaceAll(
              "-",
              ""
            ),
            region: createTransactionState.data.region,
            regionCode: createTransactionState.data.regionCode,
            fiscalYear: createTransactionState.data.fiscalYear,
            pointOfContact: "POC-PBS",
            zoneId: zoneId,
          })
        : (data = {
            salesMethod: createTransactionState.data.salesMethod,
            sco: createTransactionState.data.contact,
            salesNumber: createTransactionState.data.salesNumber,
            region: createTransactionState.data.region,
            regionCode: createTransactionState.data.regionCode,
            fiscalYear: createTransactionState.data.fiscalYear,
            pointOfContact: "POC-SCO",
            zoneId: zoneId,
          });
      salesApi
        .saveSalesPBSDOI(data)
        .then((response) => {
          if (response.data.id) {
            PageHelper.openPage(
              Paths.salesLotDetailsPBSDOI +
                "/" +
                response.data.id +
                "?zoneId=" +
                zoneId
            );
          }
          addToast({
            text: `Successfully create sale ${formatSaleNumber(
              createTransactionState.data.salesNumber
            )}`,
            type: "success",
            heading: "Success",
          });
        })
        .catch((error) => {
          console.log("Error for creating sale", error);
          addToast({
            text: "Cannot create sale ",
            type: "error",
            heading: "Error",
          });
        });
    } else {
      addToast({
        text: "Cannot create sale ",
        type: "error",
        heading: "Error",
      });
    }
  };

  const onClear = () => {
    let state = createTransactionState;
    let stateNew = resetState();
    state.data = stateNew.data;
    state.validation = stateNew.validation;
    state.other = stateNew.other;
    state.constants = stateNew.constants;
    updateCreateTransactionState(state);
    zoneRegionValues();
  };
  let accordians = (
    <PPMSAccordion
      items={[
        {
          title: "Sale Number",
          content: (
            <SaleNumberDetails
              state={createTransactionState}
              generateSaleNumber={generateSaleNumber}
              updateValueOfField={updateValueOfField}
              validateFields={validateFields}
            />
          ),
          expanded: true,
          id: "sale-number-id",
          className: "sale-number-pbsdoi",
        },
        {
          title:
            user.salesUserType === "PBS"
              ? "Realty Specialist"
              : "Sales Contracting Officer",
          content: (
            <RealtySpecialistOrSCODetails
              state={createTransactionState}
              updateValueOfField={updateValueOfField}
              validateFields={validateFields}
            />
          ),
          expanded: true,
          id: "reality-specialist-pbsdoi",
          className: "reality-specialist-pbsdoi",
        },
      ]}
    />
  );

  return (
    <>
      <TransactionButtons
        onSubmit={onSubmit}
        onClear={onClear}
        showActionHistory={false}
      />
      <br />
      <div>{accordians}</div>
      <TransactionButtons
        onSubmit={onSubmit}
        onClear={onClear}
        showActionHistory={false}
      />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Create);
