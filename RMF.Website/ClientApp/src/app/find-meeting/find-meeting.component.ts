import { Component } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';  
import { PageWithMainMenu } from '../page-with-main-menu';
import { SeoService } from '../seo.service';

declare var $: any;

@Component({
  selector: 'app-find-a-meeting',
  templateUrl: './find-meeting.component.html',
  styleUrls: ['./find-meeting.component.scss']
})

export class FindMeetingComponent extends PageWithMainMenu {
  constructor(private router: Router, private route: ActivatedRoute, private seoService: SeoService, title: Title, meta: Meta) {

    super(title, meta);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';

    this.setPageTitle('Find a Meeting - Search for 12-Step Meetings of Alcoholics Anonymous (AA), Cocaine Anonymous (CA), Narcotics Anonymous (NA) and Overeaters Anonymous (OA) in the United Kingdom');

    var regionName = this.router.getCurrentNavigation().extras.state.regionName;
    var location = this.router.getCurrentNavigation().extras.state.location;
    if (regionName != null)
      this.setPageDescription(this.toTitleCase(regionName) + ' recovery meetings for Alcoholics Anonymous(AA), Narcotics Anonymous(NA), Cocaine Anonymous (CA) and Overeaters Anonymous (OA).');
    else if (location != null)
      this.setPageDescription(this.toTitleCase(location) + ' recovery meetings for Alcoholics Anonymous(AA), Narcotics Anonymous(NA), Cocaine Anonymous (CA) and Overeaters Anonymous (OA).');
    else
      this.setPageDescription('Need a meeting? Use our interactive meeting finder map to find recovery meetings for Alcoholics Anonymous (AA), Narcotics Anonymous (NA), Cocaine Anonymous (CA) and Overeaters Anonymous (OA).');
  }

  // Scroll to top on load page.
  async ngOnInit() {

    this.seoService.createLinkForCanonicalURL();

    this.scrollTo('page-top');

    $(window).scroll(function () {
      var height = $(window).scrollTop();
      if (height > 0)
        $('#main-sidebar-toggle').hide();
      else
        $('#main-sidebar-toggle').show();
    });

    this.initJQuery(2, 1);
    localStorage.setItem('mainSidebarItem', 'meetings');
    localStorage.setItem('mainSidebarSubitem', 'find-a-meeting');
  }

  // Scroll to element by ID.
  public scrollTo(elementId: string): void {
    document.querySelector('#' + elementId).scrollIntoView();
  }

  public toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
}

