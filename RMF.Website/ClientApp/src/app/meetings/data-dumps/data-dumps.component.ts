import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageWithSidebar } from '../../page-with-sidebar';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../../seo.service';
import { IDataDumpResults } from '../../data-dump-results.interface';

@Component({
  selector: 'app-data-dumps',
  templateUrl: './data-dumps.component.html',
  styleUrls: ['./data-dumps.component.scss']
})

export class DataDumpsComponent extends PageWithSidebar {

  public dataDumps: IDataDumpResults;

  constructor(route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, public meta: Meta) {
    super(route, title, meta);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';

    this.setPageTitle('Monthly Data Dumps for 12-Step Meetings - Recovery Meeting Finder');
    this.setPageDescription('Monthly data dumps provided in CSV format for 12-Step meetings of Alcoholics Anonymous (AA), Cocaine Anonymous (CA), Narcotics Anonymous (NA) and Overeaters Anonymous (OA)');

    this.dataDumps = route.snapshot.data.dataDumps;
  }

  ngOnInit() {
    this.seoService.createLinkForCanonicalURL();
  }

  ngAfterViewInit() {
    this.initJQuery(2, 3);
    localStorage.setItem('mainSidebarItem', 'meetings');
    localStorage.setItem('mainSidebarSubitem', 'data-dumps');
  }
}
