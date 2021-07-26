export abstract class UpdateCartRequestContactModel {
  contactId: string;
  cartRequestId: string;
  contactType: string;
}

export class UpdateCartRequestContactDto extends UpdateCartRequestContactModel {
  static asUpdateCartRequestContact(
    dto: UpdateCartRequestContactModel
  ): UpdateCartRequestContactDto {
    return Object.assign(new UpdateCartRequestContactDto(), dto);
  }
}
