import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewmapmodalPageRoutingModule } from './viewmapmodal-routing.module';

import { ViewmapmodalPage } from './viewmapmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewmapmodalPageRoutingModule
  ],
  declarations: [ViewmapmodalPage]
})
export class ViewmapmodalPageModule {}
