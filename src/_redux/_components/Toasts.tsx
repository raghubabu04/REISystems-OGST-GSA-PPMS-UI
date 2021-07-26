import PropTypes from "prop-types";
import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Toast from "./Toast";
import { removeToast } from "../_actions/toast.actions";

const Toasts = ({ actions, toasts }) => {
  const { removeToast } = actions;
  return toasts.length > 0 ? (
    <ul className="ppms-toasts">
      {toasts.map((toast, index) => {
        const { id } = toast;
        return (
          <Toast
            {...toast}
            key={id}
            id={`toast-${index}`}
            onDismissClick={() => removeToast(id)}
          />
        );
      })}
    </ul>
  ) : (
    <></>
  );
};

Toasts.propTypes = {
  actions: PropTypes.shape({
    removeToast: PropTypes.func.isRequired,
  }).isRequired,
  toasts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ removeToast }, dispatch),
});

const mapStateToProps = (state) => ({
  toasts: state.toasts,
});

export default connect(mapStateToProps, mapDispatchToProps)(Toasts);
