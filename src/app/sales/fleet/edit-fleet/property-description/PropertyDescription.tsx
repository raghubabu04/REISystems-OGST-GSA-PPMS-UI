import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";

interface PropertyDescriptionProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function PropertyDescription(props: PropertyDescriptionProps) {
  return <></>;
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(PropertyDescription);
