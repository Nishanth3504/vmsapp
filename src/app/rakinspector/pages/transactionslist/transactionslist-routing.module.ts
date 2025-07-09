import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionslistPage } from './transactionslist.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionslistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionslistPageRoutingModule {}
