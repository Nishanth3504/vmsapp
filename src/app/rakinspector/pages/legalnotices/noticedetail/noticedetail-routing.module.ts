import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoticedetailPage } from './noticedetail.page';

const routes: Routes = [
  {
    path: '',
    component: NoticedetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoticedetailPageRoutingModule {}
