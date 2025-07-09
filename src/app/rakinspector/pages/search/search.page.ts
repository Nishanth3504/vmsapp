import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModuleService } from 'src/app/shared/services/module.service';
import { TranslateService } from '@ngx-translate/core';
import { ConnectivityService } from 'src/app/shared/services/offline-code/connectivity.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AlertController } from '@ionic/angular';
import { DbService } from 'src/app/shared/services/offline-code/db.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  violationList: any;
  userId: any;
  data: any[];
  setLanguage: any;
  filterKeys = ['document_no', 'license_no', 'reference_number','fine_amount','fine_place','license_plate_no','payment_status', 'created_on','description_eng'];
  search:any;
  sourceId: string;
  SearchViolationsTimeout: any;
  pageLength: number = 0;  
  isInfiniteScrollDisabled: boolean = false;
  isSearching: boolean = false;
  list: any =[];
  search_keyword: any;
  user_type: any;

  constructor(
    private moduleService: ModuleService,
    private translateService: TranslateService,
    public cref: ChangeDetectorRef,
    private connectivity: ConnectivityService,
    private toastService: ToastService,
    public atrCtrl: AlertController,
    private dbservice: DbService
  ) {
    this.sourceId = localStorage.getItem('sourceId');
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
   }

  ngOnInit() {
    this.user_type = localStorage.getItem('user_type');
    this.userId = localStorage.getItem('user_id');
    console.log("user_id", this.userId);
    this.getViolationList('');

    this.moduleService.languageEvent.subscribe((result: any) => {
      this.translateService.use(result);
    });
  }

  getViolationList(skeyword, event?: any) {
    this.connectivity.appIsOnline$.subscribe(async online => {
      console.log(online)
      if (online) {
        let payload = {
          "userid": this.userId,
          "sourceId": this.sourceId,
          "pageLength": this.pageLength,
          "searchKeyword": skeyword
        }
        this.moduleService.getViolationList(payload).subscribe((res: any) => {
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
          this.isSearching = false;  // Reset isSearching flag
          this.cref.detectChanges();
 
        },error => {
          console.log(error);
          if (event) {
            event.target.complete();
          }
          this.isSearching = false;  
        });

      } 
      else {
        if (event) {
          event.target.complete();
        }
        this.isSearching = false;  // Reset isSearching flag when offline
      }
    })
  }

  searchViolation(event: any){
    console.log(event.target.value);
    clearTimeout(this.SearchViolationsTimeout);
    const searchTerm = event.target.value?.trim().toLowerCase();  

    this.SearchViolationsTimeout = setTimeout(() => {
      this.isSearching = true;
      this.pageLength = 0;
      this.violationList = [];
      this.isInfiniteScrollDisabled = false;
      this.search_keyword = searchTerm;
      this.getViolationList(searchTerm);
    }, 3000);
  }

  loadMoreViolation(event: any) {
    if (!this.isInfiniteScrollDisabled && !this.isSearching) {
      this.pageLength++;  
      this.getViolationList(this.search_keyword, event);  
    } else {
      event.target.complete();
    }
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
    this.showPromptAlert(id);
  }

  async viewMapModal(latlong:any) {

    let destination =  latlong.split(',')[0] + ',' +  latlong.split(',')[1];
    window.open('geo:0,0?q=' + destination + '', '_system');
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
}