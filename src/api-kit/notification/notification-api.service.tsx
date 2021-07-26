import {WrapperService} from "../wrapper.service";
import {Environment} from "../../environments/environment";
import {authHeader} from "../../_redux/_helpers/auth-header";
import {EmailSelectionCriteriaState} from "../../app/sales/marketing-campaign/create-marketing-campaign/email-criteria/EmailSelectionCriteriaState";

export class NotificationApiService {
  public apiService: WrapperService = new WrapperService();
  private requestTimeout = 0; //no timeout;
  private responseEncoding = "utf8";
  private baseURL = Environment.NOTIFICATION_URL;

  public getTemplates() {
    let apiParam = {
      name: "notification",
      method: "GET",
      params: {},
      headers: {},
      body: {},
      suffixURL: `/templates`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
  public addTemplate(emailSelectionCriteriaState: EmailSelectionCriteriaState) {
    let header = authHeader();
    let apiParam = {
      name: "notification",
      method: "POST",
      params: {},
      headers: header,
      body: {
        notificationTemplateName:
          emailSelectionCriteriaState.addEmailTemplateModelState.templateName,
        notificationTemplateContent:
          emailSelectionCriteriaState.customEmailTemplateValue,
      },
      suffixURL: `/templates`,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }

  public updateTemplate(
    emailSelectionCriteriaState: EmailSelectionCriteriaState
  ) {
    let t = emailSelectionCriteriaState.emailTemplateOptions.find(
      (template) =>
        template.id === emailSelectionCriteriaState.emailTemplateSelectedValue
    );

    let header = authHeader();
    let apiParam = {
      name: "notification",
      method: "PATCH",
      params: {},
      headers: header,
      body: {
        notificationTemplateId:
          emailSelectionCriteriaState.emailTemplateSelectedValue,
        notificationTemplateName: t?.value,
        notificationTemplateContent:
          emailSelectionCriteriaState.customEmailTemplateValue,
      },
      suffixURL:
        `/templates/` + emailSelectionCriteriaState.emailTemplateSelectedValue,
      baseURL: this.baseURL,
      timeout: this.requestTimeout,
      withCredentials: true,
      responseType: "json",
      responseEncoding: this.responseEncoding,
    };
    return this.apiService.httpCall(apiParam, false);
  }
}
