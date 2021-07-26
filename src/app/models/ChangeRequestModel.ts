export interface ChangeRequestDTO {
  approvedDate?: Date;
  changeRequestId?: number;
  changeRequestStatus?: ChangeRequestStatus;
  changeRequestType?: ChangeRequestType;
  comment?: string;
  createdAt?: Date;
  createdBy?: number;
  newValue?: Date;
  prevValue?: Date;
  reasonForChange?: string;
  updatedAt?: Date;
  updatedBy?: number;
}

export enum ChangeRequestType {
  SURPLUS_RELEASE_DATE = "SURPLUS_RELEASE_DATE",
  EXCESS_RELEASE_DATE = "EXCESS_RELEASE_DATE",
}

export enum ChangeRequestStatus {
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  PENDING = "PENDING",
}
