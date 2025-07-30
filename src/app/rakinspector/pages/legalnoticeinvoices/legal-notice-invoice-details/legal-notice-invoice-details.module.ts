import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LegalNoticeInvoiceDetailsPageRoutingModule } from './legal-notice-invoice-details-routing.module';

import { LegalNoticeInvoiceDetailsPage } from './legal-notice-invoice-details.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { IonicSelectableModule } from 'ionic-selectable';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LegalNoticeInvoiceDetailsPageRoutingModule,
     TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
    }),
    ReactiveFormsModule,
    IonicSelectableModule,
    NgxIonicImageViewerModule,
  ],
  declarations: [LegalNoticeInvoiceDetailsPage]
})
export class LegalNoticeInvoiceDetailsPageModule {}
