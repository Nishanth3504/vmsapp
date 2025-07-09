import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewmapmodalPage } from '../../modalpopup/viewmapmodal/viewmapmodal.page';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
//import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModuleService } from 'src/app/shared/services/module.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { File as NativeFile, FileEntry } from '@ionic-native/File/ngx';

import { ToastService } from 'src/app/shared/services/toast.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { VideoEditor,CreateThumbnailOptions } from '@ionic-native/video-editor/ngx';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { TranslateService } from '@ngx-translate/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ChangeDetectorRef } from '@angular/core'; 
import { environment } from 'src/environments/environment';
import { DbService } from 'src/app/shared/services/offline-code/db.service';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.page.html',
  styleUrls: ['./add-report.page.scss'],
})
export class AddReportPage implements OnInit {


  submitted = true;
  addReport: FormGroup;
  setLanguage: any;
  reportImages: any[] = [];
  reportImagesBlob: any[]=[];
  @ViewChild('sectorComponent') sectorComponent : IonicSelectableComponent;
  showText: boolean = false ;
  complaintImg: any;
  imageBase = environment.reportImagePath;
  sourceId: any;
  imageBase64: string;
  reservationSitesList: any;
  programcodeList: any;
  routerData: any;
  routerType: any;
  detailReports: any;
  statusDetails: any;
  sectorsList: any;
  reportImage: any;
  plateSourceList: any;
  selectedPlateSource: any;
  plateCategoryData: any;
  plateCategoryid: any;
  selectedPlateSourceCode: any;
  plateCodeDataList: any;
  pc_id: any;

  constructor(
    private modalController: ModalController,
    public routerServices: Router,
    private fb: FormBuilder,
    private mService: ModuleService,
    private camera: Camera,
    private loaderService: LoaderService,
    private translateService: TranslateService,
    public toastService: ToastService,
    public geolocation: Geolocation,
    public videoEditor : VideoEditor,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private moduleService: ModuleService,
  ) {
    this.sourceId = localStorage.getItem('sourceId');
    this.routerData = this.routerServices.getCurrentNavigation().extras.state.data;
    this.routerType = this.routerServices.getCurrentNavigation().extras.state.type;
    console.log(this.routerData,"Router Data");
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
    this.addReport = this.fb.group({
      reservationsite: ['', [Validators.required]],
      sector:['',[Validators.required]],
      programCode:['',[Validators.required] ],
      violationcount: ['0'],
      complaintscount: ['0'],
      warningscount: ['0'],
      billboardcounts: ['0'],
      reservationcount: ['0'],
      containerscount: ['0'],
      report: ['', [Validators.required]],
      attachements:[''],
      plateNo:['', [Validators.required]],
      plateSource:['',[Validators.required]],
      plateCategory:['',[Validators.required]],
      plateCode:['',[Validators.required]]
    });
    console.log("show",this.showText);
  }

  get form() { return this.addReport.controls; }

  ngOnInit() {
    this.mService.languageEvent.subscribe((result: any) => {
      this.translateService.use(result);
    }),
      (error) => {
        console.log(error)
      };
    console.log('Form Status:', this.addReport.status);
    console.log('Form Errors:', this.addReport.errors);
    // this.getAreas();
    this.getReservationSites();
    this.getProgramcodes();
    this.getSectors();
    if(this.routerData != ''){
      this.moduleService.getProgramCodes().subscribe(
        (result: any) => {
          this.programcodeList = result.data;
          this.getReportDetail();
        },
        (error) => {
          console.error('Error fetching program codes:', error);
          // You might want to show an error message to the user here
        }
      );
    }
    this.getPlateSourceData();
  }

  async onSubmit() {
    console.log(this.addReport);
    console.log('Form Status:', this.addReport.status);
    console.log('Form Errors:', this.addReport.errors);
    
    this.loaderService.loadingPresent();
    this.submitted = true;
    
    if (this.addReport.invalid) {
      this.submitted = false;
      this.loaderService.loadingDismiss();
      return;
    }

    let payload : any = {
      "reservation_site_id":this.addReport.value['reservationsite'],
      "reservation_sector":this.addReport.value['sector'].sector,
      "program_code":this.addReport.value['programCode'],
      "no_of_violations":this.addReport.value['violationcount'],
      "no_of_complaints":  this.addReport.value['complaintscount'],
      "no_of_warnings":this.addReport.value['warningscount'],
      "no_of_removal_billbords":this.addReport.value['billboardcounts'],
      "no_of_reservations":this.addReport.value['reservationcount'],
      "no_of_containers": this.addReport.value['containerscount'],
      "comment":this.addReport.value['report'],
      "attachment": this.reportImages.toString(),
      "report_id": this.routerType === 'update_report' ? this.routerData : '',
      "inspector_plate_no":this.addReport.value['plateNo'],
      "inspector_plate_source": this.selectedPlateSource,
      "inspector_plate_category": this.pc_id,
      "inspector_plate_code": this.addReport.value['plateCode']
    }

    console.log(payload);
      if(this.routerType === 'add_report'){
        payload.created_by =  localStorage.getItem('user_id')
      }
      else{
        payload.updated_by =  localStorage.getItem('user_id')
      }
      console.log(payload);
    
    try {
      const res = await this.mService.createReport(payload).toPromise();
      this.loaderService.loadingDismiss();
      console.log(res);
      
      if (res.statusCode == 200 || res.status == 200) {
        this.toastService.showSuccess('Report Created Successfully', 'Thank You');
        this.addReport.reset();
        this.addReport.setErrors(null); 
        this.addReport.updateValueAndValidity();
        this.reportImages = [];
        this.reportImagesBlob = [];
        this.routerServices.navigate(['/dashboard']);
      }
    } catch (error: any) {
      this.submitted = false;
      this.loaderService.loadingDismiss();
      console.log(error);
      if (error.status === 401) {
        this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
        // Optionally, redirect to login page or refresh token
        // this.routerServices.navigate(['/login']);
      } else if (error.statusCode == 400 && error.data && error.data.msg) {
        this.toastService.showError(error.data.msg, 'Alert');
      } else {
        this.toastService.showError('An error occurred. Please try again.', 'Alert');
      }
      console.error("Error creating Report:", error);
    }
  }

  checkPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.enableGPS();
        } else {
          this.locationAccPermission();
        }
      },
      error => {
        //alert(error);
        //this.toastService.showError(error, 'Alert');
      }
    );
  }

  locationAccPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              this.enableGPS();
            },
            error => {
              //alert(error)
              //this.toastService.showError(error, 'Alert');
            }
          );
      }
    });
  }

  enableGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        localStorage.setItem("locationserviceenabled", "true");
      },
      error => {
        localStorage.setItem("locationserviceenabled", "false");
      }
    );
  }

  // const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
  // const imageFle = random + '.jpg';

  async complaintImageCapture(){
    const options: CameraOptions = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
    };  try {
      this.loaderService.loadingPresent();
      const imageData = await this.camera.getPicture(options);
      const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
      const imageFle = random + '.jpg';
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      const blob = this.b64toBlob(imageData, 'image/jpeg');
      const formData = new FormData();
      formData.append('uploadedImage', blob, imageFle);
      this.reportImagesBlob.push(blob);
      console.log("Captured image blob:", blob);
      this.moduleService.reportDocUpload(formData).subscribe((resp: any)=>{
        if(resp.statusCode === 200){
          this.loaderService.loadingDismiss();
          this.reportImage = resp.data;
          console.log("reportImage", this.reportImage);
          this.reportImages.push(this.reportImage);
          this.loaderService.loadingDismiss();
        }
        else{
          this.toastService.showError("Image not upladed successfully", "Error")
          this.loaderService.loadingDismiss();
        }
      })
    } catch (err) {
      console.error('Error capturing image:', err);
      this.loaderService.loadingDismiss();
    }
    console.log(this.reportImages);
    console.log(this.reportImagesBlob,"blobdata");
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

  removeImage(index: number) {
    this.reportImages.splice(index, 1);
  }

  onDelete(data: any){
    console.log("data",data);
    let payload = {
      "imagename":data,
      "filePath":'uploads/permits/images/'
    }
    this.moduleService.vdeleteImage(payload).subscribe((resp : any)=>{
      console.log(resp.data, "deleted");
        let indexToDelete= this.reportImages.findIndex((each)=>{
          console.log(each[0]);
          
          return each[0] === data;
          
          })
          if (indexToDelete !== -1) {
            // Remove the image from the array if found
            this.reportImages.splice(indexToDelete, 1);
            console.log("Image deleted from array");
          } else {
            console.log("Image not found in array");
          }
          console.log(indexToDelete);  
    })
  }

  async openViewer() {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      cssClass: 'ion-image-viewers',
      keyboardClose: true,
      showBackdrop: true
    });
    return await modal.present();
  }




    getReservationSites(){
      if (localStorage.getItem('isOnline') === "true") {
        this.moduleService.getReservationSites().subscribe((result: any) => {
          console.log('getReservationSites', result);
          this.reservationSitesList = result.data;
        }),
          (error) => {
            console.log(error)
          };
      }
      else {
        console.log("App is offline")
        // this.dbservice.fetchReservedCodes().subscribe((res) => {
        //   console.log('getReservedCode', res);
        //   this.reservedCodeList = res;
        // }),
        //   (error) => {
        //     console.log(error)
        //   };
      }
    };


    getProgramcodes() {
      if (localStorage.getItem('isOnline') === "true") {
        this.moduleService.getProgramCodes().subscribe((result: any) => {
          console.log('getProgramCodes', result);
          if (result.statusCode === 200 && Array.isArray(result.data)) {
            this.programcodeList = result.data;
          } else {
            console.error('Unexpected program codes response:', result);
            this.programcodeList = [];
          }
        }, (error) => {
          console.error('Error fetching program codes:', error);
          this.programcodeList = [];
        });
      } else {
        console.log("App is offline");
        // Handle offline scenario if needed
      }
    }

    getReportDetail(){
      let body={
        report_id :this.routerData
      }
      this.loaderService.loadingPresent();
      console.log("payload", body);
      this.moduleService.detailReport(body).subscribe((res: any) => {
        console.log(res, "Response data detail");
        
        if (res.statusCode == 200) {
          this.detailReports = res.viewDetails[0];
          this.statusDetails = res.statusDetails;
          console.log(this.detailReports);
          this.populateForm();
        }
        else {
          this.detailReports = [];
          this.statusDetails = [];
        }
        this.loaderService.loadingDismiss();
      })
    }

    populateForm() {

      if (this.detailReports) {
        console.log("this.programcodeList", this.programcodeList);
        console.log("this.detailReports.program_code", this.detailReports.program_code)
       const matchingProgramCode = this.programcodeList.find(code => code.id == this.detailReports.program_code);
       const matchingSector = this.sectorsList.find(sector => sector.sector == this.detailReports.reservation_sector);
       console.log(matchingProgramCode);

        this.addReport.patchValue({
          reservationsite: this.detailReports.reservation_site_id,
          sector: matchingSector ? matchingSector : '',
          programCode: matchingProgramCode ? matchingProgramCode.id : '',
          violationcount: this.detailReports.no_of_violations,
          complaintscount: this.detailReports.no_of_complaints,
          warningscount: this.detailReports.no_of_warnings,
          billboardcounts: this.detailReports.no_of_removal_billbords,
          reservationcount: this.detailReports.no_of_reservations,
          containerscount: this.detailReports.no_of_containers,
          report: this.detailReports.comment
          // report: this.statusDetails[0]?.comment || '' // Using the first comment if available
        });
    
        // // If there's an attachment, you might want to display it
        // if (this.statusDetails[0]?.attachment) {
        //   this.imageBase64 = this.statusDetails[0].attachment;
        //   this.showText = true;
        // }
      }
    }

    getSectors(){
      this.moduleService.getSectors().subscribe((res: any) => {
        console.log(res, "Response data");
        
        if (res.statusCode == 200) {
          this.sectorsList = res.sectorsData;
          console.log(this.sectorsList);
        }
        else {
          this.sectorsList = [];
        }
      })
    };

    getPlateSourceData() {
      let payload = {
        "source_id": this.sourceId
      }
      this.moduleService.getPlateSource(payload).subscribe((result: any) => {
        this.plateSourceList = result.data;
        console.log('PlateSource', this.plateSourceList);
        const defaultPlateSource = this.plateSourceList.find(item => item.is_default_show === '1');
        if (defaultPlateSource) {
          this.addReport.patchValue({ plateSource: defaultPlateSource });
        }
      }),
        (error) => {
          console.log(error)
        };

    }
  
    getSourceValue(event) {
    if (this.addReport.controls['plateCategory']) {
    this.addReport.controls['plateCategory'].setValue('');
    }
      const selectedOption = event.detail.value;
      this.selectedPlateSource = selectedOption.car_sid;
      this.selectedPlateSourceCode = selectedOption.raqab_code;
      console.log(this.selectedPlateSource, "car_sid_platesource");
      this.getPlateCategoryData();
    }
  
    getPlateCategoryData() {
      let payload = {
        "source_id": this.sourceId,
        "plate_source_id": this.selectedPlateSource,
      }
      this.moduleService.getPlateCategory(payload).subscribe((result: any) => {
        this.plateCategoryData = result.data;
        console.log('PlateCategory', this.plateCategoryData);
        const defaultPlateCategory = this.plateCategoryData.find(item => item.is_default_show === '1');
        if (defaultPlateCategory) {
          this.addReport.patchValue({ plateCategory: defaultPlateCategory });
        }
      }),
        (error) => {
          console.log(error)
        };
    }
  
    platecategoryId(event: any) {
      if (this.addReport.controls['plateCode']) {
        this.addReport.controls['plateCode'].setValue('');
      }
      this.pc_id = event.detail.value.id;
      this.addReport.value['plateCategory'] = this.pc_id;
      if (this.sourceId == 1) {
        this.plateCategoryid = event.detail.value.aber_code;
      }
      else {
        this.plateCategoryid = event.detail.value.raqab_code;
      }
      console.log(" create violation values after selecting plate category:", this.addReport.value);
      this.getPlateCodeData();
    }
  
    getPlateCodeData() {
      let payload = {
        "source_id": this.sourceId,
        "plate_category": this.plateCategoryid,
        "plate_source": this.selectedPlateSourceCode
      }
      this.moduleService.getPlateCode(payload).subscribe((result: any) => {
        console.log('getPlateCode', result);
        this.plateCodeDataList = result.data;
        if (this.plateCodeDataList.length > 0) {
          this.plateCodeDataList = this.plateCodeDataList.filter((item: any) => {
            return item.source_code === String(this.selectedPlateSourceCode);
          })
        }
      }),
        (error) => {
          console.log(error)
        };
    }

  
}
