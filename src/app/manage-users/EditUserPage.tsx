import React from "react";
import {PPMSAlert} from "../../ui-kit/components/common/PPMS-alert";
import {Form} from "react-bootstrap";
import {PPMSButton} from "../../ui-kit/components/common/PPMS-button";
import ManageUserButtons from "./ManageUserButtons";
import {PPMSAccordion} from "../../ui-kit/components/common/accordion/PPMS-accordion";
import SideNavSection from "./SideNavSection";
import {PPMSFirstNameLastName} from "../../ui-kit/components/PPMS-firstname-lastname";
import {PPMSPhoneNumber} from "../../ui-kit/components/PPMS-phone-number";
import {PPMSEmailConfirm} from "../../ui-kit/components/PPMS-email-confirm";
import {UserUtils} from "../../utils/UserUtils";
import {PPMSState} from "../../ui-kit/components/PPMS-state";
import {validateZipState, zipInvalidStateMessage,} from "../../ui-kit/components/validations/FieldValidations";
import {PPMSZip} from "../../ui-kit/components/PPMS-zip";
import PPMSDatatable from "../../ui-kit/components/common/datatable/PPMS-datatable";
import {formatExtension, formatPhone,} from "../../ui-kit/utilities/FormatUtil";
import {UserApiService} from "../../api-kit/user/user-api.service";
import {CommonApiService} from "../../api-kit/common/common-api.service";
import {MdEdit, MdRemoveCircleOutline} from "react-icons/md";
import {PageHelper, Paths} from "../Router";
import {isFormSubmitted} from "../../service/validation.service";
import {PPMSToggleRadio} from "../../ui-kit/components/common/toggle/PPMS-toggle";
import {PPMSModal} from "../../ui-kit/components/common/PPMS-modal";
import {ModalActionHistoryContent} from "../sales/management/transactions/SalesTransaction";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {addToast} from "../../_redux/_actions/toast.actions";
import {NuoEditUser} from "../models/User";

export const yesOrNoOptions = [
  {value: "Yes", id: "Y", isSelected: false},
  {value: "No", id: "N", isSelected: false},
];

export interface EditUserPageState {
  id: string;
  showErrorAlert: boolean;
  FormErrorMessage: string;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  isFormValidated: boolean;
  aacCode: string;
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
  aoFirstName: string;
  aoMiddleName: string;
  aoLastName: string;
  aoLastNameIsInvalid: boolean;
  aoPhoneNumber: string;
  aoPhoneExtension: string;
  aoEmailAddress: string;
  aoEmail: string;
  nuoEmailAddress: string;
  fedContractorNonFedRecipientDonee: boolean;
  permissionCodes: Array<any>;
  activeAacCodes: Array<any>;
  alertBodyArray: string[];
  yesOrNoOptions: any[];
  zipIsValid: boolean;
  zipIsInvalid: boolean;
  zipValidationError: string;
  accordion: any;

  fiAddress1: string;
  fiAddress2: string;
  fiAddress3: string;
  fiCity: string;
  fiStateCode: string;
  fiZip1Code: string;
  fiZip2Code: string;
  fiAddressId: string;
  fiLeadId: string;
  fiDoneeOrganizationName: string;
  fiTitle: string;

  userAccountsData: any;
  actionHistoryData: any;
  showActionHistoryModal: any;
  isAccountActive: boolean;
  isAddAccountDisabled: boolean;
  isAddAccountLoading: boolean;
  agencyBureausEndingWithZeros: any;
  agencyBureausNotEndingWIthZeros: any;
  agencyBureauForLoginNUO: any;
}

interface EditUserPageProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions?: any;
}

class EditUserPage extends React.Component<
  EditUserPageProps,
  EditUserPageState
