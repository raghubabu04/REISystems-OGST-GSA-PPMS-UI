export abstract class ResetPassword {
  oktaUserId: string;
  password: string;
  securityAnswer: string;
}

/**
 * Factory method to construct the model object from the provided interface object/structure
 * @param dto
 */

export class ResetPasswordDTO extends ResetPassword {
  static asResetPassword(dto: ResetPassword): ResetPasswordDTO {
    return Object.assign(new ResetPasswordDTO(), dto);
  }
}
