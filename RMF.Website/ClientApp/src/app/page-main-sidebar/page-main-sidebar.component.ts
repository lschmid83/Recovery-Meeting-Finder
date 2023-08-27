import { Component, OnInit, Inject, Input } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-page-main-sidebar',
  templateUrl: './page-main-sidebar.component.html',
  styleUrls: ['./page-main-sidebar.component.scss']
})
export class PageMainSidebarComponent implements OnInit {

  public pageSearchQuery: String;

  constructor(private router: Router) {

  }

  ngOnInit() {
  }

  submitPageSearch(form: NgForm): void {
    this.router.navigateByUrl('/search/' + form.value.pageSearchQuery).then(() => {
      window.location.reload();
    });
  }
}

