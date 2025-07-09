import { Injectable, InjectionToken } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, fromEvent, Observable, throwError } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { catchError } from 'rxjs/operators';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('token') != null) {
      const token = localStorage.getItem('access-token');
      // if the token is  stored in localstorage add it to http header
      const headers = new HttpHeaders().set('token', token);
      //clone http to the custom AuthRequest and send it to the server
      const authRequest = request.clone({ headers });
      return next.handle(authRequest);
    } else {
      return next.handle(request)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMsg = '';
            if (error.error instanceof ErrorEvent) {
              console.log('this is client side error');
              errorMsg = `Error: ${error.error.message}`;
            }
            else {
              console.log('this is server side error');
              errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
            }
            console.log(errorMsg);
            return throwError(errorMsg);
          })
        );
    }
  }
}
