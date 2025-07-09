import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LegalnoticelistPage } from './legalnoticelist.page';

const routes: Routes = [
  {
    path: '',
    component: LegalnoticelistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalnoticelistPageRoutingModule {}
