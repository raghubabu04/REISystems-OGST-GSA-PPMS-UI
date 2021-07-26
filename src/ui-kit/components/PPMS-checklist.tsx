import React from "react";
import {PPMSToggleCheckbox} from "./common/toggle/PPMS-toggle";
import PPMSLabel from "./common/form/PPMS-label";

export interface Props {
  values: { permissions: any };
  onChange?: any;
}
export interface State {}

export default class PPMSChecklist extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let permissions = this.props.values.permissions.map(
      (groupPermission: any) => {
        let permissions = groupPermission.permissionList.map((permission) => {
          const options = [
            {
              id: permission.permissionCode,
              value: `${permission.permissionName} (${permission.permissionCode})`,
              isSelected: permission.isSelected ? permission.isSelected : false,
            },
          ];
          return (
            <>
              <PPMSToggleCheckbox
                className={"text-muted"}
                name={groupPermission.group}
                isDisabled={
                  permission.isDisabled ? permission.isDisabled : false
                }
                id={"permissions-checkbox"}
                options={options}
                validationMessage={`Please select from ${groupPermission.group} list.`}
                onChange={this.props.onChange}
                key={permission.permissionCode}
              />
            </>
          );
        });
        return (
          <>
            <div className={`grid-col-4`}>
              <PPMSLabel htmlFor={groupPermission.group}>
                <strong>{groupPermission.group}</strong>
              </PPMSLabel>
              {permissions}
            </div>
          </>
        );
      }
    );
    return <div className={"grid-row flex-wrap"}>{permissions}</div>;
  }
}
