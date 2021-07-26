import React from "react";
interface Props {}

function UserLocked(props: Props) {
  return (
    <>
      <div>
        <p>You do not have access to PPMS. Please contact your system coordinator for assistance.</p>
      </div>
    </>
  );
}

export default UserLocked;
