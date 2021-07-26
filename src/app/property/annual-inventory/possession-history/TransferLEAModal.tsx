import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { PPMSEmail } from "../../../../ui-kit/components/PPMS-email";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { PossessionHistoryContext } from "./PossessionHistoryContext";
import {
  formatPhone,
  formatExtension,
} from "../../../../ui-kit/utilities/FormatUtil";
import { defaultDoneeInfoDetails } from "./PossessionHistoryState";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSFirstNameLastName } from "../../../../ui-kit/components/PPMS-firstname-lastname";
import { isEmptyCheck } from "../../../../ui-kit/components/validations/FieldValidations";
import { PPMSFirearmDetails } from "../../../../ui-kit/components/common/PPMS-FirearmDetails";
import { PPMSAddress } from "../../../../ui-kit/components/PPMS-address";
import { PPMSPhoneNumber } from "../../../../ui-kit/components/PPMS-phone-number";
import { PPMSDatepicker } from "../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import moment from "moment";
import { PPMSTextArea } from "../../../../ui-kit/components/common/input/PPMS-textarea";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { statusCodeValues } from "./Constants";
import { InventoryApiService } from "../../../../api-kit/property/inventory-api-service";
import { UserApiService } from "../../../../api-kit/user/user-api.service";
import { UserUtils } from "../../../../utils/UserUtils";

export interface Props {
  toggleTransferModal: any;
  actions?: any;
  icn: string;
  tcn: string;
  serialNumber: string;
  itemName: string;
  itemStatus: string;
}

