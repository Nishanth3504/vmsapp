import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewgeneralPage } from './viewgeneral.page';

const routes: Routes = [
  {
    path: '',
    component: ViewgeneralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewgeneralPageRoutingModule {}
