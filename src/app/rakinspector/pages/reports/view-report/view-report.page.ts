import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { LoaderService } from 'src/app/shared/services/loader.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.page.html',
  styleUrls: ['./view-report.page.scss'],
})
export class ViewReportPage implements OnInit {
  detailReports: any;
  reportId: any;
  statusDetails: any;
  docsImages: any =[];
  imagePath: any;
  setLanguage: any;
  user_type: any;
  constructor(
    private moduleService : ModuleService,
    private loaderService: LoaderService,
    private activatedRouterServices: ActivatedRoute,
    private translateService: TranslateService,
    public atrCtrl: AlertController,
    private toastService: ToastService,
    private router: Router
  ) { 
    this.activatedRouterServices.params.subscribe((res: any) => {
      this.reportId = res.id;
    })
    this.imagePath = environment.reportImagePath;
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
  }

  ngOnInit() {
    this.user_type = localStorage.getItem('user_type');
    this.getReportDetail();
  }


  getReportDetail(){
    let body={
      report_id :this.reportId
    }
    this.loaderService.loadingPresent();
    console.log("payload", body);
    this.moduleService.detailReport(body).subscribe((res: any) => {
      console.log(res, "Response data detail");
      
      if (res.statusCode == 200) {
        this.detailReports = res.viewDetails;
        this.statusDetails = res.statusDetails;  
        const docs = res.viewDetails[0].attachments;
        if (docs) {
          this.docsImages.push(docs.split(","));
        }
  
        
        console.log(docs,"docs");
        console.log(this.detailReports)
        console.log(this.docsImages);
      }
      else {
        this.detailReports = [];
        this.statusDetails = [];
      }
      this.loaderService.loadingDismiss();
    }),
    (error: any)=>{
      this.loaderService.loadingDismiss();
      this.toastService.showError('Something went wrong', 'please try again!');
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
                    this.router.navigate(['/dashboard']);
                    this.toastService.showSuccess("Rejected Successfully",'');
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

}
