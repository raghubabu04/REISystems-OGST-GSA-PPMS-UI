import React from "react";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { FaDownload } from "react-icons/fa";
import { PPMSTooltip } from "../../../ui-kit/components/common/PPMS-tooltip";
import { Environment } from "../../../environments/environment";
import moment from "moment";

interface PPDMSFileViewProps {
  images?: any;
  files?: any;
}

interface PPDMSFileViewState {}

export default class PPDMSFileView extends React.Component<
  PPDMSFileViewProps,
  PPDMSFileViewState
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  private propertyService = new PropertyApiService();
  downloadFile = (file) => {
    let url =
      Environment.COMMON_URL +
      "/api/v1/downloadFile?path=" +
      file.uri +
      "&fileType=" +
      file.itemType +
      "&fileName=" +
      file.name;
    window.location.href = url;
  };
  async componentDidMount() {}
  render() {
    const files = this.props?.files
      ?.sort((a, b) => a.attachmentOrder - b.attachmentOrder)
      .map((file, index) => (
        <tr>
          <td className={"tableColumnWrapper"}>{file.name}</td>
          <td>{Math.round(file.size / 1000)} KB</td>
          <td>
            <PPMSTooltip
              trigger={"focus"}
              id={"download-image"}
              placement={"top"}
              tooltipContent={`Download Document`}
              triggerSource={
                <button
                  className="usa-button usa-button--unstyled"
                  type="button"
                  id={"download-file-" + index}
                  onClick={() => this.downloadFile(file)}
                >
                  <FaDownload className={"image-icons"} />
                </button>
              }
            />
          </td>
          <td>{moment(file.modifiedDate).format("MM/DD/YYYY")}</td>
        </tr>
      ));

    let className;
    if (this.props?.files?.length > 0) {
      className = "upload-table tablePosition";
    } else {
      className = "upload-table";
    }

    let fileTable = (
      <table id={"upload-table"} role="table" className={className}>
        <thead role="row" className="upload-table-header">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">File Size</th>
            <th scope="col">Actions</th>
            <th scope="col">Modified Date</th>
          </tr>
        </thead>
        <tbody>
          {this.props?.files?.length === 0 && (
            <tr role="row" className="upload-table-row">
              <td role="cell" className="text-center" colSpan={7}>
                No Files
              </td>
            </tr>
          )}
          {files}
        </tbody>
      </table>
    );

    return (
      <div className="PPMSViewCustodian">
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              Documents
            </PPMSCardHeader>
            <PPMSCardBody className={"card-height"}>{fileTable}</PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      </div>
    );
  }
}
