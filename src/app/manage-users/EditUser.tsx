import React from "react";
import { Form, FormLabel } from "react-bootstrap";
import { PPMSFirstNameLastName } from "../../ui-kit/components/PPMS-firstname-lastname";
import { PPMSPhoneNumber } from "../../ui-kit/components/PPMS-phone-number";
import { PPMSZip } from "../../ui-kit/components/PPMS-zip";
import { PPMSState } from "../../ui-kit/components/PPMS-state";
import { PPMSAacAgency } from "../../ui-kit/components/PPMS-aac-agency";
import { UserApiService } from "../../api-kit/user/user-api.service";
import { PPMSAlert } from "../../ui-kit/components/common/PPMS-alert";
import { PPMSEmailConfirm } from "../../ui-kit/components/PPMS-email-confirm";
import { accessLevelType } from "../../constants/Constants";
import { UserUtils } from "../../utils/UserUtils";
import { NuoEditUser } from "../models/User";
import { PPMSButton } from "../../ui-kit/components/common/PPMS-button";
import PPMSChecklist from "../../ui-kit/components/PPMS-checklist";
import { CommonApiService } from "../../api-kit/common/common-api.service";
import { Paths } from "../Router";
import { PPMSEmail } from "../../ui-kit/components/PPMS-email";
import { PPMSInput } from "../../ui-kit/components/common/input/PPMS-input";
import { PPMSAccordion } from "../../ui-kit/components/common/accordion/PPMS-accordion";

import {
  validateZipState,
  zipInvalidStateMessage,
} from "../../ui-kit/components/validations/FieldValidations";
import {
  formatExtension,
  formatPhone,
} from "../../ui-kit/utilities/FormatUtil";
import { PPMSToggleRadio } from "../../ui-kit/components/common/toggle/PPMS-toggle";
import { isFormSubmitted } from "../../service/validation.service";
import SideNav from "./SideNav";
import ManageUserButtons from "./ManageUserButtons";
import PPMSDatatable from "../../ui-kit/components/common/datatable/PPMS-datatable";
import { UploadDocuments } from "./upload/UploadDocuments";
import { PPMSAddress } from "../../ui-kit/components/PPMS-address";
import { PPMSAnyTextField } from "../../ui-kit/components/PPMS-any-text-field";
import PPMSUserProfilePermissions from "../../ui-kit/components/user/PPMS-user-profile-permissions";

export const yesOrNoOptions = [
  { value: "Yes", id: "Y", isSelected: false },
  { value: "No", id: "N", isSelected: false },
];

export interface NuoEditState {
  id: string;
  showErrorAlert: boolean;
  FormErrorMessage: string;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  isFormValidated: boolean;
  aacCode: string;
  aacLabel: string;
  agencyBureau: string;
  firstName: string;
  firstNameInvalid: boolean;
  middleName: string;
  lastName: string;
  lastNameInvalid: boolean;
  phoneNumber: string;
  phoneExtension: string;
  isPhoneInvalid: boolean;
  isPhoneValid: boolean;
  phoneValidationMessage: string;
  state: string;
  stateIsInvalid: boolean;
  stateFilter: string;
  zip: string;
  zipExtension: string;
  currentUserEmailAddress: string;
  emailAddress: string;
  confirmEmailAddress: string;
  isRegistrationEmailInvalid: boolean;
  isRegistrationEmailConfirmInvalid: boolean;
  emailValidationMessage: string;
  confirmDisabled: boolean;
  confirmEmailValidationMessage: string;
  showDocuments: boolean;
  // AO Information
  aoFirstName: string;
  aoFirstNameIsInvalid: boolean;
  aoMiddleName: string;
  aoLastName: string;
  aoLastNameIsInvalid: boolean;
  aoPhoneNumber: string;
  aoPhoneExtension: string;
  aoEmailAddress: string;
  aoStateIsValid: boolean;
  aoStateIsInvalid: boolean;
  aoZipCodeIsInvalid: boolean;
  aoZipCodeIsValid: boolean;
  aoEmail: string;
  aoState: string;
  aoZipcode: string;
  aoEmailValidationMessage: string;
  isAOEmailValid: boolean;
  isAOEmailInvalid: boolean;
  approvingOfficialInfo: any;
  // NUO Information
  nuoEmailAddress: string;
  nuoConfirmEmailAddress: string;
  hasSecurityAccess: boolean;
  fedContractorNonFedRecipientDonee: boolean;
  userAccess: Array<any>;
  permissionArray: any;
  fullListOfPermissionArray: any;
  permissionCodes: Array<any>;
  internalAgencyPermissions: Array<any>;
  nuoArray: Array<any>;
  aacCodes: Array<any>;
  isAACValid: boolean;
  agencyBureauLongName: string;
  isInternalAgency: boolean;
  isPrimaryAacSelected: boolean;
  activeAacCodes: Array<any>;
  allAACDeleted: boolean;
  alertBodyArray: string[];
  yesOrNoOptions: any[];
  zipIsValid: boolean;
  zipIsInvalid: boolean;
  zipValidationError: string;
  accordion: any;

  fiAddress1: string;
  fiAddress1IsInvalid: boolean;
  fiAddress1IsValid: boolean;
  fiAddress1ValidationMessage: string;
  fiAddress2: string;
  fiAddress2IsInvalid: boolean;
  fiAddress2IsValid: boolean;
  fiAddress2ValidationMessage: string;
  fiAddress3: string;
  fiAddress3IsInvalid: boolean;
  fiAddress3IsValid: boolean;
  fiAddress3ValidationMessage: string;
  fiCity: string;
  fiCityIsInvalid: boolean;
  fiCityIsValid: boolean;
  fiCityValidationMessage: string;
  fiState: string;
  fiStateCode: string;
  fiStateIsInvalid: boolean;
  fiStateIsValid: boolean;
  fiStateValidationMessage: string;
  fiZip1: string;
  fiZip1Code: string;
  fiZip1IsInvalid: boolean;
  fiZip1IsValid: boolean;
  fiZip1ValidationMessage: string;
  fiZip2: string;
  fiZip2Code: string;
  fiZip2IsInvalid: boolean;
  fiZip2IsValid: boolean;
  fiZip2ValidationMessage: string;
  fiDisableExtension: boolean;
  fiAddressId: string;
  fiLeadId: string;
  fiDoneeOrganizationName: string;
  fiDoneeOrganizationNameIsInvalid: boolean;
  fiDoneeOrganizationNameIsValid: boolean;
  fiDoneeOrganizationNameValidationMessage: string;
  fiTitle: string;
  fiTitleIsInvalid: boolean;
  fiTitleIsValid: boolean;
  fiTitleValidationMessage: string;

  fileInfectedStatus?: boolean;
}

interface EditUserProps {
  icn: any;
  match: any;
  location: any;
  history: any;
  context: any;
}

export class EditUser extends React.Component<EditUserProps, NuoEditState> {
  private userApiService: UserApiService = new UserApiService();
  private commonApiService = new CommonApiService();
  accessLevelType = accessLevelType;

