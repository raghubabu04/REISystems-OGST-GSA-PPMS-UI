import React from "react";
import {Form, FormLabel} from "react-bootstrap";
import {PPMSFirstNameLastName} from "../../ui-kit/components/PPMS-firstname-lastname";
import {PPMSPhoneNumber} from "../../ui-kit/components/PPMS-phone-number";
import {PPMSZip} from "../../ui-kit/components/PPMS-zip";
import {PPMSState} from "../../ui-kit/components/PPMS-state";
import {PPMSAacAgency} from "../../ui-kit/components/PPMS-aac-agency";
import {UserApiService} from "../../api-kit/user/user-api.service";
import {PPMSAlert} from "../../ui-kit/components/common/PPMS-alert";
import {PPMSEmailConfirm} from "../../ui-kit/components/PPMS-email-confirm";
import {accessLevelType} from "../../constants/Constants";
import {UserUtils} from "../../utils/UserUtils";
import {NuoUser} from "../models/User";
import {PPMSButton} from "../../ui-kit/components/common/PPMS-button";
import {MdDelete} from "react-icons/md";
import PPMSChecklist from "../../ui-kit/components/PPMS-checklist";
import {CommonApiService} from "../../api-kit/common/common-api.service";
import {Paths} from "../Router";
import {PPMSEmail} from "../../ui-kit/components/PPMS-email";
import {PPMSInput} from "../../ui-kit/components/common/input/PPMS-input";
import {isFormSubmitted} from "../../service/validation.service";
import {formatExtension, formatPhone,} from "../../ui-kit/utilities/FormatUtil";
import {PPMSToggleRadio} from "../../ui-kit/components/common/toggle/PPMS-toggle";
import {PPMSAccordion} from "../../ui-kit/components/common/accordion/PPMS-accordion";
import SideNav from "./SideNav";
import ManageUserButtons from "./ManageUserButtons";
import {
  validatePhoneFax,
  validateZipState,
  zipInvalidStateMessage,
} from "../../ui-kit/components/validations/FieldValidations";
import PPMSDatatable from "../../ui-kit/components/common/datatable/PPMS-datatable";
import {PPMSAddress} from "../../ui-kit/components/PPMS-address";
import {PPMSAnyTextField} from "../../ui-kit/components/PPMS-any-text-field";

export const yesOrNoOptions = [
  {value: "Yes", id: "Y", isSelected: false},
  {value: "No", id: "N", isSelected: false},
];

export interface NuoRegistrationState {
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
  phoneIsInvalid: boolean;
  phoneValidationMessage: string;
  phoneExtension: string;
  state: string;
  stateIsInvalid: boolean;
  stateFilter: string;
  zip: string;
  zipIsValid: boolean;
  zipIsInvalid: boolean;
  zipValidationError: string;
  zipExtension: string;
  emailAddress: string;
  isRegistrationEmailInvalid: boolean;
  isRegistrationEmailConfirmInvalid: boolean;
  confirmEmailAddress: string;
  emailValidationMessage: string;
  confirmDisabled: boolean;
  confirmEmailValidationMessage: string;

  // AO Information
  aoFirstName: string;
  aoMiddleName: string;
  aoLastName: string;
  aoPhoneNumber: string;
  aoPhoneExtension: string;
  aoEmailAddress: string;
  aoConfirmEmailAddress: string;
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
  fiDoneeOrganizationName: string;
  fiDoneeOrganizationNameIsInvalid: boolean;
  fiDoneeOrganizationNameIsValid: boolean;
  fiDoneeOrganizationNameValidationMessage: string;
  fiTitle: string;
  fiTitleIsInvalid: boolean;
  fiTitleIsValid: boolean;
  fiTitleValidationMessage: string;
}

interface NuoRegistrationProps {
  match: any;
  location: any;
  history: any;
  context: any;
}

export class NuoRegistration extends React.Component<
  NuoRegistrationProps,
  NuoRegistrationState
