import { Injectable } from "@angular/core";  
import { Resolve } from "@angular/router";  
import { Observable } from "rxjs";  
import { RmfService } from "./rmf.service";  
import { IType } from "./type.interface";  

@Injectable()  
export class TypeResolve implements Resolve<IType[]> {  
  constructor(private rmfService: RmfService) {}  
  
  async resolve(): Promise<IType[]> {
    return await this.rmfService.getTypes();
  }  
}  
