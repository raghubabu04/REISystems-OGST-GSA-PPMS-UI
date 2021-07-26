import React, { useState } from "react";
import { Environment } from "../../environments/environment";
import { useIdleTimer } from "react-idle-timer";
import { connect, useDispatch } from "react-redux";
import { IdleTimeOutModal } from "./LogoutModal";
import { userActions } from "../../_redux/_actions/user.actions";
import { PageHelper, Paths } from "../Router";
let countdownInterval;
let timeout;
interface SessionTimeoutProps {
  isLoggedIn: boolean;
  logoutUser: any;
  extendSession: any;
}

function SessionTimeout(props: SessionTimeoutProps) {
  const logoutNotificationTime = Environment.LOGOUT_NOTIFICATION_TIME
    ? Environment.LOGOUT_NOTIFICATION_TIME
    : 600000;
  const logoutCountdownTime = Environment.LOGOUT_COUNTDOWN_TIME
    ? Environment.LOGOUT_COUNTDOWN_TIME
    : 300000;
  const dispatch = useDispatch();
  const [timeoutModalOpen, setTimeoutModalOpen] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(0);

  const clearSessionTimeout = () => {
    clearTimeout(timeout);
  };

  const clearSessionInterval = () => {
    clearInterval(countdownInterval);
  };

  const handleLogout = (isTimedOut = false) => {
    setTimeoutModalOpen(false);
    clearSessionInterval();
    clearSessionTimeout();
    dispatch(userActions.logout());
    PageHelper.openPage(Paths.login);
    window.location.reload();
  };

  const handleContinue = () => {
    setTimeoutModalOpen(false);
    clearSessionInterval();
    clearSessionTimeout();
    dispatch(userActions.extendSession());
  };

  const onActive = () => {
    if (!timeoutModalOpen) {
      clearSessionInterval();
      clearSessionTimeout();
    }
  };

  const onAction = () => {
    //console.log("action");
  };

  const onIdle = () => {
    const delay = 1000 * 5;
    if (props.isLoggedIn && !timeoutModalOpen) {
      timeout = setTimeout(() => {
        let countDown = logoutCountdownTime / 1000;
        setTimeoutModalOpen(true);
        setTimeoutCountdown(countDown);
        countdownInterval = setInterval(() => {
          if (countDown > 0) {
            setTimeoutCountdown(--countDown);
          } else {
            handleLogout(true);
          }
        }, 1000);
      }, delay);
    }
  };
  useIdleTimer({
    timeout: logoutNotificationTime,
    onActive: onActive,
    onIdle: onIdle,
    onAction: onAction,
    debounce: 250,
  });
  return (
    <>
      <IdleTimeOutModal
        handleLogout={() => handleLogout(false)}
        showModal={timeoutModalOpen}
        handleContinue={handleContinue}
        remainingTime={timeoutCountdown * 1000}
      />
    </>
  );
}

const mapStateToProps = (state) => ({
  isLoggedIn: state?.authentication?.loggedIn,
});

const mapDispatchToProps = (dispatch) => {
  return {
    extendSession: () => {
      dispatch(userActions.extendSession());
    },
    logoutUser: () => {
      dispatch(userActions.logout());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SessionTimeout);
