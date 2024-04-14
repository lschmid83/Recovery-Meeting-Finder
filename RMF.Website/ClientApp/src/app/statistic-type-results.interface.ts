import { IStatisticTypeResult } from "./statistic-type-result.interface";

export interface IStatisticTypeResults {
  meetingTypes: IStatisticTypeResult[],
  total: Number
  lastUpdated: string
}
