import React, { useContext, StrictMode } from "react";
import { WantListContext } from "./WantListContext";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import WantListButtons from "./WantListButtons";
import { PPMSForm } from "../../../../ui-kit/components/common/form/PPMS-form";
import WantListSideNav from "./WantListSideNav";
import PPMSAccordion from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { ItemInformationClass } from "./item-information-class/ItemInformationClass";
import { isFormSubmitted } from "../../../../service/validation.service";
import { WantListDTO } from "../constants/wantListDto";
import { WantListApiService } from "../../../../api-kit/property/wantList-api-service";
import { Paths } from "../../../Router";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { isEmptyCheck } from "../validations/FieldValidations";

interface CreateWantListProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function CreateWantList(props: CreateWantListProps) {
  const {
    updateItemInformationState,
    itemInformationState,
    updateCreateWantListState,
    createWantListState,
  } = useContext(WantListContext);

  const { addToast } = props.actions;

  function toJson(): WantListDTO {
    return {
      wantListId: null,
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
    };
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
          <h1>Want List Data Creation </h1>
        </div>

        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <WantListSideNav />
              </nav>
            </div>
          </div>
        </div>
        <div className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <div className={"desktop:grid-col-12"}>
            <PPMSAlert
              id={"form-verification-error-alert"}
              show={createWantListState.showErrorAlert}
              alertBody={createWantListState.FormErrorMessage}
              alertClassName={"form-verification-error"}
              alertVariant={"danger"}
              alertKey={"form-verification-error"}
            />
            {createWantListState.showErrorAlert && <hr />}
          </div>
          <br />
          <PPMSForm
            noValidate
            large={false}
            search={true}
            onSubmit={handleSubmit}
            className={"usa-accordion--bordered desktop:grid-col-12"}
          >
            <div className={"grid-row grid-gap-2"}>
              <WantListButtons
                isSubmitDisabled={false}
                isSubmitLoading={false}
                cancelFunction={cancelButtonClick}
              />
            </div>
<br></br>
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
        </div>
      </div>
    </StrictMode>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(CreateWantList);
