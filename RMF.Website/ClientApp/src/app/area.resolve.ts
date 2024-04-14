import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { RmfService } from "./rmf.service";
import { IArea } from "./area.interface";

@Injectable()
export class AreaResolve implements Resolve<IArea[]> {
  constructor(private rmfService: RmfService) { }

  async resolve(): Promise<IArea[]> {
    return await this.rmfService.getAreas();
  }
}  
