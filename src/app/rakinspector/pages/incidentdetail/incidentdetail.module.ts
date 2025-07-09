import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentdetailPageRoutingModule } from './incidentdetail-routing.module';

import { IncidentdetailPage } from './incidentdetail.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidentdetailPageRoutingModule,
    NgxIonicImageViewerModule,
  ],
  declarations: [IncidentdetailPage]
})
export class IncidentdetailPageModule {}
