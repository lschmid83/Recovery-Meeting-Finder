import { IRegion } from "./region.interface";

export interface IArea {
  id: number;
  name: string;
  order: number;
  regions: IRegion[];
}
