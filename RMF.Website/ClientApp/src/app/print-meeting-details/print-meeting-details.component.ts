import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMeeting } from '../meeting.interface';
import * as L from 'leaflet';

@Component({
  selector: 'app-print-meeting-details',
  templateUrl: './print-meeting-details.component.html',
  styleUrls: ['./print-meeting-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class PrintMeetingDetailsComponent implements OnInit {

  private map;
  public meeting: IMeeting;
  public notes: string[];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    // Get meeeting details from local storage.
    this.meeting = JSON.parse(localStorage.getItem('meeting'));

    if (this.meeting.note !== null)
      this.notes = this.meeting.note.split(/\r?\n/);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }


  // Initializes Leaflet map.
  private initMap(): void {

    // Create Leaflet map.
    this.map = L.map('map', {
      center: [this.meeting.latitude, this.meeting.longitude],
      zoom: 17
    });

    // Print component on map load event.
    this.map.whenReady(this.onMapLoad);

    // Set map tile layer.
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    // Create marker style for meeting type.
    var markerIcon = L.icon({
      iconUrl: '/assets/images/' + this.meeting.type.shortName.toLowerCase() + '.svg',
      iconSize: [36, 36], // size of the icon
      iconAnchor: [18, 36], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -33]
    });

    // Add marker to map.
    L.marker([this.meeting.latitude, this.meeting.longitude], { icon: markerIcon }).addTo(this.map)
  }

  public onMapLoad() {

    // Set page title.
    document.title = 'Recovery Meeting Finder';

    // Print window.
    setTimeout(() => { window.print(); }, 500);
  }

  public formatCsv(str: string) {
    return str.replace(/,/g, ', ');
  }

  // Replaces url's with anchor links.
  public urlReplace(str) {

    if (str === null)
      return str;

    let linkMatch = str.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
    let emailMatch = str.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);

    if (linkMatch === null && emailMatch === null)
      return str;

    let final = str;

    if (linkMatch !== null) {
      linkMatch.map(url => {
        final = final.replace(url, '<a href="' + url + '" target="_blank\">' + url + '</a>')
      })
    }

    if (emailMatch !== null) {
      emailMatch.map(email => {
        final = final.replace(email, '<a href="mailto:' + email + '">' + email + '</a>');
      })
    }

    return final;
  }
}
