import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViolationdetailsPage } from './violationdetails.page';

const routes: Routes = [
  {
    path: '',
    component: ViolationdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViolationdetailsPageRoutingModule {}
