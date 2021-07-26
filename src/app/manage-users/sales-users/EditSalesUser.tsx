import React, {StrictMode, useContext, useEffect} from "react";
import {Form} from "react-bootstrap";
import {isFormSubmitted} from "../../../service/validation.service";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import {PPMSAlert} from "../../../ui-kit/components/common/PPMS-alert";
import SalesUserInformation from "./sales-user-information/SalesUserInformation";
import {SalesUserInformationStateJson} from "./sales-user-information/SalesUserInformationState";
import {SalesUserTypeStateJson, SALES_USER_TYPE_TO_ROLE_MAP} from "./sales-user-type/SalesUserTypeState";
import {salesUserFormStateDefault} from "./SalesUserFormState";
import {SalesUserZoneStateJson} from "./sales-user-zone/SalesUserZoneState";
import {SalesUserRolesStateJson} from "./sales-user-roles/SalesUserRolesState";
import SalesUserType from "./sales-user-type/SalesUserType";
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
import {formatExtension, formatPhone} from "../../../ui-kit/utilities/FormatUtil";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import {PPMSActionList} from "../../../ui-kit/components/PPMS-action-list";
import {PPMSModal} from "../../../ui-kit/components/common/PPMS-modal";

interface EditSalesUserProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

export function EditSalesUser(props: EditSalesUserProps) {

  const commonApiService = new CommonApiService();
  const userApiService = new UserApiService();

  const ALL_REGIONS = [['1','2','3'],['4','5'],['6','7','8'],['10a','9'],[],['W']];
  const ALL_ZONES = ["Mid Atlantic Zone","Southeast - Great Lakes Zone","Southwest - Central Zone",
                      "Pacific Rim Zone","National Capital Zone","Central Office/Headquarters"];

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
      content : <SalesUserType salesUserType={salesUserTypeState.userType}/>,
      expanded : true,
      id: "typeOfUser",
      trigger: "common",
    },
    {
      title : "User Information",
      content : <SalesUserInformation/>,
      expanded : true,
      id: "userInformation",
      trigger: "common",
    },
    {
      title : "User Roles",
      content : <SalesUserRoles />,
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

  useEffect(() => {
    setDefaultValues();
  }, []);

  function setDefaultValues() {
    isFormSubmitted.next(false);
    updateSalesUserFormState(salesUserFormStateDefault);
    commonApiService
      .getZoneList()
      .then((resp: any) => {

        userApiService
          .getSalesUser(data)
          .then((response => {
            let addedZonesList = [];
            response?.data?.userZones.forEach((z) => {
              commonApiService
                .getZoneRegions(z.zoneCode)
                .then((response: any) => {
                  let zoneRegions = [];
                  response?.data.forEach((region) => {
                    zoneRegions.push(region.regionCode)
                  });
                  addedZonesList.push({
                    zoneCode: z.zoneCode,
                    zoneName: resp?.data?.find((zone) => zone.zoneId.toString() === z.zoneCode.toString()).zoneName,
                    regions: zoneRegions.join(),
                    isZoneDefault: z.isZoneDefault,
                  });
                  updateSalesUserZoneState({addedZonesList: addedZonesList, isZoneEmpty: false, validationMessage: ""});
                })
                .catch((error) => {
                  console.log(error);
                  return error;
                });
            });
            let respUserType=response?.data?.userType;
            updateSalesUserTypeState({userType: response?.data?.userType});
            updateSalesUserInformationState({
              id: response?.data?.id,
              firstName: response?.data?.firstName,
              middleName: response?.data?.middleName,
              lastName: response?.data?.lastName,
              emailAddress: response?.data?.emailAddress,
              confirmEmailAddress: response?.data?.emailAddress,
              confirmDisabled: true,
              phoneNumber: formatPhone(response?.data?.phoneNumber + ""),
              phoneExtension: formatExtension(response?.data?.phoneExt + ""),
              salesUserAddress1: response?.data?.line1,
              salesUserAddress2: response?.data?.line2,
              salesUserAddress3: response?.data?.line3,
              salesUserCity: response?.data?.city,
              salesUserStateCode: response?.data?.locationState,
              salesUserZipCode: response?.data?.zipCode,
              salesUserZip2Code: response?.data?.zip2,
            });
             
            userApiService.getAllSalesRoles().then((resp => {
            
              let allowedRoles =  SALES_USER_TYPE_TO_ROLE_MAP[respUserType];
        
              let roles = resp.data.filter(role => !allowedRoles || allowedRoles.indexOf(role.roleName)>-1)
              .map(role => {
                return {
                  value: role.roleName,
                  roleDescription: role.roleDescription,
                  id: role.roleCd,
                  isPbsDoiRole: role.isPbsDoiRole,
                  isSelected:  response?.data?.userRoles.includes(role.roleCd)
                };
              });
              
              let selectedRoles = roles.filter(r => r.isSelected).map(r => r.id);

              updateSalesUserRolesState({
                salesUserRolesOptions: roles,
                selectedRolesList: selectedRoles
              });
            }));
            updateSalesUserRolesState({
              isSFOSelected: response?.data?.userRoles.includes("SCO"),
              selectWarrantLimit: response?.data?.warrantLimit,
            });
            
            let list = resp?.data.filter(zone =>
              (respUserType === "PPMS") ? ("SLS" === zone.zoneGroup) : (respUserType === zone.zoneGroup) 
            );
            updateSalesUserZoneState({
              zoneList: list,
              addedZonesList: addedZonesList
            });
            
          }))
          .catch((error) => {
            console.log(error);
            return error;
          });
          
        //updateSalesUserZoneState({zoneList: resp?.data})
      })
      .catch((error) => {
        console.log(error);
        return error;
      })
    const data = {
      params: {
        userId: props.match.params.userId,
      },
    };
  }

  function handleSalesActionHistory() {
    const data = {
      params: {
        objectType: "SALESUSER",
        objectId: props.match.params.userId,
      },
    };
    userApiService
      .getActionHistoryForUserObject(data)
      .then((response: any) => {
        updateSalesUserFormState({
          actionHistoryData: response.data,
          showActionHistoryModal:true
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  function handleClose() {
    updateSalesUserFormState({
      showActionHistoryModal: false,
    });
  };

  return (
    <StrictMode>
      <div className={"grid-row ui-ppms"}>
        <div className="header-row grid-row grid-gap-4">
          <h1>EDIT SALES USER</h1>
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
          id="edit-sales-users"
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
              {salesUserFormState.showErrorAlert && <hr />}
            </div>
          </div>
          <Form
            noValidate
            className={"usa-accordion--bordered desktop:grid-col-8"}
            validated={salesUserFormState.isFormValidated}
            onSubmit={handleSubmit}>
            <div className={"grid-row grid-col-12"}>
              <div className={"grid-row grid-gap-2"}>
                <SalesUserButtons
                  isSubmitDisabled={salesUserFormState.isSubmitDisabled}
                  isSubmitLoading={salesUserFormState.isSubmitLoading}
                  onCancelClick={handleCancel}
                />
              </div>
              <div className={"action-history-sales"}>
                <PPMSButton
                  className={"out-button"}
                  type={"button"}
                  value={""}
                  label={"Action History"}
                  onPress={handleSalesActionHistory}
                  id={"action-history-sales"}
                />
              </div>
            </div>
            <br />
            <PPMSAccordion bordered={true} items={items}/>
            <br />
            <div className={"grid-row grid-gap-2"}>
              <SalesUserButtons
                isSubmitDisabled= {salesUserFormState.isSubmitDisabled}
                isSubmitLoading={salesUserFormState.isSubmitLoading}
                onCancelClick={handleCancel}
              />
            </div>
            <div className="grid-row grid-gap-4">
              <PPMSModal
                body={
                  <ModalActionHistoryContent
                    data={salesUserFormState.actionHistoryData}
                    listID={"list-id"}
                    title={props.match.params.userId}
                  />
                }
                id={"show-action-history"}
                show={salesUserFormState.showActionHistoryModal}
                handleClose={handleClose}
                handleSave={""}
                title={"Action History Sales User: " + props.match.params.userId}
                centered={true}
                backdrop={"static"}
                label={"Ok"}
                hideLabelCancel={true}
                hideLabel={salesUserFormState.showActionHistoryModal ? true : false}
                size={salesUserFormState.showActionHistoryModal ? "lg" : null}
              />
            </div>
          </Form>
        </div>
      </div>
    </StrictMode>
  );

  function toJSON(): SalesUserDTO {
    let salesUserType = SalesUserTypeStateJson(salesUserTypeState)[0],
      salesUserInformation = SalesUserInformationStateJson(salesUserInformationState)[0],
      salesUserRoles = SalesUserRolesStateJson(salesUserRolesState)[0],
      salesUserZone = SalesUserZoneStateJson(salesUserZoneState)[0];

    return ({
      id: salesUserInformation.id,
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

  function handleSubmit(event: any) {
    isFormSubmitted.next(true);
    event.preventDefault();

    updateSalesUserFormState({
      isSubmitLoading: true,
      isSubmitDisabled: true
    });

    const form = event.currentTarget;
    
    if (!form.checkValidity() && (salesUserZoneState.addedZonesList.length === 0 || salesUserRolesState.selectedRolesList.length===0)) {
      event.stopPropagation();
      updateSalesUserFormState({
        isSubmitLoading: false,
        isSubmitDisabled: false,
        showErrorAlert: true
      });
    } else {
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
            text: "User Successfully Updated!",
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
  }

  function handleCancel() {
    isFormSubmitted.next(false);
    props.history.push({
      pathname: `${Paths.salesUsers}`,
    });
  }

}

const ModalActionHistoryContent = ({ data, listID, title }) => {
  return (
    <div className={"action-history-container"}>
      <PPMSActionList data={data} listID={listID} title={title} />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(EditSalesUser);
