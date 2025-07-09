import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditviolationPage } from './editviolation.page';

const routes: Routes = [
  {
    path: '',
    component: EditviolationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditviolationPageRoutingModule {}
