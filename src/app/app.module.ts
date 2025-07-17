/* eslint-disable @typescript-eslint/naming-convention */
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './shared/services/login.service';
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { Interceptor } from './shared/interceptor/token.interceptor';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { DEFAULT_TIMEOUT, HttpInterceptorService } from './shared/services/http-interceptor.service';
import { Network } from '@ionic-native/network/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Downloader } from '@ionic-native/downloader/ngx';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Globalization } from '@ionic-native/globalization/ngx';
import { IonicSelectableModule } from 'ionic-selectable';

import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { NgxIonicImageViewerModule, ViewerModalComponent } from 'ngx-ionic-image-viewer';
// geolocation and native-geocoder
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
import { SQLite } from '@ionic-native/sqlite/ngx';
import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { ViewmapmodalPage } from './rakinspector/pages/modalpopup/viewmapmodal/viewmapmodal.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent,ViewmapmodalPage],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, HttpClientModule,
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
    NgIdleKeepaliveModule.forRoot(),
  ],
  providers: [
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: DEFAULT_TIMEOUT, useValue: 60000 },
    Camera,
    File,
    FileTransfer,
    MediaCapture ,
    Downloader,
    Geolocation,
    LocationAccuracy,
    NativeGeocoder,
    SQLite,
    VideoPlayer,
    VideoEditor,
    AndroidPermissions,
    StreamingMedia,
    HTTP,
    Globalization,
    InAppBrowser

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
