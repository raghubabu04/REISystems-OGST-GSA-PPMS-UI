import React, { useEffect } from "react";
import * as OktaSignIn from "@okta/okta-signin-widget";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import {
  FaComment,
  FaInfoCircle,
  FaLock,
  FaQuestion,
  FaUserPlus,
} from "react-icons/fa";
import { AuthApiService } from "../../api-kit/auth/auth-api.service";
import { connect, useDispatch } from "react-redux";
import { userActions } from "../../_redux/_actions/user.actions";
import { PageHelper, Paths } from "../Router";

let authApiService = new AuthApiService();

function getOktaURL() {
  return authApiService
    .getOktaUrl()
    .then((response: any) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
}

const LoginBanner = (props) => {
  return (
    <>
      <div className="login-banner">
        <div className="login-banner-body">
          <span>
            This is a{" "}
            <strong>
              U.S. General Services Administration Federal Government
            </strong>
            computer system that is <strong>FOR OFFICIAL USE ONLY</strong>. This
            system is subject to monitoring. Individuals found performing
            unauthorized activities are subject to disciplinary action including
            criminal prosecution.
          </span>
        </div>
      </div>
      <br></br>
      {props.authentication.userStatus === "LOCKED" ? (
        <div
          className="card-body"
          style={{
            fontSize: "13px",
            paddingTop: "10px",
            paddingLeft: "26px",
            color: "red",
          }}
        >
          <span>
            You do not have access to PPMS. Please contact your system
            coordinator for assistance.
          </span>
        </div>
      ) : (
        ""
      )}
      {props.authentication?.invalidUser ? (
        <div
          className="card-body"
          style={{
            fontSize: "15px",
            paddingTop: "10px",
            paddingLeft: "26px",
            color: "red",
          }}
        >
          <span>
            The username or password entered is incorrect.
          </span>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
function widgetErrorCallback(err) {
  console.log(err);
}

const Login = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userActions.logout());
    dispatch(userActions.defaultUser());
    let widget;
    async function loadUI() {
      try {
        let oktaURL = await getOktaURL();
        widget = new OktaSignIn({
          baseUrl: oktaURL.data,
          logo: "",
          i18n: {
            en: {
              "primaryauth.title": " ",
              "primaryauth.submit": "Login",
              "primaryauth.username.tooltip": "Enter your username.",
            },
          },
          helpLinks: {
            help: "https://dev-340604.okta.com/help/login",
            forgotPassword: Paths.forgotPassword,
          },
          features: {
            rememberMe: false,
            router: false,
            registration: false,
          },
        });

        widget.renderEl(
          { el: "#sign-in-widget" },
          (res) => {
            res.status === "SUCCESS"
              ? dispatch(userActions.login(res))
              : widgetErrorCallback(res);
          },
          (err) => {
            widgetErrorCallback(err);
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
    loadUI();
    return () => {
      if (props?.authentication?.isLoggedIn && widget) {
        widget?.remove();
      }
    };
  }, [dispatch]);

  return (
    <div>
      <div className="grid-container ui-ppms">
        <div className="grid-row grid-gap-4">
          <LoginBanner {...props} />
        </div>
        <div className="grid-row margin-top-5 login-widget">
          <div className="tablet:grid-col-6">
            <div id="sign-in-widget" />
          </div>
          <div className="tablet:grid-col-6 welcome-box">
            <h2 className={"margin-top-5"}>
              Welcome to <span>PPMS</span>
            </h2>
            <div>
              <ul className="list-group">
                <li className="list-group-item border-0">
                  <a
                    href="# "
                    onClick={(e) => {
                      e.preventDefault();
                      authApiService.getSecureAuthURL().then((res: any) => {
                        window.location.assign(res.data);
                      });
                    }}
                  >
                    <i className="fas mr-2">
                      {<FaLock role="img" aria-label={"lock"} />}
                    </i>{" "}
                    SecureAuth Login (for GSA users only)
                  </a>
                </li>
                <li className="list-group-item border-top-0 border-bottom-0 border-left-0 border-right-0">
                  <a
                    href="# "
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <i className="fas mr-2">
                      {<FaInfoCircle role="img" aria-label={"infoCircle"} />}
                    </i>{" "}
                    About PPMS
                  </a>
                </li>
                <li className="list-group-item border-top-0 border-bottom-0 border-left-0 border-right-0">
                  <a
                    href="# "
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <i className="fas mr-2">
                      {<FaComment role="img" aria-label={"comment"} />}
                    </i>{" "}
                    FAQs
                  </a>
                </li>
                <li className="list-group-item border-top-0 border-bottom-0 border-left-0 border-right-0">
                  <a
                    href="# "
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <i className="fas mr-2">
                      {<FaQuestion role="img" aria-label={"question"} />}
                    </i>{" "}
                    Help
                  </a>
                </li>
                <li className="list-group-item border-top-0 border-bottom-0 border-left-0 border-right-0">
                  <a
                    href="# "
                    onClick={(e) => {
                      //   e.preventDefault()
                      PageHelper.openPage(Paths.emailVerification);
                    }}
                  >
                    <i className="fas mr-2">
                      {<FaUserPlus role="img" aria-label={"user plus"} />}
                    </i>{" "}
                    Register for GSA PPMS
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loginUser: (resp) => dispatch(userActions.login(resp)),
  };
};

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
