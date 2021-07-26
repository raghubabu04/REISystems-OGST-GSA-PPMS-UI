import * as React from "react";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { useContext, useEffect } from "react";
import { TransactionUpdateContext } from "./UpdateContext";
import { isEmpty } from "lodash";
import PPMSAccordion from "../../../../../ui-kit/components/common/accordion/PPMS-accordion";
import {
  region1,
  region4,
  region7,
  region9,
  regionNCR,
  regionN,
} from "../../common/Constants";
import RealtySpecialistOrSCODetails from "../common/RealtySpecialistOrSCODetails";
import SaleNumberDetails from "../common/SaleNumberDetails";
import TransactionButtons from "../common/TransactionButtons";
import {
  checkValidations,
  updationOfFields,
  validationOfFields,
} from "../common/ValidateUpdateFields";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import {
  formatExtension,
  formatPhone,
  formatSaleNumber,
} from "../../../../../ui-kit/utilities/FormatUtil";
import { PageHelper, Paths } from "../../../../Router";
import { saleMethodPBSDOI } from "../../common/Constants";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { ModalActionHistoryContent } from "../../../management/transactions/SalesTransaction";
interface CreateProps {
  actions?: any;
  location?: any;
  zoneId?: string;
  user?: any;
  saleId?: number;
  roles?: any;
}

