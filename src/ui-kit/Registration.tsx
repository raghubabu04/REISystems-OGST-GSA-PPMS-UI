import React from "react";
import { Form } from "react-bootstrap";
import { MdEmail } from "react-icons/md";
import { PPMSFirstNameLastName } from "./components/PPMS-firstname-lastname";
import { PPMSInput } from "./components/common/input/PPMS-input";
import { PPMSSelect } from "./components/common/select/PPMS-select";
import { PPMSModal } from "./components/common/PPMS-modal";
import { PPMSButton } from "./components/common/PPMS-button";
import PPMSChecklist from "./components/PPMS-checklist";

interface State {
  validated: boolean;
  firstName: string;
  lastName: string;
  showModal: boolean;
  zipCode: string;
  zipCodeExtension: string;
}

export class Registration extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      validated: false,
      firstName: "",
      lastName: "",
      showModal: false,
      zipCode: "",
      zipCodeExtension: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeFirstNameLastName = this.handleChangeFirstNameLastName.bind(
      this
    );
    this.handleReset = this.handleReset.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
  }
  // private userApiService:UserApiService = new UserApiService();
  values = [
    {
      id: "1",
      name: "One",
    },
    {
      id: "2",
      name: "Two",
    },
    {
      id: "3",
      name: "Three",
    },
    {
      id: "4",
      name: "Four",
    },
  ];
  permissionValues = {
    permissions: [
      {
        group: "NASA Permission",
        permissionList: [
          {
            permissionCode: "RR",
            permissionName: "Search/Select",
          },
          {
            permissionCode: "RP",
            permissionName: "Reporty Property",
          },
        ],
      },
      {
        group: "General Permission",
        permissionList: [
          {
            permissionCode: "AO",
            permissionName: "Approving Official",
          },
          {
            permissionCode: "SM",
            permissionName: "Security Mantainance",
          },
        ],
      },
    ],
  };
  handleChangeFirstNameLastName = (event: any) => {
    if (event.target.name === "firstName") {
      this.setState({ firstName: event.target.value });
    } else {
      this.setState({ lastName: event.target.value });
    }
  };
  handleSubmit = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      // this.userApiService.registerUser(this.state)
      //     .then(response=>{
      //         console.log(response);
      //         //TODO Redirect to another component/link if needed
      //         //window.location.replace("/")
      //     })
      //     .catch(error => {
      //         console.log(error);
      //     });
    }
    this.setState({ validated: true });
  };

  handleReset = (event: any) => {
    console.log("reset");
  };
  handleOpenModal = (event: any) => {
    console.log("open modal");
    this.setState({ showModal: true });
  };
  handleToggleChange = (event: any) => {
    console.log(event);
  };
  render() {
    return (
      <div>
        <div className={"grid-container"}>
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleSubmit}
          >
            <div onChange={this.handleChangeFirstNameLastName}>
              <PPMSFirstNameLastName
                size={"sm"}
                required={true}
                id={"registration"}
                disabled={false}
                firstName={""}
                onChangeFirstName={(value)=>{ this.setState({firstName:value})}}
                isFirstNameInvalid={false}
                isFirstNameValid={false}
                isLastNameInvalid={false}
                isLastNameValid={false}
                isMiddleNameInvalid={false}
                isMiddleNameValid={false}
                onChangeLastName={(value)=>{ this.setState({lastName:value})}}
                lastName={""}
                maxLength={14}
                maxMiddleLength={1}
                middleName={""}
                updateFirstName={""}
                updateLastName={""}
                updateMiddleName={""}
                validationFirstMessage={""}
                validationLastMessage={""}
              />
            </div>
            <div>
              <PPMSInput
                inputType={"text"}
                label={"Name"}
                id={"registrationName"}
                isDisabled={true}
                placeHolder={"Name"}
                isInvalid={false}
                isValid={false}
                isRequired={false}
                value={""}
                minLength={1}
                maxLength={50}
              />
            </div>
            <div>
              <PPMSInput
                inputType={"email"}
                id={"registrationEmail"}
                icon={<MdEmail />}
                placeHolder={"test@test.com"}
                label={"Email"}
                message={"We'll never share your email with anyone else."}
                validationMessage={"is Required"}
                isInvalid={false}
                isValid={false}
                isRequired={true}
                isDisabled={false}
                value={""}
                minLength={1}
                maxLength={50}
              />
            </div>
            <div>
              <PPMSInput
                inputType={"password"}
                id={"registrationPassword"}
                label={"Password"}
                message={"Password should be.."}
                validationMessage={"is Required"}
                isInvalid={false}
                isValid={false}
                isRequired={true}
                isDisabled={false}
                value={""}
                minLength={1}
                maxLength={50}
              />
            </div>
            <div>
              <PPMSChecklist values={this.permissionValues} />
            </div>
            <div>
              <PPMSSelect
                values={this.values}
                label={"Dropdown"}
                //defaultValue={"Select Value"}
                identifierKey={"id"}
                identifierValue={"name"}
                isInvalid={false}
                isValid={false}
                onChange={() => {}}
                isRequired={true}
                selectedValue={"2"}
                validationMessage={""}
              />
            </div>
            {/*<div>*/}
            {/*  <PPMSState*/}
            {/*    label={"State"}*/}
            {/*    required={true}*/}
            {/*    selectedState={"DC"}*/}
            {/*    updateLocationState={(value: any) => {*/}
            {/*      console.log(value);*/}
            {/*    }}*/}
            {/*    disabled={false}*/}
            {/*  />*/}
            {/*</div>*/}
            <div>
              <PPMSModal
                show={this.state.showModal}
                title={"PPMS Title"}
                body={"PPMS Power!"}
                id={"ppms-modal"}
                handleClose={this.setState({
                  showModal: false,
                })}
                handleSave={this.setState({
                  showModal: false,
                })}
              />
            </div>
            <div>
              <PPMSButton
                variant={"danger"}
                type={"button"}
                value={"openModal"}
                label={"Open Modal"}
                onPress={this.handleOpenModal}
                id={"open-modal"}
              />
            </div>
            <div>
              <PPMSButton
                variant={"primary"}
                type={"submit"}
                value={"submit"}
                label={"Submit"}
                onPress={""}
                id={"submit"}
              />
              <PPMSButton
                variant={"secondary"}
                type={"button"}
                value={"reset"}
                label={"Reset"}
                onPress={this.handleReset}
                id={"reset"}
              />
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
export default Registration;
