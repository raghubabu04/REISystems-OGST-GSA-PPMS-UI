import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import PPMSLabel from "./form/PPMS-label";
import { PPMSFormGroup } from "./form/PPMS-form-group";
import PPMSErrorMessage from "./form/PPMS-error-message";

export interface PPMSTextEditorProps {
  value: string;
  onChange?: any;
  label: string;
  labelBold?: boolean;
  className?: string;
  isInvalid: boolean;
  isValid?: boolean;
  isRequired: boolean;
  isDisabled?: boolean;
  infoTipContent?: any;
  icon?: {};
  id: string;
  message?: string;
  validationMessage?: string;
  onBlur?: any;
  onBlurCheck?: boolean;
  inputRef?: any;
}

export interface PPMSTextEditorState {}

export class PPMSTextEditor extends React.Component<
  PPMSTextEditorProps,
  PPMSTextEditorState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleEditorChange = (content, Editor) => {
    this.props.onChange(content);
  };

  onBlurEvent = () => {
    if (this.props.onBlurCheck) {
      this.props.onBlur();
    }
  };

  render() {
    return (
      <PPMSFormGroup error={this.props.isInvalid}>
        <PPMSLabel
          htmlFor={this.props.label}
          hint={this.props.message && `(${this.props.message})`}
          className={`${this.props.labelBold ? "text-bold" : ""}`}
        >
          {this.props.icon} {this.props.label}
        </PPMSLabel>

        <Editor
          init={{
            statusbar: false,
            menubar: false,
            resize: false,
            browser_spellcheck: true,
            link_context_toolbar: true,
            target_list: false,
            plugins: [
              "link",
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table copy paste code help wordcount",
            ],
            toolbar: `undo redo | bold italic underline strikethrough | copy paste pastetext|
            fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify |
             outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | link |
              charmap emoticons | fullscreen  preview save print |
                ltr rtl`,
          }}
          key={`key-${this.props.id}`}
          id={this.props.id}
          onEditorChange={this.handleEditorChange}
          onBlur={this.onBlurEvent}
          value={this.props.value}
          apiKey={"qp9wjtdd036rtxj52g16bxhsm1hq42b725esw3rxze07pm1u"}
          disabled={this.props.isDisabled}
        />

        {this.props.isInvalid && (
          <PPMSErrorMessage>{this.props.validationMessage}</PPMSErrorMessage>
        )}
      </PPMSFormGroup>
    );
  }
}
