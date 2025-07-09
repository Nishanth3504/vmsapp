import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateviolationPage } from './createviolation.page';

const routes: Routes = [
  {
    path: '',
    component: CreateviolationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateviolationPageRoutingModule {}
