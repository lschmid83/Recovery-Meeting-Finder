import { IDataDumpResult } from "./data-dump-result.interface";

export interface IDataDumpResults {
  path: string,
  statistics: string,
  dataDumps: IDataDumpResult[]
}
