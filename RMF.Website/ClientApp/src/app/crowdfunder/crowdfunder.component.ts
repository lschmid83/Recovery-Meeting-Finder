import { Component } from '@angular/core';
import { SeoService } from '../seo.service';
import { Title, Meta } from '@angular/platform-browser';
import { PageWithMainMenu } from '../page-with-main-menu';

@Component({
  selector: 'app-crowdfunder',
  templateUrl: './crowdfunder.component.html',
  styleUrls: ['./crowdfunder.component.scss']
})

export class CrowdfunderComponent extends PageWithMainMenu  {
     
  constructor(private seoService: SeoService, title: Title, meta: Meta)
  {
    super(title, meta);

    this.setPageTitle('12-Step Recovery Meeting Finder Website - a Community crowdfunding project in Thornton Heath by Lawrence Schmid');
    this.setPageDescription('I am aiming to raise money for my Alcoholics Anonymous and other fellowships meeting finder website. https://www.recoverymeetingfinder.com');
  }
}
