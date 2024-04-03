import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageWithSidebar } from '../../page-with-sidebar';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../../seo.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RmfService } from '../../rmf.service';
import { AbstractControl, FormControl, FormGroup, Form, NgForm, Validators } from '@angular/forms';
import { resolve } from 'url';

declare var $: any;

@Component({
  selector: 'app-submit-correction',
  templateUrl: './submit-correction.component.html',
  styleUrls: ['./submit-correction.component.scss']
})

export class SubmitCorrectionComponent extends PageWithSidebar {

  public name: String;
  public email: String;
  public telephone: String;
  public meetingTitle: String;
  public meetingAddress: String;
  public meetingTime: String;
  public meetingDay: String;
  public meetingCorrectionDetails: String;

  public sent: boolean;
  public invalidSendAddress: boolean;
  public sending: boolean;
  public resolvedCaptcha: boolean;
  public failedCaptcha: boolean;

  constructor(private http: HttpClient, route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, public meta: Meta) {
    super(route, title, meta);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';

    this.setPageTitle('Submit a Correction - Recovery Meeting Finder');
    this.setPageDescription('Submit a Correction for Recovery Meeting Finder, Alcoholics Anonymous (AA), Cocaine Anonymous (CA), Narcotics Anonymous (NA) and Overeaters Anonymous (OA)');

    this.meetingDay = '';

    this.sent = false;
  }

  ngOnInit() {
    this.seoService.createLinkForCanonicalURL();
  }

  ngAfterViewInit() {
    this.initJQuery(2, 4);
    localStorage.setItem('mainSidebarItem', 'meetings');
    localStorage.setItem('mainSidebarSubitem', 'submit-a-correction');

    // Fetch all the forms we want to apply custom Bootstrap validation styles to.
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission.
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }

          form.classList.add('was-validated')
        }, false)
      })
  }

  submit(form: NgForm): void {

    this.sent = false;
    this.invalidSendAddress = false;
    this.sending = false;
    this.failedCaptcha = false;

    if (!this.resolvedCaptcha) {
      this.failedCaptcha = true;
      return;
    }

    let service = new RmfService(this.http);
    if (form.value.name.length > 0 &&
      form.value.email.length > 0 &&
      form.value.telephone.length > 0 && !isNaN(form.value.telephone) &&
      form.value.meetingAddress.length > 0 &&
      form.value.meetingTime.length > 0 &&
      form.value.meetingCorrectionDetails.length > 0) {
      this.sending = true;
      this.http.post(environment.apiUrl + '/submit-correction/send',
        form.value,
        service.getRequestHeaders('/submit-correction/send')
      ).subscribe((response: any) => {
        this.sent = true;
        this.invalidSendAddress = false;
        this.sending = false;
      }, (errorResponse: any) => {
        this.sent = false;
        this.invalidSendAddress = true;
        this.sending = false;
      });
    }
  }

  resolved(captchaResponse: string) {
    this.resolvedCaptcha = true;
    //console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
}

