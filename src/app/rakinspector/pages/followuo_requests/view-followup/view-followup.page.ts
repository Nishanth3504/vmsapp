import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-followup',
  templateUrl: './view-followup.page.html',
  styleUrls: ['./view-followup.page.scss'],
})
export class ViewFollowupPage implements OnInit, AfterViewInit {
  @ViewChild('formSection', { static: false }) formSection: ElementRef;

  
  userId: any;
  setLanguage: string;
  detailFollowup: any;
  statusDetails: any;
  routerData: any;
  routerType: any;
  updateStatusForm: FormGroup;
  submitted: boolean = true;
  followupblobImage: any=[];
  followupImage: string  ='';
  imageName: any='';
  filePath: any;
  imageBase : any ='https://rpwebapps.us/clients/vms-live/';
  userType: any;
  statusData: any;

  constructor(
    private moduleService : ModuleService,
    private loaderService: LoaderService,
    private activatedRouterServices: ActivatedRoute,
    private translateService: TranslateService,
    public atrCtrl: AlertController,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder,
    private camera: Camera,
  ) {
    this.userId = localStorage.getItem('user_id');
    this.userType = localStorage.getItem('user_type');
    this.routerData = this.router.getCurrentNavigation().extras?.state?.data;
    this.routerType = this.router.getCurrentNavigation().extras?.state?.type;
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);

    this.updateStatusForm = this.fb.group({
      comments: ['', [Validators.required]],
      status: ['', [Validators.required]],
      arrival_time: ['',]
    });
   }

  get form() { return this.updateStatusForm.controls; }
   

  ngOnInit() {
    this.getFollowupDetail();
  }
  ngAfterViewInit() {
    // Use multiple techniques to ensure scrolling
    this.scrollToFormSection();
  }

// Improve error handling in getFollowupDetail method
 getFollowupDetail() {
    this.moduleService.viewFollowUpRequest({
      tfs_id: this.routerData,
      user_id: this.userId
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.detailFollowup = res.viewDetails;
          this.statusDetails = res.statusDetails;
          this.filePath = res.fileUploadPath;
          this.statusData = res.statusData;
          if(this.detailFollowup.arrival_time == null ){
            this.updateStatusForm.controls['arrival_time'].setValidators([Validators.required]);
            this.updateStatusForm.controls['arrival_time'].updateValueAndValidity();
          }
          

          // Additional scroll trigger
          if (this.routerType === 'update_followup_status') {
            setTimeout(() => {
              this.scrollToFormSection();
            }, 300);
          }
        }
      },
      error: (error) => {
        // Error handling
      }
    });
  }


async folloeupImageCapture() {
  const options: CameraOptions = {
    quality: 50,
    sourceType: this.camera.PictureSourceType.CAMERA,
    encodingType: this.camera.EncodingType.JPEG,
    destinationType: this.camera.DestinationType.DATA_URL,
    correctOrientation: true // Added to handle image orientation
  };

  try {
    this.loaderService.loadingPresent();
    
    // Add maximum image upload limit
    if (this.followupImage.length >= 5) {
      this.toastService.showError('Maximum 5 images allowed', 'Upload Limit');
      this.loaderService.loadingDismiss();
      return;
    }

    const imageData = await this.camera.getPicture(options);
    const random = Date.now(); // More unique identifier
    const imageFle = `${random}.jpg`;
    const blob = this.b64toBlob(imageData, 'image/jpeg');
    
    const formData = new FormData();
    formData.append('uploadedImage', blob, imageFle);
    formData.append('fileUploadPath', this.filePath);
    formData.append('filePrefix', 'FUR');

    this.moduleService.followupDocUpload(formData).subscribe({
      next: (resp: any) => {
        if (resp.statusCode === 200) {
          this.imageName = resp.data[0];
          this.followupImage=this.imageName;
          this.toastService.showSuccess('Image uploaded successfully', 'Success');
        } else {
          this.toastService.showError("Image upload failed", "Error");
        }
      },
      error: (err) => {
        console.error('Image upload error:', err);
        this.toastService.showError('Failed to upload image', 'Network Error');
      },
      complete: () => {
        this.loaderService.loadingDismiss();
      }
    });
  } catch (err) {
    console.error('Camera capture error:', err);
    this.toastService.showError('Failed to capture image', 'Camera Error');
    this.loaderService.loadingDismiss();
  }
}
  

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    let sliceSize = 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  submit() {
    this.submitted = true;
  
    if (this.updateStatusForm.invalid) {
      this.scrollToError(); // Scroll to first error
      return;
    }
  
    // Validate image upload
    // if (this.followupImage.length === 0) {
    //   this.toastService.showError('Please upload at least one image', 'Error');
    //   return;
    // }
    let payload: any;
    if(this.userType == 12){
         payload = {
      comments: this.updateStatusForm.value['comments'],
      status:this.updateStatusForm.value['status'],
      arrival_time: this.updateStatusForm.value['arrival_time'],
      created_by: this.userId,
      tfs_id: this.routerData,
      attachment: this.followupImage // Ensure comma-separated string
    };
    }
    else{
         payload = {
      comments: this.updateStatusForm.value['comments'],
      status:this.updateStatusForm.value['status'],
      created_by: this.userId,
      tfs_id: this.routerData,
      attachment: this.followupImage // Ensure comma-separated string
    };
    }
  
  
    this.loaderService.loadingPresent();
    this.moduleService.updateFollowupStatus(payload)
      .pipe(
        finalize(() => {
          this.loaderService.loadingDismiss();
          this.updateStatusForm.reset();
          this.followupImage =''; // Reset images
        })
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.statusCode === 200) {
            this.toastService.showSuccess(this.setLanguage == 'ar' ? 'تم تحديث الحالة بنجاح': 'Status Updated Successfully!"', 'Success');
            this.router.navigate(['/dashboard']);
          } else {
            this.toastService.showError('Failed to update status', 'Error');
          }
        },
        error: (error: any) => {
          console.error('Status update error:', error);
          this.toastService.showError('Something went wrong. Please try again.', 'Error');
        }
      });
  }
  scrollToError(): void {
    const firstElementWithError = document.getElementById("updateForm").querySelector('form .ng-invalid[formControlName]');
    console.log("aa:", firstElementWithError);
    this.scrollTo(firstElementWithError);
  }

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  scrollToFormSection() {
    requestAnimationFrame(() => {
      try {
        if (this.formSection && this.formSection.nativeElement) {
          this.formSection.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          return;
        }
      } catch (error) {
        console.error('Scroll to form failed:', error);
      }
    });
  }

  onDelete(){
    if(this.followupImage){
      let payload = {
        "imagename":this.followupImage,
        "filePath":this.filePath
      }
      this.moduleService.vdeleteImage(payload).subscribe({
        next: (resp: any)=>{
          this.followupImage = '';
          console.log('Image deleted');
          this.toastService.showSuccess('Image Deleted Successfully!','');
        },
        error: (err) => {
          console.error("Error deleting image", err);
          // Optionally show a toast or message to the user
          this.toastService.showError("Error deleting the image. Please try again.",'');
        },
      });
    } else {
      console.log("No image to delete.");
      this.toastService.showWarning("No image to delete.",'');
    }
 
  }
  

}
