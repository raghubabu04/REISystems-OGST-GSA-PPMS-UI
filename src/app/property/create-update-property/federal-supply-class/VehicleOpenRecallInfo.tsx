import React from "react";

export class VehicleOpenRecallInfo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <p>
          Please select “Yes” if a vehicle has an open recall. If you are
          unsure, please visit:
          <a
            href="https://www.nhtsa.gov/recalls"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.nhtsa.gov/recalls
          </a>{" "}
        </p>
      </React.Fragment>
    );
  }
}
