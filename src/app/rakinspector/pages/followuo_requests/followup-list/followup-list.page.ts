import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-followup-list',
  templateUrl: './followup-list.page.html',
  styleUrls: ['./followup-list.page.scss'],
})
export class FollowupListPage implements OnInit {
  followupListData: any[] =[];
  setLanguage: any;
  user_type: string;
  pageLength: number = 0;  
  isInfiniteScrollDisabled: boolean = false;
  isSearching: boolean = false;
  menuAccess:any[]=[];
  SearchReportsTimeout: any;
  filteredFollowuoList: any=[];
  search_keyword:any;
  private isReturningFromView = false;
  showFilterOptions: boolean;
  FilterData: string[] = [];
  selectedFilter: string = '';



  constructor(
    public routerServices: Router,
    private fb: FormBuilder,
    private mService: ModuleService,
    private translateService: TranslateService,
    public toastService: ToastService,
    public geolocation: Geolocation,
    private loaderService: LoaderService,
  ) { }

  ngOnInit() {

  }


  ionViewWillEnter(){
        this.user_type = localStorage.getItem('user_type');
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
    
    const menuAccessStored = localStorage.getItem('menuAccessbyUserRole');
    if (menuAccessStored) {
      this.menuAccess = JSON.parse(menuAccessStored);
    }
    this.isReturningFromView = true;
    setTimeout(() => {
      this.isReturningFromView = false;
    }, 1000);
    this.pageLength = 0;
    this.followupListData = [];
    this.isInfiniteScrollDisabled = false;
    this.followupLists('','',null);
    this.filteredFollowuoList =[];
  }

  followupLists(searchText : any,filter: any,event?: any){
    if (this.isSearching && event) {
      event.target.complete();
      return;
    }
    
    this.loaderService.loadingPresent();
    let payload = {
      reference_number:searchText,
      user_id:localStorage.getItem('user_id'),
      pageLength: this.pageLength,
      status:filter
    }
    this.mService.followUpRequestList(payload).pipe(finalize(()=>{
      this.loaderService.loadingDismiss();
    })).subscribe((resp: any)=>{
      console.log('response data', resp);
      if(resp.statusCode == 200 || resp.status == 200){
        if (this.pageLength === 0) {
          this.followupListData = resp.data;
        } else {
          this.followupListData = [...this.followupListData, ...resp.data];
        }
        this.filteredFollowuoList = [...this.followupListData]
        this.isInfiniteScrollDisabled = resp.data.length === 0;
         this.FilterData = ['All', ...resp.statusData];

      }
      else{
        if (this.pageLength === 0) {
          this.followupListData = [];
          this.filteredFollowuoList =[]

        }
        this.isInfiniteScrollDisabled = true;
        // this.toastService.showError('Error fetching in the followup list', 'Error');
      }
      if (event) {
        event.target.complete();
      }
      this.isSearching = false;

    },
    (error: any)=>{
      console.log('error', error);
      if (event) {
        event.target.complete();
      }
      this.isSearching = false;
      this.toastService.showError('Error fetching in the followup list', 'Error');
    }
  )
  }

  getStatusColor(status: any): any {
    switch (status) {

      case 'In-progress':
        return 'orange';
      case 'Accepted':
        return 'green';
      case 'Closed':
        return 'red';
      default:
        return 'inherit';
    }
  };

  toeditFollowup(id: any){
    let navigationExtras: NavigationExtras = {
      state: {
        data: id,
        type:'update_followup'
      }
    };
    this.routerServices.navigate(['/followup-request'], navigationExtras);
  };

loadMoreComplaints(event: any) {
  if (this.isReturningFromView || this.isInfiniteScrollDisabled || this.isSearching) {
    event.target.complete();
    return;
  }

  this.pageLength++;

  this.followupLists(this.search_keyword || '', this.selectedFilter || '', event);
}

  toupdateFollowup(id: any){
    let navigationExtras: NavigationExtras = {
      state: {
        data: id,
        type:'update_followup_status'
      }
    };
    this.routerServices.navigate(['/view-followup'], navigationExtras);
  };

  toviewFollowup(id: any){
    let navigationExtras: NavigationExtras = {
      state: {
        data: id,
        type:'view_followup'
      }
    };
    this.routerServices.navigate(['/view-followup'], navigationExtras);
  };

  hasMenuAccess(menuCheck: string): boolean {
    const menuItem = this.menuAccess.find(item => item.menu_check === menuCheck);
    if (menuItem) {
      const roles = menuItem.role_id.split(',');
      const userTypes = this.user_type.split(',');
      return roles.some(role => userTypes.includes(role));
    }
    return false;
  };

  SearchFollowups(event: any){
    const searchTerm = event.target.value.toLowerCase();
    // console.log("searchTerm", searchTerm);
    clearTimeout(this.SearchReportsTimeout);
    this.SearchReportsTimeout = setTimeout(() => {
      this.isSearching = true;
      this.pageLength = 0;
      this.followupListData = [];
      this.filteredFollowuoList = [];
      this.isInfiniteScrollDisabled = false;
      this.search_keyword = searchTerm;
       this.followupLists(searchTerm, this.selectedFilter || '', null);

    }, 3000);
  }

  toggleFilterOptions() {
    this.showFilterOptions = !this.showFilterOptions;
  }

onFilterSelect(filter: string) {
  this.selectedFilter = filter === 'All' ? '' : filter;
  this.showFilterOptions = false;
  this.pageLength = 0;
  this.followupListData = [];
  this.isInfiniteScrollDisabled = false;

  this.followupLists(this.search_keyword || '', this.selectedFilter, null);
}



  ngOnDestroy() {
  clearTimeout(this.SearchReportsTimeout);
}

}
