
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, HostListener, NgZone } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ViewmapmodalPage } from '../modalpopup/viewmapmodal/viewmapmodal.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';

import { File, FileEntry } from '@ionic-native/File/ngx';
import 'moment-timezone';
import {
  ToastController,
  Platform,
  LoadingController
} from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  ILatLng,
  BaseArrayClass
} from '@ionic-native/google-maps';
import { ModuleService } from 'src/app/shared/services/module.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn  } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DatePipe } from '@angular/common';
import { Network } from '@ionic-native/network/ngx';
import { HttpBackend, HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { LoaderService } from 'src/app/shared/services/loader.service';
import * as moment from 'moment';
import 'moment-timezone';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ConnectivityService } from 'src/app/shared/services/offline-code/connectivity.service';
import { DbService } from 'src/app/shared/services/offline-code/db.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { error } from 'console';
import { VideoEditor } from '@ionic-native/video-editor/ngx';

class Port {
  public id: number;
  public name: string;
}

@Component({
  selector: 'app-createwarning',
  templateUrl: './createwarning.page.html',
  styleUrls: ['./createwarning.page.scss'],
})
export class CreatewarningPage implements OnInit {


  svtSelected: any = 0;
  map: GoogleMap;
  imgUrl;
  sideCodeSelected: any;
  createWarning: FormGroup;
  voilationType: any;
  voilationTitleData: any = [];// = [{ title_id: '', violation_eng_title: '' }];
  sideCode: any = [];//[{ side_code_id: '', description: '' }];
  submitted = true;
  errorMsg = '';
  isVehicle: boolean = false;
  isCommercial: boolean = false;
  isIndividual: boolean = false;
  plateSourceList: any;
  selectedSourceVal: any;
  plateCodeDataList: any = [];
  oldCodeDataList: any;
  selectedPlateCode: any;
  // selectedPlateColor: any;
  selectedOldCode: any;
  violCategoryList: any;
  violCategoryListAll: any;
  fineCodeList: any;
  reservedCodeList: any;
  areaList: any;
  fineAmountList: any;
  setLanguage: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Opacity: any = 1;
  setLocation: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CurrentLocation: any;
  selectVioTitle: any;
  selectSidecodeTitle: any;
  updatedVioTitleID: any = "";
  // plateNoNameAr: any;
  // plateNoNameEng: any;
  upDatedSideCodeID: any;
  showText: boolean = false;
  ports: Port[];
  port: Port;
  dBphotos: any = [];
  filesDb: any = [];
  violationCategorySelected: any;
  isAnimalhitCountData: boolean = false;
  VideoMedia: any;
  durationData:any=[]
  @ViewChild('violationTitleComponent') violationTitleComponent: IonicSelectableComponent;
  @ViewChild('sideCodeComponent') sideCodeComponent: IonicSelectableComponent;
  @ViewChild('documnetNumberComponent') documnetNumberComponent: IonicSelectableComponent;
  @ViewChild('licenseNumberComponent') licenseNumberComponent: IonicSelectableComponent;
  @ViewChild('plateNumberComponent') plateNumberComponent: IonicSelectableComponent;
  @ViewChild('fineCodeComponent') fineCodeComponent : IonicSelectableComponent;
  @ViewChild('areaComponent') areaComponent : IonicSelectableComponent;
  onClear: boolean = false;
  addVioTitleData: any;
  sCodeData: any;
  documentList: any;
  onDisconnect: boolean;
  onConnect: boolean;
  basePhotos: any = [];
  // photos: any = "W2023-11-27-04-26-247ztijkfros.jpg";
  photos: any = [];
  identityDocBasePhotos: any = [];
  identityDocPhotos: any = [];
  sideCodeId: any;
  tzNames: any;
  file = new File();
  msgVideo: any;
  blob: any;
  selectedSourceValDocument: any;
  percentDone: any;
  sideCodeActualData: any;
  documentTypeName: any;
  private httpClient: HttpClient;
  actual_amount: any;
  repeat_amount: any;
  is_violation_repeated: any;
  documentNumber: any="";
  licenseNumber: any="";
  platecodeNumber: any="";
  documentNumbersList: any = [];// = [{ document_no: '' }];
  licenseNumberList: any = [];// = [{ license_no: '' }];
  plateCodeList: any = [];// = [{ license_plate_no: '' }];
  document: any;
  camDisabled: boolean = false;
  offlineViolation: any = {};
  offlinedocs: any = [];
  offlinevideos: any = [];

  offline_docpath: any = "";
  offline_videos_path = "";
  offline_signature_path = "";
  /* Fine Code */
  // finecodes: FineCode[];
  finecode: any;
  finecodeValue: any;
  /* Fine Code */
  elementVisible: boolean = false;
  abercheckbox: boolean = false;
  license: any;
  reservedCode: any;

  /*----------*/
  plateNumber: any;
  reservedIdNumber: any;
  /*---------*/

  finecodecount: boolean = true;
  ownerPhoneRequired: boolean = false;
  warningDocument: []=[];

  /* Signature Pad */
  @ViewChild('canvas', { static: true }) signaturePadElement;
  signaturePad: any;
  canvasWidth: number;
  canvasHeight: number;
  /* Signature Pad */
  isCustomerwithproof: string = "Yes";
  commparamvalue: any = '0';
  licenseparamList: any;
  name_ded_eng: any;
  name_ded_ar: any;
  isPlateSourceselectedOther: boolean = false;
  durationSelected: any;
  selectedFile: any; //nishanth 11-22
  wImg: any="";
  vImg: any="";
  videoData: any=[];
  imageBase = environment.imgUrl;
  selectedArea: any[];
  videoresponse: any;
  isvideoCaptured: boolean = false;
  upload_image: any;
  sourceId: any;
  selectedPlateSource: any;
  plateCategoryData: any;
  plateCategoryid: any;
  licenseLocation: string;
  licenseExpiryDate: any;
  reservationSitesList: any;
  reservationSitesAreasList: any;
  specificationList: any;
  latitude: any;
  longitude: any;
  selectedPlateSourceCode: any;
  carsId: any;
  showReservation: boolean = false;
  selectedReservedData: any;
  alertErrorMessage: any;
  allowStatus: any;
  showMandatory: boolean = false;
  createViolation: boolean = false;
  warningSpecificationId: any;
  showVehicleClass: boolean = false;
  vehicleClassData: any;
  defaultwarning: boolean = false;
  defaultwarninghours: any;

  constructor(
    private zone: NgZone,
    private modalController: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private camera: Camera,
    private moduleService: ModuleService,
    private fb: FormBuilder,
    private globalization: Globalization,
    private translateService: TranslateService,
    public routerServices: Router,
    public toastService: ToastService,
    private datePipe: DatePipe,
    private network: Network,
    private http: HttpClient,
    private mediaCapture: MediaCapture,
    private loaderService: LoaderService,
    public fileUploadService: FileUploadService,
    httpBackend: HttpBackend,
    public geolocation: Geolocation,
    public cRef: ChangeDetectorRef,
    private connectivity: ConnectivityService,
    private dbservice: DbService,
    private el: ElementRef,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private httpobj: HTTP, private elementRef: ElementRef,
    private transfer: FileTransfer,
    public alertCtrl : AlertController,
    private videoEditor: VideoEditor
  ) {
    this.sourceId = localStorage.getItem('sourceId');
    this.httpClient = new HttpClient(httpBackend);
    console.log(moment.tz("Asia/Dubai").format('yyyy-MM-dd H:mm:ss'));

    this.ports = [
      { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' },
      { id: 3, name: 'Navlakhi' }
    ];

    this.setLanguage = window.localStorage.getItem('language');
    // this.setLocation = window.localStorage.getItem('LocationVal');


    this.translateService.use(this.setLanguage);

    this.createWarning = this.fb.group({
      source_id:[''],
      warningDuration:[''],
      voilationType: ['',[Validators.required]] ,
      voilationTitle: [''],//, [Validators.required]],
      //  consider_as_aber: [''],
      voilationtitleid: [''],
      sideCode: [0],//, [Validators.required]],
      sideCodeID: [0],
      documentType: [''],
      documentNo: [''],
      sideCodeDescription: [''],
      licenseNo: [''],
      plateNo: [''],
      plateSource: [''],
      plateCode: [''],
      plateColor: [''],
      oldCode: [''],
      violationCategory: ['', [Validators.required]],
      fineCode: ['',[Validators.required]],
      finecodecount: [''],
      finePlace: [''],
      area: ['', [Validators.required]],
      fineNotes: ['',[Validators.required]],
      recipientPerson: ['',[Validators.required]],
      phone: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      recipientMobile: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: ['', [Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      reservedCode: [''],
      reservedIdNumber: [''],
      ownername: [''],
      ownerphone: [''],
      ownerdescription: [''],
      identityDoc: [''],
      identityDoc_file: [''],
      address: [''],
      description: [''],
      dailyFines: [''],
      violationDocument: [''],
      fineAmount: [''],
      camerafiles: [''],
      animalhitCount: [''],
      mulltifiles: [''],
      videofile: [''],
      video: [''],
      customerwithproof: [''],
      searchparamcommercial: [''],
      other_plate_source: ['', [Validators.required]],
      plateCategory: ['',[Validators.required]],
      areaCode:[''],
      reservationSites:[''],
      reservationSiteAreas: [''],
      warningSpecification:['', Validators.required],
      vehicle_class_type:[''],
      licenseExpiryDate:[''],
      licenseLocation:[''],
      fc_warning_hours:[''],
      fc_warning_hours_title:['']
    });

  }

  onInput($event: any) {
    if ($event.target.value.length > 10) {
      console.log($event.target.getAttribute('formControlName'))
      this.createWarning.controls[$event.target.getAttribute('formControlName')].setValue($event.target.value.slice(0, 10));
    }
  }

  ngOnInit() {

    this.file.checkDir(this.file.externalDataDirectory, 'ViolationDocs').then(response => {
      console.log('Directory exists' + response);
    }).catch(err => {
      console.log('Directory doesn\'t exist' + JSON.stringify(err));
      this.file.createDir(this.file.externalDataDirectory, 'ViolationDocs', false).then(response => {
        console.log('Directory create' + response);
      }).catch(err => {
        console.log('Directory no create' + JSON.stringify(err));
      });
    });

    this.file.checkDir(this.file.externalDataDirectory, 'VIOLATORSIGNATURES').then(response => {
      console.log('Directory exists' + response);
    }).catch(err => {
      console.log('Directory doesn\'t exist' + JSON.stringify(err));
      this.file.createDir(this.file.externalDataDirectory, 'VIOLATORSIGNATURES', false).then(response => {
        console.log('Directory create' + response);
      }).catch(err => {
        console.log('Directory no create' + JSON.stringify(err));
      });
    });



    // let todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd  h:mm:ss');

    console.log(this.datePipe.transform(new Date(), 'yyyy-MM-dd H:mm:ss'));
    this.moduleService.languageEvent.subscribe((result: any) => {
      this.translateService.use(result);
    }),
      (error) => {
        console.log(error)
      };

    this.moduleService.mapEvent.subscribe((res: any) => {
      console.log('map res', res);
      let data = res;
      console.log('map data', data);
      this.createWarning.controls['finePlace'].setValue(data.lat + ',' + data.lng);
    }),
      (error) => {
        console.log(error)
      };
    //this.init();
    this.getVoilationTypeData();
    this.getPlateSourceData();
    //this.getPlateCodeData();
    //this.getOldCodeData();
    this.getWarningData();
    this.getDocumentTypeData();
    this.getReservedCodeList();
    this.getAreaData();
    this.getSideCodeData();
    // this.getViolationCategoryData(0);
    this.getWarningSpecificatins();
    this.getReservationSites();
    this.getVehicleClassData();
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    //this.init();
  }
  // init() {
  //   const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
  //   canvas.width = window.innerWidth-160;
  //   canvas.height = window.innerHeight - 500;
  //   if (this.signaturePad) {
  //     this.signaturePad.clear(); // Clear the pad on init
  //   }
  // }
  init() {
    const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 400;

    if (this.signaturePad) {
      this.signaturePad.clear(); // Clear the pad on init
    }
  }
  public ngAfterViewInit(): void {
    // this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
    // this.signaturePad.clear();
    // this.signaturePad.penColor = 'rgb(56,128,255)';
  }
  isCanvasBlank(): boolean {
    if (this.signaturePad) {
      return this.signaturePad.isEmpty() ? true : false;
    }
  }
  clear() {
    this.signaturePad.clear();
  }
  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop(); // remove the last dot or line
      this.signaturePad.fromData(data);
    }
  }

  portChange(event: {
    component: IonicSelectableComponent,
    value: any,
  }, title: any) {
  
    event.component.searchText = "";
    console.log('port event:', event);
    if (title == 'vTitle') {
      const objdata: any = event.value;
      console.log('vTitle port:', event.value.title_id);
      this.updatedVioTitleID = event.value.title_id;
    }
    else {
      if (!this.isCommercial) {
        console.log('sCode port:', event.value.side_code_id);
        this.upDatedSideCodeID = event.value.side_code_id;
        this.sideCodeValueData(this.upDatedSideCodeID);
      }
      else {
        this.createWarning.controls['sideCodeDescription'].setValue(this.setLanguage == 'ar' ? event.value.description_eng : event.value.description);
  
        if (event.value.side_code_no != "" && event.value.side_code_no != null) {
          this.createWarning.controls['licenseNo'].setValue({ 'license_no': event.value.side_code_no });
          this.licenseNumber = event.value.side_code_no;
        }
        else {
          this.licenseNumber = "";
          this.license = "";
        }
        let paramObj = {
          "licenseNo": this.licenseNumber
        }
  
        this.moduleService.GetLicenseByLicenseNumber(paramObj).subscribe((res) => {
          console.log(res);
          if (res.ResponseContent && res.ResponseContent.length > 0) {
            this.licenseNumberList = res.ResponseContent;
            this.licenseNumberList.map(
              obj => {
                obj.license_no = obj.LicenseNumber
              }
            );
  
            // Check if the license status is in the allowStatuses array
            this.allowStatus = res.allowStatuses;
            if (this.allowStatus.includes(this.licenseNumberList[0].LicenseStatusEN)) {
              this.license = this.licenseNumberList[0];
              this.licenseExpiryDate = this.licenseNumberList[0].ExpiryDate;
              this.licenseLocation = this.licenseNumberList[0].X + ',' + this.licenseNumberList[0].Y;
              
              let lInfo = this.licenseNumberList;
              console.log(lInfo);
              if (lInfo.length > 0) {
                let rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('director') >= 0 });
                
                this.createWarning.controls['sideCodeDescription'].setValue(lInfo[0].NameAR);
                if (rInfo.length > 0) {
                  this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.createWarning.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
  
                rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('owner') >= 0 });
                if (rInfo.length > 0) {
                  this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.createWarning.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
  
                rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('partner') >= 0 });
                if (rInfo.length > 0) {
                  this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.createWarning.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
  
                rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('individual') >= 0 });
                if (rInfo.length > 0) {
                  this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.createWarning.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
              }
            } else {
              // Show alert if the license status is not in allowStatuses
              this.alertErrorMessage = `The license status "${this.licenseNumberList[0].LicenseStatusEN}" is not allowed.`;
              this.showAlert();
              // this.toastService.showError(`The license status "${this.licenseNumberList[0].LicenseStatusEN}" is not allowed.`, "Alert");
              this.license = {};
              this.resetFormFields();
            }
          } else {
            this.licenseNumberList = [];
            this.toastService.showError("No license found with the given number.", "Alert");
            this.resetFormFields();
          }
        }, (error) => {
          console.error(error);
          this.toastService.showError("An error occurred while fetching the license details.", "Error");
          this.resetFormFields();
        });
      }
    }
  }
  
  // Add this method to reset form fields
  resetFormFields() {
    this.createWarning.controls['ownername'].reset();
    this.createWarning.controls['ownerphone'].reset();
    this.createWarning.controls['email'].reset();
    this.name_ded_eng = '';
    this.name_ded_ar = '';
  }
  searchSideCodes(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let portName = event.text;
    event.component.startSearch();
    event.component.hideLoading();
    if (!this.isCommercial) {
      if (portName != "") {
        if (portName.length >= 3) {
          let obj = {
            "sidetypeid": this.sideCodeId,
            "searchtext": portName
          }
          this.moduleService.searchSideCode(obj).subscribe((data: any) => {
            this.sideCode = data.data.map(({ side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid, class_pad_new,
              class_pad, calar_pad, license_no, document_type, document_no }: any) => ({
                side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid,
                class_pad_new, class_pad, calar_pad, license_no, document_type, document_no
              }));
            this.sideCode = this.sideCode.filter((value: any, index: any, a: any) => a.findIndex((t: any) => (t.side_code_id === value.side_code_id)) === index);
            event.component.items = this.sideCode;
            event.component.endSearch();
            // console.log(this.sideCodeComponent, " 584 canclearerror remember to comment again..................")
            if (this.sideCode.length === 0) {
              this.sideCodeComponent.canClear = false;
            }
            else {
              this.sideCodeComponent.canClear = true;
            }
          }),
            (error) => {
              console.log(error)
            }

        }
      }
      else {
        if (!this.isCommercial) {
          this.getSideCodeData();
        }
      }

    }
    else {
      this.sideCode = [];
      if (portName != "") {
        if (portName.length >= 3) {
          let searchValue = "";
          searchValue = event.component.searchText;
          let paramObj = {
            "term": searchValue
          }

          this.moduleService.GetLicenceByParam(paramObj).subscribe((res) => {
            console.log(res);
            if (res.ResponseContent.length > 0) {
              console.log(this.sideCode)
              this.sideCode = res.ResponseContent.map(({ side_code_id, LicenseNumber: side_code_no, NameEN: description, NameAR: description_eng }, index) => ({
                side_code_id: index + 1, side_code_no, description, description_eng
              }));
              event.component.items = this.sideCode;
              event.component.endSearch();
              // console.log(this.sideCodeComponent, " 624 canclearerror remember to comment again..................")
              if (this.sideCode.length === 0) {
                this.sideCodeComponent.canClear = false;
              }
              else {
                this.sideCodeComponent.canClear = true;
              }
            }

          })

        }

      }


    }
  }
  documentNumberChange(event: {
    component: IonicSelectableComponent,
    value: any,
  }) {

    //event.component.searchText="";
    if(this.fineCodeComponent){
      this.fineCodeComponent.clear();
    }
    this.finecode={};
    this.createWarning.controls['fineAmount'].setValue('');
    this.documentNumber = event.value.document_no;
    console.log("this.documentNumber", this.documentNumber)
    //this.createWarning.controls['documentNo'].setValue(this.documentNumber);
  }

  licenseNumberChange(event: {
    component: IonicSelectableComponent,
    value: any,
  }) {
    if(this.fineCodeComponent){
    this.fineCodeComponent.clear();
    }
    this.finecode={};
    this.createWarning.controls['fineAmount'].setValue('');
    if (!this.isCommercial) {
      this.licenseNumber = event.value.license_no;
    }
    else {
      this.licenseNumber = event.value.license_no;
      if (this.licenseNumberList.length > 0) {
        let lInfo = this.licenseNumberList.filter((item) => { return item.license_no == event.value.license_no })
        console.log(lInfo);
        if (lInfo.length > 0) {
          if (this.allowStatus.includes(this.licenseNumberList[0].LicenseStatusEN)) {

            let rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('director') >= 0 })
            // this.createWarning.controls['sideCodeDescription'].setValue(lInfo[0].LicenseNumber +'-'+ (this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN));
            this.createWarning.controls['sideCodeDescription'].setValue(this.setLanguage == 'ar' ? lInfo[0].NameAR : lInfo[0].NameEN);
            if (rInfo.length > 0) {
              this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
              this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
              //this.createWarning.controls['ownerphone'].setValue('0' + rInfo[0].PrimaryPhoneNumber);
              this.createWarning.controls['email'].setValue(rInfo[0].Email);
              this.name_ded_eng = lInfo[0].NameEN;
              this.name_ded_ar = lInfo[0].NameAR;
            }

            rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('owner') >= 0 })
            if (rInfo.length > 0) {
              this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
              this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
              //this.createWarning.controls['ownerphone'].setValue('0' + rInfo[0].PrimaryPhoneNumber);
              this.createWarning.controls['email'].setValue(rInfo[0].Email);
              this.name_ded_eng = lInfo[0].NameEN;
              this.name_ded_ar = lInfo[0].NameAR;
            }

            rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('partner') >= 0 })
            if (rInfo.length > 0) {
              this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
              this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
              //this.createWarning.controls['ownerphone'].setValue('0' + rInfo[0].PrimaryPhoneNumber);
              this.createWarning.controls['email'].setValue(rInfo[0].Email);
              this.name_ded_eng = lInfo[0].NameEN;
              this.name_ded_ar = lInfo[0].NameAR;
            }

            rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('individual') >= 0 })
            if (rInfo.length > 0) {
              this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
              this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
              //this.createWarning.controls['ownerphone'].setValue('0' + rInfo[0].PrimaryPhoneNumber);
              this.createWarning.controls['email'].setValue(rInfo[0].Email);
              this.name_ded_eng = lInfo[0].NameEN;
              this.name_ded_ar = lInfo[0].NameAR;
            }
          }
          else {
            if (lInfo[0].LicenseStatusEN) {
              this.toastService.showError("Enter License number has been " + lInfo[0].LicenseStatusEN, "Alert");
              return;
            }
            this.license = { license_no: lInfo[0].license_no }
          }
        }
      }
    }
  }

  onLicenseSearchFail(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    this.getvoilationSearchByField(event.component.searchText);
    this.licenseNumber = event.component.searchText;
    event.component.showAddItemTemplate();
  };

  onLicenseSearchSuccess(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    if (event.component.searchText == '') {
      this.getvoilationSearchByField(event.component.searchText);
    }

    event.component.hideAddItemTemplate();
  }



  plateNumberChange(event: {
    component: IonicSelectableComponent,
    value: any,
  }) {

    //event.component.searchText="";
    if(this.fineCodeComponent){
    this.fineCodeComponent.clear();
    }
    this.finecode={};
    this.createWarning.controls['fineAmount'].setValue('');
    this.platecodeNumber = event.value.license_plate_no;
    //this.createWarning.controls['plateNo'].setValue(this.platecodeNumber);
    //this.createWarning.controls['plateSource'].
    this.selectedSourceVal = "";
  }

  selectDocumentType(event: any) {
    this.selectedSourceVal = event.target.value;

  }

  onSearchFail(event: {
    component: IonicSelectableComponent,
    text: string
  }, info: any) {

    // eslint-disable-next-line @typescript-eslint/quotes
    console.log("if fail search", event.component.searchText);
    this.violationTitleComponent.showAddItemTemplate();
    //event.component.startSearch();
    if (info == 'vTitle') {
      this.addVioTitleData = event.component.searchText;
      this.updatedVioTitleID = null;

    }
    else {
      console.log("if fail search2", event.component.searchText);
      this.sCodeData = event.component.searchText;
      //if (this.commparamvalue == '0') {
      let obj = {
        "sidetypeid":this.sideCodeId,
        "searchtext": event.component.searchText
      }
      this.moduleService.searchSideCode(obj).subscribe((data: any) => {
        this.sideCode = data.data;
        this.sideCode = this.sideCode.map(({ side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid, class_pad_new,
          class_pad, calar_pad, license_no, document_type, document_no }: any) => ({
            side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid,
            class_pad_new, class_pad, calar_pad, license_no, document_type, document_no
          }));
        this.sideCode = this.sideCode.filter((value: any, index: any, a: any) => a.findIndex((t: any) => (t.side_code_id === value.side_code_id)) === index);
      }),
        (error) => {
          console.log(error)
        }
    }
  }

  onDocumentSearchFail(event: {
    component: IonicSelectableComponent,
    text: string
  }) {

    this.getvoilationSearchByField(event.component.searchText);
    this.documentNumber = event.component.searchText;

    event.component.showAddItemTemplate();

  };



  onPlateNoSearchFail(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    //this.plateNumber=event.component.searchText;
    this.getvoilationSearchByField(event.component.searchText);
    this.platecodeNumber = event.component.searchText;
    event.component.showAddItemTemplate();
  };

  onSearchSuccess(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    // Hide form.
    console.log('event', event);
    console.log("event text", event.component.searchText);
    event.component.hideAddItemTemplate();
  }

  onDocumentSearchSuccess(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    // Hide form.
    console.log('event', event);
    console.log("event text", event.component.searchText);
    if (event.component.searchText == '') {

      this.getvoilationSearchByField(event.component.searchText);
    }

    event.component.hideAddItemTemplate();
  }



  onPlateNoSearchSuccess(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    // Hide form.
    console.log('event', event);
    this.platecodeNumber = event.component.searchText;
    console.log("event text", event.component.searchText);
    this.getvoilationSearchByField(event.component.searchText);
  }

  violationTitleClicked() {
    this.violationTitleComponent.clear();
  }

  confirm() {
    this.plateNumberComponent.confirm();
    this.plateNumberComponent.close();
  }

  addPort(title: any) {
    if (title == 'vTitle') {
      this.voilationTitleData = this.voilationTitleData.filter((item: any) => { return item.title_id != '' })
      const userName = localStorage.getItem('first_name') + '' + localStorage.getItem('last_name');
      let obj = {
        title_id: '',
        side_type_code: '',
        violation_eng_title: this.addVioTitleData,
        violation_ar_title: '',
        created_on: moment.tz("Asia/Dubai").format('YYYY-MM-DD HH:mm:ss'),
        created_by: userName,
        updated_on: moment.tz("Asia/Dubai").format('YYYY-MM-DD HH:mm:ss'),
        updated_by: userName,
        status: 'Active'
      };
      this.voilationTitleData = [obj, ...this.voilationTitleData];

      this.voilationTitleData = this.voilationTitleData.sort((a: any, b: any) => {
        if (a < b) { return 1; }
        if (a > b) { return -1; }
        return 0;
      });

      this.violationTitleComponent.hideAddItemTemplate();

    } else {
      console.log('else');
      let sObj = {
        side_code_id: null,
        side_code_no: null,
        description: this.sCodeData,
        description_eng: '',
        side_type_code: null,
        car_no: null,
        car_sid: null,
        class_pad_new: null,
        class_pad: null,
        calar_pad: null,
        license_no: null,
        document_type: null,
        document_no: null
      };
      this.sideCode.push(sObj);
      this.sideCodeComponent.hideAddItemTemplate();
    }
  }

  addDocument() {
    // this.documentNumbersList.push({ document_no: this.documentNumber });
    if (this.documentNumber != "") {
      this.documentNumbersList = [{ document_no: this.documentNumber }, ...this.documentNumbersList];
    }
    this.documnetNumberComponent.hideAddItemTemplate();
  }

  addLicense() {
    //this.licenseNumberList.push({ license_no: this.licenseNumber });
    if (this.licenseNumber != "") {
      this.licenseNumberList = [{ license_no: this.licenseNumber }, ...this.licenseNumberList];
      this.licenseNumberComponent.hideAddItemTemplate();
    }
  }
  addPlateNo() {
    //this.plateCodeList.push({ license_plate_no: this.platecodeNumber });
    if (this.platecodeNumber != "") {
      if (this.plateCodeList.find(x => x.license_plate_no == this.platecodeNumber) === undefined) {
        this.plateCodeList = [{ license_plate_no: this.platecodeNumber }, ...this.plateCodeList];
        this.plateNumberComponent.hideAddItemTemplate();
      }
    }
  }

  onSelectplateno(event: {
    component: IonicSelectableComponent,
    item: any,
    isSelected: boolean
  }) {
    this.plateNumberComponent.confirm();
    this.plateNumberComponent.close();
  }


  vioTitleAction(data: any) {
    console.log('selectVioTitle', data);
    console.log('selectVioTitle', this.voilationTitleData);
    let inputVal = this.voilationTitleData.filter((item: any) => item.violation_eng_title.indexOf(data) >= 0);
    console.log('Filter Vio Title Data', inputVal);
    if (inputVal.length === 1) {
      this.updatedVioTitleID = inputVal[0].title_id;
    } else {
      this.updatedVioTitleID = null;
    }
    console.log('updatedVioTitleID', this.updatedVioTitleID);
  }

  ionViewDidEnter() {
    this.platform.ready();
    // this.loadMap();
  }

  ionViewWillLeave() {

    const loadingExist = document.getElementsByTagName('ion-loading')[0];
    if (loadingExist) {
      this.loaderService.loadingDismiss();
    }
    
  }

  get form() { return this.createWarning.controls; }
  getVoilationTypeData() {


    if (localStorage.getItem('isOnline') === "true") {

      console.log("App is online");
      let payload = {
        "source_id": this.sourceId
      }
      this.moduleService.getVoilationType(payload).subscribe((result: any) => {
        console.log('VoilationType result', result);
        this.voilationType = result.data;
        // this.voilationType = result.data.filter(violation => violation.status === "1");
      }),
        (error) => {
          console.log(error)
        };

    } else {
      this.toastService.showWarning("App is offline","No Network...")
      console.log("App is offline")
    }


  }



  getVoilationTitle(id: any) {

    if (localStorage.getItem('isOnline') === "true") {
      let payload = {
        "side_type":id,
        "term":"T"
      }
      this.moduleService.getVoilationTitle(payload).subscribe((result: any) => {
        this.voilationTitleData = result.data;
        console.log('getVoilationTitle', this.voilationTitleData);

      }),
        (error) => {
          console.log(error)
        };

    } else {

    }

  }
  selectcustomerwithproof(event: any) {
    console.log(event.target.value)
    this.isCustomerwithproof = event.target.value;
    if (this.isCustomerwithproof == 'Yes') {

    }
    else {
      // this.createWarning.controls['identityDoc'].setValue('');
    }
  }

  getvoilationSearchByField(documentNumber: any) {
    if (this.isCommercial) {
      let paramObj = {
        "licenseNo": documentNumber
      }
      this.moduleService.GetLicenseByLicenseNumber(paramObj).subscribe((res) => {
        console.log(res);
        if (res.ResponseContent && res.ResponseContent.length > 0) {
          this.licenseNumberList = res.ResponseContent;
          this.licenseNumberList.map(
            obj => {
              obj.license_no = obj.LicenseNumber
            }
          );

          // Check if the license status is in the allowStatuses array
          this.allowStatus = res.allowStatuses;
          if (this.allowStatus.includes(this.licenseNumberList[0].LicenseStatusEN)) {
            this.license = this.licenseNumberList[0];
            this.licenseExpiryDate = this.licenseNumberList[0].ExpiryDate;
            this.licenseLocation = this.licenseNumberList[0].X + ',' + this.licenseNumberList[0].Y;
            let lInfo = this.licenseNumberList;
            if (lInfo.length > 0) {
              console.log(lInfo);
              let rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('director') >= 0 });
              this.createWarning.controls['sideCodeDescription'].setValue(this.setLanguage == 'ar' ? lInfo[0].NameAR : lInfo[0].NameEN);
              if (rInfo.length > 0) {
                this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                this.createWarning.controls['email'].setValue(rInfo[0].Email);
                this.name_ded_eng = lInfo[0].NameEN;
                this.name_ded_ar = lInfo[0].NameAR;
              }
  
              rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('owner') >= 0 })
              if (rInfo.length > 0) {
                this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                this.createWarning.controls['email'].setValue(rInfo[0].Email);
                this.name_ded_eng = lInfo[0].NameEN;
                this.name_ded_ar = lInfo[0].NameAR;
              }
  
              rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('partner') >= 0 })
              if (rInfo.length > 0) {
                this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                this.createWarning.controls['email'].setValue(rInfo[0].Email);
                this.name_ded_eng = lInfo[0].NameEN;
                this.name_ded_ar = lInfo[0].NameAR;
              }
  
              rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('individual') >= 0 })
              if (rInfo.length > 0) {
                this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                this.createWarning.controls['email'].setValue(rInfo[0].Email);
                this.name_ded_eng = lInfo[0].NameEN;
                this.name_ded_ar = lInfo[0].NameAR;
              }
            }
          } else {
            // Show alert if the license status is not in allowStatuses
            this.alertErrorMessage = `The license status "${this.licenseNumberList[0].LicenseStatusEN}" is not allowed.`;
            this.showAlert();
            // this.toastService.showError(`The license status "${this.licenseNumberList[0].LicenseStatusEN}" is not allowed.`, "Alert");
            this.license = {};
          }
          } else {
            this.licenseNumberList = [];
            this.toastService.showError("No license found with the given number.", "Alert");
          }
      }, (error) => {
        console.error(error);
        this.toastService.showError("An error occurred while fetching the license details.", "Error");
      });
    } else {
      let payload = {
        "voilationType": this.svtSelected,
        "term": documentNumber
      }
      this.moduleService.getvoilationSearchByField(payload).subscribe((result: any) => {
        if (result.data.length > 0) {
          this.documentNumbersList = result.data.map(({ document_no }: any) => ({ document_no })).filter((item) => { return item.document_no != '' && item.document_no != 'null' && item.document_no != null });
          this.documentNumbersList = this.documentNumbersList.filter((v, i) => this.documentNumbersList.findIndex(item => item.document_no == v.document_no) === i);
          this.licenseNumberList = result.data.map(({ license_no }: any) => ({ license_no })).filter((item) => { return item.license_no != '' && item.license_no != 'null' && item.license_no != null });
          this.licenseNumberList = this.licenseNumberList.filter((v, i) => this.licenseNumberList.findIndex(item => item.license_no == v.license_no) === i);
          this.plateCodeList = result.data.map(({ license_plate_no }: any) => ({ license_plate_no })).filter((item) => { return item.license_plate_no != '' && item.license_plate_no != 'null' && item.license_plate_no != null });
          this.plateCodeList = this.plateCodeList.filter((v, i) => this.plateCodeList.findIndex(item => item.license_plate_no == v.license_plate_no) === i);
        } else {
          // this.toastService.showError("No data found for the given search term.", "Alert");
          console.log("No data found for the given search term.", "Alert");
        }
      }, (error) => {
        console.error(error);
        this.toastService.showError("An error occurred while searching for violation data.", "Error");
      });
    }
  }

  getSideCodeData() {
    let payload = {
      "term": "T"
    }
    this.moduleService.getSideCode(payload).subscribe((result: any) => {
      console.log('getSideCode', result);
      this.sideCode = result.data;

      //this.sideCodeActualData = result.data;
      //this.sideCodeActualData = this.sideCodeActualData.filter((value: any, index: any, a: any) => a.findIndex((t: any) => (t.side_code_id === value.side_code_id)) === index);

      this.sideCode = this.sideCode.map(({ side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid, class_pad_new,
        class_pad, calar_pad, license_no, document_type, document_no }: any) => ({
          side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid,
          class_pad_new, class_pad, calar_pad, license_no, document_type, document_no
        }));
      this.sideCode = this.sideCode.filter((value: any, index: any, a: any) => a.findIndex((t: any) => (t.side_code_id === value.side_code_id)) === index);
      // console.log(this.sideCodeComponent, "1169 canclearerror remember to comment again..................")
      if (this.sideCode.length === 0) {
        this.sideCodeComponent.canClear = false;
      }
      else {
        this.sideCodeComponent.canClear = true;
      }
    }),
      (error) => {
        console.log(error)
      };
  }

  durationValue(event: any){
    // let idd = id;
    // console.log("idddddddddd",idd)    
    console.log('Duration Selected',event.target.value);
    // console.log("duration id", event.detail.value);
    
    this.durationSelected = event.target.value;
    this.createWarning.controls['warningDuration'].setValue(this.durationSelected);
  }

  svtypeValue(event) {
    this.documentNumber = "";
    this.licenseNumber = "";
    this.platecodeNumber = "";
    this.createWarning.controls['voilationTitle'].reset();
    this.createWarning.controls['sideCode'].reset();
    if(this.fineCodeComponent){
    this.fineCodeComponent.clear();
    }
    this.finecode={};
    this.createWarning.controls['fineAmount'].setValue('');
    Object.keys(this.createWarning.controls).forEach(key => {
      if (key !== "voilationType") {
        this.createWarning.controls[key].reset();
      }
    });
    this.createWarning.controls['finecodecount'].setValue('1');

    console.log('svtSelected', event.target.value);
    this.svtSelected = event.target.value;
    this.abercheckbox = false;
    this.getViolationCategoryData(this.svtSelected)
    //this.createWarning.reset();

    if (this.svtSelected == 3) {

      this.isVehicle = true;
      this.isCommercial = false;
      this.isIndividual = false;
      this.ownerPhoneRequired = true;
      this.createWarning.controls['plateNo'].setValidators([Validators.required]);
      this.createWarning.controls['plateNo'].updateValueAndValidity();
      this.createWarning.controls['plateSource'].setValidators([Validators.required]);
      this.createWarning.controls['plateSource'].updateValueAndValidity();
      this.createWarning.controls['plateCategory'].setValidators([Validators.required]);
      this.createWarning.controls['plateCategory'].updateValueAndValidity();
      this.createWarning.controls['plateCode'].setValidators([Validators.required]);
      this.createWarning.controls['plateCode'].updateValueAndValidity();
      this.createWarning.controls['reservedCode'].setValidators([Validators.required]); //reservedIdNumber
      this.createWarning.controls['reservedCode'].updateValueAndValidity();
      this.createWarning.controls['reservedIdNumber'].setValidators([Validators.required]);
      this.createWarning.controls['reservedIdNumber'].updateValueAndValidity();
      this.createWarning.controls['recipientMobile'].setValidators([Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
      this.createWarning.controls['recipientMobile'].updateValueAndValidity();
      this.createWarning.controls['ownerphone'].setValidators([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
      this.createWarning.controls['ownerphone'].updateValueAndValidity();
      this.createWarning.controls['ownerdescription'].setValidators([]);
      this.createWarning.controls['ownerdescription'].updateValueAndValidity();
      this.createWarning.controls['documentType'].setValidators([]);
      this.createWarning.controls['documentType'].updateValueAndValidity();
      this.createWarning.controls['documentNo'].setValidators([]);
      this.createWarning.controls['documentNo'].updateValueAndValidity();
      this.createWarning.controls['licenseNo'].setValidators([]);
      this.createWarning.controls['licenseNo'].updateValueAndValidity();
      this.createWarning.controls['other_plate_source'].setValidators([]);
      this.createWarning.controls['other_plate_source'].updateValueAndValidity();
      this.createWarning.controls['reservationSites'].setValidators([]);
      this.createWarning.controls['reservationSites'].updateValueAndValidity();
      this.createWarning.controls['reservationSiteAreas'].setValidators([]);
      this.createWarning.controls['reservationSiteAreas'].updateValueAndValidity();
    }
    else if (this.svtSelected == 4) {
      this.isVehicle = true;
      this.isCommercial = false;
      this.isIndividual = false;
      this.ownerPhoneRequired = true;
      this.createWarning.controls['plateNo'].setValidators([Validators.required]);
      this.createWarning.controls['plateNo'].updateValueAndValidity();
      this.createWarning.controls['plateSource'].setValidators([Validators.required]);
      this.createWarning.controls['plateSource'].updateValueAndValidity();
      this.createWarning.controls['plateCode'].setValidators([Validators.required]);
      this.createWarning.controls['plateCode'].updateValueAndValidity();
      this.createWarning.controls['plateCategory'].setValidators([Validators.required]);
      this.createWarning.controls['plateCategory'].updateValueAndValidity();
      this.createWarning.controls['reservedCode'].setValidators([Validators.required]); //reservedIdNumber
      this.createWarning.controls['reservedCode'].updateValueAndValidity();
      this.createWarning.controls['reservedIdNumber'].setValidators([Validators.required]);
      this.createWarning.controls['reservedIdNumber'].updateValueAndValidity();
      this.createWarning.controls['recipientMobile'].setValidators([Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
      this.createWarning.controls['recipientMobile'].updateValueAndValidity();
      this.createWarning.controls['ownerphone'].setValidators([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
      this.createWarning.controls['ownerphone'].updateValueAndValidity();
      this.createWarning.controls['ownerdescription'].setValidators([]);
      this.createWarning.controls['ownerdescription'].updateValueAndValidity();
      this.createWarning.controls['documentType'].setValidators([]);
      this.createWarning.controls['documentType'].updateValueAndValidity();
      this.createWarning.controls['documentNo'].setValidators([]);
      this.createWarning.controls['documentNo'].updateValueAndValidity();
      this.createWarning.controls['licenseNo'].setValidators([]);
      this.createWarning.controls['licenseNo'].updateValueAndValidity();
      this.createWarning.controls['other_plate_source'].setValidators([]);
      this.createWarning.controls['other_plate_source'].updateValueAndValidity();
      this.createWarning.controls['reservationSites'].setValidators([]);
      this.createWarning.controls['reservationSites'].updateValueAndValidity();
      this.createWarning.controls['reservationSiteAreas'].setValidators([]);
      this.createWarning.controls['reservationSiteAreas'].updateValueAndValidity();
      this.violCategoryList = this.violCategoryListAll;
    } 
    else if (this.svtSelected == 2) {
      this.ownerPhoneRequired = true;
      this.isCommercial = true;
      this.isVehicle = false;
      this.isIndividual = false;
      this.createWarning.controls['licenseNo'].setValidators([Validators.required]);
      this.createWarning.controls['licenseNo'].updateValueAndValidity();
      this.createWarning.controls['recipientPerson'].setValidators([]);
      this.createWarning.controls['recipientPerson'].updateValueAndValidity();
      this.createWarning.controls['reservedCode'].setValidators([]);
      this.createWarning.controls['reservedCode'].updateValueAndValidity();
      this.createWarning.controls['reservedIdNumber'].setValidators([]);
      this.createWarning.controls['reservedIdNumber'].updateValueAndValidity();
      this.createWarning.controls['recipientMobile'].setValidators([]);
      this.createWarning.controls['recipientMobile'].updateValueAndValidity();
      this.createWarning.controls['ownerphone'].setValidators([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
      this.createWarning.controls['ownerphone'].updateValueAndValidity();
      this.createWarning.controls['animalhitCount'].setValidators([]);
      this.createWarning.controls['animalhitCount'].updateValueAndValidity();
      this.createWarning.controls['ownerdescription'].setValidators([]);
      this.createWarning.controls['ownerdescription'].updateValueAndValidity();
      this.createWarning.controls['documentType'].setValidators([]);
      this.createWarning.controls['documentType'].updateValueAndValidity();
      this.createWarning.controls['documentNo'].setValidators([]);
      this.createWarning.controls['documentNo'].updateValueAndValidity();
      this.createWarning.controls['plateNo'].setValidators([]);
      this.createWarning.controls['plateNo'].updateValueAndValidity();
      this.createWarning.controls['plateSource'].setValidators([]);
      this.createWarning.controls['plateSource'].updateValueAndValidity();
      this.createWarning.controls['plateCategory'].setValidators([]);
      this.createWarning.controls['plateCategory'].updateValueAndValidity();
      this.createWarning.controls['plateCode'].setValidators([]);
      this.createWarning.controls['plateCode'].updateValueAndValidity();
      this.createWarning.controls['other_plate_source'].setValidators([]);
      this.createWarning.controls['other_plate_source'].updateValueAndValidity();
      this.createWarning.controls['reservationSites'].setValidators([]);
      this.createWarning.controls['reservationSites'].updateValueAndValidity();
      this.createWarning.controls['reservationSiteAreas'].setValidators([]);
      this.createWarning.controls['reservationSiteAreas'].updateValueAndValidity();       
    }
    else {
      this.isIndividual = true;
      this.isVehicle = false;
      this.isCommercial = false;
      this.ownerPhoneRequired = false;
      this.createWarning.controls['documentType'].setValidators([Validators.required]);
      this.createWarning.controls['documentType'].updateValueAndValidity();
      this.createWarning.controls['documentNo'].setValidators([Validators.required]);
      this.createWarning.controls['documentNo'].updateValueAndValidity();
      this.createWarning.controls['plateNo'].setValidators([]);
      this.createWarning.controls['plateNo'].updateValueAndValidity();
      this.createWarning.controls['plateSource'].setValidators([]);
      this.createWarning.controls['plateSource'].updateValueAndValidity();
      this.createWarning.controls['plateCategory'].setValidators([]);
      this.createWarning.controls['plateCategory'].updateValueAndValidity();
      this.createWarning.controls['plateCode'].setValidators([]);
      this.createWarning.controls['plateCode'].updateValueAndValidity();
      this.createWarning.controls['licenseNo'].setValidators([]);
      this.createWarning.controls['licenseNo'].updateValueAndValidity();
      this.createWarning.controls['animalhitCount'].setValidators([]);
      this.createWarning.controls['animalhitCount'].updateValueAndValidity();
      this.createWarning.controls['recipientMobile'].setValidators([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
      this.createWarning.controls['recipientMobile'].updateValueAndValidity();
      this.createWarning.controls["reservedCode"].setValidators([]);
      this.createWarning.controls['reservedCode'].updateValueAndValidity();
      this.createWarning.controls['reservedIdNumber'].setValidators([]);
      this.createWarning.controls['reservedIdNumber'].updateValueAndValidity();
      this.createWarning.controls['ownername'].setValidators([]);
      this.createWarning.controls['ownername'].updateValueAndValidity();
      this.createWarning.controls['ownerphone'].setValidators([]);
      this.createWarning.controls['ownerphone'].updateValueAndValidity();
      this.createWarning.controls['ownerdescription'].setValidators([]);
      this.createWarning.controls['ownerdescription'].updateValueAndValidity();
      this.createWarning.controls['other_plate_source'].setValidators([]);
      this.createWarning.controls['other_plate_source'].updateValueAndValidity();
      this.createWarning.controls['reservationSites'].setValidators([]);
      this.createWarning.controls['reservationSites'].updateValueAndValidity();
      this.createWarning.controls['reservationSiteAreas'].setValidators([]);
      this.createWarning.controls['reservationSiteAreas'].updateValueAndValidity();
    }
    this.getVoilationTitle(this.svtSelected);
  }

  sideCodeValueData(idval) {
    console.log('selected idval', idval);
    let obj = {
      "sidetypeid":this.sideCodeId,
      "searchtext": idval
    }
    console.log(obj);

    this.moduleService.searchSideCode(obj).subscribe((data: any) => {
      this.sideCode = data.data;
      this.sideCode = this.sideCode.map(({ side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid, class_pad_new,
        class_pad, calar_pad, license_no, document_type, document_no, email, reserved_code, reserved_number }: any) => ({
          side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid,
          class_pad_new, class_pad, calar_pad, license_no, document_type, document_no, email, reserved_code, reserved_number
        }));
      this.sideCode = this.sideCode.filter((value: any, index: any, a: any) => a.findIndex((t: any) => (t.side_code_id === value.side_code_id)) === index);

      if (data.data) {
        data = data.data[0];
        if (data.document_type != "" && data.document_type != null) {
          this.selectedSourceValDocument = parseInt(data.document_type);
          console.log("selectedSourceValDocument----====", this.selectedSourceValDocument);
          this.createWarning.controls['documentNo'].setValue({ 'document_no': data.document_no });
          this.documentNumber = data.document_no;
        }
        else {
          this.document = '';
          this.documentNumber = '';
        }
        this.createWarning.controls['sideCodeDescription'].setValue(data.description);
        if (data.license_no != "" && data.license_no != null) {
          this.createWarning.controls['licenseNo'].setValue({ 'license_no': data.license_no });
        }
        else {
          this.licenseNumber = "";
          this.license = "";
        }


        this.createWarning.controls['recipientPerson'].setValue(data.recipient_person);
        this.createWarning.controls['recipientMobile'].setValue(data.recipient_mobile.replace(/^\s+/g, ''));
        this.createWarning.controls['email'].setValue(data.email.replace(/^\s+/g, ''));
        if (data.reserved_code != "" && data.reserved_code != null) {
          this.reservedCode = parseInt(data.reserved_code);
        }
        this.createWarning.controls['reservedIdNumber'].setValue(data.reserved_number);
        if (data.car_no != "" && data.car_no != null) {
          this.createWarning.controls['plateNo'].setValue({ 'license_plate_no': data.car_no });
          this.platecodeNumber = data.car_no;
          this.createWarning.controls['plateSource'].setValue(data.car_sid);
          this.selectedSourceVal = parseInt(data.car_sid);

          console.log(this.selectedSourceVal);
          console.log("plateCodeDataList", this.plateCodeDataList)

          if (localStorage.getItem('isOnline') === "true") {
            let payload = {
              "source_id": this.sourceId,
              "plate_category": this.plateCategoryid,
              "plate_source": this.selectedPlateSource
            }
            this.moduleService.getPlateCode(payload).pipe(finalize(() => {
              this.createWarning.controls['plateCode'].setValue(data.class_pad_new);
              this.selectedPlateCode = data.class_pad_new;
            })).subscribe((result: any) => {
              console.log('getPlateCode', result);
              this.plateCodeDataList = result.data;
              if (this.plateCodeDataList.length > 0) {
                this.plateCodeDataList = this.plateCodeDataList.filter((item: any) => {
                  return item.source_code === String(this.selectedSourceVal);
                })
              }
            }),
              (error) => {
                console.log(error)
              };
          }
          else {
            this.toastService.showWarning("App is offline","No Network...")
            console.log("App is offline")
          }
          console.log('selectedPlateCode', this.selectedSourceVal);
          this.createWarning.controls['plateColor'].setValue(data.calar_pad);
          this.createWarning.controls['oldCode'].setValue(data.class_pad);
          this.selectedOldCode = data.class_pad;
          console.log('selectedOldCode', this.selectedOldCode);
        }
        else {
          this.createWarning.controls['plateNo'].setValue([]);
          this.createWarning.controls['plateSource'].setValue([]);
          this.createWarning.controls['plateCategory'].setValue([]);
          this.createWarning.controls['plateCode'].setValue([]);
          this.platecodeNumber = "";
          this.selectedSourceVal = "";
          this.selectedPlateCode = "";
          this.selectedOldCode = "";
        }
        // }
        this.upDatedSideCodeID = data.side_code_id;

        let objData = {
          voilationType: this.svtSelected,
          documentType: data.document_type,
          documentNo: data.document_no,
          licenseNo: data.license_no,
          plateNo: data.car_no,
          plateSource: data.car_sid,
          plateCode: data.class_pad_new
        }
      }
      else {
        this.createWarning.controls['plateNo'].setValue('');
        this.createWarning.controls['plateSource'].setValue('');
        this.createWarning.controls['plateCategory'].setValue('');
        this.selectedSourceVal = parseInt('');
        this.createWarning.controls['plateCode'].setValue('');
        this.selectedPlateCode = '';
        this.createWarning.controls['plateColor'].setValue('');
        this.createWarning.controls['oldCode'].setValue('');
        this.selectedOldCode = '';
        this.upDatedSideCodeID = null;
      }

      this.cRef.detectChanges();
    }),
      (error) => {
        console.log(error)
      }
    console.log('upDatedSideCodeID', this.upDatedSideCodeID);

  }


  getPlateSourceData() {

    if (localStorage.getItem('isOnline') === "true") {
      let payload = {
        "source_id": this.sourceId
      }
      this.moduleService.getPlateSource(payload).subscribe((result: any) => {

        this.plateSourceList = result.data;
        console.log('PlateSource', this.plateSourceList);
      }),
        (error) => {
          console.log(error)
        };
    }
    else {
      this.toastService.showWarning("App is offline","No Network")
      console.log("App is offline")
    }


  }

  
  getSourceValue(event: any){    
    this.createWarning.controls['plateCategory'].setValue('');
    const selectedOption = event.detail.value;
    this.carsId = selectedOption.car_sid;
    console.log(selectedOption);
    console.log(this.carsId);
    if(this.sourceId == 1){
      this.selectedPlateSource = event.detail.value.car_sid;
      this.selectedPlateSourceCode = event.detail.value.aber_code;
      this.createWarning.value['plateSource'] =  this.selectedPlateSourceCode;
    }
    else{
      this.selectedPlateSource = event.detail.value.car_sid;
      this.selectedPlateSourceCode = event.detail.value.raqab_code;
      this.createWarning.value['plateSource'] =  this.selectedPlateSourceCode;
    }
    
    console.log("this.selectedPlateSource = event.target.value;",this.selectedPlateSource);
    if (this.selectedPlateSourceCode != '0') {
      this.isPlateSourceselectedOther = false;
      this.createWarning.controls['other_plate_source'].setValue('');
      this.createWarning.controls['other_plate_source'].setValidators([]);
      this.createWarning.controls['other_plate_source'].updateValueAndValidity();
      this.createWarning.controls['plateCode'].setValidators([Validators.required]);
      this.createWarning.controls['plateCode'].updateValueAndValidity();
      this.createWarning.controls['plateCategory'].setValidators([Validators.required]);
      this.createWarning.controls['plateCategory'].updateValueAndValidity();
    
     this.getPlateCategoryData();
    }
    else {
      console.log("othersssssssssss");
      this.isPlateSourceselectedOther = true;
      this.createWarning.controls['plateCode'].setValue('');
      this.createWarning.controls['plateCode'].setValidators([]);
      this.createWarning.controls['plateCode'].updateValueAndValidity();
      this.createWarning.controls['plateCategory'].setValue('');
      this.createWarning.controls['plateCategory'].setValidators([]);
      this.createWarning.controls['plateCategory'].updateValueAndValidity();
      this.createWarning.controls['other_plate_source'].setValidators([Validators.required]);
      this.createWarning.controls['other_plate_source'].updateValueAndValidity();
    }
    
  }
  getPlateCategoryData(){
    
      if (localStorage.getItem('isOnline') === "true") {
        let payload = {
          "source_id": this.sourceId,
          "plate_source_id":this.selectedPlateSource
        }
        this.moduleService.getPlateCategory(payload).subscribe((result: any) => {
  
          this.plateCategoryData = result.data;
          console.log('PlateCategory', this.plateCategoryData);
        }),
          (error) => {
            console.log(error)
          };
      }
      else {
        console.log("App is offline")
        this.toastService.showWarning("App is offline","No Network")
      }

  }
  platecategoryId(event: any){
    this.createWarning.controls['plateCode'].setValue('');
    console.log("event",event);
    if(this.sourceId == 1){
      this.plateCategoryid = event.detail.value.aber_code;
      this.createWarning.value['plateCategory'] =  this.plateCategoryid;
    }
    else{
      this.plateCategoryid = event.detail.value.raqab_code;
      this.createWarning.value['plateCategory'] =  this.plateCategoryid;
    }
    console.log("this.createWarning.controls['plateCategory']", this.createWarning.controls['plateCategory']);
    this.getPlateCodeData2();
  }
  getPlateCodeData2() {

    localStorage.setItem('plateSource', this.selectedPlateSource)
    this.selectedPlateCode = null;
    if(this.fineCodeComponent){
    this.fineCodeComponent.clear();
    }
    this.finecode={};
    this.createWarning.controls['fineAmount'].setValue('');
    if (localStorage.getItem('isOnline') === "true") {
      let payload={
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
    else {
      this.toastService.showWarning("App is offline","No Network")
      console.log("App is offline")
    }
  }

  
  platecodechange(source:any)
  {
    if(this.fineCodeComponent){
    this.fineCodeComponent.clear();
    }
    this.finecode={};
    this.createWarning.controls['fineAmount'].setValue('');
  }

  getPlateCodeData() {

    if (localStorage.getItem('isOnline') === "true") {
      let payload = {
        "source_id": this.sourceId,
        "plate_category": this.plateCategoryid,
        "plate_source": this.selectedPlateSource
      }
      this.moduleService.getPlateCode(payload).subscribe((result: any) => {
        console.log('getPlateCode', result);
        this.plateCodeDataList = result.data;
      }),
        (error) => {
          console.log(error)
        };
    }
    else {
      this.toastService.showWarning("App is offline","No Network")
      console.log("App is offline")
    }
  }

  getOldCodeData() {
    this.moduleService.getOldCode().subscribe((result: any) => {
      console.log('getOldCode', result);
      this.oldCodeDataList = result.data;
    });
  }
  getViolationCategoryData(id: any) {
    if (localStorage.getItem('isOnline') === "true") {

      console.log('selected vTypeId', id);
      let payload = {
        "side_type": id,
        "source_id": this.sourceId
      }
      this.moduleService.getViolationCategory(payload).subscribe((result: any) => {
        console.log('ViolationCategoryData', result);
        this.violCategoryList = result.data;
        this.violCategoryListAll = result.data;
      }),
        (error) => {
          console.log(error)
        };

    } else {
      this.toastService.showWarning("App is offline","No Network")
      console.log("App is offline")
    }

  }

  isAber(event: any) {
    this.createWarning.controls['violationCategory'].setValue('');
    if (event.target.checked) {
      this.violCategoryList = this.violCategoryListAll.filter((item: any) => {
        return item.fine_category_id != 2
      })
    }
    else {
      this.violCategoryList = this.violCategoryListAll;
    }
  }

  violationCategoryChange(event: any) {
    console.log('event', event.target.value);
    this.createWarning.controls['fineCode'].reset();
    this.violationCategorySelected = event.target.value.fine_category_id;
    console.log('violationCategorySelected', event.target.value.fine_category_id);
    console.log(event.target.value.create_vehicle_class);
    if(event.target.value.create_vehicle_class == 1){
    this.showVehicleClass = true;
    console.log("aber violation so enable the validation for vehicle class");
    this.createWarning.controls['vehicle_class_type'].setValidators([Validators.required]);
    this.createWarning.controls['vehicle_class_type'].updateValueAndValidity();
    }
    else{
      this.showVehicleClass = false;
      this.createWarning.controls['vehicle_class_type'].setValidators([]);
      this.createWarning.controls['vehicle_class_type'].updateValueAndValidity();
    }
    console.log("this.showvehicleclass", this.showVehicleClass);
    if (this.violationCategorySelected == 6 ) {
      this.createWarning.controls['animalhitCount'].setValidators([Validators.required]);
      this.createWarning.controls['animalhitCount'].updateValueAndValidity();
      this.isAnimalhitCountData = true;
    }
    else {
      this.createWarning.controls['animalhitCount'].setValidators([]);
      this.createWarning.controls['animalhitCount'].updateValueAndValidity();
      this.isAnimalhitCountData = false;
    }
    this.getFineCodeData(this.violationCategorySelected);
  }


  getFineCodeData(id: any) {
    if (localStorage.getItem('isOnline') === "true") {

      console.log('fine_category_id', id);
      let payload = {
        "fine_category_id": id,
        "module_type":'Warning'
      }
      this.moduleService.getFineCode(payload).subscribe((result: any) => {
        console.log('getFineCodeData', result);
        if(result.data == false){
          this.fineCodeList = []; 
        }
        else{
          this.fineCodeList = result.data;
        }
      }),
        (error) => {
          console.log(error)
        };

    } else {
      this.toastService.showWarning("App is offline", "No Network")
      console.log("App is offline")
    }

  }

  // fineCodeChange(event: {
  //   component: IonicSelectableComponent,
  //   value: any
  // }) {
  //   if (this.platecodeNumber == '' && this.documentNumber == '' && this.licenseNumber == '') {
  //     if(this.fineCodeComponent){
  //     this.fineCodeComponent.clear();
  //     }
  //     this.finecode={};
  //     this.createWarning.controls['fineAmount'].setValue('');
  //     this.toastService.showError(
  //       "Please enter the Document, Plate, or License Number to select a fine code.",
  //       "Alert"
  //     );
  //   }
  //   else {      
  //     this.finecodeValue = event.value['fine_code_id'];
  //     if (localStorage.getItem('isOnline') === "true") {
  //       console.log("selected fine code:",event.value);
  //       this.getFineAmountData(event.value['fine_code_id']);
  //       if (event.value['fc_warning_hours'] !== null && event.value['fc_warning_hours'] !== '') {
  //         this.createWarning.controls['fcwarninghours'].setValue(event.value['fc_warning_hours']);
  //         this.defaultwarning = true;
  //         this.defaultwarninghours = event.value['fc_warning_hours'];
  //       }
  //       else{
  //         this.defaultwarning = false;
  //       }
  //     } else {
  //       let fine_amount = this.fineCodeList.filter((item: any) => {
  //         return item.fine_code_id == event.value['fine_code_id']
  //       })[0].fine_amount
  //       this.createWarning.controls['fineAmount'].setValue(fine_amount);
  //       console.log("this.createWarning.controls['fineAmount']",this.createWarning.controls['fineAmount']);
  //       this.createWarning.controls['finecodecount'].setValidators([]);
  //       this.createWarning.controls['finecodecount'].updateValueAndValidity();
  //       this.finecodecount = false;
  //     }
  //   }
  // }

  fineCodeChange(event: { component: IonicSelectableComponent; value: any }) {
    if (!this.platecodeNumber && !this.documentNumber && !this.licenseNumber) {
      if (this.fineCodeComponent) {
        this.fineCodeComponent.clear();
      }
      this.finecode = {};
      this.createWarning.controls['fineAmount'].setValue('');
      this.toastService.showError(
        "Please enter the Document, Plate, or License Number to select a fine code.",
        "Alert"
      );
      return;
    }
  
    this.finecodeValue = event.value['fine_code_id'];
    if (localStorage.getItem('isOnline') === "true") {
      console.log("Selected fine code:", event.value);
      this.getFineAmountData(event.value['fine_code_id']);
      const warningHours = event.value['fc_warning_hours'];
      const warningHourstitle = event.value['fc_warning_hours_title'];
      if (warningHours !== null && warningHours !== '') {
        this.createWarning.controls['fc_warning_hours'].setValue(warningHours);
        this.createWarning.controls['fc_warning_hours_title'].setValue(warningHourstitle);
        this.defaultwarning = true;
        this.defaultwarninghours = warningHours;
        this.createWarning.controls['warningDuration'].setValidators([]);
        this.createWarning.controls['warningDuration'].updateValueAndValidity();
      } else {
        this.defaultwarning = false;
        this.createWarning.controls['warningDuration'].setValidators([Validators.required]);
        this.createWarning.controls['warningDuration'].updateValueAndValidity();
      }
      console.log('defaultwarning', this.defaultwarning);
    } else {
      const fineAmount = this.fineCodeList.find(
        (item: any) => item.fine_code_id === event.value['fine_code_id']
      )?.fine_amount;
      if (fineAmount) {
        this.createWarning.controls['fineAmount'].setValue(fineAmount);
        console.log("Fine amount set:", fineAmount);
      }
      this.createWarning.controls['finecodecount'].setValidators([]);
      this.createWarning.controls['finecodecount'].updateValueAndValidity();
      this.finecodecount = false;
    }
  }
  

 
  lessThanOneValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
  
      // Check if the value is less than 1
      if (value !== null && value !== undefined && value < 1) {
        return { 'lessThanOne': true }; // Validation failed
      }
  
      return null; // Validation passed
    };
  }

  getFineAmountData(id: any) {
    console.log('fine Amount Data', id);
    let payload = {
      "fine_code_id": id
  }
    this.moduleService.getFineAmount(payload).subscribe((result: any) => {
      this.fineAmountList = result.data[0];
      console.log("fine",this.fineAmountList); //nishanth
      this.actual_amount = this.fineAmountList.fine_amount;
      console.log('getFineAmountData', this.fineAmountList);
      if (this.fineAmountList.field_need_count === '0') {
        this.createWarning.controls['finecodecount'].setValidators([]);
        this.createWarning.controls['finecodecount'].updateValueAndValidity();
        this.finecodecount = false;
      }
      else {
        this.createWarning.controls['finecodecount'].setValidators([Validators.required, this.lessThanOneValidator()]);
        this.createWarning.controls['finecodecount'].updateValueAndValidity();
        this.finecodecount = true;
      }
      this.createWarning.controls['dailyFines'].setValue(this.fineAmountList.per_day);
    }),
      (error) => {
        console.log(error)
      };
  }

  getVehicleClassData(){
    this.moduleService.getVehicleClassTypes().subscribe((response: any) => {
      if(response.statusCode == 200 || response.status == 200){
        console.log("response of vehicle class---->", response);
        this.vehicleClassData = response.data;
      }
      else{
        this.toastService.showError("Failed to fetch Vehicle class data", "Error");
      }
    });
  };

  getReservedCodeList() {
    let payload = {
      "source_id": this.sourceId
    }
    if (localStorage.getItem('isOnline') === "true") {
      this.moduleService.getReservedCode(payload).subscribe((result: any) => {
        console.log('getReservedCode', result);
        this.reservedCodeList = result.data;
      }),
        (error) => {
          console.log(error)
        };
    }
    else {
      this.toastService.showWarning("App is offline","No Network")
      console.log("App is offline")
    }

  }

  checklocationaccess() {
    this.checkPermission();
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
        this.getAreaData();
      },
      error => {
        localStorage.setItem("locationserviceenabled", "false");
        this.getAreaData();
      }
    );
  }
  getAreaData() {

    if (localStorage.getItem('isOnline') === "true") {
      let payload ={
        "source_id": this.sourceId
      }
      this.moduleService.getArea(payload).subscribe((result: any) => {
        console.log('Area', result);
        this.areaList = result.data;
        if (localStorage.getItem('locationserviceenabled') === "false") {
          this.areaList = this.areaList.filter((result: any) => {
            return result.area_code != 1;
          })
        }
        else {
          //this.areaList = [result.data[0],...this.areaList]
        }
      }),
        (error) => {
          console.log(error)
        };

    } else {
      this.dbservice.fetchAreasList().subscribe((res) => {
        console.log('Area', res);
        this.areaList = res;
        if (localStorage.getItem('locationserviceenabled') === "false") {
          this.areaList = this.areaList.filter((result: any) => {
            return result.area_code != 1;
          })
        }
        else {
          // this.areaList = [res[0],...this.areaList]
        }
      }),
        (error) => {
          console.log(error)
        };
    }


  }

  getDocumentTypeData() {

    if (localStorage.getItem('isOnline') === "true") {

      console.log("App is online");
      this.moduleService.getDocumentType().subscribe((result: any) => {
        console.log('getDocumentType', result);
        this.documentList = result.data;

      }),
        (error) => {
          console.log(error)
        };

    } else {
      this.toastService.showWarning("App is offline","No Network");
      console.log("App is offline")
    }
  }



  getSideCodeWiseDataList(id: any) {
    this.moduleService.getSideCodeWiseData(id).subscribe((result: any) => {
      console.log('getSideCodeWiseData', result);
    }),
      (error) => {
        console.log(error)
      };
  }

  async viewMapModal() {
    console.log(this.setLocation);

    const modal = await this.modalController.create({
      component: ViewmapmodalPage,
      cssClass: 'css-class',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()

    });
    modal.onDidDismiss().then((data) => {
      // Call the method to do whatever in your home.ts
      console.log('Modal closedd');
      this.Opacity = 1;
    });
    this.Opacity = 0;
    return await modal.present();
  }

  closeModalBt() {
    this.modalController.dismiss();
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
      this.compressImage(imageBase64).then((compressedImage: string) => {
        let compressedBlob = this.b64toBlob(compressedImage.split(',')[1], 'image/jpeg');
        console.log(compressedBlob,"compressedBlob");
        const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
      const imageFle = random + '.jpg';
      this.identityDocBasePhotos.push(imageBase64);
      let filePath = this.file.externalDataDirectory + imageFle;
      this.offline_docpath = filePath + '/';
      this.loaderService.loadingPresent();
      if (localStorage.getItem('isOnline') === "true") {
        const formData = new FormData();
        formData.append('uploadedImage', compressedBlob, imageFle);
        this.moduleService.warningImage(formData).subscribe((resp: any)=>{
          console.log("image resp", resp.data);
          if(resp.statusCode === 200){
            this.loaderService.loadingDismiss();
            console.log("image resp", resp.data);
            this.wImg = resp.data;
            console.log("wImg", this.wImg);
            this.identityDocPhotos.push(this.wImg);
            console.log("typeeeeee",typeof(this.wImg));
            // console.log("type",this.createWarning.value['identityDoc'].type);
            console.log("this.identityDocPhoos",this.identityDocPhotos);
          }
          else{
            this.toastService.showError("Image not upladed successfully", "Error")
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
          console.error("Error uploading Image:", error);
          this.loaderService.loadingDismiss();
        })
      } else {
        let contentType = this.getContentType(imageBase64);
        this.file.writeFile(filePath, imageFle, compressedBlob, contentType).then((success) => {
          this.loaderService.loadingDismiss();
          console.log("File Writed Successfully", success);
        }).catch((err) => {
          this.loaderService.loadingDismiss();
          console.log("Error Occured While Writing File", err);
        })

      }
      }).catch((error)=>{
        console.error("Error compressing image:", error);
        this.toastService.showError("Error compressing image. Please try again.", "Error");
      });
      // let blob = this.b64toBlob(realData, 'image/jpeg');
    }, (err) => {
      // Handle error
      console.error("Camera error:", err);
      this.toastService.showError("Error accessing camera. Please try again.", "Error");
    });         
  };

  identityDocGallery() {
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
    }).then((imageData) => {
      let imageBase64 = 'data:image/jpeg;base64,' + imageData;
      let realData = imageData;
      this.compressImage(imageBase64).then((compressedImage: string) => {
        let compressedBlob = this.b64toBlob(compressedImage.split(',')[1], 'image/jpeg');
        console.log(compressedBlob,"compressedBlob")
        const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
      const imageFle = random + '.jpg';
      this.identityDocBasePhotos.push(imageBase64);
      let filePath = this.file.externalDataDirectory + imageFle;
      this.offline_docpath = filePath + '/';
      this.loaderService.loadingPresent();
      if (localStorage.getItem('isOnline') === "true") {
        const formData = new FormData();
        formData.append('uploadedImage', compressedBlob, imageFle);
        this.moduleService.warningImage(formData).subscribe((resp: any)=>{
          console.log("image resp", resp.data);
          if(resp.statusCode === 200){
            this.loaderService.loadingDismiss();
            console.log("image resp", resp.data);
            this.wImg = resp.data;
            console.log("wImg", this.wImg);
            this.identityDocPhotos.push(this.wImg);
            console.log("typeeeeee",typeof(this.wImg));
            // console.log("type",this.createWarning.value['identityDoc'].type);
            console.log("this.identityDocPhoos",this.identityDocPhotos);
          }
          else{
            this.toastService.showError("Image not upladed successfully", "Error")
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
          console.error("Error uploading Image:", error);
          this.loaderService.loadingDismiss();
        })
      } else {
        let contentType = this.getContentType(imageBase64);
        this.file.writeFile(filePath, imageFle, compressedBlob, contentType).then((success) => {
          this.loaderService.loadingDismiss();
          console.log("File Writed Successfully", success);
        }).catch((err) => {
          this.loaderService.loadingDismiss();
          console.log("Error Occured While Writing File", err);
        })
      }
      }).catch((err)=>{
        this.loaderService.loadingDismiss();
          console.log("Error Occurred While Writing File", err);
      })
      // let blob = this.b64toBlob(realData, 'image/jpeg');
    }, (err) => {
      // Handle error
      console.error("Camera error:", err);
      this.toastService.showError("Error accessing camera. Please try again.", "Error");
    });        
  }

  onFileUpload(event: any){
    console.log("event",event);
    
    this.upload_image = event.target.files[0];
    console.log("photo", this.upload_image);
    const formData = new FormData();
    formData.append('uploadedImage', this.upload_image);
    this.moduleService.warningImage(formData).subscribe((resp: any)=>{
    console.log("image resp", resp.data);
    if(resp.statusCode === 200){
      this.loaderService.loadingDismiss();
      console.log("image resp", resp.data);
      this.wImg = resp.data;
      console.log("wImg", this.wImg);
      this.identityDocPhotos.push(this.wImg);  
      console.log("typeeeeee",typeof(this.wImg));
      // console.log("type",this.createWarning.value['identityDoc'].type);
      console.log("this.identityDocPhoos",this.identityDocPhotos);
    }
    else{
      this.toastService.showError("Image not upladed successfully", "Error")
      this.loaderService.loadingDismiss();
    }
    })  
  }

  getCemara() {
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
    }).then((imageData) => {
      let imageBase64 = 'data:image/jpeg;base64,' + imageData;
      let realData = imageData;
      this.compressImage(imageBase64).then((compressedImage: string) => {
        let compressedBlob = this.b64toBlob(compressedImage.split(',')[1], 'image/jpeg');
        console.log(compressedBlob,"compressedBlob") ;
        const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
        const imageFle = random + '.jpg';
        let filePath = this.file.externalDataDirectory + imageFle;
        console.log("this.photos", this.photos);
        console.log("filePath",filePath);
        this.offline_docpath = filePath + '/';
        this.loaderService.loadingPresent();
        if (localStorage.getItem('isOnline') === "true") {
          const formData = new FormData();
          formData.append('uploadedImage', compressedBlob, imageFle);
          this.moduleService.warningImage(formData).subscribe((resp: any)=>{
            console.log("image resp", resp.data);
            if(resp.statusCode === 200){
              this.loaderService.loadingDismiss();
              console.log("image resp", resp.data);
              this.vImg = resp.data;
              console.log("this.vImg", this.vImg);
           if (this.photos.length <= 4) {
            this.photos.push(this.vImg);//this.imgUrl);
            console.log('Photos Push', this.photos);
            this.camDisabled = false;
          }
          else {
            this.camDisabled = true;
          }
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
            console.error("Error uploading Image:", error);
            this.loaderService.loadingDismiss();
          })
        } 
        else {
          let contentType = this.getContentType(imageBase64);
          this.file.writeFile(filePath, imageFle, compressedBlob, contentType).then((success) => {
            this.loaderService.loadingDismiss();
            console.log("File Writed Successfully", success);
          }).catch((err) => {
            this.loaderService.loadingDismiss();
            console.log("Error Occured While Writing File", err);
          })
        }
        if (this.photos.length <= 4) {
          this.basePhotos.push(imageBase64);
          console.log('Photos Push', this.photos);
          this.camDisabled = false;
        }
        else {
          this.camDisabled = true;
        }
      }).catch((err) =>{
        this.loaderService.loadingDismiss();
        console.log("Error Occurred While Writing File", err);
      })
      // let blob = this.b64toBlob(realData, 'image/jpeg');
     
    }, (err) => {
      // Handle error
      console.error("Camera error:", err);
      this.toastService.showError("Error accessing camera. Please try again.", "Error");
    });
  }

  getImageFromGallery() {
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
    }).then((imageData) => {
      let imageBase64 = 'data:image/jpeg;base64,' + imageData;
      let realData = imageData;
      this.compressImage(imageBase64).then((compressedImage: string) => {
        let compressedBlob = this.b64toBlob(compressedImage.split(',')[1], 'image/jpeg');
        console.log(compressedBlob,"compressedBlob");
        const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
        const imageFle = random + '.jpg';
        let filePath = this.file.externalDataDirectory + imageFle;
        console.log("this.photos", this.photos);
        console.log("filePath",filePath);
        this.offline_docpath = filePath + '/';
        this.loaderService.loadingPresent();
        if (localStorage.getItem('isOnline') === "true") {
          const formData = new FormData();
          formData.append('uploadedImage', compressedBlob, imageFle);
          this.moduleService.warningImage(formData).subscribe((resp: any)=>{
            console.log("image resp", resp.data);
            if(resp.statusCode === 200){
              this.loaderService.loadingDismiss();
              console.log("image resp", resp.data);
              this.vImg = resp.data;
              console.log("this.vImg", this.vImg);
           if (this.photos.length <= 4) {
            this.photos.push(this.vImg);//this.imgUrl);
            console.log('Photos Push', this.photos);
            this.camDisabled = false;
          }
          else {
            this.camDisabled = true;
          }
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
            console.error("Error uploading Image:", error);
            this.loaderService.loadingDismiss();
          })
        } 
        else {
          let contentType = this.getContentType(imageBase64);
          this.file.writeFile(filePath, imageFle, compressedBlob, contentType).then((success) => {
            this.loaderService.loadingDismiss();
            console.log("File Writed Successfully", success);
          }).catch((err) => {
            this.loaderService.loadingDismiss();
            console.log("Error Occured While Writing File", err);
          })
        }
        if (this.photos.length <= 4) {
          this.basePhotos.push(imageBase64);
          console.log('Photos Push', this.photos);
          this.camDisabled = false;
        }
        else {
          this.camDisabled = true;
        }
      }).catch((error) => {
        console.error("Error compressing image:", error);
        this.toastService.showError("Error compressing image. Please try again.", "Error");
      });
      // let blob = this.b64toBlob(realData, 'image/jpeg');
      // console.log(blob);
    }, (err) => {
      // Handle error
      console.error("Camera error:", err);
      this.toastService.showError("Error accessing camera. Please try again.", "Error");
    });
  }

  compressImage(base64: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set the canvas size to 50% of the original image
        canvas.width = img.width * 0.5;
        canvas.height = img.height * 0.5;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Compress the image to JPEG with 0.7 quality (adjust as needed)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      img.onerror = (error) => reject(error);
      img.src = base64;
    });
  }

  b64toBlob(b64Data, contentType): Blob {
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

    // let blob = new Blob(byteArrays, { type: contentType });
    // return blob;
    return new Blob(byteArrays, { type: contentType });
  }


  getGallery() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      console.log('imageData', imageData);
      this.imgUrl = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.createWarning.patchValue({
        fileSource: file
      });
      console.log('files', event.target.files[0]);
      this.createWarning.controls['identityDoc_file'].setValue(file);
      this.createWarning.controls['identityDoc'].setValue(file.name);
    }
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
          this.toastService.showSuccess("Video upload in process","success");
         
          let capturedVid = data[0];
          console.log("1 video data",capturedVid);
          let localVideoPath = capturedVid.fullPath;
          console.log("2 video path",localVideoPath);
          let directoryPath = localVideoPath.substr(0, localVideoPath.lastIndexOf('/'));
          let fileName = localVideoPath.substr(localVideoPath.lastIndexOf('/') + 1).replace(/[^a-zA-Z0-9-_\.]/g, '');
          this.compressAndUploadVideo(localVideoPath);
          // this.uploadPhoto(localVideoPath);
        },
        (err: CaptureError) => {
          console.error(err);
          this.toastService.showError(err, "Alert");
          this.loaderService.loadingDismiss();
        }
      );
  }

  private compressAndUploadVideo(videoUri: string): void {
    this.getFileSize(videoUri).then(originalSize => {
      console.log("Original video size (in bytes):", originalSize);
      if(localStorage.getItem('isOnline') != "true"){
        this.storeVideoInMobileStorage(videoUri);
      }
      else{
              // Compress video
      this.videoEditor.transcodeVideo({
        fileUri: videoUri,
        outputFileName: 'compressed_' + new Date().getTime(),
        outputFileType: this.videoEditor.OutputFileType.MPEG4,
        saveToLibrary: true,
        width: 1280,  // Optional: Set a width for resizing
        height: 720,  // Optional: Set a height for resizing
        // Optional: Restrict video duration (in seconds)
      }).then((compressedUri: any) => {
        console.log("video uri", videoUri);
        console.log("compressesdurl", compressedUri);
        
        // Ensure the compressedUri has the 'file://' prefix
        const formattedCompressedUri = compressedUri.startsWith('file://') ? compressedUri : 'file://' + compressedUri;
        console.log("Compressed video URI:", formattedCompressedUri);
  
        this.getFileSize(formattedCompressedUri).then(compressedSize => {
          console.log("Compressed video size (in bytes):", compressedSize);
  
          // Proceed with uploading the compressed video
          this.file.resolveLocalFilesystemUrl(formattedCompressedUri)
            .then((entry) => (<FileEntry>entry).file(file => this.readFile(file)))
            .catch(err => {
              console.error("Error resolving compressed file URL:", err);
              this.toastService.showError("Error resolving file", "Alert");
            });
        }).catch(err => {
          console.error("Error getting compressed file size:", err);
        });
      }).catch(err => {
        console.error("Error while compressing video", err);
        this.toastService.showError("Compression failed", "Alert");
        this.loaderService.loadingDismiss();
      });
      }
    }).catch(err => {
      console.error("Error retrieving original video size", err);
    });
  }

  private getFileSize(fileUri: string): Promise<number> {
    return this.file.resolveLocalFilesystemUrl(fileUri)
      .then((entry: FileEntry) => new Promise<number>((resolve, reject) => {
        entry.file(file => resolve(file.size), err => reject(err));
      }));
  }

