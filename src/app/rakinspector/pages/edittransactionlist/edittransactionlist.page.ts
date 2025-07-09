
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { DbService } from 'src/app/shared/services/offline-code/db.service';
import { ConnectivityService } from 'src/app/shared/services/offline-code/connectivity.service';
@Component({
  selector: 'app-edittransactionlist',
  templateUrl: './edittransactionlist.page.html',
  styleUrls: ['./edittransactionlist.page.scss'],
})
export class EdittransactionlistPage implements OnInit {

  editId: any;
  editDataList: any;
  editViolation: FormGroup;
  selectedLang: any;
  setLanguage: any;
  userId: string;
  constructor(
    private moduleService: ModuleService,
    private activeRouter: ActivatedRoute,
    private toastService: ToastService,
    private routerServices: Router,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private dbservice: DbService,
    private connectivity: ConnectivityService
  ) {

    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);

    this.editViolation = this.fb.group({
      notes: [null, Validators.required]
    });

  }

  ngOnInit() {

    this.activeRouter.params.subscribe((res: any) => {
      console.log(res.id);
      this.editId = res.id;

      if (localStorage.getItem('isOnline')==="true") {
        let payload = {
          "violationid": res.id
        }
          this.moduleService.editViolationData(payload).subscribe((result: any) => {
            console.log("editViolationDetails", result.data[0]);
            this.editDataList = result.data[0];
            this.editViolation.controls['notes'].setValue(this.editDataList.notes)
          })
        }
        else {
          this.dbservice.getviolationNotes(res.id).then((result) => {
            console.log("editViolationDetails", result);
            this.editDataList = result[0];
            this.editViolation.controls['notes'].setValue(this.editDataList.notes)
          })
        }
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

  }

  onUpdate() {
    if (localStorage.getItem('isOnline')==="true") {
        console.log("editViolation", this.editViolation.value);
        console.log("notes",this.editViolation.controls['notes'].value);
        
        this.userId = localStorage.getItem('user_id');
        
        let payload = {
          "violationid":this.editId,
          "userid": this.userId,
          "notes":this.editViolation.controls['notes'].value
        }
        this.moduleService.updateViolationData(payload).subscribe((res: any) => {
          console.log("result", res);
          this.editViolation.reset();
          this.toastService.showSuccess('Updated Successfully', 'Success');
          this.routerServices.navigate(['/transactionslist']);
        }),
          (error) => {
            console.log(error)
          }
      }
      else {
        this.dbservice.updateViolationNotes(this.editId, this.editViolation.value["notes"]).then((res: any) => {
          console.log("result", res);
          this.editViolation.reset();
          this.toastService.showSuccess('Updated Successfully', 'Success');
          this.routerServices.navigate(['/transactionslist']);

        })
      }
  }

}
