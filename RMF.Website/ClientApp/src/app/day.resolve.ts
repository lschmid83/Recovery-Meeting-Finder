import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { RmfService } from "./rmf.service";
import { IDay } from "./day.interface";

@Injectable()
export class DayResolve implements Resolve<IDay[]> {
  constructor(private rmfService: RmfService) { }

  async resolve(): Promise<IDay[]> {
    return await this.rmfService.getDays();
  }
}  