> {
  accessLevelType = accessLevelType;
  private isCurrent = true;
  constructor(props: any) {
    super(props);
    this.state = {
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
      phoneIsInvalid: false,
      phoneValidationMessage: "Phone Number is required.",
      phoneExtension: "",
      state: "",
      stateIsInvalid: false,
      stateFilter: "",
      zip: "",
      zipIsValid: false,
      zipIsInvalid: false,
      zipExtension: "",
      password: "",
      confirmPassword: "",
      question: "",
      answer: "",
      emailAddress: "",
      confirmEmailAddress: "",
      confirmDisabled: false,
      // AO Information
      aoFirstName: "",
      aoMiddleName: "",
      aoLastName: "",
      aoPhoneNumber: "",
      aoPhoneExtension: "",
      aoEmailAddress: "",
      aoConfirmEmailAddress: "",
      aoStateIsValid: false,
      aoStateIsInvalid: false,
      aoZipCodeIsInvalid: false,
      aoZipCodeIsValid: false,
      isRegistrationEmailInvalid: false,
      isRegistrationEmailConfirmInvalid: false,
      aoEmail: "",
      aoState: "",
      aoZipcode: "",
      aoEmailValidationMessage: "",
      isAOEmailValid: false,
      isAOEmailInvalid: false,
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
      emailValidationMessage: "Email is Required",
      confirmEmailValidationMessage: "Confirm Email is Required",
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
      fiDoneeOrganizationName: "",
      fiDoneeOrganizationNameIsInvalid: false,
      fiDoneeOrganizationNameIsValid: false,
      fiDoneeOrganizationNameValidationMessage: "",
      fiTitle: "",
      fiTitleIsInvalid: false,
      fiTitleIsValid: false,
      fiTitleValidationMessage: "",
    } as NuoRegistrationState;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  private userApiService: UserApiService = new UserApiService();
  private commonApiService = new CommonApiService();
  setStateForSaspAdminUser() {
    let stateCode = UserUtils.getUserStateCode();
    if (stateCode) {
      this.commonApiService
        .getStateNameFromCode(stateCode)
        .then((response: any) => {
          this.setState({
            state: response.data.stateCode,
            fiStateCode: response.data.stateCode,
            fiState: response.data.stateCode,
            aacCode: UserUtils.getPrimaryAAC(),
          });
        })
      const data = {
        params: {
          agencyCode: UserUtils.getPrimaryAAC(),
        },
      }
      this.commonApiService.getBureau(data)
        .then((resp: any) => {
          this.setState({
            aacCode: UserUtils.getPrimaryAAC(),
            agencyBureauLongName: (resp?.data?.code + " - " + resp?.data?.longName).trim(),
          })
        }).catch((error: any) => {
        console.log(error);
        return error;
      })
    }
  }

  /*
  * this below method is for FS permission, by default FS permission is disabled on UI,
  *  if agency bureau is added as 1223 or 1291 then FS permission is enabled
  */
  disablePermission = () => {
    let {permissionArray, aacCodes, permissionCodes} = this.state;
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
              permission.isSelected = false;
              permissionCodes = permissionCodes.filter((per) => per !== "FS");
            } else {
              permission.isDisabled = false;
            }
          }
        });
      });

      this.setState({
        permissionArray,
        permissionCodes,
      });
    }
  };

  /*
   * this below method is for PA permission, by default PA permission is disabled on UI,
   *  if agency bureau is added as 6905 then PA permission is enabled
   */
  disablePAPermission = () => {
    let {permissionArray, aacCodes, permissionCodes} = this.state;
    let agencyBureauCds = aacCodes.map(
      (activeAacCode) => activeAacCode.agencyBureauCd
    );
    const includesInArray = agencyBureauCds.includes("6905");

    if (permissionArray) {
      permissionArray.permissions.forEach((groupPermission: any) => {
        groupPermission.permissionList.forEach((permission) => {
          let isPresent =
            permission.permissionCode.includes("PA") && !includesInArray;
          if (permission.permissionCode.includes("PA")) {
            if (isPresent) {
              permission.isDisabled = true;
              permission.isSelected = false;
              permissionCodes = permissionCodes.filter((per) => per !== "PA");
            } else {
              permission.isDisabled = false;
            }
          }
        });
      });

      this.setState({
        permissionArray,
        permissionCodes,
      });
    }
  };

  componentDidMount() {
    isFormSubmitted.subscribe((submit) => {
      if (submit && this.isCurrent) {
        this.validateForm();
        isFormSubmitted.next(false);
      }
    });
    //Grab permission level
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
        //if user is "SM" , "NUO":
        //if isInternalAgnency is true then show the extra permissions else disable them
        // loop through response.data , from the array if it matches response.data then set isDisabled to true
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
            groupPermission.group === "Internal Screening"
        );
        if (internalPermArr && internalPermArr.length > 0) {
          internalPermArr[0].permissionList.forEach((permission) => {
            internalAgencyPermissions.push(permission.permissionCode);
          });
        }

        if (isAdmin && !this.state.isInternalAgency) {
          // fullListOfPermissionArray = response.data;
          // just splice the internal group from group permissions

          permissionArray.permissions = response.data.permissions.filter(
            (groupPermission) =>
              groupPermission.group !== "Internal Screening"
          );
        } else {
          permissionArray.permissions = response.data.permissions;
        }

        if (this.props.match.params.FICheck) {
          //If coming to page from Create LEA, add FI permission
          let fi = [
            {
              id: "FI",
              isSelected: true,
              required: false,
              value: "Firearms Inventory  (FI)",
            },
          ];
          this.setState(
            {
              permissionArray: permissionArray,
              fullListOfPermissionArray: fullListOfPermissionArray,
              internalAgencyPermissions,
            },
            function () {
              this.handleChangePermissions(fi);
            }
          );
        } else {
          this.setState({
            permissionArray: permissionArray,
            fullListOfPermissionArray: fullListOfPermissionArray,
            internalAgencyPermissions,
          });
        }
        this.disablePermission();
        this.disablePAPermission();
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    if (UserUtils.isUserSaspAdmin() || UserUtils.isUserSaspWithFI()) {
      this.setStateForSaspAdminUser();
    }
  }

  componentWillUnmount() {
    isFormSubmitted.next(false);
  }

  handleSubmit = (event: any) => {
    isFormSubmitted.next(true);
    let validationMessages = [];
    let validatePermission = this.validatePermission(validationMessages);
    if (this.state.zipIsInvalid) {
      validationMessages.push(this.state.zipValidationError);
    }

    let validateAacCodes =
      !(UserUtils.isUserSaspAdmin() || UserUtils.isUserSaspWithFI()) &&
      this.validateAacCodes(validationMessages);

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
      const data: NuoUser = this.toJSON(this.state);
      this.userApiService
        .registerNuoUser(data)
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
            this.props.history.push({
              pathname: `${Paths.usersList}`,
              successMessage: "User successfully added!",
            });
          }
        })
        .catch((error: any) => {
          this.setState({
            FormErrorMessage: error.data.message,
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
        isAACValid: true,
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

  toJSON = (state: NuoRegistrationState): NuoUser => {
    let approvingOfficial: any;
    let leaInformationDTO: any;
    if (
      UserUtils.isUserApo() &&
      !(
        this.state.permissionCodes.includes("SP") ||
        this.state.permissionCodes.includes("IF")
      )
    ) {
      approvingOfficial = {
        firstName: state.aoFirstName,
        lastName: state.aoLastName,
        middleInitial: state.aoMiddleName,
        phoneNumber: state.aoPhoneNumber.replace(/[^0-9]/g, ""),
        emailAddress: state.aoEmailAddress,
      };
    }
    if (
      (UserUtils.isUserApo ||
        UserUtils.isSystemAdminUser ||
        UserUtils.isUserSA) &&
      this.state.permissionCodes.includes("FI")
    ) {
      leaInformationDTO = {
        doneeOrganizationName: state.fiDoneeOrganizationName,
        title: state.fiTitle,
        addressLine1: state.fiAddress1,
        addressLine2: state.fiAddress2,
        addressLine3: state.fiAddress3,
        city: state.fiCity,
        stateCode: state.fiStateCode,
        zip: state.fiZip1Code,
        zipExtension: state.fiZip2Code,
      };
    }
    return {
      firstName: state.firstName,
      lastName: state.lastName,
      middleName: state.middleName,
      emailAddress: state.emailAddress,
      aac: state.aacCode,
      aacCodes: state.activeAacCodes,
      agencyBureauCd: state.agencyBureau,
      phoneNumber: state.phoneNumber.replace(/[^0-9]/g, ""),
      phoneExt: state.phoneExtension,
      zipCode: state.zip,
      locationState: state.state,
      nuoEmailAddress: state.nuoEmailAddress,
      approvingOfficialEmail: state.aoEmail,
      fedContractorNonFedRecipientDonee:
        state.fedContractorNonFedRecipientDonee,
      permissions: state.permissionCodes,
      leaInformationDTO: leaInformationDTO,
      approvingOfficial: approvingOfficial,
    } as NuoUser;
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
      Header: "Delete AAC",
      id: "delete-aac",
      Cell: (aac) => (
        <PPMSButton
          id={"delete-aac"}
          variant={"danger"}
          label={"Delete"}
          size={"sm"}
          icon={<MdDelete />}
          onPress={async () => {
            const aacCodes = [...this.state.aacCodes];
            const aacIndex = aacCodes.findIndex(
              (o) => o.aac === aac.row.values.aac
            );
            aacCodes[aacIndex].activeInd = false;
            let activeAacCodes = [...aacCodes];
            aacCodes.splice(aacIndex, 1);

            let resetPermission = this.state.permissionArray;
            //when aac is deleted , internal permissions needs to be disabled and uncheck if isInternalAgency is false
            resetPermission = await this.resetPermission(aacCodes);
            let {
              permissionCodes,
              internalAgencyPermissions,
              fullListOfPermissionArray,
            } = this.state;

            if (
              resetPermission.permissions &&
              fullListOfPermissionArray.permissions &&
              resetPermission.permissions.length !==
              fullListOfPermissionArray.permissions.length
            ) {
              permissionCodes = permissionCodes.filter(
                (code) => !internalAgencyPermissions.includes(code)
              );
            }

            this.setState({
              aacCodes: aacCodes,
              activeAacCodes: activeAacCodes,
              permissionCodes,
              isInternalAgency: !!aacCodes.find(
                (code) => code.isInternalAgency === true
              ),
              permissionArray: resetPermission,
            });
            this.disablePermission();
            this.disablePAPermission();
            if (aacCodes.length === 0) {
              this.setState({
                FormErrorMessage: "Primary AAC Code is a required field",
                showErrorAlert: true,
              });
            }
          }}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      grow: 2,
    },
  ];

  onDoneeChange = (val) => {
    console.log(val, " Donee");
  };

  handleAddAAC = async () => {
    //add validation
    let aacCodes = [...this.state.aacCodes];
    let isUserSaspAdminorFI =
      UserUtils.isUserSaspAdmin() || UserUtils.isUserSaspWithFI();

    let isAacAdded = aacCodes.find((o) => o.aac === this.state.aacCode);
    let isAgencyBureauCodeExists = aacCodes.find(
      (o) =>
        o.agencyBureauCd.substring(0, 2) ===
        this.state.agencyBureau.substring(0, 2)
    );

    //this is to check if different agency bureau code are not added to a user
    if (
      aacCodes.length !== 0 &&
      !isAgencyBureauCodeExists &&
      !isUserSaspAdminorFI
    ) {
      this.setState({
        FormErrorMessage: "AAC cannot be added",
        showErrorAlert: true,
      });
    } else if (isAacAdded && !isUserSaspAdminorFI) {
      this.setState({
        FormErrorMessage: "AAC Code already exists",
        showErrorAlert: true,
      });
    } else {
      //this is to ensure that only 1 aac code is passed to the back end
      if (!isUserSaspAdminorFI) {
        aacCodes.push({
          aac: this.state.aacCode,
          agencyBureau: this.state.agencyBureauLongName,
          primaryInd: this.state.isPrimaryAacSelected,
          agencyBureauCd: this.state.agencyBureau,
          activeInd: true,
          isInternalAgency: this.state.isInternalAgency,
        });
        let resetPermission = this.state.permissionArray;
        resetPermission = await this.resetPermission(aacCodes);
        this.setState({
          aacCodes: aacCodes,
          aacCode: "",
          agencyBureau: "",
          agencyBureauLongName: "",
          FormErrorMessage: "",
          showErrorAlert: false,
          activeAacCodes: [...aacCodes],
          isAACValid: false,
          isInternalAgency: !!aacCodes.find(
            (code) => code.isInternalAgency === true
          ),
          permissionArray: resetPermission,
        });
      }
    }
    this.disablePermission();
    this.disablePAPermission();
  };

  resetPermission = (aacCodes) => {
    let {
      permissionArray,
      permissionCodes,
      fullListOfPermissionArray,
    } = this.state;

    //changed , no disable , hide it or remove internalAgency permissions from permission array
    const userPermissions = UserUtils.getUserPermissions();
    //get user role - Internal Screening permissions are valid only for SM and NU
    const isAdmin = userPermissions.find(
      (role) =>
        role === this.accessLevelType.SM || role === "NU" || role === "AC"
    );
    //check if any added AAC belong to internal agency
    var agencyBureau = { isInternalAgency: false };
    let isInternalAgencyPresent = aacCodes.find(
      (code) => code.isInternalAgency === true
    );
    agencyBureau.isInternalAgency = !!isInternalAgencyPresent;
    //if none of the added AAC are internal agency then remove them from permission code and
    //also from permission array that needs to be displayed on ui
    if (
      aacCodes.length === 0 ||
      (agencyBureau && !agencyBureau.isInternalAgency)
    ) {
      permissionArray.permissions = permissionArray.permissions.filter(
        (groupPermission) =>
          groupPermission.group !== "Internal Screening"
      );
      permissionArray.permissions.forEach((groupPermission: any) => {
        groupPermission.permissionList.forEach((permission) => {
          let isChecked = permissionCodes.includes(permission.permissionCode);
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
          groupPermission.group === "Internal Screening"
      );
      //get the list of internal permissions from the fullPermissionList and append it to permissionsArray
      if (tempArray && tempArray.length === 0) {
        let internalPermArr = fullListOfPermissionArray.permissions.filter(
          (groupPermission) =>
            groupPermission.group === "Internal Screening"
        );

        if (internalPermArr && internalPermArr.length > 0) {
          permissionArray.permissions.push(internalPermArr[0]);
        }
      }

      permissionArray.permissions.forEach((groupPermission: any) => {
        groupPermission.permissionList.forEach((permission) => {
          permission.isSelected = false;
          let isChecked = permissionCodes.includes(permission.permissionCode);
          if (isChecked) {
            permission.isSelected = true;
          }
        });
      });
    }
    return permissionArray;
  };

  handlePrimaryAac = (value) => {
    const aacCodes = [...this.state.aacCodes];
    let selectedAgencyBureauCd = "";
    aacCodes.forEach((o) => {
      if (o.aac === value.row.original.aac) {
        o.primaryInd = true;
        selectedAgencyBureauCd = o.agencyBureauCd;
      } else {
        o.primaryInd = false;
      }
    });
    this.setState({ aacCodes: aacCodes });
    if (this.state.hasSecurityAccess) {
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

  handleCancel = () => {
    isFormSubmitted.next(false);
    if (this.props.match.params.FICheck) {
      this.props.history.push({
        pathname: `${Paths.lealist}`,
        successMessage: "User successfully added!",
      });
    } else {
      this.props.history.push({
        pathname: `${Paths.usersList}`,
        successMessage: "User successfully added!",
      });
    }
  };

  /* disable permissions disables all other permission if the selected permission is SM or AC or NU or VO, ref PPDMS-6272
  * if HD is selected we are giving by defalut FF and VO remaining all other permissions are disabled
  */
  disablePermissionsForSMACNUOVO = (permissionCode, permissionCodes, permissionArray) => {
    permissionCodes.forEach((o) => {
      permissionCodes.splice(o, permissionCodes.length);
    });
    if (permissionArray) {
      permissionArray.permissions.forEach((groupPermission: any) => {
        groupPermission.permissionList.forEach((permission) => {
          if (permission.permissionCode !== permissionCode[0].id) {
            permission.isDisabled = true;
            permission.isSelected = false;
          }
        });
      });
    }
  }

  /*
  * handle permission disable when VO or SM or AC or NU permissions are selected no other permission can be given to the user, ref -> PPDMS-6272.
  * if HD permission is selected then by default we are giving FF and VO permission, no other permission can be given to the user, ref -> PPDMS-6272.
  */
  handlePermissionsBasedOnSelected = (permission, permissionCodes, permissionArray) => {
    let selectedPermssions = ["VO", "SM", "NU", "AC", "HD"];
    if (selectedPermssions.includes(permission[0].id)) {
      this.disablePermissionsForSMACNUOVO(permission, permissionCodes, permissionArray);
    }
  }

  /*
  * handle deselect permission enables all the permissions, ref -> PPDMS- 6272
  * if SM or AC or NU or VO or HD any of this permissions are selected we disable other permissions and
  * when we deselect any of the above permissions it enables all other permissions.
  * if SP is selected we give by default FF, if its deselected then FF is also deselected.
  */
  handleDeselectPermission = (permission, permissionCodes, permissionArray) => {
    let selectedPermssions = ["VO", "SM", "NU", "AC", "HD", "SP", "FF"];
    if (selectedPermssions.includes(permission[0].id)) {
      if (permissionArray) {
        permissionArray.permissions.forEach((groupPermission: any) => {
          groupPermission.permissionList.forEach((permission) => {
            permission.isDisabled = false;
            permission.isSelected = false;
            const permissionCodeIndex = permissionCodes.findIndex(
              (code) => code === "FF"
            );
            permissionCodes.splice(permissionCodeIndex, 1);
          });
        });
        this.setState({
          permissionArray,
          permissionCodes,
        });
        this.disablePermission();
        this.disablePAPermission();
      }
    }
  }

  /*
   * handleSPandHDPermissions
   * if SP permission is selected by default FF permission is given, also user can select other permission here, ref-> PPDMS-6272
   * if HD permission is selected by default FF and VO permission is given, no other permissions can be selected, ref-> PPDMS-6272
   */
  handleSPandHDPermissions = (permissionCodes, permission) => {
    if (permissionCodes.includes("SP") && permission.permissionCode === "FF") {
      permission.isDisabled = false;
      permission.isSelected = true;
      if (!permissionCodes.includes("FF")) {
        permissionCodes.push("FF");
      }
    } else if (permissionCodes.includes("HD") && (permission.permissionCode === "FF" || permission.permissionCode === "VO")) {
      permission.isDisabled = false;
      permission.isSelected = true;
      if (!permissionCodes.includes("FF") || !permissionCodes.includes("VO")) {
        permissionCodes.push("FF");
        permissionCodes.push("VO");
      }
    }
  }

  handleChangePermissions = (event) => {
    const permissionCodes = [...this.state.permissionCodes];
    let {permissionArray} = this.state;
    if (event[0].isSelected) {
      this.handlePermissionsBasedOnSelected(event, permissionCodes, permissionArray);
      permissionCodes.push(event[0].id);
    } else if (!event[0].isSelected) {
      const permissionCodeIndex = permissionCodes.findIndex(
        (code) => code === event[0].id
      );
      this.handleDeselectPermission(event, permissionCodes, permissionArray);
      permissionCodes.splice(permissionCodeIndex, 1);
    }


    permissionArray.permissions.forEach((groupPermission: any) => {
      groupPermission.permissionList.forEach((permission) => {
        let isPresent = permissionCodes.includes(permission.permissionCode);
        if (isPresent) {
          permission.isSelected = true;
        } else {
          permission.isSelected = false;
        }
        /*
        * handleSPandHDPermissions
        * if SP permission is selected by default FF permission is given, also user can select other permission here, ref-> PPDMS-6272
        * if HD permission is selected by default FF and VO permission is given, no other permissions can be selected, ref-> PPDMS-6272
        */
        this.handleSPandHDPermissions(permissionCodes, permission);
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
  onDoneeOrganiztionChange = (value: any) => {
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

  handleFedContractorNonFedRecipientDonee = (values: any) => {
    let selectedValue = values.find((item) => item.isSelected === true);
    if (selectedValue.id === "Y") {
      this.setState({ fedContractorNonFedRecipientDonee: true });
    } else if (selectedValue.id === "N") {
      this.setState({ fedContractorNonFedRecipientDonee: false });
    }
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
  handlePhoneNumberChange(value) {
    const validation = validatePhoneFax(value);
    this.setState({
      phoneIsInvalid: validation.isInvalid,
      phoneValidationMessage: validation.validationError,
    });
    this.setState({ phoneNumber: value });
  }
  validateForm() {
    this.handleFirstNameChange(this.state.firstName);
    this.handleLastNameChange(this.state.lastName);
    this.handlePhoneNumberChange(this.state.phoneNumber);
    this.onDoneeOrganiztionChange(this.state.fiDoneeOrganizationName);
  }
  handleSort = (sortBy) => { };
  render() {
    let nuoInformation;
    let showNuoInformation = false;
    if (
      this.state.hasSecurityAccess &&
      !(UserUtils.isUserSaspAdmin() || UserUtils.isUserSaspWithFI())
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
            options={yesOrNoOptions}
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

    if (this.state.permissionCodes.includes("FI")) {
      showFIInfo = true;
      showFIinformationForSMandAOandSA = (
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
                        AnyTextIsInvalid={
                          this.state.fiDoneeOrganizationNameIsInvalid
                        }
                        AnyTextIsValid={
                          this.state.fiDoneeOrganizationNameIsValid
                        }
                        validationTextMessage={
                          this.state.fiDoneeOrganizationNameValidationMessage
                        }
                        id={"donee-organization"}
                        maxLength={40}
                        required={true}
                        onChangeAnyText={(value) => {
                          this.setState({
                            fiDoneeOrganizationName: value,
                          });
                        }}
                        updateAnyText={(value) =>
                          this.onDoneeOrganiztionChange(value)
                        }
                      />
                    </div>
                  </div>
                  <div className={"grid-row grid-gap-4"}>
                    <div className="grid-col-7">
                      <PPMSAnyTextField
                        label={"Title"}
                        anyText={this.state.fiTitle}
                        id={"fi-section-title"}
                        maxLength={40}
                        required={false}
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
                    address1ValidationMessage={
                      this.state.fiAddress1ValidationMessage
                    }
                    onChangeAddress1={(value) => {
                      this.setState({
                        fiAddress1: value,
                      });
                    }}
                    updateAddress1={(value: any, validation: any) => {
                      let valid = value.length > 0;
                      this.setState({
                        fiAddress1IsInvalid: !valid,
                        fiAddress1IsValid: valid,
                        fiAddress1ValidationMessage: validation.validationError,
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
                    cityValidationMessage={this.state.fiCityValidationMessage}
                    onChangeCity={(value) => {
                      this.setState({
                        fiCity: value,
                      });
                    }}
                    updateCity={(value: any, validation: any) => {
                      let valid = value.length > 0;
                      this.setState({
                        fiCity: value,
                        fiCityIsInvalid: !valid,
                        fiCityIsValid: valid,
                        fiCityValidationMessage: validation.validationError,
                      });
                    }}
                    state={this.state.fiState}
                    stateRequired={true}
                    stateIsInvalid={this.state.fiStateIsInvalid}
                    stateIsValid={this.state.fiStateIsValid}
                    stateDisabled={
                      UserUtils.isUserSaspAdmin() ||
                      UserUtils.isUserSaspWithFI()
                    }
                    updateState={(value: any, validation: any) => {
                      this.setState({
                        fiStateCode: value,
                        fiState: value,
                        fiStateIsInvalid: validation.isInvalid,
                        fiStateIsValid: !validation.isInvalid,
                        fiStateValidationMessage: validation.validationError,
                      });
                    }}
                    disabledZipExtension={this.state.fiDisableExtension}
                    zip={this.state.fiZip1Code}
                    zipRequired={true}
                    showZipExtension={true}
                    zipIsInvalid={this.state.fiZip1IsInvalid}
                    zipIsValid={this.state.fiZip1IsValid}
                    zipValidationMessage={this.state.fiZip1ValidationMessage}
                    onChangeZip={(value) => {
                      this.setState({
                        fiZip1Code: value,
                      });
                    }}
                    updateZip={(
                      value: any,
                      inValid: false,
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
      );
    }

    let showAOinformationForSMandNUO;
    let showAOInfo = false;
    if (
      this.state.permissionCodes.includes("SP") ||
      this.state.permissionCodes.includes("FI") ||
      this.state.permissionCodes.includes("IF")
    ) {
      showAOInfo = true;
      showAOinformationForSMandNUO = (
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
                    onChangeEmail={(value: any) => {
                      this.setState({
                        aoEmail: value,
                        isAOEmailInvalid: false,
                        aoEmailValidationMessage: "",
                      });
                    }}
                    updateEmail={handleAOEmailChange}
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
                      onChangeFirstName={(value: any) => {
                        this.setState({ aoFirstName: value });
                      }}
                      updateFirstName={(value: any) => {
                        this.setState({ aoFirstName: value });
                      }}
                      middleName={this.state.aoMiddleName}
                      updateMiddleName={(value: any) => {
                        this.setState({ aoMiddleName: value });
                      }}
                      onChangeMiddleName={(value: any) => {
                        this.setState({ aoMiddleName: value });
                      }}
                      lastName={this.state.aoLastName}
                      onChangeLastName={(value: any) => {
                        this.setState({ aoLastName: value });
                      }}
                      updateLastName={(value: any) => {
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
                      showExtension={true}
                      required={false}
                      disabled={true}
                      disabledExtension={true}
                      phone={this.state.aoPhoneNumber}
                      onChangePhoneNumber={(value: any) => {
                        this.setState({ aoPhoneNumber: value });
                      }}
                      updatePhoneNumber={(value: any) => {
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
      );
    }

    let saspAdminAAC;

    if (UserUtils.isUserSaspAdmin() || UserUtils.isUserSaspWithFI()) {
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
                  this.handleAddAAC();
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
                required={true}
                aacCodes={this.state.aacCodes}
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
            <div className="usa-accordion--bordered desktop:grid-col-12">
              <div className="short-table">
                <PPMSDatatable
                  title={"Added AACs and Agency Bureaus"}
                  data={this.state.aacCodes}
                  columns={this.columns}
                  defaultSortField={"aacCode"}
                  isPaginationEnabled={false}
                  loading={false}
                  totalRows={this.state.aacCodes.length}
                  handleSort={(sortBy) => this.handleSort(sortBy)}
                />
              </div>
              <PPMSAacAgency
                aacLabel={"Primary AAC Code"}
                aacCode={this.state.aacCode}
                agencyBureau={this.state.agencyBureauLongName}
                updateAACCode={(value: any) => {
                  if (value) {
                    this.setState({
                      aacCode: value,
                    });
                  }
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
                required={this.state.aacCodes.length === 0}
                aacCodes={this.state.aacCodes}
              />
              <br />
              <div className="row">
                <div className="col">
                  <PPMSButton
                    id={"add-acc"}
                    label={"Add"}
                    type={"button"}
                    variant={"primary"}
                    onPress={this.handleAddAAC}
                    isDisabled={!this.state.isAACValid}
                  />
                </div>
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
                onChangeFirstName={(value) => {
                  this.setState({ firstName: value });
                }}
                isFirstNameInvalid={this.state.firstNameInvalid}
                validationFirstMessage={"First Name is Required."}
                isLastNameInvalid={this.state.lastNameInvalid}
                updateFirstName={(value: any) => {
                  this.handleFirstNameChange(value);
                }}
                onChangeMiddleName={(value: any) =>
                  this.setState({ middleName: value })
                }
                middleName={this.state.middleName}
                showMiddleName={true}
                updateMiddleName={(value: any) => {
                  this.setState({ middleName: value });
                }}
                lastName={this.state.lastName}
                validationLastMessage={"Last Name is Required."}
                onChangeLastName={(value: any) => {
                  this.handleLastNameChange(value);
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
                onChangePhoneNumber={(value: any) => {
                  this.setState({ phoneNumber: value });
                }}
                updatePhoneNumber={(value: any) => {
                  this.handlePhoneNumberChange(value);
                }}
                extension={this.state.phoneExtension}
                onChangePhoneExt={(value: any) => {
                  this.setState({ phoneExtension: value });
                }}
                updatePhoneExtension={(value: any) => {
                  this.setState({ phoneExtension: value });
                }}
                isInvalid={this.state.phoneIsInvalid}
                disabledExtension={this.state.phoneIsInvalid}
                maxLength={10}
                maxLengthExtension={8}
                validationMessage={this.state.phoneValidationMessage}
              />
            </div>
            <div className={"grid-row grid-gap-4"}>
              <PPMSEmailConfirm
                id={"registration-email"}
                required={true}
                validateExistingUser={true}
                email={this.state.emailAddress}
                isEmailInvalid={this.state.isRegistrationEmailInvalid}
                isEmailValid={!this.state.isRegistrationEmailInvalid}
                confirmEmail={this.state.confirmEmailAddress}
                confirmDisabled={this.state.confirmDisabled}
                isConfirmEmailInvalid={
                  this.state.isRegistrationEmailConfirmInvalid
                }
                isConfirmEmailValid={
                  !this.state.isRegistrationEmailConfirmInvalid
                }
                showEmailConfirm={true}
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
                  isInvalid={this.state.stateIsInvalid}
                  isValid={!this.state.stateIsInvalid}
                  selectedState={this.state.state}
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
                  disabled={
                    UserUtils.isUserSaspAdmin() || UserUtils.isUserSaspWithFI()
                  }
                />
              </div>
              <div className={"tablet:grid-col-6"}>
                <PPMSZip
                  id={"registration-zip"}
                  isRequired={true}
                  disabled={false}
                  zip={this.state.zip}
                  isZipValid={this.state.zipIsValid}
                  isZipInvalid={this.state.zipIsInvalid}
                  onChangeZip={(value) => {
                    this.setState({
                      zip: value,
                    });
                  }}
                  updateZip={(
                    value: any,
                    inValid: boolean,
                    valid: boolean,
                    validationError: any
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

    const permission = [
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
            className={"usa-accordion--bordered desktop:grid-col-12"}
            onSubmit={this.handleSubmit}
          >
            <div className="grid-row grid-gap-2">
              <ManageUserButtons
                isSubmitDisabled={this.state.isSubmitDisabled}
                isSubmitLoading={this.state.isSubmitLoading}
                cancelFunction={this.handleCancel}
              />
            </div>
            <div className="grid-row grid-gap-2 hard-top-right">
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
            <br />
            <PPMSAccordion bordered={true} items={saspAdminAAC} />
            
            <PPMSAccordion bordered={true} items={userInformation} />
            
            {nuoInformation}
            
            {showPermissions && (
              <>
                <PPMSAccordion bordered={true} items={permission} />
                
              </>
            )}

            {showFIinformationForSMandAOandSA}
            
            {showAOinformationForSMandNUO}
            
            <div className="grid-row grid-gap-2">
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
}

const RadioBtn = ({ aac, onChange }) => (
  <input
    id={aac.cell.row.original.aac}
    onClick={onChange}
    checked={
      !!aac.data.find(
        (data) =>
          data.primaryInd === true && data.aac === aac.cell.row.original.aac
      )
    }
    type="radio"
  />
);
