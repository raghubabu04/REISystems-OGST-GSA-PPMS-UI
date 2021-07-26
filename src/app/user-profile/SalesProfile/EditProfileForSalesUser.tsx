import React, {StrictMode, useContext, useEffect} from "react";
import {Form} from "react-bootstrap";
import {bindActionCreators} from "redux";
import {CommonApiService} from "../../../api-kit/common/common-api.service";
import {UserApiService} from "../../../api-kit/user/user-api.service";
import {isFormSubmitted} from "../../../service/validation.service";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import {UserUtils} from "../../../utils/UserUtils";
import { formatExtension } from "../../../ui-kit/utilities/FormatUtil";
import {SalesUserDTO} from "../../models/SalesUser";
import UserProfileForSalesUserInformation from "./profile-sales-user-information/UserProfileForSalesUserInformation";
import {UserProfileForSalesUserInformationStateJson} from "./profile-sales-user-information/UserProfileForSalesUserInformationState";
import UserProfileForSalesUserRoles from "./profile-sales-user-roles/UserProfileForSalesUserRoles";
import {UserProfileForSalesUserRolesStateJson} from "./profile-sales-user-roles/UserProfileForSalesUserRolesState";
import {UserProfileForSalesUserTypeStateJson} from "./profile-sales-user-type/UserProfileForSalesUserTypeState";
import UserProfilerForSalesUserType from "./profile-sales-user-type/UserProfilerForSalesUserType";
import UserProfileForSalesUserZone from "./profile-sales-user-zone/UserProfileForSalesUserZone";
import {UserProfileForSalesUserZoneStateJson} from "./profile-sales-user-zone/UserProfileForSalesUserZoneState";
import {UserProfileSaleContext} from "./UserProfileForSalesContext";
import UserProfileForSalesUserButtons from "./UserProfileForSalesUserButtons";
import {userProfileForSalesUserFormStateDefault} from "./UserProfileForSalesUserFormState";
import UserProfileForSalesUserSideNav from "./UserProfileForSalesUserSideNav";
import {connect} from "react-redux";
import {Paths} from "../../Router";
import {addToast} from "../../../_redux/_actions/toast.actions"

interface EditProfileForSalesUserProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

