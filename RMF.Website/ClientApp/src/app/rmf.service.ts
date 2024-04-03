import { Injectable } from "@angular/core";  
import { HttpClient, HttpHeaders } from "@angular/common/http";  
import { IType } from "./type.interface";
import { IDay } from "./day.interface";
import { IArea } from "./area.interface";
import { IRegion } from "./region.interface";
import { Observable, EMPTY } from "rxjs";  
import { environment } from '../environments/environment';
import { INominatim } from "./nominatim.interface";
import { IMeeting } from "./meeting.interface";
import { IStatisticTypeResults } from "./statistic-type-results.interface";
import { IMeetingSearchResults } from "./meeting-search-results.interface";
import { IStatisticCountryResults } from "./statistic-country-results.interface";
import { IPageSearchResult } from "./page-search-result.interface";
import { IPageSearchResults } from "./page-search-results.interface";
import { IDataDumpResults } from "./data-dump-results.interface";
import * as sha512 from 'js-sha512';
  
@Injectable({  
  providedIn: "root"  
})

// Main service class for API methods called by resolvers.
export class RmfService {  
 
  constructor(private http: HttpClient) {}  

  // Gets meeting types.
  public async getTypes(): Promise<IType[]> {
    var apiMethod = '/meeting-type';
    return await this.http.get<IType[]>(environment.apiUrl + apiMethod, this.getRequestHeaders(apiMethod)).toPromise();  
  }

  // Gets days of the week.
  public async getDays(): Promise<IDay[]> {
    var apiMethod = '/day';
    return await this.http.get<IDay[]>(environment.apiUrl + apiMethod, this.getRequestHeaders(apiMethod)).toPromise();
  }

  // Gets geographical areas.
  public async getAreas(): Promise<IArea[]> {
    var apiMethod = '/area';
    return await this.http.get<IArea[]>(environment.apiUrl + apiMethod, this.getRequestHeaders(apiMethod)).toPromise();
  }

  // Gets type statistics.
  public async getTypeStatistics(): Promise<IStatisticTypeResults> {
    var apiMethod = '/statistic/latest/meeting-type';
    return await this.http.get<IStatisticTypeResults>(environment.apiUrl + apiMethod, this.getRequestHeaders(apiMethod)).toPromise();
  }

  // Gets country statistics.
  public async getCountryStatistics(): Promise<IStatisticCountryResults> {
    var apiMethod = '/statistic/latest/country';
    return await this.http.get<IStatisticCountryResults>(environment.apiUrl + apiMethod, this.getRequestHeaders(apiMethod)).toPromise();
  }

