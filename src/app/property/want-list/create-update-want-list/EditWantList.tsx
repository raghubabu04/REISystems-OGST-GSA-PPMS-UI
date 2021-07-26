import React, { useContext, StrictMode, useEffect } from "react";
import { bindActionCreators } from "redux";
import { WantListDTO } from "../constants/wantListDto";
import { WantListContext } from "./WantListContext";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { PPMSForm } from "../../../../ui-kit/components/common/form/PPMS-form";
import WantListButtons from "./WantListButtons";
import PPMSAccordion from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { ItemInformationClass } from "./item-information-class/ItemInformationClass";
import WantListSideNav from "./WantListSideNav";
import { isFormSubmitted } from "../../../../service/validation.service";
import { isEmptyCheck } from "../validations/FieldValidations";
import { WantListApiService } from "../../../../api-kit/property/wantList-api-service";
import { Paths } from "../../../Router";

import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import moment from "moment";
import { advancedSearchValues } from "../../create-update-property/constants/Constants";
import { yesOrNoOptions } from "../constants/constants";
import { conditionOptions } from "../../../../constants/Constants";

interface EditWantListProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

export function EditWantList(props: EditWantListProps) {
  const {
    itemInformationState,
    updateItemInformationState,
    createWantListState,
    updateCreateWantListState,
  } = useContext(WantListContext);

  let commonApiService = new CommonApiService();
  let wantListApiService = new WantListApiService();

  useEffect(() => {
    commonApiService
      .getFSCCodes()
      .then((resp: any) => {
        updateItemInformationState({
          fscOptions: resp?.data,
        });
        let fscArrayOptions = resp?.data;
        console.log(fscArrayOptions);
        commonApiService.getStateList().then((response: any) => {
          let states = response.data.map((item) => {
            return {
              state: item.stateName,
              id: item.stateCode,
            };
          });
          updateItemInformationState({
            statesOptions: states,
          });
          wantListApiService
            .getWantListById(props.match.params.wantListId)
            .then((response) => {
              let wantListResponse = response?.data;
              let selectedStateValues = [];
              let fcsSelectedValues = [];
              states.forEach((s: any) => {
                if (wantListResponse.stateCodes.includes(s.id))
                  selectedStateValues.push(s);
              });
              fscArrayOptions.forEach((f: any) => {
                if (wantListResponse.fscCodes.includes(f.code))
                  fcsSelectedValues.push(f);
              });

              yesOrNoOptions.forEach((opt) => {
                if (opt.id === wantListResponse?.reimbursement) {
                  opt.isSelected = true;
                } else {
                  opt.isSelected = false;
                }
              });

              conditionOptions.forEach((opt) => {
                if (opt.id === wantListResponse?.conditionCode) {
                  opt.isSelected = true;
                } else {
                  opt.isSelected = false;
                }
              });
            
              let searchOption;
              if (wantListResponse?.itemSearchOption === "ALL_WORDS") {
                searchOption = "All Words";
              } else if (wantListResponse?.itemSearchOption === "ANY_WORD") {
                searchOption = "Any Word";
              } else {
                searchOption = "Exact Phrase";
              }
              updateItemInformationState({
                wantListId: wantListResponse?.wantListId
                  ? wantListResponse?.wantListId
                  : "",
                wantListName: wantListResponse?.wantListName
                  ? wantListResponse?.wantListName
                  : "",
                icn: wantListResponse?.itemControlNumber
                  ? wantListResponse?.itemControlNumber
                  : "",

                searchText: wantListResponse?.itemName
                  ? wantListResponse?.itemName
                  : "",
                searchOption: searchOption,
                searchType: wantListResponse?.itemSearchOption,
                conditionOptions: conditionOptions,
                yesOrNoOptions: yesOrNoOptions,
                reimbursementRequired: wantListResponse?.reimbursement,
                condition: wantListResponse?.conditionCode
                  ? wantListResponse?.conditionCode
                  : "",
                selectedStateValues: selectedStateValues,
                fcsSelectedValues: fcsSelectedValues,
                fscCodeList: wantListResponse?.fscCodes,
                selectedStateList: wantListResponse?.stateCodes,
                expirationDate: wantListResponse?.expiryDate
                  ? moment(wantListResponse?.expiryDate, "YYYY-MM-DD").toDate()
                  : "",
              });
              if (!isEmptyCheck(wantListResponse?.itemControlNumber)) {
                updateItemInformationState({
                  stateSelectionLimit: 0,
                  fscSelectionLimit: 0,
                  fcsSelectedValues: [],
                  fscCodeList: [],
                  selectedStateList: [],
                  selectedStateValues: [],
                  searchInvalid: false,
                  itemNameIsDisabled: true,
                  searchText: "",
                });
              } else {
                updateItemInformationState({
                  stateSelectionLimit: "",
                  fscSelectionLimit: "",
                  itemNameIsDisabled: false,
                  searchInvalid:
                    !isEmptyCheck(itemInformationState.condition) ||
                    itemInformationState.reimbursementRequired === "Y",
                });
              }
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });

    isFormSubmitted.next(false);
  }, []);

  const items = [
    {
      title: "Item Information",
      content: <ItemInformationClass />,
      expanded: true,
      id: "item-information-id",
      className: "item-information",
    },
  ];

  function toJson(): WantListDTO {
    return ({
      wantListId: itemInformationState.wantListId,
      wantListName: itemInformationState.wantListName,
      createdBy: "",
      itemControlNumber: itemInformationState.icn,
      fscCodes: itemInformationState.fscCodeList.toString(),
      itemName: itemInformationState.searchText,
      itemSearchOption: itemInformationState.searchType,
      reimbursement: itemInformationState.reimbursementRequired,
      conditionCode: itemInformationState.condition,
      stateCodes: itemInformationState.selectedStateList.toString(),
      expiryDate: itemInformationState.expirationDate,
    } as unknown) as WantListDTO;
  }

  function submitWantList() {
    let data: WantListDTO = toJson();
    let wantListApi = new WantListApiService();

    wantListApi
      .submitWantList(data)
      .then((response) => {
        addToast({
          text: "Want List Successfully Submitted",
          type: "success",
          heading: "Success",
        });
        props.history.push({
          pathname: `${Paths.wantList}`,
        });
      })
      .catch((error) => {
        addToast({
          text: "Submission Failed",
          type: "error",
          heading: "Error",
        });
      });
  }

  function handleSubmit(event) {
    isFormSubmitted.next(true);
    event.preventDefault();

    updateCreateWantListState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
      triggerValidation: true,
    });

    const form = event.currentTarget;
    if (form.checkValidity() && checkRequiredFields()) {
      submitWantList();
    } else {
      event.stopPropagation();
      updateCreateWantListState({
        isSubmitLoading: false,
        isSubmitDisabled: false,
      });
    }
  }

  function checkRequiredFields() {
    if (itemInformationState.searchInvalid) {
      return false;
    }

    if (
      isEmptyCheck(itemInformationState.searchText) &&
      isEmptyCheck(itemInformationState.icn) &&
      itemInformationState.fscCodeList.length === 0
    ) {
      updateCreateWantListState({
        showErrorAlert: true,
      });
      return false;
    }
    return true;
  }

  function cancelButtonClick() {
    isFormSubmitted.next(false);
    props.history.push({
      pathname: `${Paths.wantList}`,
    });
  }

  return (
    <StrictMode>
      <div className={"want-list-data-creation grid-row ui-ppms"}>
        <div className="grid-row header-row mb-3">
          <h1>Edit Want List</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <WantListSideNav />
              </nav>
            </div>
          </div>
        </div>
        <main
          className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs"
          id="main-content"
        >
          <div className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
            <div className={"desktop:grid-col-9"}>
              <PPMSAlert
                id={"form-verification-error"}
                show={createWantListState.showErrorAlert}
                alertBody={
                  createWantListState.FormErrorMessage ||
                  " Error submitting request."
                }
                alertClassName={"form-verification-error"}
                alertVariant={"danger"}
                alertKey={"form-verification-error"}
                alertBodyArray={createWantListState.alertBodyArray}
              />
              {createWantListState.showErrorAlert && <hr />}
            </div>
          </div>
          <PPMSForm
            noValidate
            className={"usa-accordion--bordered desktop:grid-col-9"}
            large={false}
            search={true}
            onSubmit={handleSubmit}
          >
            <div className={"grid-row grid-gap-2 grid-col"}>
              <WantListButtons
                isSubmitDisabled={false}
                isSubmitLoading={false}
                cancelFunction={cancelButtonClick}
              />
              <br></br>
            </div>

            <br />
            <PPMSAccordion
              items={[
                {
                  title: "Item Information",
                  content: <ItemInformationClass />,
                  expanded: true,
                  id: "item-information-id",
                  className: "item-information",
                },
              ]}
            />
            <br />
            <br />
            <div className={"grid-row grid-gap-2"}>
              <WantListButtons
                isSubmitDisabled={false}
                isSubmitLoading={false}
                cancelFunction={cancelButtonClick}
              />
            </div>
          </PPMSForm>
        </main>
      </div>
    </StrictMode>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(EditWantList);
