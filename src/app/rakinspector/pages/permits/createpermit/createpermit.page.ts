import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ModuleService } from 'src/app/shared/services/module.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-createpermit',
  templateUrl: './createpermit.page.html',
  styleUrls: ['./createpermit.page.scss'],
})
export class CreatepermitPage implements OnInit {
  createpermit: FormGroup;
  sourceId: any;
  plateSourceList: any;
  selectedPlateSource: any;
  plateCategoryData: any;
  plateCategoryid: any;
  selectedPlateSourceCode: any;
  plateCodeDataList: any;
  setLanguage: any;
  permitImagesBlob: any[] = [];
  permitImage: any;
  permitImages: any[] = [];
  equipmentList: any[] = [];
  imageBase = environment.permitImagePath;
  pc_id: any;

  constructor(
    private fb: FormBuilder,
    private moduleService: ModuleService,
    private translateService: TranslateService,
    private camera: Camera,
    private loaderService: LoaderService,
    private toastService: ToastService,
    public routerServices: Router
  ) {
    this.sourceId = localStorage.getItem('sourceId');
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
    this.createpermit = this.fb.group({
      permit_number: ['', [Validators.required]],
      permit_date: ['', [Validators.required]],
      license_number: ['', [Validators.required]],
      receipt_number: ['', [Validators.required]],
      start_date_time: ['', [Validators.required]],
      end_date_time: ['', [Validators.required]],
      email: ['', [Validators.email]],
      mobile_number: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      permit_subject: [''],
      comments: [''],
      attachment: [''],
      equipmentDetails: this.fb.array([this.createEquipment()])  // Initialize with one empty equipment
    });

  }

  ngOnInit() {
    this.getPlateSourceData();
    this.getEquipmentTypes();
  }

  get equipmentDetails() {
    return this.createpermit.get('equipmentDetails') as FormArray;
  }

  createEquipment(): FormGroup {
    return this.fb.group({
      equipmentType: ['', [Validators.required]],
      plateNo: [''],
      plateSource: [''],
      plateCode: [''],
      plateCategory: ['']
    });
  }

  addEquipment() {
    this.equipmentDetails.push(this.createEquipment());
  }

  removeEquipment(index: number) {
    this.equipmentDetails.removeAt(index);
    console.log(this.equipmentDetails);
  }

  validateEquipmentArray(formArray: FormArray): { [key: string]: boolean } | null {
    // Ensure at least one equipment is added
    return formArray.length > 0 ? null : { emptyArray: true };
  }

