import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RejectedReportListPage } from './rejected-report-list.page';

const routes: Routes = [
  {
    path: '',
    component: RejectedReportListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RejectedReportListPageRoutingModule {}
