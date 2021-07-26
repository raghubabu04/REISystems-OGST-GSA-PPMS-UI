import React from "react";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";

interface PPMSVideoViewProps {
  propertyUrls?: string[];
}

function PPMSVideoView(props: PPMSVideoViewProps) {
  let className: string = "upload-table";
  if (props?.propertyUrls?.length > 0) {
    className = "upload-table tablePosition";
  }

  const links = props?.propertyUrls.map((link, index) => (
    <tr>
      <td className={"tableColumnWrapper"}>
        <li>
          <a href={link} target="_blank">
            {link}
          </a>
        </li>
      </td>
    </tr>
  ));
  let linksTable = (
    <table id={"video-table"} role="table" className={className}>
      <thead role="row" className="upload-table-header">
        <tr>
          <th scope="col">Links</th>
        </tr>
      </thead>
      <tbody>{links}</tbody>
    </table>
  );
  return (
    <div className="PPMSViewCustodian">
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard className={"ppms-widget"}>
          <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
            Videos
          </PPMSCardHeader>
          <PPMSCardBody className={"card-height"}>{linksTable}</PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
    </div>
  );
}

export default PPMSVideoView;
