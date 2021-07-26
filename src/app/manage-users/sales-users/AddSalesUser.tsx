import React, {StrictMode, useContext, useEffect} from "react";
import {Form, FormLabel} from "react-bootstrap";
import {isFormSubmitted} from "../../../service/validation.service";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import {PPMSAlert} from "../../../ui-kit/components/common/PPMS-alert";
import SalesUserInformation from "./sales-user-information/SalesUserInformation";
import {
  salesUserInformationDefault,
  SalesUserInformationStateJson
} from "./sales-user-information/SalesUserInformationState";
import {
  SALES_USER_TYPE_TO_ROLE_MAP,
  salesUserTypeStateDefault,
  SalesUserTypeStateJson
} from "./sales-user-type/SalesUserTypeState";
import {salesUserFormStateDefault} from "./SalesUserFormState";
import {salesUserZoneDefault, SalesUserZoneStateJson} from "./sales-user-zone/SalesUserZoneState";
import {salesUserRolesStateDefault, SalesUserRolesStateJson} from "./sales-user-roles/SalesUserRolesState";
import SalesUserType, {SALES_USER_TYPES} from "./sales-user-type/SalesUserType";
import SalesUserButtons from "./SalesUserButtons";
import {SalesUserContext} from "./SalesUserContext";
import SalesUserSideNav from "./SalesUserSideNav";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {addToast} from "../../../_redux/_actions/toast.actions"
import {Paths} from "../../Router";
import SalesUserZone from "./sales-user-zone/SalesUserZone";
import SalesUserRoles from "./sales-user-roles/SalesUserRoles";
import {CommonApiService} from "../../../api-kit/common/common-api.service";
import {UserApiService} from "../../../api-kit/user/user-api.service";
import {SalesUserDTO} from "../../models/SalesUser";
import {UserUtils} from "../../../utils/UserUtils";

interface AddSalesUserProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

