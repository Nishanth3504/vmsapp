import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-followup-request',
  templateUrl: './followup-request.page.html',
  styleUrls: ['./followup-request.page.scss'],
})
export class FollowupRequestPage implements OnInit {
  setLanguage: any;
  followupform: FormGroup;
  submitted: boolean = true;
  FollowupCategoryData: any;
  FollowupServiceData: any;
  responsibilityTypeData: any;
  responsibilityDepartmentData: any;
  FollowupActionTypeData: any;
  InspectorlistData: any;
  listAreas: any;
  selectedAreaId: any;
  sourceId: string;
  routerData: any;
  routerType: any;
  populateData: any;
  isEditMode: boolean = false;
  statusData: any;
  statusFlowFlag: boolean = false;
  selectedCategoryVal : any

  constructor(
    public routerServices: Router,
    private fb: FormBuilder,
    private mService: ModuleService,
    private translateService: TranslateService,
    public toastService: ToastService,
    public geolocation: Geolocation,
    private loaderService: LoaderService
  ) {
    this.sourceId = localStorage.getItem('sourceId');
    const nav = this.routerServices.getCurrentNavigation();
    this.routerData = nav?.extras?.state?.data || null;
    this.routerType = nav?.extras?.state?.type || null;
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);

    this.initForm();
  }

  initForm() {
    this.followupform = this.fb.group({
      name: ['', [Validators.required]],
      mobile_no: ['', [Validators.required]],
      area: ['', [Validators.required]],
      geo_location: [''],
      category_type: ['', [Validators.required]],
      service_type: ['', [Validators.required]],
      recipient_name: [''],
      request_date: [''],
      request_time: [''],
      responsibility_type: ['', [Validators.required]],
      responsible_department: ['', [Validators.required]],
      action_type: ['', [Validators.required]],
      comments: [''],
      created_by: [localStorage.getItem('user_id')],
      tfs_id: [''],
      status: [''],
      statusFlowFlag:['']
    });
  }

  get form() { return this.followupform.controls; }

  ngOnInit() {
    this.getFollowUpCategory();
    this.getFollowUpServiceTypes();
    this.getResponsibilityTypes();
    this.getResponsibleDepartments();
    this.getFollowUpActionTypes();
    this.getInspectorList();
    this.getComplaintAreas();


    this.checkEditMode();
  }

  checkEditMode() {
    if (this.routerData) {
      this.isEditMode = true;
      this.getFollowupRequestsByID();
    }
  }

  onSubmit(){
    this.submitted = true;
    this.loaderService.loadingPresent();
    if (this.followupform.invalid) {
      this.submitted = false;
      this.loaderService.loadingDismiss();
      return;
    }
    // this.followupform.value['area'] = this.selectedAreaId;
    this.followupform.patchValue({ area: this.selectedAreaId });
    let options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 3600
    };
