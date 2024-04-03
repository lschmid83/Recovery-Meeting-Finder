import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { RmfService } from "./rmf.service";
import { IStatisticCountryResults } from "./statistic-country-results.interface";

@Injectable()
export class StatisticCountryResolve implements Resolve<IStatisticCountryResults> {
  constructor(private rmfService: RmfService) { }

  async resolve(): Promise<IStatisticCountryResults> {
    return await this.rmfService.getCountryStatistics();
  }
}  