  constructor(props: EditUserProps) {
    super(props);
    this.state = {
      id: "",
      showErrorAlert: false,
      FormErrorMessage: "",
      isSubmitLoading: false,
      isSubmitDisabled: false,
      isFormValidated: false,
      aacCode: "",
      aacLabel: "",
      agencyBureau: "",
      firstName: "",
      firstNameInvalid: false,
      middleName: "",
      lastName: "",
      lastNameInvalid: false,
      phoneNumber: "",
      phoneExtension: "",
      isPhoneInvalid: false,
      isPhoneValid: true,
      phoneValidationMessage: "",
      state: "",
      stateIsInvalid: false,
      stateFilter: "",
      zip: "",
      zipExtension: "",
      currentUserEmailAddress: "",
      emailAddress: "",
      confirmEmailAddress: "",
      isRegistrationEmailInvalid: false,
      isRegistrationEmailConfirmInvalid: false,
      emailValidationMessage: "Email is Required",
      confirmEmailValidationMessage: "Confirm Email is Required",
      confirmDisabled: true,
      showDocuments: false,
      // AO Information
      aoFirstName: "",
      aoFirstNameIsInvalid: false,
      aoMiddleName: "",
      aoLastName: "",
      aoLastNameIsInvalid: false,
      aoPhoneNumber: "",
      aoPhoneExtension: "",
      aoEmailAddress: "",
      aoStateIsValid: false,
      aoStateIsInvalid: false,
      aoZipCodeIsInvalid: false,
      aoZipCodeIsValid: false,
      aoEmail: "",
      aoState: "",
      aoZipcode: "",
      aoEmailValidationMessage: "",
      isAOEmailValid: false,
      isAOEmailInvalid: false,
      approvingOfficialInfo: [],
      // NUO Information
      nuoEmailAddress: "",
      nuoConfirmEmailAddress: "",
      fedContractorNonFedRecipientDonee: false,
      hasSecurityAccess: false,
      userAccess: [],
      permissionArray: [],
      fullListOfPermissionArray: [],
      internalAgencyPermissions: [],
      permissionCodes: [],
      nuoArray: [],
      aacCodes: [],
      isAACValid: false,
      agencyBureauLongName: "",
      isPrimaryAacSelected: false,
      activeAacCodes: [],
      allAACDeleted: false,
      alertBodyArray: [],
      isInternalAgency: false,
      yesOrNoOptions: yesOrNoOptions,
      zipIsValid: false,
      zipIsInvalid: false,
      zipValidationError: "",
      accordion: {
        toggleAllAccordion: true,
        toggleAACAccordion: true,
        toggleUserAccordion: true,
        toggleNUOAccordion: true,
        togglePermissionAccordion: true,
        toggleAOAccordion: true,
        toggleFIAccordion: true,
        openItems: [
          "toggleAACAccordion",
          "toggleUserAccordion",
          "toggleNUOAccordion",
          "togglePermissionAccordion",
          "toggleAOAccordion",
          "toggleFIAccordion",
        ],
      },
      // Donee organization
      fiAddress1: "",
      fiAddress1IsInvalid: false,
      fiAddress1IsValid: false,
      fiAddress1ValidationMessage: "",
      fiAddress2: "",
      fiAddress2IsInvalid: false,
      fiAddress2IsValid: false,
      fiAddress2ValidationMessage: "",
      fiAddress3: "",
      fiAddress3IsInvalid: false,
      fiAddress3IsValid: false,
      fiAddress3ValidationMessage: "",
      fiCity: "",
      fiCityIsInvalid: false,
      fiCityIsValid: false,
      fiCityValidationMessage: "",
      fiState: "",
      fiStateCode: "",
      fiStateIsInvalid: false,
      fiStateIsValid: false,
      fiStateValidationMessage: "",
      fiZip1: "",
      fiZip1Code: "",
      fiZip1IsInvalid: false,
      fiZip1IsValid: false,
      fiZip1ValidationMessage: "",
      fiZip2: "",
      fiZip2Code: "",
      fiZip2IsInvalid: false,
      fiZip2IsValid: false,
      fiZip2ValidationMessage: "",
      fiDisableExtension: false,
      fiAddressId: "",
      fiLeadId: "",
      fiDoneeOrganizationName: "",
      fiDoneeOrganizationNameIsInvalid: false,
      fiDoneeOrganizationNameIsValid: false,
      fiDoneeOrganizationNameValidationMessage: "",
      fiTitle: "",
      fiTitleIsInvalid: false,
      fiTitleIsValid: false,
      fiTitleValidationMessage: "",

      fileInfectedStatus: false,
    } as NuoEditState;
    this.handleSort = this.handleSort.bind(this);
  }

  disablePermission = () => {
    let { permissionArray, aacCodes } = this.state;

    let agencyBureauCds = aacCodes.map(
      (activeAacCode) => activeAacCode.agencyBureauCd
    );
    const includesInArray = agencyBureauCds.includes("1223" || "1291");
    if (permissionArray) {
      permissionArray.permissions.forEach((groupPermission: any) => {
        groupPermission.permissionList.forEach((permission) => {
          let isPresent =
            permission.permissionCode.includes("FS") && !includesInArray;
          if (permission.permissionCode.includes("FS")) {
            if (isPresent) {
              permission.isDisabled = true;
            } else {
              permission.isDisabled = false;
            }
          }
        });
      });

      this.setState({
        permissionArray,
      });
    }
  };

