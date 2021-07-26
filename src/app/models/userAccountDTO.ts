export abstract class UserAccountDTO {
  requestorInfoEmail?: string;
  nuoEmailAddress: string;
  approvingOfficialEmail: string;
  permissions: Array<string>;
  leaUser: {
    leaId: string;
    addressId: string;
    doneeOrganizationName: string;
    title: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    city: string;
    stateCode: string;
    zip: string;
    zipExtension: string;
  };
  approvingOfficial: {
    firstName: string;
    lastName: string;
    middleInitial: string;
    phoneNumber: string;
    faxNumber?: string;
    emailAddress: string;
  };
}

export class UserAccount extends UserAccountDTO {
  /**
   * Factory method to construct the model object from the provided interface object/structure
   * @param dto
   */
  static asUserAccount(dto: UserAccountDTO): UserAccount {
    return Object.assign(new UserAccount(), dto);
  }
}

export class EditUserAccount extends UserAccountDTO {
  id?: String;

  static asEditUserAccount(dto: UserAccountDTO): UserAccount {
    return Object.assign(new EditUserAccount(), dto);
  }
}
