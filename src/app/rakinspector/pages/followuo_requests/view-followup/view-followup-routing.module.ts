import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewFollowupPage } from './view-followup.page';

const routes: Routes = [
  {
    path: '',
    component: ViewFollowupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewFollowupPageRoutingModule {}
