import { Inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, from, fromEvent, Observable, throwError } from 'rxjs';
//import { PasswordService } from './password.service';
import { catchError, filter, finalize, map, switchMap, take, tap, timeout } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { AuthenticationService } from './authentication.service';
import { LoaderService } from './loader.service';
import { Router } from '@angular/router';
import { ConnectivityService } from './offline-code/connectivity.service';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');
export const apiWithoutHeader = [];
@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  private passwordService: any;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private onlineEvent: Observable<Event>;
  private offlineEvent: Observable<Event>;
  constructor(private injector: Injector,
    @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number,
    public toastService: ToastService,
    private auth: AuthenticationService,
    private loaderService: LoaderService, private routerServices: Router,private connectivity: ConnectivityService
  ) {

    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.onlineEvent.subscribe(e => {
      console.log('Application is Online');
    }),
      (error) => {
        console.log(error)
      };
    this.offlineEvent.subscribe(e => {
      console.log('Application is Offline');
    }),
      (error) => {
        console.log(error)
      };
  }


  addToken(req: HttpRequest<any>): HttpRequest<any> {
    const accessToken = localStorage.getItem('hashToken');
    if (accessToken) {
      return req.clone({
        // headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
        headers: req.headers.set('Authorization', `${accessToken}`).set('Access-Control-Allow-Origin', '*')
      });
    } else {
      return req;
    }
  }



  intercept(request: HttpRequest<any>, next: HttpHandler) {
    //this.loaderService.loadingPresent();
    const timeoutValue = request.headers.get('timeout') || this.defaultTimeout;
    const timeoutValueNumeric = Number(timeoutValue);

    if (this.apiWithNoHeaders(request)) {
      return next.handle(request).pipe(
        timeout(timeoutValueNumeric),
        tap((event: HttpResponse<any>) => event),
        catchError((error: HttpErrorResponse) => this.networkErrorScenario(error, request, next))
      );
    } else {
      // debugger;
      return next.handle(this.addToken(request)).pipe(
        timeout(timeoutValueNumeric),
        tap((response: any) => {
          if (response.type !== 0) {
            const token = response.headers.get('Authorization');
            if (token) {
              localStorage.setItem('hashToken', token.split(' ')[1]);
            }
          }
          // console.log('loaderservice', 'loaderservice');
          //this.loaderService.loadingDismiss();
          return response;
        }),
        catchError((error: HttpErrorResponse) => this.networkErrorScenario(error, request, next))
      );
    }
  }


  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  //   const token = localStorage.getItem('hashToken');

  //   if (token) {
  //     request = request.clone({
  //       setHeaders: {
  //         'Authorization': token
  //       }
  //     });
  //   }

  //   if (!request.headers.has('Content-Type')) {
  //     request = request.clone({
  //       setHeaders: {
  //         'content-type': 'application/json'
  //       }
  //     });
  //   }

  //   request = request.clone({
  //     headers: request.headers.set('Accept', 'application/json')
  //   });

  //   return next.handle(request).pipe(
  //     map((event: HttpEvent<any>) => {
  //       if (event instanceof HttpResponse) {
  //         console.log('event--->>>', event);
  //       }
  //       return event;
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       this.networkErrorScenario(error, request, next)
  //       return throwError(error);
  //     }));
  // }
  private networkErrorScenario(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler) {

    if (error instanceof HttpErrorResponse) {
      const errorCode = (error as HttpErrorResponse).status;
      switch (true) {
        case (errorCode === 400):
          return this.handle400Error(error);

        case (errorCode === 401):
          return this.handle401Error(error);

        case (errorCode === 403):
          return this.handle403Error(error);

        case (errorCode >= 500 && errorCode < 600):
          return throwError(error);

        case (errorCode === 0):
          return throwError(error);

        default:
          return throwError(error);
      }
    } else {
      return throwError(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  handle401Error(error: HttpErrorResponse) {
    if (error && error.status === 401) {
      this.logout();
      this.toastService.showError(error.statusText, error.status);
      //this.toastService.showError("Invalid Credentials", "");
      // console.log('error', error);
      return throwError(error);
    }
    // if (!this.refreshTokenInProgress) {
    //   this.refreshTokenInProgress = true;
    //   this.refreshTokenSubject.next(null);
    //   return this.getNewToken(req, next);
    // } else {
    //   return this.refreshTokenSubject.pipe(
    //     filter(token => token != null),
    //     take(1),
    //     switchMap(token => next.handle(this.addToken(req)))
    //   );
    // }
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  handle400Error(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (error && error.status === 400) {
      this.toastService.showError(error.statusText, error.status);
      return throwError(error);
    }

    return throwError(error);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  handle403Error(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (error && error.status === 403) {
      this.toastService.showError(error.statusText, error.status);
      //this.auth.logout();
      return throwError(error);
    }
    return throwError(error);
  }


  // eslint-disable-next-line @typescript-eslint/member-ordering
  logoutUser(error: any): Observable<HttpEvent<any>> {
    this.toastService.showError(error.statusText, error.status);
    return throwError(error);

  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  apiWithNoHeaders(request: HttpRequest<any>): boolean {
    return apiWithoutHeader.includes(request.url);
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