  getPlateSourceData() {
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

  getSourceValue(event) {
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
    }),
      (error) => {
        console.log(error)
      };
  }

  platecategoryId(event: any) {
    if (this.createpermit.controls['plateCode']) {
      this.createpermit.controls['plateCode'].setValue('');
    }
    this.pc_id = event.detail.value.id;
    this.createpermit.value['plateCategory'] = this.pc_id;
    if (this.sourceId == 1) {
      this.plateCategoryid = event.detail.value.aber_code;
    }
    else {
      this.plateCategoryid = event.detail.value.raqab_code;
    }
    console.log(" create violation values after selecting plate category:", this.createpermit.value);
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

  async permitCam() {
    const options: CameraOptions = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
    }; try {
      this.loaderService.loadingPresent();
      const imageData = await this.camera.getPicture(options);
      const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
      const imageFle = random + '.jpg';
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      const blob = this.b64toBlob(imageData, 'image/jpeg');
      const formData = new FormData();
      formData.append('uploadedImage', blob, imageFle);
      this.permitImagesBlob.push(blob);
      console.log("Captured image blob:", blob);
      this.moduleService.permitDocUpload(formData).subscribe((resp: any) => {
        if (resp.statusCode === 200) {
          this.loaderService.loadingDismiss();
          this.permitImage = resp.data;
          console.log("reportImage", this.permitImage);
          this.permitImages.push(this.permitImage);
          this.loaderService.loadingDismiss();
        }
        else {
          this.toastService.showError("Image not upladed successfully", "Error")
          this.loaderService.loadingDismiss();
        }
      })
    } catch (err) {
      console.error('Error capturing image:', err);
      this.loaderService.loadingDismiss();
    }
    console.log(this.permitImages);
    console.log(this.permitImagesBlob, "blobdata");
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

  onDelete(data: any) {
    console.log("data", data);
    let payload = {
      "imagename": data,
      "filePath": 'uploads/permits/images/'
    }
    this.moduleService.vdeleteImage(payload).subscribe((resp: any) => {
      console.log(resp.data, "deleted");
      let indexToDelete = this.permitImages.findIndex((each) => {
        console.log(each[0]);

        return each[0] === data;

      })
      if (indexToDelete !== -1) {
        // Remove the image from the array if found
        this.permitImages.splice(indexToDelete, 1);
        console.log("Image deleted from array");
      } else {
        console.log("Image not found in array");
      }
      console.log(indexToDelete);
    })
  }

  getEquipmentTypes() {
    this.moduleService.getEquipmentType().subscribe((result: any) => {
      console.log('getEquipmentType', result);
      this.equipmentList = result.data;
      console.log(this.equipmentList);
    }),
      (error) => {
        console.log(error)
      };
  }

  dateTimeValidator(form: FormGroup) {
    const startDate = form.get('startDateTime').value;
    const endDate = form.get('endDateTime').value;

    return endDate && startDate && endDate < startDate ? { invalidEndDate: true } : null;
  }

  formatDateToRequiredFormat(dateString: any): any {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Month is 0-indexed, so add 1
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  formatPermiDateToRequiredFormat(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Month is 0-indexed, so add 1
    const day = ('0' + date.getDate()).slice(-2);

    // Return in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  }


  onSubmit() {
    this.createpermit.value['created_by'] = localStorage.getItem('user_id');
    debugger
    this.loaderService.loadingPresent();
    if (this.createpermit.invalid) {
      console.log("invalid");
      this.createpermit.markAllAsTouched();
      this.loaderService.loadingDismiss();
      return;
    }
    if (this.permitImages.length == 0) {
      this.toastService.showError("Attachment is required!", 'Alert');
      this.loaderService.loadingDismiss();
      return;
    }

    // Format startDateTime and endDateTime before submitting
    const formattedPermitDate = this.formatPermiDateToRequiredFormat(this.createpermit.value.permitDate)
    const formattedStartDateTime = this.formatDateToRequiredFormat(this.createpermit.value.startDateTime);
    const formattedEndDateTime = this.formatDateToRequiredFormat(this.createpermit.value.endDateTime);

    // Update form values with the formatted datetime
    this.createpermit.patchValue({
      permitDate: formattedPermitDate,
      startDateTime: formattedStartDateTime,
      endDateTime: formattedEndDateTime,
      // attachment: 'aqswed.jpg',
      attachment: this.permitImages.toString(),
    });

    this.equipmentDetails.controls.forEach((equipmentGroup: FormGroup) => {
      equipmentGroup.patchValue({
        plateCategory: this.pc_id,
        plateSource: this.selectedPlateSource
      });
    });

    const submitData = {
      ...this.createpermit.value,
      equipmentDetails: this.equipmentDetails.value // Use current state of equipmentDetails
    };
  
    console.log("submitData",submitData);
    this.moduleService.createPermit(submitData).subscribe((res) => {
      this.loaderService.loadingDismiss();
      console.log(res);
      if (res.statusCode === 200 || res.status === 200) {
        this.toastService.showSuccess('Permit Successfully Created', 'Thank You');
        this.createpermit.reset();
        this.createpermit.setErrors(null);
        this.createpermit.updateValueAndValidity();
        this.permitImages = [];
        this.routerServices.navigate(['/permitlist'], { replaceUrl: true });
      }
    }, error => { // (**)
      console.log(error);
      this.loaderService.loadingDismiss()
      this.toastService.showError(`The unknown error has occurred: ${error}`, 'Alert');
    });

  }
}
