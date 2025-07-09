import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarninglistPage } from './warninglist.page';

const routes: Routes = [
  {
    path: '',
    component: WarninglistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarninglistPageRoutingModule {}
