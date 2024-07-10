import { Component, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IType } from '../type.interface';
import { MatDialog, MatDialogConfig, MatSelect, MatSelectChange } from "@angular/material";
import { DetailsDialogComponent } from '../dialogs/details-dialog/details-dialog.component';
import { IMeeting } from '../meeting.interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AccessibilityDialogComponent } from '../dialogs/accessibility-dialog/accessibility-dialog.component';
import { FormGroup, FormControl } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import orderBy from 'lodash/orderBy';
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
import { LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';
import { IMeetingSearchResults } from '../meeting-search-results.interface';
import { Overlay } from '@angular/cdk/overlay';
import { RmfService } from '../rmf.service';
import { MobileDetailsDialogComponent } from '../dialogs/mobile-details-dialog/mobile-details-dialog.component';

@Component({
  selector: 'app-mobile-search-results',
  templateUrl: '../mobile-search-results/mobile-search-results.component.html',
  styleUrls: ['../mobile-search-results/mobile-search-results.component.scss']
})

export class MobileSearchResultsComponent implements AfterViewInit {

  public selectedTypes: any;
  public searchResults: IMeetingSearchResults;
  public types: IType[];
  public loading: boolean;
  private lat; lng;
  public searchFilterForm: FormGroup;
  public isMobileDevice: boolean;
  private searchTerm: string;
  private state: any;

  @ViewChild('sortOptionSelect', { static: false }) sortOptionSelect: MatSelect;

  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private http: HttpClient, private deviceService: DeviceDetectorService, @Inject(LOCALE_ID) private locale: string, private overlay: Overlay) {
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

    var sortOption = 'distance';
    if (day === 'from now')
      sortOption = 'time';

    this.searchFilterForm = new FormGroup({
      sortOption: new FormControl(sortOption),
    });

    // Sort results.
    this.sortSearchResults('time');
    this.sortSearchResults('day');
    this.sortSearchResults(sortOption);

    setTimeout(() => this.loading = false, 10);
  }


  // Determines whether a meeting type has been selected in the dropdown checklist.
  public meetingTypeSelected(meetingType: string): boolean {
    if (this.selectedTypes[0] === 'all') {
      return true;
    }
    if (this.selectedTypes.includes(meetingType)) {
      return true;
    }
    return false;
  }

  // Sort options selected.
  public sortOptionSelected(event: MatSelectChange) {

    this.sortSearchResults(event.source.value);

    // Store sort option in local storage
    //localStorage.setItem("sortOption", event.source.value);
  }

  // Sorts search results by property using lodash.
  private sortSearchResults(sortProperty: string) {

    if (this.searchResults === null)
      return;

    for (var i = 0; i < this.searchResults.meetingTypes.length; i++) {
      if (sortProperty === 'day')
        this.searchResults.meetingTypes[i].meetings = orderBy(this.searchResults.meetingTypes[i].meetings, [(meeting) => meeting.day.order], ["asc"]);
      else if (sortProperty === 'time')
        this.searchResults.meetingTypes[i].meetings = orderBy(this.searchResults.meetingTypes[i].meetings, [(meeting) => meeting.time], ["asc"]);
      else if (sortProperty === 'distance')
        this.searchResults.meetingTypes[i].meetings = orderBy(this.searchResults.meetingTypes[i].meetings, [(meeting) => meeting.distance], ["asc"]);
    }
  }

  // Gets a count of the number of search results for a meeting type.
  public meetingTypeCount(meetingType: string): Number {
    if (this.searchResults.meetingTypes !== null && this.searchResults.meetingTypes.find(x => x.type.shortName === meetingType) !== undefined)
      return this.searchResults.meetingTypes.find(x => x.type.shortName === meetingType).meetings.length;
    return 0;
  }

  // Returns true if there are no search results.
  public emptyResultSet(): Boolean {
    if (this.searchResults === null || this.searchResults.meetingTypes.length === 0)
      return true;
    false;
  }

  // Opens meeting details dialog box.
  public openDetailsDialog(meeting: IMeeting): void {

    this.dialog.open(MobileDetailsDialogComponent, {
      width: '550px',
      height: 'auto',
      position: { top: '20px' },
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'custom-dialog-container',
      data: { meeting: meeting, state: this.state },
      //scrollStrategy: this.overlay.scrollStrategies.noop()
    });
  }

  // Opens meeting accessibility dialog box.
  public openAccessibilityDialog(meeting: IMeeting): void {
    this.dialog.open(AccessibilityDialogComponent, {
      width: '550px',
      height: 'auto',
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'custom-dialog-container',
      data: { meeting: meeting },
      //scrollStrategy: this.overlay.scrollStrategies.noop()
    });
  }

  // Scrolls to link.
  public scrollTo(elementId: string): void {
    document.querySelector('#' + elementId).scrollIntoView({ behavior: 'smooth' });
  }

  // Format CSV
  public formatCsv(str: string) {
    return str.replace(/,/g, ', ');
  }

  public downloadSearchResults() {

    // Create worksheet.
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('MeetingsSheet');

    // Specify column names.
    worksheet.columns = [
      { header: 'Guid', key: 'guid' },
      { header: 'Title', key: 'title' },
      { header: 'Time', key: 'time' },
      { header: 'Duration', key: 'duration' },
      { header: 'Postcode', key: 'postcode' },
      { header: 'Latitude', key: 'latitude' },
      { header: 'Longitude', key: 'longitude' },
      { header: 'Venue', key: 'venue' },
      { header: 'Address', key: 'address' },
      { header: 'What3Words', key: 'what3words' },
      { header: 'Day', key: 'day' },
      { header: 'Hearing', key: 'hearing' },
      { header: 'Wheelchair', key: 'wheelchair' },
      { header: 'Chit', key: 'chit' },
      { header: 'Open', key: 'open' },
      { header: 'OpenFormat', key: 'openFormat' },
      { header: 'Format', key: 'format' },
      { header: 'Note', key: 'note' },
      //{ header: 'Country', key: 'country' },
      { header: 'Type', key: 'type' },
    ];

    // Write data.
    if (this.searchResults.meetingTypes !== null) {

      this.searchResults.meetingTypes.forEach(meetingType => {
        meetingType.meetings.forEach(meeting => {

          // Check if note contains HTML and replace </p> with a comma.
          var note = meeting.note;
          var htmlRegex = new RegExp(/<[^>]*>/g);
          if (note !== null && htmlRegex.test(meeting.note)) {
            note = meeting.note.replace(/<\/p>/g, ',').replace(/<[^>]*>/g, '').replace(/\.,/g, ',').slice(0, -1);
          };

          worksheet.addRow({
            guid: meeting.guid, title: meeting.title, time: formatDate(meeting.time, 'HH:mm', this.locale), duration: meeting.duration,
            postcode: meeting.postcode, latitude: meeting.latitude, longitude: meeting.longitude,
            venue: meeting.venue, address: meeting.address, what3words: meeting.what3Words, day: meeting.day.name, hearing: meeting.hearing,
            wheelchair: meeting.wheelchair, chit: meeting.chit, open: meeting.open, openFormat: meeting.openFormat,
            format: meeting.format, note: note, type: meeting.type.name
          }, "n");
        });
      });

      // Set width of columns to fit content.
      worksheet.columns.forEach(function (column, i) {
        var maxLength = 0;
        column["eachCell"]({ includeEmpty: true }, function (cell) {
          var columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
      });
    }

    // Save file.
    workbook.xlsx.writeBuffer().then((data) => {
      var filename = (this.searchResults.meetingTypes !== null ? this.searchTerm.toLowerCase().replace(/ /g, '_').replace(/_=_/g, '=') + '_' : '') + 'meetings_' + formatDate(new Date(), 'yyyy_MM_dd', this.locale) + '.xlsx';
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, filename);
    });
  }

  public showSortOptions() {
    this.sortOptionSelect.open();
  }
}