const Update = (props: CreateProps) => {
  const { actions, location, zoneId, user, saleId, roles } = props;
  const { updateTransactionState, updateUpdateTransactionState } = useContext(
    TransactionUpdateContext
  );
  let salesApi = new SalesApiService();
  const { addToast } = props.actions;

  const zoneRegionValues = () => {
    let state = updateTransactionState;
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
    updateUpdateTransactionState(state);
  };

  useEffect(() => {
    zoneRegionValues();
    let state = updateTransactionState;
    salesApi
      .getSalesPBSDOI(saleId)
      .then((response) => {
        console.log({ resp: response.data });
        if (response?.data?.salesMethod) {
          saleMethodPBSDOI.forEach((item) => {
            if (item.id === response?.data?.salesMethod) {
              state.data.salesMethod = item.id;
            }
          });
        }
        state.data.salesNumber = response?.data?.salesNumber;
        state.data.region = response?.data?.region;
        state.data.fiscalYear = response?.data?.fiscalYear;
        state.data.contact = response?.data?.sco
          ? response?.data?.sco
          : response?.data?.realtySpecialist;
        state.data.contact.phone = response?.data?.sco
          ? formatPhone(response?.data?.sco?.phone.toString())
          : formatPhone(response?.data?.realtySpecialist?.phone.toString());
        state.data.contact.fax = response?.data?.sco
          ? formatPhone(response?.data?.sco?.fax.toString())
          : formatPhone(response?.data?.realtySpecialist?.fax.toString());
        if (
          response?.data?.sco?.phoneExtension ||
          response?.data?.realtySpecialist?.phoneExtension
        ) {
          state.data.contact.phoneExtension = response?.data?.sco
            ? formatExtension(response?.data?.sco?.phoneExtension.toString())
            : formatExtension(
                response?.data?.realtySpecialist?.phoneExtension.toString()
              );
        }
        state.validation.fiscalYearDisabled = true;
        state.validation.regionDisabled = true;
        state.validation.saleMethodDisabled = true;
        state.data.status = response?.data?.status;
        if (roles.isCOI || response?.data?.status === "Closed") {
          state.validation.realitySpecialistOrSCOFieldsDisabled = true;
        }
        updateUpdateTransactionState(state);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const updateValueOfField = (fieldName, value) => {
    let state = updationOfFields(fieldName, value, updateTransactionState);
    updateUpdateTransactionState(state);
    if (
      fieldName === "saleMethod" ||
      fieldName === "fiscalYear" ||
      fieldName === "region"
    ) {
      disableGenerateButton();
    }
  };

  const disableGenerateButton = () => {
    let state = updateTransactionState;
    if (
      isEmpty(state.data.salesMethod) ||
      isEmpty(state.data.fiscalYear) ||
      isEmpty(state.data.region)
    ) {
      state.validation.generateSaleNumberButtonDisabled = true;
    } else {
      state.validation.generateSaleNumberButtonDisabled = false;
    }
    updateUpdateTransactionState(state);
  };

  const validateFields = (fieldName, value) => {
    let state = validationOfFields(fieldName, value, updateTransactionState);
    updateUpdateTransactionState(state);
  };

  let accordians = (
    <PPMSAccordion
      items={[
        {
          title: "Sale Number",
          content: (
            <SaleNumberDetails
              state={updateTransactionState}
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
              state={updateTransactionState}
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
  const onSubmit = () => {
    let state = checkValidations(updateTransactionState);
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
    updateUpdateTransactionState(state);
    if (updateTransactionState.other.validity) {
      let salesUserType = user.salesUserType;
      let data = null;
      salesUserType === "PBS"
        ? (data = {
            salesMethod: updateTransactionState.data.salesMethod,
            realtySpecialist: updateTransactionState.data.contact,
            salesNumber: updateTransactionState.data.salesNumber,
            region: updateTransactionState.data.region,
            fiscalYear: updateTransactionState.data.fiscalYear,
            pointOfContact: "POC-PBS",
          })
        : (data = {
            salesMethod: updateTransactionState.data.salesMethod,
            sco: updateTransactionState.data.contact,
            salesNumber: updateTransactionState.data.salesNumber,
            region: updateTransactionState.data.region,
            fiscalYear: updateTransactionState.data.fiscalYear,
            pointOfContact: "POC-SCO",
          });
      salesApi
        .updateSalesPBSDOI(saleId, data)
        .then((response) => {
          if (response.data) {
            PageHelper.openPage(
              Paths.salesLotDetailsPBSDOI + "/" + saleId + "?zoneId=" + zoneId
            );
          }
          addToast({
            text: `Successfully updated sale ${formatSaleNumber(
              updateTransactionState.data.salesNumber
            )}`,
            type: "success",
            heading: "Success",
          });
        })
        .catch((error) => {
          console.log("Error for updating sale", error);
          addToast({
            text: "Cannot update sale ",
            type: "error",
            heading: "Error",
          });
        });
    } else {
      addToast({
        text: "Cannot update sale ",
        type: "error",
        heading: "Error",
      });
    }
  };

  const onActionHistory = () => {
    let state = updateTransactionState;
    const data = {
      params: {
        objectType: "SALES",
        objectId: state.data.salesNumber.replace(/[^a-zA-Z0-9 ]/g, ""),
      },
    };
    salesApi
      .getActionHistoryForSalesObject(data)
      .then((response: any) => {
        state.other.actionHistoryData = response?.data;
        state.other.showActionHistoryModal = true;
        updateUpdateTransactionState(state);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleClose = () => {
    let state = updateTransactionState;
    state.other.showActionHistoryModal = false;
    updateUpdateTransactionState(state);
  };
  return (
    <>
      <TransactionButtons
        onSubmit={onSubmit}
        onActionHistory={onActionHistory}
        type={"update"}
        roles={roles}
        status={updateTransactionState.data.status}
        showActionHistory={true}
      />
      <br />
      <div>{accordians}</div>
      <TransactionButtons
        onSubmit={onSubmit}
        type={"update"}
        roles={roles}
        status={updateTransactionState.data.status}
        showActionHistory={false}
      />
      <div className="grid-row grid-gap-4">
        <PPMSModal
          body={
            <ModalActionHistoryContent
              data={updateTransactionState.other.actionHistoryData}
              listID={"list-id"}
              title={updateTransactionState.data.salesNumber}
            />
          }
          id={"show-action-history"}
          show={updateTransactionState.other.showActionHistoryModal}
          handleClose={handleClose}
          handleSave={""}
          title={
            "Action History Sales: " + updateTransactionState.data.salesNumber
          }
          centered={true}
          backdrop={"static"}
          label={"Ok"}
          hideLabelCancel={true}
          hideLabel={updateTransactionState.other.showActionHistoryModal}
          size={
            updateTransactionState.other.showActionHistoryModal ? "lg" : null
          }
        />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Update);
