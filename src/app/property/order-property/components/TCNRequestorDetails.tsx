import React, { useContext, useEffect, useState } from "react";
import { ShoppingContext } from "./ShoppingCartContext";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import EditShippingInfo from "./ShippingDetails/EditShippingInformation";
import PPMSCard from "../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardGroup from "../../../../ui-kit/components/common/card/PPMS-card-group";
import { MdModeEdit } from "react-icons/md";
import {
  FaUserCircle,
  FaTruck,
  FaFileAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFax,
} from "react-icons/fa";
import { UploadDocument } from "../../order-property/components/uploads/UploadDocument";
import { PropertyApiService } from "./../../../../api-kit/property/property-api-service";
import { TNCBasicInfo } from "./uploads/FilePermissions";
import EditDoneeInformation from "./ShippingDetails/EditDoneeInformation";
import { DoneeShippingCard } from "./ShippingDetails/DoneeShippingCard";
import { DoneeInformationCard } from "./ShippingDetails/DoneeInformationCard";
import EditDoneeShippingAddress from "./ShippingDetails/EditDoneeShippingAddress";
import { UserUtils } from "../../../../utils/UserUtils";
import { UserApiService } from "../../../../api-kit/user/user-api.service";
import {
  formatPhone,
  formatExtension,
} from "../../../../ui-kit/utilities/FormatUtil";
import { FSC_DoneeInfo } from "../../create-update-property/constants/Constants";

interface TCNRequestorDetailsProps extends TNCBasicInfo {
  updateShipping?: any;
  tcn?: string;
  primaryAAC: string;
  response?: any;
  documentList?: any;
  tcnStatus?: any;
}

