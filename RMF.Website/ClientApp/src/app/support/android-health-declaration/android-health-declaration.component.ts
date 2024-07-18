import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageWithSidebar } from '../../page-with-sidebar';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-android-health-declaration',
  templateUrl: './android-health-declaration.component.html',
  styleUrls: ['./android-health-declaration.component.scss']
})

export class AndroidHealthDeclarationComponent extends PageWithSidebar {

  constructor(route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, meta: Meta) {
    super(route, title, meta);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';

    this.setPageTitle('Health Declaration - 12-Step Recovery Guide');
    this.setPageDescription('Health Declaration regarding the use of our app 12-Step Recovery Guide');
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
