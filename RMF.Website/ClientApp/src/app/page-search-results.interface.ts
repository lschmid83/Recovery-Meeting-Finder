import { IPageSearchResult } from "./page-search-result.interface";

export interface IPageSearchResults {
  searchTerm: string;
  results: IPageSearchResult[];
  totalResults: number;
}
