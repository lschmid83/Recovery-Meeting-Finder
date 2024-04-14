import { BrowserModule, Meta } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FindMeetingComponent } from './find-meeting/find-meeting.component';
import { QuickSearchComponent } from './quick-search/quick-search.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { MapComponent } from './map/map.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { RmfService } from './rmf.service';
import { TypeResolve } from './type.resolve';
import { DayResolve } from './day.resolve';
import { AreaResolve } from './area.resolve';
import { MeetingSearchResolve } from './meeting-search.resolve';
import { TriStateCheckboxComponent } from './tri-state-checkbox/tri-state-checkbox.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from "@angular/material";
import { DetailsDialogComponent } from './dialogs/details-dialog/details-dialog.component';
import { DonationsDialogComponent } from './dialogs/donations-dialog/donations-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { CookieService } from 'ngx-cookie-service';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';
import { MobileMapComponent } from './mobile-map/mobile-map.component';
import { MobileDetailsDialogComponent } from './dialogs/mobile-details-dialog/mobile-details-dialog.component';
import { MobileSearchResultsComponent } from './mobile-search-results/mobile-search-results.component';
import { DisclaimerDialogComponent } from './dialogs/disclaimer-dialog/discliamer-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFile, faComment, faEnvelope, faFileExcel } from '@fortawesome/free-regular-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { AccessibilityDialogComponent } from './dialogs/accessibility-dialog/accessibility-dialog.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PrintHeaderComponent } from './print-header/print-header.component';
import { PrintMeetingDetailsComponent } from './print-meeting-details/print-meeting-details.component';
import { PrintSearchResultsComponent } from './print-search-results/print-search-results.component';
import { StatisticTypeResolve } from './statistic-type.resolve';
import { StatisticCountryResolve } from './statistic-country.resolve';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ClusterMapComponent } from './cluster-map/cluster-map.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PageMainMenuComponent } from './page-main-menu/page-main-menu.component';
import { MeetingTypesComponent } from './information/meeting-types/meeting-types.component';
import { SeoService } from './seo.service';
import { NewcomersComponent } from './information/newcomers/newcomers.component';
import { SelfAssessmentsComponent } from './information/self-assessments/self-assessments.component';
import { TwelveStepsComponent } from './information/12-steps/12-steps.component';
import { TwelveTraditionsComponent } from './information/12-traditions/12-traditions.component';
import { TwelveConceptsComponent } from './information/12-concepts/12-concepts.component';
import { HistoryComponent } from './information/history/history.component';
import { WhatToExpectComponent } from './meetings/what-to-expect/what-to-expect.component';
import { StatisticsComponent } from './meetings/statistics/statistics.component';
import { DataDumpsComponent } from './meetings/data-dumps/data-dumps.component';
import { PageMainSidebarComponent } from './page-main-sidebar/page-main-sidebar.component';
import { OpeningReadingsComponent } from './readings/opening-readings/opening-readings.component';
import { ClosingReadingsComponent } from './readings/closing-readings/closing-readings.component';
import { BasicTextsComponent } from './readings/basic-texts/basic-texts.component';
import { PrayersComponent } from './readings/prayers/prayers.component';
import { TermsAndConditionsComponent } from './support/terms-and-conditions/terms-and-conditions.component';
import { FrequentlyAskedQuestionsComponent } from './support/frequently-asked-questions/frequently-asked-questions.component';
import { ContactUsComponent } from './support/contact-us/contact-us.component';
import { PageSearchResolve } from './page-search.resolve';
import { PageSearchComponent } from './page-search/page-search.component';
import { DataDumpResolve } from './data-dump.resolve';
import { SubmitCorrectionComponent } from './meetings/submit-correction/submit-correction.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { FooterComponent } from './footer/footer.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    PageHeaderComponent,
    HomeComponent,
    FindMeetingComponent,
    QuickSearchComponent,
    AdvancedSearchComponent,
    MapComponent,
    SearchResultsComponent,
    StatisticsComponent,
    MobileSearchResultsComponent,
    TriStateCheckboxComponent,
    DetailsDialogComponent,
    DonationsDialogComponent,
    CookieConsentComponent,
    MobileMapComponent,
    MobileDetailsDialogComponent,
    DisclaimerDialogComponent,
    AccessibilityDialogComponent,
    PrintHeaderComponent,
    PrintMeetingDetailsComponent,
    PrintSearchResultsComponent,
    ClusterMapComponent,
    PageMainSidebarComponent,
    PageMainMenuComponent,
    MeetingTypesComponent,
    NewcomersComponent,
    SelfAssessmentsComponent,
    TwelveStepsComponent,
    TwelveTraditionsComponent,
    TwelveConceptsComponent,
    HistoryComponent,
    WhatToExpectComponent,
    DataDumpsComponent,
    OpeningReadingsComponent,
    ClosingReadingsComponent,
    BasicTextsComponent,
    PrayersComponent,
    TermsAndConditionsComponent,
    FrequentlyAskedQuestionsComponent,
    ContactUsComponent,
    PageSearchComponent,
    SubmitCorrectionComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxChartsModule,
    RecaptchaModule,
    RecaptchaFormsModule, // if you need forms support
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent,
        resolve: {
          types: TypeResolve,
          days: DayResolve,
          statistics: StatisticTypeResolve
        },
        pathMatch: 'full',
      },
      {
        path: 'find-a-meeting',
        component: FindMeetingComponent,
        resolve: {
          types: TypeResolve,
          days: DayResolve,
          areas: AreaResolve,
          searchResults: MeetingSearchResolve
        },
        pathMatch: 'full',
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'find-a-meeting/:location',
        component: FindMeetingComponent,
        resolve: {
          types: TypeResolve,
          days: DayResolve,
          areas: AreaResolve,
          searchResults: MeetingSearchResolve
        },
        pathMatch: 'full',
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'meetings-at-location',
        component: FindMeetingComponent,
        resolve: {
          types: TypeResolve,
          days: DayResolve,
          areas: AreaResolve,
          searchResults: MeetingSearchResolve
        },
        pathMatch: 'full',
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'mobile-map',
        component: MobileMapComponent,
        pathMatch: 'full',
      },
      {
        path: 'cluster-map',
        component: ClusterMapComponent,
        pathMatch: 'full',
      },
      {
        path: 'mobile-search-results',
        component: MobileSearchResultsComponent,
        pathMatch: 'full',
      },
      {
        path: 'print-meeting-details',
        component: PrintMeetingDetailsComponent,
        pathMatch: 'full'
      },
      {
        path: 'print-search-results',
        component: PrintSearchResultsComponent,
        pathMatch: 'full'
      },
      {
        path: 'information/12-step-meeting-types',
        component: MeetingTypesComponent,
        pathMatch: 'full',
      },
      {
        path: 'information/newcomers',
        component: NewcomersComponent,
        pathMatch: 'full',
      },
      {
        path: 'information/addiction-self-assessments',
        component: SelfAssessmentsComponent,
        pathMatch: 'full'
      },
      {
        path: 'information/12-steps',
        component: TwelveStepsComponent,
        pathMatch: 'full'
      },
      {
        path: 'information/12-traditions',
        component: TwelveTraditionsComponent,
        pathMatch: 'full'
      },
      {
        path: 'information/12-concepts',
        component: TwelveConceptsComponent,
        pathMatch: 'full'
      },
      {
        path: 'information/history-of-12-step-fellowships',
        component: HistoryComponent,
        pathMatch: 'full',
      },
      {
        path: 'meetings/what-to-expect',
        component: WhatToExpectComponent,
        pathMatch: 'full'
      },
      {
        path: 'meetings/statistics',
        component: StatisticsComponent,
        resolve: {
          types: TypeResolve,
          days: DayResolve,
          typeStatistics: StatisticTypeResolve,
          countryStatistics: StatisticCountryResolve
        },
        pathMatch: 'full',
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'meetings/data-dumps',
        component: DataDumpsComponent,
        resolve: {
          dataDumps: DataDumpResolve
        },
        pathMatch: 'full',
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'meetings/submit-a-correction',
        component: SubmitCorrectionComponent,
        pathMatch: 'full',
      },
      {
        path: 'readings/opening-readings',
        component: OpeningReadingsComponent,
        pathMatch: 'full'
      },
      {
        path: 'readings/closing-readings',
        component: ClosingReadingsComponent,
        pathMatch: 'full'
      },
      {
        path: 'readings/basic-texts',
        component: BasicTextsComponent,
        pathMatch: 'full'
      },
      {
        path: 'readings/prayers',
        component: PrayersComponent,
        pathMatch: 'full'
      },
      {
        path: 'support/terms-and-conditions',
        component: TermsAndConditionsComponent,
        pathMatch: 'full',
      },
      {
        path: 'support/frequently-asked-questions',
        component: FrequentlyAskedQuestionsComponent,
        pathMatch: 'full',
      },
      {
        path: 'support/contact-us',
        component: ContactUsComponent,
        pathMatch: 'full',
      },
      {
        path: 'search',
        component: PageSearchComponent,
        resolve: {
          types: TypeResolve,
          days: DayResolve,
          searchResults: PageSearchResolve
        },
        pathMatch: 'full',
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'search/:query',
        component: PageSearchComponent,
        resolve: {
          types: TypeResolve,
          days: DayResolve,
          searchResults: PageSearchResolve
        },
        pathMatch: 'full',
        runGuardsAndResolvers: 'always',
      },
      {
        path: '**', redirectTo: '/'
      }
    ], { onSameUrlNavigation: 'reload' }),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatIconModule,
    LeafletMarkerClusterModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-EN' },
    RmfService,
    SeoService,
    TypeResolve,
    DayResolve,
    StatisticTypeResolve,
    StatisticCountryResolve,
    AreaResolve,
    MeetingSearchResolve,
    PageSearchResolve,
    DataDumpResolve,
    CookieService,
    Meta,
    DeviceDetectorService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [DisclaimerDialogComponent, DonationsDialogComponent, DetailsDialogComponent, MobileDetailsDialogComponent, AccessibilityDialogComponent]
})

export class AppModule {
  constructor() {
    library.add(faFile, faComment, faEnvelope, faFileExcel, faWhatsapp);
  }
}
