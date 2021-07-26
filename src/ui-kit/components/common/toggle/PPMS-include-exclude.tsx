import React from "react";
import { PPMSFormGroup } from "../form/PPMS-form-group";
import Switch from "react-switch";

export interface includeExcludeProps {
  isDisabled: boolean;
  id: string;
  name: string;
  onChange: any;
  ariaLabel?: string;
  isChecked: boolean;
}
export interface includeExcludeState {}

export class PPMSIncludeExclude extends React.Component<
  includeExcludeProps,
  includeExcludeState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = () => {
    this.props.onChange(!this.props.isChecked);
  };

  render() {
    let include = !this.props.isChecked ? (
      <div className={"include-exclude"}>
        <b>Include</b>
      </div>
    ) : (
      <div className={"include-exclude"}>
        <p>Include</p>
      </div>
    );
    let exclude = this.props.isChecked ? (
      <div className={"include-exclude"}>
        <b>Exclude</b>
      </div>
    ) : (
      <div className={"include-exclude"}>
        <p>Exclude</p>
      </div>
    );
    return (
      <>
        <PPMSFormGroup>
          <div className="grid-col">
            <div className="grid-row grid-gap-1">
              {include}
              <Switch
                onChange={this.handleChange}
                checked={this.props.isChecked}
                className="react-switch"
                disabled={this.props.isDisabled}
                aria-label={this.props.ariaLabel}
                uncheckedIcon={<></>}
                checkedIcon={<></>}
                offColor="#AAAAAA"
                onColor="#AAAAAA"
                offHandleColor="#ffffff"
                onHandleColor="#ffffff"
                height={20}
                width={45}
              />
              {exclude}
            </div>
          </div>
        </PPMSFormGroup>
      </>
    );
  }
}
