import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewgeneralPageRoutingModule } from './viewgeneral-routing.module';

import { ViewgeneralPage } from './viewgeneral.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewgeneralPageRoutingModule
  ],
  declarations: [ViewgeneralPage]
})
export class ViewgeneralPageModule {}
