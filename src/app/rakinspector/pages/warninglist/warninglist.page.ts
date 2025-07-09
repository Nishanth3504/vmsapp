import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoginService } from 'src/app/shared/services/login.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { IonInfiniteScroll, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import 'moment-timezone';
import { DbService } from 'src/app/shared/services/offline-code/db.service';
import { ConnectivityService } from 'src/app/shared/services/offline-code/connectivity.service';
import { ModalController } from '@ionic/angular';
import { ViewmapmodalPage } from '../modalpopup/viewmapmodal/viewmapmodal.page';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-warninglist',
  templateUrl: './warninglist.page.html',
  styleUrls: ['./warninglist.page.scss'],
})
export class WarninglistPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  pageTitle: any;
  orgList: any;
  violationList: any;
  userId: any;
  amendRequestList: any;
  setLanguage: any;
  offset: any;
  showCards: any = 5;
  list: any = [];
  subParams: any;
  Opacity: any = 1;
  SearchComplaintsTimeout: any;
  sourceId: string;
  pageLength: number = 0;  
  isInfiniteScrollDisabled: boolean = false;
  isSearching: boolean = false;
  user_type: any;
  menuAccess: any[] = [];
  showFilterOptions: boolean = false;
  selectedFilter: string = 'all_warnings'; // Default filter
  currentUserType: number;


  constructor(
    private activatedRouterServices: ActivatedRoute,
    public toastService: ToastService,
    private loginServices: LoginService,
    private moduleService: ModuleService,
    public atrCtrl: AlertController,
    public cref: ChangeDetectorRef,
    private translateService: TranslateService,
    private dbservice: DbService,
    private connectivity: ConnectivityService,
    private modalController: ModalController,
    private loaderService : LoaderService
  ) {
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
    this.sourceId = localStorage.getItem('sourceId');

  }



  ngAfterViewInit(): void {


  }

  ngOnInit() {
    this.user_type = localStorage.getItem('user_type');
    this.userId = localStorage.getItem('user_id');
    this.getPageTitle();

    this.moduleService.isPagereload.subscribe((res: any) => {
      console.log('res', res);
    }),
      (error) => {
        console.log(error)
      };
    this.moduleService.languageEvent.subscribe((result: any) => {
      this.translateService.use(result);
    }),
      (error) => {
        console.log(error)
      };

    this.subParams = this.activatedRouterServices.params.subscribe(params => {

      this.offset = new Date().getTimezoneOffset();
      this.setLanguage = window.localStorage.getItem('language');
      this.translateService.use(this.setLanguage);
      this.getViolationList();
      this.getAmendRequestList();
    });
    const menuAccessStored = localStorage.getItem('menuAccessbyUserRole');
    if (menuAccessStored) {
      this.menuAccess = JSON.parse(menuAccessStored);
    }


  }


  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    });
  }

  getOrgListData() {
    // this.spinner.show();
    this.loginServices.getOrgList().pipe(finalize(() => {
      // this.spinner.hide();
    })).subscribe((res: any) => {
      this.orgList = res.data;
      console.log('orgList', res);
    }),
      (error) => {
        console.log(error)
      };
  }
  getViolationList(event?: any) {
    this.connectivity.appIsOnline$.subscribe(async online => {
      if (online) {
        let payload = {
          sourceId: this.sourceId,
          userId: this.userId,
          pageLength: this.pageLength,
          filter_by : this.selectedFilter || ''
        }
        this.moduleService.getWarningList(payload).subscribe((res: any) => {
          if (this.pageLength === 0) {
            this.violationList = res.data;
          } else {
            this.violationList = [...this.violationList, ...res.data];
          }
          
          this.list = this.violationList;
          this.isInfiniteScrollDisabled = res.data.length === 0;
          
          if (event) {
            event.target.complete();
          }
          
          this.cref.detectChanges();
        }, error => {
          console.log(error);
          if (event) {
            event.target.complete();
          }
        });
      } else {
        // Handle offline scenario
        if (event) {
          event.target.complete();
        }
      }
    });
  }

  loadMoreWarnings(event: any) {
    if (!this.isInfiniteScrollDisabled && !this.isSearching) {
      this.pageLength++;
      this.getViolationList(event);
    } else {
      event.target.complete();
    }
  }

  getAmendRequestList() {
    let payload = {
      "userid" : this.userId
    }
    this.moduleService.amendRequestList(payload).subscribe((res: any) => {
      // console.log("Violation List", res);
      this.amendRequestList = res.data;
      console.log('getAmendRequestList', res.data);
      this.cref.detectChanges();
    }),
      (error) => {
        console.log(error)
      };
  }
  getClassOf(val) {

    if (val == 'Not Approved') {
      return 'notApproval';
    } else if (val == 'Approved') {
      return 'approved';
    } else if (val == 'Rejected') {
      return 'rejected'
    }
  }

  loadData(event: any) {
    setTimeout(() => {
      this.showCards += 5;

      this.list = this.violationList.slice(0, this.showCards);
      event.target.complete();

      if (this.list.length === this.violationList.length) {
        event.target.disabled = true;
      }
      console.log('loadDataevent', this.list);

    }, 500);

  }

  async showPromptAlert(id) {
    let alert = this.atrCtrl.create({
      header: this.setLanguage === 'ar' ? 'إلغاء المخالفة' : 'Cancel Request',
      inputs: [
        {
          name: 'reason',
          type: "textarea",
          attributes: {
            maxLength: 500,
            rows: 4,
            cols: 20
          },
          placeholder: this.setLanguage === 'ar' ? 'أضف السبب' : 'Enter Reason'
        }
      ],
      buttons: [
        {
          text: this.setLanguage === 'ar' ? 'إلغاء' : 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: this.setLanguage === 'ar' ? 'نشر' : 'Submit',
          handler: (inputdata) => {
            //console.log('Confirm Ok');
            if (inputdata.reason === "") {
              this.toastService.showError("Please provide a valid resaon", "Alert")
              return false;
            } else {
              let data = {
                status: "Sent For Delete Approval By INSPECTOR",
                reason: inputdata.reason
              };
              if (localStorage.getItem('isOnline') === "true") {
                let payload = {
                  "violationid": id,
                  "reason":inputdata.reason,
                  "is_delete_approved_status":"Sent For Delete Approval By INSPECTOR"
                }
                this.moduleService.cancelviolation(payload).subscribe((result: any) => {

                  //  console.log(result)
                  if (result.statusCode === 200 || result.status === 200) {
                    this.list = this.list.filter((item) => { return item.id != id })
                    this.toastService.showSuccess("Sent For Cancel Approval", "Cancel Request");
                    this.cref.detectChanges();
                  }
                }),
                  (error) => {
                    console.log(error)
                  }
              }
              else {
                this.dbservice.cancelViolationRequest(id, data).then((result: any) => {
                  this.list = this.list.filter((item) => { return item.id != id })
                  this.toastService.showSuccess("Sent For Cancel Approval", "Cancel Request");
                  this.cref.detectChanges();
                }), (error) => {
                  console.log(error)
                }
              }
            }

          }
        }
      ]
    });
    (await alert).present();
  }

  cancelviolation(id: any) {
    // alert( 1)
    // this.moduleService.cancelviolation(id).subscribe((result) =>
    // {
    this.showPromptAlert(id);


  }

  getWarnings(skeyword: string) {
    this.isSearching = true;
    this.pageLength = 0;
    this.violationList = [];
    this.isInfiniteScrollDisabled = false;

    let body = {
      search_value: skeyword,
      pageLength: this.pageLength,
    }
    this.loaderService.loadingPresent();
    this.moduleService.searchWarningList(body).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.violationList = res.data;
        this.list = this.violationList;
      } else {
        this.violationList = [];
        this.list = [];
      }
      this.isInfiniteScrollDisabled = res.data.length === 0;
      this.loaderService.loadingDismiss();
      this.isSearching = false;
    }, error => {
      console.log(error);
      this.loaderService.loadingDismiss();
      this.isSearching = false;
    });
  }

  SearchWarnings(event: any) {
    clearTimeout(this.SearchComplaintsTimeout);
    const searchTerm = event.target.value?.trim().toLowerCase();
    this.SearchComplaintsTimeout = setTimeout(() => {
      this.getWarnings(searchTerm);
    }, 3000);
  }

  ngOnDestroy() {
    this.subParams.unsubscribe();
  }

  async viewMapModal(latlong:any) {

    let destination =  latlong.split(',')[0] + ',' +  latlong.split(',')[1];
    window.open('geo:0,0?q=' + destination + '', '_system');
    // const modal = await this.modalController.create({
    //   component: ViewmapmodalPage,
    //   componentProps:{latlong:latlong},
    //   swipeToClose: true,
    //   cssClass: 'viewMapCreatev',
    //   presentingElement: await this.modalController.getTop()

    // });
    // modal.onDidDismiss().then((data) => {
    //   // Call the method to do whatever in your home.ts
    //   console.log('Modal closedd');
    //   this.Opacity = 1;
    // });
    // this.Opacity = 0;
    // return await modal.present();
  }

  hasMenuAccess(menuCheck: string): boolean {
    const menuItem = this.menuAccess.find(item => item.menu_check === menuCheck);
    if (menuItem) {
      const roles = menuItem.role_id.split(',');
      return roles.includes(this.user_type);
    }
    return false;
  }

  toggleFilterOptions() {
    this.showFilterOptions = !this.showFilterOptions;
  }

  selectFilterOption(option: string) {
    this.selectedFilter = option;
    console.log(this.selectedFilter)
    this.showFilterOptions = false; // Hide options after selection
    this.pageLength = 0;
    this.getViolationList();
  }

}
