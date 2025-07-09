import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Route, Router } from '@angular/router';
import { AlertController, IonInfiniteScroll } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { DbService } from 'src/app/shared/services/offline-code/db.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-rejected-report-list',
  templateUrl: './rejected-report-list.page.html',
  styleUrls: ['./rejected-report-list.page.scss'],
})
export class RejectedReportListPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  search_keyword:any;
  listReports=[];
  setLanguage: any;
  Opacity: any = 1;
  filteredReports: any[] = [];
  user_type: string;
  SearchReportsTimeout: any;
  pageLength: number = 0;  
  isInfiniteScrollDisabled: boolean = false;
  isSearching: boolean = false;


  constructor(
    private moduleService: ModuleService,
    private loaderService: LoaderService,
    private router : Router,
    private dbservice: DbService,
    public atrCtrl: AlertController,
    public toastService: ToastService,
    private translateService: TranslateService
  ) { 
    // this.getReports();
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
  }

  ionViewDidEnter(){
    this.getReports('');
  }



  ngOnInit() {
    this.user_type = localStorage.getItem('user_type');
    // this.getReports();
  }

  getReports( searchText : any, event?: any) {
    if (this.isSearching && event) {
      event.target.complete();
      return;
    }
    
    let body={
      user_id : localStorage.getItem('user_id'),
      search_name :searchText,
      pageLength: this.pageLength
    }
    if (!event) {
      this.loaderService.loadingPresent();
    }
    console.log("payload", body);
    this.moduleService.reportList(body).subscribe((res: any) => {
      console.log(res);
      
      if (res.statusCode == 200) {
        const user_type = localStorage.getItem('user_type');
        let newReports = user_type == '8' || user_type == '15' 
          ? res.data.filter(report => report.status === 'Rejected')
          : res.data;
        
        if (this.pageLength === 0) {
          this.listReports = newReports;
        } else {
          this.listReports = [...this.listReports, ...newReports];
        }
        
        this.filteredReports = [...this.listReports];
        this.isInfiniteScrollDisabled = newReports.length === 0;
      } else {
        if (this.pageLength === 0) {
          this.listReports = [];
          this.filteredReports = [];
        }
        this.isInfiniteScrollDisabled = true;
      }
      if (event) {
        event.target.complete();
      } else {
        this.loaderService.loadingDismiss();
      }
      this.isSearching = false;
    },
    error => {
      console.error(error);
      if (event) {
        event.target.complete();
      } else {
        this.loaderService.loadingDismiss();
      }
      this.isSearching = false;
    });
  }

  loadMoreReports(event: any) {
    if (!this.isInfiniteScrollDisabled && !this.isSearching) {
      this.pageLength++;
      this.getReports(this.search_keyword, event);
    } else {
      event.target.complete();
    }
  }


  getStatusColor(status: any): any {
    switch (status) {

      case 'In-progress':
        return 'orange';
      case 'Accepted':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'inherit';
    }
  };
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
              if (localStorage.getItem('isOnline') === "true") {
                let payload = {
                  "report_id": id,
                  "comment":inputdata.reason,
                  "created_by" : localStorage.getItem('user_id'),
                }
                console.log(payload);
                this.moduleService.rejectReport(payload).subscribe((result: any) => {
                  //  console.log(result)
                  if (result.statusCode === 200 || result.status === 200) {
                    this.getReports('');
                  }
                }),(error) => {
                  console.log(error)
                }
              }
              else {
                
              }
            }

          }
        }
      ]
    });
    (await alert).present();
  }

  torejectReport(id: any) {
    // alert( 1)
    // this.moduleService.cancelviolation(id).subscribe((result) =>
    // {
    this.showPromptAlert(id);
    //})

  }
  toeditReport(id: any){
    let navigationExtras: NavigationExtras = {
      state: {
        data: id,
        type:'update_report'
      }
    };
    this.router.navigate(['/add-report'], navigationExtras);
  };
  
  toaddReport(){
    let navigationExtras: NavigationExtras = {
      state: {
        data:'',
        type:'add_report'
      }
    };
    this.router.navigate(['/add-report'], navigationExtras);
  };

  SearchReports(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    console.log("searchTerm", searchTerm);
    clearTimeout(this.SearchReportsTimeout);
    this.SearchReportsTimeout = setTimeout(() => {
      this.isSearching = true;
      this.pageLength = 0;
      this.listReports = [];
      this.filteredReports = [];
      this.isInfiniteScrollDisabled = false;
      this.search_keyword = searchTerm;
      this.getReports(searchTerm);
    }, 3000);
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.pageLength = 0;
      this.listReports = [];
      this.filteredReports = [];
      this.isInfiniteScrollDisabled = false;
      this.getReports('');
      event.target.complete();
    }, 2000);
  }

}
