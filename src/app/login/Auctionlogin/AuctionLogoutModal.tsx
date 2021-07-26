import React from "react";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
function formatTime(millis) {
  let minutes = Math.floor(millis / 60000);
  let seconds = parseInt(((millis % 60000) / 1000).toFixed(0));
  return (
    <>
      {minutes !== 0 && (
        <>
          <strong>{minutes} minute(s)</strong> and{" "}
        </>
      )}
      <strong>{(seconds < 10 ? "0" : "") + seconds} second(s)</strong>
    </>
  );
}
export const IdleTimeOutModal = ({
  showModal,
  handleContinue,
  handleLogout,
  remainingTime,
}) => {
  const LogoutContent = () => {
    return (
      <div>
        <p>
          Your login session will expire in {formatTime(remainingTime)} due to
          inactivity. Do you want to stay signed in?
        </p>
      </div>
    );
  };
  return (
    <PPMSModal
      show={showModal}
      handleClose={handleContinue}
      handleSave={handleLogout}
      title={"User Session Timeout"}
      centered={true}
      backdrop={"static"}
      label={"Logout"}
      hideLabel={true}
      labelVariant={"danger"}
      labelCancel={"Continue"}
      labelCancelVariant={"primary"}
      body={<LogoutContent />}
      id={"delete-files"}
    />
  );
};
