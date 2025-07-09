import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermitlistPage } from './permitlist.page';

const routes: Routes = [
  {
    path: '',
    component: PermitlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermitlistPageRoutingModule {}
