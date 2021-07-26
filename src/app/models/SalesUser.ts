export abstract class SalesUser {
  userType: string;
  firstName: string;
  middleName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: bigint;
  phoneExt: string;
  userRoles: Array<string>;
  userZones: Array<any>;
  warrantLimit: string;
}

/**
 * Factory method to construct the model object from the provided interface object/structure
 * @param dto
 */

export class SalesUserDTO extends SalesUser {
  static asSalesUser(dto: SalesUser): SalesUserDTO {
    return Object.assign(new SalesUserDTO(), dto);
  }
}
