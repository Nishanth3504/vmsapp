import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectivityService } from './offline-code/connectivity.service';
import { HTTP } from '@ionic-native/http/ngx';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private routerServices: Router, private httpobj: HTTP, private connectivity: ConnectivityService) { }
  canActivate(): boolean {
    if (window.localStorage.getItem('currentUser')) {
      return true;
    }
    else {
      return false;
    }
  }
  // logout() {
  //   // localStorage.removeItem('currentUser');
  //   // this.currentUserSubject.next(null);
  //   localStorage.clear();
  //   this.connectivity.appIsOnline$.subscribe(async online => {

  //     console.log(online)

  //     if (online) {
  //       localStorage.setItem('isOnline', "true");
  //     }
  //     else {
  //       localStorage.setItem('isOnline', "false");
  //     }
  //   })

  //   this.routerServices.navigate(['/login']);
  //   // window.location.reload();
  //   return true;

  // }

  logout(body: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.authenticationApiUrl + 'logout', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data.data
            ? JSON.parse(res.data.data)
            : JSON.parse(res.data);

          Observer.next(response);
          Observer.complete();
        },
        (err) => {
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
          Observer.error(err);
          Observer.complete();
        }
      );
    });
  }

}
