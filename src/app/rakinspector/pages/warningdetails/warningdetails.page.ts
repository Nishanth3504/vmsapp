import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment';
import { File } from '@ionic-native/file/ngx';
//import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DbService } from 'src/app/shared/services/offline-code/db.service';
//import { VideoPlayer, VideoOptions } from '@ionic-native/video-player/ngx';
import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { ConnectivityService } from 'src/app/shared/services/offline-code/connectivity.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-warningdetails',
  templateUrl: './warningdetails.page.html',
  styleUrls: ['./warningdetails.page.scss'],
})
export class WarningdetailsPage implements OnInit {
  violationData: any;
  amendData: any;
  amendPath: any;
  ViolatinDoc: any;
  ViolationDocumentsPath: any;
  violationVideosPath: any;
  docsImages: any = [];
  identityDocs: any = [];
  violationId: any;
  violation_video: any;
  reference_number: any;
  dailyfines: any;
  fineamount: any;
  setLanguage: any;
  options: StreamingVideoOptions;
  // videoOpts : VideoOptions;
  publishdisabled: any = false;
  isOnline: boolean = true;
  fineamountvisible = false;
  signature: string = "";
  SignPath: string = "";
  userId: any;
  warningStatus:any='open';
  isPrivellage:any;
  buttonEnabled:any=false;
  warningHours: any;
  currentTime: any;
  createdOn: any;
  violatonVideo: string;
  closePhotos:any= [];
  closeBasePhotos: any =[];
  cImg: any="";
  closingDetails: FormGroup;
  imageBase = environment.warningProofUrl;
  submitted: boolean= true;
  notesData : any;
  warningSpecification: boolean = false;
  statusDetails: any;
  warningImages: any[] = [];
  warningProofUrl: string;
  defaultwarningHours: any='';
  isReject: boolean = false;
  warningRejectedReasonData: any;
  reason_id : any;
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private moduleService: ModuleService,
    private routerServices: Router,
    private toastService: ToastService,
    //private transfer: FileTransfer,
    private file: File,
    private platform: Platform,
    private downloader: Downloader,
    private translateService: TranslateService,
    private dbservice: DbService,
    private videoPlayer: VideoPlayer,
    private streamingMedia: StreamingMedia,
    private connectivity: ConnectivityService,
    private androidPermissions: AndroidPermissions,
    private loaderService: LoaderService,
    public alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private fb: FormBuilder

  ) {
    this.warningProofUrl = environment.warningProofUrl;


    if (localStorage.getItem('isOnline') === "true") {
      this.isOnline = true;
    }
    else {
      this.isOnline = false;
    }
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);

    this.closingDetails = this.fb.group({
      closingImage:['', Validators.required],
      notes: ['']
    })    
    
  }



  checkPermissions() {
    this.androidPermissions.requestPermissions(
      [
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      ]
    );
  }

  ngOnInit() {
    this.warningSpecification = false;
    this.userId = localStorage.getItem('user_id');
    this.amendPath = environment.uploadPath;
    // this.ViolatinDoc = environment.ViolationDocumentsPath;
    // this.ViolationDocumentsPath = environment.ViolationVidoesPath;
    this.violationVideosPath = environment.videoUrl;
    this.moduleService.languageEvent.subscribe((result: any) => {
      this.translateService.use(result);
    });
    this.allow();
   
    console.log("tis.currentTime", this.currentTime);
    this.warningDetails();
    // this.checkButtonStatus();
  }

  async warningDetails(){
     await this.activatedRouterServices.params.subscribe((res: any) => {

      console.log("violation Details", res)
      if (res.id) {

        if (localStorage.getItem('isOnline') === "true") {
          console.log("grthjyuhjkijyh","hugyhruiy6hjit")
          this.amendPath = environment.uploadPath;
          this.SignPath = environment.signaturePath;
          this.violationId = res.id;
          //const body=new FormData()
          console.log(res.id)

          //body.append("warning_id",res.id.toString())
          if(res.id === null || res.id === "" || res.id === undefined){
            return
          }
          else{
            let body={
              userid:localStorage.getItem('user_id'),
              warningid:res.id
            }
            console.log(body)
            this.moduleService.viewWarningDeatails(body).pipe(finalize(() => {
              this.ViolatinDoc = environment.imgUrl;
              this.ViolationDocumentsPath = environment.ViolationDocumentsPath;
              this.violatonVideo = environment.videoUrl
  
              Object.keys(this.violationData).map((key, index) => {
                if (this.violationData[key] == "null") {
                  this.violationData[key] = "--";
                }
              });
              console.log("violationData", this.violationData);
              console.log(this.violationData.side_type);
              // const docs = this.violationData.violation_docs;
              // const idocs = this.violationData.identity_doc;
              this.signature = this.violationData.violator_signature;
              this.reference_number = this.violationData.reference_number;
              this.dailyfines = this.violationData.daily_fines;
              this.fineamount = this.violationData.fine_amount;
              this.violation_video = this.violationData.violation_video;
              // this.docsImages.push(docs.split(","));
              // this.identityDocs.push(idocs.split(","));
              // console.log(this.docsImages)
              // console.log(this.identityDocs)
              if(this.violationData.violation_docs){
                const docs = this.violationData.violation_docs;
                this.docsImages.push(docs.split(","));
                console.log("docsImages",this.docsImages);
              }
              if(this.violationData.identity_doc){
                const idocs = this.violationData.identity_doc;
                this.identityDocs.push(idocs.split(","));
                console.log("identityDocs",this.identityDocs);
              }
              if(this.violationData.warningStatusDetails){
                this.statusDetails = this.violationData.warningStatusDetails;
                const wdocs = this.violationData.warningStatusDetails.close_attachment_file;
                this.warningImages.push(wdocs.split(","));
                console.log("warningImages", this.warningImages);
              }
              this.currentTime = this.violationData.currentdatetime;
              console.log("tis.currentTime", this.currentTime);
              this.checkButtonStatus();
  
            })).subscribe((result: any) => {
              console.log(result);
              if (result.statusCode == 200 || res.status === 200) {
                this.violationData = result.data;
                if(this.violationData.warning_hours_value !== false){
                  this.warningHours = this.violationData.warning_hours_value[0].hours_value;
                }
                console.log("warning hours", this.warningHours);
                this.defaultwarningHours = this.violationData.fc_warning_hours;
                console.log("warning hours", result.data.warning_hours_value[0]);
                this.currentTime = this.violationData.currentdatetime;
                console.log("this.currentTime", this.currentTime);
                console.log(typeof(this.currentTime),"typepeeee");
  
                this.createdOn = this.violationData.created_on;
                console.log("this.createdOn",this.createdOn);
                
                // console.log("created", this.violationData.created_on);
                
                
                console.log(this.violationData);
                if(this.violationData.create_violation == 1){
                  this.warningSpecification = true;
                }
              }
  
            }),
              (error) => {
                console.log(error)
              };
          }
    

          //Amend Request Data
          let body={
            userid:localStorage.getItem('user_id'),
            warningid:res.id
          }
          this.moduleService.viewWarningDeatails(body).subscribe((result: any) => {
            console.log(result);
            if (result.statusCode == 200 || res.status === 200) {
              this.amendData = result.data[0];
              console.log(this.violationData);
            }

          }),
            (error) => {
              console.log(error)
            };
        }
        else {
          this.dbservice.fetchviolationbyid(res.id).then((result: any) => {
            console.log(result);
            this.violationData = result;
            // Object.keys(this.violationData.ViolatiionList).map((key, index) => {
            //   if (this.violationData.ViolatiionList[key] == "null") {
            //     this.violationData.ViolatiionList[key] = "--";
            //   }
            // });
            this.ViolatinDoc = "http://localhost/_app_file_/" + this.violationData.ViolatiionList.docpath.replace('file://', '');
            this.ViolationDocumentsPath = "http://localhost/_app_file_/" + this.violationData.ViolatiionList.docpath.replace('file://', '');
            this.SignPath = "http://localhost/_app_file_/" + this.violationData.ViolatiionList.signaturepath.replace('file://', '');
            console.log("violationData", this.violationData);
            const docs = this.violationData.ViolatiionList.violation_docs;
            const idocs = this.violationData.ViolatiionList.identity_doc;
            this.signature = this.violationData.ViolatiionList.violator_signature;
            this.reference_number = res.id;//this.violationData.ViolatiionList.reference_number;
            this.dailyfines = this.violationData.ViolatiionList.daily_fines;
            this.fineamount = this.violationData.ViolatiionList.fine_amount;
            this.violation_video = this.violationData.ViolatiionList.violation_video;

            this.docsImages.push(docs.split(","));
            this.identityDocs.push(idocs.split(","));

          })

          //Amend Request Data
          this.dbservice.getviolationAmendRequests(res.id).then((result) => {
            console.log(result);
            if (result.length > 0) {
              this.amendData = result[0];
              this.amendPath = "";
              this.amendData.images = "http://localhost/_app_file_/" + this.amendData.images.replace('file://', '');
            }
          })
        }
      }
    }),
      (error) => {
        console.log(error)
      };
  }


  publishViolation() {
    this.publishdisabled = true;
    this.alertController.create({
      header: 'Confirm',
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            this.publishdisabled = false;
          }
        },
        {
          text: 'Publish',
          handler: (data1: any) => {
            var data = {
              reference_number: this.reference_number,//this.violationId,
              user_id: localStorage.getItem('user_id')
            }
            if (localStorage.getItem('isOnline') === "true") {
              this.loaderService.loadingPresentcm("Publishing. Please Wait...");
              this.moduleService.publishViolation(data).subscribe((result: any) => {
                if (result.statusCode === 200 || result.status === 200) {
                  let smsbodyInfo = {
                    reference_number: this.reference_number,
                    dailyfines: this.dailyfines,
                    fineamount: this.fineamount
                  }
                }
                this.loaderService.loadingDismiss();
                this.routerServices.navigate([`/warninglist`], { state: { reload: true } }).then();
                this.toastService.showSuccess('Violation has been published successfully', 'Thank You');
              }),
                (error) => {
                  this.publishdisabled = false;
                  //console.log(error)
                  this.toastService.showError(error,"Alert")
                };
            }
            else {
              this.loaderService.loadingPresentcm("Publishing. Please Wait...");
              this.dbservice.publishViolation(this.reference_number).then((result: any) => {
                this.loaderService.loadingDismiss();
                this.routerServices.navigate([`/warninglist`], { state: { reload: true } }).then();
                this.toastService.showSuccess('Violation has been published successfully', 'Thank You');
              })
            }
          }
        }
      ]
    }).then(res => {
      res.present();
    });

  }

  download() {
    let url: any;
    if (localStorage.getItem('isOnline') === "true") {
      this.isOnline = true;
      const url = this.violationVideosPath + this.violation_video;
      var request: DownloadRequest = {
        uri: url,
        title: 'MyDownload',
        description: '',
        mimeType: '',
        visibleInDownloadsUi: true,
        notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
        destinationInExternalFilesDir: {
          dirType: 'Downloads',
          subPath: 'MyFile.mp4'
        }
      };

      this.downloader.download(request)
        .then((location: string) => {
          console.log('File downloaded at:' + location)
          this.toastService.showSuccess("Video downloaded successfully","success")
        })
        .catch((error: any) => {
          console.error(error)
        }
        );
    }
    else {
      this.isOnline = false;
      //this.videoOpts = {volume : 1.0};
      this.videoPlayer.play(this.violationData.videospath + '/' + this.violation_video).then(() => {
        //this.videoPlayer.play('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4').then(() => {
        console.log('video completed');
      }).catch(err => {
        console.log(err);
      });

    }
  }

  updateVal(event:any){
    this.warningStatus=event.target.value
    if(this.warningStatus === "closed"){
      console.log("this.buttonEnabled",this.buttonEnabled);  
    }
  }


  async updatestatus(violationData: any) {
    console.log("test")
    this.submitted = true;
      console.log(this.buttonEnabled);

      if(violationData == 'Closed' &&this.closePhotos.length === 0){
        this.toastService.showError('Attachment is required','Error');
        return 
      }


      this.notesData = this.closingDetails.value['notes']

      let data = {
        created_by : this.userId,
        warning_id : this.violationId,
        note: this.notesData,
        attachment: this.closePhotos.toString(),
        status: violationData
      }
      console.log("data", data);

      this.moduleService.updateWarningStatus(data).subscribe((resp: any) => {
        debugger
        if (resp.statusCode === 200 || resp.status === 200) {
          if (violationData == 'Closed') {
            this.toastService.showSuccess(this.setLanguage == 'ar' ? 'تم تحديث الحالة بنجاح': 'Status Updated Successfully!', 'Thank You');
          }
          else {
            this.toastService.showSuccess(resp.data.msg, 'Thank You');
          }
          this.routerServices.navigate([`/warninglist`], { state: { reload: true } }).then();
        }
      },
        (error: any) => {

          let parsedError: any;
          try {
              // If the error is a string, parse it
            parsedError = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
          } catch (e) {
            parsedError = error;
          }

          console.log(parsedError.statusCode,"error");
          
          if (parsedError.statusCode == 400 && parsedError.data && parsedError.data.msg) {
            this.toastService.showError(parsedError.data.msg, 'Alert');
          } else if (parsedError.status === 401) {
            this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
          }
           else {
            this.toastService.showError('An error occurred. Please try again.', 'Alert');
          }
          console.error("Error creating violation:", error);
        }
      );
    // } 
  }

  allow(){
    this.moduleService.allowInspector().subscribe((res: any)=>{
      console.log("allowwww",res);
      this.isPrivellage = res.data;
    })
  }

  checkButtonStatus() {
    let current = new Date(this.currentTime);
    console.log(current);
    let currentNewDate = current.getTime();
    console.log("currentNewDate",currentNewDate);

    let created = new Date(this.createdOn);
    console.log(created);
    let createdNewDate = created.getTime();
    console.log("createdNewDate",createdNewDate);

    console.log("this.warningHours",this.warningHours); 
    if(this.warningHours === null || this.warningHours === undefined){
      let selectedHours = this.defaultwarningHours
      console.log("selectedHours",selectedHours);
      let endTime = createdNewDate + selectedHours * 60 * 60 * 1000;
      let endDate = new Date(endTime);
      console.log("New End Date:", endDate);
      if (current > endDate && this.warningSpecification) {
        this.buttonEnabled = true;
      }
    }else{
      let selectedHours = this.warningHours
      console.log("selectedHours",selectedHours);
      let endTime = createdNewDate + selectedHours * 60 * 60 * 1000;
      let endDate = new Date(endTime);
      console.log("New End Date:", endDate);
      if (current > endDate && this.warningSpecification) {
        this.buttonEnabled = true;
      }
    }
  }
  warningToviolation(data: any){
    console.log("data", data);
    let payload ={
      warning_id : data,
      created_by: this.userId
    }
    this.moduleService.warningtoviolation(payload).subscribe((res: any)=>{
     
      console.log("respppp", res);
      if(res.statusCode === 200 || res.status === 200 ){
        this.toastService.showSuccess(res.data.msg, "Success");
        this.routerServices.navigate(['/warninglist'], {replaceUrl : true})
      }
      if(res.statusCode === 400 || res.status === 400){
        this.toastService.showError(res.data.msg, "Error");
      }
    })
  }

  identityDocCam() {
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
    }).then((imageData) => {

      let imageBase64 = 'data:image/jpeg;base64,' + imageData;
      let realData = imageData;
      let blob = this.b64toBlob(realData, 'image/jpeg');
      const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
      const imageFle = random + '.jpg';
      this.closeBasePhotos.push(imageBase64);
      let filePath = this.file.externalDataDirectory + imageFle;
      this.loaderService.loadingPresent()
      if (localStorage.getItem('isOnline') === "true") {
        const formData = new FormData();
        formData.append('uploadedImage', blob, imageFle);
        this.moduleService.warningclosingImage(formData).subscribe((resp: any)=>{
          console.log("image resp", resp.data);
          if(resp.statusCode === 200){
            this.loaderService.loadingDismiss();
            console.log("image resp", resp.data);
            this.cImg = resp.data;
            console.log("cImg", this.cImg);
            this.closePhotos.push(this.cImg).toString();
            console.log("typeeeeee",typeof(this.cImg));
            console.log("this.closePhotos",this.closePhotos);
          }
          else{
            this.loaderService.loadingDismiss();
          }
          
        },
      (error: any) => {
        if (error.statusCode == 400 && error.data && error.data.msg) {
          this.toastService.showError(error.data.msg, 'Alert');
          this.loaderService.loadingDismiss();
        } else if (error.status === 401) {
          this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
          this.loaderService.loadingDismiss();
        } else {
          this.toastService.showError('An error occurred. Please try again.', 'Alert');
          this.loaderService.loadingDismiss();
        }
        console.error("Error creating violation:", error);
        this.loaderService.loadingDismiss();
      })
      } else {

        let contentType = this.getContentType(imageBase64);
        this.file.writeFile(filePath, imageFle, blob, contentType).then((success) => {
          this.loaderService.loadingDismiss();
          console.log("File Writed Successfully", success);
        }).catch((err) => {
          this.loaderService.loadingDismiss();
          console.log("Error Occured While Writing File", err);
        })

      }

    }, (err) => {
      // Handle error
    });         
  }

  identityDocGallery() {
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
    }).then((imageData) => {

      let imageBase64 = 'data:image/jpeg;base64,' + imageData;
      let realData = imageData;
      let blob = this.b64toBlob(realData, 'image/jpeg');
      const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
      const imageFle = random + '.jpg';
      this.closeBasePhotos.push(imageBase64);
      let filePath = this.file.externalDataDirectory + imageFle;
      this.loaderService.loadingPresent()
      if (localStorage.getItem('isOnline') === "true") {
        const formData = new FormData();
        formData.append('uploadedImage', blob, imageFle);
        this.moduleService.warningclosingImage(formData).subscribe((resp: any)=>{
          console.log("image resp", resp.data);
          if(resp.statusCode === 200){
            this.loaderService.loadingDismiss();
            console.log("image resp", resp.data);
            this.cImg = resp.data;
            console.log("cImg", this.cImg);
            this.closePhotos.push(this.cImg).toString();
            console.log("typeeeeee",typeof(this.cImg));
            console.log("this.closePhotos",this.closePhotos);
          }
          else{
            this.loaderService.loadingDismiss();
          }
          
        },
      (error: any) => {
        if (error.statusCode == 400 && error.data && error.data.msg) {
          this.toastService.showError(error.data.msg, 'Alert');
          this.loaderService.loadingDismiss();
        } else if (error.status === 401) {
          this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
          this.loaderService.loadingDismiss();
        } else {
          this.toastService.showError('An error occurred. Please try again.', 'Alert');
          this.loaderService.loadingDismiss();
        }
        console.error("Error creating violation:", error);
        this.loaderService.loadingDismiss();
      })
      } else {

        let contentType = this.getContentType(imageBase64);
        this.file.writeFile(filePath, imageFle, blob, contentType).then((success) => {
          this.loaderService.loadingDismiss();
          console.log("File Writed Successfully", success);
        }).catch((err) => {
          this.loaderService.loadingDismiss();
          console.log("Error Occured While Writing File", err);
        })

      }

    }, (err) => {
      // Handle error
    });         
  }

  public getContentType(base64Data: any) {
    let block = base64Data.split(";");
    let contentType = block[0].split(":")[1];
    return contentType;
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
    let payload = {
      "imagename":data,
      "filePath":'uploads/warning_proofs/images/'
    }
    this.moduleService.vdeleteImage(payload).subscribe((resp : any)=>{
      console.log(resp.data, "deleted");
      // console.log("DocPhotos", this.identityDocPhotos);
        let indexToDelete= this.closePhotos.findIndex((each)=>{
          console.log(each[0]);
          
          return each[0] === data;
          
          })
          if (indexToDelete !== -1) {
            // Remove the image from the array if found
            this.closePhotos.splice(indexToDelete, 1);
            console.log("Image deleted from array");
          } else {
            console.log("Image not found in array");
          }
          console.log(indexToDelete)
    })
  }

  async getWarningReasons (){
    let payload = {
      reason_by:'Rejected'
    }
    this.moduleService.getWarningReasons(payload).subscribe((resp : any)=>{
      if(resp.statusCode == 200){
        this.warningRejectedReasonData = resp.data;
      }
    })
  }

    async updateReasonVal(event: any){
    console.log(event);
    this.reason_id = event.detail.value;
     const alert = await this.alertController.create({
      header: this.setLanguage === 'ar' ? 'رفض التنبيه' : 'Reject Warning',
      message: this.setLanguage === 'ar' 
        ? 'هل أنت متأكد أنك تريد الرفض؟' 
        : 'Are you sure you want to reject?',
      buttons: [
        {
          text: this.setLanguage === 'ar' ? 'إلغاء' : 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: this.setLanguage === 'ar' ? 'تأكيد' : 'Confirm',
          handler: () => {
            this.processViolation('Reject');
          }
        }
      ]
    });
    await alert.present();

  }

 async confirmViolation(data: string) {
  console.log(data, "data");

  if (data === 'Reject') {
    this.getWarningReasons();
    this.isReject = true;
  } else {
    // Default confirmation for other actions
    const alert = await this.alertController.create({
      header: this.setLanguage === 'ar' ? 'تحويل التنبيه لمخالفة' : 'Convert Warning to Violation',
      message: this.setLanguage === 'ar'
        ? 'هل أنت متأكد؟'
        : 'Are you sure?',
      buttons: [
        {
          text: this.setLanguage === 'ar' ? 'إلغاء' : 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: this.setLanguage === 'ar' ? 'تأكيد' : 'Confirm',
          handler: () => {
            this.processViolation(data);
          }
        }
      ]
    });
    await alert.present();
  }
}

  private processViolation(data: string) {
    console.log("data", data);
    if(data == 'Reject' && this.reason_id == ''){
      this.toastService.showError('Please select the reason for rejection.','');
    }
    let payload = {
      "warning_id": this.violationId,
      "status": data,
      "created_by": this.userId,
      "reason_id": this.reason_id
    };
    this.moduleService.convertwarningtoviolation(payload).subscribe(
      (resp: any) => {
        console.log(resp);
        this.toastService.showSuccess( resp.data.msg, 'Thank You');
        this.routerServices.navigate(['/dashboard']);
      },
      (error: any) => {
        if (error.statusCode == 400 && error.data && error.data.msg) {
          this.toastService.showError(error.data.msg, 'Alert');
        } else if (error.status === 401) {
          this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
        } else {
          this.toastService.showError('An error occurred. Please try again.', 'Alert');
        }
        console.error("Error:", error);
      }
    );
  }
}
