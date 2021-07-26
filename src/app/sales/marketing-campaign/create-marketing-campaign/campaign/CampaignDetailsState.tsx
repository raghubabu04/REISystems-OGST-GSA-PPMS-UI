export interface CampaignDetailsState {
  campaignName: string;
  campaignId:string;
  campaignStartDate: any;
  campaignEndDate: any;
  campaignRun: string;
  campaignNameIsInvalid?: any;
  campaignNameValidationMessage?: any;
  campaignStartDateIsInvalid?: any;
  campaignStartDateValidationMessage?: any;
  campaignEndDateIsInvalid?: any;
  campaignEndDateValidationMessage?: any;
  campaignRunIsInvalid?: any;
  campaignRunValidationMessage?: any;
  typingTimeout?: any;
  uploadedFiles?:any;
}

export const CampaignDetailsStateDefault = {
  campaignName: "",
  campaignId:"",
  campaignStartDate: "",
  campaignEndDate: "",
  campaignRun: "",
  campaignEndDateIsInvalid: false,
  campaignEndDateValidationMessage: "",
  campaignStartDateIsInvalid: false,
  campaignStartDateValidationMessage: "",
  campaignNameIsInvalid: false,
  campaignNameValidationMessage: "",
  campaignRunIsInvalid: false,
  campaignRunValidationMessage: "",
  typingTimeout:0,
  uploadedFiles:[]
};
