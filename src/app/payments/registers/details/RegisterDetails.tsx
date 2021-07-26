import React, { Fragment, StrictMode, useState } from "react";
import { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import PaymentSummary from "./payment-summary/PaymentSummary";
import RegisterDetailsTabsWrapper from "./RegisterDetailsTabsWrapper";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import BidderTransactions from "./transaction/BidderTransactions";
import { BidderTransactionsContextProvider } from "./transaction/BidderTransactionsContext";
import RegisterDetailsSummary from "./common/RegisterDetailsSummary";
import RefundSummary from "./payment-summary/RefundSummary";
import { PageHelper, Paths } from "../../../Router";
import PropertySummary from "./property-summary/PropertySummary";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { ModalActionHistoryContent } from "../../../sales/management/transactions/SalesTransaction";
import { PPMSTextEditor } from "../../../../ui-kit/components/common/PPMS-texteditor";
import { PPMSSalesActionList } from "../../../../ui-kit/components/sales/PPMS-sales-action-list";
import { ContractUpload } from "../../../sales/uploads/ContractUpload";
import { addToast } from "../../../../_redux/_actions/toast.actions";

interface RegisterDetailsProps {
  location?: any;
  match?: any;
  actions?: any;
  roles?: any;
  user?: any;
}

interface IRegisterDetails {
  notesHistory: any;
  saleId?: number;
  status?: string;
  registerId: number;
  type: string;
  registerNumber: string;
}

const RegisterDetails = (props: RegisterDetailsProps) => {
  let salesApiService = new SalesApiService();
  const { match } = props || {};
  let registerId = "";
  if (match?.params?.registerId) {
    registerId = match?.params?.registerId;
  }
  const [registerDetails, setRegisterDetails] = useState<IRegisterDetails>({
    saleId: null,
    status: null,
    registerId: null,
    type: null,
    registerNumber: null,
    notesHistory: [],
  });

  const [showActionHistoryModal, setShowActionHistoryModal] = useState<boolean>(
    false
  );

  const [actionHistoryData, setActionHistoryData] = useState();
  const [notes, updateNotes] = useState("");

  async function handleRegisterTransactionActionHistory() {
    try {
      const data = {
        params: {
          objectType: "REGISTERS",
          objectId: registerDetails?.registerNumber,
        },
      };
      const response = await salesApiService.getActionHistoryForSalesObject(
        data
      );
      setActionHistoryData(response?.data);
      setShowActionHistoryModal(true);
    } catch (error) {
      console.log(error);
    }
  }

  const [selectedTab, setSelectedTab] = useState("payment-type-summary");
  const handleSelect = (selectedTab) => {
    setSelectedTab(selectedTab);
  };

  function getRegisterStatusLabel(registerStatus) {
    let label = "";
    switch (registerStatus) {
      case "Open":
      case "Re-Open":
        label = "Close Register";
        break;
      case "Pending Closure":
        label = "Finalize";
        break;
      case "Closed":
      case "Closed-Modified":
        label = "Reopen Register";
        break;
      default:
        label = "Close Register";
        break;
    }
    return label;
  }

  const [buttonLabel, setButtonLabel] = useState(
    getRegisterStatusLabel(registerDetails?.status)
  );

  async function getRegisterDetails() {
    try {
      const response = await salesApiService.getRegisterDetails(registerId);
      setRegisterDetails(response.data);
      setButtonLabel(getRegisterStatusLabel(response.data.status));
    } catch (error) {
      console.log(error);
    }
  }

  const updateRegister = (actionType) => {
    let data = {
      id: parseInt(registerId),
      status: "",
    };
    switch (actionType) {
      case "Close Register":
        if (registerDetails.status === "Re-Open") {
          data.status = "Closed-Modified";
        }
        data.status = "Pending Closure";
        break;
      case "Finalize":
        data.status = "Closed";
        break;
      case "Reopen Register":
        data.status = "Re-Open";
        break;
    }
    salesApiService
      .updateRegister(data)
      .then((response) => {
        let label = getRegisterStatusLabel(data.status);
        setRegisterDetails(response.data);
        setButtonLabel(label);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getRegisterDetails();
  }, []);
  const downloadReport = () => {
    if (registerDetails.type === "Refund") {
      salesApiService
        .downloadRefundRorReport(registerId)
        .then((response) => {
          let blob = new Blob([response.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          var url = window.URL || window.webkitURL;
          var link = url.createObjectURL(blob);
          var a = document.createElement("a");
          a.setAttribute("download", "RefundRoRReport.xlsx");
          a.setAttribute("href", link);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(link);
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    } else {
      salesApiService
        .downloadRorReport(registerId)
        .then((response) => {
          let blob = new Blob([response.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          var url = window.URL || window.webkitURL;
          var link = url.createObjectURL(blob);
          var a = document.createElement("a");
          a.setAttribute("download", "RoRReport.xlsx");
          a.setAttribute("href", link);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(link);
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }
  };

  const saveNotes = (note) => {
    if (note) {
      let data = {
        id: parseInt(registerId),
        notes: note,
      };
      salesApiService
        .saveRegisterNotes(data)
        .then(() => {
          addToast({
            text: "Notes saved successfully.",
            type: "success",
            heading: "Success",
          });
          updateNotes("");
          getRegisterDetails();
        })
        .catch((error) => {
          console.log(error);
          addToast({
            text: "Error saving notes.",
            type: "error",
            heading: "Error",
          });
        });
    }
  };

  const renderNotesAndNotesHistory = () => (
    <>
      <div className={"grid-row lot-review-h2"}>
        <div className={"grid-col-8"}>
          <h2>NOTES</h2>
        </div>
        <div className={"grid-col-4 saveNotes-btn"}>
          <PPMSButton
            type={"button"}
            label={"Save Notes"}
            onPress={() => saveNotes(notes?.replaceAll(/&nbsp;/g, ""))}
            id={"custodian-notes"}
          />
        </div>
      </div>
      <PPMSTextEditor
        value={notes}
        label={""}
        isInvalid={false}
        isValid={false}
        isRequired={false}
        id={"register-notes"}
        onChange={(value) => {
          updateNotes(value);
        }}
      />

      <div className={"action-history-container"}>
        {registerDetails?.notesHistory?.length > 0 && (
          <PPMSSalesActionList
            data={
              registerDetails?.notesHistory ? registerDetails?.notesHistory : []
            }
            listID={"list-id"}
          />
        )}
      </div>
    </>
  );

  const renderRegisterDetailsActionButtons = () => (
    <div className="register-details-button">
      <PPMSButton
        variant={"outline-secondary"}
        type={"button"}
        label={buttonLabel}
        onPress={() => updateRegister(buttonLabel)}
        id={"cancel"}
      />
      <PPMSButton
        variant={"outline-secondary"}
        type={"button"}
        label={
          registerDetails.type === "Refund"
            ? "Download Refund Register Report"
            : "Download Register Report "
        }
        onPress={() => {
          downloadReport();
        }}
        id={"cancel"}
      />
      <PPMSButton
        variant={"outline-secondary"}
        type={"button"}
        label={"Register Action History "}
        onPress={() => handleRegisterTransactionActionHistory()}
        id={"cancel"}
      />
    </div>
  );

  return (
    <Fragment>
      <StrictMode>
        <div className={"manage-register-payments grid-row ui-ppms"}>
          <div className="ui-ppms usa-layout-docs__main desktop:grid-col-12 usa-prose usa-layout-docs">
            <RegisterDetailsSummary registerDetails={registerDetails} />
            {renderRegisterDetailsActionButtons()}
            <Tabs
              justify
              defaultActiveKey={"payment-type-summary"}
              id="register-details-tab"
              className="ppms-tabs"
              variant="tabs"
              onSelect={(value) => handleSelect(value)}
            >
              <Tab
                eventKey="payment-type-summary"
                title={
                  registerDetails.type === "Refund"
                    ? "Refund Type Summary"
                    : "Payment Type Summary"
                }
              >
                <div className="register-details-wrapper">
                  <RegisterDetailsTabsWrapper
                    children={
                      registerDetails.type == "Refund" ? (
                        <RefundSummary registerId={registerId} />
                      ) : (
                        <PaymentSummary registerId={registerId} />
                      )
                    }
                  />
                </div>
              </Tab>
              <Tab eventKey="bidder-transactions" title="Bidder Transactions">
                <div className="register-details-wrapper">
                  <RegisterDetailsTabsWrapper
                    children={
                      <BidderTransactionsContextProvider>
                        <BidderTransactions registerId={registerId} />
                      </BidderTransactionsContextProvider>
                    }
                  />
                </div>
              </Tab>
              <Tab
                eventKey="property-type-summary"
                title="Property Type Summary"
              >
                <div className="register-details-wrapper">
                  <RegisterDetailsTabsWrapper
                    children={
                      <PropertySummary registerId={parseInt(registerId)} />
                    }
                  />
                </div>
              </Tab>
            </Tabs>

            <div className={"grid-row hide-print"}>
              <div className={"grid-col-12"}>
                {renderNotesAndNotesHistory()}
                <br />
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col"}>
                    <ContractUpload
                      objectType={"REGISTER"}
                      registerId={registerId}
                      fileInfectedStatus={() => {}}
                    />
                  </div>
                </div>
                <br />
              </div>
            </div>

            {renderRegisterDetailsActionButtons()}
            <div className={"grid-row-auto"}>
              <PPMSButton
                id={"back"}
                type={"button"}
                variant={"link"}
                label={"< Back To Manage Registers"}
                onPress={() => PageHelper.openPage(`${Paths.manageRegisters}`)}
                className="back-to-manage-auction usa-button "
              />
            </div>
            <div className="grid-row grid-gap-4">
              <PPMSModal
                body={
                  <ModalActionHistoryContent
                    data={actionHistoryData}
                    listID={"list-id"}
                    title={registerDetails.registerNumber}
                  />
                }
                id={"show-action-history"}
                show={showActionHistoryModal}
                handleClose={() => {
                  setShowActionHistoryModal(false);
                }}
                handleSave={""}
                title={
                  "Action History Register: " + registerDetails.registerNumber
                }
                centered={true}
                backdrop={"static"}
                label={"Ok"}
                hideLabelCancel={true}
                hideLabel={showActionHistoryModal}
                size={showActionHistoryModal ? "lg" : null}
              />
            </div>
          </div>
        </div>
      </StrictMode>
    </Fragment>
  );
};

export default RegisterDetails;
