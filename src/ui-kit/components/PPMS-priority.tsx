import React, { useEffect } from "react";
import { commonActions } from "../../_redux/_actions/common.actions";
import { connect } from "react-redux";
import { PPMSSelect } from "./common/select/PPMS-select";

interface PPMSPriorityProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {};
  selectedPriority: string;
  priorityCodes?: any[];
  getPriorityCodes?: () => {};
}

export function PPMSPriority(props: PPMSPriorityProps) {
  useEffect(() => {
    props.getPriorityCodes();
  }, []);
  return (
    <PPMSSelect
      id={"priority"}
      placeholderValue={"Not Selected"}
      name={"priority"}
      label={""}
      values={[
        { disasterCode: "All", disasterName: "All Priority Requests" },
        ...props.priorityCodes,
      ]}
      isRequired={false}
      selectedValue={props.selectedPriority}
      onChange={props.onChange}
      identifierValue={"disasterName"}
      identifierKey={"disasterCode"}
      isInvalid={false}
      isValid={false}
      validationMessage={""}
      disabled={false}
      ariaLabel={"Priority"}
    />
  );
}

function mapStateToProps(state) {
  return { priorityCodes: state.common.priorityCodes };
}

function mapDispatchToProps(dispatch) {
  return {
    getPriorityCodes: () => {
      dispatch(commonActions.getPriorityCodes());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PPMSPriority);
