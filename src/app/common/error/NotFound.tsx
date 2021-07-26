import React from "react";
interface Props {}

function NotFound(props: Props) {
  return (
    <>
      <div className="err-container">
        <h1>404 - Page not found</h1>
        <p>Sorry, the page you were looking for is not available </p>
      </div>
    </>
  );
}

export default NotFound;
