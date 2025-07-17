import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectivityService } from './offline-code/connectivity.service';
import { HTTP } from '@ionic-native/http/ngx';
import { from, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private routerServices: Router,
    private httpobj: HTTP,
    private connectivity: ConnectivityService
  ) {}
  canActivate(): boolean {
    if (window.localStorage.getItem('currentUser')) {
      return true;
    } else {
      return false;
    }
  }

  logout(body: any): Observable<any> {
    return new Observable((observer) => {
      this.httpobj.setDataSerializer('json');
      this.httpobj.setHeader(
        environment.authorizationURL,
        'Authorization',
        localStorage.getItem('hashToken') || ''
      );

      this.httpobj
        .post(`${environment.authenticationApiUrl}logout`, body, {})
        .then((res: any) => {
          const response = res.data ? JSON.parse(res.data) : {};
          observer.next(response);
          observer.complete();
        })
        .catch((err) => {
          if (localStorage.getItem('remcredentials')) {
            const remPassworddata = localStorage.getItem('remcredentials');
            localStorage.clear();
            localStorage.setItem('remcredentials', remPassworddata || '');
          } else {
            localStorage.clear();
          }

          this.connectivity.appIsOnline$.subscribe(async (online) => {
            localStorage.setItem('isOnline', online ? 'true' : 'false');
          });

          this.routerServices.navigate(['/login']);
          observer.error(err);
          observer.complete();
        });
    });
  }

  getaccesstoken(authorizationCode: string, creds: any): Observable<any> {
    return from(this.performCordovaHttpRequest(authorizationCode, creds));
  }

  private async performCordovaHttpRequest(
    authorizationCode: string,
    creds: any
  ): Promise<any> {
    const url = environment.uaePass.tokenUrl;

    const username = environment.uaePass.username;
    const password = environment.uaePass.password;
    const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

    const formData = {
      grant_type: 'authorization_code',
      redirect_uri: environment.uaePass.redirectUri,
      code: authorizationCode,
    };

    this.httpobj.setDataSerializer('urlencoded');

    try {
      const res = await this.httpobj.post(url, formData, {
        Authorization: basicAuth,
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      return JSON.parse(res.data);
    } catch (error) {
      console.error('Error sending token request:', error);
      throw error;
    }
  }

  uaeuserInfo(token: string): Observable<any> {
    return from(this.performUserInfoRequest(token));
  }

  private async performUserInfoRequest(token: string): Promise<any> {
    const url = environment.uaePass.userInfo;

    try {
      const res = await this.httpobj.get(
        url,
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );
      return JSON.parse(res.data);
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }

  validateuaeUser(body: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}Login/LoginWithUAEPass`, body)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    throw error;
  }
}
