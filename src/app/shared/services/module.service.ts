/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/quotes */
import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { from, observable, Observable, ReplaySubject, Subject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import { AuthenticationService } from './authentication.service';
import { ConnectivityService } from './offline-code/connectivity.service';
import { ToastService } from './toast.service';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  languageEvent: Subject<object> = new Subject<object>();
  isPagereload: Subject<object> = new Subject<object>();
  // eslint-disable-next-line @typescript-eslint/ban-types
  mapEvent: Subject<object> = new Subject<object>();
  reloadEvent = new ReplaySubject();
  private httpClient: HttpClient;
  constructor(private http: HttpClient, httpBackend: HttpBackend, private httpobj: HTTP, private auth: AuthenticationService,
    private routerServices: Router, private connectivity: ConnectivityService, public toastService: ToastService, private loaderService: LoaderService
  ) {
    this.httpClient = new HttpClient(httpBackend);
    const body: any = {
      "user_id": localStorage.getItem('user_id'),
      "language": localStorage.getItem("language"),
    };
    if (body) {
      this.setProperty(body);
    }
  }

  setProperty(property: any) {
    this.reloadEvent.next(property);
  }
  onReLoadEvent() {
    return this.reloadEvent;
  }

  getVoilationType(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/voliationTypeList');
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'voliationTypeList', body, {});
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

  // getVoilationType() {
  //   return this.http.get(environment.vmsApiUrl + 'getSideTypes');
  // }

  // getVoilationTitle(id: any): Observable<any> {
  //   //return this.http.get(environment.apiUrl + '/voliationTitleList/' + id);
  //   return Observable.create((Observer) => {
  //     this.httpobj.setDataSerializer("json");
  //     this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
  //     let nativeHttpCall = this.httpobj.get(environment.apiUrl + '/voliationTitleList/' + id, {}, {});
  //     from(nativeHttpCall).subscribe(
  //       (res: any) => {
  //         if (res.status == 401) {
  //           this.logout();
  //         }
  //         let response = res.data.data
  //           ? JSON.parse(res.data.data)
  //           : JSON.parse(res.data);
  //         Observer.next(response);
  //         Observer.complete();
  //       },
  //       (err) => {
  //         if (err.status === 401) {
  //           this.logout();
  //         }
  //         Observer.error(err);
  //         Observer.complete();
  //       }
  //     );
  //   });
  // }
  getVoilationTitle(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/voliationTitleList/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'voliationTitleList', body, {});
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
  getSideCode(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/sideCode');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'sideCode', body, {});
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
  getSideCodeWiseData(id: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/sideCodeWiseData/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.apiUrl + '/sideCodeWiseData/' + id, {}, {});
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
  getPlateSource(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/plateSourceList');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'plateSourceList', body, {});
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

  getPlateCode(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/plateCodeList');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'plateCodeList', body, {});
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

  getPlateCodeoffline(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/plateCodeList');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'plateCodeOfflineList', body, {});
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

  getOldCode(): Observable<any> {
    //return this.http.get(environment.apiUrl + '/oldCode');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.apiUrl + '/oldCode', {}, {});
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
  getDocumentType(): Observable<any> {
    //return this.http.get(environment.apiUrl + '/documentType');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.violationApiUrl + 'documentType', {}, {});
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

  getViolationCategory(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/violationCategory/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'violationCategory', body, {});
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

  ListViolationCategories(): Observable<any> {
    //return this.http.get(environment.apiUrl + '/ListviolationCategories');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.apiUrl + '/ListviolationCategories', {}, {});
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
  // getViolationCategory(id: any) {
  //   return this.http.get(environment.vmsApiUrl + '/getSideTypeCategories/' + id);
  // }

  getFineCode(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/fineCode/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'fineCode', body, {});
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

  ListFineCodes(): Observable<any> {
    //return this.http.get(environment.apiUrl + '/ListfineCategoryCode');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.violationApiUrl + 'ListfineCategoryCode', {}, {});
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
  // getFineCode(id: any) {
  //   return this.http.get(environment.vmsApiUrl + 'getFineCodes/' + id);
  // }
  getFineAmount(body: any): Observable<any> {

    //return this.http.get(environment.apiUrl + '/getFineamount/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'getFineamount', body, {});
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
  getReservedCode(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/reservedCode/');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'reservedCode', body, {});
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
  // getReservedCode() {
  //   return this.http.get(environment.vmsApiUrl + 'getReservedCodes/');
  // }
  getArea(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/getArea');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'getArea', body, {});
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
  getViolationList(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/voilations/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'voilations', body, {});
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

  getvoilationSearchByField(body: any): Observable<any> {
    // return this.http.get(environment.apiUrl + '/voilationSearchByField/' + documentNumber)
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'voilationSearchByField', body, {});
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

  // voilationSearchByPlateNo: (documentNumber, callback) => {
  //

  voilationSearchByPlateNo(documentNumber): Observable<any> {
    //return this.http.get(environment.apiUrl + '/voilationSearchByPlateNo/' + documentNumber)
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.apiUrl + '/voilationSearchByPlateNo/' + documentNumber, {}, {});
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

  getPlateSourceID(id: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/plateSourceId/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.apiUrl + '/plateSourceId/' + id, {}, {});
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
  setAddVoliationTitle(body: any): Observable<any> {
    //  return this.http.post(environment.apiUrl + '/addVoliationTitle/', body,{});
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.apiUrl + '/addVoliationTitle/', body, {});
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
  // violationCreation(body: any): Observable<any> {
  //   // return this.http.post(environment.apiUrl + '/addValidation/', body,{});
  //   return Observable.create((Observer) => {
  //     this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
  //     this.httpobj.setHeader('*', String("Accept"), String("application/json"));
  //     this.httpobj.setDataSerializer("json");
  //     this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
  //     let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'createViolation', body, {});
  //     from(nativeHttpCall).subscribe(
  //       (res: any) => {
  //         if (res.status == 401) {
  //           this.logout();
  //         }
  //         let response = res.data.data
  //           ? JSON.parse(res.data.data)
  //           : JSON.parse(res.data);
  //         Observer.next(response);
  //         Observer.complete();
  //       },
  //       (err) => {
  //         console.log("subErr",err)
  //         let errorM = err.error
  //         console.log(errorM);
  //         let errorMsg = JSON.parse(errorM);
  //         console.log(errorMsg.data.msg);
  //         this.toastService.showError(errorMsg.data.msg,"Alert");
  //         // this.toastService.showError(JSON.stringify(err),"Alert");
  //         this.loaderService.loadingDismiss();
  //         if (err.status === 401) {
  //           this.logout();
  //         }
  //         Observer.error(err);
  //         Observer.complete();
  //       }
  //     );
  //   });
  // }

  violationCreation(body: any): Observable<any> {
    return new Observable((observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'createViolation', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    });
  }



  // violationCreation(body: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': localStorage.getItem('hashToken') || ''
  //   });

  //   return this.http.post(environment.violationApiUrl + 'createViolation', body, { headers }).pipe(
  //     catchError((error) => {
  //       if (error.status === 401) {
  //         // Handle logout or any other logic
  //         this.logout();
  //       }
  //       return throwError(error);
  //     })
  //   );
  // }




  getCommonHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  createWarning(body: any): Observable<any> {
    return Observable.create((observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      let nativeHttpCall = this.httpobj.post(environment.warningApiUrl + 'insertWarning', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.status == 200 || response.statusCode == 200) {
            observer.next(response);
          }
          else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    });
  };
  //         let response = res.data.ResponseContent
  //           ? JSON.parse(res.data.ResponseContent)
  //           : JSON.parse(res.data);
  //         Observer.next(response);
  //         Observer.complete();
  //       },
  //       (err) => {
  //         console.log("subErr",err)
  //         let errorM = err.error
  //         console.log(errorM);
  //         let errorMsg = JSON.parse(errorM);
  //         console.log(errorMsg.data.msg);
  //         this.toastService.showError(errorMsg.data.msg,"Alert");
  //         // this.toastService.showError(JSON.stringify(err),"Alert");
  //         this.loaderService.loadingDismiss();
  //         // alert(JSON.stringify(err))
  //         // console.log("erererer",JSON.stringify(err));


  //         if (err.status === 401) {
  //           this.logout();
  //         }
  //         Observer.error(err);
  //         Observer.complete();
  //       }
  //     );
  //    });

  // }


  viewViolationDeatails(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/viewViolations/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'viewViolations', body, {});
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


  viewAmendDeatails(id: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/amendViolationList/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.apiUrl + '/amendViolationList/' + id, {}, {});
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

  insertAmendViolatinRequest(body: any): Observable<any> {
    //return this.http.post(environment.apiUrl + '/amendViolation', data,{});
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + '  ', body, {});
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

  editViolationData(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/editViolation/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'editViolation', body, {});
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
  updateViolationData(body: any): Observable<any> {
    // return this.http.post(environment.apiUrl + '/updateViolationIdWise/' + id, data,{});
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'updateViolationIdWise', body, {});
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

  cancelviolation(body: any): Observable<any> {
    //return this.http.post(environment.apiUrl + '/cancelviolation/' + id, data,{});
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'cancelviolation', body, {});
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

  amendRequestList(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/amendReqestList/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'amendReqestList', body, {});
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

  deleteImage(body: any): Observable<any> {
    // return this.http.post(environment.warningApiUrl+ 'deleteImage', body)
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      console.log("payload", body);
      let nativeHttpcall = this.httpobj.post(environment.warningApiUrl + 'deleteImage', body, {});
      from(nativeHttpcall).subscribe(
        (res: any) => {
          if (res.status == 401) {
            this.logout();
          }
          let response = res.data.data ? JSON.parse(res.data.data) : JSON.parse(res.data);
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
      )
    })
  }


  vdeleteImage(body: any): Observable<any> {
    // return this.http.post(environment.warningApiUrl+ 'deleteImage', body)
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      console.log("payload", body);
      let nativeHttpcall = this.httpobj.post(environment.violationApiUrl + 'deleteImage', body, {});
      from(nativeHttpcall).subscribe(
        (res: any) => {
          if (res.status == 401) {
            this.logout();
          }
          let response = res.data.data ? JSON.parse(res.data.data) : JSON.parse(res.data);
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
      )
    })
  }

  getVdcamImgDelete(id: any): Observable<any> {
    //return this.http.delete(environment.apiUrl + '/deleteImage/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.delete(environment.apiUrl + '/deleteImage/' + id, {}, {});
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

  searchSideCode(body: any): Observable<any> {
    //return this.http.post(environment.apiUrl + '/searchSideCode', data,{});
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'searchSideCode', body, {});
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
  //Web Api Publish button
  publishViolation(data: any): Observable<any> {
    //return this.http.post(environment.vmsApiUrl + 'publishViolation', data,{});
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.vmsApiUrl + 'publishViolation', data, {});
      // let nativeHttpCall = this.httpobj.post('http://192.168.1.15/vms-prodlive/webservice/v1/api/publishViolation', data, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          console.log(err);
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    });
  }

  // return Observable.create((Observer) => {
  //   this.httpobj.setDataSerializer("json");
  //   this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
  //   let nativeHttpCall = this.httpobj.post(environment.vmsApiUrl + 'publishViolation', data, {});
  //   from(nativeHttpCall).subscribe(
  //     (res: any) => {
  //       if (res.status == 401) {
  //         this.logout();
  //       }
  //       let response = res.data.data
  //         ? JSON.parse(res.data.data)
  //         : JSON.parse(res.data);
  //       Observer.next(response);
  //       Observer.complete();
  //     },
  //     (err) => {
  //       if (err.status === 401) {
  //         this.logout();
  //       }
  //       this.toastService.showError(err,"Alert")
  //       Observer.error(err);
  //       Observer.complete();
  //     }
  //   ),
  //   (error) => {
  //     this.toastService.showError(error,"Alert")
  //   };;
  // });

  //app.post('/getViolationexitsinoneyear',vmsController.getViolationexitsinoneyear)

  getViolationexitsinoneyear(data: any): Observable<any> {
    //return this.http.post(environment.apiUrl + '/getViolationexitsinoneyear', data,{});
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.apiUrl + '/getViolationexitsinoneyear', data, {});
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

  getViolationexistsin3days(data: any): Observable<any> {
    //return this.http.post(environment.apiUrl + '/validate3daysviolation', data,{});
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.apiUrl + '/validate3daysviolation', data, {});
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

  /* Start  Sync Offline Violation, Violation Documents & Violation videos */


  violationCreationOffline(body: any): Observable<any> {
    //return this.http.post(environment.apiUrl + '/addViolationOffline/', body,{});
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.apiUrl + '/addViolationOffline/', body, {});
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

  /* End Sync Offline Violation, Violation Documents & Violation videos */

  sendsms(data: any) {
    let sms_host_url: any = environment.sms_host_url;
    let sms_port: any = environment.sms_port;
    let sms_api_source: any = environment.sms_api_source;
    let sms_api_username: any = environment.sms_api_username;
    let sms_api_password: any = environment.sms_api_password;
    let sms_api_msgtype: any = environment.sms_api_msgtype;
    let sms_api_dlr = environment.sms_api_dlr;

    let petitionLink = environment.vmsApiUrl + "/petitions/" + data.reference_number;
    let paymentLink = environment.vmsApiUrl + "/violations/preview/" + data.reference_number;
    let modile_number = "971522952656"
    let smsmessage = " A violation has been filed against you for committing a violation punishable by law. The value of your violation is " + data.fineAmount + " dirhams." +
      "And  " + data.dailyFines + " dirhams will be charge per day for late. Please initiate the payment of your violation in order to avoid the accumulation of fines." +
      "Your violation number is " + data.reference_number + ", Public Service Department - 072285688, Toll free number is 8008118 Location is https://goo.gl/maps/xqyvww6YbSB2, Petition Link: " + petitionLink + ", Payment Link: " + paymentLink + ""

    smsmessage = this.hexEncode(smsmessage);//this.toUnicode(smsmessage);
    //return this.http.get("http://"+sms_host_url+"/bulksms/bulksms?username="+sms_api_username+"&password="+sms_api_password+"&type="+sms_api_msgtype+"&dlr="+sms_api_dlr+"&destination="+modile_number+"&source="+sms_api_source+"&message="+smsmessage+"")

    let queryParams = new HttpParams();
    queryParams = queryParams.set("username", sms_api_username);
    queryParams = queryParams.set("password", sms_api_password);
    queryParams = queryParams.set("type", sms_api_msgtype);
    queryParams = queryParams.set("dlr", sms_api_dlr);
    queryParams = queryParams.set("destination", modile_number);
    queryParams = queryParams.set("source", sms_api_source);
    queryParams = queryParams.set("message", encodeURIComponent(smsmessage));

    return this.http.get("http://" + sms_host_url + "/bulksms/bulksms", { params: queryParams });
  }

  toUnicode(str): any {
    return str.split('').map((value, index, array) => {
      var temp = value.charCodeAt(0).toString(16).toUpperCase();
      if (temp.length > 2) {
        return '\\u' + temp;
      }
      return value;
    }).join('');
  }

  hexEncode(data: any): any {
    var hex, i;

    var result = "";
    for (i = 0; i < data.length; i++) {
      hex = data.charCodeAt(i).toString(16);
      result += ("000" + hex).slice(-4);
    }

    return result
  }

  logout() {
    let Obj = {
      "userid": localStorage.getItem('user_id')
    }
    this.auth.logout(Obj).subscribe((res) => {
      if (localStorage.getItem('remcredentials')) {
        const remPassworddata = localStorage.getItem('remcredentials');
        localStorage.clear();
        localStorage.setItem('remcredentials', remPassworddata);
      }
      else {
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
          const remPassworddata = localStorage.getItem('remcredentials');
          localStorage.clear();
          localStorage.setItem('remcredentials', remPassworddata);
        }
        else {
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

  /* Complaint System Code*/

  getAgencies(): Observable<any> {
    //return this.http.get(environment.apiUrl + '/ListfineCategoryCode');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      //this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.vmsComplaintApiUrl + '/getAgencies', {}, {});
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

  getPriorities(): Observable<any> {
    //return this.http.get(environment.apiUrl + '/ListfineCategoryCode');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      // this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.vmsComplaintApiUrl + '/getComplaintPriorities', {}, {});
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

  getComplaintTypes(body): Observable<any> {
    //return this.http.get(environment.apiUrl + '/ListfineCategoryCode');
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      // this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.vmsComplaintApiUrl + 'getComplaintTypes', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          console.log("service resp", res);

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

  getComplaintAreas(): Observable<any> {
    //return this.http.get(environment.apiUrl + '/ListfineCategoryCode');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      //this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.vmsComplaintApiUrl + '/getComplaintAreas', {}, {});
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

  CreateComplaint(body: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));

      let nativeHttpCall = this.httpobj.post(environment.vmsComplaintApiUrl + 'insertComplaint', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          console.log("subscribedres", res)
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
          console.log("Suberror", err);
          if (err.status === 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      );
    });
  }


  ListComplaints(body: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      let nativeHttpCall = this.httpobj.post(environment.vmsComplaintApiUrl + 'getComplaintData', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          console.log("service resp", res);
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

  // warningHours(): Observable<any>{    
  //   return this.http.get(environment.warningApiUrl + "getWarningHours");
  // }

  warningHours(): Observable<any> {
    //return this.http.get(environment.apiUrl + '/fineCode/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      // this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.warningApiUrl + 'getWarningHours', {}, {});
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

  viewWarningDeatails(data: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/voilations/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      console.log("AuthorizationURL",environment.authorizationURL);
      console.log("warningurl",environment.warningApiUrl)
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.warningApiUrl + 'getWarnings', data, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          console.log(res, "resopnce gott")
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

  getWarningList(body: any): Observable<any> {
    //return this.http.get(environment.apiUrl + '/voilations/' + id);
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.warningApiUrl + 'getWarnings', body, {});
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

  // hasInspectorallowviolation

  allowInspector(): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.warningApiUrl + 'hasInspectorallowviolation', {}, {});
      from(nativeHttpCall).subscribe((res: any) => {
        console.log("subscribers", res);
        if (res.status === 401) {
          this.logout();
        }
        let response = res.data.data
          ? JSON.parse(res.data.data)
          : JSON.parse(res.data);
        Observer.next(response);
        Observer.complete();
      },
        (err) => {
          console.log("suberror", err);
          if (err.status == 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      )
    })
  }

  createViolation(body: any): Observable<any> {
    console.log("body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.warningApiUrl + 'createViolation', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    })
    // return Observable.create((Observer) =>{


    //   this.httpobj.setDataSerializer("json");
    //   this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));

    //   // this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
    //   // this.httpobj.setHeader('*', String("Accept"), String("application/json"));
    //   let nativeHttpCall = this.httpobj.post(environment.warningApiUrl + 'createViolation', body , {});
    //   console.log("nativeHttpCall", nativeHttpCall);
    //   from(nativeHttpCall).subscribe((res: any)=>{
    //     console.log("subscribers", res);
    //     if(res.status === 401){
    //       this.logout();
    //     }
    //     let response = res.data.data
    //       ? JSON.parse(res.data.data)
    //       : JSON.parse(res.data);
    //     Observer.next(response);
    //     Observer.complete();
    //   },
    //   (err) => {
    //     console.log("suberror", err);
    //     let errorM = err.error
    //     console.log(errorM);
    //     let errorMsg = JSON.parse(errorM);
    //     console.log(errorMsg.data.msg);
    //     this.toastService.showError(errorMsg.data.msg,"Error");
    //     // this.toastService.showError(JSON.stringify(err),"Alert");
    //     this.loaderService.loadingDismiss();
    //     if(err.status == 401){
    //       this.logout();
    //     }
    //     Observer.error(err);
    //     Observer.complete();
    //   }
    //   )
    // } )
  }

  openWarnings(body: any): Observable<any> {
    console.log("body", body);

    return Observable.create((Observer) => {

      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.warningApiUrl + 'isSamewarningopen', body, {});
      from(nativeHttpCall).subscribe((res: any) => {
        console.log("subscribers", res);
        if (res.status === 401) {
          this.logout();
        }
        let response = res.data.data
          ? JSON.parse(res.data.data)
          : JSON.parse(res.data);
        Observer.next(response);
        Observer.complete();
      },
        (err) => {
          console.log("suberror", err);
          if (err.status == 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      )
    })
  }






  updateWarningStatus(body: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      console.log("body", body);

      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.warningApiUrl + '/updateWarningByStatus', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          console.log("subscribedres", res)
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
          console.log("Suberror", err);
          if (err.status === 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      );
    });

  }

  violationImage(body: any): Observable<any> {
    console.log("service body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("multipart");
      this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
      console.log("after dataserializer", body);
      debugger
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'violationDocUpload', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    })
    // return Observable.create((Observer) => {
    //   // this.httpobj.setDataSerializer('urlencoded');
    //   this.httpobj.setDataSerializer("multipart");
    //   // this.httpobj.setHeader('*', 'Content-Type', 'application/x-www-form-urlencoded');
    //   this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
    //   console.log("after dataserializer",body);

    //   // this.httpobj.setDataSerializer("json");
    //   // this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
    //   let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'violationDocUpload', body, {});
    //    from(nativeHttpCall).subscribe(
    //      (res: any) => {
    //        console.log("subscribedres",res)
    //        if (res.status == 401) {
    //          this.logout();
    //        }
    //        let response = res.data.data
    //          ? JSON.parse(res.data.data)
    //          : JSON.parse(res.data);
    //        Observer.next(response);
    //        Observer.complete();
    //      },
    //      (err) => {
    //       console.log("suberror", err);
    //       let errorM = err.error
    //       console.log(errorM);
    //       let errorMsg = JSON.parse(errorM);
    //       console.log(errorMsg.data.msg);
    //       this.toastService.showError(errorMsg.data.msg,"Error");
    //       // this.toastService.showError(JSON.stringify(err),"Alert");
    //       this.loaderService.loadingDismiss();
    //        console.log("Suberror",err);
    //        if (err.status === 401) {
    //          this.logout();
    //        }
    //        Observer.error(err);
    //        Observer.complete();
    //      }
    //    );
    //  });

  }

  violationVideo(body: any): Observable<any> {
    console.log("service body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("multipart");
      this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
      console.log("after dataserializer", body);
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'violationVideoUpload', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );

    });
    // return Observable.create((Observer) => {
    //   // this.httpobj.setDataSerializer('urlencoded');
    //   this.httpobj.setDataSerializer("multipart");
    //   // this.httpobj.setHeader('*', 'Content-Type', 'application/x-www-form-urlencoded');
    //   this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
    //   console.log("after dataserializer",body);

    //   // this.httpobj.setDataSerializer("json");
    //   // this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
    //   let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'violationVideoUpload', body, {});
    //    from(nativeHttpCall).subscribe(
    //      (res: any) => {
    //        console.log("subscribedres",res)
    //        if (res.status == 401) {
    //          this.logout();
    //        }
    //        let response = res.data.data
    //          ? JSON.parse(res.data.data)
    //          : JSON.parse(res.data);
    //        Observer.next(response);
    //        Observer.complete();
    //      },
    //      (err) => {
    //        console.log("Suberror",err);
    //        let errorM = err.error
    //        console.log(errorM);
    //        let errorMsg = JSON.parse(errorM);
    //        console.log(errorMsg.data.msg);
    //        this.toastService.showError(errorMsg.data.msg,"Alert");
    //        if (err.status === 401) {
    //          this.logout();
    //        }
    //        Observer.error(err);
    //        Observer.complete();
    //      }
    //    );
    //  });

  }

  complaintVideo(body: any): Observable<any> {
    console.log("service body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("multipart");
      this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
      console.log("after dataserializer", body);
      let nativeHttpCall = this.httpobj.post(environment.complaintVideoPath, body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );

    })
    // return Observable.create((Observer) => {
    //   // this.httpobj.setDataSerializer('urlencoded');
    //   this.httpobj.setDataSerializer("multipart");
    //   // this.httpobj.setHeader('*', 'Content-Type', 'application/x-www-form-urlencoded');
    //   this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
    //   console.log("after dataserializer",body);

    //   // this.httpobj.setDataSerializer("json");
    //   // this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
    //   let nativeHttpCall = this.httpobj.post(environment.complaintVideoPath , body, {});
    //    from(nativeHttpCall).subscribe(
    //      (res: any) => {
    //        console.log("subscribedres",res)
    //        if (res.status == 401) {
    //          this.logout();
    //        }
    //        let response = res.data.data
    //          ? JSON.parse(res.data.data)
    //          : JSON.parse(res.data);
    //        Observer.next(response);
    //        Observer.complete();
    //      },
    //      (err) => {
    //        console.log("Suberror",err);
    //        let errorM = err.error
    //        console.log(errorM);
    //        let errorMsg = JSON.parse(errorM);
    //        console.log(errorMsg.data.msg);
    //        this.toastService.showError(errorMsg.data.msg,"Alert");
    //        if (err.status === 401) {
    //          this.logout();
    //        }
    //        Observer.error(err);
    //        Observer.complete();
    //      }
    //    );
    //  });

  }

  warningclosingImage(body: any): Observable<any> {
    console.log("service body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("multipart");
      this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
      console.log("after dataserializer", body);
      let nativeHttpCall = this.httpobj.post(environment.warningApiUrl + 'WarningClosedAttachment', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    })
    // return Observable.create((Observer) => {
    //   // this.httpobj.setDataSerializer('urlencoded');
    //   this.httpobj.setDataSerializer("multipart");
    //   // this.httpobj.setHeader('*', 'Content-Type', 'application/x-www-form-urlencoded');
    //   this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
    //   console.log("after dataserializer",body);

    //   // this.httpobj.setDataSerializer("json");
    //   // this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
    //   let nativeHttpCall = this.httpobj.post(environment.warningApiUrl + 'WarningClosedAttachment', body, {});
    //    from(nativeHttpCall).subscribe(
    //      (res: any) => {
    //        console.log("subscribedres",res)
    //        if (res.status == 401) {
    //          this.logout();
    //        }
    //        let response = res.data.data
    //          ? JSON.parse(res.data.data)
    //          : JSON.parse(res.data);
    //        Observer.next(response);
    //        Observer.complete();
    //      },
    //      (err) => {
    //       console.log("suberror", err);
    //       let errorM = err.error
    //       console.log(errorM);
    //       let errorMsg = JSON.parse(errorM);
    //       console.log(errorMsg.data.msg);
    //       this.toastService.showError(errorMsg.data.msg,"Error");
    //       // this.toastService.showError(JSON.stringify(err),"Alert");
    //       this.loaderService.loadingDismiss();
    //        console.log("Suberror",err);
    //        if (err.status === 401) {
    //          this.logout();
    //        }
    //        Observer.error(err);
    //        Observer.complete();
    //      }
    //    );
    //  });
  }

  warningImage(body: any): Observable<any> {
    console.log("service body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("multipart");
      this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
      console.log("after dataserializer", body);
      let nativeHttpCall = this.httpobj.post(environment.warningDocumentPath, body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    })
    // return Observable.create((Observer) => {
    //   // this.httpobj.setDataSerializer('urlencoded');
    //   this.httpobj.setDataSerializer("multipart");
    //   // this.httpobj.setHeader('*', 'Content-Type', 'application/x-www-form-urlencoded');
    //   this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
    //   console.log("after dataserializer",body);

    //   // this.httpobj.setDataSerializer("json");
    //   // this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
    //   let nativeHttpCall = this.httpobj.post(environment.warningDocumentPath, body, {});
    //    from(nativeHttpCall).subscribe(
    //      (res: any) => {
    //        console.log("subscribedres",res)
    //        if (res.status == 401) {
    //          this.logout();
    //        }
    //        let response = res.data.data
    //          ? JSON.parse(res.data.data)
    //          : JSON.parse(res.data);
    //        Observer.next(response);
    //        Observer.complete();
    //      },
    //      (err) => {
    //       console.log("suberror", err);
    //       let errorM = err.error
    //       console.log(errorM);
    //       let errorMsg = JSON.parse(errorM);
    //       console.log(errorMsg.data.msg);
    //       this.toastService.showError(errorMsg.data.msg,"Error");
    //       // this.toastService.showError(JSON.stringify(err),"Alert");
    //       this.loaderService.loadingDismiss();
    //        console.log("Suberror",err);
    //        if (err.status === 401) {
    //          this.logout();
    //        }
    //        Observer.error(err);
    //        Observer.complete();
    //      }
    //    );
    //  });

  }


  warningVideo(body: any): Observable<any> {
    console.log("service body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("multipart");
      this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
      console.log("after dataserializer", body);
      let nativeHttpCall = this.httpobj.post(environment.warningVidoesPath, body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    });
    // return Observable.create((Observer) => {
    //   // this.httpobj.setDataSerializer('urlencoded');
    //   this.httpobj.setDataSerializer("multipart");
    //   // this.httpobj.setHeader('*', 'Content-Type', 'application/x-www-form-urlencoded');
    //   this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
    //   console.log("after dataserializer",body);

    //   // this.httpobj.setDataSerializer("json");
    //   // this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
    //   let nativeHttpCall = this.httpobj.post(environment.warningVidoesPath, body, {});
    //    from(nativeHttpCall).subscribe(
    //      (res: any) => {
    //        console.log("subscribedres",res)
    //        if (res.status == 401) {
    //          this.logout();
    //        }
    //        let response = res.data.data
    //          ? JSON.parse(res.data.data)
    //          : JSON.parse(res.data);
    //        Observer.next(response);
    //        Observer.complete();
    //      },
    //      (err) => {
    //        console.log("Suberror",err);
    //        let errorM = err.error
    //        console.log(errorM);
    //        let errorMsg = JSON.parse(errorM);
    //        console.log(errorMsg.data.msg);
    //        this.toastService.showError(errorMsg.data.msg,"Alert");
    //        if (err.status === 401) {
    //          this.logout();
    //        }
    //        Observer.error(err);
    //        Observer.complete();
    //      }
    //    );
    //  });

  }


  searchWarningList(body: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.warningApiUrl + '/searchWarning', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          console.log("subscribedres", res)
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
          console.log("Suberror", err);
          if (err.status === 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      );
    });
  }

  getPlateCategory(body: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'plateCategory', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          console.log("subscribedres", res)
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
          console.log("Suberror", err);
          if (err.status === 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      );
    });
  }

  getPlateCategoryoffline(body: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'plateCategoryOfflineList', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          console.log("subscribedres", res)
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
          console.log("Suberror", err);
          if (err.status === 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      );
    });
  }


  insertIncident(body: any) {
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.incidentsApiUrl + 'insertIncident', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          console.log("subscribedres", res)
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
          console.log("Suberror", err);
          if (err.status === 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      );
    });

  }

  incidentsVideoUpload(body: any) {
    console.log("service body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("multipart");
      this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
      console.log("after dataserializer", body);
      let nativeHttpCall = this.httpobj.post(environment.incidentsApiUrl + 'incidentVideoUpload', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    })
    // return Observable.create((Observer) => {
    //   this.httpobj.setDataSerializer("multipart");
    //   this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
    //   console.log("after dataserializer",body);
    //   let nativeHttpCall = this.httpobj.post(environment.incidentsApiUrl + 'incidentVideoUpload', body, {});
    //    from(nativeHttpCall).subscribe(
    //      (res: any) => {
    //        console.log("subscribedres",res)
    //        if (res.status == 401) {
    //          this.logout();
    //        }
    //        let response = res.data.data
    //          ? JSON.parse(res.data.data)
    //          : JSON.parse(res.data);
    //        Observer.next(response);
    //        Observer.complete();
    //      },
    //      (err) => {
    //       console.log("suberror", err);
    //       let errorM = err.error
    //       console.log(errorM);
    //       let errorMsg = JSON.parse(errorM);
    //       console.log(errorMsg.data.msg);
    //       this.toastService.showError(errorMsg.data.msg,"Error");
    //       this.loaderService.loadingDismiss();
    //        console.log("Suberror",err);
    //        if (err.status === 401) {
    //          this.logout();
    //        }
    //        Observer.error(err);
    //        Observer.complete();
    //      }
    //    );
    //  });
  }

  deleteIncidentImage(body: any): Observable<any> {
    // return this.http.post(environment.warningApiUrl+ 'deleteImage', body)
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      console.log("payload", body);
      let nativeHttpcall = this.httpobj.delete(environment.deleteincidentimgUrl + body, {}, {});
      from(nativeHttpcall).subscribe(
        (res: any) => {
          if (res.status == 401) {
            this.logout();
          }
          let response = res.data.data ? JSON.parse(res.data.data) : JSON.parse(res.data);
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
      )
    })
  }

  incidentsImgUpload(body: any) {
    console.log("service body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("multipart");
      this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
      console.log("after dataserializer", body);
      let nativeHttpCall = this.httpobj.post(environment.incidentsApiUrl + 'incidentImageUpload', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    })
    // return Observable.create((Observer) => {
    //   this.httpobj.setDataSerializer("multipart");
    //   this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
    //   console.log("after dataserializer",body);
    //   let nativeHttpCall = this.httpobj.post(environment.incidentsApiUrl + 'incidentImageUpload', body, {});
    //    from(nativeHttpCall).subscribe(
    //      (res: any) => {
    //        console.log("subscribedres",res)
    //        if (res.status == 401) {
    //          this.logout();
    //        }
    //        let response = res.data.data
    //          ? JSON.parse(res.data.data)
    //          : JSON.parse(res.data);
    //        Observer.next(response);
    //        Observer.complete();
    //      },
    //      (err) => {
    //       console.log("suberror", err);
    //       let errorM = err.error
    //       console.log(errorM);
    //       let errorMsg = JSON.parse(errorM);
    //       console.log(errorMsg.data.msg);
    //       this.toastService.showError(errorMsg.data.msg,"Error");
    //       this.loaderService.loadingDismiss();
    //        console.log("Suberror",err);
    //        if (err.status === 401) {
    //          this.logout();
    //        }
    //        Observer.error(err);
    //        Observer.complete();
    //      }
    //    );
    //  });
  }

  complaintsImgUpload(body: any) {
    console.log("service body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("multipart");
      this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
      console.log("after dataserializer", body);
      let nativeHttpCall = this.httpobj.post(environment.vmsComplaintApiUrl + 'complaintImageUpload', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    })
    // console.log("service body", body);
    // return Observable.create((Observer) => {
    //   this.httpobj.setDataSerializer("multipart");
    //   this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
    //   console.log("after dataserializer",body);
    //   let nativeHttpCall = this.httpobj.post(environment.vmsComplaintApiUrl + 'complaintImageUpload', body, {});
    //    from(nativeHttpCall).subscribe(
    //      (res: any) => {
    //        console.log("subscribedres",res)
    //        if (res.status == 401) {
    //          this.logout();
    //        }
    //        let response = res.data.data
    //          ? JSON.parse(res.data.data)
    //          : JSON.parse(res.data);
    //        Observer.next(response);
    //        Observer.complete();
    //      },
    //      (err) => {
    //       console.log("suberror", err);
    //       let errorM = err.error
    //       console.log(errorM);
    //       let errorMsg = JSON.parse(errorM);
    //       console.log(errorMsg.data.msg);
    //       this.toastService.showError(errorMsg.data.msg,"Error");
    //       this.loaderService.loadingDismiss();
    //        console.log("Suberror",err);
    //        if (err.status === 401) {
    //          this.logout();
    //        }
    //        Observer.error(err);
    //        Observer.complete();
    //      }
    //    );
    //  });
  }

  getComplaints(id: any, type: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.vmsComplaintApiUrl + 'getComplaintsByUser/' + id + '/' + type, {}, {});
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

  getComplaintsDetails(id: any, type: any, cid: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.vmsComplaintApiUrl + 'getComplaintsByUser/' + id + '/' + type + '/' + cid, {}, {});
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

  getComplaintsMenuByRole(id: any) {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.authenticationApiUrl + 'getComplaintsMenuByRole/' + id, {}, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          if (res.status == 401) {
            this.logout();
          }
          let response = res.data.data
            ? JSON.parse(res.data.data)
            : JSON.parse(res.data);
          Observer.next(response);
          console.log("11111111111111response", response);
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

  deleteComplaintImage(body: any): Observable<any> {
    // return this.http.post(environment.warningApiUrl+ 'deleteImage', body)
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      console.log("payload", body);
      let nativeHttpcall = this.httpobj.post(environment.deletecomplaintimg ,body, {});
      from(nativeHttpcall).subscribe(
        (res: any) => {
          if (res.status == 401) {
            this.logout();
          }
          let response = res.data.data ? JSON.parse(res.data.data) : JSON.parse(res.data);
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
      )
    })
  }

  getReservationSites(): Observable<any> {
    //return this.http.get(environment.apiUrl + '/documentType');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.violationApiUrl + 'getReservationSitesList', {}, {});
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

  getReservationSiteAreas(body): Observable<any> {
    //return this.http.get(environment.apiUrl + '/documentType');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'getReservationSiteAreasList', body, {});
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

  getWarningSpecifications(): Observable<any> {
    //return this.http.get(environment.apiUrl + '/documentType');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.violationApiUrl + 'getWarningSpecificationsList', {}, {});
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

  
  createReport(body: any): Observable<any> {
    return new Observable((observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'createReportByUser', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    });
  }

  reportDocUpload(body: any): Observable<any>{
    console.log("service body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("multipart");
      this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
      console.log("after dataserializer", body);
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'reportDocUpload', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    })
  }



  reportList(body: any): Observable<any> {
    return new Observable((observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'getReportsList', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    });
  };


  detailReport(body: any): Observable<any> {
    return new Observable((observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'viewReportDetails', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    });
  };

  rejectReport(body: any): Observable<any> {
    return new Observable((observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'updateReportStatusByUser', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    });
  };
  getProgramCodes(): Observable<any> {
    //return this.http.get(environment.apiUrl + '/documentType');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.violationApiUrl + 'getProgramCodes', {}, {});
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
  };

  getPermitList(body: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'getPermitsList', body, {});
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
  };

  getPermitDetail(body: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'viewPermit', body, {});
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
  };

  getSectors(): Observable<any> {
    //return this.http.get(environment.apiUrl + '/documentType');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.violationApiUrl + 'getSectors', {}, {});
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
  };


  warningtoviolation(body: any): Observable<any> {
    console.log("body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.warningApiUrl + 'createWarningToViolation', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    })
  };

  permitDocUpload(body: any): Observable<any>{
    console.log("service body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("multipart");
      this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
      console.log("after dataserializer", body);
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'permitDocUpload', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    })
  };

  getEquipmentType(): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.violationApiUrl + 'getEquipmentTypes', {}, {});
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

  createPermit(body: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'createPermit', body, {});
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
  };


  getVehicleClassTypes(): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.violationApiUrl + 'getVehicleClassTypes', {}, {});
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
  };

  convertwarningtoviolation(body): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.warningApiUrl + 'convertWarningToViolation', body, {});
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
    })
  };

  getComplaintDetail(body): Observable<any> {
    //return this.http.get(environment.apiUrl + '/documentType');
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.vmsComplaintApiUrl + 'viewComplaint', body, {});
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

  getFollowUpCategory():Observable<any>{
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.vmsApiUrl + 'getTollFreeCategory', {}, {});
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

  getFollowUpServiceTypes():Observable<any>{
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.vmsApiUrl + 'getTollFreeServiceTypes', {}, {});
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

  getResponsibilityTypes():Observable<any>{
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.vmsApiUrl + 'getResponsibilityTypes', {}, {});
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

  getResponsibleDepartments():Observable<any>{
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.vmsApiUrl + 'getResponsibleDepartments', {}, {});
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

  getFollowUpActionTypes():Observable<any>{
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.vmsApiUrl + 'getTollFreeActionTypes', {}, {});
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

  getInspectorList():Observable<any>{
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.get(environment.vmsApiUrl + 'getInspectorList', {}, {});
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

  createFollowupRequest(body): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'createTollFreeService', body, {});
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
    })
  };

  followUpRequestList(body): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'getTollFreeServiceList', body, {});
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
    })
  };

  viewFollowUpRequest(body): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'viewTollFreeService', body, {});
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
    })
  };

  getFollowUpRequestById(body): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'getTollFreeServiceById', body, {});
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
    })
  };

  updateFollowupStatus(body): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'updateTollFreeServiceStatus', body, {});
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
    })
  };

  followupDocUpload(body: any): Observable<any>{
    console.log("service body", body);
    return new Observable((observer) => {
      this.httpobj.setDataSerializer("multipart");
      this.httpobj.setHeader('*', 'Content-Type', 'multipart/form-data');
      console.log("after dataserializer", body);
      let nativeHttpCall = this.httpobj.post(environment.vmsApiUrl + 'commonfileUpload', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          let response = res.data ? JSON.parse(res.data) : res;
          if (response.statusCode === 200 || response.status === 200) {
            observer.next(response);
          } else {
            observer.error(response);
          }
          observer.complete();
        },
        (err) => {
          let errorResponse;
          try {
            errorResponse = JSON.parse(err.error);
          } catch (e) {
            errorResponse = err;
          }
          observer.error(errorResponse);
        }
      );
    })
  }

  getLegalNoticesList(body): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'getLegalNoticesList', body, {});
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
    })
  };

  viewLegalNotice(body): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'viewLegalNotice', body, {});
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
    })
  };


  updateLegalNoticeStatus(body): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setHeader('*', String("Content-Type"), String("application/json"));
      this.httpobj.setHeader('*', String("Accept"), String("application/json"));
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'updateLegalNoticeStatus', body, {});
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
    })
  };

  checkWarningexistinviolation(body: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.violationApiUrl + 'isViolationExistFromWarning', body, {});
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
  };

  getWarningReasons(body: any): Observable<any> {
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
      let nativeHttpCall = this.httpobj.post(environment.vmsApiUrl + 'getWarningReasons', body, {});
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
  };





  /* ded Integration Invoking End Point */

  GetLicenceByParam(body: any): Observable<any> {
    // return new Observable((observer)=>{
    //   this.httpobj.setDataSerializer("json");
    //   // let nativeHttpCall = this.httpobj.post(environment.vmsDedApiUrl+'getLicenseDetailsByParam', body, {});
    //   let nativeHttpCall = this.httpobj.post(' http://192.168.1.15/vms-prodlive/webservice/v1/DEDAPIWeb/getLicenseDetailsByParam', body, {});
    //   from(nativeHttpCall).subscribe(
    //     (res: any) => {
    //       let response = res.data ? JSON.parse(res.data) : res;
    //       if (response.statusCode === 200 || response.status === 200) {
    //         observer.next(response);
    //       } else {
    //         observer.error(response);
    //       }
    //       observer.complete();
    //     },
    //     (err) => {
    //       let errorResponse;
    //       try {
    //         errorResponse = JSON.parse(err.error);
    //       } catch (e) {
    //         errorResponse = err;
    //       }
    //       observer.error(errorResponse);
    //     }
    //   );
    // })
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      //let nativeHttpCall = this.httpobj.post('https://rakdedlicdstg.ega.lan/QSInternalTest/QZone/IntegrationServices/RAKDED_LicenseDetailsByParam', body, {});
      let nativeHttpCall = this.httpobj.post(environment.vmsDedApiUrl + 'getLicenseDetailsByParam', body, {});
      // let nativeHttpCall = this.httpobj.post(' http://192.168.1.15/vms-prodlive/webservice/v1/DEDAPIWeb/getLicenseDetailsByParam', body, {});
      //let nativeHttpCall = this.httpobj.post(environment.apiUrl + '/GetLicenseParamInfo/', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          if (res.status == 401) {
            this.logout();
          }
          let response = res.data.ResponseContent
            ? JSON.parse(res.data.ResponseContent)
            : JSON.parse(res.data);
          Observer.next(response);
          Observer.complete();
        },
        (err) => {
          this.toastService.showError(JSON.stringify(err), "Alert");
          alert(JSON.stringify(err))
          if (err.status === 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      );
    });
  }

  GetLicenseByLicenseNumber(body: any): Observable<any> {
    console.log("entered");
    return Observable.create((Observer) => {
      this.httpobj.setDataSerializer("json");
      //let nativeHttpCall = this.httpobj.post('https://rakdedlicdstg.ega.lan/QSInternalTest/QZone/IntegrationServices/RAKDED_LicenseDetails', body, {});
      let nativeHttpCall = this.httpobj.post(environment.vmsDedApiUrl + 'getLicenseDetailsByNo', body, {});
      //  let nativeHttpCall = this.httpobj.post('http://192.168.1.15/vms-prodlive/webservice/v1/DEDAPIWeb/getLicenseDetailsByNo', body, {});
      //let nativeHttpCall = this.httpobj.post(environment.apiUrl + '/GetLicenseByLicenseNumber/', body, {});
      from(nativeHttpCall).subscribe(
        (res: any) => {
          if (res.status == 401) {
            this.logout();
          }
          let response = res.data.ResponseContent
            ? JSON.parse(res.data.ResponseContent)
            : JSON.parse(res.data);
          Observer.next(response);
          Observer.complete();
          console.log(response);
        },
        (err) => {
          this.toastService.showError(JSON.stringify(err), "Alert");
          alert(JSON.stringify(err))
          if (err.status === 401) {
            this.logout();
          }
          Observer.error(err);
          Observer.complete();
        }
      );
    });
  }

  // return new Observable((observer)=>{
  //   this.httpobj.setDataSerializer("json");
  // //  let nativeHttpCall = this.httpobj.post(environment.vmsDedApiUrl + 'getLicenseDetailsByNo', body, {});
  //  let nativeHttpCall = this.httpobj.post('http://192.168.1.15/vms-prodlive/webservice/v1/DEDAPIWeb/getLicenseDetailsByNo', body, {});
  //  from(nativeHttpCall).subscribe(
  //   (res: any) => {
  //     let response = res.data ? JSON.parse(res.data) : res;
  //     if (response.statusCode === 200 || response.status === 200) {
  //       observer.next(response);
  //     } else {
  //       observer.error(response);
  //     }
  //     observer.complete();
  //   },
  //   (err) => {
  //     let errorResponse;
  //     try {
  //       errorResponse = JSON.parse(err.error);
  //     } catch (e) {
  //       errorResponse = err;
  //     }
  //     observer.error(errorResponse);
  //   }
  // );
  // })

  /* ded Integration Invoking End Point */

}
