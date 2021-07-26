import React, { useContext, useEffect, useState } from "react";
import PPMSCard from "../../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../../../ui-kit/components/common/card/PPMS-card-body";
import ContractDetails from "../../../../sales/management/transactions/contract/ContractDetails";
import PPMSCardGroup from "../../../../../ui-kit/components/common/card/PPMS-card-group";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { ModalActionHistoryContent } from "../../../../sales/management/transactions/SalesTransaction";
import { isEmptyCheck } from "../../../../property/create-update-property/validations/propertyFieldValidations";
import BidderBasicInformationView from "../../../../manage-users/bidders/view-bidder/BidderBasicInformationView";
import { ContractDetailsContext } from "./ContractDetailsContext";
import { UserApiService } from "../../../../../api-kit/user/user-api.service";
interface ContractBidderSummaryProps {
  setRegisterId?: any;
  contractNumber?: string;
  updateLiqDamageAmount?: any;
  setRegisterNumber?: any;
}

const ContractBidderSummary = (props: ContractBidderSummaryProps) => {
  const { setRegisterId, contractNumber, updateLiqDamageAmount, setRegisterNumber } = props;
  let { contractDetailsState, updateContractDetailsState } = useContext(
    ContractDetailsContext
  );
  let userAPIService: UserApiService = new UserApiService();
  let salesAPIService: SalesApiService = new SalesApiService();
  const [contractHistory, setContractHistory] = useState([]);
  const [historyModal, setHistoryModal] = useState(false);
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
  const getContracts = () => {
    let state = contractDetailsState;
    salesAPIService
      .getContractByContractNumber(contractNumber)
      .then((response) => {
        state.data.paymentDetails =
          response?.data?.contractDTO?.paymentInfoDTOList;
        state.data.contractFeeDetails = response?.data?.contractDTO;
        state.data.contractDetails.contractNumber =
          response?.data?.contractDTO?.contractNumber;
        state.data.contractDetails.contractStatus =
          response?.data?.contractDTO?.contractStatus;
        state.data.contractDetails.salesNumber =
          response?.data?.contractDTO?.salesNumber;
        state.data.contractDetails.lotId = response?.data?.lotDTO.lotId;
        state.data.contractDetails.contractId =
          response?.data?.contractDTO?.contractId;
        state.data.contractDetails.saleId = response?.data?.lotDTO.salesId;
        state.data.contractDetails.lotNumber = response?.data?.lotDTO.lotNumber;
        state.data.contractDetails.notesHistory =
          response?.data?.contractDTO?.notesHistory;
        state.data.bidderDetails.bidderUsername =
          response?.data?.contractDTO?.bidderUsername;
        updateContractDetailsState(state);
        //(response?.data?.contractDTO?.bidderUsername);
        if (updateLiqDamageAmount) {
          updateLiqDamageAmount(
            response?.data?.contractDTO?.liquidatedDamageFee
          );
        }
        if (setRegisterId) {
          setRegisterId(response?.data?.contractDTO?.registerId);
        }
        if(setRegisterNumber){
          setRegisterNumber(response?.data?.contractDTO?.registerNumber)
        }
      })
      .catch((error) => {
        console.error("Error while getting list of contracts");
      });
  };
  const getBidder = () => {
    let state = contractDetailsState;
    userAPIService
      .getBidderUser(contractDetailsState.data.bidderDetails.bidderUsername)
      .then((response) => {
        state.data.bidderDetails.bidderData = response?.data?.bidderUser;
        state.data.bidderDetails.bidderEmail = response?.data?.emailAddress;
        state.data.bidderDetails.bidderId = response?.data?.bidderUser.bidderId;
        state.data.bidderDetails.userData = response?.data;
        updateContractDetailsState(state);
      })
      .catch((error) => {
        console.error("Error while getting bidder");
      });
  };
  useEffect(() => {
    if (contractNumber) {
      getContracts();
    }
  }, []);

  useEffect(() => {
    if (contractDetailsState?.data?.bidderDetails.bidderUsername) {
      getBidder();
    }
  }, [contractDetailsState?.data?.bidderDetails.bidderUsername]);
  return (
    <div>
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard>
          <PPMSCardBody className="sale-number-details">
            <ContractDetails
              saleId={contractDetailsState?.data?.contractDetails?.saleId}
              contractId={
                contractDetailsState?.data?.contractDetails?.contractId
              }
              contractNumber={
                contractDetailsState?.data?.contractDetails?.contractNumber
              }
              contractStatus={
                contractDetailsState?.data?.contractDetails?.contractStatus
              }
              salesNumber={
                contractDetailsState?.data?.contractDetails?.salesNumber
              }
              lotNumber={contractDetailsState?.data?.contractDetails?.lotNumber}
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
              <div className="grid-row grid-gap-4">
                <PPMSModal
                  body={
                    <ModalActionHistoryContent
                      data={contractHistory}
                      listID={"list-id"}
                      title={
                        contractDetailsState?.data?.contractDetails
                          ?.contractNumber
                      }
                    />
                  }
                  id={"show-action-history"}
                  show={historyModal}
                  handleClose={() => {
                    setHistoryModal(false);
                  }}
                  handleSave={""}
                  title={
                    "Contract History: " +
                    contractDetailsState?.data?.contractDetails?.contractNumber
                  }
                  centered={true}
                  backdrop={"static"}
                  label={"Ok"}
                  hideLabelCancel={true}
                  hideLabel={true}
                  size={historyModal ? "lg" : null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      {!isEmptyCheck(
        contractDetailsState?.data?.bidderDetails?.bidderUsername
      ) && (
        <div className={"grid-col-12 ppms-details-container"}>
          <BidderBasicInformationView
            bidderData={contractDetailsState?.data?.bidderDetails?.bidderData}
            userData={contractDetailsState?.data?.bidderDetails?.userData}
            emailAddress={
              contractDetailsState?.data?.bidderDetails?.bidderEmail
            }
            {...props}
          />
        </div>
      )}
    </div>
  );
};

export default ContractBidderSummary;
