import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FollowupRequestPageRoutingModule } from './followup-request-routing.module';

import { FollowupRequestPage } from './followup-request.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { NgxIonicImageViewerComponent, NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FollowupRequestPageRoutingModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    NgxIonicImageViewerModule,
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps:[HttpClient]
      }
    })
  ],
  declarations: [FollowupRequestPage]
})
export class FollowupRequestPageModule {}
