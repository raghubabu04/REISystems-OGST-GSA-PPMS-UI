interface IEnvData {
  API_HOST?: string;
  API_KEY?: string;
  AUTH_API_SUFFIX?: string;
  USER_API_SUFFIX?: string;
  NOTIFICATION_URL: string;
  AUTH_URL: string;
  USER_URL: string;
  COMMON_URL: string;
  PROPERTY_URL: string;
  ENVIRONMENT: string;
  SALES_URL: string;
  AUCTIONS_URL: string;
  LOGOUT_NOTIFICATION_TIME: number;
  LOGOUT_COUNTDOWN_TIME: number;
  PING_INTERVAL: number;
  MAPQUEST: string;
  MAPQUEST_API_KEY: string;
  PBS_DOI_AUCTIONS: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const envData = (window as any)._env_ ? (window as any)._env_ : {};
export const Environment: IEnvData = envData as IEnvData;