  // Gets search results.
  public async getSearch(query): Promise<IMeetingSearchResults> {

    // Ignore type of meeting if set to 'all'.
    if (query.type === undefined || query.type[0] === 'all')
      query.type = null;

    // Ignore day of meeting if set to 'all'.
    if (query.day === undefined || query.day[0] === 'all')
      query.day = null;

    // Get current day ID.
    var currentDayId = 0;
    if (query.day == 'from now') {
      var days = await this.getDays();
      var dateToday = new Date();
      var dayName = dateToday.toLocaleString("default", { weekday: "long" });
      var day = days.filter(obj => { return obj.name == dayName });
      currentDayId = day[0].id;     
    }

    // Only set accesibility options if they are checked.
    var hearing = null;
    var wheelchair = null;
    var chit = null;
    if (query.accessibility !== undefined) {
        if (query.accessibility.includes('hearing'))
          hearing = true;
        if (query.accessibility.includes('wheelchair'))
          wheelchair = true;
        if (query.accessibility.includes('chit'))
          chit = true;
    }

    // Get lat, lon from Nominatim service for postcode or area.
    var lon = undefined, lat = undefined;
    var region: IRegion = null;

    // Region selection takes precendence.
    if (query.region !== undefined && query.region !== 'all') {

      // Get lat, lon from database if a region is selected.
      var apiMethod = '/region?regionId=' + query.region;
      var region = await this.http.get<IRegion>(environment.apiUrl + apiMethod, this.getRequestHeaders(apiMethod)).toPromise();
      if (region !== null) {
        lon = region.longitude;
        lat = region.latitude;
      }
    }
    else if (query.lng !== 0 && query.lat !== 0) {
      lon = query.lng;
      lat = query.lat;
    }
    else if (query.location) {

      if (this.validPostcode(query.location)) {
        // Add space to postcode.
        query.location = query.location.replace(/^(.*)(\d)/, "$1 $2");
      }
      var nominatim = await this.http.get<INominatim[]>('https://nominatim.openstreetmap.org/search?q=' + query.location + '&countrycodes=gb,ie&format=json').toPromise();
      if (nominatim.length > 0) {
        lon = parseFloat(nominatim[0].lon);
        lat = parseFloat(nominatim[0].lat);
      }
    }

    // Add 5% padding of unit to distance to include all meetings.
    var distance = null;
    if (query.units === 'km')
      distance = (query.distance * 1000) + 50;
    else
      distance = (query.distance * 1609.34) + 80.46;

    // Get current time.
    var currentTime = new Date(Date.now());
    currentTime.setTime(currentTime.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

    // Construct API query.
    var apiQuery = {
      longitude: lon,
      latitude: lat,
      distance: distance, 
      dayIds: query.day == 'from now' ? [currentDayId] : query.day,
      typeIds: query.type,
      regionId: region ? query.region : null,
      hearing: hearing,
      wheelchair: wheelchair,
      chit: chit,
      open: query.open,
      startTime: query.day == 'from now' ? currentTime : null,
      venue: query.venue
    }

    if (query.venue) {
      var apiMethod = '/meetings-at-location';
      var results = await this.http.post<IMeetingSearchResults>(environment.apiUrl + apiMethod, apiQuery, this.getRequestHeaders(apiMethod)).toPromise();
    }
    else {
      var apiMethod = '/meeting';
      var results = await this.http.post<IMeetingSearchResults>(environment.apiUrl + apiMethod, apiQuery, this.getRequestHeaders(apiMethod)).toPromise();
      if (query.region !== undefined && query.region !== 'all') {
        results.region = region;
      }
    }
    return results;
  }

  // Gets a region by name.
  public async getRegion(regionName): Promise<IRegion> {
    var apiMethod = '/region/name?regionName=' + regionName;
    return await this.http.get<IRegion>(environment.apiUrl + apiMethod, this.getRequestHeaders(apiMethod)).toPromise();
  }

  // Gets all meetings.
  public async getAllMeetings(type: string, auth: string): Promise<IMeetingSearchResults> {
    var apiMethod = '/meeting/all?type=' + type + '&auth=' + auth;
    return await this.http.get<IMeetingSearchResults>(environment.apiUrl + apiMethod, this.getRequestHeaders(apiMethod)).toPromise();
  }

  // Gets page search.
  public async getPageSearch(query): Promise<IPageSearchResults> {
    if (query === "undefined") {
      query = '';
    }
    var apiMethod = '/page-search?query=' + query + '&maxContentLength=600';
    return await this.http.get<IPageSearchResults>(environment.apiUrl + apiMethod, this.getRequestHeaders(apiMethod)).toPromise();
  }

  // Gets data dumps.
  public async getDataDumps(): Promise<IDataDumpResults> {
    var apiMethod = '/data-dump';
    return await this.http.get<IDataDumpResults>(environment.apiUrl + apiMethod, this.getRequestHeaders(apiMethod)).toPromise();
  }

  // Get GPS location if enabled in browser.
  public async getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    });
  }

  // Check if valid UK postcode.
  private validPostcode(postcode: string) : boolean {
    postcode = postcode.replace(/\s/g, "");
    var regex = /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/gmi;
    return regex.test(postcode);
  }

  // Gets auth request headers.
  public getRequestHeaders(method: string) {

    const current = new Date();
    var timestamp = current.getTime().toString();

    var headers = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Timestamp': timestamp
      }
    }
    return headers;
  }

}
