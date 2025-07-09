import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateviolationPageRoutingModule } from './createviolation-routing.module';

import { CreateviolationPage } from './createviolation.page';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateviolationPageRoutingModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    NgxIonicImageViewerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],

  declarations: [CreateviolationPage]
})
export class CreateviolationPageModule { }
