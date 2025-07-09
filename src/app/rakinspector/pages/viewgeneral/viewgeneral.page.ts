import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ModuleService } from 'src/app/shared/services/module.service';

@Component({
  selector: 'app-viewgeneral',
  templateUrl: './viewgeneral.page.html',
  styleUrls: ['./viewgeneral.page.scss'],
})
export class ViewgeneralPage implements OnInit {

  userId: any;
  complaint_type: any;
  listComplaints: any;
  originalComplaints: any;
  SearchComplaintsTimeout: any;

  constructor(
    private moduleService: ModuleService,
    private activatedRouterServices: ActivatedRoute,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('user_id');

    this.activatedRouterServices.params.subscribe((res: any) => {
      console.log("param resp",res);
      this.complaint_type = res.id;
      localStorage.setItem('complaintType', this.complaint_type);
    })
    this.getComplaints();
  }

  getComplaints(){
    this.loader.loadingPresent();
    this.moduleService.getComplaints(this.userId,this.complaint_type).subscribe((resp: any)=>{
      if(resp.statusCode == 200){
        this.loader.loadingDismiss();
        console.log(resp.data);
        this.listComplaints = resp.data;
        this.originalComplaints = [...resp.data];
      }
    })
  }

  async viewMapModal(latlong:any) {
    let destination =  latlong.split(',')[0] + ',' +  latlong.split(',')[1];
    window.open('geo:0,0?q=' + destination + '', '_system');
  }

  SearchComplaints(skeyword:string)
  {
    const searchKeyword = skeyword.toLowerCase();
    this.listComplaints = this.originalComplaints.filter(complaint => {
      const complaintReferenceNumber = complaint.reference_number.toLowerCase();
      return complaintReferenceNumber.includes(searchKeyword);

  })

  }

}
