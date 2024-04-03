import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageWithSidebar } from '../../page-with-sidebar';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-self-assessments',
  templateUrl: './self-assessments.component.html',
  styleUrls: ['./self-assessments.component.scss']
})

export class SelfAssessmentsComponent extends PageWithSidebar {

  constructor(route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, public meta: Meta) {
    super(route, title, meta);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';

    this.setPageTitle('Addiction Self Assessments - Recovery Meeting Finder');
    this.setPageDescription('Addiction self assessment questionaires for newcomers to 12-Step meetings of Alcoholics Anonymous (AA), Cocaine Anonynous (CA), Narcotics Anonymous (NA) and Overeaters Anonymous (OA).');
  }

  ngOnInit() {
    this.seoService.createLinkForCanonicalURL();
  }

  ngAfterViewInit() {
    this.initJQuery(1, 2);
    localStorage.setItem('mainSidebarItem', 'information');
    localStorage.setItem('mainSidebarSubitem', 'addiction-self-assessments');
  }
}
