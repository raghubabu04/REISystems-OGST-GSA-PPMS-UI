export abstract class User {
  firstName: string;
  lastName: string;
  middleName: string;
  emailAddress: string;
  aac: string;
  agencyBureauCd: string;
  phoneNumber: string;
  phoneExt: string;
  faxNumber?: string;
  requestorInfoEmail?:string;
  zipCode: string;
  locationState: string;
  nuoEmailAddress: string;
  approvingOfficialEmail: string;
  permissions: Array<string>;
  leaInformationDTO: {
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
export class NuoUser extends User {
  /**
   * Factory method to construct the model object from the provided interface object/structure
   * @param dto
   */
  static asNuoUser(dto: User): NuoUser {
    return Object.assign(new NuoUser(), dto);
  }
}

export class NuoEditUser extends User {
  id?: String;

  static asNuoEditUser(dto: User): NuoUser {
    return Object.assign(new NuoEditUser(), dto);
  }
}