function TransferLEAModal(props: Props) {
  const { possessionHistoryState, updatePossessionHistoryState } = useContext(
    PossessionHistoryContext
  );

  const userApiService = new UserApiService();
  const inventoryApiService = new InventoryApiService();
  const {
    toggleTransferModal,
    icn,
    tcn,
    serialNumber,
    itemName,
    itemStatus,
  } = props;
  const { addToast } = props.actions;

  useEffect(() => {
    updatePossessionHistoryState({
      statusCode: itemStatus,
    });
  }, []);

  const onCancel = (event) => {
    resetDoneeInfoState();
    toggleTransferModal(false);
  };

  function onSave(event) {
    let data = {
      transferComment: possessionHistoryState.transferComment,
      status: possessionHistoryState.statusCode,
      transferDate: possessionHistoryState.dateOfTransfer,
      leaId: possessionHistoryState.doneeInfoUserId,
      itemControlNumber: icn,
    };

    //Call API to transfer LEA
    inventoryApiService
      .transferFirearm(data)
      .then((res) => {
        addToast({
          text: `LEA successfully transferred.`,
          type: "success",
          heading: "Success",
        });
        if (data.status !== "A") {
          updatePossessionHistoryState({
            transerButtonDisabled: true,
            displayStatusCode: data.status,
          });
        } else {
          updatePossessionHistoryState({
            displayStatusCode: data.status,
          });
        }

        if (
          data.status !== "A" &&
          !(UserUtils.isSystemAdminUser || UserUtils.isUserFireArmManager)
        ) {
          updatePossessionHistoryState({
            updateStatusButtonDisabled: true,
          });
        }
        toggleTransferModal(true);
        resetDoneeInfoState();
      })
      .catch((err) => {
        addToast({
          text: `Failed to transfer LEA.`,
          type: "error",
          heading: "Error",
        });
      });
  }

  function getDoneeInfo(email) {
    const data = {
      params: {
        email: email,
      },
    };
    userApiService
      .getLeaUser(data)
      .then((res) => {
        if (res.data !== null && res.status === 200) {
          let leaInfo = res.data?.leaInformationDTO;
          if (leaInfo) {
            updatePossessionHistoryState({
              doneeInfoUserId: res.data?.leaUserId,
              doneeInfoEmail: email,
              doneeInfoFirstName: res.data?.firstName,
              doneeInfoMiddleName: res.data?.middleName,
              doneeInfoLastName: res.data?.lastName,
              doneeInfoPhone: res.data?.phoneNumber
                ? formatPhone(res.data?.phoneNumber + "")
                : "",
              doneeInfoPhoneExt: res.data?.phoneExt
                ? formatExtension(res.data?.phoneExt + "")
                : "",

              doneeInfoOrgName: leaInfo?.doneeOrganizationName,
              doneeInfoTitle: leaInfo?.title,
              doneeInfoAddressId: leaInfo?.addressId,
              doneeInfoAddressLine1: leaInfo?.addressLine1,
              doneeInfoAddressLine2: leaInfo?.addressLine2,
              doneeInfoAddressLine3: leaInfo?.addressLine3,
              doneeInfoCity: leaInfo?.city,
              doneeInfoState: leaInfo?.stateCode,
              doneeInfoZipcode: leaInfo?.zip,
              doneeInfoZipExt: leaInfo?.zipExtension,
              doneeInfoEmailIsValid: true,
              showDoneeAlert: false,
              doneeAlertMessage: "",
            });
            if (possessionHistoryState.dateIsSelected) {
              updatePossessionHistoryState({
                isValidEmail: true,
                transferSaveButtonDisabled: false,
              });
            } else {
              updatePossessionHistoryState({
                isValidEmail: true,
                transferSaveButtonDisabled: true,
              });
            }
          }
        } else if (res.status === 204) {
          updatePossessionHistoryState({
            doneeInfoEmailIsInvalid: true,
            doneeInfoEmailIsValid: false,
            doneeInfoEmailValidationMessage: "User is not LEA",
            showDoneeAlert: false,
            doneeAlertMessage: "",
            transferSaveButtonDisabled: true,
            isValidEmail: false,
          });
        }
      })
      .catch((err) => {
        updatePossessionHistoryState({
          doneeInfoEmailIsInvalid: false,
          doneeInfoEmailIsValid: true,
          doneeInfoEmailValidationMessage: "",
          showDoneeAlert: true,
          doneeAlertMessage: "LEA not found.",
          transferSaveButtonDisabled: true,
          isValidEmail: false,
        });
      });
  }

  function resetDoneeInfoState() {
    updatePossessionHistoryState({ ...defaultDoneeInfoDetails });
  }

  function getReceivedDate() {
    inventoryApiService
      .getFireArmByICN(props.icn)
      .then((fireArmResponse) => {
        let data = {
          firearmDoneeId: fireArmResponse.data.firearmDoneeId,
          params: {
            page: 1,
            size: 50,
          },
        };
        inventoryApiService
          .getPossessionHistoryList(data)
          .then((possessionHistoryResponse) => {
            let receiveDateMoments = possessionHistoryResponse.data.possessionHistorySearchResultList.map(
              (receiveDt) => moment(receiveDt.receivedDate)
            );
            let maxReceiveDate = moment.max(receiveDateMoments);
            updatePossessionHistoryState({
              receiveDateTransfer: maxReceiveDate,
            });
          })
          .catch((error) => {
            console.log(
              "TransferLEAModal PossessionHistory ReceievedDate:",
              error
            );
          });
      })
      .catch((error) => {
        console.log("TransferLEAModal ReceievedDate:", error);
      });
  }

  function handleDateOfTransferChange(date) {
    let transferDate = moment(date, "MM/DD/YYYY");
    getReceivedDate();

    if (date) {
      if (date.length < 10) {
        //if not full date length
        updatePossessionHistoryState({
          dateOfTransfer: "",
          dateOfTransferIsInValid: true,
          dateOfTransferMsg: "Enter full date",
          dateIsSelected: false,
          transferSaveButtonDisabled: true,
        });
      } else if (
        transferDate < moment(possessionHistoryState.receiveDateTransfer)
      ) {
        //if day is before previous Transfer receivedDate
        updatePossessionHistoryState({
          dateOfTransfer: "",
          dateOfTransferIsInValid: true,
          dateOfTransferMsg:
            "Ownership Change Date cannot be less than previous Received Date.",
          dateIsSelected: false,
          transferSaveButtonDisabled: true,
        });
      } else if (transferDate > moment(new Date(Date.now()), "MM/DD/YYYY")) {
        //if day is after today
        updatePossessionHistoryState({
          dateOfTransfer: "",
          dateOfTransferIsInValid: true,
          dateOfTransferMsg: "Ownership Change Date cannot be future date.",
          dateIsSelected: false,
          transferSaveButtonDisabled: true,
        });
      } else if (transferDate < moment(new Date("01/01/1900"), "MM/DD/YYYY")) {
        //if day is before 1900
        updatePossessionHistoryState({
          dateOfTransfer: "",
          dateOfTransferIsInValid: true,
          dateOfTransferMsg: "Invalid date.",
          dateIsSelected: false,
          transferSaveButtonDisabled: true,
        });
      } else {
        updatePossessionHistoryState({
          dateOfTransfer: transferDate.format("MM/DD/YYYY"),
          dateOfTransferIsInValid: false,
          dateOfTransferMsg: "",
          dateIsSelected: true,
        });
        if (possessionHistoryState.isValidEmail) {
          updatePossessionHistoryState({
            transferSaveButtonDisabled: false,
          });
        } else {
          updatePossessionHistoryState({
            transferSaveButtonDisabled: true,
          });
        }
      }
    }
  }

  return (
    <PPMSModal
      size={"xl"}
      body={
        <>
          <div className={"modal-adjustment"}>
            <PPMSFirearmDetails
              icn={icn}
              itemName={itemName}
              serialNumber={serialNumber}
              tcn={tcn}
            ></PPMSFirearmDetails>
            <div className="grid-row grid-gap-5">
              <div className="grid-col">
                <div className="grid-row">
                  <div className="grid-col-12">
                    <PPMSEmail
                      email={possessionHistoryState.doneeInfoEmail}
                      emailLabel={"Donee Email"}
                      id={"donee-email"}
                      required={true}
                      disabled={false}
                      maxLength={64}
                      isInvalid={possessionHistoryState.doneeInfoEmailIsInvalid}
                      validationMessage={
                        possessionHistoryState.doneeInfoEmailValidationMessage
                      }
                      updateEmail={(value, validation) => {
                        if (!validation.isInvalid) {
                          getDoneeInfo(value);
                        } else {
                          updatePossessionHistoryState({
                            doneeInfoEmailIsInvalid: validation.isInvalid,
                            doneeInfoEmailIsValid: !validation.isInvalid,
                            doneeInfoEmailValidationMessage:
                              validation.validationError,
                          });
                        }
                      }}
                      onChangeEmail={(value) => {
                        resetDoneeInfoState();
                        updatePossessionHistoryState({
                          doneeInfoEmail: value,
                          doneeInfoEmailIsValid: false,
                          doneeInfoEmailIsInvalid: false,
                          doneeInfoEmailValidationMessage: "",
                        });
                      }}
                    />
                    <PPMSAlert
                      isAlertSlim={true}
                      id={"icn-verification-success-msg"}
                      show={possessionHistoryState.showDoneeAlert}
                      alertBody={possessionHistoryState.doneeAlertMessage}
                      alertClassName={"email-verification-error"}
                      alertVariant={"warning"}
                      alertKey={"email-verification-error"}
                    />
                    <div className="grid-row grid-gap-2">
                      <PPMSFirstNameLastName
                        id={"donee-firstname-lastname"}
                        required={true}
                        maxLength={30}
                        showMiddleName={true}
                        disabled={true}
                        firstName={possessionHistoryState.doneeInfoFirstName}
                        isFirstNameInvalid={
                          possessionHistoryState.doneeInfoFirstNameIsInvalid
                        }
                        validationFirstMessage={
                          possessionHistoryState.doneeInfoFirstNameValidationMessage
                        }
                        middleName={possessionHistoryState.doneeInfoMiddleName}
                        lastName={possessionHistoryState.doneeInfoLastName}
                        isLastNameInvalid={
                          possessionHistoryState.doneeInfoLastNameIsInvalid
                        }
                        validationLastMessage={
                          possessionHistoryState.doneeInfoLastNameValidationMessage
                        }
                        maxMiddleLength={100}
                        updateFirstName={(value) => {
                          let isInvalid = isEmptyCheck(value);
                          updatePossessionHistoryState({
                            doneeInfoFirstNameIsInvalid: isInvalid,
                          });
                        }}
                        updateLastName={(value) => {
                          let isInvalid = isEmptyCheck(value);
                          updatePossessionHistoryState({
                            doneeInfoLastNameIsInvalid: isInvalid,
                          });
                        }}
                        updateMiddleName={() => {}}
                        onChangeMiddleName={(value) => {
                          updatePossessionHistoryState({
                            doneeInfoMiddleName: value,
                          });
                        }}
                        onChangeFirstName={(value) => {
                          updatePossessionHistoryState({
                            doneeInfoFirstName: value,
                            doneeInfoFirstNameIsInvalid: false,
                          });
                        }}
                        onChangeLastName={(value) => {
                          updatePossessionHistoryState({
                            doneeInfoLastName: value,
                            doneeInfoLastNameIsInvalid: false,
                          });
                        }}
                      />
                    </div>
                    <div className="grid-row">
                      <div className="grid-col-12">
                        <PPMSAddress
                          id={"donee-address"}
                          title={"Donee"}
                          showAddressLine3={true}
                          addressDisabaled={true}
                          address1={
                            possessionHistoryState.doneeInfoAddressLine1
                          }
                          address1Required={true}
                          address1IsInvalid={
                            possessionHistoryState.doneeInfoAddressLine1IsInvalid
                          }
                          address1IsValid={
                            !possessionHistoryState.doneeInfoAddressLine1IsInvalid
                          }
                          address1ValidationMessage={
                            possessionHistoryState.doneeInfoAddressLine1ValidationMessage
                          }
                          onChangeAddress1={(value) => {
                            updatePossessionHistoryState({
                              doneeInfoAddressLine1: value,
                            });
                          }}
                          updateAddress1={(value: any, validation) => {
                            updatePossessionHistoryState({
                              doneeInfoAddressLine1IsInvalid:
                                validation.isInvalid,
                            });
                          }}
                          address2={
                            possessionHistoryState.doneeInfoAddressLine2
                          }
                          address2Required={false}
                          address2IsInvalid={false}
                          address2IsValid={true}
                          updateAddress2={(value: any) => {
                            updatePossessionHistoryState({
                              doneeInfoAddressLine2: value,
                            });
                          }}
                          address3={
                            possessionHistoryState.doneeInfoAddressLine3
                          }
                          address3Required={false}
                          address3IsInvalid={false}
                          address3IsValid={true}
                          updateAddress3={(value: any) => {
                            updatePossessionHistoryState({
                              doneeInfoAddressLine3: value,
                              doneeInfoAddressLine3IsInvalid: false,
                              doneeInfoAddressLine3ValidationMessage: "",
                            });
                          }}
                          city={possessionHistoryState.doneeInfoCity}
                          cityRequired={true}
                          cityIsInvalid={
                            possessionHistoryState.doneeInfoCityIsInvalid
                          }
                          cityIsValid={
                            !possessionHistoryState.doneeInfoCityIsInvalid
                          }
                          cityValidationMessage={
                            possessionHistoryState.doneeInfoCityValidationMessage
                          }
                          onChangeCity={(value) => {
                            updatePossessionHistoryState({
                              doneeInfoCity: value,
                              doneeInfoCityIsInvalid: false,
                              doneeInfoCityValidationMessage: "",
                            });
                          }}
                          updateCity={(value: any, validation) => {
                            updatePossessionHistoryState({
                              doneeInfoCityIsInvalid: validation.isInvalid,
                              doneeInfoCityValidationMessage:
                                validation.validationError,
                            });
                          }}
                          state={possessionHistoryState.doneeInfoState}
                          stateRequired={true}
                          stateIsInvalid={
                            possessionHistoryState.doneeInfoStateIsInvalid
                          }
                          stateIsValid={
                            !possessionHistoryState.doneeInfoStateIsInvalid
                          }
                          stateDisabled={true}
                          updateState={(value: any, validation: any) => {
                            updatePossessionHistoryState({
                              doneeInfoState: value,
                            });
                          }}
                          zip={possessionHistoryState.doneeInfoZipcode}
                          zipRequired={true}
                          zipIsInvalid={
                            possessionHistoryState.doneeInfoZipcodeIsInvalid
                          }
                          zipIsValid={
                            !possessionHistoryState.doneeInfoZipcodeIsInvalid
                          }
                          zipValidationMessage={
                            possessionHistoryState.doneeInfoZipcodeValidationMessage
                          }
                          showZipExtension={true}
                          onChangeZip={(value) => {
                            updatePossessionHistoryState({
                              doneeInfoZipcode: value,
                              doneeInfoZipcodeIsInvalid: false,
                              doneeInfoZipcodeValidationMessage: "",
                            });
                          }}
                          updateZip={(
                            value: any,
                            inValid: boolean,
                            valid: boolean,
                            validationError: string,
                            disabledZipExtension: boolean
                          ) => {
                            updatePossessionHistoryState({
                              doneeInfoZipcodeIsInvalid: inValid,
                              doneeInfoZipcodeValidationMessage: validationError,
                              doneeInfodisabledZipExtension: disabledZipExtension,
                            });
                          }}
                          validationExtensionMessage={
                            possessionHistoryState.doneeInfoZipExtValidationMessage
                          }
                          zip2={possessionHistoryState.doneeInfoZipExt}
                          zip2IsInvalid={
                            possessionHistoryState.doneeInfoZipExtIsInvalid
                          }
                          zip2IsValid={
                            !possessionHistoryState.doneeInfoZipExtIsInvalid
                          }
                          disabledZipExtension={true}
                          onChangeZipExtension={(value) => {
                            updatePossessionHistoryState({
                              doneeInfoZipExt: value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid-row grid-gap-2">
                      <PPMSPhoneNumber
                        phone={possessionHistoryState.doneeInfoPhone}
                        extension={possessionHistoryState.doneeInfoPhoneExt}
                        id={"Phone"}
                        showExtension={true}
                        disabled={true}
                        disabledExtension={true}
                        updatePhoneExtension={(value) => {}}
                        onChangePhoneExt={(value) => {
                          updatePossessionHistoryState({
                            doneeInfoPhoneExt: value,
                          });
                        }}
                        updatePhoneNumber={(value, validation: any) => {
                          updatePossessionHistoryState({
                            doneeInfoPhoneIsInvalid: validation.isInvalid,
                            doneeInfoPhoneValidationMessage:
                              validation.validationError,
                          });
                        }}
                        onChangePhoneNumber={(value) => {
                          updatePossessionHistoryState({
                            doneeInfoPhone: value,
                            doneeInfoPhoneIsInvalid: false,
                            doneeInfoPhoneValidationMessage: "",
                          });
                        }}
                        maxLength={16}
                        isInvalid={
                          possessionHistoryState.doneeInfoPhoneIsInvalid
                        }
                        validationMessage={
                          possessionHistoryState.doneeInfoPhoneValidationMessage
                        }
                        maxLengthExtension={7}
                        required={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid-col">
                <div className="grid-row grid-gap-2">
                  <div className="grid-col-11">
                    <PPMSInput
                      id={"doneeInfoOrgName"}
                      name={"Organization Name"}
                      label={"Organization Name"}
                      isRequired={true}
                      isDisabled={true}
                      inputType={"text"}
                      value={possessionHistoryState.doneeInfoOrgName}
                      onChange={(event) => {
                        updatePossessionHistoryState({
                          doneeInfoOrgName: event.target.value,
                          doneeInfoOrgNameIsInvalid: false,
                        });
                      }}
                      onBlur={(event) => {
                        updatePossessionHistoryState({
                          doneeInfoOrgNameIsInvalid: !event.target.validity
                            .valid,
                        });
                      }}
                      validationMessage={
                        possessionHistoryState.doneeInfoOrgNameValidationMessage
                      }
                      maxLength={40}
                      minLength={1}
                      isInvalid={
                        possessionHistoryState.doneeInfoOrgNameIsInvalid
                      }
                      isValid={
                        !possessionHistoryState.doneeInfoOrgNameIsInvalid
                      }
                    />
                  </div>
                </div>
                <div className="grid-row grid-gap-2">
                  <div className="grid-col-11">
                    <PPMSInput
                      id={"doneeInfoTitle"}
                      name={"Title"}
                      label={"Title"}
                      isRequired={false}
                      isDisabled={true}
                      inputType={"text"}
                      value={possessionHistoryState.doneeInfoTitle}
                      onChange={(event) => {
                        updatePossessionHistoryState({
                          doneeInfoTitle: event.target.value,
                          doneeInfoTitleIsInvalid: false,
                        });
                      }}
                      onBlur={(event) => {
                        updatePossessionHistoryState({
                          doneeInfoTitleIsInvalid: !event.target.validity.valid,
                        });
                      }}
                      validationMessage={
                        possessionHistoryState.doneeInfoTitleValidationMessage
                      }
                      maxLength={40}
                      minLength={1}
                      isInvalid={possessionHistoryState.doneeInfoTitleIsInvalid}
                      isValid={!possessionHistoryState.doneeInfoTitleIsInvalid}
                    />
                  </div>
                </div>
                <div className="grid-row grid-gap-2">
                  <PPMSDatepicker
                    id={"dateOfTransfer"}
                    format={"MM/DD/YYYY"}
                    startDate={possessionHistoryState.dateOfTransfer}
                    name={"Date Received by Recipient"}
                    updateDate={(date) => handleDateOfTransferChange(date)}
                    display={"bottom-end"}
                    label={"Ownership Change Date"}
                    isRequired={true}
                    placeholder={"Ownership Change Date"}
                    validationMessage={possessionHistoryState.dateOfTransferMsg}
                    maxDate={new Date(Date.now())}
                    isInvalid={possessionHistoryState.dateOfTransferIsInValid}
                    useDefaultValidation={false}
                    isDisabled={false}
                  />
                </div>
                <div className="grid-row grid-gap-2">
                  <PPMSSelect
                    id={"status"}
                    name={"status"}
                    selectName={"selectStatus"}
                    values={statusCodeValues}
                    onChange={(event) =>
                      updatePossessionHistoryState({
                        statusCode: event.target.value,
                      })
                    }
                    identifierKey={"id"}
                    identifierValue={"value"}
                    selectedValue={possessionHistoryState.statusCode}
                    label={"Status"}
                    isRequired={false}
                  />
                </div>
                <div className="grid-row grid-gap-2">
                  <div className="grid-col-12">
                    <PPMSTextArea
                      label={"Comments"}
                      isInvalid={false}
                      isValid={false}
                      id={"transferComment"}
                      isRequired={false}
                      isDisabled={false}
                      inputType={"text"}
                      maxLength={500}
                      value={possessionHistoryState.transferComment}
                      onChange={(event) =>
                        updatePossessionHistoryState({
                          transferComment: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
      id={"transfer-lea"}
      show={true}
      handleClose={onCancel}
      handleSave={onSave}
      title={"Transfer LEA"}
      label={"Save"}
      labelCancel={"Cancel"}
      disableSave={possessionHistoryState.transferSaveButtonDisabled}
      backdrop={"static"}
    />
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(TransferLEAModal);
