import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';
import { DownloadRequest, Downloader, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-incidentdetail',
  templateUrl: './incidentdetail.page.html',
  styleUrls: ['./incidentdetail.page.scss'],
})
export class IncidentdetailPage implements OnInit {
  compId: any;
  userId: string;
  complaintType: string;
  detailData: any;
  docsImages=[];
  video: any;
  imageBase = environment.incidentimgUrl;
  isOnline: boolean = true;
  setLanguage: any;
  videoPath: any;
  videoUrl = environment.incidentvideoUrl;

  constructor(
    private activatedRouterServices: ActivatedRoute,
    private moduleService: ModuleService,
    private loader:LoaderService,
    // private translateService: TranslateService,
    private downloader: Downloader,
    private toastService: ToastService,
    private videoPlayer: VideoPlayer
  ) { 
    if (localStorage.getItem('isOnline') === "true") {
      this.isOnline = true;
    }
    else {
      this.isOnline = false;
    }
    // this.setLanguage = window.localStorage.getItem('language');
    // this.translateService.use(this.setLanguage);
  }

  ngOnInit() {
    this.userId = localStorage.getItem('user_id');
    this.complaintType = localStorage.getItem('complaintType');
    this.activatedRouterServices.params.subscribe((res: any) => {
      console.log("param resp",res);
      this.compId = res.id;
    })
    this.getcomplaintDetails();
  }

  getcomplaintDetails(){
    this.loader.loadingPresent();
    this.moduleService.getComplaintsDetails(this.userId,this.complaintType,this.compId).subscribe((resp: any)=>{
      if(resp.statusCode == 200){
        this.loader.loadingDismiss();
        console.log(resp);
        this.detailData = resp.data[0];
        this.docsImages = this.detailData.image_name;
        this.videoPath = this.detailData.video_name;
        console.log(this.videoPath)
        console.log(this.docsImages);
        
        // this.docsImages.push(docs.split(","));
        // console.log(this.docsImages);
        this.video = this.detailData.video_name;
      }
    })
  }

  download() {
    this.loader.loadingPresent();
    let url: any;
    if (localStorage.getItem('isOnline') === "true") {
      this.isOnline = true;
      const url = this.videoUrl + this.videoPath;
      console.log("url", url);
      const request: DownloadRequest = {
        uri:  url,
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
          this.toastService.showSuccess("Video downloaded successfully","success");
          this.loader.loadingDismiss();
        })
        .catch((error: any) => {
          console.error(error)
          this.loader.loadingDismiss();
        }
        );
    }
    else {
      this.loader.loadingDismiss();
      // this.isOnline = false;
      // this.videoPlayer.play(this.violationData.videospath + '/' + this.violation_video).then(() => {
      //   console.log('video completed');
      // }).catch(err => {
      //   console.log(err);
      // });

    }
  }

}
