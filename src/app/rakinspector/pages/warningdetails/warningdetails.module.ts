import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WarningdetailsPageRoutingModule } from './warningdetails-routing.module';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { WarningdetailsPage } from './warningdetails.page';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { GoogleMaps } from '@ionic-native/google-maps';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WarningdetailsPageRoutingModule,
    NgxIonicImageViewerModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [WarningdetailsPage]
})
export class WarningdetailsPageModule {}
