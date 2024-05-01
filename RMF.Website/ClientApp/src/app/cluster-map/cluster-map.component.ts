import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMeeting } from '../meeting.interface';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DetailsDialogComponent } from '../dialogs/details-dialog/details-dialog.component';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-easybutton';
import { RmfService } from '../rmf.service';
import { MobileDetailsDialogComponent } from '../dialogs/mobile-details-dialog/mobile-details-dialog.component';
import { IMeetingSearchResults } from '../meeting-search-results.interface';

@Component({
  selector: 'app-cluster-map',
  templateUrl: './cluster-map.component.html',
  styleUrls: ['./cluster-map.component.scss']
})

export class ClusterMapComponent implements AfterViewInit {

  private map;
  private meetingResults: IMeetingSearchResults;
  private lat; lng; zoom; Number;
  private locationFound: boolean = false;
  private markerClusterGroup: L.MarkerClusterGroup;
  public loading: boolean;

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
    var type, auth
    this.route.queryParams.subscribe(params => {
      type = params['type'];
      auth = params['auth'];
    });

    // Request search results.
    this.meetingResults = await service.getAllMeetings(type, auth);

    // Initialize map.
    this.initMap();

    // Hide loading icon.
    setTimeout(() => this.loading = false, 10);
  }

  // Initializes Leaflet map.
  private initMap(): void {

    // Set default map coordinates.
    this.zoom = 6;
    this.lat = 55.77039358162006;
    this.lng = -4.449462890625001;

    // Create marker cluster group.
    this.markerClusterGroup = L.markerClusterGroup({ maxClusterRadius: 50, removeOutsideVisibleBounds: true });

    // Create Leaflet map.
    this.map = L.map('map', {
      center: [this.lat, this.lng],
      zoom: this.zoom,
      zoomControl: false,
      attributionControl: false
    });

    // Set map tile layer.
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
    });
    tiles.addTo(this.map);

    var lat, lng;

    this.map.addEventListener('mousemove', function (ev) {
      console.log(ev.target.getCenter());
    });

    // Create map markers.
    var markerArray = [];
    if (this.meetingResults !== null) {

      // Loop through meeting types.
      this.meetingResults.meetingTypes.forEach(function (value) {

        // Create marker style for meeting type.
        var markerIcon = L.icon({
          iconUrl: '/assets/images/' + value.type.shortName.toLowerCase() + '.svg',
          iconSize: [36, 36], // size of the icon
          iconAnchor: [18, 36], // point of the icon which will correspond to marker's location
          popupAnchor: [0, -33]
        });

        // Loop through meetings.
        value.meetings.forEach(function (value) {

          // Add marker to array.
          if (value.postcode === 'ZE1 0ES' || value.postcode === 'ZE1 0DW' || value.postcode === 'PH33 6NQ' ||
            value.postcode === 'IM2 3AS' || value.postcode === 'SY23 1JH' || value.postcode === 'GL5 1DR' ||
            value.title === 'We Do Recover - Cavan' || value.postcode === 'LN2 4EJ' || value.postcode === 'AB25 1BT' ||
            value.postcode === 'EH3 9HH' || value.postcode === 'YO11 2LN' || value.postcode === 'V94 CK8K' ||
            value.postcode === 'LE12 7RY' || value.postcode === 'IP33 3JT' || value.postcode === 'TR14 7DF' ||
            value.postcode === 'DT4 0AR' || value.postcode === 'TN37 6LA' || value.postcode === 'GY1 1UW')
            return;

          markerArray.push(L.marker([value.latitude, value.longitude], { icon: markerIcon })
            .bindPopup(this.getMeetingPopup(value))
            .on("popupopen", (a) => {
              var popUp = a.target.getPopup()
              popUp.getElement()
                .querySelector(".details-dialog")
                .addEventListener("click", e => {
                  this.openDetailsDialog(value);
                });
            }));

        }.bind(this));

      }.bind(this));
    }

    // Add markers to map.
    if (markerArray.length > 0) {

      // Add markers to cluster group.
      this.markerClusterGroup.addLayers(markerArray);

      // Add cluster group with markers to the map.
      this.markerClusterGroup.addTo(this.map);
    }
  }

  // Gets meeting map popup.
  private getMeetingPopup(meeting: IMeeting): String {

    var meetingTime = new Date(meeting.time);

    var popup = "<h1 style='font-size: 15px; color: #000000; font-weight: bold; padding-top: 5px; padding-right: 5px'>" + (meeting.title !== null ? meeting.title + "<span style='color:$primary-color'>: " + meeting.day.name : "<span style='color:$primary-color'>" + meeting.day.name) + "</span></h1>";

    if (meeting.venue !== null)
      popup += "<p style='font-size: 15px; margin-bottom: -18px' *ngIf='meeting.venue !== null'>" + meeting.venue + "</p>";

    popup += "<p style='font-size: 15px;'>" + meeting.address.replace(/,/g, ', ');
    if (meeting.postcode !== null)
      popup += "<br/>" + meeting.postcode;
    popup += "</p>";

    popup += "<p style='font-size: 15px;'>Start time: " + meetingTime.toTimeString().split(' ')[0].substr(0, 5) +
      (meeting.duration !== null ? " - duration " + meeting.duration : "") + "</p>" +
      "<a href='javascript:void(0);' class='details-dialog' style='font-size: 15px; color:$primary-color'>Details</a> | " +
      "<a target='_blank' style='font-size: 15px; color:$primary-color; padding-bottom: 5px;'" +
      "href='https://www.google.com/maps/dir/?api=1&origin=" + this.lat + "%2C" + this.lng + "&destination=" + meeting.latitude + "%2C" + meeting.longitude + "&travelmode=driving'>Directions</a>";

    return popup;
  }

  // Opens meeting details dialog box.
  public openDetailsDialog(meeting: IMeeting): void {
    this.dialog.open(DetailsDialogComponent, {
      width: '550px',
      height: 'auto',
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'custom-dialog-container',
      data: { meeting: meeting }
    });
  }
}

