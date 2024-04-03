import { Component, ViewChild } from '@angular/core';
import { MatOption, MatSelect } from "@angular/material";
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IType } from '../type.interface';
import { IDay } from '../day.interface';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss']
})

export class QuickSearchComponent {

  public types: IType[];
  public days: IDay[];
  public quickSearchForm: FormGroup;
  private lat = 0; lng: Number = 0;
  public isIreland: string = 'false';
  @ViewChild('meetingTypeSelect', { static: false }) meetingTypeSelect: MatSelect;
  @ViewChild('meetingDaySelect', { static: false }) meetingDaySelect: MatSelect;

  constructor(private route: ActivatedRoute, private router: Router) {

    // Get route resolver variables.
    this.types = this.route.snapshot.data.types;
    this.days = this.route.snapshot.data.days;

    // Initialize quick search form.
    this.quickSearchForm = new FormGroup({
      meetingType: new FormControl(['all']),
      meetingLocation: new FormControl(''),
      meetingDay: new FormControl(['all']),
    });

    this.isIreland = localStorage.getItem('isIreland');
  }

  // Submits form and navigates to the find-a-meeting page.
  public onSubmit(quickSearchForm): void {

    var routeParams = '';
    if (quickSearchForm.meetingLocation !== null)
      routeParams = quickSearchForm.meetingLocation;
    routeParams = routeParams.toLowerCase();

    this.router.navigate(['/find-a-meeting/', routeParams], {
      state: {
        type: quickSearchForm.meetingType,
        location: quickSearchForm.meetingLocation,
        day: quickSearchForm.meetingDay,
        region: 'all',
        distance: '5',
        accessibility: ['all'],
        open: null,
        lat: 0,
        lng: 0,
        venue: false
      }
    });
  }

  // Meeting type dropdown select value change event.
  public meetingTypeChange(event) : void {
    if (event.isUserInput) {
      var meetingType = event.source.value;
      if (meetingType === 0) {
        // Deselect all otions except 'All'
        this.meetingTypeSelect.options.forEach((item: MatOption) => { item.deselect() });
        this.meetingTypeSelect.options.first.select();
      }
      else {
        // Stop user deselecting all meeting types.
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
  public meetingDayChange(event) : void {
    if (event.isUserInput) {
      var meetingDay = event.source.value;
      if (meetingDay === 0) {
        // Deselect all otions except 'All'
        this.meetingDaySelect.options.forEach((item: MatOption) => { item.deselect() });
        this.meetingDaySelect.options.first.select();
      }
      else {
        // Stop user deselecting all meeting days.
        var selectedCount = 0;
        this.meetingDaySelect.options.forEach((item: MatOption) => { if (item.selected) selectedCount++; });
        if (selectedCount === 0)
          this.meetingDaySelect.options.first.select();
        else
          this.meetingDaySelect.options.first.deselect();
      }
    }
  }
}
