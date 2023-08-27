import { IStatisticCountryResult } from "./statistic-country-result.interface";

export interface IStatisticCountryResults {
  meetingCountries: IStatisticCountryResult[],
  total: Number
  lastUpdated: string
}
