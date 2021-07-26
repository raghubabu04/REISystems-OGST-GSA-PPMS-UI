import React, {
  StrictMode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {} from "react-router";
import { PPMSForm } from "../../../ui-kit/components/common/form/PPMS-form";
import { PPMSAccordion } from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import { PropertyTypeClass } from "./property-type/PropertyTypeClass";
import { ReportingAgencyClass } from "./reporting-agency/ReportingAgencyClass";
import { GainingAgencyClass } from "./gaining-agency/GainingAgencyClass";
import { ItemInformationClass } from "./item-information/ItemInformationClass";
import { isFormSubmitted } from "../../../service/validation.service";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";

import NonReportedTransferSideNav from "./NonReportedTransferSideNav";
import { Paths } from "../../Router";
import { connect } from "react-redux";
import NonReportedTransferButtons from "./NonReportedTransferButtons";
import { NonNonReportedTransferContext } from "./NonReportedTransferContext";
import { NonPropertyTransferDto } from "./constants/non-reported-transfer";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { ItemInformationStateDefault } from "./item-information/ItemInformationState";
import {
  conditionOptions,
  personalPropertyCenterOptions,
} from "./constants/Constants";
import { Upload } from "./uploads/Upload";

export interface AddNonReportedTransferProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
  alertSuccess: any;
  alertError: any;
}

