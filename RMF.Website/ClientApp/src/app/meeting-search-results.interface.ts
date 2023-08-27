import { IMeetingSearchResult } from "./meeting-search-result.interface";
import { IRegion } from "./region.interface";

export interface IMeetingSearchResults {
  latitude: Number,
  longitude: Number,
  meetingTypes: IMeetingSearchResult[],
  region: IRegion,
  startTime: string
}
