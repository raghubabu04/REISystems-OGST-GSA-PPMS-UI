import { iFileDTO } from "../sales/marketing-campaign/create-marketing-campaign/SalesUpload/SalesUploadTypes";

export abstract class MarketingCampaignModel {
  campaignId?: string;
  campaignStatus: string;
  campaignName: string;
  campaignFrequency: string;
  campaignStartDate: string;
  campaignEndDate: string;

  fscCode: string;
  saleItemNumber: string;
  bidAmountStart: string;
  bidAmountEnd: string;
  biddersFrom: string;
  biddersTo: string;
  auctionStart: string;
  auctionEnd: string;
  itemSortType: string;

  bidderFscSameAs: string;
  includeBidderType: string;

  sendEmailTo: string;
  templateId: string;

  uploadCampaignDocList: iFileDTO[];
}
/**
 * Factory method to construct the model object from the provided interface object/structure
 * @param dto
 */
export class MarketingCampaignDto extends MarketingCampaignModel {
  static asMarketingCampaignDto(
    dto: MarketingCampaignModel
  ): MarketingCampaignModel {
    return Object.assign(new MarketingCampaignDto(), dto);
  }
}
