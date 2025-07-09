import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@Component({
  selector: 'app-noticedetail',
  templateUrl: './noticedetail.page.html',
  styleUrls: ['./noticedetail.page.scss'],
})
export class NoticedetailPage implements OnInit {
  @ViewChild('formSection', { static: false }) formSection: ElementRef;
  userId: string;
  routerData: any;
  routerType: any;
  setLanguage: string;
  updateStatusForm: any;
  detailNotice: any;
  statusDetails: any;
  filePath: any;
  statusesData: any;
  submitted: boolean = true;
  NoticeImage: any [] = [];
  imageName: string = '';
  imageBase = environment.webUrl;

  constructor(
    private moduleService: ModuleService,
    private loaderService: LoaderService,
    private activatedRouterServices: ActivatedRoute,
    private translateService: TranslateService,
    public atrCtrl: AlertController,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder,
    private camera: Camera,
    public geolocation: Geolocation,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy
  ) {
    this.userId = localStorage.getItem('user_id');
    this.routerData = this.router.getCurrentNavigation().extras?.state?.data;
    this.routerType = this.router.getCurrentNavigation().extras?.state?.type;
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);

    this.updateStatusForm = this.fb.group({
      comments: [''],
      status: ['', [Validators.required]],
      mobile_no: [''],
      geo_location: ['']
    });
  }

  get form() { return this.updateStatusForm.controls; }


  ngOnInit() {
    this.getnoticeDetail();
  }

  ngAfterViewInit() {
    // Use multiple techniques to ensure scrolling
    this.scrollToFormSection();
  }


  getnoticeDetail() {
    this.moduleService.viewLegalNotice({
      legal_id: this.routerData
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          console.log("view legal notice", res);
          this.detailNotice = res.viewDetails;
          this.statusDetails = res.statusDetails;
          this.statusesData = res.statusesData;
          this.filePath = res.fileUploadPath;

          // Additional scroll trigger
          if (this.routerType === 'update_noticedetail') {
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

  submit() {
    this.submitted = false;

    if (this.updateStatusForm.invalid) {
      this.scrollToError(); // Scroll to first error
      return;
    }

    // Validate image upload
    if (this.NoticeImage.length === 0) {
      this.toastService.showError('Please upload at least one image', 'Error');
      return;
    }

    let options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 3600
    };

    this.loaderService.loadingPresent();

    // Get the current position
    this.geolocation.getCurrentPosition(options).then((position) => {
      // Set the geolocation in the form control
      this.updateStatusForm.controls['geo_location'].setValue(
        position.coords.latitude + ',' + position.coords.longitude
      );

      // Proceed only after geolocation is set
      const payload = {
        ...this.updateStatusForm.value,
        created_by: this.userId,
        legal_id: this.routerData,
        attachment: this.NoticeImage.join(','), // Ensure comma-separated string
      };

      console.log("payload", payload);

      this.moduleService.updateLegalNoticeStatus(payload)
        .pipe(
          finalize(() => {
            this.loaderService.loadingDismiss();
            this.updateStatusForm.reset();
            this.NoticeImage = []; // Reset images
            this.submitted = true;
          })
        )
        .subscribe({
          next: (resp: any) => {
            if (resp.statusCode === 200) {
              this.toastService.showSuccess(
                this.setLanguage == 'ar' ? 'تم تحديث الحالة بنجاح' : 'Status Updated Successfully!',
                'Success'
              );
              this.router.navigate(['/legalnoticelist'], { replaceUrl: true });
            } else {
              this.toastService.showError('Failed to update status', 'Error');
            }
          },
          error: (error: any) => {
            console.error('Status update error:', error);
            this.toastService.showError('Something went wrong. Please try again.', 'Error');
            this.submitted = true;
          }
        });
    }).catch((error) => {
      this.loaderService.loadingDismiss();
      console.error('Geolocation error:', error);
      this.toastService.showError('Unable to fetch location.', 'Please enable permissions for location');
    });
  }

private submitData(payload: any) {
  console.log("Submitting payload:", payload);
  
  this.moduleService.updateLegalNoticeStatus(payload)
    .pipe(
      finalize(() => {
        this.loaderService.loadingDismiss();
        this.submitted = true;
      })
    )
    .subscribe({
      next: (resp: any) => {
        if (resp.statusCode === 200) {
          this.toastService.showSuccess(
            this.setLanguage == 'ar' ? 'تم تحديث الحالة بنجاح' : 'Status Updated Successfully!',
            'Success'
          );
          this.updateStatusForm.reset();
          this.NoticeImage = [];
          this.router.navigate(['/legalnoticelist'], { replaceUrl: true });
        } else {
          this.toastService.showError(resp.message || 'Failed to update status', 'Error');
        }
      },
      error: (error: any) => {
        console.error('Status update error:', error);
        this.toastService.showError('Something went wrong. Please try again.', 'Error');
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

      const imageData = await this.camera.getPicture(options);
      const random = Date.now()+ Math.floor(Math.random() * 1000); // More unique identifier
      const imageFle = `${random}.jpg`;
      const blob = this.b64toBlob(imageData, 'image/jpeg');

      const formData = new FormData();
      formData.append('uploadedImage', blob, imageFle);
      formData.append('fileUploadPath', this.filePath);
      formData.append('filePrefix', 'LN');

      this.moduleService.followupDocUpload(formData).subscribe({
        next: (resp: any) => {
          if (resp.statusCode === 200) {
            console.log('resp.dataresp.data', resp.data);
            this.imageName = resp.data[0];
            this.NoticeImage.push(this.imageName);
            console.log("Notice Images");
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

// Improved onDelete method with index parameter
onDelete(index: number) {
  if (this.NoticeImage && this.NoticeImage.length > 0 && index >= 0 && index < this.NoticeImage.length) {
    const imageToDelete = this.NoticeImage[index];
    console.log("Image to delete:", imageToDelete);

    const payload = {
      "imagename": imageToDelete,
      "filePath": this.filePath
    };

    this.loaderService.loadingPresent();
    this.moduleService.vdeleteImage(payload).subscribe({
      next: (resp: any) => {
        console.log(resp.data, "Image deleted");
        // Remove the image from the array
        this.NoticeImage.splice(index, 1);
        console.log("Image deleted from view");
        this.toastService.showSuccess("Image Deleted Successfully!", '');
        this.loaderService.loadingDismiss();
      },
      error: (err) => {
        console.error("Error deleting image", err);
        this.toastService.showError("Error deleting the image. Please try again.", '');
        this.loaderService.loadingDismiss();
      },
    });
  } else {
    console.log("No image to delete or invalid index.");
    this.toastService.showWarning("No image to delete.", '');
  }
}

  async viewMapModal(latlong: any) {

    let destination = latlong.split(',')[0] + ',' + latlong.split(',')[1];
    window.open('geo:0,0?q=' + destination + '', '_system');
  };

}
