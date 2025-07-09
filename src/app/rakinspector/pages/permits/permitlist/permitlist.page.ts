import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ModuleService } from 'src/app/shared/services/module.service';

@Component({
  selector: 'app-permitlist',
  templateUrl: './permitlist.page.html',
  styleUrls: ['./permitlist.page.scss'],
})
export class PermitlistPage implements OnInit {

  SearchPermitsTimeout: any;
  permitsData: any[]=[];
  setLanguage: any;
  searchKeyword: string = '';
  showClearButton: boolean = false;
  pageLength: number = 0;
  isInfiniteScrollDisabled: boolean = false;
  isSearching: boolean = false;


  constructor(
    private moduleService: ModuleService,
    private loaderService: LoaderService,
    private translateService: TranslateService
  ) { 
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
  }

  ngOnInit() {
    this.permitList('');
  }

  SearchPermits(event: any) {
    console.log(event)
    const skeyword = event;
    if (skeyword.length > 0) {
      clearTimeout(this.SearchPermitsTimeout);
      this.SearchPermitsTimeout = setTimeout(() => {
        this.isSearching = true;
        this.pageLength = 0;
        this.permitsData = [];
        this.isInfiniteScrollDisabled = false;
        this.permitList(skeyword);
      }, 1000);
      this.showClearButton = true;
    } else {
      this.clearSearch();
    }
  }

  async permitList(searchword: string, event?: any) {
    if (!event) {
      await this.loaderService.loadingPresent();
    }

    let payload = {
      permit_number: searchword,
      user_id: localStorage.getItem('user_id'),
      pageLength: this.pageLength
    }

    this.moduleService.getPermitList(payload).subscribe((resp: any) => {
      console.log(resp, "permits response..");
      if (resp.statusCode == 200) {
        if (this.pageLength === 0) {
          this.permitsData = resp.data;
        } else {
          this.permitsData = [...this.permitsData, ...resp.data];
        }
        if(resp.data){
        this.isInfiniteScrollDisabled = resp.data.length === 0;
        }
      } else {
        if (this.pageLength === 0) {
          this.permitsData = [];
        }
        this.isInfiniteScrollDisabled = true;
      }

      if (event) {
        event.target.complete();
      } else {
        this.loaderService.loadingDismiss();
      }

      this.isSearching = false;
    }, error => {
      console.error(error);
      if (event) {
        event.target.complete();
      } else {
        this.loaderService.loadingDismiss();
      }
      this.isSearching = false;
    });
  }

  loadMorePermits(event: any) {
    if (!this.isInfiniteScrollDisabled && !this.isSearching) {
      this.pageLength++;
      this.permitList(this.searchKeyword, event);
    } else {
      event.target.complete();
    }
  }

  clearSearch() {
    this.searchKeyword = '';
    this.permitsData = [];
    this.showClearButton = false;
    this.pageLength = 0;
    this.isInfiniteScrollDisabled = false;
    this.permitList('');
  }

}
