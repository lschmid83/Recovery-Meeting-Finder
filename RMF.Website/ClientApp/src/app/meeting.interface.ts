import { IDay } from "./day.interface";
import { IType } from "./type.interface";

export interface IMeeting {
  id: number;
  guid: string;
  type: IType;
  title: string;
  latitude: number;
  longitude: number;
  day: IDay;
  venue: string;
  address: string;
  what3Words: string;
  time: string;
  duration: string;
  distance: number;
  postcode: string;
  hearing: boolean;
  wheelchair: boolean;
  chit: boolean;
  open: boolean;
  openFormat: string;
  format: string;
  note: string;
  country: string;
  hash: number;
}
