import React, {StrictMode, useContext, useEffect} from "react";
import {Form} from "react-bootstrap";
import InternalAgencyAddressClass from "./internal-agency-address-class/InternalAgencyAddressClass";
import PocClass from "../internal-agency/point-of-contact-class/PocClass";
import InternalAgencyScreeningInfoClass from "./internal-agency-screening-info-class/InternalAgencyScreeningInfoClass";
import InternalAgencyRemarksClass from "./internal-agency-remarks-class/InternalAgencyRemarksClass";
import {InternalAgencyContext} from "./InternalAgencyContext";
import InternalAgencyDetailsClass from "./internal-agency-details/InternalAgencyDetailsClass";
import InternalAgencySideNav from "./InternalAgencySideNav";

import {isFormSubmitted} from "../../service/validation.service";
import {InternalAgencyDto} from "../models/InternalAgency";
import {PocStateJson} from "../internal-agency/point-of-contact-class/PocState";
import {InternalAgencyAddressStateJson} from "./internal-agency-address-class/InternalAgencyAddressState";
import {InternalAgencyDetailsStateJson} from "./internal-agency-details/InternalAgencyDetailsState";
import {InternalAgencyScreeningInfoStateJson} from "./internal-agency-screening-info-class/InternalAgencyScreeningInfoState";
import {
  InternalAgencyRemarksDefault,
  InternalAgencyRemarksStateJson,
} from "./internal-agency-remarks-class/InternalAgencyRemarksState";
import {CommonApiService} from "../../api-kit/common/common-api.service";

import moment from "moment";
import {PageHelper, Paths} from "../Router";
import {PPMSAlert} from "../../ui-kit/components/common/PPMS-alert";
import PPMSAccordion from "../../ui-kit/components/common/accordion/PPMS-accordion";
import {isAgencyActive} from "./constants/Constants";

import {connect} from "react-redux";
import {addToast} from "../../_redux/_actions/toast.actions";
import {bindActionCreators} from "redux";
import InternalAgencyButtons from "./InternalAgencyButtons";
import {formatExtension, formatPhone, nullToStringUtil,} from "../../ui-kit/utilities/FormatUtil";

export interface EditInternalAgencyProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