  setStateForSaspAdminUser() {
    let stateCode = UserUtils.getUserStateCode();
    if (stateCode) {
      new CommonApiService()
        .getStateNameFromCode(stateCode)
        .then((response: any) => {
          this.setState({
            state: response.data.stateCode,
          });
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }

  setPermissions() {
    const userPermissions = UserUtils.getUserPermissions();
    const hasAccess = userPermissions.find(
      (role) => role === this.accessLevelType.SM
    );
    this.setState({
      hasSecurityAccess: !!hasAccess,
    });
    this.userApiService
      .getGrantPermissions()
      .then((response: any) => {
        let permissionArray = { permissions: [] },
          fullListOfPermissionArray = [];
        let { internalAgencyPermissions } = this.state;

        const isAdmin = userPermissions.find(
          (role) =>
            role === this.accessLevelType.SM || role === "NU" || role === "AC"
        );
        fullListOfPermissionArray = response.data;
        let internalPermArr = response.data.permissions.filter(
          (groupPermission) =>
            groupPermission.group === "Agency Internal Screening"
        );
        if (internalPermArr && internalPermArr.length > 0) {
          internalPermArr[0].permissionList.forEach((permission) => {
            internalAgencyPermissions.push(permission.permissionCode);
          });
        }

        if (isAdmin && !this.state.isInternalAgency) {
          permissionArray.permissions = response.data.permissions.filter(
            (groupPermission) =>
              groupPermission.group !== "Agency Internal Screening"
          );
        } else {
          permissionArray.permissions = response.data.permissions;
        }

        this.setState({
          permissionArray: permissionArray,
          fullListOfPermissionArray: fullListOfPermissionArray,
          internalAgencyPermissions,
        });

        if (UserUtils.getUserRoles().includes("CO")) {
          permissionArray = this.state.permissionArray;
          permissionArray.permissions.forEach((groupPermission: any) => {
            groupPermission.permissionList.forEach((permission) => {
              if (this.state.permissionCodes.includes(permission)) {
                permission.isSelected = true;
              }
              let isPresent = permission.permissionCode.includes("PC");
              if (isPresent) {
                permission.isDisabled = false;
              } else {
                permission.isDisabled = true;
              }
            });
          });
          internalPermArr[0].permissionList.forEach((permission) => {
            permission.isDisabled = true;
          });
          this.setState({
            permissionArray,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    if (UserUtils.isUserSaspAdmin()) {
      this.setStateForSaspAdminUser();
    }
  }

  componentWillMount() {
    this.setPermissions();
    const data = {
      params: {
        userAccountId: this.props.match.params.userAccountId,
      },
    };

    this.userApiService
      .getUser(data)
      .then((response: any) => {
        let approvingOfficialData = response?.data?.approvingOfficial;
        let approvingOfficialInfo = {
          firstName: response?.data?.approvingOfficial?.firstName,
          lastName: response?.data?.approvingOfficial?.lastName,
          emailAddress: response?.data?.approvingOfficial?.emailAddress,
          phoneNumber: response?.data?.approvingOfficial?.phoneNumber,
        };
        let leaInformationDTO = response?.data?.leaInformationDTO;
        if (!UserUtils.getUserRoles().includes("CO")) {
          if (response.data.leaUserId) {
            this.setState({
              showDocuments: true,
            });
          }
        } else {
          this.setState({
            showDocuments: false,
          });
        }

        this.setState({
          aacCode: response?.data?.aac,
          id: response?.data?.id,
          firstName: response?.data?.firstName,
          middleName: response?.data?.middleName,
          lastName: response?.data?.lastName,
          phoneNumber: formatPhone(response?.data?.phoneNumber + ""),
          phoneExtension: formatExtension(response?.data?.phoneExt + ""),
          state: response?.data?.locationState,
          zip: response?.data?.zipCode,
          currentUserEmailAddress: response?.data?.emailAddress,
          emailAddress: response?.data?.emailAddress,
          confirmEmailAddress: response?.data?.emailAddress,
          aoFirstName: approvingOfficialData?.firstName,
          aoMiddleName: approvingOfficialData?.middleName,
          aoLastName: approvingOfficialData?.lastName,
          aoPhoneNumber: approvingOfficialData?.phoneNumber
            ? formatPhone(approvingOfficialData?.phoneNumber + "")
            : "",
          aoPhoneExtension: approvingOfficialData?.phoneExt
            ? formatExtension(approvingOfficialData?.phoneExt + "")
            : "",
          aoEmail: approvingOfficialData?.emailAddress,
          aoEmailAddress: approvingOfficialData?.emailAddress,
          aoState: approvingOfficialData?.locationState,
          aoZipcode: approvingOfficialData?.zipCode,
          fedContractorNonFedRecipientDonee:
            response?.data?.fedContractorNonFedRecipientDonee,
          fiAddress1: leaInformationDTO?.addressLine1,
          fiAddress2: leaInformationDTO?.addressLine2,
          fiAddress3: leaInformationDTO?.addressLine3,
          fiCity: leaInformationDTO?.city,
          fiStateCode: leaInformationDTO?.stateCode,
          fiZip1Code: leaInformationDTO?.zip,
          fiZip2Code: leaInformationDTO?.zipExtension,
          fiState: leaInformationDTO?.locationState,
          fiAddressId: leaInformationDTO?.addressId,
          fiLeadId: leaInformationDTO?.leaId,
          fiDoneeOrganizationName: leaInformationDTO?.doneeOrganizationName,
          fiTitle: leaInformationDTO?.title,
          approvingOfficialInfo: [approvingOfficialInfo],
        });

        //set the Fedaral yes or no for apo user.
        if (UserUtils.isUserApo()) {
          let yesOrNoOptions = [
            {
              value: "Yes",
              id: "Y",
              isSelected: response?.data?.fedContractorNonFedRecipientDonee,
            },
            {
              value: "No",
              id: "N",
              isSelected: !response?.data?.fedContractorNonFedRecipientDonee,
            },
          ];
          this.setState({ yesOrNoOptions });
        }

        //looping through the acccodes.
        if (response?.data?.aacCodes) {
          const aacCodesJson = response?.data?.aacCodes;
          aacCodesJson.forEach((accCodeData: any) => {
            const data = {
              params: {
                agencyCode: accCodeData.aac,
              },
            };
            //getBureau api to get the agency bureauLongName.

            if (!UserUtils.isUserSaspAdmin()) {
              this.commonApiService
                .getBureau(data)
                .then((response: any) => {
                  this.setState({
                    agencyBureau: accCodeData.agencyBureauCd,
                    isAACValid: true,
                    isPrimaryAacSelected: accCodeData.primaryInd,
                    aacCode: accCodeData.aac,
                  });
                  this.setState({
                    agencyBureauLongName: (
                      accCodeData.agencyBureauCd +
                      " - " +
                      response.data.longName
                    ).trim(),
                    isInternalAgency: response.data.isInternalAgency,
                  });
                  //to add acccodes to the datatable in add acc code.
                  this.handleAddAAC(accCodeData.id, accCodeData.activeInd);
                })
                .catch((error: any) => {
                  console.log("agencyBureau API Error", error);
                });
            } else {
              this.commonApiService
                .getBureauFromPropertyAgencyContact(data)
                .then((response) => {
                  this.setState({
                    isPrimaryAacSelected: true,
                    aacCode: accCodeData.aac,
                    agencyBureauLongName:
                      response?.data?.code +
                      " - " +
                      response?.data?.longName.trim(),
                  });
                })
                .catch((error) => {
                  console.log(
                    "getBureauFromPropertyAgencyContact API Error",
                    error
                  );
                });
            }
          });
        }
      })
      .catch((error: any) => {
        console.log("getuser error", error);
      });

    this.userApiService
      .getUserPermission(data)
      .then((response: any) => {
        this.setState({
          permissionCodes: response?.data,
        });
        this.setGSAPermissions();
      })
      .catch((error: any) => { });
  }

  nuoAssign = async (aacCodes) => {
    // const aacCodes = [...this.state.aacCodes];
    let selectedAgencyBureauCd = "";
    aacCodes.forEach((o) => {
      if (o.primaryInd) {
        selectedAgencyBureauCd = o.agencyBureauCd;
      }
    });
    this.setState({ aacCodes: aacCodes });
    if (
      this.state.hasSecurityAccess ||
      UserUtils.getUserRoles().includes("CO")
    ) {
      const data = {
        params: {
          agencyBureauCd: selectedAgencyBureauCd,
        },
      };
      this.userApiService
        .getNuoContactForAgencyBureau(data)
        .then((response) => {
          this.setState({
            nuoArray: response.data,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  setGSAPermissions = () => {
    const permissionCodes = [...this.state.permissionCodes];
    let { permissionArray } = this.state;
    permissionArray.permissions.forEach((groupPermission: any) => {
      groupPermission.permissionList.forEach((permission) => {
        var isPresent = permissionCodes.includes(permission.permissionCode);
        if (isPresent) {
          permission.isSelected = true;
        } else {
          permission.isSelected = false;
        }
      });
    });
    this.setState({
      permissionArray,
    });
  };

  componentWillUnmount() {
    isFormSubmitted.next(false);
  }

  handleSort = (sortBy) => { };

  handleSubmit = (event: any) => {
    let validationMessages = [];
    let validatePermission = this.validatePermission(validationMessages);
    if (this.state.zipIsInvalid) {
      validationMessages.push(this.state.zipValidationError);
    }
    isFormSubmitted.next(true);
    let validateAacCodes =
      !UserUtils.isUserSaspAdmin() && this.validateAacCodes(validationMessages);

    let filteredArray = validationMessages.filter((item, index) => {
      return validationMessages.indexOf(item) === index;
    });

    this.setState({
      alertBodyArray: filteredArray,
    });

    event.preventDefault();
    this.setState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
    });
    const form = event.currentTarget;
    if (
      !validatePermission ||
      validateAacCodes ||
      form.checkValidity() === false ||
      validationMessages.length > 0
    ) {
      event.stopPropagation();
      this.setState({
        isSubmitLoading: false,
        isSubmitDisabled: false,
        showErrorAlert: true,
      });
    } else {
      this.setState({
        showErrorAlert: false,
      });
      const data: NuoEditUser = this.toJSON(this.state);
      this.userApiService
        .editNuoUser(data)
        .then((response: any) => {
          this.setState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
          if (this.props.match.params.FICheck) {
            this.props.history.push({
              pathname: `${Paths.lealist}`,
              successMessage: "User successfully added!",
            });
          } else {
            if (UserUtils.getUserRoles().includes("CO")) {
              this.props.history.push({
                pathname: `${Paths.propertyCustodianUser}`,
                successMessage: "User successfully added!",
              });
            } else {
              this.props.history.push({
                pathname: `${Paths.usersList}`,
                successMessage: "User successfully added!",
              });
            }
          }
        })
        .catch((error: any) => {
          this.setState({
            FormErrorMessage: error?.data?.message ? error?.data?.message : "",
            showErrorAlert: true,
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
        });
    }
  };

  validateAacCodes = (validationMessages) => {
    const selectPrimaryAacMessage =
      "Select one primary AAC using the radio option";
    const addAacCodeMessage = "At least one AAC code needs to be added";

    if (this.state.aacCodes.length > 0) {
      const checkAacPrimary = this.state.aacCodes.find((o) => {
        return o.primaryInd === true;
      });
      if (checkAacPrimary) {
        this.setState({ FormErrorMessage: "" });
        return false;
      } else {
        this.setState({ FormErrorMessage: selectPrimaryAacMessage });
        validationMessages.push(selectPrimaryAacMessage);
        return true;
      }
    } else {
      this.setState({
        FormErrorMessage: addAacCodeMessage,
        isAACValid: false,
      });
      validationMessages.push(addAacCodeMessage);
      return true;
    }
  };

  validatePermission = (validationMessages) => {
    const selectPermissionMessage =
      "At least one permission needs to be selected";

    if (this.state.permissionCodes.length > 0) {
      this.setState({ FormErrorMessage: "" });
      return true;
    } else {
      validationMessages.push(selectPermissionMessage);
      return false;
    }
  };

  toJSON = (state: NuoEditState): NuoEditUser => {
    return {
      id: state.id,
      firstName: state.firstName,
      lastName: state.lastName,
      middleName: state.middleName,
      emailAddress: state.emailAddress,
      aac: state.aacCode,
      aacCodes: state.activeAacCodes,
      agencyBureauCd: state.agencyBureau,
      phoneNumber: state.phoneNumber.replace(/[^0-9]/g, ""),
      phoneExt: state.phoneExtension.replace(/[^0-9]/g, ""),
      zipCode: state.zip,
      locationState: state.state,
      nuoEmailAddress: state.nuoEmailAddress,
      approvingOfficialEmail: state.aoEmail,
      fedContractorNonFedRecipientDonee:
        state.fedContractorNonFedRecipientDonee,
      permissions: state.permissionCodes,
      leaInformationDTO: {
        leaId: state.fiLeadId,
        addressId: state.fiAddressId,
        doneeOrganizationName: state.fiDoneeOrganizationName,
        title: state.fiTitle,
        addressLine1: state.fiAddress1,
        addressLine2: state.fiAddress2,
        addressLine3: state.fiAddress3,
        city: state.fiCity,
        stateCode: state.fiStateCode,
        zip: state.fiZip1Code,
        zipExtension: state.fiZip2Code,
      },
      approvingOfficial: {
        firstName: state.aoFirstName,
        lastName: state.aoLastName,
        middleInitial: state.aoMiddleName,
        phoneNumber: state.aoPhoneNumber.replace(/[^0-9]/g, ""),
        emailAddress: state.aoEmailAddress,
      },
    } as NuoEditUser;
  };

  nuoColumns = [
    {
      Header: "NUO First Name",
      accessor: "firstName",
    },
    {
      Header: "NUO Last Name",
      accessor: "lastName",
    },
    {
      Header: "NUO Email",
      accessor: "email",
    },
  ];

  apoColumns = [
    {
      Header: "First Name",
      accessor: "firstName",
    },
    {
      Header: "Last Name",
      accessor: "lastName",
    },
    {
      Header: "Email",
      accessor: "emailAddress",
    },
    {
      Header: "Phonenumber",
      accessor: "phoneNumber",
    },
  ];

  columns = [
    {
      Header: "Select Primary",
      id: "select-primary",
      Cell: (aac) => (
        <RadioBtn aac={aac} onChange={() => this.handlePrimaryAac(aac)} />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      Header: "AAC Code",
      accessor: "aac",
    },
    {
      Header: "Agency/Bureau",
      accessor: "agencyBureau",
    },
    {
      Header: "Actions",
      id: "active-inactive-aac",
      Cell: (aac) => (
        <PPMSButton
          id={"active-inative"}
          label={aac.cell.row.original.activeInd ? "Active" : "InActive"}
          variant={aac.cell.row.original.activeInd ? "primary" : "secondary"}
          size={"sm"}
          isDisabled={aac.cell.row.original.primaryInd ? true : false}
          onPress={async () => {
            const aacCodes = [...this.state.aacCodes];
            const aacIndex = aacCodes.findIndex(
              (o) => o.aac === aac.row.values.aac
            );
            aacCodes[aacIndex].activeInd = !aacCodes[aacIndex].activeInd;
            let activeAacCodes = [...aacCodes];
            this.setState({
              aacCodes: aacCodes,
              activeAacCodes: activeAacCodes,
            });
          }}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      grow: 2,
    },
  ];

  handleAddAAC = async (id: any, activeInd: boolean) => {
    //add validation
    let aacCodes = [...this.state.aacCodes];
    let isUserSaspAdmin = UserUtils.isUserSaspAdmin();
    let isAacAdded = aacCodes.find((o) => {
      if (o.aac === this.state.aacCode) {
        return true;
      } else return false;
    });
    if (isAacAdded && !isUserSaspAdmin) {
      this.setState({
        FormErrorMessage: "AAC Code already exists",
        showErrorAlert: true,
      });
    } else {
      //this is to ensure that only 1 aac code is passed to the back end
      if (!isUserSaspAdmin) {
        aacCodes.push({
          id: id,
          aac: this.state.aacCode,
          agencyBureau: this.state.agencyBureauLongName,
          primaryInd: this.state.isPrimaryAacSelected,
          agencyBureauCd: this.state.agencyBureau,
          activeInd: activeInd,
          isInternalAgency: this.state.isInternalAgency,
        });
        if (this.state.isPrimaryAacSelected) {
          this.nuoAssign(aacCodes);
        }
        let resetPermission = this.state.permissionArray;
        resetPermission = await this.resetPermission(aacCodes);
        this.setState({
          aacCodes: aacCodes,
          aacCode: "",
          agencyBureau: "",
          FormErrorMessage: "",
          showErrorAlert: false,
          activeAacCodes: [...aacCodes],
          isAACValid: false,
          isInternalAgency: !!aacCodes.find(
            (code) => code.isInternalAgency === true
          ),
          permissionArray: resetPermission,
        });
        this.disablePermission();
      }
    }
  };

  resetPermission = (aacCodes) => {
    let {
      permissionArray,
      permissionCodes,
      fullListOfPermissionArray,
    } = this.state;
    //changed , no disable , hide it or remove internalAgency permissions from permission array
    const userPermissions = UserUtils.getUserPermissions();
    //get user role - Agency Internal Screening permissions are valid only for SM and NU
    const isAdmin = userPermissions.find(
      (role) =>
        role === this.accessLevelType.SM || role === "NU" || role === "AC"
    );
    //check if any added AAC belong to internal agency
    var agencyBureau = { isInternalAgency: false };
    let isInternalAgencyPresent = aacCodes.find(
      (code) => code.isInternalAgency === true
    );
    agencyBureau.isInternalAgency = isInternalAgencyPresent ? true : false;
    //if none of the added AAC are internal agency then remove them from permission code and
    //also from permission array that needs to be displayed on ui
    if (
      aacCodes.length === 0 ||
      (agencyBureau && !agencyBureau.isInternalAgency)
    ) {
      permissionArray.permissions = permissionArray.permissions.filter(
        (groupPermission) =>
          groupPermission.group !== "Agency Internal Screening"
      );

      permissionArray.permissions.forEach((groupPermission: any) => {
        groupPermission.permissionList.forEach((permission) => {
          var isChecked = permissionCodes.includes(permission.permissionCode);
          // to retain the previous checked permissions
          if (isChecked) {
            permission.isSelected = true;
          }
        });
      });
      return permissionArray;
    }
    // when atleast one acc is InternalAgency

    if (
      isAdmin &&
      agencyBureau &&
      agencyBureau.isInternalAgency &&
      permissionArray.permissions
    ) {
      //check if internal permissions already exists if not then add them
      let tempArray = permissionArray.permissions.filter(
        (groupPermission) =>
          groupPermission.group === "Agency Internal Screening"
      );
      //get the list of internal permissions from the fullPermissionList and append it to permissionsArray
      if (tempArray && tempArray.length === 0) {
        let internalPermArr = fullListOfPermissionArray.permissions.filter(
          (groupPermission) =>
            groupPermission.group === "Agency Internal Screening"
        );

        if (internalPermArr && internalPermArr.length > 0) {
          permissionArray.permissions.push(internalPermArr[0]);
        }
      }

      permissionArray.permissions.forEach((groupPermission: any) => {
        groupPermission.permissionList.forEach((permission) => {
          permission.isSelected = false;
          var isChecked = permissionCodes.includes(permission.permissionCode);
          if (isChecked) {
            permission.isSelected = true;
          }
        });
      });
    }
    return permissionArray;
  };

  handlePrimaryAac = (value: any) => {
    const aacCodes = [...this.state.aacCodes];
    let selectedAgencyBureauCd = "";
    if (value.row.original.activeInd) {
      aacCodes.forEach((o) => {
        if (o.aac === value.row.original.aac) {
          o.primaryInd = true;
          selectedAgencyBureauCd = o.agencyBureauCd;
        } else {
          o.primaryInd = false;
        }
      });
    }
    this.setState({ aacCodes: aacCodes });
    if (
      this.state.hasSecurityAccess ||
      UserUtils.getUserRoles().includes("CO")
    ) {
      //Update Nuo information for Primary Agency
      const data = {
        params: {
          agencyBureauCd: selectedAgencyBureauCd,
        },
      };
      this.userApiService
        .getNuoContactForAgencyBureau(data)
        .then((response) => {
          this.setState({
            nuoArray: response.data,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  handleChangePermissions = (event) => {
    const permissionCodes = [...this.state.permissionCodes];
    if (event[0].isSelected) {
      permissionCodes.push(event[0].id);
    } else if (!event[0].isSelected) {
      const permissionCodeIndex = permissionCodes.findIndex(
        (code) => code === event[0].id
      );
      permissionCodes.splice(permissionCodeIndex, 1);
    }

    let { permissionArray } = this.state;
    permissionArray.permissions.forEach((groupPermission: any) => {
      groupPermission.permissionList.forEach((permission) => {
        var isPresent = permissionCodes.includes(permission.permissionCode);
        if (isPresent) {
          permission.isSelected = true;
        } else {
          permission.isSelected = false;
        }
      });
    });
    if (!(permissionCodes.includes("SP") || permissionCodes.includes("IF"))) {
      this.setState({
        aoEmail: "",
        aoFirstName: "",
        aoLastName: "",
        aoState: "",
        aoZipcode: "",
        aoPhoneNumber: "",
        aoPhoneExtension: "",
        aoEmailValidationMessage: "",
        isAOEmailValid: false,
        isAOEmailInvalid: false,
      });
    }
    if (!permissionCodes.includes("FI")) {
      this.setState({
        fiAddress1: "",
        fiAddress1IsInvalid: false,
        fiAddress1IsValid: false,
        fiAddress1ValidationMessage: "",
        fiAddress2: "",
        fiAddress2IsInvalid: false,
        fiAddress2IsValid: false,
        fiAddress2ValidationMessage: "",
        fiAddress3: "",
        fiAddress3IsInvalid: false,
        fiAddress3IsValid: false,
        fiAddress3ValidationMessage: "",
        fiCity: "",
        fiCityIsInvalid: false,
        fiCityIsValid: false,
        fiCityValidationMessage: "",
        fiState: "",
        fiStateCode: "",
        fiStateIsInvalid: false,
        fiStateIsValid: false,
        fiStateValidationMessage: "",
        fiZip1: "",
        fiZip1Code: "",
        fiZip1IsInvalid: false,
        fiZip1IsValid: false,
        fiZip1ValidationMessage: "",
        fiZip2: "",
        fiZip2Code: "",
        fiZip2IsInvalid: false,
        fiZip2IsValid: false,
        fiZip2ValidationMessage: "",
        fiDisableExtension: false,
        fiAddressId: "",
        fiLeadId: "",
        fiDoneeOrganizationName: "",
        fiDoneeOrganizationNameIsInvalid: false,
        fiDoneeOrganizationNameIsValid: false,
        fiDoneeOrganizationNameValidationMessage: "",
        fiTitle: "",
        fiTitleIsInvalid: false,
        fiTitleIsValid: false,
        fiTitleValidationMessage: "",
      });
    }
    this.setState({
      permissionCodes: permissionCodes,
      permissionArray,
    });
  };

  handleCancel = () => {
    isFormSubmitted.next(false);
    if (this.props.match.params.FICheck) {
      this.props.history.push({
        pathname: `${Paths.lealist}`,
      });
    } else {
      if (UserUtils.getUserRoles().includes("CO")) {
        this.props.history.push({
          pathname: `${Paths.propertyCustodianUser}`,
        });
      } else {
        this.props.history.push({
          pathname: `${Paths.usersList}`,
        });
      }
    }
  };

  handleFedContractorNonFedRecipientDonee = (event) => {
    let selectedFedDoneeOption = "";
    event.forEach((item) => {
      if (item.isSelected) {
        selectedFedDoneeOption = item.value;
      }
    });
    this.setState({
      fedContractorNonFedRecipientDonee:
        selectedFedDoneeOption === "Yes" ? true : false,
    });
  };

  toggleAccordion(event, section) {
    let openItems = this.state.accordion.openItems;
    let { accordion } = this.state;
    if (section === "All") {
      // when clicked on expland All - set openItems to contain all the items
      if (accordion["toggleAllAccordion"]) {
        openItems = [];
      } else {
        openItems = [
          "toggleAACAccordion",
          "toggleUserAccordion",
          "toggleNUOAccordion",
          "togglePermissionAccordion",
          "toggleAOAccordion",
          "toggleFIAccordion",
        ];
      }
      let isExpanded = !accordion["toggleAllAccordion"];
      accordion["toggleAllAccordion"] = isExpanded;
      accordion["toggleAACAccordion"] = isExpanded;
      accordion["toggleUserAccordion"] = isExpanded;
      accordion["toggleNUOAccordion"] = isExpanded;
      accordion["togglePermissionAccordion"] = isExpanded;
      accordion["toggleAOAccordion"] = isExpanded;
      accordion["toggleFIAccordion"] = isExpanded;
      accordion["openItems"] = openItems;
      this.setState({
        accordion: accordion,
      });
    } else {
      this.openSelectedAccordion(section, openItems, accordion);
    }
    event.stopPropagation();
  }

  openSelectedAccordion(section, openItems, accordion) {
    const itemIndex = openItems.indexOf(section);
    if (!accordion[section]) {
      //add to open item list
      if (itemIndex === -1) {
        openItems.push(section);
      }
    } else {
      //remove from the openItems
      openItems.splice(itemIndex, 1);
    }
    //update particular accordion state
    accordion[section] = !accordion[section];
    accordion["openItems"] = openItems;
    accordion["toggleAllAccordion"] = openItems.length === 5;
    this.setState({
      accordion: accordion,
    });
  }

  handlePhoneNumber = (value, validation) => {
    if (value === "") {
      this.setState({
        phoneNumber: value,
        isPhoneInvalid: validation.isInvalid,
        isPhoneValid: !validation.isInvalid,
        phoneExtension: "",
        phoneValidationMessage: validation.validationError,
      });
    } else {
      this.setState({
        phoneNumber: value,
        isPhoneInvalid: validation.isInvalid,
        isPhoneValid: !validation.isInvalid,
        phoneValidationMessage: validation.validationError,
      });
    }
  };

  render() {
    let nuoInformation;
    let showNuoInformation = false;
    if (
      this.state.hasSecurityAccess ||
      UserUtils.getUserRoles().includes("CO")
    ) {
      showNuoInformation = true;
      nuoInformation = (
        <PPMSAccordion
          bordered={true}
          items={[
            {
              title: "NUO Contact Information",
              content: (
                <div className="usa-accordion--bordered desktop:grid-col-12">
                  <div className="short-table">
                    <PPMSDatatable
                      title={"NUO Contacts"}
                      data={this.state.nuoArray}
                      columns={this.nuoColumns}
                      defaultSortField={"lastName"}
                      isPaginationEnabled={false}
                      loading={false}
                      totalRows={this.state.nuoArray.length}
                      handleSort={(sortBy) => this.handleSort(sortBy)}
                    />
                  </div>
                </div>
              ),
              expanded: this.state.accordion.toggleNUOAccordion,
              id: "nuo",
              className: "nuo-contact-information",
              handleToggle: (event) => {
                this.toggleAccordion(event, "toggleNUOAccordion");
              },
            },
          ]}
        />
      );
    }

    let fedContractorNonFedOrDonee;
    const apoUser = UserUtils.isUserApo();
    if (apoUser) {
      fedContractorNonFedOrDonee = (
        <>
          <PPMSToggleRadio
            id={"fedContractorNonFedRecipientDonee"}
            options={this.state.yesOrNoOptions}
            isInline={false}
            isDisabled={false}
            name={"fedContractorNonFedRecipientDonee"}
            className={"fedContractorNonFedRecipientDonee"}
            label={"Federal Contractor or Non-Federal Recipient or Donee"}
            validationMessage={""}
            onChange={this.handleFedContractorNonFedRecipientDonee}
          />
        </>
      );
    }

    const onDoneeOrganiztionChange = (value: any) => {
      if (value.length > 0) {
        this.setState({
          fiDoneeOrganizationName: value,
          fiDoneeOrganizationNameIsInvalid: false,
          fiDoneeOrganizationNameIsValid: false,
          fiDoneeOrganizationNameValidationMessage: "",
        });
      } else {
        this.setState({
          fiDoneeOrganizationNameIsInvalid: true,
          fiDoneeOrganizationNameIsValid: false,
          fiDoneeOrganizationNameValidationMessage:
            "Donee organization field is required.",
        });
      }
    };

    const handleAOEmailChange = (value: any, validation: any) => {
      this.setState({
        aoEmail: value,
        aoFirstName: "",
        aoLastName: "",
        aoState: "",
        aoZipcode: "",
        aoPhoneNumber: "",
        aoPhoneExtension: "",
        aoEmailValidationMessage:
          validation === undefined
            ? "Email is Required."
            : validation.validationError,
        isAOEmailValid:
          validation === undefined ? false : !validation.isInvalid,
        isAOEmailInvalid:
          validation === undefined ? true : validation.isInvalid,
      });
      if (validation !== undefined && !validation.isInvalid) {
        this.userApiService
          .getApprovingOfficialByEmail(value)
          .then((resp) => {
            if (resp.status === 200) {
              this.setState({
                aoFirstName: resp.data.firstName,
                aoLastName: resp.data.lastName,
                aoState: resp.data.locationState,
                aoZipcode: resp.data.zipCode,
                aoPhoneNumber: formatPhone(resp.data.phoneNumber + ""),
                aoPhoneExtension: formatExtension(resp.data.phoneExt + ""),
              });
            } else if (resp.status === 204) {
              this.setState({
                aoEmail: value,
                aoEmailValidationMessage:
                  "User with email exists but does not have Approving Official permission",
                isAOEmailValid: false,
                isAOEmailInvalid: true,
              });
            }
          })
          .catch((error) => {
            if (error.status === 400) {
              this.setState({
                aoEmail: value,
                aoEmailValidationMessage: "User with email does not exist",
                isAOEmailValid: false,
                isAOEmailInvalid: true,
              });
            }
          });
      }
    };

    let showPermissions = true;

    let showFIinformationForSMandAOandSA;
    let showFIInfo = false;
    let isDisabledForHelpDesk = false;
    if (UserUtils.isUserHelpDesk()) {
      isDisabledForHelpDesk = true;
    }
    if (!UserUtils.getUserRoles().includes("CO")) {
      if (this.state.permissionCodes.includes("FI")) {
        showFIInfo = true;
        showFIinformationForSMandAOandSA = (
          <div>
            <PPMSAccordion
              bordered={true}
              items={[
                {
                  title: "Donee organization",
                  content: (
                    <div className="usa-accordion--bordered desktop:grid-col-12">
                      <div className={"grid-row grid-gap-4"}>
                        <div className="grid-col-7">
                          <PPMSAnyTextField
                            label={"Donee Organization"}
                            anyText={this.state.fiDoneeOrganizationName}
                            disabled={isDisabledForHelpDesk}
                            AnyTextIsInvalid={
                              this.state.fiDoneeOrganizationNameIsInvalid
                            }
                            AnyTextIsValid={
                              this.state.fiDoneeOrganizationNameIsValid
                            }
                            validationTextMessage={
                              this.state
                                .fiDoneeOrganizationNameValidationMessage
                            }
                            id={"donee-organization"}
                            maxLength={40}
                            required={true}
                            onChangeAnyText={(value) =>
                              this.setState({
                                fiDoneeOrganizationName: value,
                              })
                            }
                            updateAnyText={onDoneeOrganiztionChange}
                          />
                        </div>
                      </div>
                      <div className={"grid-row grid-gap-4"}>
                        <div className="grid-col-7">
                          <PPMSAnyTextField
                            label={"Title"}
                            anyText={this.state.fiTitle}
                            id={"donee-title"}
                            maxLength={40}
                            required={false}
                            disabled={isDisabledForHelpDesk}
                            onChangeAnyText={(value) => {
                              this.setState({
                                fiTitle: value,
                              });
                            }}
                            updateAnyText={(value) =>
                              this.setState({
                                fiTitle: value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <PPMSAddress
                        title={"Donee "}
                        address1={this.state.fiAddress1}
                        showAddressLine3={true}
                        address1Required={true}
                        address1IsInvalid={this.state.fiAddress1IsInvalid}
                        address1IsValid={this.state.fiAddress1IsValid}
                        addressDisabaled={isDisabledForHelpDesk}
                        address1ValidationMessage={
                          this.state.fiAddress1ValidationMessage
                        }
                        onChangeAddress1={(value) => {
                          this.setState({
                            fiAddress1: value,
                          });
                        }}
                        updateAddress1={(value: any, validation: any) => {
                          let valid = value?.length > 0;
                          this.setState({
                            fiAddress1: value,
                            fiAddress1IsInvalid: !valid,
                            fiAddress1IsValid: valid,
                            fiAddress1ValidationMessage:
                              validation.validationError,
                            fiAddress2IsInvalid: false,
                            fiAddress2IsValid: false,
                            fiAddress2ValidationMessage: "",
                            fiCityIsInvalid: false,
                            fiCityIsValid: false,
                            fiCityValidationMessage: "",
                            fiZip1IsInvalid: false,
                            fiZip1IsValid: false,
                            fiZip1ValidationMessage: "",
                          });
                        }}
                        address2={this.state.fiAddress2}
                        address2Required={false}
                        address2IsInvalid={this.state.fiAddress2IsInvalid}
                        address2IsValid={this.state.fiAddress2IsValid}
                        address2ValidationMessage={
                          this.state.fiAddress2ValidationMessage
                        }
                        updateAddress2={(value: any) => {
                          this.setState({
                            fiAddress2: value,
                          });
                        }}
                        address3={this.state.fiAddress3}
                        address3Required={false}
                        address3IsInvalid={this.state.fiAddress3IsInvalid}
                        address3IsValid={this.state.fiAddress3IsValid}
                        address3ValidationMessage={
                          this.state.fiAddress3ValidationMessage
                        }
                        updateAddress3={(value: any) => {
                          this.setState({
                            fiAddress3: value,
                          });
                        }}
                        city={this.state.fiCity}
                        cityRequired={true}
                        cityIsInvalid={this.state.fiCityIsInvalid}
                        cityIsValid={this.state.fiCityIsValid}
                        cityValidationMessage={
                          this.state.fiCityValidationMessage
                        }
                        onChangeCity={(value) => {
                          this.setState({
                            fiCity: value,
                          });
                        }}
                        updateCity={(value: any, validation: any) => {
                          let valid = value?.length > 0;
                          this.setState({
                            fiCity: value,
                            fiCityIsInvalid: !valid,
                            fiCityIsValid: valid,
                            fiCityValidationMessage: validation.validationError,
                            fiAddress1IsInvalid: false,
                            fiAddress1IsValid: false,
                            fiAddress1ValidationMessage: "",
                            fiAddress2IsInvalid: false,
                            fiAddress2IsValid: false,
                            fiAddress2ValidationMessage: "",
                            fiZip1IsInvalid: false,
                            fiZip1IsValid: false,
                            fiZip1ValidationMessage: "",
                          });
                        }}
                        state={this.state.fiStateCode}
                        stateRequired={true}
                        stateIsInvalid={this.state.fiStateIsInvalid}
                        stateIsValid={this.state.fiStateIsValid}
                        updateState={(value: any, validation: any) => {
                          this.setState({
                            fiStateCode: value,
                            fiState: value,
                            fiStateIsInvalid: validation.isInvalid,
                            fiStateIsValid: !validation.isInvalid,
                            fiStateValidationMessage:
                              validation.validationError,
                          });
                        }}
                        disabledZipExtension={this.state.fiDisableExtension}
                        zip={this.state.fiZip1Code}
                        zipRequired={true}
                        zipIsInvalid={this.state.fiZip1IsInvalid}
                        zipIsValid={this.state.fiZip1IsValid}
                        zipValidationMessage={
                          this.state.fiZip1ValidationMessage
                        }
                        onChangeZip={(value) => {
                          this.setState({
                            fiZip1Code: value,
                          });
                        }}
                        showZipExtension={true}
                        updateZip={(
                          value: any,
                          inValid: boolean,
                          valid: boolean,
                          validationError: string,
                          disabledZipExtension: boolean
                        ) => {
                          this.setState({
                            fiZip1Code: value,
                            fiZip1IsInvalid: inValid,
                            fiZip1IsValid: valid,
                            fiZip1ValidationMessage: validationError,
                            fiDisableExtension: disabledZipExtension,
                            fiAddress1IsInvalid: false,
                            fiAddress1IsValid: false,
                            fiAddress1ValidationMessage: "",
                            fiCityIsInvalid: false,
                            fiCityIsValid: false,
                            fiCityValidationMessage: "",
                          });
                        }}
                        zip2={this.state.fiZip2Code}
                        zip2IsInvalid={this.state.fiZip2IsInvalid}
                        zip2IsValid={this.state.fiZip2IsValid}
                        onChangeZipExtension={(value) => {
                          this.setState({
                            fiZip2Code: value,
                          });
                        }}
                        validationExtensionMessage={
                          this.state.fiZip2ValidationMessage
                        }
                        updateZipExtension={(
                          value: any,
                          inValid: boolean,
                          valid: boolean,
                          validationError: string
                        ) => {
                          this.setState({
                            fiZip2Code: value,
                            fiZip2IsInvalid: inValid,
                            fiZip2IsValid: valid,
                            fiZip2ValidationMessage: validationError,
                          });
                        }}
                      />
                    </div>
                  ),
                  expanded: this.state.accordion.toggleFIAccordion,
                  id: "fi",
                  className: "fi-info-for-sm-sa-ao",
                  handleToggle: (event) => {
                    this.toggleAccordion(event, "toggleFIAccordion");
                  },
                },
              ]}
            />
            <br />
          </div>
        );
      }
    }
    let showAOinformationForSMandNUO;
    let showAOInfo = false;
    if (!UserUtils.getUserRoles().includes("CO")) {
      if (
        this.state.permissionCodes.includes("SP") ||
        this.state.permissionCodes.includes("FI") ||
        this.state.permissionCodes.includes("IF")
      ) {
        if (!UserUtils.isUserHelpDesk()) {
          showAOInfo = true;
          showAOinformationForSMandNUO = (
            <div>
              <PPMSAccordion
                bordered={true}
                items={[
                  {
                    title: "Approving Official Information",
                    content: (
                      <div className="usa-accordion--bordered desktop:grid-col-12">
                        <PPMSEmail
                          id={"ao-email"}
                          required={true}
                          disabled={false}
                          email={this.state.aoEmail}
                          emailLabel={"Email Address"}
                          isValid={this.state.isAOEmailValid}
                          isInvalid={this.state.isAOEmailInvalid}
                          validationMessage={this.state.aoEmailValidationMessage}
                          updateEmail={handleAOEmailChange}
                          onChangeEmail={(value: any) => {
                            this.setState({
                              aoEmail: value,
                              isAOEmailInvalid: false,
                              aoEmailValidationMessage: "",
                            });
                          }}
                          maxLength={52}
                        />
                        <div className={"grid-row grid-gap-4"}>
                          <PPMSFirstNameLastName
                            id={"ao-registration-first-middle-last-name"}
                            maxLength={14}
                            maxMiddleLength={1}
                            disabled={true}
                            required={false}
                            firstName={this.state.aoFirstName}
                            onChangeFirstName={(value: any) =>
                              this.setState({ aoFirstName: value })
                            }
                            updateFirstName={(value: any) => {
                              if (value.length === 0) {
                                this.setState({ aoFirstNameIsInvalid: true });
                              } else {
                                this.setState({ aoFirstNameIsInvalid: false });
                              }
                              this.setState({ aoFirstName: value });
                            }}
                            middleName={this.state.aoMiddleName}
                            onChangeMiddleName={(value: any) => {
                              this.setState({ aoMiddleName: value });
                            }}
                            updateMiddleName={(value: any) => {
                              this.setState({ aoMiddleName: value });
                            }}
                            lastName={this.state.aoLastName}
                            onChangeLastName={(value: any) =>
                              this.setState({ aoLastName: value })
                            }
                            updateLastName={(value: any) => {
                              if (value.length === 0) {
                                this.setState({ aoLastNameIsInvalid: true });
                              } else {
                                this.setState({ aoLastNameIsInvalid: false });
                              }
                              this.setState({ aoLastName: value });
                            }}
                          />
                        </div>
                        <div className={"grid-row grid-gap-4"}>
                          <div className={"grid-col"}>
                            <PPMSInput
                              label={"State"}
                              isDisabled={true}
                              id={"ao-state"}
                              inputType={"text"}
                              isInvalid={this.state.aoStateIsInvalid}
                              isValid={this.state.aoStateIsValid}
                              isRequired={false}
                              value={this.state.aoState}
                            />
                          </div>
                          <div className={"grid-col"}>
                            <PPMSInput
                              label={"Zip Code"}
                              isDisabled={true}
                              id={"ao-zip-code"}
                              inputType={"text"}
                              isInvalid={this.state.aoZipCodeIsInvalid}
                              isValid={this.state.aoZipCodeIsValid}
                              isRequired={false}
                              value={this.state.aoZipcode}
                            />
                          </div>
                        </div>
                        <div className={"grid-row grid-gap-4"}>
                          <PPMSPhoneNumber
                            id={"ao-phone-number"}
                            required={false}
                            disabled={true}
                            disabledExtension={true}
                            showExtension={true}
                            phone={this.state.aoPhoneNumber}
                            updatePhoneNumber={(value: any) => {
                              this.setState({ aoPhoneNumber: value });
                            }}
                            onChangePhoneNumber={(value: any) => {
                              this.setState({ aoPhoneNumber: value });
                            }}
                            extension={this.state.aoPhoneExtension}
                            onChangePhoneExt={(value: any) => {
                              this.setState({ aoPhoneExtension: value });
                            }}
                            updatePhoneExtension={(value: any) => {
                              this.setState({ aoPhoneExtension: value });
                            }}
                            maxLength={10}
                            maxLengthExtension={8}
                          />
                        </div>
                      </div>
                    ),
                    expanded: this.state.accordion.toggleAOAccordion,
                    id: "ao",
                    className: "ao-info-for-sm-nuo",
                    handleToggle: (event) => {
                      this.toggleAccordion(event, "toggleAOAccordion");
                    },
                  },
                ]}
              />
              <br />
            </div>
          );
        } else {
          showAOInfo = true;
          showAOinformationForSMandNUO = (
            <>
              <PPMSAccordion
                bordered={true}
                items={[
                  {
                    title: "Approving Official Information",
                    content: (
                      <div className="usa-accordion--bordered desktop:grid-col-12">
                        <div className="short-table">
                          <PPMSDatatable
                            title={"Approving Contacts"}
                            data={this.state.approvingOfficialInfo}
                            columns={this.apoColumns}
                            defaultSortField={"lastName"}
                            isPaginationEnabled={false}
                            loading={false}
                            totalRows={this.state.nuoArray.length}
                            handleSort={(sortBy) => this.handleSort(sortBy)}
                          />
                        </div>
                      </div>
                    ),
                    expanded: this.state.accordion.toggleAOAccordion,
                    id: "ao",
                    className: "ao-info-for-sm-nuo",
                    handleToggle: (event) => {
                      this.toggleAccordion(event, "toggleAOAccordion");
                    },
                  },
                ]}
              />
              <br />
            </>
          );
        }
      }
    }

    let saspAdminAAC;

    if (UserUtils.isUserSaspAdmin()) {
      saspAdminAAC = [
        {
          title: "Agency / Bureau Information",
          content: (
            <div className="form-section-content grid-row grid-gap-4">
              <PPMSAacAgency
                aacLabel={"Activity Address Code"}
                aacCode={this.state.aacCode}
                agencyBureau={this.state.agencyBureauLongName}
                updateAACCode={(value: any) => {
                  this.setState({ aacCode: value, isPrimaryAacSelected: true });
                }}
                updateAgencyBureau={(
                  value: any,
                  placeholder,
                  isInvalid,
                  isValid,
                  isInternalAgency
                ) => {
                  this.setState({
                    agencyBureau: value,
                    agencyBureauLongName: placeholder,
                    isAACValid: isValid,
                    isInternalAgency: isInternalAgency,
                  });
                }}
                isAACCodeInvalid={!this.state.isAACValid}
                isAACCodeValid={this.state.isAACValid}
                required={true}
                aacCodes={this.state.aacCodes}
                isAACCodeDisabled={true}
              />
            </div>
          ),
          expanded: this.state.accordion.toggleAACAccordion,
          id: "aac",
          className: "aac-agency-info",
          trigger: "common",
          handleToggle: (event) => {
            this.toggleAccordion(event, "toggleAACAccordion");
          },
        },
      ];
    } else {
      saspAdminAAC = [
        {
          title: "Agency / Bureau Information",
          content: (
            <div className="grid-row grid-gap-4">
              <div className="short-table">
                <PPMSDatatable
                  title={"Added AACs and Agency Bureaus"}
                  data={this.state.aacCodes}
                  columns={this.columns}
                  defaultSortField={"aacCode"}
                  isPaginationEnabled={false}
                  hiddenColumns={
                    (UserUtils.isUserApo() || UserUtils.isUserHelpDesk())
                      ? ["select-primary", "active-inactive-aac"]
                      : []
                  }
                  loading={false}
                  totalRows={this.state.aacCodes.length}
                  handleSort={(sortBy) => this.handleSort(sortBy)}
                />
              </div>
            </div>
          ),
          expanded: this.state.accordion.toggleAACAccordion,
          id: "aac",
          className: "aac-agency-info",
          trigger: "common",
          handleToggle: (event) => {
            this.toggleAccordion(event, "toggleAACAccordion");
          },
        },
      ];
    }

    const userInformation = [
      {
        title: "User Information",
        content: (
          <div className="usa-accordion--bordered desktop:grid-col-12">
            {fedContractorNonFedOrDonee}
            <div className={"grid-row grid-gap-4"}>
              <PPMSFirstNameLastName
                id={"registration-first-middle-last-name"}
                maxLength={30}
                maxMiddleLength={1}
                required={true}
                firstName={this.state.firstName}
                onChangeFirstName={(value: any) => {
                  this.setState({ firstName: value });
                }}
                isFirstNameInvalid={this.state.firstNameInvalid}
                validationFirstMessage={"First Name is Required."}
                isLastNameInvalid={this.state.lastNameInvalid}
                validationLastMessage={"Last Name is Required."}
                updateFirstName={(value: any) => {
                  this.handleFirstNameChange(value);
                }}
                middleName={this.state.middleName}
                showMiddleName={true}
                onChangeMiddleName={(value: any) => {
                  this.setState({ middleName: value });
                }}
                updateMiddleName={(value: any) => {
                  this.setState({ middleName: value });
                }}
                lastName={this.state.lastName}
                onChangeLastName={(value: any) => {
                  this.setState({ lastName: value });
                }}
                updateLastName={(value: any) => {
                  this.handleLastNameChange(value);
                }}
              />
            </div>
            <div className={"grid-row grid-gap-4"}>
              <PPMSPhoneNumber
                id={"phone-number"}
                showExtension={true}
                required={true}
                disabled={false}
                phone={this.state.phoneNumber}
                onChangePhoneNumber={(value) =>
                  this.setState({ phoneNumber: value })
                }
                updatePhoneNumber={(phone, validation) => {
                  this.handlePhoneNumber(phone, validation);
                }}
                extension={this.state.phoneExtension}
                onChangePhoneExt={(value: any) => {
                  this.setState({ phoneExtension: value });
                }}
                updatePhoneExtension={(value: any) => {
                  this.setState({ phoneExtension: value });
                }}
                maxLength={10}
                maxLengthExtension={8}
                validationMessage={this.state.phoneValidationMessage}
                isInvalid={this.state.isPhoneInvalid}
                isValid={this.state.isPhoneValid}
              />
            </div>
            <div className={"grid-row grid-gap-4"}>
              <PPMSEmailConfirm
                currentUserEmailAddress={this.state.currentUserEmailAddress}
                id={"registration-email"}
                required={true}
                validateExistingUser={true}
                disabled={
                  !(
                    (UserUtils.isSystemAdminUser() ||
                      UserUtils.isUserApo() ||
                      UserUtils.isUserNuo() ||
                      UserUtils.isUserHelpDesk() ||
                      UserUtils.isUserSaspAdmin()) ||
                      UserUtils.isUserFireArmManager()) &&
                      !this.props.match.params.FICheck
                }
                isEmailInvalid={this.state.isRegistrationEmailInvalid}
                isEmailValid={!this.state.isRegistrationEmailInvalid}
                confirmEmail={this.state.confirmEmailAddress}
                confirmDisabled={
                  !(
                    (UserUtils.isSystemAdminUser() ||
                      UserUtils.isUserApo() ||
                      UserUtils.isUserNuo() ||
                      UserUtils.isUserHelpDesk() ||
                      UserUtils.isUserSaspAdmin()) &&
                    !this.props.match.params.FICheck
                  )
                }
                email={this.state.emailAddress}
                showEmailConfirm={true}
                isConfirmEmailInvalid={
                  this.state.isRegistrationEmailConfirmInvalid
                }
                isConfirmEmailValid={
                  !this.state.isRegistrationEmailConfirmInvalid
                }
                updateEmail={(value: any, validation: any) => {
                  this.setState({
                    emailAddress: value,
                    isRegistrationEmailInvalid: validation.isInvalid,
                    emailValidationMessage: validation.validationError,
                    confirmDisabled: validation.confirmDisabled,
                  });
                }}
                updateConfirmEmail={(value: any, validation: any) => {
                  this.setState({
                    confirmEmailAddress: value,
                    isRegistrationEmailConfirmInvalid: validation.isInvalid,
                    confirmEmailValidationMessage: validation.validationError,
                  });
                }}
                emailValidationMessage={this.state.emailValidationMessage}
                confirmEmailValidationMessage={
                  this.state.confirmEmailValidationMessage
                }
              />
            </div>
            <div className={"grid-row grid-gap-4"}>
              <div className={"tablet:grid-col-5"}>
                <PPMSState
                  id={"registration-state"}
                  label={"Location State"}
                  required={true}
                  selectedState={this.state.state}
                  isInvalid={this.state.stateIsInvalid}
                  updateLocationState={(value: any, validation: any) => {
                    this.setState({
                      state: value,
                      stateIsInvalid: validation.isInvalid,
                    });

                    if (
                      !this.state.zipIsInvalid ||
                      (this.state.zipIsInvalid &&
                        this.state.zipValidationError ===
                        zipInvalidStateMessage)
                    ) {
                      this.commonApiService
                        .getZipCode(this.state.zip)
                        .then((response: any) => {
                          let errorMessage = validateZipState(
                            response.data,
                            value
                          );
                          this.setState({
                            zipIsInvalid: errorMessage.length !== 0,
                            zipIsValid: errorMessage.length === 0,
                            zipValidationError: errorMessage,
                          });
                        })
                        .catch((error) => {
                          console.log(error);
                          return error;
                        });
                    }
                  }}
                  disabled={UserUtils.isUserSaspAdmin()}
                />
              </div>
              <div className={"tablet:grid-col-5"}>
                <PPMSZip
                  id={"registration-zip"}
                  isRequired={true}
                  disabled={false}
                  zip={this.state.zip}
                  onChangeZip={(value) => {
                    this.setState({
                      zip: value,
                    });
                  }}
                  isZipValid={this.state.zipIsValid}
                  isZipInvalid={this.state.zipIsInvalid}
                  updateZip={(
                    value: any,
                    inValid: boolean,
                    valid: boolean,
                    validationError: any,
                    disabledExtension: boolean
                  ) => {
                    this.setState({
                      zip: value,
                      zipIsInvalid: inValid,
                      zipIsValid: valid,
                      zipValidationError: validationError,
                    });

                    if (
                      !inValid ||
                      this.state.zipValidationError === zipInvalidStateMessage
                    ) {
                      this.commonApiService
                        .getZipCode(value)
                        .then((response: any) => {
                          let errorMessage = validateZipState(
                            response.data,
                            this.state.state
                          );
                          this.setState({
                            zipIsInvalid: errorMessage.length !== 0,
                            zipIsValid: errorMessage.length === 0,
                            zipValidationError: errorMessage,
                          });
                        })
                        .catch((error) => {
                          console.log(error);
                          return error;
                        });
                    }
                  }}
                  validationMessage={this.state.zipValidationError}
                  showZipExtension={false}
                  zipExtension={this.state.zipExtension}
                  onChangeZipExtension={(value: any) => {
                    this.setState({ zipExtension: value });
                  }}
                  updateZipExtension={(value: any) => {
                    this.setState({ zipExtension: value });
                  }}
                />
              </div>
            </div>
          </div>
        ),
        expanded: this.state.accordion.toggleUserAccordion,
        id: "user",
        className: "user-information",
        trigger: "common",
        handleToggle: (event) => {
          this.toggleAccordion(event, "toggleUserAccordion");
        },
      },
    ];

    let permission;
    if (!UserUtils.isUserHelpDesk()) {
      permission = [
        {
          title: "Permission",
          content: (
            <div className="usa-accordion--bordered desktop:grid-col-12">
              {this.state.permissionArray.length !== 0 && (
                <FormLabel>At least one permission should be selected</FormLabel>
              )}
              {this.state.permissionArray.length !== 0 && (
                <PPMSChecklist
                  values={this.state.permissionArray}
                  onChange={this.handleChangePermissions.bind(this)}
                />
              )}
            </div>
          ),
          expanded: this.state.accordion.togglePermissionAccordion,
          id: "permission",
          className: "permission",
          trigger: "common",
          handleToggle: (event) => {
            this.toggleAccordion(event, "togglePermissionAccordion");
          },
        },
      ];
    } else {
      permission = [
        {
          title: "Permission",
          content: (
            <div className="usa-accordion--bordered desktop:grid-col-12">
              {this.state.permissionArray.length !== 0 && (
                <FormLabel>You have following permissions</FormLabel>
              )}
              {this.state.permissionArray.length !== 0 && (
                <PPMSUserProfilePermissions
                  values={this.state.permissionArray}
                  showOnlyLabel={true}
                />
              )}
            </div>
          ),
          expanded: this.state.accordion.togglePermissionAccordion,
          id: "permission",
          className: "permission",
          trigger: "common",
          handleToggle: (event) => {
            this.toggleAccordion(event, "togglePermissionAccordion");
          },
        },
      ];
    }

    //Show documents section for LEA Users
    let documents;
    if (this.state.showDocuments) {
      documents = [
        {
          title: "Documents",
          id: "documents",
          className: "upload-documents",
          content: (
            <UploadDocuments
              fileInfectedStatus={(value) =>
                this.setState({
                  fileInfectedStatus: value,
                })
              }
              actionDisabled={isDisabledForHelpDesk}
              downloadDisabled={!isDisabledForHelpDesk}
              userId={this.props.match.params.userAccountId}
            />
          ),
          expanded: true,
        },
      ];
    } else {
      documents = <></>;
    }

    if (UserUtils.getUserRoles().includes("CO")) {
      showAOInfo = false;
      showFIInfo = false;
      showNuoInformation = true;
    }
    return (
      <div className={"nuo-registration grid-row ui-ppms"}>
        <div className="header-row grid-row grid-gap-4">
          {this.props.match.params.FICheck ? (
            <h1>Lea Maintenance</h1>
          ) : (
            <h1>User ID Maintenance</h1>
          )}
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <SideNav
                  showAOInfo={showAOInfo}
                  showNUOInfo={showNuoInformation}
                  showFIInfo={showFIInfo}
                  showPermissions={showPermissions}
                  showDocuments={this.state.showDocuments}
                />
              </nav>
            </div>
          </div>
        </div>
        <main
          className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs"
          id="main-content"
        >
          <div className={"desktop:grid-col-12"}>
            <PPMSAlert
              id={"form-verification-error-alert"}
              show={this.state.showErrorAlert}
              alertBody={
                this.state.FormErrorMessage || " Error submitting request."
              }
              alertClassName={"form-verification-error"}
              alertVariant={"danger"}
              alertKey={"form-verification-error"}
              alertBodyArray={this.state.alertBodyArray}
            />
            {this.state.showErrorAlert && <hr />}
          </div>
          <Form
            noValidate
            validated={this.state.isFormValidated}
            onSubmit={this.handleSubmit}
            className={"usa-accordion--bordered desktop:grid-col-12"}
          >
            <div className="float-md-right">
              <PPMSButton
                variant={"link"}
                className="usa-link float:right"
                id={"expandToggle"}
                type={"button"}
                label={
                  this.state.accordion.toggleAllAccordion
                    ? "Collapse All"
                    : "Expand All"
                }
                onPress={(event) => this.toggleAccordion(event, "All")}
              />
            </div>
            <div className="grid-row grid-gap-4">
              <ManageUserButtons
                isSubmitDisabled={this.state.isSubmitDisabled}
                isSubmitLoading={this.state.isSubmitLoading}
                cancelFunction={this.handleCancel}
              />
            </div>
            <br />
            <PPMSAccordion bordered={true} items={saspAdminAAC} />
            <br />
            <PPMSAccordion bordered={true} items={userInformation} />
            <br />
            {nuoInformation}
            <br />
            {showPermissions && (
              <>
                <PPMSAccordion bordered={true} items={permission} />
                <br />
              </>
            )}
            {showFIinformationForSMandAOandSA}
            {showAOinformationForSMandNUO}
            {this.state.showDocuments && (
              <PPMSAccordion bordered={true} items={documents} />
            )}
            {this.state.showDocuments && <br />}
            <div className="grid-row grid-gap-4">
              <ManageUserButtons
                isSubmitDisabled={this.state.isSubmitDisabled}
                isSubmitLoading={this.state.isSubmitLoading}
                cancelFunction={this.handleCancel}
              />
            </div>
          </Form>
        </main>
      </div>
    );
  }

  handleFirstNameChange(value) {
    if (value && value.length > 0) {
      this.setState({ firstNameInvalid: false });
    } else {
      this.setState({ firstNameInvalid: true });
    }
    this.setState({ firstName: value });
  }
  handleLastNameChange(value) {
    if (value && value.length > 0) {
      this.setState({ lastNameInvalid: false });
    } else {
      this.setState({ lastNameInvalid: true });
    }
    this.setState({ lastName: value });
  }
}

const RadioBtn = ({ aac, onChange }) => (
  <input
    id={aac.cell.row.original.aac}
    title={aac.cell.row.original.aac}
    onClick={onChange}
    checked={
      aac.data.find(
        (data) =>
          data.primaryInd === true && data.aac === aac.cell.row.original.aac
      )
        ? true
        : false
    }
    type="radio"
  />
);
