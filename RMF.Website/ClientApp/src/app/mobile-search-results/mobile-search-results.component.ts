import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IType } from '../type.interface';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DetailsDialogComponent } from '../dialogs/details-dialog/details-dialog.component';
import { IMeeting } from '../meeting.interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RmfService } from '../rmf.service';
import { MobileDetailsDialogComponent } from '../dialogs/mobile-details-dialog/mobile-details-dialog.component';
import { IMeetingSearchResults } from '../meeting-search-results.interface';


@Component({
  selector: 'app-mobile-search-results',
  templateUrl: '../search-results/search-results.component.html',
  styleUrls: ['../search-results/search-results.component.scss']
})

export class MobileSearchResultsComponent implements AfterViewInit {

  public selectedTypes: any;
  public searchResults: IMeetingSearchResults;
  public types: IType[];
  public loading: boolean;
  private lat; lng;

  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private http: HttpClient) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.loading = true;
  }

  async ngAfterViewInit(): Promise<void> {

    // Construct service.
    let service = new RmfService(this.http);

    // Get query string params.
    var type, location, region, day, distance, units, accessibility, open, lat, lng;
    this.route.queryParams.subscribe(params => {
      type = params['type'];
      location = params['location'];
      region = params['region'];
      day = params['day'];
      distance = params['distance'];
      units = params['units'];
      accessibility = params['accessibility'];
      open = params['open'];
      lat = params['lat'];
      lng = params['lng'];
    });

    // Construct API query.
    var query = {
      type: type !== undefined ? type.split(",") : ['all'],
      location: location,
      region: region,
      day: day !== undefined ? day.split(",") : ['all'],
      distance: distance,
      units: units,
      accessibility: accessibility !== undefined ? accessibility.split(",") : accessibility,
      open: open,
      lat: lat,
      lng: lng
    }

    this.lat = query.lat;
    this.lng = query.lng;

    // Request search results.
    this.selectedTypes = (type !== undefined && type !== 'all') ? type.split(",").map(Number) : ['all']
    this.types = await service.getTypes();
    this.searchResults = await service.getSearch(query);

    setTimeout(() => this.loading = false, 10);
  }


  // Determines whether a meeting type has been selected in the dropdown checklist.
  public meetingTypeSelected(meetingType: string): boolean {
    if (this.selectedTypes[0] === "all") {
      return true;
    }
    if (this.selectedTypes.includes(meetingType)) {
      return true;
    }
    return false;
  }

  // Gets a count of the number of search results for a meeting type.
  public meetingTypeCount(meetingType: string): Number {
    if (this.searchResults.meetingTypes !== null && this.searchResults.meetingTypes.find(x => x.type.shortName === meetingType) !== undefined)
      return this.searchResults.meetingTypes.find(x => x.type.shortName === meetingType).meetings.length;
    return 0;
  }

  // Returns true if there are no search results.
  public emptyResultSet(): Boolean {
    if (this.searchResults.meetingTypes === null || this.searchResults.meetingTypes.length === 0)
      return true;
    false;
  }

  // Opens meeting details dialog box.
  public openDetailsDialog(meeting: IMeeting): void {
    this.dialog.open(MobileDetailsDialogComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'custom-dialog-container',
      data: { meeting: meeting, lat: this.lat, lng: this.lng }
    });
  }

  // Scrolls to link.
  public scrollTo(elementId: string): void {
    document.querySelector('#' + elementId).scrollIntoView(); //{ behavior: 'smooth' });
  }

  // Format CSV
  public formatCsv(str: string) {
    return str.replace(/,/g, ', ');
  }
}
