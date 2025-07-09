import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, forkJoin, from } from "rxjs";
import { HTTP } from "@ionic-native/http/ngx";
import { AuthenticationService } from './authentication.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Router } from '@angular/router';
import { ConnectivityService } from './offline-code/connectivity.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private httpobj: HTTP, private auth: AuthenticationService, public toastService: ToastService,
    private routerServices: Router,private connectivity: ConnectivityService
  ) {

  }
  validateUser(body: any): Observable<any> {
    // const email: any = data.username;
    // const password: any = data.password;
    // const body = {
    //   email: email.trim(),
    //   // eslint-disable-next-line object-shorthand
    //   password: password
    // };
    //return this.http.post(environment.apiUrl + '/loginValidation/', body,{});
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      // this.httpobj.setHeader(environment.authorizationURL,"Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.authenticationApiUrl + 'loginValidation', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          console.log("env",environment.authenticationApiUrl);
          let response = res.data.data
            ? JSON.parse(res.data.data)
            : JSON.parse(res.data);
          Observer.next(response);
          Observer.complete();
        },
        (err) => {
          if (err.status === 401) {
            this.toastService.showError('Invalid Credentials or Not Authorized !', 'Alert');
          }
          Observer.error(err);
          Observer.complete();
        }
      );
    });
  }

  ChangePassword(body: any): Observable<any> {
    // const userid: any = data.userid;
    // const currentpassword: any = data.currentpassword;
    // const newpassword: any = data.newpassword;
    // const body = {
    //   id:userid,
    //   currentpassword: currentpassword.trim(),
    //   // eslint-disable-next-line object-shorthand
    //   newpassword: newpassword.trim()
    // };
    //return this.http.post(environment.apiUrl + '/changepassword/' + userid, body);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.authenticationApiUrl + 'changepassword', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          if (res.status == 401) {
            this.logout();
          }
          let response = res.data.data
            ? JSON.parse(res.data.data)
            : JSON.parse(res.data);
          Observer.next(response);
          Observer.complete();
        },
        (err) => {
          if (err.status === 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      );
    });
  }


  //get Org List
  getOrgList(): Observable<any> {
    //return this.http.get(environment.apiUrl + '/orgList/');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.apiUrl + '/orgList/', {}, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          if (res.status == 401) {
            this.logout();
          }
          let response = res.data.data
            ? JSON.parse(res.data.data)
            : JSON.parse(res.data);
          Observer.next(response);
          Observer.complete();
        },
        (err) => {
          if (err.status === 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      );
    });
  }

  listusers(): Observable<any> {
    // return this.http.get(environment.apiUrl + '/listInspectorData/');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.usersApiUrl + 'listInspectorData', {}, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          if (res.status == 401) {
            console.log("authentication failed",res);
            
            this.logout();
          }
          let response = res.data.data
            ? JSON.parse(res.data.data)
            : JSON.parse(res.data);
          console.log(response);
          Observer.next(response);
          Observer.complete();
        },
        (err) => {
          if (err.status === 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      );
    });
  }

  generateCaptcha() {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      let nativeHttpCall = this.httpobj.get(environment.authenticationApiUrl + 'generatecaptcha', {}, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data.data
            ? JSON.parse(res.data.data)
            : JSON.parse(res.data);
          Observer.next(response);
          Observer.complete();
        },
        (err) => {
          if (err.status === 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      );
    });
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
