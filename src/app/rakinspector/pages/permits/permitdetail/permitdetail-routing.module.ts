import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermitdetailPage } from './permitdetail.page';

const routes: Routes = [
  {
    path: '',
    component: PermitdetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermitdetailPageRoutingModule {}
