import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot, NavigationExtras, RouterEvent, NavigationEnd} from "@angular/router";
import { RmfService } from "./rmf.service";
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { IMeetingSearchResults } from "./meeting-search-results.interface";

@Injectable()
export class MeetingSearchResolve implements Resolve<IMeetingSearchResults> {

  constructor(private rmfService: RmfService, private router: Router, private route: ActivatedRoute) {
  }

  async resolve(route: ActivatedRouteSnapshot): Promise<IMeetingSearchResults> {

    var region = null;

    // Navigate to find-a-metting with location or lon, lat parameters added to URL.
    if ((route.params['location'] !== undefined && this.router.getCurrentNavigation().extras.state === undefined) ||
      (route.queryParams['lon'] !== undefined && route.queryParams['lat'] !== undefined && this.router.getCurrentNavigation().extras.state === undefined)) {

      // Check if location param is a valid region name.
      if (route.params['location'] !== '')
        region = await this.rmfService.getRegion(decodeURIComponent(route.params['location']));

       // Initialize NavigationExtras state as there is not a form post.
      const navigationExtras: NavigationExtras = {
        state: {
          type: ['all'],
          location: (route.queryParams['lon'] !== undefined && route.queryParams['lat'] !== undefined) ? 'Current Location' : route.params['location'],
          region: region !== null ? region.id : 'all',
          day: ['all'],
          distance: '5',
          accessibility: ['all'],
          open: null,
          hearing: null,
          chit: null,
          regionName: region !== null ? region.name : null,
          lng: route.queryParams['lon'],
          lat: route.queryParams['lat']
        }
      };
      this.router.getCurrentNavigation().extras = navigationExtras;

      var query = {
        type: ['all'],
        location: route.params['location'],
        region: region !== null ? region.id : 'all',
        day: ['all'],
        distance: '5',
        units: 'miles',
        accessibility: ['all'],
        open: null,
        hearing: null,
        chit: null,
        lng: route.queryParams['lon'] !== undefined ? route.queryParams['lon'] : 0,
        lat: route.queryParams['lat'] !== undefined ? route.queryParams['lat'] : 0
      }
      return await this.rmfService.getSearch(query);
    }

    // Navigate to find-a-meeting with no search form post variables.
    if (this.router.getCurrentNavigation().extras.state === undefined) {

      const navigationExtras: NavigationExtras = {
        state: {
          type: ['all'],
          location: '',
          region: 'all',
          day: ['all'],
          distance: '5',
          accessibility: ['all'],
          open: null,
          hearing: null,
          chit: null,
          regionName: null
        }
      };
      this.router.getCurrentNavigation().extras = navigationExtras;

      query = {
        type: ['all'],
        location: '',
        region: 'all',
        day: ['all'],
        distance: '5',
        units: 'miles',
        accessibility: ['all'],
        open: null,
        hearing: null,
        chit: null,
        lng: 0,
        lat: 0
      }
      return await this.rmfService.getSearch(query);

    }

    // Navigate to find-a-meeting with search options passed in navigation state from form submit.
    if (route.params['location'] !== undefined && route.params['location'] !== '')
      region = await this.rmfService.getRegion(decodeURIComponent(route.params['location']));

    if (region !== null) {
      const navigationExtras: NavigationExtras = {
        state: {
          type: this.router.getCurrentNavigation().extras.state.type,
          location: this.router.getCurrentNavigation().extras.state.location,
          region: region !== null ? region.id : 'all',
          day: this.router.getCurrentNavigation().extras.state.day,
          distance: this.router.getCurrentNavigation().extras.state.distance,
          accessibility: this.router.getCurrentNavigation().extras.state.accessibility,
          open: this.router.getCurrentNavigation().extras.state.open,
          hearing: this.router.getCurrentNavigation().extras.state.hearing,
          chit: this.router.getCurrentNavigation().extras.state.hearing,
          regionName: region != null ? region.name : null, 
          lng: this.router.getCurrentNavigation().extras.state.lng,
          lat: this.router.getCurrentNavigation().extras.state.lat
        }
      };
      this.router.getCurrentNavigation().extras = navigationExtras;
    }

    var searchQuery = {
      type: this.router.getCurrentNavigation().extras.state.type,
      location: this.router.getCurrentNavigation().extras.state.location,
      region: region !== null ? region.id : this.router.getCurrentNavigation().extras.state.region,
      day: this.router.getCurrentNavigation().extras.state.day,
      distance: this.router.getCurrentNavigation().extras.state.distance,
      units: 'miles',
      accessibility: this.router.getCurrentNavigation().extras.state.accessibility,
      open: this.router.getCurrentNavigation().extras.state.open,
      lat: this.router.getCurrentNavigation().extras.state.lat,
      lng: this.router.getCurrentNavigation().extras.state.lng,
      venue: this.router.getCurrentNavigation().extras.state.venue
    }
    return await this.rmfService.getSearch(searchQuery);
  }
}  
