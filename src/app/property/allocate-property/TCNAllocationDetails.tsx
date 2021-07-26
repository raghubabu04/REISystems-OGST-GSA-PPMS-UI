import React, { useContext, useEffect, useState } from "react";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PPMSTextArea } from "../../../ui-kit/components/common/input/PPMS-textarea";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { PPMSProperty } from "../../../ui-kit/components/property/PPMS-property";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { commonActions } from "../../../_redux/_actions/common.actions";
import { AllocationContext } from "./AllocationContext";
import EditShippingInfo from "../order-property/components/ShippingDetails/EditShippingInformation";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { Paths } from "../../Router";
import { TCNTile } from "./TCNTile";
import PPMSPagination from "../../../ui-kit/components/common/pagination/PPMS-pagination";
import EditAacDetailModal from "./EditAacDetailsModal";
import { MdModeEdit } from "react-icons/md";
import { PPMSCardGroup } from "../../../ui-kit/components/common/card/PPMS-card-group";
import { PPMSCard } from "../../../ui-kit/components/common/card/PPMS-card";
import { PPMSCardBody } from "../../../ui-kit/components/common/card/PPMS-card-body";
import { UploadDocument } from "../order-property/components/uploads/UploadDocument";
import { UserUtils } from "../../../utils/UserUtils";
import { PPMSSpinner } from "../../../ui-kit/components/common/PPMS-spinner";

import {
  FaUserCircle,
  FaTruck,
  FaFileAlt,
  FaRegCheckCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaFax,
} from "react-icons/fa";
import {
  formatExtension,
  formatPhone,
  nullToStringUtil,
} from "../../../ui-kit/utilities/FormatUtil";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import {
  PropertyGroupType,
  TcnStatus,
  FSC_DoneeInfo,
} from "../create-update-property/constants/Constants";
import { UserApiService } from "../../../api-kit/user/user-api.service";
import { DoneeInformationCard } from "../order-property/components/ShippingDetails/DoneeInformationCard";
import { DoneeShippingCard } from "../order-property/components/ShippingDetails/DoneeShippingCard";
import EditDoneeInformation from "../order-property/components/ShippingDetails/EditDoneeInformation";
import EditDoneeShippingAddress from "../order-property/components/ShippingDetails/EditDoneeShippingAddress";
interface TCNProps {
  unitOfIssue: any;
  documentList: any;
  match: any;
  tcnInfo: any;
  roles?: any;
  actions?: any;
  history?: any;
  approveTO?: boolean;
  tcn?: string;
  aacs: any;
  requisition?: boolean;
  completeTransfer?: boolean;
}

const TCNAllocationDetails = (props: TCNProps) => {
  const [tcnInfo, setTCNInfo] = useState(props.tcnInfo);
  const tcn =
    props.approveTO || props.requisition || props.completeTransfer
      ? props.tcn
      : props.match.params.tcn;
  const [showModal, setShowModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showAacModal, setShowAacModal] = useState(false);
  const propertyApiService = new PropertyApiService();
  const commonApiService = new CommonApiService();
  const userApiService = new UserApiService();
  const { uploadDocumentsState, updateUploadDocumentsState } = useContext(
    AllocationContext
  );
  const { addToast } = props.actions;
  const { shippingDetailsState, updateShippingDetailsState } = useContext(
    AllocationContext
  );
  const [icnRowsPerPage, setIcnRowsPerPage] = useState<number>(10);
  const [icnTotalRows, setIcnTotalRows] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allocation, setAllocation] = useState(false);
  const [doneeConfirmationCheck, setDoneeConfirmationCheck] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [permissionOAC, setPermissionOAC] = useState(false);
  const userPermissions = UserUtils.getUserPermissions();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [icnDeny, seticnDeny] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showDoneeInfoModal, setShowDoneeInfoModal] = useState(false);
  const [showDoneeShipModal, setShowDoneeShipModal] = useState(false);
  const [showTransferOrderDenyModal, setShowTransferOrderDenyModal] = useState(
    false
  );
  const [
    approveTransferOrderDenialReason,
    setApproveTransferOrderDenialReason,
  ] = useState("");
  const [showApproveAllIcnsModal, setShowApproveALlIcnsModal] = useState(false);
  const [approveAllIcns, setApproveAllIcns] = useState(false);
  const [updateApproveQty, setUpdateApproveQty] = useState(false);
  const hasPermission = (permission) => {
    return userPermissions.indexOf(permission) > -1;
  };

  const toggleModal = (event) => {
    setShowModal(!showModal);
    event?.stopPropagation();
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

  const toggleConfirmationModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  const toggleTransferOrderDenyModal = () => {
    setShowTransferOrderDenyModal(!showTransferOrderDenyModal);
  };

  const toggleShippingModal = (event) => {
    setShowShippingModal(!showShippingModal);
    event?.stopPropagation();
  };

  const handleAllocate = (icn, quantity) => {
    let data = {
      transferControlNumber: tcn,
      itemControlNumber: icn,
      allocatedQuantity: quantity,
    };
    propertyApiService
      .allocateProperty(data)
      .then((response) => {
        if (response.status === 200) {
          getTCNDetails(tcn);
        }
      })
      .catch((error) => {
        console.error("TCNAllocationDetails has an error", error);
        addToast({
          text: "Error Confirming Request",
          type: "error",
          heading: "Error",
        });
        getTCNDetails(tcn);
      });
  };

  const handleDenyIcnAllocation = (
    reason,
    requestedItemId,
    toastmessage,
    failureToastMessage,
    page
  ) => {
    let payload = {
      reason: reason,
      status: "DENIED",
      requestedItemId: requestedItemId,
      page: page,
    };
    propertyApiService
      .denyIcnAllocation(payload, tcn)
      .then(() => {
        getTCNDetails(tcn);
        addToast({
          text: toastmessage,
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.log("Throwing exception in deny allocation");
        addToast({
          text: failureToastMessage,
          type: "error",
          heading: "Error",
        });
      });
  };

  const handleAllDenyIcnAllocation = (
    reason,
    requestItemList,
    toastmessage,
    failureToastMessage,
    flag
  ) => {
    let payload = {
      reason: reason,
      status: "DENIED",
      requestedItemIds: requestItemList,
      approvalFlag: flag,
    };
    propertyApiService
      .denyAllIcnAllocation(payload, tcn)
      .then(() => {
        getTCNDetails(tcn);
        addToast({
          text: toastmessage,
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.log("Throwing exception in deny allocation");
        addToast({
          text: failureToastMessage,
          type: "error",
          heading: "Error",
        });
      });
  };

  const handleApproveQuantityBtn = (approveQty, requestedItemId) => {
    let body = {
      cartCount: approveQty,
      requestedItemId: requestedItemId,
    };
    propertyApiService
      .approveProperty(body)
      .then((res) => {
        if (res.status === 200) {
          getTCNDetails(tcn);
        }
      })
      .catch((error) => {
        console.error("Approve Transfer Order Details has an error", error);
        addToast({
          text: "Error Confirming Request",
          type: "error",
          heading: "Error",
        });
        getTCNDetails(tcn);
      });
  };

  const handleTransferQtyBtn = (transferQty, requestedItemId) => {
    let body = {
      requestedItemId: requestedItemId,
      cartCount: transferQty,
    };
    propertyApiService
      .transferProperty(body)
      .then((res) => {
        if (res.status === 200) {
          getTCNDetails(tcn);
        }
      })
      .catch((error) => {
        console.error("Requisition Transfer Order Details has an error", error);
        addToast({
          text: "Error Confirming Request",
          type: "error",
          heading: "Error",
        });
      });
  };

  const resetDenyAllIcns = () => seticnDeny(true);
  const dispatch = useDispatch();

  useEffect(() => {
    getStateInfo();
    getTCNDetails(tcn);
    if (props.completeTransfer) {
      updateShippingDetailsState({
        leaEditRestricted: true,
      });
    }
    dispatch(commonActions.getUnitOfIssues());
  }, [dispatch, tcn, icnTotalRows, permissionOAC]);

  // useEffect(() => {}, [fileTypeDescription]);
  const getStateInfo = async () => {
    commonApiService.getStateList().then((resp) => {
      let list = resp.data.map((item) => {
        return item.stateCode;
      });
      setStateList(list);
      editOrgAcqCost();
    });
  };
  const getTCNDetails = async (tcn) => {
    try {
      propertyApiService
        .getTCNDetails(tcn, {
          page: currentPage,
          size: icnRowsPerPage,
        })
        .then((tcnDetailsInfo) => {
          if (
            props.approveTO !== true &&
            props.requisition !== true &&
            props.completeTransfer !== true
          ) {
            setAllocation(true);
          }
          let uploadedItems = tcnDetailsInfo.data?.allUploadedItems?.documents;
          updateUploadDocumentsState({
            docsFilesList: uploadedItems?.length > 0 ? uploadedItems : [],
          });

          if (tcnDetailsInfo?.data?.leaUserId) {
            setDoneeConfirmationCheck(true);
          }

          updateShippingDetailsState({
            activityAddressCode: tcnDetailsInfo?.data?.requestedAAC,
            cartId: tcnDetailsInfo?.data?.cartRequestID,
            doneeTileShippingAddressAttn: tcnDetailsInfo?.data?.leaShippingAttn,
          });

          if (tcnDetailsInfo.data?.leaUserId) {
            const data = {
              params: {
                userAccountId: tcnDetailsInfo.data?.leaUserId,
              },
            };
            userApiService.getUser(data).then((res: any) => {
              if (res.data !== null && res.status === 200) {
                let leaInfo = res.data?.leaInformationDTO;
                updateShippingDetailsState({
                  userEmail: tcnDetailsInfo.data?.requestedBy?.emailAddress,
                  activityAddressCode: tcnDetailsInfo.data?.requestedAAC,
                  doneeInfoUserId: tcnDetailsInfo.data?.leaUserId,
                  doneeTileEmail: res.data?.emailAddress,
                  doneeInfoEmail: res.data?.emailAddress,
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
                  doneeInfoState: leaInfo?.stateCode,
                });
              }
            });
            updateDoneeShippingDetails(
              tcnDetailsInfo.data?.doneeShippingAddress
            );
          }

          setTCNInfo(tcnDetailsInfo.data);
          updateShippingState(
            tcnDetailsInfo.data?.userProfileAndShippingDetails
          );
          setIcnTotalRows(tcnDetailsInfo.data?.totalElements);
          setCurrentPage(tcnDetailsInfo.data?.currentPageNumber);
        })
        .catch((e) => {});
    } catch (error) {
      console.error(
        "TCNAllocationDetails page getTCNDetails has an error: ",
        error.message
      );
    }
  };

  const completeAOupdate = (success) => {
    const { addToast } = props.actions;
    if (success) {
      getTCNDetails(tcnInfo?.transferControlNumber);
      addToast({
        text: "Approving Official Information successfully changed",
        type: "success",
        header: "Success",
      });
    } else {
      addToast({
        text: "Approving Official Information update failed",
        type: "error",
        header: "Error",
      });
    }
    setShowAacModal(false);
  };

  const handleAllocationsPageChange = (page, size) => {
    setIcnRowsPerPage(size);
    setCurrentPage(page);
    allocationPageChange(page,size);
  };

   const allocationPageChange= async(currentPage,icnRowsPerPage)=>{
    propertyApiService
    .getTCNDetails(tcn, {
      page: currentPage,
      size: icnRowsPerPage,
    })
    .then((tcnDetailsInfo) => {
      if (
        props.approveTO !== true &&
        props.requisition !== true &&
        props.completeTransfer !== true
      ) {
        setAllocation(true);
      }
      let uploadedItems = tcnDetailsInfo.data?.allUploadedItems?.documents;
      updateUploadDocumentsState({
        docsFilesList: uploadedItems?.length > 0 ? uploadedItems : [],
      });

      if (tcnDetailsInfo?.data?.leaUserId) {
        setDoneeConfirmationCheck(true);
      }

      updateShippingDetailsState({
        activityAddressCode: tcnDetailsInfo?.data?.requestedAAC,
        cartId: tcnDetailsInfo?.data?.cartRequestID,
        doneeTileShippingAddressAttn: tcnDetailsInfo?.data?.leaShippingAttn,
      });

      if (tcnDetailsInfo.data?.leaUserId) {
        const data = {
          params: {
            userAccountId: tcnDetailsInfo.data?.leaUserId,
          },
        };
        userApiService.getUser(data).then((res: any) => {
          if (res.data !== null && res.status === 200) {
            let leaInfo = res.data?.leaInformationDTO;
            updateShippingDetailsState({
              userEmail: tcnDetailsInfo.data?.requestedBy?.emailAddress,
              activityAddressCode: tcnDetailsInfo.data?.requestedAAC,
              doneeInfoUserId: tcnDetailsInfo.data?.leaUserId,
              doneeTileEmail: res.data?.emailAddress,
              doneeInfoEmail: res.data?.emailAddress,
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
              doneeInfoState: leaInfo?.stateCode,
            });
          }
        });
        updateDoneeShippingDetails(
          tcnDetailsInfo.data?.doneeShippingAddress
        );
      }

      setTCNInfo(tcnDetailsInfo.data);
      updateShippingState(
        tcnDetailsInfo.data?.userProfileAndShippingDetails
      );
      setIcnTotalRows(tcnDetailsInfo.data?.totalElements);
      setCurrentPage(tcnDetailsInfo.data?.currentPageNumber);
    })
    .catch((e) => {});
}


  useEffect(() => {
    getTCNDetails(tcn);
  }, []);

  const updateShippingState = (shippingDetails) => {
    updateShippingDetailsState({
      shippingDetailsAddressLine1: shippingDetails?.shippingAddress?.line1,
      shippingDetailsAddressLine2: shippingDetails?.shippingAddress?.line2,
      shippingDetailsAddressLine3: shippingDetails?.shippingAddress?.line3,
      shippingDetailsCity: shippingDetails?.shippingAddress?.city,
      shippingDetailsState: shippingDetails?.shippingAddress?.stateCode,
      shippingDetailsZipcode: shippingDetails?.shippingAddress?.zip,
      shippingDetailsInstructions:
        shippingDetails?.shippingAddress?.instructions,
      shippingDetailsAttn: shippingDetails.shippingAttn,
    });
  };

  const updateDoneeShippingDetails = (doneeShippingDetails) => {
    updateShippingDetailsState({
      doneeShippingId: doneeShippingDetails.addressId,
      doneeTileShippingAddressLine1: doneeShippingDetails.line1,
      doneeTileShippingAddressLine2: doneeShippingDetails.line2,
      doneeTileShippingAddressLine3: doneeShippingDetails.line3,
      doneeTileShippingCity: doneeShippingDetails.city,
      doneeTileShippingStateCode: doneeShippingDetails.stateCode,
      doneeTileShippingZipcode: doneeShippingDetails.zip,
      doneeTileShippingZipExt: doneeShippingDetails.zip2,
      doneeTileShippingInstructions: doneeShippingDetails.instructions,
      doneeShippingAddressLine1: doneeShippingDetails.line1,
    });
  };

  const navigateToPreviousPage = () => {
    let path;
    if (props.approveTO) {
      path = Paths.approveTransferOrders;
    } else if (props.requisition) {
      path = Paths.requisitionTransferOrders;
    } else if (props.completeTransfer) {
      path = Paths.completedTransfer;
    } else {
      path = Paths.allocations;
    }
    props.history.push({ pathname: `${path}` });
  };

  const callAPi = (tcn) => {
    if (allocation) {
      setLoading(true);
      return propertyApiService.confirmTCNAllocation(tcn);
    }
    if (props.approveTO) {
      setLoading(true);
      return propertyApiService.approveTCNAllocation(tcn);
    }
    if (props.requisition) {
      setLoading(true);
      return propertyApiService.confirmTcnTransfer(tcn);
    }
    if (props.completeTransfer) {
      setLoading(true);
      return propertyApiService.confirmTcnUpdates(tcn);
    }
  };

  const confirmTcn = () => {
    let checkFile = [];
    let checkDonneFile = [];
    let checkCtdFile = [];
    if (doneeConfirmationCheck) {
      let doneeLetterOfIntent: boolean = false;
      if (tcnInfo.icnStatusMap) {
        const icns = Object.keys(tcnInfo?.icnStatusMap);
        for (let icn of icns) {
          if (tcnInfo?.icnStatusMap[icn] === "Allocated") {
            doneeLetterOfIntent = true;
          }
        }
      }
      if (doneeLetterOfIntent) {
        uploadDocumentsState?.docsFilesList.forEach((file) => {
          if (
            file.documentType !== null &&
            file.documentType === "Donee Letter of Intent"
          ) {
            checkDonneFile.push(file.name);
          }
        });

        if (
          uploadDocumentsState?.docsFilesList.length === 0 ||
          checkDonneFile.length === 0
        ) {
          return addToast({
            text:
              "Donee's Letter of Intent must be uploaded before Confirming Allocation",
            type: "error",
            heading: "Error",
          });
        }
      }
      if (props.requisition) {
        let ctd: boolean = false;
        if (tcnInfo.icnTransferStatusMap) {
          const icns = Object.keys(tcnInfo?.icnTransferStatusMap);
          for (let icn of icns) {
            if (tcnInfo?.icnTransferStatusMap[icn] === "Transferred") {
              ctd = true;
            }
          }
        }
        if (ctd) {
          uploadDocumentsState?.docsFilesList.forEach((file) => {
            if (
              file.documentType !== null &&
              file.documentType === "Conditional Transfer Document"
            ) {
              checkCtdFile.push(file.name);
            }
          });
          if (
            (uploadDocumentsState?.docsFilesList.length === 0 ||
              checkCtdFile.length === 0) &&
            props.requisition
          ) {
            return addToast({
              text:
                "Conditional Transfer Document  must be uploaded before Confirming Requisition",
              type: "error",
              heading: "Error",
            });
          }
        }
      }
    }
    uploadDocumentsState?.docsFilesList.forEach((file) => {
      if (file.documentType === null) {
        checkFile.push(file.name);
      }
    });
    if (checkFile.length === 0) {
      const { addToast } = props.actions;
      callAPi(tcn)
        .then((data) => {
          addToast({
            text: "Request successfully submitted",
            type: "success",
            heading: "Success",
          });
          updateShippingDetailsState({
            isShippingUpdated: false,
          });

          navigateToPreviousPage();
        })
        .catch((error) => {
          addToast({
            text: "Error confirming request",
            type: "error",
            heading: "Error",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      return addToast({
        text: "Error confirming request, please select document type",
        type: "error",
        heading: "Error",
      });
    }
  };

  const disableConfirmTCNAllocationButton = () => {
    if (!tcnInfo || !tcnInfo.icnStatusMap) {
      return false;
    } else if (shippingDetailsState.isShippingUpdated) {
      return false;
    } else {
      const icns = Object.keys(tcnInfo?.icnStatusMap);
      for (let icn of icns) {
        const status = tcnInfo?.icnStatusMap[icn];
        if (!status) {
          return true;
        }
      }
      if (tcnInfo?.tcnStatus === "Allocation Confirmed") {
        return true;
      }
    }
  };

  const disableApproveAllICNs = () => {
    if (tcnInfo === null || tcnInfo === undefined) {
      return false;
    } else {
      if (tcnInfo.propertyGroup == "foreignGift" || doneeConfirmationCheck) {
        return false;
      }
      let disable = true;
      let icns = Object.keys(tcnInfo?.icnApprovalStatusMap);
      for (let icn of icns) {
        const status = tcnInfo?.icnApprovalStatusMap[icn];
        if (status !== "AO Denied" && status !== "Approved") {
          disable = false;
        }
      }
      return disable;
    }
  };

  const disableConfirmTCNUpdatesButton = () => {
    if (tcnInfo === null || tcnInfo === undefined) {
      return false;
    } else {
      const items = tcnInfo?.requestItems || [];
      return items.some((item) => item?.requestItem?.recallReason);
    }
  };

  const disableApproveTcnAllocationButton = () => {
    if (tcnInfo === null || tcnInfo === undefined) {
      return false;
    } else {
      const icns = Object.keys(tcnInfo?.icnApprovalStatusMap);
      for (let icn of icns) {
        const approvalStatus = tcnInfo?.icnApprovalStatusMap[icn];
        const status = tcnInfo?.icnStatusMap[icn];
        if (status === "Allocated" && approvalStatus === null) {
          return true;
        }
      }
    }
  };

  const disableConfirmTransferButton = () => {
    if (tcnInfo === null || tcnInfo === undefined) {
      return false;
    } else {
      const icns = Object.keys(tcnInfo?.icnTransferStatusMap);
      for (let icn of icns) {
        const status = tcnInfo?.icnTransferStatusMap[icn];
        const approveStatus = tcnInfo?.icnApprovalStatusMap[icn];
        if (status === null && approveStatus === "Approved") {
          return true;
        }
      }
    }
    return false;
  };

  const handleDenyAllIcnButton = () => {
    toggleConfirmationModal();
  };

  const handleDenialReasonIcnButton = () => {
    toggleTransferOrderDenyModal();
  };

  const handleConfirmationModalSaveBtn = () => {
    toggleConfirmationModal();
    seticnDeny(false);

    if (tcnInfo === null || tcnInfo === undefined) {
      return false;
    } else {
      const icnIds = tcnInfo.requestItems.map(
        (item) => item.requestItem.requestedItemId
      );
      handleAllDenyIcnAllocation(
        "",
        icnIds,
        `All ICNs successfully denied in TCN#${tcn}`,
        "Failure. All ICNs couldn't be denied",
        true
      );
    }
  };

  const handleApproveTransferOrderDenialReasonSaveBtn = () => {
    const icnIds = tcnInfo.requestItems.map(
      (item) => item.requestItem.requestedItemId
    );
    handleAllDenyIcnAllocation(
      approveTransferOrderDenialReason,
      icnIds,
      `All ICNs successfully denied in TCN#${tcn}`,
      "Failure. All ICNs couldn't be denied",
      true
    );
    toggleTransferOrderDenyModal();
  };

  const handleApproveTransferOrderDenialreasonChange = (event) => {
    let reason = event?.target?.value;
    if (reason != null || reason != undefined) {
      setApproveTransferOrderDenialReason(reason);
    }
  };

  const getApproveTrasnferDenyReasonModalBody = () => {
    return (
      <>
        <PPMSTextArea
          id={"approve-transfer-order-deny-reason-text"}
          isRequired={false}
          isDisabled={false}
          inputType={"text"}
          label={"Reason for Denial"}
          onChange={handleApproveTransferOrderDenialreasonChange}
          defaultValue={""}
          validationMessage={"Please do enter reason"}
          maxLength={100}
          isInvalid={false}
          isValid={true}
        />
        <small>Maximum 100 characters</small>
      </>
    );
  };

  const approveAllIcnsAllocation = () => {
    propertyApiService
      .approveAllIcns(tcn)
      .then((data) => {
        setApproveAllIcns(true);
        setUpdateApproveQty(true);
        setShowApproveALlIcnsModal(false);
        addToast({
          text: "ICNs successfully approved in TCN# " + tcn,
          type: "success",
          heading: "Success",
        });
        getTCNDetails(tcn);
      })
      .catch((error) => {
        addToast({
          text: "Error approving all icns",
          type: "error",
          heading: "Error",
        });
      });
  };

  const editOrgAcqCost = () => {
    const isSystemAdmin = UserUtils.isSystemAdminUser();
    const isUserFireArmManager = UserUtils.isUserFireArmManager();
    const perm = UserUtils.getUserPermissions();
    if (
      (perm.includes("SA") && perm.includes("AO")) ||
      isSystemAdmin ||
      isUserFireArmManager ||
      ((props.requisition || props.completeTransfer) &&
        perm.includes("AC") &&
        perm.includes("FM"))
    ) {
      let code = tcn?.slice(0, 2);
      let check;
      stateList.forEach((i) => {
        if (i === code) {
          check = true;
        }
      });
      setPermissionOAC(check);
    } else {
      setPermissionOAC(false);
    }
  };

  const saveOrgAcqCost = (newOAC, reason, icn) => {
    newOAC = newOAC.slice(1);
    let data = {
      transferControlNumber: tcn,
      itemControlNumber: icn,
      originalAcquisitionCost: newOAC,
      reasonForOACUpdate: reason,
    };
    const { addToast } = props.actions;
    propertyApiService
      .updateOAC(data)
      .then((res) => {
        addToast({
          text: `OAC successfully updated for icn ${icn}`,
          type: "success",
          heading: "Success",
        });
        getTCNDetails(tcn);
      })
      .catch((error) => {
        addToast({
          text: "Error updating OAC request",
          type: "error",
          heading: "Error",
        });
      });
  };
  const handleRecall = (requestedItemId, qty, recallReason, reason) => {
    let data = {
      requestedItemId: requestedItemId,
      quantity: qty,
      reason: recallReason,
      additionalInfo: reason,
    };
    propertyApiService
      .recallProperty(data)
      .then((res) => {
        addToast({
          text: `Property was successfully recalled`,
          type: "success",
          heading: "Success",
        });
        if (tcnInfo?.nonReported) {
          navigateToPreviousPage();
        } else {
          getTCNDetails(tcn);
        }
      })
      .catch((error) => {
        addToast({
          text: "Error recalling the property",
          type: "error",
          heading: "Error",
        });
      });
  };

  // Check if user has SM or APO permissions
  const hasMultipleRequestsPendingAllocation = (requestedByOthers) => {
    return (
      requestedByOthers &&
      (UserUtils.isUserApo() || UserUtils.isSystemAdminUser())
    );
  };

  //TCN Document section
  let uploadedItemsTag = (
    <>
      <div className={"grid-row margin-bottom-2em"}>
        <UploadDocument
          tcn={tcn.toString()}
          context={AllocationContext}
          tcnInfo={props.tcnInfo}
          tcnDetails={tcnInfo}
          completeTransfer={props.completeTransfer}
        />
      </div>
    </>
  );

  const renderBackButton = () => {
    let label;
    let path;
    let confirmId;
    let labelConfirm;
    let disable;
    if (props.approveTO) {
      label = "Back to Transfer Orders";
      path = Paths.approveTransferOrders;
      confirmId = "Approve-TCN-Allocation";
      labelConfirm = "Approve TCN Allocation";
      disable =
        tcnInfo?.tcnStatus === TcnStatus.APPROVED_BY_AO ||
        tcnInfo?.tcnStatus === TcnStatus.DENIED_BY_AO
          ? true
          : disableApproveTcnAllocationButton();
    } else if (props.requisition) {
      label = "Back to Requisition Transfer Orders";
      path = Paths.requisitionTransferOrders;
      confirmId = "Confirm-TCN-transfer";
      labelConfirm = "Confirm TCN Transfer";
      disable = disableConfirmTransferButton();
    } else if (props.completeTransfer) {
      label = "Back to Completed Transfers";
      path = Paths.completedTransfer;
      confirmId = "Confirm-TCN-Updates";
      labelConfirm = "Confirm TCN Updates";
      disable = !disableConfirmTCNUpdatesButton();
    } else {
      label = "Back to Allocation(s)";
      path = Paths.allocations;
      confirmId = "Confirm-TCN-Allocation";
      labelConfirm = "Confirm TCN Allocation";
      disable = disableConfirmTCNAllocationButton();
    }

    return (
      <>
        <PPMSButton
          id={"back-to-transfer-orders"}
          label={label}
          onPress={() => navigateToPreviousPage()}
          className={"out-button"}
        />
        <div>
          {tcnInfo?.tcnStatus !== TcnStatus.INTERNAL_TRANSFER && (
            <>
              {props.approveTO &&
                currentPage * icnRowsPerPage >= icnTotalRows && (
                  <PPMSButton
                    id={"Deny-TCN-Allocation"}
                    className={"out-button"}
                    label={
                      icnDeny ? "Deny All ICNs" : "Denial Reason (Optional)"
                    }
                    value={
                      icnDeny ? "Deny All ICNs" : "Denial Reason (Optional)"
                    }
                    onPress={
                      icnDeny
                        ? handleDenyAllIcnButton
                        : handleDenialReasonIcnButton
                    }
                  />
                )}
              {props.approveTO && currentPage * icnRowsPerPage >= icnTotalRows && (
                <PPMSButton
                  id={"Approve-All-TCN-Allocation"}
                  className={"out-button"}
                  label={"Approve all ICNs"}
                  value={"Approve all ICNs"}
                  isDisabled={disableApproveAllICNs()}
                  onPress={() => {
                    setShowApproveALlIcnsModal(true);
                  }}
                />
              )}
              {!tcnInfo?.nonReported &&
                !(
                  doneeConfirmationCheck &&
                  tcnInfo?.tcnStatus === TcnStatus.DONATED
                ) &&
                !(
                  tcnInfo?.tcnStatus === TcnStatus.TRANSFERRED &&
                  tcnInfo?.propertyGroup === PropertyGroupType.FOREIGN_GIFT
                ) && (
                  <PPMSButton
                    id={confirmId}
                    className={"out-button"}
                    label={labelConfirm}
                    value={labelConfirm}
                    onPress={() => confirmTcn()}
                    isDisabled={disable}
                  />
                )}
            </>
          )}
        </div>
      </>
    );
  };

  let tcnItems = tcnInfo?.requestItems
    ? tcnInfo?.requestItems.map((item: any, index) => {
        const requestItem = item.requestItem;
        return (
          <>
            <PPMSProperty
              displayFlagIcon={hasMultipleRequestsPendingAllocation(
                requestItem.icnRequestedByOtherUsers
              )}
              key={requestItem.itemControlNumber + index}
              propertyId={requestItem.propertyId}
              icn={requestItem.itemControlNumber}
              itemName={requestItem.itemName}
              location={requestItem.location}
              itemStatus={requestItem.itemStatus}
              federalSupplyClass={requestItem.federalSupplyClass}
              fscDescription={requestItem.federalSupplyClassDescription}
              fairMarketValue={requestItem.fairMarketValue}
              conditionCode={requestItem.conditionCode}
              demilitarizationCode={requestItem.demilitarizationCode}
              originalAcquisitionCost={requestItem.originalAcquisitionCost}
              unitOfIssueValue={props.unitOfIssue?.map((u) => {
                if (u?.code === requestItem.unitOfIssue) {
                  return u.description;
                }
              })}
              reimbursementRequired={requestItem.reimbursementRequired}
              categoryName={requestItem.categoryName}
              agencyBureau={requestItem.agencyBureau}
              date_release={requestItem.releaseDate}
              categoryCode={requestItem.categoryCode}
              qty_available={requestItem.quantityAvailable}
              qty_reported={requestItem.quantityReported}
              qty_requested={requestItem.cartCount}
              thumb_image={requestItem.presignedUrl}
              requestedItemId={requestItem.requestedItemId}
              surplusReleaseDate={requestItem.surplusReleaseDate}
              qtyAvailableForAllocation={
                requestItem.quantityAvailableForAllocation
              }
              qtyAllocated={requestItem.quantityAllocated}
              qtyApproved={requestItem.quantityApproved}
              allocation={allocation}
              handleAllocate={handleAllocate}
              icnStatus={
                tcnInfo?.icnStatusMap[requestItem.itemControlNumber]
                  ? tcnInfo.icnStatusMap[requestItem.itemControlNumber]
                  : null
              }
              icnApproveStatus={
                tcnInfo?.icnApprovalStatusMap[requestItem.itemControlNumber]
                  ? tcnInfo.icnApprovalStatusMap[requestItem.itemControlNumber]
                  : null
              }
              denyIcnAllocation={handleDenyIcnAllocation}
              approveTransferOrders={props.approveTO}
              tcn={tcnInfo?.transferControlNumber}
              // handleApprovalQuantityChange={() => {}}
              handleApproveQuantityBtn={handleApproveQuantityBtn}
              saveOrgAcqCost={saveOrgAcqCost}
              initialOrgAcqCost={requestItem.initialOriginalAcquisitionCost}
              permissionOAC={permissionOAC}
              reasonOAC={requestItem.reasonForUpdatingOAC}
              disableAllIcns={!icnDeny}
              resetDenyAllIcns={resetDenyAllIcns}
              qtyAvailableForApproval={requestItem.quantityAvailableForApproval}
              requisition={props.requisition}
              qtyAvailableForTransfer={requestItem.quantityAvailableForTransfer}
              handleTransferQtyBtn={handleTransferQtyBtn}
              qtyTransferred={requestItem.quantityTransferred}
              completeTransfer={props.completeTransfer}
              updateApproveAll={updateApproveQty}
              recall={handleRecall}
              tcnStatus={tcnInfo?.tcnStatus}
              reason={requestItem.recallReason}
              additionalReason={requestItem.recallAdditionalInfo}
              icnTransferStatus={
                tcnInfo?.icnTransferStatusMap[requestItem.itemControlNumber]
                  ? tcnInfo.icnTransferStatusMap[requestItem.itemControlNumber]
                  : null
              }
              creationSource={
                tcnInfo?.nonReported
                  ? "NonReportProp"
                  : tcnInfo?.propertyGroup
                  ? tcnInfo.propertyGroup
                  : ""
              }
              vaultLocation={requestItem?.giftInfoDTO?.vaultLocation}
              vaultShelfNumber={requestItem?.giftInfoDTO?.vaultShelfNumber}
              administration={requestItem?.giftInfoDTO?.administration}
              donorName={
                requestItem?.donorInfoDTO
                  ? requestItem.donorInfoDTO.firstName +
                    " " +
                    requestItem.donorInfoDTO.lastName
                  : ""
              }
              recipientName={
                requestItem?.recipientDTO
                  ? requestItem.recipientDTO.firstName +
                    " " +
                    requestItem.recipientDTO.lastName
                  : ""
              }
              donorCountry={requestItem?.donorInfoDTO?.donorCountry}
              fiscalYear={requestItem?.giftInfoDTO?.fiscalYear}
              isDonee={doneeConfirmationCheck}
            />
          </>
        );
      })
    : [];
  if (loading) {
    return (
      <>
        <div className="loader-container">
          <div className="loader">
            <PPMSSpinner
              animation={"border"}
              variant={"primary"}
              loadingText={"Loading..."}
            />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <h1 className="ui-ppms">TCN Details</h1>
        </div>
        <TCNTile
          tcnInfo={tcnInfo}
          listPage={false}
          approveTransfer={props.approveTO}
          requisition={props.requisition}
          completeTransfer={props.completeTransfer}
        />
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col">
            <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
              <PPMSCard className="ppms-widget ppms-sub-widget">
                <PPMSCardBody className="non-tcn-main-row card-header-height widget-header">
                  <div>
                    <strong>
                      <i className="fas head-icon">
                        {<FaUserCircle role="img" aria-label={"user circle"} />}
                      </i>{" "}
                      Requestor Information
                    </strong>
                  </div>
                </PPMSCardBody>
                <PPMSCardBody className={"card-height"}>
                  <div className={"grid-row grid-gap-4"}>
                    <div className={"grid-col-full"}>
                      <strong>AAC: </strong>
                      {tcnInfo?.requestedAAC}
                    </div>
                  </div>
                  <div className={"grid-row grid-gap-4"}>
                    <div className={"grid-col-full"}>
                      <strong>Name:</strong> &nbsp;
                      {tcnInfo?.requestedBy?.firstName
                        ? tcnInfo?.requestedBy?.firstName
                        : "" + " " + tcnInfo?.requestedBy?.middleName
                        ? tcnInfo?.requestedBy?.middleName
                        : "" + " " + tcnInfo?.requestedBy?.lastName
                        ? tcnInfo?.requestedBy?.lastName
                        : ""}
                    </div>
                  </div>
                  <div className={"grid-row grid-gap-4"}>
                    <div className={"grid-col-full"}>
                      <span>
                        <i className="fas mr-2">
                          {<FaPhoneAlt role="img" aria-label={"phone alt"} />}
                        </i>
                      </span>
                      &nbsp;
                      {tcnInfo?.requestedBy?.phoneNumber
                        ? formatPhone(
                            nullToStringUtil(
                              tcnInfo?.requestedBy?.phoneNumber
                            ) + ""
                          )
                        : "-"}
                    </div>

                    <div className={"grid-col-full"}>
                      <span>
                        <i className="fas mr-2">
                          {<FaFax role="img" aria-label={"fax"} />}
                        </i>
                      </span>
                      &nbsp;
                      {tcnInfo?.requestedBy?.fax
                        ? formatPhone(
                            nullToStringUtil(tcnInfo?.requestedBy?.fax) + ""
                          )
                        : "-"}
                    </div>

                    <div className={"grid-col-full"}>
                      <span>
                        <i className="fas mr-2">
                          {<FaEnvelope role="img" aria-label={"envelope"} />}
                        </i>
                      </span>
                      &nbsp;
                      {tcnInfo?.requestedBy?.emailAddress
                        ? tcnInfo?.requestedBy?.emailAddress
                        : "-"}
                    </div>
                  </div>
                </PPMSCardBody>
              </PPMSCard>
            </PPMSCardGroup>
          </div>
          {props.approveTO ||
          props.requisition ||
          tcnInfo?.approvingOfficial === null ? (
            <> </>
          ) : (
            <>
              <div className="tablet:grid-col">
                <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
                  <PPMSCard className="ppms-widget ppms-sub-widget">
                    <PPMSCardBody className="non-tcn-main-row card-header-height widget-header">
                      <div>
                        <strong>
                          <i className="fas head-icon">
                            {
                              <FaRegCheckCircle
                                role="img"
                                aria-label={"reg check cicle"}
                              />
                            }
                          </i>{" "}
                          Approving Agency Information{" "}
                        </strong>
                        {props.completeTransfer !== true &&
                          (hasPermission("SM") ||
                            hasPermission("NU") ||
                            hasPermission("FG")) &&
                          tcnInfo?.tcnStatus !== TcnStatus.APPROVED_BY_AO &&
                          tcnInfo?.tcnStatus !== TcnStatus.DENIED_BY_AO &&
                          tcnInfo?.tcnStatus !== TcnStatus.TRANSFERRED && (
                            <PPMSButton
                              variant={"link"}
                              //className="usa-link usa-link--external ppms-external-link"
                              id={"edit agency approval"}
                              type={"button"}
                              icon={<MdModeEdit />}
                              label={""}
                              onPress={(event) => {
                                setShowAacModal(true);
                              }}
                              className={"widget-button"}
                            />
                          )}
                      </div>
                    </PPMSCardBody>

                    <PPMSCardBody className={"card-height"}>
                      <div className={"grid-row grid-gap-4"}>
                        <div className={"grid-col-full"}>
                          <strong>Agency Bureau: </strong>
                          {tcnInfo?.approvingOfficial?.agencyBureauCd
                            ? tcnInfo?.approvingOfficial.agencyBureauCd
                            : "-"}
                        </div>
                      </div>

                      <div className={"grid-row grid-gap-4"}>
                        <div className={"grid-col-full"}>
                          <strong>Name:</strong> &nbsp;
                          {tcnInfo?.approvingOfficial?.firstName +
                            " " +
                            (tcnInfo?.approvingOfficial?.middleName
                              ? tcnInfo?.approvingOfficial?.middleName
                              : "") +
                            " " +
                            tcnInfo?.approvingOfficial?.lastName}
                        </div>
                      </div>

                      <div className={"grid-row grid-gap-4"}>
                        <div className={"grid-col-full"}>
                          <span>
                            <i className="fas mr-2">
                              {<FaPhoneAlt role="img" aria-label={"phone"} />}
                            </i>
                          </span>
                          &nbsp;
                          {tcnInfo?.approvingOfficial.phoneNumber
                            ? formatPhone(
                                nullToStringUtil(
                                  tcnInfo?.approvingOfficial.phoneNumber
                                ) + ""
                              )
                            : "-"}
                        </div>

                        <div className={"grid-col-full"}>
                          <span>
                            <i className="fas mr-2">
                              {<FaFax role="img" aria-label={"fax 1"} />}
                            </i>
                          </span>
                          &nbsp;
                          {tcnInfo?.approvingOfficial?.faxNumber
                            ? tcnInfo?.approvingOfficial?.faxNumber
                            : "-"}
                        </div>

                        <div className={"grid-col-full"}>
                          <span>
                            <i className="fas mr-2">
                              {
                                <FaEnvelope
                                  role="img"
                                  aria-label={"envelope 2"}
                                />
                              }
                            </i>
                          </span>
                          &nbsp;
                          {tcnInfo?.approvingOfficial?.emailAddress
                            ? tcnInfo?.approvingOfficial?.emailAddress
                            : "-"}
                        </div>
                      </div>
                    </PPMSCardBody>
                  </PPMSCard>
                </PPMSCardGroup>
              </div>
            </>
          )}
          <div className="tablet:grid-col">
            <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
              <PPMSCard className="ppms-widget ppms-sub-widget">
                <PPMSCardBody className="non-tcn-main-row card-header-height widget-header">
                  <div>
                    <strong>
                      <i className="fas head-icon">
                        {<FaTruck role="img" title={"Shipping"} />}
                      </i>{" "}
                      Shipping Details{" "}
                    </strong>
                    {props.completeTransfer !== true && (
                      <PPMSButton
                        variant={"link"}
                        //className="usa-link usa-link--external ppms-external-link"
                        id={"edit shipping information"}
                        type={"button"}
                        icon={<MdModeEdit />}
                        label={""}
                        onPress={toggleShippingModal}
                        className={"widget-button"}
                        ariaLabel={"Edit Shipping Information"}
                      />
                    )}
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
                    {shippingDetailsState?.shippingDetailsCity}{" "}
                    {shippingDetailsState?.shippingDetailsState}{" "}
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
        </div>
        {showDoneeInfoModal && (
          <EditDoneeInformation
            isAllocation={true}
            showDoneeInfoModal={true}
            toggleDoneeInfoModal={closeDoneeInfoModal}
          />
        )}
        {showDoneeShipModal && (
          <EditDoneeShippingAddress
            isAllocation={true}
            showDoneeShipModal={true}
            toggleDoneeShippingModal={closeDoneeShipModal}
          />
        )}
        {tcnInfo?.leaUserId && (
          <div className="grid-row grid-gap">
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
          </div>
        )}
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className="ppms-widget">
            <PPMSCardBody className="non-tcn-main-row card-header-height widget-header">
              <div>
                <strong>
                  <i className="fas head-icon">
                    {<FaFileAlt role="img" title={"Documents"} />}
                  </i>{" "}
                  TCN Documents
                </strong>
              </div>
            </PPMSCardBody>
            <PPMSCardBody>{uploadedItemsTag}</PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
        <br />
        <h2 className="ui-ppms">ICN Details</h2>
        <div className={"item-search-result"}>
          <PPMSPagination
            page={1}
            pageSize={icnRowsPerPage}
            totalRows={icnTotalRows}
            onChangePage={(currentPage, pageSize) => {
              handleAllocationsPageChange(currentPage, pageSize);
            }}
          />
        </div>
        <div className="ui-ppms">{tcnItems}</div>
        {showShippingModal && (
          <EditShippingInfo
            tcn={tcn}
            showModal={showShippingModal}
            toggleModal={toggleShippingModal}
            isAllocation={true}
          />
        )}
        {showAacModal && (
          <EditAacDetailModal
            tcn={tcnInfo?.transferControlNumber}
            showModal={showAacModal}
            oldAo={tcnInfo?.approvingOfficial}
            handleClose={() => {
              setShowAacModal(false);
            }}
            afterSaveAction={completeAOupdate}
            requestorAAC={tcnInfo?.requestedAAC}
            requestorAgencyBureauCd={tcnInfo?.requestedBy?.agencyBureauCd}
          />
        )}
        <div className="grid-row flex-justify ui-ppms">
          {renderBackButton()}
          {
            <PPMSModal
              show={showConfirmationModal}
              handleClose={toggleConfirmationModal}
              handleSave={handleConfirmationModalSaveBtn}
              title={"Confirmation"}
              centered={true}
              backdrop={"static"}
              label={"Yes"}
              labelCancel={"No"}
              body={"Are you sure you want to deny all ICNs?"}
              id={"approve-transfer-order-deny-modal"}
            />
          }
          {
            <PPMSModal
              show={showApproveAllIcnsModal}
              handleClose={() => {
                setShowApproveALlIcnsModal(false);
              }}
              handleSave={approveAllIcnsAllocation}
              title={"Confirmation"}
              centered={true}
              backdrop={"static"}
              label={"Yes"}
              labelCancel={"No"}
              body={"Are you sure to Approve all ICNs?"}
              id={"approve-transfer-order-deny-modal"}
            />
          }
          {showTransferOrderDenyModal && (
            <PPMSModal
              show={showTransferOrderDenyModal}
              handleClose={toggleTransferOrderDenyModal}
              handleSave={handleApproveTransferOrderDenialReasonSaveBtn}
              title={"Denial Reason"}
              centered={true}
              backdrop={"static"}
              label={"Save"}
              labelCancel={"Cancel"}
              disableSave={
                approveTransferOrderDenialReason == undefined ||
                approveTransferOrderDenialReason?.length == 0
              }
              body={getApproveTrasnferDenyReasonModalBody()}
              id={"approve-transfer-order-deny-modal"}
            />
          )}
        </div>
      </>
    );
  }
};

const mapStateToProps = (state) => ({
  unitOfIssue: state.common.unitOfIssue,
  roles: state.authentication.roles,
  aacs: state.authentication.aacs,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TCNAllocationDetails);
