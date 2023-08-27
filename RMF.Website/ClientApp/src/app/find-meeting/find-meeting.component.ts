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
    this.setPageDescription('Need a meeting? Use our interactive meeting finder map to find recovery meetings for Alcoholics Anonymous (AA), Narcotics Anonymous (NA) and other 12-Step fellowships.');
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
}