export function EditProfileForSalesUser(props: EditProfileForSalesUserProps) {
  const commonApiService = new CommonApiService();
  const userApiService = new UserApiService();
  const ALL_REGIONS = [['1','2','3'],['4','5'],['6','7','8'],['10a','9'],[],['W']];
  const ALL_ZONES = ["Mid Atlantic Zone","Southeast - Great Lakes Zone","Southwest - Central Zone",
                      "Pacific Rim Zone","National Capital Zone","Central Office/Headquarters"];
    const {
        salesUserProfileInformationState,
        updateSalesUserProfileInformationState,
        salesUserProfileFormState,
        updateSalesUserProfileFormState,
        salesProfileUserTypeState,
        updateSalesProfileUserTypeState,
        salesProfileUserRolesState,
        updateSalesProfileUserRolesState,
        salesProfileUserZoneState,
        updateSalesProfileUserZoneState,

    }= useContext(UserProfileSaleContext);

    const items = [
      {
        title: "User Information - " + UserUtils.getSalesUserId(),
        content: <UserProfileForSalesUserInformation/>,
        expanded: true,
        id: "userInformation",
        trigger: "common",
      },
      {
        title: "Type of User",
        content: <UserProfilerForSalesUserType/>,
        expanded: true,
        id: "typeOfUser",
        trigger: "common",
      },
      {
        title: "User Roles",
        content: <UserProfileForSalesUserRoles/>,
        expanded: true,
        id: "userRoles",
        trigger: "common",
      },
      {
        title: "Zone Information",
        content: <UserProfileForSalesUserZone/>,
        expanded: true,
        id: "userZones",
        trigger: "common",
      }
    ];

  useEffect(() => {
    setDefaultValues();
  }, []);


  function setDefaultValues() {
    isFormSubmitted.next(false);
    updateSalesUserProfileFormState(userProfileForSalesUserFormStateDefault);
    const data = {
      params: {
        userId: UserUtils.getSalesUserId(),
      },
    };

    Promise.all([userApiService.getSalesUser(data), userApiService.getAllSalesRoles()]).then(values => {
      let salesUserResponse = values[0];
      let salesRolesResponse = values[1];

      updateSalesUserProfileInformationState({
        id: salesUserResponse?.data?.id,
        firstName: salesUserResponse?.data?.firstName,
        middleName: salesUserResponse?.data?.middleName,
        lastName: salesUserResponse?.data?.lastName,
        phoneNumber: formatPhoneprops(salesUserResponse?.data?.phoneNumber),
        phoneExtension: formatExtension(salesUserResponse?.data?.phoneExt),
        emailAddress: salesUserResponse?.data?.emailAddress,
        confirmEmailAddress: salesUserResponse?.data?.emailAddress,
        salesUserAddress1: salesUserResponse?.data?.line1,
        salesUserAddress2: salesUserResponse?.data?.line2,
        salesUserAddress3: salesUserResponse?.data?.line3,
        salesUserCity: salesUserResponse?.data?.city,
        salesUserStateCode: salesUserResponse?.data?.locationState,
        salesUserZipCode: salesUserResponse?.data?.zipCode,
        salesUserZip2Code: salesUserResponse?.data?.zip2,
      })

      let roles = salesUserResponse?.data?.userRoles || [];
      roles = salesRolesResponse?.data?.filter(role => roles.indexOf(role.roleCd) > -1)
        .map(role => role);
      updateSalesProfileUserRolesState({
        userRoles: roles,
        warrantLimit: salesUserResponse?.data?.warrantLimit
      });

      updateSalesProfileUserTypeState({
        userType: salesUserResponse?.data?.userType
      });
      commonApiService
        .getZoneList()
        .then((resp: any) => {

          let addedZonesList = [];
          salesUserResponse?.data?.userZones.forEach((z) => {
            commonApiService
              .getZoneRegions(z.zoneCode)
              .then((response: any) => {
                let zoneRegions = [];
                let isLoggedInUserFmu = UserUtils.getLoggedInSalesUserType() === 'FMU'
                response?.data.forEach((region) => {
                  if(isLoggedInUserFmu) {
                    zoneRegions.push(region?.regionDescription)
                  } else {
                    zoneRegions.push(region?.regionCode)
                  }
                });
                addedZonesList.push({
                  zoneCode: z.zoneCode,
                  zoneName: resp?.data?.find((zone) => zone.zoneId.toString() === z.zoneCode.toString()).zoneName,
                  regions: zoneRegions.join(),
                  isZoneDefault: (addedZonesList.length === 0),
                });
                updateSalesProfileUserZoneState({zoneList: addedZonesList});
              });
          });
        })
    }).catch(error => {
      console.log(error);
    });
    }
    return (
        <StrictMode>
          <div className={"grid-row ui-ppms"}>
            <div className="header-row grid-row grid-gap-4">
              <h1>MY PROFILE</h1>
            </div>
            <div className="usa-layout-docs__sidenav desktop:grid-col-3">
              <div className={`sticky-wrapper`}>
                <div className={"sticky-inner"}>
                  <nav aria-label="Secondary navigation">
                    <h3>Form Tracker</h3>
                    <UserProfileForSalesUserSideNav />
                  </nav>
                </div>
              </div>
            </div>

            <div
              className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs"
              id="edit-sales-users"
            >

              <Form
                noValidate
                className={"usa-accordion--bordered desktop:grid-col-8"}
                validated={salesUserProfileFormState.isFormValidated}
                onSubmit={handleSubmit}>
                <div className={"grid-row grid-col-12"}>
                  <div className={"grid-row grid-gap-2"}>
                    <UserProfileForSalesUserButtons
                      isSubmitDisabled={salesUserProfileFormState.isSubmitDisabled}
                      isSubmitLoading={salesUserProfileFormState.isSubmitLoading}
                      onCancelClick={handleCancel}
                    />
                  </div>
                </div>
                <br />
                <PPMSAccordion bordered={true} items={items}/>
                <br/>
                <div className={"grid-row grid-gap-2"}>
                  <UserProfileForSalesUserButtons
                    isSubmitDisabled={salesUserProfileFormState.isSubmitDisabled}
                    isSubmitLoading={salesUserProfileFormState.isSubmitLoading}
                    onCancelClick={handleCancel}
                  />
                </div>
              </Form>
            </div>
          </div>
        </StrictMode>
      );

      function toJSON(): SalesUserDTO {
        let salesUserType = UserProfileForSalesUserTypeStateJson(salesProfileUserTypeState)[0],
          salesUserInformation = UserProfileForSalesUserInformationStateJson(salesUserProfileInformationState)[0],
          salesUserRoles = UserProfileForSalesUserRolesStateJson(salesProfileUserRolesState)[0],
          salesUserZone = UserProfileForSalesUserZoneStateJson(salesProfileUserZoneState)[0];

        return ({
          id: salesUserInformation.id,
          userType: salesUserType.salesUserType,
          firstName: salesUserInformation.firstName,
          middleName: salesUserInformation.middleName,
          lastName: salesUserInformation.lastName,
          emailAddress: salesUserInformation.emailAddress,
          phoneNumber: (salesUserInformation.phoneNumber),
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
        } as unknown) as SalesUserDTO;
      }


  function handleSubmit(event: any) {
    isFormSubmitted.next(true);
    event.preventDefault();

    updateSalesUserProfileFormState({
      isSubmitLoading: true,
      isSubmitDisabled: true
    });

    const data: SalesUserDTO = toJSON();
    const {addToast} = props.actions;

    userApiService
      .registerSalesUser(data)
      .then(() => {
        console.log("api call");
        updateSalesUserProfileFormState({
          isSubmitLoading: false,
          isSubmitDisabled: false,
        });
        addToast({
          text: "User Profile Successfully Updated!",
          type: "success",
          heading: "Success",
        });
        props.history.push({
          pathname: `${Paths.home}`,
        });
      }).catch(() => {
      updateSalesUserProfileFormState({
        showErrorAlert: true,
        isSubmitLoading: false,
        isSubmitDisabled: false,
      });
    });
  }

      function handleCancel() {
        isFormSubmitted.next(false);
        props.history.push({
          pathname: `${Paths.home}`,
        });
      }


     function formatPhoneprops (value)  {

      if(!value){
          return;
      }
        value = "" +value;
        const input = value.replace(/[^0-9]/g, "").substring(0, 10);
        if (value.length === 0 || input.length === 0) {
          return "";
        }
        const first = input.substring(0, 3);
        const middle = input.substring(3, 6);
        const last = input.substring(6, 10);
        if (input.length > 6) {
          value = `(${first}) ${middle}-${last}`;
        } else if (input.length > 3) {
          value = `(${first}) ${middle}`;
        } else if (input.length > 0) {
          value = `(${first}`;
        }
        return value;
      };

}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({addToast}, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(EditProfileForSalesUser);
