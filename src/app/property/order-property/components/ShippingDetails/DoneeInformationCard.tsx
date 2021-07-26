import React from "react";
import { PPMSCard } from "../../../../../ui-kit/components/common/card/PPMS-card";
import { PPMSCardBody } from "../../../../../ui-kit/components/common/card/PPMS-card-body";
import { PPMSCardGroup } from "../../../../../ui-kit/components/common/card/PPMS-card-group";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";

import { UserUtils } from "../../../../../utils/UserUtils";
import { FaUserCircle } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import {
  formatPhone,
  nullToStringUtil,
} from "../../../../../ui-kit/utilities/FormatUtil";

interface props {
  shippingDetailsState: any;
  editPress: any;
}

export const DoneeInformationCard = ({
  shippingDetailsState,
  editPress,
}: props) => {
  return (
    <div className="tablet:grid-col">
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard className="ppms-widget ppms-sub-widget">
          <PPMSCardBody className="non-tcn-main-row card-header-height widget-header">
            <div>
              <strong>
                <i className="fas head-icon">
                  {<FaUserCircle title={"Donee User"} />}
                </i>{" "}
                Donee (LEA) Information
              </strong>
              {(UserUtils.isSystemAdminUser() ||
                UserUtils.isUserFireArmManager() ||
                UserUtils.isUserSaspWithFI()) &&
                !shippingDetailsState.leaEditRestricted && (
                  <PPMSButton
                    variant={"link"}
                    className="usa-button--unstyled widget-button"
                    icon={<MdModeEdit />}
                    id={"Edit Donee information"}
                    type={"button"}
                    label={""}
                    onPress={editPress}
                    ariaLabel={"Edit Donee Information"}
                  />
                )}
            </div>
          </PPMSCardBody>
          <PPMSCardBody className={"card-height"}>
            <div className={"grid-row grid-gap-1 flex-align-center"}>
              <div className={"grid-col-auto margin-top-1"}>
                <strong>Donee Org:</strong>
              </div>
              <div className={"grid-col-full"}>
                {shippingDetailsState.doneeTileOrg}
              </div>
            </div>
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col-full"}>
                <strong>Name:</strong>
              </div>
              <div className={"grid-col-full"}>
                {shippingDetailsState?.doneeTileFirstName +
                  " " +
                  shippingDetailsState?.doneeTileMiddleName +
                  " " +
                  shippingDetailsState?.doneeTileLastName}
              </div>

              <div className={"grid-col-full"}>
                <strong>Title:</strong>
              </div>
              <div className={"grid-col-full"}>
                {shippingDetailsState.doneeTileTitle}
              </div>

              <div className={"grid-col-full"}>
                <span>
                  <i className="fas icon-line-item mr-2">
                    {<FaPhoneAlt title={"Phone"} />}
                  </i>
                </span>
                &nbsp;
                {shippingDetailsState?.doneeTilePhoneNumber
                  ? nullToStringUtil(shippingDetailsState?.doneeTilePhoneNumber)
                  : "-"}
                &nbsp;
                {shippingDetailsState?.doneeTilePhoneExt
                  ? " Ext: " + shippingDetailsState?.doneeTilePhoneExt + ""
                  : ""}
              </div>

              <div className={"grid-col-full"}>
                <span>
                  <i className="fas mr-2">{<FaEnvelope title={"Email"} />}</i>
                </span>
                &nbsp;
                {shippingDetailsState?.doneeTileEmail
                  ? shippingDetailsState.doneeTileEmail
                  : "-"}
              </div>
            </div>
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
    </div>
  );
};
