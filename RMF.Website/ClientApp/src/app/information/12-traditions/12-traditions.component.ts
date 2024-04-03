import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageWithSidebar } from '../../page-with-sidebar';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-12-traditions',
  templateUrl: './12-traditions.component.html',
  styleUrls: ['./12-traditions.component.scss']
})

export class TwelveTraditionsComponent extends PageWithSidebar {

  constructor(route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, public meta: Meta) {
    super(route, title, meta);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';

    this.setPageTitle('The 12 Traditions - Recovery Meeting Finder');
    this.setPageDescription('The 12-Traditions of 12-Step programs provide guidelines for relationships between the twelve-step groups, members, other groups, the global fellowship, and society at large.');
  }

  ngOnInit() {
    this.seoService.createLinkForCanonicalURL();
  }

  ngAfterViewInit() {
    this.initJQuery(1, 4);
    localStorage.setItem('mainSidebarItem', 'information');
    localStorage.setItem('mainSidebarSubitem', '12-traditions');
  }
}
