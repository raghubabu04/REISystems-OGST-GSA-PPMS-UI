import React, { Component } from "react";
import { connect } from "react-redux";
import { PPMSSpinner } from "../../ui-kit/components/common/PPMS-spinner";
export interface Props {
  loading: boolean;
}
class FullPageLoader extends Component<Props, any> {
  state = {};

  render() {
    const { loading } = this.props;

    if (!loading) return null;

    return (
      <div className="loader-container">
        <div className="loader">
          <PPMSSpinner
            animation={"border"}
            variant={"primary"}
            loadingText={"Loading..."}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ loading: state.loader.loading });

export default connect(mapStateToProps)(FullPageLoader);
