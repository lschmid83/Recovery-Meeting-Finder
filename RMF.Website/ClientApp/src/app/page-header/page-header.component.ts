import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';  
import { PageWithMainSidebar } from '../page-with-main-sidebar';

declare var $: any;

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})

export class PageHeaderComponent {

  constructor(private router: Router, private meta: Meta) {
  }

  ngAfterViewInit() {
    var pageWithMainSidebar = new PageWithMainSidebar();
    pageWithMainSidebar.initMainSidebarJQuery();
  }

  public navigateTo(url: string) : void {
     this.router.navigateByUrl(url);
  }
}
