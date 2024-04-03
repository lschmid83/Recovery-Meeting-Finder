import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Form, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageWithSidebar } from '../../page-with-sidebar';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../../seo.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RmfService } from '../../rmf.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})

export class ContactUsComponent extends PageWithSidebar {

  public sent: boolean;
  public invalidSendAddress: boolean;
  public sending: boolean;
  public name: String;
  public email: String;
  public message: String;

  constructor(private http: HttpClient, route: ActivatedRoute, private router: Router, private seoService: SeoService, title: Title, public meta: Meta) {
    super(route, title, meta);

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';

    this.setPageTitle('Contact Us - Recovery Meeting Finder');
    this.setPageDescription('Contact information for Recovery Meeting Finder, Alcoholics Anonymous (AA), Cocaine Anonymous (CA), Narcotics Anonymous (NA) and Overeaters Anonymous (OA)');

    this.sent = false;
  }

  ngOnInit() {
    this.seoService.createLinkForCanonicalURL();
  }

  ngAfterViewInit() {
    this.initJQuery(4, 2);
    localStorage.setItem('mainSidebarItem', 'support');
    localStorage.setItem('mainSidebarSubitem', 'contact-us');

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

  validateEmail (email) {
    return email.match(
      /^[-a-zA-Z0-9_.]+@[-a-zA-Z0-9]+.[a-zA-Z]{2,4}$/
    );
  };

  submit(form: NgForm): void {

    this.sent = false;
    this.invalidSendAddress = false;
    this.sending = false;

    let service = new RmfService(this.http);
    if (form.value.name.length > 0 && form.value.message.length > 0 &&
      form.value.email !== undefined && this.validateEmail(form.value.email)) {
      this.sending = true;
      this.http.post(environment.apiUrl + '/contact/send',
        form.value,
        service.getRequestHeaders('/contact/send')
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
}