//   private uploadPhoto(imageFileUri: any): void{
//     if (localStorage.getItem('isOnline') !== "true") {
//       // If not online, store the video in mobile storage
//       this.storeVideoInMobileStorage(imageFileUri);
//   }
//   else{
//     this.file.resolveLocalFilesystemUrl(imageFileUri).then((entry) => (<FileEntry>entry).file(file => this.readFile(file)))
//     .catch(err => console.log(err)
//     );
//   }

//   }

  private storeVideoInMobileStorage(imageFileUri: any): void {
    /* specify the directory and filename where you want to save the video */
    console.log(imageFileUri);
    let filePath = this.file.externalDataDirectory + "WarningDocs/";
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
      const imageFle = random + '.mp4';
    this.file.writeFile(filePath,imageFle,'video.mp4', { replace: true })
        .then((success) => {
            this.loaderService.loadingDismiss();
            this.toastService.showSuccess("Video Stored in Mobile Storage Successfully", "success");
            this.zone.run(() => {
              this.showText = true;
              console.log("showText",this.showText);
          })
          this.videoData.push(imageFle);
        })
        .catch((err) => {
            this.loaderService.loadingDismiss();
            console.log("Error Occurred While Storing Video in Mobile Storage", err);
        });
    }

  private readFile(file: any){
   
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {type:file.type});

      formData.append('file', imgBlob, file.name);
      this.saveStandard(formData);
    
    }
    reader.readAsArrayBuffer(file);
  }

   saveStandard(receivedStandardInfo:any){
    return new Promise((resolve, reject) => {
   
     this.moduleService.warningVideo(receivedStandardInfo).subscribe((resp: any)=>{
       
        console.log("image resp", resp.data);
        if(resp.statusCode === 200){
          console.log("image resp", resp.data);
          this.videoData.push(resp.data);
          this.toastService.showSuccess("Success","Video Uploaded Successfully");
          this.zone.run(() => {
              this.showText = true;
              console.log("showText",this.showText);
          })
          this.loaderService.loadingDismiss();
          console.log("this.videoData",this.videoData);
          
        }
        else{
          this.loaderService.loadingDismiss();
        this.toastService.showError(resp.data, "error");
        }
        resolve(resp);
      }, (err) => {
        this.loaderService.loadingDismiss();
            console.log(err);
            reject(err);
      });
          }).catch(error =>
            {
             this.loaderService.loadingDismiss();
              console.log('caught', error.message); });
  }

  onDelete(data: any, name:any){
    console.log("data",data);
    let payload = {
      "imagename":data,
    }
    this.moduleService.deleteImage(payload).subscribe((resp : any)=>{
      console.log(resp.data, "deleted");
      if(name === 'identity'){
        let indexToDelete= this.identityDocPhotos.findIndex((each)=>{
          console.log(each[0]);
          return each[0] === data;
          })
          if (indexToDelete !== -1) {
            this.identityDocPhotos.splice(indexToDelete, 1);
            console.log("Image deleted from array");
          } else {
            console.log("Image not found in array");
          }
          console.log(indexToDelete);
      }
      if(name === 'violation'){
        let indexToDelete= this.photos.findIndex((each)=>{
          console.log(each[0]);
          return each[0] === data;
          })
          if (indexToDelete !== -1) {
            this.photos.splice(indexToDelete, 1);
            console.log("Image deleted from array");
          } else {
            console.log("Image not found in array");
          }
          console.log(indexToDelete)
        
      }
    })
  }

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  scrollToError(): void {
    const firstElementWithError = document.getElementById("createform").querySelector('form .ng-invalid[formControlName]');
    console.log("aa:", firstElementWithError);
    this.scrollTo(firstElementWithError);
  }

  handleReservation(event:any){
    console.log(event.detail.value,"reserved code data");
    this.selectedReservedData = event.detail.value;
    console.log(this.selectedReservedData);
    this.createWarning.value['reservedCode'] = this.selectedReservedData.reserved_code;
    console.log(this.createWarning.value);
    if(this.selectedReservedData.no_reserved == 0){
      this.showReservation = true;
      this.createWarning.controls['reservationSites'].setValidators([Validators.required]);
      this.createWarning.controls['reservationSites'].updateValueAndValidity();
      this.createWarning.controls['reservationSiteAreas'].setValidators([Validators.required]);
      this.createWarning.controls['reservationSiteAreas'].updateValueAndValidity();
      this.createWarning.controls['reservedIdNumber'].setValidators([Validators.required]);
      this.createWarning.controls['reservedIdNumber'].updateValueAndValidity();
      this.showMandatory = true;
    }
    else{
      this.showReservation = false;
      this.createWarning.controls['reservationSites'].setValidators([]);
      this.createWarning.controls['reservationSites'].updateValueAndValidity();
      this.createWarning.controls['reservationSiteAreas'].setValidators([]);
      this.createWarning.controls['reservationSiteAreas'].updateValueAndValidity();
      this.createWarning.controls['reservedIdNumber'].setValidators([]);
      this.createWarning.controls['reservedIdNumber'].updateValueAndValidity();
      this.showMandatory = false;
    }
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
    }
  }

  reservationsiteChange(event : any){
    console.log("Reservation Change", event);
    this.getReservartionAreas(event.detail.value);
    
  }

  getReservartionAreas(id: any){
    if(localStorage.getItem('isOnline') === "true") {
      let payload = {
        reservation_site_id: id
      }
      this.moduleService.getReservationSiteAreas(payload).subscribe((resp)=>{
        console.log("Reservation Areas", resp);
        this.reservationSitesAreasList = resp.data;
      }),
      (error) => {
        console.log(error);
      }
    }
    else{
      console.log("App is offline");
    }
  }

  getWarningSpecificatins(){
    if(localStorage.getItem('isOnline') === 'true'){
      this.moduleService.getWarningSpecifications().subscribe((response)=>{
        console.log("Warning Specification Response", response.data);
        this.specificationList = response.data;
      })
    }
    else{
      console.log("App is offline");
    }
  }

  handleWarningSpecification(event: any){
    console.log(event.detail.value);
    const eventResponse = event.detail.value;
    if(eventResponse.create_violation == 1 ){
      this.warningSpecificationId = eventResponse.id;
      this.createViolation = true;
      console.log(this.createViolation)
      this.createWarning.controls['finecodecount'].setValidators([Validators.required]);
      this.createWarning.controls['finecodecount'].updateValueAndValidity();
      this.createWarning.controls['fineCode'].setValidators([Validators.required]);
      this.createWarning.controls['fineCode'].updateValueAndValidity();
      this.createWarning.controls['warningDuration'].setValidators([Validators.required]);
      this.createWarning.controls['warningDuration'].updateValueAndValidity();
    }
    else{
      this.warningSpecificationId = eventResponse.id;
      this.createViolation = false;
      this.createWarning.controls['finecodecount'].setValidators([]);
      this.createWarning.controls['finecodecount'].updateValueAndValidity();
      this.createWarning.controls['fineCode'].setValidators([]);
      this.createWarning.controls['fineCode'].updateValueAndValidity();
      this.createWarning.controls['warningDuration'].setValidators([]);
      this.createWarning.controls['warningDuration'].updateValueAndValidity();
    }
  }

  onSubmit() {
    console.log('Form Controls', this.createWarning.value);
    // return
    console.log("Invalid Controls", this.findInvalidControls(this.createWarning))
    const signimg = ""
    let signImage = "";
    let signature_docs: any = [];
    this.submitted = true;
    if (this.createWarning.invalid) {
      this.scrollToError();
      this.submitted = false;
      return;
    }

    if (this.isCustomerwithproof == "Yes") {
      if (this.identityDocPhotos.length === 0) {
        this.toastService.showError(this.setLanguage == "ar" ? "الرجاء إدخال صورة الهوية" : "Identity Document Required", this.setLanguage == "ar" ? "تنبيه " : "Alert");
        this.submitted = false;
        return;
      }
    }
    if (this.svtSelected != 3 && this.svtSelected != 4) {
      if (this.photos.length === 0) {
        this.toastService.showError("Violation Document Required", this.setLanguage == "ar" ? "تنبيه " : "Alert");
        this.submitted = false;
        return;
      }
    }

    if (this.isvideoCaptured === true && this.videoData.length === 0){ 
      this.toastService.showError("video Document Required", this.setLanguage == "ar" ? "تنبيه " : "Alert");
      this.submitted = false;
      return;
  }


    let data = {
      user_id: localStorage.getItem('user_id'),
      language: localStorage.getItem('language'),
    };
    if (this.createWarning.value['voilationTitle'] != null) {
      let vTitleData = this.createWarning.value['voilationTitle'].violation_eng_title != undefined ? this.createWarning.value['voilationTitle'].violation_eng_title : this.addVioTitleData;
      this.createWarning.value['voilationTitle'] = vTitleData;
    }

    let sCodeData = this.createWarning.value['sideCode'] ? this.createWarning.value['sideCode'].description : '';
    this.createWarning.value['violator_signature'] = signImage;
    this.createWarning.value['voilationtitleid'] = this.updatedVioTitleID;
    this.createWarning.value['sideCode'] = sCodeData;
    this.createWarning.value['sideCodeID'] = this.upDatedSideCodeID == null ? 0 : this.upDatedSideCodeID;
    this.createWarning.value['created_by'] = localStorage.getItem('user_id');
    this.createWarning.value['camerafiles'] = this.imgUrl === undefined ? null : this.imgUrl;
    this.createWarning.value['created_on'] = moment.tz("Asia/Dubai").format('YYYY-MM-DD HH:mm:ss')//this.datePipe.transform(new Date(), 'yyyy-MM-dd H:mm:ss');
    this.createWarning.value['mulltifiles'] = this.photos.toString();
  if(this.isCustomerwithproof === 'No'){
    this.createWarning.value['identityDoc'] = '';
  }
  else{
    this.createWarning.value['identityDoc'] = this.identityDocPhotos.toString();
  }
   this.createWarning.value['video'] = this.videoData.toString();
    this.createWarning.value['actual_amount'] = this.actual_amount;
    this.createWarning.value['repeat_amount'] = this.repeat_amount;
    this.createWarning.value['is_violation_repeated'] = this.is_violation_repeated;
    this.createWarning.value['area'] = this.createWarning.value['area'].area_id;
    console.log('Forms Fields', this.createWarning.value);

    Object.keys(this.createWarning.value).map((key, index) => {
      if (this.createWarning.value[key] == "null" || this.createWarning.value[key] == "undefined") {
        this.createWarning.value[key] = "--";
      }
    });
    this.createWarning.value['fineCode'] = this.finecodeValue;
    if (this.svtSelected == 1) {
      this.createWarning.value['documentNo'] = this.documentNumber;
      console.log(this.createWarning.value)
      let arablangdocname: any;
      let englangdocname: any;
      let getDocDetails = this.documentList.filter((item: any) => { return item.id == this.createWarning.value['documentType'] })[0];

      arablangdocname = getDocDetails.name_arb;
      englangdocname = getDocDetails.name_eng;
      if (this.setLanguage === 'ar') {
        if (arablangdocname == "") {
          this.documentTypeName = englangdocname;
        }
        else {
          this.documentTypeName = arablangdocname;
        }
      }
      else {
        this.documentTypeName = englangdocname;
      }
      this.createWarning.value['documentTypeName'] = this.documentTypeName;
      this.createWarning.value['licenseNo'] = "";
      this.createWarning.value['plateNo'] = "";
      this.createWarning.value['plateCode'] = "";
      this.createWarning.value['plateSource'] = "";
      this.createWarning.value['reservedCode'] = "";
      this.createWarning.value['reservedIdNumber'] = "";
    }
    else if (this.svtSelected == 2) {
      this.createWarning.value['documentNo'] = '';
      this.createWarning.value['documentTypeName'] = '';
      this.createWarning.value['licenseNo'] = this.licenseNumber;
      this.createWarning.value['plateNo'] = "";
      this.createWarning.value['licenseExpiryDate'] = this.licenseExpiryDate,
      this.createWarning.value['licenseLocation'] = this.licenseLocation
    }
    else {
      this.createWarning.value['documentNo'] = '';
      this.createWarning.value['documentTypeName'] = '';
      this.createWarning.value['plateNo'] = this.platecodeNumber;
      this.createWarning.value['licenseNo'] = "";
    }
    this.createWarning.value['consider_as_aber'] = "No";   
    if (this.createWarning.value['finecodecount'] !== null) {

      if (this.createWarning.value['finecodecount'] == 0) {
        this.createWarning.value['finecodecount'] = 1;
      }
      console.log("fineamount",this.createWarning.value['fineAmount']);
      console.log("finecodecount",this.createWarning.value['finecodecount']);
  
  
      this.createWarning.value['fineAmount'] = this.actual_amount * this.createWarning.value['finecodecount'];
      console.log("multipleamount", this.createWarning.value['fineAmount']);
    }

    let ViolationKeys = Object.keys(this.createWarning.value);
    const exp = /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/;
    ViolationKeys.map((item) => {
      if (this.createWarning.value[item] != undefined && this.createWarning.value[item] != null && !Number.isNaN(this.createWarning.value[item])) {
        if (isNaN(this.createWarning.value[item]) && !Array.isArray(this.createWarning.value[item]) && typeof this.createWarning.value[item] !== "object") {
          if (this.createWarning.value[item].match(exp)) {
            this.toastService.showError('Enter Valid Input.', 'Alert');
            return;
          }
        }
      }
    })
    this.createWarning.value.violationCategory = this.violationCategorySelected;

    /* Validate Input */
    if (localStorage.getItem('isOnline') === "true") {
      this.loaderService.loadingPresent()
  
      this.createWarning.value['name_ded_eng'] = this.name_ded_eng == undefined? null:this.name_ded_eng;
      this.createWarning.value['name_ded_ar'] = this.name_ded_ar == undefined? null:this.name_ded_ar;
 
      if(this.createWarning.controls['finePlace'].value === null || undefined || ''){
        this.createWarning.controls['finePlace'].setValue(this.latitude + ',' + this.longitude);
      }

      else{
        this.createWarning.value['source_id'] = this.sourceId
        this.createWarning.value['plateSource'] = this.selectedPlateSourceCode;
        this.createWarning.value['plateCategory'] = this.plateCategoryid;
        if(this.svtSelected != 1){
          if(this.selectedReservedData && this.selectedReservedData.reserved_code){
            this.createWarning.value['reservedCode'] = this.selectedReservedData.reserved_code;
          } else {
            this.createWarning.value['reservedCode'] = '';
          }
        }
        this.createWarning.value['warningSpecification'] = this.warningSpecificationId;
        console.log("payload_json",this.createWarning.value);
        this.moduleService.createWarning(this.createWarning.value).subscribe((result: any) => {

          
          console.log("result", result);
            console.log('Created res', result);
            this.loaderService.loadingDismiss()
            this.routerServices.navigate(['/warninglist'], { replaceUrl: true });
            this.toastService.showSuccess('Warning Successfuly Created', 'Thank You');
            this.photos = [];
            this.basePhotos = [];
            this.identityDocPhotos = [];
            this.identityDocBasePhotos = [];
            signature_docs = [];
            this.createWarning.reset();
            this.createWarning.setErrors(null); // could be removed
            this.createWarning.updateValueAndValidity();
            this.moduleService.reloadEvent.next(data);
            this.submitted = false;
  
          // }
          this.loaderService.loadingDismiss()
        },
        (error: any) => {
          console.log(error)
          this.submitted = false;
          this.loaderService.loadingDismiss();
          if (error.statusCode == 400 && error.data && error.data.msg) {
            this.toastService.showError(error.data.msg, 'Alert');
          } else if (error.status === 401) {
            this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
          } else {
            this.toastService.showError('An error occurred. Please try again.', 'Alert');
          }
          console.log("Error Create Warning",error)
          this.toastService.showError(error.data.msg, 'Alert');
        }
      );

      }
      

    }
    else {
      this.loaderService.loadingDismiss()
      this.createWarning.value["docpath"] = this.offline_docpath;
      this.createWarning.value["videospath"] = this.offline_videos_path;
      this.createWarning.value["signaturepath"] = this.offline_signature_path;
    }
  }

  AreaChange(event: {
    component: IonicSelectableComponent,
    value: any,
  }) {
    // Assuming your areaList items have 'latitude' and 'longitude' properties
    console.log("area_event",event);
    const areaCode = event.value.area_code;
    this.latitude = event.value.latitude;
    this.longitude = event.value.longtitude;
  
    console.log("area_code",event.value.area_code);
    console.log("latitude", this.latitude);
    console.log("longitude", this.longitude);
  
    let options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 3600
    };
  
    this.geolocation.getCurrentPosition(options).then((position) => {
      this.createWarning.controls['finePlace'].setValue(position.coords.latitude + ',' + position.coords.longitude);
      this.createWarning.controls['areaCode'].setValue(areaCode);
    });
     console.log(this.createWarning.controls['finePlace'].value,"finePlace");
  }
  onClearArea(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }


  latlong(){

    let options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 3600
    };

    this.geolocation.getCurrentPosition(options).then((position) => {
      this.createWarning.controls['finePlace'].setValue(position.coords.latitude + ',' + position.coords.longitude);
      this.onSubmit();
    })
  }


  async openViewer() {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });
    return await modal.present();
  }

  findInvalidControls(f: FormGroup) {
    const invalid = [];
    const controls = f.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  public writeFile(base64Data: any, folderName: string, fileName: any) {
    let contentType = this.getContentType(base64Data);
    let DataBlob = this.base64toBlob(base64Data, contentType);
    // here iam mentioned this line this.file.externalRootDirectory is a native pre-defined file path storage. You can change a file path whatever pre-defined method.  
    let filePath = this.file.externalDataDirectory + folderName;

    this.file.writeFile(filePath, fileName, DataBlob, contentType).then((success) => {
      console.log("File Writed Successfully", success);
    }).catch((err) => {
      console.log("Error Occured While Writing File", err);
    })
  }
  //here is the method is used to get content type of an bas64 data  
  public getContentType(base64Data: any) {
    let block = base64Data.split(";");
    let contentType = block[0].split(":")[1];
    return contentType;
  }
  //here is the method is used to convert base64 data to blob data  
  public base64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, {
      type: contentType
    });
    return blob;
  }

  onClearViolationTitle(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }

  onClearSidecodeTitle(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }

  onCleardocumnetNumber(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }

  onClearlicenseNo(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }

  onClearplateNumber(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }

  onClearfineCode(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }

  Search(searchText: any) {
    let text = searchText;
    this.licenseNumber = text;
    if (localStorage.getItem('isOnline') === "true") {
      let paramObj = {
        "licenseNo": text
      }
      this.licenseNumber = text;
      this.loaderService.loadingPresent();
      console.log(paramObj);
      this.moduleService.GetLicenseByLicenseNumber(paramObj).subscribe((res) => {
        console.log(res, "licence details with search");
        this.allowStatus = res.allowStatuses;
        console.log(this.allowStatus)
        if (res.ResponseContent) {
          if (res.ResponseContent.length > 0) {  
            this.licenseNumberList = res.ResponseContent; 
            console.log(this.licenseNumberList, "LicenceNumberList")  
            this.licenseNumberList.map(
              obj => {
                obj.license_no = obj.LicenseNumber
              }
            );
            console.log(this.licenseNumberList, "LicenceNumberList");
  
            // Check if the license status is in the allowStatuses array
            if (this.allowStatus.includes(this.licenseNumberList[0].LicenseStatusEN)) {
              this.licenseExpiryDate = this.licenseNumberList[0].ExpiryDate;
              this.licenseLocation = this.licenseNumberList[0].X + ',' + this.licenseNumberList[0].Y;
              this.license = this.licenseNumberList[0];
              let lInfo = this.licenseNumberList
              if (lInfo.length > 0) {
                console.log(lInfo);
                let rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('director') >= 0 })
                this.createWarning.controls['sideCodeDescription'].setValue(this.setLanguage == 'ar' ? lInfo[0].NameAR : lInfo[0].NameEN);
                if (rInfo.length > 0) {
                  this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.createWarning.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
  
                rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('owner') >= 0 })
                if (rInfo.length > 0) {
                  this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.createWarning.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
  
                rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('partner') >= 0 })
                if (rInfo.length > 0) {
                  this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.createWarning.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
  
                rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('individual') >= 0 })
                if (rInfo.length > 0) {
                  this.createWarning.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.createWarning.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.createWarning.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
              }
            } else {
              // Show alert if the license status is not in allowStatuses
              this.alertErrorMessage = `The license status "${this.licenseNumberList[0].LicenseStatusEN}" is not allowed.`;
              this.showAlert();
              // this.toastService.showError(`The license status "${this.licenseNumberList[0].LicenseStatusEN}" is not allowed.`, "Alert");
              this.license = {};
            }
          } else {
            this.toastService.showError("No license found with the given number.", "Alert");
          }
        } else {
          this.toastService.showError("No response content received.", "Alert");
        }
        this.loaderService.loadingDismiss();
      },
      (error) => {
        this.loaderService.loadingDismiss();
        this.toastService.showError("An error occurred while fetching the license details.", "Error");
      })
    } else {
      this.getvoilationSearchByField(text);
      this.licenseNumberComponent.showAddItemTemplate();
    }
  }

  async showAlert() {  
    const alert = await this.alertCtrl.create({  
      header: 'Alert',    
      message: this.alertErrorMessage,  
      buttons: ['OK']  
    });  
    await alert.present();  
    const result = await alert.onDidDismiss();  
    console.log(result);  
  } 

  

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }


  getWarningData(){
    this.moduleService.warningHours().subscribe((resp: any)=>{
      console.log("warning hours", resp);
      this.durationData = resp.data    
    })
  }


  ngOnDestroy() {
    const loadingExist = document.getElementsByTagName('ion-loading')[0];
    if (loadingExist) {
      this.loaderService.loadingDismiss();
    }
  }

}