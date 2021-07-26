import React, { StrictMode, useContext, useEffect, useState } from "react";
import { SalesTransactionContext } from "./SalesTransactionContext";
import { PPMSForm } from "../../../../ui-kit/components/common/form/PPMS-form";
import { PPMSAccordion } from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import SalesTransactionButtons from "./SalesTransactionButtons";
import SalesNumber from "./components/SalesNumber";
import GSAPOCDetails from "./components/GSAPOCDetails";
import SalesSideNav from "../common/SideNav";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import moment from "moment";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { PageHelper, Paths } from "../../../Router";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { PPMSActionList } from "../../../../ui-kit/components/PPMS-action-list";
import { contactDTO, defaultState } from "./constants/Constants";
import { saleActions } from "../../../../_redux/_actions/sale.actions";
import Breadcrumb from "../common/Breadcrumb";
import { UserApiService } from "../../../../api-kit/user/user-api.service";
import queryString from "query-string";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import {
  formatPhone,
  formatExtension,
} from "../../../../ui-kit/utilities/FormatUtil";
import { userInfo } from "os";

interface SalesTransactionProps {
  user?: any;
  roles?: any;
  actions?: any;
  location?: any;
  updateSaleInfo?: any;
  sale?: any;
  match: any;
}

const SalesTransaction = (props: SalesTransactionProps) => {
  const { salesTransactionState, updateSalesTransactionState } = useContext(
    SalesTransactionContext
  );
  const { addToast } = props.actions;
  const { updateSaleInfo, user, sale, match, roles, location } = props;
  const [timeDetails, setTimeDetails] = useState("");
  const [templateCodes, setTemplateCodes] = useState([]);
  const saleService = new SalesApiService();
  let userService = new UserApiService();
  let zone = [];
  let search = location.search;
  let query = queryString.parse(search);
  let saleId = "";
  if (match?.params?.saleId) {
    saleId = match?.params?.saleId;
  }

  if (query?.zoneId) {
    zone.push(query.zoneId);
  }
  async function reset() {
    let state = defaultState();
    state.data.salesNumberDetails.sco.email = user.emailAddress;
    state.data.salesNumberDetails.sco.firstName = user.firstName;
    state.data.salesNumberDetails.sco.lastName = user.lastName;
    let paramsAlternateSCO = {
      zones: zone.length > 0 ? zone.join() : 0,
      roles: "SCO",
    };
    let paramsMarketingSpecialist = {
      zones: zone.length > 0 ? zone.join() : 0,
      roles: "SMS",
    };
    await getSalesUserList(paramsAlternateSCO, state)
      .then(
        async () => await getSalesUserList(paramsMarketingSpecialist, state)
      )
      .then(
        async () =>
          await setPOCDetails(
            state.data.salesNumberDetails.pointOfContact,
            state
          )
      )
      .then(() => {
        updateSalesTransactionState(state);
      });
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    getTemplateCodes();
    if (saleId) {
      let state = salesTransactionState;
      saleService.getSaleDetails(saleId).then((response) => {
        let saleNumberDetails = response.data.salesNumberDetails;
        state.data.salesNumberDetails = saleNumberDetails;
        state.data.gsaPointOfContact = response.data.gsaPointOfContact;
        state.data.gsaPointOfContact.phoneNumber =
          response?.data?.gsaPointOfContact?.phoneNumber;
        // ? formatPhone(response?.data?.gsaPointOfContact?.phoneNumber)
        // : null;
        state.data.gsaPointOfContact.extn =
          response?.data?.gsaPointOfContact?.extn;
        // ? formatExtension(response?.data?.gsaPointOfContact?.extn)
        // : null;
        state.other.isReadOnly = isReadOnlyIsDisable();
        state.data.gsaPointOfContact.phoneNumber = response?.data
          ?.gsaPointOfContact?.phoneNumber
          ? formatPhone(
              response?.data?.gsaPointOfContact?.phoneNumber.toString()
            )
          : null;
        state.data.gsaPointOfContact.extn = response?.data?.gsaPointOfContact
          ?.extn
          ? formatExtension(response?.data?.gsaPointOfContact?.extn.toString())
          : null;
        state.readonly.saleMethodsIsDisabled = true;
        if (
          saleNumberDetails.salesStatus === "Active" ||
          saleNumberDetails.salesStatus === "Closed"
        ) {
          state.readonly.saleDateIsDisabled = true;
          state.readonly.saleTimeIsReadOnly = true;
          state.readonly.timeToggleIsDisabled = true;
        } else {
          state.readonly.saleDateIsDisabled = isReadOnlyIsDisable();
          state.readonly.saleTimeIsReadOnly = isReadOnlyIsDisable();
          state.readonly.timeToggleIsDisabled = isReadOnlyIsDisable();
        }

        state.validation.saleTimeisInvalid = false;
        state.validation.saleDateInValid = false;
        state.validation.salesDescInvalid = false;
        state.validation.salesTemplateCodeInvalid = false;
        state.validation.contactAddressLine1isInvalid = false;
        state.validation.contactAddressLine2isInvalid = false;
        state.validation.contactCityisInvalid = false;
        state.validation.contactStateisInvalid = false;
        state.validation.contactZipcodeisInvalid = false;
        response.data.salesNumberDetails.alternateSCO == null
          ? (state.data.salesNumberDetails.alternateSCO = contactDTO())
          : (state.data.salesNumberDetails.alternateSCO =
              response.data.salesNumberDetails.alternateSCO);
        response.data.salesNumberDetails.marketingSpecialist == null
          ? (state.data.salesNumberDetails.marketingSpecialist = contactDTO())
          : (state.data.salesNumberDetails.marketingSpecialist =
              response.data.salesNumberDetails.marketingSpecialist);
        state.other.amPm = response?.data?.salesNumberDetails?.salesTime.substring(
          5
        );
        state.constants.time.forEach((item) => {
          if (
            item.value ==
            response?.data?.salesNumberDetails?.salesTime.substring(5)
          ) {
            return (item.isSelected = true);
          } else {
            return (item.isSelected = false);
          }
        });
        console.log("Sales Response ", response?.data);
        state.dedicatedRegisterOptions = selectedValueOptions(
          state.dedicatedRegisterOptions,
          response?.data?.salesNumberDetails?.isDedicatedRegister ? "Y" : "N"
        );
        updateSalesTransactionState(state);
      });
      setAltScoAndMktSpl();
    } else {
      reset();
    }
  }, []);
  const getTemplateCodes = () => {
    saleService
      .getTemplateCodes(zone)
      .then((res) => {
        setTemplateCodes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function selectedValueOptions(options: any[], selectedValues: string) {
    options.forEach((option) => {
      if (selectedValues.includes(option.id)) {
        option.isSelected = true;
      } else {
        option.isSelected = false;
      }
    });
    return options;
  }
  async function setPOCDetails(value, state) {
    state.data.salesNumberDetails.pointOfContact = value;
    let email;
    switch (value) {
      case "POC-SCO":
        email = user.emailAddress;
        break;
      case "POC-ASCO":
        email = salesTransactionState.constants.alternateSCO.filter((item) => {
          return (
            item.id ===
            salesTransactionState.data.salesNumberDetails.alternateSCO.email
          );
        });
        email = email[0]?.email;
        break;
      case "POC-MS":
        email = salesTransactionState.constants.marketingSpecialist.filter(
          (item) => {
            return (
              item.id ===
              salesTransactionState.data.salesNumberDetails.marketingSpecialist
                .email
            );
          }
        );
        email = email[0]?.email;
        break;
      default:
        break;
    }
    if (email) {
      await userService.getSalesUserDetailsByEmail(email).then((res) => {
        let data = res.data;
        state.data.gsaPointOfContact.contact = data.email;
        state.data.gsaPointOfContact.addressDTO.addressLine1 = data.line1;
        state.data.gsaPointOfContact.addressDTO.addressLine2 = data.line2;
        state.data.gsaPointOfContact.addressDTO.addressLine3 = data.line3;
        state.data.gsaPointOfContact.addressDTO.city = data.city;
        state.data.gsaPointOfContact.addressDTO.zipCode = data.zipCode;
        state.data.gsaPointOfContact.addressDTO.zipExtn = data.zip2;
        state.data.gsaPointOfContact.phoneNumber = data?.phone
          ? formatPhone(data?.phone)
          : null;
        state.data.gsaPointOfContact.extn = data?.phoneExt
          ? formatExtension(data?.phoneExt)
          : null;
        state.data.gsaPointOfContact.addressDTO.state = data.state;
        //updateSalesTransactionState(state);
      });
    }
  }

  function convertStringAmountToNumeric(amount) {
    let convertedNumber = null;
    let lastCharForAlternateUser = null;
    lastCharForAlternateUser = amount.charAt(amount.length - 1);
    let currentNumber = parseFloat(amount);
    if (lastCharForAlternateUser == "K") {
      convertedNumber = currentNumber * 1000;
    } else {
      if (lastCharForAlternateUser == "M") {
        convertedNumber = currentNumber * 1000000;
      }
    }
    return convertedNumber;
  }

  async function setAltScoAndMktSpl() {
    let state = salesTransactionState;
    let paramsAlternateSCO = {
      zones: zone.length > 0 ? zone.join() : 0,
      roles: "SCO",
    };
    let paramsMarketingSpecialist = {
      zones: zone.length > 0 ? zone.join() : 0,
      roles: "SMS",
    };
    await getSalesUserList(paramsAlternateSCO, state)
      .then(
        async () => await getSalesUserList(paramsMarketingSpecialist, state)
      )
      .then(() => {
        updateSalesTransactionState(state);
      });
  }

  function getCurrentUserWarrantLimit(response: any): string {
    for (var element in response.data) {
      if (response.data[element].email === user.emailAddress) {
        return response.data[element].warrantLimit;
      }
    }
  }

  async function getSalesUserList(params, state) {
    let optionsSCO = [];
    let optionsSMS = [];
    await userService
      .getSalesUsersByRoleAndZone(params)
      .then(async (response) => {
        let currentUserWarrantLimit;
        if (params.roles === "SCO") {
          currentUserWarrantLimit = getCurrentUserWarrantLimit(response);
          if (currentUserWarrantLimit === "Unlimited") {
            let paramsAlternateSCO = {
              roles: "SCO",
            };
            await userService
              .getSalesUsersByRoleForAllZones(paramsAlternateSCO)
              .then((resp) => {
                resp.data?.forEach((alternateUserInfo, index) => {
                  if (
                    user.emailAddress !== alternateUserInfo.email &&
                    alternateUserInfo.warrantLimit === "Unlimited"
                  ) {
                    let option = `${alternateUserInfo.firstName} ${alternateUserInfo.lastName}`;
                    optionsSCO.push({
                      id: `${alternateUserInfo.email}`,
                      value: option,
                      email: alternateUserInfo.email,
                      firstName: alternateUserInfo.firstName,
                      lastName: alternateUserInfo.lastName,
                      phone: alternateUserInfo.phone,
                    });
                  }
                });
              });
          } else {
            response.data?.forEach((userInfo, index) => {
              let roleListString = [];
              if (user.emailAddress !== userInfo.email) {
                userInfo.roles.forEach((role) => {
                  roleListString.push(role.roleDescription);
                });
                let option = `${userInfo.firstName} ${userInfo.lastName}`;
                if (
                  params.roles === "SCO" &&
                  userInfo.warrantLimit != "Unlimited" &&
                  currentUserWarrantLimit != "Unlimited"
                ) {
                  const currentUserWarrantLimitInNumber = convertStringAmountToNumeric(
                    currentUserWarrantLimit
                  );
                  const alternateUserWarrantLimit = convertStringAmountToNumeric(
                    userInfo.warrantLimit
                  );
                  if (
                    alternateUserWarrantLimit >= currentUserWarrantLimitInNumber
                  ) {
                    optionsSCO.push({
                      id: `${userInfo.email}`,
                      value: option,
                      email: userInfo.email,
                      firstName: userInfo.firstName,
                      lastName: userInfo.lastName,
                      phone: userInfo.phone,
                    });
                  }
                }
              }
            });
          }
          salesTransactionState.required.alternateSCOIsRequired = true;
          state.constants.alternateSCO = optionsSCO;
        } else if (params.roles === "SMS") {
          response.data?.forEach((userInfo, index) => {
            let roleListString = [];
            if (user.emailAddress !== userInfo.email) {
              userInfo.roles.forEach((role) => {
                roleListString.push(role.roleDescription);
              });
              let option = `${userInfo.firstName} ${userInfo.lastName}`;
              if (params.roles === "SMS") {
                optionsSMS.push({
                  id: `${userInfo.email}`,
                  value: option,
                  email: userInfo.email,
                  firstName: userInfo.firstName,
                  lastName: userInfo.lastName,
                });
              }
            }
          });
          salesTransactionState.required.alternateSCOIsRequired = true;
          state.constants.marketingSpecialist = optionsSMS;
        }
      })

      .catch((error) => {
        console.log(error);
      });
  }

  const validations = () => {
    let state = salesTransactionState;
    const ids = [
      state.validation.contactAddressLine1isInvalid,
      state.validation.contactAddressLine2isInvalid,
      state.validation.contactCityisInvalid,
      state.validation.contactStateisInvalid,
      state.validation.contactZipcodeisInvalid,
      state.validation.saleDateInValid,
      state.validation.saleTimeisInvalid,
    ];
    const result = ids.filter((item) => item === true);
    let id = state.data.salesNumberDetails.salesMethod;
    if (
      result.length > 0 ||
      isEmpty(state.data.salesNumberDetails.salesNumber) ||
      isEmpty(state.data.salesNumberDetails.salesDescription) ||
      (id === "internet" || id === "vas" || id === "buynow"
        ? isEmpty(state.data.salesNumberDetails.paymentDueDate) ||
          isEmpty(state.data.salesNumberDetails.removalDueDate)
        : false) ||
      (state.required.alternateSCOIsRequired
        ? isEmpty(state.data.salesNumberDetails.alternateSCO.firstName)
        : false) ||
      isEmpty(state.data.gsaPointOfContact.contact) ||
      isEmpty(state.data.gsaPointOfContact.addressDTO.state) ||
      isEmpty(state.data.gsaPointOfContact.addressDTO.zipCode) ||
      isEmpty(state.data.gsaPointOfContact.addressDTO.city) ||
      isEmpty(state.data.gsaPointOfContact.addressDTO.addressLine1) ||
      isEmpty(state.data.salesNumberDetails.salesTime)
    ) {
      state.validation.submitBtnDisable = true;
      if (isEmpty(state.data.salesNumberDetails.salesDescription))
        state.validation.salesDescInvalid = true;
      else if (isEmpty(state.data.gsaPointOfContact.contact))
        state.validation.contactInvalid = true;
      else if (isEmpty(state.data.gsaPointOfContact.addressDTO.state))
        state.validation.contactStateisInvalid = true;
      else if (isEmpty(state.data.gsaPointOfContact.addressDTO.zipCode))
        state.validation.contactZipcodeisInvalid = true;
      else if (isEmpty(state.data.gsaPointOfContact.addressDTO.city))
        state.validation.contactCityisInvalid = true;
      else if (isEmpty(state.data.gsaPointOfContact.addressDTO.addressLine1))
        state.validation.contactAddressLine1isInvalid = true;
      if (isEmpty(state.data.salesNumberDetails.salesTime)) {
        state.validation.saleTimeisInvalid = true;
      }
      if (id === "internet" || id === "vas" || id === "buynow") {
        if (isEmpty(state.data.salesNumberDetails.paymentDueDate))
          state.validation.paymentDueDateInvalid = true;
        if (isEmpty(state.data.salesNumberDetails.removalDueDate))
          state.validation.removalDueDateInvalid = true;
      }
      if (state.required.alternateSCOIsRequired) {
        if (isEmpty(state.data.salesNumberDetails.alternateSCO.email)) {
          state.validation.alternateSCOInvalid = true;
        }
      }
    } else state.validation.submitBtnDisable = false;
    updateSalesTransactionState(state);
    return state.validation;
  };
  const saveSales = () => {
    let state = salesTransactionState;
    let validation = validations();
    if (!validation.submitBtnDisable) {
      state.data.salesNumberDetails.salesDate = moment(
        state.data.salesNumberDetails.salesDate
      )
        .format("MM/DD/YYYY")
        .toString();
      state.data.salesNumberDetails.paymentDueDate = moment(
        state.data.salesNumberDetails.paymentDueDate
      ).isValid()
        ? moment(state.data.salesNumberDetails.paymentDueDate)
            .format("MM/DD/YYYY")
            .toString()
        : null;
      state.data.salesNumberDetails.removalDueDate = moment(
        state.data.salesNumberDetails.removalDueDate
      ).isValid()
        ? moment(state.data.salesNumberDetails.removalDueDate)
            .format("MM/DD/YYYY")
            .toString()
        : null;
      state.data.salesNumberDetails.salesTime =
        state.data.salesNumberDetails.salesTime.substr(0, 5) + state.other.amPm;
      state.data.salesNumberDetails.zoneId = query?.zoneId;
      state.data.gsaPointOfContact.phoneNumber = state?.data?.gsaPointOfContact
        ?.phoneNumber
        ? state.data.gsaPointOfContact.phoneNumber
            .toString()
            .replace(/[() -]+/g, "")
            .trim()
        : null;
      state.data.gsaPointOfContact.extn = state.data.gsaPointOfContact.extn
        ? state.data.gsaPointOfContact.extn
            .toString()
            .replace(/[() -]+/g, "")
            .trim()
        : null;
      updateSalesTransactionState(state);
      console.log({ state });
      saleService
        .saveSales(state.data)
        .then((res) => {
          let state = salesTransactionState;
          state.data = res.data;
          updateSalesTransactionState(state);
          addToast({
            text: "Successfully saved the sales details",
            type: "success",
            heading: "Success",
          });
          updateSaleInfo(
            res.data.salesNumberDetails.id,
            res.data.salesNumberDetails.salesNumber,
            null,
            res.data.salesNumberDetails.salesNumber.substr(0, 1)
          );
          PageHelper.openPage(
            Paths.salesDocument +
              "/" +
              res.data?.salesNumberDetails?.id +
              "?zoneId=" +
              query?.zoneId
          );
        })
        .catch((error) => {
          addToast({
            text: "Error confirming request",
            type: "error",
            heading: "Error",
          });
        });
    } else {
      return addToast({
        text: "Error confirming request, check validations",
        type: "error",
        heading: "Error",
      });
    }
  };

  const deleteSales = (salesId) => {
    saleService
      .deleteSales(parseInt(salesId))
      .then((res) => {
        reset();
        addToast({
          text: "Successfully deleted the sale",
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.log("Error for delete sales", error);
        addToast({
          text: "Cannot Delete Sale Transaction with Sale Items",
          type: "error",
          heading: "Error",
        });
      });
  };

  const handleSalesTransactionActionHistory = () => {
    let state = salesTransactionState;
    const data = {
      params: {
        objectType: "SALES",
        objectId: state.data.salesNumberDetails.salesNumber.replace(
          /[^a-zA-Z0-9 ]/g,
          ""
        ),
      },
    };
    saleService
      .getActionHistoryForSalesObject(data)
      .then((response: any) => {
        updateSalesTransactionState({
          actionHistoryData: response.data,
          showActionHistoryModal: true,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  function handleClose() {
    updateSalesTransactionState({
      showActionHistoryModal: false,
    });
  }

  const saleTimeInfo = (time) => {
    setTimeDetails(time);
  };
  const isReadOnlyIsDisable = () => {
    if (
      roles.isSMS ||
      roles.isSG ||
      (salesTransactionState?.data?.salesNumberDetails?.sco?.email !==
        user.emailAddress &&
        salesTransactionState.data?.salesNumberDetails?.alternateSCO?.email !==
          user.emailAddress)
    ) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <StrictMode>
      <div className={"add-marketing-campaign grid-row ui-ppms ml-bc-shift"}>
        <Breadcrumb
          pathname={location.pathname}
          zoneId={query.zoneId}
          saleId={saleId}
        />
        <div className="grid-row header-row mb-3">
          <h1>Sales Transaction</h1>
        </div>

        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Sales Management</h3>
                <SalesSideNav
                  saleId={saleId}
                  zoneId={query.zoneId}
                  currentPage={Paths.salesTransaction}
                />
              </nav>
            </div>
          </div>
        </div>
        <div className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <PPMSForm
            noValidate
            // validate={marketingCampaignState.isFormValidated}
            large={false}
            search={true}
            onSubmit={() => {}}
            className={"usa-accordion--bordered desktop:grid-col-12"}
          >
            <div className={"grid-row grid-gap-2 flex-justify"}>
              <SalesTransactionButtons
                saveFunction={saveSales}
                isSubmitDisabled={
                  salesTransactionState.validation.submitBtnDisable
                }
                isSubmitLoading={false}
                actionHistoryFunction={handleSalesTransactionActionHistory}
                cancelFunction={() => deleteSales(saleId)}
                clearFunction={reset}
                saveSubmitBtnLabel={
                  salesTransactionState.data.salesNumberDetails.id
                    ? "Save"
                    : "Submit"
                }
                action={sale.saleAction}
                showActionHistory={true}
                roles={roles}
                salesId={salesTransactionState.data.salesNumberDetails.id}
                salesSCO={
                  salesTransactionState.data.salesNumberDetails.sco.email
                }
                alternateSCO={
                  salesTransactionState.data?.salesNumberDetails?.alternateSCO
                    ?.email
                    ? salesTransactionState.data?.salesNumberDetails
                        ?.alternateSCO?.email
                    : ""
                }
                userEmail={user.emailAddress}
                saveId={"submit-sale-transaction-button1"}
                clearId={"clear-sale-transaction-button1"}
              />
            </div>
            <br />
            <PPMSAccordion
              items={[
                {
                  title: "Sales Number",
                  content: (
                    <SalesNumber
                      saleTimeInfo={saleTimeInfo}
                      clearData={salesTransactionState.other.clearData}
                      isReadOnlyIsDisable={isReadOnlyIsDisable}
                      validations={validations}
                      setPOCDetails={async (value) => {
                        let state = salesTransactionState;
                        await setPOCDetails(value, state);
                        updateSalesTransactionState(state);
                      }}
                      zone={query?.zoneId ? query.zoneId : null}
                      templateCodes={templateCodes}
                    />
                  ),
                  expanded: true,
                  id: "sales-number-id",
                  className: "sales-number",
                },
              ]}
            />

            <br />
            <PPMSAccordion
              items={[
                {
                  title: "GSA Point of Contact Details",
                  content: <GSAPOCDetails />,
                  expanded: true,
                  id: "gsa-poc-detail-id",
                  className: "gsa-poc-detail",
                },
              ]}
            />

            <br />
            <div className={"grid-row grid-gap-2 flex-justify"}>
              <SalesTransactionButtons
                saveFunction={saveSales}
                isSubmitDisabled={
                  salesTransactionState.validation.submitBtnDisable
                }
                isSubmitLoading={false}
                actionHistoryFunction={handleSalesTransactionActionHistory}
                cancelFunction={() => deleteSales(saleId)}
                clearFunction={reset}
                saveSubmitBtnLabel={
                  salesTransactionState.data.salesNumberDetails.id
                    ? "Save"
                    : "Submit"
                }
                action={sale.saleAction}
                roles={roles}
                salesId={salesTransactionState.data.salesNumberDetails.id}
                salesSCO={
                  salesTransactionState.data.salesNumberDetails.sco.email
                }
                alternateSCO={
                  salesTransactionState.data?.salesNumberDetails?.alternateSCO
                    ?.email
                    ? salesTransactionState.data?.salesNumberDetails
                        ?.alternateSCO?.email
                    : ""
                }
                userEmail={user.emailAddress}
                saveId={"submit-sale-transaction-button2"}
                clearId={"clear-sale-transaction-button2"}
              />
            </div>
            <br />
            <div className="grid-row grid-gap-4">
              <PPMSModal
                body={
                  <ModalActionHistoryContent
                    data={salesTransactionState.actionHistoryData}
                    listID={"list-id"}
                    title={
                      salesTransactionState.data.salesNumberDetails.salesNumber
                    }
                  />
                }
                id={"show-action-history"}
                show={salesTransactionState.showActionHistoryModal}
                handleClose={handleClose}
                handleSave={""}
                title={
                  "Action History Sales: " +
                  salesTransactionState.data.salesNumberDetails.salesNumber
                }
                centered={true}
                backdrop={"static"}
                label={"Ok"}
                hideLabelCancel={true}
                hideLabel={salesTransactionState.showActionHistoryModal}
                size={
                  salesTransactionState.showActionHistoryModal ? "lg" : null
                }
              />
            </div>
          </PPMSForm>
        </div>
      </div>
      <div className="grid-row grid-gap-2">
        <div className="grid-col-12">
          <PPMSButton
            id={"sales-documentation"}
            type={"button"}
            variant={"link"}
            className={"usa-link float-right"}
            label={"Sales Documentation >"}
            onPress={() => {
              if (saleId) {
                PageHelper.openPage(
                  Paths.salesDocument + "/" + saleId + "?zoneId=" + query.zoneId
                );
              }
            }}
          />
        </div>
      </div>
    </StrictMode>
  );
};

export const ModalActionHistoryContent = ({ data, listID, title }) => {
  return (
    <div className={"action-history-container"}>
      <PPMSActionList data={data} listID={listID} title={title} />
    </div>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSaleInfo: (saleId, saleNumber, saleAction, zone) =>
      dispatch(
        saleActions.updateSaleInfo(saleId, saleNumber, saleAction, zone)
      ),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
  sale: state.sale,
});

export default connect(mapStateToProps, mapDispatchToProps)(SalesTransaction);
