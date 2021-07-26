import { Dispatch } from "react";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { CommonApiService } from "../../../../../api-kit/common/common-api.service";

export enum stateStatus {
  info = "info",
  primary = "primary",
  secondary = "secondary",
  success = "success",
  danger = "danger",
  warning = "warning",
  dark = "dark",
  light = "light",
}

export interface iFileDTO {
  id: number;
  itemType?: string;
  name: string;
  description?: string;
  size: number;
  uri?: string;
  attachmentOrder: number;
  virusScanStatus: string;
  deleted?: boolean;
  uploadDate?: Date;
  deleteDate?: Date;
}

export interface iLocalFileDTO {
  id: number;
  itemType?: string;
  name?: string;
  description?: string;
  size?: number;
  uri?: string;
  attachmentOrder?: number;
  virusScanStatus?: string;
  deleted?: boolean;
  failed?: boolean;
  databaseId?: number;
  presignedURI?: string;
  type?: string;
  marketingCampaignId?: string;
  campaignName?: string;
  invalid?: boolean;
  valid?: boolean;
  renamed?: boolean;
  localOrder?: number;
}

export interface SalesUploadProps {
  campProvider?: { (): Promise<string> };
  campaignId?: string;
  fileInfectedStatus?: any;
  disabled: boolean;
  onFilesUpdated: { (files: iFileDTO[]): void };
  isButtonDisabled?: any;
  isButtonEnabled?: any;
}

export enum stateFlags {
  fullFile = "fullFile",
  newFiles = "newFiles",
}

export interface SalesUploadState {
  error: string[];
  campaignId: string | null;
  accordionExpanded: boolean;
  accordingDisplay: string;
  files: iLocalFileDTO[];
  pending: any[];
  fileListComplete: boolean;
  editItems: Map<any, any>;
  loadingRows: any[];
  alertStatus: stateStatus;
  src: any;
  checkedItems: Map<any, any>;
  onFilesUpdated: { (files: iFileDTO[]): void };
}

export interface useFileHandlerProps {
  props: SalesUploadProps;
  sAPI: SalesApiService;
  cAPI: CommonApiService;
  dispatcher: { (state: SalesUploadState, payload: any): SalesUploadState };
  getDefaultState: { (SalesUploadProps): SalesUploadState };
}

export interface salesUploadDipspatcher {
  (payload): SalesUploadState;
}

export interface salesStateUpdates {
  campaignId?: string;
  files?: iLocalFileDTO[];
  editItems?: Map<any, any>;
  loadingRows?: any[];
  valid?: boolean;
  checkedItems?: Map<any, any>;
  error?: any;
  pending?: any[];
  fileListComplete?: boolean;
  newPending?: any;
  flags?: stateFlags[];
  props?: SalesUploadProps;
  reset?: SalesUploadState;
}

export interface salesUploadDispatch extends Dispatch<salesStateUpdates> {}

export enum campaignIdStatus {
  fetching = "fetching",
  failed = "failed",
  idle = "idle",
  done = "done",
}
