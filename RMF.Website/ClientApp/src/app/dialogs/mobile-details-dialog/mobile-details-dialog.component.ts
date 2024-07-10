import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { IMeeting } from "../../meeting.interface";
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as L from 'leaflet';

@Component({
  selector: 'app-mobile-details-dialog',
  templateUrl: './mobile-details-dialog.component.html',
  styleUrls: ['./mobile-details-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MobileDetailsDialogComponent implements OnInit {

  private map;
  public meeting: IMeeting;
  public notes: string[];
  public state: any;
  public isMobileDevice: boolean;

  constructor(private sanitizer: DomSanitizer, private deviceService: DeviceDetectorService, private dialogRef: MatDialogRef<MobileDetailsDialogComponent>, @Inject(MAT_DIALOG_DATA) data, @Inject(LOCALE_ID) private locale: string, private router: Router) {

    this.meeting = data.meeting;

    if (data.meeting.note !== null)
      this.notes = data.meeting.note.split(/\r?\n/);

    this.state = data.state;
    this.isMobileDevice = this.deviceService.isMobile();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  // Initializes Leaflet map.
  private initMap(): void {

    // Create Leaflet map.
    this.map = L.map('details-map', {
      center: [this.meeting.latitude, this.meeting.longitude],
      zoom: 16,
      scrollWheelZoom: false
    });

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

    // Add home button.
    var self = this;
    L.easyButton('fa-home', function (btn, map) {
      self.map.setView([self.meeting.latitude, self.meeting.longitude], 16);
    }).addTo(this.map);
  }

  // Closes dialog.
  public close(): void {
    this.dialogRef.close();
  }

  // Adds space after commas.
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

  // Gets SMS message link.
  public getMeetingsAtLocation() {

    var query = {
      meetingType: this.state.type,
      meetingLocation: this.state.location,
      meetingRegion: this.state.region,
      meetingDay: this.state.day,
      meetingDistance: this.state.distance,
      meetingAccessibility: this.state.accessibility,
      meetingOpen: this.state.open
    }

    this.router.navigateByUrl('/meetings-at-location?lat=' + this.meeting.latitude + '&lon=' + this.meeting.longitude, {
      state: {
        type: query.meetingType,
        location: query.meetingLocation,
        region: 'all',
        day: query.meetingDay,
        distance: '5',
        accessibility: ['all'],
        open: null,
        lng: this.meeting.longitude,
        lat: this.meeting.latitude,
        venue: true
      }
    });

    this.close();
  }

  // Gets SMS message link.
  public getSmsLink() {

    var separator = '?';
    if (this.iOS())
      separator = '&';

    var link = "sms:" + separator + "body=";

    var message = this.getMeetingDetailsMessage("%0A");
    message = message.replace(" & ", " and "); // Unsure why encoding as %26 is not working in sms: body= param.
    link += message;

    return this.sanitizer.bypassSecurityTrustUrl(link);
  }

  // Gets send email message link.
  public getEmailLink() {

    var link = "mailto:?subject=" + this.meeting.type.shortName + " Meeting Details" + "&body=";
    var message = this.getMeetingDetailsMessage("%0D%0A");
    message = message.replace("&", "%26");
    link += message + "%0D%0A" + "%0D%0A"; // Add extra linebreaks for email footer in Windows Mail.

    return this.sanitizer.bypassSecurityTrustUrl(link);
  }

  // Gets send WhatsApp message link.
  public getWhatsAppLink() {

    var link = "whatsapp://send?text=";
    var message = this.getMeetingDetailsMessage("%0A");
    message = message.replace("&", "%26");
    link += message;

    return this.sanitizer.bypassSecurityTrustUrl(link);
  }

  // Constructs the meeeting details message.
  public getMeetingDetailsMessage(newLineCharacter: string): string {

    var message = this.meeting.type.shortName + " Meeting Information" + newLineCharacter + newLineCharacter;

    message += this.meeting.title + ": " + this.meeting.day.name + newLineCharacter + newLineCharacter;

    message += this.meeting.venue + newLineCharacter +
      this.formatCsv(this.meeting.address) + newLineCharacter +
      this.meeting.postcode + newLineCharacter + newLineCharacter +
      "Start time: " + formatDate(this.meeting.time, 'HH:mm', this.locale) + (this.meeting.duration !== null ? " - duration " + this.meeting.duration : '') + newLineCharacter + newLineCharacter;
    "Open: ";

    if (this.meeting.openFormat !== null)
      message += this.meeting.openFormat + newLineCharacter + newLineCharacter;
    else {
      if (this.meeting.open)
        message += "This is an open meeting, anyone may attend." + newLineCharacter + newLineCharacter;
      else
        message += "This is a closed meeting, only people with an addiction and a desire to stop can attend." + newLineCharacter + newLineCharacter;
    }

    if (this.meeting.wheelchair || this.meeting.hearing || this.meeting.chit) {
      message += "Accessibility: ";

      if (this.meeting.wheelchair)
        message += "Wheelchair accessible. ";

      if (this.meeting.hearing)
        message += "Induction loop system. ";

      if (this.meeting.chit)
        message += "Chit system available.";

      message += newLineCharacter + newLineCharacter + "Meeting details shared from recoverymeetingfinder.com";
    }
    else {
      message += "Meeting details shared from recoverymeetingfinder.com";
    }

    return message;
  }

  // Is device running IOS.
  public iOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
      // iPad on iOS 13 detection
      || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  }

  // Opens print-meeting-details component with meeting details stored in local storage.
  public printMeetingDetails() {

    // Store meeting data in local storage.
    localStorage.setItem("meeting", JSON.stringify(this.meeting));

    // Open print details in a new tab.
    window.open('/print-meeting-details', '_blank');
  }
}

