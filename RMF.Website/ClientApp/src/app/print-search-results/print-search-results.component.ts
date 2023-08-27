import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { IMeeting } from '../meeting.interface';
import { IMeetingSearchResults } from '../meeting-search-results.interface';


@Component({
  selector: 'app-print-search-results',
  templateUrl: './print-search-results.component.html',
  styleUrls: ['./print-search-results.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PrintSearchResultsComponent implements OnInit {

  public searchTerm: string;
  public types: any;
  public selectedTypes: any;
  public searchResults: IMeetingSearchResults;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {

    // Get search term from local storage.
    this.searchTerm = localStorage.getItem('searchTerm');

    // Get types from local storage.
    this.types = JSON.parse(localStorage.getItem('types'));

    // Get selected search result types.
    this.selectedTypes = JSON.parse(localStorage.getItem('selectedTypes'));

    // Get search results from local storage.
    this.searchResults = JSON.parse(localStorage.getItem('searchResults'));

    // Set page title.
    document.title = 'Recovery Meeting Finder';

    // Print window.
    setTimeout(() => { window.print(); }, 250);
  }

  // Returns true if there are no search results.
  public emptyResultSet(): Boolean {
    if (this.searchResults.meetingTypes === null || this.searchResults.meetingTypes.length === 0)
      return true;
    false;
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

  // Gets a count of the number of search results for a meeting type.
  public meetingTypeCount(meetingType: string): Number {
    if (this.searchResults.meetingTypes !== null && this.searchResults.meetingTypes.find(x => x.type.shortName === meetingType) !== undefined)
      return this.searchResults.meetingTypes.find(x => x.type.shortName === meetingType).meetings.length;
    return 0;
  }

  // Format CSV
  public formatCsv(str: string) {
    return str.replace(/,/g, ', ');
  }

  public splitPostcode(meeting: IMeeting) {
      return meeting.postcode.split(' ')[0];
  }
}
