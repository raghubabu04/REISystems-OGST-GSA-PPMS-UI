import React, { useContext, useEffect, useState } from "react";
import { ShoppingContext } from "../ShoppingCartContext";
import { PropertyApiService } from "../../../../../api-kit/property/property-api-service";
import EditShippingInfo from "./EditShippingInformation";
import EditRequestorInfo from "./EditRequestorInformation";
import {
  aacCodeValidation,
  isEmptyCheck,
} from "../../../../../ui-kit/components/validations/FieldValidations";
import { UserUtils } from "../../../../../utils/UserUtils";
import { CommonApiService } from "../../../../../api-kit/common/common-api.service";
import { RequestorCard } from "./RequestorCard";
import { ApproverCard } from "./ApproverCard";
import { ShippingCard } from "./ShippingCard";
import EditApproverInformation from "./EditApproverInformation";
import { UserApiService } from "../../../../../api-kit/user/user-api.service";
import { DoneeInformationCard } from "./DoneeInformationCard";
import { DoneeShippingCard } from "./DoneeShippingCard";
import EditDoneeShippingAddress from "./EditDoneeShippingAddress";
import EditDoneeInformation from "./EditDoneeInformation";
import {
  formatExtension,
  formatPhone,
} from "../../../../../ui-kit/utilities/FormatUtil";
import { FSC_DoneeInfo } from "../../../create-update-property/constants/Constants";

let propertyApiService = new PropertyApiService();
const userApiService = new UserApiService();

interface ShippingDetailsProps {
  user?: number;
  updateShipping?: any;
  tcn?: string;
  aacs?: any;
  primaryAAC: string;
}

