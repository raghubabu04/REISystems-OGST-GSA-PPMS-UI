import { ERDRequestDTO } from "./ERDRequestDTO";

export interface SRDRequestsDTO extends ERDRequestDTO {
  erd?: string;
  isVessel50FeetOrOver?: boolean;
  isSubmittedFromUI: boolean;
}
