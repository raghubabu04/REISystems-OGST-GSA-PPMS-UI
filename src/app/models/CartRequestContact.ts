export abstract class CartRequestContactModel {
  contactId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  fax: string;
  phoneExtension: string;
}

export class CartRequestContactDto extends CartRequestContactModel {
  static asCartRequestContact(
    dto: CartRequestContactModel
  ): CartRequestContactDto {
    return Object.assign(new CartRequestContactDto(), dto);
  }
}
