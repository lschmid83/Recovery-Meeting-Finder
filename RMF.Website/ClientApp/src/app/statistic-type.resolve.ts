import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { RmfService } from "./rmf.service";
import { IStatisticTypeResults } from "./statistic-type-results.interface";

@Injectable()
export class StatisticTypeResolve implements Resolve<IStatisticTypeResults> {
  constructor(private rmfService: RmfService) { }

  async resolve(): Promise<IStatisticTypeResults> {
    return await this.rmfService.getTypeStatistics();
  }
}  
