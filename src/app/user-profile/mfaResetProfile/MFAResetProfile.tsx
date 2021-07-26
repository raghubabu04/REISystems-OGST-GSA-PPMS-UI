import React from "react";
import {UserApiService} from "../../../api-kit/user/user-api.service";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import {UserUtils} from "../../../utils/UserUtils";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {addToast} from "../../../_redux/_actions/toast.actions"
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";

interface MFAResetProfileProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

export function MFAResetProfile(props: MFAResetProfileProps) {
    const userApiService = new UserApiService();

    return (
      <React.Fragment>
        <h1>MFA Reset</h1>
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget ppms-sub-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <b>Reset MultiFactor Authentication Factors</b>
            </PPMSCardHeader>
            <PPMSCardBody className={"supporting-details"}>
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  If you want to add or change an authentication factor (Text, Email, Voice, or Google Authenticator) you
                  must
                  reset all of you existing factors. Once you've clicked "Reset" button (below), you will receive an
                  email
                  confirming that your factors have been reset. You will be asked to set up your factors during your
                  next
                  login.
                </div>
              </div>
              <br/>
              <div className={"grid-col-auto"}>
                <PPMSButton
                  variant={"primary"}
                  type={"reset"}
                  label={"Reset"}
                  onPress={() => {
                    const {addToast} = props.actions;
                    userApiService
                      .mfaResetFactors(UserUtils.getLoggedInUserEmailAddress())
                      .then((response: any) => {
                        if (response.status === 200) {
                          addToast({
                            text: "Your MFA factors have been reset!",
                            type: "success",
                            heading: "Success",
                          });
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        return error;
                      })
                  }
                  }
                  id={'reset'}
                />
              </div>
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      </React.Fragment>
    );


    function reset() {
      console.log("call reset api here");

      userApiService
        .mfaResetFactors(UserUtils.getLoggedInUserEmailAddress())
        .then((response: any) => {
          if (response.status === 200) {
            addToast({
              text: "Your MFA factors have been reset!",
              type: "success",
              heading: "Success",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return error;
        })


    }

}

const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators({addToast}, dispatch),
    };
  };
  export default connect(null, mapDispatchToProps)(MFAResetProfile);
