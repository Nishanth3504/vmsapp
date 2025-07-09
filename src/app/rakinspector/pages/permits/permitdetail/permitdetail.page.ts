import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModuleService } from 'src/app/shared/services/module.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-permitdetail',
  templateUrl: './permitdetail.page.html',
  styleUrls: ['./permitdetail.page.scss'],
})
export class PermitdetailPage implements OnInit {
  permitId: any;
  permitData: any;
  permitEquipmentDetail: any;
  setLanguage: any;
  permitAttachments : any[] =[];
  imageBase = environment.permitImagePath;

  constructor(
    private moduleService: ModuleService,
    private activatedRouterServices: ActivatedRoute,
    private translateService: TranslateService
  ) { 
    this.activatedRouterServices.params.subscribe((res: any) => {
      this.permitId = res.id;
    });
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
  }

  ngOnInit() {
    this.detailPermit();
  }

  detailPermit(){
    let payload = {
      permit_id: this.permitId
    }
    this.moduleService.getPermitDetail(payload).subscribe((resp: any)=>{
      console.log(resp);
      if(resp.statusCode == 200){        
        this.permitData = resp.viewDetails;
        this.permitEquipmentDetail = resp.equipmentDetails;
        this.permitAttachments = resp.attachemtDetails  || [];
        console.log("permit data",this.permitData);
        console.log("permit equipment details", this.permitEquipmentDetail);
        console.log("permit attachments", this.permitAttachments);
      }
    })
  }

}
