import { Component, ChangeDetectorRef } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ModuleService } from './shared/services/module.service';
import { LoginService } from './shared/services/login.service';
import { ConnectivityService } from './shared/services/offline-code/connectivity.service';
import { DbService } from './shared/services/offline-code/db.service';
import { ToastService } from './shared/services/toast.service';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpBackend, HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { AuthenticationService } from './shared/services/authentication.service';
import { Keepalive } from '@ng-idle/keepalive';
import { AutoLogoutService } from './shared/services/auto-logout.service';
import { HTTP } from '@ionic-native/http/ngx';
///declare var IRoot: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  file = new File();
  percentDone: any;
  idleState = 'Not started.'; // any text 
  timedOut = false;
  lastPing?: Date = null;
  constructor(private network: Network, public toastService: ToastService, private moduleService: ModuleService, private loginService: LoginService,
    private dbservice: DbService, private connectivity: ConnectivityService, httpBackend: HttpBackend, public geolocation: Geolocation,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy, private platform: Platform, private auth: AuthenticationService,
    private route: ActivatedRoute, private router: Router, private cref: ChangeDetectorRef, private idle: Idle, private keepalive: Keepalive, private autoService: AutoLogoutService
    ,private http: HTTP
    ) {
       this.initializeApp();
    // platform.ready().then(() => {

    //   if (typeof (IRoot) !== 'undefined' && IRoot) {
    //     IRoot.isRooted((data) => {
    //       if (data && data == 1) {
    //         navigator['app'].exitApp();
    //       } else {
    //       }
    //     }, (data) => {
    //     });
    //   }
    // });
    // this.platform.ready()
    //   .then(() => {
    //     this.http.setServerTrustMode("pinned") //<=== Add this function 
    //       .then(() => {
    //         console.log("Congratulaions, you have set up SSL Pinning.")
    //       })
    //       .catch(() => {
    //         console.error("Opss, SSL pinning failed.")
    //       });
    //   })
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        var listContent, i;
        var listIonFooter, j;
        var listIonHeader, k;
        listContent = document.querySelectorAll('ion-content');
        var setLanguage = window.localStorage.getItem('language');
        for (i = 0; i < listContent.length; i++) {
          if (setLanguage == 'ar') {
            listContent[i].classList.remove('en')
            listContent[i].classList.add('ar');
          }
          else {
            listContent[i].classList.remove('ar')
            listContent[i].classList.add('en');
          }
        }

        listIonFooter = document.querySelectorAll('ion-footer');
        var setLanguage = window.localStorage.getItem('language');
        for (i = 0; i < listIonFooter.length; i++) {
          if (setLanguage == 'ar') {
            listIonFooter[i].classList.remove('en')
            listIonFooter[i].classList.add('ar');
          }
          else {
            listIonFooter[i].classList.remove('ar')
            listIonFooter[i].classList.add('en');
          }
        }

        listIonHeader = document.querySelectorAll('ion-header');
        var setLanguage = window.localStorage.getItem('language');
        for (i = 0; i < listIonHeader.length; i++) {
          if (setLanguage == 'ar') {
            listIonHeader[i].classList.remove('en')
            listIonHeader[i].classList.add('ar');
          }
          else {
            listIonHeader[i].classList.remove('ar')
            listIonHeader[i].classList.add('en');
          }
        }
      }
      this.cref.detectChanges();
      this.initTimer();
      this.reset();

    });
    
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.toastService.showWarning('network was disconnected', 'Warning');
      localStorage.setItem('isOnline', "false");
      this.initTimer();
      this.reset();
    }),
      (error) => {
        console.log(error)
      };

    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      localStorage.setItem('isOnline', "true");
      this.listusers();
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
          this.toastService.showSuccess('we got a wifi connection, woohoo!', 'Success');
        }
      }, 3000);
      this.initTimer();
      this.reset();
    }),
      (error) => {
        console.log(error)
      };



    this.connectivity.appIsOnline$.subscribe(async online => {

      console.log(online)

      if (online) {
        localStorage.setItem('isOnline', "true");
        this.listusers();
        this.checkPermission();
      }
      else {
        localStorage.setItem('isOnline', "false");
      }
    })
  }

  checkPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.enableGPS();
        } else {
          this.locationAccPermission();
        }
      },
      error => {
      }
    );
  }

  locationAccPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              this.enableGPS();
            },
            error => {
            }
          );
      }
    });
  }

  enableGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        localStorage.setItem("locationserviceenabled", "true")
      },
      error => localStorage.setItem("locationserviceenabled", "false")
    );
  }

  listusers() {
    this.loginService.listusers().subscribe((result: any) => {
      console.log("listuser",result);
      // var bytes = CryptoJS.AES.decrypt(result.data, 'vmsuserdata');
      // console.log(bytes,"bytes");
      // var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // // var decryptedData = JSON.parse(bytes);
      // console.log(decryptedData,"decryptedData");
      var bytes = CryptoJS.enc.Base64.parse(result.data);
      console.log("bytes", bytes);
      var decryptedData = JSON.parse(CryptoJS.enc.Utf8.stringify(bytes));
      console.log("decryptedData", decryptedData);
      this.dbservice.bulkInsertUsers(decryptedData)
      .then(result => console.log("Result:", result))
      .catch(error => console.error("Error:", error));;
    });
  }


  /**
     * Initialize library.
     */
  async initTimer() {
    // sets an idle timeout of 5 seconds, for testing purposes.
    this.idle.setIdle(3600);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(3600);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // When user 
    this.idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log('State - ' + this.idleState);
      this.logout();
    });


    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!'
      console.log('State - ' + this.idleState);
    });
    this.idle.onTimeoutWarning.subscribe((countdown) => {

      this.idleState = 'You will time out in ' + countdown + ' seconds!';

      console.log('State - ' + this.idleState);
    });
    this.idle.watch();
    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);

    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }


  resetTimeOut() {
    console.log("I am closing popup forever");
    this.idle.stop();
  }

  logout() {
    let Obj = {
      "userid": localStorage.getItem('user_id'),
    }
    this.auth.logout(Obj).subscribe((res) => {
      if (localStorage.getItem('remcredentials')) {
        const  remPassworddata = localStorage.getItem('remcredentials');
        localStorage.clear();
        localStorage.setItem('remcredentials', remPassworddata);
      }
      else
      {
        localStorage.clear();
      }
      this.connectivity.appIsOnline$.subscribe(async online => {

        console.log(online)

        if (online) {
          localStorage.setItem('isOnline', "true");
        }
        else {
          localStorage.setItem('isOnline', "false");
        }
      })

      this.router.navigate(['/login']);
    }),
      (error) => {
        if (localStorage.getItem('remcredentials')) {
          const  remPassworddata = localStorage.getItem('remcredentials');
          localStorage.clear();
          localStorage.setItem('remcredentials', remPassworddata);
        }
        else
        {
          localStorage.clear();
        }
        this.connectivity.appIsOnline$.subscribe(async online => {

          console.log(online)

          if (online) {
            localStorage.setItem('isOnline', "true");
          }
          else {
            localStorage.setItem('isOnline', "false");
          }
        })

        this.router.navigate(['/login']);
      };
    //this.logout();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.ready() 
      .then(() => {
          
          
        this.http.setServerTrustMode("nocheck") //<=== Add this function 
          .then(() => {
              console.log("Congratulaions, you have set up SSL Pinning.")
          })
          .catch(() => {
              console.error("Opss, SSL pinning failed.")
          });
      
          
          
      })

    });
  }
}
