import moment from "moment";
import React, { StrictMode } from "react";
import { connect } from "react-redux";
import PPMSAccordion from "../accordion/PPMS-accordion";
import { PPMSDatepickerAdvanced } from "../datepicker/PPMS-date-picker-advanced";
import { PPMSForm } from "../form/PPMS-form";
import { PPMSLabel } from "../form/PPMS-label";
import { PPMSInput } from "../input/PPMS-input";
import { PPMSTextArea } from "../input/PPMS-textarea";
import { PPMSTextEditor } from "../PPMS-texteditor";
import { PPMSSelect } from "../select/PPMS-select";
import { PPMSToggleCheckbox, PPMSToggleRadio } from "../toggle/PPMS-toggle";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { PPMSSideNav } from "../PPMS-side-nav";
import { HashLink as Link } from "react-router-hash-link";
import { GoDash } from "react-icons/go";
import { PPMSButton } from "../PPMS-button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DevTool } from "@hookform/devtools";
import { PPMSAddress } from "../../PPMS-address";
import * as Yup from "yup";
import { PPMSFieldset } from "../form/PPMS-fieldset";

export interface FormBuilderProps {
  title: string;
  model: any;
  onSubmit: any;
  onPress: any;
  validationSchema: any;
  updateValidationSchema: any;
}

export interface section {
  label: string;
  id: string;
  navSide: boolean;
  accordion: boolean;
  rows: [];
}

export interface row {
  id: string;
  className: string;
  cols: [];
  label?: string;
}

export function FormBuilder(props: FormBuilderProps) {
  let showNavBar = false;
  let state = {};
  let sideNavLists = [];
  let validationSchema = props.validationSchema;
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   if (props.onSubmit) props.onSubmit(state);
  // }

  const handleOnPress = (event) => {
    if (props.onPress) props.onPress(state);
  };

  const onChange = (event, id) => {
    state[id] = event.currentTarget.value;
  };
  const onToggleChange = (event, id) => {
    const selectedItem = event.filter((item: any) => item.isSelected === true);
    state[id] = selectedItem;
  };

  const onTextEditorChange = (event, id) => {
    state[id] = event;
  };

  const renderForm = () => {
    let model = props.model;

    let formUI = model.sections.map((section: section) => {
      if (section.navSide) {
        showNavBar = true;
        generateSideNav(section);
      }

      return (
        <div className="grid-row" key={section.id}>
          <div className="grid-col-8">
            {section.accordion && renderAccordion(section)}
            {!section.accordion && setUpRow(section.rows)}
          </div>
        </div>
      );
    });

    return formUI;
  };

  function renderAccordion(section: section) {
    return (
      <PPMSAccordion
        items={[
          {
            title: section.label,
            content: setUpRow(section.rows),
            expanded: true,
            id: section.id,
            className: section.label,
          },
        ]}
      />
    );
  }

  function setUpRow(model) {
    let formUI = model.map((row: row) => {
      return (
        <>
          {row["label"] && (
            <PPMSLabel htmlFor={row.id + "-row"}>{row.label}</PPMSLabel>
          )}
          <div key={row.id + "-row"} className={`grid-row ${row.className}`}>
            {setUpCol(row.cols)}
          </div>
        </>
      );
    });

    return formUI;
  }

  function setUpCol(model) {
    let formUI = model.map((col) => {
      return (
        <div key={col.id} className={col.className}>
          {selectFieldType(col)}
        </div>
      );
    });

    return formUI;
  }

  /**
   * The "To" param needs to have #header_ with the PPMSAccordion id
   * @param section
   */
  function generateSideNav(section) {
    sideNavLists.push(
      <Link
        to={"#header_" + section.id}
        scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
        className={section.label}
        key={section.id + "-sideNav"}
      >
        <GoDash /> {section.label}
      </Link>
    );
  }

  function selectFieldType(m) {
    switch (m.formType) {
      case "input":
        return renderInputBox(m);
      case "textarea":
        return renderTextArea(m);
      case "ratio":
        return renderToggleRadio(m);
      case "checkbox":
        return renderToggleCheckbox(m);
      case "selector":
        return renderSelector(m);
      case "date":
        return renderDatePicker(m);
      case "richtext":
        return renderTextEditor(m);
      case "address":
        return renderAddress(m);
    }
  }

  function createYupSchema(param) {
    if (param.validationType && !validationSchema.fields[param.id]) {
      let validator = Yup[param.validationType]();
      param.validations.forEach((validation) => {
        const { params, type } = validation;
        if (!validator[type]) {
          return;
        }
        validator = validator[type](...params);
      });
      validationSchema = validationSchema.shape({
        [param.id]: validator,
      });
      updateValidationSchema();
    }
  }

  function renderInputBox(param) {
    createYupSchema(param);
    return (
      <PPMSInput
        isDisabled={param?.isDisabled}
        label={param?.label}
        id={param.id}
        name={param.id}
        inputType={param.type}
        validationMessage={errors[param.id]?.message}
        isInvalid={!!errors[param.id]}
        isValid={param?.isValid}
        isRequired={param?.isRequired}
        inputRef={register}
        hint={param?.hint}
        maxLength={param?.maxLength}
        minLength={param?.minLength}
        max={param?.max}
        min={param?.min}
        isReadOnly={param?.isReadOnly}
        defaultValue={param?.defaultValue}
        value={param?.value}
        pattern={param?.pattern}
        className={param?.inputClassName}
        outsideLink={param?.outsideLink}
        outsideLinkContext={param?.outsideLinkContext}
        message={param?.message}
        icon={param?.icon}
        placeHolder={param?.placeHolder}
        infoTipContent={param?.infoTipContent}
        infoTipClass={param?.infoTipClass}
        onChange={(event) => onChange(event, param.id)}
      />
    );
  }

  function renderTextArea(param) {
    createYupSchema(param);
    return (
      <PPMSTextArea
        id={param.id}
        name={param.id}
        label={param.label}
        isRequired={param?.isRequired}
        isDisabled={param?.isDisabled}
        isReadOnly={param?.isReadOnly}
        defaultValue={param?.defaultValue}
        value={param?.value}
        placeHolder={param?.placeHolder}
        infoTipContent={param?.infoTipContent}
        infoTipClass={param?.infoTipClass}
        maxLength={param?.maxLength}
        minLength={param?.minLength}
        min={param?.min}
        max={param?.max}
        pattern={param?.maxLength}
        inputType={param.type}
        message={param.message}
        icon={param.icon}
        validationMessage={errors[param.id]?.message}
        isInvalid={!!errors[param.id]}
        isValid={param?.isValid}
        inputRef={register}
        onChange={(event) => onChange(event, param.id)}
      />
    );
  }

  function renderToggleCheckbox(param) {
    createYupSchema(param);
    return (
      <PPMSToggleCheckbox
        id={param.id}
        name={param.id}
        label={param?.label}
        options={param.options}
        isInline={param?.isInline}
        isDisabled={param?.isDisabled}
        className={param?.componentClassName}
        validationMessage={errors[param.id]?.message}
        isInvalid={!!errors[param.id]}
        isRequired={param?.isRequired}
        isSingleSelect={param?.isSingleSelect}
        isLabelNotRequired={param?.isLabelNotRequired}
        infoTipContent={param?.infoTipContent}
        infoTipClass={param?.infoTipClass}
        hint={param?.hint}
        message={param?.message}
        onChange={(event) => onToggleChange(event, param.id)}
        inputRef={register}
      />
    );
  }

  function renderToggleRadio(param) {
    createYupSchema(param);
    return (
      <PPMSToggleRadio
        id={param.id}
        name={param.id}
        label={param?.label}
        options={param.options}
        isInline={param?.isInline}
        isDisabled={param?.isDisabled}
        className={param?.componentClassName}
        validationMessage={errors[param.id]?.message}
        isInvalid={!!errors[param.id]}
        isRequired={param?.isRequired}
        isSingleSelect={param?.isSingleSelect}
        isLabelNotRequired={param?.isLabelNotRequired}
        infoTipContent={param?.infoTipContent}
        infoTipClass={param?.infoTipClass}
        hint={param?.hint}
        message={param?.message}
        onChange={(event) => onToggleChange(event, param.id)}
        inputRef={register}
      />
    );
  }

  function renderSelector(param) {
    createYupSchema(param);
    return (
      <PPMSSelect
        id={param.id}
        selectName={param.id}
        name={param.id}
        identifierKey={param.identifierKey}
        identifierValue={param.identifierValue}
        values={param.options}
        label={param.label}
        isRequired={param?.isRequired}
        placeholderValue={param?.placeholderValue}
        onChange={(event) => onChange(event, param.id)}
        selectClass={param?.selectClass}
        selectedValue={param?.selectedValue}
        infoTipContent={param?.infoTipContent}
        infoTipClass={param?.infoTipClass}
        defaultValue={param?.defaultValue}
        message={param?.message}
        icon={param?.icon}
        validationMessage={errors[param.id]?.message}
        disabled={param?.disabled}
        isInvalid={!!errors[param.id]}
        isValid={param?.isValid}
        inputRef={register}
      />
    );
  }

  function renderDatePicker(param) {
    createYupSchema(param);
    let startDateName = param.id + "-startDate";
    let endDateName = param.id + "-endDate";
    state[startDateName] = state[startDateName]
      ? state[startDateName]
      : param.currentDate;
    state[endDateName] = state[endDateName]
      ? state[endDateName]
      : param.endDate;
    return (
      <>
        <PPMSLabel htmlFor={param.id}>{param.label}</PPMSLabel>
        <PPMSDatepickerAdvanced
          id={param.id}
          name={param.id}
          isValid={param?.isValid}
          isRequired={param?.isRequired}
          minStartDate={param.currentDate}
          maxDate={moment(state[endDateName]).subtract(1, "day").toDate()}
          minEndDate={moment(state[startDateName]).add(1, "day").toDate()}
          message={param?.message}
          endDayPickerdisplay={param?.endDayPickerdisplay}
          startDayPickerdisplay={param?.startDayPickerdisplay}
          isStartDateInvalid={errors[param.id]?.message}
          startDateValidationMessage={errors[param.id]?.message}
          startDate={state[startDateName]}
          isEndDateInvalid={errors[param.id]?.message}
          endDateValidationMessage={errors[param.id]?.message}
          endDate={state[endDateName]}
          updateDate={(event) => handleCampaignStartDate(event, startDateName)}
          updateEndDate={(event) => handleCampaignEndDate(event, endDateName)}
          updateIsInvalidDates={(event) => handleIsInvalidDate(event, param.id)}
          inputRef={register}
        />
      </>
    );
  }

  const handleCampaignStartDate = (event, stateName) => {
    let selectedStartDate = moment(event).toDate();
    state[stateName] = selectedStartDate;
  };

  const handleCampaignEndDate = (event, stateName) => {
    let selectedEndDate = moment(event).toDate();
    state[stateName] = selectedEndDate;
  };

  const handleIsInvalidDate = (event, id) => {
    console.log(event);
  };

  function renderTextEditor(param) {
    createYupSchema(param);
    return (
      <PPMSTextEditor
        id={param.id}
        value={param?.isValid}
        onChange={(event) => onTextEditorChange(event, param.id)}
        label={param.label}
        validationMessage={errors[param.id]?.message}
        isInvalid={!!errors[param.id]}
        isValid={param?.isValid}
        isRequired={param?.isRequired}
        inputRef={register}
        className={param?.componentClassName}
        infoTipContent={param?.infoTipContent}
        icon={param?.icon}
        message={param?.message}
      />
    );
  }

  function renderAddress(param) {
    createYupSchema(param);
    return (
      <PPMSAddress
        id={param.id}
        address1Required={param.address1Required}
        address2Required={param.address2Required}
        address3Required={param.address3Required}
        zipRequired={param.zipRequired}
        showAddressLine3={true}
        inputRef={register}
        address1IsInvalid={!!errors.address?.address1}
        address1ValidationMessage={errors.address?.address1?.message}
        address2IsInvalid={!!errors.address?.address2}
        address2ValidationMessage={errors.address?.address2?.message}
        address3IsInvalid={!!errors.address?.address3}
        address3ValidationMessage={errors.address?.address3?.message}
        zipIsInvalid={!!errors.address?.zip}
        zipValidationMessage={errors.address?.zip?.message}
        showZipExtension={true}
        zip2IsInvalid={!!errors.address?.zip?.extension}
        validationExtensionMessage={errors.address?.zip?.extension?.message}
        className={param?.componentClassName}
        updateState={() => {}}
      />
    );
  }

  function renderButton(button) {
    let formUI = button.buttons.map((button) => {
      return (
        <div className={button.className}>
          <PPMSButton
            variant={button.variant}
            type={button.type}
            value={""}
            label={button.label}
            onPress={handleOnPress}
            id={button.id}
          />
        </div>
      );
    });
    return <div className={button.className}>{formUI}</div>;
  }

  function renderSideNav() {
    return (
      <div className="grid-col-3">
        <div className={`sticky-wrapper`}>
          <div className={"sticky-inner"}>
            <nav aria-label="Secondary navigation">
              <h3>Form Sections</h3>
              <PPMSSideNav items={sideNavLists} />
            </nav>
          </div>
        </div>
      </div>
    );
  }
  // functions to build form returned by useForm() hook
  const { register, handleSubmit, control, reset, errors } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  function updateValidationSchema() {
    props.updateValidationSchema(validationSchema);
  }

  function onSubmit(data) {
    console.log(validationSchema);
    props.onSubmit(data);
  }
  return (
    <>
      <StrictMode>
        <div className="grid-row mb-3">
          <h1>{props.model.title}</h1>
        </div>
        <hr />
        <div className="grid-row grid-gap">
          {renderSideNav()}
          <div className="grid-col-9">
            <PPMSForm
              noValidate
              large={false}
              search={true}
              onSubmit={handleSubmit(onSubmit)}
            >
              <PPMSFieldset>
                {renderForm()}
                {renderButton(props.model.button)}
              </PPMSFieldset>
            </PPMSForm>
          </div>
        </div>
        <DevTool control={control} />
      </StrictMode>
    </>
  );
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(FormBuilder);
