import React from "react";
import PPMSLabel from "../common/form/PPMS-label";

export interface Props {
  values: { permissions: any };
  onChange?: any;
  showOnlyLabel?: boolean;
}

export interface State {
}

export default class PPMSUserProfilePermissions extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    let permissions = this.props.values.permissions.map(
      (groupPermission: any) => {
        let groupLevelPermissions = groupPermission.permissionList.map((permission) => {
          return (
            <>{permission.isSelected ? permission.permissionName : ""}
              {permission.isSelected ? <br/> : ""}
            </>
          );
        });
        let showPermissionsHeader = (
          <>
            <div className={`grid-col-4`}>
              <PPMSLabel htmlFor={groupPermission.group}>
                <strong>{groupPermission.group}</strong>
              </PPMSLabel>
              {groupLevelPermissions}
            </div>
          </>
        );
        return (
          <>
            {this.props?.showOnlyLabel ?
              (groupPermission.permissionList.find((permission) => {
                return permission.isSelected === true;
              }) !== undefined ?
                showPermissionsHeader : "") : showPermissionsHeader
            }
          </>
        );
      }
    );
    return <div className={"grid-row flex-wrap"}>{permissions}</div>;
  }
}
