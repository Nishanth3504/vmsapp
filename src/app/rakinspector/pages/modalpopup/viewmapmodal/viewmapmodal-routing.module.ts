import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewmapmodalPage } from './viewmapmodal.page';

const routes: Routes = [
  {
    path: '',
    component: ViewmapmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewmapmodalPageRoutingModule {}
