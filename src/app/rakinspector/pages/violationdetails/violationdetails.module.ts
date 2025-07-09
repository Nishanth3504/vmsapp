import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViolationdetailsPageRoutingModule } from './violationdetails-routing.module';

import { ViolationdetailsPage } from './violationdetails.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { GoogleMaps } from '@ionic-native/google-maps';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViolationdetailsPageRoutingModule,
    NgxIonicImageViewerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers:[GoogleMaps,AndroidPermissions],
  declarations: [ViolationdetailsPage]
})
export class ViolationdetailsPageModule {}
