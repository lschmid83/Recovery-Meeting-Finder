import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageWithSidebar } from '../../page-with-sidebar';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-meeting-types',
  templateUrl: './meeting-types.component.html',
  styleUrls: ['./meeting-types.component.scss']
})

export class MeetingTypesComponent extends PageWithSidebar {

  constructor(route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, public meta: Meta) {
    super(route, title, meta);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';

    this.setPageTitle('12-Step Meeting Types - Recovery Meeting Finder');
    this.setPageDescription('Information about the different 12-Step meeting types available for Alcoholics Anonymous (AA), Cocaine Anonymous (CA), Narcotics Anonymous (NA) and Overeaters Anonymous (OA).');
  }

  ngOnInit() {
    this.seoService.createLinkForCanonicalURL();
  }

  ngAfterViewInit() {
    this.initJQuery(1, 0);
    localStorage.setItem('mainSidebarItem', 'information');
    localStorage.setItem('mainSidebarSubitem', 'meeting-types');
  }
}
