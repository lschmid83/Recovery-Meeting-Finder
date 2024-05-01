import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private router: Router, private httpClient: HttpClient) {
    this.getIpCountry();
  }

  private async getIpCountry() {
    // Check if visitor IP is from Ireland.
    var ipInfo = await this.httpClient.get<any>('https://jsonip.com').toPromise();
    var countryInfo = await this.httpClient.get<any>('https://api.ipgeolocation.io/ipgeo?apiKey=fc5326eedc0b466caca7602fe9dbd12f&ip=' + (ipInfo !== null ? ipInfo.ip : '')).toPromise();
    if (countryInfo !== null && countryInfo.country_name === 'Ireland')
      localStorage.setItem('isIreland', 'true');
    else
      localStorage.setItem('isIreland', 'false');

    var mainSidebarItem = localStorage.getItem('mainSidebarItem');
    if (mainSidebarItem === undefined)
      localStorage.setItem('mainSidebarItem', 'about');
  }
}
