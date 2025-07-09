import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatepermitPage } from './createpermit.page';

const routes: Routes = [
  {
    path: '',
    component: CreatepermitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatepermitPageRoutingModule {}
