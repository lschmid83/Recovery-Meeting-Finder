import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageWithSidebar } from '../../page-with-sidebar';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-12-steps',
  templateUrl: './12-steps.component.html',
  styleUrls: ['./12-steps.component.scss']
})

export class TwelveStepsComponent extends PageWithSidebar {

  constructor(route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, public meta: Meta) {
    super(route, title, meta);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';

    this.setPageTitle('The 12-Steps - Recovery Meeting Finder');
    this.setPageDescription('Many members of 12-Step recovery programs have found that these steps were not merely a way to overcome addiction, but they became a guide toward a new way of life.');
  }

  ngOnInit() {
    this.seoService.createLinkForCanonicalURL();
  }

  ngAfterViewInit() {
    this.initJQuery(1, 3);
    localStorage.setItem('mainSidebarItem', 'information');
    localStorage.setItem('mainSidebarSubitem', '12-steps');
  }
}
