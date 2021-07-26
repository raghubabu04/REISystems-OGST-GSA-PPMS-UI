import PropTypes from "prop-types";
import React, { Component } from "react";
import PPMSAlert from "../../ui-kit/components/common/alert/PPMS-alert";
import { PPMSButton } from "../../ui-kit/components/common/PPMS-button";
import { ImCancelCircle } from "react-icons/im";
export interface Props {
  heading: string;
  text: string;
  onDismissClick: any;
  id: any;
  type: "info" | "warning" | "error" | "success";
}
class Toast extends Component<Props, any> {
  static propTypes: {
    onDismissClick: PropTypes.Validator<(...args: any[]) => any>;
    heading: PropTypes.Validator<string>;
    text: PropTypes.Validator<string>;
    id: PropTypes.Validator<string>;
    type: PropTypes.Validator<string>;
  };
  render() {
    return (
      <li className="ppms-toast">
        <PPMSAlert
          type={this.props.type}
          heading={this.props.heading}
          dismiss={
            <PPMSButton
              type="button"
              variant={"link"}
              id={this.props.id}
              icon={<ImCancelCircle />}
              label={""}
              onPress={this.props.onDismissClick}
            />
          }
          slim
          noIcon
        >
          <span dangerouslySetInnerHTML={{__html: this.props.text}}></span>
        </PPMSAlert>
      </li>
    );
  }

  shouldComponentUpdate() {
    return false;
  }
}

Toast.propTypes = {
  onDismissClick: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Toast;
