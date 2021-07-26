import React, { useEffect } from "react";
import { commonActions } from "../../_redux/_actions/common.actions";
import { connect } from "react-redux";
import { PPMSSelect } from "./common/select/PPMS-select";

interface PPMSRegionProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {};
  regionCodes?: any[];
  selectedRegion: string;
  getRegionCodes?: () => {};
}

export function PPMSRegion(props: PPMSRegionProps) {
  useEffect(() => {
    props.getRegionCodes();
  }, []);

  return (
    <PPMSSelect
      placeholderValue={"Not Selected"}
      name={"region"}
      label={""}
      values={props.regionCodes}
      isRequired={false}
      onChange={props.onChange}
      identifierValue={"regionDescription"}
      identifierKey={"regionCode"}
      isInvalid={false}
      selectedValue={props.selectedRegion}
      isValid={false}
      validationMessage={""}
      disabled={false}
      ariaLabel={"Region Selection"}
    />
  );
}

function mapStateToProps(state) {
  return { regionCodes: state.common.regionCodes };
}

function mapDispatchToProps(dispatch) {
  return {
    getRegionCodes: () => {
      dispatch(commonActions.getRegionCodes());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PPMSRegion);
