import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageWithSidebar } from '../../page-with-sidebar';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-opening-readings',
  templateUrl: './opening-readings.component.html',
  styleUrls: ['./opening-readings.component.scss']
})

export class OpeningReadingsComponent extends PageWithSidebar {

  constructor(route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, public meta: Meta) {
    super(route, title, meta);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';

    this.setPageTitle('Opening Readings for 12-Step Meetings - Recovery Meeting Finder');
    this.setPageDescription('Opening readings for 12-Step meetings of Alcoholics Anonymous (AA), Cocaine Anonymous (CA), Narcotics Anonymous (NA) and Overeaters Anonymous (OA).');
  }

  ngOnInit() {
    this.seoService.createLinkForCanonicalURL();
  }

  ngAfterViewInit() {
    this.initJQuery(3, 0);
    localStorage.setItem('mainSidebarItem', 'readings');
    localStorage.setItem('mainSidebarSubitem', 'opening-readings');
  }
}
