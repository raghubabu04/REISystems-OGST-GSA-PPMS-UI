export abstract class DoneeDetails{
    cartId: string;
    leaUserId: string;
    leaShippingAttn: string;
    leaShippingAddress:{
        addressId: string;
        line1: string;
        line2: string;
        line3: string;
        city: string;
        stateCode: string;
        zip: string;
        zip2: string;
        instructions:string;
    }

}

export class DoneeModal extends DoneeDetails {
    static asUpdateDoneeDetails(
      dto: DoneeDetails
    ): DoneeModal {
      return Object.assign(new DoneeModal(), dto);
    }
  }