> {
  private userApiService: UserApiService = new UserApiService();
  private commonApiService = new CommonApiService();

  constructor(props: EditUserPageProps) {
    super(props);
    this.state = {
      id: "",
      showErrorAlert: false,
      FormErrorMessage: "",
      isSubmitLoading: false,
      isSubmitDisabled: false,
      isFormValidated: false,
      aacCode: "",
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
      aoFirstName: "",
      aoFirstNameIsInvalid: false,
      aoMiddleName: "",
      aoLastName: "",
      aoLastNameIsInvalid: false,
      aoPhoneNumber: "",
      aoPhoneExtension: "",
      aoEmailAddress: "",
      aoEmail: "",
      approvingOfficialInfo: [],
      nuoEmailAddress: "",
      fedContractorNonFedRecipientDonee: false,
      hasSecurityAccess: false,
      userAccess: [],
      permissionCodes: [],
      nuoArray: [],
      aacCodes: [],
      activeAacCodes: [],
      alertBodyArray: [],
      yesOrNoOptions: yesOrNoOptions,
      zipIsValid: false,
      zipIsInvalid: false,
      zipValidationError: "",
      userAccountsData: [],
      showActionHistoryModal: false,
      actionHistoryData: [],
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
      fiAddress2: "",
      fiAddress3: "",
      fiCity: "",
      fiStateCode: "",
      fiZip1Code: "",
      fiZip2Code: "",
      fiAddressId: "",
      fiLeadId: "",
      fiDoneeOrganizationName: "",
      fiTitle: "",

      isAccountActive: false,
      isAddAccountDisabled: false,
      isAddAccountLoading: false,
      agencyBureausEndingWithZeros: [],
      agencyBureausNotEndingWIthZeros: [],
      agencyBureauForLoginNUO: [],
    } as EditUserPageState;
  }

  componentWillMount() {
    this.loadAccounts();
  }

  componentDidMount() {
    if(UserUtils.isUserNuo()){
      let agencyBureausZeros = [];
      let agencyBureausNotZeros = [];
      this.userApiService.getAgencyBureauCodesForNUO()
        .then((code) => {
          code.data.map((item) => {
            if(item.substring(2) === "00"){
              agencyBureausZeros.push(item.substring(0,2));
            } else {
              agencyBureausNotZeros.push(item);
            }
          })
          this.setState({
            agencyBureausEndingWithZeros: agencyBureausZeros,
            agencyBureausNotEndingWIthZeros: agencyBureausNotZeros,
            agencyBureauForLoginNUO: code.data,
          })
        }).catch((error) => {
        console.log(error);
        return error;
      })
    }
  }

  loadAccounts = () => {
    const data = {
      params: {
        userId: this.props.match.params.userId,
      },
    };
    this.userApiService
      .getUserWithMultipleAccounts(data)
      .then((response: any) => {
        let userAccountList = [];
        let userAccountInfo;
        response?.data?.userAccountResponses.map((account) => {
          const aacCodes = account?.aacCodes.map((aac) => {
            return " " + aac;
          });
          const agencyBureoCodes = account?.agencyBureauCodes.map((bureaoCodes) => {
            return " " + bureaoCodes;
          });
          userAccountInfo = {
            id: data.params.userId,
            accountId: account?.accountId,
            aacCodes: aacCodes.toString(),
            agencyBureauCode: agencyBureoCodes.toString(),
            permissions: account?.permissions.join(),
            approvingOfficialFullName: account?.approvingOfficial?.aoFirstName,
            isAccountActive: account.active,
          };
          userAccountList.push(userAccountInfo);
        });
        this.setState({
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
          userAccountsData: userAccountList,
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
      })
      .catch((error: any) => {
        console.log("getuser error", error);
      });
  };

  handleSalesActionHistory = () => {
    const data = {
      params: {
        objectType: "UND",
        objectId: this.props.match.params.userId,
      },
    };
    this.userApiService
      .getActionHistoryForUserObject(data)
      .then((response: any) => {
        this.setState({
          actionHistoryData: response.data,
          showActionHistoryModal: true,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  handleSubmit = (event: any) => {
    let validationMessages = [];
    if (this.state.zipIsInvalid) {
      validationMessages.push(this.state.zipValidationError);
    }
    isFormSubmitted.next(true);

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
    if (form.checkValidity() === false || validationMessages.length > 0) {
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

  handleFedContractorNonFedRecipientDonee = (event) => {
    let selectedFedDoneeOption = "";
    event.forEach((item) => {
      if (item.isSelected) {
        selectedFedDoneeOption = item.value;
      }
    });
    this.setState({
      fedContractorNonFedRecipientDonee: selectedFedDoneeOption === "Yes",
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

  checkEditButtonForSaspUser(user){
    if(UserUtils.isUserSaspAdmin()){
      let agency = user?.data[user?.row?.id].aacCodes.trim();
      if(UserUtils.getUserAACs().includes(agency)){
        return false;
      }else{
        return true;
      }
    }
  }

  nuoActionsONUserAccounts(user){
    if(UserUtils.isUserNuo()) {
      const agency = user?.data[user?.row?.id].agencyBureauCode.trim();
      return !(this.state.agencyBureausNotEndingWIthZeros.includes(agency) ||
        this.state.agencyBureausEndingWithZeros.includes(agency.substring(0, 2)))
    }
  }

  showEditButton(user){
    return (
      <>
        <PPMSButton
          variant={"secondary"}
          label={UserUtils.isUserHelpDesk() ? "View" :"Edit"}
          size={"sm"}
          icon={<MdEdit/>}
          onPress={() => {
            PageHelper.openPage(Paths.editUserAccount + "/" + this.state.id + "/" + user.data[user.row.id].accountId);
          }}
          isDisabled={this.nuoActionsONUserAccounts(user) || this.checkEditButtonForSaspUser(user)}
          id={"edit-"}
        />
      </>
    );
  }

  showDeactivateOrActivateButton(user){
    if(UserUtils.isSystemAdminUser() || UserUtils.isUserApo() || UserUtils.isUserNuo()) {
      return (
        <>
          <PPMSButton
            id={"deactivate-account -" + user.data[user.row.id].userId}
            label={user?.data[user.row.id].isAccountActive ? "Deactivate" : "Activate"}
            variant={"secondary"}
            icon={<MdRemoveCircleOutline/>}
            size={"sm"}
            type={"button"}
            isDisabled={this.nuoActionsONUserAccounts(user)}
            onPress={() => {
              const data = {
                params: user?.data[user.row.id].accountId,
                action: user?.data[user.row.id].isAccountActive ? "DEACTIVATE" : "ACTIVATE",
                userId: user?.data[user.row.id].id,
              };
              const {addToast} = this.props.actions;
              this.userApiService
                .activateOrDeactivateUserAccount(data)
                .then(() => {
                  this.setState({
                    isAccountActive: !user?.data[user.row.id].isAccountActive,
                  });
                  addToast({
                    text:
                      "Account " + data.action.toLowerCase() + "d successfully!",
                    type: "success",
                    heading: "Success",
                  });
                  this.loadAccounts();
                })
                .catch((error) => {
                  console.log(error);
                  addToast({
                    text: "You cannot deactivate this account, Please activate another account to deactivate this.",
                    type: "error",
                    heading: "Error",
                  });
                  return error;
                });
            }}
          />
        </>
      );
    }
  }

  toJSON = (state: EditUserPageState): NuoEditUser => {
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


  columns = [
    {
      Header: "Account Id",
      accessor: "accountId",
    },
    {
      Header: "AAC Code",
      accessor: "aacCodes",
    },
    {
      Header: "Agency/Bureau",
      accessor: "agencyBureauCode",
    },
    {
      Header: "Permissions",
      accessor: "permissions",
    },
    {
      Header: "Approving Official",
      accessor: "approvingOfficialFullName",
    },
    {
      Header: "Actions",
      Cell: (user) => (
        <>
          {this.showEditButton(user)}
          {this.showDeactivateOrActivateButton(user)}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableSortBy: true,
    },
  ];

  handleClose = () =>  {
    this.setState({
      showActionHistoryModal: false,
    });
  };

  render(){
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
                      UserUtils.isUserSaspAdmin()) &&
                    !this.props.match.params.FICheck
                  )
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

    const userAccounts = [
      {
        title: "User Accounts",
        content: (
          <div className="grid-row grid-gap-4">
            <div className="short-table">
              <PPMSDatatable
                title={"User Accounts Table"}
                data={this.state.userAccountsData}
                columns={this.columns}
                defaultSortField={"accountId"}
                isPaginationEnabled={false}
                loading={false}
                totalRows={this.state.userAccountsData.length}
              />
            </div>
            <div className={"grid-col-auto"}>
              <PPMSButton
                label={"Add Account"}
                id={"add-account"}
                variant={"primary"}
                type={"button"}
                isDisabled={UserUtils.isUserHelpDesk()}
                isLoading={this.state.isAddAccountLoading}
                onPress={() => {
                  PageHelper.openPage(Paths.addUserAccountMaintenance + "/" + this.state.id);
                }}
              />
            </div>
          </div>
        ),
        expanded: this.state.accordion.toggleUserAccordion,
        id: "user-accounts",
        className: "user-accounts",
        trigger: "common",
        handleToggle: (event) => {
          this.toggleAccordion(event, "toggleUserAccordion");
        },
      }
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
                <SideNavSection />
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
            <div className={"grid-row grid-col-12"}>
              <div className="grid-row grid-gap-4">
                <ManageUserButtons
                  isSubmitDisabled={this.state.isSubmitDisabled}
                  isSubmitLoading={this.state.isSubmitLoading}
                  cancelFunction={this.handleCancel}
                />
              </div>
              <div className={"action-history-und"}>
                <PPMSButton
                  className={"out-button"}
                  type={"button"}
                  value={""}
                  label={"Action History"}
                  onPress={this.handleSalesActionHistory}
                  id={"action-history-sales"}
                />
              </div>
            </div>
            <br />
            <PPMSAccordion bordered={true} items={userInformation} />
            <br />
            <PPMSAccordion items={userAccounts} />
            <br/>
            <div className="grid-row grid-gap-4">
              <ManageUserButtons
                isSubmitDisabled={this.state.isSubmitDisabled}
                isSubmitLoading={this.state.isSubmitLoading}
                cancelFunction={this.handleCancel}
              />
            </div>
            <div className="grid-row grid-gap-4">
              <PPMSModal
                body={
                  <ModalActionHistoryContent
                    data={this.state.actionHistoryData}
                    listID={"list-id"}
                    title={"Action History for U&D user"}
                  />
                }
                id={"show-action-history"}
                show={this.state.showActionHistoryModal}
                handleClose={this.handleClose}
                handleSave={""}
                title={"Action History for U&D User: " + this.state.firstName + " " + this.state.lastName}
                centered={true}
                backdrop={"static"}
                label={"Ok"}
                hideLabelCancel={true}
                hideLabel={this.state.showActionHistoryModal ? true : false}
                size={this.state.showActionHistoryModal ? "lg" : null}
              />
            </div>
          </Form>
        </main>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const mapStateToProps = () => ({});
export default connect(mapStateToProps, mapDispatchToProps)(EditUserPage);


