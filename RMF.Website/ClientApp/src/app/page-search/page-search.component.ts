import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../seo.service';
import { PageWithMainMenu } from '../page-with-main-menu';
import { IPageSearchResults } from '../page-search-results.interface';

@Component({
  selector: 'app-page-search',
  templateUrl: './page-search.component.html',
  styleUrls: ['./page-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class PageSearchComponent extends PageWithMainMenu {

  public searchResults: IPageSearchResults;

  constructor(private route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, public meta: Meta) {

    super(title, meta);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';

    this.setPageTitle('Search Results - Recovery Meeting Finder');
    this.setPageDescription('Search results for Recovery Meeting Finder website.');

    this.searchResults = this.route.snapshot.data.searchResults;
  }

  ngOnInit() {
    this.seoService.createLinkForCanonicalURL();
  }

  ngAfterViewInit() {
    this.initJQuery(0, 0);
    localStorage.setItem('mainSidebarItem', undefined);
    localStorage.setItem('mainSidebarSubitem', 'home');
  }

  public emptyResultSet(): Boolean {
    if (this.searchResults === null || this.searchResults.results.length === 0)
      return true;
    false;
  }
}
