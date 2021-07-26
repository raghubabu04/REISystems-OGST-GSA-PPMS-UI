import React from "react";
import { PPMSCard } from "../../../../../ui-kit/components/common/card/PPMS-card";
import { PPMSCardBody } from "../../../../../ui-kit/components/common/card/PPMS-card-body";
import { PPMSCardGroup } from "../../../../../ui-kit/components/common/card/PPMS-card-group";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";

import { UserUtils } from "../../../../../utils/UserUtils";
import { FaUserCircle } from "react-icons/fa";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import {
  formatPhone,
  nullToStringUtil,
} from "../../../../../ui-kit/utilities/FormatUtil";
import { MdModeEdit } from "react-icons/md";
import { FaPhoneAlt, FaEnvelope, FaFax } from "react-icons/fa";

interface props {
  aacDisabled: boolean;
  shippingDetailsState: any;
  updateActivityAddressCode: any;
  onChangeActivityAddressCode: any;
  editPress: any;
}

export const RequestorCard = ({
  shippingDetailsState,
  aacDisabled,
  updateActivityAddressCode,
  onChangeActivityAddressCode,
  editPress,
}: props) => {
  return (
    <div className="tablet:grid-col">
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard className="ppms-widget ppms-sub-widget">
          <PPMSCardBody className="non-tcn-main-row card-header-height widget-header">
            <div>
              <strong>
                <i className="fas head-icon">{<FaUserCircle />}</i> Requestor
                Information
              </strong>
              {(UserUtils.isSystemAdminUser() || UserUtils.isUserApo()) &&
                shippingDetailsState.showEditButtons && (
                  <PPMSButton
                    variant={"link"}
                    className="usa-button--unstyled widget-button"
                    icon={<MdModeEdit />}
                    id={"Edit Requestor information"}
                    type={"button"}
                    label={""}
                    onPress={editPress}
                  />
                )}
            </div>
          </PPMSCardBody>
          <PPMSCardBody className={"card-height"}>
            <div className={"grid-row grid-gap-1 flex-align-center"}>
              <div className={"grid-col-auto margin-top-1"}>
                <strong>AAC:</strong>
              </div>
              <div className={"grid-col-auto margin-left-2"}>
                <PPMSInput
                  isDisabled={aacDisabled}
                  id={"aac-code"}
                  inputType={"text"}
                  isInvalid={
                    shippingDetailsState.validation.activityAddressCodeIsInvalid
                  }
                  isValid={
                    shippingDetailsState.validation.activityAddressCodeIsValid
                  }
                  isRequired={true}
                  onBlur={(event) => {
                    updateActivityAddressCode(event.target.value);
                  }}
                  onChange={(event) => {
                    onChangeActivityAddressCode(event.target.value);
                  }}
                  validationMessage={
                    shippingDetailsState.validation.activityAddressValidation
                  }
                  value={shippingDetailsState.activityAddressCode}
                  maxLength={6}
                />
              </div>
            </div>
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col-full"}>
                <strong>Name:</strong>
              </div>
              <div className={"grid-col-full"}>
                {shippingDetailsState?.userFirstName +
                  " " +
                  shippingDetailsState?.userMiddleName +
                  " " +
                  shippingDetailsState?.userLastName}
              </div>

              <div className={"grid-col-full"}>
                <span>
                  <i className="fas icon-line-item mr-2">{<FaPhoneAlt />}</i>
                </span>
                &nbsp;
                {shippingDetailsState?.userPhone
                  ? formatPhone(
                      nullToStringUtil(shippingDetailsState?.userPhone) + ""
                    )
                  : "-"}
                &nbsp;
                {shippingDetailsState?.userPhoneExt
                  ? " Ext: " + shippingDetailsState?.userPhoneExt + ""
                  : ""}
              </div>

              <div className={"grid-col-full"}>
                <span>
                  <i className="fas icon-line-item mr-2">{<FaFax />}</i>
                </span>
                &nbsp;
                {shippingDetailsState?.userFax
                  ? formatPhone(
                      nullToStringUtil(shippingDetailsState?.userFax) + ""
                    )
                  : "-"}
              </div>

              <div className={"grid-col-full"}>
                <span>
                  <i className="fas mr-2">{<FaEnvelope />}</i>
                </span>
                &nbsp;
                {shippingDetailsState?.userEmail
                  ? shippingDetailsState.userEmail
                  : "-"}
              </div>
            </div>
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
    </div>
  );
};
