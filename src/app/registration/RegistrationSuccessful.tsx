import React from "react";
import { PageHelper, Paths } from "../Router";

interface State {}
interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
}
export class RegistrationSuccessful extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={"ui-ppms"}>
        <div className="justify-content-md-center grid-row grid-gap-4">
          <h1>Registration Successful</h1>
        </div>
        <div className="justify-content-md-center grid-row grid-gap-4">
          <img
            src={require("../../assets/images/registrationStep3.PNG")}
            alt="User Registration - Step 3"
          />
        </div>
        <div className="justify-content-md-center grid-row grid-gap-1">
          Please click <a href="#" onClick={(e) => {PageHelper.openPage(Paths.login);}}>Login</a> to login to PPMS
        </div>
      </div>
    );
  }
}
