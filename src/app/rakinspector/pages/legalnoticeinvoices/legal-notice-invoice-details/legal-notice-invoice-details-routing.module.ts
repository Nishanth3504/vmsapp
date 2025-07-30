import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LegalNoticeInvoiceDetailsPage } from './legal-notice-invoice-details.page';

const routes: Routes = [
  {
    path: '',
    component: LegalNoticeInvoiceDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalNoticeInvoiceDetailsPageRoutingModule {}
