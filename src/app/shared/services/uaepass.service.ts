import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
 
@Injectable({
  providedIn: 'root'
})
export class UaepassService {
  apiUrl: string = environment.apiUrl;
  isIOS: boolean = false;
  isProduction: boolean = false;
 
  constructor(
    private http: HttpClient,
    private iab: InAppBrowser,
    private toastService: ToastService,
    public router: Router
  ) {
    this.isIOS = Capacitor.getPlatform() === 'ios';
    this.isProduction = environment.production;
  }
 
 
  verifyAppAuthentication(successURL: any) {
    console.log('successURL::', successURL);
    const options: InAppBrowserOptions = {
      location: 'yes',
      clearcache: 'yes' as 'yes',
      zoom: 'yes' as 'yes',
      toolbarposition: 'top',
      clearsessioncache: 'yes' as 'yes',
      hideurlbar: 'yes' as 'yes',
      closebuttoncaption: 'Close',
      hidenavigationbuttons: 'yes' as 'yes',
      hardwareback: 'yes' as 'yes',
      hidespinner: 'no' as 'no'
    };
    const browser = this.iab.create(
      successURL,
      this.isIOS ? '_blank' : '_blank',
      options
    );
 
    // Handle errors during loading
    browser.on('loaderror').subscribe(event => {
      console.error('Browser loading error:', event);
      // this.toastService.showError('Failed to load authentication page', "");
    });
 
    browser.on('loadstart').subscribe(async (event) => {
      console.log('Authentication page loading started:', event.url);
 
      // Check for authentication URL
      if (event.url.includes('authenticationendpoint/login.do')) {
        if (event.url.includes('error=access_denied')) {
          console.log('User canceled the authentication.');
          this.toastService.showError('User canceled the authentication', '');
        } else {
          console.log('Login URL with possible params:', event.url);
        }
      }
 
      // Check for polling URL
      else if (event.url.includes('authenticationendpoint/polling.jsp')) {
        console.log('Polling URL:', event.url);
      }
 
      // Check for retry URL
      else if (event.url.includes('authenticationendpoint/retry.do')) {
        this.toastService.showError('User cancelled the login', '');
        await browser.close();
        this.router.navigate(['/login'])
        console.log('Retry URL:', event.url);
      }
 
      // Check for redirect URL with error
      const appScheme = environment.schema;
      if (event.url.includes(`${appScheme}://uaepassverification`)) {
        if (event.url.includes('uaepassverification')) {
          const urlParams = new URLSearchParams(event.url.split('?')[1]);
          const code = urlParams.get('code');
          console.log('codeee', code);
 
          if (code) {
            console.log('Authorization code:', code);
 
            // Retrieve credentials
            const username = environment.uaePass.username;
            const password = environment.uaePass.password;
 
            // Close the browser
            await browser.close();
 
            // Navigate to the verification page
            this.router.navigate(['/uaepassverification'],
              {
                state: {
                  from: 'uaepassverification',
                  authorization_code: code,
                  user_name: username,
                  password: password,
                }
              });
          } else {
            // This is the redirection URL after authentication
            const urlParams = new URLSearchParams(new URL(event.url).search);
            const error = urlParams.get('error');
            const errorDescription = urlParams.get('error_description');
            if (error === 'access_denied') {
              console.log('Authentication was canceled by user on UAE PASS app.');
              this.toastService.showError(errorDescription, '');
              await browser.close();
              this.router.navigate(['/login']);
              // Handle error (e.g., show an appropriate message to the user)
            } else if (error) {
              console.log('Error:', error, 'Description:', errorDescription);
              this.toastService.showError(errorDescription, '');
              await browser.close();
              this.router.navigate(['/login']);
              // Handle other error cases (e.g., display error message)
            } else {
              this.toastService.showError(errorDescription, '');
              await browser.close();
              this.router.navigate(['/login']);
            }
          }
        }
      }
      else {
        console.log('Unknown URL:', event.url);
      }
 
      console.log('Page loading started:', event.url);
    });
  }
 
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
 
}
 