export function AddNonReportedTransfer(props: AddNonReportedTransferProps) {
  const [isSticky, setSticky] = useState(false);
  const ref = useRef(null);
  let propertyService = new PropertyApiService();
  const handleScroll = () => {
    if (ref.current) {
      setSticky(ref.current.getBoundingClientRect().top <= 0);
    }
  };

  const {
   updateNonReportedTransferState,
    nonReportedTransferState,

    propertyTypeState,

    reportingAgencyState,

    gainingAgencyState,

    itemInformationState,
    updateItemInformationState,
  } = useContext(NonNonReportedTransferContext);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    isFormSubmitted.next(false);
    return () => {
      window.removeEventListener("scroll", () => handleScroll);
    };
  }, []);

  function toJSON(): NonPropertyTransferDto {
    let nonPropertyTransfer: NonPropertyTransferDto = {
      property: {
        itemControlNumber: "",
        aacId: reportingAgencyState.aacCode,
        agencyBureau: reportingAgencyState.agencyBureauCode,
        reportingAgencyAddress: {
          city: reportingAgencyState.city,
          stateCode: reportingAgencyState.state,
        },
        propertyPOC: {
          email: reportingAgencyState.email,
        },
        itemName: itemInformationState.itemName,
        quantity: itemInformationState.quantity,
        unitOfIssue: itemInformationState.unitOfIssue,
        originalAcquisitionCost: itemInformationState.unitCost
          .toString()
          .replace("$", "")
          .replace(/,/g, ""),
        totalAcquisitionCost: itemInformationState.totalAcqCost
          ?.toString()
          .replace("$", "")
          .replace(/,/g, ""),
        fscCode: itemInformationState.fcsSelectedValue,
        conditionCode: itemInformationState.condition,
        salesCenter: itemInformationState.personalPropertyCenter,
        actionCode: propertyTypeState.propertyActionCode,
        sourceCode: itemInformationState.sourceCode,
        propertyCreationSource: "NON_REPORT_PROP",
      },
      gainingAgency: {
        requestedAACId: gainingAgencyState.aacCode,
        transferControlNumber: "",
        agencyBureauCd: reportingAgencyState.agencyBureauCode,
        requestedAgencyBureauCd: gainingAgencyState.agencyBureauCode,
        requestedBy: {
          email: gainingAgencyState.email,
        },
        shippingAddress: {
          city: gainingAgencyState.city,
          stateCode: gainingAgencyState.state,
        },
        region: gainingAgencyState.selectedRegion,
        reason: gainingAgencyState.gainingAgencyReason,
        requestedItemList: [
          {
            requestedQuantity: itemInformationState.quantity,
            priorityCode: gainingAgencyState.selectedPriority,
          },
        ],
      },
      propertyType: propertyTypeState.propertyType,
    };

    return nonPropertyTransfer;
  }

  function handleSubmit(event) {
    isFormSubmitted.next(true);
    event.preventDefault();
    updateNonReportedTransferState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
    });
    const form = event.currentTarget;
    if (form.checkValidity()) {
      submitProperty(false);
    } else {
      event.stopPropagation();
      updateNonReportedTransferState({
        isSubmitLoading: false,
        isSubmitDisabled: false,
      });
    }
  }

  function submitProperty(submitAndReport: boolean) {
    const { addToast } = props.actions;
    let data: NonPropertyTransferDto = toJSON();
    propertyService
      .submitNonReportedProperty(data)
      .then((response: any) => {
        let alertMessage = `Non-Reported Property Submitted.
        TCN: ${response?.data?.tcn} Report has been created.
        ICN: ${response?.data?.icn} Report has been created.`;
        if (!submitAndReport) {
          addToast({
            text: alertMessage,
            type: "success",
            heading: "Success",
          });
        } else {
          addToast({
            text:
              alertMessage +
              `<br/>Form has been repopulated with Property Type, Property Action Code, Reporting Agency and Gaining Agency from previous report.`,
            type: "success",  
            heading: "Success",
          });
        }

        if (!submitAndReport) {
          props.history.push({
            pathname: `${Paths.completedTransfer}`,
          });
        } else {
          conditionOptions.forEach((o) => {
            o.isSelected = false;
          });
          personalPropertyCenterOptions.forEach((o) => {
            if (o.id === "1") {
              o.isSelected = true;
            } else {
              o.isSelected = false;
            }
          });

          updateItemInformationState({
            ...ItemInformationStateDefault,
            conditionOptions: conditionOptions,
            unitOfIssueOptions: itemInformationState.unitOfIssueOptions,
            personalPropertyCenterOptions: personalPropertyCenterOptions,
            fscOptions: itemInformationState.fscOptions,
            fcsSelectedValues: [],
          });
          updateNonReportedTransferState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
        }
      })
      .catch(() => {
        addToast({
          text: "unable to proceed with the request",
          type: "error",
          heading: "Failure",
        });
      });
  }

  function submitReportAgain(event) {
    isFormSubmitted.next(true);
    event.preventDefault();
    updateNonReportedTransferState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
    });
    let form = event.target.form;
    if (form.checkValidity()) {
      submitProperty(true);
    } else {
      event.stopPropagation();
      updateNonReportedTransferState({
        isSubmitLoading: false,
        isSubmitDisabled: false,
      });
    }
  }

  function cancelButtonClick() {
    isFormSubmitted.next(false);
    props.history.push({
      pathname: `${Paths.completedTransfer}`,
    });
  }

  return (
    <StrictMode>
      <div className={"add-non-reported-transfer grid-row ui-ppms"}>
        <div className="grid-row header-row mb-3">
          <h1>Create Non-Reported Transfer </h1>
        </div>

        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div
            className={`sticky-wrapper${isSticky ? " sticky" : ""}`}
            ref={ref}
          >
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Form Sections</h3>
                <NonReportedTransferSideNav />
              </nav>
            </div>
          </div>
        </div>
        <div className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <PPMSForm
            noValidate
            large={false}
            search={true}
            onSubmit={handleSubmit}
            className={"usa-accordion--bordered desktop:grid-col-12"}
          >
            <div className={"grid-row grid-gap-2"}>
              <NonReportedTransferButtons
                submitReport={submitReportAgain}
                isSubmitDisabled={nonReportedTransferState.isSubmitDisabled}
                isSubmitLoading={nonReportedTransferState.isSubmitLoading}
                cancelFunction={cancelButtonClick}
              />
            </div>
            <br />

            <PPMSAccordion
              items={[
                {
                  title: "Property Type",
                  content: <PropertyTypeClass />,
                  expanded: true,
                  id: "property-type-id",
                  className: "property-type",
                },
              ]}
            />

            <br />
            <PPMSAccordion
              items={[
                {
                  title: "Reporting Agency",
                  content: <ReportingAgencyClass />,
                  expanded: true,
                  id: "reporting-agency-id",
                  className: "reporting-agency",
                },
              ]}
            />

            <br />
            <PPMSAccordion
              items={[
                {
                  title: "Gaining Agency",
                  content: <GainingAgencyClass />,
                  expanded: true,
                  id: "gaining-agency-id",
                  className: "gaining-agency",
                },
              ]}
            />

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
            <PPMSAccordion
              items={[
                {
                  title: "Upload Documents",
                  content: (
                    <Upload
                      icn={""}
                      fileInfectedStatus={(value) =>
                        updateNonReportedTransferState({
                          fileInfectedStatus: value,
                        })
                      }
                    />
                  ),
                  expanded: true,
                  id: "",
                },
              ]}
            />
            <br />
            <div className={"grid-row grid-gap-2"}>
              <NonReportedTransferButtons
                submitReport={submitReportAgain}
                isSubmitDisabled={nonReportedTransferState.isSubmitDisabled}
                isSubmitLoading={nonReportedTransferState.isSubmitLoading}
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

export default connect(null, mapDispatchToProps)(AddNonReportedTransfer);
