import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RaisecomplaintPage } from './raisecomplaint.page';

const routes: Routes = [
  {
    path: '',
    component: RaisecomplaintPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaisecomplaintPageRoutingModule {}
