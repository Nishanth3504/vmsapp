import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, EventTargetInterruptSource, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Location } from '@angular/common';
import { AuthenticationService } from './authentication.service';
import { ConnectivityService } from './offline-code/connectivity.service';
const MINUTES_UNITL_AUTO_LOGOUT = 40// in mins
const CHECK_INTERVAL = 15000 // in ms
const STORE_KEY = 'lastAction';
@Injectable({
    providedIn: 'root'
})
export class AutoLogoutService {

    idleState = 'NOT_STARTED';
    timedOut = false;
    lastPing?: Date = null;
    constructor(private router: Router, private idle: Idle,
        private keepalive: Keepalive, private location: Location, private auth: AuthenticationService
        ,private routerServices: Router,private connectivity: ConnectivityService) {
        // this.sessionTimmerInit();
    }

    sessionTimmerInit() {
        // sets an idle timeout of 30 minutes. 60*30
        this.idle.setIdle(720);
        // sets a timeout period of 2 minutes. 60*2
        this.idle.setTimeout(180);
        // sets the interrupts like Keydown, scroll, mouse wheel, mouse down, and etc
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        //indle time  end
        this.idle.onIdleEnd.subscribe(() => {
            console.log("no more idle, mouse has moved.");
            this.idleState = 'NO_LONGER_IDLE';
            this.timedOut = false;
            this.restartSessionTimmer();
            console.log("idle time ended.")
        });

        this.idle.onTimeout.subscribe(() => {
            this.idleState = 'TIMED_OUT';
            this.timedOut = true;
            this.logout();

        });

        this.idle.onIdleStart.subscribe(() => {

        });

        this.idle.onTimeoutWarning.subscribe((countdown: any) => {

        });
        this.idle.watch;
        // sets the ping interval to 15 seconds
        this.keepalive.interval(15);
        /**
         *  // Keepalive can ping request to an HTTP location to keep server session alive
         * keepalive.request('<String URL>' or HTTP Request);
         * // Keepalive ping response can be read using below option
         * keepalive.onPing.subscribe(response => {
         * // Redirect user to logout screen stating session is timeout out if if response.status != 200
         * });
         *   */
        //initial timmer reset.;'.////

        this.restartSessionTimmer();
    }


    /**session timeout Timmer */
    // ngOnDestroy() {
    //   console.log("I am destroyer ...........");

    //   this.resetTimeOut();
    // }

    reverseNumber(countdown: number) {
        return (300 - (countdown - 1));
    }

    restartSessionTimmer() {
        console.log("I am reseting timmer");

        this.idle.watch();
        this.idleState = 'IDLE_START';
        this.timedOut = false;
    }


    // logout() {
    //   this.resetTimeOut();
    // }
    logoutWithTimmer() {
        console.log("logoutWithTimmer()");
        this.resetTimeOut(); // this is timmer closes
        // this.sessionStorageService.removeUserDetailsInSession();
        sessionStorage.clear();
        // this.userId=null;
        this.router.navigateByUrl('/login');
        //this.location.reload();

        // this.reload('/');

    }

    resetTimeOut() {
        console.log("I am closing popup forever");
        this.idle.stop();
        this.idle.onIdleStart.unsubscribe();
        this.idle.onTimeoutWarning.unsubscribe();
        this.idle.onIdleEnd.unsubscribe();
        this.idle.onIdleEnd.unsubscribe();
    }

    reload(val) {
        if (val == this.router.url) {
            this.router.routeReuseStrategy.shouldReuseRoute = function () {
                return false;
            };
        }
    }

    logout() {
        let Obj = {
          "userid": localStorage.getItem('user_id')
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
    
          this.routerServices.navigate(['/login']);
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
    
            this.routerServices.navigate(['/login']);
          };
        //this.logout();
      }
}
