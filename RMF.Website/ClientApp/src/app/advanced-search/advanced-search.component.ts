import { Component, ViewChild } from '@angular/core';
import { MatOption, MatSelect, MatTooltip, MatSelectChange } from "@angular/material";
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, NavigationEnd, NavigationStart } from '@angular/router';
import { IType } from '../type.interface';
import { IDay } from '../day.interface';
import { IArea } from '../area.interface';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import { RmfService } from '../rmf.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  providers: [
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' }
  ],
})

export class AdvancedSearchComponent {

  public types: IType[];
  public days: IDay[];
  public areas: IArea[];
  public advancedSearchForm: FormGroup;
  public openCheckboxTooltip: string;
  public gpsEnabled: Boolean = true;
  public loading: boolean = false;

  private lat = 0; lng: Number = 0;
  private selectedRegion: string;
  public isIreland: string = 'false';

  // Use ViewChild to set selected options in <select> elements.
  @ViewChild('meetingTypeSelect', { static: false }) meetingTypeSelect: MatSelect;
  @ViewChild('meetingDaySelect', { static: false }) meetingDaySelect: MatSelect;
  @ViewChild('meetingDistanceSelect', { static: false }) meetingDistanceSelect: MatSelect;
  @ViewChild('meetingAccessibilitySelect', { static: false }) meetingAccessibilitySelect: MatSelect;
  @ViewChild('meetingRegionSelect', { static: false }) meetingRegionSelect: MatSelect;
  @ViewChild('tp', { static: false }) _matTooltip: MatTooltip;

  constructor(private route: ActivatedRoute, private router: Router, private rmfService: RmfService) {

    // Get route resolver variables.
    this.types = this.route.snapshot.data.types;
    this.days = this.route.snapshot.data.days;
    this.areas = this.route.snapshot.data.areas;

    // Initialize advanced search form.
    this.advancedSearchForm = new FormGroup({
      meetingType: new FormControl(this.router.getCurrentNavigation().extras.state.type),
      meetingLocation: new FormControl(this.router.getCurrentNavigation().extras.state.location),
      meetingRegion: new FormControl(this.router.getCurrentNavigation().extras.state.region),
      meetingDay: new FormControl(this.router.getCurrentNavigation().extras.state.day),
      meetingDistance: new FormControl(this.router.getCurrentNavigation().extras.state.distance),
      meetingAccessibility: new FormControl(this.router.getCurrentNavigation().extras.state.accessibility),
      meetingOpen: new FormControl(this.router.getCurrentNavigation().extras.state.open)
    });

    this.selectedRegion = this.router.getCurrentNavigation().extras.state.regionName;

    // Store GPS locaiton if specified.
    this.lat = this.router.getCurrentNavigation().extras.state.lat;
    this.lng = this.router.getCurrentNavigation().extras.state.lng;

    // Set open checkbox tooltip.
    this.setOpenCheckboxTooltip();

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
  }

  // Check if location is allowed.
  async ngOnInit() {
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
    permissionStatus.state === 'denied' ? this.gpsEnabled = false : true;
  }

  // Submits form and navigates to the find-a-meeting page.
  public onSubmit(advancedSearchForm) : void {

    // Add location and query parameters to route.
    var routeParams = '';
    if (advancedSearchForm.meetingLocation === 'Current Location') {
      this.router.navigateByUrl('/find-a-meeting?lat=' + this.lat + '&lon=' + this.lng, {
        state: {
          type: advancedSearchForm.meetingType,
          location: advancedSearchForm.meetingLocation,
          region: 'all',
          day: advancedSearchForm.meetingDay,
          distance: advancedSearchForm.meetingDistance,
          accessibility: advancedSearchForm.meetingAccessibility,
          open: advancedSearchForm.meetingOpen,
          lng: this.lng,
          lat: this.lat,
          venue: false
        }
      });
      return;
    }
    else {
      if (this.selectedRegion !== null && this.selectedRegion !== 'Select a Region')
        routeParams += this.selectedRegion;
      else if (advancedSearchForm.meetingLocation !== null)
        routeParams += advancedSearchForm.meetingLocation;
    }
    routeParams = routeParams.toLowerCase();

    this.router.navigate(['/find-a-meeting/', routeParams], {
      state: {
        type: advancedSearchForm.meetingType,
        location: advancedSearchForm.meetingLocation,
        day: advancedSearchForm.meetingDay,
        region: advancedSearchForm.meetingRegion,
        distance: advancedSearchForm.meetingDistance,
        accessibility: advancedSearchForm.meetingAccessibility,
        open: advancedSearchForm.meetingOpen,
        lat: advancedSearchForm.meetingLocation === 'Current Location' ? this.lat : 0,
        lng: advancedSearchForm.meetingLocation === 'Current Location' ? this.lng : 0,
        venue: false
      }
    });
  }

