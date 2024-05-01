import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot, NavigationExtras, RouterEvent, NavigationEnd} from "@angular/router";
import { RmfService } from "./rmf.service";
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { IMeetingSearchResults } from "./meeting-search-results.interface";
import { IPageSearchResults } from "./page-search-results.interface";

@Injectable()
export class PageSearchResolve implements Resolve<IPageSearchResults> {

  constructor(private rmfService: RmfService, private router: Router, private route: ActivatedRoute) {
  }

  async resolve(route: ActivatedRouteSnapshot): Promise<IPageSearchResults> {
    return await this.rmfService.getPageSearch(encodeURIComponent(route.params['query']));
  }
}  
