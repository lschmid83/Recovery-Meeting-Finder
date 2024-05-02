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
import { IMeetingSearchResults } from '../meeting-search-results.interface';
import { Overlay } from '@angular/cdk/overlay';
import { Control } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {

  private map;
  private meetingResults: IMeetingSearchResults;
  //private regionBoundary: string;
  private lat; lng; zoom; Number;
  private locationFound: boolean = false;
  private region: string;
  private distance: string;
  private markerClusterGroup: L.MarkerClusterGroup;
  public custom: Control;
  public mouseWheelZoom;
  private state: any;

  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private http: HttpClient, private overlay: Overlay) {

    // Get state variables.
    this.region = this.router.getCurrentNavigation().extras.state.region;
    this.distance = this.router.getCurrentNavigation().extras.state.distance;
    this.state = this.router.getCurrentNavigation().extras.state;

    // Reload route and resolvers.
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  // Initializes Leaflet map.
  private initMap(): void {

    // Get search results.
    this.meetingResults = this.route.snapshot.data.searchResults;
    //this.regionBoundary = this.route.snapshot.data.searchResults.regionBoundary;
    this.mouseWheelZoom = localStorage.getItem('mouseWheelZoom');

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
    var clusterRadius = 10;
    if (this.distance === '10')
      clusterRadius = 60;

    this.markerClusterGroup = L.markerClusterGroup({ maxClusterRadius: clusterRadius, removeOutsideVisibleBounds: true });

    // Create Leaflet map.
    this.map = L.map('map', {
      center: [this.lat, this.lng],
      zoom: this.zoom,
      scrollWheelZoom: this.mouseWheelZoom === 'true' ? true : false
    });

    // Log coordinates and zoom level to console.
    this.map.addEventListener('click', function (ev) {
      console.log(ev.target.getCenter());
      console.log(ev.target.getZoom());
    });

    // Set map tile layer.
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    var self = this;
    let Custom = Control.extend({
      onAdd(map) {
        var div = L.DomUtil.create('div', 'form-check');

        div.innerHTML = '<input class="form-check-input" type="checkbox" value="" id="toggle-mouse-wheel-zoom" style="margin-top: 3px;"' + (self.mouseWheelZoom === 'true' ? 'checked' : '') +  '>' +
          '<label class="form-check-label" for= "flexCheckDefault" style="font-size: 14px; background-color: white; padding-left: 5px; padding-right: 5px;">' + 
          'Mouse wheel zoom' +
          '</label>';
        return div;
      },
      onRemove(map) { }
    });

    this.custom = new Custom({
      position: 'bottomleft'
    }).addTo(this.map);

    document.getElementById('toggle-mouse-wheel-zoom').addEventListener('click', function (e) {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        localStorage.setItem('mouseWheelZoom', 'true');
        self.map.scrollWheelZoom.enable();
      }
      else {
        self.map.scrollWheelZoom.disable();
        localStorage.setItem('mouseWheelZoom', 'false');
      }

    }, false);

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
            })
          );   

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
      if (this.region === 'all' || (this.meetingResults.region !== null && this.meetingResults.region.zoom === 0)) {

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
        this.map.setView([this.meetingResults.region.latitude, this.meetingResults.region.longitude], this.meetingResults.region.zoom);
      }
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

        // Zoom in one level for location searches.
        if (self.region === 'all')
          self.map.setZoom(zoomLevel);
      }
      else {
        if (this.locationFound)
          self.map.setView([self.lat, self.lng], 15);
        else
          self.map.setView([self.lat, self.lng], self.zoom);
      }
    }).addTo(this.map);

    // Add mouse right double click zoom out.
    var Right_dblclick = false;
    this.map.on("contextmenu", function (e) {
      if (Right_dblclick) {
        if (self.map.getZoom() > 2) {
          self.map.setZoom(self.map.getZoom() - 1);
        }
      } else {
        Right_dblclick = true;
        setTimeout(function () { Right_dblclick = false; }, 250);
      }
    });
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
    this.dialog.open(DetailsDialogComponent, {
      width: '550px',
      height: 'auto',
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'custom-dialog-container',
      data: { meeting: meeting, state: this.state },
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
  }
}

