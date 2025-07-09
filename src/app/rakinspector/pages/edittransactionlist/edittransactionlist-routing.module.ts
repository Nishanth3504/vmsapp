import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EdittransactionlistPage } from './edittransactionlist.page';

const routes: Routes = [
  {
    path: '',
    component: EdittransactionlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EdittransactionlistPageRoutingModule {}
