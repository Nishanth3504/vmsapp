import { Component, OnInit } from '@angular/core';
import { ModuleService } from 'src/app/shared/services/module.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-viewcomplaints',
  templateUrl: './viewcomplaints.page.html',
  styleUrls: ['./viewcomplaints.page.scss'],
})
export class ViewcomplaintsPage implements OnInit {
  private readonly SEARCH_DELAY = 3000; // 3 seconds delay for search
  
  SearchComplaintsTimeout: any;
  search_keyword: string = '';
  listComplaints: any[] = [];
  setLanguage: any;
  Opacity: any = 1;
  user_type: any;
  pageLength: number = 0;  
  isInfiniteScrollDisabled: boolean = false;
  isSearching: boolean = false;
  menuAccess: any[] = [];

  constructor(
    private mService: ModuleService,
    private loaderService: LoaderService,
    private modalController: ModalController,
    private translateService: TranslateService
  ) { 
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
  }

  ngOnInit() {
    this.user_type = localStorage.getItem('user_type');
    this.getComplaints("");  // Initial load with empty search
    const menuAccessStored = localStorage.getItem('menuAccessbyUserRole');
    if (menuAccessStored) {
      this.menuAccess = JSON.parse(menuAccessStored);
    }
  }

  getComplaints(skeyword: string, event?: any) {
    skeyword = skeyword || '';  // Ensure the search keyword is not undefined or null

    let body = {
      search_keyword: skeyword,
      user_id: localStorage.getItem('user_id'),
      pageLength: this.pageLength
    };

    this.loaderService.loadingPresent();
    console.log('payload', body);
    this.mService.ListComplaints(body).subscribe(
      (res: any) => {
        this.loaderService.loadingDismiss();
        if (res.statusCode === 200) {
          if (this.pageLength === 0) {
            this.listComplaints = res.data.data;
          } else {
            this.listComplaints = [...this.listComplaints, ...res.data.data];
          }

          this.isInfiniteScrollDisabled = res.data.data.length === 0;
        } else {
          this.listComplaints = [];
        }

        if (event) {
          event.target.complete();
        }
        this.isSearching = false;
      },
      (error) => {
        this.loaderService.loadingDismiss();
        if (event) {
          event.target.complete();
        }
        this.isSearching = false;
        // Handle error (e.g., show error message)
      }
    );
  }

  SearchComplaints(event: any) {
    clearTimeout(this.SearchComplaintsTimeout);
    const searchTerm = event.target.value?.trim().toLowerCase();  

    this.SearchComplaintsTimeout = setTimeout(() => {
      this.isSearching = true;
      this.pageLength = 0;
      this.listComplaints = [];
      this.isInfiniteScrollDisabled = false;
      this.getComplaints(searchTerm);
    }, this.SEARCH_DELAY);
  }

  loadMoreComplaints(event: any) {
    if (!this.isInfiniteScrollDisabled && !this.isSearching) {
      this.pageLength++;  
      this.getComplaints(this.search_keyword, event);  
    } else {
      event.target.complete();
    }
  }

  async viewMapModal(latlong: any) {
    let destination = latlong.split(',')[0] + ',' + latlong.split(',')[1];
    window.open('geo:0,0?q=' + destination + '', '_system');
  }

  hasMenuAccess(menuCheck: string): boolean {
    const menuItem = this.menuAccess.find(item => item.menu_check === menuCheck);
    if (menuItem) {
      const roles = menuItem.role_id.split(',');
      return roles.includes(this.user_type);
    }
    return false;
  }
}