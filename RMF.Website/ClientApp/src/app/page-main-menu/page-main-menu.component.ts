import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';  
import { NgForm } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-page-main-menu',
  templateUrl: './page-main-menu.component.html',
  styleUrls: ['./page-main-menu.component.scss']
})

export class PageMainMenuComponent {

  public pageSearchQuery: String;

  constructor(private router: Router, private meta: Meta) {
  }

  ngAfterViewInit() {
  }

  submitPageSearch(form: NgForm): void {
    this.router.navigateByUrl('/search/' + form.value.pageSearchQuery).then(() => {
      window.location.reload();
    });
  }
}
