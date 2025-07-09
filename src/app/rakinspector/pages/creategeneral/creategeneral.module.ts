import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreategeneralPageRoutingModule } from './creategeneral-routing.module';

import { CreategeneralPage } from './creategeneral.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from 'src/app/app.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreategeneralPageRoutingModule,
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
  declarations: [CreategeneralPage]
})
export class CreategeneralPageModule {}