  // Meeting location input value change event.
  public meetingLocationChange(event) : void {
    var meetingLocation = this.advancedSearchForm.controls.meetingLocation.value;
    var meetingRegion = this.advancedSearchForm.controls.meetingRegion.value;
    this.meetingDistanceSelect.disabled = false;
    // Disable 'Distance' selection if no location is entered and region selected.
    if (meetingLocation === '' && meetingRegion !== 'all')
      this.meetingDistanceSelect.disabled = true;
      this.selectedRegion = null;
    // Clear region selection if location entered.
    this.advancedSearchForm.patchValue({
      meetingRegion: 'all',
    });    
  }

  // Meeting region dropdown select value change event.
  public meetingRegionChange(event): void {
    if (event.isUserInput) {
      var meetingRegion = event.source.value;
      // Enable 'Distance' selection if region is not selected.
      if (meetingRegion === 'all') {
        this.meetingDistanceSelect.disabled = false;
        this.selectedRegion = null;
      }
      else {
        // Disable 'Distance' selection if region is selected.
        this.meetingDistanceSelect.disabled = true;
        this.advancedSearchForm.patchValue({
          meetingLocation: '',
        });
      }
    }
  }

  // Meeting region selected in dropdown list.
  public meetingRegionSelected(event: MatSelectChange) {
    this.selectedRegion = event.source.triggerValue;
  }

  // Meeting type dropdown select value change event.
  public meetingTypeChange(event) : void {
    if (event.isUserInput) {
      var meetingType = event.source.value;
      if (meetingType === 'all') {
        // Deselect all otions except 'All'
        this.meetingTypeSelect.options.forEach((item: MatOption) => { item.deselect() });
        this.meetingTypeSelect.options.first.select();
      }
      else {
        // Deselect 'all' meeting types option.
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
  public meetingDayChange(event: any): void {
    if (event.isUserInput) {
      var meetingDay = event.source.value;
      if (meetingDay === 'all') {
        // Deselect all otions except 'All'
        this.meetingDaySelect.options.forEach((item: MatOption) => { item.deselect() });
        this.meetingDaySelect.options.first.select();
      }
      else if (meetingDay === 'from now') {
        // Deselect all otions except 'From Now'
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

  // Meeting accessibility dropdown select value change event.
  public meetingAccessibilityChange(event) : void {
    if (event.isUserInput) {
      var meetingAccessibility = event.source.value;
      if (meetingAccessibility === 'all') {
        // Deselect all otions except 'All'
        this.meetingAccessibilitySelect.options.forEach((item: MatOption) => { item.deselect() });
        this.meetingAccessibilitySelect.options.first.select();
      }
      else {
        // Stop user deselecting all meeting accessibility options.
        var selectedCount = 0;
        this.meetingAccessibilitySelect.options.forEach((item: MatOption) => { if (item.selected) selectedCount++; });
        if (selectedCount === 0)
          this.meetingAccessibilitySelect.options.first.select();
        else 
          this.meetingAccessibilitySelect.options.first.deselect();
      }
    }
  }

  // Meeting open checkbox value change event.
  public meetingOpenChange(): void {
    // Set and display tooltip.
    this.setOpenCheckboxTooltip();
    this._matTooltip.show();
  }

  // Sets meeting open checkbox tooltip.
  public setOpenCheckboxTooltip() : void {
    // Set value of open checkbox tooltip based on selection.
    var meetingOpenCheckboxValue = this.advancedSearchForm.get('meetingOpen').value;
    if (meetingOpenCheckboxValue === null) {
      this.openCheckboxTooltip = "Either open or closed meetings";
    }
    else if (meetingOpenCheckboxValue === false) {
      this.openCheckboxTooltip = "Only closed meetings";
    }
    else if (meetingOpenCheckboxValue === true) {
      this.openCheckboxTooltip = "Only open meetings (sometimes on request or certain days)";
    }
  }

  // Gets GPS location if enabled in browser.
  public getGpsLocation() {

    this.advancedSearchForm.patchValue({
      meetingLocation: 'Fetching Location...',
    });
    this.loading = true;
    this.rmfService.getPosition().then(pos => {
      // Set location.
      this.advancedSearchForm.patchValue({
        meetingLocation: 'Current Location',
      });
      // Clear region selection if location entered.
      this.advancedSearchForm.patchValue({
        meetingRegion: 'all',
      });  
      this.lat = pos.lat;
      this.lng = pos.lng;
      this.loading = false;
    }).catch(function (error) {
      // GPS is not available.
      this.gpsEnabled = false;
      this.loading = false;
      this.advancedSearchForm.patchValue({
        meetingLocation: '',
      });
    }.bind(this));
  }
}
