import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {

  public cookieConsent: String;
  public hideCookieNotice = '';

  constructor(private cookieService: CookieService) {
  }

  // Handles cookie consent validation.
  ngOnInit(): void {
    this.cookieConsent = this.cookieService.get('cookie-consent');
    this.setCookie({ name: 'cookie-consent', value: '1', expireDays: 365 });
  }

  // Hides cookie notice.
  public hideNotice(): void {
    this.hideCookieNotice = 'hide-cookie-notice';
    this.setCookie({ name: 'cookie-consent', value: '1', expireDays: 365 });
  }

  public setCookie(params: any) {
    let d: Date = new Date();
    d.setTime(
      d.getTime() +
      (params.expireDays ? params.expireDays : 1) * 24 * 60 * 60 * 1000
    );
    document.cookie =
      (params.name ? params.name : '') +
      '=' +
      (params.value ? params.value : '') +
      ';' +
      (params.session && params.session === true
        ? ''
        : 'expires=' + d.toUTCString() + ';') +
      'path=' +
      (params.path && params.path.length > 0 ? params.path : '/') +
      ';' +
      (location.protocol === 'https:' && params.secure && params.secure === true
        ? 'secure'
        : '');
  }
}
