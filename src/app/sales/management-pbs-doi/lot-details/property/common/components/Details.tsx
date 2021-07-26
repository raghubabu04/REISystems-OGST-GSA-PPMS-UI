import * as React from "react";
import { PPMSInput } from "../../../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSTextArea } from "../../../../../../../ui-kit/components/common/input/PPMS-textarea";
import { PPMSSelect } from "../../../../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSAddress } from "../../../../../../../ui-kit/components/PPMS-address";
import { PPMSButton } from "../../../../../../../ui-kit/components/common/PPMS-button";
import { FaMapMarkerAlt } from "react-icons/fa";
import PPMSURLLinks from "../../../../../../../ui-kit/components/PPMS-url-links";
import { formatLotNumber } from "../constants/Utils";
import { doiCategory } from "../constants/Constants";
import { PPMSTextEditor } from "../../../../../../../ui-kit/components/common/PPMS-texteditor";
interface DetailsProps {
  lotNumber: number;
  propertyDetail: any;
  validateZipCityState: any;
  updatePropertyDetail: (type: string, value: string | {}) => any;
  validatePropertyDetail: (type: string, value: string | {}) => any;
  generateCoordinates: (city: string, state: string) => any;
  categoryOptions: any[];
  fieldDisabled?: boolean;
  saleNumber?: string;
  sellingAgency?: string;
  doiFSCCodes?: any[];
}
export const Details = (props: DetailsProps) => {
  const {
    lotNumber,
    propertyDetail,
    updatePropertyDetail,
    validatePropertyDetail,
    generateCoordinates,
    categoryOptions,
    fieldDisabled,
    validateZipCityState,
    saleNumber,
    sellingAgency,
    doiFSCCodes,
  } = props;
  const checkForCoordinates = () => {
    if (
      propertyDetail?.data?.address?.city &&
      propertyDetail?.data?.address?.state
    ) {
      generateCoordinates(
        propertyDetail?.data?.address?.city,
        propertyDetail?.data?.address?.state
      );
    }
  };
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"lot-number"}
            inputType={"text"}
            label={"Lot Number"}
            labelBold={true}
            isDisabled={true}
            isRequired={true}
            value={lotNumber ? formatLotNumber(lotNumber?.toString(), 3) : null}
          />
        </div>
      </div>

      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"case-number"}
            inputType={"text"}
            label={"Case Number"}
            labelBold={true}
            isDisabled={fieldDisabled}
            isRequired={false}
            maxLength={14}
            isInvalid={propertyDetail?.validation?.caseNumber?.isInvalid}
            validationMessage={
              propertyDetail?.validation?.caseNumber?.validationError
            }
            onChange={(event) =>
              updatePropertyDetail("case-number", event.target.value)
            }
            onBlur={(event) =>
              validatePropertyDetail("case-number", event.target.value)
            }
            value={propertyDetail?.data?.caseNumber}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"property-name"}
            inputType={"text"}
            label={"Property Name"}
            labelBold={true}
            isDisabled={fieldDisabled}
            isRequired={true}
            maxLength={69}
            isInvalid={propertyDetail?.validation?.propertyName?.isInvalid}
            validationMessage={
              propertyDetail?.validation?.propertyName?.validationError
            }
            onChange={(event) =>
              updatePropertyDetail("property-name", event.target.value)
            }
            onBlur={(event) =>
              validatePropertyDetail("property-name", event.target.value)
            }
            value={propertyDetail?.data?.propertyName}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-8"}>
          <PPMSTextEditor
            id={"property-description"}
            isRequired={true}
            label={"Description"}
            labelBold={true}
            isDisabled={propertyDetail?.validation?.description?.isDisabled}
            isInvalid={propertyDetail?.validation?.description?.isInvalid}
            value={propertyDetail?.data?.description}
            validationMessage={
              propertyDetail?.validation?.description?.validationError
            }
            onChange={(value) =>
              updatePropertyDetail("property-description", value)
            }
            onBlur={(value) =>
              validatePropertyDetail("property-description", value)
            }
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSSelect
            id={"property-category"}
            label={"Category"}
            labelBold={true}
            values={sellingAgency === "DOI" ? doiCategory : categoryOptions}
            disabled={fieldDisabled}
            identifierKey={"auctionCategoryCode"}
            identifierValue={"description"}
            placeholderValue={"Select One"}
            selectedValue={propertyDetail?.data?.category.auctionCategoryCode}
            isRequired={true}
            isInvalid={propertyDetail?.validation?.category?.isInvalid}
            validationMessage={
              propertyDetail?.validation?.category?.validationError
            }
            onChange={(event) => {
              let category = null;
              if (sellingAgency === "DOI") {
                category =
                  event.target.selectedIndex > 0
                    ? doiCategory[event.target.selectedIndex - 1]
                    : {};
              } else {
                category =
                  event.target.selectedIndex > 0
                    ? categoryOptions[event.target.selectedIndex - 1]
                    : {};
                updatePropertyDetail("fsc", category);
              }
              updatePropertyDetail("property-category", category);
              validatePropertyDetail("property-category", category);
            }}
          />
        </div>
        <div className={"grid-col-4"}>
          {sellingAgency === "PBS" ? (
            <PPMSInput
              id={"fsc-code"}
              inputType={"text"}
              label={"FSC Code"}
              labelBold={true}
              isDisabled={true}
              isRequired={true}
              value={propertyDetail?.data?.fsc}
            />
          ) : (
            <PPMSSelect
              id={"fsc-category"}
              label={"FSC Code"}
              labelBold={true}
              values={doiFSCCodes}
              disabled={propertyDetail?.validation?.fsc?.isDisabled}
              identifierKey={"code"}
              identifierValue={"longName"}
              placeholderValue={"Select One"}
              selectedValue={propertyDetail?.data?.fscDoi?.code}
              isRequired={true}
              isInvalid={propertyDetail?.validation?.fsc?.isInvalid}
              validationMessage={
                propertyDetail?.validation?.fsc?.validationError
              }
              onChange={(event) => {
                let fsc =
                  event.target.selectedIndex > 0
                    ? doiFSCCodes[event.target.selectedIndex - 1]
                    : {};
                updatePropertyDetail("fscDoi", fsc);
              }}
            />
          )}
        </div>
      </div>
      <div className={"grid-row grid-gap-2"}>
        <div className={"grid-col-8"}>
          <PPMSAddress
            labelBold={true}
            showZipExtension={true}
            showAddressLine3={true}
            address1={propertyDetail?.data?.address?.addressLine1}
            address1ValidationMessage={
              propertyDetail?.validation?.address?.addressLine1?.validationError
            }
            address1Required={true}
            address1IsInvalid={
              propertyDetail?.validation?.address?.addressLine1?.isInvalid
            }
            onChangeAddress1={(value) =>
              updatePropertyDetail("address-1", value)
            }
            updateAddress1={(value) =>
              validatePropertyDetail("address-1", value)
            }
            address2={propertyDetail?.data?.address?.addressLine2}
            address2ValidationMessage={
              propertyDetail?.validation?.address?.addressLine2?.validationError
            }
            address2Required={false}
            address2IsInvalid={
              propertyDetail?.validation?.address?.addressLine2?.isInvalid
            }
            updateAddress2={(value) => updatePropertyDetail("address-2", value)}
            onBlurAddress2={(value) =>
              validatePropertyDetail("address-2", value)
            }
            address3={propertyDetail?.data?.address?.addressLine3}
            address3ValidationMessage={
              propertyDetail?.validation?.address?.addressLine3?.validationError
            }
            address3Required={false}
            address3IsInvalid={
              propertyDetail?.validation?.address?.addressLine3?.isInvalid
            }
            updateAddress3={(value) => updatePropertyDetail("address-3", value)}
            onBlurAddress3={(value) =>
              validatePropertyDetail("address-3", value)
            }
            city={propertyDetail?.data?.address?.city}
            cityIsInvalid={propertyDetail?.validation?.address?.city?.isInvalid}
            cityRequired={true}
            cityValidationMessage={
              propertyDetail?.validation?.address?.city?.validationError
            }
            onChangeCity={(value) => updatePropertyDetail("city", value)}
            updateCity={(value) => validatePropertyDetail("city", value)}
            state={propertyDetail?.data?.address?.state}
            stateRequired={true}
            stateIsInvalid={
              propertyDetail?.validation?.address?.state?.isInvalid
            }
            stateValidationMessage={
              propertyDetail?.validation?.address?.state?.validationError
            }
            updateState={(value) => {
              updatePropertyDetail("state", value);
              validatePropertyDetail("state", value);
            }}
            zip={propertyDetail?.data?.address?.zip}
            zipRequired={true}
            zipIsInvalid={propertyDetail?.validation?.address?.zip?.isInvalid}
            zipValidationMessage={
              propertyDetail?.validation?.address?.zip?.validationError
            }
            onChangeZip={(value) => updatePropertyDetail("zip", value)}
            updateZip={(
              value,
              errorMessageValid,
              errorMessageInvalid,
              errorMessage,
              zipExtn
            ) =>
              validateZipCityState(
                value,
                errorMessageValid,
                errorMessageInvalid,
                errorMessage,
                zipExtn
              )
            }
            zip2={propertyDetail?.data?.address?.zip2}
            zip2IsInvalid={propertyDetail?.validation?.address?.zip2?.isInvalid}
            validationExtensionMessage={
              propertyDetail?.validation?.address?.zip2?.validationError
            }
            onChangeZipExtension={(value) =>
              updatePropertyDetail("zip2", value)
            }
            updateZipExtension={(value) => updatePropertyDetail("zip2", value)}
            addressDisabaled={fieldDisabled}
            disableZipValidation={fieldDisabled}
            disabledZipExtension={fieldDisabled}
            stateDisabled={fieldDisabled}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-3"}>
          <PPMSInput
            id={"latitude"}
            inputType={"text"}
            label={"Latitude"}
            labelBold={true}
            isDisabled={true}
            isRequired={true}
            value={propertyDetail?.data?.latitude}
          />
        </div>
        <div className={"grid-col-3"}>
          <PPMSInput
            id={"longitude"}
            inputType={"text"}
            label={"Longitude"}
            labelBold={true}
            isDisabled={true}
            isRequired={true}
            value={propertyDetail?.data?.longitude}
          />
        </div>
        <div className={"grid-col-4 flex-align-self-end"}>
          <PPMSButton
            id={"generate-coordinates"}
            label={" Generate Coordinates"}
            onPress={checkForCoordinates}
            type={"button"}
            isLoading={false}
            isDisabled={
              fieldDisabled
                ? fieldDisabled
                : !propertyDetail?.data?.address?.city ||
                  !propertyDetail?.data?.address?.state
            }
            icon={<FaMapMarkerAlt />}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"ifb-number"}
            inputType={"text"}
            label={"IFB #"}
            labelBold={true}
            isDisabled={fieldDisabled}
            isRequired={false}
            maxLength={14}
            isInvalid={propertyDetail?.validation?.ifb?.isInvalid}
            validationMessage={propertyDetail?.validation?.ifb?.validationError}
            onChange={(event) =>
              updatePropertyDetail("ifb-number", event.target.value)
            }
            onBlur={(event) =>
              validatePropertyDetail("ifb-number", event.target.value)
            }
            value={propertyDetail?.data?.ifb}
          />
        </div>
      </div>
      <div className={"usa-summary-box"}>
        <div className={"usa-summary-box__body"}>
          <h2 className={"usa-summary-box__heading lot-review-h2"}>
            Property Videos/Links
          </h2>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <PPMSURLLinks
                labelBold={true}
                addLabel={" Add New URL"}
                minLinks={3}
                links={propertyDetail?.data?.urls}
                updateLinks={(values) => {
                  updatePropertyDetail("urls", values);
                }}
                disable={fieldDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
