import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewcomplaintsPage } from './viewcomplaints.page';

const routes: Routes = [
  {
    path: '',
    component: ViewcomplaintsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewcomplaintsPageRoutingModule {}
