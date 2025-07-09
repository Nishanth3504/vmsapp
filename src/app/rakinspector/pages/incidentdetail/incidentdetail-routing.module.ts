import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentdetailPage } from './incidentdetail.page';

const routes: Routes = [
  {
    path: '',
    component: IncidentdetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentdetailPageRoutingModule {}
