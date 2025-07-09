import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreategeneralPage } from './creategeneral.page';

const routes: Routes = [
  {
    path: '',
    component: CreategeneralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreategeneralPageRoutingModule {}
