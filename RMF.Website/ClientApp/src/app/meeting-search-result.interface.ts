import { IMeeting } from "./meeting.interface";
import { IType } from "./type.interface";

export interface IMeetingSearchResult {
  type: IType;
  meetings: IMeeting[];
}
