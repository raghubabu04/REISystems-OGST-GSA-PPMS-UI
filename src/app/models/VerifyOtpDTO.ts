export abstract class VerifyOtp {
  oktaUserId: string;
  factorId: string;
  otp: string;
}

/**
 * Factory method to construct the model object from the provided interface object/structure
 * @param dto
 */

export class VerifyOtpDTO extends VerifyOtp {
  static asVerifyOtp(dto: VerifyOtp): VerifyOtpDTO {
    return Object.assign(new VerifyOtpDTO(), dto);
  }
}
