import React from "react";
import { PPMSCard } from "../../../../../ui-kit/components/common/card/PPMS-card";
import { PPMSCardBody } from "../../../../../ui-kit/components/common/card/PPMS-card-body";
import { PPMSCardGroup } from "../../../../../ui-kit/components/common/card/PPMS-card-group";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { UserUtils } from "../../../../../utils/UserUtils";
import { FaTruck } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";

interface props {
  shippingDetailsState: any;
  editPress: any;
}

export const DoneeShippingCard = ({ shippingDetailsState, editPress }) => {
  return (
    <div className="tablet:grid-col">
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard className="ppms-widget ppms-sub-widget">
          <PPMSCardBody className="non-tcn-main-row card-header-height widget-header">
            <div>
              <strong>
                <i className="fas head-icon">
                  {<FaTruck title={"Donee Shipping Info"} />}
                </i>{" "}
                Donee (LEA) Shipping Address{" "}
              </strong>
              {(UserUtils.isSystemAdminUser() ||
                UserUtils.isUserFireArmManager() ||
                UserUtils.isUserSaspWithFI()) &&
                shippingDetailsState.doneeShippingId &&
                !shippingDetailsState.leaEditRestricted && (
                  <PPMSButton
                    variant={"link"}
                    className="usa-button--unstyled widget-button"
                    icon={<MdModeEdit />}
                    id={"edit donee shipping information"}
                    type={"button"}
                    label={""}
                    onPress={editPress}
                    ariaLabel={"Edit Shipping Information"}
                  />
                )}
            </div>
          </PPMSCardBody>
          <PPMSCardBody className={"card-height"}>
          <div>
            <label>
              ATTN: {shippingDetailsState?.doneeTileShippingAddressAttn}
            </label>
          </div>
            <div>{shippingDetailsState?.doneeTileShippingAddressLine1}</div>
            <div>{shippingDetailsState?.doneeTileShippingAddressLine2}</div>
            <div>{shippingDetailsState?.doneeTileShippingAddressLine3}</div>
            <div>
              {shippingDetailsState?.doneeTileShippingCity ? ( <> {shippingDetailsState?.doneeTileShippingCity},  </>): (<></>)}
              {shippingDetailsState?.doneeTileShippingStateCode? (<> {shippingDetailsState?.doneeTileShippingStateCode} - </>): (<></>)}
              {shippingDetailsState?.doneeTileShippingZipcode}
            </div>
            {shippingDetailsState?.doneeTileShippingInstructions ? (
            <div className="ship-text-wrap">
              <label>Instructions :</label>
              {shippingDetailsState?.doneeTileShippingInstructions}
            </div>
          ) : (
              <></>
            )}
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
    </div>
  );
};
