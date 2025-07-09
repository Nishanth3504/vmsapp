import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-complaintdetails',
  templateUrl: './complaintdetails.page.html',
  styleUrls: ['./complaintdetails.page.scss'],
})
export class ComplaintdetailsPage implements OnInit {
  setLanguage: any;
  paramID: any;
  complaintData: any;
  proofData: any;
  docsImages: any[]=[];
  video: any;
  isOnline: any;
  imageBase = environment.complaintimgurl;


  constructor(
    private translateService: TranslateService,
    private loaderServ: LoaderService,
    private moduleServ: ModuleService,
    private activatedRouterServices: ActivatedRoute,
    private file: File,
    private fileTransfer: FileTransfer,
    private toast: ToastService,

  ) {
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
   }

  ngOnInit() {
    this.isOnline = localStorage.getItem('isOnline');
    this.activatedRouterServices.params.subscribe((res: any) => {
      console.log(res);
      this.paramID = res.id;
    })
    this.getComplaintDetails();
  }

  getComplaintDetails() {
    this.loaderServ.loadingPresent();
    const payload = {
      complaint_id: this.paramID
    };
  
    this.moduleServ.getComplaintDetail(payload).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.complaintData = resp.data[0];
        const docs = resp.data[0].image_names;
        if (docs) {
          this.docsImages.push(docs.split(","));
        }
        this.video = resp.data[0].video_names;
      },
      error: (error: any) => {
        console.error('Error fetching complaint details:', error);
        // Handle the error appropriately, e.g., show an error message to the user
        this.toast.showError('error',error);
        this.loaderServ.loadingDismiss();
      },
      complete: () => {
        this.loaderServ.loadingDismiss();
      }
    });
  }

  
  isValidVideoName(videoName: string): boolean {
    return videoName !== 'null' && videoName !== '--' && videoName != null && videoName !== '';
  }

  download() {
    const videoUrl = this.imageBase + this.video; // Implement this method to get the correct video URL
    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    const fileName = videoUrl.substring(videoUrl.lastIndexOf('/') + 1);
    const filePath = this.file.dataDirectory + fileName;

    fileTransfer.download(videoUrl, filePath).then((entry) => {
      this.toast.showSuccess('Download successful ' , '');
    }).catch((error) => {
      console.log(error);
      this.toast.showError('Download failed: ' , error.message);

    });
  }

  
}
