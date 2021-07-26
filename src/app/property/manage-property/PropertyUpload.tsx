import React, { useEffect } from "react";
import { bindActionCreators } from "redux";
import { PPMSCard } from "../../../ui-kit/components/common/card/PPMS-card";
import { PPMSCardBody } from "../../../ui-kit/components/common/card/PPMS-card-body";
import { PPMSCardGroup } from "../../../ui-kit/components/common/card/PPMS-card-group";

import { formatICN } from "../want-list/validations/FieldValidations";
import { connect } from "react-redux";
import { Upload } from "../create-update-property/uploads/Upload";
import { PPMSAccordion } from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import { useState } from "react";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { Paths } from "../../Router";

interface PropertyUploadModalProps {
  match: any;
  location: any;
  history: any;
  context: any;
  itemControlNumber: string;
}

function PropertyUpload(props: PropertyUploadModalProps) {
  const [filesInfected, setFilesInfected] = useState(false);
  const [ItemName, setItemName] = useState("");
  const propertyApiService = new PropertyApiService();

  useEffect(() => {
    propertyApiService
      .getProperty(props?.match?.params?.icn)
      .then((res) => {
        setItemName(res.data.itemName);
      })
      .catch((error) => {});
  }, []);

  const upload = [
    {
      title: "Upload Images and Documents",
      content: (
        <Upload
          icn={props.match.params.icn}
          fileInfectedStatus={(value) => {}}
        />
      ),
      expanded: true,
      id: "uploadMultiplePicturesDocuments",
    },
  ];

  return (
    <>
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard>
          <PPMSCardBody className="firearm-details">
            <div className={"grid-row grid-gap"}>
              <div className="tablet:grid-col-3">
                <div className="tablet:grid-row">
                  <b>ICN</b>
                </div>
                <div className="tablet:grid-row">
                  <a href={"/viewProperty/" + props.match.params.icn}>
                    {formatICN(props.match.params.icn)}
                  </a>
                </div>
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">
                  <b>Item Name</b>
                </div>
                <div className="tablet:grid-row">
                  <strong>{ItemName}</strong>
                </div>
              </div>
            </div>
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>

      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSAccordion bordered={true} items={upload} />
        </div>
      </div>
      <br />
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSButton
            variant={"primary"}
            type={"button"}
            value={"returnToManageProperty"}
            label={"Return to Manage Property"}
            className={"create-property"}
            onPress={() =>
              props.history.push({
                pathname: `${Paths.propertyList}`,
              })
            }
            id={"download-list-btn"}
          />
        </div>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(PropertyUpload);
