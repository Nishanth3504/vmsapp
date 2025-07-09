import { DatePipe } from '@angular/common';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { DbService } from 'src/app/shared/services/offline-code/db.service';
import { ConnectivityService } from 'src/app/shared/services/offline-code/connectivity.service';
import { HTTP } from '@ionic-native/http/ngx';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-editviolation',
  templateUrl: './editviolation.page.html',
  styleUrls: ['./editviolation.page.scss'],
  providers: [DatePipe]
})
export class EditviolationPage implements OnInit {
  submitted: boolean = false;
  amend_request: FormGroup;
  amendId: any;
  imageSrc: any;
  setLanguage: any;
  file = new File();
  photos: any='';
  offline_docpath: any = "";
  private httpClient: HttpClient;
  camDisabled: boolean = false;
  basePhotos: any = [];
  editImg: any='';
  imageBase = environment.amendImgUrl;
  offlineImg: string;
  offline: boolean;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
     private datePipe: DatePipe,
     private moduleService: ModuleService,
     private toastService: ToastService,
     private routerServices: Router,
     private translateService: TranslateService,
     private http: HttpClient,private dbservice: DbService,httpBackend: HttpBackend,
     private connectivity: ConnectivityService,private httpobj:HTTP,
     private loaderService: LoaderService,
     private camera: Camera
     ) {
      this.httpClient = new HttpClient(httpBackend);
      this.setLanguage = window.localStorage.getItem('language');
      this.translateService.use(this.setLanguage);

    this.amend_request = this.fb.group({
      amend_message:['', Validators.required],
      file:[''],
      uploadedImage: [''],
    });
   }
   get form(){
     return this.amend_request.controls;
   }

  ngOnInit() {

    this.file.checkDir(this.file.externalDataDirectory, 'AmendmentDocs').then(response => {
      console.log('Directory exists' + response);
    }).catch(err => {
      console.log('Directory doesn\'t exist' + JSON.stringify(err));
      this.file.createDir(this.file.externalDataDirectory, 'AmendmentDocs', false).then(response => {
        console.log('Directory create' , response);
      }).catch(err => {
        console.log('Directory no create' , JSON.stringify(err));
      });
    });
    this.activatedRoute.params.subscribe((res)=>{
      console.log(res.id);
      this.amendId = res.id;
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

//   onFileChange(event){
    
//     if (event.target.files.length > 0) {
//       const file = event.target.files[0];
//       this.amend_request.patchValue({
//         fileSource: file
//       });
//       console.log("files",event.target.files[0]);

//       this.amend_request.controls['uploadedImage'].setValue(file);
//       this.imageSrc = this.amend_request.controls['file'].value;
      
//   }
// }


  onSubmit() {
    this.submitted = true;
    if (this.amend_request.invalid) {
      return;
    }
    this.amend_request.value['violationid'] = this.amendId;
    this.amend_request.value['file'] = '';
    this.amend_request.value['uploadedImage'] = this.editImg ;  
    this.amend_request.value['userid'] = localStorage.getItem('user_id');
    this.amend_request.value['created_on'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd H:mm:ss');
    console.log('Data', this.amend_request.value);
    if (localStorage.getItem('isOnline')==="true") {
      console.log(this.amend_request.value); 
      let payload = this.amend_request.value;
      this.moduleService.insertAmendViolatinRequest(payload).subscribe((res: any) => {
        console.log("result", res);
        this.amend_request.reset();
        this.toastService.showSuccess('Amend Request sent to admin', 'Success');
        this.routerServices.navigate(['/transactionslist']);
      })
    }
    else {
      //violationid," +
      //"amend_message,user_id,images,status,created_on
      // if (this.imageSrc) {
      //   let imageFile = this.amend_request.controls["uploadedImage"].value.name;
      //   let filePath = this.file.externalDataDirectory + "AmendmentDocs";
      //   this.amend_request.value["images"] = filePath + '/' + imageFile
      //   this.readUploadedFileAsurl(this.amend_request.controls["uploadedImage"].value).then((result: any) => {
      //     let imageBase64 = result.replace('data:image/jpeg;base64,', '');//'data:image/jpeg;base64,' + imageData;

      //     let contentType = this.getContentType(imageBase64);
      //     let realData = imageBase64;
      //     let blob = this.b64toBlob(realData, 'image/jpeg');
      //     this.file.writeFile(filePath, imageFile, blob, contentType).then((success) => {
      //       console.log("File Writed Successfully", success);
      //     }).catch((err) => {
      //       console.log("Error Occured While Writing File", err);
      //     })
      //   });
      // }
      // else
      // {
      //   this.amend_request.value["images"]="";
      // }
     //var sql = "INSERT INTO `tbl_violations_amend_requests`(`violationid`, `amend_message`, `user_id`, `status`, `created_on`,`images`)
     // VALUES ('" + data.violationid + "','" + data.amend_message + "','" + data.user_id + "','Not Approved','" + data.created_on + "','" + data.file + "')";
     //item.violationid, item.amend_message,item.user_id,item.images,item.status,item.created_on
     // console.log(fileurl)
     this.amend_request.value["status"]="Not Approved";
     this.dbservice.InsertViolationAmendRequest([this.amend_request.value]).then((result)=>{

      console.log(result);
      this.amend_request.reset();
      this.toastService.showSuccess('Amend Request sent to admin', 'Success');
      this.routerServices.navigate(['/transactionslist']);
     })
    
    }
  }
  public getContentType(base64Data: any) {
    let block = base64Data.split(";");
    let contentType = block[0].split(":")[1];
    return contentType;
  }
  readUploadedFileAsurl = (inputFile) => {
    const temporaryFileReader = new FileReader();
  
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
  
      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsDataURL(inputFile);
    });
  };

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
 
  getImageFromGallery() {
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
    }).then((imageData) => {
      let imageBase64 = 'data:image/jpeg;base64,' + imageData;
      this.offlineImg = imageBase64;
      let realData = imageData;
      let blob = this.b64toBlob(realData, 'image/jpeg');
      console.log(blob);
      const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
      const imageFle = random + '.jpg';
      let filePath = this.file.externalDataDirectory +"AmendmentDocs/";
      console.log("filePath",filePath);
      this.offline_docpath = filePath + '/';
      this.loaderService.loadingPresent();
      if (localStorage.getItem('isOnline') === "true") {
        const formData = new FormData();
        formData.append('uploadedImage', blob, imageFle);
        formData.append('violationid',this.amendId)
        let payload = {
          "uploadPath" : "violation",
          "uploadImage": blob,
        }
        console.log("payload",payload);
        this.moduleService.violationImage(formData).subscribe((resp: any)=>{
          console.log("image resp", resp.data);
          if(resp.statusCode === 200){
            this.loaderService.loadingDismiss();
            this.toastService.showSuccess('Image Uploaded Successfully', 'Success');
            console.log("image resp", resp.data[0]);
            this.editImg = resp.data[0];
            console.log("this.editImg", this.editImg);
          }
          else{
            this.loaderService.loadingDismiss();
            this.toastService.showError('Image Not Uploaded','Error');
          }
          
        })
      } 
      else {
        // if(this.editImg){
          this.offline = true;
          let contentType = this.getContentType(imageBase64);
          this.file.writeFile(filePath, imageFle, blob, { replace: true }).then((success) => {
            this.loaderService.loadingDismiss();
            console.log("File Writed Successfully", success);
            this.amend_request.value["uploadedImage"] = filePath + '/' + imageFle
            console.log(this.amend_request.value["uploadedImage"],"offline amend image");
          }).catch((err) => {
            this.loaderService.loadingDismiss();
            console.log("Error Occured While Writing File", err);
          })
        // }
        // else{
        //   this.amend_request.value["uploadedImage"] = ''
        // }

      }
    }, (err) => {
      // Handle error
    });
  }


  onDelete(data: any){
    console.log("data",data);
    let payload = {
      "imagename":data,
      "name":"amend"
    }
    console.log("imagebeforedelete", this.editImg);
    
    this.moduleService.vdeleteImage(payload).subscribe((resp : any)=>{
      console.log(resp.data, "deleted");
      this.editImg = ''
      console.log("imageafterdelete", this.editImg);
      
    })
  }
}
