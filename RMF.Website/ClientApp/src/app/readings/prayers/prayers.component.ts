import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageWithSidebar } from '../../page-with-sidebar';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-prayers',
  templateUrl: './prayers.component.html',
  styleUrls: ['./prayers.component.scss']
})

export class PrayersComponent extends PageWithSidebar {

  constructor(route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, public meta: Meta) {
    super(route, title, meta);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';

    this.setPageTitle('Prayers for 12-Step Meetings - Recovery Meeting Finder');
    this.setPageDescription('Prayers for 12-Step Meetings of Alcoholics Anonymous (AA), Cocaine Anonymous (CA), Narcotics Anonymous (NA) and Overeaters Anonymous (OA).');
  }

  ngOnInit() {
    this.seoService.createLinkForCanonicalURL();
  }

  ngAfterViewInit() {
    this.initJQuery(3, 3);
    localStorage.setItem('mainSidebarItem', 'readings');
    localStorage.setItem('mainSidebarSubitem', 'prayers');
  }
}