export function ShippingDetailsClass(props: ShippingDetailsProps) {
  const { shippingDetailsState, updateShippingDetailsState } = useContext(
    ShoppingContext
  );

  const [showShipModal, setShowShipModal] = useState(false);
  const [showRequestorModal, setShowRequestorModal] = useState(false);
  const [showApproverModal, setShowApproverModal] = useState(false);
  const [showDoneeInfoModal, setShowDoneeInfoModal] = useState(false);
  const [showDoneeShipModal, setShowDoneeShipModal] = useState(false);
  const [aacDisable, setAacDisable] = useState(false);
  const [commonApiService] = useState(new CommonApiService());

  useEffect(() => {
    getShippingInformation();
    disableAAC();
  }, []);

  async function getShippingInformation() {
    let response = await propertyApiService.getShippingInformation(props.tcn);

    propertyApiService.getCartItems().then((res) => {
      let requestedItems = res.data.requests;
      let filteredResponseByTCN = res.data.requests.filter(
        (data) => data.transferControlNumber == props.tcn
      );

      setDoneeInfo(filteredResponseByTCN);
      setDoneeShippingDetails(filteredResponseByTCN);
      setRequestorDetails(filteredResponseByTCN);
      setShippingDetails(filteredResponseByTCN);
      setApprovingOfficialDetails(filteredResponseByTCN);
      requestedItems.forEach((item) => {
        if (item.transferControlNumber === props.tcn) {
          item.requestItems.forEach((element) => {
            if (element.requestItem.itemStatus === "INTERNAL SCREENING") {
              updateShippingDetailsState({
                showEditButtons: false,
              });
            } else if (
              FSC_DoneeInfo.includes(element.requestItem.federalSupplyClass)
            ) {
              updateShippingDetailsState({
                showLeaInfo: true,
              });
            }
          });
        }
      });
    });
    setAAC(response);
  }

  const openShipModal = () => {
    setShowShipModal(true);
  };
  const openApproverModal = () => {
    setShowApproverModal(true);
  };
  const openRequestorModal = () => {
    setShowRequestorModal(true);
  };
  const closeShipModal = () => {
    setShowShipModal(false);
  };
  const closeApproverModal = () => {
    setShowApproverModal(false);
  };
  const closeRequestorModal = () => {
    setShowRequestorModal(false);
  };
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

  function onChangeActivityAddressCode(value) {
    let validation = shippingDetailsState.validation;
    validation.activityAddressCodeIsInvalid = false;
    validation.activityAddressValidation = "";
    updateShippingDetailsState({
      activityAddressCode: value,
      validation: validation,
    });
  }

  function updateActivityAddressCode(value) {
    let validate = aacCodeValidation(value);
    let validation = shippingDetailsState.validation;
    validation.activityAddressCodeIsValid = !validate.isInvalid;
    validation.activityAddressCodeIsInvalid = validate.isInvalid;
    validation.activityAddressValidation = validate.validationError;
    if (!validation.activityAddressCodeIsInvalid && !isEmptyCheck(value)) {
      const aacValue = value;
      const data = {
        params: {
          agencyCode: aacValue,
        },
      };
      if (UserUtils.isUserApo() || UserUtils.isSystemAdminUser()) {
        commonApiService
          .getBureau(data)
          .then(async (response: any) => {
            validation.activityAddressCodeIsInvalid = false;
            validation.activityAddressCodeIsValid = true;
            validation.activityAddressValidation = "";
            updateShippingDetailsState({
              validation: validation,
              activityAddressCode: aacValue,
              agencyApprovalOfficerAgencyBureau: response.data.code,
            });
          })
          .catch((error) => {
            validation.activityAddressCodeIsInvalid = true;
            validation.activityAddressCodeIsValid = false;
            validation.activityAddressValidation =
              "AAC Not Found in Customer Address File, Please contact your Agency AAC Point of Contact to update";
            updateShippingDetailsState({
              validation: validation,
            });
          });
      } else {
        commonApiService
          .getBureau(data)
          .then(async (response: any) => {
            userApiService
              .getUserDetailsByEmail(shippingDetailsState.userEmail)
              .then((userApiResponse) => {
                if (
                  !response?.data?.aacCodesList?.find(
                    (element) => element === aacValue
                  )
                ) {
                  validation.activityAddressCodeIsInvalid = true;
                  validation.activityAddressCodeIsValid = false;
                  validation.activityAddressValidation =
                    "Please enter a valid AAC.";
                  updateShippingDetailsState({
                    validation: validation,
                  });
                } else {
                  validation.activityAddressCodeIsInvalid = false;
                  validation.activityAddressCodeIsValid = true;
                  validation.activityAddressValidation = "";
                  updateShippingDetailsState({
                    validation: validation,
                    activityAddressCode: aacValue,
                    agencyApprovalOfficerAgencyBureau: response.data.code,
                  });
                }
              })
              .catch((error) => {
                validation.activityAddressCodeIsInvalid = true;
                validation.activityAddressCodeIsValid = false;
                validation.activityAddressValidation =
                  "Please enter a valid AAC";
                updateShippingDetailsState({
                  validation: validation,
                });
              });
          })
          .catch((error) => {
            validation.activityAddressCodeIsInvalid = true;
            validation.activityAddressCodeIsValid = false;
            validation.activityAddressValidation =
              "AAC Not Found in Customer Address File, Please contact your Agency AAC Point of Contact to update";
            updateShippingDetailsState({
              validation: validation,
            });
          });
      }
      setShippingAddress(value);
    }
    updateShippingDetailsState({
      activityAddressCode: value,
      validation: validation,
    });
  }

  async function setDoneeInfo(response) {
    let doneeAccountId = response[0].leaUserId;
    if (doneeAccountId) {
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
            doneeTilePhoneExt: res.data?.phoneExt ? res.data?.phoneExt : "",
            doneeTileOrg: leaInfo?.doneeOrganizationName,
            doneeTileTitle: leaInfo?.title,
          });
        }
      });
    }
  }

  function setShippingAddress(aacCode){
    commonApiService.
    getReportingAddressList(aacCode)
    .then( (response: any) => {
      let shippingData = response.data[0];
      updateShippingDetailsState({
        //shipping details info
        shippingDetailsAttn: null,
        shippingDetailsAddressLine1: shippingData.line1,
        shippingDetailsAddressLine2: shippingData.line2,
        shippingDetailsAddressLine3: shippingData.line3,
        shippingDetailsCity: shippingData.city,
        shippingDetailsState: shippingData.stateCode,
        shippingDetailsZipcode: shippingData.zip,
        shippingDetailsInstructions: null,
      });
    }).catch((error) => {
    });
  }

  async function setShippingDetails(response) {
    setShippingAddress(response[0].requestedAACId);
  }

  async function setDoneeShippingDetails(response) {
    let doneeShippingDetails = response[0].leaShippingAddress;
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
        doneeTileShippingAddressAttn: response[0].leaShippingAttn,
        doneeTileShippingInstructions: doneeShippingDetails.instructions,
      });
    }
  }

  async function setRequestorDetails(response) {
    let requestor = response[0];
    userApiService
      .getUserDetailsByEmail(requestor.requestedBy.email)
      .then((response) => {
        let locationState = response.data.locationState;
        let permissions = response.data.permissions;
        if (permissions.includes("FI") && permissions.includes("SA")) {
          updateShippingDetailsState({
            showLeaInfoByRequestor: true,
            doneeInfoState: locationState,
          });
        } else {
          updateShippingDetailsState({
            showLeaInfoByRequestor: false,
          });
        }
      });

    updateShippingDetailsState({
      //Requestor info
      userId: requestor.requestedBy.contactId,
      userFirstName: requestor.requestedBy.firstName,
      userMiddleName: requestor.requestedBy.middleName,
      userLastName: requestor.requestedBy.lastName,
      userPhone: requestor.requestedBy.phone,
      userPhoneExt: requestor.requestedBy.phoneExtension,
      userFax: requestor.requestedBy.fax,
      userEmail: requestor.requestedBy.email,
      userFirstNameModal: requestor.requestedBy.firstName,
      userMiddleNameModal: requestor.requestedBy.middleName,
      userLastNameModal: requestor.requestedBy.lastName,
      userPhoneModal: requestor.requestedBy.phone,
      userPhoneExtModal: requestor.requestedBy.phoneExtension,
      userFaxModal: requestor.requestedBy.fax,
      userEmailModal: requestor.requestedBy.email,
      cartId: requestor.cartRequestId,
    });
  }

  async function setApprovingOfficialDetails(response) {
    let approvingOfficial = response[0];
    if (approvingOfficial.approvingOfficialBy !== null) {
      updateShippingDetailsState({
        contactId: approvingOfficial.approvingOfficialBy.contactId,
        agencyApprovalOfficerAgencyBureau:
          approvingOfficial?.requestItems[0]?.requestItem?.agencyBureau,
        agencyApprovalOfficerFirstName:
          approvingOfficial.approvingOfficialBy.firstName,
        agencyApprovalOfficerMiddleName:
          approvingOfficial.approvingOfficialBy.middleName,
        agencyApprovalOfficerLastName:
          approvingOfficial.approvingOfficialBy.lastName,
        agencyApprovalOfficerPhone: approvingOfficial.approvingOfficialBy.phone,
        agencyApprovalOfficerFax: approvingOfficial.approvingOfficialBy.fax,
        agencyApprovalOfficerPhoneExt:
          approvingOfficial.approvingOfficialBy.phoneExtension,
        agencyApprovalOfficerEmail: approvingOfficial.approvingOfficialBy.email,
        agencyApprovalOfficerFirstNameModal:
          approvingOfficial.approvingOfficialBy.firstName,
        agencyApprovalOfficerMiddleNameModal:
          approvingOfficial.approvingOfficialBy.middleName,
        agencyApprovalOfficerLastNameModal:
          approvingOfficial.approvingOfficialBy.lastName,
        agencyApprovalOfficerFaxModal:
          approvingOfficial.approvingOfficialBy.fax,
        agencyApprovalOfficerPhoneModal:
          approvingOfficial.approvingOfficialBy.phone,
        agencyApprovalOfficerPhoneExtModal:
          approvingOfficial.approvingOfficialBy.phoneExtension,
        agencyApprovalOfficerEmailModal:
          approvingOfficial.approvingOfficialBy.email,

        cartRequestId: approvingOfficial.cartRequestId,
      });
    }
  }

  async function setAAC(response) {
    updateShippingDetailsState({
      activityAddressCode: response.data.shippingDTO.aac,
    });
  }

  const disableAAC = () => {
    const isSystemAdmin = UserUtils.isSystemAdminUser();
    const isUserApo = UserUtils.isUserApo();
    const userAACs = UserUtils.getUserAACs();
    if (userAACs.length <= 1 && !(isSystemAdmin || isUserApo)) {
      setAacDisable(true);
    }
  };

  return (
    <>
      {showShipModal && (
        <EditShippingInfo
          tcn={props.tcn}
          showModal={true}
          toggleModal={closeShipModal}
        />
      )}
      {showRequestorModal && (
        <EditRequestorInfo
          tcn={props.tcn}
          showRequestorModal={true}
          toggleRequestorModal={closeRequestorModal}
        />
      )}
      {showApproverModal && (
        <EditApproverInformation
          showApprovalModal={true}
          tcn={props.tcn}
          toggleApprovalModal={closeApproverModal}
        />
      )}
      {showDoneeInfoModal && (
        <EditDoneeInformation
          tcn={props.tcn}
          showDoneeInfoModal={true}
          toggleDoneeInfoModal={closeDoneeInfoModal}
          isAllocation={false}
        />
      )}
      {showDoneeShipModal && (
        <EditDoneeShippingAddress
          tcn={props.tcn}
          showDoneeShipModal={true}
          toggleDoneeShippingModal={closeDoneeShipModal}
          isAllocation={false}
        />
      )}
      <div className="grid-row grid-gap">
        <RequestorCard
          aacDisabled={aacDisable}
          shippingDetailsState={shippingDetailsState}
          editPress={openRequestorModal}
          updateActivityAddressCode={updateActivityAddressCode}
          onChangeActivityAddressCode={onChangeActivityAddressCode}
        />
        <ApproverCard
          shippingDetailsState={shippingDetailsState}
          editPress={openApproverModal}
        />
        <ShippingCard
          shippingDetailsState={shippingDetailsState}
          editPress={openShipModal}
        />
      </div>
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
    </>
  );
}
