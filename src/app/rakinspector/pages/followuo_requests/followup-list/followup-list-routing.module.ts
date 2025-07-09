import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FollowupListPage } from './followup-list.page';

const routes: Routes = [
  {
    path: '',
    component: FollowupListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FollowupListPageRoutingModule {}
