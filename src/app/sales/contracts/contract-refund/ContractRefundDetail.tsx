import React, { StrictMode, useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { PPMSDatatable } from "../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import moment from "moment";
import { Link } from "react-router-dom";
import { Paths } from "../../../Router";
import ContractFeeDetails from "./ContractFeeDetails";
import {
  BidderState,
  BidderStateDefault,
  ContractFeeState,
  ContractStatus,
  getFormatedValueWithDolloar,
  RefundReason,
} from "./Constants";

import { UserApiService } from "../../../../api-kit/user/user-api.service";
import ContractDetails, {
  ContractDetailsProps,
} from "../../management/transactions/contract/ContractDetails";
import PPMSCardGroup from "../../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../../ui-kit/components/common/card/PPMS-card-body";
import { RefundNotesClass } from "./RefundNotesClass";
import { ContractUpload } from "../../uploads/ContractUpload";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { ModalActionHistoryContent } from "../../management/transactions/SalesTransaction";
import { ContractFeeContext } from "./ContractFeeContext";
import { isEmptyCheck } from "../../../property/create-update-property/validations/propertyFieldValidations";
import BidderBasicInformationView from "../../../manage-users/bidders/view-bidder/BidderBasicInformationView";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { formatCurrency } from "../../../../ui-kit/utilities/FormatUtil";
import PPMSCheckbox from "../../../../ui-kit/components/common/form/PPMS-checkbox";

interface ContractRefundDetailProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  roles: any;
}

const ContractRefundDetail = (props: ContractRefundDetailProps) => {
  let userAPIService: UserApiService = new UserApiService();
  let salesAPIService: SalesApiService = new SalesApiService();

  const [payment, setPayment] = useState([]);
  const [registerId, setRegisterId] = useState(null);
  const [bidderUsername, setBidderUsername] = useState<string>("");
  const [currentRefundNotes, setCurrentRefundNotes] = useState("");
  const [historyModal, setHistoryModal] = useState(false);
  const [contractHistory, setContractHistory] = useState([]);
  let { contractFeeState, updateContractFeeState } = useContext(
    ContractFeeContext
  );
  let [isChargebackSelected, setIsChargebackSelected] = useState(false);

  let [bidderDetails, setBidderDetails] = useState<BidderState>(
    BidderStateDefault
  );
  let [contractDetails, setContractDetails] = useState<ContractDetailsProps>();
  const { match } = props;
  let contractNumber: string = "";
  if (match?.params?.contractNumber) {
    contractNumber = match?.params?.contractNumber;
  }
  let type: string = "";
  if (match?.params?.type) {
    type = match?.params?.type;
  }
  const columns = [
    {
      Header: "Payment Method",
      accessor: "method",
      id: "method",
    },
    {
      Header: "Payment Details",
      accessor: "paymentDetails",
      id: "paymentDetails",
      Cell: (data) => {
        return data?.row?.values?.method === "Credit Card"
          ? `${data?.row?.original?.ccType} - ${data?.row?.original?.ccNumberL4}`
          : data?.row?.original?.depositNumber;
      },
    },
    {
      Header: "Payment Date",
      accessor: "paymentDate",
      id: "paymentDate",
      width: "200",
      Cell: (data) => {
        return moment(data?.value).format("MM/DD/YYYY hh:mm A");
      },
    },
    {
      Header: "Payment Amount",
      accessor: "paymentAmount",
      id: "paymentAmount",
      Cell: (data) => {
        return ` $${data.value}`;
      },
    },
    {
      Header: "Payment Register",
      accessor: "paymentDetails",
      id: "paymentRegister",
      Cell: (data) => {
        return (
          <>
            <Link to={Paths.paymentRegisterManager + "/" + registerId}>
              {registerId}
            </Link>
          </>
        );
      },
    },
  ];

  const getContracts = async () => {
    try {
      let getContractsListResponse = await salesAPIService.getContractByContractNumber(
        contractNumber
      );
      setPayment(
        getContractsListResponse?.data?.contractDTO?.paymentInfoDTOList
      );

      let contractStatus: string =
        getContractsListResponse?.data?.contractDTO?.contractStatus;

      let claimNumber: string =
        contractStatus === ContractStatus.DEFAULT_FOR_NON_REMOVAL
          ? getContractsListResponse?.data?.contractDTO?.removalClaimNumber
          : getContractsListResponse?.data?.contractDTO?.paymentClaimNumber;

      let reasonForRefund: string =
        getContractsListResponse?.data?.contractDTO?.contractStatus ===
        ContractStatus.AWARD_PENDING
          ? RefundReason.CANCELLATION
          : getContractsListResponse?.data?.contractDTO?.contractStatus ===
            ContractStatus.PAID
          ? "ADR"
          : contractStatus === ContractStatus.DEFAULT_FOR_NON_REMOVAL
          ? RefundReason.DEFAULT_FOR_NON_REMOVAL
          : RefundReason.DEFAULT_FOR_NON_PAYMENT;

      //calculate the totalRefundAmount only when the contractStatus is "Paid" or "Default for non removal
      let totalRefundAmount: number =
        getContractsListResponse?.data?.contractDTO?.contractStatus ==
        ContractStatus.PAID || getContractsListResponse?.data?.contractDTO?.contractStatus ==
        ContractStatus.AWARD_PENDING? 
            getContractsListResponse?.data?.contractDTO?.awardAmount
          : contractStatus === ContractStatus.DEFAULT_FOR_NON_REMOVAL ||
            getContractsListResponse?.data?.contractDTO?.contractStatus ==
              ContractStatus.DEFAULT_FOR_NON_PAYMENT
          ? getContractsListResponse?.data?.contractDTO?.awardAmount -
            getContractsListResponse?.data?.contractDTO?.liquidatedDamageFee
          : getContractsListResponse?.data?.contractDTO.totalRefundAmount;

      let originalAwardAmount: number =
        getContractsListResponse?.data?.contractDTO?.originalAwardAmount;
      let contractFeeDetails: ContractFeeState = {
        awardAmount: formatCurrency.format(
          getContractsListResponse?.data?.contractDTO?.awardAmount
        ),
        gsaFee: formatCurrency.format(
          getContractsListResponse?.data?.contractDTO?.gsaFee
        ),
        agencyReimbursement: formatCurrency.format(
          getContractsListResponse?.data?.contractDTO?.agencyReimbursement
        ),
        liquidatedDamageFee: formatCurrency.format(
          getContractsListResponse?.data?.contractDTO?.liquidatedDamageFee
        ),
        totalRefundAmount: formatCurrency.format(totalRefundAmount),
        claimNumber: claimNumber,
        contractStatus: contractStatus,
        paymentStatus:
          getContractsListResponse?.data?.contractDTO?.paymentStatus,
        reasonForRefund: reasonForRefund,
        originalAwardAmount: !isEmptyCheck(originalAwardAmount)
          ? formatCurrency.format(originalAwardAmount)
          : "",
        chargebackAmount: formatCurrency.format(
          getContractsListResponse?.data?.contractDTO?.chargebackAmount
        ),
      };
      let contractDetails: ContractDetailsProps = {
        contractNumber:
          getContractsListResponse?.data?.contractDTO?.contractNumber,
        contractStatus: contractStatus,
        salesNumber: getContractsListResponse?.data?.contractDTO?.salesNumber,
        lotId: getContractsListResponse?.data?.lotDTO.lotId,
        contractId: getContractsListResponse?.data?.contractDTO?.contractId,
        saleId: getContractsListResponse?.data?.lotDTO.salesId,
        lotNumber: getContractsListResponse?.data?.lotDTO.lotNumber,
        notesHistory: getContractsListResponse?.data?.contractDTO?.notesHistory,
      };
      setBidderUsername(
        getContractsListResponse?.data?.contractDTO?.bidderUsername
      );
      updateContractFeeState(contractFeeDetails);
      setContractDetails(contractDetails);
      setRegisterId(getContractsListResponse?.data?.contractDTO?.registerId);
    } catch (error) {
      console.error("Error while getting list of contracts");
    }
  };

  const getBidder = async () => {
    try {
      let response = await userAPIService.getBidderUser(bidderUsername);
      let bidderDetails: BidderState = {
        bidderData: response.data.bidderUser,
        userData: response.data,
        bidderEmail: response.data.emailAddress,
        bidderUsername: props.match.params.userName,
        bidderId: response.data.bidderUser.bidderId,
      };
      setBidderDetails(bidderDetails);
    } catch (error) {
      console.error("Error while getting bidder");
    }
  };

  function handleChargebackChange(event: any) {
    let val: string = getFormatedValueWithDolloar(event.target.value);
    const obj = { ...contractFeeState };
    obj[event.target.id] = val;

    updateContractFeeState(obj);
  }

  function handleHistory() {
    const data = {
      params: {
        objectType: "CONTRACT",
        objectId: contractNumber,
      },
    };
    salesAPIService
      .getActionHistoryForSalesObject(data)
      .then((response: any) => {
        setContractHistory(response.data);
        setHistoryModal(true);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  function getTitle(): string {
    return type === "chargeback"
      ? "Chargeback Details"
      : contractFeeState?.contractStatus ===
          ContractStatus.DEFAULT_FOR_NON_REMOVAL ||
        contractFeeState?.contractStatus === ContractStatus.PAID ||
        contractFeeState?.contractStatus === ContractStatus.AWARD_PENDING
      ? "Refund details"
      : "Liquidated Damage Details";
  }

  function removeDollar(value: string): string {
    return value?.toString().replace("$", "").replace(/,/g, "");
  }

  function saveRefundDetails() {
    const { addToast } = props.actions;
    let data = {
      contractId: contractDetails?.contractId,
      currentNotes: currentRefundNotes,
      refundReason: contractFeeState?.reasonForRefund,
      gsaFee: removeDollar(contractFeeState.gsaFee),
      agencyReimbursement: removeDollar(contractFeeState?.agencyReimbursement),
      liquidatedDamageFee: removeDollar(contractFeeState?.liquidatedDamageFee),
      totalRefundAmount: removeDollar(contractFeeState.totalRefundAmount),
    };

    if (
      contractFeeState.contractStatus ==
        ContractStatus.DEFAULT_FOR_NON_REMOVAL ||
      contractFeeState.contractStatus == ContractStatus.PAID
    ) {
      data["totalRefundAmount"] = removeDollar(
        contractFeeState?.totalRefundAmount
      );
    }

    if (
      type === "chargeback" &&
      contractFeeState.contractStatus == ContractStatus.PAID
    ) {
      data["chargebackAmount"] = removeDollar(
        contractFeeState?.chargebackAmount
      );
    }

    let successText: string =
      type === "chargeback"
        ? "Chargeback amount submitted"
        : contractFeeState?.contractStatus === "Default for non removal" ||
          contractFeeState?.contractStatus === ContractStatus.PAID ||
          contractFeeState?.contractStatus === ContractStatus.AWARD_PENDING
        ? "Refund initiated"
        : "Liquidated Damage submitted";

    let errorTxt: string =
      type === "chargeback"
        ? "Error submitting chargeback amount"
        : contractFeeState?.contractStatus === "Default for non removal" ||
          contractFeeState?.contractStatus === ContractStatus.PAID
        ? "Error initiating refund"
        : "Error submitting liquidated damage";

    salesAPIService
      .initiateRefund(data)
      .then((response) => {
        if (response.status === 200)
          addToast({
            text: successText,
            type: "success",
            heading: "Success",
          });
      })
      .catch((error) => {
        console.log(error);
        addToast({
          text: errorTxt,
          type: "error",
          heading: "Error",
        });
      });
  }

  useEffect(() => {
    getContracts();
  }, []);

  useEffect(() => {
    getBidder();
  }, [bidderUsername]);

  return (
    <StrictMode>
      <div className={"grid-conatiner ui-ppms"}>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <div className={"container"}>
              <div className="item-search-result">
                <h1>{getTitle()}</h1>
              </div>
            </div>
          </div>
        </div>
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard>
            <PPMSCardBody className="sale-number-details">
              <ContractDetails
                saleId={contractDetails?.saleId}
                contractId={contractDetails?.contractId}
                contractNumber={contractDetails?.contractNumber}
                contractStatus={contractDetails?.contractStatus}
                salesNumber={contractDetails?.salesNumber}
                lotNumber={contractDetails?.lotNumber}
                showCurrentItems={true}
              />
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <div className="grid-row tablet:grid-gap-2  ">
              <div className={"grid-col cart-row cart-tray"}></div>
              <div className="grid-col-3 flex-top-tray">
                <PPMSButton
                  className={"out-button"}
                  type={"button"}
                  value={""}
                  label={"Action History"}
                  onPress={() => handleHistory()}
                  id={"action-history"}
                />
              </div>
            </div>
          </div>
        </div>
        <br />
        {!isEmptyCheck(bidderDetails?.bidderEmail) && (
          <div className={"grid-col-12 ppms-details-container"}>
            <BidderBasicInformationView
              bidderData={bidderDetails?.bidderData}
              userData={bidderDetails?.userData}
              emailAddress={bidderDetails?.bidderEmail}
              {...props}
            />
          </div>
        )}
        {!isEmptyCheck(contractDetails?.lotId) && (
          <div className={"grid-row grid-gap-4"}>
            <ContractFeeDetails type={type} {...props} />
          </div>
        )}
        {(contractFeeState.contractStatus ===
          ContractStatus.DEFAULT_FOR_NON_REMOVAL ||
          contractFeeState.contractStatus === ContractStatus.PAID ||
          contractFeeState.contractStatus === ContractStatus.AWARD_PENDING) && (
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <PPMSDatatable
                title={""}
                data={payment}
                columns={columns}
                defaultSortField={"contractNumber"}
                totalRows={100}
                isPaginationEnabled={false}
                showFilters={false}
                serverSort={true}
                loading={false}
              />
            </div>
          </div>
        )}
        {type === "chargeback" &&
          contractFeeState.contractStatus == ContractStatus.PAID && (
            <div className={"grid-row grid-gap-4 chargeback-checkbox"}>
              <div className={"grid-col-2"}>
                <PPMSCheckbox
                  id={`chargeback`}
                  name={"chargeback"}
                  label={"Chargeback"}
                  isInvalid={false}
                  checked={isChargebackSelected}
                  onChange={() => {
                    setIsChargebackSelected(!isChargebackSelected);
                  }}
                />
              </div>
              {isChargebackSelected === true ? (
                <div className={"grid-col-2"}>
                  <PPMSInput
                    id={`chargebackAmount`}
                    name={`chargebackAmount`}
                    inputType={"text"}
                    isDisabled={false}
                    isRequired={true}
                    maxLength={20}
                    label={"Chargeback Amount"}
                    labelBold={true}
                    value={contractFeeState.chargebackAmount}
                    onChange={(event) => handleChargebackChange(event)}
                    addBreak={true}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <RefundNotesClass
              actionHistorydata={contractDetails?.notesHistory}
              currentNotesData={(value) => {
                setCurrentRefundNotes(value);
              }}
            />
          </div>
        </div>
        <br />
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <ContractUpload
              isRefundUpload={true}
              objectType={"REFUND"}
              contractId={contractDetails?.contractId}
              saleId={contractDetails?.saleId}
              lotNumber={contractDetails?.lotNumber}
              saleNumber={contractDetails?.salesNumber}
              fileInfectedStatus={() => {}}
            />
          </div>
        </div>
        <br />
        <div className="desktop:grid-col-9">
          <PPMSButton
            id={"add-new-lot-link"}
            label={"Submit"}
            className={"out-button"}
            onPress={() => saveRefundDetails()}
            isDisabled={false}
          />
          <PPMSButton
            id={"add-new-lot-link"}
            label={"Cancel"}
            className={"out-button"}
            onPress={() => {
              window.location.reload();
            }}
            isDisabled={false}
          />
        </div>

        <div className="grid-row grid-gap-4">
          <PPMSModal
            body={
              <ModalActionHistoryContent
                data={contractHistory}
                listID={"list-id"}
                title={contractNumber}
              />
            }
            id={"show-action-history"}
            show={historyModal}
            handleClose={() => {
              setHistoryModal(false);
            }}
            handleSave={""}
            title={"Contract History: " + contractNumber}
            centered={true}
            backdrop={"static"}
            label={"Ok"}
            hideLabelCancel={true}
            hideLabel={true}
            size={historyModal ? "lg" : null}
          />
        </div>
      </div>
    </StrictMode>
  );
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: bindActionCreators({ addToast }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractRefundDetail);
