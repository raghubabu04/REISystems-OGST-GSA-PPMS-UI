import React from 'react';
import {PPMSCard} from "../../../../../ui-kit/components/common/card/PPMS-card";
import {PPMSCardBody} from "../../../../../ui-kit/components/common/card/PPMS-card-body";
import {PPMSCardGroup} from "../../../../../ui-kit/components/common/card/PPMS-card-group";
import {PPMSButton} from '../../../../../ui-kit/components/common/PPMS-button';
import {FaTruck} from "react-icons/fa";
import {MdModeEdit} from "react-icons/md";


interface props {
  shippingDetailsState: any;
  editPress: any;
}

export const ShippingCard = ({shippingDetailsState, editPress}) => {


  return (
    <div className="tablet:grid-col">
    <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
      <PPMSCard className="ppms-widget ppms-sub-widget">
        <PPMSCardBody className="non-tcn-main-row card-header-height widget-header">
          <div>
            <strong>
              <i className="fas head-icon">{<FaTruck />}</i> Shipping
              Details{" "}
            </strong>
            <PPMSButton
              variant={"link"}
              className="usa-button--unstyled widget-button"
              icon={<MdModeEdit />}
              id={"edit shipping information"}
              type={"button"}
              label={""}
              onPress={editPress}
            />
          </div>
        </PPMSCardBody>
        <PPMSCardBody className={"card-height"}>
          <div>
            <label>
              ATTN: {shippingDetailsState?.shippingDetailsAttn}
            </label>
          </div>
          <div>{shippingDetailsState?.shippingDetailsAddressLine1}</div>
          <div>{shippingDetailsState?.shippingDetailsAddressLine2}</div>
          <div>{shippingDetailsState?.shippingDetailsAddressLine3}</div>
          <div>
            {shippingDetailsState?.shippingDetailsCity}{", "}
            {shippingDetailsState?.shippingDetailsState}{" - "}
            {shippingDetailsState?.shippingDetailsZipcode}
          </div>
          {shippingDetailsState?.shippingDetailsInstructions ? (
            <div className="ship-text-wrap">
              <label>Instructions :</label>
              {shippingDetailsState?.shippingDetailsInstructions}
            </div>
          ) : (
              <></>
            )}
        </PPMSCardBody>
      </PPMSCard>
    </PPMSCardGroup>
  </div>


  );
}
