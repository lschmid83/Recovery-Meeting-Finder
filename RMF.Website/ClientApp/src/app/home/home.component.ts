import { Component, ViewChild } from '@angular/core';
import { MatOption, MatSelect } from "@angular/material";
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IType } from '../type.interface';
import { IDay } from '../day.interface';
import { Event, NavigationEnd, NavigationStart } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { RmfService } from '../rmf.service';
import { DisclaimerDialogComponent } from '../dialogs/disclaimer-dialog/discliamer-dialog.component';
import { AppComponent } from '../app.component';
import { IStatisticTypeResults } from "../statistic-type-results.interface";
import { Overlay } from '@angular/cdk/overlay';
import { SeoService } from '../seo.service';
import { PageWithMainMenu } from '../page-with-main-menu';
import { Title, Meta } from '@angular/platform-browser';
import { PageWithMainSidebar } from '../page-with-main-sidebar';
import { DonationsDialogComponent } from '../dialogs/donations-dialog/donations-dialog.component';

// JQuery selector.
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent extends PageWithMainMenu {

  public types: IType[];
  public days: IDay[];
  public statistics: IStatisticTypeResults;
  public loading: Boolean = false;
  public findMeetingForm: FormGroup;
  public gpsEnabled: Boolean = true;
  public isSafari: Boolean = false;
  public isIreland: string = 'false';
  private lat = 0; lng: Number = 0;

  @ViewChild('meetingTypeSelect', { static: false }) meetingTypeSelect: MatSelect;
  @ViewChild('meetingDaySelect', { static: false }) meetingDaySelect: MatSelect;
     
  constructor(private route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, meta: Meta, private dialog: MatDialog, private overlay: Overlay, private rmfService: RmfService)
  {
    super(title, meta);

    // Get route resolver variables.
    this.types = this.route.snapshot.data.types;
    this.days = this.route.snapshot.data.days;
    this.statistics = this.route.snapshot.data.statistics;

    // Detect Safari.
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Initialize find meeting form.
    this.findMeetingForm = new FormGroup({
      meetingType: new FormControl(['all']),
      meetingLocation: new FormControl(),
      meetingDay: new FormControl(['all'])
    });

    // Display loading icon on navigation start.
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }
        case event instanceof NavigationEnd: {
          this.loading = false;
          break;
        }
      }
    });

    this.isIreland = localStorage.getItem('isIreland');

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';

    this.setPageTitle('Recovery Meeting Finder - Alcoholics Anonymous (AA) and other 12-Step fellowships meeting finder');
    this.setPageDescription('Need a meeting? Use our interactive meeting finder map to find recovery meetings for Alcoholics Anonymous (AA), Narcotics Anonymous (NA), Cocaine Anonymous (CA) and Overeaters Anonymous (OA).');
  }

  // Check if location is allowed.
  async ngOnInit() {
    this.seoService.createLinkForCanonicalURL();
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
    permissionStatus.state === 'denied' ? this.gpsEnabled = false : true;
    localStorage.setItem('mainSidebarItem', 'information');
    localStorage.setItem('mainSidebarSubitem', 'home');

    $(window).scroll(function () {
      var height = $(window).scrollTop();
      if (height > 0)
        $('#main-sidebar-toggle').hide();
      else
        $('#main-sidebar-toggle').show();
    });
  }

  // Initialize main-sidebar events.
  ngAfterViewInit() {
    var pageWithMainSidebar = new PageWithMainSidebar();
    pageWithMainSidebar.initMainSidebarJQuery();  
  }

  // Navigate to home.
  public home() {
    window.location.href = "";
  }

  // Submits form and navigates to the find-a-meeting page.
  public onSubmit(findMeetingForm: any) : void {

    // Add location and query parameters to route.
    var routeParams = '';
    if (findMeetingForm.meetingLocation === 'Current Location') {

      // Fix. router.Navigate() was adding a trailing '/' to query params so navigate by URL.
      this.router.navigateByUrl('/find-a-meeting?lat=' + this.lat + '&lon=' + this.lng, {
        state: {
          type: findMeetingForm.meetingType,
          location: findMeetingForm.meetingLocation,
          region: 'all',
          day: findMeetingForm.meetingDay,
          distance: '5',
          accessibility: ['all'],
          open: null,
          lng: findMeetingForm.meetingLocation === 'Current Location' ? this.lng : 0,
          lat: findMeetingForm.meetingLocation === 'Current Location' ? this.lat : 0,
          venue: false
        }
      });
      return;
    }
    else if (findMeetingForm.meetingLocation !== null)
      routeParams = findMeetingForm.meetingLocation;
    routeParams = routeParams.toLowerCase();

    // Navigate to route.
    this.router.navigate(['/find-a-meeting/', routeParams], {
      state: {
        type: findMeetingForm.meetingType,
        location: findMeetingForm.meetingLocation,
        region: 'all',
        day: findMeetingForm.meetingDay,
        distance: '5',
        accessibility: ['all'],
        open: null,
        lng: findMeetingForm.meetingLocation === 'Current Location' ? this.lng : 0,
        lat: findMeetingForm.meetingLocation === 'Current Location' ? this.lat : 0
      },
    });
  }

  // Meeting type dropdown select value change event.
  public meetingTypeChange(event: any) : void {
    if (event.isUserInput) {
      var meetingType = event.source.value;
      if (meetingType === 'all') {
        // Deselect all otions except 'All'
        this.meetingTypeSelect.options.forEach((item: MatOption) => { item.deselect() });
        this.meetingTypeSelect.options.first.select();
      }
      else {
        // Deselect 'all' option.
        var selectedCount = 0;
        this.meetingTypeSelect.options.forEach((item: MatOption) => { if (item.selected) selectedCount++; });
        if (selectedCount === 0)
          this.meetingTypeSelect.options.first.select();
        else
          this.meetingTypeSelect.options.first.deselect();
      }
    }
  }

  // Meeting day dropdown select value change event.
  public meetingDayChange(event: any) : void {
    if (event.isUserInput) {
      var meetingDay = event.source.value;
      if (meetingDay === 'all') {
        // Deselect all otions except 'All'
        this.meetingDaySelect.options.forEach((item: MatOption) => { item.deselect() });
        this.meetingDaySelect.options.first.select();
      }
      else if (meetingDay === 'from now') {
        // Deselect all otions except 'From Now'
        // Having issues selecting options programmitcally by Id. So loop through all options
        // and use index to select / deselect. 
        var i = 0;
        this.meetingDaySelect.options.forEach((item: MatOption) => {
          if (i !== 1)
            item.deselect()
          else
            item.select();
          i++;
        });
      }
      else {
        // Deselect 'all' and 'from now' options.
        var i = 0;
        this.meetingDaySelect.options.forEach((item: MatOption) => {
          var index = this.getCurrentTimeHours() < 20 ? 2 : 1;
          if (i < index)
            item.deselect()
          i++;
        });
      }
    }
  }

  // Gets the current time hours.
  public getCurrentTimeHours(): number {
    // Get current time.
    var currentTime = new Date(Date.now());
    currentTime.setTime(currentTime.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
    return currentTime.getHours();
  }

  // Opens disclaimer dialog box.
  public openDisclaimerDialog(): void {
    this.dialog.open(DisclaimerDialogComponent, {
      width: '600px',
      height: 'auto',
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'custom-dialog-container',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
  }

  // Opens donations dialog box.
  public openDonationsDialog(): void {
    this.dialog.open(DonationsDialogComponent, {
      width: '600px',
      height: 'auto',
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'custom-dialog-container',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
  }

  // Gets GPS location if enabled in browser.
  public getGpsLocation() {

    this.loading = true;
    this.findMeetingForm.patchValue({
      meetingLocation: 'Fetching Location...',
    });

    this.rmfService.getPosition().then(pos => {
      // Set location.
      this.findMeetingForm.patchValue({
        meetingLocation: 'Current Location',
      });
      this.lat = pos.lat;
      this.lng = pos.lng;
      this.loading = false;
    }).catch(function (error) {
      // GPS is not available.
      this.gpsEnabled = false;
      this.loading = false;
      this.findMeetingForm.patchValue({
        meetingLocation: '',
      });
    }.bind(this));
  }

  public navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }
}
