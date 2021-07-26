import React from "react";
import { PPMSCard } from "../../../../../ui-kit/components/common/card/PPMS-card";
import { PPMSCardBody } from "../../../../../ui-kit/components/common/card/PPMS-card-body";
import { PPMSCardGroup } from "../../../../../ui-kit/components/common/card/PPMS-card-group";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";

import { UserUtils } from "../../../../../utils/UserUtils";
import { FaUserCircle } from "react-icons/fa";
import {
  formatPhone,
  nullToStringUtil,
} from "../../../../../ui-kit/utilities/FormatUtil";
import { MdModeEdit } from "react-icons/md";
import { FaPhoneAlt, FaEnvelope, FaFax } from "react-icons/fa";

interface props {
  shippingDetailsState: any;
  editPress: any;
}

export const ApproverCard = ({ shippingDetailsState, editPress }: props) => {
  return (
    <div className="tablet:grid-col">
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard className="ppms-widget ppms-sub-widget">
          <PPMSCardBody className="non-tcn-main-row card-header-height widget-header">
            <div>
              <strong>
                <i className="fas head-icon">{<FaUserCircle />}</i> Agency
                Approval
              </strong>
              {(UserUtils.isSystemAdminUser() || UserUtils.isUserApo()) &&
                shippingDetailsState.showEditButtons && (
                  <PPMSButton
                    variant={"link"}
                    className="usa-button--unstyled widget-button"
                    icon={<MdModeEdit />}
                    id={"Edit Approver information"}
                    type={"button"}
                    label={""}
                    onPress={editPress}
                  />
                )}
            </div>
          </PPMSCardBody>
          <PPMSCardBody className={"card-height"}>
            <div className={"grid-row grid-gap-1"}>
              <div className={"grid-col-auto"}>
                <strong>Agency Bureau:</strong>
              </div>
              <div className={"grid-col-auto"}>
                {shippingDetailsState?.agencyApprovalOfficerAgencyBureau}
              </div>
            </div>
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col-full"}>
                <strong>Name:</strong>
              </div>
              <div className={"grid-col-full"}>
                {(shippingDetailsState?.agencyApprovalOfficerFirstName || "") +
                  " " +
                  (shippingDetailsState?.agencyApprovalOfficerMiddleName ||
                    "") +
                  " " +
                  (shippingDetailsState?.agencyApprovalOfficerLastName || "")}
              </div>

              <div className={"grid-col-full"}>
                <span>
                  <i className="fas icon-line-item mr-2">{<FaPhoneAlt />}</i>
                </span>
                &nbsp;
                {shippingDetailsState?.agencyApprovalOfficerPhone
                  ? formatPhone(
                      nullToStringUtil(
                        shippingDetailsState?.agencyApprovalOfficerPhone
                      ) + ""
                    )
                  : "-"}
              </div>

              <div className={"grid-col-full"}>
                <span>
                  <i className="fas icon-line-item mr-2">{<FaFax />}</i>
                </span>
                &nbsp;
                {shippingDetailsState?.agencyApprovalOfficerFax
                  ? shippingDetailsState.agencyApprovalOfficerFax
                  : "-"}
              </div>

              <div className={"grid-col-full"}>
                <span>
                  <i className="fas icon-line-item mr-2">{<FaEnvelope />}</i>
                </span>
                &nbsp;
                {shippingDetailsState?.agencyApprovalOfficerEmail
                  ? shippingDetailsState.agencyApprovalOfficerEmail
                  : "-"}
              </div>
            </div>
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
    </div>
  );
};
