import React, { useEffect } from "react";
import { connect } from "react-redux";
import PPMSTitle from "../../../ui-kit/components/common/header/components/PPMS-title";
import {
  FaCheckSquare,
  FaEnvelope,
  FaExclamationTriangle,
  FaPhoneAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Paths } from "../../Router";
import { PPMSPropertyGroup } from "../../../ui-kit/components/property/PPMS-property-group";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import { history } from "../../../_redux/_helpers/history";
import { UserUtils } from "../../../utils/UserUtils";
import { UserApiService } from "../../../api-kit/user/user-api.service";
import { PropertyGroupType } from "../create-update-property/constants/Constants";
import {
  formatPhone,
  nullToStringUtil,
} from "../../../ui-kit/utilities/FormatUtil";

interface SubmissionProps {
  confirmedRequest?: any;
  roles?: any;
}

function Submission(props: SubmissionProps) {
  const userApiService = new UserApiService();
  useEffect(() => {
    if (!props.confirmedRequest) {
      history.push(Paths.searchProperty);
    }
  });

  function formatZipCode(zip: string) {
    let s = "00000" + zip;
    return s.substr(s.length - 5);
  }

  function approvingOfficialEmailExists(aoEmail: string) {
    if (aoEmail === "" || aoEmail === undefined) return false;
    userApiService
      .getApprovingOfficialByEmail(aoEmail)
      .then((res) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return false;
  }

  const items = [
    {
      title: <div>Shipping To </div>,
      content: (
        <>
          <div>
            <label>ATTN: {props.confirmedRequest?.request?.shippingAttn}</label>
          </div>
          <div>{props.confirmedRequest?.request?.shippingAddress?.line1}</div>
          <div>{props.confirmedRequest?.request?.shippingAddress?.line2}</div>
          <div>{props.confirmedRequest?.request?.shippingAddress?.line3}</div>
          <div>
            {props.confirmedRequest?.request?.shippingAddress?.city}{", "}
            {props.confirmedRequest?.request?.shippingAddress?.stateCode}{" - "}
            {formatZipCode(
              props.confirmedRequest?.request?.shippingAddress?.zip
            )}
          </div>
          {props.confirmedRequest?.request.shippingAddress?.instructions ? (
            <div className="ship-text-wrap">
              <label>Instructions :</label>
              {props.confirmedRequest?.request.shippingAddress?.instructions}
            </div>
          ) : (
            <></>
          )}
        </>
      ),
      expanded: true,
      id: "shipping-details",
    },
  ];

  const leaitems = [
    {
      title: <div>Donee (LEA) Shipping Address </div>,
      content: (
        <>
          <div>
            <label>
              ATTN: {props.confirmedRequest?.request?.leaShippingAttn}
            </label>
          </div>
          <div>
            {props.confirmedRequest?.request?.leaShippingAddress?.line1}
          </div>
          <div>
            {props.confirmedRequest?.request?.leaShippingAddress?.line2}
          </div>
          <div>
            {props.confirmedRequest?.request?.leaShippingAddress?.line3}
          </div>
          <div>
            {props.confirmedRequest?.request?.leaShippingAddress?.city}{", "}
            {props.confirmedRequest?.request?.leaShippingAddress?.stateCode}{" - "}
            {formatZipCode(
              props.confirmedRequest?.request?.leaShippingAddress?.zip
            )}
          </div>
          {props.confirmedRequest?.request.leaShippingAddress?.instructions ? (
            <div className="ship-text-wrap">
              <label>Instructions :</label>
              {props.confirmedRequest?.request.leaShippingAddress?.instructions}
            </div>
          ) : (
            <></>
          )}
        </>
      ),
      expanded: true,
      id: "lea-shipping-details",
    },
  ];

  const doneedetails = [
    {
      title: <div>Donee (LEA) Information </div>,
      content: (
        <>
          <div className="tablet:grid-col">
            <div className={"grid-row grid-gap-1 flex-align-center"}>
              <div className={"grid-col-auto margin-top-1"}>
                <strong>Donee Org:</strong>
              </div>
              <div className={"grid-col-full"}>
                {props?.confirmedRequest?.doneeinfo?.doneeTileOrg}
              </div>
            </div>
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col-full"}>
                <strong>Name:</strong>
              </div>
              <div className={"grid-col-full"}>
                {props?.confirmedRequest?.doneeinfo?.doneeTileFirstName +
                  " " +
                  props?.confirmedRequest?.doneeinfo?.doneeTileMiddleName +
                  " " +
                  props?.confirmedRequest?.doneeinfo?.doneeTileLastName}
              </div>

              <div className={"grid-col-full"}>
                <strong>Title:</strong>
              </div>
              <div className={"grid-col-full"}>
                {props?.confirmedRequest?.doneeinfo?.doneeTileTitle}
              </div>

              <div className={"grid-col-full"}>
                <span>
                  <i className="fas icon-line-item mr-2">{<FaPhoneAlt />}</i>
                </span>
                &nbsp;
                {props?.confirmedRequest?.doneeinfo?.doneeTilePhoneNumber
                  ? 
                    nullToStringUtil(props?.confirmedRequest?.doneeinfo?.doneeTilePhoneNumber)
                  : "-"}
                &nbsp;
                {props?.confirmedRequest?.doneeinfo?.doneeTilePhoneExt
                  ? " Ext: " +
                    props?.confirmedRequest?.doneeinfo?.doneeTilePhoneExt +
                    ""
                  : ""}
              </div>

              <div className={"grid-col-full"}>
                <span>
                  <i className="fas mr-2">{<FaEnvelope />}</i>
                </span>
                &nbsp;
                {props?.confirmedRequest?.doneeinfo?.doneeTileEmail
                  ? props?.confirmedRequest?.doneeinfo?.doneeTileEmail
                  : "-"}
              </div>
            </div>
          </div>
        </>
      ),
      expanded: true,
      id: "donee-details",
    },
  ];
  return (
    <>
      <div className="ui-ppms">
        <div className="grid-container-widescreen">
          <div className="grid-row grid-gap">
            <main
              className="usa-layout-docs__main desktop:grid-col-12 usa-prose usa-layout-docs"
              id="confirm-information-page"
            >
              <h1>View Cart</h1>
              <h2 className={"ui-ppms"}>
                <PPMSTitle className={"side-nav-links"}>
                  <FaCheckSquare />{" "}
                  {((props?.confirmedRequest?.request?.requestStatus ===
                    "Transferred" ||
                    props?.confirmedRequest?.request?.requestStatus ===
                      "Donated") && <>Direct Requisition Confirmation</>) || (
                    <>Checkout Confirmation</>
                  )}
                </PPMSTitle>
              </h2>
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  <div className={"flat-widget ppms-widget"}>
                    <div
                      className={
                        "usa-card__body non-tcn-main-row card-header-height widget-header"
                      }
                    >
                      {((props?.confirmedRequest?.request?.requestStatus ===
                        "Transferred" ||
                        props?.confirmedRequest?.request?.requestStatus ===
                          "Donated") && <>Successful Direct Requisition</>) || (
                        <>Successful Checkout</>
                      )}
                    </div>
                    <div className={"usa-card__body"}>
                      <p>
                        You have successfully checked out this Transfer Order{" "}
                        <strong>
                          {props?.confirmedRequest?.request?.transferControlNumber.replace(
                            /(.{2})(.{2})(.{6})/,
                            "$1-$2-$3"
                          )}
                        </strong>
                        . There are{" "}
                        <strong>
                          {props?.confirmedRequest?.remainingTCNCount}
                        </strong>{" "}
                        TCN(s) remaining in your cart.
                        {props?.confirmedRequest?.remainingTCNCount > 0 && (
                          <>
                            {" "}
                            Click{" "}
                            <strong>
                              <Link to={Paths.viewCart}>View Cart</Link>
                            </strong>{" "}
                            to check out the next TCN in your cart.
                          </>
                        )}
                      </p>
                      <p>
                        The confirmation information below will be sent to your
                        email address. You can access these details again under{" "}
                        {((props?.confirmedRequest?.request?.requestStatus ===
                          "Transferred" ||
                          props?.confirmedRequest?.request?.requestStatus ===
                            "Donated") && (
                          <strong>
                            <Link to={Paths.completedTransfer}>
                              Completed Transfers
                            </Link>
                          </strong>
                        )) || (
                          <strong>
                            <Link to={Paths.myRequests}>Property Requests</Link>
                          </strong>
                        )}
                        .
                      </p>
                      {(UserUtils.isUserApo() ||
                        UserUtils.isSystemAdminUser()) &&
                        props?.confirmedRequest?.request?.requestStatus !==
                          "Transferred" &&
                        props?.confirmedRequest?.request?.requestStatus !==
                          "Donated" &&
                        props?.confirmedRequest?.requestedBy?.email !==
                          UserUtils.getUserInfo().emailAddress &&
                        !approvingOfficialEmailExists(
                          props?.confirmedRequest?.approvingOfficialBy?.email
                        ) &&
                        props?.confirmedRequest?.request?.propertyGroup !==
                          PropertyGroupType.FOREIGN_GIFT && (
                          <p>
                            <button
                              id={"tcn-warning"}
                              type={"button"}
                              className={"usa-button  usa-button--unstyled"}
                              title="Agency Approver warning"
                            >
                              <FaExclamationTriangle />
                            </button>
                            The AO entered in the 'Agency Approval' section does
                            not exist in the system and will not be able to
                            approve the TCN. As an APO/SM, the TCN can be
                            requisitioned from the 'Requisitions' screen.
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  <h2 className={"ui-ppms"}>
                    <div className={"usa-logo side-nav-links"}>
                      <em className={"usa-logo__text"}>
                        Transfer Request Details:
                      </em>
                    </div>
                  </h2>
                  <div className={"grid-row grid-gap-4"}>
                    <div className={"grid-col"}>
                      {props.confirmedRequest?.request && (
                        <PPMSPropertyGroup
                          requests={
                            props.confirmedRequest?.request
                              ? [props.confirmedRequest?.request]
                              : []
                          }
                          expand={true}
                          actionType={"Submission"}
                          showCheckout={false}
                          priorityLabel={""}
                          roles={props.roles}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <br />
              {!props.confirmedRequest?.request?.leaUserId && (
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col"}>
                    <div className={"grid-row grid-gap-4"}>
                      <div className={"grid-col"}>
                        {props.confirmedRequest?.request && (
                          <PPMSAccordion bordered={true} items={items} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {props.confirmedRequest?.request?.leaUserId && (
                <div className={"grid-row grid-gap-4"} ng->
                  <div className={"grid-col"}>
                    <div className={"grid-row grid-gap-4"}>
                      <div className={"grid-col"}>
                        {props.confirmedRequest?.request
                          ?.leaShippingAddress && (
                          <PPMSAccordion bordered={true} items={leaitems} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {props.confirmedRequest?.request?.leaUserId && (
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col"}>
                    <div className={"grid-row grid-gap-4"}>
                      <div className={"grid-col"}>
                        {props.confirmedRequest?.doneeinfo && (
                          <PPMSAccordion bordered={true} items={doneedetails} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
const mapStateToProps = (state) => ({
  confirmedRequest: state.cart.confirmedRequest,
  roles: state.authentication.roles,
});

export default connect(mapStateToProps)(Submission);
