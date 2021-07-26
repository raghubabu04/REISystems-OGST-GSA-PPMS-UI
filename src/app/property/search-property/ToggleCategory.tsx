import React from "react";
import { PPMSToggleCheckbox } from "../../../ui-kit/components/common/toggle/PPMS-toggle";

interface Props {
  title?: string;
  options: any[];
  onSelect: any;
  type?: string;
}
interface State { }

export class ToggleCategory extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(categories) {
    let selectedCategories = categories.filter((item) => item.isSelected);
    const selectedCategoriesId = selectedCategories.map((item) => {
      return item.id;
    });
    this.props.onSelect(selectedCategoriesId);
  }

  render() {
    return (
      <>
        <div>
          <div className="toggle-items-list">
            <h2>Filters:</h2>
          </div>
          <h3>
            {this.props.title ? this.props.title : "Property Categories"}
          </h3>
          <div className="toggle-items-list">
            <PPMSToggleCheckbox
              id={"id"}
              options={this.props.options}
              isDisabled={false}
              name={"property-categories"}
              className={"inventory"}
              label={""}
              validationMessage={""}
              isSingleSelect={false}
              onChange={this.handleChange}
              showAllOptions={false}
              allOptionsLabel={"All Real Estate"}
            />
          </div>
        </div>
      </>
    );
  }
}
