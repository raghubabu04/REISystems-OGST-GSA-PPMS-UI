export abstract class BidderConfirmUser {
  registrationType: string;
  bidderUserName: string;
  securityQuestion: string;
  securityAnswer: string;
  country: string;
  bidderStatus: string;
}

export abstract class BidderUser {
  id: bigint;

  registrationType: string;
  bidderUserName: string;
  securityQuestion: string;
  securityAnswer: string;
  country: string;
  bidderStatus: string;

  firstName: string;
  middleName: string;
  lastName: string;
  emailAddress: string;
  dateOfBirth: string;
  ssn: string;
  companyName: string;
  ein: string;
  isUsCitizen: boolean;

  isPrimaryAddressPoBox: boolean;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  stateCode: string;
  zip: string;
  zipExtension: string;
  secondaryAddressLine1: string;
  secondaryAddressLine2: string;
  secondaryAddressLine3: string;
  secondaryStateCode: string;
  secondaryCity: string;
  secondaryZip: string;
  secondaryZipExtension: string;

  daytimePhone: bigint;
  eveningPhone: bigint;
  daytimePhoneExt: string;
  eveningPhoneExt: string;
  internationalPhone: string;

  consentForExperian: boolean;
  notifyAuctionWin: boolean;
  notifyItemOutbid: boolean;
}

/**
 * Factory method to construct the model object from the provided interface object/structure
 * @param dto
 */

export class BidderConfirmUserDTO extends BidderConfirmUser {
  static asBidderConfirmUser(dto: BidderConfirmUser): BidderConfirmUserDTO {
    return Object.assign(new BidderConfirmUserDTO(), dto);
  }
}

export class BidderUserDTO extends BidderUser {
  static asBidderUser(dto: BidderUser): BidderUserDTO {
    return Object.assign(new BidderUserDTO(), dto);
  }
}