export function TCNRequestorDetails(props: TCNRequestorDetailsProps) {
  const { shippingDetailsState, updateShippingDetailsState } = useContext(
    ShoppingContext
  );
  const { uploadDocumentsState, updateUploadDocumentsState } = useContext(
    ShoppingContext
  );

  const [showDoneeInfoModal, setShowDoneeInfoModal] = useState(false);
  const [showDoneeShipModal, setShowDoneeShipModal] = useState(false);

  const propertyApiService = new PropertyApiService();
  const userApiService = new UserApiService();
  const tcn = props.tcn;
  useEffect(() => {
    getShippingInformation();
    //Only SM and Weapons Manager can edit LEA info on this page
    if (
      (!UserUtils.isSystemAdminUser() && !UserUtils.isUserFireArmManager()) ||
      props.tcnStatus === "Donated"
    ) {
      let details = shippingDetailsState;
      details.leaEditRestricted = true;
      updateShippingDetailsState(details);
    }

    setDoneeInfo();
  }, []);

  async function getShippingInformation() {
    let response;
    if (props.response) response = props.response;

    setUserDetails(response);
    updateFilesList();
  }

  async function setDoneeInfo() {
    let doneeAccountId;
    propertyApiService
      .getTCNDetails(tcn)
      .then((response: any) => {
        response.data.requestItems.forEach((item) => {
          if (FSC_DoneeInfo.includes(item.requestItem.federalSupplyClass)) {
            updateShippingDetailsState({
              showLeaInfo: true,
            });
          }
        });
        doneeAccountId = response.data.leaUserId;
        updateShippingDetailsState({
          cartId: response.data.cartRequestID,
        });
        getLeaUserInfo(doneeAccountId);
        setDoneeShippingDetails(response.data);
        setUserDetails(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function getLeaUserInfo(doneeAccountId) {
    const data = {
      params: {
        userAccountId: doneeAccountId,
      },
    };

    userApiService.getUser(data).then((res: any) => {
      if (res.data !== null && res.status === 200) {
        let leaInfo = res.data?.leaInformationDTO;
        updateShippingDetailsState({
          doneeInfoUserId: doneeAccountId,
          doneeTileEmail: res.data?.emailAddress,
          doneeTileFirstName: res.data?.firstName,
          doneeTileMiddleName: res.data?.middleName,
          doneeTileLastName: res.data?.lastName,
          doneeTilePhoneNumber: res.data?.phoneNumber
            ? formatPhone(res.data?.phoneNumber + "")
            : "",
          doneeTilePhoneExt: res.data?.phoneExt
            ? formatExtension(res.data?.phoneExt + "")
            : "",
          doneeTileOrg: leaInfo?.doneeOrganizationName,
          doneeTileTitle: leaInfo?.title,
        });
      }
    });
  }

  async function setDoneeShippingDetails(data) {
    let doneeShippingDetails = data.doneeShippingAddress;
    if (doneeShippingDetails) {
      updateShippingDetailsState({
        doneeShippingId: doneeShippingDetails.addressId,
        doneeTileShippingAddressLine1: doneeShippingDetails.line1,
        doneeTileShippingAddressLine2: doneeShippingDetails.line2,
        doneeTileShippingAddressLine3: doneeShippingDetails.line3,
        doneeTileShippingCity: doneeShippingDetails.city,
        doneeTileShippingStateCode: doneeShippingDetails.stateCode,
        doneeTileShippingZipcode: doneeShippingDetails.zip,
        doneeTileShippingZipExt: doneeShippingDetails.zip2,
      });
    }
  }

  async function setUserDetails(response) {
    //set user profile and shipping details
    if (response) {
      let userProfile = response.requestedBy;
      let shippingAddress =
        response.userProfileAndShippingDetails.shippingAddress;
      let shippingAttn = response.userProfileAndShippingDetails.shippingAttn;
      updateShippingDetailsState({
        activityAddressCode: response.requestedAAC,
        userFirstName: userProfile?.firstName,
        userMiddleName: userProfile?.middleName,
        userLastName: userProfile?.lastName,
        userPhone: userProfile?.phoneNumber,
        userFax: userProfile?.fax != null ? userProfile?.fax : "",
        userEmail: userProfile?.emailAddress,

        agencyApprovalOfficerFirstName:
          userProfile?.approvingOfficial?.firstName,
        agencyApprovalOfficerMiddleName:
          userProfile?.approvingOfficial?.middleName,
        agencyApprovalOfficerLastName: userProfile?.approvingOfficial?.lastName,
        agencyApprovalOfficerFax: userProfile?.approvingOfficial?.faxNumber,
        agencyApprovalOfficerPhone: userProfile?.approvingOfficial?.phoneNumber,
        agencyApprovalOfficerEmail:
          userProfile?.approvingOfficial?.emailAddress,
        agencyApprovalOfficerAddressLine1:
          userProfile?.approvingOfficial?.shippingAddressLine1,
        agencyApprovalOfficerAddressLine2:
          userProfile?.approvingOfficial?.shippingAddressLine2,
        agencyApprovalOfficerAddressLine3:
          userProfile?.approvingOfficial?.shippingAddressLine3,
        agencyApprovalOfficerAgencyBureau:
          userProfile?.approvingOfficial?.agencyBureauCd != null
            ? userProfile?.approvingOfficial?.agencyBureauCd
            : "",

        // shippingDetailsAttn: response.,
        shippingDetailsAddressLine1: shippingAddress?.line1,
        shippingDetailsAddressLine2: shippingAddress?.line2,
        shippingDetailsAddressLine3: shippingAddress?.line3,
        shippingDetailsCity: shippingAddress?.city,
        shippingDetailsState: shippingAddress?.stateCode,
        shippingDetailsZipcode: shippingAddress?.zip,
        shippingDetailsInstructions: shippingAddress?.instructions,
        //shipping attention
        shippingDetailsAttn: shippingAttn,
      });

      userApiService
        .getUserDetailsByEmail(userProfile?.emailAddress)
        .then((response) => {
          let permissions = response.data.permissions;
          if (permissions.includes("FI") && permissions.includes("SA")) {
            updateShippingDetailsState({
              showLeaInfoByRequestor: true,
              doneeInfoState: response.data.locationState,
            });
          } else {
            updateShippingDetailsState({
              showLeaInfoByRequestor: false,
            });
          }
        });
    }
  }
  const [showModal, setShowModal] = useState(false);
  function toggleModal(event) {
    setShowModal(!showModal);
    event.stopPropagation();
  }

  // async function setTCNDocuments() {
  //   let uploadedItems = props.documentList;
  //   updateUploadDocumentsState({
  //     docsFilesList: uploadedItems.length > 0 ? uploadedItems : [],
  //   });
  // }

  async function updateFilesList() {
    propertyApiService
      .getUploadedItems(tcn, "TCN")
      .then((response: any) => {
        let docsFilesList = [];
        if (response.data && response.data.documents) {
          docsFilesList = response.data.documents;
        }
        updateUploadDocumentsState({
          docsFilesList,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  const openDoneeInfoModal = () => {
    setShowDoneeInfoModal(true);
  };
  const closeDoneeInfoModal = () => {
    setShowDoneeInfoModal(false);
  };
  const openDoneeShipModal = () => {
    setShowDoneeShipModal(true);
  };
  const closeDoneeShipModal = () => {
    setShowDoneeShipModal(false);
  };

  //TCN Document section
  let uploadedItemsTag = (
    <>
      <div className={"grid-row margin-bottom-2em"}>
        <UploadDocument
          tcn={tcn.toString()}
          tncInfo={props}
          context={ShoppingContext}
        />
      </div>
    </>
  );

  return (
    <>
      {showModal && (
        <EditShippingInfo
          tcn={props.tcn}
          showModal={showModal}
          toggleModal={toggleModal}
        />
      )}
      {showDoneeInfoModal && (
        <EditDoneeInformation
          tcn={props.tcn}
          showDoneeInfoModal={true}
          toggleDoneeInfoModal={closeDoneeInfoModal}
        />
      )}
      {showDoneeShipModal && (
        <EditDoneeShippingAddress
          tcn={props.tcn}
          showDoneeShipModal={true}
          toggleDoneeShippingModal={closeDoneeShipModal}
        />
      )}

      <PPMSCardGroup className={"ppms-card-group ui-ppms ppms-card-set"}>
        <PPMSCard className={"ppms-widget ppms-sub-widget grid-col-6"}>
          <PPMSCardBody
            className={"non-tcn-main-row card-header-height widget-header"}
          >
            <div>
              <strong>
                <i className="fas head-icon">{<FaUserCircle />}</i> Requestor
                Information
              </strong>
            </div>
          </PPMSCardBody>
          <PPMSCardBody className={"card-height"}>
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col-full"}>
                <strong>Activity Address Code (AAC): </strong>

                {shippingDetailsState.activityAddressCode
                  ? shippingDetailsState.activityAddressCode
                  : ""}
              </div>
            </div>
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col-full"}>
                <strong>Name:</strong>
              </div>
              <div className={"grid-col-full"}>
                {shippingDetailsState.userFirstName ||
                shippingDetailsState.userMiddleName ||
                shippingDetailsState.userLastName
                  ? `${shippingDetailsState.userFirstName} ${shippingDetailsState.userMiddleName} ${shippingDetailsState.userLastName}`
                  : "-"}
              </div>

              <div className={"grid-col-full"}>
                <span>
                  <i className="fas mr-2">{<FaPhoneAlt />}</i>
                </span>
                &nbsp;
                {shippingDetailsState.userPhone
                  ? shippingDetailsState.userPhone
                  : "-"}
              </div>

              <div className={"grid-col-full"}>
                <span>
                  <i className="fas mr-2">{<FaFax />}</i>
                </span>
                &nbsp;
                {shippingDetailsState.userFax
                  ? shippingDetailsState.userFax
                  : "-"}
              </div>

              <div className={"grid-col-full"}>
                <span>
                  <i className="fas mr-2">{<FaEnvelope />}</i>
                </span>
                &nbsp;
                {shippingDetailsState.userEmail
                  ? shippingDetailsState.userEmail
                  : "-"}
              </div>
            </div>
          </PPMSCardBody>
        </PPMSCard>

        <PPMSCard className={"ppms-widget ppms-sub-widget grid-col-6"}>
          <PPMSCardBody
            className={"non-tcn-main-row card-header-height widget-header"}
          >
            <div>
              <strong>
                <i className="fas head-icon">{<FaTruck />}</i> Shipping Details
              </strong>{" "}
              <PPMSButton
                variant={"link"}
                className="usa-button--unstyled widget-button"
                id={"edit shipping information"}
                type={"button"}
                icon={<MdModeEdit />}
                label={""}
                onPress={toggleModal}
              />
            </div>
          </PPMSCardBody>
          <PPMSCardBody className={"card-height"}>
            <div>
              <label>ATTN: {shippingDetailsState.shippingDetailsAttn}</label>
            </div>
            <div>{shippingDetailsState.shippingDetailsAddressLine1}</div>
            <div>{shippingDetailsState.shippingDetailsAddressLine2}</div>
            <div>{shippingDetailsState.shippingDetailsAddressLine3}</div>
            <div>
              {shippingDetailsState.shippingDetailsCity}{" "}
              {shippingDetailsState.shippingDetailsState}{" "}
              {shippingDetailsState.shippingDetailsZipcode}{" "}
            </div>
            <div>{shippingDetailsState.shippingDetailsInstructions}</div>
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
      <div className="grid-row grid-gap">
        {shippingDetailsState.showLeaInfo &&
          //If user is SM or APO and requestor is SASP FI
          (((UserUtils.isSystemAdminUser() ||
            UserUtils.isUserFireArmManager()) &&
            shippingDetailsState.showLeaInfoByRequestor) ||
            //If User is SASP FI
            UserUtils.isUserSaspWithFI()) && (
            <>
              <DoneeInformationCard
                shippingDetailsState={shippingDetailsState}
                editPress={openDoneeInfoModal}
              />
              <DoneeShippingCard
                shippingDetailsState={shippingDetailsState}
                editPress={openDoneeShipModal}
              />
            </>
          )}
      </div>
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard className="ppms-widget">
          <PPMSCardBody className="non-tcn-main-row card-header-height widget-header">
            <div>
              <strong>
                <i className="fas head-icon">{<FaFileAlt />}</i> TCN Documents
              </strong>
            </div>
          </PPMSCardBody>
          <PPMSCardBody>{uploadedItemsTag}</PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
    </>
  );
}