export function EditInternalAgency(props: EditInternalAgencyProps) {
  const {
    internalAgencyState,
    internalAgencyDetailsState,
    internalAgencyAddressState,
    pocState,
    internalAgencyScreeningInfoState,
    internalAgencyRemarksState,
    updateInternalAgencyState,
    updateInternalAgencyDetailsState,
    updateInternalAgencyAddressState,
    updatePocState,
    updateInternalAgencyScreeningInfoState,
    updateInternalAgencyRemarksState,
  } = useContext(InternalAgencyContext);

  useEffect(() => {
    commonApiService
      .getInternalAgency(props.match.params.agencyCode)
      .then((response) => {
        let internalAgencyResponse = response?.data;
        updateInternalAgencyDetailsState({
          internalAgencyCodeIsDisabled: true,
          internalAbbreviatedAgency: internalAgencyResponse?.agencyAbbreviation
            ? internalAgencyResponse?.agencyAbbreviation
            : "",
          internalAgencyCode: internalAgencyResponse?.agencyCode
            ? internalAgencyResponse?.agencyCode
            : "",
          internalAgencyName: internalAgencyResponse?.agencyName
            ? internalAgencyResponse?.agencyName
            : "",
        });

        updateInternalAgencyAddressState({
          internalAgencyAddress1: internalAgencyResponse?.agencyLocation?.line1
            ? internalAgencyResponse?.agencyLocation?.line1
            : "",
          internalAgencyAddress2: internalAgencyResponse?.agencyLocation?.line2
            ? internalAgencyResponse?.agencyLocation?.line2
            : "",
          internalAgencyAddress3: internalAgencyResponse?.agencyLocation?.line3
            ? internalAgencyResponse?.agencyLocation?.line3
            : "",
          internalAgencyCity: internalAgencyResponse?.agencyLocation?.city
            ? internalAgencyResponse?.agencyLocation?.city
            : "",
          internalAgencyStateCode: internalAgencyResponse?.agencyLocation
            ?.stateCode
            ? internalAgencyResponse?.agencyLocation?.stateCode
            : "Select State",
          internalAgencyZipCode: internalAgencyResponse?.agencyLocation?.zip
            ? internalAgencyResponse?.agencyLocation?.zip
            : "",
          internalAgencyZip2Code: internalAgencyResponse?.agencyLocation?.zip2
            ? internalAgencyResponse?.agencyLocation?.zip2
            : "",
        });

        updatePocState({
          pocFirstName: internalAgencyResponse?.agencyContact?.firstName
            ? internalAgencyResponse?.agencyContact?.firstName
            : "",
          pocMiddleName: internalAgencyResponse?.agencyContact?.middleName
            ? internalAgencyResponse?.agencyContact?.middleName
            : "",
          pocLastName: internalAgencyResponse?.agencyContact?.lastName
            ? internalAgencyResponse?.agencyContact?.lastName
            : "",
          pocPhone: internalAgencyResponse?.agencyContact?.phone
            ? formatPhone(
                nullToStringUtil(internalAgencyResponse?.agencyContact?.phone) +
                  ""
              )
            : "",
          pocPhoneExt: internalAgencyResponse?.agencyContact?.phoneExtension
            ? formatExtension(
                nullToStringUtil(
                  internalAgencyResponse?.agencyContact?.phoneExtension
                ) + ""
              )
            : "",
          pocEmail: internalAgencyResponse?.agencyContact?.email
            ? internalAgencyResponse?.agencyContact?.email
            : "",
          pocCcEmail: internalAgencyResponse?.agencyContact?.ccEmail
            ? internalAgencyResponse?.agencyContact?.ccEmail
            : "",
          pocFax: internalAgencyResponse?.agencyContact?.fax
            ? formatPhone(
                nullToStringUtil(internalAgencyResponse?.agencyContact?.fax) +
                  ""
              )
            : "",
        });

        updateInternalAgencyScreeningInfoState({
          internalScreeningDays: internalAgencyResponse?.screeningDays
            ? internalAgencyResponse?.screeningDays
            : "",
          localScreeningDays: internalAgencyResponse?.localScreeningDays
            ? internalAgencyResponse?.localScreeningDays
            : "",
          internalBeginDate: internalAgencyResponse?.beginDate
            ? moment(internalAgencyResponse?.beginDate, "YYYY-MM-DD").toDate()
            : "",
          isAgencyActive: selectedValueOptions(
            isAgencyActive,
            internalAgencyResponse?.isActive ? ["Y"] : ["N"]
          ),
          defaultAgencyToggle: internalAgencyResponse?.isActive ? "Y" : "N",
          agencyToggle: internalAgencyResponse?.isActive ? true : false,
        });

        updateInternalAgencyRemarksState({
          remarks: internalAgencyResponse?.remarks
            ? internalAgencyResponse?.remarks
            : "",
          remarksCharacterLeft:
            InternalAgencyRemarksDefault.remarksCharacterLeft -
            internalAgencyResponse?.remarks.trim().length,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const items = [
    {
      title: "Internal Agency",
      content: <InternalAgencyDetailsClass editValidation={false} />,
      expanded: internalAgencyDetailsState.accordianExpanded,
      id: "internalAgency",
      trigger: "common",
    },
    {
      title: "Internal Agency Address ",
      content: <InternalAgencyAddressClass />,
      expanded: internalAgencyDetailsState.accordianExpanded,
      id: "internalAgencyAddress",
      trigger: "common",
    },
    {
      title: "Point of Contact",
      content: <PocClass />,
      expanded: internalAgencyDetailsState.accordianExpanded,
      id: "internalAgencyPOC",
      trigger: "common",
    },
    {
      title: "Screening Information",
      content: <InternalAgencyScreeningInfoClass />,
      expanded: internalAgencyDetailsState.accordianExpanded,
      id: "internalAgencyScreeningInfo",
      trigger: "common",
    },
    {
      title: "Remarks",
      content: <InternalAgencyRemarksClass />,
      expanded: internalAgencyDetailsState.accordianExpanded,
      id: "internalAgencyRemark",
      trigger: "common",
    },
  ];

  let commonApiService = new CommonApiService();

  function toJSON(isSubmitFlag: boolean): InternalAgencyDto {
    let internalAgencyDetails = InternalAgencyDetailsStateJson(
        internalAgencyDetailsState
      )[0],
      internalAgencyAddress = InternalAgencyAddressStateJson(
        internalAgencyAddressState
      )[0],
      internalAgencyPOC = PocStateJson(pocState)[0],
      internalAgencyScreeningInfo = InternalAgencyScreeningInfoStateJson(
        internalAgencyScreeningInfoState
      )[0],
      internalAgencyRemarks = InternalAgencyRemarksStateJson(
        internalAgencyRemarksState
      )[0];

    return ({
      agencyCode: internalAgencyDetails.agencyCode,
      agencyAbbreviation: internalAgencyDetails.agencyAbbreviation,
      agencyName: internalAgencyDetails.agencyName,
      agencyLocation: {
        line1: internalAgencyAddress.line1,
        line2: internalAgencyAddress.line2,
        line3: internalAgencyAddress.line3,
        city: internalAgencyAddress.city,
        stateCode: internalAgencyAddress.stateCode,
        zip: internalAgencyAddress.zip,
        zip2: internalAgencyAddress.zip2,
      },
      agencyContact: {
        firstName: internalAgencyPOC.firstName,
        lastName: internalAgencyPOC.lastName,
        middleName: internalAgencyPOC.middleName,
        email: internalAgencyPOC.email,
        ccEmail: internalAgencyPOC.ccEmail,
        phone: internalAgencyPOC.phone,
        fax: internalAgencyPOC.fax,
        phoneExtension: internalAgencyPOC.phoneExtension,
      },
      screeningDays: internalAgencyScreeningInfo.screeningDays,
      localScreeningDays: internalAgencyScreeningInfo.localScreeningDays,
      isActive: internalAgencyScreeningInfo.isActive,
      beginDate: internalAgencyScreeningInfo.beginDate,
      remarks: internalAgencyRemarks.remarks,
    } as unknown) as InternalAgencyDto;
  }

  function selectedValueOptions(options: any[], selectedValues: any[]) {
    options.forEach((option) => {
      if (selectedValues.includes(option.id)) {
        option.isSelected = true;
      } else {
        option.isSelected = false;
      }
    });
    return options;
  }

  function handleCancel() {
    isFormSubmitted.next(false);
    props.history.push({
      pathname: `${Paths.internalAgencyList}`,
    });
  }

  function handleSubmit(event: any) {
    isFormSubmitted.next(true);
    event.preventDefault();
    updateInternalAgencyState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
      triggerValidation: true,
    });
    const form = event.currentTarget;

    let validationMessages = [];

    if (form.checkValidity() === false || validationMessages.length > 0) {
      event.stopPropagation();

      let filteredArray = validationMessages.filter((item, index) => {
        return validationMessages.indexOf(item) === index;
      });
      updateInternalAgencyState({
        alertBodyArray: filteredArray,
        isSubmitLoading: false,
        isSubmitDisabled: false,
        showErrorAlert: true,
      });
    } else {
      const data: InternalAgencyDto = toJSON(true);
      const { addToast } = props.actions;
      commonApiService
        .saveInternalAgency(data)
        .then(() => {
          updateInternalAgencyState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
            FormErrorMessage: "",
            showErrorAlert: false,
            isSubmitted: true,
          });
          addToast({
            text: "Internal Agency successfully Updated",
            type: "success",
            heading: "Success",
          });
          PageHelper.openPage(Paths.internalAgencyList);
        })
        .catch((error: any) => {
          updateInternalAgencyState({
            FormErrorMessage: error.data.message,
            showErrorAlert: true,
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });

          addToast({
            text: "Error saving request",
            type: "error",
            heading: "Error",
          });
        });
    }
  }

  return (
    <StrictMode>
      <div className={"add-internal-agency grid-row ui-ppms"}>
        <div className="header-row grid-row grid-gap-4">
          <h1>Edit Internal Agency</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <InternalAgencySideNav/>
              </nav>
            </div>
          </div>
        </div>
        <div
          className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs"
          id="edit-internal-agency"
        >
          <div className="grid-row">
            <div className={"desktop:grid-col-12"}>
              <PPMSAlert
                id={"form-verification-error"}
                show={internalAgencyState.showErrorAlert}
                alertBody={
                  internalAgencyState.FormErrorMessage ||
                  " Error submitting request."
                }
                alertClassName={"form-verification-error"}
                alertVariant={"danger"}
                alertKey={"form-verification-error"}
                alertBodyArray={internalAgencyState.alertBodyArray}
              />
              {internalAgencyState.showErrorAlert && <hr />}
            </div>
          </div>
          <Form
            noValidate
            className={"usa-accordion--bordered desktop:grid-col-12"}
            validated={internalAgencyState.isFormValidated}
            onSubmit={handleSubmit}
          >
            <div className={"grid-row grid-gap-4"}>
              <InternalAgencyButtons
                isSubmitDisabled={internalAgencyState.isSubmitDisabled}
                isSubmitLoading={internalAgencyState.isSubmitLoading}
                cancelFunction={handleCancel}
              />
            </div>
            <br/>
            <PPMSAccordion bordered={true} items={items}/>
            <br/>
            <div className={"grid-row grid-gap-4"}>
              <InternalAgencyButtons
                isSubmitDisabled={internalAgencyState.isSubmitDisabled}
                isSubmitLoading={internalAgencyState.isSubmitLoading}
                cancelFunction={handleCancel}
              />
            </div>
          </Form>
        </div>
      </div>
    </StrictMode>
  );
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(EditInternalAgency);
