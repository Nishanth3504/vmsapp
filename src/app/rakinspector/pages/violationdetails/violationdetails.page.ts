/* eslint-disable eqeqeq */
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
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-violationdetails',
  templateUrl: './violationdetails.page.html',
  styleUrls: ['./violationdetails.page.scss'],
})

export class ViolationdetailsPage implements OnInit {
  violationData: any;
  amendData: any;
  amendPath: any;
  ViolatinDoc: any;
  violatonWarningDoc : any;
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
  sourceId: string;
  statusDetails: any;
  warningImages: any[] =[];
  warningProofUrl: any;
  user_type: any;
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
    private sanitizer: DomSanitizer
  ) {
    this.user_type = localStorage.getItem('user_type');

    // this.options = {
    //   scalingMode: 0,
    //   volume: 0.5
    // };
    // this.videoOptions = {
    //   volume: 0.7
    // };
    //this.checkPermissions();
    // this.options = {
    //   successCallback: () => { console.log('Video played') },
    //   errorCallback: (e) => { console.log('Error streaming') },
    //   orientation: 'landscape'
    // };
    if (localStorage.getItem('isOnline') === "true") {
      this.isOnline = true;
    }
    else {
      this.isOnline = false;
    }
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);

    this.activatedRouterServices.params.subscribe((res: any) => {

      console.log("violation Details", res)
      if (res.id) {

        if (localStorage.getItem('isOnline') === "true") {
          this.amendPath = environment.uploadPath;
          this.SignPath = environment.signaturePath;
          this.violationId = res.id;
          let payload = 
          {
            "violationid": res.id,
          }
          this.moduleService.viewViolationDeatails(payload).pipe(finalize(() => {
            this.violatonWarningDoc = environment.imgUrl;
            this.ViolationDocumentsPath = environment.ViolationDocumentsPath;
            this.warningProofUrl = environment.warningProofUrl;
            Object.keys(this.violationData.ViolatiionList).map((key, index) => {
              if (this.violationData.ViolatiionList[key] == "null") {
                this.violationData.ViolatiionList[key] = "--";
              }
            });
            
            console.log("violationData", this.violationData);

            this.signature = this.violationData.ViolatiionList.violator_signature;
            this.reference_number = this.violationData.ViolatiionList.reference_number;
            this.dailyfines = this.violationData.ViolatiionList.daily_fines;
            this.fineamount = this.violationData.ViolatiionList.fine_amount;
            this.violation_video = this.violationData.ViolatiionList.violation_video;
            if(this.violationData.ViolatiionList.violation_docs){
              const docs = this.violationData.ViolatiionList.violation_docs;
              this.docsImages.push(docs.split(","));
              console.log("docsImages",this.docsImages);
            }
            if(this.violationData.ViolatiionList.identity_doc){
              const idocs = this.violationData.ViolatiionList.identity_doc;
              this.identityDocs.push(idocs.split(","));
              console.log("identityDocs",this.identityDocs);
            }
            if(this.violationData.warningStatusDetails){
              this.statusDetails = this.violationData.warningStatusDetails;
              const wdocs = this.violationData.warningStatusDetails[0].close_attachment_file;
              this.warningImages.push(wdocs.split(","));
              console.log("warningImages", this.warningImages);
            }
            console.log("bbbbbbbbb");
            
            
          })).subscribe((result: any) => {
            console.log("viewViolationData",result);
            if (result.statusCode == 200 || res.status === 200) {
              this.violationData = result.data;
              console.log("Aaaaaa")
            }
          }),
            (error) => {
              console.log(error)
            };

          //Amend Request Data
          // let payloadObj = 
          // {
          //   "violationid": res.id
          // }
          // this.moduleService.viewViolationDeatails(payloadObj).subscribe((result: any) => {
          //   console.log(result);
          //   if (result.statusCode == 200 || res.status === 200) {
          //     this.amendData = result.data[0];
          //     console.log(this.amendData,"amenddata");
              
          //     console.log(this.violationData);
          //   }

          // }),
          //   (error) => {
          //     console.log(error)
          //   };
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
            // this.ViolatinDoc = "http://localhost/_app_file_/" + this.violationData.ViolatiionList.docpath.replace('file://', '');

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
            console.log(this.violationData.violatiionList.docpath);           
            this.readAndConvertImage(this.violationData.violatiionList.docpath);

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

  // transform(url: string): SafeUrl {
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  // }

  readAndConvertImage(filePath: string): void {
    this.file.readAsDataURL(filePath, '').then(dataUrl => {
      const safeUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
      this.violationData.violatiionList.docpath = safeUrl;
    }).catch(error => {
      console.error('Error reading and converting image:', error);
    });
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
    this.amendPath = environment.uploadPath;
    this.ViolatinDoc = environment.ViolationDocumentsPath;
    this.ViolationDocumentsPath = environment.ViolationVidoesPath;
    this.violationVideosPath = environment.ViolationVidoesPath;
    this.moduleService.languageEvent.subscribe((result: any) => {
      this.translateService.use(result);
    });
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
                  //         this.moduleService.sendsms(smsbodyInfo).subscribe((item)=>{
                  // console.log(item)
                  //         });
                }
                this.loaderService.loadingDismiss();
                this.routerServices.navigate([`/transactionslist`], { state: { reload: true } }).then();
                this.toastService.showSuccess('Violation has been published successfully', 'Thank You');
              } ,    
               (error: any) => {
                this.publishdisabled = false;
                this.loaderService.loadingDismiss();
                console.log(error,"error");
                if (error.statusCode == 400 && error.data && error.data.msg) {
                  this.toastService.showError(error.data.msg, 'Alert');
                } else if (error.status === 401) {
                  this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
                } else {
                  this.toastService.showError('An error occurred. Please try again.', 'Alert');
                }
                console.error("Error :", error);
              })
            }
            else {
              this.loaderService.loadingPresentcm("Publishing. Please Wait...");
              this.dbservice.publishViolation(this.reference_number).then((result: any) => {
                //if(result.length>0)
                // {
                this.loaderService.loadingDismiss();
                this.routerServices.navigate([`/transactionslist`], { state: { reload: true } }).then();
                this.toastService.showSuccess('Violation has been published successfully', 'Thank You');
                // }
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
    // const fileTransfer: FileTransferObject = this.transfer.create();
    // const url = this.ViolationDocumentsPath + this.violation_video ;
    // fileTransfer.download(url, this.file.dataDirectory + 'video.mp4').then((entry) => {
    //   console.log('download complete: ' + entry.toURL());
    // }, (error) => {
    //   // handle error
    // });
    let url: any;
    if (localStorage.getItem('isOnline') === "true") {
      this.isOnline = true;
      const url = this.violationVideosPath + this.violation_video;
      console.log("url", url);
      
      var request: DownloadRequest = {
        uri: url,
        title: 'MyDownload',
        description: 'downloading',
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
          console.log("request",request);
          console.log('File downloaded at:' + location)
        })
        .catch((error: any) => {
          console.error(error)
        }
        );
    }
    else {
      this.isOnline = false;
      //this.videoOpts = {volume : 1.0};
      this.videoPlayer.play(this.violationData.ViolatiionList.videospath + '/' + this.violation_video).then(() => {
        //this.videoPlayer.play('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4').then(() => {
        console.log('video completed');
      }).catch(err => {
        console.log(err);
      });

    }
  }


}
