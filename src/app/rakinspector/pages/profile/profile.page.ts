import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ConnectivityService } from 'src/app/shared/services/offline-code/connectivity.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  fullname: any;
  setLanguage: any;
  selectedLang: any;
  constructor(private auth: AuthenticationService,
    private translateService: TranslateService,
    private moduleService: ModuleService, private routerServices: Router, private connectivity: ConnectivityService
  ) {
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
  }

  ngOnInit() {
    this.selectedLang = localStorage.getItem('language');

    this.fullname = localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name');

    this.moduleService.languageEvent.subscribe((result: any) => {
      this.translateService.use(result);
    }),
      (error) => {
        console.log(error)
      };

  }
  onSelectLanguage(lang: any) {
    console.log('Lan', lang);
    localStorage.setItem('language', lang);
    this.moduleService.languageEvent.next(lang);
    this.translateService.use(lang);
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
