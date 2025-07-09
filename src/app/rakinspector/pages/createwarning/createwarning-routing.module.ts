import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatewarningPage } from './createwarning.page';

const routes: Routes = [
  {
    path: '',
    component: CreatewarningPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatewarningPageRoutingModule {}
