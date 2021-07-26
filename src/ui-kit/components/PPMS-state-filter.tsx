import React from "react";
import {
  Dropdown,
  DropdownButton,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { CommonApiService } from "../../api-kit/common/common-api.service";

export interface PPMSStateFilterProps {
  filteredValue: any;
  identifier: string;
  isInvalid: boolean;
  isValid: boolean;
  required: boolean;
  selectName: string;
  showDropdown: boolean;
  stateFilter: string;
  validationMessage: string;
  values: any;
  updateLocationStateFilter: any;
}
export interface PPMSStateFilterState {
  filteredValue: any;
  identifier: string;
  isInvalid: boolean;
  isValid: boolean;
  required: boolean;
  selectName: string;
  showDropdown: boolean;
  stateFilter: string;
  validationMessage: string;
  values: any;
}

export class PPMSStateFilter extends React.Component<
  PPMSStateFilterProps,
  PPMSStateFilterState
> {
  constructor(props) {
    super(props);
    this.state = {
      filteredValue: [],
      identifier: "stateName",
      isInvalid: false,
      isValid: false,
      required: this.props.required,
      selectName: this.props.selectName,
      showDropdown: false,
      stateFilter: this.props.stateFilter,
      validationMessage: "Location State is Required.",
      values: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  commonApiService = new CommonApiService();
  componentDidMount() {
    this.commonApiService
      .getStateList()
      .then((response) => {
        this.setState({
          filteredValue: response.data,
          values: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleChange = (event) => {
    this.setState({
      showDropdown: true,
      stateFilter: event.target.value,
      filteredValue: this.filterData(event),
    });
  };
  handleSelect = (event) => {
    console.log(event);
    this.setState({
      stateFilter: event.target.text,
      showDropdown: false,
    });
    this.props.updateLocationStateFilter(event.target.text);
  };
  handleClick = (event) => {
    this.setState({
      showDropdown: !this.state.showDropdown,
    });
  };
  filterData(event) {
    return this.state.values.filter(
      (item) =>
        item.stateName &&
        item.stateName.toLowerCase().includes(event.target.value.toLowerCase())
    );
  }
  render() {
    const options = this.state.filteredValue.map((data, index) => (
      <Dropdown.Item key={index + "-filter"} onClick={this.handleSelect}>
        {data[this.state.identifier]}
      </Dropdown.Item>
    ));
    return (
      <div>
        <InputGroup>
          <FormControl
            aria-describedby="basic-addon2"
            aria-label="Location State"
            isValid={true}
            onChange={this.handleChange}
            placeholder="Type to filter..."
            value={this.state.stateFilter}
          />
          <DropdownButton
            as={InputGroup.Append}
            className={"state-dropdown"}
            id="input-group-dropdown-2"
            onClick={this.handleClick}
            show={this.state.showDropdown}
            title=""
            variant="outline-secondary"
          >
            {options}
          </DropdownButton>
        </InputGroup>
      </div>
    );
  }
}
