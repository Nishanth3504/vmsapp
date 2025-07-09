import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarningtoviolationsPage } from './warningtoviolations.page';

const routes: Routes = [
  {
    path: '',
    component: WarningtoviolationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarningtoviolationsPageRoutingModule {}
