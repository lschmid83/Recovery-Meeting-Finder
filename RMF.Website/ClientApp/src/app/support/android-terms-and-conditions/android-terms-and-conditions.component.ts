import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageWithSidebar } from '../../page-with-sidebar';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-android-terms-and-conditions',
  templateUrl: './android-terms-and-conditions.component.html',
  styleUrls: ['./android-terms-and-conditions.component.scss']
})

export class AndroidTermsAndConditionsComponent extends PageWithSidebar {

  constructor(route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, meta: Meta) {
    super(route, title, meta);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';

    this.setPageTitle('Privacy Policy - 12-Step Recovery Guide');
    this.setPageDescription('Privacy Policy regarding the use of our app 12-Step Revovery Guide');
  }

  ngOnInit() {
    this.seoService.createLinkForCanonicalURL();
  }

  ngAfterViewInit() {
    this.initJQuery(4, 1);
    localStorage.setItem('mainSidebarItem', 'support');
    localStorage.setItem('mainSidebarSubitem', 'terms-and-conditions');
  }
}
