import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser'; 

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(@Inject(DOCUMENT) private doc, private meta: Meta) { }

  createLinkForCanonicalURL() {
    let link: HTMLLinkElement = document.querySelector("link[rel='canonical']");
    link.setAttribute('href', this.doc.URL);
  }

  createNoIndexTag() {
     this.meta.addTag({ name: 'robots', content: 'noindex' });  
  }
} 
