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
  selector: 'app-mobile-map',
  templateUrl: './mobile-map.component.html',
  styleUrls: ['./mobile-map.component.scss']
})

export class MobileMapComponent implements AfterViewInit {

  private map;
  private meetingResults: IMeetingSearchResults;
  private lat; lng; zoom; Number;
  private locationFound: boolean = false;
  private markerClusterGroup: L.MarkerClusterGroup;
  public loading: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private http: HttpClient) {

    // Reload route and resolvers.
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
      distance: parseInt(distance),
      units: units,
      accessibility: accessibility !== undefined ? accessibility.split(",") : accessibility,
      open: open,
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    }

    // Request search results.
    this.meetingResults = await service.getSearch(query);

    this.initMap();

    setTimeout(() => this.loading = false, 10);
  }

  // Initializes Leaflet map.
  private initMap(): void {

    // Set default map coordinates.
    this.zoom = 5;
    this.lat = 54.7023545;
    this.lng = -3.2765753;

    // Set Nominatim search result coordinates.
    if (this.meetingResults !== null && this.meetingResults.latitude !== undefined && this.meetingResults.longitude !== undefined) {
      this.lat = this.meetingResults.latitude;
      this.lng = this.meetingResults.longitude;
      this.locationFound = true;
    }

    // Create marker cluster group.
    this.markerClusterGroup = L.markerClusterGroup({ maxClusterRadius: 10, removeOutsideVisibleBounds: true });

    // Create Leaflet map.
    this.map = L.map('map', {
      center: [this.lat, this.lng],
      zoom: this.zoom,
    });

    // Set map tile layer.
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
    });
    tiles.addTo(this.map);

    // Create map markers.
    var markerArray = [];

    const customOptions = {
      'className': 'map-popup' // name custom popup
    }

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
          markerArray.push(L.marker([value.latitude, value.longitude], { icon: markerIcon })
            .bindPopup(this.getMeetingPopup(value), customOptions)
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

    // Add markers to map and calculate extent.
    if (markerArray.length > 0) {

      // Add markers to cluster group.
      this.markerClusterGroup.addLayers(markerArray);

      // Expand cluster on mouseover.
      this.markerClusterGroup.on('clustermouseover', function (e) {
        e.layer.spiderfy();
      });

      // Add cluster group with markers to the map.
      this.markerClusterGroup.addTo(this.map);

      // Zoom to extent of markers.
      this.map.fitBounds(this.markerClusterGroup.getBounds(), true); // <-- without second arg, map.getZoom() will return a wrong value!

      // Get min zoom level to display all markers in bounds.
      var zoomLevel = this.map.getZoom();

      var minFoundMarkers = 10;

      // Loop through two levels of zoom to see if they contain at least min amount of markers.
      for (var i = 2; i > 0; i--) {

        // Get scaled viewport at increased zoom level.
        var scaledBounds = this.getScaledBoundsWorking([this.lat, this.lng], zoomLevel + i);

        // Loop through marker array.
        var foundMarkers = 0;
        for (let marker of markerArray) {

          // Scaled viewport contains marker.
          if (scaledBounds.contains(marker.getLatLng()))
            foundMarkers++;

          // More than min markers found.
          if (foundMarkers >= minFoundMarkers) {
            break;
          }
        };

        // Use increased zoom level.
        if (foundMarkers === minFoundMarkers) {
          zoomLevel += i;
          break;
        }
      }

      // Set zoom level.
      this.map.setZoom(zoomLevel);
    }
    else {
      // Set location even if there are no search results.
      if (this.locationFound)
        this.map.setView([this.lat, this.lng], 15);
      else
        this.map.setView([this.lat, this.lng], this.zoom);
    }

    // Add home button.
    var self = this;
    L.easyButton('fa-home', function (btn, map) {
      if (markerArray.length > 0) {

        // Zoom to extent of markers.
        self.map.fitBounds(self.markerClusterGroup.getBounds(), true);
      }
      else {
        if (this.locationFound)
          self.map.setView([self.lat, self.lng], 15);
        else
          self.map.setView([self.lat, self.lng], self.zoom);
      }
    }).addTo(this.map);
  }

  // https://stackoverflow.com/questions/70115385/leaflet-get-scaled-bounding-box-by-zoom-level
  private getScaledBoundsWorking(center, zoom) {
    const bounds = this.map.getPixelBounds(center, zoom);
    const sw = this.map.unproject(bounds.getBottomLeft(), zoom);
    const ne = this.map.unproject(bounds.getTopRight(), zoom);
    return L.latLngBounds(sw, ne);
  }

  // Gets meeting map popup.
  private getMeetingPopup(meeting: IMeeting): String {

    var meetingTime = new Date(meeting.time);

    var popup = "<h1 class='heading'>" + (meeting.title !== null ? meeting.title + "<span class='day'>: " + meeting.day.name : "<span class='day'>" + meeting.day.name) + "</span></h1>";

    if (meeting.venue !== null)
      popup += "<p class='venue' *ngIf='meeting.venue !== null'>" + meeting.venue + "</p>";

    popup += "<p class='address'>" + meeting.address.replace(/,/g, ', ');
    if (meeting.postcode !== null)
      popup += "<br/>" + meeting.postcode;
    popup += "</p>";

    popup += "<p class='time'>Start time: " + meetingTime.toTimeString().split(' ')[0].substr(0, 5) +
      (meeting.duration !== null ? " - duration " + meeting.duration : "") + "</p>" +
      "<a href='javascript:void(0);' class='details-dialog link'>Details</a> | " +
      "<a target='_blank' class='link' " +
      "href='https://www.google.com/maps/dir/?api=1&origin=" + this.lat + "%2C" + this.lng + "&destination=" + meeting.latitude + "%2C" + meeting.longitude + "&travelmode=driving'>Directions</a>";

    return popup;
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
      data: { meeting: meeting, lat: this.lat, lng: this.lng },
    });
  }
}