export function AddSalesUser(props: AddSalesUserProps) {

  const commonApiService = new CommonApiService();

  const {
    salesUserTypeState,
    updateSalesUserTypeState,
    salesUserInformationState,
    updateSalesUserInformationState,
    salesUserFormState,
    updateSalesUserFormState,
    salesUserZoneState,
    updateSalesUserZoneState,
    salesUserRolesState,
    updateSalesUserRolesState
  } = useContext(SalesUserContext);

  const items = [
    {
      title : "Type of User",
      content : <SalesUserType salesUserType={salesUserTypeState.userType} />,
      expanded : true,
      id: "typeOfUser",
      trigger: "common",
    },
    {
      title : "User Information",
      content : <SalesUserInformation />,
      expanded : true,
      id: "userInformation",
      trigger: "common",
    },
    {
      title : "User Roles",
      content : (
        <div className="usa-accordion--bordered desktop:grid-col-12">
          {
            <FormLabel>At least one role should be selected</FormLabel>
          }
          <SalesUserRoles/>
        </div>
      ),
      expanded : true,
      id: "userRoles",
      trigger: "common",
    },
    {
      title : "Zone Information",
      content : <SalesUserZone />,
      expanded : true,
      id: "userZones",
      trigger: "common",
    }
  ];
  let userApiService = new UserApiService();
  useEffect(() => {
    setDefaultValues();

    const infoSalesUserType = UserUtils.getUserInfo().salesUserType;

    let options = [];

    if (infoSalesUserType === "PPMS") {
      options = ["PPMS"];
    } else if (infoSalesUserType === "FMU") {
      options = ["FMU"];
    } else if (infoSalesUserType === "PBS") {
      options = ["PBS"];
    } else if (infoSalesUserType === "DOI") {
      options = ["DOI"];
    }

    let salesUserTypes = SALES_USER_TYPES.filter((userType) => options.indexOf(userType.id)>-1);

    salesUserTypes[0].isSelected  = true;

    userApiService.getAllSalesRoles().then((resp => {

      let allowedRoles =  SALES_USER_TYPE_TO_ROLE_MAP[salesUserTypes[0].id];

      let roles = resp.data.filter(role => !allowedRoles || allowedRoles.indexOf(role.roleName)>-1)
      .map(role => {
        return {
          value: role.roleName,
          roleDescription: role.roleDescription,
          id: role.roleCd,
          isPbsDoiRole: role.isPbsDoiRole,
          isSelected: false
        };
      });

      updateSalesUserRolesState({
        salesUserRolesOptions: roles
      })
      commonApiService
      .getZoneList()
      .then((response: any) => {

        let list = response?.data.filter(zone =>
           (salesUserTypes[0].id === "PPMS") ? ("SLS" === zone.zoneGroup) : (salesUserTypes[0].id === zone.zoneGroup)
        );

        updateSalesUserZoneState({zoneList: list})
      })
        .catch((error) => {
          console.log(error);
          return error;
        })
    }));
    return () => {
      setDefaultValues();
    };
  }, []);

  function setDefaultValues() {
    isFormSubmitted.next(false);
    SALES_USER_TYPES.forEach(type => type.isSelected = false);
    updateSalesUserTypeState(salesUserTypeStateDefault);
    updateSalesUserInformationState(salesUserInformationDefault);
    updateSalesUserFormState(salesUserFormStateDefault);
    updateSalesUserZoneState(salesUserZoneDefault);
    updateSalesUserRolesState(salesUserRolesStateDefault);

  }

  return (
     <StrictMode>
       <div className={"grid-row ui-ppms"}>
        <div className="header-row grid-row grid-gap-4">
            <h1>ADD SALES USER</h1>
          </div>
          <div className="usa-layout-docs__sidenav desktop:grid-col-3">
            <div className={`sticky-wrapper`}>
              <div className={"sticky-inner"}>
                <nav aria-label="Secondary navigation">
                  <h3>Form Tracker</h3>
                  <SalesUserSideNav />
                </nav>
              </div>
            </div>
          </div>

          <div
            className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs"
            id="add-sales-users"
          >
            <div className="grid-row">
              <div className={"desktop:grid-col-8"}>
                <PPMSAlert
                  id={"form-verification-error"}
                  show={salesUserFormState.showErrorAlert}
                  alertBody={"Error submitting request."}
                  alertClassName={"form-verification-error"}
                  alertVariant={"danger"}
                  alertKey={"form-verification-error"}
                  alertBodyArray={salesUserFormState.alertMessages}
                />
                {salesUserFormState.showErrorAlert && <hr/>}
              </div>
            </div>
            <Form
              noValidate
              className={"usa-accordion--bordered desktop:grid-col-8"}
              validated={salesUserFormState.isFormValidated}
              onSubmit={handleSubmit}>
              <div className={"grid-row grid-gap-2"}>
                <SalesUserButtons
                  isSubmitDisabled={salesUserFormState.isSubmitDisabled}
                  isSubmitLoading={salesUserFormState.isSubmitLoading}
                  onCancelClick={cancelClicked}
                  id={"submit-sales-user-button1"}
                  cancelId={"cancel-sales-user-button1"}
                />
              </div>
              <br/>
              <PPMSAccordion bordered={true} items={items}/>
              <br/>
              <div className={"grid-row grid-gap-2"}>
                <SalesUserButtons
                  isSubmitDisabled={salesUserFormState.isSubmitDisabled}
                  isSubmitLoading={salesUserFormState.isSubmitLoading}
                  onCancelClick={cancelClicked}
                  id={"submit-sales-user-button2"}
                  cancelId={"cancel-sales-user-button2"}
                />
              </div>
            </Form>
          </div>
       </div>
     </StrictMode>
  );

  function toJSON(): SalesUserDTO {

    const userType = UserUtils.getUserInfo().salesUserType;

    let actualSalesUserType={...salesUserTypeState,userType:userType};
    let salesUserType = SalesUserTypeStateJson(actualSalesUserType)[0],
        salesUserInformation = SalesUserInformationStateJson(salesUserInformationState)[0],
        salesUserRoles = SalesUserRolesStateJson(salesUserRolesState)[0],
        salesUserZone = SalesUserZoneStateJson(salesUserZoneState)[0];

    return ({
      id: null,
      userType: salesUserType.salesUserType,
      firstName: salesUserInformation.firstName,
      middleName: salesUserInformation.middleName,
      lastName: salesUserInformation.lastName,
      emailAddress: salesUserInformation.emailAddress,
      phoneNumber: (salesUserInformation.phoneNumber).replace(/[^0-9]/g, ""),
      phoneExt: salesUserInformation.phoneExt,
      line1: salesUserInformation.line1,
      line2: salesUserInformation.line2,
      line3: salesUserInformation.line3,
      city: salesUserInformation.city,
      locationState: salesUserInformation.stateCode,
      zipCode: salesUserInformation.zip,
      zip2: salesUserInformation.zip2,
      userRoles: salesUserRoles.userRoles,
      userZones: salesUserZone.userZones,
      warrantLimit: salesUserRoles.warrantLimit,
    } as unknown) as SalesUserDTO;
  }

  function validateFields(){
    if(salesUserRolesState.isSFOSelected && salesUserRolesState.selectWarrantLimit.length === 0){
      return false;
    }
    if(salesUserZoneState.addedZonesList.length === 0){
      return false;
    }
    return true;
  }

  function handleSubmit(event: any) {
    isFormSubmitted.next(true);
    event.preventDefault();
    updateSalesUserFormState({
      isSubmitLoading: true,
      isSubmitDisabled: true
    });

    if (validateFields()) {
      updateSalesUserFormState({
        showErrorAlert: false
      });
      const data: SalesUserDTO = toJSON();
      const { addToast } = props.actions;

      userApiService
        .registerSalesUser(data)
        .then(() => {
          updateSalesUserFormState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
          addToast({
            text: "User Successfully Added!",
            type: "success",
            heading: "Success",
          });
          props.history.push({
            pathname: `${Paths.salesUsers}`,
          });
        })
        .catch(() => {
          updateSalesUserFormState({
            showErrorAlert: true,
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
        });
    }
    else {
      event.stopPropagation();
      updateSalesUserFormState({
        isSubmitLoading: false,
        isSubmitDisabled: false,
        showErrorAlert: true
      });
      }
  }

  function cancelClicked() {
    isFormSubmitted.next(false);
    props.history.push({
      pathname: `${Paths.salesUsers}`,
    });
  }

}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(AddSalesUser);
