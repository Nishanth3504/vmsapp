import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LegalNoticeInvoiceListPageRoutingModule } from './legal-notice-invoice-list-routing.module';

import { LegalNoticeInvoiceListPage } from './legal-notice-invoice-list.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LegalNoticeInvoiceListPageRoutingModule,
    TranslateModule.forRoot({
              loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
              }
            }),
  ],
  declarations: [LegalNoticeInvoiceListPage]
})
export class LegalNoticeInvoiceListPageModule {}
