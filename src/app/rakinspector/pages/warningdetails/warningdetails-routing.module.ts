import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarningdetailsPage } from './warningdetails.page';

const routes: Routes = [
  {
    path: '',
    component: WarningdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarningdetailsPageRoutingModule {}
