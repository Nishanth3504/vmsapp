import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { Camera } from '@ionic-native/camera/ngx';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from 'src/environments/environment';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creategeneral',
  templateUrl: './creategeneral.page.html',
  styleUrls: ['./creategeneral.page.scss'],
})
export class CreategeneralPage implements OnInit {

  listComplaintTypes =[];
  createGeneralIncident: FormGroup
  submitted: boolean = true;
  complaintImagesUrl: any;
  complaintImages: any;
  incidentImages = [];
  source_id: any;
  latlng: any;
  listAgencies =[];
  listComplaintAreas= [];
  areasRequired: any;
  listPriorities =[];
  defaultComplaintType: {};
  defaultArea: {};
  areaSector: string;
  areaNameInvalid: boolean;
  imageBase = environment.incidentimgUrl;
  IncidentImg: any;
  isvideoCaptured: boolean = false;
  file = new File();
  videoData = '';
  showText: boolean;
  complaint_type_id: string;
  setLanguage: any;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private mService: ModuleService,
    private loaderService: LoaderService,
    private camera: Camera,
    private toast: ToastService,
    public geolocation: Geolocation,
    private androidPermissions: AndroidPermissions,
    private mediaCapture: MediaCapture,
    private zone: NgZone,
    private router: Router
  ) { 
    this.createGeneralIncident = this.fb.group({
      agency: ['', [Validators.required]],
      areaname: ['0', [Validators.required]],
      areasector:['0'],
      priority: ['', [Validators.required]],
      complainttype: ['', [Validators.required]],
      complaintsubtype: [''],
      description: ['', [Validators.required]],
    })
    this.incidentImages = [];
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);

  }

  get form() { return this.createGeneralIncident.controls; }

  ngOnInit() {
    this.getAgencies();
    this.getPriorities();
    this.getComplaintAreas();

    this.mService.languageEvent.subscribe((result: any) => {
      this.translateService.use(result);
    }),
    (error) => {
      console.log(error)
    };
    this.source_id = localStorage.getItem('sourceId');
    this.complaint_type_id = localStorage.getItem('complaint_type_id');
  }

  complaintImageCapture(){
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
    }).then((imageData) => {
      let imageBase64 = 'data:image/jpeg;base64,' + imageData;
      let realData = imageData;
      const blob = this.b64toBlob(realData, 'image/jpeg');
      const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
      const imageFile = random + '.jpg';
      const formData = new FormData();
      formData.append('complaint_proof_image', blob, imageFile);
      this.mService.incidentsImgUpload(formData).subscribe((resp: any)=>{
        this.loaderService.loadingPresent();
        if(resp.statusCode === 200){
          this.loaderService.loadingDismiss();
          console.log('resp', resp);
          this.IncidentImg = resp.data;
          this.incidentImages.push(this.IncidentImg);
          console.log(this.incidentImages,"Incident Images");
        }
        else{
          this.toast.showError('Something went wrong', 'Error')
        }
      })
    
    }, (err) => {


    });
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

  onDelete(data: any){
    console.log("data",data);
    this.mService.deleteIncidentImage(data).subscribe((resp : any)=>{
      console.log(resp.data, "deleted");
        let indexToDelete= this.incidentImages.findIndex((each)=>{
          console.log(each[0]);
          return each[0] === data;
          })
          if (indexToDelete !== -1) {
            
            this.incidentImages.splice(indexToDelete, 1);
            console.log("Image deleted from array");
          } else {
            console.log("Image not found in array");
          }
          console.log(indexToDelete); 
    })
  }

  videoRecord() {
    this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
       .then(status => {
         if (status.hasPermission) {
           this.captureVideo();
         } else {
           this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
             .then(status => {
               if (status.hasPermission) this.captureVideo();
             });
         }
       });
   }

   captureVideo() {
    this.loaderService.loadingPresent();
    let options: CaptureVideoOptions = { limit: 1, duration: 20 };
    this.mediaCapture.captureVideo(options)
      .then(
        (data: any) => {
          this.isvideoCaptured = true;
          this.toast.showSuccess("Video upload in process","success");
          let capturedVid = data[0];
          console.log("1 video data",capturedVid);
          let localVideoPath = capturedVid.fullPath;
          console.log("2 video path",localVideoPath);
          let directoryPath = localVideoPath.substr(0, localVideoPath.lastIndexOf('/'));
          let fileName = localVideoPath.substr(localVideoPath.lastIndexOf('/') + 1).replace(/[^a-zA-Z0-9-_\.]/g, '');
          this.uploadPhoto(localVideoPath);
        },
        (err: CaptureError) => {
          console.error(err);
          this.toast.showError(err, "Alert");
          this.loaderService.loadingDismiss();
        }
      );
  }

  private uploadPhoto(imageFileUri: any): void{
   
    this.file.resolveLocalFilesystemUrl(imageFileUri).then((entry) => (<FileEntry>entry).file(file => this.readFile(file)))
    .catch(err => console.log(err)
    );
  }

  private readFile(file: any){
   
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {type:file.type});

      formData.append('complaint_proof_video', imgBlob, file.name);
      this.saveStandard(formData);
    
    }
    reader.readAsArrayBuffer(file);
  }

  saveStandard(receivedStandardInfo:any){
    return new Promise((resolve, reject) => {

     this.mService.incidentsVideoUpload(receivedStandardInfo).subscribe((resp: any)=>{
        console.log("image resp", resp.data);
        if(resp.statusCode === 200){
          console.log("image resp", resp.data);
          this.videoData = resp.data;
          this.toast.showSuccess("Success","Video Uploaded Successfully");
          this.zone.run(() => {
              this.showText = true;
              console.log("showText",this.showText);
          })
          this.loaderService.loadingDismiss();
          console.log("this.videoData",this.videoData);
        }
        else{
          this.loaderService.loadingDismiss();
        }
        resolve(resp);
      }, (err) => {
            console.log(err);
            reject(err);
          });
    }).catch(error => { console.log('caught', error.message); });
  }

  getAgencies() {
    this.mService.getAgencies().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.listAgencies = res.data;
      }
      else {
        this.listAgencies = [];
      }
    })
  }

  getComplaintAreas() {
    this.mService.getComplaintAreas().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.listComplaintAreas = res.data;
        console.log(this.listComplaintAreas)
      }
      else {
        this.listComplaintAreas = [];
      }
    })
  }

  getPriorities() {
    this.mService.getPriorities().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.listPriorities = res.data;
      }
      else {
        this.listPriorities = [];
      }
    })
  }

  getComplaintTypes(agency_id: any) {
    let body = {
      "agency_id": agency_id
    }
    this.mService.getComplaintTypes(body).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.listComplaintTypes = res.data;
      }
      else {
        this.listComplaintTypes = [];
      }
    })
  }

  selectcomplainttype(event:any)
  {
    // this.defaultComplaintType = {};
    let agency = event.target.value;
    this.getComplaintTypes(agency);

    
    let agencyInfo:any = this.listAgencies.filter((item:any)=>{
      return item.id == agency;//item.areas_required
    })
    if (agencyInfo.length > 0) {
      this.areasRequired = agencyInfo[0].areas_required;
    }
    // this.defaultArea={}
    // this.getComplaintAreas();
  }

  selectArea(event:any)
  {
    console.log( event.target.value)
    if(event.target.value=='0')
    {
     this.areaSector = '0'
    }
    else
    {
      if(this.listComplaintAreas.length>0)
        {
        this.areaSector = this.listComplaintAreas.find(item => item.id == event.target.value).sector;
        console.log("this.areaSector",this.areaSector);
        }
    }
    this.areaNameInvalid = this.form.areaname.touched && this.form.areaname.invalid;
    
  }

  onSubmit(){
    this.submitted = true;
    if (this.createGeneralIncident.invalid) {
      this.submitted = false;
      this.loaderService.loadingDismiss();
      return;
    }

    let options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 3600
    };
    this.geolocation.getCurrentPosition(options).then((position) => {
      this.latlng = position.coords.latitude + ',' + position.coords.longitude;
      console.log("coordinates", this.latlng);
      this.loaderService.loadingPresent();
      let payload = {
        "source_id":this.source_id,
        "agency_name": this.createGeneralIncident.value['agency'],
        "area_name": this.createGeneralIncident.value['areaname'],
        // "sector": this.createGeneralIncident.value['areasector'],
        "sector":this.areaSector,
        "priority":this.createGeneralIncident.value['priority'],
        "complaint_type": this.createGeneralIncident.value['complainttype'],
        "complaint_subtype":this.createGeneralIncident.value['complaintsubtype'],
        "complaint_lat_lang":this.latlng,
        "description":this.createGeneralIncident.value['description'],
        "complaint_proof_image":this.incidentImages.join(','),
        "complaint_proof_video":this.videoData,
        "created_by": localStorage.getItem('user_id')
      }
  
      console.log(payload,"payload object before hitting the request");
  
      this.mService.insertIncident(payload).subscribe((resp: any)=>{
        if(resp.statusCode == 200){
          this.loaderService.loadingDismiss();
          console.log(resp);
          this.toast.showSuccess('Incident has successfully created...','Success');
          this.createGeneralIncident.reset();
        //  this.zone.run(() => {
          this.showText = false;
          this.incidentImages = [];
          console.log(this.incidentImages);
          console.log(this.showText);    
        //})
          this.router.navigate(['/viewgeneral',this.complaint_type_id]);
         //this.router.navigate(['/viewgeneral',this.complaint_type_id], { replaceUrl: true });
        }
        else{
          this.loaderService.loadingDismiss();
          this.toast.showError('Something went wrong', 'Error');
        }
      })
    })    
  }

  ionViewDidLeave()
  {
    this.showText = false;
    this.incidentImages = [];
  }
}
