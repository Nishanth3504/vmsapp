import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { ConnectivityService } from 'src/app/shared/services/offline-code/connectivity.service';
import { DbService } from 'src/app/shared/services/offline-code/db.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import * as CryptoJS from 'crypto-js';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import {EncrDecrServiceService} from '../../../shared/services/encr-decr-service.service';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {
  ChangePassword: FormGroup;
  submitted = true;
  errorMsg = '';
  
  constructor(private fb: FormBuilder,
    private loginServices: LoginService,
    public routerServices: Router,
    private loaderService: LoaderService,
    // public toastController: ToastController,
    public toastService: ToastService,
    private dbservice: DbService, private connectivity: ConnectivityService,private authService:AuthenticationService,
    private EncrDecr: EncrDecrServiceService) {

    this.ChangePassword = this.fb.group({
      currentpassword: [null, [Validators.required]],
      newpassword: [null, [Validators.required, ,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')]],
      confirmpassword: [null, [Validators.required]]
    },{validator: this.matchingPasswords('newpassword', 'confirmpassword')});

  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  ngOnInit() {
  }

  get form() { return this.ChangePassword.controls; }
  get currentpassword() { return this.ChangePassword.get('currentpassword')?.value; }
  get newpassword() { return this.ChangePassword.get('newpassword')?.value; }
  get confirmpassword() { return this.ChangePassword.get('confirmpassword')?.value; }

  // ngAfterViewInit(): void {
  //   this.ChangePasswordbtn();
  // }
  ChangePasswordbtn() {
    console.log('Welcome to login');
    this.submitted = true;
    if (this.ChangePassword.invalid) {
      this.submitted = false;
      return;
    }

    const current_password = this.EncrDecr.set(this.currentpassword);//CryptoJS.MD5(this.currentpassword).toString();
    const new_password = this.EncrDecr.set(this.newpassword);//CryptoJS.MD5(this.newpassword).toString();
    var userIDbytes = CryptoJS.AES.encrypt(localStorage.getItem('user_id'), 'password').toString();
    const data = {
      userid: localStorage.getItem('user_id'),
      currentpassword: current_password,
      newpassword: new_password
    };
    console.log('data', data);

    if (localStorage.getItem('isOnline') === "true") {
      let payload = {
        "userid": localStorage.getItem('user_id'),
        "currentpassword": current_password.trim(),
        "newpassword": new_password.trim()
      }
      this.loginServices.ChangePassword(payload).pipe(finalize(() => {

      })).subscribe((res: any) => {
        if (res.statusCode === 200 || res.status===200) {
            this.toastService.showSuccess('Password Changed Successfully', 'Success');
            this.ChangePassword.reset();
            //this.routerServices.navigate(['/']);
            this.logout();
        }
        else{
          this.toastService.showError('Failed to Change Password', 'Error');
        }
      }),
        (error) => {
          console.log(error)
        };
    }

  }

  logout() {
    let Obj = {
      "userid": localStorage.getItem('user_id'),
    }
    this.authService.logout(Obj).subscribe((res) => {
      localStorage.clear();
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
        localStorage.clear();
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
