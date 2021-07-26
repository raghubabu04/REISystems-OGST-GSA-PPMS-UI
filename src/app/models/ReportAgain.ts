export abstract class ReportAgain {
    oldIcn: string;
    newIcn: string;
    copyAll: boolean;
  }
  /**
   * Factory method to construct the model object from the provided interface object/structure
   * @param dto
   */
  export class ReportAgainDTO extends ReportAgain {
    static asReportAgainDTO(dto: ReportAgain): ReportAgain {
      return Object.assign(new ReportAgainDTO(), dto);
    }
  }
  