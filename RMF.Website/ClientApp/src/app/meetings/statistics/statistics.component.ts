import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { IStatisticTypeResults } from '../../statistic-type-results.interface';
import { IType } from '../../type.interface';
import { IStatisticCountryResults } from '../../statistic-country-results.interface';
import { PageWithSidebar } from '../../page-with-sidebar';
import { SeoService } from '../../seo.service';

// JQuery selector.
declare var $: any;

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})

export class StatisticsComponent extends PageWithSidebar {

  // Resolver data.
  public types: IType[];
  public statisticCountryResults: IStatisticCountryResults;
  public statisticTypeResults: IStatisticTypeResults;

  // Statistic data.
  public totalAaMeetingsByCountry: any[];
  public totalCaMeetingsByCountry: any[];
  public totalNaMeetingsByCountry: any[];
  public totalOaMeetingsByCountry: any[];
  public totalMeetingsByOrganisation: any[];

  // Chart options.
  public view: any[] = [700, 400];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = true;
  public xAxisTypeLabel = 'Meeting type';
  public xAxisCountryLabel = 'Country';
  public showYAxisLabel = true;
  public yAxisTotalLabel = 'Number of meetings';

  // Pie chart options.
  public showLabels: boolean = true;
  public isDoughnut: boolean = false;

  public colorScheme = {
    domain: ['#253679', '#000000', '#ff2701', '#22b14d', '#FFA500']
  };

  constructor(route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, meta: Meta) {

    super(route, title, meta);

    this.setPageTitle('12-Step Meeting Statistics | Recovery Meeting Finder');
    this.setPageDescription('Statistics page for the number of 12-Step meetings of Alcoholics Anonymous (AA), Cocaine Anonymous (CA), Narcotics Anonymous (NA) and Overeaters Anonymous (AA).');

    // Get route resolver data.
    this.types = route.snapshot.data.types;
    this.statisticCountryResults = route.snapshot.data.countryStatistics;
    this.statisticTypeResults = route.snapshot.data.typeStatistics;

    // Get statistic data.
    this.totalAaMeetingsByCountry = this.getTotalMeetingsByCountry('AA');
    this.totalCaMeetingsByCountry = this.getTotalMeetingsByCountry('CA');
    this.totalNaMeetingsByCountry = this.getTotalMeetingsByCountry('NA');
    this.totalOaMeetingsByCountry = this.getTotalMeetingsByCountry('OA');
    this.totalMeetingsByOrganisation = this.getTotalMeetingsByOrganisation();

    // Assign statistic data to chart object.
    Object.assign(this.totalAaMeetingsByCountry);
    Object.assign(this.totalMeetingsByOrganisation);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';
  }

  public getTotalMeetingsByCountry(type: string): any[] {

    var results = [];

    // Loop through statistic countries.
    this.statisticCountryResults.meetingCountries.forEach(function (meetingCountry) {

      // Loop through statistic country meeting types.
      meetingCountry.meetingTypes.forEach(function (meetingType) {

        // If selected meeting type.
        if (meetingType.type === type) {
          var countryStats = {
            name: meetingCountry.country,
            value: meetingType.total
          }

          // Add country stats to results array.
          results.push(countryStats);
        }
      });
    });

    return results;
  }

  public getTotalMeetingsByOrganisation(): any[] {

    var results = [];

    // Loop through meeting types.
    this.statisticTypeResults.meetingTypes.forEach(function (meetingType) {

      // Get meeting type short name.
      var type = this.types.find((obj) => {
        return obj.shortName === meetingType.type;
      });

      // Add meeting type and total to results.
      var organisationStats = {
        name: type.shortName,
        value: meetingType.total
      };

      // Add meeting type to results.
      results.push(organisationStats);

    }.bind(this));

    return results;
  }

  ngOnInit() {

    this.seoService.createLinkForCanonicalURL();

    // Resize window to redraw charts on init.
    window.dispatchEvent(new Event('resize'));
  }

  ngAfterViewInit() {
    this.initJQuery(2, 2);
    localStorage.setItem('mainSidebarItem', 'meetings');
    localStorage.setItem('mainSidebarSubitem', 'statistics');
  }

  public downloadStatistics() {
    window.location.href = '/data-dump/statistics.csv';
  }

  public resizeChart(width: any, height: any): void {
    this.view = [width, height];
  }

  public onSelect(data): void {
  }

  public onActivate(data): void {
  }

  public onDeactivate(data): void {
  }
}
