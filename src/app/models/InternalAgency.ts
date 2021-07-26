export abstract class InternalAgency {
  internalAgencyCode: string;
  internalAbbreviatedAgency:string;
  internalAgencyName: string;
  internalAgencyPOC: {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phone: number;
    fax: string;
    phoneExtension: number;
  };
  internalScreeningDays:string;
  localScreeningDays:string;
  internalBeginDate:Date;
  agencyToggle:boolean;
  remarks:string;

}
/**
 * Factory method to construct the model object from the provided interface object/structure
 * @param dto
 */
export class InternalAgencyDto extends InternalAgency {
  static asInternalAgencyDto(dto: InternalAgency): InternalAgency {
    return Object.assign(new InternalAgencyDto(), dto);
  }
}
