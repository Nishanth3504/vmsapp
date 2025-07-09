import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComplaintdetailsPage } from './complaintdetails.page';

const routes: Routes = [
  {
    path: '',
    component: ComplaintdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplaintdetailsPageRoutingModule {}
