import { Injectable } from "@angular/core";  
import { Resolve } from "@angular/router";  
import { Observable } from "rxjs";  
import { RmfService } from "./rmf.service";  
import { IDataDumpResults } from "./data-dump-results.interface";

@Injectable()  
export class DataDumpResolve implements Resolve<IDataDumpResults> {  
  constructor(private rmfService: RmfService) {}  
  
  async resolve(): Promise<IDataDumpResults> {
    return await this.rmfService.getDataDumps();
  }  
}  
