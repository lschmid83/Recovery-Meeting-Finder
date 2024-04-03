import { IStatisticTypeResult } from "./statistic-type-result.interface";

export interface IStatisticCountryResult
{
  country: string,
  meetingTypes: IStatisticTypeResult[],
  total: number
}