this.geolocation.getCurrentPosition(options).then((position) => {
  const coords = position.coords.latitude + ',' + position.coords.longitude;
  this.followupform.controls['geo_location'].setValue(coords);

  if (this.isEditMode) {
    this.updateFollowupRequest();
  } else {
    this.createFollowupRequest();
  }
}).catch((err) => {
  this.loaderService.loadingDismiss();
  this.toastService.showError('Failed to get location. Please try again.', 'Error');
});
  }

  createFollowupRequest() {
    this.mService.createFollowupRequest(this.followupform.value).subscribe(
      (res) => {
        this.loaderService.loadingDismiss();
        if (res.statusCode === 200 || res.status === 200) {
          this.toastService.showSuccess(this.setLanguage == 'ar' ? 'تم تقديم الطلب بنجاح!' : 'Service Created Successfully!', 'Thank You');
          this.routerServices.navigate(['/followup-list']);
          this.resetForm();
        }
      },
      (error) => {
        console.log(error);
        this.loaderService.loadingDismiss();
        this.toastService.showError(`An error occurred: ${error}`, 'Alert');
      }
    );
  }

  resetForm() {
    this.followupform.reset();
    this.followupform.updateValueAndValidity();
    this.submitted = false;
  }


  updateFollowupRequest() {
    // Add the follow_up_id for update
    this.followupform.value['tfs_id'] = this.routerData;
    
    this.mService.createFollowupRequest(this.followupform.value).subscribe(
      (res) => {
        this.loaderService.loadingDismiss();
        if (res.statusCode === 200 || res.status === 200) {
          this.toastService.showSuccess(this.setLanguage == 'ar' ? 'تم تقديم الطلب بنجاح!': 'Service Updated Successfully!', 'Thank You');
          this.routerServices.navigate(['/followup-list']);
        }
      },
      (error) => {
        console.log(error);
        this.loaderService.loadingDismiss();
        this.toastService.showError(`An error occurred: ${error}`, 'Alert');
      }
    );
  }


  getFollowUpCategory(){
    this.mService.getFollowUpCategory().subscribe((response: any) => {
      if(response.statusCode == 200 || response.status == 200){
        // console.log("response of follow up category data---->", response);
        this.FollowupCategoryData = response.data;
      }
      else{
        this.toastService.showError("Failed to fetch follow up category data.", "Error");
      }
    });
  }

  handleCategory(event: any){
  const selectedId = event.detail.value;
  const selectedCategory = this.FollowupCategoryData.find(item => item.id === selectedId);

  if (!selectedCategory) return;

  this.followupform.controls['category_type'].setValue(selectedCategory.id);
  this.followupform.controls['statusFlowFlag'].setValue(selectedCategory.tfs_status_flow);

  if (selectedCategory.tfs_status_flow === "1") {
    this.statusFlowFlag = true;
    this.followupform.controls['recipient_name'].setValidators([Validators.required]);
  } else {
    this.followupform.controls['recipient_name'].setValue('');
    this.statusFlowFlag = false;
    this.followupform.controls['recipient_name'].clearValidators();
  }
  this.followupform.controls['recipient_name'].updateValueAndValidity();
}

  getFollowUpServiceTypes(){
    this.mService.getFollowUpServiceTypes().subscribe((response: any) => {
      if(response.statusCode == 200 || response.status == 200){
        // console.log("response of follow up Service Types data---->", response);
        this.FollowupServiceData = response.data;
      }
      else{
        this.toastService.showError("Failed to fetch FollowUp Service Types data.", "Error");
      }
    });
  }

  getResponsibilityTypes(){
    this.mService.getResponsibilityTypes().subscribe((response: any) => {
      if(response.statusCode == 200 || response.status == 200){
        // console.log("response of Responsibility Types data---->", response);
        this.responsibilityTypeData = response.data;
      }
      else{
        this.toastService.showError("Failed to fetch Responsibility Types data.", "Error");
      }
    });
  }

  getResponsibleDepartments(){
    this.mService.getResponsibleDepartments().subscribe((response: any) => {
      if(response.statusCode == 200 || response.status == 200){
        // console.log("response of getResponsibleDepartments--->", response);
        this.responsibilityDepartmentData = response.data;
      }
      else{
        this.toastService.showError("Failed to fetch getResponsibleDepartments.", "Error");
      }
    });
  }

  getFollowUpActionTypes(){
    this.mService.getFollowUpActionTypes().subscribe((response: any) => {
      if(response.statusCode == 200 || response.status == 200){
        // console.log("response of getFollowUpActionTypes--->", response);
        this.FollowupActionTypeData = response.data;
      }
      else{
        this.toastService.showError("Failed to fetch getFollowUpActionTypes.", "Error");
      }
    });
  }

  getInspectorList(){
    this.mService.getInspectorList().subscribe((response: any) => {
      if(response.statusCode == 200 || response.status == 200){
        // console.log("response of getInspectorList --->", response);
        this.InspectorlistData = response.data;
      }
      else{
        this.toastService.showError("Failed to fetch getInspectorList.", "Error");
      }
    });
  }

  getComplaintAreas() {
    console.log("areas")
    let payload ={
      "source_id":this.sourceId
    }
    this.mService.getArea(payload).subscribe((res: any) => {
      if (res.statusCode == 200 || res.status == 200 ) {
        this.listAreas = res.data;
        console.log('Areas loaded:',this.listAreas);
        if (this.routerData && this.listAreas?.length) {
          this.getFollowupRequestsByID();
        }
      }
      else {
        this.listAreas = [];
        this.toastService.showError("Failed to fetch Areas.", "Error");
      }
    })
  }

  onClearArea(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }

  selectArea(event: {
    component: IonicSelectableComponent,
    value: any,
  })
  {
    console.log("Selected area",event.value.id);
    this.selectedAreaId = event.value.area_id;
  };

  getFollowupRequestsByID() {
    if (this.routerData) {
      console.log(this.routerData,'routerdata');
      let payload = {
        tfs_id: this.routerData
      };
      this.mService.getFollowUpRequestById(payload).subscribe(
        (res: any) => {
          if (res.statusCode == 200 || res.status == 200) {
            console.log(res);
            this.statusData = res.statusData;
            this.populateFormWithExistingData(res.data[0]);
          } else {
            this.toastService.showError("Failed to fetch Follow-up Request details.", "Error");
          }
        }
      );
    }
  }

  populateFormWithExistingData(data: any) {
    console.log('Existing Data:', data);
    console.log('Available Areas:', this.listAreas);
    const matchingArea = this.listAreas?.find(area => 
      area.area_id === data.area || 
      area.area_id === String(data.area)
    );
    console.log('Matching Area:', matchingArea);
    // Populate form with existing data
    console.log(data,'populate')
    this.followupform.patchValue({
      name: data.name,
      mobile_no: data.mobile_no,
      area:  matchingArea || data.area, 
      geo_location: data.geo_location,
      category_type: data.category_type,
      service_type: data.service_type,
      recipient_name: data.recipient_name,
      request_date: data.request_date,
      request_time: data.request_time,
      responsibility_type: data.responsibility_type,
      responsible_department: data.responsible_department,
      action_type: data.action_type,
      comments: data.comments,
      status : data.status
    });

    // Set the selected area ID
    this.selectedAreaId = data.area;
    console.log('Form Value after Population:', this.followupform.value);
  }




}
